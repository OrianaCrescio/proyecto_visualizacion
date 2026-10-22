const tabs = Array.from(document.querySelectorAll('[role="tab"]'));

function activarTab(tab, moverFoco = false) {
    tabs.forEach(item => {
        const activa = item === tab;
        item.setAttribute("aria-selected", String(activa));
        item.tabIndex = activa ? 0 : -1;
        document.getElementById(item.getAttribute("aria-controls")).hidden = !activa;
    });

    if (moverFoco) {
        tab.focus();
    }

    if (tab.id === "tab-regiones") {
        requestAnimationFrame(actualizarEnlacesRegiones);
    }
}

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activarTab(tab));
    tab.addEventListener("keydown", event => {
        let siguiente;

        if (event.key === "ArrowRight") {
            siguiente = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
            siguiente = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
            siguiente = 0;
        } else if (event.key === "End") {
            siguiente = tabs.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        activarTab(tabs[siguiente], true);
    });
});
