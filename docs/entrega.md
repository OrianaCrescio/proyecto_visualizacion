# Entrega 1 — Documento de proceso · IIC2026

> Estructura según el enunciado (plantilla, sección 10): el proceso en orden cronológico
> **V1 → R1 → V2 → R2 → V3 → R3 → V4**. Borrar estas notas `> …` antes de entregar.
> Los textos marcados como *borrador* son un punto de partida: revísenlos y escríbanlos con sus
> palabras — en R1 y R3 cada una tiene que poder defenderlos.

---

## 1. Portada

- **Grupo:** N°1
- **Integrantes:** Antonia Ramos · Oriana Crescio · Florencia Godoy
- **GitHub Pages:** https://orianacrescio.github.io/proyecto_visualizacion/
- **Repositorio:** https://github.com/OrianaCrescio/proyecto_visualizacion
- **One drive** https://uccl0-my.sharepoint.com/:f:/r/personal/antonia_ramos_uc_cl/Documents/InfoVis?d=w5e1430c7df5c4d24932cc2f25ed17efd&csf=1&web=1&e=zBr1ej
- **Video:** _pendiente_

---

## 2. Contexto general del proyecto

### 2.1 Mensaje principal
> Máx. 10 líneas. Qué presenta la visualización **final** (actualizar al cerrar V4).

*Borrador:* Las mujeres ya son mayoría en la matrícula de educación superior en Chile — cruzaron la
paridad en 2008 y hoy son el 53 % en el país y en todas las regiones. Pero esa "igualdad" en el total
esconde una fuerte segregación por área: salud y educación superan el 74 % de mujeres, mientras en
tecnología apenas pasan del 20 %, casi igual que en 2007. Público: estudiantes de enseñanza media
eligiendo carrera y quienes diseñan políticas de fomento a mujeres en STEM.

### 2.2 Origen y procesamiento de los datos
> Máx. 8 líneas.

*Borrador:*
- Serie por región 1984–2025 (SIIT-BCN, con datos MINEDUC/SIES — *verificar*): se pasa de formato ancho
  a largo y se calcula la proporción de mujeres y la distancia a la paridad (`procesamiento/scripts/procesar_regiones.py`).
- Microdatos de matrícula 2007–2026 (Centro de Estudios MINEDUC, ~1,5 M registros por año): se agregan a
  conteos por año × nivel × tipo de institución × área × carrera genérica × sexo
  (`procesamiento/scripts/procesar_carreras.py`, 3,4 MB). Los totales calzan con la serie regional.
- Para la sonificación, la proporción de mujeres se convierte en altura: 1 punto porcentual = 1 semitono
  respecto de una nota fija que representa el 50 %.

---

## 3. V1 — La idea completa

| Campo | |
|---|---|
| **Versión / fecha** | V1 · 28/09/2026 |
| **Commit / tag** | `v1` (commit `0ba61f3`) · [enlace]() · [copia navegable](evidencia/v1/pagina/) |
| **Evidencia** | ![V1](evidencia/v1/fotos) · [video V1]() |

**Qué cambió** (en V1: decisiones iniciales · máx. 8 líneas) — *borrador*
- Mensaje: cómo cambió la participación de las mujeres en la educación superior, por región.
- Forma: dot plot horizontal — una fila por región, eje x = % de mujeres (0–100 %), línea punteada en 50 %.
- Chile aparte, debajo, con un punto más grande como referencia nacional.
- Interacción: slider de año (1984–2025) + botón Play que anima la serie; tooltip con % y conteos al
  pasar el cursor (details on demand).
- Sonificación: nota de fondo = paridad; cada año suena el % nacional como altura
  (más grave = menos mujeres); al pasar por una región suena la suya.

**Por qué — rationale** (máx. 12 líneas) — *borrador, completar*
- Posición sobre una escala común es el canal más preciso para comparar proporciones
  (Cleveland & McGill), por eso puntos alineados y no mapa coroplético ni tortas.
- Eje fijo 0–100 % para no exagerar diferencias entre regiones (evitar eje truncado).
- La línea de paridad da el contexto que el lector necesita para interpretar cada punto.
- Sonido: la nota de fondo convierte "distancia a la paridad" en un intervalo audible; el Play hace
  oír la tendencia (la melodía sube y cruza el fondo en 2008).

**Qué se descartó** (máx. 5 líneas)
-

---

## 4. R1 — Revisión con el equipo docente
> Máx. 10 líneas. Revisar y ajustar con las palabras del grupo antes de entregar.

- **Fecha:** 29/09/2026 · con el equipo docente, sobre la V1 publicada en GitHub Pages.
- **Qué se discutió:** (1) el sonido no permite saber qué es "más" o "menos": comparar contra una nota
  fija de 220 Hz exige oído absoluto, y no distingue a mujeres de hombres; (2) la V1 solo muestra el %
  de mujeres, así que la relación con los hombres queda implícita; (3) conviene evaluar varias
  alternativas visuales para esa comparación, y la página puede tener más de un gráfico.
- **Qué adoptamos y por qué:** timbre distinto para mujeres y para hombres, de modo que se comparen dos
  voces entre sí en vez de una contra una referencia abstracta; hacer explícita la comparación
  hombres/mujeres en lo visual; pasar a varios gráficos que cuenten una sola historia (evolución
  nacional → regiones → carreras), sumando los datos por carrera que ya teníamos y que son el centro
  del mensaje; mostrar explícitamente el antes y el ahora (primer año vs. último).
- **Qué descartamos o dejamos en evaluación y por qué:** mapa de regiones con color que cambia por año:
  en evaluación — muestra bien el cambio temporal (en 1984, 10 de 12 regiones estaban bajo 50 %; hoy
  todas están sobre), pero en el año actual las regiones varían poco (52–57 %) y el tamaño de cada
  región pesa más a la vista que su matrícula.
- **Cómo se ve en V2:** _completar al cerrar la V2._

---

## 5. V2 — Primera iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V2 · __/__/2026 |
| **Commit / tag** | `v2` · [enlace]() |
| **Evidencia** | ![V2](evidencia/v2/captura.png) · [video V2]() |

**Qué cambió respecto a V1** (máx. 8 líneas) — *borrador, en progreso*
- Nueva sección "Son mayoría, pero no en todas las áreas": matrícula de pregrado 2007–2026 por área del
  conocimiento, cada área como una barra al 100 % con hombres desde la izquierda y mujeres desde la derecha.
- Marca negra con la división de 2007 en cada barra (antes vs. año elegido) + slider de año.
- Clic en un área → sus 15 carreras con más matrícula, con la misma codificación (details on demand).
- Tooltip con % y conteos de ambos sexos y el cambio en puntos desde 2007.
- _Pendiente:_ sonido con dos timbres (hombres / mujeres), vista de evolución nacional, ¿mapa?

**Por qué — rationale** (máx. 12 líneas) — *borrador*
- R1: la comparación con los hombres tiene que ser visible, no deducida → dos segmentos con dos colores
  y el % de cada grupo escrito en su segmento.
- Barras alineadas en los extremos: ambos grupos se leen como longitud desde una línea base común
  (posición > color / área, Cleveland & McGill).
- R1 y nuestra propia idea: comparar el inicio con hoy → la marca de 2007 en vez de un segundo gráfico.
- Evidencia de los datos: el mensaje (Tecnología 18 % → 21 % de mujeres en 20 años; Salud y Educación
  ~75 %) está en las áreas, no en las regiones, que hoy varían solo entre 52 % y 57 %.
- Orden fijo de las áreas (según el último año) para no perder la referencia al mover el slider.
- Colores azul/naranja validados para daltonismo; se evitó el rosado/celeste por estereotipo.

**Qué se descartó** (máx. 5 líneas)
-

---

## 6. R2 — Revisión entre pares
> Máx. 10 líneas. Feedback recibido (el que dimos va en la sección 11).

- **Fecha / grupo que nos revisó:**
- **Qué se discutió (síntesis):**
- **Qué adoptamos y por qué:**
- **Qué descartamos y por qué:**
- **Cómo se ve en V3:**

---

## 7. V3 — Segunda iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V3 · __/__/2026 |
| **Commit / tag** | `v3` · [enlace]() |
| **Evidencia** | ![V3](evidencia/v3/captura.png) · [video V3]() |

**Qué cambió respecto a V2** (máx. 8 líneas)
-

**Por qué — rationale** (máx. 12 líneas)
-

**Qué se descartó** (máx. 5 líneas)
-

---

## 8. R3 — Revisión final con el equipo docente
> Máx. 10 líneas.

- **Fecha:**
- **Qué se discutió (síntesis):**
- **Qué adoptamos y por qué:**
- **Qué descartamos y por qué:**
- **Cómo se ve en V4:**

---

## 9. V4 — La versión final

| Campo | |
|---|---|
| **Versión / fecha** | V4 · __/__/2026 |
| **Commit / tag** | `v4` · [enlace]() |
| **Evidencia** | ![V4](evidencia/v4/captura.png) · [video V4]() |

**Qué cambió respecto a V3** (máx. 8 líneas)
-

**Por qué — rationale** (máx. 12 líneas)
-

**Qué se descartó** (máx. 5 líneas)
-

**Balance del recorrido:** qué mejoró desde V1, y qué decidimos no cambiar y por qué.
-

---

## 10. Evaluación con usuarios (thinking aloud)
> Al menos una ronda (recomendado dos: entre V2–V3 y entre V3–V4). El registro completo de cada ronda
> va en `evaluacion_usuarios/` usando `plantilla_hoja_observador.md`; aquí va el resumen.

| Ronda | Fecha | Versión evaluada | Pensador/a (perfil) | Registro |
|---|---|---|---|---|
| 1 | | V_ | | [ronda_1.md](evaluacion_usuarios/ronda_1.md) |
| 2 | | V_ | | [ronda_2.md](evaluacion_usuarios/ronda_2.md) |

**Hallazgos principales (incluido el sonido):**
-

**Efecto en el proceso:** en qué transición (ej. V3 → V4) se incorporó lo aprendido — o se decidió
no incorporarlo, y por qué.
-

---

## 11. Feedback al otro grupo (R2)

**El proyecto evaluado** (máx. 5 líneas): grupo, mensaje de su visualización y en qué estado estaba.
-

**El feedback que dimos** (máx. 12 líneas): observaciones concretas ancladas en los principios del curso
("el eje truncado exagera la diferencia entre categorías", no "se ve raro").
-

**Lo que nos llevamos para nuestro proyecto** (máx. 5 líneas): errores ajenos que reconocimos en el
nuestro, ideas que adaptamos (citando al otro grupo), decisiones que salieron confirmadas.
-
