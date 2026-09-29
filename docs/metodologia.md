# Metodología de iteración

Según indica el programa del ramo, realizaremos iteraciones para mejorar la visualización basado en el
feedback del cuerpo docente y nuestros compañeros. Por lo tanto, dejaremos registradas cada versión del
proyecto junto con los cambios y su justificación pertinente. Todo esto con el propósito de llevar un
registro de la evolución de nuestro trabajo.

El registro oficial de cada versión va en [`entrega.md`](entrega.md). Este archivo define **cómo**
trabajamos para que ese registro sea verificable.

## Ciclo

**V1 → R1 → V2 → R2 → V3 → R3 → V4** (mínimo cuatro versiones; si hay más o un cambio de rumbo, se
documenta). Una iteración puede tocar mensaje, forma visual, interacción o sonido, pero **ningún cambio
sin explicación**: cada uno nace de una revisión, de usuarios, de un principio del curso o de los datos.

## Ramas y commits

- `develop`: trabajo del día a día. `main`: lo que está publicado en GitHub Pages.
- **Commits frecuentes durante la semana**, no la noche antes: el historial es la evidencia del proceso
  (el enunciado penaliza fuertemente cuatro versiones creadas en cuatro commits al final).
- Formato: `tipo(ámbito): descripción` — ej. `feat(vis): tooltip por región`,
  `feat(sonido): nota de paridad`, `data: procesa carreras 2007-2026`, `docs(entrega): rationale V2`.

## Cerrar una versión

1. Merge de `develop` a `main` (queda publicada en GitHub Pages).
2. Tag: `git tag -a vN -m "VN: <resumen>" && git push origin vN`.
3. Copia navegable (recomendado por el enunciado): copiar la carpeta `pagina/` completa a
   `docs/evidencia/vN/pagina/` (incluye sus datos, así funciona sola). Ver `docs/evidencia/README.md`.
4. Capturas y video corto con audio en `docs/evidencia/vN/` (el video largo en YouTube, enlazado en `entrega.md`).
5. Completar la sección de la versión en `entrega.md`.

## Checklist por versión

- [ ] Funciona completa: mensaje, datos, forma visual, interacción y sonificación.
- [ ] Tag `vN` publicado (y carpeta `/vN/`).
- [ ] Captura(s) + video con audio.
- [ ] En `entrega.md`: qué cambió (≤ 8 líneas), rationale (≤ 12), qué se descartó (≤ 5).

## Antes de cada revisión (R1, R2, R3)

- [ ] Versión vigente funcionando en GitHub Pages.
- [ ] 2–3 preguntas de diseño concretas escritas.
- [ ] Las tres podemos explicar cada decisión de diseño, la teoría detrás y la implementación
      (en R1 y R3 el diálogo con el profesor es individual).
- [ ] Después: síntesis ≤ 10 líneas en `entrega.md` (qué se adoptó/descartó y por qué).

## Historial de versiones

| Versión | Fecha | Tag | Resumen |
|---|---|---|---|
| V1 | | `v1` | Dot plot de % de mujeres por región (1984–2025), slider + play, tooltip, sonificación de la paridad |
| V2 | | `v2` | |
| V3 | | `v3` | |
| V4 | | `v4` | |
