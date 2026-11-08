/* library.js — the card of one graphic in graphics.js, the one picked in Interactive graphics or Still graphics (only its frame loads).
   Interactive: its pickers with Copy embed code under them (one frame, at the graphic's fixed height), and the live preview (graphic.html
   in a frame, at the preview width and the graphic's fixed height). Still: the same pickers with the image downloads under them, and the
   still graphic (graphic.html with &mode=still: as tall as everything in it, the frame following its height; export.js inside draws them).
   Links and codes point at the published library: this page's own address once it is published, config.js's publicBase from a preview. */
(function () {
  'use strict';
  var C = window.EHX_CONFIG || {}, GR = window.EHX_GRAPHICS || [], PROV = window.EHX_PROV || [], COUNCILS = window.EHX_COUNCILS || [], DIR = window.EHX_DIR || '';
  var PN = {}; PROV.forEach(function (p) { PN[p[0]] = p[1]; });
  var MUNI = {}; COUNCILS.forEach(function (r) { MUNI[r[0]] = r; });
  var HERE = location.href.replace(/[#?].*$/, '').replace(/[^\/]*$/, '');
  var LOCAL = location.protocol === 'file:' || /(^|\.)claudeusercontent\.com$|^localhost$|^127\.|^0\.0\.0\.0$|^10\.|^192\.168\./.test(location.hostname);
  var BASE = LOCAL && C.publicBase ? String(C.publicBase).replace(/\/?$/, '/') : HERE;
  var FIG = { live: '', count: 'data=sample&at=60', complete: 'data=sample&at=100', final: 'data=sample&at=100&decl=1', '2021': 'data=2021' };
  var FIG_NOTE = { live: '', count: 'The previews show a made-up count in progress (60% of voting districts in), built from the 2021 figures. Codes and links still show the live results.', complete: 'The previews show a made-up count that is complete, its seats provisional. Codes and links still show the live results.', final: 'The previews show a made-up count that the Commission has declared. Codes and links still show the live results.', '2021': 'The previews show the real 2021 results. Codes and links still show the live 2026 results.' };
  // the two menus in the bar: the embeds (#g-<graphic>) and the images (#s-<graphic>)
  var MODE = {
    live: { name: 'Interactive graphics', card: 'Interactive graphic', hash: 'g-', lead: 'Embeds for articles: an iframe at a fixed height that keeps itself up to date as the count goes on.' },
    still: { name: 'Still graphics', card: 'Still graphic', hash: 's-', only: 'For newsletters only', lead: 'PNG images, 1080 wide (twice the 540 preview), every list kept to the parties that count, with the time of their figures.' }
  };
  // v3.4 · the preview's widths: an embed at the article column's, a phone's or a wide page's; a still graphic at 540, between the article
  // column and a phone (the PNG, at twice the width, is 1080 wide, a social post's width), or at either of those
  var WID = { live: [[668, 'Article column \u00b7 668'], [360, 'Phone \u00b7 360'], [1100, 'Wide \u00b7 1100']], still: [[540, 'Standard \u00b7 540'], [668, 'Article column \u00b7 668'], [360, 'Phone \u00b7 360']] };
  var q = new URL(location.href).searchParams;
  var TW = window.EHX_TWEAKS || {}; // the preview page's Tweaks (Elections Hub graphics library v3.html): fig, the figures the previews show
  var UI = { fig: FIG.hasOwnProperty(TW.fig) ? TW.fig : 'live', w: 668, sw: 540, mode: 'live' };
  function curW() { return UI.mode === 'still' ? UI.sw : UI.w; }
  var S = {};
  GR.forEach(function (g) { S[g.id] = { area: g.provOnly ? 'GP' : '', muni: g.muni || 'jhb', ward: g.ward ? '1' : '', view: g.views ? g.views[0][0] : '', h: 0, hw: 0 }; });
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function gOf(id) { return GR.filter(function (g) { return g.id === id; })[0]; }
  function viewOf(g) { var s = S[g.id]; return (g.views || []).filter(function (v) { return v[0] === s.view; })[0] || null; }
  function wardsOf(k) { var r = MUNI[k], w = r ? r[4] : 0, a = []; if (Array.isArray(w)) return w.map(String); for (var i = 1; i <= (+w || 0); i++) a.push(String(i)); return a; }
  function int(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
  // the version's address: on the published library (link), or beside this page with the preview figures (the frame)
  function params(g) {
    var s = S[g.id], p = new URLSearchParams();
    p.set('embed', g.id);
    if (g.group === 'area') { if (s.area && areaOk(g)) p.set('area', s.area); } else { p.set('muni', s.muni); if (g.ward) p.set('ward', s.ward); }
    if (g.views && s.view !== g.views[0][0]) p.set('view', s.view);
    return p.toString();
  }
  function link(g) { return BASE + 'graphic.html?' + params(g); }
  function frameSrc(g, extra) { return DIR + 'graphic.html?' + params(g) + (UI.mode === 'still' ? '&mode=still' : '') + (FIG[UI.fig] ? '&' + FIG[UI.fig] : '') + (extra ? '&' + extra : ''); }
  function place(g) {
    var s = S[g.id];
    if (g.group === 'area') return PN[s.area] || 'South Africa';
    var r = MUNI[s.muni]; return (r ? r[1] : s.muni) + (g.ward ? ', Ward ' + s.ward : '');
  }
  function titleOf(g) { var v = viewOf(g); return (v ? v[2] : g.kicker || g.name) + ': ' + place(g) + ' \u00b7 Daily Maverick'; }
  // the frame's height: the graphic's fixed height (graphics.js), the same on desktop and phones; the graphic fits itself to it. A graphic
  // with auto (Council seats, v3.7): the height measured for the place picked, where it could be measured (AUTO, below)
  function codeH(g) { var s = S[g.id], a = g.auto && AUTO[autoKey(g)]; return (a && a.h) || (g.hv && g.hv[s.view]) || g.h || 760; }
  /* v3.11 · a graphic with fluid (Results by ward): measured at the article column's width and a phone's, its code's height follows the
     frame's width between the two (aspect-ratio, min-height and max-height in its style; no script): hi in the article column and wider,
     lo on a phone, as tall as the width needs in between. fluid() gives [lo, hi], or null where there is one height. */
  var FLUID_W = 668;
  function fluid(g) { var a = g.fluid && AUTO[autoKey(g)]; return a && a.h && a.lo && a.lo < a.h ? [a.lo, a.h] : null; }
  // the fluid graphic measured by its map (Results by ward); Council seats (v3.13) is measured by its rows
  function byMap(g) { return !!g.fluid && g.id === 'wards'; }
  function sizeFrame(g, f) {
    var p = fluid(g), st = f.style;
    st.height = p ? 'auto' : codeH(g) + 'px'; st.aspectRatio = p ? FLUID_W + ' / ' + p[1] : ''; st.minHeight = p ? p[0] + 'px' : ''; st.maxHeight = p ? p[1] + 'px' : '';
  }
  function code(g) {
    var h = codeH(g), p = fluid(g), css = p ? 'height:auto;aspect-ratio:' + FLUID_W + ' / ' + p[1] + ';min-height:' + p[0] + 'px;max-height:' + p[1] + 'px' : 'height:' + h + 'px';
    return '<iframe src="' + esc(link(g)) + '" title="' + esc(titleOf(g)) + '" width="100%" height="' + (p ? p[0] : h) + '"' + (g.locate ? ' allow="geolocation"' : '') + ' scrolling="no" frameborder="0" loading="lazy" style="display:block;width:100%;max-width:100%;' + css + ';border:0;overflow:hidden"></iframe>';
  }
  // a still's file name carries the time of its figures (SAST), or what they are (the sample, 2021)
  function when(at) {
    if (!at) return '';
    if (at.tag) return at.tag;
    var d = new Date(at.t + 72e5), p = function (n) { return ('0' + n).slice(-2); };
    return d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + '-' + p(d.getUTCHours()) + p(d.getUTCMinutes());
  }
  function fileName(g, kind, k, at) {
    var s = S[g.id], slug = g.group === 'area' ? (s.area || 'sa').toLowerCase() : s.muni + (g.ward ? '-ward' + s.ward : ''), t = when(at);
    return 'dm-elections-2026-' + g.id + '-' + slug + (s.view ? '-' + s.view : '') + '-' + (kind === 'png' ? 'still' : kind) + (t ? '-' + t : '') + (k === 2 ? '@2x' : '') + '.png';
  }
  /* ---- the cards ---- */
  function councilOptions(sel, keep) {
    var html = '', last = '';
    COUNCILS.forEach(function (r) {
      if (keep && !keep[r[0]]) return;
      if (r[3] !== last) { if (last) html += '</optgroup>'; last = r[3]; html += '<optgroup label="' + esc(PN[last] || last) + '">'; }
      html += '<option value="' + esc(r[0]) + '"' + (r[0] === sel ? ' selected' : '') + '>' + esc(r[1].replace(/ Local Municipality$/, '')) + (r[2] === 'Metropolitan' ? ' (metro)' : '') + '</option>';
    });
    return html + (last ? '</optgroup>' : '');
  }
  function wardOptions(k, sel) { return wardsOf(k).map(function (w) { return '<option value="' + w + '"' + (w === sel ? ' selected' : '') + '>Ward ' + w + '</option>'; }).join(''); }
  /* ---- the Coalition builder's list (hungOnly in graphics.js): only the councils with no majority in the figures the preview shows (the
     seats as its half circle shows them), every province, read in a hidden frame of its own (v3.7: no longer the preview's, which a council
     picked meanwhile sent elsewhere, so the reading never came back), again after five minutes. Never every council: until the first
     reading the list holds the council on show alone (Lesedi, muni in graphics.js), and where the results can't be read the last list stays
     and the reading is tried again 20 seconds on. The last list read is kept in the browser (localStorage, ehx-hung-v1), so the next visit
     has it at once while it is read again. ---- */
  var HUNG = {}, HUNG_AGE = 300000, HUNG_LS = 'ehx-hung-v1';
  var HUNG_NOTE = 'No council is hung in these figures yet. A council joins the list once its count is done and no party has a majority.';
  var HUNG_WAIT = 'Finding the hung councils in the results\u2026', HUNG_FAIL = 'The results could not be read to find the hung councils. Trying again\u2026';
  try { (function () { var o = JSON.parse(localStorage.getItem(HUNG_LS) || '{}'); for (var f in o) if (o[f] && o[f].keys) HUNG[f] = { keys: o[f].keys, t: +o[f].t || 0 }; })(); } catch (x) {}
  function saveHung() { try { var o = {}; for (var f in HUNG) if (HUNG[f] && HUNG[f].keys) o[f] = { keys: HUNG[f].keys, t: HUNG[f].t }; localStorage.setItem(HUNG_LS, JSON.stringify(o)); } catch (x) {} }
  function hungKeys() { var c = HUNG[UI.fig]; return c && c.keys ? COUNCILS.filter(function (r) { return c.keys[r[0]]; }).map(function (r) { return r[0]; }) : null; }
  function hungNote(g) { if (!g.hungOnly) return ''; var c = HUNG[UI.fig], ks = hungKeys(); return !ks ? (c && c.failed ? HUNG_FAIL : HUNG_WAIT) : !ks.length ? HUNG_NOTE : ''; }
  function muniOpts(g) {   // [the options, whether there is a council to pick]
    var s = S[g.id], c = g.hungOnly ? HUNG[UI.fig] : null, ks, one = {};
    if (!g.hungOnly) return [councilOptions(s.muni), true];
    if (!(ks = hungKeys())) { one[s.muni] = 1; return [councilOptions(s.muni, one), false]; }
    if (!ks.length) return ['<option value="">No hung councils yet</option>', false];
    return [councilOptions(s.muni, c.keys), true];
  }
  function pickHung(g) {
    var s = S[g.id], ks = hungKeys(), e = el(g), sel = e && e.querySelector('select[data-k="muni"]'), mo;
    if (!e) return;
    if (ks && ks.length && ks.indexOf(s.muni) < 0) s.muni = ks.indexOf(g.muni) >= 0 ? g.muni : ks[0];
    if (sel) { mo = muniOpts(g); sel.innerHTML = mo[0]; sel.disabled = !mo[1]; }
  }
  // the note under the button: the list's state first, then the height measured (autoUi)
  function paintNote(g) { if (g.auto && UI.mode === 'live') autoUi(g); else if (g.hungOnly) msg(g, hungNote(g)); }
  function scanHung(g) {
    var fig = UI.fig, c = HUNG[fig], t0 = Date.now(), out = false;
    if (c && (c.busy ? t0 - c.busy < 60000 : c.keys && t0 - c.t < HUNG_AGE)) return;
    HUNG[fig] = { keys: c && c.keys, t: c ? c.t : 0, busy: t0 };
    var f = document.createElement('iframe'), w;
    f.className = 'lib-shot'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.style.width = '668px'; f.style.height = '900px';
    f.src = DIR + 'graphic.html?embed=' + g.id + '&muni=' + encodeURIComponent(g.muni || S[g.id].muni) + '&fit=0&still=1' + (FIG[fig] ? '&' + FIG[fig] : '');
    function done(keys) {
      if (out) return; out = true; f.remove();
      if (keys) { HUNG[fig] = { keys: keys, t: Date.now() }; saveHung(); }
      else { HUNG[fig] = { keys: c && c.keys, t: c ? c.t : 0, failed: true }; setTimeout(function () { if (UI.fig === fig && CUR === g && el(g)) scanHung(g); }, 20000); }
      if (UI.fig !== fig || CUR !== g || !el(g)) return;
      var was = S[g.id].muni; pickHung(g);
      if (S[g.id].muni !== was) load(g); else paintNote(g);
    }
    setTimeout(function () { done(null); }, 45000);
    f.onload = function () {
      try { w = f.contentWindow; } catch (x) { return done(null); }
      (function wait() {
        var R = null; try { R = w.EH_RES; } catch (x) {}
        if (R && R.ready && R.province && R.IX && R.seatsView && R.hungOf) return read(R);
        if (Date.now() - t0 > 25000) return done(null);
        setTimeout(wait, 200);
      })();
    };
    document.body.appendChild(f);
    function read(R) {
      R.ready().then(function () {
        if (R.S && R.S.state === 'error') throw new Error('no results');
        return Promise.all((R.PROV_ORDER || []).map(function (p) { return R.province(p); }));
      }).then(function () {
        var M = w.SA_MUNIS || {}, keys = {};
        Object.keys(R.IX).forEach(function (k) {
          var m = M[k], x = R.IX[k], P = m && m.dtype !== 'district' && x && x.e ? R.norm(x.e) : null, h = P ? R.hungOf(R.seatsView(P)) : null;
          if (h && h.hung) keys[k] = 1;
        });
        done(keys);
      }).catch(function () { done(null); });
    }
  }
  // v3.12 · an area to pick: every graphic of South Africa and the provinces, but in Turnout by province (natOnly) only its Explorer (areaViews)
  function areaOk(g) { return !g.natOnly || !!(g.areaViews && g.areaViews.indexOf(S[g.id].view) >= 0); }
  function picks(g) {
    var s = S[g.id], h = '';
    if (g.group === 'area') { if (areaOk(g)) h += '<label><span class="lbl">Area</span><select data-k="area">' + PROV.filter(function (p) { return !(g.provOnly && !p[0]); }).map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === s.area ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('') + '</select></label>'; }
    else { var mo = muniOpts(g); h += '<label><span class="lbl">Council</span><select data-k="muni"' + (mo[1] ? '' : ' disabled') + '>' + mo[0] + '</select></label>'; }
    if (g.ward) h += '<label><span class="lbl">Ward</span><select data-k="ward">' + wardOptions(s.muni, s.ward) + '</select></label>';
    if (g.views && g.views.length > 1) h += '<label><span class="lbl">View</span><span class="lib-seg">' + g.views.map(function (v) { return '<button type="button" data-view="' + v[0] + '"' + (v[0] === s.view ? ' class="is-on"' : '') + '>' + esc(v[1]) + '</button>'; }).join('') + '</span></label>';
    return h;
  }
  // the card: the graphic, and beside it the pickers with the big button under them (Copy embed code; or Download PNG, the still at
  // twice the width picked); the kind of graphic is over the group's heading (show)
  function cardHtml(g, mode) {
    var still = mode === 'still';
    var act = still ? '<button type="button" class="btn is-primary is-big" data-act="png" data-kind="png" data-k="2">Download PNG</button>'
      : '<button type="button" class="btn is-primary is-big" data-act="code">Copy embed code</button>';
    return '<article class="g' + (still ? ' is-still' : '') + '" id="g-' + g.id + '" data-id="' + g.id + '" aria-label="' + esc(g.name) + '">' +
      '<div class="g-side"><div class="g-pick">' + picks(g) + '</div>' + act + '<p class="g-msg" aria-live="polite"></p></div>' +
      '<div class="g-stage"><iframe title="' + esc(g.name) + (still ? ': still graphic' : ': preview') + '"' + (g.locate && !still ? ' allow="geolocation"' : '') + (still ? ' scrolling="no"' : '') + ' loading="lazy"></iframe></div></article>';
  }
  var CUR = null; // the graphic on the page: the only card, the only frame loading
  /* ---- v3.7 · a graphic with auto in graphics.js (Council seats, Coalition builder): the code is as tall as the graphic needs for the council
     picked, every party in it (v3.13: Council seats, six of them and a half at most, the rest scrolling in their box). Measured when the council is picked, in hidden frames with the live results (as the code shows them), each
     taller than the graphic needs, which says how much of it it needs (EH_FIT.need, embed-fit.js): at the article column's width and a
     phone's, the larger of the two (aw in graphics.js: the Coalition builder a phone's alone, its half circle drawn as large as that room
     allows in the article column), rounded up to 10px; measured again after five minutes. Copy embed code waits for it the first time.
     Where the council's seats aren't in yet, or the graphic can't be measured, the code has the graphic's own height (h), and the message
     under the button says so.
     v3.11 · Results by ward (fluid): measured for the council and the view picked, its map at its full size (as wide as the frame, or as
     tall as the hub draws it) at each width, never taller than its own height (h), so nothing is left empty around the map or under it.
     Until the council's ward results are in (the key under the map waits for them), the code has h and is measured again 30 seconds on. ---- */
  var AUTO = {}, AUTO_AGE = 300000, AUTO_W = [668, 360];
  function autoKey(g) { return g.id + '|' + S[g.id].muni + (g.views ? '|' + S[g.id].view : ''); }
  // a frame measured, Results by ward: 1, its map drawn and the ward results in (the key under the map has its rows; Change since 2021: both
  // maps drawn, or the one there is); 0, the results not in yet (the key waits for them); -1, the map not drawn yet
  function wardsIn(W) {
    var d = W.document, v = W.EHX && W.EHX.view;
    if (v === 'cmp') return d.querySelector('.mf-wm-cmp .mf-wc-box svg') && !d.querySelector('.mf-wm-cmp .mf-wc-box.is-wait:not(.is-fail)') ? 1 : -1;
    if (!d.querySelector('.mf-wmap--res .mf-wm-box svg')) return -1;
    return d.querySelector('.mf-wmap--res .mf-wm-pane.is-on .res-tkey') ? 1 : d.querySelector('.mf-wmap--res .mf-wm-pane.is-on .mf-wm-note') ? 0 : -1;
  }
  function shortMuni(g) { var r = MUNI[S[g.id].muni]; return r ? r[1].replace(/ Local Municipality$/, '') : S[g.id].muni; }
  function measure(g) {
    var key = autoKey(g), a = AUTO[key], muni = S[g.id].muni, t0 = Date.now(), made = [];
    if (a && (a.busy || t0 - a.t < AUTO_AGE)) return;
    AUTO[key] = { busy: true, h: a ? a.h : 0, n: a ? a.n : 0, t: a ? a.t : 0 };
    var src = DIR + 'graphic.html?' + params(g) + '&still=1';
    function one(w) {
      return new Promise(function (ok, no) {
        var f = document.createElement('iframe');
        f.className = 'lib-shot'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.style.width = w + 'px'; f.style.height = '2400px';
        f.onload = function () {
          (function wait() {
            var W = null, E = null; try { W = f.contentWindow; E = W.EH_EMBED; } catch (x) {}
            if (!E) { if (Date.now() - t0 > 25000) no(new Error('not loaded')); else setTimeout(wait, 150); return; }
            E.ready(byMap(g) ? 15000 : 25000).then(function (done) {
              var k = E.state().k, d = W.document, F = W.EH_FIT, wi, nr;
              /* Results by ward: measured once its map is drawn and the results are in, though the count's last wards may still be coming in
                 (the page then never settles); without the key's No result yet row, which goes once they are in */
              if (byMap(g) && F && k !== 'loading' && k !== 'error' && (wi = wardsIn(W)) >= 0) {
                if (!wi) return ok({ h: 0, n: 0 });
                nr = d.querySelector('.mf-wmap--res .mf-wm-pane.is-on .res-tkey tr.is-nr');
                return ok({ h: F.need() - (nr ? nr.getBoundingClientRect().height : 0), n: 1 });
              }
              if (!done || !F || k === 'loading' || k === 'error' || byMap(g)) return no(new Error('not read'));
              ok({ h: F.need(), n: d.querySelectorAll(g.id === 'coalition' ? '.mf-coal-row .mf-cp' : '.ehx-seats-b .ehx-seats-r').length, hung: g.id === 'seats' && !!d.querySelector('.mf-res-seats.can-coal') });
            }, no);
          })();
        };
        f.onerror = no; f.src = src; made.push(f); document.body.appendChild(f);
      });
    }
    Promise.all((g.aw || AUTO_W).map(one)).then(function (r) {
      var n = r[0].n, h = Math.max.apply(null, r.map(function (x) { return x.h; })), cap = g.h || 760, hi;
      if (byMap(g)) AUTO[key] = r[0].n && r[1].n ? { h: hi = Math.min(cap, Math.floor(r[0].h / 10) * 10), lo: Math.min(hi, Math.floor(r[1].h / 10) * 10), n: 1, t: Date.now() } : { h: 0, none: true, t: Date.now() - AUTO_AGE + 30000 };
      // v3.13 · Council seats: the article column's height and a phone's, the code's height following its width between them (one height
      // where a phone needs as much)
      else if (g.fluid) AUTO[key] = n ? { h: hi = Math.ceil(h / 10) * 10, lo: Math.min(hi, Math.ceil(r[1].h / 10) * 10), n: n, hung: !!r[0].hung, t: Date.now() } : { h: 0, none: true, t: Date.now() };
      else AUTO[key] = n ? { h: Math.ceil(h / 10) * 10, n: n, hung: !!r[0].hung, t: Date.now() } : { h: 0, none: true, t: Date.now() };
    }, function () {
      AUTO[key] = { h: 0, failed: true, t: Date.now() - AUTO_AGE + 30000 };   // tried again 30 seconds on, at the next pick
    }).then(function () {
      made.forEach(function (f) { f.remove(); });
      if (CUR === g && UI.mode === 'live' && autoKey(g) === key && el(g)) { sizeFrame(g, frame(g)); autoUi(g); }
    });
  }
  // Copy embed code and the note under it, for what the measuring has found
  function autoUi(g) {
    var b = el(g).querySelector('[data-act="code"]'), a = AUTO[autoKey(g)] || {}, nm = shortMuni(g), wait = !!a.busy && !a.h, hn = hungNote(g);
    b.disabled = wait; if (!b.classList.contains('is-done')) b.textContent = wait ? 'Measuring\u2026' : 'Copy embed code';
    if (hn) msg(g, hn);
    else if (wait) msg(g, 'Measuring the graphic for ' + nm + ', so the code is as tall as ' + (byMap(g) ? 'its map needs' : g.aw ? 'it needs' : 'its parties need') + '\u2026');
    else if (a.h && g.id === 'seats') { var q = fluid(g); msg(g, 'The code is ' + (q ? q[1] + 'px high in the article column and ' + q[0] + 'px on a phone (its height follows its width)' : a.h + 'px high') + ': ' + (a.n > 7 ? 'the first six of ' + nm + '\u2019s ' + a.n + ' parties with seats show, and the rest scroll in their box.' : 'every one of ' + nm + '\u2019s ' + a.n + (a.n === 1 ? ' party' : ' parties') + ' with seats shows.') + (a.hung ? ' It is a hung council: readers can open the coalition builder in the graphic.' : '')); }
    else if (a.h && g.fluid) { var p = fluid(g); msg(g, p ? 'The code is ' + p[1] + 'px high in the article column and ' + p[0] + 'px on a phone (its height follows its width), so no room is left empty around ' + nm + '\u2019s map.' : 'The code is ' + a.h + 'px high, so no room is left empty around ' + nm + '\u2019s map in the article column or on a phone.'); }
    else if (a.h && g.aw) msg(g, 'The code is ' + a.h + 'px high, the height ' + nm + '\u2019s graphic needs on a phone. In the article column the half circle is drawn as large as that room allows.');
    else if (a.h) msg(g, 'The code is ' + a.h + 'px high, the height ' + nm + '\u2019s ' + a.n + (a.n === 1 ? ' party' : ' parties') + ' with seats need in the article column and on a phone.');
    else if (a.none && byMap(g)) msg(g, nm + '\u2019s ward results aren\u2019t in yet, so the code has the standard height (' + codeH(g) + 'px). Copy it again once they are, for the height its map needs.');
    else if (a.none) msg(g, nm + '\u2019s seats aren\u2019t in yet, so the code has the standard height (' + codeH(g) + 'px). Copy it again once they are, for the height its parties need.');
    else if (a.failed) msg(g, 'The graphic could not be measured, so the code has the standard height (' + codeH(g) + 'px).', true);
  }
  function el(g) { return document.getElementById('g-' + g.id); }
  function frame(g) { return el(g).querySelector('.g-stage iframe'); }
  function msg(g, t, err) { var m = el(g).querySelector('.g-msg'); m.textContent = t || ''; m.classList.toggle('is-err', !!err); }
  // the still's size: the picked width (the frame is laid out at it whatever the window, so the image is always that wide), the graphic's
  // own height (it reports it, the frame follows); in a window narrower than the image the preview is shown smaller (fitStill)
  function paintSize(g) {
    var e = el(g).querySelector('.g-size'), s = S[g.id]; if (!e) return;
    var w = UI.sw, st = el(g).querySelector('.g-stage'), small = st && st.clientWidth && st.clientWidth < w;
    e.textContent = s.h ? 'The PNG: ' + int(w * 2) + ' \u00d7 ' + int(s.h * 2) + ' px, twice the preview\u2019s ' + int(w) + ' \u00d7 ' + int(s.h) + '.' + (small ? ' The preview is shown smaller, to fit the window.' : '') : 'Drawing the graphic\u2026';
  }
  function fitStill(g) {
    var e = g && el(g); if (!e) return;
    var stg = e.querySelector('.g-stage'), f = frame(g), still = UI.mode === 'still', w = UI.sw, h = parseFloat(f.style.height) || 0;
    var k = still ? Math.min(1, (stg.clientWidth || w) / w) : 1, t = k < 0.999 ? 'scale(' + k.toFixed(4) + ')' : '';
    if (f.style.transform !== t) f.style.transform = t;
    stg.style.height = t && h ? Math.ceil(h * k) + 'px' : '';
  }
  window.addEventListener('resize', function () { if (CUR && UI.mode === 'still') { fitStill(CUR); paintSize(CUR); } });
  function load(g) {
    if (g.hungOnly) pickHung(g);
    var f = frame(g), still = UI.mode === 'still';
    S[g.id].h = 0; f.src = frameSrc(g); f.style.width = curW() + 'px';
    if (!still) sizeFrame(g, f); else if (!f.style.height) f.style.height = codeH(g) + 'px';
    if (still) { paintSize(g); fitStill(g); }
    else if (g.auto) measure(g);
    if (g.hungOnly) scanHung(g);
    if (!still) paintNote(g);
  }
  function setView(g, v) {
    S[g.id].view = v;
    if (g.natOnly) el(g).querySelector('.g-pick').innerHTML = picks(g);   // the Area picker comes and goes with the view
    [].forEach.call(el(g).querySelectorAll('.g-pick [data-view]'), function (x) { x.classList.toggle('is-on', x.getAttribute('data-view') === v); });
    msg(g, ''); load(g);
  }
  /* ---- the menus (Interactive graphics and Still graphics, in the bar at the top): every graphic in its group, with a snapshot of it
     (assets/menu/, drawn by qa/menu-thumbs.html from the sample count); pointing at a view shows that view's. Still graphics leaves out
     the graphics that need a reader (noStill). A graphic or a view picked replaces the one on the page. ---- */
  var bar = document.querySelector('.lib-top'), navBtns = [], navPanel, navScrim, navMode = '', navSeen = false;
  var groups = [['area', 'lib-cards-area'], ['muni', 'lib-cards-muni']].map(function (x) { var h = document.getElementById(x[1]).previousElementSibling; return { k: x[0], name: h ? h.textContent : '' }; });
  function thumb(g, v) { return DIR + 'assets/menu/' + g.id + (v ? '-' + v : '') + '.webp?v=2'; }
  function tileHtml(g, mode) {
    var cur = !page && CUR === g && UI.mode === mode, href = '#' + MODE[mode].hash + g.id;
    return '<li class="lib-nav-tile' + (cur ? ' is-current' : '') + '" data-id="' + g.id + '"><a class="lib-nav-a" href="' + href + '" data-id="' + g.id + '"' + (cur ? ' aria-current="true"' : '') + '><span class="lib-nav-img"><img src="' + esc(thumb(g, g.views ? g.views[0][0] : '')) + '" alt="" width="480" height="360" loading="lazy" decoding="async"></span><span class="lib-nav-name">' + esc(g.name) + '</span></a>' +
      (g.views && g.views.length > 1 ? '<span class="lib-nav-views">' + g.views.map(function (v) { return '<a href="' + href + '" data-id="' + g.id + '" data-view="' + v[0] + '">' + esc(v[1]) + '</a>'; }).join('') + '</span>' : '') + '</li>';
  }
  function panelHtml(mode) {
    return '<div class="lib-nav-in"><div class="lib-nav-hd"><div class="lib-nav-tl"><h2 class="lib-nav-title">' + esc(MODE[mode].name) + '</h2>' + (MODE[mode].only ? '<span class="lib-nav-only">' + esc(MODE[mode].only) + '</span>' : '') + '</div><p class="lib-nav-lead">' + esc(MODE[mode].lead) + '</p></div>' + groups.map(function (x) {
      var list = GR.filter(function (g) { return g.group === x.k && !(mode === 'still' && g.noStill); });
      return '<section class="lib-nav-grp"><h2 class="lib-nav-h">' + esc(x.name) + '</h2><ul class="lib-nav-tiles">' + list.map(function (g) { return tileHtml(g, mode); }).join('') + '</ul></section>';
    }).join('') + '</div>';
  }
  (function nav() {
    var wrap = document.createElement('div'); wrap.className = 'lib-nav';
    wrap.innerHTML = ['live', 'still'].map(function (m) { return '<button type="button" class="lib-nav-btn" data-mode="' + m + '" aria-expanded="false" aria-controls="lib-nav-panel"><span class="lib-nav-l">' + MODE[m].name.replace(' graphics', '<span class="lib-nav-x"> graphics</span>') + '</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.25l4 4 4-4"></path></svg></button>'; }).join('');
    bar.insertBefore(wrap, bar.firstChild);
    navScrim = document.createElement('div'); navScrim.className = 'lib-nav-scrim'; navScrim.hidden = true;
    navPanel = document.createElement('div'); navPanel.className = 'lib-nav-panel'; navPanel.id = 'lib-nav-panel'; navPanel.hidden = true;
    navPanel.setAttribute('role', 'region');
    bar.appendChild(navScrim); bar.appendChild(navPanel);
    navBtns = [].slice.call(wrap.querySelectorAll('button'));
  })();
  // where the menus open: the bar's foot (under the logo at the top of the page, at the top of the window once the bar sticks)
  function barFoot() { var b = Math.round(bar.getBoundingClientRect().bottom), h = bar.offsetHeight; if (b !== barFoot.v) { barFoot.v = b; bar.style.setProperty('--bar-b', b + 'px'); } if (h !== barFoot.h) { barFoot.h = h; document.documentElement.style.setProperty('--bar-h', h + 'px'); } }
  barFoot(); ['scroll', 'resize', 'load'].forEach(function (t) { window.addEventListener(t, barFoot, { passive: true }); });
  function btnOf(m) { return navBtns.filter(function (b) { return b.getAttribute('data-mode') === m; })[0]; }
  function navOpen(mode) {
    navMode = mode || ''; barFoot();
    if (mode) { navPanel.innerHTML = panelHtml(mode); navPanel.setAttribute('aria-label', MODE[mode].name); }
    navPanel.hidden = navScrim.hidden = !mode;
    navBtns.forEach(function (b) { b.setAttribute('aria-expanded', mode && b.getAttribute('data-mode') === mode ? 'true' : 'false'); });
    if (mode && !navSeen) { navSeen = true; GR.forEach(function (g) { (g.views || []).slice(1).forEach(function (v) { new Image().src = thumb(g, v[0]); }); }); }
  }
  function tileImg(t, v) { var g = gOf(t.getAttribute('data-id')), im = t.querySelector('img'), u = thumb(g, v || (g.views ? g.views[0][0] : '')); if (im.getAttribute('src') !== u) im.setAttribute('src', u); }
  function hover(e) { var t = e.target.closest('.lib-nav-tile'), a = e.target.closest('[data-view]'); if (t) tileImg(t, a ? a.getAttribute('data-view') : ''); }
  navBtns.forEach(function (b) { b.addEventListener('click', function () { var m = b.getAttribute('data-mode'); navOpen(navMode === m ? '' : m); }); });
  navScrim.addEventListener('click', function () { navOpen(''); });
  navPanel.addEventListener('mouseover', hover);
  navPanel.addEventListener('focusin', hover);
  navPanel.addEventListener('mouseout', function (e) { var t = e.target.closest('.lib-nav-tile'); if (t && !t.contains(e.relatedTarget)) tileImg(t, ''); });
  navPanel.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-id]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    var m = navMode; e.preventDefault(); navOpen(''); show(a.getAttribute('data-id'), a.getAttribute('data-view'), { scroll: true, mode: m });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !navPanel.hidden) { var b = btnOf(navMode); navOpen(''); if (b) b.focus(); } });
  document.addEventListener('click', function (e) { if (!navPanel.hidden && !e.target.closest('.lib-nav-panel, .lib-nav')) navOpen(''); });
  // the pages (Hub anchors, Header illustrations: anchors.js and illustrations.js add them): a button each in the bar, no menu, that puts
  // its page in the graphic's place (#<its name> in the address); the button of what is showing is black
  var main = document.querySelector('.lib-main'), pages = {}, page = '';
  function paintBtns() { navBtns.forEach(function (b) { b.classList.toggle('is-active', !page && b.getAttribute('data-mode') === UI.mode); }); }
  function pageShow(h) {
    page = pages[h] ? h : ''; navOpen('');
    main.classList.toggle('is-page', !!page);
    Object.keys(pages).forEach(function (k) { var on = k === page, b = pages[k].btn; pages[k].el.hidden = !on; b.classList.toggle('is-active', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    paintBtns();
    if (page) { var u = new URL(location.href); u.hash = page; history.replaceState(null, '', u.toString()); window.scrollTo(0, 0); }
  }
  window.LIB_PAGE = function (h, btn, el) {
    pages[h] = { btn: btn, el: el }; el.classList.add('lib-page'); el.hidden = true; main.appendChild(el);
    btn.addEventListener('click', function () { if (page !== h) pageShow(h); });
    if (location.hash === '#' + h) pageShow(h);
  };
  // the figures the previews show (FIG), picked in the preview page's Tweaks: the graphic on the page loads again with them; codes and
  // links keep the live results. Returns the note on the figures picked.
  window.LIB_FIG = function (f) {
    if (FIG.hasOwnProperty(f) && f !== UI.fig) { UI.fig = f; if (CUR && !page && el(CUR)) { msg(CUR, ''); load(CUR); } }
    return FIG_NOTE[UI.fig] || '';
  };
  // the graphic picked: its card alone in its group (the other group's heading hidden), its frame loading and #g-… (interactive) or #s-…
  // (still) in the address; from a menu, also the view picked and the card under the bar
  var kick = document.createElement('p'); kick.className = 'g-mode lib-mode'; // the kind of graphic, over the group's heading
  function show(id, view, o) {
    var g = gOf(id) || GR[0]; if (!g) return; o = o || {};
    var mode = o.mode === 'still' && !g.noStill ? 'still' : o.mode === 'live' ? 'live' : UI.mode === 'still' && !g.noStill ? 'still' : 'live';
    if (!(view && g.views && g.views.some(function (v) { return v[0] === view; }))) view = '';
    var back = !!page; if (back) pageShow(''); // from a page: the graphic again, its card drawn afresh
    if (back || CUR !== g || UI.mode !== mode) {
      CUR = g; UI.mode = mode; if (view) S[g.id].view = view;
      kick.innerHTML = MODE[mode].card + (MODE[mode].only ? '<span class="g-only">' + esc(MODE[mode].only) + '</span>' : '');
      groups.forEach(function (x, i) {
        var box = document.getElementById(['lib-cards-area', 'lib-cards-muni'][i]), on = g.group === x.k, h = box.previousElementSibling;
        box.innerHTML = on ? cardHtml(g, mode) : ''; box.hidden = !on; if (h) { h.hidden = !on; if (on) h.parentNode.insertBefore(kick, h); }
      });
      load(g);
    } else if (view && S[g.id].view !== view) setView(g, view);
    paintBtns(); // the kind of graphic showing: its menu's button black
    if (!o.keep) { var u = new URL(location.href); u.hash = MODE[mode].hash + g.id; history.replaceState(null, '', u.toString()); }
    if (!o.scroll) return;
    var e = el(g), still = o.instant || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    window.scrollTo({ top: Math.max(0, kick.getBoundingClientRect().top + window.pageYOffset - bar.offsetHeight - 12), behavior: still ? 'auto' : 'smooth' });
    e.classList.remove('is-target'); void e.offsetWidth; e.classList.add('is-target');
    try { e.querySelector(mode === 'live' ? '[data-act="code"]' : '[data-act="png"]').focus({ preventScroll: true }); } catch (x) {}
  }
  function fromHash() { var m = /^#([gs])-(.+)$/.exec(location.hash), g = m && gOf(m[2]); return g ? { g: g, mode: m[1] === 's' ? 'still' : 'live' } : null; }
  var first = fromHash();
  show(first ? first.g.id : GR[0] && GR[0].id, null, { mode: first ? first.mode : 'live', keep: !first && location.hash.length > 1 }); // a page's address kept for it
  if (first) (document.fonts && document.fonts.ready || Promise.resolve()).then(function () { show(first.g.id, null, { scroll: true, instant: true, mode: first.mode }); });
  window.addEventListener('hashchange', function () { var x = fromHash(); if (x) show(x.g.id, null, { scroll: true, mode: x.mode }); else if (pages[location.hash.slice(1)]) pageShow(location.hash.slice(1)); });
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
    if (b.hasAttribute('data-view')) { setView(g, b.getAttribute('data-view')); return; }
    var act = b.getAttribute('data-act');
    if (act === 'code') copy(g, b, code(g), 'Embed code copied. Paste it into the article\u2019s HTML block.');
    else if (act === 'link') copy(g, b, link(g), 'Link copied.');
    else if (act === 'png') shot(g, b);
    else if (act === 'mode') show(g.id, null, { mode: b.getAttribute('data-mode'), scroll: true });
  });
  function copy(g, b, text, done) {
    var ok = function () { msg(g, done); var t = b.textContent; b.classList.add('is-done'); b.textContent = 'Copied'; setTimeout(function () { b.classList.remove('is-done'); b.textContent = t; }, 1600); };
    var fall = function () { var ta = document.createElement('textarea'), done = false; ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(ta); ta.select(); try { done = document.execCommand('copy'); } catch (x) {} ta.remove(); if (done) ok(); else msg(g, 'The browser would not copy it. Try again, or in another browser.', true); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fall); else fall();
  }
  /* ---- images, from the still graphic: Download PNG, the preview as it stands (its width, its whole height) at twice its size; square and wide (not on the card) from a still
     drawn at a width that suits the format (1000 for the square, the map beside its list; 1240 for the wide), on the library's grey ---- */
  var SHOT_W = { square: 1000, wide: 1240 };
  function shot(g, b) {
    var kind = b.getAttribute('data-kind'), k = +b.getAttribute('data-k') || 1, was = b.textContent, made = null;
    b.disabled = true; b.textContent = 'Drawing\u2026'; msg(g, 'Drawing the image\u2026');
    var win = kind === 'png' ? Promise.resolve(frame(g).contentWindow) : new Promise(function (ok, no) {
      made = document.createElement('iframe'); made.className = 'lib-shot'; made.setAttribute('aria-hidden', 'true'); made.tabIndex = -1;
      made.style.width = SHOT_W[kind] + 'px'; made.style.height = '1000px';
      made.onload = function () { ok(made.contentWindow); };
      made.onerror = no;
      made.src = frameSrc(g, 'still=1');
      document.body.appendChild(made);
    });
    win.then(function (w) {
      var t0 = Date.now();
      return new Promise(function (ok, no) { (function wait() { var X = null; try { X = w.EH_EXPORT; } catch (x) {} if (X) ok(X); else if (Date.now() - t0 > 20000) no(new Error('the graphic did not load')); else setTimeout(wait, 150); })(); })
        .then(function (X) { return X.snap({ kind: kind, scale: k }).then(function (blob) { var E = null; try { E = w.EH_EMBED; } catch (x) {} return { blob: blob, fonts: X.fontsStatus ? X.fontsStatus() : null, at: E && E.asAt ? E.asAt() : null }; }); });
    }).then(function (r) {
      var blob = r.blob, a = document.createElement('a'), u = URL.createObjectURL(blob);
      a.href = u; a.download = fileName(g, kind, k, r.at); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
      msg(g, 'Downloaded ' + a.download + ' (' + Math.round(blob.size / 1024) + ' KB).' + (r.at && r.at.text ? ' ' + r.at.text + '.' : '') + (r.fonts && !r.fonts.ok ? ' ' + r.fonts.text : ''), !!(r.fonts && !r.fonts.ok));
    }, function (e) { msg(g, 'The image could not be made: ' + (e && e.message || e) + '.', true); }).then(function () { if (made) made.remove(); b.disabled = false; b.textContent = was; });
  }
  /* ---- the frames report their height: an interactive one stays at its fixed height (kept for the record); a still one follows it, so
     the preview is as long as the image ---- */
  window.addEventListener('message', function (e) {
    var m = e.data, g = CUR, f = g && el(g) && frame(g); if (!f || !m || m.ehx !== 'height' || !(m.h > 40) || f.contentWindow !== e.source) return;
    S[g.id].h = Math.ceil(m.h); S[g.id].hw = Math.round(f.getBoundingClientRect().width);
    if (UI.mode === 'still') { f.style.height = S[g.id].h + 'px'; fitStill(g); paintSize(g); }
  });
})();
