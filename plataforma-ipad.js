// Plataforma: as páginas da edição passando dentro de um iPad branco
(function () {
    var root = document.querySelector(".ipad-showcase");
    if (!root) return;
    var img = root.querySelector(".ipad__page");
    var dotsEl = root.querySelector(".ipad-showcase__dots");
    var prevBtn = root.querySelector(".ipad-showcase__arrow--prev");
    var nextBtn = root.querySelector(".ipad-showcase__arrow--next");
    var screen = root.querySelector(".ipad__screen");
    if (!img || !dotsEl) return;

    var paginas = [
        { titulo: "Concrete jungle", texto: "O projeto curatorial da primeira edição: obras e textos que recortam a produção brasileira contemporânea.", pagina: "assets/projetos/plataforma/paginas/Curadoria_pagina.jpg" },
        { titulo: "Kotler's lessons", texto: "O anúncio do projeto curatorial de Ana Maria Maia, que abre a primeira edição da revista.", pagina: "assets/projetos/plataforma/paginas/Curadoria_anunciantes_pagina.jpg" },
        { titulo: "Art as cultural capital", texto: "A trajetória de artistas brasileiros no circuito internacional e a geração que veio depois da internacionalização.", pagina: "assets/projetos/plataforma/paginas/01_Internacionalizacao_pagina.jpg" },
        { titulo: "Art, context, critique, and institution", texto: "A institucionalização e a criação de programas curatoriais voltados a práticas site-specific.", pagina: "assets/projetos/plataforma/paginas/02_Bienais_pagina.jpg" },
        { titulo: "Critical and curatorial training in Brazil", texto: "A pesquisa interdisciplinar e as bases históricas e teóricas para a formação de críticos e curadores.", pagina: "assets/projetos/plataforma/paginas/03_FormacaoEmCritica_pagina.jpg" },
        { titulo: "Art, context, critique, and institution", texto: "Um panorama das práticas site-specific do fim dos anos 1990 e início dos 2000.", pagina: "assets/projetos/plataforma/paginas/04_Specific_pagina.jpg" },
        { titulo: "Areas of strength: Brazilian autonomous spaces", texto: "Como espaços independentes, autogeridos ou experimentais ocuparam um lugar estratégico na cena brasileira.", pagina: "assets/projetos/plataforma/paginas/05_EspacosIndependentes_pagina.jpg" },
        { titulo: "The reinvention of the magazine: a conversation with Rodrigo Moura", texto: "Uma conversa sobre a reinvenção da revista e a formação de críticos e curadores no Brasil.", pagina: "assets/projetos/plataforma/paginas/06_Interview_pagina.jpg" }
    ];

    var atual = 0;
    var raf = null;
    var inicio = 0;
    var maxY = 0;
    var visivel = false;
    var DURACAO = 26000;
    var passando = false;

    function montarDots() {
        dotsEl.innerHTML = "";
        paginas.forEach(function (p, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.setAttribute("aria-label", p.titulo);
            b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
            if (i === 0) b.className = "is-active";
            b.addEventListener("click", function () { trocar(i); });
            dotsEl.appendChild(b);
        });
    }
    function marcarDots() {
        Array.prototype.forEach.call(dotsEl.children, function (b, k) {
            b.classList.toggle("is-active", k === atual);
            b.setAttribute("aria-pressed", k === atual ? "true" : "false");
        });
    }
    function medir() {
        var alturaPagina = img.getBoundingClientRect().height;
        var alturaTela = screen.clientHeight;
        maxY = Math.max(0, alturaPagina - alturaTela);
    }
    function parar() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        passando = false;
    }
    function animar() {
        parar();
        if (!maxY || !visivel) return;
        passando = true;
        inicio = performance.now();
        raf = requestAnimationFrame(passo);
    }
    function passo(t) {
        var p = Math.min(1, (t - inicio) / DURACAO);
        // easeInOutQuad: começa e termina devagar, como uma leitura
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        img.style.transform = "translate3d(0," + (-maxY * e).toFixed(2) + "px,0)";
        if (p < 1) {
            raf = requestAnimationFrame(passo);
        } else {
            raf = null;
            passando = false;
            setTimeout(function () { if (visivel) trocar(atual + 1); }, 1400);
        }
    }
    function trocar(n) {
        atual = (n + paginas.length) % paginas.length;
        marcarDots();
        parar();
        img.style.opacity = 0;
        img.style.transform = "translate3d(0,0,0)";
        var nova = paginas[atual].pagina;
        var pre = new Image();
        pre.onload = function () {
            img.src = nova;
            img.style.opacity = 1;
            medir();
            animar();
        };
        pre.src = nova;
        // pré-carrega a seguinte
        var prox = paginas[(atual + 1) % paginas.length];
        var pre2 = new Image();
        pre2.src = prox.pagina;
    }

    img.style.transition = "opacity .4s ease";
    montarDots();
    if (prevBtn) prevBtn.addEventListener("click", function () { trocar(atual - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { trocar(atual + 1); });

    // arraste: no desktop e no touch, troca de página
    var stage = root.querySelector(".ipad-showcase__stage");
    if (stage) {
        var dragStart = null;
        stage.addEventListener("pointerdown", function (e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            if (e.target.closest("button")) return;
            dragStart = e.clientX;
            stage.classList.add("is-dragging");
            try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        });
        stage.addEventListener("pointerup", function (e) {
            if (dragStart === null) return;
            var dx = e.clientX - dragStart;
            dragStart = null;
            stage.classList.remove("is-dragging");
            if (Math.abs(dx) > 50) trocar(atual + (dx < 0 ? 1 : -1));
        });
        stage.addEventListener("pointercancel", function () {
            dragStart = null;
            stage.classList.remove("is-dragging");
        });
    }

    function aoCarregar() {
        img.style.opacity = 1;
        medir();
        if (visivel) animar();
    }
    img.addEventListener("load", aoCarregar);
    if (img.complete && img.naturalWidth) aoCarregar();

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            visivel = entries[0].isIntersecting;
            if (visivel && !passando && img.complete) animar();
            if (!visivel) parar();
        }, { threshold: 0.25 });
        io.observe(root);
    } else {
        visivel = true;
    }
    window.addEventListener("resize", function () {
        medir();
        if (visivel && !passando && img.complete) animar();
    });
    if (img.complete) {
        img.style.opacity = 1;
        medir();
    }
})();
