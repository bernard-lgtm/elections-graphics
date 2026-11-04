/* export.js — a PNG of the embed exactly as it stands: the card (#dm-eh) with its title, the count's progress, the graphic and the credit,
   the figures as at the moment it is taken. Made in the browser with no libraries: the card is copied with every computed style written
   inline (a <defs> block keeps its own markup, so the maps' shapes take their colours from the <use> that draws them, as on screen), the
   images and fonts embedded as data, drawn into an SVG <foreignObject> and rasterised on a canvas.
   window.EH_EXPORT.snap({ scale: 1|2, kind: 'png'|'square'|'wide' }) -> Promise<Blob>. png: the card at its size; square (1080 x 1080)
   and wide (1920 x 1080): the card, as it is, centred on the library's grey. */
(function () {
  'use strict';
  var GOOGLE = 'https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400&family=Geist:wght@100..900&family=Barlow:wght@400;600&family=Archivo:wdth,wght@87.5,700;100,500&display=swap';
  // DM Custom: the copy beside this file first (what the page itself uses), then the Daily Maverick server's
  var LOCAL = [{ family: 'DM Custom', style: 'normal', weight: '700', url: 'fonts/DMCustomMar2026-V2-Bold.woff2', alt: 'https://www.dailymaverick.co.za/fonts/dmcustom/DMCustomMar2026-V2-Bold.woff2' }];
  var fontsP = null, fontsInfo = { faces: 0, bytes: 0, failed: [], googleOk: null }, DEF = {}, defDoc = null, pn = 0, pcss = [], IMG = {};
  var SKIP = { d: 1, cursor: 1, 'pointer-events': 1, 'user-select': 1, '-webkit-user-select': 1, 'will-change': 1, 'content-visibility': 1, 'contain-intrinsic-size': 1, 'contain-intrinsic-width': 1, 'contain-intrinsic-height': 1, 'contain-intrinsic-block-size': 1, 'contain-intrinsic-inline-size': 1, 'view-transition-name': 1 };
  'transition transition-property transition-duration transition-delay transition-timing-function transition-behavior animation animation-name animation-duration animation-delay animation-iteration-count animation-timing-function animation-direction animation-fill-mode animation-play-state animation-composition animation-timeline animation-range-start animation-range-end'.split(' ').forEach(function (k) { SKIP[k] = 1; });
  var ALWAYS = {};   // inherited properties: written on every element, so nothing falls back to a different parent in the copy
  'color font-family font-size font-weight font-style font-stretch font-variant font-variant-numeric font-feature-settings font-variation-settings font-kerning font-optical-sizing line-height letter-spacing word-spacing text-align text-transform text-indent text-decoration-line text-decoration-color text-decoration-style text-underline-offset white-space visibility direction text-rendering -webkit-font-smoothing fill fill-opacity fill-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset stroke-miterlimit paint-order list-style-type border-collapse border-spacing tab-size overflow-wrap word-break hyphens text-wrap text-wrap-mode text-wrap-style caption-side empty-cells quotes'.split(' ').forEach(function (k) { ALWAYS[k] = 1; });
  var RAW = { defs: 1, symbol: 1, clipPath: 1, mask: 1, pattern: 1, linearGradient: 1, radialGradient: 1, filter: 1, marker: 1 };
  // the box's size and origins are written on every element (an empty element's default height is 0px too, so a box of 0px set by a rule
  // would otherwise grow back to its content)
  var GEOM = { width: 1, height: 1, 'inline-size': 1, 'block-size': 1, 'transform-origin': 1, 'perspective-origin': 1 };
  // border and outline widths too: with no style a width computes to 0px, as in the default element, but a rule's "solid, 0px" left
  // unwritten would come back as the initial medium (3px)
  var WID = /-width$/;
  var DROP = { SCRIPT: 1, STYLE: 1, LINK: 1, NOSCRIPT: 1, IFRAME: 1, VIDEO: 1, AUDIO: 1, TEMPLATE: 1 };
  function toData(b) { return new Promise(function (ok, no) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = no; r.readAsDataURL(b); }); }
  // a file as a data URL. Another site's file (Google's fonts) is asked for without credentials, which its CORS header allows; this site's
  // own (the DM Custom font, the masthead) with them, as the page itself gets them (a host that needs a session answers 401 without).
  function sameOrigin(url) { try { return new URL(url, location.href).origin === location.origin; } catch (e) { return true; } }
  function fetchData(url, type) {
    return fetch(url, { credentials: sameOrigin(url) ? 'same-origin' : 'omit' }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      var ct = (r.headers.get('content-type') || '').toLowerCase();
      if (type && /text\/html/.test(ct)) throw new Error('not a ' + type + ' (' + ct + ')');   // a sign-in or error page in a file's place
      return r.blob();
    }).then(toData);
  }
  function fonts() {
    if (fontsP) return fontsP;
    var info = { faces: 0, bytes: 0, failed: [], googleOk: null };
    var p = fetch(GOOGLE, { credentials: 'omit' }).then(function (r) { info.googleOk = r.ok; return r.ok ? r.text() : ''; }, function () { info.googleOk = false; return ''; }).then(function (txt) {
      var faces = [], re = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g, m;
      while ((m = re.exec(txt))) {
        if (m[1] !== 'latin') continue;
        var b = m[2], gv = function (k) { var x = b.match(new RegExp(k + ':\\s*([^;]+);')); return x ? x[1].trim() : ''; }, u = (b.match(/url\(([^)]+)\)/) || [])[1];
        if (u) faces.push({ family: gv('font-family').replace(/['"]/g, ''), style: gv('font-style') || 'normal', weight: gv('font-weight') || '400', stretch: gv('font-stretch'), url: u.replace(/['"]/g, '') });
      }
      return Promise.all(faces.concat(LOCAL).map(function (f) {
        var got = fetchData(f.url, 'font'); if (f.alt) got = got.catch(function () { return fetchData(f.alt, 'font'); });
        return got.then(function (d) { info.faces++; info.bytes += d.length; return '@font-face{font-family:"' + f.family + '";font-style:' + f.style + ';font-weight:' + f.weight + ';' + (f.stretch ? 'font-stretch:' + f.stretch + ';' : '') + 'src:url("' + d + '") format("woff2")}'; }, function () { info.failed.push(f.family + (f.weight !== '400' && f.weight !== '100 900' ? ' ' + f.weight : '') + (f.style !== 'normal' ? ' ' + f.style : '')); return ''; });
      })).then(function (a) { fontsInfo = info; return a.join('\n'); });
    });
    // a failed read (a network blip, a blocked request) is not kept: the next image tries again
    fontsP = p;
    p.then(function () { if (!info.googleOk || info.failed.length) fontsP = null; }, function () { fontsP = null; });
    return p;
  }
  // what the last image had: for the library's message under the button
  function fontsStatus() {
    var i = fontsInfo, out = { ok: !!(i.googleOk && !i.failed.length), faces: i.faces, kb: Math.round(i.bytes * 0.75 / 1024), failed: i.failed.slice(), google: i.googleOk };
    out.text = out.ok ? 'Fonts embedded (' + out.faces + ' faces).' : i.googleOk === false ? 'Google Fonts could not be read, so the image falls back to system fonts: a blocker or the network may be in the way.' : 'Some fonts could not be embedded (' + out.failed.join(', ') + '), so the image falls back to system fonts there.';
    return out;
  }
  // the images in the card as data (same-origin ones always; others if their server allows it), before the copy is made; one that cannot
  // be read is at least waited for, so it can be drawn from the page
  function images(root) {
    return Promise.all([].map.call(root.querySelectorAll('img'), function (im) {
      var s = im.currentSrc || im.src;
      if (!s || /^data:/.test(s) || IMG[s]) return null;
      return fetchData(s, 'image').then(function (d) { IMG[s] = d; }, function () { return im.decode ? im.decode().catch(function () {}) : null; });
    }));
  }
  function defaults(src) {
    var ns = src.namespaceURI, tag = src.localName, key = ns + '|' + tag;
    if (DEF[key]) return DEF[key];
    if (!defDoc) { var f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:fixed;left:-9999px;top:0;width:10px;height:10px;visibility:hidden;border:0'; document.body.appendChild(f); defDoc = f.contentDocument; defDoc.open(); defDoc.write('<!doctype html><html><head></head><body></body></html>'); defDoc.close(); }
    var el = ns === 'http://www.w3.org/1999/xhtml' ? defDoc.createElement(tag) : defDoc.createElementNS(ns, tag), o = {};
    defDoc.body.appendChild(el);
    var cs = defDoc.defaultView.getComputedStyle(el);
    for (var i = 0; i < cs.length; i++) o[cs[i]] = cs.getPropertyValue(cs[i]);
    defDoc.body.removeChild(el);
    DEF[key] = o;
    return o;
  }
  function copyStyle(src, dst, cs) {
    var d = defaults(src), out = [], i, k, v;
    for (i = 0; i < cs.length; i++) {
      k = cs[i]; if (SKIP[k]) continue;
      v = cs.getPropertyValue(k);
      if ((k === 'overflow-x' || k === 'overflow-y') && (v === 'auto' || v === 'scroll')) v = 'hidden';   // no scrollbars on paper
      if (ALWAYS[k] || GEOM[k] || WID.test(k) || v !== d[k]) out.push(k + ':' + v);
    }
    if (oneLine(src, cs)) out.push('white-space:nowrap');
    out.push('transition:none', 'animation:none');
    dst.setAttribute('style', out.join(';'));
  }
  // text that stands on one line on the page stays on one: the computed width is rounded, and a hair's difference can wrap a last word
  function oneLine(src, cs) {
    if (!/^(normal|pre-line)$/.test(cs.whiteSpace)) return false;
    var t = false;
    for (var n = src.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && /\S/.test(n.nodeValue)) { t = true; break; }
    if (!t) return false;
    if (cs.display === 'inline') return src.getClientRects().length === 1;
    var fs = parseFloat(cs.fontSize) || 16, lh = cs.lineHeight === 'normal' ? fs * 1.3 : parseFloat(cs.lineHeight) || fs * 1.3;
    var h = src.getBoundingClientRect().height - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0) - (parseFloat(cs.borderTopWidth) || 0) - (parseFloat(cs.borderBottomWidth) || 0);
    return h > 0 && h < lh * 1.6;
  }
  // a <defs> block (or a gradient, a filter …): its markup as it is, with only what a rule gave it (an inherited value only where it
  // differs from its parent's), so what a <use> draws from it inherits from that <use> as on screen
  function cloneRaw(src) {
    var dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      var cs = getComputedStyle(src), p = src.parentNode && src.parentNode.nodeType === 1 ? getComputedStyle(src.parentNode) : null, d = defaults(src), out = [];
      for (var i = 0; i < cs.length; i++) { var k = cs[i], v; if (SKIP[k] || k === 'display') continue; v = cs.getPropertyValue(k); if (ALWAYS[k] ? p && v !== p.getPropertyValue(k) : v !== d[k]) out.push(k + ':' + v); }
      dst.removeAttribute('style');
      var own = src.getAttribute('style') || '';
      if (out.length || own) dst.setAttribute('style', own + (own && out.length ? ';' : '') + out.join(';'));
      for (var n = src.firstChild; n; n = n.nextSibling) dst.appendChild(n.nodeType === 1 ? cloneRaw(n) : n.cloneNode(false));
    }
    return dst;
  }
  function pseudo(src, dst, p) {
    var cs = getComputedStyle(src, p), c = cs.getPropertyValue('content');
    if (!c || c === 'none' || c === 'normal' || cs.display === 'none') return;
    var cls = 'ehx-p' + (pn++), out = [];
    for (var i = 0; i < cs.length; i++) if (!SKIP[cs[i]]) out.push(cs[i] + ':' + cs.getPropertyValue(cs[i]));
    dst.classList.add(cls);
    pcss.push('.' + cls + p + '{' + out.join(';') + '}');
  }
  function clone(src) {
    if (src.nodeType === 3) return document.createTextNode(src.nodeValue);
    if (src.nodeType !== 1 || DROP[src.tagName]) return null;
    if (RAW[src.localName] && src.namespaceURI === 'http://www.w3.org/2000/svg') return cloneRaw(src);
    var cs = getComputedStyle(src);
    if (cs.display === 'none') return null;
    var tag = src.tagName, dst, leaf = false, hide = false;
    if (tag === 'CANVAS') { dst = document.createElement('img'); try { dst.src = src.toDataURL('image/png'); } catch (e) { hide = true; } leaf = true; }
    else if (tag === 'IMG') {
      dst = src.cloneNode(false); dst.removeAttribute('srcset'); dst.removeAttribute('loading'); dst.removeAttribute('sizes'); dst.removeAttribute('alt');
      var s = src.currentSrc || src.src;
      if (IMG[s]) dst.src = IMG[s];
      else if (!/^data:/.test(s)) { try { if (!src.naturalWidth) throw 0; var c = document.createElement('canvas'); c.width = src.naturalWidth; c.height = src.naturalHeight; c.getContext('2d').drawImage(src, 0, 0); dst.src = c.toDataURL('image/png'); } catch (e) { dst.removeAttribute('src'); hide = true; } }   // an image that cannot be read: its room kept, nothing drawn (no broken-image mark)
      leaf = true;
    }
    else if (tag === 'SELECT') { dst = document.createElement('div'); dst.textContent = src.options[src.selectedIndex] ? src.options[src.selectedIndex].text : ''; leaf = true; }
    else if (tag === 'INPUT' || tag === 'TEXTAREA') { dst = document.createElement('div'); dst.textContent = src.value || src.placeholder || ''; leaf = true; }
    else dst = src.cloneNode(false);
    copyStyle(src, dst, cs);
    if (hide) dst.style.visibility = 'hidden';
    pseudo(src, dst, '::before'); pseudo(src, dst, '::after');
    if (!leaf) for (var n = src.firstChild; n; n = n.nextSibling) { var k = clone(n); if (k) dst.appendChild(k); }
    return dst;
  }
  function frames(n) { return Promise.race([new Promise(function (ok) { (function f() { if (n-- <= 0) ok(); else requestAnimationFrame(f); })(); }), new Promise(function (ok) { setTimeout(ok, 120); })]); }
  // transitions and finite animations to their end; the endless ones (the live dot's pulse) to their first frame
  function still() {
    if (!document.getAnimations) return;
    document.getAnimations().forEach(function (a) {
      try { var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null; if (t && t.endTime === Infinity) a.currentTime = 0; else a.finish(); } catch (e) {}
    });
  }
  function draw(svg, W, H, k, kind) {
    return new Promise(function (ok, no) {
      var img = new Image();
      img.onload = function () {
        // the fonts in the drawing load with it: decoded, and a moment more, before it is put on the canvas (WebKit draws the first
        // frame in the fallback fonts otherwise)
        var go = function () {
          var c = document.createElement('canvas'), x, CW = W, CH = H, s = 1, ox = 0, oy = 0;
          if (kind === 'square' || kind === 'wide') {
            CW = kind === 'wide' ? 1920 : 1080; CH = 1080; k = 1;
            var m = kind === 'wide' ? 90 : 60;
            s = Math.min((CW - 2 * m) / W, (CH - 2 * m) / H, 2.5);
            ox = Math.round((CW - W * s) / 2); oy = Math.round((CH - H * s) / 2);
          }
          c.width = Math.round(CW * k); c.height = Math.round(CH * k);
          x = c.getContext('2d');
          x.fillStyle = kind === 'png' ? '#ffffff' : '#F2F2F2'; x.fillRect(0, 0, c.width, c.height);
          x.imageSmoothingQuality = 'high';
          try { x.drawImage(img, ox * k, oy * k, W * s * k, H * s * k); } catch (e) { no(e); return; }
          try { c.toBlob(function (b) { if (b) ok(b); else no(new Error('The image could not be written.')); }, 'image/png'); }
          catch (e) { no(new Error('This browser does not allow the drawing to be saved. Use Chrome, Edge or Firefox.')); }
        };
        (img.decode ? img.decode().catch(function () {}) : Promise.resolve()).then(function () { return frames(2); }).then(go);
      };
      img.onerror = function () { no(new Error('The image could not be drawn.')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  function snap(opts) {
    opts = opts || {};
    var kind = opts.kind === 'square' || opts.kind === 'wide' ? opts.kind : 'png', k = opts.scale === 1 ? 1 : 2, html = document.documentElement, root = document.getElementById('dm-eh');
    if (!root) return Promise.reject(new Error('There is no graphic on the page.'));
    // the 2x drawing of a whole card needs room: keep the canvas under about 16 million pixels
    var ready = window.EH_EMBED && EH_EMBED.ready ? EH_EMBED.ready(15000) : Promise.resolve(true), T0 = Date.now(), tm = function (s) { if (opts.debug) console.log('[snap] ' + s + ' ' + (Date.now() - T0) + 'ms'); };
    return Promise.all([fonts().then(function (f) { tm('fonts'); return f; }), images(root).then(function (x) { tm('images'); return x; }), ready.then(function (x) { tm('ready ' + x); return x; })]).then(function (got) {
      html.classList.add('is-snap');
      if (window.EH_EMBED && EH_EMBED.stamp) EH_EMBED.stamp();
      // the credit grows by the time of the figures (two lines on a narrow card), so the room over it shrinks: the lists and maps are fitted
      // to it again before the copy is made, or a row the page showed would be cut in the image
      if (window.EH_FIT && EH_FIT.fit) { try { EH_FIT.fit(); } catch (e) {} }
      return frames(2).then(function () {
        still();
        pn = 0; pcss = [];
        var r = root.getBoundingClientRect(), W = Math.ceil(r.width), H = Math.ceil(r.height), body;
        try { body = clone(root); } finally { html.classList.remove('is-snap'); }
        tm('copied');
        body.style.margin = '0'; body.style.position = 'static'; body.style.width = W + 'px'; body.style.height = H + 'px'; body.style.boxSizing = 'border-box';
        var st = document.createElement('style');
        st.textContent = got[0] + '\n' + pcss.join('\n');
        var wrap = document.createElement('div');
        wrap.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        wrap.style.cssText = 'width:' + W + 'px;height:' + H + 'px;margin:0;padding:0';
        wrap.appendChild(st); wrap.appendChild(body);
        var xhtml = new XMLSerializer().serializeToString(wrap);
        if (k === 2 && W * H * 4 > 16e6) k = Math.max(1, Math.sqrt(16e6 / (W * H)));
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"><foreignObject x="0" y="0" width="' + W + '" height="' + H + '">' + xhtml + '</foreignObject></svg>';
        tm('serialised ' + Math.round(svg.length / 1024) + ' KB');
        return draw(svg, W, H, k, kind).then(function (b) { tm('drawn'); return b; });
      });
    }).catch(function (e) { html.classList.remove('is-snap'); throw e; }).then(function (b) { if (window.EH_FIT && EH_FIT.fit) { try { EH_FIT.fit(); } catch (e) {} } return b; });
  }
  /* a check of the copy against the page: the copy laid out in the page itself, each element's box compared with the original's; returns
     the count of boxes more than 1.5px out and the first of them */
  function diff(sel) {
    var live = document.querySelector(sel || '#dm-eh'), html = document.documentElement;
    html.classList.add('is-snap');
    pn = 0; pcss = [];
    var c = clone(live), st = document.createElement('style'), box = document.createElement('div');
    c.removeAttribute('id');   // out of the page's own rules (all under #dm-eh), as in the image
    st.textContent = pcss.join('\n');
    box.style.cssText = 'position:absolute;left:0;top:0;z-index:99;background:#fff;width:' + live.getBoundingClientRect().width + 'px';
    box.appendChild(st); box.appendChild(c); document.body.appendChild(box);
    function list(r, keepHidden) {
      return [r].concat([].slice.call(r.querySelectorAll('*'))).filter(function (e) {
        for (var p = e; p && p !== r.parentNode; p = p.parentElement) { if (RAW[p.localName]) return false; if (!keepHidden && getComputedStyle(p).display === 'none') return false; }
        return true;
      });
    }
    var L = list(live, false), C = list(c, true), out = [], n = 0, a0 = live.getBoundingClientRect(), b0 = c.getBoundingClientRect();
    for (var i = 0; i < L.length; i++) {
      var e = L[i], k = C[i]; if (!k || (e.tagName !== k.tagName && !(e.tagName === 'CANVAS' && k.tagName === 'IMG'))) { out.push('structure differs at ' + i); break; }
      var a = e.getBoundingClientRect(), b = k.getBoundingClientRect(), ax = a.left - a0.left, ay = a.top - a0.top, bx = b.left - b0.left, by = b.top - b0.top;
      if (Math.abs(a.width - b.width) > 1.5 || Math.abs(a.height - b.height) > 1.5 || Math.abs(ax - bx) > 1.5 || Math.abs(ay - by) > 1.5) {
        n++;
        if (out.length < 10) out.push((e.tagName + '.' + String(e.getAttribute('class') || '')).slice(0, 48) + ' ' + Math.round(a.width) + 'x' + Math.round(a.height) + '@' + Math.round(ax) + ',' + Math.round(ay) + ' vs ' + Math.round(b.width) + 'x' + Math.round(b.height) + '@' + Math.round(bx) + ',' + Math.round(by));
      }
    }
    box.remove(); html.classList.remove('is-snap');
    return 'boxes ' + L.length + ', out ' + n + (out.length ? '\n' + out.join('\n') : '');
  }
  window.EH_EXPORT = { snap: snap, diff: diff, fonts: fonts, fontsStatus: fontsStatus, copy: function (el) { pn = 0; pcss = []; var c = clone(el); return { el: c, css: pcss.join('\n') }; } };
})();
