/* story-data.js — Since 2021 (library v3.16): the figures behind the story and its frames, read from the RevEngine IEC service, the
   service every graphic reads. /local/{year}: the national totals of 2021 and 2026 (each party's share of the vote on all three ballots,
   turnout, registered voters, and each province's); /local/{year}/provinces/{Province}: each province with its councils' seats, read only
   for a frame that needs them (a party's councils, the metros, hung councils). Councils are the 213 metro and local councils (the district
   councils left out, as in Hung councils). A council's seats are the hub's (norm in its "results"): the Commission's seats, independents'
   ward seats added, none where they don't add up to 90% of the council; its largest party has the most seats (then the most votes), a
   majority is more than half the seats, and a council with seats and no majority is hung. Parties are matched across the two elections by
   the Commission's party ID; their short names and colours are the hub's. window.EHX_SX. */
window.EHX_SX = (function () {
  'use strict';
  var C = window.EHX_CONFIG || {};
  var BASE = String(C.resultsBase || 'https://iec-api.revengine.dailymaverick.co.za/local').replace(/\/+$/, '');
  var Y0 = '2021', Y1 = '2026';
  var PROVS = { GP: 'Gauteng', WC: 'Western Cape', KZN: 'KwaZulu-Natal', EC: 'Eastern Cape', FS: 'Free State', NW: 'North West', MP: 'Mpumalanga', LP: 'Limpopo', NC: 'Northern Cape' };
  var PORDER = ['GP', 'WC', 'KZN', 'EC', 'LP', 'MP', 'NW', 'FS', 'NC'], PBYNAME = {};
  Object.keys(PROVS).forEach(function (k) { PBYNAME[PROVS[k].toLowerCase()] = k; });
  var METROS = { JHB: 'Johannesburg', TSH: 'Tshwane', EKU: 'Ekurhuleni', CPT: 'Cape Town', ETH: 'eThekwini', NMA: 'Nelson Mandela Bay', BUF: 'Buffalo City', MAN: 'Mangaung' };
  var MORDER = ['JHB', 'TSH', 'EKU', 'CPT', 'ETH', 'NMA', 'BUF', 'MAN'];
  // the hub's short names and colours (its "parties" in "results": the coalition builder's colours, a muted spare for the rest)
  var ABBR = { ACTIONSA: 'ActionSA', 'VF PLUS': 'FF+', ALJAMA: 'Al Jama-ah', CAPEXIT: 'CapeXit', MKP: 'MK', 'MK PARTY': 'MK' };
  var COL = { DA: '#5070ae', ActionSA: '#367c23', PA: '#3daa84', 'FF+': '#f2a22c', IFP: '#8e1f3d', EFF: '#c84837', MK: '#6aa852', ANC: '#e7d935' };
  var SPARE = ['#7f8ca0', '#b9ae9b', '#9db596', '#9a9bb5', '#c6b08c', '#a8a487', '#8697ac', '#b39c9c'], IND = '#a9aaab', OTHERS = '#c0c0c0';
  var REG = {}, NAME = {};
  function abbrOf(raw) { var s = String(raw || '').replace(/\s+/g, ' ').trim(), k = s.indexOf(' - '); return k > 0 && k <= 14 ? s.slice(0, k).trim() : ''; }
  function learn(id, raw) {
    id = +id || 0; if (!id) return 'Independent';
    var a = abbrOf(raw); if (a) { a = ABBR[a.toUpperCase()] || a; REG[id] = a; NAME[id] = String(raw).slice(String(raw).indexOf(' - ') + 3).trim(); }
    return REG[id] || String(raw || '').trim();
  }
  function label(id) { return +id ? REG[id] || NAME[id] || String(id) : 'Independent'; }
  function colour(id) { var l = label(id); return COL[l] || (+id ? SPARE[Math.abs(+id) % SPARE.length] : IND); }
  function idOf(lbl) { for (var k in REG) if (REG[k] === lbl) return +k; return lbl === 'Independent' ? 0 : null; }

  /* ---- reading: each address once a visit, 20 seconds at most; a failed read is forgotten so the next asks again ---- */
  var cache = {};
  function get(path) {
    var url = BASE + path;
    if (cache[url]) return cache[url];
    var p = new Promise(function (ok, no) {
      var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); no(new Error('no answer within 20 s')); }, 20000);
      fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { clearTimeout(t); if (!d) throw new Error('no results'); ok(d); }, function (e) { clearTimeout(t); no(e); });
    });
    cache[url] = p;
    p.catch(function (e) { if (cache[url] === p) delete cache[url]; if (window.console) console.warn('[since-2021] ' + url + ': ' + ((e && e.message) || e)); });
    return p;
  }

  /* ---- a year's national totals ---- */
  function parties(list) {
    var by = {}, rows = [];
    (list || []).forEach(function (r) {
      var id = +r.party_id || 0; learn(id, r.party_name);
      if (by[id]) return;
      by[id] = { id: id, votes: +r.votes || 0, pct: +r.vote_perc || 0 }; rows.push(by[id]);
    });
    rows.sort(function (a, b) { return b.votes - a.votes; });
    return { by: by, rows: rows };
  }
  function natYear(y) {
    return get('/' + y).then(function (d) {
      var P = parties(d.party_ballot_results), pv = {};
      (d.provincial_results || []).forEach(function (e) {
        var pc = PBYNAME[String(e.province_name || '').toLowerCase()];
        if (pc) pv[pc] = { pc: pc, name: PROVS[pc], reg: +e.registered_voters || 0, turn: e.percent_voter_turnout != null && e.percent_voter_turnout !== '' ? +e.percent_voter_turnout : null, p: parties(e.party_ballot_results) };
      });
      return { y: y, reg: +d.registered_voters || 0, turn: +d.percent_voter_turnout || 0, vd: +d.vd_captured || 0, vdN: +d.vd_count || 0,
        complete: !!d.results_complete || (+d.vd_count > 0 && +d.vd_captured >= +d.vd_count), at: Date.parse(d.report_date || '') || 0, p: P, prov: pv };
    });
  }

  /* ---- a year's councils: the hub's seats (see the top) ---- */
  function council(pc, e) {
    var raw = String(e.municipality_name || ''), k = raw.indexOf(' - '), code = (k > 0 ? raw.slice(0, k) : raw).trim();
    if (/^DC\d/.test(code)) return null;
    var st = e.seats || {}, total = +st.total_seats_available || 0, seats = {}, votes = {};
    (e.party_ballot_results || []).forEach(function (r) { var id = +r.party_id || 0; learn(id, r.party_name); votes[id] = +r.votes || 0; if (+r.total_seats > 0 && !seats[id]) seats[id] = +r.total_seats; });
    (Array.isArray(st.party_results) ? st.party_results : []).forEach(function (r) { var id = +r.ID || 0, s = +r.TotalPartySeats || 0; if (votes[id] == null) votes[id] = +r.TotalValidVotes || 0; if (s > 0 && !seats[id]) { seats[id] = s; if (!REG[id] && !NAME[id]) NAME[id] = String(r.Name || '').trim(); } });
    var seated = 0; for (var s in seats) seated += seats[s];
    var ind = +st.independent_seats_won || 0, add = ind - (seats[0] || 0);
    if (seated > 0 && add > 0 && seated + add <= total) { seats[0] = ind; seated += add; }
    if (!total || seated <= 0 || seated < total * 0.9) { seats = {}; seated = 0; }
    // tie: the two largest parties with as many seats each; neither then has the most seats (the frames say so)
    var ids = Object.keys(seats).map(Number).sort(function (a, b) { return seats[b] - seats[a] || (votes[b] || 0) - (votes[a] || 0); });
    var has = ids.length > 0, tie = ids.length > 1 && seats[ids[0]] === seats[ids[1]], top = has && !tie ? ids[0] : null, need = Math.floor(total / 2) + 1;
    return { code: code, name: k > 0 ? raw.slice(k + 3).trim() : raw, pc: pc, metro: !!METROS[code], total: total, seats: seats, seated: seated,
      has: has, tie: tie, tied: tie ? [ids[0], ids[1]] : null, top: top, topSeats: has ? seats[ids[0]] : 0, maj: top != null && seats[top] >= need, need: need,
      turn: e.percent_voter_turnout != null && e.percent_voter_turnout !== '' ? +e.percent_voter_turnout : null };
  }
  function couYear(y) {
    return Promise.all(PORDER.map(function (pc) {
      return get('/' + y + '/provinces/' + encodeURIComponent(PROVS[pc])).then(function (d) { return (d.municipal_results || []).map(function (e) { return council(pc, e); }).filter(Boolean); });
    })).then(function (a) { var L = [].concat.apply([], a), by = {}; L.forEach(function (c) { by[c.code] = c; }); return { y: y, list: L, by: by }; });
  }
  var NP = {}, CP = {};
  function nat() { return Promise.all([NP[Y0] || (NP[Y0] = natYear(Y0)), NP[Y1] || (NP[Y1] = natYear(Y1))]).then(null, function (e) { delete NP[Y0]; delete NP[Y1]; throw e; }); }
  function councils() { return Promise.all([nat(), CP[Y0] || (CP[Y0] = couYear(Y0)), CP[Y1] || (CP[Y1] = couYear(Y1))]).then(function (r) { return { n0: r[0][0], n1: r[0][1], c0: r[1], c1: r[2] }; }, function (e) { delete CP[Y0]; delete CP[Y1]; throw e; }); }

  /* ---- what the frames show ---- */
  // a party at one election: its share, and in the councils its seats, the councils it has seats in, the most seats in, a majority in, the metros it leads
  function partyYear(N, Cy, id) {
    var p = N.p.by[id], s = { stood: !!p && p.votes > 0, pct: p ? p.pct : 0, votes: p ? p.votes : 0, seats: 0, inC: 0, top: 0, maj: 0, metroTop: [], metroMaj: [], n: 0, cells: [] };
    if (Cy) Cy.list.forEach(function (c) {
      var k = c.has ? c.seats[id] || 0 : 0, st = !c.has ? 'na' : c.top === id ? (c.maj ? 'maj' : 'top') : k ? 'in' : 'none';
      s.cells.push(st);
      if (!c.has) return;
      s.n++; s.seats += k; if (k) s.inC++;
      if (c.top === id) { s.top++; if (c.maj) s.maj++; if (c.metro) s.metroTop.push(c.code); if (c.metro && c.maj) s.metroMaj.push(c.code); }
    });
    return s;
  }
  var ORDER_CELL = { maj: 0, top: 1, 'in': 2, none: 3, na: 4 };
  function sortCells(a) { return a.slice().sort(function (x, y) { return ORDER_CELL[x] - ORDER_CELL[y]; }); }
  function party(lbl, D) {
    var id = idOf(lbl); if (id == null) return null;
    var a = partyYear(D.n0, D.c0, id), b = partyYear(D.n1, D.c1, id);
    a.cells = sortCells(a.cells); b.cells = sortCells(b.cells);
    return { id: id, label: lbl, col: colour(id), a: a, b: b, d: b.pct - (a.stood ? a.pct : 0), isNew: !a.stood && b.stood };
  }
  // every party's share at both elections, by its larger share
  function shares(D, n) {
    var ids = {}, rows = [];
    [D.n0, D.n1].forEach(function (N) { N.p.rows.forEach(function (p) { if (p.id && p.votes > 0) ids[p.id] = 1; }); });
    Object.keys(ids).forEach(function (k) { var id = +k, a = D.n0.p.by[id], b = D.n1.p.by[id]; rows.push({ id: id, label: label(id), col: colour(id), a: a && a.votes > 0 ? a.pct : null, b: b && b.votes > 0 ? b.pct : null }); });
    rows.sort(function (x, y) { return (y.b || 0) - (x.b || 0) || (y.a || 0) - (x.a || 0); });
    return rows.slice(0, n || 9);
  }
  // hung councils at one election: the councils with seats and no majority; the metros among them; each council's state, sorted
  function hungYear(Cy) {
    var s = { hung: 0, maj: 0, na: 0, n: 0, metros: [], cells: [], byTop: {} };
    Cy.list.forEach(function (c) {
      s.n++;
      if (!c.has) { s.na++; s.cells.push('na'); return; }
      if (c.maj) { s.maj++; s.cells.push('maj'); return; }
      s.hung++; s.cells.push('hung'); if (c.top != null) s.byTop[c.top] = (s.byTop[c.top] || 0) + 1; if (c.metro) s.metros.push(c.code);
    });
    var o = { hung: 0, maj: 1, na: 2 }; s.cells.sort(function (x, y) { return o[x] - o[y]; });
    return s;
  }
  function hung(D) { return { a: hungYear(D.c0), b: hungYear(D.c1) }; }
  function metro(Cy, code) {
    var c = Cy.by[code];
    if (!c || !c.has) return { code: code, none: true };
    if (c.tie) return { code: code, tie: true, labels: [label(c.tied[0]), label(c.tied[1])], cols: [colour(c.tied[0]), colour(c.tied[1])], seats: c.topSeats, total: c.total };
    return { code: code, top: c.top, label: label(c.top), col: colour(c.top), seats: c.topSeats, total: c.total, maj: c.maj };
  }
  function metros(D) { return MORDER.map(function (code) { return { code: code, name: METROS[code], a: metro(D.c0, code), b: metro(D.c1, code) }; }); }
  function turnout(D) {
    var rows = PORDER.map(function (pc) { var a = D.n0.prov[pc], b = D.n1.prov[pc]; return { pc: pc, name: PROVS[pc], a: a ? a.turn : null, b: b ? b.turn : null }; }).filter(function (r) { return r.a != null && r.b != null; });
    rows.sort(function (x, y) { return y.b - x.b; });
    return { a: D.n0.turn, b: D.n1.turn, regA: D.n0.reg, regB: D.n1.reg, rows: rows, up: rows.filter(function (r) { return r.b > r.a; }).length };
  }

  /* ---- formats, as the hub writes them: a decimal comma, a narrow space between thousands ---- */
  function pct(v) { return v == null || isNaN(v) ? '\u2014' : (Math.round(v * 10) / 10).toFixed(1).replace('.', ',') + '%'; }
  function num1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace('.', ','); }
  function pts(d) { var a = Math.round(Math.abs(d) * 10) / 10; return a < 0.05 ? '\u00b10,0' : (d > 0 ? '+' : '\u2212') + a.toFixed(1).replace('.', ','); }
  function int(n) { return String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
  function mil(n) { return num1(n / 1e6) + ' million'; }
  var WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  function word(n) { return n >= 0 && n < 10 ? WORDS[n] : int(n); }
  return { Y0: Y0, Y1: Y1, nat: nat, councils: councils, party: party, shares: shares, hung: hung, metros: metros, turnout: turnout, label: label, colour: colour, idOf: idOf,
    METROS: METROS, MORDER: MORDER, PROVS: PROVS, OTHERS: OTHERS, fmt: { pct: pct, num1: num1, pts: pts, int: int, mil: mil, word: word } };
})();
