/* story.js — Since 2021 (library v3.16), story.html: embed=story, the story (its frames one after another: a timeline over them, each
   frame's bar filling as it plays, a click on one opens it; Back, Pause and Next under them; swipe and the arrow keys too), or embed=frame
   with &view=<frame>, one frame on its own. &frames=a,b,c: the story's frames (EHX_STORY's order; the frames with def: false only when
   named). The story plays by itself while it is at least half on screen and its tab is shown (not with reduced motion), each frame for
   its time (dur), and stops on the last, where Next starts it again. The card is exactly as tall as the frame (the embed code's height,
   graphics.js); each frame's figure takes the room under its title and is drawn smaller where that is short of it. &mode=still: one frame
   as tall as everything in it, for the library's images (export.js); &fit=0: as tall as its content; both report their height
   (postMessage { ehx: 'height', h }). &thumb=1: the figure alone, for the menu's snapshots. window.EH_EMBED: ready, state, asAt, title. */
(function () {
  'use strict';
  var C = window.EHX_CONFIG || {}, GR = window.EHX_GRAPHICS || [], ST = window.EHX_STORY || [], X = window.EHX_SX, FR = window.EHX_SXF;
  var h = document.documentElement, q = new URL(location.href).searchParams;
  var id = String(q.get('embed') || 'story').toLowerCase(), g = GR.filter(function (x) { return x.id === id && x.group === 'story'; })[0] || GR.filter(function (x) { return x.id === 'story'; })[0];
  var story = g.id === 'story', still = q.get('mode') === 'still', thumb = q.get('thumb') === '1', fit = !still && !thumb && q.get('fit') !== '0';
  var top = false; try { top = window.top === window.self; } catch (e) {}
  var reduced = still || thumb || q.get('still') === '1' || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  // the frames: the story's (picked, or every frame but those with def: false), or the one in view=
  var want = String(q.get('frames') || '').toLowerCase().split(',').filter(Boolean), view = String(q.get('view') || '').toLowerCase();
  var LIST = story ? ST.filter(function (f) { return want.length ? want.indexOf(f.id) >= 0 : f.def !== false; }) : ST.filter(function (f) { return f.id === view; });
  if (!LIST.length) LIST = story ? ST.filter(function (f) { return f.def !== false; }) : [ST[0]];
  if (still && story) LIST = LIST.slice(0, 1);
  // &thumbs=1: every frame, each in a 668 × 501 tile, figure alone (qa/story-thumbs.html draws the menu's snapshots from them)
  var thumbs = q.get('thumbs') === '1';
  if (thumbs) { LIST = ST.slice(); thumb = true; fit = false; reduced = true; h.classList.add('sx-thumbs'); }
  var H = (!story && g.hv && g.hv[LIST[0].id]) || g.h || 650;
  h.classList.add('sx-on', story ? 'sx-story' : 'sx-one');
  h.setAttribute('data-embed', g.id); if (!story) h.setAttribute('data-view', LIST[0].id);
  if (fit) { h.classList.add('sx-fit'); h.style.setProperty('--sx-h', H + 'px'); }
  if (top) h.classList.add('sx-top');
  if (still) h.classList.add('sx-still', 'ehx-still');
  if (thumb) h.classList.add('sx-thumb');
  if (!reduced) h.classList.add('sx-anim');
  // &qw=<px>: the page narrowed to that width, for checks at a phone's width in a browser tab (the layout follows the page's width)
  var QW = +q.get('qw') || 0;
  if (QW >= 280) { h.classList.add('sx-qw'); document.addEventListener('DOMContentLoaded', function () { document.body.style.maxWidth = QW + 'px'; }); if (document.body) document.body.style.maxWidth = QW + 'px'; }
  function esc(s) { return FR.esc(s); }
  function $(s, el) { return (el || document).querySelector(s); }

  /* ---- the links: the hub's Change since 2021 tab (the results declared page once the switch is on), as every graphic's ---- */
  function clean(u) { return String(u || '').replace(/#.*$/, ''); }
  var HUB = clean(C.hubUrl || 'https://www.dailymaverick.co.za/local-elections-results-2026/'), HUB_D = clean(C.declaredUrl);
  function hubBase() { return C.declared && HUB_D ? HUB_D : HUB; }
  function hubLink() { return hubBase() + '#change-since-2021'; }
  function hubShort() { return hubBase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, ''); }
  var MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function dayTxt(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); if (!m) return ''; var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }

  /* ---- the card ---- */
  var root = document.getElementById('dm-eh'), stage, tl, ctl, cnt, nextB, ppB, prevB, frames = [], drawn = false, failed = false, D = null;
  var ICON = {
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5"></path></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"></path></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9"></path></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path class="fill" d="M5 3.2v9.6L12.6 8z"></path></svg>',
    again: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5"></path><path d="M3.3 2.6v2.6h2.6"></path></svg>'
  };
  function shortOf(f) { return f.short || f.label; }
  function build() {
    var html = '<h1 class="sx-vh">' + esc(g.name + ' \u00b7 Daily Maverick') + '</h1>';
    if (story && LIST.length > 1) html += '<div class="sx-tl" style="--n:' + LIST.length + '">' + LIST.map(function (f, i) {
      return '<button type="button" class="sx-seg" data-i="' + i + '" aria-label="' + esc('Frame ' + (i + 1) + ' of ' + LIST.length + ': ' + f.label) + '"><i><b></b></i><span>' + esc(shortOf(f)) + '</span></button>';
    }).join('') + '</div>';
    html += '<div class="sx-stage"><p class="sx-wait" role="status">Loading the results\u2026</p></div>';
    if (story && LIST.length > 1) html += '<div class="sx-ctl"><button type="button" class="sx-b sx-prev" aria-label="Back">' + ICON.prev + '</button><button type="button" class="sx-b sx-pp" aria-label="Pause">' + ICON.pause + '</button><span class="sx-ct" aria-hidden="true"></span><button type="button" class="sx-next"><span class="l">Next</span>' + ICON.next + '</button></div>';
    html += '<div class="ehx-foot sx-foot"><span class="lnk">' + (still ? '<span class="src">Source: Electoral Commission of South Africa \u00b7 <span class="url">' + esc(hubShort()) + '</span></span>' : '<a class="more" href="' + esc(hubLink()) + '" target="_blank" rel="noopener">All results on the Elections Hub</a>') + '</span>' +
      '<a class="logo" href="https://www.dailymaverick.co.za" target="_blank" rel="noopener" aria-label="Daily Maverick"><img src="assets/DM_Masthead_2026.svg" alt="Daily Maverick" width="222" height="28"></a></div>';
    root.innerHTML = html;
    stage = $('.sx-stage', root); tl = $('.sx-tl', root); ctl = $('.sx-ctl', root);
    if (ctl) { cnt = $('.sx-ct', ctl); nextB = $('.sx-next', ctl); ppB = $('.sx-pp', ctl); prevB = $('.sx-prev', ctl); }
  }

  /* ---- the figures, then the frames ---- */
  var readyFns = [];
  function load() {
    failed = false;
    var need = LIST.some(FR.needs);
    (need ? X.councils() : X.nat().then(function (r) { return { n0: r[0], n1: r[1] }; })).then(function (d) { D = d; draw(); }, function () {
      failed = true;
      stage.innerHTML = '<p class="sx-wait is-err" role="status">The results could not be read. Trying again\u2026</p>';
      setTimeout(load, 20000);
    });
  }
  function draw() {
    var out = [];
    LIST.forEach(function (f) { var r = FR.draw(f, D); if (r) out.push({ f: f, r: r }); });
    if (!out.length) { stage.innerHTML = '<p class="sx-wait" role="status">There are no figures for this frame yet.</p>'; drawn = true; done(); return; }
    if (out.length !== LIST.length) { LIST = out.map(function (o) { return o.f; }); if (tl) { tl.style.setProperty('--n', LIST.length); tl.innerHTML = LIST.map(function (f, i) { return '<button type="button" class="sx-seg" data-i="' + i + '" aria-label="' + esc('Frame ' + (i + 1) + ' of ' + LIST.length + ': ' + f.label) + '"><i><b></b></i><span>' + esc(shortOf(f)) + '</span></button>'; }).join(''); } }
    var part = !C.declared && !(D.n1 && D.n1.complete) ? ' The ' + X.Y1 + ' figures are the count so far.' : '';
    stage.innerHTML = out.map(function (o, i) {
      var r = o.r;
      return '<section class="sx-f" data-f="' + o.f.id + '" data-i="' + i + '"' + (r.style ? ' style="' + r.style + '"' : '') + (story ? ' aria-roledescription="frame" aria-label="' + esc((i + 1) + ' of ' + out.length) + '"' : '') + '>' +
        '<header class="sx-hd"><p class="sx-k">' + esc(r.kicker) + '</p><h2 class="sx-t">' + esc(r.title) + '</h2></header><div class="sx-bd"><div class="sx-in">' + r.body + '</div></div>' +
        (r.note || part ? '<p class="sx-note">' + esc(((r.note || '') + part).trim()) + '</p>' : '') + '</section>';
    }).join('');
    frames = [].slice.call(stage.querySelectorAll('.sx-f'));
    // the faces the frames use, loaded before they are measured (fonts.ready alone can come before a face is asked for); measured again
    // whenever a face comes in later
    var faces = ['700 31px "DM Custom"', '400 14px Geist', '600 14px Geist', '700 14px Geist', '700 11px Archivo'];
    var fl = document.fonts && document.fonts.load ? Promise.all(faces.map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
    Promise.race([fl, new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
      layout();
      show(P.i < frames.length ? P.i : 0, 1, false);
      drawn = true;
      done();
    });
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); });
    // and again a moment on, for whatever came in late (a face, the masthead)
    [600, 1800, 4000].forEach(function (ms) { setTimeout(layout, ms); });
  }
  function done() { var f = readyFns; readyFns = []; f.forEach(function (fn) { fn(true); }); report(); }

  /* ---- the room: the councils' squares as large as the width allows (in as few rows as keep them 7px or more, 10px from 450px),
     then each frame's figure drawn smaller where the room under its title is short of it (never under 72%) ---- */
  function waffles(el) {
    [].forEach.call(el.querySelectorAll('.sx-wf'), function (wf) {
      var n = wf.children.length, W = wf.clientWidth || wf.parentNode.clientWidth - 48, gap = 2, min = W > 450 ? 10 : 7, best = null;
      for (var r = 3; r <= 16; r++) { var cols = Math.ceil(n / r), c = Math.floor((W + gap) / cols) - gap; if (c >= min) { best = { r: r, c: Math.min(c, 14) }; break; } }
      if (!best) { var rr = 16, cc = Math.max(4, Math.floor((W + gap) / Math.ceil(n / rr)) - gap); best = { r: rr, c: cc }; }
      wf.style.setProperty('--r', best.r); wf.style.setProperty('--c', best.c + 'px'); wf.style.setProperty('--g', gap + 'px');
    });
  }
  function fitOne(el) {
    var bd = $('.sx-bd', el), inn = $('.sx-in', el);
    if (!bd || !inn) return;
    inn.style.transform = ''; inn.style.width = ''; inn.style.minHeight = '0px';   // its own height, measured without the room's
    waffles(el);
    [].forEach.call(el.querySelectorAll('.sx-db,.sx-mt'), function (t) { t.style.removeProperty('--rh'); });
    if (!fit) { inn.style.minHeight = ''; return; }
    var avail = bd.clientHeight, need = inn.offsetHeight;
    if (need < avail - 4) {
      var tabs = [].slice.call(el.querySelectorAll('.sx-db,.sx-mt')), n = 0;
      tabs.forEach(function (t) { n += t.querySelectorAll('.sx-dr,.sx-mr').length; });
      if (n) {
        var add = Math.min((avail - need - 4) / n, 10);
        tabs.forEach(function (t) { var r = t.querySelector('.sx-dr,.sx-mr'); if (r) t.style.setProperty('--rh', Math.floor(r.getBoundingClientRect().height + add) + 'px'); });
        need = inn.offsetHeight;
      }
    }
    if (need > avail + 1 && avail > 0) {
      var k = Math.max(0.72, avail / need);
      inn.style.width = (100 / k).toFixed(3) + '%'; waffles(el);
      need = inn.offsetHeight; k = Math.max(0.72, Math.min(1, avail / need));
      inn.style.transform = 'scale(' + k.toFixed(4) + ')'; inn.style.minHeight = (avail / k).toFixed(1) + 'px';
    } else inn.style.minHeight = '';
  }
  function layout() { frames.forEach(fitOne); report(); }
  var rz = 0;
  window.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); });

  /* ---- the story: the frame on show, the timeline and the buttons ---- */
  var P = { i: 0, playing: !reduced && q.get('auto') !== '0', el: 0, last: 0, raf: 0, seen: false, ended: false };
  function durOf(i) { return (LIST[i] && LIST[i].dur) || 9000; }
  function show(i, dir, user) {
    if (!frames.length) return;
    i = Math.max(0, Math.min(frames.length - 1, i));
    var was = P.i; P.i = i; P.el = 0; P.ended = false;
    frames.forEach(function (el, k) {
      var on = k === i;
      if (on && !el.classList.contains('is-on')) { el.style.setProperty('--dx', (dir < 0 ? -18 : 18) + 'px'); el.classList.remove('is-in'); }
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (!on) el.classList.remove('is-in');
      if ('inert' in el) el.inert = !on;
    });
    var cur = frames[i];
    // drawn in: its first state laid out (read back at once: a hidden tab or frame runs no animation frames), then its last
    if (P.seen || user || reduced) { void cur.offsetWidth; cur.classList.add('is-in'); }
    if (stage) stage.setAttribute('aria-live', user ? 'polite' : 'off');
    paint();
    if (was !== i || user) report();
  }
  function paint() {
    if (!tl) return;
    [].forEach.call(tl.children, function (b, k) {
      b.classList.toggle('is-on', k === P.i); b.classList.toggle('is-done', k < P.i || (P.ended && k === P.i));
      if (k === P.i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      var bar = b.querySelector('b'); bar.style.transform = k < P.i || (P.ended && k === P.i) ? 'scaleX(1)' : k > P.i ? 'scaleX(0)' : 'scaleX(' + Math.min(1, P.el / durOf(P.i)).toFixed(4) + ')';
    });
    if (cnt) cnt.textContent = (P.i + 1) + ' of ' + frames.length;
    if (nextB) {
      var last = P.i >= frames.length - 1;
      nextB.querySelector('.l').textContent = last ? 'Start again' : 'Next: ' + shortOf(LIST[P.i + 1]);
      nextB.setAttribute('aria-label', last ? 'Start again' : 'Next: ' + LIST[P.i + 1].label);
      nextB.querySelector('svg').outerHTML = last ? ICON.again : ICON.next;
    }
    if (ppB) { var play = !P.playing || P.ended; ppB.innerHTML = P.ended ? ICON.again : play ? ICON.play : ICON.pause; ppB.setAttribute('aria-label', P.ended ? 'Play again' : play ? 'Play' : 'Pause'); }
    if (prevB) prevB.disabled = P.i === 0;
  }
  function fill() { var b = tl && tl.children[P.i] && tl.children[P.i].querySelector('b'); if (b) b.style.transform = 'scaleX(' + Math.min(1, P.el / durOf(P.i)).toFixed(4) + ')'; }
  function running() { return story && frames.length > 1 && P.playing && !P.ended && P.seen && !document.hidden; }
  function loop(t) {
    P.raf = 0;
    if (!running()) { P.last = 0; return; }
    if (P.last) P.el += Math.min(250, t - P.last);
    P.last = t;
    if (P.el >= durOf(P.i)) {
      if (P.i < frames.length - 1) show(P.i + 1, 1, false);
      else { P.el = durOf(P.i); P.ended = true; paint(); return; }
    } else fill();
    P.raf = requestAnimationFrame(loop);
  }
  function kick() { if (!P.raf && running()) { P.last = 0; P.raf = requestAnimationFrame(loop); } }
  function go(i, dir) { if (i >= frames.length) i = 0; show(i, dir, true); kick(); }
  function toggle() {
    if (P.ended) { P.playing = true; go(0, 1); return; }
    P.playing = !P.playing; paint(); kick();
  }
  root.addEventListener('click', function (e) {
    var s = e.target.closest('.sx-seg'); if (s) { var j = +s.getAttribute('data-i'); go(j, j < P.i ? -1 : 1); return; }
    if (e.target.closest('.sx-next')) { go(P.i + 1, 1); return; }
    if (e.target.closest('.sx-prev')) { go(P.i - 1, -1); return; }
    if (e.target.closest('.sx-pp')) toggle();
  });
  document.addEventListener('keydown', function (e) {
    if (!story || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); if (P.i < frames.length - 1) go(P.i + 1, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); if (P.i > 0) go(P.i - 1, -1); }
  });
  // a swipe across the frame: the next or the one before
  var sw = null;
  root.addEventListener('pointerdown', function (e) { if (story && e.pointerType !== 'mouse' && e.target.closest('.sx-stage')) sw = { x: e.clientX, y: e.clientY }; });
  root.addEventListener('pointerup', function (e) {
    if (!sw) return; var dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0 && P.i < frames.length - 1) go(P.i + 1, 1); else if (dx > 0 && P.i > 0) go(P.i - 1, -1); }
  });
  root.addEventListener('pointercancel', function () { sw = null; });
  // on screen: at least half the card in the window (a frame on its own: a third), the tab shown. The frame on show draws itself in then
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      // at least half of it, or (a card taller than the window) most of the window
      es.forEach(function (x) { var rb = x.rootBounds; P.seen = x.isIntersecting && (x.intersectionRatio >= (story ? 0.5 : 0.33) || !!(rb && x.intersectionRect.height >= rb.height * 0.6)); });
      if (P.seen && frames[P.i] && !frames[P.i].classList.contains('is-in')) { void frames[P.i].offsetWidth; frames[P.i].classList.add('is-in'); }
      kick();
    }, { threshold: [0, 0.1, 0.2, 0.33, 0.4, 0.5, 0.6, 0.75, 1] }).observe(root);
  } else P.seen = true;
  document.addEventListener('visibilitychange', kick);

  /* ---- the height, where the card is as tall as its content (still, fit=0) ---- */
  var lastH = 0;
  function report() {
    if (fit) return;
    var hh = Math.ceil(root.getBoundingClientRect().height);
    if (hh && hh !== lastH) { lastH = hh; try { parent.postMessage({ ehx: 'height', h: hh }, '*'); } catch (e) {} }
  }
  if (window.ResizeObserver) new ResizeObserver(function () { if (!fit) report(); }).observe(root);

  window.EH_EMBED = {
    ready: function (ms) { return drawn ? Promise.resolve(true) : new Promise(function (ok) { readyFns.push(ok); setTimeout(function () { ok(false); }, ms || 20000); }); },
    state: function () { return { k: failed ? 'error' : !drawn ? 'loading' : C.declared ? 'final' : 'counting' }; },
    title: function () { var f = frames[P.i]; return f ? $('.sx-t', f).textContent : g.name; },
    asAt: function () { return C.declared ? { t: Date.now(), text: 'Results declared, ' + dayTxt(C.declared), tag: 'declared-' + String(C.declared).replace(/-/g, '') } : { t: (D && D.n1 && D.n1.at) || Date.now(), text: '' }; },
    go: function (i) { go(i, 1); }, frames: function () { return LIST.map(function (f) { return f.id; }); }
  };
  build();
  load();
})();
