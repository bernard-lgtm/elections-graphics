/* config.js — the settings for the library and for every embed. Edit them here and publish the folder again: the embeds already in
   articles read this file each time they load, so they pick the changes up without new embed codes. */
window.EHX_CONFIG = {
  /* The address this folder is published at, ending in a slash. Embed codes and links point here whenever the library is opened from
     somewhere else (a local copy or a preview). On the published site the library uses its own address, so this only has to be right
     for previews. */
  publicBase: 'https://bernard-lgtm.github.io/elections-graphics/',

  /* The Elections Hub on dailymaverick.co.za. The link under every embed opens it at the graphic's own place (#johannesburg,
     #turnout-gauteng …). */
  hubUrl: 'https://www.dailymaverick.co.za/elections',

  /* The same settings as data-declared, data-deadline and #eh-sittings on the hub's markup. Set them here on the day they are set on
     the hub, so the embeds move on with it. */
  declared: '',     // YYYY-MM-DD: the day the Electoral Commission declares the results (the embeds show Results declared from then)
  deadline: '',     // YYYY-MM-DD: the last day for first sittings (14 days after the councillors elected are gazetted)
  sittings: {},     // first sittings called before the deadline, by council key, e.g. { jhb: '2026-11-20' }
  votingDay: '2026-11-04'
};
