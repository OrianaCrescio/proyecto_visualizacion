"""
Tablas de % de mujeres en pregrado por año (2007–2026) y área, para docs/investigacion.md.

Salida:
    docs/tablas/pct_mujeres_area_conocimiento.csv   (10 áreas MINEDUC)
    docs/tablas/pct_mujeres_cine.csv                (10 áreas CINE-F 2013)
    + imprime las tablas en Markdown para pegarlas en docs/investigacion.md

Uso (desde la raíz del repo):
    python3 procesamiento/scripts/tablas_investigacion.py
"""
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[2]
ENTRADA = RAIZ / "procesamiento" / "intermedios" / "matricula_carrera.csv"
SALIDA = RAIZ / "docs" / "tablas"

CORTOS = {
    # area_conocimiento (MINEDUC)
    "Administración y Comercio": "Adm. y Com.", "Agropecuaria": "Agrop.",
    "Arte y Arquitectura": "Arte y Arq.", "Ciencias Básicas": "C. Básicas",
    "Ciencias Sociales": "C. Sociales", "Derecho": "Derecho", "Educación": "Educación",
    "Humanidades": "Human.", "Salud": "Salud", "Tecnología": "Tecnología",
    # CINE-F 2013
    "Administración de Empresas y Derecho": "Adm. y Derecho",
    "Agricultura, Silvicultura, Pesca y Veterinaria": "Agric. y Vet.",
    "Artes y Humanidades": "Artes y Hum.",
    "Ciencias Sociales, Periodismo e Información": "C. Sociales y Period.",
    "Ciencias naturales, matemáticas y estadística": "C. Nat. y Mat.",
    "Ingeniería, Industria y Construcción": "Ingeniería",
    "Salud y Bienestar": "Salud", "Servicios": "Servicios",
    "Tecnología de la Información y la Comunicación (TIC)": "TIC",
}

d = pd.read_csv(ENTRADA)
d = d[(d["nivel_global"] == "Pregrado") & d["sexo"].isin(["Hombre", "Mujer"])]


def tabla(columna):
    p = d.pivot_table(index=["anio", columna], columns="sexo", values="n", aggfunc="sum").fillna(0)
    pct = (p["Mujer"] / (p["Mujer"] + p["Hombre"]) * 100).unstack(columna).round(1)
    # columnas ordenadas de menos a más mujeres en el último año
    return pct[pct.iloc[-1].sort_values().index]


def markdown(pct):
    cols = [CORTOS.get(c, c) for c in pct.columns]
    filas = ["| Año | " + " | ".join(cols) + " |", "|---" * (len(cols) + 1) + "|"]
    for anio, fila in pct.iterrows():
        filas.append(f"| {anio} | " + " | ".join(f"{v:.1f}".replace(".", ",") for v in fila) + " |")
    return "\n".join(filas)


SALIDA.mkdir(parents=True, exist_ok=True)
for columna, nombre in [("area_conocimiento", "pct_mujeres_area_conocimiento.csv"),
                        ("cine_f_13_area", "pct_mujeres_cine.csv")]:
    pct = tabla(columna)
    pct.to_csv(SALIDA / nombre)
    print(f"\n### {columna}\n")
    print(markdown(pct))
