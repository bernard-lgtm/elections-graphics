# Daily Maverick · Elections 2026 graphics library v3 (Elections Hub post-elections v26)

Every graphic on the Elections Hub as an embed for articles, with its own link and image downloads. Plain HTML, CSS and JavaScript, no build step. v3 replaces v2 (`elections-graphics-v2/`): the maps and the ward candidates now come from the RevEngine IEC service, the service the results come from (see What it talks to). Embed codes and links are the same as v2's.

## Publish it (GitHub Pages)

The repository is `bernard-lgtm/elections-graphics` (public); the library is published at `https://bernard-lgtm.github.io/elections-graphics/`, the `publicBase` in `config.js`.

1. Upload this folder's contents to the root of the repository with its folders (`hub/`, `data/`, `fonts/`, `assets/`): `index.html` at the top, not inside a folder.
2. Settings → Pages → Deploy from a branch → `main`, `/ (root)` → Save.
3. For another repository, put the address it gets (`https://<user>.github.io/<repo>/`) in `config.js` as `publicBase`, and publish again. On the published site the library uses its own address anyway; `publicBase` is what previews and local copies point the codes at. The library says whether anything is published there.

Copy embed codes from the published library (or from a preview once `publicBase` is right).

## What a journalist does

Pick the graphic's place and view, press **Copy embed code**, paste it into the article's HTML block. The code is one iframe tag with a fixed height (no script), the same on desktop and on phones, so it works in a dynamic article. **Copy link** gives the version's own address; **Test in an article** shows the code in a mock article column, desktop and phone.

## Fixed heights

Each graphic has a fixed height in `graphics.js` (`h`, or `hv` for a view): about 760px for most (the coalition builder too), 640 for the bar charts and the Change since 2021 maps, 660 for the council banner. Inside the frame (`embed-fit.css`, `embed-fit.js`) the card is exactly as tall as the frame: the title, the count's progress and the credit keep their size, and the graphic takes the room between them. Maps are drawn as large as that room allows (their width set from its height); the ward map's box takes the room over its key. The coalition builder keeps every party under its half circle: where they need the room (a council with many parties, a phone), the half circle is drawn smaller. A list shows the rows that fit, then a link to the rest on the Elections Hub (results by council, the hung councils list, votes by party, a ward's candidates). Under 560px the two maps of Change since 2021 become one map with a 2021 / 2026 switch. `&fit=0` on a graphic's address turns this off (the card as tall as its content, reporting its height by postMessage as before).

To change a height, edit `graphics.js` and publish; codes already in articles keep the height they were copied with, so change the attribute in the article too.

## The embeds

`graphic.html?embed=<graphic>` with `&area=GP` (a province; none for South Africa) or `&muni=<key>` (`&ward=<n>` for a ward), and `&view=` where a graphic has views. The graphics and their views are listed in `graphics.js`; the councils and their wards in `councils.js`.

Each embed is a white card at the fixed height: the title with the count's box for that place on its right, as on the Elections Hub (Counting in red with the share of voting districts in, Count complete in charcoal while the results are provisional, Results declared in green with the day), the graphic, and the source with the time of the figures and a link to the graphic's own place on the Elections Hub. The coalition builder is its own, simpler than the hub's coalition mode: one line on the seats a coalition needs with Start again beside it, then the half circle with the tally in its middle and the parties to pick; no Hung council banner and no Back to results. It reads the results every 5 minutes while the count is on, as the hub does: the RevEngine results service updates every 5 minutes. A council clicked in a graphic of South Africa or a province opens on the hub in a new tab. An embed never scrolls itself or the article.

Preview-only parameters (never in codes or links): `&data=sample` (with `&at=` the share counted, `&decl=1` declared) or `&data=2021`.

## Settings (config.js)

`publicBase`, `hubUrl`, and `declared`, `deadline`, `sittings`: the same as `data-declared`, `data-deadline` and `#eh-sittings` on the hub's markup. Set them here on the day they are set on the hub; embeds already in articles read the file each time they load.

## Files

- `index.html`, `library.css`, `library.js`: the library.
- `graphic.html`, `embed-boot.js`, `embed.css`, `embed.js`: the embed page over the hub; `embed-fit.css`, `embed-fit.js`: the fixed height.
- `export.js`: the images. The card is copied with its computed styles written inline and drawn through an SVG `foreignObject` onto a canvas, so the PNG is the graphic as it stands. The fonts go into the image as data: Geist, Charis SIL, Archivo and Barlow read from Google Fonts, DM Custom from `fonts/` beside `graphic.html` (the site's own copy, with the page's session, as a fallback), so an image drawn in a browser that blocks Google Fonts falls back to system fonts and the library says so under the button. `EH_EXPORT.diff()` in an embed's console compares the copy's layout with the page's (0 boxes out is a faithful copy); `EH_EXPORT.fontsStatus()` says which faces the last image embedded.
- `../qa/embed-check.html?fig=complete&kind=png|square|wide&e=map,votes`: every embed drawn at 668 and 360 (or as a square or wide image), with its state, the title's and kicker's ink in the image against the page's (a font check), overflow, clipped boxes and the export's layout diff. Run it from the project; it keeps the embeds' timers going in a background tab.
- `article-test.html`: the mock article.
- `hub/`: the hub's v26 files with three changes: the results are read every 5 minutes (was 3), as on the hub since post-elections v28.1; the maps are read from the feed's map files ("the feed's maps" near the top of each file); the fast build reads a ward's candidates from the feed (`wardList` in "results"). `elections-hub-post-v26.js` (the fast CMS build, for live embeds) and `elections-hub-post-v26-preview.js` (the preview build, for the sample and 2021 figures, with the sample's ward candidates bundled).
- `data/`: only `ward-geo.json`, the ward extents for the hub's Use my location, which the embeds don't show. The ward candidate files of v2 are gone.

## What it talks to

Daily Maverick's RevEngine IEC service, `iec-api.revengine.dailymaverick.co.za` (it must allow requests from the GitHub Pages address), for everything the graphics show:

- the results: `/local/2026`, `/local/2026/provinces/{province}`, a ward's at `/local/2026/provinces/{province}/municipalities/{id}/wards/{wardId}`, and `/local/2021/…` for Change since 2021;
- a ward's candidates: `/local/2026/wards/{wardId}/candidates` (the IEC's certified list of 16 September, name for name) and the council's parties for their abbreviations, `/local/2026/parties?province=…&municipality={code}`;
- the maps: `/maps/2026/national.json` (provinces), `/maps/2026/provinces/{slug}.json` (a province's councils), `/maps/2026/municipalities/{code}.json` (a council's wards), and `/maps/2021/voting-districts/{code}.json`, from which the 2021 wards are put together in the browser.

The Municipal Demarcation Board's map services (`services7.arcgis.com`) stand in only when a map can't be read from the feed; the browser console says so (`[elections-hub] map …`). Google Fonts. The hub's story feeds, videos and newsletter card are not part of the embeds and are not loaded.
