"""
Resume data/processed/matricula_carrera.csv a un archivo liviano para la vista de carreras.

Solo pregrado. Una fila por año × área del conocimiento × carrera genérica, con hombres y
mujeres en columnas.

Salida: data/processed/carreras_pregrado.csv

Uso (desde la raíz del repo):
    python3 scripts/resumir_carreras.py
"""
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "data" / "processed" / "matricula_carrera.csv"
SALIDA = RAIZ / "data" / "processed" / "carreras_pregrado.csv"

df = pd.read_csv(ENTRADA)
df = df[(df["nivel_global"] == "Pregrado") & df["sexo"].isin(["Hombre", "Mujer"])]

resumen = (
    df.pivot_table(index=["anio", "area_conocimiento", "area_carrera_generica"],
                   columns="sexo", values="n", aggfunc="sum", fill_value=0)
    .reset_index()
    .rename(columns={"area_conocimiento": "area", "area_carrera_generica": "carrera",
                     "Hombre": "hombres", "Mujer": "mujeres"})
)
resumen.columns.name = None
resumen = resumen[["anio", "area", "carrera", "hombres", "mujeres"]]
resumen.to_csv(SALIDA, index=False)
print(f"Listo: {SALIDA.relative_to(RAIZ)} · {len(resumen):,} filas")
