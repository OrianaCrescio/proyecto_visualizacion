# Proyecto Visualizacion

Proyecto grupal IIC2026 — Visualización de Información · Entrega 1: visualización interactiva y sonora.
Integrantes: Antonia Ramos · Oriana Crescio · Florencia Godoy

**Acceso:**
Para acceder a la visualización en la web: https://orianacrescio.github.io/proyecto_visualizacion/

**Documento de entrega:** [`docs/entrega.md`](docs/entrega.md)

**Tema:**
Matrícula en Educación Superior en Chile por sexo, carrera y área del conocimiento (2007-2026)

**Descripción del dataset:**
Microdatos anonimizados (un registro por estudiante matriculado por año) de la matrícula en educación superior en Chile, serie 2007-2026. Incluye sexo, carrera, área del conocimiento (y clasificación internacional CINE-13), institución, tipo de institución, región, nivel (pregrado/posgrado) y modalidad.
Entre 0,8 y 1,5 millones de registros por año. Fuente: Centro de Estudios MINEDUC, publicado en datosabiertos.mineduc.cl.
Se complementa con la serie de matrícula por sexo y región 1984–2025.

**Idea de la historia que desean presentar:**
Queremos mostrar no solo que las mujeres ya son mayoría en la matrícula de educación superior en Chile, sino que esa "igualdad" en el número total esconde una fuerte segregación por área: mientras la salud y la educación se feminizan cada año más, la tecnología y las ingenierías siguen dominadas por hombres, con una brecha que apenas se mueve desde 2007. Buscamos comunicar esto a estudiantes de enseñanza media en proceso de elegir carrera, y a quienes diseñan políticas de fomento a mujeres en STEM.

## Estructura

```
index.html, css/, js/            visualización (raíz de GitHub Pages)
  js/main.js                     gráfico, slider/play y tooltip (D3)
  js/sonido.js                   sonificación (Web Audio API)
data/raw/                        País.csv y Región.csv (serie 1984–2025)
data/processed/
  matricula_genero_region.csv    % de mujeres por región y año → la usa la viz
  matricula_carrera.csv          microdatos 2007–2026 agregados por área/carrera y sexo
scripts/
  procesar_regiones.py           data/raw/Región.csv → matricula_genero_region.csv
  procesar_carreras.py           .rar del MINEDUC → matricula_carrera.csv
docs/
  entrega.md                     documento de entrega (V1→R1→V2→R2→V3→R3→V4)
  metodologia.md                 cómo iteramos: ramas, commits, tags, checklists
  investigacion.md               fuentes, variables y hallazgos en los datos
  evaluacion_usuarios/           hoja del observador (thinking aloud), una por ronda
  evidencia/vN/                  capturas de cada versión
```

## Cómo correrlo

```bash
# Visualización en local (abrir http://localhost:8000)
python3 -m http.server 8000

# Regenerar datos
python3 scripts/procesar_regiones.py
pip install pandas unrar-cffi
python3 scripts/procesar_carreras.py "ruta/a/sin descomprimir.zip"
```

Los microdatos originales (~500 MB por año) no se suben al repositorio; solo los archivos agregados de
`data/processed/`.
