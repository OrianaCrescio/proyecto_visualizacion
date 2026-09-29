# Investigación y fuentes

## Fuentes de datos

| Archivo | Fuente | Cobertura | Uso |
|---|---|---|---|
| `data/raw/País.csv`, `data/raw/Región.csv` | SIIT-BCN, con datos de matrícula MINEDUC/SIES *(verificar y citar enlace exacto)* | 1984–2025, Chile y regiones, por sexo | Vista por regiones (V1) |
| Microdatos de matrícula (un `.rar` por año, no se suben) | Centro de Estudios MINEDUC — datosabiertos.mineduc.cl | 2007–2026, un registro por estudiante | Vista por área / carrera → `data/processed/matricula_carrera.csv` |

## Variables de los microdatos que usamos

CSV con separador `;`, UTF-8, ~50 columnas. El diccionario oficial viene dentro de cada `.rar`
(`ER_Matricula_Educacion_Superior_2007_2026_PUBL_MRUN.pdf`).

| Columna | Significado | Valores |
|---|---|---|
| `cat_periodo` | Año de la matrícula | 2007 … 2026 |
| `gen_alu` | Sexo | 1 = Hombre, 2 = Mujer |
| `nivel_global` | Nivel | Pregrado, Postgrado, Postítulo |
| `tipo_inst_1` | Tipo de institución | Universidades, Institutos Profesionales, CFT |
| `area_conocimiento` | Área del conocimiento (MINEDUC) | 10 áreas, estables 2007–2026 |
| `cine_f_13_area` / `cine_f_13_subarea` | Clasificación CINE-F 2013 (UNESCO); separa TIC de Ingeniería | 10 áreas |
| `area_carrera_generica` | Carrera genérica (ej. "Ingeniería Civil Informática") | cientos de valores |

**Validación:** los totales por sexo de los microdatos calzan con `Región.csv` (ej. 2015: 592.698 hombres
y 640.345 mujeres en ambas fuentes).

**Ojo:** "Tecnología" en `area_conocimiento` mezcla ingenierías y carreras técnicas; para un ángulo STEM
más fino conviene `cine_f_13_area` ("TIC" vs. "Ingeniería, Industria y Construcción").

## Primeras observaciones de los datos

**Nacional:** las mujeres pasan de 42,7 % de la matrícula en 1984 a 53,3 % en 2025; cruzan la paridad
en 2008 (50,01 %). Todas las regiones están hoy sobre el 50 %.

**Por área (pregrado, % de mujeres):**

| Área | 2007 | 2016 | 2026 |
|---|---|---|---|
| Salud | 71,3 | 76,0 | 74,5 |
| Educación | 68,4 | 73,1 | 75,2 |
| Ciencias Sociales | 65,2 | 67,5 | 70,7 |
| Humanidades | 61,1 | 62,1 | 66,2 |
| Arte y Arquitectura | 47,1 | 53,4 | 64,5 |
| Agropecuaria | 44,9 | 50,4 | 64,0 |
| Derecho | 53,5 | 53,3 | 58,7 |
| Administración y Comercio | 50,4 | 54,9 | 55,5 |
| Ciencias Básicas | 49,1 | 44,5 | 43,2 |
| **Tecnología** | **17,7** | **21,6** | **21,1** |

Esto respalda el mensaje del proyecto: la paridad nacional (y regional) esconde una segregación por
área que casi no se mueve — Tecnología gana ~3 puntos en 20 años y Ciencias Básicas incluso retrocede.
La vista por regiones (V1) muestra la primera mitad de la historia; la segunda está en estos datos.

## Referencias de diseño / sonificación

- Cleveland & McGill (1984): posición en escala común es el canal más preciso para comparar valores.
- Shneiderman (1996): overview first, zoom and filter, details on demand.
- Hermann, Hunt & Neuhoff (2011), *The Sonification Handbook*: parameter mapping (dato → altura).
