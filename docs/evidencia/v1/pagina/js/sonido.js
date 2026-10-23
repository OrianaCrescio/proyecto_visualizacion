// ============================================================
// SONIFICACIÓN
// ============================================================
//
// Qué codifica el sonido:
//
// - Una nota de fondo suave y constante marca la PARIDAD (50 %).
// - Cada año, una nota corta suena con una ALTURA proporcional a la
//   proporción de mujeres en Chile: 1 punto porcentual = 1 semitono.
//     · bajo 50 %  → nota más grave que el fondo
//     · sobre 50 % → nota más aguda que el fondo
//   Al reproducir la serie (Play) se escucha la "melodía" del cambio:
//   parte grave en 1984 (~43 %) y cruza el fondo cuando se alcanza la paridad.
// - Al pasar el cursor por una región suena su nota con la misma regla,
//   así se puede comparar "de oído" con la paridad.
//
// El sonido parte apagado (los navegadores bloquean el audio hasta que
// la persona interactúa) y se activa con el botón "Activar sonido".

const Sonido = (() => {

    const FRECUENCIA_PARIDAD = 220;   // La3 = 50 % de mujeres
    const SEMITONOS_POR_PUNTO = 1;    // 1 punto porcentual = 1 semitono

    let ctx = null;
    let salida = null;
    let fondo = null;
    let activo = false;


    // prop (0–1) → frecuencia en Hz
    function frecuencia(prop) {
        const puntos = (prop - 0.5) * 100;
        const semitonos = puntos * SEMITONOS_POR_PUNTO;
        return FRECUENCIA_PARIDAD * Math.pow(2, semitonos / 12);
    }


    function iniciar() {
        if (ctx) return;

        ctx = new (window.AudioContext || window.webkitAudioContext)();

        salida = ctx.createGain();
        salida.gain.value = 0.8;
        salida.connect(ctx.destination);
    }


    // Nota de fondo continua: la referencia de paridad
    function encenderFondo() {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = FRECUENCIA_PARIDAD;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);

        osc.connect(gain).connect(salida);
        osc.start();

        fondo = { osc, gain };
    }


    function apagarFondo() {
        if (!fondo) return;

        const t = ctx.currentTime;
        fondo.gain.gain.cancelScheduledValues(t);
        fondo.gain.gain.setValueAtTime(fondo.gain.gain.value, t);
        fondo.gain.gain.linearRampToValueAtTime(0, t + 0.3);
        fondo.osc.stop(t + 0.35);
        fondo = null;
    }


    // Nota corta (tipo campana suave) para un valor de prop_mujeres
    function tocar(prop, { duracion = 0.45, volumen = 0.25 } = {}) {
        if (!activo || !Number.isFinite(prop)) return;

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.value = frecuencia(prop);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(volumen, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duracion);

        osc.connect(gain).connect(salida);
        osc.start(t);
        osc.stop(t + duracion + 0.05);
    }


    function alternar() {
        iniciar();

        activo = !activo;

        if (activo) {
            ctx.resume();
            encenderFondo();
        } else {
            apagarFondo();
        }

        return activo;
    }


    return {
        alternar,
        tocar,
        estaActivo: () => activo
    };

})();
