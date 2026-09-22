console.log("TRI Something New loaded.");

// Flag JS as available immediately (before body renders) so CSS can
// gate the reveal-on-scroll opacity behind .js — if this line never
// runs, the page stays fully visible instead of stuck hidden.
document.documentElement.classList.add("js");

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

function initialiseRevealOnScroll() {
    const groups = new Map();

    document.querySelectorAll(".reveal").forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) {
            groups.set(parent, 0);
        }
        const index = groups.get(parent);
        groups.set(parent, index + 1);
        el.style.setProperty("--reveal-delay", Math.min(index, 5) * 80 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Safety net: if the observer never fires for some elements (older
    // or unusual browser engines), don't let content stay hidden.
    window.setTimeout(() => {
        document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => {
            el.classList.add("in-view");
        });
    }, 2000);
}

function initialiseScrollspy() {
    const dots = document.querySelectorAll(".scrollspy-dot");
    if (!dots.length) {
        return;
    }

    const sections = Array.from(dots)
        .map((dot) => document.getElementById(dot.dataset.section))
        .filter(Boolean);

    if (!sections.length) {
        return;
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById(dot.dataset.section);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const setActive = (id) => {
        dots.forEach((dot) => {
            dot.classList.toggle("active", dot.dataset.section === id);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
}

function initialiseScrollProgress() {
    const bar = document.querySelector(".scroll-progress-bar");
    if (!bar) {
        return;
    }

    let ticking = false;

    const update = () => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        },
        { passive: true }
    );

    update();
}

function initialiseHeroMouseGlow() {
    const hero = document.querySelector(".hero");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) {
        return;
    }

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty("--mx", x + "%");
        hero.style.setProperty("--my", y + "%");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initialiseHeroWaves();
    initialiseRevealOnScroll();
    initialiseScrollspy();
    initialiseScrollProgress();
    initialiseHeroMouseGlow();
});

window.addEventListener("beforeunload", () => {
    if (heroWaves) {
        heroWaves.destroy();
    }
});