/* illustrations.js — Header illustrations, the last button in the library's bar: its page, in the graphic's place (library.js LIB_PAGE,
   #header-illustrations): a button to the Gemini gem that turns a picture into a header illustration, and an example, a raw picture and
   the illustration the gem made of it (assets/illustrations). Loads after anchors.js. */
(function () {
  'use strict';
  var bar = document.querySelector('.lib-top'); if (!bar || !window.LIB_PAGE) return;
  var DIR = window.EHX_DIR || '', GEM = 'https://gemini.google.com/gem/1cC7abQy73vM7SYB5lEgYz5aOoxJ9qxQw?usp=sharing';
  var wrap = document.createElement('div'); wrap.className = 'lib-ill';
  wrap.innerHTML = '<button type="button" class="lib-nav-btn lib-page-btn">Header illustrations</button>';
  var after = bar.querySelector('.lib-anc') || bar.querySelector('.lib-nav');
  bar.insertBefore(wrap, after ? after.nextSibling : bar.firstChild);
  var page = document.createElement('section'); page.id = 'lib-ill-page'; page.setAttribute('aria-label', 'Header illustrations');
  page.innerHTML = '<div class="ill-in">' +
    '<div class="ill-cta" style="padding-top:55px"><a class="btn is-primary is-big ill-go" href="' + GEM + '" target="_blank" rel="noopener">Create illustration</a>' +
    '<p class="lib-page-lead">Anyone with a Daily Maverick email address should have access to the gem. <b>Just drop in a picture and press go.</b></p></div>' +
    '<div class="ill-ex"><span class="lbl">Example</span><div class="ill-pair">' +
    '<figure class="ill-fig"><img src="' + DIR + 'assets/illustrations/example-raw.jpg" alt="Raw picture of Nobuntu Hlazo-Webster" width="800" height="533" loading="lazy"><figcaption class="lbl">Raw picture</figcaption></figure>' +
    '<figure class="ill-fig"><img src="' + DIR + 'assets/illustrations/example-processed.jpg" alt="The same picture processed into a header illustration" width="1600" height="893" loading="lazy"><figcaption class="lbl">Processed</figcaption></figure>' +
    '</div></div></div>';
  window.LIB_PAGE('header-illustrations', wrap.querySelector('button'), page);
})();
