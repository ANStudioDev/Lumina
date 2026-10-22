// Versione, novità e link per Mac letti da GitHub: si aggiornano da soli a ogni nuova versione.
// Le note sono in due lingue: la parte inglese segue la riga «— English —».
function luminaNovita(lang) {
  var en = lang === "en";
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function part(t) {
    t = (t || "").split(/\r?\n---/)[0];   // l'impronta SHA256 in fondo non serve qui
    var k = t.indexOf("— English —");
    if (k >= 0) t = en ? t.slice(k + 11) : t.slice(0, k);
    return t.trim();
  }
  function body(t) {
    var out = "", list = false;
    part(t).split(/\r?\n/).forEach(function (l) {
      if (/^\s*[-*] /.test(l)) { if (!list) { out += "<ul>"; list = true; } out += "<li>" + esc(l.replace(/^\s*[-*] /, "")) + "</li>"; }
      else { if (list) { out += "</ul>"; list = false; } if (l.trim()) out += "<p>" + esc(l) + "</p>"; }
    });
    return out + (list ? "</ul>" : "");
  }
  fetch("https://api.github.com/repos/ANStudioDev/Lumina/releases?per_page=12")
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (all) {
      // Mac (Beta): l'ultima versione con tag mac-… e il suo .dmg
      var mac = all.filter(function (x) { return !x.draft && /^mac-/.test(x.tag_name); })[0];
      if (mac) {
        var dmg = (mac.assets || []).filter(function (a) { return /\.dmg$/i.test(a.name); })[0];
        var a = document.getElementById("macdl");
        if (a) { a.href = dmg ? dmg.browser_download_url : mac.html_url; a.title = mac.name || mac.tag_name; }
      }
      var rel = all.filter(function (x) { return !x.draft && !x.prerelease && /^v/.test(x.tag_name); }).slice(0, 4);
      if (!rel.length) throw 0;
      document.getElementById("ver").textContent = (en ? "Version " : "Versione ") + rel[0].tag_name.replace(/^v/, "");
      document.getElementById("releases").innerHTML = rel.map(function (x, i) {
        var d = new Date(x.published_at).toLocaleDateString(en ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" });
        return '<div class="rel"><h3>' + esc(x.name || x.tag_name) + " <small>" + d + "</small>" +
               (i === 0 ? ' <span class="badge">' + (en ? "latest" : "ultima") + "</span>" : "") + "</h3>" + body(x.body) + "</div>";
      }).join("");
    })
    .catch(function () {
      document.getElementById("releases").innerHTML = '<p class="sub">' + (en ? "What's new is on " : "Le novità sono su ") +
        '<a href="https://github.com/ANStudioDev/Lumina/releases">GitHub</a>.</p>';
    });
}
