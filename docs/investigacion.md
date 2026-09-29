# Investigación y fuentes

## Fuentes de datos

| Archivo | Fuente | Cobertura | Uso |
|---|---|---|---|
| `procesamiento/originales/País.csv`, `Región.csv` | Biblioteca del Congreso Nacional (BCN), SIIT — Estadísticas territoriales, tema Educación superior: [bcn.cl/siit/estadisticasterritoriales/tema?id=76](https://www.bcn.cl/siit/estadisticasterritoriales/tema?id=76) | 1984–2025, Chile y regiones, por sexo | Nivel país: fila "Chile" del gráfico y nota del sonido cada año · Nivel región: gráfico de puntos y mapa |
| `procesamiento/originales/geo-chile/` (no se sube) → `pagina/data/regiones.geojson` | BCN, mapas vectoriales (siit2.bcn.cl/mapas_vectoriales), vía repositorio "geo" en GitHub | Comunas de Chile (división pre-2018); Ñuble se arma con la provincia de Ñuble | Mapa de regiones |
| Microdatos de matrícula (un `.rar` por año, no se suben) | Centro de Estudios MINEDUC, Base de Datos de Matrícula en Educación Superior: [datosabiertos.mineduc.cl/matricula-en-educacion-superior](https://datosabiertos.mineduc.cl/matricula-en-educacion-superior/) · también en [datos.gob.cl](https://datos.gob.cl/dataset/matricula-en-educacion-superior) | 2007–2026, un registro por estudiante | Vista por área / carrera → `procesamiento/intermedios/matricula_carrera.csv` |

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

## Primeras observaciones de los datos

**Nacional:** las mujeres pasan de 42,7 % de la matrícula en 1984 a 53,3 % en 2025; cruzan la paridad
en 2008 (50,01 %). Todas las regiones están hoy sobre el 50 %.

**Por área (pregrado, % de mujeres, 2007–2026):** columnas ordenadas de menos a más mujeres en 2026.
Tablas completas en CSV en `docs/tablas/`; se regeneran con `procesamiento/scripts/tablas_investigacion.py`.

*Clasificación MINEDUC (`area_conocimiento`, la que usa hoy la vista de carreras):*

| Año | Tecnología | C. Básicas | Adm. y Com. | Derecho | Agrop. | Arte y Arq. | Human. | C. Sociales | Salud | Educación |
|---|---|---|---|---|---|---|---|---|---|---|
| 2007 | 17,7 | 49,1 | 50,4 | 53,5 | 44,9 | 47,1 | 61,1 | 65,2 | 71,3 | 68,4 |
| 2008 | 18,7 | 49,7 | 51,4 | 52,7 | 45,4 | 48,2 | 61,1 | 65,2 | 72,0 | 67,8 |
| 2009 | 19,6 | 49,5 | 52,8 | 52,9 | 45,8 | 49,0 | 62,0 | 65,5 | 72,8 | 68,2 |
| 2010 | 19,7 | 48,3 | 53,1 | 52,1 | 45,9 | 49,3 | 61,6 | 65,6 | 73,4 | 68,5 |
| 2011 | 20,1 | 47,3 | 53,3 | 52,0 | 46,8 | 50,0 | 62,0 | 65,8 | 73,9 | 68,9 |
| 2012 | 21,1 | 45,8 | 53,8 | 52,3 | 47,1 | 50,9 | 61,2 | 66,1 | 74,5 | 69,6 |
| 2013 | 23,2 | 44,3 | 53,9 | 51,6 | 47,0 | 51,4 | 61,0 | 66,4 | 74,5 | 70,1 |
| 2014 | 23,1 | 44,8 | 54,6 | 52,0 | 49,2 | 52,3 | 61,5 | 66,8 | 75,4 | 71,3 |
| 2015 | 22,6 | 44,8 | 54,7 | 52,7 | 50,1 | 53,0 | 61,2 | 66,7 | 75,9 | 71,7 |
| 2016 | 21,6 | 44,5 | 54,9 | 53,3 | 50,4 | 53,4 | 62,1 | 67,5 | 76,0 | 73,1 |
| 2017 | 20,7 | 44,5 | 54,9 | 54,4 | 50,9 | 54,5 | 61,6 | 68,0 | 75,8 | 74,5 |
| 2018 | 19,9 | 44,9 | 55,0 | 54,6 | 52,0 | 55,3 | 61,0 | 67,9 | 75,8 | 75,5 |
| 2019 | 19,1 | 44,6 | 54,8 | 55,0 | 53,2 | 56,4 | 60,8 | 68,1 | 75,7 | 75,7 |
| 2020 | 19,0 | 44,2 | 55,0 | 55,7 | 55,3 | 58,1 | 61,8 | 68,6 | 75,6 | 75,7 |
| 2021 | 19,4 | 44,7 | 55,4 | 56,6 | 57,8 | 59,7 | 62,1 | 69,6 | 75,9 | 75,7 |
| 2022 | 19,2 | 43,9 | 54,9 | 57,0 | 59,1 | 61,0 | 63,8 | 69,9 | 75,7 | 75,4 |
| 2023 | 19,1 | 43,9 | 54,7 | 57,2 | 60,7 | 61,7 | 64,2 | 70,0 | 75,3 | 75,1 |
| 2024 | 19,5 | 43,2 | 54,6 | 57,3 | 61,7 | 62,4 | 64,9 | 70,3 | 74,8 | 75,0 |
| 2025 | 20,2 | 43,0 | 54,9 | 57,8 | 63,1 | 63,2 | 65,7 | 70,6 | 74,5 | 75,2 |
| 2026 | 21,1 | 43,2 | 55,5 | 58,7 | 64,0 | 64,5 | 66,2 | 70,7 | 74,5 | 75,2 |

*Clasificación internacional CINE-F 2013 (`cine_f_13_area`):*

| Año | TIC | Ingeniería | C. Nat. y Mat. | Servicios | Adm. y Derecho | Artes y Hum. | Agric. y Vet. | C. Sociales y Period. | Salud | Educación |
|---|---|---|---|---|---|---|---|---|---|---|
| 2007 | 13,4 | 19,5 | 49,0 | 42,7 | 51,3 | 50,2 | 44,9 | 62,3 | 72,9 | 70,7 |
| 2008 | 13,8 | 19,7 | 49,4 | 43,6 | 51,5 | 50,9 | 45,4 | 62,0 | 73,3 | 70,3 |
| 2009 | 13,6 | 19,8 | 49,5 | 44,1 | 52,5 | 51,4 | 45,8 | 62,0 | 74,0 | 71,0 |
| 2010 | 13,1 | 19,3 | 48,3 | 43,9 | 52,5 | 51,2 | 45,9 | 61,5 | 74,4 | 71,6 |
| 2011 | 12,1 | 18,8 | 47,3 | 43,8 | 52,7 | 51,7 | 46,8 | 61,6 | 74,8 | 72,4 |
| 2012 | 11,6 | 18,6 | 46,0 | 44,6 | 53,1 | 51,9 | 47,1 | 61,7 | 75,3 | 73,4 |
| 2013 | 12,7 | 19,5 | 44,5 | 45,5 | 53,1 | 51,6 | 47,0 | 61,8 | 75,2 | 74,2 |
| 2014 | 10,9 | 18,8 | 44,9 | 46,6 | 53,8 | 52,0 | 49,2 | 62,1 | 76,1 | 75,6 |
| 2015 | 10,6 | 19,0 | 44,8 | 46,7 | 54,1 | 51,8 | 50,0 | 62,1 | 76,4 | 76,4 |
| 2016 | 10,4 | 19,1 | 44,5 | 46,9 | 54,7 | 51,7 | 50,4 | 62,6 | 76,6 | 78,0 |
| 2017 | 10,4 | 19,4 | 44,5 | 47,9 | 55,1 | 52,0 | 50,9 | 62,6 | 76,5 | 79,7 |
| 2018 | 10,4 | 19,7 | 45,0 | 48,9 | 55,1 | 52,1 | 52,0 | 62,6 | 76,5 | 80,9 |
| 2019 | 10,7 | 19,9 | 44,9 | 49,3 | 55,4 | 52,3 | 53,2 | 63,0 | 76,5 | 81,2 |
| 2020 | 11,2 | 20,6 | 44,5 | 50,8 | 55,8 | 53,4 | 55,3 | 63,4 | 76,5 | 81,0 |
| 2021 | 11,6 | 21,3 | 45,1 | 52,1 | 56,2 | 54,6 | 57,8 | 64,1 | 76,9 | 80,8 |
| 2022 | 12,0 | 21,1 | 44,3 | 52,6 | 55,9 | 55,4 | 59,1 | 64,9 | 76,8 | 80,9 |
| 2023 | 12,5 | 21,0 | 44,6 | 52,9 | 55,8 | 56,2 | 60,7 | 65,5 | 76,5 | 80,9 |
| 2024 | 13,6 | 21,2 | 44,1 | 52,9 | 55,9 | 57,6 | 61,7 | 66,4 | 76,1 | 81,2 |
| 2025 | 14,4 | 21,7 | 43,8 | 53,3 | 56,3 | 58,6 | 63,2 | 67,3 | 75,8 | 81,6 |
| 2026 | 15,1 | 22,4 | 44,1 | 54,9 | 56,8 | 59,4 | 64,1 | 67,9 | 75,7 | 81,6 |

**Lo que muestran las tablas:**
- La paridad nacional (y regional) esconde una segregación por área que casi no se mueve.
- Tecnología (MINEDUC) no avanza en línea recta: sube de 17,7 % (2007) a 23,2 % (2013), baja a 19 %
  (2019–2023) y vuelve a 21,1 % en 2026. Ciencias Básicas incluso retrocede (49,1 % → 43,2 %).
- Las áreas que más se feminizan son Agropecuaria (+19 puntos) y Arte y Arquitectura (+17).
- La vista por regiones muestra la primera mitad de la historia; la segunda está en estos datos.

## Decisión pendiente: ¿qué clasificación de áreas usar?

"Tecnología" en `area_conocimiento` (MINEDUC) mezcla carreras distintas. Al separarla con CINE-F 2013,
en 2026 queda así (pregrado):

| Dentro de "Tecnología" (MINEDUC) | Matriculados 2026 | % mujeres 2007 | % mujeres 2026 |
|---|---|---|---|
| Ingeniería, Industria y Construcción | 289.940 | 17,1 | 20,3 |
| TIC (informática, computación) | 81.943 | 13,4 | 15,1 |
| Servicios (ej. prevención de riesgos) | 20.301 | 32,7 | 53,0 |

O sea: con la clasificación MINEDUC, el grupo con menos mujeres (TIC, 15 %) queda escondido dentro de
un promedio de 21 %, y algunas carreras de Servicios que ya llegaron a la paridad lo suben.

| Opción | A favor | En contra |
|---|---|---|
| **Mantener MINEDUC** (`area_conocimiento`) | Nombres conocidos para estudiantes de enseñanza media; es la clasificación oficial en Chile | "Tecnología" diluye la brecha más fuerte (TIC) |
| **Cambiar a CINE-F 2013** | Separa TIC de Ingeniería (el ángulo STEM más fino); estándar internacional, comparable con otros países | Nombres más largos y menos familiares ("Servicios", "Ciencias naturales, matemáticas y estadística") |
| **Mixto**: MINEDUC en la vista general y CINE al abrir "Tecnología" | Mantiene lo familiar y muestra el detalle donde importa | Dos clasificaciones en la misma página: hay que explicarlo bien |

*Decisión del grupo:* _pendiente — anotar aquí la opción elegida y por qué (sirve como rationale en
`entrega.md`)._

## Referencias de diseño / sonificación

- Cleveland & McGill (1984): posición en escala común es el canal más preciso para comparar valores.
- Shneiderman (1996): overview first, zoom and filter, details on demand.
- Hermann, Hunt & Neuhoff (2011), *The Sonification Handbook*: parameter mapping (dato → altura).
