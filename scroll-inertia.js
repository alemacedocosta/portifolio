/* Inércia de scroll para mouse/trackpad (desktop).
   - Não intercepta áreas com scroll próprio (textarea, listas, etc.)
   - Não roda em telas de toque nem com prefers-reduced-motion
   - Funciona para cima e para baixo                                       */
(function () {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var EASE = 0.08; // menor = mais "molenga"
    var target = window.scrollY || 0;
    var current = target;
    var running = false;

    function maxScroll() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    function clamp(v) {
        return Math.max(0, Math.min(maxScroll(), v));
    }
    function paint(v) {
        // "instant" ignora o scroll-behavior: smooth do CSS durante a animação
        window.scrollTo({ top: v, behavior: "instant" });
    }
    function frame() {
        var diff = target - current;
        if (Math.abs(diff) < 0.4) {
            current = target;
            paint(current);
            running = false;
            return;
        }
        current += diff * EASE;
        paint(current);
        requestAnimationFrame(frame);
    }
    function start() {
        if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    }
    function hasOwnScroll(el) {
        for (var node = el; node && node !== document.body; node = node.parentElement) {
            var cs = window.getComputedStyle(node);
            var oy = cs.overflowY;
            if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) return true;
        }
        return false;
    }

    window.addEventListener("wheel", function (e) {
        if (e.ctrlKey || e.metaKey) return;   // pinch/zoom do trackpad
        if (maxScroll() <= 0) return;         // páginas em que o body é o scroller (contato/obrigado)
        if (hasOwnScroll(e.target)) return;   // textarea e outros scrollers internos

        e.preventDefault();

        // se a posição mudou por barra/teclado/âncora, ressincroniza
        if (Math.abs(window.scrollY - current) > 1.5) {
            current = window.scrollY;
            target = window.scrollY;
        }

        var delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 16;             // linhas
        else if (e.deltaMode === 2) delta *= window.innerHeight; // páginas

        target = clamp(target + delta);
        start();
    }, { passive: false });

    window.addEventListener("scroll", function () {
        if (!running) {
            target = window.scrollY;
            current = window.scrollY;
        }
    }, { passive: true });

    window.addEventListener("resize", function () {
        target = clamp(target);
        current = clamp(current);
    });
})();
