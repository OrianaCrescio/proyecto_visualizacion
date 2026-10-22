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

# Evaluación con usuarios — V3

## 1. Objetivo de la evaluación

El objetivo de esta evaluación es analizar la comprensión del mensaje principal de la visualización, la claridad de sus representaciones gráficas, la facilidad para descubrir sus interacciones y la interpretación de la sonificación.

Se busca identificar oportunidades de mejora que permitan orientar el desarrollo de la cuarta versión (V4), particularmente en la comparación entre hombres y mujeres, la navegación entre regiones y carreras, y la relación entre datos y sonido.

## 2. Metodología

Se utiliza como referencia la técnica *Thinking Aloud* (pensar en voz alta), en la cual los participantes exploran una visualización verbalizando sus pensamientos, dudas e interpretaciones.

### Participante

| Participante | Perfil | Familiaridad con visualizaciones |
|---|---|---|
| U1 | Estudiante universitario de una carrera no relacionada con visualización de datos | Media |
| U2 | Estudiante universitario sin experiencia en visualizaciones interactivas | Baja |

### Procedimiento propuesto

Cada participante explora individualmente la V3 durante aproximadamente 8 minutos. Se le solicita pensar en voz alta, sin recibir explicaciones sobre el funcionamiento de la interfaz.

Las tareas consideradas son:

1. Identificar el mensaje principal de la visualización.
2. Explorar la evolución temporal de la participación de hombres y mujeres.
3. Comparar información entre regiones.
4. Navegar hacia la pestaña de carreras y explorar sus datos.
5. Escuchar la sonificación e interpretar su significado.

---

## 3. Sesión U1 — Comprensión del mensaje y sonificación

**Versión:** V3  
**Duración simulada:** 8 minutos  
**Objetivo:** evaluar la comprensión de las proporciones por género, la representación geográfica y la codificación sonora.

### Bitácora del observador

| Tiempo | Lo que dice | Lo que hace |
|---|---|---|
| 00:00 | «Entiendo que muestra cómo se distribuyen hombres y mujeres en las universidades». | Lee el título y observa el mapa sin interactuar. |
| 00:30 | «Los colores parecen representar las diferencias entre hombres y mujeres». | Examina la leyenda y los colores de las regiones. |
| 01:00 | «No sé si el color indica cuál grupo es mayoría o cuánto es la diferencia». | Alterna la mirada entre la leyenda y el mapa. |
| 01:30 | «Ah, puedo ver los datos de cada región». | Pasa el cursor sobre distintas regiones y observa la información emergente. |
| 02:00 | «Ahora entiendo mejor la comparación cuando veo los porcentajes». | Revisa los valores mostrados para una región. |
| 02:30 | «Voy a cambiar el año para ver qué pasa». | Utiliza el control temporal. |
| 03:00 | «Los colores cambian, pero me cuesta comparar exactamente cuánto cambió». | Alterna entre dos años. |
| 03:30 | «El mapa ayuda bastante porque puedo ver las diferencias por ubicación». | Recorre visualmente las regiones. |
| 04:00 | «Escucho sonidos, pero no entiendo qué representa cada uno». | Activa la reproducción sonora. |
| 04:30 | «¿Hay un sonido para mujeres y otro para hombres?». | Escucha nuevamente e intenta identificar diferencias. |
| 05:00 | «Quizás sería más fácil distinguirlos si fueran voces diferentes». | Repite la interacción sonora. |
| 05:30 | «Me imagino algo como un coro, con voces más agudas y graves». | Comenta una posible alternativa de representación. |
| 06:00 | «La idea del sonido es interesante, pero necesito entender qué estoy escuchando». | Busca una explicación de la sonificación. |
| 07:00 | «Visualmente entiendo mejor la información que con el sonido». | Regresa a la exploración del mapa. |
| 08:00 | «Mantendría el mapa, pero explicaría mejor los colores y los sonidos». | Finaliza la exploración. |

### Heurísticas potencialmente comprometidas

**H1. La importancia del dato no está clara.** La comparación entre hombres y mujeres podría requerir una representación más explícita de las diferencias.

**H2. Falta contexto.** El usuario podría necesitar una explicación inicial sobre el significado de los colores y los sonidos.

**H3. El sonido no se entiende sin explicación.** La sonificación podría resultar difícil de interpretar si no existe una correspondencia perceptible entre las variables y los timbres utilizados.

### Tres preguntas de cierre

**¿Dónde se atascó más tiempo?**  
En la interpretación de la sonificación, particularmente al intentar distinguir qué sonidos representaban a hombres y mujeres.

**¿Qué hipótesis resultó equivocada?**  
Inicialmente interpretó que el color podía representar directamente el grupo mayoritario, sin comprender de inmediato la magnitud de las diferencias.

**¿Qué cambio concreto surge de esta sesión?**  
Evaluar la incorporación de voces diferenciadas por registro y reforzar las explicaciones de la comparación visual y sonora.

---

## 4. Sesión U2 — Navegación e interacción

**Versión:** V3  
**Duración simulada:** 8 minutos  
**Objetivo:** evaluar la descubribilidad de las interacciones, especialmente en la pestaña de carreras.

### Bitácora del observador

| Tiempo | Lo que dice | Lo que hace |
|---|---|---|
| 00:00 | «Parece que puedo explorar información de distintas regiones». | Observa el mapa y lee los elementos principales. |
| 00:30 | «No entiendo todo todavía, pero los colores me ayudan a diferenciar». | Examina las regiones y la leyenda. |
| 01:00 | «¿Puedo seleccionar una región?». | Mueve el cursor sobre el mapa. |
| 01:30 | «Ah, aquí aparecen más datos». | Observa la información desplegada al interactuar. |
| 02:00 | «Me gusta poder ver cómo cambia con los años». | Manipula el control temporal. |
| 02:30 | «Quiero ver si pasa lo mismo en las carreras». | Selecciona la segunda pestaña. |
| 03:00 | «Hay varias áreas, pero no sé qué puedo hacer con ellas». | Observa la representación de carreras sin interactuar. |
| 03:30 | «Pensé que esto era solo un gráfico». | Recorre visualmente los elementos. |
| 04:00 | «Ah, se puede hacer clic». | Selecciona una carrera. |
| 04:30 | «Ahora sí, puedo ver información más específica». | Explora el detalle de la carrera seleccionada. |
| 05:00 | «Debería decir en alguna parte que se pueden seleccionar». | Regresa a la vista general de carreras. |
| 05:30 | «Quizás podrían cambiar de color o mostrar una indicación al pasar el mouse». | Prueba otras áreas interactivas. |
| 06:00 | «La comparación entre hombres y mujeres podría verse más directamente». | Observa los porcentajes de la vista de carreras. |
| 07:00 | «Una vez que entiendo cómo funciona, es fácil explorar». | Alterna entre elementos de la visualización. |
| 08:00 | «Lo principal que cambiaría es hacer más evidentes los elementos interactivos». | Finaliza la exploración. |

### Heurísticas potencialmente comprometidas

**H1. La interacción no es descubrible.** La posibilidad de seleccionar carreras podría no resultar evidente durante la exploración inicial.

**H2. Falta contexto.** La segunda pestaña podría necesitar instrucciones breves que orienten la interacción.

**H3. La importancia del dato no está clara.** La representación de carreras podría reforzar visualmente la comparación entre hombres y mujeres.

### Tres preguntas de cierre

**¿Dónde se atascó más tiempo?**  
En descubrir que las carreras podían seleccionarse para acceder a información adicional.

**¿Qué hipótesis resultó equivocada?**  
Interpretó inicialmente que la vista de carreras era un gráfico estático, sin funcionalidades adicionales.

**¿Qué cambio concreto surge de esta sesión?**  
Agregar indicaciones de interacción y señales visuales, como cambios al pasar el cursor, que permitan reconocer los elementos seleccionables.

---

## 5. Retroalimentación recibida

Además de las simulaciones anteriores, durante el proceso de diseño se recopilaron los siguientes comentarios reales:

| Fuente | Comentario recibido | Aprendizaje |
|---|---|---|
| Revisión 1, equipo docente | Se cuestionó cómo distinguir hombres y mujeres mediante el sonido. | La codificación sonora necesita mayor claridad. |
| Revisión 1, equipo docente | Se solicitó especificar visualmente la comparación entre hombres y mujeres y evaluar alternativas. | Es necesario reforzar el contraste visual. |
| Retroalimentación adicional | Se valoró la propuesta de utilizar un coro con voces altas y bajas para representar ambos grupos. | La metáfora sonora del coro tiene potencial comunicativo. |
| Retroalimentación adicional | Se destacó el mapa como apoyo visual mediante las diferencias de color, aunque la comprensión inicial no fue completa. | Conviene conservar el mapa y mejorar su contextualización. |
| Retroalimentación adicional | Se señaló que debería ser más evidente que las carreras de la segunda pestaña son seleccionables. | Es necesario mejorar la descubribilidad de la interacción. |


---

## 6. Síntesis de hallazgos y decisiones para V4

| Hallazgo | Evidencia real disponible | Propuesta de diseño para V4 |
|---|---|---|
| La comparación sonora entre géneros no es suficientemente clara | Preguntas surgidas en la primera revisión | Explorar una sonificación coral con registros vocales diferenciados |
| La comparación visual requiere mayor énfasis | Comentario del equipo docente | Reforzar etiquetas, proporciones y jerarquía visual |
| El mapa ayuda a comprender la distribución territorial, pero necesita contexto inicial | Comentario positivo con dificultad de comprensión | Mantener el mapa y mejorar las explicaciones de colores y datos |
| No es evidente que las carreras son seleccionables | Comentario recibido sobre la segunda pestaña | Incorporar instrucciones y señales visuales de interacción |

## 7. Efecto de la evaluación en el proceso de diseño

La retroalimentación recopilada permitió identificar oportunidades de mejora relacionadas con tres dimensiones centrales: la claridad del mensaje, la descubribilidad de las interacciones y la coherencia entre representación visual y sonificación.

En particular, se reconoció que la comparación entre hombres y mujeres debía expresarse de manera más explícita, tanto gráfica como auditivamente. La propuesta de utilizar voces corales diferenciadas por registro surgió como una alternativa para fortalecer la relación entre sonido y datos.

Por otra parte, se identificó que el mapa constituye un apoyo visual relevante, por lo que se propone conservarlo y mejorar su contextualización. Finalmente, los comentarios sobre la segunda pestaña sugieren incorporar señales que comuniquen claramente la posibilidad de seleccionar carreras.

Estos aprendizajes constituyen criterios para el desarrollo de V4. Las decisiones efectivamente implementadas deberán documentarse junto con sus respectivas justificaciones, distinguiéndolas de las alternativas que solo fueron consideradas.

## 8. Conclusión

El análisis del feedback y  evaluación con usuarios permitió organizar los principales desafíos de usabilidad de la V3 y formular propuestas concretas para la versión final.

La principal oportunidad de mejora consiste en lograr que la visualización comunique de forma más inmediata su mensaje, que las interacciones sean reconocibles y que la sonificación aporte una interpretación complementaria de los datos.

