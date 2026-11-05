# Daily Maverick · Elections 2026 graphics library (final)

Every graphic on the Elections Hub as an embed for articles, and as a still image for newsletters. Built from library v3 on 5 November 2026, with live results only. Plain HTML, CSS and JavaScript, no build step.

## Publish (GitHub Pages)

1. Upload everything in this folder to the root of `bernard-lgtm/elections-graphics`: `index.html` at the top, with the folders `assets/`, `data/`, `fonts/` and `hub/` beside it.
2. Settings → Pages → Deploy from a branch → `main`, `/ (root)` → Save.
3. The library is at `https://bernard-lgtm.github.io/elections-graphics/`, the `publicBase` in `config.js`. For another repository, put its address there.

Embed codes and links are the same as v3's, so codes already in articles keep working.

## Live results only

Every embed shows the results from Daily Maverick's RevEngine IEC service and reads them again every 5 minutes while the count is on. The embeds hold no sample or test figures, and no address parameter switches to them.

Taken out of v3:

- `hub/elections-hub-post-v26-preview.js` (3.9 MB): the preview build, with the sample count and the sample's ward candidates.
- The `&data=sample` and `&data=2021` switch in `graphic.html` and `embed-boot.js`, with its `&at=`, `&decl=` and `&now=` settings.
- The "Sample figures for testing" and "2021 figures" labels in `embed.js` and `embed.css`, and the figures picker in `library.js`.
- `article-test.html` (the mock article) and an unused masthead file.

## Settings (config.js)

- `publicBase`: the address the library is published at.
- `hubUrl`: the results page. Every link out of an embed opens it at the graphic's place.
- `declaredUrl`: the results declared page, which the links open once an embed shows Results declared.
- `declared`, `deadline`, `sittings`: the same as `data-declared`, `data-deadline` and `#eh-sittings` on the hub. Set them here on the day they are set on the hub.

Embeds in articles read `config.js` each time they load, so a change needs no new embed codes.

## Files

- `index.html`, `library.css`, `library.js`: the library. `anchors.js` and `districts.js`: its Hub anchors page. `illustrations.js`: its Header illustrations page.
- `graphic.html`, `embed-boot.js`, `embed.js`, `embed.css`: the embed page. `embed-fit.js`, `embed-fit.css`: the fixed heights. `export.js`: the PNG images.
- `graphics.js`: the graphics, their views and heights. `councils.js`: the councils and their wards.
- `hub/`: the Elections Hub's live build (post-elections v26) that the embeds run on.
- `data/ward-geo.json`: the ward extents for Use my location.
- `assets/`: the masthead, the logo, the Header illustrations example and the menu's snapshots (`assets/menu/`, drawn from sample figures; they show in the library's menus only).
- `fonts/`: DM Custom.

## What it talks to

- `iec-api.revengine.dailymaverick.co.za`: the results, ward candidates and maps. It must allow requests from the GitHub Pages address.
- The Municipal Demarcation Board's map services (`services7.arcgis.com`), only when a map can't be read from the feed.
- Google Fonts.
