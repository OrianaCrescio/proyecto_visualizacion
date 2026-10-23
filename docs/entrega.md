# Entrega 1 · Documento de proceso · IIC2026

## 1. Portada

- **Grupo:** N°1
- **Integrantes:** Antonia Ramos · Oriana Crescio · Florencia Godoy
- **GitHub Pages:** https://orianacrescio.github.io/proyecto_visualizacion/
- **Repositorio:** https://github.com/OrianaCrescio/proyecto_visualizacion
- **Video final (V4):** [YouTube](https://youtu.be/LmSdQFqW3WI)

> YouTube redujo la definición de los videos. Para verlos con mayor nitidez, recomendamos usar las
> copias originales incluidas en el repositorio: [V1](evidencia/v1/videos/evidenciaV1.mp4) ·
> [V2](evidencia/v2/videos/evidenciaV2.mp4) · [V3](evidencia/v3/videos/V3.mp4) ·
> [V4](evidencia/v4/videos/V4.mp4). Son los mismos videos.

---

## 2. Contexto general del proyecto

### 2.1 Mensaje principal

Las mujeres ya son mayoría en la matrícula de educación superior en Chile. Cruzaron la paridad en 2008
y hoy son el 53 % a nivel nacional, con todas las regiones entre 52 % y 57 %. En 1984, en cambio, 10 de
las 12 regiones estaban bajo el 50 %.

Pero esa mayoría en el total esconde una segregación fuerte por área. Salud y Educación tienen 75 % de
mujeres; Tecnología tiene 21 %, apenas 3,4 puntos más que en 2007. La visualización parte por el cambio
territorial (el mapa y las regiones pasan de amarillo a morado) y después muestra que, carrera por
carrera, la paridad está lejos. Pensamos en dos públicos: estudiantes de enseñanza media que están
eligiendo carrera y quienes diseñan políticas para atraer mujeres a STEM.

### 2.2 Origen y procesamiento de los datos

- Serie por región 1984–2025 (BCN, SIIT – Estadísticas territoriales). La pasamos de formato ancho a
  largo y calculamos la proporción de mujeres y la distancia a la paridad (`procesamiento/scripts/procesar_regiones.py`).
- Microdatos de matrícula 2007–2026 (Centro de Estudios MINEDUC, ~1,5 M registros por año). Los
  agregamos a conteos por año × nivel × tipo de institución × área × carrera genérica × sexo
  (`procesar_carreras.py`, queda en 3,4 MB). Revisamos que los totales calcen con la serie regional.
- La pestaña de carreras usa solo pregrado; se excluyen las filas "Sin información".
- Para el sonido usamos directamente los conteos de hombres y mujeres: el volumen de cada coro sale de
  su proporción al cuadrado, para que diferencias chicas (52 % vs. 48 %) igual se escuchen.

---

## 3. V1 · La idea completa

| Campo | |
|---|---|
| **Versión / fecha** | V1 · 28/09/2026 |
| **Commit / tag** | tag `v1` → commit `0ba61f3` ("Release V1 to main") · [copia navegable](evidencia/v1/pagina/) |
| **Evidencia** | [capturas](evidencia/v1/fotos/) · [video V1](evidencia/v1/videos/evidenciaV1.mp4) · [video V1 en YouTube](https://youtu.be/JL0Or8l1i20) |

**Decisiones iniciales**
- Mensaje: cómo cambió la participación de las mujeres en la educación superior, región por región.
- Forma: dot plot horizontal, una fila por región, eje x = % de mujeres (0–100 %) y línea punteada en 50 %.
- Chile va aparte, abajo, con un punto más grande como referencia nacional.
- Interacción: slider de año (1984–2025), botón Play que anima la serie y tooltip con % y conteos.
- Sonido: una nota de fondo fija (220 Hz) marca la paridad; cada año suena el % nacional como altura
  (1 punto = 1 semitono, más grave = menos mujeres). Al pasar por una región suena la suya.

**Por qué**
- Para comparar proporciones, la posición sobre una escala común es el canal más preciso
  (Cleveland & McGill). Por eso puntos alineados y no un mapa coroplético ni tortas.
- Eje fijo de 0 a 100 % para no exagerar las diferencias entre regiones con un eje truncado.
- La línea de paridad es la referencia que el lector necesita para leer cada punto: a qué lado cae.
- Sonido: con la nota de fondo, "distancia a la paridad" se vuelve un intervalo audible. Con Play se
  escucha la tendencia: la melodía sube y cruza el fondo en 2008.

**Qué se descartó**
- Mapa coroplético como vista principal: el área de cada región pesa más a la vista que su matrícula
  (Aysén y Magallanes dominan el mapa con muy pocos estudiantes).
- Gráfico de torta por región: con 16 regiones comparar ángulos es impreciso.

---

## 4. R1 · Revisión con el equipo docente

- **Fecha:** 29/09/2026, sobre la V1 publicada en GitHub Pages.
- **Qué se discutió:** (1) qué es el sonido y cómo se diferencia entre mujeres y hombres; se sugirió
  cambiar el timbre según el grupo. Nuestra nota contra 220 Hz exigía oído absoluto y no separaba a
  los dos grupos; (2) especificar visualmente la comparación entre mujeres y hombres, porque la V1
  solo muestra el % de mujeres; (3) evaluar distintas alternativas, sobre todo para esa comparación.
- **Qué adoptamos:** un timbre distinto para cada grupo, para comparar dos voces entre sí en vez de una
  contra una referencia abstracta; hacer explícita la comparación hombres/mujeres; varios gráficos que
  cuenten una sola historia (regiones → carreras), sumando los datos por carrera, que son el centro del
  mensaje; mostrar el antes y el ahora.
- **Qué dejamos en evaluación:** el mapa con color por año. Muestra bien el cambio (en 1984, 10 de 12
  regiones bajo 50 %), pero hoy las regiones varían poco (52–57 %) y el tamaño engaña.
- **Cómo se ve en V2:** dos coros (grave y agudo) en vez de una nota contra la paridad; barras
  hombres | mujeres en la pestaña Carreras; el mapa vuelve, pero como acompañante del dot plot y no
  como vista principal; marca de 2007 para el antes/ahora.

---

## 5. V2 · Primera iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V2 · 07/10/2026 |
| **Commit / tag** | tag `v2` → commit `b8a4d48` ("agregar visualizaciones por pestañas y sonificación interactiva") · [copia navegable](evidencia/v2/pagina/) |
| **Evidencia** | [capturas](evidencia/v2/fotos/) · [video V2](evidencia/v2/videos/evidenciaV2.mp4) · [video V2 en YouTube](https://youtu.be/jmW569YPU7U) |

**Qué cambió respecto a V1**
- Dos pestañas: "Regiones" (mapa + dot plot) y "Carreras" (áreas del conocimiento 2007–2026).
- Regiones: mapa coroplético divergente (azul = más hombres, naranja = más mujeres) al lado del dot
  plot, con líneas que unen cada región del mapa con su fila.
- Carreras: cada área es una barra al 100 %, hombres desde la izquierda y mujeres desde la derecha,
  con el % escrito en cada segmento y el total a la derecha.
- Marca negra con la división de 2007 en cada barra + slider de año.
- Clic en un área: sus 15 carreras con más matrícula, con la misma codificación.
- Sonido nuevo: al pasar el cursor suenan dos coros, uno grave (hombres) y uno agudo (mujeres), cada uno
  con volumen según su proporción. Se elimina el botón "Activar sonido".

**Por qué**
- R1: la comparación con los hombres tiene que verse, no deducirse. Por eso dos segmentos de dos
  colores, cada uno con su %.
- Barras alineadas en los extremos: cada grupo se lee como longitud desde una línea base común, que es
  más preciso que comparar color o área (Cleveland & McGill).
- La marca de 2007 resuelve el antes/ahora que pidió la R1 sin agregar un segundo gráfico.
- Evidencia de los datos: el contraste fuerte está en las áreas (Tecnología 18 % → 21 % en 20 años;
  Salud y Educación ~75 %), no en las regiones, que hoy van de 52 % a 57 %.
- Orden fijo de las áreas (según el último año) para no perder la referencia al mover el slider.
- Sonido (R1): dos timbres que se comparan entre sí no dependen del oído absoluto. Quien sea mayoría
  suena más fuerte.
- El mapa vuelve como contexto y para el cambio temporal, pero la lectura precisa sigue en el dot plot;
  las líneas de enlace aplican el principio de conexión de la Gestalt.

**Qué se descartó**
- Rosado/celeste para mujeres/hombres: refuerza el estereotipo que el mensaje cuestiona.
- Un segundo gráfico "2007 vs. hoy": duplicaba las barras; la marca de 2007 hace lo mismo en el mismo lugar.
- Reordenar las áreas en cada año: el ojo pierde dónde estaba cada una durante el Play.

---

## 6. R2 · Revisión entre pares

- **Fecha / grupo que nos revisó:** 08/10/2026 · Grupo 10, sobre la V2.
- **Qué se discutió:** entendieron el mensaje y valoraron el mapa de calor, el contraste azul/naranja y
  el % escrito en cada barra. Pidieron: letras más grandes en el gráfico de regiones; un mapa más grande y
  un gráfico de puntos más angosto; simplificar el eje (números + "hombres/mujeres" en los extremos
  confundía); un indicador más visible de que las áreas se abren; y cambiar la marca negra de 2007,
  que no se entendía, por un achurado del tramo que cambió. Del sonido dijeron que se vuelve más agudo
  cuando sube el % de mujeres: eso no es lo que codifica (son dos coros), y lo tomamos como hallazgo.
- **Qué adoptamos:** en V3, letras más grandes y el indicador ▸ en cada área. En V4, el eje con menos
  marcas y el título "% de mujeres", el achurado en vez de la marca negra, y la leyenda del sonido.
- **Qué descartamos:** agrandar el mapa a costa del gráfico de puntos. El área de cada región pesa más
  que su matrícula (Aysén se ve enorme con pocos estudiantes); la comparación precisa es la posición. Inicialmente descartamos la sugerencia del grupo 10 de incorporar un tercer color al gráfico de barras de áreas y carreras para comparar la proporción de mujeres del año seleccionado con la de 2007. Nos preocupaba que añadir un tercer color dificultara la lectura de los porcentajes de mujeres, central para nuestro propósito comunicativo. Sin embargo, retomamos una idea similar en la versión 4.
- **Cómo se ve en V3 y V4:** secciones 7 y 9. Primeros ajustes en `efc7345` ("mini cambios post revisión entre grupos").

---

## 7. V3 · Segunda iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V3 · 13/10/2026 |
| **Commit / tag** | tag `v3` → commit `6e7fcd5` ("Mejora legibilidad de gráficos y enlaces entre regiones"); antes `efc7345`, `fe04643`, `44dc430` · [copia navegable](evidencia/v3/pagina/) |
| **Evidencia** | [capturas](evidencia/v3/fotos/) · [video V3](evidencia/v3/videos/V3.mp4) · [video V3 en YouTube](https://youtu.be/C_Zf5Lmu2Zs) |

**Qué cambió respecto a V2**
- Los puntos del dot plot (y el de Chile) toman el color del grupo que es mayoría ese año.
- Escala del mapa ajustada de 30–70 % a 35–65 %.
- Las líneas que unen mapa y etiquetas se curvan distinto en Arica, Tarapacá, Araucanía y Los Ríos para
  no cruzarse.
- Carreras: botón Play (2007–2026) e indicador ▸ grande delante de cada área.
- Dot plot más alto (650 → 760 px) y etiquetas más grandes.
- Nueva línea gráfica: banda con el título arriba y pie abajo, tipografías Martian Mono (títulos,
  año, botones) e Inter (textos y valores).
- Paleta: de azul/naranja a azul noche (hombres) y lavanda (mujeres).

**Por qué**
- Color del punto: con el color, el cruce de la paridad se ve de forma preatentiva. Durante el Play
  los puntos cambian de color justo cuando pasan el 50 %, sin tener que mirar el eje.
- Escala del mapa: los datos van de 33 % a 57 %. Con 30–70 % casi todo quedaba en tonos cercanos al
  gris de la paridad; con 35–65 % se usa todo el rango de color sin saturar ningún extremo.
- Enlaces: cuatro curvas se cruzaban en el norte y en el sur, y no se sabía qué región iba con qué
  fila (Gestalt, continuidad).
- R2 (grupo 10): las etiquetas del gráfico de regiones se leían con dificultad, y no era evidente que
  las áreas se abrían. De ahí el gráfico más alto, las letras más grandes y el ▸.
- Play en Carreras: la misma interacción debía funcionar igual en las dos pestañas (consistencia).
- Tipografía y banda: separar jerarquías. Título y controles con una fuente, datos con otra más
  legible a tamaño chico.
- Paleta: cambiamos el azul y el naranja por dos tonos de morado para mantener una identidad visual
  coherente y usar el morado como símbolo de la lucha por la igualdad. Con ese cambio perdimos el
  contraste entre grupos que el grupo 10 había valorado; retomamos esa observación en V4 con una
  paleta de mayor contraste (sección 9).

**Qué se descartó**
- La paleta azul y naranja de V2, que ofrecía mayor contraste entre grupos. Priorizamos tonos morados,
  más representativos de nuestro mensaje y del morado como símbolo de la lucha por la igualdad; en V4
  retomamos la necesidad de aumentar el contraste con una paleta distinta.

---

## 8. R3 · Revisión final con el equipo docente

- **Fecha:** 13/10/2026
- **Qué se discutió:** los ayudantes revisaron la evolución desde V1 y no hicieron observaciones
  de fondo ni pidieron cambios concretos.
- **Qué decidimos:** sin indicaciones nuevas, basamos los ajustes finales en lo que sí teníamos
  pendiente: lo que el grupo 10 dijo en la R2 y no habíamos resuelto en V3, y la ronda 1 de
  evaluación con usuarios (17 y 18/10, sección 10).
- **Cómo se ve en V4:** ver sección 9. Cada cambio de V4 indica si viene de la R2 o de los usuarios.

---

## 9. V4 · La versión final

| Campo | |
|---|---|
| **Versión / fecha** | V4 · 22/10/2026 |
| **Commit / tag** | tag `v4` → commit `cfaad8d` ("docs: agrega evidencia de la versión 4") · [copia navegable](evidencia/v4/pagina/) |
| **Evidencia** | [capturas](evidencia/v4/fotos/) · [video V4 en YouTube](https://youtu.be/LmSdQFqW3WI) |

**Qué cambió respecto a V3**
- Paleta: hombres en amarillo mostaza (`#e0a100`), mujeres en la lavanda de V3 (`#8d67b6`); mapa
  amarillo → casi blanco (paridad) → lavanda. Banda del título en lavanda oscura, controles en neutro.
- Carreras: la marca negra de 2007 se reemplaza por un achurado del tramo que cambió desde 2007.
- Regiones: eje con 5 marcas (antes 11) y título "% de mujeres".
- Sonido: hombres a la izquierda y mujeres a la derecha (en V3 estaba al revés), y leyenda explícita
  ("coro grave = hombres, agudo = mujeres, el que es mayoría suena más fuerte").
- Pista "Haz clic en un área…" bajo el título y en el tooltip; el mapa rotula "más hombres / más mujeres".

**Por qué**
- Color (usuarios U2 y U3, y R2): la comparación hombres/mujeres tenía que notarse más, y el grupo 10
  había valorado el contraste de V2 que perdimos con dos morados. Amarillo y lavanda difieren en tono
  y luminosidad, el contraste se mantiene con daltonismo rojo-verde y no cae en rosado/celeste. Texto
  negro sobre amarillo 8,3:1; en textos sueltos usamos versiones más oscuras de ambos colores.
- Achurado (R2): el grupo 10 no entendió qué era la barra negra. El achurado marca el área que ganó
  (o perdió) cada grupo: el cambio se lee como longitud en la misma barra, no como una marca aparte.
- Eje (R2): números cada 10 % más "hombres/mujeres" confundían, porque no decía de quién eran los %.
  Con el título y menos marcas queda claro; no lo eliminamos, porque sin números no se pueden leer
  diferencias de 5 puntos entre regiones.
- Sonido (R2 y usuarios): el grupo 10 creyó que el tono subía con el % de mujeres y los usuarios no
  sabían qué coro era quién. Ahora la leyenda lo dice y el lado del sonido coincide con el del gráfico.
- Pista de clic (R2 y usuarios): el ▸ de V3 no bastó para que la interacción fuera descubrible.

**Qué se descartó**
- Agrandar el mapa y achicar el gráfico de puntos (R2): ver R2; el tamaño de las regiones engaña.
- Quitar el sonido (el grupo 10 sugirió que aporta poco para un porcentaje): el problema era que no
  se entendía qué codificaba, no el sonido en sí, así que lo aclaramos en vez de sacarlo.
- Un morado más oscuro (`#5b2a86`) para las mujeres: lo probamos y preferimos la lavanda de V3.
- Amarillo claro (`#f2b705`): con 1,8:1 contra blanco los puntos chicos desaparecían.

**Balance del recorrido**
- Mejoró: el mensaje pasó de "las regiones cruzaron el 50 %" a "son mayoría, pero no en todas las
  áreas", que es lo que de verdad dicen los datos. El sonido pasó de una nota contra una referencia
  abstracta a dos coros que se comparan entre sí, y ahora coinciden en lado y en color con lo visual.
- No cambiamos: el eje fijo de 0 a 100 % (truncarlo exageraba diferencias de 5 puntos), la línea de
  paridad como referencia en todos los gráficos, y el dot plot como lectura precisa de las regiones, con
  el mapa solo como apoyo.

---

## 10. Evaluación con usuarios

| Ronda | Fecha | Versión | Participantes | Registro |
|---|---|---|---|---|
| 1 | 17 y 18/10/2026 | V3 | U1 Andrés Rodríguez (egresado de Ing. en TI, emprendimiento en IA); U2 Pablo Huidobro y U3 Jacinta Velao (estudiantes universitarios) | [ronda_1.md](evaluacion_usuarios/ronda_1.md) |
| 2 | 22/10/2026 | V4 | U1 Amelia Pinilla (Ing. Estructural UC); U2 Clemente Toledo (estudiante de TI); U3 Esteban Pavez (estudiante universitario) | [ronda_2.md](evaluacion_usuarios/ronda_2.md) |

**Ronda 1 (V3).** Thinking aloud de ~8 minutos con U2 y U3, sin explicarles la interfaz; con U1 (Andrés)
quedaron los comentarios, no la bitácora. Hallazgos:
- Sonido: U2 escuchó los coros pero no supo qué eran («Escucho sonidos, pero no entiendo qué
  representa cada uno», 04:00) y preguntó «¿Hay un sonido para mujeres y otro para hombres?».
  Concluyó que entendía mejor lo visual que el sonido.
- Interacción: U3 creyó que Carreras era un gráfico estático («Pensé que esto era solo un gráfico»,
  03:30) y tardó un minuto en descubrir el clic. U1 dijo lo mismo.
- Color: U2 no sabía si el color del mapa indicaba qué grupo era mayoría o cuánta era la diferencia
  (01:00). U3 pidió ver la comparación hombres/mujeres «más directamente» (06:00).
- Lo que funcionó: los tres valoraron el mapa, y U3 dijo que una vez entendido «es fácil explorar».

**Efecto (V3 → V4):** leyenda explícita del sonido y paneo coherente con el gráfico; paleta
amarillo/lavanda; extremos rotulados en el mapa; pista de clic en Carreras y en el tooltip. Lo que no
incorporamos, con su motivo, está en `ronda_1.md`. Estos hallazgos coinciden con lo que dijo el grupo
10 en la R2, y como en la R3 no hubo indicaciones nuevas, fueron la base de la V4.

**Ronda 2 (V4).** Se realizaron tres sesiones *thinking aloud* de aproximadamente 8 minutos, con computador y audífonos, observadas por Florencia Godoy. Participaron Amelia Pinilla, Clemente Toledo y Esteban Pavez, evaluando la comprensión y navegación de V4.

- Hallazgos principales (incluido el sonido): U1 comprendió la visualización y valoró su interactividad, aunque tardó en descubrir la segunda pestaña. U2 destacó su simplicidad y sugirió mejorar el scroll y la primera pantalla. U3 tuvo dificultades iniciales de navegación, pero comprendió la información tras recibir orientación. No se recopilaron observaciones específicas sobre el sonido.
- Efecto en el proceso: Las observaciones de V4 quedaron registradas como mejoras a futuro: aumentar la visibilidad de la segunda pestaña, revisar la primera pantalla y el scroll, y hacer más accesibles las indicaciones iniciales. No se implementaron en V4 ni se atribuyen cambios de la versión final a esta ronda.

---

## 11. Feedback al otro grupo (R2)

**El proyecto evaluado:** grupo 10. Su visualización muestra cuánto saltaría una persona en la
gravedad de cada planeta del sistema solar, para público general. Tenía tres vistas (órbitas, saltos
alineados y detalle por planeta), tooltip con la gravedad, clic para hacer zoom en un planeta y un
sonido que acompaña el salto.

**El feedback que dimos:**
- Vista general: responde la pregunta, pero satura. Con personas y órbitas en movimiento no se puede
  cuantificar en qué planeta se salta más; los planetas se "topan" (la Luna con la Tierra).
- Ejes: en la vista alineada falta un eje vertical rotulado; para comparar la Tierra con Neptuno hay
  que leer los metros. El eje logarítmico por distancia al Sol sí nos pareció bien elegido.
- Contexto: no se explica con qué parámetros se calcula el salto (masa, altura de la persona) ni desde
  dónde se mide: si 1,27 m en la Tierra va del suelo a la cabeza, la persona mediría menos de 1,27 m.
  Esa confusión hace dudar de las equivalencias ("3 pisos").
- Color y minimalismo: la persona blanca se pierde cuando los planetas están juntos, y las líneas
  punteadas de tope en las órbitas no ayudan a comparar.
- Sonido: ayuda a sentir cuánto dura el salto, pero se corta arriba y no acompaña la caída.
- Conservar la vista alineada y la de planeta (buenas leyendas); repensar la de órbitas, que muestra la
  distribución del sistema solar pero no responde la pregunta.

**Lo que nos llevamos para nuestro proyecto:** La retroalimentación del grupo 10 contribuyó a mejorar el contraste entre hombres y mujeres e incorporar triángulos para indicar que las áreas podían desplegarse. Aunque sugirieron agrandar el mapa, decidimos mantener su tamaño y el protagonismo del gráfico de puntos, que permite comparar las regiones con mayor precisión.