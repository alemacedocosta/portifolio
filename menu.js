/* ===== Menu mobile: overlay em tela cheia =====
   Monta o menu a partir dos links que já existem no <nav class="menu">,
   então funciona na home (#secoes) e nas páginas de projeto (Back).
   Não altera o menu do desktop: o overlay só existe abaixo de 1024px. */
(function () {
    "use strict";

    if (window.__mmenuReady) return;
    window.__mmenuReady = true;

    // o clique antigo (trocarSVGMenu) só trocava o ícone; agora quem manda é este módulo
    window.trocarSVGMenu = function () {};

    var nav = document.querySelector(".menu");
    if (!nav) return;

    var PT = (document.documentElement.lang || "").toLowerCase().indexOf("pt") === 0;
    var L = PT
        ? { menu: "Menu", open: "Abrir menu", close: "Fechar menu" }
        : { menu: "Menu", open: "Open menu", close: "Close menu" };

    var list = nav.querySelector("ul");
    var toggle = document.getElementById("hamburguer") || nav.querySelector(".menu-icon .icone");
    if (!list || !toggle) return;

    var SOCIALS = [
        {
            label: "Instagram",
            href: "https://www.instagram.com/alemacedocosta/",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="dot" cx="17.3" cy="6.7" r="0.9"/></svg>'
        },
        {
            label: "Behance",
            href: "https://www.behance.net/alexandremacedocosta",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h6.5a3 3 0 0 1 0 6H3zM3 11h7a3.2 3.2 0 0 1 0 6.4H3z"/><path d="M14 9h7M14.3 13.5a3.7 3.7 0 1 0 6.9 1.2h-6.9"/></svg>'
        },
        {
            label: "WhatsApp",
            href: "https://api.whatsapp.com/send?phone=5511991371188",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8.1 19z"/><path d="M9 8.5c.3 2.6 2.6 5.2 5.4 6l1.2-1.2 2 .9-.5 1.6c-.3.6-1 .9-1.6.7-3.6-1-6.1-3.6-6.8-6.8-.2-.6.1-1.3.7-1.6l1.5-.5.9 2z"/></svg>'
        }
    ];

    // ---- links do menu, na ordem em que já estão no HTML ----
    var links = Array.prototype.slice.call(list.querySelectorAll(":scope > li > a"));

    var itemsHTML = links.map(function (a, i) {
        var href = a.getAttribute("href") || "#";
        var text = a.textContent.trim();
        return (
            '<a class="mmenu__link" href="' + href + '" style="--i:' + i + '">' +
            '<span class="mmenu__label">' + text + "</span>" +
            '<svg class="mmenu__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            "</a>"
        );
    }).join("");

    var socialsHTML = SOCIALS.map(function (s) {
        return (
            '<a class="mmenu__soc" href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' +
            s.svg + "</a>"
        );
    }).join("");

    // ---- overlay ----
    var overlay = document.createElement("div");
    overlay.className = "mmenu";
    overlay.id = "mmenu";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", L.menu);
    overlay.setAttribute("aria-hidden", "true");
    overlay.tabIndex = -1;
    overlay.inert = true;
    overlay.innerHTML =
        '<div class="mmenu__top">' +
            '<span class="mmenu__brand">' +
                '<img class="mmenu__logo" src="assets/img_logo_ar_white_v2.png" alt="">' +
                '<span class="mmenu__brandtxt">Menu</span>' +
            "</span>" +
            '<button type="button" class="mmenu__close" aria-label="' + L.close + '">' +
                "<span></span>" +
            "</button>" +
        "</div>" +
        '<nav class="mmenu__nav" aria-label="Navegação">' + itemsHTML + "</nav>" +
        '<div class="mmenu__bottom">' +
            '<div class="mmenu__social">' + socialsHTML + "</div>" +
            '<p class="mmenu__meta">alemedo@gmail.com &middot; S&atilde;o Paulo, BR</p>' +
        "</div>";

    document.body.appendChild(overlay);

    toggle.setAttribute("aria-controls", "mmenu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", L.open);

    var docEl = document.documentElement;
    var lastFocus = null;

    function focusables() {
        return overlay.querySelectorAll('a[href], button:not([disabled])');
    }

    function open() {
        if (overlay.classList.contains("is-open")) return;
        lastFocus = document.activeElement;
        overlay.inert = false;
        overlay.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
        docEl.classList.add("menu-open");
        overlay.classList.add("is-open");

        // foca o próprio diálogo: o leitor de tela anuncia o menu sem
        // deixar o primeiro item já destacado como se estivesse em hover
        overlay.focus({ preventScroll: true });
    }

    function close(restoreFocus) {
        if (!overlay.classList.contains("is-open")) return;

        overlay.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", L.open);
        docEl.classList.remove("menu-open");

        // tira o foco antes de esconder do leitor de tela
        if (restoreFocus !== false) {
            if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
            else toggle.focus({ preventScroll: true });
        }

        overlay.setAttribute("aria-hidden", "true");
        // bloqueia Tab/clique já durante a animação de saída
        overlay.inert = true;
    }

    toggle.addEventListener("click", function (e) {
        e.preventDefault();
        open();
    });

    overlay.addEventListener("click", function (e) {
        var link = e.target.closest ? e.target.closest(".mmenu__link") : null;
        if (link) { close(false); return; }          // deixa o link navegar
        if (e.target.closest(".mmenu__soc")) return;  // rede social: abre em outra aba
        if (e.target.closest(".mmenu__close")) { close(true); return; }
        if (e.target === overlay) close(true);        // clique no fundo
    });

    document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("is-open")) return;

        if (e.key === "Escape") { close(true); return; }

        if (e.key === "Tab") {
            var f = focusables();
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // se a janela crescer (tablet/desktop), fecha o overlay
    window.addEventListener("resize", function () {
        if (window.innerWidth > 1024) close(false);
    });
})();
