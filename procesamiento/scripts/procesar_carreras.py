"""
Agrega los microdatos de matrícula por estudiante (MINEDUC) a conteos por área
y carrera genérica, separados por sexo.

Entrada : el .zip "sin descomprimir.zip" (trae un .rar por año), o una carpeta con
          .rar / .csv por año. Los datos originales NO se suben al repo (~500 MB por año).
Salida  : data/processed/matricula_carrera.csv
          anio × nivel_global × tipo_inst_1 × area_conocimiento × cine_f_13_area ×
          cine_f_13_subarea × area_carrera_generica × sexo → n (matriculados)

Requiere: pip install pandas unrar-cffi

Uso:
    python3 scripts/procesar_carreras.py RUTA [AÑO ...]
    python3 scripts/procesar_carreras.py "../InfoVis/Carrera/sin descomprimir.zip"
    python3 scripts/procesar_carreras.py "../InfoVis/Carrera/sin descomprimir.zip" 2007 2008
Si se indican años, solo se reprocesan esos y se conservan los demás en la salida.
"""
import io
import re
import sys
import tempfile
import zipfile
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "data" / "processed" / "matricula_carrera.csv"

COLUMNAS = {
    "cat_periodo": "anio",
    "gen_alu": "sexo",
    "nivel_global": "nivel_global",
    "tipo_inst_1": "tipo_inst_1",
    "area_conocimiento": "area_conocimiento",
    "cine_f_13_area": "cine_f_13_area",
    "cine_f_13_subarea": "cine_f_13_subarea",
    "area_carrera_generica": "area_carrera_generica",
}
AGRUPAR = list(COLUMNAS.values())
SEXO = {1: "Hombre", 2: "Mujer", 3: "No binario"}  # gen_alu (ver diccionario MINEDUC)


def anio_de(nombre: str) -> str | None:
    m = re.search(r"(20\d\d)", nombre)
    return m.group(1) if m else None


def fuentes(ruta: Path):
    """Entrega (año, bytes del CSV) para cada año encontrado en la ruta."""
    from unrar.cffi import rarfile  # pip install unrar-cffi

    def desde_rar(bytes_rar: bytes):
        with tempfile.NamedTemporaryFile(suffix=".rar") as tmp:
            tmp.write(bytes_rar)
            tmp.flush()
            rf = rarfile.RarFile(tmp.name)
            csv = [n for n in rf.namelist() if n.lower().endswith(".csv")][0]
            return rf.read(csv)

    if ruta.suffix == ".zip":
        z = zipfile.ZipFile(ruta)
        for n in sorted(z.namelist()):
            if n.startswith("__MACOSX") or not n.lower().endswith(".rar"):
                continue
            yield anio_de(n), (lambda n=n: desde_rar(z.read(n)))
    else:
        for p in sorted(ruta.iterdir()):
            if p.suffix == ".rar":
                yield anio_de(p.name), (lambda p=p: desde_rar(p.read_bytes()))
            elif p.suffix == ".csv":
                yield anio_de(p.name), (lambda p=p: p.read_bytes())


def agregar(csv_bytes: bytes) -> pd.DataFrame:
    partes = []
    for chunk in pd.read_csv(io.BytesIO(csv_bytes), sep=";", usecols=list(COLUMNAS),
                             chunksize=300_000, low_memory=False, encoding="utf-8"):
        chunk = chunk.rename(columns=COLUMNAS)
        chunk["sexo"] = pd.to_numeric(chunk["sexo"], errors="coerce").map(SEXO)
        chunk = chunk.fillna("Sin información")
        partes.append(chunk.groupby(AGRUPAR).size().rename("n"))
    return pd.concat(partes).groupby(level=list(range(len(AGRUPAR)))).sum().reset_index()


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    ruta = Path(sys.argv[1]).expanduser()
    anios = set(sys.argv[2:])

    tablas = []
    for anio, leer in fuentes(ruta):
        if anios and anio not in anios:
            continue
        print(f"Procesando {anio}…", flush=True)
        tablas.append(agregar(leer()))
    if not tablas:
        sys.exit("No se encontró ningún año para procesar.")
    nuevo = pd.concat(tablas)

    if SALIDA.exists():
        previo = pd.read_csv(SALIDA)
        previo = previo[~previo["anio"].isin(nuevo["anio"].unique())]
        nuevo = pd.concat([previo, nuevo])

    nuevo = nuevo.sort_values(AGRUPAR).reset_index(drop=True)
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    nuevo.to_csv(SALIDA, index=False)
    print(f"Listo: {SALIDA.relative_to(RAIZ)} · {len(nuevo):,} filas · "
          f"años {sorted(nuevo['anio'].unique().tolist())}")


if __name__ == "__main__":
    main()
