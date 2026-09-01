console.log("TRI Something New loaded.");
let heroWaves = null;

function initialiseHeroWaves() {
    const hero = document.querySelector(".hero");

    if (!hero || typeof VANTA === "undefined") {
        return;
    }

    heroWaves = VANTA.WAVES({
        el: hero,

        mouseControls: true,
        touchControls: true,
        gyroControls: false,

        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,

        color: 0x15102f,
        shininess: 30,
        waveHeight: 16,
        waveSpeed: 0.65,
        zoom: 0.9
    });
}

document.addEventListener("DOMContentLoaded", initialiseHeroWaves);

window.addEventListener("beforeunload", () => {
    if (heroWaves) {
        heroWaves.destroy();
    }
});