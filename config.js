/* config.js — the settings for the library and for every embed. Edit them here and publish the folder again: the embeds already in
   articles read this file each time they load, so they pick the changes up without new embed codes. */
window.EHX_CONFIG = {
  /* ==== THE DECLARED SWITCH ====
     false: the count's box follows the count (Counting in red, then Count complete in charcoal, provisional until declared).
     true:  every embed shows Results declared in the green box, with the day in declaredOn under it; the seats read Declared and the
            links open declaredUrl. To flick it: change false to true and publish this file (on GitHub: config.js, the pencil, edit,
            Commit changes). Embeds pick it up as they load, within about 10 minutes of publishing (GitHub Pages keeps a copy that long). */
  resultsDeclared: false,
  declaredOn: '2026-11-07',   // YYYY-MM-DD: the day in the green box (Saturday 7 November 2026). Change it if the declaration falls on another day

  /* The address this folder is published at, ending in a slash. Embed codes and links point here whenever the library is opened from
     somewhere else (a local copy or a preview). On the published site the library uses its own address, so this only has to be right
     for previews. */
  publicBase: 'https://bernard-lgtm.github.io/elections-graphics/',

  /* The results page on dailymaverick.co.za. Every link out of an embed opens it at the graphic's own place: All results under the
     graphic, the rest of a list, and a council clicked on a map or list of South Africa or a province (#johannesburg,
     #johannesburg-ward-12, #johannesburg-coalition, #turnout-gauteng …). */
  hubUrl: 'https://www.dailymaverick.co.za/local-elections-results-2026/',

  /* The results declared page. Once the switch above is on, the embeds' links open this page instead, at the same place. Leave it
     empty to keep them on hubUrl. */
  declaredUrl: 'https://www.dailymaverick.co.za/local-elections-results-declared-2026/',

  /* The same settings as data-deadline and #eh-sittings on the hub's markup. Set them here on the day they are set on the hub, so the
     embeds move on with it. */
  deadline: '',     // YYYY-MM-DD: the last day for first sittings (14 days after the councillors elected are gazetted)
  sittings: {},     // first sittings called before the deadline, by council key, e.g. { jhb: '2026-11-20' }
  votingDay: '2026-11-04'
};
/* declared, which the embeds and the library read (the hub's data-declared): empty while the switch is off; while it is on, declaredOn,
   or today in South Africa where declaredOn is not a date or is still to come, so that the switch always turns the embeds declared */
(function (C) {
  var today = new Date(Date.now() + 72e5).toISOString().slice(0, 10), d = String(C.declaredOn || '');
  C.declared = C.resultsDeclared === true ? (/^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today ? d : today) : '';
})(window.EHX_CONFIG);
