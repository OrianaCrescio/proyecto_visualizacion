// ============================================================
// SONIFICACIÓN
// ============================================================
//
// Al pasar el cursor por una región, área o carrera, un acorde coral
// sostenido representa las proporciones de hombres y mujeres del año
// seleccionado. Ambas capas se apagan al salir del elemento.
//
// El audio se inicia automáticamente al pasar el cursor por una región o barra.
//
// V4: el coro de hombres suena a la izquierda y el de mujeres a la derecha, igual
// que en los gráficos ("← hombres", "mujeres →"). En V3 estaba al revés.

const Sonido = (() => {

    const NOTAS_HOMBRES = [65.41, 98.00, 130.81];
    const NOTAS_MUJERES = [523.25, 659.25, 783.99];
    const VOLUMEN_MAXIMO = 0.36;
    const EXPONENTE_CONTRASTE = 2;
    const DURACION_SALIDA = 0.18;

    let ctx = null;
    let salida = null;
    let vocesActuales = null;
    let solicitudAudio = 0;


    function iniciar() {
        if (ctx) return;

        ctx = new (window.AudioContext || window.webkitAudioContext)();
        salida = ctx.createGain();
        salida.gain.value = 0.8;
        salida.connect(ctx.destination);
    }


    function crearVozCoral(frecuencia, formante1, q, femenina, ganancia) {
        const osc = ctx.createOscillator();
        const filtro1 = ctx.createBiquadFilter();
        const filtro2 = ctx.createBiquadFilter();
        const detune = (Math.random() - 0.5) * 15;

        osc.type = femenina ? "triangle" : "sawtooth";
        osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        filtro1.type = "bandpass";
        filtro1.frequency.setValueAtTime(formante1, ctx.currentTime);
        filtro1.Q.setValueAtTime(q, ctx.currentTime);

        filtro2.type = "bandpass";
        filtro2.frequency.setValueAtTime(femenina ? 2800 : 900, ctx.currentTime);
        filtro2.Q.setValueAtTime(q * 1.5, ctx.currentTime);

        osc.connect(filtro1).connect(ganancia);
        osc.connect(filtro2).connect(ganancia);

        let vibrato = null;
        if (femenina) {
            vibrato = ctx.createOscillator();
            const profundidad = ctx.createGain();
            vibrato.frequency.setValueAtTime(5.5, ctx.currentTime);
            profundidad.gain.setValueAtTime(frecuencia * 0.015, ctx.currentTime);
            vibrato.connect(profundidad).connect(osc.frequency);
            vibrato.start();
        }

        osc.start();
        return { osc, vibrato };
    }


    function crearCapa(notas, femenina, pan) {
        const ganancia = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const voces = [];

        ganancia.gain.setValueAtTime(0, ctx.currentTime);

        if (panner) {
            panner.pan.setValueAtTime(pan, ctx.currentTime);
            ganancia.connect(panner).connect(salida);
        } else {
            ganancia.connect(salida);
        }

        notas.forEach(frecuencia => {
            voces.push(crearVozCoral(
                frecuencia,
                femenina ? 1000 : 350,
                femenina ? 3.2 : 4.5,
                femenina,
                ganancia
            ));
        });

        return { ganancia, voces };
    }


    function atenuarCapa(capa, tiempo) {
        capa.ganancia.gain.cancelScheduledValues(tiempo);
        capa.ganancia.gain.setTargetAtTime(0, tiempo, DURACION_SALIDA / 4);

        capa.voces.forEach(({ osc, vibrato }) => {
            osc.stop(tiempo + DURACION_SALIDA + 0.02);
            if (vibrato) vibrato.stop(tiempo + DURACION_SALIDA + 0.02);
        });
    }


    function detener() {
        solicitudAudio += 1;
        if (!vocesActuales || !ctx) return;

        const anteriores = vocesActuales;
        vocesActuales = null;
        const tiempo = ctx.currentTime;

        atenuarCapa(anteriores.hombres, tiempo);
        atenuarCapa(anteriores.mujeres, tiempo);
    }


    function tocar(hombres, mujeres) {
        const total = hombres + mujeres;
        if (!Number.isFinite(total) || total <= 0) return;

        iniciar();
        const solicitud = ++solicitudAudio;

        if (vocesActuales) {
            const anteriores = vocesActuales;
            vocesActuales = null;
            const tiempo = ctx.currentTime;
            atenuarCapa(anteriores.hombres, tiempo);
            atenuarCapa(anteriores.mujeres, tiempo);
        }

        ctx.resume()
            .then(() => {
                if (solicitud !== solicitudAudio) return;

                const hombresRatio = hombres / total;
                const mujeresRatio = mujeres / total;
                const pesoHombres = Math.pow(hombresRatio, EXPONENTE_CONTRASTE);
                const pesoMujeres = Math.pow(mujeresRatio, EXPONENTE_CONTRASTE);
                const pesoMaximo = Math.max(pesoHombres, pesoMujeres);
                const tiempo = ctx.currentTime;
                const capaHombres = crearCapa(NOTAS_HOMBRES, false, -0.35);
                const capaMujeres = crearCapa(NOTAS_MUJERES, true, 0.35);

                capaHombres.ganancia.gain.linearRampToValueAtTime(
                    pesoHombres / pesoMaximo * VOLUMEN_MAXIMO,
                    tiempo + 0.08
                );
                capaMujeres.ganancia.gain.linearRampToValueAtTime(
                    pesoMujeres / pesoMaximo * VOLUMEN_MAXIMO,
                    tiempo + 0.08
                );

                vocesActuales = { hombres: capaHombres, mujeres: capaMujeres };
            })
            .catch(error => {
                console.error("El navegador no permitió iniciar el audio:", error);
            });
    }


    return {
        tocar,
        detener
    };

})();
