# Evidencia por versión

Cada carpeta `vN/` junta todo lo de esa versión para que el grupo (y el equipo docente) la pueda ver:

```
vN/
├── pagina/        copia navegable de la página tal como quedó en esa versión (no se edita)
├── *.png / *.gif  capturas: vista general, tooltip, animación a mitad…
└── *.mp4          video corto con audio (< 100 MB; el video largo va a YouTube y se enlaza en entrega.md)
```

| Versión | Copia navegable | Origen | En GitHub Pages |
|---|---|---|---|
| V1 | `v1/pagina/` | commit `0ba61f3` ("Release V1 to main"), la versión revisada en la R1 | `…/proyecto_visualizacion/docs/evidencia/v1/pagina/` |
| V2 | `v2/pagina/` | copia de la carpeta `pagina/` actual al registrar esta versión | `…/proyecto_visualizacion/docs/evidencia/v2/pagina/` |
| V3 | `v3/pagina/` | commit `6e7fcd5` (13/10) | `…/proyecto_visualizacion/docs/evidencia/v3/pagina/` |
| V4 | `v4/pagina/` | copia de `pagina/` al cerrar la V4 (22/10) | `…/proyecto_visualizacion/docs/evidencia/v4/pagina/` |

Para guardar una versión nueva al cerrarla: copiar la carpeta `pagina/` completa a `docs/evidencia/vN/pagina/`
(o desde git: `git archive <commit> pagina | tar -x -C docs/evidencia/vN`).

Para verla en local hay que usar el servidor (`python3 -m http.server 8000` desde la raíz del repo) y abrir
`http://localhost:8000/docs/evidencia/v2/pagina/`; con doble clic no carga los datos.

**Barra de versiones (22/10):** a las copias de V1, V2 y V3 se les agregó solo una barra arriba
para saltar entre versiones sin usar el botón "atrás" del navegador (bloque `VNAV` en el HTML).
El resto de cada versión quedó como estaba. La V4 (la página actual) no lleva barra: los links a
las versiones anteriores están en el pie de cada pestaña.
