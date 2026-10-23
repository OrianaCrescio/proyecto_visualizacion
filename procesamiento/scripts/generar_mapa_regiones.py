"""
Genera el mapa de las 16 regiones de Chile para la página a partir de los GeoJSON por
comuna (repositorio "geo" de BCN, en procesamiento/originales/geo-chile/, que NO se sube: pesa ~200 MB).

- Une (dissolve) las comunas de cada región en un solo polígono.
- Crea la Región de Ñuble (2018) a partir de la provincia de Ñuble del Biobío.
- Deja fuera Isla de Pascua y Juan Fernández (sin datos propios, alargan el mapa).
- Descarta islotes pequeños y simplifica los bordes para que el archivo sea liviano.
- El nombre de cada región es idéntico al de matricula_genero_region.csv, para cruzarlos.

Salida: pagina/data/regiones.geojson

Requiere: pip install shapely
Uso (desde la raíz del repo):
    python3 procesamiento/scripts/generar_mapa_regiones.py
"""
import json
from pathlib import Path

from shapely.geometry import MultiPolygon, Polygon, mapping, shape
from shapely.ops import unary_union

RAIZ = Path(__file__).resolve().parents[2]          # raíz del repo
PROC = RAIZ / "procesamiento"
GEO = PROC / "originales" / "geo-chile" / "geo-master"
SALIDA = RAIZ / "pagina" / "data" / "regiones.geojson"

TOLERANCIA = 0.02      # grados (~2 km): suficiente para un mapa de todo Chile
AREA_MINIMA = 0.03     # grados² (~250 km²): se descartan islas más chicas
DECIMALES = 3

# carpeta del repositorio geo → nombre usado en nuestros datos
CARPETAS = {
    "region_de_arica_y_parinacota": "Región De Arica Y Parinacota",
    "region_de_tarapaca": "Región De Tarapacá",
    "region_de_antofagasta": "Región De Antofagasta",
    "region_de_atacama": "Región De Atacama",
    "region_de_coquimbo": "Región De Coquimbo",
    "region_de_valparaiso": "Región De Valparaíso",
    "region_metropolitana_de_santiago": "Región Metropolitana De Santiago",
    "region_del_libertador_bernardo_o'higgins": "Región Del Libertador Gral. Bernardo O'higgins",
    "region_del_maule": "Región Del Maule",
    "region_del_bio-bio": "Región Del Biobío",
    "region_de_la_araucania": "Región De La Araucanía",
    "region_de_los_rios": "Región De Los Ríos",
    "region_de_los_lagos": "Región De Los Lagos",
    "region_de_aysen_del_gral.ibanez_del_campo": "Región De Aysén Del Gral. Carlos Ibáñez Del Campo",
    "region_de_magallanes_y_antartica_chilena": "Región De Magallanes Y De La Antártica Chilena",
}
NUBLE = "Región de Ñuble"
EXCLUIR_COMUNAS = {"Isla de Pascua", "Juan Fernández"}


def redondear(coords):
    if isinstance(coords[0], (int, float)):
        return [round(c, DECIMALES) for c in coords]
    return [redondear(c) for c in coords]


def main():
    grupos = {}
    for carpeta, nombre in CARPETAS.items():
        datos = json.loads((GEO / carpeta / "all.geojson").read_text(encoding="utf-8"))
        for f in datos["features"]:
            props = f.get("properties") or {}
            if not f.get("geometry") or props.get("NOM_COM") in EXCLUIR_COMUNAS:
                continue
            region = NUBLE if props.get("NOM_PROV") == "Ñuble" else nombre
            grupos.setdefault(region, []).append(shape(f["geometry"]).buffer(0))

    features = []
    for region, geoms in grupos.items():
        union = unary_union(geoms)
        # sin agujeros: al unir comunas quedan rendijas internas que solo agregan peso
        partes = list(union.geoms) if isinstance(union, MultiPolygon) else [union]
        union = MultiPolygon([Polygon(p.exterior) for p in partes])
        if len(union.geoms) == 1:
            union = union.geoms[0]
        if isinstance(union, MultiPolygon):   # sacar islotes (fiordos de Aysén y Magallanes)
            partes = [p for p in union.geoms if p.area >= AREA_MINIMA]
            union = MultiPolygon(partes) if len(partes) > 1 else partes[0]
        union = union.simplify(TOLERANCIA, preserve_topology=True)
        geom = mapping(union)
        features.append({
            "type": "Feature",
            "properties": {"region": region},
            "geometry": {"type": geom["type"], "coordinates": redondear(geom["coordinates"])},
        })
        print(f"{region}: {len(geoms)} comunas")

    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(json.dumps({"type": "FeatureCollection", "features": features},
                                 ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Listo: {SALIDA.relative_to(RAIZ)} · {len(features)} regiones · "
          f"{SALIDA.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
