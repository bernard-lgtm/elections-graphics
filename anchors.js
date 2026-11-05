/* anchors.js — Hub anchors, a page from the second button in the library's bar: a link to every part of the Elections Hub, the hub's address with an
   anchor after the #, made as the hub makes them ("anchors" in hub/elections-hub-post-v26.js; the councils' from their names, in
   councils.js and districts.js). A click on one copies its link and shows it at the top of the page. The links go to hubUrl in config.js,
   or to declaredUrl from the day set in declared. Loads after library.js, which makes the bar's first menu. */
(function () {
  'use strict';
  var C = window.EHX_CONFIG || {}, PROV = window.EHX_PROV || [], COUNCILS = window.EHX_COUNCILS || [], DIST = window.EHX_DISTRICTS || [];
  var bar = document.querySelector('.lib-top'); if (!bar) return;
  var d = new Date(), iso = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  var HUB = String((C.declared && C.declaredUrl && iso >= C.declared ? C.declaredUrl : C.hubUrl) || 'https://www.dailymaverick.co.za/local-elections-results-2026/').replace(/#.*$/, '');
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function slug(s) { s = String(s || ''); try { s = s.normalize('NFD'); } catch (e) {} return s.replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  var PN = {}, PS = {};
  PROV.forEach(function (p) { PN[p[0]] = p[1]; if (p[0]) PS[p[0]] = slug(p[1]); });
  // the councils (metros and local councils with their wards, then the districts) and each one's anchor, from its name as on the hub:
  // no City of or Local Municipality, two councils of one name with their provinces (#emalahleni-mpumalanga)
  var ROWS = COUNCILS.map(function (r) { return { k: r[0], n: r[1], t: r[2], p: r[3], w: r[4] }; }).concat(DIST.map(function (r) { return { k: r[0], n: r[1], t: 'District', p: r[2], w: 0 }; }));
  var BY = {}, CS = {}, same = {};
  ROWS.forEach(function (r) { BY[r.k] = r; var s = slug(r.n.replace(/ Local Municipality$/, '').replace(/^City of /, '').replace(/ Metro$/, '').replace(/ District Municipality$/, ' District')); if (s) (same[s] = same[s] || []).push(r.k); });
  Object.keys(same).forEach(function (s) { same[s].forEach(function (k) { CS[k] = same[s].length > 1 ? s + '-' + (PS[BY[k].p] || slug(k)) : s; }); });
  function shortName(r) { return r.n.replace(/ Local Municipality$/, '').replace(/ District Municipality$/, ' District'); }
  function wardsOf(r) { var w = r ? r.w : 0, a = []; if (Array.isArray(w)) return w.map(String); for (var i = 1; i <= (+w || 0); i++) a.push(String(i)); return a; }
  var SECS = [['find-your-municipality', 'Find your municipality'], ['latest-coverage', 'Latest coverage']];
  // the tabs and their parts: [anchor, name, 1 for a province only / -1 for South Africa only]
  var TABS = [
    ['results', 'Results', [['councils', 'Table of councils', 1]]],
    ['turnout', 'Turnout', [['councils', 'Table of councils', 1]]],
    ['hung-councils', 'Hung councils', [['list', 'List of hung councils']]],
    ['change-since-2021', 'Change since 2021', [['leading-parties', 'Leading parties'], ['turnout', 'Turnout'], ['hung-councils', 'Hung councils'], ['party-support', 'Party support'], ['councils', 'Table of councils', 1], ['provinces', 'Table of provinces', -1]]]
  ];
  var A = { area: '', muni: 'jhb', ward: '1', cur: null };
  function row(h, name, part, label) {
    return '<li' + (part ? ' class="is-part"' : '') + '><button type="button" class="anc-a' + (A.cur && A.cur.h === h ? ' is-on' : '') + '" data-h="' + esc(h) + '" data-label="' + esc(label) + '"><span class="anc-name">' + esc(name) + '</span><code>' + (h ? '#' + esc(h) : 'no anchor') + '</code></button></li>';
  }
  function tabsHtml() {
    var pc = A.area, where = PN[pc] || 'South Africa';
    return TABS.map(function (t) {
      var base = t[0] + (pc ? '-' + PS[pc] : '');
      return row(base, t[1], false, t[1] + ', ' + where) + t[2].filter(function (p) { return !p[2] || (p[2] > 0 ? !!pc : !pc); }).map(function (p) { return row(base + '-' + p[0], p[1], true, t[1] + ', ' + where + ': ' + p[1]); }).join('');
    }).join('');
  }
  function muniHtml() {
    var r = BY[A.muni], s = CS[A.muni]; if (!r || !s) return '';
    var h = row(s, 'Council\u2019s file', false, r.n);
    if (wardsOf(r).length && A.ward) h += row(s + '-ward-' + A.ward, 'Ward ' + A.ward, false, r.n + ', Ward ' + A.ward) + row(s + '-wards', 'Ward dropdown', false, r.n + ': ward dropdown');
    return h + row(s + '-coalition', 'Coalition mode', false, r.n + ': coalition mode');
  }
  function muniOptions() {
    return PROV.filter(function (p) { return p[0]; }).map(function (p) {
      var rs = ROWS.filter(function (r) { return r.p === p[0]; });
      return rs.length ? '<optgroup label="' + esc(p[1]) + '">' + rs.map(function (r) { return '<option value="' + esc(r.k) + '"' + (r.k === A.muni ? ' selected' : '') + '>' + esc(shortName(r)) + (r.t === 'Metropolitan' ? ' (metro)' : '') + '</option>'; }).join('') + '</optgroup>' : '';
    }).join('');
  }
  /* ---- the page: a button in the bar after the menus, which puts the anchors in the graphic's place (library.js LIB_PAGE, #hub-anchors) ---- */
  var wrap = document.createElement('div'); wrap.className = 'lib-anc';
  wrap.innerHTML = '<button type="button" class="lib-nav-btn lib-page-btn">Hub anchors</button>';
  var nav = bar.querySelector('.lib-nav');
  bar.insertBefore(wrap, nav ? nav.nextSibling : bar.firstChild);
  var panel = document.createElement('section'); panel.id = 'lib-anc-page'; panel.setAttribute('aria-label', 'Hub anchors');
  panel.innerHTML = '<h2 class="lib-group">Hub anchors</h2><div class="anc-in">' +
    '<div class="anc-out"><span class="lbl">Link</span><code id="anc-link"></code><button type="button" class="btn" data-act="copy">Copy link</button><a class="btn" data-act="open" target="_blank" rel="noopener">Open</a><p class="anc-msg" id="anc-msg" aria-live="polite">Click an anchor to copy its link.</p></div>' +
    '<div class="anc-cols">' +
    '<section class="anc-col"><h2 class="lib-nav-h">The page</h2><ul class="anc-list">' + SECS.map(function (s) { return row(s[0], s[1], false, s[1]); }).join('') + '</ul></section>' +
    '<section class="anc-col"><h2 class="lib-nav-h">South Africa and the provinces</h2><div class="anc-picks"><label><span class="lbl">Area</span><select id="anc-area">' + PROV.map(function (p) { return '<option value="' + esc(p[0]) + '">' + esc(p[1]) + '</option>'; }).join('') + '</select></label></div><ul class="anc-list" id="anc-tabs"></ul></section>' +
    '<section class="anc-col"><h2 class="lib-nav-h">Councils and wards</h2><div class="anc-picks"><label><span class="lbl">Council</span><select id="anc-muni">' + muniOptions() + '</select></label><label class="anc-ward"><span class="lbl">Ward</span><select id="anc-ward"></select></label></div><ul class="anc-list" id="anc-mlist"></ul><p class="anc-note">Coalition mode opens once the council\u2019s count is done and no party has a majority. Until then the link opens the council\u2019s file.</p></section>' +
    '</div></div>';
  var btn = wrap.querySelector('button'), $ = function (id) { return document.getElementById(id); };
  window.LIB_PAGE('hub-anchors', btn, panel);
  var link = $('anc-link'), msg = $('anc-msg'), copyBtn = panel.querySelector('[data-act="copy"]'), openA = panel.querySelector('[data-act="open"]');
  function url(h) { return HUB + (h ? '#' + h : ''); }
  function setLink(h) { var u = url(h); link.textContent = u; openA.href = u; }
  function paintTabs() { $('anc-tabs').innerHTML = tabsHtml(); }
  function paintList() { $('anc-mlist').innerHTML = muniHtml(); }
  function paintWards() {
    var ws = wardsOf(BY[A.muni]);
    if (ws.indexOf(A.ward) < 0) A.ward = ws[0] || '';
    panel.querySelector('.anc-ward').hidden = !ws.length;
    $('anc-ward').innerHTML = ws.map(function (w) { return '<option value="' + w + '"' + (w === A.ward ? ' selected' : '') + '>Ward ' + w + '</option>'; }).join('');
    paintList();
  }
  paintTabs(); paintWards(); setLink('');
  function copy(text, label) {
    var ok = function () {
      msg.textContent = 'Link copied: ' + label + '.';
      copyBtn.classList.add('is-done'); copyBtn.textContent = 'Copied';
      clearTimeout(copy.t); copy.t = setTimeout(function () { copyBtn.classList.remove('is-done'); copyBtn.textContent = 'Copy link'; }, 1600);
    };
    var fall = function () {
      var r = document.createRange(), s = window.getSelection(); r.selectNodeContents(link); s.removeAllRanges(); s.addRange(r);
      try { if (document.execCommand('copy')) { ok(); return; } } catch (x) {}
      msg.textContent = 'Select the link and copy it.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fall); else fall();
  }
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('.anc-a');
    if (b) {
      A.cur = { h: b.getAttribute('data-h'), label: b.getAttribute('data-label') };
      [].forEach.call(panel.querySelectorAll('.anc-a.is-on'), function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      setLink(A.cur.h); copy(url(A.cur.h), A.cur.label);
    } else if (e.target.closest('[data-act="copy"]')) copy(link.textContent, A.cur ? A.cur.label : 'Top of the page');
  });
  panel.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'anc-area') { A.area = t.value; paintTabs(); }
    else if (t.id === 'anc-muni') { A.muni = t.value; A.ward = ''; paintWards(); }
    else if (t.id === 'anc-ward') { A.ward = t.value; paintList(); }
  });
})();
