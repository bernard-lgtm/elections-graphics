/* embed-boot.js — runs in the head of graphic.html, before the hub. graphic.html?embed=<graphic> shows one graphic of the Elections Hub
   (the list is in graphics.js) for an area (&area=GP; none for South Africa) or a council (&muni=<key>, &ward=<n>), in a view (&view=).
   It turns the address into the hub's own anchor (#turnout-gp, #jhb-ward-12, #jhb-coalition), so the hub opens straight on the
   graphic; picks the hub build (the light live build, or the preview build for &data=sample|2021); and stops the embed from ever
   scrolling itself or the article around it. */
window.__errs = []; window.addEventListener('error', function (e) { window.__errs.push((e.message || '') + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); }); window.addEventListener('unhandledrejection', function (e) { window.__errs.push('rej ' + (e.reason && e.reason.stack || e.reason)); });
(function () {
  'use strict';
  var h = document.documentElement, GR = window.EHX_GRAPHICS || [], PV = {};
  (window.EHX_PROV || []).forEach(function (p) { if (p[0]) PV[p[0]] = p[1]; });
  var u = new URL(location.href), q = u.searchParams, id = String(q.get('embed') || '').toLowerCase();
  if (id === 'cmp' && !q.get('view')) q.set('view', 'party');
  var g = GR.filter(function (x) { return x.id === id; })[0];
  // v3.16 · a graphic with a page of its own (Since 2021: story.html), opened here: that page, with the same address parameters
  if (g && g.page && g.page !== 'graphic.html') { try { location.replace(g.page + location.search + location.hash); } catch (e) {} return; }
  var data = String(q.get('data') || '').toLowerCase();
  var X = window.EHX = { g: g || null, id: id, data: data, build: data === 'sample' || data === '2021' ? 'preview' : 'live' };
  if (!g) { h.setAttribute('data-embed', 'none'); return; }
  var area = String(q.get('area') || '').toUpperCase();
  if (!PV[area]) area = '';
  if (g.provOnly && !area) area = 'GP';
  var muni = String(q.get('muni') || '').trim() || 'jhb', ward = String(q.get('ward') || '').replace(/\D/g, '');
  if (g.ward && !ward) ward = '1';
  var view = '', v = String(q.get('view') || '').toLowerCase();
  if (v === 'turnout' && id === 'wards') v = 'turn';   // v1 links
  if (g.views) view = g.views.some(function (x) { return x[0] === v; }) ? v : g.views[0][0];
  // v3.12 · South Africa with its provinces in one graphic (Turnout by province): no area, but in a view that opens on one (areaViews: its Explorer)
  if (g.natOnly && !(g.areaViews && g.areaViews.indexOf(view) >= 0)) area = '';
  X.area = area; X.muni = muni; X.ward = ward; X.view = view;
  // Results by ward: the key under the map at every width, as on a phone (the hub's wmCols puts it beside the map from 600px up)
  X.wmStack = id === 'wards';
  h.setAttribute('data-embed', id);
  if (view) h.setAttribute('data-view', view);
  h.classList.add('ehx-on', g.group === 'area' ? 'ehx-nat' : 'ehx-muni');
  // the maps of South Africa and the provinces come in once drawn (embed.js, embed.css): the hub redraws them as the first results come
  // in, and the room for a map changes as the table beside it fills
  if (g.group === 'area') h.classList.add('ehx-hold');
  try { if (window.top === window.self) h.classList.add('ehx-top'); } catch (e) {}
  // the fixed height (the embed code's, the same on desktop and phones): the card fills the frame and the graphic fits the room in it.
  // &fit=0 for the old way, the card as tall as its content
  X.h = (g.hv && g.hv[view]) || g.h || 760;
  // &mode=still (the library's still graphics, the PNG images): no fixed height, the card as tall as everything in it, nothing that
  // needs a pointer, the time of the figures over the count's box (embed.css, embed.js)
  X.still = q.get('mode') === 'still';
  X.fit = !X.still && q.get('fit') !== '0';
  if (X.still) h.classList.add('ehx-still');
  if (X.fit) { h.classList.add('ehx-fit'); h.style.setProperty('--ehx-h', X.h + 'px'); }
  // the preview figures, as the hub's preview bar sets them: the sample count on 5 November (Counting at 60% unless &at= says otherwise)
  if (data === 'sample') { if (!q.get('now')) q.set('now', '2026-11-05'); if (!q.get('at')) q.set('at', '60'); }
  // the hub opens on its anchor; its older links (?muni=, ?tab=) are taken out so they can't win over it
  u.hash = g.group === 'area' ? g.tab + (area ? '-' + area.toLowerCase() : '') : muni.toLowerCase() + (g.ward ? '-ward-' + ward : id === 'coalition' ? '-coalition' : '');
  ['tab'].forEach(function (k) { q.delete(k); });
  try { history.replaceState(null, '', u.toString()); } catch (e) {}
  /* The hub rewrites the address as the reader moves (its anchors) and takes ?muni= and ?ward= out of it, which would leave a council's
     embed without its council on a reload, back/forward or a copied address. Whatever the hub writes, the embed's own parameters stay. */
  var KEEP = ['embed', 'area', 'muni', 'ward', 'view', 'data', 'at', 'dec', 'decl', 'now', 'still', 'mode', 'raf', 'clock'], OWN = {};
  KEEP.forEach(function (k) { if (q.has(k)) OWN[k] = q.get(k); });
  if (g.group === 'muni') { OWN.muni = muni; if (g.ward) OWN.ward = ward; else delete OWN.ward; }
  function keep(url) {
    try {
      var x = new URL(url == null ? location.href : String(url), location.href);
      KEEP.forEach(function (k) { if (OWN[k] != null) x.searchParams.set(k, OWN[k]); });
      return x.toString();
    } catch (e) { return url; }
  }
  ['replaceState', 'pushState'].forEach(function (m) {
    var real = history[m];
    if (!real) return;
    try { history[m] = function (st, t, url) { return real.call(history, st, t, keep(url)); }; } catch (e) {}
  });

  /* An embed never scrolls: not itself (it is as tall as its content) and above all not the article it sits in, which scrollIntoView
     inside a frame can do. A list inside the graphic (the ward dropdown) still scrolls to its item. */
  var noop = function () {};
  try { window.scrollTo = noop; window.scroll = noop; window.scrollBy = noop; } catch (e) {}
  try {
    Element.prototype.scrollIntoView = function () {
      for (var p = this.parentElement; p && p !== document.body && p !== h; p = p.parentElement) {
        var o = getComputedStyle(p).overflowY;
        if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) {
          var r = this.getBoundingClientRect(), pr = p.getBoundingClientRect();
          if (r.top < pr.top) p.scrollTop -= pr.top - r.top; else if (r.bottom > pr.bottom) p.scrollTop += r.bottom - pr.bottom;
          return;
        }
      }
    };
  } catch (e) {}

  /* &still=1 (the library's image frames) and &mode=still: drawn at once, as with reduced motion. &raf=timer (checks in a hidden frame):
     animation frames on a timer. */
  if ((q.get('still') === '1' || X.still) && window.matchMedia) {
    var mm = window.matchMedia.bind(window);
    window.matchMedia = function (s) {
      if (!/prefers-reduced-motion:\s*reduce/.test(String(s))) return mm(s);
      return { matches: true, media: String(s), onchange: null, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: function () { return false; } };
    };
  }
  if (q.get('raf') === 'timer') {
    window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
    window.cancelAnimationFrame = function (t) { clearTimeout(t); };
  }
  /* &clock=worker (checks run in a hidden tab, where the browser lets a page's timers run only once a minute): the page's timers are kept
     by a worker, whose timers run as set. */
  if (q.get('clock') === 'worker' && window.Worker && window.Blob && window.URL) {
    try {
      var CW = new Worker(URL.createObjectURL(new Blob(['var T={};onmessage=function(e){var d=e.data;if(d.k)T[d.id]=setTimeout(function(){delete T[d.id];postMessage(d.id)},d.ms);else{clearTimeout(T[d.id]);delete T[d.id]}}'], { type: 'text/javascript' }))), CB = {}, CN = 0, IV = {}, IN = 0;
      var cset = function (fn, ms, args, iv) { var id = ++CN; CB[id] = { fn: fn, ms: ms, args: args, iv: iv }; CW.postMessage({ k: 1, id: id, ms: ms }); return id; };
      CW.onmessage = function (e) { var c = CB[e.data]; if (!c) return; delete CB[e.data]; if (c.iv && c.iv.on) c.iv.t = cset(c.fn, c.ms, c.args, c.iv); c.fn.apply(null, c.args); };
      window.setTimeout = function (fn, ms) { return cset(typeof fn === 'function' ? fn : noop, Math.max(0, +ms || 0), [].slice.call(arguments, 2), null); };
      window.clearTimeout = function (id) { if (CB[id]) { delete CB[id]; CW.postMessage({ k: 0, id: id }); } };
      window.setInterval = function (fn, ms) { var iv = { on: true, t: 0 }; iv.t = cset(typeof fn === 'function' ? fn : noop, Math.max(1, +ms || 1), [].slice.call(arguments, 2), iv); IV[++IN] = iv; return -IN; };
      window.clearInterval = function (id) { var iv = IV[-id]; if (!iv) return; iv.on = false; window.clearTimeout(iv.t); delete IV[-id]; };
    } catch (e) {}
  }

  /* The hub starts its maps and the seats' animation when they come on screen (IntersectionObserver). An embed is on screen when it is
     loaded (the frame loads lazily), and the image export has to find them drawn: so every observed element reports in view at once,
     then its real visibility from then on (the ward map still pauses when it is scrolled away). */
  var RealIO = window.IntersectionObserver;
  if (RealIO) {
    var Shim = function (cb, opts) {
      // dead: disconnected; watched: observed; pending: observed, its first (in view) report not made yet. Real reports wait for it.
      var self = this, dead = false, watched = new Set(), pending = new Set();
      var real = new RealIO(function (es) {
        if (dead) return;
        es = es.filter(function (e) { return watched.has(e.target) && !pending.has(e.target); });
        if (es.length) cb(es, self);
      }, opts);
      this.observe = function (el) {
        dead = false; watched.add(el); pending.add(el); real.observe(el);
        setTimeout(function () {
          if (!pending.has(el)) return;
          pending.delete(el);
          if (dead || !watched.has(el)) return;
          var r = el.getBoundingClientRect();
          cb([{ target: el, isIntersecting: true, intersectionRatio: 1, boundingClientRect: r, intersectionRect: r, rootBounds: null, time: performance.now() }], self);
        }, 0);
      };
      this.unobserve = function (el) { watched.delete(el); pending.delete(el); real.unobserve(el); };
      this.disconnect = function () { dead = true; watched.clear(); pending.clear(); real.disconnect(); };
      this.takeRecords = function () { return []; };
      this.root = null; this.rootMargin = (opts && opts.rootMargin) || '0px'; this.thresholds = [].concat((opts && opts.threshold) || 0);
    };
    try { window.IntersectionObserver = Shim; } catch (e) {}
  }
})();
