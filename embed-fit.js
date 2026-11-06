/* embed-fit.js — runs after embed.js, for the fixed-height embed (html.ehx-fit): the card is as tall as the frame (embed-fit.css), and this
   fits the graphic to the room between the status and the credit. Maps: their width set from the room's height, so they are as big as
   it allows (the councils maps, the hung councils map, Change since 2021's maps). Lists: every row, in a box that
   scrolls under a bar of its own where the room is short (party support, results by council, the hung councils list, votes by party, council seats' parties, a ward's candidates). Change since 2021 on a phone: one map,
   with a 2021 / 2026 switch. (The ward map fits by the stylesheet alone: its box takes the room over the key, the drawing scales into it.) */
(function () {
  'use strict';
  var X = window.EHX || {}, g = X.g;
  if (!g || !X.fit) return;
  var nat = g.group === 'area', root, fill, Y = '2026';
  function $(s, el) { return (el || root).querySelector(s); }
  function $$(s, el) { return [].slice.call((el || root).querySelectorAll(s)); }
  function shown(el) { return !!(el && el.getClientRects().length); }
  function limit() { return fill.getBoundingClientRect().bottom; }

  /* ---- maps: the drawing's width from the room's height (its box is the flex item that takes what the key leaves) ---- */
  function fitMaps() {
    $$('.res-map > .res-map-svg').forEach(function (box) {
      var svg = box.querySelector('svg'), vb = svg && svg.viewBox && svg.viewBox.baseVal, H = box.clientHeight, W = box.parentElement.clientWidth, val = '';
      if (!shown(box) || !vb || !vb.height || !vb.width || !H || !W) return;
      var want = Math.floor(H * vb.width / vb.height);
      if (want < W) val = want + 'px';
      if (box.style.maxWidth !== val) box.style.maxWidth = val;
    });
  }

  /* ---- lists: every row, in a box that scrolls where the room is short of them, under a bar of its own (embed-fit.css): a hairline track
     and a thumb to drag, the rows fading at an edge with more beyond it. Beside a map, or alone, a list takes the room's height; party
     support under its map (a narrow card) keeps the room of six rows and a half, so the map keeps its size. ---- */
  var bars = [];
  function barFor(box, make) {
    for (var i = 0; i < bars.length; i++) if (bars[i].box === box) return bars[i];
    if (!make) return null;
    var sb = document.createElement('div'), o = { box: box, sb: sb }, y0 = 0, t0 = 0;
    sb.className = 'ehx-sb'; sb.setAttribute('aria-hidden', 'true'); sb.hidden = true; sb.innerHTML = '<span class="ehx-th"></span>';
    o.th = sb.firstChild; fill.appendChild(sb); bars.push(o);
    box.classList.add('ehx-scroll');
    box.addEventListener('scroll', function () { paintBar(o); }, { passive: true });
    box.addEventListener('pointerenter', function () { sb.classList.add('is-hot'); });
    box.addEventListener('pointerleave', function () { sb.classList.remove('is-hot'); });
    // the thumb dragged; the track pressed, a page up or down; the wheel over the bar scrolls the list
    sb.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      e.preventDefault();
      if (e.target === o.th) { y0 = e.clientY; t0 = box.scrollTop; sb.classList.add('is-drag'); try { sb.setPointerCapture(e.pointerId); } catch (x) {} return; }
      var r = o.th.getBoundingClientRect();
      box.scrollBy({ top: (e.clientY < r.top ? -1 : 1) * box.clientHeight * 0.85, behavior: 'smooth' });
    });
    sb.addEventListener('pointermove', function (e) {
      if (!sb.classList.contains('is-drag')) return;
      var span = sb.clientHeight - o.th.offsetHeight, max = box.scrollHeight - box.clientHeight;
      if (span > 0) box.scrollTop = t0 + (e.clientY - y0) * max / span;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (k) { sb.addEventListener(k, function () { sb.classList.remove('is-drag'); }); });
    sb.addEventListener('wheel', function (e) { e.preventDefault(); box.scrollTop += e.deltaY; }, { passive: false });
    return o;
  }
  function paintBar(o) {
    var box = o.box, sb = o.sb, max = box.scrollHeight - box.clientHeight;
    if (!shown(box) || max < 2) { if (!sb.hidden) sb.hidden = true; if (box.hasAttribute('data-ehx-sc')) box.removeAttribute('data-ehx-sc'); return; }
    if (!box.hasAttribute('data-ehx-sc')) { box.setAttribute('data-ehx-sc', ''); max = box.scrollHeight - box.clientHeight; }   // the bar's gutter first, then the rows measured again
    var st = box.scrollTop, fade = ((st > 1 ? 'up ' : '') + (st < max - 1 ? 'dn' : '')).trim();
    if (box.getAttribute('data-ehx-sc') !== fade) box.setAttribute('data-ehx-sc', fade);
    var r = box.getBoundingClientRect(), f = fill.getBoundingClientRect(), H = Math.round(r.height), th = Math.max(32, Math.round(H * box.clientHeight / box.scrollHeight));
    sb.style.top = Math.round(r.top - f.top - fill.clientTop + fill.scrollTop) + 'px';
    var room = parseFloat(getComputedStyle(box).getPropertyValue('--ehx-room')) || 0;   // the box reaches past the list by this (embed-fit.css)
    sb.style.left = Math.round(r.right - room - f.left - fill.clientLeft - 14) + 'px';
    sb.style.height = H + 'px';
    o.th.style.height = th + 'px';
    o.th.style.transform = 'translateY(' + Math.round((H - th) * Math.min(1, st / Math.max(1, max))) + 'px)';
    if (sb.hidden) sb.hidden = false;
  }
  /* party support under its map, in a column (a narrow card): the map takes what the box leaves, so the box's room is not read from its own
     top (that is only ever its own height). Eight rows or more: six and a half, bounded by the grid's room less a map of 180px at least;
     fewer: no height set, every row shows. null: not under a map, the room from the box's top. */
  var MAP_MIN = 180;
  function underMap(box) {
    var grid = box.parentElement && box.parentElement.closest('.res-grid'), map = grid && grid.querySelector(':scope > .res-map');
    if (!map || !shown(map) || getComputedStyle(grid).flexDirection !== 'column') return null;
    var rows = $$('tbody tr', box).filter(shown);
    if (rows.length < 8) return '';
    var r = rows[6].getBoundingClientRect(), cap = r.top + r.height * 0.55 - box.getBoundingClientRect().top + box.scrollTop;
    var gap = parseFloat(getComputedStyle(grid).rowGap) || 0, room = limit() - grid.getBoundingClientRect().top - MAP_MIN - gap - (box.parentElement.offsetHeight - box.offsetHeight);
    return Math.max(96, Math.floor(Math.min(cap, room))) + 'px';
  }
  function scrollList(box) {
    if (!box) return;
    var o = barFor(box, shown(box));
    if (!o) return;
    if (shown(box)) {
      var val = underMap(box);
      if (val === null) val = Math.max(96, Math.floor(limit() - box.getBoundingClientRect().top)) + 'px';
      if (box.style.maxHeight !== val) box.style.maxHeight = val;
    }
    paintBar(o);
  }
  function fitLists() {
    // the hub's Show all parties (hidden here) pressed for it: every row in
    if (g.id === 'votes' || g.ward) $$('.mf-res-more[aria-expanded="false"]').forEach(function (b) { b.click(); });
    bars = bars.filter(function (o) { if (root.contains(o.box)) return true; o.sb.remove(); return false; });
    var boxes = $$('.res-board > .res-stand');
    if (g.id === 'table') boxes.push($('#res-tbl'));
    if (g.id === 'hung') boxes.push($('.hm-rest'));
    if (g.id === 'votes') boxes.push($('.mf-res-tbl'));
    if (g.id === 'seats') boxes.push($('.ehx-seats-b'));
    if (g.ward) boxes.push($('#mf-wardpanel .wp-cands'));
    if (g.id === 'cmp' && /^(support|councils)$/.test(X.view || '')) boxes.push($('#eh-cmp-body'));
    boxes.forEach(scrollList);
  }

  /* ---- Change since 2021 on a phone: one map at a time, 2021 or 2026, by a switch over it ---- */
  function cmpSwitch() {
    var b = $('#eh-cmp-body'), tog = b && b.querySelector(':scope > .ehx-tog');
    // only the views with maps have a year to switch (the tables show both years)
    if (!b || !/^(party|turnout|hung)$/.test(X.view || '') || !b.querySelector('.cmp-maps')) { if (tog) tog.remove(); if (document.documentElement.hasAttribute('data-ehx-y')) document.documentElement.removeAttribute('data-ehx-y'); return; }
    if (!tog) {
      tog = document.createElement('div'); tog.className = 'ehx-tog'; tog.setAttribute('role', 'group'); tog.setAttribute('aria-label', 'Year');
      tog.innerHTML = '<button type="button" data-y="2021">2021</button><button type="button" data-y="2026">2026</button>';
      tog.addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; Y = bt.getAttribute('data-y'); paintY(); fitMaps(); });
      b.insertBefore(tog, b.firstChild);
    }
    paintY();
  }
  function paintY() {
    var h = document.documentElement;
    if (Y === '2021') { if (h.getAttribute('data-ehx-y') !== '2021') h.setAttribute('data-ehx-y', '2021'); } else if (h.hasAttribute('data-ehx-y')) h.removeAttribute('data-ehx-y');
    $$('.ehx-tog button').forEach(function (bt) { var on = bt.getAttribute('data-y') === Y ? 'true' : 'false'; if (bt.getAttribute('aria-pressed') !== on) bt.setAttribute('aria-pressed', on); });
  }

  /* ---- the Coalition builder (v3.2): the half circle as large as the room allows, but no more than 1.4 times as wide as the hub draws it
     (a small council's narrower), and the parties' buttons under it as large as the room left allows, 1.8 times the hub's at most
     (--ehx-kc, embed.css), so a small council's parties share the room with its half circle. The buttons' sizes are tried in a style of
     its own in the head, outside the graphic the observers watch. The number in the middle and the line in the hole grow with the half
     circle (the number to 1.75 times the hub's at most, the line to 1.25). Worked out again only when the room, the council or its parties change.
     v3.3: on a phone (640px wide or less) the buttons keep the hub's size; the parties in rows of as near the same number as the width
     allows, the first rows taking the one more (seven: four and three, never six and one), the fewest rows that fit. ---- */
  var HW_MAX = 1.4, KC_MAX = 1.8, KC_PHONE = 1, kcCss = null, kcKey = '', phone = window.matchMedia ? window.matchMedia('(max-width: 640px)') : null;
  function setKc(v) {
    if (!kcCss) { kcCss = document.createElement('style'); document.head.appendChild(kcCss); }
    var t = 'html[data-embed="coalition"] #dm-eh .mf-coal-row{--ehx-kc:' + v + '}';
    if (kcCss.textContent !== t) kcCss.textContent = t;
  }
  // each row broken by a line of its own (.ehx-br, as tall as the gap between rows; embed.css). The buttons' widths at their own size (the
  // scale of the hub's pop-in taken off), so the rows come out the same while they come in.
  function balance(row) {
    var cps = [].slice.call(row.children).filter(function (c) { return c.classList.contains('mf-cp') && shown(c); }), n = cps.length, cs = getComputedStyle(row);
    var A = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + 0.5, G = parseFloat(cs.columnGap) || 0, rows = 0, x = 0, counts = [n], r, i, j, c;
    var w = cps.map(function (el) { var m = /^matrix\(\s*([-\d.e]+)/.exec(getComputedStyle(el).transform || ''), s = m ? Math.abs(+m[1]) || 1 : 1; return el.getBoundingClientRect().width / s; });
    w.forEach(function (v) { if (!rows || x + G + v > A) { rows++; x = v; } else x += G + v; });
    for (r = Math.max(rows, 1); r <= n; r++) {
      var base = Math.floor(n / r), cnt = [], ok = true, at = 0;
      for (i = 0; i < r && ok; i++) { c = base + (i < n % r ? 1 : 0); for (var s = 0, k = 0; k < c; k++) s += w[at + k] + (k ? G : 0); if (s > A) ok = false; cnt.push(c); at += c; }
      if (ok) { counts = cnt; break; }
    }
    var brs = [].slice.call(row.children).filter(function (el) { return el.classList.contains('ehx-br'); }), want = [], sum = 0;
    for (i = 0; i < counts.length - 1; i++) { sum += counts[i]; want.push(cps[sum]); }
    var same = brs.length === want.length && brs.every(function (br, q) { return br.nextElementSibling === want[q]; });
    if (!same) {
      brs.forEach(function (br) { br.remove(); });
      want.forEach(function (el) { var br = document.createElement('span'); br.className = 'ehx-br'; br.setAttribute('aria-hidden', 'true'); row.insertBefore(br, el); });
    }
    if (row.getAttribute('data-ehx-bal') !== counts.join(',')) row.setAttribute('data-ehx-bal', counts.join(','));
  }
  function fitCoal() {
    var b = $('.mf-res-seats .mf-res-board'), stg = b && b.querySelector('.ehh-stage'), fig = stg && stg.parentElement, inner = fill.firstElementChild, row = $('.mf-res-seats .mf-coal-row'), box = b && b.parentElement;
    if (!stg || !shown(stg) || !inner) return;
    var r = stg.getBoundingClientRect(), k = r.width ? r.height / r.width : 0;
    if (!k) return;
    var m = /min\(100%,\s*([\d.]+)px\)/.exec(fig.getAttribute('style') || ''), sw = m ? +m[1] : 600, cs = getComputedStyle(fill), on = shown(row);
    var room = fill.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), maxW = box.clientWidth - 12;   // 12: the board's padding at its sides
    function key() { return [room, maxW, sw, k.toFixed(4), on ? (row.getAttribute('data-sig') || '') + '|' + (row.getAttribute('data-ehx-bal') || '') + '|' + row.clientWidth + '|' + Math.round(row.getBoundingClientRect().height) : ''].join('/'); }
    if (b.classList.contains('ehx-sized') && key() === kcKey) return;
    // the half circle over the parties: everything but the half circle, with the buttons at size v in their rows
    side(box, row, false);
    function rest(v) { setKc(v); if (on) balance(row); return inner.getBoundingClientRect().height - stg.getBoundingClientRect().height; }
    var w = Math.max(220, Math.floor(Math.min(maxW, sw * HW_MAX, (room - rest(1)) / k))), lo = 1, hi = phone && phone.matches ? KC_PHONE : KC_MAX, i, mid;
    if (on && hi > lo) {
      if (rest(hi) + w * k <= room) lo = hi;
      else for (i = 0; i < 7; i++) { mid = (lo + hi) / 2; if (rest(mid) + w * k <= room) lo = mid; else hi = mid; }
    }
    var kc = Math.floor(lo * 100) / 100, best = null;
    setKc(kc);
    if (on) balance(row);
    /* v3.7 · the parties beside the half circle (a frame 561px wide or more: the code's height is a phone's, so the article column has width
       to spare and little height): in as many columns as the room under the Majority flag's needs, at 1.4, 1.2 or 1 times the hub's size,
       wherever that draws the half circle larger than over them (the largest half circle; within 4px, the larger buttons) */
    if (on && document.documentElement.clientWidth >= SIDE_W) {
      var bx = b.getBoundingClientRect().height - stg.getBoundingClientRect().height, out = inner.getBoundingClientRect().height - box.getBoundingClientRect().height;
      side(box, row, true);
      var pad = parseFloat(getComputedStyle(row).paddingTop) || 0, byH = (room - out - bx) / k;
      SIDE_KC.forEach(function (v) {
        if (v > (phone && phone.matches ? KC_PHONE : KC_MAX)) return;
        setKc(v);
        var cps = [].slice.call(row.children).filter(function (c) { return c.classList.contains('mf-cp') && shown(c); });
        if (!cps.length) return;
        var ch = Math.max.apply(null, cps.map(function (el) { var t = /^matrix\(\s*([-\d.e]+)/.exec(getComputedStyle(el).transform || ''), q = t ? Math.abs(+t[1]) || 1 : 1; return el.getBoundingClientRect().height / q; }));
        var rg = parseFloat(getComputedStyle(row).rowGap) || 0, n = Math.max(1, Math.floor((room - out - pad + rg) / (ch + rg))), cc = Math.ceil(cps.length / n);
        row.style.setProperty('--ehx-cc', String(cc));
        var ww = Math.floor(Math.min(box.clientWidth - row.getBoundingClientRect().width - SIDE_GAP - 12, sw * HW_MAX, byH));
        if (!best || ww > best.w + 4) best = { w: ww, kc: v, cc: cc };
      });
      if (best && best.w > w + 4) { setKc(best.kc); row.style.setProperty('--ehx-cc', String(best.cc)); w = Math.max(220, best.w); }
      else { side(box, row, false); setKc(kc); balance(row); }
    }
    var s = w / sw, set = { '--ehx-fw': w + 'px', '--ehx-kn': Math.min(s, 1.75).toFixed(3), '--ehx-kt': Math.min(s, 1.25).toFixed(3) };
    if (b.style.maxWidth) b.style.maxWidth = '';
    for (var p in set) if (b.style.getPropertyValue(p) !== set[p]) b.style.setProperty(p, set[p]);
    if (!b.classList.contains('ehx-sized')) b.classList.add('ehx-sized');
    kcKey = key();
  }
  // the parties beside the half circle (embed.css: .ehx-side, in --ehx-cc columns) or under it, in the rows balance() breaks
  var SIDE_W = 561, SIDE_GAP = 28, SIDE_KC = [1.4, 1.2, 1];
  function side(box, row, on) {
    if (box.classList.contains('ehx-side') !== on) box.classList.toggle('ehx-side', on);
    if (!row) return;
    if (on) { [].slice.call(row.querySelectorAll(':scope > .ehx-br')).forEach(function (br) { br.remove(); }); if (row.hasAttribute('data-ehx-bal')) row.removeAttribute('data-ehx-bal'); }
    else if (row.style.getPropertyValue('--ehx-cc')) row.style.removeProperty('--ehx-cc');
  }

  /* ---- Council seats: the code's height is measured for the council (library.js, v3.7), so every row shows under the half circle at its own
     width. In a frame short of them (a code copied before the seats were in, or before v3.7) the list keeps the room of four rows and a half,
     the half circle drawn narrower, so lower, by what it takes, and the rows scroll (fitLists). With room to spare (the code is as tall as
     the article column or a phone needs, whichever needs more: on the other the graphic is a little shorter), the rows stand further apart,
     up to 12px each (--ehx-rp, half of it over and half under each, embed.css), so there is no gap over the credit ---- */
  var RP_MAX = 6;
  function fitSeats() {
    var b = $('.mf-res-seats .mf-res-board'), stg = b && b.querySelector('.ehh-stage'), fig = stg && stg.parentElement, body = $('.ehx-seats-b'), row = body && body.firstElementChild, val = '', rp = 0;
    if (!b) return;
    var cur = body ? parseFloat(body.style.getPropertyValue('--ehx-rp')) || 0 : 0, n = body ? body.children.length : 0;
    if (stg && shown(stg) && row && shown(body)) {
      var r = stg.getBoundingClientRect(), k = r.width ? r.height / r.width : 0, sb = b.parentElement, cs = getComputedStyle(sb);
      var m = /min\(100%,\s*([\d.]+)px\)/.exec(fig.getAttribute('style') || ''), own = Math.min(sb.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 12, m ? +m[1] : 600);
      var want = Math.min(body.scrollHeight - 2 * cur * n, Math.ceil((row.getBoundingClientRect().height - 2 * cur) * 4.5));
      var over = k ? want - (limit() - body.getBoundingClientRect().top - (own * k - r.height)) : 0;
      if (over > 0.5) val = Math.max(240, Math.floor(own - over / k)) + 12 + 'px';   // 12: the board's padding at its sides
      else if (!b.style.maxWidth) {
        var inner = fill.firstElementChild, fs = getComputedStyle(fill);
        var free = fill.clientHeight - parseFloat(fs.paddingTop) - parseFloat(fs.paddingBottom) - (inner ? inner.getBoundingClientRect().height : 0) + 2 * cur * n;
        if (free > 1) rp = Math.min(RP_MAX, Math.floor(free / n) / 2);
      }
    }
    if (b.style.maxWidth !== val) b.style.maxWidth = val;
    if (body && cur !== rp) body.style.setProperty('--ehx-rp', rp + 'px');
  }

  function fitAll() {
    if (!fill) return;
    if (g.id === 'cmp') cmpSwitch();
    if (g.id === 'coalition') fitCoal();
    if (g.id === 'seats') fitSeats();
    fitMaps();
    fitLists();
  }
  var raf = 0;
  function soon() { if (raf) return; raf = setTimeout(function () { raf = 0; fitAll(); }, 50); }
  function boot() {
    root = document.getElementById('dm-eh');
    fill = root && root.querySelector(nat ? '.eh-tabs-sec' : '.eh-hero');
    if (!fill) return;
    fill.classList.add('ehx-fill');
    // the hub redraws a map or a list by writing it afresh (several times as the results come in), without the width, the rows or the box
    // set here: fitted at once, before the page is painted (a mutation observer runs before the next frame), so the new drawing never
    // shows at the full width first, nor a list with its first rows only; the rest a moment later
    new MutationObserver(function (ms) {
      var hit = false, add = false;
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(t.closest && t.closest('.ehx-headrow, .ehx-coal, .ehx-note, .ehx-foot, .ehx-sb, .ehx-tog'))) { hit = true; if (ms[i].type === 'childList') add = true; } }
      if (!hit) return;
      if (g.id === 'cmp') cmpSwitch();
      // a new row of parties (a live update): in its rows before it is painted
      if (add && g.id === 'coalition') { var cr = root.querySelector('.mf-res-seats .mf-coal-row'); if (cr && !cr.hasAttribute('data-ehx-bal')) fitCoal(); }
      fitMaps();
      if (add) fitLists();
      soon();
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
    if (window.ResizeObserver) { var ro = new ResizeObserver(soon); ro.observe(fill); ro.observe(document.documentElement); }
    window.addEventListener('resize', soon);
    window.addEventListener('load', soon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
    setInterval(soon, 2500);
    fitAll();
  }
  window.EH_FIT = { fit: fitAll, need: need };
  /* v3.11 · Results by ward: the room its map leaves (the map at its full size: as wide as its box, or as tall as the hub draws it). Leading
     party and Turnout: the box's height less the drawing's at its full size (less than 0 where the room is short of it). Change since 2021:
     the room under the note (the two maps keep their size where there is room, embed-fit.css). */
  function wardsSpare() {
    if (X.view === 'cmp') {
      var c = $('.mf-wmap--res .mf-wm-cmp'), l = c && c.lastElementChild;
      if (!l || !shown(c)) return 0;
      return Math.max(0, c.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(c).paddingBottom) || 0) - l.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(l).marginBottom) || 0));
    }
    var box = $('.mf-wmap--res .mf-wm-box'), svg = box && box.querySelector('svg'), vb = svg && svg.viewBox && svg.viewBox.baseVal;
    return box && shown(box) && vb && vb.width ? box.clientHeight - box.clientWidth * vb.height / vb.width : 0;
  }
  /* v3.7 · the frame's height the graphic needs, every party in it (library.js measures the code's height with it, in a frame taller than
     that): the frame's height less the room the graphic leaves free in it (Council seats: less the room its rows were spread over too) */
  function need() {
    if (!fill) return 0;
    fitAll();
    var inner = fill.firstElementChild, fs = getComputedStyle(fill), body = g.id === 'seats' ? root.querySelector('.ehx-seats-b') : null;
    var free = fill.clientHeight - parseFloat(fs.paddingTop) - parseFloat(fs.paddingBottom) - (inner ? inner.getBoundingClientRect().height : 0);
    if (body) free += 2 * (parseFloat(body.style.getPropertyValue('--ehx-rp')) || 0) * body.children.length;
    return Math.ceil(document.documentElement.clientHeight - Math.max(0, free) - (g.id === 'wards' ? wardsSpare() : 0));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
