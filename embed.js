/* embed.js — runs after the hub, for graphic.html?embed=…: writes the title over the graphic with the count's box beside it (the hub's:
   Counting in red, Count complete in charcoal, Results declared in green) and the credit at the foot with the time of the figures, keeps
   them up to date as the hub reads the feed, tells the page around it how tall it is (postMessage { ehx: 'height', h }), and gives the
   library and export.js window.EH_EMBED (title, ready, state). In a graphic of South Africa or a province, a council clicked opens its
   file on the Elections Hub in a new tab. */
(function () {
  'use strict';
  var X = window.EHX || {}, g = X.g, C = window.EHX_CONFIG || {};
  if (!g) return;
  var nat = g.group === 'area', PV = {}, st = { area: X.area, muni: X.muni, ward: X.ward, view: X.view };
  (window.EHX_PROV || []).forEach(function (p) { PV[p[0]] = p[1]; });
  var HUB_TAB = { results: 'all', turnout: 'turnout', 'hung-councils': 'hung', 'change-since-2021': 'cmp' };
  var MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var root, hrow, head, kEl, tEl, tagEl, stat, foot, coal = null, coalT, coalB, booted = false;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function R$() { return window.EH_RES || null; }
  function areaNow() { return nat ? ((window.EH_AREA && EH_AREA.get && EH_AREA.get()) || '') : ''; }
  function muniOf(k) { var M = window.SA_MUNIS || {}; return M[k] || null; }
  function shortName(k) { var m = muniOf(k); return !m ? k : R$() && R$().shortName ? R$().shortName(m) : m.n; }
  function viewOf() { return (g.views || []).filter(function (v) { return v[0] === st.view; })[0] || null; }
  function title() {
    var v = viewOf(), k = v ? v[2] : g.kicker || g.name, t;
    if (nat) { t = PV[areaNow()] || 'South Africa'; if (g.id === 'cmp' && st.view === 'councils' && !areaNow()) k = 'Change since 2021: provinces'; }
    else { var m = muniOf(st.muni); t = m ? shortName(st.muni) : st.muni; if (g.id === 'ward' && st.ward) t += '\u00a0\u00b7 Ward ' + st.ward; }
    return { kicker: k, title: t };
  }
  function hubAnchor() {
    var A = window.EH_ANCHOR;
    if (!A) return '';
    try { return nat ? A.tab(HUB_TAB[g.tab] || 'all', areaNow()) : A.council(st.muni, g.id === 'ward' ? { ward: st.ward } : g.id === 'coalition' ? { coal: true } : g.id === 'wards' ? { wards: true } : {}); } catch (e) { return ''; }
  }
  function hubLink(a) { return String(C.hubUrl || 'https://www.dailymaverick.co.za/elections').replace(/#.*$/, '') + (a ? '#' + a : ''); }
  function dayNo(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim()); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : null; }
  function dayTxt(n) { var d = new Date(n * 864e5); return WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function hhmm(t) { var d = new Date(t + 72e5); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); }
  function stamp(t) { var d = new Date(t + 72e5); return hhmm(t) + ' on ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function int(n) { var R = R$(); return R && R.int ? R.int(n) : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }

  /* ---- where the count stands, for the place the graphic shows: the area in view (South Africa or a province) or the council ---- */
  var wardR = null, wardKey = '';
  function fetchWard() {   // the ward graphic: the count in the ward itself (the hub reads it once for the ward box; this asks its cache)
    var R = R$(), W = window.SA_WARD_INDEX || {}, x = W[st.muni];
    if (g.id !== 'ward' || !R || !R.ward || !x || !st.ward) return;
    var id = x[1] + ('00' + st.ward).slice(-3), k = id + '|' + (R.S && R.S.updated);
    if (k === wardKey) return;
    wardKey = k;
    R.ward(st.muni, id).then(function (r) { if (r) { wardR = r; if (window.__ehxLater) window.__ehxLater(); } }, function () {});
  }
  function placeR() {
    var R = R$(); if (!R || !R.S) return null;
    if (g.id === 'ward' && wardR) return wardR;
    if (!nat) { var x = R.IX && R.IX[st.muni]; return x && x.e ? R.norm(x.e) : null; }
    var pc = areaNow();
    return pc ? (window.EH_AREA && EH_AREA.provR ? EH_AREA.provR(pc) : null) : R.norm(R.S.nat);
  }
  function state() {
    var R = R$(), S = R && R.S;
    if (!S || S.state === 'loading') return { k: 'loading' };
    if (S.state === 'error') return { k: 'error' };
    var P = placeR(), past = !S.sample && String(S.src) !== String(($('dm-eh') && $('dm-eh').getAttribute('data-year')) || '2026');
    if (S.phase === 'final' || past) return { k: 'final', R: P, past: past };
    var done = S.phase === 'provisional' || (P && P.vdCount > 0 && (P.complete || P.vdCaptured >= P.vdCount));
    if (done) return { k: 'complete', R: P };
    if (P && P.vdCaptured > 0) return { k: 'counting', R: P, pct: R.declared ? R.declared(P) : P.vdCaptured / P.vdCount * 100 };
    if (!nat && !P && S.state !== 'waiting') return { k: 'loading' };   // the council's figures come with its province, a moment later
    return { k: 'waiting', R: P };
  }
  var STEP = { waiting: -1, loading: -1, error: -1, counting: 0, complete: 1, final: 2 };
  function votingDay() { return dayNo(($('dm-eh') && $('dm-eh').getAttribute('data-voting-day')) || C.votingDay || '2026-11-04'); }
  // the polls close at 21:00 on voting day (SAST); until then there is no count to show
  function polling() { var vd = votingDay(); return vd != null && Date.now() + 72e5 < vd * 864e5 + 21 * 36e5; }
  function dayShort(n) { var d = new Date(n * 864e5); return d.getUTCDate() + ' ' + MO[d.getUTCMonth()]; }
  /* ---- the count's box, on the right of the title: the hub's own (post-elections v30, its masthead and its results tabs). Counting: red,
     the share of voting districts counted, its bar and the voting districts in (the hub's declBox). Count complete: charcoal, the results
     provisional until declared. Results declared: green, with the day. While loading, before the polls close and when the feed does not
     answer, the box is grey and says so. ---- */
  function doneBox(cls, st, sub, dot) {
    return '<div class="mf-decl ehx-done ' + cls + '"><span class="st">' + (dot ? '<i aria-hidden="true"></i>' : '') + st + '</span>' + (sub ? '<span class="sub">' + sub + '</span>' : '') + '</div>';
  }
  function box(s) {
    var R = R$(), P = s.R;
    if (s.k === 'loading') return doneBox('is-idle', 'Loading results');
    if (s.k === 'error') return doneBox('is-idle', 'Results unavailable', 'The graphic tries again by itself');
    if (s.k === 'final') {
      var dd = s.past ? dayNo('2021-11-04') : dayNo(($('dm-eh') && $('dm-eh').getAttribute('data-declared')) || '');
      return doneBox('is-done', 'Results declared', dd != null ? dayTxt(dd) : 'By the Electoral Commission', true);
    }
    if (s.k === 'complete') return doneBox('is-prov', 'Count complete', 'Provisional until declared', true);
    if (s.k === 'waiting' && !R.S.sample && polling()) return doneBox('is-idle', 'No votes counted yet', 'Results from the night of ' + dayShort(votingDay()));
    var html = P && P.vdCount > 0 && R.render && R.render.declBox ? R.render.declBox(P) : '';
    return html || '<div class="mf-decl is-live"><div class="mf-decl-row"><span class="st"><i aria-hidden="true"></i>Counting</span><b>' + (s.k === 'counting' && R.decPct ? esc(R.decPct(P)) : '0%') + '</b></div>' +
      '<span class="trk"><i style="width:' + (s.k === 'counting' ? Math.min(100, s.pct || 0) : 0).toFixed(1) + '%"></i></span>' +
      '<span class="sub">' + (P && P.vdCount > 0 ? int(P.vdCaptured || 0) + ' of ' + int(P.vdCount) + ' voting districts' : 'No voting districts counted yet') + '</span></div>';
  }
  var statHtml = '';
  function paintStatus() {
    var s = state(), R = R$(), S = R && R.S, html = box(s), h = document.documentElement;
    if (html !== statHtml) {
      var cur = stat.firstElementChild, tmp = document.createElement('div');
      tmp.innerHTML = html;
      var nx = tmp.firstElementChild;
      // the same red box: its figures and its bar change in place, so the bar moves on as the hub's does
      if (cur && nx && cur.className === nx.className && cur.classList.contains('is-live')) {
        ['.mf-decl-row > b', '.sub'].forEach(function (q) { var a = cur.querySelector(q), b = nx.querySelector(q); if (a && b && a.innerHTML !== b.innerHTML) a.innerHTML = b.innerHTML; });
        var ai = cur.querySelector('.trk i'), bi = nx.querySelector('.trk i');
        if (ai && bi && ai.style.width !== bi.style.width) ai.style.width = bi.style.width;
      } else stat.innerHTML = html;
      statHtml = html;
    }
    if (h.getAttribute('data-k') !== s.k) { stat.setAttribute('data-k', s.k); h.setAttribute('data-k', s.k); }
    var tag = S && S.sample ? 'Sample figures' : s.past ? '2021 figures' : '';
    if (tagEl.textContent !== tag) tagEl.textContent = tag;
    if (tagEl.hidden !== !tag) tagEl.hidden = !tag;
    // the time of the figures, in the credit; while the count is on, the feed is read every 5 minutes
    var upd = S && S.updated && !S.sample && !s.past && (s.k === 'counting' || s.k === 'complete' || s.k === 'waiting') ? ' \u00b7 Updated ' + hhmm(S.updated) + (S.state === 'final' ? '' : ' \u00b7 every 5 minutes') : '';
    var lv = foot.querySelector('.live');
    if (lv.textContent !== upd) lv.textContent = upd;
    if (lv.hidden !== !upd) lv.hidden = !upd;
  }
  var headKey = '';
  function paintHead() {
    var t = title(), key = t.kicker + '|' + t.title;
    if (key !== headKey) {
      headKey = key;
      kEl.textContent = t.kicker; tEl.textContent = t.title;
      document.title = t.kicker + ': ' + t.title.replace(/\u00a0/g, ' ') + ' \u00b7 Daily Maverick';
    }
    var a = foot.querySelector('a.more'), href = hubLink(hubAnchor());
    if (a.getAttribute('href') !== href) a.setAttribute('href', href);
  }

  /* ---- the Coalition builder (library v2.1): over the council's half circle, one line on what a coalition takes and Start again, which
     clears the coalition (the hub's own clear button, hidden here, does it). The hub's head row (the status tag, Who can build a coalition
     in <council>?, Back to results) and its Hung council banner are not shown (embed.css). Before the seats, and where a party has a
     majority, the line says so. ---- */
  var coalHtml = null;
  function coalLine() {
    var R = R$(), s = state();
    if (!R || !R.seatsView || !R.hungOf || s.k === 'loading' || s.k === 'error') return '';
    var x = R.IX && R.IX[st.muni], P = x && x.e ? R.norm(x.e) : null;
    if (!P || !P.seatsTotal) return '';
    if (P.seatsBroken) return 'The Electoral Commission\u2019s seat figures for this council are incomplete, so the seats aren\u2019t shown.';
    var v = R.seatsView(P) || {}, h = R.hungOf(v), then = ' If no party has a majority, you can build a coalition here.';
    function of(n) { return '<b>' + n + ' of the ' + P.seatsTotal + '</b>'; }
    if (v.kind === 'gate') return 'The council\u2019s seats show here once its count is done.' + then;
    if (v.kind === 'none') return (P.complete ? 'The count is done. The seats show here once the Electoral Commission allocates them.' : 'The council\u2019s seats show here once its count is done.') + then;
    if (v.kind !== 'provisional' && v.kind !== 'final') return '';
    if (h && h.hung) return 'No party ' + (v.kind === 'final' ? 'won' : 'has') + ' a majority. Build a coalition: it takes ' + of(h.need) + ' seats to elect a speaker and a mayor.';
    if (h && h.top) return esc(h.top.label) + ' majority: it holds ' + of(h.top.seats) + ' seats, so it needs no coalition to elect a speaker and a mayor.';
    return '';
  }
  function paintCoal() {
    if (!coal) return;
    var html = coalLine(), sec = root.querySelector('.mf-res-seats.can-coal.is-coal'), off = !sec || !sec.querySelector('.mf-cp[aria-pressed="true"]');
    if (html !== coalHtml) { coalT.innerHTML = html; coalHtml = html; }
    if (coal.hidden !== !html) coal.hidden = !html;
    if (coalB.hidden !== !sec) coalB.hidden = !sec;
    if (coalB.disabled !== off) coalB.disabled = off;
  }

  /* ---- Change since 2021: one part of the tab, picked by the view (the parts follow each other under their headings) ---- */
  var CMP = { party: 'leading-parties', turnout: 'turnout', hung: 'hung-councils', support: 'party-support', councils: 'councils' };
  function markCmp() {
    var b = $('eh-cmp-body'); if (!b) return;
    var want = CMP[st.view] || 'leading-parties', maps = /^(leading-parties|turnout|hung-councils)$/.test(want), cur = '';
    [].forEach.call(b.children, function (c) {
      var a = c.getAttribute('data-anchor'), v;
      if (c.classList.contains('ehx-tog') || c.classList.contains('ehx-more')) v = '1';   // embed-fit.js's own: the year switch, the link to the rest
      else if (a) { cur = a; v = '0'; }
      else if (c.classList.contains('cmp-note')) v = maps ? '1' : '0';
      else v = !cur || cur === want ? '1' : '0';
      if (c.getAttribute('data-ehx') !== v) c.setAttribute('data-ehx', v);
    });
  }
  /* ---- Results by ward: the map's own tab for the view, clicked again whenever the map is drawn afresh ---- */
  function pinWards() {
    var b = $('mf-wm-tab-' + (st.view || 'win'));
    if (b && !b.classList.contains('is-on')) b.click();
  }

  /* ---- the height, for the resizer in the embed code and for the library ---- */
  var lastH = 0;
  function postH() {
    var hgt = Math.ceil(document.documentElement.getBoundingClientRect().height);
    if (!hgt || hgt === lastH) return;
    lastH = hgt;
    try { if (window.parent !== window) window.parent.postMessage({ ehx: 'height', h: hgt, embed: X.id }, '*'); } catch (e) {}
  }

  /* ---- ready: the results read, nothing visible still loading, the page quiet for a moment (for the image export and the library) ---- */
  var lastMut = Date.now();
  // the figures the graphic is drawn from, read: the province(s) whose councils it shows (and 2021's for Change since 2021) and, for a
  // map, the councils' outlines. A council's figures come with its province. Before the count, or when the feed does not answer, there is
  // nothing to wait for.
  function dataBusy() {
    var R = R$(); if (!R || !R.S) return true;
    if (R.S.state === 'waiting' || R.S.state === 'error') return false;
    if (!nat) return !(R.IX && R.IX[st.muni]);
    if (!/^(map|turnout|table|hung|cmp)$/.test(g.id)) return false;
    var pc = areaNow(), want = pc ? [pc] : R.PROV_ORDER || [], IX = R.IX || {}, IXP = R.IXP || {}, i;
    function has(ix, p) { for (var k in ix) if (ix[k] && ix[k].pc === p) return true; return false; }
    for (i = 0; i < want.length; i++) { if (!has(IX, want[i])) return true; if (g.id === 'cmp' && !has(IXP, want[i])) return true; }
    if (/^(map|turnout|hung)$/.test(g.id) || (g.id === 'cmp' && /^(party|turnout|hung)$/.test(st.view))) { var A = window.EH_AREA; if (A && A.cmap && !A.cmap.set(pc) && !A.cmap.failed(pc)) return true; }
    return false;
  }
  function busy() {
    var R = R$(); if (!R || !R.S || R.S.state === 'loading') return true;
    if (state().k === 'loading' || dataBusy()) return true;
    var l = root.querySelectorAll('.res-loading, .mf-res-wait, .bf-wait, .eh-hung-load, .res-sub, .mf-wm-wait');
    for (var i = 0; i < l.length; i++) if (l[i].getClientRects().length && (!/res-sub/.test(l[i].className) || /loading/i.test(l[i].textContent || ''))) return true;
    if (root.querySelector('.mf-wm-read')) return true;   // the ward map reading the wards' results (the note stands under the map whether or not it shows)
    // Results by ward, before the first ward's result is in: the reading has begun with the count, its colours a moment away
    if (g.id === 'wards' && st.view !== 'cmp' && root.querySelector('.mf-wm-note') && /^(counting|complete|final)$/.test(state().k)) return true;
    return document.fonts && document.fonts.status === 'loading';
  }
  function ready(max) {
    var t0 = Date.now(); max = max || 20000;
    return new Promise(function (ok) {
      (function tick() {
        if (booted && !busy() && Date.now() - lastMut > 700) return ok(true);
        if (Date.now() - t0 > max) return ok(false);
        setTimeout(tick, 150);
      })();
    });
  }
  /* ---- a map comes in once it has settled (html.ehx-hold, see embed-boot.js): the hub draws its maps, then draws them afresh as the first
     results come in (the provinces one by one), and the room for a map changes as the table beside it fills. Hidden until the page has
     been quiet for 0,4 s, at most 3,5 s; later updates show as they come. ---- */
  function reveal() {
    var t0 = Date.now(), h = document.documentElement;
    if (!h.classList.contains('ehx-hold')) return;
    (function tick() {
      if ((!busy() && Date.now() - lastMut > 400) || Date.now() - t0 > 3500) { h.classList.add('ehx-in'); return; }
      setTimeout(tick, 50);
    })();
  }

  function boot() {
    root = $('dm-eh');
    if (!root || booted) return;
    booted = true;
    // the head: the title on the left, the count's box on the right
    head = document.createElement('div'); head.className = 'ehx-head'; head.innerHTML = '<span class="k"><span class="kt"></span><span class="ehx-tag" hidden></span></span><h1 class="t"></h1>';
    kEl = head.querySelector('.kt'); tEl = head.querySelector('.t'); tagEl = head.querySelector('.ehx-tag');
    stat = document.createElement('div'); stat.className = 'ehx-status'; stat.setAttribute('role', 'status'); stat.setAttribute('data-k', 'loading');
    hrow = document.createElement('div'); hrow.className = 'ehx-headrow'; hrow.appendChild(head); hrow.appendChild(stat);
    foot = document.createElement('div'); foot.className = 'ehx-foot';
    foot.innerHTML = '<span class="src">Source: Electoral Commission of South Africa<span class="live" hidden></span><span class="at"></span> \u00b7 <a class="more" href="' + esc(hubLink('')) + '" target="_blank" rel="noopener">All results on the Elections Hub</a><span class="url">dailymaverick.co.za/elections</span></span>' +
      '<a class="logo" href="https://www.dailymaverick.co.za" target="_blank" rel="noopener" aria-label="Daily Maverick"><img src="assets/DailyMaverickMasthead_BlackRed.svg" alt="Daily Maverick" width="75" height="15"></a>';
    root.insertBefore(hrow, root.firstChild);
    root.appendChild(foot);
    if (g.id === 'coalition') {
      coal = document.createElement('div'); coal.className = 'ehx-coal'; coal.hidden = true;
      coal.innerHTML = '<p class="ehx-coal-t"></p><button type="button" class="ehx-coal-clr" disabled hidden><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.76 13.81a7 7 0 1 1-2.26-7.17l2 1.67"></path><path d="M18.5 3.8v4.5h-4.5"></path></svg><span>Start again</span></button>';
      coalT = coal.firstChild; coalB = coal.lastChild;
      coalB.addEventListener('click', function () {
        var b = root.querySelector('.mf-res-seats.is-coal [data-coal-clear]'), had = document.activeElement === coalB, f;
        if (!b) return;
        b.click();
        paintCoal();
        // the keyboard's focus goes on to the first party, as the hub's button sends it
        if (had && (f = root.querySelector('.mf-res-seats.is-coal .mf-cp[data-pk]'))) { try { f.focus({ preventScroll: true }); } catch (e) {} }
      });
      root.insertBefore(coal, hrow.nextSibling);
      // a party in or out (its chip, or its pegs on the half circle): Start again follows at once, after the hub's own click handler (on the
      // document too, registered before this one), not only when the page's timers next run
      document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#dm-eh .mf-cp, #dm-eh .ehh-fig')) paintCoal(); });
    }
    // a council clicked in a graphic of South Africa or a province: its file on the hub, in a new tab (the file isn't part of the graphic)
    if (nat) {
      var open = function (k, o) { var A = window.EH_ANCHOR; window.open(hubLink(A ? A.council(k, o || {}) : ''), '_blank', 'noopener'); };
      window.DM_EH_OPEN = function (k) { open(k); };
      window.DM_EH_COAL = function (k) { open(k, { coal: true }); };
    }
    var raf = 0;
    function later() { lastMut = Date.now(); if (raf) return; raf = setTimeout(function () { raf = 0; tickAll(); }, 40); }
    function tickAll() { if (g.id === 'cmp') markCmp(); if (g.id === 'wards') pinWards(); fetchWard(); paintHead(); paintStatus(); paintCoal(); postH(); }
    window.__ehxLater = later;
    // Change since 2021: the hub writes the tab afresh, its parts hidden until marked (embed.css): marked at once, before the page is painted
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(hrow.contains(t) || foot.contains(t) || (coal && coal.contains(t)))) { if (g.id === 'cmp') markCmp(); later(); return; } }
    }).observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'data-phase'] });
    var R = R$();
    if (R) { if (R.on) R.on(later); if (R.onPhase) R.onPhase(later); if (R.ready) R.ready().then(later, later); }
    if (window.EH_AREA && EH_AREA.on) EH_AREA.on(later);
    if (window.ResizeObserver) new ResizeObserver(postH).observe(document.documentElement);
    window.addEventListener('load', postH);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(postH);
    setInterval(postH, 2000);   // a frame that came up hidden (an article tab in the background) asks again
    tickAll();
    reveal();
  }
  window.EH_EMBED = {
    kind: X.id, title: title, ready: ready, state: function () { var s = state(); return { k: s.k, step: STEP[s.k] }; },
    stamp: function () { var t = Date.now(); foot.querySelector('.at').textContent = ' \u00b7 Figures as at ' + stamp(t); return t; },
    hub: function () { return hubLink(hubAnchor()); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
