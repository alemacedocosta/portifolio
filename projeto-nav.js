// Navegação entre projetos — componente único.
// Para mudar a ordem ou os títulos, edite apenas a lista abaixo:
// a mesma navegação aparece em todas as páginas de projeto.
(function () {
    var projetos = [
        { arquivo: "projeto_select.html", titulo: "Select magazine" },
        { arquivo: "projeto_super.html", titulo: "Super Interessante" },
        { arquivo: "projeto_plataforma.html", titulo: "Plataforma" },
        { arquivo: "projeto_escolaaqui.html", titulo: "Escola Aqui" },
        { arquivo: "projeto_ecossistemabv.html", titulo: "Ecossistema Solar BV" }
    ];

    var main = document.querySelector("main");
    if (!main) return;

    var atual = (location.pathname.split("/").pop() || "").split("?")[0];
    var indice = -1;
    for (var i = 0; i < projetos.length; i++) {
        if (projetos[i].arquivo === atual) { indice = i; break; }
    }
    var anterior = projetos[(indice - 1 + projetos.length) % projetos.length];
    var proximo = projetos[(indice + 1) % projetos.length];

    var nav = document.createElement("section");
    nav.className = "proj-next";
    nav.setAttribute("aria-label", "Navegação entre projetos");
    nav.innerHTML =
        '<div class="proj-next__inner">' +
            '<a class="proj-nav proj-nav--prev" href="' + anterior.arquivo + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" /></svg>' +
                '<span class="proj-nav__title">' + anterior.titulo + '</span>' +
            '</a>' +
            '<a class="proj-nav proj-nav--next" href="' + proximo.arquivo + '">' +
                '<span class="proj-nav__title">' + proximo.titulo + '</span>' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>' +
            '</a>' +
        '</div>';
    main.appendChild(nav);

    // cursor "Ver" nos links, igual ao hover dos cards do index
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var cur = document.createElement("div");
    cur.className = "proj-cursor";
    cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = "<span>Ver</span>";
    document.body.appendChild(cur);

    var tx = 0, ty = 0, x = 0, y = 0, on = false, running = false;
    function frame() {
        x += (tx - x) * 0.25;
        y += (ty - y) * 0.25;
        cur.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
        if (on || Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) requestAnimationFrame(frame);
        else running = false;
    }
    function kick() {
        if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    }
    Array.prototype.forEach.call(nav.querySelectorAll("a.proj-nav"), function (link) {
        link.addEventListener("pointerenter", function (e) {
            on = true;
            tx = e.clientX;
            ty = e.clientY;
            x = tx;
            y = ty;
            cur.classList.add("is-on");
            kick();
        });
        link.addEventListener("pointermove", function (e) {
            tx = e.clientX;
            ty = e.clientY;
            kick();
        });
        link.addEventListener("pointerleave", function () {
            on = false;
            cur.classList.remove("is-on");
        });
    });
})();
