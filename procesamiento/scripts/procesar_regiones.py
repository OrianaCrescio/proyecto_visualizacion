"""
Procesa la matrícula por región (serie 1984–2025) para la vista por regiones.

Entrada : data/raw/Región.csv  (formato ancho: Unidad territorial | Variable | 1984 … 2025)
Salida  : data/processed/matricula_genero_region.csv
          anio × region → hombres, mujeres, no_binario, total, prop_mujeres, diferencia_paridad

Uso (desde la raíz del repo):
    python3 scripts/procesar_regiones.py
"""
from pathlib import Path
import pandas as pd


# ============================================================
# CONFIGURACIÓN
# ============================================================

INPUT_FILE = Path("data/raw/Región.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_FILE = OUTPUT_DIR / "matricula_genero_region.csv"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 1. CARGAR DATOS
# ============================================================

print(f"Leyendo {INPUT_FILE}...")

df = pd.read_csv(INPUT_FILE)

# Eliminar espacios al inicio y al final de los nombres de columnas
df.columns = df.columns.str.strip()

print(f"Filas originales: {len(df)}")
print(f"Columnas originales: {len(df.columns)}")


# ============================================================
# 2. IDENTIFICAR COLUMNAS
# ============================================================

# Las primeras columnas contienen la información territorial
# y el tipo de variable. Las columnas cuyo nombre es un año
# contienen los valores de matrícula.

columnas_anios = [
    columna
    for columna in df.columns
    if str(columna).isdigit()
]

if not columnas_anios:
    raise ValueError(
        "No se encontraron columnas correspondientes a años."
    )

print(
    f"Años encontrados: "
    f"{columnas_anios[0]} - {columnas_anios[-1]}"
)


# ============================================================
# 3. IDENTIFICAR COLUMNAS DE REGIÓN Y VARIABLE
# ============================================================

# En el archivo estas son las dos columnas descriptivas
# anteriores a las columnas de años.
#
# Usamos las posiciones para evitar problemas si los nombres
# tienen tildes, espacios u otros caracteres.

columna_region = df.columns[0]
columna_variable = df.columns[1]

print(f"Columna territorial: {columna_region}")
print(f"Columna variable: {columna_variable}")


# ============================================================
# 4. PASAR DE FORMATO ANCHO A FORMATO LARGO
# ============================================================

# Original:
#
# Región | Variable          | 1984 | 1985 | ... | 2025
# Chile  | Matrícula Hombre  | ...  | ...  | ... | ...
#
#
# Resultado:
#
# Región | Variable          | Año  | Valor
# Chile  | Matrícula Hombre  | 1984 | ...
# Chile  | Matrícula Hombre  | 1985 | ...
# ...

df_largo = df.melt(
    id_vars=[
        columna_region,
        columna_variable
    ],
    value_vars=columnas_anios,
    var_name="anio",
    value_name="valor"
)

df_largo = df_largo.rename(
    columns={
        columna_region: "region",
        columna_variable: "variable"
    }
)

df_largo["anio"] = df_largo["anio"].astype(int)


# ============================================================
# 5. LIMPIAR LOS VALORES
# ============================================================

# Por seguridad convertimos la matrícula a número.
# Si existiera algún valor no numérico, pasa a NaN.

df_largo["valor"] = pd.to_numeric(
    df_largo["valor"],
    errors="coerce"
)


# ============================================================
# 6. TRANSFORMAR LOS TIPOS DE MATRÍCULA EN COLUMNAS
# ============================================================

# Queremos pasar de:
#
# Chile | 1984 | Matrícula Hombre | 108467
# Chile | 1984 | Matrícula Mujer  | 80684
#
# a:
#
# Chile | 1984 | 108467 | 80684 | ...

df_procesado = (
    df_largo
    .pivot_table(
        index=["anio", "region"],
        columns="variable",
        values="valor",
        aggfunc="sum"
    )
    .reset_index()
)

# El nombre "variable" ya no es necesario
df_procesado.columns.name = None


# ============================================================
# 7. RENOMBRAR COLUMNAS
# ============================================================

# Buscamos las columnas según las palabras que contienen.
# Esto hace el script un poco más tolerante a diferencias
# menores en los nombres originales.

def buscar_columna(palabras):
    for columna in df_procesado.columns:
        texto = str(columna).lower()

        if all(
            palabra.lower() in texto
            for palabra in palabras
        ):
            return columna

    return None


col_hombres = buscar_columna(["hombre"])
col_mujeres = buscar_columna(["mujer"])
col_no_binario = buscar_columna(["no", "bin"])
col_total = buscar_columna(["total"])


print()
print("Columnas detectadas:")
print(f"Hombres: {col_hombres}")
print(f"Mujeres: {col_mujeres}")
print(f"No binario: {col_no_binario}")
print(f"Total: {col_total}")


if col_hombres is None or col_mujeres is None:
    raise ValueError(
        "No se pudieron identificar las columnas "
        "de matrícula de hombres y mujeres."
    )


renombres = {
    col_hombres: "hombres",
    col_mujeres: "mujeres"
}

if col_no_binario is not None:
    renombres[col_no_binario] = "no_binario"

if col_total is not None:
    renombres[col_total] = "total"


df_procesado = df_procesado.rename(
    columns=renombres
)


# ============================================================
# 8. COMPLETAR VARIABLES OPCIONALES
# ============================================================

# En años antiguos puede que no exista información
# de matrícula no binaria.

if "no_binario" not in df_procesado.columns:
    df_procesado["no_binario"] = 0

df_procesado["no_binario"] = (
    df_procesado["no_binario"]
    .fillna(0)
)


# Si el archivo no incluyera matrícula total,
# podemos calcularla.

if "total" not in df_procesado.columns:
    df_procesado["total"] = (
        df_procesado["hombres"]
        + df_procesado["mujeres"]
        + df_procesado["no_binario"]
    )


# ============================================================
# 9. CALCULAR PROPORCIÓN DE MUJERES
# ============================================================

df_procesado["prop_mujeres"] = (
    df_procesado["mujeres"]
    / df_procesado["total"]
)


# ============================================================
# 10. CALCULAR DISTANCIA RESPECTO A LA PARIDAD
# ============================================================

# Ejemplos:
#
# prop_mujeres = 0.45 -> diferencia = -0.05
# prop_mujeres = 0.50 -> diferencia =  0.00
# prop_mujeres = 0.55 -> diferencia = +0.05

df_procesado["diferencia_paridad"] = (
    df_procesado["prop_mujeres"] - 0.5
)


# ============================================================
# 11. ORDENAR
# ============================================================

df_procesado = df_procesado.sort_values(
    by=["anio", "region"]
).reset_index(drop=True)


# ============================================================
# 12. SELECCIONAR COLUMNAS FINALES
# ============================================================

columnas_finales = [
    "anio",
    "region",
    "hombres",
    "mujeres",
    "no_binario",
    "total",
    "prop_mujeres",
    "diferencia_paridad"
]

df_procesado = df_procesado[columnas_finales]


# ============================================================
# 13. GUARDAR CSV
# ============================================================

df_procesado.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8"
)


# ============================================================
# 14. RESUMEN
# ============================================================

print()
print("==========================================")
print("PROCESAMIENTO TERMINADO")
print("==========================================")

print(f"Archivo creado: {OUTPUT_FILE}")
print(f"Filas: {len(df_procesado)}")
print(
    f"Años: {df_procesado['anio'].min()} - "
    f"{df_procesado['anio'].max()}"
)
print(
    f"Territorios: "
    f"{df_procesado['region'].nunique()}"
)

print()
print("Primeras filas:")
print(df_procesado.head(10))