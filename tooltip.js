(function () {
    var boxes = document.querySelectorAll(".tooltip");
    if (!boxes.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var SPEED = 38; // ms por letra

    // diferencia teclado de mouse: clique não pode deixar o tooltip "aceso"
    var kbd = false;
    document.addEventListener("keydown", function () { kbd = true; }, true);
    document.addEventListener("pointerdown", function () { kbd = false; }, true);

    boxes.forEach(function (box) {
        var tip = box.querySelector(".tooltip-text");
        if (!tip || tip.dataset.tipReady) return;
        tip.dataset.tipReady = "1";

        // guarda o texto original e envolve num span, para o cursor
        // poder ficar no fim (o ::after da caixa é o rabicho)
        var full = tip.textContent.trim();
        tip.setAttribute("data-text", full);
        tip.setAttribute("role", "tooltip");

        var inner = document.createElement("span");
        inner.className = "tip-t";
        inner.textContent = full;
        tip.textContent = "";
        tip.appendChild(inner);

        // o texto vem sempre do data-text, para poder ser trocado em tempo real
        function currentText() { return tip.getAttribute("data-text") || ""; }
        function isVisible() { return getComputedStyle(tip).visibility === "visible"; }

        inner.textContent = currentText();

        function stop() {
            if (tip._timer) { clearInterval(tip._timer); tip._timer = null; }
        }

        function type() {
            stop();
            var full = currentText();
            inner.textContent = "";
            tip.style.minWidth = "";

            if (reduce) {
                inner.textContent = full;
                return;
            }

            // mede a largura final (já com o cursor) e reserva, para a
            // caixa não mudar de tamanho a cada letra
            tip.classList.add("is-typing");
            inner.textContent = full;
            tip.style.minWidth = tip.offsetWidth + "px";
            inner.textContent = "";

            var i = 0;
            tip._timer = setInterval(function () {
                i++;
                inner.textContent = full.slice(0, i);
                if (i >= full.length) {
                    stop();
                    tip.classList.remove("is-typing");
                }
            }, SPEED);
        }

        function reset() {
            stop();
            tip.classList.remove("is-typing");
            tip.style.minWidth = "";
            inner.textContent = currentText();
        }

        // API para trocar o texto (usada pelo toggle show/hide)
        tip.setText = function (value) {
            tip.setAttribute("data-text", value);
            tip.style.minWidth = "";
            if (isVisible()) type();
            else inner.textContent = value;
        };

        // nos cards de Skills o gatilho do mouse é o card inteiro, não só a barra;
        // o tooltip continua ancorado na barra, no mesmo lugar
        var trigger = box.closest(".level-counter") || box;
        trigger.addEventListener("mouseenter", type);
        trigger.addEventListener("mouseleave", reset);

        // foco: só quando veio do teclado. Depois de um clique, o botão
        // continua focado, mas o tooltip não deve ficar aberto.
        box.addEventListener("focusin", function () {
            if (!kbd) return;
            box.classList.add("is-focus");
            type();
        });
        box.addEventListener("focusout", function () {
            box.classList.remove("is-focus");
            reset();
        });
    });
})();
