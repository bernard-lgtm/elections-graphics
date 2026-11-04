/* embed-fit.js — runs after embed.js, for the fixed-height embed (html.ehx-fit): the card is as tall as the frame (embed-fit.css), and this
   fits the graphic to the room between the status and the credit. Maps: their width set from the room's height, so they are as big as
   it allows (the councils maps, the hung councils map, Change since 2021's maps). Lists: the rows that fit, then a link to the rest on
   the hub (results by council, the hung councils list, votes by party, a ward's candidates). Change since 2021 on a phone: one map,
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

  /* ---- lists: the rows that fit; the rest cut, with a link to them on the hub ---- */
  function moreLink(scope) {
    var a = scope.querySelector(':scope > .ehx-more');
    if (!a) { a = document.createElement('a'); a.className = 'ehx-more'; a.target = '_blank'; a.rel = 'noopener'; a.hidden = true; a.innerHTML = '<span class="t"></span><span class="arr" aria-hidden="true">&rsaquo;</span>'; scope.appendChild(a); }
    return a;
  }
  function cut(scope, sel, noun, groups) {
    if (!shown(scope)) return;
    $$('[data-ehx-cut]', scope).forEach(function (el) { el.removeAttribute('data-ehx-cut'); });
    var a = moreLink(scope), lim = limit(), rows = $$(sel, scope).filter(shown), first = -1, i, j;
    for (i = 0; i < rows.length; i++) if (rows[i].getBoundingClientRect().bottom > lim + 0.5) { first = i; break; }
    if (first < 0) { if (!a.hidden) a.hidden = true; return; }
    j = first;
    while (j > 1 && rows[j - 1].getBoundingClientRect().bottom > lim - 36) j--;
    apply(j);
    // the link itself has to fit under the rows left: a row more goes until it does
    for (i = 0; i < 6 && j > 1 && a.getBoundingClientRect().bottom > lim + 0.5; i++) apply(--j);
    function apply(j) {
      rows.forEach(function (r, k) { if (k >= j) r.setAttribute('data-ehx-cut', '1'); else if (r.hasAttribute('data-ehx-cut')) r.removeAttribute('data-ehx-cut'); });
      (groups ? groups(scope) : []).forEach(function (grp) {
        var alive = grp.rows.some(function (r) { return !r.hasAttribute('data-ehx-cut'); });
        grp.heads.forEach(function (h) { if (!h) return; if (!alive) h.setAttribute('data-ehx-cut', '1'); else if (h.hasAttribute('data-ehx-cut')) h.removeAttribute('data-ehx-cut'); });
      });
      var n = rows.slice(j).filter(function (r) { return r.tagName === 'TR' || r.tagName === 'LI' || r.classList.contains('wp-cand'); }).length || rows.length - j;   // the rows proper, not a note cut with them
      var t = n + ' more ' + noun(n) + ' on the Elections Hub', hub = window.EH_EMBED && EH_EMBED.hub ? EH_EMBED.hub() : '';
      var span = a.firstChild;
      if (span.textContent !== t) span.textContent = t;
      if (hub && a.getAttribute('href') !== hub) a.setAttribute('href', hub);
      if (a.hidden) a.hidden = false;
    }
  }
  var N = { council: function (n) { return n === 1 ? 'council' : 'councils'; }, hung: function (n) { return n === 1 ? 'hung council' : 'hung councils'; }, party: function (n) { return n === 1 ? 'party' : 'parties'; }, cand: function (n) { return n === 1 ? 'candidate' : 'candidates'; }, prov: function (n) { return n === 1 ? 'province' : 'provinces'; } };
  function areaNow() { return (window.EH_AREA && EH_AREA.get && EH_AREA.get()) || ''; }
  // the councils table: a heading and its table go when none of its rows stay
  function tblGroups(scope) {
    return $$(':scope > .res-h3', scope).map(function (h) { var tw = h.nextElementSibling; return { heads: [h, tw && tw.classList.contains('res-tw') ? tw : null], rows: tw ? $$('tbody tr', tw) : [] }; });
  }
  function hungGroups(scope) { return $$('.eh-hung-pv', scope).map(function (pv) { return { heads: [pv], rows: $$('.eh-hung-list > li', pv) }; }); }
  function fitLists() {
    var el;
    // the hub's Show all parties (hidden here) pressed for it: every row in, then the rows that fit
    if (g.id === 'votes' || g.id === 'ward') $$('.mf-res-more[aria-expanded="false"]').forEach(function (b) { b.click(); });
    if (g.id === 'table' && (el = $('#res-tbl'))) cut(el, 'table.res-table tbody tr', N.council, tblGroups);
    if (g.id === 'hung' && (el = $('.hm-rest'))) cut(el, '.eh-hung-list > li', N.hung, hungGroups);
    if (g.id === 'support' && (el = $('.res-stand'))) cut(el, '.mf-res-table tbody tr:not(.is-oth)', N.party);
    if (g.id === 'votes' && (el = $('.mf-res-tbl'))) cut(el, '.mf-res-table tbody tr:not(.is-oth), p.mf-res-src', N.party);
    if (g.id === 'ward' && (el = $('#mf-wardpanel'))) cut(el, '.wp-cands .mf-res-table tbody tr, .wp-cand', N.cand);
    // Change since 2021's tables: party support (with its note), and the councils (the provinces, over the whole country)
    if (g.id === 'cmp' && (el = $('#eh-cmp-body'))) {
      if (X.view === 'support') cut(el, '.cmp-share tbody tr, :scope > p.res-note:not(.cmp-note)', N.party);
      else if (X.view === 'councils') cut(el, '.cmp-table:not(.cmp-share) tbody tr', areaNow() ? N.council : N.prov);
    }
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

  /* ---- the Coalition builder: every party under the half circle stays in; where they and the half circle at its own width need more room
     than there is (a council with many parties, a phone), the half circle is drawn narrower, so lower, by what it takes. Worked out from
     the half circle at its own width, so the board's width is only written when it changes. ---- */
  function fitCoal() {
    var b = $('.mf-res-seats .mf-res-board'), stg = b && b.querySelector('.ehh-stage'), fig = stg && stg.parentElement, inner = fill.firstElementChild;
    if (!stg || !shown(stg) || !inner) return;
    var r = stg.getBoundingClientRect(), k = r.width ? r.height / r.width : 0;
    if (!k) return;
    var m = /min\(100%,\s*([\d.]+)px\)/.exec(fig.getAttribute('style') || ''), own = Math.min(b.parentElement.clientWidth - 12, m ? +m[1] : 600);
    var over = inner.getBoundingClientRect().height - r.height + own * k - fill.clientHeight;
    var val = over > 0.5 ? Math.max(220, Math.floor(own - over / k)) + 12 + 'px' : '';   // 12: the board's padding at its sides
    if (b.style.maxWidth !== val) b.style.maxWidth = val;
  }

  function fitAll() {
    if (!fill) return;
    if (g.id === 'cmp') cmpSwitch();
    if (g.id === 'coalition') fitCoal();
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
    // the hub redraws a map by writing it afresh, without the width set here: fitted at once, before the page is painted (a mutation
    // observer runs before the next frame), so the new drawing never shows at the full width first; the rest a moment later
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(t.closest && t.closest('.ehx-headrow, .ehx-coal, .ehx-foot, .ehx-more, .ehx-tog'))) { if (g.id === 'cmp') cmpSwitch(); fitMaps(); soon(); return; } }
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
    if (window.ResizeObserver) { var ro = new ResizeObserver(soon); ro.observe(fill); ro.observe(document.documentElement); }
    window.addEventListener('resize', soon);
    window.addEventListener('load', soon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
    setInterval(soon, 2500);
    fitAll();
  }
  window.EH_FIT = { fit: fitAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
