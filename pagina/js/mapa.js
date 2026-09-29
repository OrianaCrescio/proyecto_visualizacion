// ============================================================
// MAPA DE REGIONES (1984–2025)
// ============================================================
//
// Coroplético con escala DIVERGENTE centrada en la paridad:
//   gris   = 50 % (paridad)
//   naranja más intenso = más mujeres que hombres
//   azul más intenso    = más hombres que mujeres
// Mismos colores que la vista de carreras (una sola lógica de color en la página).
//
// Se mueve con el mismo slider / Play que el gráfico de puntos: regiones.js
// llama a Mapa.actualizar(anio) cada vez que cambia el año.
// Al pasar el cursor por una región: tooltip + su nota (igual que en el gráfico de puntos),
// y se destaca su punto en el gráfico de al lado.

const Mapa = (() => {

    const GEO_PATH = "data/regiones.geojson";

    const width = 260;
    const height = 650;       // misma altura que el gráfico de puntos, para alinearlos

    const COLOR_HOMBRES = "#2a78d6";
    const COLOR_PARIDAD = "#e4e3df";
    const COLOR_MUJERES = "#eb6834";
    const COLOR_SIN_DATOS = "url(#sin-datos)";   // rayado: no se confunde con la paridad (gris)

    // ±20 puntos alrededor de la paridad cubre toda la serie (33 % – 57 %)
    const color = d3.scaleDiverging()
        .domain([0.30, 0.50, 0.70])
        .interpolator(d3.piecewise(d3.interpolateLab, [COLOR_HOMBRES, COLOR_PARIDAD, COLOR_MUJERES]))
        .clamp(true);

    let regiones = null;       // features del GeoJSON
    let anioPendiente = null;  // si el año cambia antes de que cargue el mapa

    const svg = d3.select("#mapa")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        // Tope de tamaño aunque el CSS no cargue: nunca más alto que 650 px ni que 3/4 de la pantalla
        .style("display", "block")
        .style("max-width", `${width}px`)
        .style("max-height", "min(650px, 75vh)")   // cabe completo en pantallas bajas
        .style("margin", "0 auto");


    // --------------------------------------------------------
    // Leyenda (barra de color)
    // --------------------------------------------------------

    function dibujarLeyenda() {
        const w = 180, x0 = (width - w) / 2, y0 = height - 48;

        const defs = svg.append("defs");

        // Rayado para regiones sin datos (aún no creadas o sin matrícula ese año)
        const patron = defs.append("pattern")
            .attr("id", "sin-datos")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4).attr("height", 4)
            .attr("patternTransform", "rotate(45)");
        patron.append("rect").attr("width", 4).attr("height", 4).attr("fill", "white");
        patron.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 4)
            .attr("stroke", "#bbb").attr("stroke-width", 1.5);

        const grad = defs.append("linearGradient")
            .attr("id", "grad-paridad");

        d3.range(0, 1.01, 0.1).forEach(t => {
            grad.append("stop")
                .attr("offset", `${t * 100}%`)
                .attr("stop-color", color(0.30 + t * 0.40));
        });

        const g = svg.append("g").attr("class", "leyenda-mapa");

        g.append("rect")
            .attr("x", x0).attr("y", y0)
            .attr("width", w).attr("height", 10)
            .attr("rx", 2)
            .attr("fill", "url(#grad-paridad)");

        [[0, "30 %"], [0.5, "50 %"], [1, "70 % mujeres"]].forEach(([t, txt]) => {
            g.append("text")
                .attr("x", x0 + t * w)
                .attr("y", y0 + 24)
                .attr("text-anchor", t === 0 ? "start" : t === 1 ? "end" : "middle")
                .text(txt);
        });

        g.append("rect")
            .attr("x", x0).attr("y", y0 + 32)
            .attr("width", 12).attr("height", 10)
            .attr("fill", "url(#sin-datos)")
            .attr("stroke", "#bbb").attr("stroke-width", 0.5);

        g.append("text")
            .attr("x", x0 + 18).attr("y", y0 + 41)
            .text("Sin datos ese año");

        g.append("line")
            .attr("x1", x0 + w / 2).attr("x2", x0 + w / 2)
            .attr("y1", y0 - 3).attr("y2", y0 + 13)
            .attr("class", "parity-line");
    }


    // --------------------------------------------------------
    // Dibujar
    // --------------------------------------------------------

    function dibujar(geo) {
        regiones = geo.features;

        dibujarLeyenda();       // también crea el rayado de "sin datos"

        // Dejamos espacio abajo para la leyenda
        const proyeccion = d3.geoMercator()
            .fitExtent([[10, 10], [width - 10, height - 70]], geo);

        const path = d3.geoPath(proyeccion);

        svg.append("g")
            .attr("class", "regiones-mapa")
            .selectAll("path")
            .data(regiones, d => d.properties.region)
            .join("path")
            .attr("class", "region-mapa")
            .attr("d", path)
            .attr("fill", COLOR_SIN_DATOS)
            .on("mouseenter", function (event, d) {
                d3.select(this).raise().classed("activa", true);
                destacarPunto(d.properties.region, true);

                if (d.dato) {
                    mostrarDetalle(event, d.dato);     // tooltip + sonido (regiones.js)
                } else {
                    tooltip.style("opacity", 1).html(
                        `<strong>${d.properties.region}</strong><br>Sin datos este año (región aún no creada o sin matrícula registrada)`
                    );
                    moverTooltip(event);
                }
            })
            .on("mousemove", moverTooltip)
            .on("mouseleave", function (event, d) {
                d3.select(this).classed("activa", false);
                destacarPunto(d.properties.region, false);
                ocultarTooltip();
            });
    }


    // Resalta el punto de la misma región en el gráfico de puntos (linking)
    function destacarPunto(region, activo) {
        d3.selectAll(".region-point")
            .filter(d => d.region === region)
            .classed("destacado", activo)
            .attr("r", activo ? 9 : 6);
    }


    // --------------------------------------------------------
    // Actualizar colores para un año
    // --------------------------------------------------------

    function actualizar(anio) {
        if (!regiones) {
            anioPendiente = anio;
            return;
        }

        const porRegion = new Map(
            allData
                .filter(d => d.anio === anio && hasValidData(d))
                .map(d => [d.region, d])
        );

        regiones.forEach(f => { f.dato = porRegion.get(f.properties.region) || null; });

        const paths = svg.selectAll(".region-mapa");

        // Sin datos: rayado inmediato (un patrón no se puede interpolar)
        paths.filter(d => !d.dato)
            .interrupt()
            .attr("fill", COLOR_SIN_DATOS);

        // Región que recién aparece: pasa del rayado al color sin animar
        paths.filter(function (d) {
                return d.dato && String(this.getAttribute("fill")).startsWith("url");
            })
            .attr("fill", d => color(d.dato.prop_mujeres));

        paths.filter(d => d.dato)
            .transition()
            .duration(300)
            .attr("fill", d => color(d.dato.prop_mujeres));
    }


    d3.json(GEO_PATH).then(geo => {
        dibujar(geo);
        if (anioPendiente !== null) actualizar(anioPendiente);
    });

    return { actualizar };

})();
