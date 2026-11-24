/* ===== Som leve de "click" no hover dos cards =====
   O som é sintetizado (Web Audio), sem arquivo de áudio.
   Regras:
   - só em dispositivos com hover (mouse);
   - navegador só libera áudio depois de um gesto do usuário (clique/tecla),
     então o som começa a valer a partir da primeira interação;
   - botão liga/desliga, com preferência salva no localStorage. */
(function () {
    "use strict";

    if (window.__cardSoundReady) return;
    window.__cardSoundReady = true;

    var CARDS = [
        ".portfolio-item",
        ".skills-grid .level-counter",
        "#Timelinesection .container-timeline",
        ".stat",
        ".front"
    ].join(", ");

    var cards = document.querySelectorAll(CARDS);
    if (!cards.length) return;

    // em touch não faz sentido (não há hover)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var STORE = "amc-hover-sound";
    var enabled = true;
    try { enabled = localStorage.getItem(STORE) !== "off"; } catch (e) {}

    var ctx = null;
    var clickBuffer = null;
    var lastPlay = 0;
    var THROTTLE = 110; // ms entre cliques

    function getCtx() {
        if (ctx) return ctx;
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { ctx = null; }
        return ctx;
    }

    function buildClick() {
        // ruído curtinho com decaimento, filtrado: som de "tec" seco
        var frames = Math.max(1, Math.floor(ctx.sampleRate * 0.028));
        var buf = ctx.createBuffer(1, frames, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < frames; i++) {
            var t = i / frames;
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 4);
        }
        return buf;
    }

    function unlock() {
        var c = getCtx();
        if (!c) return;
        if (c.state === "suspended") {
            var p = c.resume();
            if (p && p.catch) p.catch(function () {});
        }
    }

    function play() {
        if (!enabled) return;
        var now = Date.now();
        if (now - lastPlay < THROTTLE) return;
        lastPlay = now;

        var c = getCtx();
        if (!c) return;
        if (c.state === "suspended") {
            // tenta liberar; se o navegador bloquear, o som simplesmente não toca
            var p = c.resume();
            if (p && p.catch) p.catch(function () {});
            return;
        }
        if (!clickBuffer) clickBuffer = buildClick();

        var t0 = c.currentTime;
        var src = c.createBufferSource();
        src.buffer = clickBuffer;

        var bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 2400;
        bp.Q.value = 1.1;

        var hp = c.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 900;

        var g = c.createGain();
        g.gain.value = 0.06;

        src.connect(bp);
        bp.connect(hp);
        hp.connect(g);
        g.connect(c.destination);
        src.start(t0);
        src.stop(t0 + 0.03);
    }

    // ---- botão liga/desliga ----
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sound-toggle";
    btn.innerHTML =
        '<svg class="ico-on" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/>' +
            '<path d="M15.5 9a4.2 4.2 0 0 1 0 6"/>' +
        "</svg>" +
        '<svg class="ico-off" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/>' +
            '<path d="M16 9.5l4.5 5M20.5 9.5L16 14.5"/>' +
        "</svg>";

    function render() {
        btn.classList.toggle("is-off", !enabled);
        btn.setAttribute("aria-pressed", enabled ? "true" : "false");
        btn.setAttribute("aria-label", enabled ? "Disable hover sound" : "Enable hover sound");
        btn.title = enabled ? "Hover sound: on" : "Hover sound: off";
    }

    function setEnabled(on) {
        enabled = !!on;
        try { localStorage.setItem(STORE, enabled ? "on" : "off"); } catch (e) {}
        render();
        if (enabled) {
            unlock();
            lastPlay = 0;
            play(); // feedback ao ligar
        }
    }

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        // o clique é um gesto: aproveita para liberar o áudio
        unlock();
        setEnabled(!enabled);
    });

    // onde encaixar: junto do controle "show/hide" quando existir
    var host = document.querySelector(".container-toogle");
    if (host) {
        host.appendChild(btn);
    } else {
        var dock = document.createElement("div");
        dock.className = "sound-dock";
        dock.appendChild(btn);
        document.body.appendChild(dock);
    }
    render();

    // primeira interação libera o áudio
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);

    // hover nos cards
    Array.prototype.forEach.call(cards, function (el) {
        el.addEventListener("mouseenter", play);
    });

    // ícones animados do hero: a grade é decorativa e fica atrás do texto,
    // então detectamos o tile por coordenadas (mesma lógica do efeito de rastro)
    var hero = document.getElementById("hero");
    var heroGrid = document.querySelector(".hero-icons");
    if (hero && heroGrid) {
        var rects = null;
        var lastIdx = -1;

        function cacheTiles() {
            rects = [];
            var tiles = heroGrid.children;
            for (var i = 0; i < tiles.length; i++) {
                rects.push(tiles[i].getBoundingClientRect());
            }
        }

        hero.addEventListener("pointerenter", function () {
            cacheTiles();
            lastIdx = -1;
        });

        hero.addEventListener("pointermove", function (e) {
            if (!rects) cacheTiles();
            var x = e.clientX;
            var y = e.clientY;
            for (var i = 0; i < rects.length; i++) {
                var r = rects[i];
                if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
                    if (i !== lastIdx) { lastIdx = i; play(); }
                    return;
                }
            }
            lastIdx = -1;
        });

        hero.addEventListener("pointerleave", function () { lastIdx = -1; });
        window.addEventListener("resize", function () { rects = null; });
        window.addEventListener("scroll", function () { rects = null; }, { passive: true });
    }
})();
