// Hero dos projetos: a imagem de fundo vai perdendo o foco conforme o scroll
// (e volta ao foco quando se rola de volta).
(function () {
    var hero = document.querySelector(".div-heroprojetos");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!hero.style.backgroundImage) return;

    // camada que herda a imagem do hero para poder receber o blur
    var layer = document.createElement("span");
    layer.className = "hero-blur";
    layer.setAttribute("aria-hidden", "true");
    hero.insertBefore(layer, hero.firstChild);

    var ticking = false;
    function update() {
        ticking = false;
        var vh = window.innerHeight || 1;
        var p = window.scrollY / (vh * 0.75);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        hero.style.setProperty("--hero-blur", (p * 14).toFixed(2) + "px");
        layer.style.transform = "translate3d(0," + (window.scrollY * 0.045).toFixed(2) + "px,0)";
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();
