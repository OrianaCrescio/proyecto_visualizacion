# Entrega 1 — Documento de proceso · IIC2026

> Estructura según el enunciado (plantilla, sección 10): el proceso en orden cronológico
> **V1 → R1 → V2 → R2 → V3 → R3 → V4**. Borrar estas notas `> …` antes de entregar.
> Los textos marcados como *borrador* son un punto de partida: revísenlos y escríbanlos con sus
> palabras — en R1 y R3 cada una tiene que poder defenderlos.

---

## 1. Portada

- **Grupo:** N° __
- **Integrantes:** Antonia Ramos · Oriana Crescio · Florencia Godoy
- **GitHub Pages:** https://orianacrescio.github.io/proyecto_visualizacion/
- **Repositorio:** https://github.com/OrianaCrescio/proyecto_visualizacion
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
  a largo y se calcula la proporción de mujeres y la distancia a la paridad (`scripts/procesar_regiones.py`).
- Microdatos de matrícula 2007–2026 (Centro de Estudios MINEDUC, ~1,5 M registros por año): se agregan a
  conteos por año × nivel × tipo de institución × área × carrera genérica × sexo
  (`scripts/procesar_carreras.py`, 3,4 MB). Los totales calzan con la serie regional.
- Para la sonificación, la proporción de mujeres se convierte en altura: 1 punto porcentual = 1 semitono
  respecto de una nota fija que representa el 50 %.

---

## 3. V1 — La idea completa

| Campo | |
|---|---|
| **Versión / fecha** | V1 · __/__/2026 |
| **Commit / tag** | `v1` · [enlace]() |
| **Evidencia** | ![V1](evidencia/v1/captura.png) · [video V1]() |

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
> Máx. 10 líneas. Llegar con la V1 funcionando y 2–3 preguntas de diseño concretas.

- **Fecha:**
- **Preguntas que llevamos:** *sugerencias:* (1) en 2025 todas las regiones están entre 52 % y 57 %: con
  el eje 0–100 % casi no se distinguen — ¿mantener el eje completo o hacer zoom? (2) El mensaje real está
  en las áreas (Tecnología 21 % vs. Salud 75 %): ¿las áreas reemplazan a las regiones o se suman como
  segundo nivel? (3) ¿Se entiende el sonido sin leer la leyenda?
- **Qué se discutió (síntesis):**
- **Qué adoptamos y por qué:**
- **Qué descartamos y por qué:**
- **Cómo se ve en V2:**

---

## 5. V2 — Primera iteración de diseño

| Campo | |
|---|---|
| **Versión / fecha** | V2 · __/__/2026 |
| **Commit / tag** | `v2` · [enlace]() |
| **Evidencia** | ![V2](evidencia/v2/captura.png) · [video V2]() |

**Qué cambió respecto a V1** (máx. 8 líneas)
-

**Por qué — rationale** (máx. 12 líneas)
-

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
