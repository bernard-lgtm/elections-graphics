/* embed.js — runs after the hub, for graphic.html?embed=…: writes the title over the graphic with the count's box beside it (the hub's:
   Counting in red, Count complete in charcoal, Results declared in green) and the credit at the foot (the link to the hub, the masthead; v3.8:
   on the graphics of the full count, the note on the ballots over it), keeps
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
  var root, hrow, head, kEl, tEl, tagEl, stat, asatEl = null, foot, noteEl = null, coal = null, coalT, coalB, booted = false;
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
    else { var m = muniOf(st.muni); t = m ? shortName(st.muni) : st.muni; if (g.ward && st.ward) t += '\u00a0\u00b7 Ward ' + st.ward; }
    // v3.7 · the Coalition builder's title is the hub's own question (its button in the council's box), with no kicker over it
    if (g.id === 'coalition') return { kicker: '', title: 'Who can build a coalition in ' + t + '?' };
    // v3.12 · Turnout by province: no kicker; its title, Voter turnout
    if (g.id === 'turnprov') return { kicker: '', title: 'Voter turnout' };
    return { kicker: k, title: t };
  }
  function hubAnchor() {
    var A = window.EH_ANCHOR;
    if (!A) return '';
    try { return nat ? A.tab(HUB_TAB[g.tab] || 'all', areaNow()) : A.council(st.muni, g.ward ? { ward: st.ward } : g.id === 'coalition' ? { coal: true } : g.id === 'wards' ? { wards: true } : {}); } catch (e) { return ''; }
  }
  // the results page (config.js hubUrl), at the graphic's own place; once the graphic shows Results declared, the results declared page
  // (declaredUrl), if set (not for the 2021 figures)
  function clean(u) { return String(u || '').replace(/#.*$/, ''); }
  var HUB = clean(C.hubUrl || 'https://www.dailymaverick.co.za/local-elections-results-2026/'), HUB_D = clean(C.declaredUrl);
  function hubBase() { if (!HUB_D) return HUB; var s = state(); return (s.k === 'final' || s.held) && !s.past ? HUB_D : HUB; }
  function hubLink(a) { return hubBase() + (a ? '#' + a : ''); }
  function hubShort() { return hubBase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, ''); }
  function dayNo(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim()); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : null; }
  function dayTxt(n) { var d = new Date(n * 864e5); return WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function hhmm(t) { var d = new Date(t + 72e5); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); }
  function stamp(t) { var d = new Date(t + 72e5); return hhmm(t) + ' on ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function int(n) { var R = R$(); return R && R.int ? R.int(n) : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }

  /* ---- where the count stands, for the place the graphic shows: the area in view (South Africa or a province) or the council ---- */
  var wardR = null, wardKey = '';
  function fetchWard() {   // the ward graphic: the count in the ward itself (the hub reads it once for the ward box; this asks its cache)
    var R = R$(), W = window.SA_WARD_INDEX || {}, x = W[st.muni];
    if (!g.ward || !R || !R.ward || !x || !st.ward) return;
    var id = x[1] + ('00' + st.ward).slice(-3), k = id + '|' + (R.S && R.S.updated);
    if (k === wardKey) return;
    wardKey = k;
    R.ward(st.muni, id).then(function (r) { if (r) { wardR = r; if (window.__ehxLater) window.__ehxLater(); } }, function () {});
  }
  function placeR() {
    var R = R$(); if (!R || !R.S) return null;
    if (g.ward && wardR) return wardR;
    if (!nat) { var x = R.IX && R.IX[st.muni]; return x && x.e ? R.norm(x.e) : null; }
    var pc = areaNow();
    return pc ? (window.EH_AREA && EH_AREA.provR ? EH_AREA.provR(pc) : null) : R.norm(R.S.nat);
  }
  // v3.15: a council the hub holds provisional after the declaration (HOLD in the hub's script): its graphics and its wards' keep the count's
  // box (Counting, or Count complete) until its own count is complete; their links still open the results declared page
  function held() { var R = R$(), x = !nat && st.muni && R && R.IX && R.IX[st.muni]; return !!(x && x.e && R.S && R.S.phase === 'final' && R.norm(x.e).held); }
  function state() {
    var R = R$(), S = R && R.S;
    if (!S || S.state === 'loading') return { k: 'loading' };
    if (S.state === 'error') return { k: 'error' };
    var P = placeR(), past = !S.sample && String(S.src) !== String(($('dm-eh') && $('dm-eh').getAttribute('data-year')) || '2026'), hold = !past && held();
    if ((S.phase === 'final' && !hold) || past) return { k: 'final', R: P, past: past };
    var done = S.phase === 'provisional' || (P && P.vdCount > 0 && (P.complete || P.vdCaptured >= P.vdCount));
    if (done) return { k: 'complete', R: P, held: hold };
    if (P && P.vdCaptured > 0) return { k: 'counting', R: P, pct: R.declared ? R.declared(P) : P.vdCaptured / P.vdCount * 100, held: hold };
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
    var s = state(), R = R$(), S = R && R.S, html = box(yr21() ? { k: 'final', past: true } : s), h = document.documentElement;   // v3.14: Votes by party on 2021, that election's box
    if (yr21()) html = html.replace('ehx-done is-done', 'ehx-done is-done ehx-past');   // in white with a black outline: only this election's box is in colour
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
    var tag = s.past ? '2021 figures' : '';
    if (tagEl.textContent !== tag) tagEl.textContent = tag;
    if (tagEl.hidden !== !tag) tagEl.hidden = !tag;
    paintK();
  }
  // the kicker's line, with the 2021 tag: none where both are empty (the Coalition builder)
  function paintK() { var k = kEl.parentNode, off = !kEl.textContent && tagEl.hidden; if (k.hidden !== off) k.hidden = off; }
  /* ---- still graphics (&mode=still): the time of the figures over the count's box (v3.9: Figures as at, then the time and the day in bold), from
     the feed's last reading (the sample and the 2021 results say what they are instead); every list's Show all pressed, so every row is in the image ---- */
  function asAt() {
    var R = R$(), S = R && R.S, s = state(), t = (S && S.updated) || Date.now();
    if (s.k === 'loading' || s.k === 'error') return { t: Date.now(), text: '', tag: '' };
    if (s.past) return { t: t, text: 'Final results of the 2021 local elections', tag: '2021' };
    if (S && S.sample) return { t: t, text: 'Sample figures for testing, not election results', tag: 'sample' };
    var on = stamp(t).split(' on ');
    return { t: t, text: 'Figures as at ' + on[0] + ' SAST on ' + on[1], tag: '', time: on[0] + ' SAST', day: on[1] };
  }
  var asatHtml = '';
  function paintStamp() {
    var a = asAt(), html = !a.text ? '' : a.time ? '<span class="l">Figures as at</span><span class="v"><span>' + esc(a.time) + ',</span> <span>' + esc(a.day) + '</span></span>' : '<span class="v is-note">' + esc(a.text) + '</span>';
    if (asatEl && html !== asatHtml) { asatEl.innerHTML = html; asatHtml = html; }
  }
  function openAll() { [].forEach.call(root.querySelectorAll('.mf-res-more[aria-expanded="false"]'), function (b) { b.click(); }); }
  /* ---- v3.4 · a still graphic's lists, kept short. Votes by party: every party with seats on the council, the rest together as Others
     (before the seats are allocated, the five largest parties, then Others). A ward's result: the candidates of the parties with seats on the
     council and any other with 5% of the ward's votes or more (the winner always), the rest as Others. Others only when it holds two or
     more. The hub's rows are only hidden (tr.ehx-cut), so its updates find its table as they left it. ---- */
  var TOP = 5, OWN = 5;
  function num(s) { return +String(s || '').replace(/\D/g, '') || 0; }
  function share(tr) { var b = tr.querySelector('.shb strong'); return b ? parseFloat(b.textContent.replace(',', '.')) || 0 : 0; }
  function seatedSet() {
    var R = R$(), x = R && R.IX && R.IX[st.muni], P = x && x.e ? R.norm(x.e) : null, o = null;
    var v = P && R.seatsView ? R.seatsView(P) : null, Q = v && v.R && (v.kind === 'final' || v.kind === 'provisional') ? v.R : null;
    if (Q) Q.parties.forEach(function (p) { if (p.seats > 0) { o = o || {}; o[p.label] = 1; if (p.name) o[p.name] = 1; } });
    return o;
  }
  function groupRows(tb, keep, unit, four) {
    var rows = [].filter.call(tb.rows, function (tr) { return !tr.classList.contains('ehx-oth'); });
    var rest = rows.filter(function (tr, i) { return !keep(tr, i); }), oth = tb.querySelector(':scope > tr.ehx-oth');
    if (rest.length < 2) rest = [];
    rows.forEach(function (tr) { var c = rest.indexOf(tr) >= 0; if (tr.classList.contains('ehx-cut') !== c) tr.classList.toggle('ehx-cut', c); });
    if (!rest.length) { if (oth) oth.remove(); return; }
    var R = R$(), col = (R && R.OTHERS) || '#c0c0c0', tot = 0, mx = 0, n = 0;
    rows.forEach(function (tr) { var v = num((tr.querySelector('td.v') || {}).textContent); tot += v; if (v > mx) mx = v; if (rest.indexOf(tr) >= 0) n += v; });
    var pc = tot ? n / tot * 100 : 0, f = mx ? Math.min(1, n / mx).toFixed(4) : 0, w = 'width:calc((100% - 56px) * ' + f + ')';
    var p = R && R.pct ? R.pct(pc) : (Math.round(pc * 10) / 10).toFixed(1).replace('.', ',') + '%';
    var html = '<th scope="row" class="p"><div class="pc"><span class="sw" style="background:' + col + '"></span><span class="pn"><strong>Others</strong><span class="cd ehx-n">' + rest.length + ' ' + unit + '</span></span></div></th>' +
      '<td class="sh"><span class="shb">' + (four ? '<span class="bar" style="' + w + ';--c:' + col + '"><i class="w" style="flex-grow:1;--c:' + col + '"></i></span>' : '<i style="' + w + ';background:' + col + '"></i>') + '<strong>' + p + '</strong></span></td>' +
      '<td class="n v">' + int(n) + '</td>' + (four ? '<td class="n"><span class="na">\u2013</span></td>' : '');
    if (!oth) { oth = document.createElement('tr'); oth.className = 'ehx-oth'; }
    if (oth._ehx !== html) { oth.innerHTML = html; oth._ehx = html; }   // the markup as written: innerHTML reads the spaces in the figures back as &nbsp;
    if (oth.parentNode !== tb || tb.lastElementChild !== oth) tb.appendChild(oth);
  }
  function cutLists() {
    var tb;
    if ((g.id === 'votes' || g.id === 'votescmp') && (tb = root.querySelector('.mf-res-tbl .mf-res-table tbody'))) {
      var seat = function (tr) { var c = tr.cells[tr.cells.length - 1], s = c && c.querySelector('strong'); return !!s && num(s.textContent) > 0; };
      var any = [].some.call(tb.rows, function (tr) { return !tr.classList.contains('ehx-oth') && seat(tr); });
      groupRows(tb, function (tr, i) { return any ? seat(tr) : i < TOP; }, 'parties', true);
    }
    if (g.id === 'ward' && (tb = root.querySelector('.wr-list .mf-res-table tbody'))) {
      var S = seatedSet();
      groupRows(tb, function (tr, i) { var b = tr.querySelector('.pn strong'); return i === 0 || share(tr) >= OWN || (S ? !!(b && (S[b.textContent.trim()] || S[b.getAttribute('title') || ''])) : i < TOP); }, 'candidates', false);
    }
    if (g.id === 'hung') {
      var hb = $('eh-hung-body'), mix = !!(hb && hb.querySelector('.eh-hung-st.is-d') && hb.querySelector('.eh-hung-st:not(.is-d)'));
      if (hb && hb.classList.contains('ehx-hmix') !== mix) hb.classList.toggle('ehx-hmix', mix);
    }
  }
  /* ---- Council seats: under the box, every party with seats, largest first, with its votes and its seats (the seats the half circle shows:
     the Commission's, or provisional seats from the full count). Beside the results box, not in it, so the hub's live updates leave it (and
     where it is scrolled to) in place. The embed code's height is measured for the council (library.js), so every row shows; only where the
     frame is short of them (a code copied before the seats were in) do they scroll in a box of their own (embed-fit.js).
     v3.7 · each party's votes as a bar (the largest party's the column's width), split by ballot as in the hub's open row in Votes by party:
     ward votes solid, PR hatched, a local council's district ballot dotted, the figures under it and the key in the head. ---- */
  var BAL = [['w', 'Ward', 'wardVotes'], ['l', 'PR', 'prVotes'], ['d', 'District', 'dcVotes']];
  function balOf(p) { var o = []; BAL.forEach(function (b) { if (p[b[2]] > 0) o.push({ k: b[0], lbl: b[1], v: p[b[2]] }); }); return o; }
  var seatsHtml = null, seatsKey = null;
  function paintSeats() {
    var R = R$(), x = R && R.IX && R.IX[st.muni], P = x && x.e ? R.norm(x.e) : null, res = $('mf-res'), el = root.querySelector('.ehx-seats');
    var v = P && R.seatsView ? R.seatsView(P) : null, Q = v && v.R && (v.kind === 'final' || v.kind === 'provisional') ? v.R : null;
    var list = Q ? Q.parties.filter(function (p) { return p.seats > 0; }).sort(R.bySeats || function (a, b) { return b.seats - a.seats || b.votes - a.votes; }) : [];
    if (!res || !list.length) { if (el) el.remove(); seatsHtml = null; return; }
    if (!el) {
      el = document.createElement('div'); el.className = 'ehx-seats'; el.setAttribute('role', 'table'); el.setAttribute('aria-label', 'Votes and seats by party');
      el.innerHTML = '<div class="ehx-seats-h" role="rowgroup"><div class="ehx-seats-r" role="row"><span class="p" role="columnheader">Party</span><span class="k" role="columnheader"></span><span class="n" role="columnheader">Votes</span><span class="n" role="columnheader">Seats</span></div></div><div class="ehx-seats-b" role="rowgroup"></div>';
      seatsHtml = seatsKey = null;
    }
    if (el.previousElementSibling !== res) res.parentNode.insertBefore(el, res.nextSibling);
    var mx = Math.max.apply(null, list.map(function (p) { return p.votes || 0; })) || 1, kinds = {};
    var html = list.map(function (p) {
      var bs = balOf(p), c = '--c:' + esc(p.col), f = Math.max(0, Math.min(1, (p.votes || 0) / mx));
      bs.forEach(function (b) { kinds[b.k] = 1; });
      var bar = '<span class="bar" style="width:' + (f * 100).toFixed(2) + '%;' + c + '">' + (bs.length ? bs : [{ k: 'a', v: 1 }]).map(function (b) { return '<i class="' + b.k + '" style="flex-grow:' + b.v + '"></i>'; }).join('') + '</span>';
      var sub = bs.length ? '<span class="sp">' + bs.map(function (b) { return '<span>' + b.lbl + ' ' + int(b.v) + '</span>'; }).join('') + '</span>' : '';
      return '<div class="ehx-seats-r" role="row"><span class="p" role="cell"' + (p.name && p.name !== p.label ? ' title="' + esc(p.name) + '"' : '') + '><i style="background:' + esc(p.col) + '"></i><b>' + esc(p.label) + '</b></span>' +
        '<span class="b" role="cell">' + bar + sub + '</span>' +
        '<span class="n v" role="cell">' + int(p.votes || 0) + '</span><span class="n s" role="cell">' + p.seats + '</span></div>';
    }).join('');
    var key = BAL.filter(function (b) { return kinds[b[0]]; }).map(function (b) { return '<span><i class="' + b[0] + '"></i>' + b[1] + '</span>'; }).join('');
    if (key !== seatsKey) { el.querySelector('.ehx-seats-h .k').innerHTML = key; seatsKey = key; }
    if (html !== seatsHtml) { el.lastChild.innerHTML = html; seatsHtml = html; }
  }
  /* ---- v3.13 · Council seats, a hung council: the hub's Who can build a coalition in <council>? at the box's top right opens its coalition
     mode in the graphic (the half circle empties, the parties' buttons come in under it and push the votes down), and Back to results stands
     over the box, on the left. It presses the hub's own back button (hidden here), which leads back to the seats. Outside the hub's results,
     so its live updates leave it in place. ---- */
  var sback = null;
  function paintSback() {
    if (!sback) return;
    var res = $('mf-res'), on = !!(res && res.querySelector('.mf-res-seats.can-coal.is-coal'));
    if (res && sback.nextElementSibling !== res) res.parentNode.insertBefore(sback, res);
    if (sback.hidden !== !on) sback.hidden = !on;
  }
  /* ---- v3.14 · Votes by party: change since 2021 (embed=votescmp). A switch over the table, 2021 or 2026 (interactive only; none where the page
     itself shows 2021, the preview's 2021 figures). 2021: the council's 2021 result in the hub's own table (render.tableSec), in a box of its own after the hub's (.ehx-v21),
     the hub's hidden while it shows (html.ehx-y21), so the hub's live updates leave both in place. Read as the graphic loads, for the change
     column (paintChg): the hub's councilPrev, the province's 2021 results (/local/2021/provinces/{Province}), once
     for the visit; where the read fails, again 30 seconds on. The count's box follows the year on show (2021: Results declared, 4 November 2021). ---- */
  var YR = { y: '', el: null, box: null, P: null, tbl: '', busy: false, t: 0, none: false, html: null };
  function yrData() { var R = R$(); return g.id === 'votescmp' && !!(R && R.S && R.hasPrev && R.hasPrev() && R.councilPrev); }
  function yrCan() { var R = R$(); return yrData() && !X.still && !!(R.render && R.render.tableSec); }
  function yrPrev() { var R = R$(); return String((R && R.PREV) || '2021'); }
  function yr21() { return !!YR.y && YR.y === yrPrev() && yrCan(); }
  function yrLater() { if (window.__ehxLater) window.__ehxLater(); }
  function yrRead() {
    var R = R$(), key = st.muni;
    if (!yrData() || YR.P || YR.none || YR.busy || Date.now() - YR.t < 30000) return;
    YR.busy = true;
    R.councilPrev(key).then(function (P) {
      YR.busy = false; YR.t = Date.now();
      if (P) YR.P = P;
      else {
        // the province read without the council in it (none), or the read failed: tried again 30 seconds on
        var x = R.IX && R.IX[key], m = muniOf(key), pc = (x && x.pc) || (m && m.p), IXP = R.IXP || {}, k;
        for (k in IXP) if (IXP[k] && IXP[k].pc === pc) { YR.none = true; break; }
        if (!YR.none) setTimeout(yrLater, 30500);
      }
      yrLater();
    });
  }
  function yrBuild() {
    var el = document.createElement('div'), now = String(R$().S.year), prev = yrPrev();
    el.className = 'ehx-yrs'; el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'Election');
    el.innerHTML = '<button type="button" data-y="' + prev + '" aria-pressed="false">' + prev + '</button><button type="button" data-y="' + now + '" aria-pressed="true">' + now + '</button>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-y]'), y = b && b.getAttribute('data-y');
      if (!y || y === (YR.y || now)) return;
      YR.y = y === now ? '' : y;
      paintYr(); paintStatus(); paintBallots();
      if (window.EH_FIT && EH_FIT.fit) EH_FIT.fit();
      yrLater();
    });
    return el;
  }
  function paintYr() {
    var R = R$(), res = $('mf-res'), h = document.documentElement, can = yrCan() && !!res, on = can && yr21();
    var el = YR.el && YR.el.isConnected ? YR.el : null, box = YR.box && YR.box.isConnected ? YR.box : null;
    if (h.classList.contains('ehx-yr') !== can) h.classList.toggle('ehx-yr', can);
    if (h.classList.contains('ehx-y21') !== on) h.classList.toggle('ehx-y21', on);
    if (!can) { if (el) el.remove(); if (box) box.remove(); return; }
    if (!el) el = YR.el = yrBuild();
    if (el.nextElementSibling !== res) res.parentNode.insertBefore(el, res);
    if (!box) { box = YR.box = document.createElement('div'); box.className = 'mf-res ehx-v21'; YR.html = null; }
    if (box.previousElementSibling !== res) res.parentNode.insertBefore(box, res.nextSibling);
    var cur = YR.y || String(R.S.year);
    [].forEach.call(el.children, function (b) { var p = String(b.getAttribute('data-y') === cur); if (b.getAttribute('aria-pressed') !== p) b.setAttribute('aria-pressed', p); });
    if (!on) return;
    yrRead();
    var y = yrPrev(), no = '<p class="ehx-v21-msg">No ' + y + ' result for this council.</p>';
    if (YR.P && !YR.tbl) YR.tbl = R.render.tableSec(YR.P) || no;
    var html = YR.tbl || (YR.none ? no : YR.busy ? R.wait() : '<p class="ehx-v21-msg">The ' + y + ' results could not be read. The graphic tries again by itself.</p>');
    if (html !== YR.html) { box.innerHTML = html; YR.html = html; }
  }
  /* ---- v3.14 · the change column, after the share in the hub's 2026 table: each party's share now less its share in 2021 (matched by its short
     name, as the hub's Change since 2021 matches them), in percentage points, gains in green and losses in red; a party with no votes in
     2021, New. Added each time the hub writes its table, at once (before it is painted: the observer in boot), and to a still graphic's
     Others row (its parties together). Empty while 2021 is read; a dash where the council has no 2021 result. ---- */
  function chgTxt(d) {
    var a = Math.abs(d), s = (Math.round(a * 10) / 10).toFixed(1).replace('.', ','), u = '<span class="vh"> points</span>';
    return a < 0.05 ? '<span class="is-flat">\u00b10,0' + u + '</span>' : '<span class="' + (d > 0 ? 'is-up' : 'is-dn') + '">' + (d > 0 ? '+' : '\u2212') + s + u + '</span>';
  }
  function chgOf(tr, A, B) {
    if (tr.classList.contains('ehx-oth')) {
      var a = 0, b = 0, any = false;
      [].forEach.call(tr.parentNode.querySelectorAll(':scope > tr.ehx-cut .pn strong'), function (s) { var k = s.textContent.trim(); if (B[k] != null) { b += B[k]; any = true; } if (A[k] != null) a += A[k]; });
      return any ? chgTxt(b - a) : '';
    }
    var el = tr.querySelector('.pn strong'), k = el ? el.textContent.trim() : '';
    if (B[k] == null) return '';
    return A[k] == null ? '<span class="is-new">New</span>' : chgTxt(B[k] - A[k]);
  }
  function paintChg() {
    if (g.id !== 'votescmp' || !root) return;
    yrRead();
    var t = root.querySelector('#mf-res .mf-res-tbl .mf-res-table'), hr = t && t.tHead && t.tHead.rows[0], tb = t && t.tBodies[0];
    if (!hr || !tb) return;
    var P = placeR(), A = null, B = {};
    if (YR.P) { A = {}; YR.P.parties.forEach(function (p) { if (p.votes > 0) A[p.label] = (A[p.label] || 0) + (p.pct || 0); }); }
    if (P) P.parties.forEach(function (p) { if (p.votes > 0) B[p.label] = (B[p.label] || 0) + (p.pct || 0); });
    function cell(tr, tag) {
      var c = tr.querySelector(':scope > .ehx-chg');
      if (!c) { c = document.createElement(tag); c.className = 'n ehx-chg'; var sh = tr.querySelector(':scope > .sh'); tr.insertBefore(c, sh ? sh.nextSibling : null); }
      return c;
    }
    var th = cell(hr, 'th');
    if (!th.hasAttribute('scope')) { th.setAttribute('scope', 'col'); th.textContent = 'Since ' + yrPrev(); }
    [].forEach.call(tb.rows, function (tr) {
      var c = cell(tr, 'td'), html = A ? chgOf(tr, A, B) : YR.none ? '<span class="na">\u2013</span>' : '';
      if (c._ehx !== html) { c.innerHTML = html; c._ehx = html; }
    });
  }
  /* ---- v3.12 · Turnout by province (v3.12.7: the Explorer alone; Columns, Bars and Pies taken out). The national totals with each
     province's at the last four local elections: this election's the hub's own (its read of the national totals, again every 5 minutes
     while the count is on); the three before read once from the same service (/local/2021, /local/2016, /local/2011), and again 30
     seconds on where a read fails. The figure is the feed's percent_voter_turnout, as the hub shows it: none until a voting district is in.
     A still graphic (2021 results) shows the elections up to its own. ---- */
  var TP_ALL = ['2026', '2021', '2016', '2011'], tpPast = {};
  function tpYears() { var R = R$(), y = +((R && R.S && R.S.year) || 2026); return TP_ALL.filter(function (x) { return +x <= y; }); }
  function tpBase() { var r = $('dm-eh'); return String((r && r.getAttribute('data-results')) || 'https://iec-api.revengine.dailymaverick.co.za/local').trim().replace(/\/+$/, ''); }
  function tpRead(y) {
    var o = tpPast[y];
    if (o && (o.d || o.busy || Date.now() - o.t < 30000)) return;
    o = tpPast[y] = { busy: true, t: 0, d: null, n: (o ? o.n : 0) + 1 };
    var ac = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ac) ac.abort(); }, 20000);
    fetch(tpBase() + '/' + y, ac ? { signal: ac.signal } : undefined)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { if (d && d.provincial_results) o.d = d; }, function () {})
      .then(function () {
        clearTimeout(to); o.busy = false; o.t = Date.now();
        if (!o.d) setTimeout(function () { if (window.__ehxLater) window.__ehxLater(); }, 30500);
        if (window.__ehxLater) window.__ehxLater();
      });
  }
  // the earlier elections' first reads still out (a read tried again after a failure is not waited for)
  function tpWait() { return tpYears().slice(1).some(function (y) { var o = tpPast[y]; return !o || (o.busy && o.n < 2); }); }
  function tpOf(d, pc) { if (d && pc) { var nm = (window.SA_PROVINCES || {})[pc] || PV[pc]; d = (d.provincial_results || []).filter(function (p) { return p.province_name === nm; })[0]; } return d || null; }
  function tpVal(d, pc) {
    d = tpOf(d, pc);
    var v = d && d.percent_voter_turnout != null && d.percent_voter_turnout !== '' && +d.vd_captured > 0 ? +d.percent_voter_turnout : NaN;
    return isFinite(v) ? v : null;
  }
  function tpReg(d, pc) { d = tpOf(d, pc); var n = d ? +d.registered_voters : 0; return n > 0 ? n : 0; }
  function tpPct(v) { var R = R$(); return R && R.pct ? R.pct(v) : (Math.round(v * 10) / 10).toFixed(1).replace('.', ',') + '%'; }
  function andList(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function tpNote() {
    var s = state(), ys = tpYears(), bad = ys.slice(1).filter(function (y) { var o = tpPast[y]; return o && !o.d && !o.busy; }).reverse();
    // the count's note only while the graphic shows this election
    var now = tmYear() === ys[0];
    var t = !now ? '' : s.k === 'counting' ? 'The ' + ys[0] + ' figures are the count so far.' : s.k === 'waiting' ? 'The ' + ys[0] + ' figures show here once the count begins.' : '';
    if (bad.length) t += (t ? ' ' : '') + 'The ' + andList(bad) + ' figures could not be read. The graphic tries again by itself.';
    return t;
  }
  /* ---- v3.12.3 · Explorer (v3.12.4: on the hub's own map; v3.12.7: the graphic's one view). Over it the election (2011 to 2026); under that the hub's
     councils map by turnout (#res-map, moved here from the Turnout tab the embed opens on: the province under the pointer rises, a click
     opens it with its councils, the magnifying glass goes back to South Africa, a council clicked has Go to municipality), with the area's
     turnout beside it (the change since the election before, the registered voters, the highest and the lowest) and the councils in each
     band of turnout, as the map colours them; under them a bar for each province of South Africa (a row opens it) or each council of the
     province, the highest first, in its band's colour. This election in the hub's blues; an election before in greys on the same map
     (window.EHX_TURN, the hub's ehxTurn): each 2026 council in the colour of the council with its code at that election, where there is
     one (boundaries and names changed in 2016: a council made since has none). The elections before are read from the service
     (/local/{year}/provinces/{Province}, the nine provinces, as an election is picked; 30 s, then tried again). ---- */
  var TB = [[40, 'Under 40'], [50, '40\u201350'], [60, '50\u201360'], [70, '60\u201370'], [101, '70 or more']];
  var TP_BLUE = ['#e0ebf7', '#a6c1dd', '#6d98c3', '#3d6ea4', '#1f4778'], TP_GREY = ['#efece6', '#d3cec4', '#b0aa9e', '#8a8478', '#5f5a51'];
  var TM = { y: '', cur: {}, curK: {}, past: {}, el: null, keys: {}, sig: null, idx: {}, nrm: {} };
  function tmProvs() { var R = R$(); return (R && R.PROV_ORDER) || ['GP', 'WC', 'KZN', 'EC', 'LP', 'MP', 'NW', 'FS', 'NC']; }
  function tmLater() { if (window.__ehxLater) window.__ehxLater(); }
  function tmYear() { var ys = tpYears(); return ys.indexOf(TM.y) >= 0 ? TM.y : ys[0]; }
  function tmBin(v) { for (var i = 0; i < TB.length; i++) if (v < TB[i][0]) return i; return TB.length - 1; }
  function tmCol(v, cur) { return (cur ? TP_BLUE : TP_GREY)[tmBin(v)]; }
  // a province's results at an election: the feed's data, or null while it is read (or where it can't be)
  function tmProv(y, pc) {
    var R = R$(); if (!pc || !R) return null;
    if (y === tpYears()[0]) {
      var k = String((R.S && R.S.updated) || 0);
      if (TM.curK[pc] !== k && R.province) {
        TM.curK[pc] = k;
        R.province(pc).then(function (d) { if (d && TM.cur[pc] !== d) { TM.cur[pc] = d; tmLater(); } }, function () { TM.curK[pc] = ''; setTimeout(tmLater, 30500); });
      }
      return TM.cur[pc] || null;
    }
    var key = y + '|' + pc, o = TM.past[key];
    if (!o || (!o.d && !o.busy && Date.now() - o.t >= 30000)) {
      o = TM.past[key] = { busy: true, t: 0, d: null, n: (o ? o.n : 0) + 1 };
      // the service can be slow on the older elections' provinces: 30 s, then the note says it tries again
      var ac = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ac) ac.abort(); }, 30000);
      fetch(tpBase() + '/' + y + '/provinces/' + encodeURIComponent(PV[pc] || pc), ac ? { signal: ac.signal } : undefined).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { if (d && d.municipal_results) o.d = d; }, function () {})
        .then(function () { clearTimeout(to); o.busy = false; o.t = Date.now(); if (!o.d) setTimeout(tmLater, 30500); tmLater(); });
    }
    return o.d;
  }
  function tmCode(e) { var s = String(e.municipality_name || ''), i = s.indexOf(' - '); return (i > 0 ? s.slice(0, i) : s).trim().toUpperCase(); }
  function tmName(e) { var s = String(e.municipality_name || ''), i = s.indexOf(' - '); return (i >= 0 ? s.slice(i + 3) : s).replace(/\s*\[[^\]]*\]\s*$/, '').trim(); }
  // this election's council names by code (the hub's read): a council of an election before goes by its name now where its code stands
  // (the feed has a 2016 council as New Municipality, now Collins Chabane)
  // v3.12.6: by the hub's own names (SA_MUNIS, as its map and tooltips have them): the feed has some provinces' councils in capitals (!KHEIS)
  function tmCase(s) { return s && s === s.toUpperCase() && /[A-Z]/.test(s) ? s.toLowerCase().replace(/(^|[\s\-(!'\/])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }) : s; }
  function tmHubName(k) { var M = window.SA_MUNIS || {}, m = M[k], R = R$(); if (!m || !m.n) return ''; var s = R && R.shortName ? R.shortName(m) : m.n; return s.replace(/ Metro$/, '') + (m.t === 'Metropolitan' ? ' Metro' : ''); }
  function tmNow() { var R = R$(), IX = (R && R.IX) || {}, o = {}; Object.keys(IX).forEach(function (k) { var x = IX[k]; if (x && x.e) o[tmCode(x.e)] = tmHubName(k) || tmCase(tmName(x.e)); }); return o; }
  // an election before this one: its councils with voting districts, by code, from the provinces read so far
  function tmIndex(y) {
    var o = TM.idx[y] || (TM.idx[y] = { n: -1, by: {} }), n = 0;
    tmProvs().forEach(function (pc) { var x = TM.past[y + '|' + pc]; if (x && x.d) n++; });
    if (o.n !== n) {
      o.n = n; o.by = {}; TM.nrm[y] = {};
      tmProvs().forEach(function (pc) { var x = TM.past[y + '|' + pc]; ((x && x.d && x.d.municipal_results) || []).forEach(function (e) { if (+e.vd_count > 0) o.by[tmCode(e)] = { e: e, pc: pc }; }); });
    }
    return o;
  }
  function tmNorm(y, code) {
    var o = tmIndex(y), c = TM.nrm[y] || (TM.nrm[y] = {}), k = String(code || '').toUpperCase(), R = R$();
    if (!Object.prototype.hasOwnProperty.call(c, k)) c[k] = o.by[k] && R && R.norm ? R.norm(o.by[k].e) : null;
    return c[k];
  }
  // the hub's map at an election before this one (null: this election, in the hub's own colours); painted again as its provinces come in
  function tmHook(y, cur, src) {
    var A = window.EH_AREA, R = R$(), n = cur ? 0 : tmIndex(y).n, sig = cur ? '' : y + '|' + n + '|' + (src[y] ? 1 : 0);
    if (sig === TM.sig) return;
    TM.sig = sig;
    window.EHX_TURN = cur ? null : {
      y: y, col: function (v) { return tmCol(v, false); }, council: function (code) { return tmNorm(y, code); },
      prov: function (pc) { var e = tpOf(src[y], pc); return e && R && R.norm ? R.norm(e) : null; },
      none: n < tmProvs().length ? 'Loading the ' + y + ' results\u2026' : 'No council with these boundaries in ' + y
    };
    if (A && A.repaint) A.repaint();
  }
  function tmWait() {
    var A = window.EH_AREA, R = R$(), pc = areaNow(), y = tmYear(), ys = tpYears(), IX = (R && R.IX) || {};
    if (A && A.cmap && !A.cmap.set(pc) && !A.cmap.failed(pc)) return true;
    if (y === ys[0]) return (pc ? [pc] : tmProvs()).some(function (p) { for (var k in IX) if (IX[k] && IX[k].pc === p) return false; return true; });
    return (pc ? [pc] : tmProvs()).some(function (p) { var o = TM.past[y + '|' + p]; return !o || (o.busy && o.n < 2); });
  }
  function tmPts(d) { var r = Math.round(d * 10) / 10; return (r > 0 ? '+' : r < 0 ? '\u2212' : '') + Math.abs(r).toFixed(1).replace('.', ',') + (Math.abs(r) === 1 ? ' point' : ' points'); }
  function tmBuild(el) {
    var map = $('res-map'); if (map && el.contains(map)) el.parentNode.appendChild(map);
    el.innerHTML = '<div class="tx-yrs" role="group" aria-label="Election"></div><div class="tx-top"><div class="tx-map"></div><div class="tx-sum" aria-live="polite"></div></div>' +
      '<div class="tx-list"><div class="tx-lh" aria-hidden="true"></div><ol class="tx-lb"></ol></div>';
    TM.el = el; TM.keys = {};
    if (X.still) return;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.closest('#res-map')) return;
      if (b.hasAttribute('data-y')) { TM.y = b.getAttribute('data-y'); tmLater(); }
      else if (b.hasAttribute('data-pc') && window.EH_AREA && EH_AREA.set) EH_AREA.set(b.getAttribute('data-pc'), true);
    });
  }
  function tmSet(part, html) { var e = TM.el.querySelector(part); if (TM.keys[part] !== html) { e.innerHTML = html; TM.keys[part] = html; } return e; }
  function paintExp(el, ys, src, open) {
    if (TM.el !== el || !el.querySelector('.tx-yrs')) tmBuild(el);
    var y = tmYear(), yi = ys.indexOf(y), pc = areaNow(), cur = yi === 0, prevY = ys[yi + 1] || '', d = src[y], nm = PV[pc] || 'South Africa';
    if (!cur) tmProvs().forEach(function (p) { tmProv(y, p); });   // the whole election, for the map
    tmHook(y, cur, src);
    var map = $('res-map'), slot = el.querySelector('.tx-map');
    if (map && map.parentNode !== slot) slot.appendChild(map);
    tmSet('.tx-yrs', ys.slice().reverse().map(function (x) { return X.still && x !== y ? '' : '<button type="button" data-y="' + x + '" aria-pressed="' + (x === y) + '"' + (X.still ? ' tabindex="-1"' : '') + '>' + x + '</button>'; }).join(''));
    // the list: the provinces of South Africa, or the councils of the province, at the election picked
    var items = [], wait = false, P = pc ? tmProv(y, pc) : null;
    if (!pc) items = tmProvs().map(function (p) { return { pc: p, name: PV[p], v: tpVal(d, p) }; });
    else if (P) { var now = tmNow(); items = (P.municipal_results || []).filter(function (e) { return +e.vd_count > 0; }).map(function (e) { return { name: now[tmCode(e)] || tmCase(tmName(e)), v: tpVal(e, '') }; }); }
    else wait = true;
    items.sort(function (a, b) { return (a.v == null) - (b.v == null) || (b.v || 0) - (a.v || 0) || a.name.localeCompare(b.name); });
    var mx = 0; items.forEach(function (it) { if (it.v > mx) mx = it.v; });
    var withV = items.filter(function (it) { return it.v != null; });
    // the area's turnout beside the map
    var v = tpVal(d, pc), pv = prevY ? tpVal(src[prevY], pc) : null, reg = tpReg(d, pc), facts = '';
    if (reg) facts += '<div><dt>Registered voters</dt><dd>' + int(reg) + '</dd></div>';
    if (withV.length > 1) facts += '<div><dt>Highest</dt><dd><span>' + esc(withV[0].name) + '</span> ' + tpPct(withV[0].v) + '</dd></div><div><dt>Lowest</dt><dd><span>' + esc(withV[withV.length - 1].name) + '</span> ' + tpPct(withV[withV.length - 1].v) + '</dd></div>';
    tmSet('.tx-sum', '<h2 class="an">' + esc(nm) + '</h2><div class="tb"><span class="ehx-sr">Turnout in ' + y + ': </span><b>' + (v == null ? (cur && open ? 'No result yet' : '\u2014') : tpPct(v)) + '</b>' +
      (v != null && pv != null ? '<span class="ch"><b>' + tmPts(v - pv) + '</b><span>since ' + prevY + '</span></span>' : '') + '</div>' + (facts ? '<dl>' + facts + '</dl>' : ''));
    // the map's key: the area's councils in each band of turnout
    // an election before this one over the whole country: until its nine provinces are in, the map says it is loading
    var part = !cur && !pc && tmIndex(y).n < tmProvs().length;
    var box = map && map.querySelector('.res-map-svg'), ld = box && box.querySelector('.ehx-yload');
    if (box && part && !ld) { ld = document.createElement('span'); ld.className = 'res-loading ehx-yload'; box.appendChild(ld); }
    if (ld && !part) ld.remove();
    else if (ld && ld.textContent !== 'Loading the ' + y + ' results\u2026') ld.textContent = 'Loading the ' + y + ' results\u2026';
    tmSet('.tx-lh', '<span>' + (pc ? 'Council' : 'Province') + '</span><span>Turnout in ' + y + '</span>');
    var lb = tmSet('.tx-lb', wait ? '<li class="tx-note">' + (TM.past[y + '|' + pc] && !TM.past[y + '|' + pc].busy && !cur ? 'The ' + y + ' councils could not be read. The graphic tries again by itself.' : 'Loading the ' + y + ' councils\u2026' + (cur ? '' : ' The older results can take a little while.')) + '</li>' :
      items.map(function (it) {
        var f = it.v == null || !mx ? 0 : Math.max(0, Math.min(1, it.v / mx)), t = it.v == null ? (cur && open ? 'No result yet' : '\u2014') : tpPct(it.v);
        var inner = '<span class="nm" title="' + esc(it.name) + '">' + esc(it.name) + '</span><span class="bw"><i style="--f:' + f.toFixed(4) + (it.v == null ? '' : ';--bc:' + tmCol(it.v, cur)) + '"' + (it.v == null ? ' hidden' : '') + '></i><b>' + t + '</b></span>';
        return '<li>' + (it.pc && !X.still ? '<button type="button" class="tx-r is-go" data-pc="' + it.pc + '" aria-label="' + esc(it.name + ', ' + t + '. Open the province') + '">' + inner + '<svg class="go" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5"></path></svg></button>' : '<div class="tx-r">' + inner + '</div>') + '</li>';
      }).join(''));
    el.setAttribute('aria-label', 'Turnout in ' + nm + ' at the ' + y + ' local elections');
    // the names' column: as wide as the longest name, at most 44% of the list
    var w = 0; [].forEach.call(lb.querySelectorAll('.nm'), function (n) { w = Math.max(w, n.scrollWidth); });
    var nw = 'min(' + (w ? Math.ceil(w) + 2 : 120) + 'px, 44%)';
    if (el.style.getPropertyValue('--nw') !== nw) el.style.setProperty('--nw', nw);
  }
  function paintTurn() {
    var R = R$(), wrap = root.querySelector('.eh-tabs-sec .eh-wrap'), el = root.querySelector('.ehx-turn');
    if (!R || !R.S || !wrap) return;
    var ys = tpYears(), s = state(), src = {}, open = /^(waiting|counting|complete)$/.test(s.k);
    ys.slice(1).forEach(tpRead);
    src[ys[0]] = R.S.nat || null;
    ys.slice(1).forEach(function (y) { src[y] = tpPast[y] ? tpPast[y].d : null; });
    // its classes set once (embed-fit.js adds its own: is-short, ehx-scroll)
    if (!el) { el = document.createElement('div'); el.className = 'ehx-turn is-exp'; el.setAttribute('role', 'group'); wrap.appendChild(el); TM.el = null; }
    paintExp(el, ys, src, open);
  }
  /* ---- v3.8 · the note on the ballots, over the credit, on the graphics of the full count (graphics.js: ballots). A party's votes and share
     there are its votes on every ballot, the feed's votes: ward and PR, and in a local council district too. A metro has two ballots and no
     district votes in its figures, so its note names the two. No note on turnout, the hung councils, the coalition builder or a ward's
     result (its ward ballot alone). ---- */
  var NOTE_ALL = 'Results are calculated from all three ballots: Ward, Proportional Representation (PR), and District Council. Seats are allocated from the Ward and Proportional Representation ballots only.';
  var NOTE_METRO = 'Results are calculated from both ballots: Ward and Proportional Representation (PR).';
  function ballotNote() {
    var b = g.ballots, m;
    if (!b || (b !== true && !(b.indexOf && b.indexOf(st.view) >= 0))) return '';
    if (nat) return NOTE_ALL;
    m = muniOf(st.muni);
    return !m ? '' : m.t === 'Metropolitan' ? NOTE_METRO : NOTE_ALL;
  }
  function paintBallots() {
    if (!noteEl) return;
    var t = g.id === 'turnprov' ? tpNote() : ballotNote();
    // v3.14 · Votes by party: change since 2021, under its change column
    if (g.id === 'votescmp' && t && !yr21() && root.querySelector('#mf-res .ehx-chg')) t = 'Since ' + yrPrev() + ': the change in each party\u2019s share of the vote, in percentage points. ' + t;
    if (noteEl.textContent !== t) noteEl.textContent = t;
    if (noteEl.hidden !== !t) noteEl.hidden = !t;
  }
  var headKey = '';
  function paintHead() {
    var t = title(), key = t.kicker + '|' + t.title;
    if (key !== headKey) {
      headKey = key;
      kEl.textContent = t.kicker; tEl.textContent = t.title; paintK();
      document.title = (t.kicker ? t.kicker + ': ' : '') + t.title.replace(/\u00a0/g, ' ') + ' \u00b7 Daily Maverick';
    }
    var a = foot.querySelector('a.more'), href = hubLink(hubAnchor()), u = foot.querySelector('.url'), us = hubShort();
    if (a.getAttribute('href') !== href) a.setAttribute('href', href);
    if (u.textContent !== us) u.textContent = us;
  }

  /* ---- the Coalition builder (library v2.1): over the council's half circle, Start again, which clears the coalition (the hub's own clear
     button, hidden here, does it). The hub's head row (the status tag, Who can build a coalition in <council>?, Back to results) and its
     Hung council banner are not shown (embed.css). A hung council has no line (v3.1: the half circle says it, Select parties to reach a
     majority, then the coalition's seats of the majority needed), Start again alone at the top right; before the seats, and where a party
     has a majority, a line says so. ---- */
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
    if (h && h.hung) return '';
    if (h && h.top) return esc(h.top.label) + ' majority: it holds ' + of(h.top.seats) + ' seats, so it needs no coalition to elect a speaker and a mayor.';
    return '';
  }
  function paintCoal() {
    if (!coal) return;
    var html = coalLine(), sec = root.querySelector('.mf-res-seats.can-coal.is-coal'), off = !sec || !sec.querySelector('.mf-cp[aria-pressed="true"]');
    if (html !== coalHtml) { coalT.innerHTML = html; coalHtml = html; }
    if (coalT.hidden !== !html) coalT.hidden = !html;
    if (coal.classList.contains('is-bare') !== !html) coal.classList.toggle('is-bare', !html);
    if (coal.hidden !== (!html && !sec)) coal.hidden = !html && !sec;
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

  /* ---- Ward result with ward finder: the hub's own ward dropdown (every ward of the council) with its Use my location beside it, moved
     here from the hub's search, which the embeds don't show. The title, the count's box and the link follow the ward on show, in whichever
     council the reader's location opens; a note says where the location fell, as the hub's does. ---- */
  var IEC_WARD = 'https://www.elections.org.za/pw/voter/Who-Is-My-Ward-Councillor', wnote = null, loc = null, PRE = null;
  function muniByPre(pre) {
    if (!PRE) { PRE = {}; var W = window.SA_WARD_INDEX || {}; for (var k in W) if (W[k] && W[k][1] && !PRE[W[k][1]]) PRE[W[k][1]] = k; }
    return PRE[pre] || '';
  }
  function note(t) { if (!wnote) return; if (wnote.innerHTML !== t) wnote.innerHTML = t; if (wnote.hidden !== !t) wnote.hidden = !t; }
  function finder() {
    var row = $('mf-ward-row'), btn = $('mf-locate'), msg = $('mf-loc-msg');
    if (!row) return;
    var box = document.createElement('div'); box.className = 'ehx-wfind';
    row.parentNode.insertBefore(box, row);
    box.appendChild(row);
    if (btn) box.appendChild(btn);
    wnote = document.createElement('p'); wnote.className = 'ehx-wnote'; wnote.hidden = true;
    box.parentNode.insertBefore(wnote, box.nextSibling);
    if (msg) {
      box.parentNode.insertBefore(msg, wnote);
      // the hub's messages send the reader to its place search, which isn't here: to the dropdown instead
      var fix = function () { var t = msg.textContent, u = t.replace(/Type a place name instead/g, 'Pick your ward from the list instead').replace(/type a place name instead/g, 'pick your ward from the list'); if (u !== t) msg.textContent = u; };
      new MutationObserver(fix).observe(msg, { childList: true, characterData: true, subtree: true });
    }
    // the lookup's answer (the ward the location fell in, and whether surely) kept for the note: the hub asks DM_EH_API.locate when it runs
    if (btn) btn.addEventListener('click', function () {
      loc = null; note('');
      var A = window.DM_EH_API;
      if (!A || !A.locate || A.locate.ehx) return;
      var real = A.locate;
      A.locate = function () {
        var p = real.apply(this, arguments);
        if (p && p.then) p.then(function (r) { loc = r && r.wardId ? { id: String(r.wardId), exact: !!r.exact } : null; if (window.__ehxLater) window.__ehxLater(); }, function () {});
        return p;
      };
      A.locate.ehx = true;
    }, true);
  }
  function syncPick() {
    var sel = $('mf-ward-select'); if (!sel || sel.options.length < 2) return;
    var o = sel.value ? sel.options[sel.selectedIndex] : sel.options[1], m = o && /(\d{5,})\s*$/.exec(o.textContent || ''), k = m ? muniByPre(m[1].slice(0, -3)) : '';
    if (!k) return;
    var w = sel.value || '';
    if (k !== st.muni || w !== st.ward) { st.muni = k; st.ward = w; wardR = null; wardKey = ''; }
    var t = '';
    if (loc) {
      var lk = muniByPre(loc.id.slice(0, -3)), lm = muniOf(lk), wn = String(+loc.id.slice(-3));
      if (lk === st.muni && lm) {
        if (w === wn) t = 'Your location is ' + (loc.exact ? 'in' : 'in or near') + ' <b>Ward ' + esc(wn) + '</b> of the <b>' + esc(lm.n) + '</b>.' + (loc.exact ? '' : ' Not sure? <a href="' + IEC_WARD + '" target="_blank" rel="noopener">Check with the Electoral Commission</a>.');
        else if (!w) t = 'Your location falls within the <b>' + esc(lm.n) + '</b>.';
        else loc = null;   // another ward picked since
      }
    }
    note(t);
  }

  /* ---- v3.5 · Share on WhatsApp, in the interactive ward graphics: the hub's button in the ward box (WardShare, wardBox in the hub's script),
     with the hub's message. The hub links it to the page it stands on, here the embed: it is pointed at the results page (hubLink:
     declaredUrl once the graphic shows Results declared), at the ward's anchor the hub gave it (#johannesburg-ward-12), which opens the
     council's file on the hub at that ward's results. It follows the ward on show (the finder's dropdown, Use my location). ---- */
  var WA = /^https:\/\/wa\.me\/\?text=(.+)$/;
  function paintShare() {
    var base = hubBase();
    [].forEach.call(root.querySelectorAll('.mf-wa-btn'), function (a) {
      var h = a.getAttribute('href') || '';
      if (h !== a._ehxOut) {   // the hub's link: its message, ending in the page's address and the ward's anchor
        var m = WA.exec(h), t = '', i;
        try { t = m ? decodeURIComponent(m[1]) : ''; } catch (e) { t = ''; }
        if ((i = t.lastIndexOf('http')) < 0) return;
        a._ehxMsg = t.slice(0, i); a._ehxAn = t.slice(i).replace(/^[^?#]*/, '');
      } else if (a._ehxBase === base) return;
      a._ehxBase = base;
      a._ehxOut = 'https://wa.me/?text=' + encodeURIComponent(a._ehxMsg + base + a._ehxAn);
      a.setAttribute('href', a._ehxOut);
    });
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
    if (g.id === 'turnprov') return tpWait() || tmWait();
    if (R.S.state === 'waiting' || R.S.state === 'error') return false;
    if (!nat) return !(R.IX && R.IX[st.muni]) || (yrData() && !YR.P && !YR.none && (YR.busy || !YR.t));   // v3.14: and 2021's, for the change column
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
    hrow = document.createElement('div'); hrow.className = 'ehx-headrow'; hrow.appendChild(head);
    // a still graphic: the time of the figures over the count's box, in one column with it (v3.9; it was under it)
    if (X.still) { var side = document.createElement('div'); side.className = 'ehx-side'; asatEl = document.createElement('p'); asatEl.className = 'ehx-asat'; side.appendChild(asatEl); side.appendChild(stat); hrow.appendChild(side); }
    else hrow.appendChild(stat);
    foot = document.createElement('div'); foot.className = 'ehx-foot';
    foot.innerHTML = '<span class="lnk">' + (X.still ? '<span class="src">Source: Electoral Commission of South Africa \u00b7 <span class="url">' + esc(hubShort()) + '</span></span>' : '') +
      '<a class="more" href="' + esc(hubLink('')) + '" target="_blank" rel="noopener">All results on the Elections Hub</a>' + (X.still ? '' : '<span class="url">' + esc(hubShort()) + '</span>') + '</span>' +
      '<a class="logo" href="https://www.dailymaverick.co.za" target="_blank" rel="noopener" aria-label="Daily Maverick"><img src="assets/DM_Masthead_2026.svg" alt="Daily Maverick" width="222" height="28"></a>';
    noteEl = document.createElement('p'); noteEl.className = 'ehx-note'; noteEl.hidden = true;
    root.insertBefore(hrow, root.firstChild);
    root.appendChild(noteEl);
    root.appendChild(foot);
    if (g.id === 'coalition') {
      coal = document.createElement('div'); coal.className = 'ehx-coal'; coal.hidden = true;
      coal.innerHTML = '<p class="ehx-coal-t"></p><button type="button" class="ehx-coal-clr" aria-label="Clear the coalition" title="Clear the coalition" disabled hidden><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.76 13.81a7 7 0 1 1-2.26-7.17l2 1.67"></path><path d="M18.5 3.8v4.5h-4.5"></path></svg></button>';
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
    if (g.id === 'seats' && !X.still) {
      sback = document.createElement('div'); sback.className = 'ehx-sback'; sback.hidden = true;
      sback.innerHTML = '<button type="button" class="mf-cb-go"><span class="arr" aria-hidden="true">\u2190</span><span>Back to results</span></button>';
      sback.firstChild.addEventListener('click', function () {
        var b = root.querySelector('.mf-res-seats.is-coal [data-coal-back]');
        if (b) b.click();   // the hub leaves coalition mode and gives its question the keyboard's focus
        paintSback();
      });
      // the question pressed: Back to results at once (after the hub's own click handler), with the keyboard's focus, as the hub gives its own
      document.addEventListener('click', function (e) {
        if (!(e.target.closest && e.target.closest('#dm-eh [data-coal-go]'))) return;
        paintSback();
        if (!sback.hidden) { try { sback.firstChild.focus({ preventScroll: true }); } catch (x) {} }
      });
    }
    if (g.locate) finder();
    // Share on WhatsApp: its link set again as it is pressed, should the hub have just written its own
    if (g.ward && !X.still) ['click', 'contextmenu'].forEach(function (t) { root.addEventListener(t, function (e) { if (e.target.closest && e.target.closest('.mf-wa-btn')) paintShare(); }, true); });
    // a council clicked in a graphic of South Africa or a province: its file on the hub, in a new tab (the file isn't part of the graphic)
    if (nat) {
      var open = function (k, o) { var A = window.EH_ANCHOR; window.open(hubLink(A ? A.council(k, o || {}) : ''), '_blank', 'noopener'); };
      window.DM_EH_OPEN = function (k) { open(k); };
      window.DM_EH_COAL = function (k) { open(k, { coal: true }); };
    }
    var raf = 0;
    function later() { lastMut = Date.now(); if (raf) return; raf = setTimeout(function () { raf = 0; tickAll(); }, 40); }
    function tickAll() { if (g.id === 'cmp') markCmp(); if (g.id === 'wards') pinWards(); if (g.locate) syncPick(); fetchWard(); if (g.id === 'turnprov') paintTurn(); if (g.id === 'votescmp' && !X.still) paintYr(); paintHead(); paintBallots(); paintStatus(); paintCoal(); if (g.ward && !X.still) paintShare(); if (g.id === 'seats') { paintSeats(); paintSback(); } if (X.still) { openAll(); cutLists(); paintStamp(); } paintChg(); postH(); }
    window.__ehxLater = later;
    // Change since 2021: the hub writes the tab afresh, its parts hidden until marked (embed.css): marked at once, before the page is painted
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(hrow.contains(t) || foot.contains(t) || noteEl.contains(t) || (coal && coal.contains(t)) || (t.closest && t.closest('.ehx-seats, .ehx-turn, .ehx-sback, .ehx-yrs, .ehx-v21')))) { if (g.id === 'cmp') markCmp(); if (g.id === 'votescmp') paintChg(); later(); return; } }
    }).observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'data-phase'] });
    var R = R$();
    if (R) { if (R.on) R.on(later); if (R.onPhase) R.onPhase(later); if (R.ready) R.ready().then(later, later); }
    if (window.EH_AREA && EH_AREA.on) EH_AREA.on(later);
    if (window.ResizeObserver) new ResizeObserver(postH).observe(document.documentElement);
    window.addEventListener('load', postH);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(postH);
    // Turnout by province: its names' column measured again once the fonts are in, and at a new width (the type is smaller on a phone)
    if (g.id === 'turnprov') { if (document.fonts && document.fonts.ready) document.fonts.ready.then(later); window.addEventListener('resize', later); }
    setInterval(postH, 2000);   // a frame that came up hidden (an article tab in the background) asks again
    tickAll();
    reveal();
  }
  window.EH_EMBED = {
    kind: X.id, title: title, ready: ready, state: function () { var s = state(); return { k: s.k, step: STEP[s.k] }; },
    stamp: function () { if (X.still) paintStamp(); return Date.now(); },
    asAt: asAt, still: !!X.still,
    hub: function () { return hubLink(hubAnchor()); },
    share: function () { var a = root && root.querySelector('#mf-wardgov .mf-wa-btn'); return a ? a.getAttribute('href') : ''; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
