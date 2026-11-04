/* library.js — a card for every graphic in graphics.js: its pickers, the live preview (graphic.html in a frame, at the preview width), the
   version's own link, the embed code (one frame, at the graphic's fixed height) and the image downloads (export.js inside the frame draws them).
   Links and codes point at the published library: this page's own address once it is published, config.js's publicBase from a preview. */
(function () {
  'use strict';
  var C = window.EHX_CONFIG || {}, GR = window.EHX_GRAPHICS || [], PROV = window.EHX_PROV || [], COUNCILS = window.EHX_COUNCILS || [], DIR = window.EHX_DIR || '';
  var PN = {}; PROV.forEach(function (p) { PN[p[0]] = p[1]; });
  var MUNI = {}; COUNCILS.forEach(function (r) { MUNI[r[0]] = r; });
  var HERE = location.href.replace(/[#?].*$/, '').replace(/[^\/]*$/, '');
  var LOCAL = location.protocol === 'file:' || /(^|\.)claudeusercontent\.com$|^localhost$|^127\.|^0\.0\.0\.0$|^10\.|^192\.168\./.test(location.hostname);
  var BASE = LOCAL && C.publicBase ? String(C.publicBase).replace(/\/?$/, '/') : HERE;
  var ORIGIN = new URL(BASE).origin;
  var FIG = { live: '', count: 'data=sample&at=60', complete: 'data=sample&at=100', final: 'data=sample&at=100&decl=1', '2021': 'data=2021' };
  var FIG_NOTE = { live: '', count: 'The previews show a made-up count in progress (60% of voting districts in), built from the 2021 figures. Codes and links still show the live results.', complete: 'The previews show a made-up count that is complete, its seats provisional. Codes and links still show the live results.', final: 'The previews show a made-up count that the Commission has declared. Codes and links still show the live results.', '2021': 'The previews show the real 2021 results. Codes and links still show the live 2026 results.' };
  var q = new URL(location.href).searchParams;
  var UI = { fig: FIG[q.get('fig')] != null ? q.get('fig') : 'live', w: /^(668|360|1100)$/.test(q.get('w') || '') ? +q.get('w') : 668 };
  var S = {};
  GR.forEach(function (g) { S[g.id] = { area: g.provOnly ? 'GP' : '', muni: 'jhb', ward: g.ward ? '1' : '', view: g.views ? g.views[0][0] : '', h: 0, hw: 0 }; });
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function gOf(id) { return GR.filter(function (g) { return g.id === id; })[0]; }
  function viewOf(g) { var s = S[g.id]; return (g.views || []).filter(function (v) { return v[0] === s.view; })[0] || null; }
  function wardsOf(k) { var r = MUNI[k], w = r ? r[4] : 0, a = []; if (Array.isArray(w)) return w.map(String); for (var i = 1; i <= (+w || 0); i++) a.push(String(i)); return a; }
  // the version's address: on the published library (link), or beside this page with the preview figures (the frame)
  function params(g) {
    var s = S[g.id], p = new URLSearchParams();
    p.set('embed', g.id);
    if (g.group === 'area') { if (s.area) p.set('area', s.area); } else { p.set('muni', s.muni); if (g.ward) p.set('ward', s.ward); }
    if (g.views && s.view !== g.views[0][0]) p.set('view', s.view);
    return p.toString();
  }
  function link(g) { return BASE + 'graphic.html?' + params(g); }
  function frameSrc(g, extra) { return DIR + 'graphic.html?' + params(g) + (FIG[UI.fig] ? '&' + FIG[UI.fig] : '') + (extra ? '&' + extra : ''); }
  function place(g) {
    var s = S[g.id];
    if (g.group === 'area') return PN[s.area] || 'South Africa';
    var r = MUNI[s.muni]; return (r ? r[1] : s.muni) + (g.ward ? ', Ward ' + s.ward : '');
  }
  function titleOf(g) { var v = viewOf(g); return (v ? v[2] : g.kicker || g.name) + ': ' + place(g) + ' \u00b7 Daily Maverick'; }
  // the frame's height: the graphic's fixed height (graphics.js), the same on desktop and phones; the graphic fits itself to it
  function codeH(g) { var s = S[g.id]; return (g.hv && g.hv[s.view]) || g.h || 760; }
  function code(g) {
    var h = codeH(g);
    return '<iframe src="' + esc(link(g)) + '" title="' + esc(titleOf(g)) + '" width="100%" height="' + h + '" scrolling="no" frameborder="0" loading="lazy" style="display:block;width:100%;max-width:100%;height:' + h + 'px;border:0;overflow:hidden"></iframe>';
  }
  function fileName(g, kind, k) {
    var s = S[g.id], slug = g.group === 'area' ? (s.area || 'sa').toLowerCase() : s.muni + (g.ward ? '-ward' + s.ward : '');
    return 'dm-elections-2026-' + g.id + '-' + slug + (s.view ? '-' + s.view : '') + '-' + kind + (k === 2 ? '@2x' : '') + '.png';
  }
  /* ---- the cards ---- */
  function councilOptions(sel) {
    var html = '', last = '';
    COUNCILS.forEach(function (r) {
      if (r[3] !== last) { if (last) html += '</optgroup>'; last = r[3]; html += '<optgroup label="' + esc(PN[last] || last) + '">'; }
      html += '<option value="' + esc(r[0]) + '"' + (r[0] === sel ? ' selected' : '') + '>' + esc(r[1].replace(/ Local Municipality$/, '')) + (r[2] === 'Metropolitan' ? ' (metro)' : '') + '</option>';
    });
    return html + (last ? '</optgroup>' : '');
  }
  function wardOptions(k, sel) { return wardsOf(k).map(function (w) { return '<option value="' + w + '"' + (w === sel ? ' selected' : '') + '>Ward ' + w + '</option>'; }).join(''); }
  function picks(g) {
    var s = S[g.id], h = '';
    if (g.group === 'area') h += '<label><span class="lbl">Area</span><select data-k="area">' + PROV.filter(function (p) { return !(g.provOnly && !p[0]); }).map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === s.area ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('') + '</select></label>';
    else h += '<label><span class="lbl">Council</span><select data-k="muni">' + councilOptions(s.muni) + '</select></label>';
    if (g.ward) h += '<label><span class="lbl">Ward</span><select data-k="ward">' + wardOptions(s.muni, s.ward) + '</select></label>';
    if (g.views) h += '<label><span class="lbl">View</span><span class="lib-seg">' + g.views.map(function (v) { return '<button type="button" data-view="' + v[0] + '"' + (v[0] === s.view ? ' class="is-on"' : '') + '>' + esc(v[1]) + '</button>'; }).join('') + '</span></label>';
    return h;
  }
  function cardHtml(g) {
    return '<article class="g" id="g-' + g.id + '" data-id="' + g.id + '"><div class="g-head"><div><h3>' + esc(g.name) + '</h3><p>' + esc(g.desc) + '</p></div><div class="g-pick">' + picks(g) + '</div></div>' +
      '<div class="g-stage"><iframe title="' + esc(g.name) + ': preview" loading="lazy"></iframe></div>' +
      '<div class="g-out"><div class="g-link"><span class="lbl">Link</span><code></code><button type="button" class="btn" data-act="link">Copy link</button><a class="btn" target="_blank" rel="noopener" data-act="open">Open</a></div>' +
      '<div class="g-act"><button type="button" class="btn is-primary" data-act="code">Copy embed code</button><a class="btn" target="_blank" rel="noopener" data-act="test">Test in an article</a><span class="sep"></span><span class="grp"><span class="lbl">Image</span><button type="button" class="btn" data-act="png" data-kind="png" data-k="1">PNG</button><button type="button" class="btn" data-act="png" data-kind="png" data-k="2">PNG 2\u00d7</button><button type="button" class="btn" data-act="png" data-kind="square">Square 1080</button><button type="button" class="btn" data-act="png" data-kind="wide">Wide 1920</button></span></div>' +
      '<details class="g-code"><summary>Embed code</summary><textarea readonly aria-label="Embed code"></textarea><p></p></details><p class="g-msg" aria-live="polite"></p></div></article>';
  }
  document.getElementById('lib-cards-area').innerHTML = GR.filter(function (g) { return g.group === 'area'; }).map(cardHtml).join('');
  document.getElementById('lib-cards-muni').innerHTML = GR.filter(function (g) { return g.group === 'muni'; }).map(cardHtml).join('');
  function el(g) { return document.getElementById('g-' + g.id); }
  function frame(g) { return el(g).querySelector('.g-stage iframe'); }
  function msg(g, t, err) { var m = el(g).querySelector('.g-msg'); m.textContent = t || ''; m.classList.toggle('is-err', !!err); }
  function paintOut(g) {
    var e = el(g), s = S[g.id], u = link(g);
    e.querySelector('.g-link code').textContent = u;
    e.querySelector('[data-act="open"]').href = u;
    e.querySelector('[data-act="test"]').href = DIR + 'article-test.html#code=' + encodeURIComponent(code(g));
    e.querySelector('.g-code textarea').value = code(g);
    e.querySelector('.g-code p').textContent = 'The frame is ' + codeH(g) + ' px high, on desktop and on phones alike; the graphic lays itself out to fit it at any width.';
  }
  function load(g) { var f = frame(g); S[g.id].h = 0; f.src = frameSrc(g); f.style.width = UI.w + 'px'; f.style.height = codeH(g) + 'px'; paintOut(g); }
  GR.forEach(load);
  /* ---- the settings ---- */
  function paintSet() {
    [['lib-data', UI.fig], ['lib-width', String(UI.w)]].forEach(function (x) { [].forEach.call(document.querySelectorAll('#' + x[0] + ' button'), function (b) { b.classList.toggle('is-on', b.getAttribute('data-v') === x[1]); }); });
    document.getElementById('lib-data-note').textContent = FIG_NOTE[UI.fig] || '';
    var u = new URL(location.href); u.searchParams.set('fig', UI.fig); u.searchParams.set('w', UI.w); history.replaceState(null, '', u.toString());
  }
  document.getElementById('lib-data').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.getAttribute('data-v') === UI.fig) return; UI.fig = b.getAttribute('data-v'); paintSet(); GR.forEach(load); });
  document.getElementById('lib-width').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; UI.w = +b.getAttribute('data-v'); paintSet(); GR.forEach(function (g) { frame(g).style.width = UI.w + 'px'; }); });
  paintSet();
  (function base() {
    var box = document.getElementById('lib-base');
    box.innerHTML = '<span class="lbl">Links point to</span><code>' + esc(BASE) + '</code><span class="lib-dot" id="lib-live">Checking\u2026</span>' + (LOCAL ? '<span>This is a preview copy, so the codes point at the published library. Publish this folder there before pasting a code into a story (README.md); config.js holds the address.</span>' : '');
    var img = new Image(), dot = document.getElementById('lib-live');
    img.onload = function () { dot.textContent = 'Published'; dot.classList.add('is-ok'); };
    img.onerror = function () { dot.textContent = 'Nothing published at this address yet'; dot.classList.add('is-bad'); };
    img.src = BASE + 'assets/DailyMaverickMasthead_BlackRed.svg?check=' + Date.now();
  })();
  /* ---- pickers and buttons ---- */
  function cardOf(t) { var e = t.closest('.g'); return e ? gOf(e.getAttribute('data-id')) : null; }
  document.addEventListener('change', function (e) {
    var sel = e.target.closest('.g select[data-k]'), g = sel && cardOf(sel); if (!g) return;
    var k = sel.getAttribute('data-k'), s = S[g.id];
    s[k] = sel.value;
    if (k === 'muni' && g.ward) { s.ward = wardsOf(s.muni)[0] || '1'; el(g).querySelector('select[data-k="ward"]').innerHTML = wardOptions(s.muni, s.ward); }
    msg(g, ''); load(g);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.g button, .g a.btn'), g = b && cardOf(b); if (!g) return;
    if (b.hasAttribute('data-view')) {
      S[g.id].view = b.getAttribute('data-view');
      [].forEach.call(b.parentNode.children, function (x) { x.classList.toggle('is-on', x === b); });
      msg(g, ''); load(g); return;
    }
    var act = b.getAttribute('data-act');
    if (act === 'code') copy(g, b, code(g), 'Embed code copied. Paste it into the article\u2019s HTML block.');
    else if (act === 'link') copy(g, b, link(g), 'Link copied.');
    else if (act === 'png') shot(g, b);
  });
  function copy(g, b, text, done) {
    var ok = function () { msg(g, done); var t = b.textContent; b.classList.add('is-done'); b.textContent = 'Copied'; setTimeout(function () { b.classList.remove('is-done'); b.textContent = t; }, 1600); };
    var fall = function () { var ta = el(g).querySelector('.g-code textarea'); el(g).querySelector('.g-code').open = true; ta.value = text; ta.select(); try { if (document.execCommand('copy')) { ok(); return; } } catch (x) {} msg(g, 'Select the text and copy it.', true); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fall); else fall();
  }
  /* ---- images: PNG from the preview as it stands; Square and Wide from a frame drawn at a width that suits the format: a square card for
     the square (860 wide and as tall), and for the wide image a card at the graphic's own height, 1240 wide ---- */
  var SHOT_W = { square: 860, wide: 1240 };
  function shotH(g, kind) { return kind === 'square' ? SHOT_W.square : codeH(g); }
  function shot(g, b) {
    var kind = b.getAttribute('data-kind'), k = +b.getAttribute('data-k') || 1, was = b.textContent, made = null;
    b.disabled = true; b.textContent = 'Drawing\u2026'; msg(g, 'Drawing the image\u2026');
    var win = kind === 'png' ? Promise.resolve(frame(g).contentWindow) : new Promise(function (ok, no) {
      made = document.createElement('iframe'); made.className = 'lib-shot'; made.setAttribute('aria-hidden', 'true'); made.tabIndex = -1;
      made.style.width = SHOT_W[kind] + 'px'; made.style.height = shotH(g, kind) + 'px';
      made.onload = function () { ok(made.contentWindow); };
      made.onerror = no;
      made.src = frameSrc(g, 'still=1');
      document.body.appendChild(made);
    });
    win.then(function (w) {
      var t0 = Date.now();
      return new Promise(function (ok, no) { (function wait() { var X = null; try { X = w.EH_EXPORT; } catch (x) {} if (X) ok(X); else if (Date.now() - t0 > 20000) no(new Error('the graphic did not load')); else setTimeout(wait, 150); })(); });
    }).then(function (X) { return X.snap({ kind: kind, scale: k }).then(function (blob) { return { blob: blob, fonts: X.fontsStatus ? X.fontsStatus() : null }; }); }).then(function (r) {
      var blob = r.blob, a = document.createElement('a'), u = URL.createObjectURL(blob);
      a.href = u; a.download = fileName(g, kind, k); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
      msg(g, 'Downloaded ' + a.download + ' (' + Math.round(blob.size / 1024) + ' KB).' + (r.fonts && !r.fonts.ok ? ' ' + r.fonts.text : ''), !!(r.fonts && !r.fonts.ok));
    }, function (e) { msg(g, 'The image could not be made: ' + (e && e.message || e) + '.', true); }).then(function () { if (made) made.remove(); b.disabled = false; b.textContent = was; });
  }
  /* ---- the frames report their height (the fixed one): kept for the record, the frame stays at it ---- */
  window.addEventListener('message', function (e) {
    var m = e.data; if (!m || m.ehx !== 'height' || !(m.h > 40)) return;
    GR.forEach(function (g) {
      var f = frame(g); if (f.contentWindow !== e.source) return;
      S[g.id].h = Math.ceil(m.h); S[g.id].hw = Math.round(f.getBoundingClientRect().width);
    });
  });
})();
