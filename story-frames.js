/* story-frames.js — Since 2021 (library v3.16): each frame of the story, drawn as HTML from the figures in story-data.js (EHX_SX).
   window.EHX_SXF.draw(f, D) -> { kicker, title, body, note } for a frame of EHX_STORY (graphics.js), or null where the feed has nothing
   for it (a party not in the results). needs(f): whether the frame needs the councils (their seats), not only the national totals.
   The look is the hub's Change since 2021: 2021 in warm grey, 2026 in the party's colour, gains in green and losses in red. */
window.EHX_SXF = (function () {
  'use strict';
  var X = window.EHX_SX, F = X.fmt, Y0 = X.Y0, Y1 = X.Y1, ST = window.EHX_STORY || [];
  var Y21 = '#c9c3b8', TURN = '#3d6ea4';
  var NOTE = 'Results are calculated from all three ballots: Ward, Proportional Representation (PR), and District Council. Seats are allocated from the Ward and Proportional Representation ballots only.';
  var SEATS = 'Seats are allocated from the Ward and Proportional Representation ballots.';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function poss(s) { return s + '\u2019s'; }
  function hex2(n) { return ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2); }
  // a colour mixed with white (t: the share of the colour) or with black (shade)
  function mix(h, t) { var n = parseInt(h.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return '#' + hex2(255 + (r - 255) * t) + hex2(255 + (g - 255) * t) + hex2(255 + (b - 255) * t); }
  function shade(h, t) { var n = parseInt(h.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return '#' + hex2(r * (1 - t)) + hex2(g * (1 - t)) + hex2(b * (1 - t)); }
  function pcVars(col) { return '--pc:' + col + ';--pc2:' + mix(col, 0.5) + ';--pc3:' + mix(col, 0.16) + ';--pcl:' + shade(col, 0.12) + ';--pcs:' + mix(col, 0.62); }
  // a change in percentage points, and in a count
  function dPts(d) { var a = Math.round(Math.abs(d) * 10) / 10; return '<span class="sx-d ' + (a < 0.05 ? 'is-flat' : d > 0 ? 'is-up' : 'is-dn') + '">' + F.pts(d) + '</span>'; }
  function dInt(d, plain) { return '<span class="sx-d ' + (!d ? 'is-flat' : plain ? 'is-plain' : d > 0 ? 'is-up' : 'is-dn') + '">' + (!d ? '\u00b10' : (d > 0 ? '+' : '\u2212') + F.int(Math.abs(d))) + '</span>'; }
  function newTag() { return '<span class="sx-new">New</span>'; }
  function cfg(lbl) { return ST.filter(function (f) { return f.party === lbl; })[0] || null; }
  function theOf(lbl) { var f = cfg(lbl); return f ? f.the : lbl; }
  function metroName(code) { return X.METROS[code] || code; }
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  /* ---- pieces ---- */
  // two bars, 2021 over 2026, on one scale (the larger share 94% of the track), and the change beside them
  function bars(a, b, col, big, out) {
    var mx = Math.max(a || 0, b || 0) / 0.94 || 1;
    function one(y, v, c, now) {
      return '<div class="sx-sb' + (now ? ' is-now' : '') + '"><span class="y">' + y + '</span><i>' + (v == null ? '<em>' + esc(out || 'Did not stand') + '</em>' : '<b style="--w:' + (100 * v / mx).toFixed(2) + '%;background:' + c + '"></b>') + '</i><span class="v">' + (v == null ? '\u2014' : F.pct(v)) + '</span></div>';
    }
    return '<div class="sx-share"><div class="sx-bars">' + one(Y0, a, Y21) + one(Y1, b, col, true) + '</div>' +
      '<div class="sx-big">' + (a == null ? '<b class="sx-new is-big">New</b>' : '<b class="' + (Math.abs(b - a) < 0.05 ? 'is-flat' : b > a ? 'is-up' : 'is-dn') + '">' + F.pts(b - a) + '</b><span>' + esc(big || 'percentage points') + '</span>') + '</div></div>';
  }
  var CELL = { maj: 'm', top: 't', 'in': 's', none: 'n', na: 'x', hung: 'h' };
  function waffle(y, cells, label, out) {
    return '<div class="sx-wfr' + (out ? ' is-out' : '') + '"><span class="y">' + y + '</span><div class="sx-wf" role="img" aria-label="' + esc(label) + '">' +
      cells.map(function (s) { return '<i class="' + CELL[s] + '"></i>'; }).join('') + '</div>' + (out ? '<em>' + esc(out) + '</em>' : '') + '</div>';
  }
  function count(cells, s) { return cells.filter(function (c) { return c === s; }).length; }
  function key(items) { return '<ul class="sx-key">' + items.map(function (k) { return '<li><i class="' + k[0] + '"></i>' + esc(k[1]) + '</li>'; }).join('') + '</ul>'; }
  // a figure then and now: its label, 2021, the arrow, 2026 and the change
  // plain: the change in ink, not in a gain's green or a loss's red (hung councils). A party new since 2021: its figure now, New beside it
  function stat(lbl, a, b, sub, plain) {
    return '<div class="sx-st"><dt>' + esc(lbl) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</dt><dd>' + (a == null ? '' : '<span class="a">' + F.int(a) + '</span><span class="ar" aria-hidden="true">\u2192</span>') + '<span class="b">' + F.int(b) + '</span>' + (a == null ? newTag() : dInt(b - a, plain)) + '</dd></div>';
  }

  /* ---- the frames ---- */
  // every party's share at both elections, a dot each, 2021 hollow and 2026 in the party's colour, the larger shares first
  function shift(f, D) {
    var rows = X.shares(D, 9), top = 0;
    rows.forEach(function (r) { top = Math.max(top, r.a || 0, r.b || 0); });
    var mx = Math.ceil(top / 10) * 10 || 10, ticks = [], grid = '';
    for (var t = 0; t <= mx; t += 10) { ticks.push('<span' + ((t / 10) % 2 ? ' class="odd"' : '') + ' style="left:' + (100 * t / mx) + '%">' + t + '%</span>'); grid += '<s style="left:' + (100 * t / mx) + '%"></s>'; }
    var body = '<div class="sx-db"><div class="sx-dh"><span></span><span class="tr sx-ax">' + ticks.join('') + '</span><span class="va">' + Y0 + '</span><span class="vb">' + Y1 + '</span><span class="vd">Change</span></div>' +
      rows.map(function (r) {
        var a = r.a == null ? null : 100 * r.a / mx, b = 100 * (r.b || 0) / mx, lo = a == null ? b : Math.min(a, b), w = a == null ? 0 : Math.abs(b - a);
        return '<div class="sx-dr" style="' + pcVars(r.col) + '"><span class="p"><i></i>' + esc(r.label) + '</span><span class="tr">' + grid +
          (a == null ? '' : '<span class="ln" style="left:' + lo.toFixed(2) + '%;width:' + w.toFixed(2) + '%;transform-origin:' + (b >= a ? 'left' : 'right') + '"></span><i class="o" style="left:' + a.toFixed(2) + '%"></i>') +
          '<i class="f" style="--a:' + (a == null ? b : a).toFixed(2) + '%;--b:' + b.toFixed(2) + '%"></i></span><span class="va">' + (r.a == null ? '\u2014' : F.pct(r.a)) + '</span><span class="vb">' + F.pct(r.b) + '</span><span class="vd">' + (r.a == null ? newTag() : dPts((r.b || 0) - r.a)) + '</span></div>';
      }).join('') + '</div>' + key([['o', Y0], ['f', Y1]]);
    return { kicker: 'Since ' + Y0, title: 'How party support has shifted since ' + Y0, body: body, note: NOTE + ' The change is in percentage points.' };
  }
  var STAT = { maj: 'Councils with a majority', top: 'Councils where it has the most seats', inC: 'Councils where it won seats', seats: 'Council seats', metroTop: 'Metros where it has the most seats' };
  function party(f, D) {
    var p = X.party(f.party, D); if (!p || !p.b.stood) return null;
    var a = p.a, b = p.b, The = cap(f.the || f.party), n = D.c1.list.length, out = !a.stood ? 'Did not stand' : '';
    var title = p.isNew ? The + ', which did not stand in ' + Y0 + ', won ' + F.pct(b.pct) + ' of the vote'
      : Math.abs(p.d) < 0.05 ? poss(The) + ' share of the vote has held at ' + F.pct(b.pct)
      : poss(The) + ' share of the vote has ' + (p.d > 0 ? 'grown' : 'fallen') + ' from ' + F.pct(a.pct) + ' to ' + F.pct(b.pct);
    function aria(y, s) { return y + ': a majority in ' + count(s.cells, 'maj') + ' councils, the most seats in ' + count(s.cells, 'top') + ' more, seats in ' + count(s.cells, 'in') + ' more, no seats in ' + count(s.cells, 'none'); }
    var cells = '<div class="sx-blk"><p class="sx-lbl">The ' + n + ' metro and local councils</p>' + waffle(Y0, a.cells, out ? 'Did not stand in ' + Y0 : aria(Y0, a), out) + waffle(Y1, b.cells, aria(Y1, b)) +
      key([['m', 'Majority'], ['t', 'Most seats'], ['s', 'Won seats'], ['n', 'No seats']].concat(a.cells.indexOf('na') >= 0 || b.cells.indexOf('na') >= 0 ? [['x', 'No seat figures']] : [])) + '</div>';
    var sts = (f.stats || ['seats']).map(function (k) {
      var va = k === 'metroTop' ? a.metroTop.length : a[k], vb = k === 'metroTop' ? b.metroTop.length : b[k], sub = '';
      if (k === 'metroTop' && b.metroTop.length && b.metroTop.length <= 2) sub = b.metroTop.map(metroName).join(', ');
      return stat(STAT[k], a.stood ? va : null, vb, sub);
    }).join('');
    return { kicker: 'Since ' + Y0 + ' \u00b7 ' + (f.name || f.party), title: title, body: bars(a.stood ? a.pct : null, b.pct, p.col, '', out) + cells + '<dl class="sx-sts">' + sts + '</dl>', note: NOTE, style: pcVars(p.col) };
  }
  // the eight metros: the party with the most seats in each, 2021 and 2026
  function metros(f, D) {
    var M = X.metros(D), by = {}, best = null;
    M.forEach(function (m) { [['a', m.a], ['b', m.b]].forEach(function (x) { if (x[1].top == null) return; var k = x[1].label; by[k] = by[k] || { a: 0, b: 0 }; by[k][x[0]]++; }); });
    Object.keys(by).forEach(function (k) { if (!best || by[k].b > by[best].b) best = k; });
    var nb = best ? by[best].b : 0, na = best ? by[best].a : 0, The = cap(theOf(best || ''));
    var title = best ? The + ' has the most seats in ' + F.word(nb) + ' of the eight metros' + (na === nb ? ', as in ' + Y0 : ', ' + (nb > na ? 'up' : 'down') + ' from ' + F.word(na) + ' in ' + Y0) : 'The eight metros, ' + Y0 + ' and ' + Y1;
    function cell(c) {
      if (c.none) return '<span class="sx-mc is-none">No seat figures</span>';
      if (c.tie) return '<span class="sx-mc is-tie"><i style="background:linear-gradient(90deg,' + c.cols[0] + ' 50%,' + c.cols[1] + ' 50%)"></i><b>' + esc(c.labels.join('/')) + '</b><span class="s">' + c.seats + '<small> each</small></span><span class="tg">Tied</span></span>';
      return '<span class="sx-mc"><i style="background:' + c.col + '"></i><b>' + esc(c.label) + '</b><span class="s">' + c.seats + '<small> of ' + c.total + '</small></span>' + (c.maj ? '<span class="tg is-maj"><span class="lg">Majority</span><span class="sh" aria-hidden="true">Maj</span></span>' : '') + '</span>';
    }
    var body = '<div class="sx-mt"><div class="sx-mh"><span>Metro</span><span>' + Y0 + '</span><span>' + Y1 + '</span></div>' + M.map(function (m) {
      var chg = (m.a.label || m.a.labels) && (m.b.label || m.b.labels) && String(m.a.label || m.a.labels) !== String(m.b.label || m.b.labels);
      return '<div class="sx-mr' + (chg ? ' is-chg' : '') + '"><span class="n">' + esc(m.name) + '</span>' + cell(m.a) + cell(m.b) + '</div>';
    }).join('') + '</div>';
    return { kicker: 'Since ' + Y0 + ' \u00b7 The metros', title: title, body: body, note: 'The party with the most seats in each metro council, and its seats of the council\u2019s. A majority is more than half the seats. ' + SEATS };
  }
  function hung(f, D) {
    var H = X.hung(D), a = H.a, b = H.b, n = D.c1.list.length, more = b.metros.filter(function (c) { return a.metros.indexOf(c) < 0; });
    var title = a.hung === b.hung ? 'The number of hung councils has held at ' + F.int(b.hung) : 'The number of hung councils has ' + (b.hung > a.hung ? 'risen' : 'fallen') + ' from ' + F.int(a.hung) + ' to ' + F.int(b.hung);
    function aria(y, s) { return y + ': ' + s.hung + ' hung councils, ' + s.maj + ' with a majority' + (s.na ? ', ' + s.na + ' with no seat figures' : ''); }
    var body = '<div class="sx-blk sx-hung"><p class="sx-lbl">The ' + n + ' metro and local councils</p>' + waffle(Y0, a.cells, aria(Y0, a)) + waffle(Y1, b.cells, aria(Y1, b)) +
      key([['h', 'Hung'], ['m', 'A party has a majority']].concat(a.na || b.na ? [['x', 'No seat figures']] : [])) + '</div>' +
      '<dl class="sx-sts">' + stat('Hung councils', a.hung, b.hung, '', true) + stat('Councils where a party has a majority', a.maj, b.maj, '', true) + stat('Hung metros', a.metros.length, b.metros.length, more.length ? 'Now ' + list(more.map(metroName)) + ' too' : '', true) + '</dl>';
    return { kicker: 'Since ' + Y0 + ' \u00b7 Hung councils', title: title, body: body, note: 'A hung council is one where no party has more than half the seats. ' + SEATS };
  }
  // turnout: South Africa's, then each province's as a dot then and now, the highest now first
  function turnout(f, D) {
    var T = X.turnout(D), lo = 100, hi = 0;
    T.rows.forEach(function (r) { lo = Math.min(lo, r.a, r.b); hi = Math.max(hi, r.a, r.b); });
    lo = Math.max(0, Math.floor(lo / 5) * 5 - 5); hi = Math.min(100, Math.ceil(hi / 5) * 5 + 5);
    var sc = function (v) { return 100 * (v - lo) / (hi - lo); }, ticks = [], grid = '';
    for (var t = Math.ceil(lo / 10) * 10; t <= hi; t += 10) { ticks.push('<span style="left:' + sc(t).toFixed(2) + '%">' + t + '%</span>'); grid += '<s style="left:' + sc(t).toFixed(2) + '%"></s>'; }
    var title = Math.abs(T.b - T.a) < 0.05 ? 'Turnout has held at ' + F.pct(T.b) : 'Turnout has ' + (T.b > T.a ? 'risen' : 'fallen') + ' from ' + F.pct(T.a) + ' to ' + F.pct(T.b);
    var rows = '<div class="sx-db is-turn" style="' + pcVars(TURN) + '"><div class="sx-dh"><span></span><span class="tr sx-ax">' + ticks.join('') + '</span><span class="va">' + Y0 + '</span><span class="vb">' + Y1 + '</span><span class="vd">Change</span></div>' +
      T.rows.map(function (r) {
        var a = sc(r.a), b = sc(r.b);
        return '<div class="sx-dr"><span class="p">' + esc(r.name) + '</span><span class="tr">' + grid + '<span class="ln" style="left:' + Math.min(a, b).toFixed(2) + '%;width:' + Math.abs(b - a).toFixed(2) + '%;transform-origin:' + (b >= a ? 'left' : 'right') + '"></span><i class="o" style="left:' + a.toFixed(2) + '%"></i><i class="f" style="--a:' + a.toFixed(2) + '%;--b:' + b.toFixed(2) + '%"></i></span><span class="va">' + F.pct(r.a) + '</span><span class="vb">' + F.pct(r.b) + '</span><span class="vd">' + dPts(r.b - r.a) + '</span></div>';
      }).join('') + '</div>';
    // South Africa's figures over the provinces
    var body = '<dl class="sx-sts is-top"><div class="sx-st"><dt>Turnout</dt><dd><span class="a">' + F.pct(T.a) + '</span><span class="ar" aria-hidden="true">\u2192</span><span class="b">' + F.pct(T.b) + '</span>' + dPts(T.b - T.a) + '</dd></div>' +
      '<div class="sx-st"><dt>Registered voters</dt><dd><span class="a">' + F.num1(T.regA / 1e6) + '</span><span class="ar" aria-hidden="true">\u2192</span><span class="b">' + F.mil(T.regB) + '</span></dd></div>' +
      '<div class="sx-st"><dt>Provinces where turnout rose</dt><dd><span class="b">' + T.up + ' of ' + T.rows.length + '</span></dd></div></dl>' +
      '<div class="sx-blk"><p class="sx-lbl">By province</p>' + rows + '</div>';
    return { kicker: 'Since ' + Y0 + ' \u00b7 Turnout', title: title, body: body, note: 'Turnout is the share of registered voters who voted.' };
  }
  var DRAW = { shift: shift, party: party, metros: metros, hung: hung, turnout: turnout };
  function draw(f, D) { try { return DRAW[f.type] ? DRAW[f.type](f, D) : null; } catch (e) { if (window.console) console.error('[since-2021] ' + f.id + ':', e); return null; } }
  function needs(f) { return f.type === 'party' || f.type === 'metros' || f.type === 'hung'; }
  return { draw: draw, needs: needs, esc: esc, pcVars: pcVars };
})();
