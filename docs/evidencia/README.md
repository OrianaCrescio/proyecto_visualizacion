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

Para guardar una versión nueva al cerrarla: copiar la carpeta `pagina/` completa a `docs/evidencia/vN/pagina/`
(o desde git: `git archive <commit> pagina | tar -x -C docs/evidencia/vN`).

Para verla en local hay que usar el servidor (`python3 -m http.server 8000` desde la raíz del repo) y abrir
`http://localhost:8000/docs/evidencia/v1/pagina/`; con doble clic no carga los datos.
