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
index.html                         redirige a pagina/ (GitHub Pages publica la raíz)
README.md

pagina/                            ← TODO lo que carga la página web
├── index.html
├── css/style.css
├── js/
│   ├── regiones.js                vista por regiones (dot plot, slider/play, tooltip)
│   ├── carreras.js                vista por áreas y carreras (hombres | mujeres, 2007 vs. año)
│   └── sonido.js                  sonificación (Web Audio API)
└── data/                          datos livianos que usa la página (los generan los scripts)
    ├── matricula_genero_region.csv
    ├── carreras_pregrado.csv
    └── regiones.geojson           mapa de las 16 regiones

docs/                              ← documentos del proyecto
├── entrega.md                     documento de entrega (V1→R1→V2→R2→V3→R3→V4)
├── metodologia.md                 cómo iteramos: ramas, commits, tags, checklists
├── investigacion.md               fuentes, variables y hallazgos en los datos
├── evaluacion_usuarios/           hoja del observador (thinking aloud), una por ronda
└── evidencia/v1 … v4/             por versión: capturas, video y pagina/ (copia navegable)
                                   ej. evidencia/v1/pagina/ = V1 revisada en la R1 (commit 0ba61f3)

procesamiento/                     ← de dónde salen los datos de pagina/data/ (la web no lo usa)
├── originales/                    País.csv, Región.csv (+ geo-chile/ y microdatos: no se suben)
├── intermedios/                   matricula_carrera.csv (microdatos 2007–2026 agregados)
└── scripts/
    ├── procesar_regiones.py       Región.csv → pagina/data/matricula_genero_region.csv
    ├── procesar_carreras.py       .rar del MINEDUC → intermedios/matricula_carrera.csv
    ├── resumir_carreras.py        matricula_carrera.csv → pagina/data/carreras_pregrado.csv
    └── generar_mapa_regiones.py   geo-chile/ (comunas) → pagina/data/regiones.geojson
```

## Cómo correrlo

```bash
# Visualización en local (abrir http://localhost:8000/pagina/)
# Ojo: abrir el index.html con doble clic NO funciona (el navegador bloquea la carga de datos)
python3 -m http.server 8000

# Regenerar datos
python3 procesamiento/scripts/procesar_regiones.py
pip install pandas unrar-cffi
python3 procesamiento/scripts/procesar_carreras.py "ruta/a/sin descomprimir.zip"
python3 procesamiento/scripts/resumir_carreras.py
pip install shapely
python3 procesamiento/scripts/generar_mapa_regiones.py
```

Los microdatos originales (~500 MB por año) y el GeoJSON por comuna no se suben al repositorio; solo
los archivos agregados de `procesamiento/intermedios/` y `pagina/data/`.
