# Entrega 1 · Documento de proceso · IIC2026

> Lo marcado con **[COMPLETAR]** son datos que solo tenemos nosotras (apuntes de R2 y R3, hashes,
> links a video). Buscar `[COMPLETAR]` antes de entregar y borrar esta nota.

---

## 1. Portada

- **Grupo:** N°1
- **Integrantes:** Antonia Ramos · Oriana Crescio · Florencia Godoy
- **GitHub Pages:** https://orianacrescio.github.io/proyecto_visualizacion/
- **Repositorio:** https://github.com/OrianaCrescio/proyecto_visualizacion
- **Videos de evidencia (OneDrive):** https://uccl0-my.sharepoint.com/:f:/r/personal/antonia_ramos_uc_cl/Documents/InfoVis?d=w5e1430c7df5c4d24932cc2f25ed17efd&csf=1&web=1&e=zBr1ej
- **Video final (V4):** [COMPLETAR link de YouTube]

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
| **Commit / tag** | tag `v1` (commit `0ba61f3`, "Release V1 to main") · [copia navegable](evidencia/v1/pagina/) |
| **Evidencia** | [capturas](evidencia/v1/fotos/) · [video V1](evidencia/v1/videos/evidenciaV1.mp4) |

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
- **Qué se discutió:** (1) el sonido no deja saber qué es "más" o "menos": comparar contra una nota
  fija de 220 Hz exige oído absoluto, y no distingue mujeres de hombres; (2) la V1 solo muestra el % de
  mujeres, así que la relación con los hombres queda implícita; (3) conviene probar alternativas para
  esa comparación, y la página puede tener más de un gráfico.
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
| **Commit / tag** | commit `b8a4d48` ("agregar visualizaciones por pestañas y sonificación interactiva") · [copia navegable](evidencia/v2/pagina/) |
| **Evidencia** | [video V2](evidencia/v2/videos/evidenciaV2.mp4) · [COMPLETAR capturas en `evidencia/v2/fotos/`] |

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

- **Fecha / grupo que nos revisó:** [COMPLETAR fecha, entre el 08 y el 12/10] · Grupo [COMPLETAR]
- **Qué se discutió:** [COMPLETAR 2–3 observaciones concretas que nos hicieron]
- **Qué adoptamos y por qué:** [COMPLETAR, idealmente ligado a los cambios de V3: escala del mapa,
  puntos coloreados por grupo mayoritario, Play en Carreras, líneas de enlace que se cruzaban]
- **Qué descartamos y por qué:** [COMPLETAR]
- **Cómo se ve en V3:** ver sección 7. Los primeros ajustes post-revisión están en el commit `efc7345`
  ("mini cambios post revisión entre grupos", 12/10).

---

## 7. V3 · Segunda iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V3 · 13/10/2026 |
| **Commit / tag** | commit `6e7fcd5` ("Mejora legibilidad de gráficos y enlaces entre regiones"); antes `efc7345`, `fe04643`, `44dc430` · [copia navegable](evidencia/v3/pagina/) |
| **Evidencia** | [capturas](evidencia/v3/fotos/) · [video V3](evidencia/v3/videos/V3.mp4) |

**Qué cambió respecto a V2**
- Los puntos del dot plot (y el de Chile) toman el color del grupo que es mayoría ese año.
- Escala del mapa ajustada de 30–70 % a 35–65 %.
- Las líneas que unen mapa y etiquetas se curvan distinto en Arica, Tarapacá, Araucanía y Los Ríos para
  no cruzarse.
- Botón Play también en la pestaña Carreras (2007–2026).
- Dot plot más alto (650 → 760 px) y etiquetas de eje más grandes.
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
- Play en Carreras: la misma interacción debía funcionar igual en las dos pestañas (consistencia).
- Tipografía y banda: separar jerarquías. Título y controles con una fuente, datos con otra más
  legible a tamaño chico.
- Paleta: [COMPLETAR/VERIFICAR, Antonia: por qué dejamos el azul/naranja. Ej.: buscábamos una
  identidad visual de un solo tono para toda la página.] Este cambio lo revertimos en parte en V4
  (ver sección 9): los dos morados resultaron demasiado parecidos.

**Qué se descartó**
- Probamos dos líneas gráficas antes de esta (commits `fe04643` "probando colores" y `44dc430` "prueba
  otra linea grafica"). [COMPLETAR en una línea qué tenían y por qué no quedaron.]

---

## 8. R3 · Revisión final con el equipo docente

- **Fecha:** [COMPLETAR]
- **Qué se discutió:** [COMPLETAR]
- **Qué adoptamos y por qué:** [COMPLETAR]
- **Qué descartamos y por qué:** [COMPLETAR]
- **Cómo se ve en V4:** [COMPLETAR. Si en la R3 se habló del sonido o del color, conectar aquí con
  los cambios de la sección 9.]

---

## 9. V4 · La versión final

| Campo | |
|---|---|
| **Versión / fecha** | V4 · 22/10/2026 |
| **Commit / tag** | [COMPLETAR hash] · tag `v4` · [copia navegable](evidencia/v4/pagina/) |
| **Evidencia** | [capturas](evidencia/v4/fotos/) · [COMPLETAR video V4] |

**Qué cambió respecto a V3**
- Paleta: los hombres pasan del azul noche a amarillo mostaza (`#e0a100`); las mujeres mantienen la
  lavanda de V3 (`#8d67b6`). Mapa divergente amarillo → casi blanco (paridad) → lavanda.
- Títulos, pestañas y slider pasan a un tono neutro oscuro; la banda del título y el pie quedan en una lavanda
  más oscura (`#6f4c9b`).
- Texto oscuro sobre el amarillo y borde en los puntos amarillos (el amarillo solo contra blanco no se lee).
- Sonido: el coro de hombres suena a la izquierda y el de mujeres a la derecha, igual que en los gráficos.
- Leyenda del sonido explícita: "coro grave = hombres, coro agudo = mujeres, el que es mayoría suena más fuerte".
- Pista visible "Haz clic en un área para ver sus 15 carreras" y "Clic para ver sus carreras" en el tooltip.
- La leyenda del mapa dice "más hombres" y "más mujeres" en los extremos.

**Por qué**
- Usuarios (ronda 1, sección 10): pidieron que la comparación hombres/mujeres se notara más. En V3 los
  dos colores eran morados y se diferenciaban casi solo por luminosidad. Amarillo y morado difieren en
  tono y en luminosidad a la vez, y el contraste se mantiene con daltonismo rojo-verde, porque va por
  el eje azul-amarillo. Tampoco cae en rosado/celeste.
- Títulos y controles en tono neutro para que el color de los datos destaque. La banda del título la
  dejamos en lavanda (probamos un tono oscuro y no nos gustó): funciona como identidad de la página y
  coincide con el mensaje, que está centrado en las mujeres.
- Contraste medido: texto negro sobre amarillo 8,3:1 y blanco sobre lavanda 4,4:1. Para textos sueltos
  sobre blanco usamos versiones más oscuras de los dos colores.
- Sonido: en V3 el paneo estaba al revés (hombres a la derecha) aunque en pantalla están a la
  izquierda. Lo alineamos para que oído y vista digan lo mismo.
- Usuarios: preguntaron cómo distinguir de oído a hombres y mujeres, y no notaron que las áreas se
  podían abrir. Con la leyenda del sonido y la pista de clic, ninguna de las dos cosas depende de que
  alguien la explique (heurísticas "el sonido no se entiende sin explicación" y "la interacción no es
  descubrible").

**Qué se descartó**
- [VERIFICAR] La evaluación propuso "voces corales diferenciadas por registro". El coro sintético
  grave/agudo ya hacía eso, así que no lo rehicimos: el problema era que nadie sabía qué voz era
  quién, y eso se resolvió con la leyenda y el paneo.
- Amarillo claro puro (`#f2b705`): con 1,8:1 contra blanco los puntos chicos desaparecían.
- Un morado más oscuro (`#5b2a86`) para las mujeres: daba más contraste, pero lo probamos y preferimos
  la lavanda de V3, que ya identificaba a las mujeres; bastaba con cambiar el color de los hombres.

**Balance del recorrido**
- Mejoró: el mensaje pasó de "las regiones cruzaron el 50 %" a "son mayoría, pero no en todas las
  áreas", que es lo que de verdad dicen los datos. El sonido pasó de una nota contra una referencia
  abstracta a dos coros que se comparan entre sí, y ahora coinciden en lado y en color con lo visual.
- No cambiamos: el eje fijo de 0 a 100 % (truncarlo exageraba diferencias de 5 puntos), la línea de
  paridad como referencia en todos los gráficos, y el dot plot como lectura precisa de las regiones, con
  el mapa solo como apoyo.

---

## 10. Evaluación con usuarios

| Ronda | Fecha | Versión evaluada | Participantes | Registro |
|---|---|---|---|---|
| 1 | [COMPLETAR] | V3 | [COMPLETAR perfil] | [ronda_1.md](evaluacion_usuarios/ronda_1.md) |
| 2 | 22/10/2026 | V4 | [COMPLETAR perfil] | [ronda_2.md](evaluacion_usuarios/ronda_2.md) |

**Ronda 1 (V3).** Fue retroalimentación sobre la V3, no una sesión de thinking aloud completa: no
tenemos bitácora con tiempos ni citas literales, y lo decimos así. Hallazgos:
- No quedaba claro qué coro era hombres y cuál mujeres.
- La comparación visual entre hombres y mujeres pedía más contraste.
- El mapa y los colores ayudaron, aunque al principio no se entendía qué significaba cada tono.
- Nadie descubrió solo que las áreas se podían abrir para ver carreras.

Efecto (V3 → V4): los cuatro hallazgos se tradujeron en cambios de V4 (sección 9): paleta amarillo/morado,
leyenda del sonido y paneo coherente, extremos rotulados en el mapa, y pista de clic.

**Ronda 2 (V4), thinking aloud.** [COMPLETAR después de la sesión, con el formato de `ronda_2.md`.]
- Hallazgos principales (incluido el sonido): [COMPLETAR]
- Efecto en el proceso: [COMPLETAR. Si se alcanza a corregir algo hoy: "V4 → V4.1" con su commit. Si no,
  decir qué cambiaríamos y por qué no se incorporó.]

---

## 11. Feedback al otro grupo (R2)

**El proyecto evaluado:** [COMPLETAR: grupo, mensaje de su visualización y en qué estado estaba]

**El feedback que dimos:** [COMPLETAR: observaciones concretas ancladas en principios del curso. Ej. de
formato: "el eje truncado exagera la diferencia entre categorías", no "se ve raro".]

**Lo que nos llevamos para nuestro proyecto:** [COMPLETAR: errores suyos que reconocimos en el nuestro,
ideas que adaptamos citando al grupo, decisiones que salieron confirmadas]
