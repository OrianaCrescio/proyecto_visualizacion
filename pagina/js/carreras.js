// ============================================================
// VISTA POR ÁREAS Y CARRERAS (pregrado, 2007–2026)
// ============================================================
//
// Cada fila es un área del conocimiento. La barra completa es el 100 % de
// su matrícula: hombres desde la izquierda y mujeres desde la derecha, así
// ambos grupos se ven explícitamente (comentario R1). La línea punteada es
// la paridad y la marca negra indica dónde estaba la división en 2007, para
// comparar el inicio con el año elegido.
//
// Al hacer clic en un área se abren sus carreras (details on demand).

const Carreras = (() => {

    const DATA_PATH = "data/carreras_pregrado.csv";
    const ANIO_BASE = 2007;
    const TOP_CARRERAS = 15;

    const COLOR_HOMBRES = "#2a78d6";
    const COLOR_MUJERES = "#eb6834";

    const width = 1100;
    const margin = { top: 40, right: 110, bottom: 20, left: 300 };
    const MAX_CARACTERES = 42;
    const alturaFila = 34;
    const GAP = 2;

    const fmtPct = localeCL.format(".0%");
    const fmtPct1 = localeCL.format(".1%");
    const fmtMiles = localeCL.format(",");

    let datos = [];            // filas por año × área × carrera
    let porArea = new Map();   // anio -> área -> {hombres, mujeres}
    let anioActual = 2026;
    let areaAbierta = null;

    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([margin.left, width - margin.right]);


    // --------------------------------------------------------
    // Utilidades
    // --------------------------------------------------------

    function sumar(filas) {
        const hombres = d3.sum(filas, d => d.hombres);
        const mujeres = d3.sum(filas, d => d.mujeres);
        const total = hombres + mujeres;
        return { hombres, mujeres, total, propMujeres: total ? mujeres / total : NaN };
    }


    // --------------------------------------------------------
    // Dibujar un gráfico de barras hombres | mujeres
    // --------------------------------------------------------
    //
    // filas: [{ nombre, actual: {…}, base: {…} | null }]

    function dibujar(contenedor, filas, { clickable = false } = {}) {

        const height = margin.top + filas.length * alturaFila + margin.bottom;

        let svg = contenedor.select("svg");

        if (svg.empty()) {
            svg = contenedor.append("svg")
                .attr("width", "100%");

            // Eje superior 0 % – 100 % (mujeres, leído desde la derecha)
            svg.append("g").attr("class", "axis eje-x");

            svg.append("text")
                .attr("class", "leyenda-eje")
                .attr("x", x(0))
                .attr("y", 12)
                .text("← hombres");

            svg.append("text")
                .attr("class", "leyenda-eje")
                .attr("x", x(1))
                .attr("y", 12)
                .attr("text-anchor", "end")
                .text("mujeres →");

            svg.append("g").attr("class", "filas");

            svg.append("line").attr("class", "parity-line");
        }

        svg.attr("viewBox", `0 0 ${width} ${height}`);

        svg.select(".eje-x")
            .attr("transform", `translate(0, ${margin.top - 8})`)
            .call(
                d3.axisTop(x)
                    .tickValues([0.5])
                    .tickFormat(() => "50 %")
                    .tickSize(4)
            );

        svg.select(".parity-line")
            .attr("x1", x(0.5)).attr("x2", x(0.5))
            .attr("y1", margin.top - 6)
            .attr("y2", height - margin.bottom + 4)
            .raise();

        const y = i => margin.top + i * alturaFila;
        const barH = alturaFila - 12;

        const g = svg.select(".filas")
            .selectAll(".fila")
            .data(filas, d => d.nombre)
            .join(enter => {
                const f = enter.append("g").attr("class", "fila");
                f.append("rect").attr("class", "hit");
                f.append("text").attr("class", "region-label nombre");
                f.append("rect").attr("class", "seg-hombres");
                f.append("rect").attr("class", "seg-mujeres");
                f.append("text").attr("class", "valor valor-h");
                f.append("text").attr("class", "valor valor-m");
                f.append("line").attr("class", "marca-base");
                f.append("text").attr("class", "total");
                return f;
            });

        g.classed("clickable", clickable)
            .classed("abierta", d => clickable && d.nombre === areaAbierta);

        g.transition().duration(300)
            .attr("transform", (d, i) => `translate(0, ${y(i)})`);

        g.select(".hit")
            .attr("x", 0).attr("y", 0)
            .attr("width", width).attr("height", alturaFila)
            .attr("fill", "transparent");

        g.select(".nombre")
            .attr("x", margin.left - 12)
            .attr("y", barH / 2 + 6)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(d => {
                const flecha = clickable ? (d.nombre === areaAbierta ? "▾ " : "▸ ") : "";
                const nombre = d.nombre.length > MAX_CARACTERES
                    ? d.nombre.slice(0, MAX_CARACTERES - 1) + "…"
                    : d.nombre;
                return flecha + nombre;
            });

        const split = d => x(1 - d.actual.propMujeres);

        g.select(".seg-hombres")
            .attr("y", 6).attr("height", barH).attr("rx", 3)
            .attr("fill", COLOR_HOMBRES)
            .attr("x", x(0))
            .transition().duration(300)
            .attr("width", d => Math.max(0, split(d) - x(0) - GAP / 2));

        g.select(".seg-mujeres")
            .attr("y", 6).attr("height", barH).attr("rx", 3)
            .attr("fill", COLOR_MUJERES)
            .transition().duration(300)
            .attr("x", d => split(d) + GAP / 2)
            .attr("width", d => Math.max(0, x(1) - split(d) - GAP / 2));

        g.select(".valor-h")
            .attr("x", x(0) + 8)
            .attr("y", barH / 2 + 6)
            .attr("dominant-baseline", "middle")
            .text(d => fmtPct(1 - d.actual.propMujeres))
            .style("display", d => split(d) - x(0) < 36 ? "none" : null);

        g.select(".valor-m")
            .attr("x", x(1) - 8)
            .attr("y", barH / 2 + 6)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(d => fmtPct(d.actual.propMujeres))
            .style("display", d => x(1) - split(d) < 36 ? "none" : null);

        // Marca de 2007 (antes vs. ahora)
        g.select(".marca-base")
            .style("display", d => d.base && anioActual !== ANIO_BASE ? null : "none")
            .attr("y1", 1).attr("y2", barH + 11)
            .transition().duration(300)
            .attr("x1", d => d.base ? x(1 - d.base.propMujeres) : 0)
            .attr("x2", d => d.base ? x(1 - d.base.propMujeres) : 0);

        g.select(".total")
            .attr("x", x(1) + 12)
            .attr("y", barH / 2 + 6)
            .attr("dominant-baseline", "middle")
            .text(d => fmtMiles(d.actual.total));

        // Tooltip
        g.on("mouseenter", (event, d) => {
                const cambio = d.base
                    ? (d.actual.propMujeres - d.base.propMujeres) * 100
                    : null;
                tooltip.style("opacity", 1).html(`
                    <strong>${d.nombre}</strong> · ${anioActual}<br>
                    <span style="color:${COLOR_MUJERES}">■</span> Mujeres: <strong>${fmtPct1(d.actual.propMujeres)}</strong> (${fmtMiles(d.actual.mujeres)})<br>
                    <span style="color:${COLOR_HOMBRES}">■</span> Hombres: <strong>${fmtPct1(1 - d.actual.propMujeres)}</strong> (${fmtMiles(d.actual.hombres)})<br>
                    ${cambio === null ? `Sin datos en ${ANIO_BASE}` :
                        `Mujeres ${cambio >= 0 ? "+" : "−"}${localeCL.format(".1f")(Math.abs(cambio))} puntos desde ${ANIO_BASE}`}
                `);
                moverTooltip(event);
            })
            .on("mousemove", moverTooltip)
            .on("mouseleave", ocultarTooltip);

        if (clickable) {
            g.on("click", (event, d) => {
                areaAbierta = areaAbierta === d.nombre ? null : d.nombre;
                actualizar();
            });
        }
    }


    // --------------------------------------------------------
    // Actualizar ambas vistas para el año actual
    // --------------------------------------------------------

    function actualizar() {

        d3.select("#anio-carreras").text(anioActual);

        // Áreas: orden fijo por % de mujeres en el último año
        // (no se reordenan al mover el slider para no perder la referencia)
        const ultimo = d3.max(datos, d => d.anio);
        const orden = Array.from(porArea.get(ultimo), ([nombre, v]) => ({ nombre, p: v.propMujeres }))
            .sort((a, b) => a.p - b.p)
            .map(d => d.nombre);

        const filasAreas = orden.map(nombre => ({
            nombre,
            actual: porArea.get(anioActual).get(nombre),
            base: porArea.get(ANIO_BASE).get(nombre) || null
        }));

        dibujar(d3.select("#chart-areas"), filasAreas, { clickable: true });

        // Carreras del área abierta
        const panel = d3.select("#detalle-carreras");

        if (!areaAbierta) {
            panel.style("display", "none");
            return;
        }

        panel.style("display", null);
        d3.select("#titulo-detalle").text(
            `${areaAbierta}: las ${TOP_CARRERAS} carreras con más matrícula en ${anioActual}`
        );

        const deArea = datos.filter(d => d.area === areaAbierta);
        const actuales = deArea.filter(d => d.anio === anioActual);
        const base = new Map(
            deArea.filter(d => d.anio === ANIO_BASE).map(d => [d.carrera, d])
        );

        const filasCarreras = actuales
            .map(d => ({
                nombre: d.carrera,
                actual: sumar([d]),
                base: base.has(d.carrera) ? sumar([base.get(d.carrera)]) : null
            }))
            .filter(d => d.actual.total > 0)
            .sort((a, b) => b.actual.total - a.actual.total)
            .slice(0, TOP_CARRERAS)
            .sort((a, b) => a.actual.propMujeres - b.actual.propMujeres);

        d3.select("#chart-carreras").select("svg").remove();   // la lista cambia entera
        dibujar(d3.select("#chart-carreras"), filasCarreras);
    }


    // --------------------------------------------------------
    // Inicio
    // --------------------------------------------------------

    d3.csv(DATA_PATH, d3.autoType).then(filas => {

        datos = filas.filter(d => d.carrera !== "Sin información");

        porArea = d3.rollup(
            filas,
            sumar,
            d => d.anio,
            d => d.area
        );

        const anios = d3.extent(filas, d => d.anio);
        anioActual = anios[1];

        d3.select("#slider-carreras")
            .attr("min", anios[0])
            .attr("max", anios[1])
            .property("value", anioActual)
            .on("input", function () {
                anioActual = +this.value;
                actualizar();
            });

        d3.select("#min-carreras").text(anios[0]);
        d3.select("#max-carreras").text(anios[1]);

        actualizar();
    });

})();
