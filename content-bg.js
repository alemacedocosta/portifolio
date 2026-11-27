// Pinta o fundo de cada .fotoprojetos com a cor predominante da imagem,
// para a imagem se fundir com o content mesmo quando ela é menor que ele.
(function () {
    function dominantColor(img) {
        var w = 48;
        var h = Math.max(1, Math.round(48 * img.naturalHeight / img.naturalWidth));
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0, 0, w, h).data;
        var buckets = {};
        var best = null;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 128) continue; // ignora pixels transparentes
            var r = data[i], g = data[i + 1], b = data[i + 2];
            var key = (r >> 4) + "," + (g >> 4) + "," + (b >> 4);
            var e = buckets[key];
            if (!e) e = buckets[key] = { n: 0, r: 0, g: 0, b: 0 };
            e.n++; e.r += r; e.g += g; e.b += b;
            if (!best || e.n > best.n) best = e;
        }
        if (!best) return null;
        return "rgb(" + Math.round(best.r / best.n) + "," + Math.round(best.g / best.n) + "," + Math.round(best.b / best.n) + ")";
    }

    function apply(wrap) {
        var img = wrap.querySelector("img");
        if (!img) return;
        function run() {
            if (!img.naturalWidth) return;
            try {
                var color = dominantColor(img);
                if (color) wrap.style.backgroundColor = color;
            } catch (err) {
                // imagem de outra origem (canvas bloqueado): mantém o fundo atual
            }
        }
        if (img.complete && img.naturalWidth) run();
        else img.addEventListener("load", run, { once: true });
    }

    var wraps = document.querySelectorAll(".fotoprojetos");
    for (var i = 0; i < wraps.length; i++) apply(wraps[i]);
})();
