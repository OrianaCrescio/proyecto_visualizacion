// ============================================================
// CONFIGURACIÓN
// ============================================================

const DATA_PATH = "data/processed/matricula_genero_region.csv";

const INITIAL_YEAR = 1984;

const width = 1100;
const height = 650;

const margin = {
    top: 60,
    right: 60,
    bottom: 50,
    left: 280
};


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let allData = [];

let xScale;
let yScale;

let animationInterval = null;
let isPlaying = false;

const ANIMATION_SPEED = 700;


// ============================================================
// SVG
// ============================================================

const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");


// ============================================================
// CARGAR DATOS
// ============================================================

d3.csv(DATA_PATH)
    .then(data => {

        // ----------------------------------------------------
        // Convertir valores numéricos
        // ----------------------------------------------------

        data.forEach(d => {

            d.anio = +d.anio;
            d.hombres = +d.hombres;
            d.mujeres = +d.mujeres;
            d.no_binario = +d.no_binario;
            d.total = +d.total;
            d.prop_mujeres = +d.prop_mujeres;
            d.diferencia_paridad = +d.diferencia_paridad;

        });


        // Guardar todos los datos
        allData = data;


        console.log("Datos cargados:", allData);


        // ----------------------------------------------------
        // Crear estructura
        // ----------------------------------------------------

        initializeVisualization();


        // ----------------------------------------------------
        // Mostrar año inicial
        // ----------------------------------------------------

        updateYear(INITIAL_YEAR);


        // ----------------------------------------------------
        // Activar slider
        // ----------------------------------------------------

        initializeSlider();


        // ----------------------------------------------------
        // Activar botón de sonido
        // ----------------------------------------------------

        initializeSoundButton();

    })

    .catch(error => {

        console.error(
            "Error cargando los datos:",
            error
        );

    });


// ============================================================
// COMPROBAR SI UNA OBSERVACIÓN TIENE DATOS VÁLIDOS
// ============================================================

function hasValidData(d) {

    return (
        Number.isFinite(d.prop_mujeres) &&
        Number.isFinite(d.total) &&
        d.total > 0
    );

}


// ============================================================
// INICIALIZAR VISUALIZACIÓN
// ============================================================

function initializeVisualization() {

    // ========================================================
    // OBTENER TODAS LAS REGIONES
    // ========================================================

    // No usamos solamente 1984 porque algunas regiones
    // aparecen más adelante en la serie histórica.

    const nombresRegiones = Array.from(
        new Set(
            allData
                .filter(d => d.region !== "Chile")
                .map(d => d.region)
        )
    );


    // ========================================================
    // DOMINIO FIJO: 0% - 100%
    // ========================================================

    // prop_mujeres está guardada como proporción:
    // 0   = 0%
    // 0.5 = 50%
    // 1   = 100%

    const xMin = 0;
    const xMax = 1;


    // ========================================================
    // ESCALA X
    // ========================================================

    xScale = d3
        .scaleLinear()
        .domain([
            xMin,
            xMax
        ])
        .range([
            margin.left,
            width - margin.right
        ]);


    // ========================================================
    // ESCALA Y
    // ========================================================

    yScale = d3
        .scaleBand()
        .domain(nombresRegiones)
        .range([
            margin.top,
            height - margin.bottom - 50
        ])
        .padding(0.4);


    // ========================================================
    // EJE X
    // ========================================================

    // Dejamos que D3 calcule ticks apropiados según
    // el rango real encontrado.

    const xAxis = d3
        .axisTop(xScale)
        .tickValues(
            d3.range(0, 1.01, 0.1)
        )
        .tickFormat(
            d3.format(".0%")
        );


    svg
        .append("g")
        .attr("class", "axis")
        .attr(
            "transform",
            `translate(0, ${margin.top - 25})`
        )
        .call(xAxis);


    // ========================================================
    // LÍNEA DE PARIDAD
    // ========================================================

    svg
        .append("line")
        .attr("class", "parity-line")
        .attr("x1", xScale(0.5))
        .attr("x2", xScale(0.5))
        .attr("y1", margin.top - 10)
        .attr("y2", height - margin.bottom);


    // Por ahora quitamos el texto "Paridad 50%"
    // porque el eje ya muestra claramente el 50%.
    //
    // Esto también evita que se superponga con el tick.


    // ========================================================
    // LÍNEAS HORIZONTALES
    // ========================================================

    svg
        .selectAll(".region-line")
        .data(
            nombresRegiones,
            d => d
        )
        .join("line")

        .attr("class", "region-line")

        .attr(
            "x1",
            xScale(xMin)
        )

        .attr(
            "x2",
            xScale(xMax)
        )

        .attr(
            "y1",
            region =>
                yScale(region)
                + yScale.bandwidth() / 2
        )

        .attr(
            "y2",
            region =>
                yScale(region)
                + yScale.bandwidth() / 2
        );


    // ========================================================
    // NOMBRES DE REGIONES
    // ========================================================

    svg
        .selectAll(".region-label")
        .data(
            nombresRegiones,
            d => d
        )
        .join("text")

        .attr("class", "region-label")

        .attr(
            "x",
            margin.left - 15
        )

        .attr(
            "y",
            region =>
                yScale(region)
                + yScale.bandwidth() / 2
        )

        .attr(
            "text-anchor",
            "end"
        )

        .attr(
            "dominant-baseline",
            "middle"
        )

        .text(
            region => nombreCorto(region)
        );


    // ========================================================
    // CHILE
    // ========================================================

    const chileY = height - 45;


    // Línea nacional

    svg
        .append("line")
        .attr("class", "chile-line")
        .attr("x1", xScale(xMin))
        .attr("x2", xScale(xMax))
        .attr("y1", chileY)
        .attr("y2", chileY);


    // Nombre

    svg
        .append("text")
        .attr("class", "chile-label")
        .attr("x", margin.left - 15)
        .attr("y", chileY)

        .attr(
            "dominant-baseline",
            "middle"
        )

        .attr(
            "text-anchor",
            "end"
        )

        .text("CHILE");


    // Punto nacional

    svg
        .append("circle")
        .attr("class", "chile-point")
        .attr("cy", chileY)
        .attr("r", 8)
        .on("mouseenter", mostrarDetalle)
        .on("mousemove", moverTooltip)
        .on("mouseleave", ocultarTooltip);

}


// ============================================================
// ACTUALIZAR AÑO
// ============================================================

function updateYear(year) {
    d3
        .select("#year-slider")
        .property("value", year);

    // ========================================================
    // OBTENER DATOS DEL AÑO
    // ========================================================

    const yearData = allData.filter(
        d => d.anio === year
    );


    // --------------------------------------------------------
    // Solo conservamos regiones que realmente tienen datos
    // --------------------------------------------------------

    const regiones = yearData.filter(
        d =>
            d.region !== "Chile" &&
            hasValidData(d)
    );


    const chile = yearData.find(
        d =>
            d.region === "Chile" &&
            hasValidData(d)
    );


    // ========================================================
    // ACTUALIZAR TEXTO DEL AÑO
    // ========================================================

    d3
        .select("#year")
        .text(year);


    // ========================================================
    // ACTUALIZAR PUNTOS REGIONALES
    // ========================================================

    const puntos = svg
        .selectAll(".region-point")
        .data(
            regiones,
            d => d.region
        );


    // --------------------------------------------------------
    // ENTER
    //
    // Una región que antes no tenía datos ahora sí tiene.
    //
    // El punto aparece INMEDIATAMENTE en su posición.
    // No viene desplazándose desde ningún sitio.
    // --------------------------------------------------------

    puntos
        .enter()
        .append("circle")

        .attr(
            "class",
            "region-point"
        )

        .attr(
            "cx",
            d => xScale(d.prop_mujeres)
        )

        .attr(
            "cy",
            d =>
                yScale(d.region)
                + yScale.bandwidth() / 2
        )

        .attr("r", 6)

        // Details on demand: tooltip + nota de la región
        .on("mouseenter", mostrarDetalle)
        .on("mousemove", moverTooltip)
        .on("mouseleave", ocultarTooltip);


    // --------------------------------------------------------
    // UPDATE
    //
    // Si la región tenía datos antes y sigue teniendo datos,
    // su punto sí se mueve suavemente.
    // --------------------------------------------------------

    puntos
        .transition()
        .duration(300)

        .attr(
            "cx",
            d => xScale(d.prop_mujeres)
        )

        .attr(
            "cy",
            d =>
                yScale(d.region)
                + yScale.bandwidth() / 2
        );


    // --------------------------------------------------------
    // EXIT
    //
    // Si una región deja de tener datos:
    //
    // DESAPARECE INMEDIATAMENTE.
    //
    // No hacemos transition().
    // --------------------------------------------------------

    puntos
        .exit()
        .remove();


    // ========================================================
    // ACTUALIZAR OPACIDAD DE NOMBRES
    // ========================================================

    const regionesConDatos = new Set(
        regiones.map(d => d.region)
    );


    svg
        .selectAll(".region-label")
        .style(
            "opacity",
            region =>
                regionesConDatos.has(region)
                    ? 1
                    : 0.3
        );


    // ========================================================
    // ACTUALIZAR CHILE
    // ========================================================

    if (chile) {

        svg
            .select(".chile-point")

            .style(
                "display",
                null
            )

            .transition()

            .duration(300)

            .attr(
                "cx",
                xScale(chile.prop_mujeres)
            );

        // Guardamos el dato para el tooltip del punto nacional
        svg
            .select(".chile-point")
            .datum(chile);

        // Sonificación: nota del país para este año
        Sonido.tocar(chile.prop_mujeres);

    } else {

        // Por seguridad:
        // si algún año no tuviera dato nacional,
        // desaparece inmediatamente.

        svg
            .select(".chile-point")
            .interrupt()
            .style(
                "display",
                "none"
            );

    }

}


// ============================================================
// SLIDER
// ============================================================

function initializeSlider() {

    const slider = d3.select("#year-slider");

    const playButton = d3.select("#play-button");

    // --------------------------------------------------------
    // SLIDER MANUAL
    // --------------------------------------------------------

    slider.on(
        "input",
        function () {

            const selectedYear = +this.value;

            updateYear(selectedYear);
        }
    );


    // --------------------------------------------------------
    // BOTÓN PLAY / PAUSA
    // --------------------------------------------------------

    playButton.on(
        "click",
        function () {

            if (isPlaying) {

                pauseAnimation();

            } else {

                startAnimation();

            }

        }
    );
}

// ============================================================
// INICIAR ANIMACIÓN
// ============================================================

function startAnimation() {

    const slider = d3.select("#year-slider");
    const playButton = d3.select("#play-button");

    const minYear = +slider.attr("min");
    const maxYear = +slider.attr("max");

    let currentYear = +slider.property("value");


    // Si estamos en el último año,
    // comenzamos nuevamente desde el primero.

    if (currentYear >= maxYear) {

        currentYear = minYear;

        slider.property(
            "value",
            currentYear
        );

        updateYear(currentYear);
    }


    isPlaying = true;

    playButton.text("⏸ Pausa");


    animationInterval = setInterval(
        () => {

            currentYear++;


            // Si llegamos al final,
            // detenemos la animación.

            if (currentYear > maxYear) {

                pauseAnimation();

                return;
            }


            // Actualizar slider

            slider.property(
                "value",
                currentYear
            );


            // Actualizar visualización

            updateYear(currentYear);

        },

        ANIMATION_SPEED
    );
}


// ============================================================
// PAUSAR ANIMACIÓN
// ============================================================

function pauseAnimation() {

    clearInterval(animationInterval);

    animationInterval = null;

    isPlaying = false;


    d3
        .select("#play-button")
        .text("▶ Play");
}

// ============================================================
// TOOLTIP (details on demand)
// ============================================================

const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Formato chileno: 1.534 y 54,8 %
const localeCL = d3.formatLocale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["$", ""],
    percent: " %"
});

const formatoMiles = localeCL.format(",");
const formatoPct = localeCL.format(".1%");


// "Región De Aysén Del Gral. Carlos..." → "Aysén"-style nombres cortos
// para que las etiquetas no se corten a la izquierda del gráfico.
function nombreCorto(region) {
    return region
        .replace(/^Región (De|Del|de|del) /, "")
        .replace("Aysén Del Gral. Carlos Ibáñez Del Campo", "Aysén")
        .replace("Magallanes Y De La Antártica Chilena", "Magallanes")
        .replace("Libertador Gral. Bernardo O'higgins", "O'Higgins")
        .replace(/^Región Metropolitana De Santiago$/, "Metropolitana")
        .replace("Metropolitana De Santiago", "Metropolitana")
        .replace(" Y ", " y ")
        .replace(/^La /, "La ")
        .replace(/^Los /, "Los ");
}


function mostrarDetalle(event, d) {

    if (!d) return;

    tooltip
        .style("opacity", 1)
        .html(`
            <strong>${d.region}</strong> · ${d.anio}<br>
            Mujeres: <strong>${formatoPct(d.prop_mujeres)}</strong><br>
            ${formatoMiles(d.mujeres)} mujeres · ${formatoMiles(d.hombres)} hombres
        `);

    moverTooltip(event);

    // La misma regla de sonido que el país: se compara con la nota de paridad
    Sonido.tocar(d.prop_mujeres, { volumen: 0.18, duracion: 0.35 });
}


function moverTooltip(event) {

    tooltip
        .style("left", `${event.pageX + 14}px`)
        .style("top", `${event.pageY - 10}px`);
}


function ocultarTooltip() {

    tooltip.style("opacity", 0);
}


// ============================================================
// BOTÓN DE SONIDO
// ============================================================

function initializeSoundButton() {

    const boton = d3.select("#sound-button");

    boton.on("click", function () {

        const activo = Sonido.alternar();

        boton
            .text(activo ? "🔊 Sonido activado" : "🔈 Activar sonido")
            .classed("activo", activo);

        // Al activar, suena el año actual para escuchar la referencia
        if (activo) {
            updateYear(+d3.select("#year-slider").property("value"));
        }
    });
}
