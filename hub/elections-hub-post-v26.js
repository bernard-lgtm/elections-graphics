/* Graphics library v3 (4 November 2026): the council, province and ward maps come from the RevEngine IEC service's maps, the service the
   results come from, with the Demarcation Board's map services standing in only when a map can't be read (see "the feed's maps"), and a
   ward's candidates come from the same service, read for that ward (wardList in "results"): data/ holds only ward-geo.json, for Use my
   location, which the embeds don't show. */
/* Fast build: the CMS build with the ward candidates (2,9 MB of the 3,9 MB script) and the ward extents for Use my location moved out to
   data files the page reads on demand: see "data files" below (EH_FILES_URL, or data-files on #dm-eh) and the data/ folder beside this file. */
/* CMS build (30 October 2026) of the post-elections v26 script, for dailymaverick.co.za. The preview-only parts are taken out: the invented
   stand-ins for the elections API (made-up council and ward vote breakdowns, shown off dailymaverick.co.za only), the sample count
   (?data=sample and the preview bar's sliders) and the preview's address parameters (?data=, ?phase=, ?at=, ?dec=, ?day=, ?now=), which are
   not read on any host. Every figure on the page comes from the Electoral Commission's results through RevEngine, the MDB's boundary
   services and the fact-checked data in this file. Nothing else changed. */
/* Daily Maverick · Elections Hub 2026, post-elections v26 — script for the custom page (CMS build). Pair with elections-hub-post-v26.css and
   elections-hub-post-v26.html.
   Contains, in order: shared helpers, the story-feed reader, the video players,
   the two story feeds, the datasets, the locator map, the responsibilities explainer, the ward candidates,
   the council stories, the municipality finder and the election-day countdown.
   Stories are read from dailymaverick.co.za only (tag pages). Once dev adds a tag RSS feed, set TAG_RSS in the story-feed reader below.
   Data the page does not show (fact-check notes, Census 2022 household services) is left out.
   v19: governed by, mayor, the ward Governed by box and Use my location take their data from the elections API: see "elections API hooks" below.
   v20: the locator map is drawn from real province boundaries (they need a credit line, see "locator map"); its red light breathes and sends out a faint ring.
   v21: the Reality Check rating explainer is redesigned (see "Reality Check rating explainer"): a black header like the button, the working as a ledger, the rules in a grey panel.
   v22: governed by, mayor, both vote breakdowns and Use my location go live from one web address: put it in data-api on #dm-eh (see "elections API" below).
   v23: the three "Before you vote" cards and their explainer popup are removed; mayors come from the 2026 list of mayors.
   v24: Use my location, the council vote breakdown and the ward box run on public data with no developer setup: see "IEC data" (2021 results
   from the IEC via RevEngine; the reader's ward from the MDB 2026 ward boundaries, worked out in the browser). Setting data-api still wins.
   v25: the four-metro coalition builder sits above the newsletter and questions buttons; it runs in its own frame (coalition-embed/), so nothing in this script drives it.
   v26: Use my location tests the reader's position against the real 2026 ward boundaries, fetched from the MDB for the few nearby wards only,
   so readers near a ward boundary get their own ward and not the next one: see "IEC data". The page now also calls services7.arcgis.com.
   v27: the coalition builder is built into the page (see "coalition builder"): it draws into #eh-cb, with no frame and no coalition-embed folder.
   post-elections v2 (built on v27): results replace the pre-election file. The banner, the file body, district files and the ward box show
   IEC results (see "results"); the council seats are drawn as a half circle of the coalition builder's pegs (see "the half circle");
   the builder itself runs on the metros' results, where readers can build coalitions from the real seats; "Results across South Africa" follows the
   finder; the masthead counts voting districts declared instead of days to go. Audit outcomes, Reality Check and the ballot cards are
   not shown (their code and data are still in this file).
   post-elections v3: council seats count independent ward winners, and a council whose seats don't add up says so (see "results").
   The council seats have no heading: a "Council seats" caption under the number in the half circle opens the explainer.
   The coalition builder opens as v27's did: the whole council stands on the board with no tally, then the seats sink to the left and
   the tally comes up at 0, ready to build (see "seat board"); its reset button clears the board.
   The ward box names the winning (or leading) candidate, and the ward's vote list each party's candidate, from the feed's ward candidates (see "results").
   post-elections v4: one script for three versions of the page, picked by data-phase on #dm-eh (see "seats by phase" in "results"):
     count        from 22:00 on voting day. The live count; a council's half circle shows a projection of its seats, marked as one, once 25% of its
                  voting districts have declared (empty until then). No coalition builder.
     provisional  the count done (about day 3 to 7). Provisional seats (the IEC's, or worked out from the full count) on the half circle and the
                  coalition builder, which now takes any hung council opened in the municipality finder as well as the metros.
     final        results declared. Final seats; hung councils count the days to their first sitting, due within 14 days of being declared
                  elected (data-deadline on #dm-eh gives the last day, see "the first sitting"), and Hung councils lists every one of them.
   post-elections v5: in the municipal file, a hung council's countdown to its first sitting stands over its half circle in place of
   the caption, and its "Build a coalition" makes the file a coalition builder where it stands (see "coalition mode in the municipal
   file" in "results"). The coalition builder further down is as it was.
   post-elections v6: on the municipal file's half circle the party under the pointer is picked out, with no click: its pegs lift a
   little out of their sockets, the number in the middle is its seats and its row in the table below lifts (a row under the pointer
   does the same; a tap does it on a touch screen). A projection's pegs are ghosts: rims solid in their own colours, middles you can
   see the sockets through (see "the half circle" and the painter).
   post-elections v7: Results across South Africa redesigned, lighter: the councils map beside party support; the map's dots sized by
   council seats; a click on a province opens it; the party under the pointer, on the map or in the table, lights up in both;
   the councils coloured by leading party or by turnout; a share bar in the provinces and councils tables (see "map (v7)").
   post-elections v8: in the municipal file, a map of the council's 2026 wards over the ward dropdown, from the MDB's public ward service
   (the one Use my location asks). The chosen ward stands up out of the map, and a click on a ward chooses it (see "the ward map").
   post-elections v9: one markup for the whole election. The page picks its phase itself and moves on from count to provisional to final as
   the Commission's count completes and the results are declared (see "automatic phase" in "results"); data-phase on #dm-eh can still pin one.
   post-elections v10: the ward map in three views, in a loop: the plain wards, the wards in the colour of the party leading each, the wards
   by turnout, with the view's legend beside the map; a pill over the map names a view and pins it (see "the ward map").
   post-elections v11: the ward map split in two. Under the black banner, Results by ward: the wards by leading party or by turnout, the
   chosen ward raised, no picking. Over the ward dropdown, Your ward: the plain wards to pick from. Beside each, its facts in the style of
   the council box in the banner (Won by, Council seats), stacked (see "the ward maps").
   post-elections v11.1: the sample count's wards stand on the 2026 ballot, so the ward box and the ward's vote list carry the candidates'
   names (see "sample count" in "results").
   post-elections v11.5: the ward finder holds still. Results by ward stays on Leading party (no run to Turnout and back), the chosen ward
   stands raised at once, and the maps, their facts and a change of view come in without fades (see "the ward maps").
   post-elections v11.6: a hung council's Hung council banner goes up as soon as its count is done (its seats provisional): it says no party
   has a majority and what a coalition needs, with no date and no countdown. Once the results are declared, the banner takes the date of
   the first sitting and the countdown starts (see dlStrip in "the first sitting"). Over the half circle and under the coalition builder.
   Party support counts up to the new figures on each live update. The council seats stand in a white box with a thin black border,
   the status tag (Projection, Provisional, or Declared for final seats) in its top-left corner. Previews: ?phase= picks the version, ?at= the share of the sample count in,
   ?day= the days since the councils were declared elected.
   A hung council's "Who can build a coalition?" comes up as soon as its own seats are provisional, on election night too.
   post-elections v13: in Results across South Africa every metro and local council is drawn as its 2026 boundary (MDB), not a dot,
   coloured by the party leading it or by turnout, over the whole country and in a province; a click on a council in a province opens its
   file, where Results by ward has its wards (see "the councils by boundary"). The dots stand if the boundary service doesn't answer.
   Hung councils' Build a coalition opens the council's file in coalition mode (see DM_EH_COAL); the coalition builder under the list is gone.
   post-elections v14: declared council by council. The Electoral Commission publishes a council's seats (its seat calculation, the feed's
   seats object) when it declares that council's result, so the page takes the seats as the declaration: the half circle reads Declared,
   the hung-council banner takes a date and the countdown starts, with no wait for a national declaration. Hung councils comes up with the
   first declared hung council and grows, with the count of councils declared so far; the masthead counts councils declared once every
   voting district is in; the page is final once every council is declared (see "automatic phase" and "declared councils" in "results").
   A council's own declaration day comes from report_date on its seats in the feed (the Commission's ReportDate), when the feed carries
   it, and its first sitting is due 14 days later; data-deadline stands in for councils without one. Previews: ?dec= the share of the
   sample's councils declared (the Declared slider).
   post-elections v15: three tabs under the municipality finder share one place: All results (Results across South Africa), Hung councils
   and Change since 2021 (see "the tabs" and "Change since 2021"). The area dropdown stands over the tabs and picks the area for all three
   (EH_AREA, in "results across South Africa"); Hung councils follows it, and its panel stays with a note while no hung council is
   declared. The 2021 results for the comparison come from the feed's 2021 totals and provinces (natPrev, provincePrev).
   post-elections v16: no projection of the council seats. A council's half circle stays empty while its count is under way (gate); once
   every voting district is in it shows the seats the full count gives (Provisional, the box red and dashed), and once the Commission
   declares the council its seats (Declared, green). See "seats by phase".
   post-elections v17: the tabs run the full width of the column, in the order Results, Turnout, Change since 2021, Hung councils (the
   markup's). Change since 2021 opens on its two councils maps, 2021 where Results has its map and 2026 beside it, with its figures under
   them. See "Change since 2021".
   post-elections v18: switching tabs glides. The section eases from one tab's height to the next (and, for a moment after the switch, as
   the tab fills in) while the new panel fades in, so nothing under the tabs jumps. See "the tabs under the municipality finder".
   post-elections v18: the turnout maps run in steps of ten, from under 40% to 70% or more, on the councils map and the ward map
   (TURN_BINS, WM_TURN).
   post-elections v18: beside Results by ward, each view's key as a table, as the Turnout tab's beside the councils map: a row for each
   party the map names, or each band of turnout, with the wards in it (wmPaneWin, wmPaneTurn, wmKey). The title stands centred over the
   map, the pill over the key (wmCols).
   post-elections v18.1: the rows of the key take no pointer. A row under the pointer, or tapped, no longer raises its wards on the map.
   post-elections v20: in the municipal file's black banner the count tracker stands in the council box, beside the leading or largest
   party, in the vote breakdown's place; nothing stands under the locator map (see councilBox in "results"). The council seats bar
   there goes too (the seats are on the half circle under the banner); a district council keeps its district ballot seats.
   post-elections v21: Share on WhatsApp leaves the foot of the council's results for the ward box, with the source line under it, in
   the place of the ward's turnout and registered voters and Contact your ward councillor (which goes); it links to the ward (WardShare in
   the municipality finder, wardBox in "results").
   The ward dropdown stands closer to the council's results (the stylesheet's v21 rules; #mf-ward's padding in the markup).
   post-elections v22: Hung councils opens on the councils map, in the place Results and Turnout have theirs, with the hung metros and
   the share of registered voters in hung councils over the map's key beside it; the banner and the list stand under them. On the map a
   hung council stands raised: a little, in charcoal, while its seats are provisional, and all the way, in red, once the Commission
   declares it (see "the hung councils map" in "hung councils").
   post-elections v22.1: over the whole country the hung councils map answers by province: the province under the pointer stands up as
   one, its councils on it at the height of a declared hung council, with its councils by outcome in its tooltip, and a click opens it;
   its councils answer one by one from there.
   post-elections v22.2: the Hung councils list holds every hung council, provisional or declared, each with a tag in the map's colours
   (charcoal Provisional, red Declared) that pops as it turns red; the count on the tab counts them all.
   post-elections v22.4: on the maps a council's or ward's outline is a darker shade of its own colour, and a council, ward or province
   standing up out of a map stands on sides in its own colours, a shade darker, its outline as on the flat map: over the whole country a province
   stands on its councils' sides, each in its council's colour (see cmLift, hmProvTop and the stylesheet's v22.4 rules).
   post-elections v22.5: on Change since 2021 the two maps answer each other: the council under the pointer is outlined on both, each
   with its tooltip for its year, and a dot on the other map marks the same spot; on the ward maps, the ward at that spot on the other
   map (see cmpHov in "change since 2021", wcHov and the stylesheet's v22.5 rules).
   post-elections v22.6: Change since 2021 in parts, each under its label: Leading parties, the two maps as before; Hung councils, the
   same two maps in the Hung councils tab's colours, a hung council raised (charcoal while its seats are provisional, red once declared);
   the figures, party support and the table under them (see hmapSvg in "change since 2021" and the stylesheet's v22.6 rules).
   post-elections v23.14: Change since 2021 has a third pair, Turnout, between Leading parties and Hung councils: the councils map in the
   Turnout tab's bands, 2021 beside this election, with its key and the Turnout tab's tooltips (tmapSvg in "change since 2021").
   post-elections v22.8: a hung council's seats box ends in a row of every party with seats, largest first, on the results and in
   coalition mode, for provisional and declared seats: its name, under it one of the half circle's pegs hopping and its seats beside
   the peg, with no box. A click puts the party in the coalition or takes it out, as its row in the table does; on the results it starts
   a coalition with it (see coalPick and pickPegs in "results", EH_BOARD.peg in "seat board" and the stylesheet's v22.8 rules).
   post-elections v22.9: on the half circle the party under the pointer lifts its pegs twice as high (ARC_LIFT); a majority's pegs hop on
   from there as high as ever, the rest stand still. Over the number the party's colour box is one of the half circle's pegs, hopping
   if the party has a majority and standing still if not (see label in "the half circle" and opts.hop in EH_BOARD.peg).
   post-elections v22.10: the row of parties at the foot of the seats box shows in coalition mode only, its parties coming in one after
   another as the mode opens. Its pegs stand still, just out of their sockets; a party's peg stands up while the pointer is over it and
   hops once the party is in the coalition, its name a black chip popping up a little; nothing fades. Once the coalition has a majority
   the half circle's pegs hop and the row's coalition hops a little higher (see pickShow and pickSync in "results", set in EH_BOARD.peg).
   post-elections v22.11: Change since 2021 over the whole country answers by province, as Results does: the province under the pointer
   stands up as one on both maps of the pair, each with the province's tooltip for its year, and a click opens it on every tab; in a
   province each map has the magnifying glass with a minus back to South Africa (see cmpProv in "change since 2021").
   post-elections v22.12: Results: no leading party over party support; the table stands at the top of its column (paintStand).
   post-elections v9: the municipal file's votes and seats table has taller rows and a 16px share bar split by ballot, the party's ward
   votes solid and its PR votes hatched (a local council's district council ballot dotted), the figures under it and the key in the
   head; the row picked out on the half circle pops up as a charcoal slab (see tableSec and "v9" in the stylesheet).
   post-elections v23: a council's seats stay Provisional until the Electoral Commission declares the results, even once it has published
   them in the feed (in 2021 the seats were out days before the declaration). The page turns final, with Declared seats and the countdowns
   to first sittings, on data-declared on #dm-eh or seven days after voting day; no longer on every council's seats being in, or on
   SeatCalculationCompleted (the progress report is no longer read). Until then the masthead counts the councils whose seats are in
   (Seats allocated). First-sitting deadlines come from data-deadline and #eh-sittings only: report_date on the seats is ignored, since
   the 14 days run from the gazette of the councillors' names. A council's count is complete once every one of its voting districts is
   in, whether or not the feed says results_complete. If the results don't load (no answer within 20 s, an error, or nothing), the page
   says so with a Refresh results button and tries again by itself 30 seconds later, then every 5 minutes; a province that fails to load
   is read again too (see "trying again" in "results").
   post-elections v23.4: a hung council's box in coalition mode: "Back to results" under Who can build a coalition in <council>?, the
   status tag alone at the top left, and the button that clears the coalition in the half circle's hole, over the number. Coalition mode
   opens on the whole council: at once its pegs sink in a sweep from the right, out to the left, the number going up and out and Select
   parties to reach a majority coming up in its place (a council not yet risen rises first; see o.intro in "the half circle").
   post-elections v23.5: Hung councils' Build a coalition opens the council's file in coalition mode with its Hung council banner at the
   top of the screen and the seats box under it (see coalAnchor in "results"); a click anywhere else on the council's row opens the file
   at the top of the finder, as before.
   post-elections v23.34: a district council's file shows its district ballot's count from the start (added up from its local councils'
   results until the district's own result is in, see dcCount in "results"); its seats stay blank until the Commission declares the results.
   post-elections v23.35: a district's local councils with no heading over them; each row its name, residents, the leading party and the
   outcome tag of a province's table of councils (render.chip), and a ›.
   post-elections v23.36: phones, a district's banner shorter: Local municipalities and District council side by side, and the council box's
   halves (the largest party, the district ballot seats) side by side too (see the stylesheet); fitParty sizes the party's name there too.
   post-elections v23.37: in coalition mode the button that clears the coalition hangs under Back to results, on the right (v23.23 to
   v23.36: under the status tag, on the left).
   post-elections v23.38: touch screens. On the Results, Turnout, Hung councils and Change since 2021 maps a tap on a council in a
   province no longer opens its file: the council stands up (Results, Turnout) or is outlined (Hung councils, Change since 2021) and its
   tooltip stays up with a Go to municipality button, which opens the file. A tap on another council moves them there; a touch off the
   map puts them down. A mouse is as before (see cmPin in "results across South Africa", hmPinShow in "the hung councils map" and
   cmpPin in "change since 2021").
   post-elections v23.39: Change since 2021, with a mouse too: a click on a council in a province stands it up a little on both maps of the
   pair, outlined, and both tooltips stay up with Go to municipality (cmpPop and cmpPin in "change since 2021"). Phones and narrow screens:
   each pair's 2026 map closer under the 2021 map (see the stylesheet).
   post-elections v24: anchors. Every part of the page has a link of its own, the hub's address with an anchor after the #: a council
   (#johannesburg), a ward (#johannesburg-ward-12), coalition mode (#johannesburg-coalition), the four tabs for South Africa or a
   province (#turnout-gauteng) and their parts (#change-since-2021-gauteng-party-support), the sections of the page (#latest-coverage).
   The address follows the reader in anchors, and Share on WhatsApp sends them; ?muni=, ?ward=, ?tab= and #eh-hung, the links before
   v24, still work. See "anchors"; the list of every anchor is in "Post-elections v24 - Anchors".
   post-elections v24.1: the ward chosen in the municipal file, in the dropdown, by Use my location or by a ward's anchor, is picked out on
   the ward map as a click picks one out: on Results by ward and Turnout by ward it stands up with its box over it; on Change since 2021
   it is outlined with its box, and 2021's ward at its spot too (see "a ward picked out").
   post-elections v25: on seats the page works out itself from a full count, before the Commission publishes its seat calculation, the
   Provisional tag's note says how (a quota of the ward and party votes; see the tag in seatsSec). Change since 2021's Party support table
   waits for the first 2026 votes instead of comparing 2021 with 0,0%.
   Safe to load in <head> or at the end of <body>: it waits for the page markup (#dm-eh). post-elections v26.2: no loading screen (the v26 one is taken out of the markup, the stylesheet and this script).
   post-elections v26.1: the ward chosen (in the dropdown, by Use my location or by a ward's anchor) is no longer picked out on the ward map,
   which comes clean on Results by ward, Turnout by ward and Change since 2021: no ward stands up until a click or a tap on the map picks
   one out, as in v23.12. A ward chosen puts back the one picked out (see "a ward picked out"). */
(function () {
  /* ==== v22 · elections API: one web address ====
     Governed by, Mayor, the council and ward vote breakdowns and "Use my location" take live data from one web
     address: the Daily Maverick elections service (see "Elections API - Developer Brief"). To connect it, put the
     address in data-api on the #dm-eh wrapper of the page markup,
       <div id="dm-eh" class="dm-eh" data-api="https://elections.example.dailymaverick.co.za/2026">
     or in EH_API_URL below (data-api wins when both are set). The page then asks for
       {address}/municipality/{muniKey}.json   black banner of local and metro files: governed by, mayor, council vote breakdown
       {address}/ward/{wardId}.json            "Governed by" box under the ward selector (wardId: the 8-digit ward ID)
       {address}/locate?lat={lat}&lng={lng}    "Use my location"
     muniKey is the key used throughout this file (jhb, cpt, stellenbosch ...; see SA_MUNIS).
     A 404, an empty or unreadable answer, an error, or no answer within 8 seconds hides that item; nothing else
     depends on it. While the IEC is still counting (the answer carries progress), an open file asks again every
     3 minutes. Problems are logged to the console as [elections-hub].
     With no address: the "IEC data" block below fills these slots from public sources (the 2021 results through RevEngine,
     the MDB's 2026 ward boundaries); see there.
     A developer may instead define window.DM_EH_API = { municipality(muniKey), ward(muniKey, wardNo, wardId),
     locate({ lat, lng, accuracy }) } before this script runs (the v19 hook: same answer formats, Promise or plain
     value); it takes precedence over the address. */
  var EH_API_URL = '';
  var EH_ON_DM = /(^|\.)dailymaverick\.co\.za$/i.test(location.hostname);
  var EH_TIMEOUT = 8000, EH_POLL = 180000, EH_REUSE = 120000;

  /* ==== fast build · data files ====
     The 2026 ward extents for Use my location (ward-geo.json) are not in this file: the page reads them from a folder of data files the
     first time it needs them. (Graphics library v3: the ward candidates, a file a province until v2, come from the results feed.)
     The folder: data-files on #dm-eh, else EH_FILES_URL below (an absolute address, or a path from the page; no trailing slash; "data" is
     the data/ folder beside the page, for local checks). Served from another domain, the folder needs CORS (Access-Control-Allow-Origin).
     A file that fails to load is asked for again the next time it is needed. */
  var EH_FILES_URL = 'data';
  function ehFilesBase() {
    var root = document.getElementById('dm-eh');
    return String((root && root.getAttribute('data-files')) || EH_FILES_URL || '').trim().replace(/\/+$/, '');
  }
  var ehFilesCache = {};
  function ehFilesJSON(path) {
    var url = ehFilesBase() + path, hit = ehFilesCache[url];
    if (hit) return hit;
    var p = new Promise(function (resolve, reject) {
      if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 20 s')); }, 20000);
      fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { clearTimeout(timer); resolve(d); }, function (e) { clearTimeout(timer); reject(e); });
    });
    ehFilesCache[url] = p;
    p.catch(function (e) { if (ehFilesCache[url] === p) delete ehFilesCache[url]; if (window.console) console.warn('[elections-hub] data file ' + url + ': ' + ((e && e.message) || e)); });
    return p;
  }
  function ehApiBase() {
    var root = document.getElementById('dm-eh');
    return String((root && root.getAttribute('data-api')) || EH_API_URL || '').trim().replace(/\/+$/, '');
  }
  var ehCache = {};
  function ehGet(path) {
    var url = ehApiBase() + path, hit = ehCache[url];
    if (hit && Date.now() - hit.t < EH_REUSE) return hit.p;
    var p = new Promise(function (resolve, reject) {
      if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within ' + EH_TIMEOUT / 1000 + ' s')); }, EH_TIMEOUT);
      fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
        .then(function (r) {
          if (r.status === 404 || r.status === 204) return null;
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text().then(function (t) { return /\S/.test(t) ? JSON.parse(t) : null; });
        })
        .then(function (d) { clearTimeout(timer); resolve(d); }, function (e) { clearTimeout(timer); reject(e); });
    });
    ehCache[url] = { t: Date.now(), p: p };
    p.catch(function (e) {
      if (ehCache[url] && ehCache[url].p === p) delete ehCache[url];
      if (window.console) console.warn('[elections-hub] ' + url + ': ' + ((e && e.message) || e));
    });
    return p;
  }
  function ehColour(c) {
    c = String(c || '').trim();
    return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) ? c : '';
  }
  // Answers are read leniently: shares as pct or raw votes, a label as party or name; anything unusable is dropped.
  function ehNorm(d) {
    if (!d || typeof d !== 'object') return null;
    var out = {};
    ['gov', 'mayor', 'party', 'name', 'source', 'year'].forEach(function (k) {
      if (d[k] != null && typeof d[k] !== 'object' && String(d[k]).trim()) out[k] = String(d[k]).trim();
    });
    if (ehColour(d.colour)) out.colour = ehColour(d.colour);
    var rows = Array.isArray(d.results) ? d.results.filter(function (r) { return r && typeof r === 'object'; }) : [];
    var tot = rows.reduce(function (a, r) { return a + (+r.votes > 0 ? +r.votes : 0); }, 0);
    var res = rows.map(function (r) {
      var pct = r.pct != null && r.pct !== '' ? +r.pct : tot && +r.votes > 0 ? +r.votes / tot * 100 : NaN;
      var lbl = String(r.party || r.name || '').trim();
      return lbl && isFinite(pct) && pct >= 0 ? { party: lbl, name: r.name ? String(r.name) : '', pct: pct, colour: ehColour(r.colour), other: !!r.other } : null;
    }).filter(Boolean);
    if (res.length) out.results = res;
    var pg = d.progress;
    if (pg && +pg.total > 0 && +pg.counted >= 0 && +pg.counted < +pg.total) out.progress = { counted: Math.round(+pg.counted), total: Math.round(+pg.total) };
    if (d.sample) out.sample = true;
    return out;
  }
  // Use my location: { muni, ward, place } as before, or just the IEC's 8-digit wardId (matched here on its first five digits).
  function ehPlace(d) {
    if (!d || typeof d !== 'object') return null;
    var place = d.place ? String(d.place) : '';
    if (d.muni) return { muni: String(d.muni), ward: d.ward, place: place, exact: !!d.exact };
    var id = String(d.wardId || '').replace(/\D/g, ''), ix = window.SA_WARD_INDEX || {};
    if (id.length !== 8) return null;
    for (var k in ix) if (ix[k] && ix[k][1] === id.slice(0, 5)) return { muni: k, ward: +id.slice(5), place: place, exact: !!d.exact };
    return null;
  }
  var EH_URL_API = {
    municipality: function (key) { return ehGet('/municipality/' + encodeURIComponent(key) + '.json'); },
    ward: function (key, wardNo, wardId) { return ehGet('/ward/' + encodeURIComponent(wardId) + '.json'); },
    locate: function (pos) { return ehGet('/locate?lat=' + (+pos.lat).toFixed(5) + '&lng=' + (+pos.lng).toFixed(5)); }
  };
  function ehApi(name) {
    var hook = window.DM_EH_API;
    if (hook && typeof hook[name] === 'function') return hook[name];
    return ehApiBase() ? EH_URL_API[name] : null;
  }
  function ehCall(name, args) {
    var fn = ehApi(name);
    if (!fn) return Promise.reject(new Error('elections API: no ' + name + '()'));
    try { return Promise.resolve(fn.apply(null, args)).then(name === 'locate' ? ehPlace : ehNorm); } catch (e) { return Promise.reject(e); }
  }
  // Ask once and, while the IEC is still counting, again every few minutes for as long as live() holds.
  // A failed repeat keeps what is on screen and tries again later.
  function ehAsk(name, args, live, onData, onFail) {
    var first = true;
    (function ask() {
      ehCall(name, args).then(function (d) {
        if (!live()) return;
        first = false;
        onData(d);
        if (d && d.progress) setTimeout(function () { if (live()) ask(); }, EH_POLL);
      }, function () {
        if (!live()) return;
        if (first) onFail(); else setTimeout(function () { if (live()) ask(); }, EH_POLL);
      });
    })();
  }

  /* ==== governing arrangements ====
     EH_GOV: the governing arrangement as carried in the v16 build (DM fact-check sheet, Sept-Oct 2026) and the mayor from the 2026 list of
     mayors (v23), by council key. "IEC data" below reads them for the black banner's governed by and mayor. */
  var EH_GOV = {"jhb":["ANC-led multi-party arrangement","Dada Morero"],"cpt":["DA majority","Geordin Hill-Lewis"],"tsh":["ActionSA-led coalition","Nasiphi Moya"],"eku":["ANC with EFF confidence-and-supply","Nkosindiphile Xhakaza"],"eth":["ANC–IFP arrangement","Cyril Xaba"],"nmb":["ANC-led coalition","Babalwa Lobishe"],"buf":["ANC majority","Princess Faku"],"man":["ANC, under s139 intervention","G Nthatisi"],"msunduzi":["ANC-led, no outright majority","Mzimkhulu Meshack Thebolla"],"polokwane":["ANC majority","Mosema John Mpe"],"rustenburg":["ANC-led coalition","Sheila Mabale-Huma"],"mbombela":["ANC majority","Sibongile Makushe"],"emalahleni":["ANC-led, no outright majority; under s139","Vusi Nhlapho"],"matlosana":["ANC majority","Fikile Caswell Mahlophe"],"solplaatje":["ANC majority","Martha Barbara Bartlett"],"stellenbosch":["DA majority","Jeremy Fasser"],"drakenstein":["DA majority","Stephen Korabie"],"george":["DA-led coalition","Browen Johnson"],"knysna":["ANC-led coalition","Thando Matika"],"bitou":["DA-led coalition","Jessica Kamkam"],"mosselbay":["DA majority","D Kotzé"],"oudtshoorn":["ANC-led coalition","M Tyatya"],"hessequa":["DA majority","Grant Riddles"],"kannaland":["ICOSA-led coalition","Jeffrey Donson"],"overstrand":["DA majority","Archie Klaas"],"capeagulhas":["DA-led coalition","Raymond Ross"],"swellendam":["DA-led, no outright majority","F du Rand"],"theewaters":["DA-led coalition","Lincoln de Bruyn"],"saldanha":["DA-led coalition","Marius Koen"],"swartland":["DA majority","John Harold Cleophas"],"bergrivier":["DA majority","Ray van Rooy"],"cederberg":["Cederberg Eerste-led coalition","Azrial Scheepers"],"matzikama":["DA-led coalition","Johan van der Hoven"],"breedevallei":["DA-led coalition","Antoinette Steyn"],"langeberg":["DA-led coalition","Schalk van Eeden"],"witzenberg":["DA, WA, WP and FF+ coalition","Trevor Abrahams"],"beaufortwest":["DA majority","Georgina Juliana Duimpies"],"laingsburg":["DA coalition with ANC and KDF","Aletta Theron"],"prinsealbert":["DA majority","Linda Jaquet"],"makana":["ANC majority","Yandiswa Vara"],"ndlambe":["ANC majority","Khululwa Celia Ncamiso"],"kouga":["DA majority","Chris Hattingh Bornman"],"ksd":["ANC majority","Goodman Nyaniso Nelani"],"mhlontlo":["ANC majority","Nompumelelo Dywili"],"emgijima":["ANC majority","Madoda Papiyana"],"inxuba":["ANC majority","Noncedo Phyllis Zonke"],"waltersisulu":["ANC majority","V Davids"],"raymondmhlaba":["ANC majority","Nomhle Sango"],"newcastle":["IFP-led coalition","David Xolani Dube"],"umhlathuze":["IFP-led coalition","Xolani Ngwezi"],"raynkonyeni":["ANC majority","P Zodwa Mzindle"],"umngeni":["DA majority","Christopher Pappas"],"endumeni":["IFP–DA coalition","Andrew Mkhize"],"ulundi":["IFP majority","Wilson Mfana Ntshangase"],"alfredduma":["IFP-led coalition","Zama Joel Sibisi"],"inkosilang":["IFP-led coalition","Mduduzi Tholumuzi Myeza"],"metsimaholo":["AIC-led coalition","Jack Malindi"],"ngwathe":["ANC majority","Victoria de Beers"],"moqhaka":["ANC-led, no outright majority","Motloheloa Ellis Mokatsane"],"dihlabeng":["ANC majority","Tseki J Tseki"],"maluti":["ANC-led coalition, under s139","Tumelo Thebe"],"matjhabeng":["ANC majority","TD Khalipa"],"mahikeng":["ANC majority","Tshepiso Mphehlo"],"jbmarks":["ANC-led coalition","Gaba Ka Qhele"],"madibeng":["ANC majority","D Maimane"],"naledi":["ANC majority","Clifton John Groep"],"ditsobotla":["ANC–EFF coalition","Thabo Nkashe"],"stevet":["ANC-led coalition","MP Masilela"],"govanmbeki":["ANC-led coalition","Nhlakanipho Zuma"],"msukaligwa":["ANC majority","MP Nkosi"],"lekwa":["ANC-led coalition","Sifiso Mngemezulu"],"bushbuckridge":["ANC majority","Lydia Matlanatso Moroane"],"tzaneen":["ANC majority","Gerson Phetole Molapisane"],"mogalakwena":["ANC majority","Ngoako Taueatsoala"],"belabela":["ANC majority","Gloria Modiegi Seleka"],"modimollemookgo":["ANC–EFF coalition","Annah Makhutuma Mboweni"],"thulamela":["ANC majority","AS Rammbuda"],"musina":["ANC majority","Nkhanedzeni Godfrey Mawela"],"baphalaborwa":["ANC majority","Makelle Merriam Malatji"],"fetakgomo":["ANC majority","Eddie Edwin Maila"],"dawidkruiper":["ANC majority","David Kazi"],"gasegonyana":["ANC majority","Neo Masegela"],"namakhoi":["DA-led coalition","Rodney Kritzinger"],"gamagara":["Hung council","Johannes James Theophelus Roman"],"emthanjeni":["ANC majority","Lulamile Gladwell Nkumbi"],"hantam":["ANC majority","Koos Alexander"],"drbeyers":["DA-led coalition","Willem Safers"],"mnquma":["ANC majority","Thunyiswa Nkamisa"],"winniemandela":["ANC majority","TD Mafumbatha"],"ingquza":["ANC majority","Prudence Pepping"],"abaqulusi":["IFP-led coalition","SE Mkhwanazi"],"kokstad":["ANC majority","Marcus Neville Lwanda Madikizela"],"umlalazi":["IFP majority","Queen Xulu"],"mtubatuba":["IFP-led coalition","Mxolisi Mthethwa"],"mkhondo":["ANC majority","Ngelosi Ndlovu"],"thembisile":["ANC majority","Lesetja Dikgale"],"lephalale":["ANC majority","Thabitha Modise"],"giyani":["ANC majority","Thandi Zitha"],"lepellenkumpi":["ANC majority","Nakedi Sibanda"],"tsantsabane":["ANC majority","Helena English"],"umsobomvu":["ANC majority","Mzwandile Simon Toto"],"phokwane":["ANC-led, no outright majority","Willem Harmse"],"setsoto":["ANC majority","Seipati Justine Mbiwe"],"nala":["ANC-led, no outright majority","Nozililo Mashiya Ntema"],"mafube":["ANC, under s139","Tlhoare Motshoeneng"],"mantsopa":["ANC majority","Mmamama Tsoene"],"emfuleni":["ANC-led, no outright majority","Sipho Radebe"],"midvaal":["DA majority","Peter John Teixeira"],"lesedi":["ANC-led, no outright majority","Mluleki Nkosi"],"mogalecity":["ANC-led, no outright majority","Lucky Sele"],"randwest":["ANC-led, no outright majority","William Matsheke"],"merafong":["ANC majority","N Best"],"sundaysriver":["ANC majority","Solwethu Lucas"],"bluecrane":["ANC-led, no outright majority","Bonisile Manxoweni"],"koukamma":["PA-led coalition","Fuzile Yake"],"amahlathi":["ANC majority","Nomakhosazana Nongqayi"],"greatkei":["ANC majority","Ngenisile Tekile"],"mbhashe":["ANC majority","Samkelo Janda"],"ngqushwa":["ANC majority","SS Maneli"],"intsikayethu":["ANC majority","Kanyiswa Mdleleni"],"emalahleniec":["ANC majority","Nontombizanele Koni"],"engcobo":["ANC majority","Siyabulela Zangqa"],"sakhisizwe":["ANC majority","B Ponoshe"],"senqu":["ANC majority","NP Mposelwa"],"elundini":["ANC majority","Mamello Leteba"],"matatiele":["ANC majority","Patrick Stuurman"],"umzimvubu":["ANC majority","Zukiswa Ndevu"],"ntabankulu":["ANC majority","Tsileng Sobuthongo"],"nyandeni":["ANC majority","Viwe Ndamase"],"portstjohns":["ANC majority","Cebisa Mazuza"],"umshwathi":["ANC majority","Geofrey Mandla Zondi"],"mpofana":["ANC majority","Thembi Maureen Magubane"],"richmondkzn":["ANC majority","Melikhaya Knowledge Ngcongo"],"mkhambathini":["ANC majority","Nhlakanipho Wiseman Ntombela"],"umdoni":["ANC-led coalition","Mbali Cele-Luthuli"],"umuziwabantu":["ANC-led coalition","LS Zungu"],"kwadukuza":["ANC-led, no outright majority","Sduduzo Gumede"],"mandeni":["ANC-led coalition","Thabani Phiwayinkosi Mdlalose"],"nkandla":["IFP majority","Nonhlanhla Fortunate Jabulisiwe Nzuza"],"mthonjaneni":["IFP majority","MN Biyela"],"nongoma":["IFP majority","Mbekezeli Emmanuel Zondo"],"uphongolo":["IFP-led, no outright majority","Bhekinkosi Thwala"],"jozini":["IFP majority","Nkosinathi Sicelo Myeni"],"bigfive":["IFP majority","Comfort Thembitshe Khumalo"],"okhahlamba":["APM-led coalition","Vikizitha Richard Mlotshwa"],"nquthu":["IFP majority","Innocent Lindokuhle Shabalala"],"msinga":["IFP majority","Felinkosi Joshua Skhakhane"],"umvoti":["ANC and ABC alliance governs","Gabriel Zamani Malembe"],"dannhauser":["ANC-led, no outright majority","Bongani A Hadebe"],"umzimkhulu":["ANC majority","Jabulile Msiya"],"ubuhlebezwe":["ANC majority","Elizabeth Bathobile Ngubo"],"kwasani":["ANC majority","Precious Sindisiwe Msomi"],"nketoana":["ANC majority","Godfrey Nhlapo"],"phumelela":["ANC majority","MD Kobeni"],"tswelopele":["ANC majority","Kenalemang R Phukuntsi"],"masilonyana":["ANC majority","Dimakatso E Modise"],"mohokare":["ANC majority","Teboho Mochechepa"],"kopanong":["ANC majority","Tsotetsi Lele"],"letsemeng":["ANC majority","Reamogetse Bonolo Mocwaledi"],"moseskotane":["ANC majority","Nketu Nkotswe"],"kgetlengrivier":["ANC majority","Canney Thabo Jacobs"],"moretele":["ANC majority","G Manyike"],"ramotshere":["ANC majority","DM Pitso"],"tswaing":["ANC majority","Norah Mahlangu"],"greatertaung":["ANC majority","Tumisang Gaoraelwe"],"lekwateemane":["ANC-led, no outright majority","Sebang Motlhabi"],"mamusa":["ANC majority","M Chelechele"],"maquassi":["Hung council","Mzwandile Feliti"],"emakhazeni":["ANC majority","Nomhle A Mashele"],"victorkhanye":["ANC majority","Kleinbooi Vusi Buda"],"jsmoroka":["ANC majority","Nomsa Sainy Mtsweni"],"dipaleseng":["ANC majority","Nomacala Beryl Khanye"],"albertluthuli":["ANC majority","MP Magubane"],"nkomazi":["ANC majority","Phindile Magagula"],"thabachweu":["ANC majority","Mogotle Friddah Nkadimeng"],"makhado":["ANC majority","MD Mboyi"],"collinschabane":["ANC majority","Gezani Shadrack Maluleke"],"greaterletaba":["ANC majority","Thamaga Dagma Mamanyoha"],"maruleng":["ANC majority","Tsheko Mosolwa"],"molemole":["ANC majority","Masilo Edward Paya"],"blouberg":["ANC majority","M Thamaga"],"eliasmotsoaledi":["ANC majority","Magetle Tladi"],"makhuduthamaga":["ANC majority","Merah Mahlase"],"ephraimmogale":["ANC majority","Given Marasekeng Hlalithi Moimana"],"thabazimbi":["ANC-led coalition","Tumisang Jacob Pilane"],"kareeberg":["ANC-led, no outright majority","Rodney Jikella"],"ubuntu":["ANC majority","Charlene Cheryl Jantjies"],"siyancuma":["ANC in coalition with DA","Patrick McKlein"],"siyathemba":["ANC majority","Johan Andrew Phillips"],"renosterberg":["ANC majority","Andrew Samson"],"thembelihle":["ANC–Siyathemba Community Movement coalition","Marnus Visser"],"kaigarib":["ANC majority","Marshall Matthys"],"kheis":["ANC majority","Davy Jacobs"],"kgatelopele":["ANC-led, no outright majority","Irene Williams"],"dikgatlong":["ANC majority","Dimakatso Dorothy Mbizeni"],"magareng":["ANC majority","Neo Mase"],"karoohoogland":["ANC-led, no outright majority","Vincent Opperman"],"kamiesberg":["ANC majority","Susarah Nero"],"richtersveld":["ANC majority","Cornell Charvette Knoph"],"khaima":["ANC majority","EP Cloete"],"joemorolong":["ANC majority","Dineo Doris Leutlwetse-Tshabalala"],"maphumulo":["ANC-led, no outright majority","Zibuyile Fortunate Khuzwayo-Dlamini"],"ratlou":["ANC majority","Matlhomola Ronald Jafta"],"kagisanomolopo":["ANC majority","Diphikwe Mosimanegape"],"edumbe":["NFP-led coalition","MS Mkhabela"],"mfolozi":["IFP majority","Xolani Michael Bhengu"],"umhlabuyalingana":["ANC-led, no outright majority","Thembinkosi Sibusiso Khumalo"],"tokologo":["ANC majority","Boitumelo Enoch Seakge"],"ndwedwe":["ANC majority","Samuel Zwengithini Mfeka"],"impendle":["ANC majority","Kwenzakufani Melchor Dlamini"],"emadlangeni":["IFP-led, no outright majority","Mzwakhe Lawrence Buthelezi"],"umzumbe":["Hung council","Bongani Goodman Nyuswa"],"pixleymp":["ANC majority","BJ Mhlanga"]};

  /* ==== graphics library v3 · the feed's maps ====
     The council, province and ward outlines come from the RevEngine IEC service's maps, the service the results come from, in place of the
     Municipal Demarcation Board's map services (services7.arcgis.com), which now stand in only when a map can't be read from the feed:
       {maps}/2026/national.json                  the provinces' outlines (Province)
       {maps}/2026/provinces/{slug}.json          a province's metro and local councils (MunicCode, Municipali)
       {maps}/2026/municipalities/{code}.json     a council's wards (WardId)
       {maps}/2021/voting-districts/{code}.json   a council's 2021 voting districts (WardId), put together into its 2021 wards here
     {maps}: data-results on #dm-eh with /maps in place of /local, so https://iec-api.revengine.dailymaverick.co.za/maps. GeoJSON in longitude
     and latitude (a Polygon's rings are the MDB's rings). Each file is read once a visit. */
  function ehMapsBase() {
    var root = document.getElementById('dm-eh');
    return String((root && root.getAttribute('data-results')) || 'https://iec-api.revengine.dailymaverick.co.za/local').trim().replace(/\/+$/, '').replace(/\/local$/, '') + '/maps';
  }
  var ehMapCache = {};
  function ehMapJSON(path) {
    var url = ehMapsBase() + path, hit = ehMapCache[url];
    if (hit) return hit;
    var p = new Promise(function (resolve, reject) {
      if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 20 s')); }, 20000);
      fetch(url, { credentials: 'omit', signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { clearTimeout(timer); if (!d || !Array.isArray(d.features)) throw new Error('no features'); resolve(d); })
        .catch(function (e) { clearTimeout(timer); reject(e); });
    });
    ehMapCache[url] = p;
    p.catch(function (e) { if (ehMapCache[url] === p) delete ehMapCache[url]; if (window.console) console.warn('[elections-hub] map ' + url + ': ' + ((e && e.message) || e)); });
    return p;
  }
  function ehRings(g) {   // a GeoJSON geometry's rings: a Polygon's, or every polygon's in a MultiPolygon
    if (!g || !g.coordinates) return [];
    return g.type === 'Polygon' ? g.coordinates : g.type === 'MultiPolygon' ? [].concat.apply([], g.coordinates) : [];
  }
  // a council's code in the feed's maps from its ward ID prefix: a metro's by its key, a local council's from the prefix itself (province
  // digit, district, 0, council: 10204 is WC024, 74201 GT421, 93504 LIM354)
  var EH_METRO_CODE = { buf: 'BUF', nmb: 'NMA', man: 'MAN', eku: 'EKU', jhb: 'JHB', tsh: 'TSH', eth: 'ETH', cpt: 'CPT' };
  var EH_PROV_DIGIT = { 1: 'WC', 2: 'EC', 3: 'NC', 4: 'FS', 5: 'KZN', 6: 'NW', 7: 'GT', 8: 'MP', 9: 'LIM' };
  function ehFeedCode(pre) {
    pre = String(pre || '');
    if (!/^\d{5}$/.test(pre)) return '';
    var W = window.SA_WARD_INDEX || {};
    for (var k in EH_METRO_CODE) if (W[k] && String(W[k][1]) === pre) return EH_METRO_CODE[k];
    return EH_PROV_DIGIT[pre.charAt(0)] && pre.charAt(3) === '0' ? EH_PROV_DIGIT[pre.charAt(0)] + pre.slice(1, 3) + pre.charAt(4) : '';
  }
  // a council's 2021 wards from its 2021 voting districts: a ward's outline is the edges of its districts that no other district of the ward
  // shares (neighbouring districts share their points exactly); a ward whose edges don't close into rings keeps its districts' outlines
  function ehWardsFromVDs(features) {
    var by = {}, order = [];
    (features || []).forEach(function (f) {
      var id = String((f.properties || {}).WardId || '');
      if (id.length < 6) return;
      if (!by[id]) { by[id] = []; order.push(id); }
      Array.prototype.push.apply(by[id], ehRings(f.geometry));
    });
    return order.map(function (id) { return { id: id, rings: ehDissolve(by[id]) }; });
  }
  function ehDissolve(rings) {
    if (rings.length < 2) return rings;
    var n = {}, edges = [], from = {}, out = [], i, j, r, a, b, u, s, e, nx, ring, steps;
    function pk(p) { return p[0] + ',' + p[1]; }
    for (j = 0; j < rings.length; j++) {
      r = rings[j];
      for (i = 0; i < r.length - 1; i++) {
        a = pk(r[i]); b = pk(r[i + 1]);
        if (a === b) continue;
        u = a < b ? a + '|' + b : b + '|' + a;
        n[u] = (n[u] || 0) + 1;
        edges.push({ a: a, b: b, p: r[i], u: u });
      }
    }
    edges.forEach(function (x) { if (n[x.u] === 1) (from[x.a] = from[x.a] || []).push(x); });
    for (s in from) {
      while (from[s].length) {
        e = from[s].pop(); ring = [e.p]; steps = edges.length;
        while (e.b !== s) {
          nx = from[e.b];
          if (!nx || !nx.length || !steps--) return rings;
          e = nx.pop(); ring.push(e.p);
        }
        ring.push(ring[0]);
        if (ring.length >= 4) out.push(ring);
      }
    }
    return out.length ? out : rings;
  }

  function guard(name, fn) {
    try { fn(); } catch (e) { if (window.console) console.error('[elections-hub] ' + name + ' failed:', e); }
  }
  function run() {

/* ==== shared helpers ==== */
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// post-elections v23.38 · the results tabs' maps on a touch screen: a council's tooltip stays up after a tap, with this button to open its file
function tipGo(k) { return '<button type="button" class="res-tip-go" data-go="' + esc(k) + '">Go to municipality</button>'; }
function tapPtr(t) { return t === 'touch' || t === 'pen'; }
// client px to a drawing's units, or (out) back
function svgPt(svg, x, y, out) { var m = svg && svg.getScreenCTM && svg.getScreenCTM(), p; if (!m) return null; p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(out ? m : m.inverse()); }
// One dot-point row of an explainer list.
function li(color, bold, rest) {
  return '<li><span class="mf-resp-dot" style="background:' + color + '"></span>' +
    '<span class="mf-resp-txt"><b>' + bold + '</b>' + rest + '</span></li>';
}
// Small ballot-paper icon; the ink and gold headers print lighter on the paper.
var BALLOT_FILL = { '#6b6b66': '#a8a8a3', '#946800': '#e2a91c' };
function ballotPaper(color, cls) {
  return '<div class="mf-ballot-paper' + (cls ? ' ' + cls : '') + '">' +
      '<div class="mf-ballot-hd" style="background:' + (BALLOT_FILL[color] || color) + '"></div>' +
      '<div class="mf-ballot-body">' +
        '<div class="mf-ballot-line marked"><span class="nm"></span><span class="bx"></span></div>' +
        '<div class="mf-ballot-line"><span class="nm"></span><span class="bx"></span></div>' +
      '</div>' +
    '</div>';
}
// Explainer dialog (.mf-modal). closeAttr marks its close controls; restore puts focus back on close.
function modal(id, closeAttr, restore) {
  var el = document.getElementById(id), body = el.querySelector('.mf-modal-body');
  var dialog = el.querySelector('[role="dialog"]'), last = null;
  function close() {
    el.hidden = true;
    document.body.style.overflow = '';
    if (restore && last && last.focus) last.focus();
  }
  el.addEventListener('click', function (e) { if (e.target.closest('[' + closeAttr + ']')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.hidden) close(); });
  return {
    el: el,
    close: close,
    open: function (html, label) {
      last = document.activeElement;
      if (label) dialog.setAttribute('aria-label', label);
      body.innerHTML = html;
      el.hidden = false;
      document.body.style.overflow = 'hidden';
      var x = el.querySelector('.mf-modal-x');
      if (x) x.focus();
    }
  };
}

/* ==== dm-feed.js ==== */
guard("dm-feed.js", function () {
// Daily Maverick story feeds for the Elections Hub, read from dailymaverick.co.za only.
// The hub is served from the same site, so no proxy or third-party service is involved.
// DMFeed.tag(slug, done) calls done(items) once per slug: [{ headline, byline, href, img, blurb }], or null.
(function () {
  'use strict';

  var SITE = /(^|\.)dailymaverick\.co\.za$/i.test(location.hostname) ? location.origin : 'https://www.dailymaverick.co.za';

  // Tag RSS feed, once dev adds one in the same format as /rss/category/{slug}/, e.g. '/rss/tag/{slug}/?limit=50'.
  // /rss/category/{slug}/ covers sections only (local-elections-2026 returns an empty channel),
  // so until this is set each tag is read from its tag page, /article_tag/{slug}/.
  var TAG_RSS = '';

  var store = {};

  // Off dailymaverick.co.za (previews only) the browser blocks direct reads, so fall back to public read-through routes.
  // On the live site ON_DM is true and only the direct request is made.
  var ON_DM = SITE === location.origin;
  var ROUTES = ON_DM ? [function (u) { return u; }] : [
    function (u) { return 'https://r.jina.ai/' + u; },
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }
  ];
  function get(url, parse, done) {
    (function attempt(i) {
      if (i >= ROUTES.length) return done(null);
      getOnce(ROUTES[i](url), url, parse, function (items) {
        if (items && items.length) done(items); else attempt(i + 1);
      });
    })(0);
  }
  function getOnce(url, base, parse, done) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    var opts = { credentials: 'omit', signal: ctl ? ctl.signal : undefined };
    if (/^https:\/\/r\.jina\.ai\//.test(url)) opts.headers = { 'X-Return-Format': 'html' };
    fetch(url, opts)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (txt) {
        clearTimeout(timer);
        var items = null;
        try { items = parse(txt, base); } catch (e) {}
        done(items);
      })
      .catch(function () { clearTimeout(timer); done(null); });
  }

  function val(el, name) {
    var n = el.getElementsByTagName(name)[0];
    return n ? (n.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  // Feed titles carry the kicker ("ANALYSIS: ..."); the hub's cards show the headline alone.
  function headline(t) {
    var m = /^([^a-z:]{5,60}?)\s*:\s+(?=\S)/.exec(t);
    return m && /[A-Z]{3}/.test(m[1]) ? t.slice(m[0].length) : t;
  }

  function parseRss(txt) {
    var doc = new DOMParser().parseFromString(txt, 'text/xml');
    if (!doc.getElementsByTagName('channel').length) return null;
    var out = [];
    Array.prototype.forEach.call(doc.getElementsByTagName('item'), function (it) {
      var t = val(it, 'title'), link = val(it, 'link');
      if (!t || !link) return;
      var by = val(it, 'author') || val(it, 'dc:creator');
      var enc = it.getElementsByTagName('enclosure')[0];
      out.push({
        headline: headline(t), byline: by ? 'By ' + by : '', href: link,
        img: enc ? enc.getAttribute('url') || '' : '',
        blurb: val(it, 'description')
      });
    });
    return out;
  }

  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

  // Text pieces of a card, in order. An element with its own text is one piece, unless it also holds
  // block elements, in which case its parts are read separately.
  var SKIP = /^(SCRIPT|STYLE|NOSCRIPT|SVG|TEMPLATE|BUTTON)$/i;
  var BLOCKS = 'div,p,h1,h2,h3,h4,h5,h6,ul,ol,li,section,article,header,footer,figure,figcaption,time,br';
  function pieces(root) {
    var out = [];
    (function walk(el) {
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType === 3) { var s = norm(n.nodeValue); if (s) out.push(s); return; }
        if (n.nodeType !== 1 || SKIP.test(n.tagName)) return;
        var own = Array.prototype.some.call(n.childNodes, function (c) { return c.nodeType === 3 && norm(c.nodeValue); });
        if (own && !n.querySelector(BLOCKS)) { var t = norm(n.textContent); if (t) out.push(t); }
        else walk(n);
      });
    })(root);
    return out;
  }

  var RE_TIME = /^\d+\s*(min|mins|minutes?)(\s+read)?$/i, RE_NUM = /^\d+$/;
  var RE_BY = /^By(\s+[A-Z\u00C0-\u00DE]|$)/, RE_DATE = /^\d{1,2}\s+[A-Za-z]{3,9}\.?\s+\d{4}$/;
  function key(s) { return norm(s).toLowerCase().replace(/[^a-z0-9\u00e0-\u024f]+/g, ''); }
  function isCaps(s) { return /[A-Z]/.test(s) && s === s.toUpperCase(); }
  function isName(s) { return !isCaps(s) && /^[A-Z\u00C0-\u00DE][^\s\d]*(\s+[A-Z\u00C0-\u00DE][^\s\d]*){1,3}$/.test(s); }

  // A tag-page card holds, in order: kicker label(s) (a series name, "ANALYSIS", or the columnist's name
  // on opinion pieces), the headline, reading time ("6 min"), comment count, then the byline.
  // Keep the headline and byline; drop the rest.
  function cardText(a, href) {
    var img = a.querySelector('img');
    var alt = img ? norm(img.getAttribute('alt')) : '';
    var p = pieces(a), cut = -1, i;
    for (i = 0; i < p.length && cut < 0; i++) if (RE_TIME.test(p[i])) cut = i;
    for (i = 0; i < p.length && cut < 0; i++) if (RE_BY.test(p[i])) cut = i;
    var head = cut >= 0 ? p.slice(0, cut) : p.slice(), tail = cut >= 0 ? p.slice(cut) : [];
    var by = '';
    head = head.filter(function (s) {
      if (RE_BY.test(s)) { if (!by) by = s; return false; }
      return !RE_NUM.test(s) && !RE_TIME.test(s);
    });
    var bits = tail.filter(function (s) {
      if (RE_DATE.test(s)) return false;
      return !RE_NUM.test(s) && !RE_TIME.test(s);
    });
    if (!by) by = norm(bits.join(' '));
    if (by && !RE_BY.test(by)) by = /^[A-Z\u00C0-\u00DE]/.test(by) && by.length < 80 ? 'By ' + by : '';

    // Headline: the piece the image alt repeats (when the alt reads like a headline), else the longest piece.
    var hl = '', ak = key(alt);
    if (alt.length >= 25 && !isName(alt)) head.forEach(function (s) { if (!hl && key(s) === ak) hl = s; });
    if (!hl) {
      var best = -1;
      head.forEach(function (s) { var sc = isCaps(s) ? s.length / 2 : s.length; if (sc > best) { best = sc; hl = s; } });
    }
    if (!hl && alt.length >= 25 && !isName(alt)) hl = alt;
    var rest = head.filter(function (s) { return s !== hl; });

    // Safety net for cards that come through as one run of text.
    var m = /^(.*?)\s+\d+\s*mins?\b(?:\s+\d+)?\s+(By\s.+)$/i.exec(hl);
    if (m) {
      hl = m[1]; if (!by) by = m[2];
      var k = /^((?:[A-Z0-9#+&'\u2019.-]+\s+)+)(?=[A-Z\u2018\u201c"'][a-z])/.exec(hl);
      if (k) {
        var run = k[1].trim().split(/\s+/);
        while (run.length && run[run.length - 1].length <= 3) run.pop();
        var c = run.join(' ');
        if (c.length >= 4 && hl.indexOf(c + ' ') === 0 && hl.length - c.length > 20) hl = hl.slice(c.length + 1);
      }
    }
    if (alt.length >= 25 && hl.length > alt.length && hl.slice(-alt.length) === alt) hl = alt;

    // Opinion cards can carry the columnist as the kicker instead of a byline.
    if (!by && /\/opinionista\//.test(href || '')) {
      for (i = rest.length - 1; i >= 0 && !by; i--) if (isName(rest[i])) by = 'By ' + rest[i];
    }
    return { hl: hl, by: by.replace(/\s+\d+$/, '') };
  }

  // Tag page: the story cards are the links carrying "blocks-grid".
  function parsePage(txt, base) {
    var doc = new DOMParser().parseFromString(txt, 'text/html');
    if (!/Daily Maverick/i.test(doc.title || '')) return null;
    var seen = {}, out = [];
    Array.prototype.forEach.call(doc.querySelectorAll('a[href*="blocks-grid"]'), function (a) {
      var href = a.getAttribute('href') || '';
      if (!/\/(article|opinionista|video)\//.test(href)) return;
      var k = href.split('?')[0];
      if (seen[k]) return;
      var ct = cardText(a, k), hl = ct.hl, by = ct.by;
      if (!hl || hl.length < 16 || (isCaps(hl) && hl.length < 40)) return;
      var img = a.querySelector('img');
      seen[k] = 1;
      out.push({
        headline: hl, byline: by, href: new URL(k, base).href,
        img: imgSrc(img, base),
        blurb: ''
      });
    });
    return out;
  }

  function imgSrc(img, base) {
    if (!img) return '';
    var s = img.getAttribute('data-src') || img.getAttribute('src') || '';
    if (!s || /^data:/.test(s)) { var ss = img.getAttribute('srcset') || img.getAttribute('data-srcset') || ''; s = ss.split(',')[0].trim().split(' ')[0]; }
    try { return s ? new URL(s, base).href : ''; } catch (e) { return ''; }
  }

  // One request per tag per page view; blocks that share a tag share the result.
  function tag(slug, done) {
    var s = store[slug];
    if (s && s.ready) return done(s.items);
    if (s) { s.queue.push(done); return; }
    s = store[slug] = { queue: [done] };
    function finish(items) {
      s.ready = true;
      s.items = items && items.length ? items : null;
      s.queue.splice(0).forEach(function (f) { f(s.items); });
    }
    function page() { get(SITE + '/article_tag/' + encodeURIComponent(slug) + '/', parsePage, finish); }
    if (TAG_RSS) {
      get(SITE + TAG_RSS.replace('{slug}', encodeURIComponent(slug)), parseRss, function (items) {
        if (items && items.length) finish(items); else page();
      });
    } else page();
  }

  // Later pages of a tag, for the Latest Election Coverage "Load More": page(slug, n, done), n = 2, 3, ...
  // calls done(items), or null when there is no such page. The site's paging URL is tried in each form below
  // on page 2, and the first that returns stories not on page 1 is kept. If none does, the feed ends at page 1.
  // Dev: once the tag page's own "Load More" source is confirmed, list only that form here.
  var TAG_PAGES = ['/article_tag/{slug}/?page={n}', '/article_tag/{slug}/page/{n}/'];
  var pageForm = -1;

  function page(slug, n, done) {
    var first = {};
    ((store[slug] && store[slug].items) || []).forEach(function (a) { first[a.href] = 1; });
    function fresh(items) { return items && items.some(function (a) { return !first[a.href]; }) ? items : null; }
    function url(i) { return SITE + TAG_PAGES[i].replace('{slug}', encodeURIComponent(slug)).replace('{n}', n); }
    if (pageForm >= 0) return get(url(pageForm), parsePage, function (items) { done(fresh(items)); });
    (function attempt(i) {
      if (i >= TAG_PAGES.length) return done(null);
      get(url(i), parsePage, function (items) {
        if (fresh(items)) { pageForm = i; done(items); } else attempt(i + 1);
      });
    })(0);
  }

  window.DMFeed = { tag: tag, page: page };
})();
});

/* ==== video players ==== */
guard("video players", function () {
// YouTube: each .eh-vid ships as a thumbnail link; clicking swaps in the player.
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('#dm-eh .eh-vid[data-yt]'), function (box) {
    var link = box.querySelector('.eh-vid-link');
    if (!link) return;
    link.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + box.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = box.getAttribute('data-title') || 'Video';
      f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      f.setAttribute('allowfullscreen', '');
      box.replaceChild(f, link);
    });
  });
})();
});

/* ==== Manifesto Breakdowns feed ==== */
guard("Manifesto Breakdowns feed", function () {
    (function () {
      'use strict';
      var SWATCH = ['#8697AC','#9A9BB5','#B9AE9B','#9DB596','#C6B08C','#A8A487','#DE6A4E','#7F8CA0'];

      // Snapshot of the tag as at 22 September 2026, shown until the live read from dailymaverick.co.za arrives.
      var FALLBACK = [
        { headline:'Manifesto Test \u2014 UDM promises to maintain, maintain, maintain!', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-09-04-manifesto-test-udm-promises-to-maintain-maintain-maintain/' },
        { headline:'ANC manifesto: Good to look at, nice to read \u2014 but hard to believe', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-08-26-anc-manifesto-good-to-look-at-nice-to-read-but-hard-to-believe/' },
        { headline:'Manifesto test: SACP\u2019s power to the people and a working class embraced', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-08-23-manifesto-test-sacp-s-power-to-the-people-and-a-working-class-embraced/' },
        { headline:'Watch \u2013 Manifesto test: The revolution promised, the record questioned', byline:'By Ferial Haffajee and Lerato Mutsila', href:'https://www.dailymaverick.co.za/video/2026-08-19-watch-manifesto-test-the-revolution-promised-the-record-questioned/' },
        { headline:'Manifesto test: The revolution promised, the record questioned', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-08-10-manifesto-test-the-revolution-promised-the-record-questioned/' },
        { headline:'New rule: DA will ringfence water, electricity revenue for services', byline:'By Reitumetse Pilane and Mabatho Marakalla', href:'https://www.dailymaverick.co.za/article/2026-08-08-new-rule-da-will-ringfence-water-electricity-revenue-for-services/' },
        { headline:'FF+ manifesto \u2014 Cape Exit, guns and community councils', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2024-03-18-https-www-dailymaverick-co-za-article-2024-03-17-ff-manifesto-cape-exit-guns-and-community-councils/' }
      ];

      var $grid = document.getElementById('eh-feed-grid');
      if (!$grid) return;

      function card(a, i) {
        var thumb = a.img
          ? '<span class="thumb" style="background-image:url(' + esc(a.img) + ')"></span>'
          : '<span class="thumb" style="background-color:' + SWATCH[i % SWATCH.length] + '"></span>';
        return '<a class="eh-feed-card" href="' + esc(a.href) + '" target="_blank" rel="noopener">' +
            '<span class="txt">' +
              '<span class="hl">' + esc(a.headline) + '</span>' +
              '<span class="by">' + esc(a.byline) + '</span>' +
            '</span>' + thumb +
          '</a>';
      }

      function render(items) {
        $grid.innerHTML = items.map(card).join('');
      }

      // Headlines starting with "Watch" are video duplicates; the section embeds the videos separately.
      function notWatch(a) { return !/^\s*watch\b/i.test(a.headline || ''); }
      render(FALLBACK.filter(notWatch));

      // Live read from dailymaverick.co.za (dm-feed.js). The snapshot stays if the site can't be reached.
      if (window.DMFeed) window.DMFeed.tag('manifesto-test', function (items) {
        var list = (items || []).filter(function (a) { return /\/(article|video)\//.test(a.href) && notWatch(a); });
        if (list.length >= 3) render(list.slice(0, 12));
      });
    })();
});

/* ==== Latest Election Coverage feed ==== */
guard("Latest Election Coverage feed", function () {
    // Latest Election Coverage — re-reads the local-elections-2026 tag on every page load.
    // Nine stories to start; "Load More" adds six at a time, reading further tag pages until they run dry.
    (function () {
      'use strict';
      var SLUG = 'local-elections-2026';
      var FIRST = 9, STEP = 6;
      var SWATCH = ['#7F8CA0','#B9AE9B','#9DB596','#DE6A4E','#9A9BB5','#C6B08C','#A8A487','#8697AC'];

      // Snapshot of the tag as at 27 September 2026 — shown instantly, then replaced by the live pull.
      var FALLBACK = [
        { headline:'Freedom from the ANC could be our real emancipation', byline:'By Bhekisisa Mncube', href:'https://www.dailymaverick.co.za/opinionista/2026-09-25-freedom-from-the-anc-could-be-our-real-emancipation-1/' },
        { headline:'Windbag Mbalula\u2019s stupidity is emblematic of the ANC\u2019s plunge into ignominy', byline:'By Mondli Makhanya', href:'https://www.dailymaverick.co.za/article/2026-09-21-windbag-mbalulas-stupidity-is-emblematic-of-the-ancs-plunge-into-ignominy/' },
        { headline:'Kenny Kunene tells Joburg, \u2018God gives light during the day; I will at night\u2019', byline:'By Bheki C. Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-20-kenny-kunene-tells-joburg-god-gives-light-during-the-day-i-will-at-night/' },
        { headline:'FF Plus stands by its man as mayoral candidate\u2019s apartheid-era murder conviction resurfaces', byline:'By Kyran Blaauw', href:'https://www.dailymaverick.co.za/article/2026-09-20-ff-plus-stands-by-its-man-as-mayoral-candidates-apartheid-era-murder-conviction-resurfaces/' },
        { headline:'The Monday Cane \u2014 performative justice that prioritises retribution over protection', byline:'By Themba Dlamini', href:'https://www.dailymaverick.co.za/opinionista/2026-09-18-the-monday-cane-performative-justice-that-prioritises-retribution-over-protection/' },
        { headline:'ANC election-list war heats up as Eastern Cape secretary threatens to sue Fikile Mbalula', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-17-anc-election-list-war-heats-up-as-eastern-cape-secretary-threatens-to-sue-fikile-mbalula/' },
        { headline:'SA\u2019s young voters are not apathetic, they are auditing an unresponsive democracy', byline:'By Themba Dlamini', href:'https://www.dailymaverick.co.za/opinionista/2026-09-16-sas-young-voters-are-not-apathetic-they-are-auditing-an-unresponsive-democracy/' },
        { headline:'If Zuma\u2019s MK is knocking on KZN\u2019s door, will eThekwini open it?', byline:'By Greg Ard\u00e9', href:'https://www.dailymaverick.co.za/article/2026-09-16-if-zumas-mk-is-knocking-on-kzns-door-will-ethekwini-open-it/' },
        { headline:'IEC finalises ballot while ANC faces exclusion in six municipalities', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-16-iec-finalises-ballot-while-anc-faces-exclusion-in-six-municipalities/' },
        { headline:'ANC to \u2018exercise its legal rights\u2019 after Electoral Court dismisses candidate list case', byline:'By Nonkululeko Njilo', href:'https://www.dailymaverick.co.za/article/2026-09-16-anc-vows-to-exercise-legal-rights-after-losing-bid-to-reinstate-181-poll-candidates/' },
        { headline:'Want our votes? Adopt our Rebuild Plan, NMB civil society tells political parties', byline:'By Kyran Blaauw', href:'https://www.dailymaverick.co.za/article/2026-09-15-want-our-votes-adopt-our-rebuild-plan-nmb-civil-society-tells-political-parties/' },
        { headline:'ANC list fight reveals rise of federal power blocs', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-09-14-anc-list-fight-reveals-rise-of-federal-power-blocs/' },
        { headline:'Where is Paul Mashatile, and does the vanishing deputy act threaten his presidential ambitions?', byline:'By Stephen Grootes', href:'https://www.dailymaverick.co.za/article/2026-09-13-where-is-paul-mashatile-and-does-the-vanishing-deputy-act-threaten-his-presidential-ambitions/' },
        { headline:'Zille draws coalition red lines as DA targets Joburg majority', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-13-zille-draws-coalition-red-lines-as-da-targets-joburg-majority/' },
        { headline:'IEC audit trail challenges ANC\u2019s claim of technical problems', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-11-iec-audit-trail-challenges-ancs-claim-of-technical-problems/' },
        { headline:'Should the Electoral Commission bend the rules when parties fail to comply?', byline:'By Dhaya Pillay', href:'https://www.dailymaverick.co.za/opinionista/2026-09-09-should-the-electoral-commission-bend-the-rules-when-parties-fail-to-comply/' },
        { headline:'An ANC candidate list blunder could cost the party in the Eastern Cape', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-09-mbalula-defends-ancs-candidate-list-blunder-as-electoral-court-battle-looms/' },
        { headline:'ANC\u2019s \u2018purge without a plan\u2019 may create the opposition it fears', byline:'By Nyasha Mpani', href:'https://www.dailymaverick.co.za/opinionista/2026-09-06-ancs-purge-without-a-plan-may-create-the-opposition-it-fears/' },
        { headline:'Ramaphosa defends ANC\u2019s late election candidate lists as party considers court action', byline:'By Lunga Simelane', href:'https://www.dailymaverick.co.za/article/2026-09-04-anc-list-glitches-are-containable-but-partys-considering-court-action-says-ramaphosa/' },
        { headline:'Manifesto Test \u2014 UDM promises to maintain, maintain, maintain!', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-09-04-manifesto-test-udm-promises-to-maintain-maintain-maintain/' },
        { headline:'ANC and DA in dead heat across key metros as MK dominates eThekwini', byline:'By Ferial Haffajee', href:'https://www.dailymaverick.co.za/article/2026-09-04-anc-and-da-in-dead-heat-across-key-metros-as-mk-dominates-ethekwini/' }
      ];

      var $grid = document.getElementById('eh-live-grid');
      var $more = document.getElementById('eh-live-more');
      var $btn = $more && $more.querySelector('button');
      if (!$grid) return;

      var pool = [], seen = {}, shown = 0, drawn = 0, next = 2;
      var live = false, dry = false, busy = false, want = false;

      function card(a, i) {
        var thumb = a.img
          ? 'url(' + esc(a.img) + ') center/cover no-repeat'
          : SWATCH[i % SWATCH.length];
        var op = /\/opinionista\//.test(a.href || '');
        return '<a class="mf-story' + (op ? ' is-op' : '') + '" href="' + esc(a.href) + '" target="_blank" rel="noopener">' +
            (op ? '<div class="thumb thumb-op"><span class="op-face" style="background:' + thumb + '"></span></div>'
                : '<div class="thumb" style="background:' + thumb + '"></div>') +
            '<h4>' + esc(a.headline) + '</h4>' +
            '<p class="byline">' + esc(a.byline) + '</p>' +
          '</a>';
      }

      // Adds the stories not already in the pool; returns how many were new.
      function add(items) {
        var n = 0;
        (items || []).forEach(function (a) {
          var k = String(a.href || '').split('?')[0];
          if (!k || seen[k]) return;
          seen[k] = 1; pool.push(a); n++;
        });
        return n;
      }

      function paint(full) {
        if (full || drawn > shown) $grid.innerHTML = pool.slice(0, shown).map(card).join('');
        else if (drawn < shown) $grid.insertAdjacentHTML('beforeend',
          pool.slice(drawn, shown).map(function (a, j) { return card(a, drawn + j); }).join(''));
        drawn = shown;
        if ($more) $more.hidden = !(shown < pool.length || (live && !dry));
        if ($btn) { if (want) $btn.setAttribute('aria-busy', 'true'); else $btn.removeAttribute('aria-busy'); }
      }

      function reveal() {
        want = false;
        shown = Math.min(pool.length, shown + STEP);
        paint();
        topUp();
      }

      // Keeps two batches in hand: reads the next tag page once fewer are waiting.
      // A page that adds nothing new means the tag has run dry, and the button goes.
      function topUp() {
        if (!live || dry || busy || pool.length - shown >= STEP * 2) return;
        busy = true;
        window.DMFeed.page(SLUG, next, function (items) {
          busy = false;
          if (add(items)) next++; else dry = true;
          if (want) reveal(); else { paint(); topUp(); }
        });
      }

      if ($btn) $btn.addEventListener('click', function () {
        if (want) return;
        if (pool.length - shown >= STEP || !live || dry) return reveal();
        want = true;
        paint();
        topUp();
      });

      add(FALLBACK);
      shown = Math.min(pool.length, FIRST);
      paint(true);

      // Live read from dailymaverick.co.za on every page load (dm-feed.js). The snapshot stays if the site can't be reached.
      if (window.DMFeed) window.DMFeed.tag(SLUG, function (items) {
        if (!items || items.length < 3) return;
        pool = []; seen = {};
        add(items);
        live = true;
        dry = !window.DMFeed.page;
        shown = Math.min(pool.length, Math.max(shown, FIRST));
        paint(true);
        topUp();
      });
    })();
});

/* ==== datasets ==== */
guard("datasets", function () {
window.SA_PROVINCES = {GP: "Gauteng", WC: "Western Cape", KZN: "KwaZulu-Natal", EC: "Eastern Cape", FS: "Free State", NW: "North West", MP: "Mpumalanga", LP: "Limpopo", NC: "Northern Cape"};

/* Municipalities (metros and locals), keyed as used across every dataset below.
   n name · t type · p province · dm district · was former name(s), "|"-separated when councils merged (Ingwe|KwaSani)
   Districts are built from dm further down; population and audit outcomes are added from their own datasets. */
window.SA_MUNIS = {
  jhb: {n: "City of Johannesburg", t: "Metropolitan", p: "GP"},
  cpt: {n: "City of Cape Town", t: "Metropolitan", p: "WC"},
  tsh: {n: "City of Tshwane", t: "Metropolitan", p: "GP"},
  eku: {n: "City of Ekurhuleni", t: "Metropolitan", p: "GP"},
  eth: {n: "eThekwini Metro", t: "Metropolitan", p: "KZN"},
  nmb: {n: "Nelson Mandela Bay Metro", t: "Metropolitan", p: "EC"},
  buf: {n: "Buffalo City Metro", t: "Metropolitan", p: "EC"},
  man: {n: "Mangaung Metro", t: "Metropolitan", p: "FS"},
  msunduzi: {n: "Msunduzi Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  polokwane: {n: "Polokwane Local Municipality", t: "Local", p: "LP", dm: "Capricorn DM"},
  rustenburg: {n: "Rustenburg Local Municipality", t: "Local", p: "NW", dm: "Bojanala Platinum DM"},
  mbombela: {n: "City of Mbombela Local Municipality", t: "Local", p: "MP", dm: "Ehlanzeni DM"},
  emalahleni: {n: "Emalahleni Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  matlosana: {n: "City of Matlosana", t: "Local", p: "NW", dm: "Dr Kenneth Kaunda DM"},
  solplaatje: {n: "Sol Plaatje Local Municipality", t: "Local", p: "NC", dm: "Frances Baard DM"},
  stellenbosch: {n: "Stellenbosch Local Municipality", t: "Local", p: "WC", dm: "Cape Winelands DM"},
  drakenstein: {n: "Drakenstein Local Municipality", t: "Local", p: "WC", dm: "Cape Winelands DM"},
  george: {n: "George Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  knysna: {n: "Knysna Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  bitou: {n: "Bitou Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  mosselbay: {n: "Mossel Bay Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  oudtshoorn: {n: "Oudtshoorn Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  hessequa: {n: "Hessequa Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  kannaland: {n: "Kannaland Local Municipality", t: "Local", p: "WC", dm: "Garden Route DM"},
  overstrand: {n: "Overstrand Local Municipality", t: "Local", p: "WC", dm: "Overberg DM"},
  capeagulhas: {n: "Cape Agulhas Local Municipality", t: "Local", p: "WC", dm: "Overberg DM"},
  swellendam: {n: "Swellendam Local Municipality", t: "Local", p: "WC", dm: "Overberg DM"},
  theewaters: {n: "Theewaterskloof Local Municipality", t: "Local", p: "WC", dm: "Overberg DM"},
  saldanha: {n: "Saldanha Bay Local Municipality", t: "Local", p: "WC", dm: "West Coast DM"},
  swartland: {n: "Swartland Local Municipality", t: "Local", p: "WC", dm: "West Coast DM"},
  bergrivier: {n: "Bergrivier Local Municipality", t: "Local", p: "WC", dm: "West Coast DM"},
  cederberg: {n: "Cederberg Local Municipality", t: "Local", p: "WC", dm: "West Coast DM"},
  matzikama: {n: "Matzikama Local Municipality", t: "Local", p: "WC", dm: "West Coast DM"},
  breedevallei: {n: "Breede Valley Local Municipality", t: "Local", p: "WC", dm: "Cape Winelands DM"},
  langeberg: {n: "Langeberg Local Municipality", t: "Local", p: "WC", dm: "Cape Winelands DM"},
  witzenberg: {n: "Witzenberg Local Municipality", t: "Local", p: "WC", dm: "Cape Winelands DM"},
  beaufortwest: {n: "Beaufort West Local Municipality", t: "Local", p: "WC", dm: "Central Karoo DM"},
  laingsburg: {n: "Laingsburg Local Municipality", t: "Local", p: "WC", dm: "Central Karoo DM"},
  prinsealbert: {n: "Prince Albert Local Municipality", t: "Local", p: "WC", dm: "Central Karoo DM"},
  makana: {n: "Makana Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  ndlambe: {n: "Ndlambe Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  kouga: {n: "Kouga Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  ksd: {n: "King Sabata Dalindyebo Local Municipality", t: "Local", p: "EC", dm: "OR Tambo DM"},
  mhlontlo: {n: "Kumkani Mhlontlo Local Municipality", t: "Local", p: "EC", dm: "OR Tambo DM"},
  emgijima: {n: "Enoch Mgijima Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM"},
  inxuba: {n: "Inxuba Yethemba Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM"},
  waltersisulu: {n: "Walter Sisulu Local Municipality", t: "Local", p: "EC", dm: "Joe Gqabi DM"},
  raymondmhlaba: {n: "Raymond Mhlaba Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  newcastle: {n: "Newcastle Local Municipality", t: "Local", p: "KZN", dm: "Amajuba DM"},
  umhlathuze: {n: "City of uMhlathuze", t: "Local", p: "KZN", dm: "King Cetshwayo DM"},
  raynkonyeni: {n: "Ray Nkonyeni Local Municipality", t: "Local", p: "KZN", dm: "Ugu DM"},
  umngeni: {n: "uMngeni Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  endumeni: {n: "Endumeni Local Municipality", t: "Local", p: "KZN", dm: "uMzinyathi DM"},
  ulundi: {n: "Ulundi Local Municipality", t: "Local", p: "KZN", dm: "Zululand DM"},
  alfredduma: {n: "Alfred Duma Local Municipality", t: "Local", p: "KZN", dm: "uThukela DM"},
  inkosilang: {n: "Inkosi Langalibalele Local Municipality", t: "Local", p: "KZN", dm: "uThukela DM"},
  metsimaholo: {n: "Metsimaholo Local Municipality", t: "Local", p: "FS", dm: "Fezile Dabi DM"},
  ngwathe: {n: "Ngwathe Local Municipality", t: "Local", p: "FS", dm: "Fezile Dabi DM"},
  moqhaka: {n: "Moqhaka Local Municipality", t: "Local", p: "FS", dm: "Fezile Dabi DM"},
  dihlabeng: {n: "Dihlabeng Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  maluti: {n: "Maluti-a-Phofung Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  matjhabeng: {n: "Matjhabeng Local Municipality", t: "Local", p: "FS", dm: "Lejweleputswa DM"},
  mahikeng: {n: "Mahikeng Local Municipality", t: "Local", p: "NW", dm: "Ngaka Modiri Molema DM"},
  jbmarks: {n: "JB Marks Local Municipality", t: "Local", p: "NW", dm: "Dr Kenneth Kaunda DM"},
  madibeng: {n: "Madibeng Local Municipality", t: "Local", p: "NW", dm: "Bojanala Platinum DM"},
  naledi: {n: "Naledi Local Municipality", t: "Local", p: "NW", dm: "Dr Ruth Segomotsi Mompati DM"},
  ditsobotla: {n: "Ditsobotla Local Municipality", t: "Local", p: "NW", dm: "Ngaka Modiri Molema DM"},
  stevet: {n: "Steve Tshwete Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  govanmbeki: {n: "Govan Mbeki Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  msukaligwa: {n: "Msukaligwa Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  lekwa: {n: "Lekwa Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  bushbuckridge: {n: "Bushbuckridge Local Municipality", t: "Local", p: "MP", dm: "Ehlanzeni DM"},
  tzaneen: {n: "Greater Tzaneen Local Municipality", t: "Local", p: "LP", dm: "Mopani DM"},
  mogalakwena: {n: "Mogalakwena Local Municipality", t: "Local", p: "LP", dm: "Waterberg DM"},
  belabela: {n: "Bela-Bela Local Municipality", t: "Local", p: "LP", dm: "Waterberg DM"},
  modimollemookgo: {n: "Modimolle-Mookgophong Local Municipality", t: "Local", p: "LP", dm: "Waterberg DM"},
  thulamela: {n: "Thulamela Local Municipality", t: "Local", p: "LP", dm: "Vhembe DM"},
  musina: {n: "Musina Local Municipality", t: "Local", p: "LP", dm: "Vhembe DM"},
  baphalaborwa: {n: "Ba-Phalaborwa Local Municipality", t: "Local", p: "LP", dm: "Mopani DM"},
  fetakgomo: {n: "Fetakgomo Tubatse Local Municipality", t: "Local", p: "LP", dm: "Sekhukhune DM"},
  dawidkruiper: {n: "Dawid Kruiper Local Municipality", t: "Local", p: "NC", dm: "ZF Mgcawu DM"},
  gasegonyana: {n: "Ga-Segonyana Local Municipality", t: "Local", p: "NC", dm: "John Taolo Gaetsewe DM"},
  namakhoi: {n: "Nama Khoi Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  gamagara: {n: "Gamagara Local Municipality", t: "Local", p: "NC", dm: "John Taolo Gaetsewe DM"},
  emthanjeni: {n: "Emthanjeni Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  hantam: {n: "Hantam Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  drbeyers: {n: "Dr Beyers Naudé Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  mnquma: {n: "Mnquma Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  winniemandela: {n: "Winnie Madikizela-Mandela Local Municipality", t: "Local", p: "EC", dm: "Alfred Nzo DM"},
  ingquza: {n: "Ingquza Hill Local Municipality", t: "Local", p: "EC", dm: "OR Tambo DM"},
  abaqulusi: {n: "Abaqulusi Local Municipality", t: "Local", p: "KZN", dm: "Zululand DM"},
  kokstad: {n: "Greater Kokstad Local Municipality", t: "Local", p: "KZN", dm: "Harry Gwala DM"},
  umlalazi: {n: "uMlalazi Local Municipality", t: "Local", p: "KZN", dm: "King Cetshwayo DM"},
  mtubatuba: {n: "Inkosi Mtubatuba Local Municipality", t: "Local", p: "KZN", dm: "uMkhanyakude DM"},
  mkhondo: {n: "Mkhondo Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  thembisile: {n: "Thembisile Hani Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  lephalale: {n: "Lephalale Local Municipality", t: "Local", p: "LP", dm: "Waterberg DM"},
  giyani: {n: "Greater Giyani Local Municipality", t: "Local", p: "LP", dm: "Mopani DM"},
  lepellenkumpi: {n: "Lepelle-Nkumpi Local Municipality", t: "Local", p: "LP", dm: "Capricorn DM"},
  tsantsabane: {n: "Tsantsabane Local Municipality", t: "Local", p: "NC", dm: "ZF Mgcawu DM"},
  umsobomvu: {n: "Umsobomvu Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  phokwane: {n: "Phokwane Local Municipality", t: "Local", p: "NC", dm: "Frances Baard DM"},
  setsoto: {n: "Setsoto Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  nala: {n: "Nala Local Municipality", t: "Local", p: "FS", dm: "Lejweleputswa DM"},
  mafube: {n: "Mafube Local Municipality", t: "Local", p: "FS", dm: "Fezile Dabi DM"},
  mantsopa: {n: "Mantsopa Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  emfuleni: {n: "Emfuleni Local Municipality", t: "Local", p: "GP", dm: "Sedibeng DM"},
  midvaal: {n: "Midvaal Local Municipality", t: "Local", p: "GP", dm: "Sedibeng DM"},
  lesedi: {n: "Lesedi Local Municipality", t: "Local", p: "GP", dm: "Sedibeng DM"},
  mogalecity: {n: "Mogale City Local Municipality", t: "Local", p: "GP", dm: "West Rand DM"},
  randwest: {n: "Rand West City Local Municipality", t: "Local", p: "GP", dm: "West Rand DM"},
  merafong: {n: "Merafong City Local Municipality", t: "Local", p: "GP", dm: "West Rand DM"},
  sundaysriver: {n: "Sundays River Valley Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  bluecrane: {n: "Blue Crane Route Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  koukamma: {n: "Kou-Kamma Local Municipality", t: "Local", p: "EC", dm: "Sarah Baartman DM"},
  amahlathi: {n: "Amahlathi Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  greatkei: {n: "Great Kei Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  mbhashe: {n: "Mbhashe Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  ngqushwa: {n: "Ngqushwa Local Municipality", t: "Local", p: "EC", dm: "Amathole DM"},
  intsikayethu: {n: "Vuyisile Mini Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM", was: "Intsika Yethu"},
  emalahleniec: {n: "Emalahleni Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM"},
  engcobo: {n: "Dr AB Xuma Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM"},
  sakhisizwe: {n: "Sakhisizwe Local Municipality", t: "Local", p: "EC", dm: "Chris Hani DM"},
  senqu: {n: "Senqu Local Municipality", t: "Local", p: "EC", dm: "Joe Gqabi DM"},
  elundini: {n: "Elundini Local Municipality", t: "Local", p: "EC", dm: "Joe Gqabi DM"},
  matatiele: {n: "Matatiele Local Municipality", t: "Local", p: "EC", dm: "Alfred Nzo DM"},
  umzimvubu: {n: "Umzimvubu Local Municipality", t: "Local", p: "EC", dm: "Alfred Nzo DM"},
  ntabankulu: {n: "Ntabankulu Local Municipality", t: "Local", p: "EC", dm: "Alfred Nzo DM"},
  nyandeni: {n: "Nyandeni Local Municipality", t: "Local", p: "EC", dm: "OR Tambo DM"},
  portstjohns: {n: "Port St Johns Local Municipality", t: "Local", p: "EC", dm: "OR Tambo DM"},
  umshwathi: {n: "uMshwathi Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  mpofana: {n: "Mpofana Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  richmondkzn: {n: "Richmond Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  mkhambathini: {n: "Mkhambathini Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  umdoni: {n: "Umdoni Local Municipality", t: "Local", p: "KZN", dm: "Ugu DM"},
  umuziwabantu: {n: "uMuziwabantu Local Municipality", t: "Local", p: "KZN", dm: "Ugu DM"},
  kwadukuza: {n: "KwaDukuza Local Municipality", t: "Local", p: "KZN", dm: "iLembe DM"},
  mandeni: {n: "Mandeni Local Municipality", t: "Local", p: "KZN", dm: "iLembe DM"},
  nkandla: {n: "Nkandla Local Municipality", t: "Local", p: "KZN", dm: "King Cetshwayo DM"},
  mthonjaneni: {n: "Mthonjaneni Local Municipality", t: "Local", p: "KZN", dm: "King Cetshwayo DM"},
  nongoma: {n: "Nongoma Local Municipality", t: "Local", p: "KZN", dm: "Zululand DM"},
  uphongolo: {n: "uPhongolo Local Municipality", t: "Local", p: "KZN", dm: "Zululand DM"},
  jozini: {n: "Jozini Local Municipality", t: "Local", p: "KZN", dm: "uMkhanyakude DM"},
  bigfive: {n: "Big Five Hlabisa Local Municipality", t: "Local", p: "KZN", dm: "uMkhanyakude DM"},
  okhahlamba: {n: "Okhahlamba Local Municipality", t: "Local", p: "KZN", dm: "uThukela DM"},
  nquthu: {n: "Nquthu Local Municipality", t: "Local", p: "KZN", dm: "uMzinyathi DM"},
  msinga: {n: "Msinga Local Municipality", t: "Local", p: "KZN", dm: "uMzinyathi DM"},
  umvoti: {n: "uMvoti Local Municipality", t: "Local", p: "KZN", dm: "uMzinyathi DM"},
  dannhauser: {n: "Dannhauser Local Municipality", t: "Local", p: "KZN", dm: "Amajuba DM"},
  umzimkhulu: {n: "Umzimkhulu Local Municipality", t: "Local", p: "KZN", dm: "Harry Gwala DM"},
  ubuhlebezwe: {n: "Johannes Phumani Phungula Local Municipality", t: "Local", p: "KZN", dm: "Harry Gwala DM", was: "Ubuhlebezwe"},
  kwasani: {n: "Dr Nkosazana Dlamini Zuma Local Municipality", t: "Local", p: "KZN", dm: "Harry Gwala DM", was: "Ingwe|KwaSani"},
  nketoana: {n: "Nketoana Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  phumelela: {n: "Phumelela Local Municipality", t: "Local", p: "FS", dm: "Thabo Mofutsanyana DM"},
  tswelopele: {n: "Tswelopele Local Municipality", t: "Local", p: "FS", dm: "Lejweleputswa DM"},
  masilonyana: {n: "Masilonyana Local Municipality", t: "Local", p: "FS", dm: "Lejweleputswa DM"},
  mohokare: {n: "Mohokare Local Municipality", t: "Local", p: "FS", dm: "Xhariep DM"},
  kopanong: {n: "Kopanong Local Municipality", t: "Local", p: "FS", dm: "Xhariep DM"},
  letsemeng: {n: "Letsemeng Local Municipality", t: "Local", p: "FS", dm: "Xhariep DM"},
  moseskotane: {n: "Moses Kotane Local Municipality", t: "Local", p: "NW", dm: "Bojanala Platinum DM"},
  kgetlengrivier: {n: "Kgetlengrivier Local Municipality", t: "Local", p: "NW", dm: "Bojanala Platinum DM"},
  moretele: {n: "Moretele Local Municipality", t: "Local", p: "NW", dm: "Bojanala Platinum DM"},
  ramotshere: {n: "Ramotshere Moiloa Local Municipality", t: "Local", p: "NW", dm: "Ngaka Modiri Molema DM"},
  tswaing: {n: "Tswaing Local Municipality", t: "Local", p: "NW", dm: "Ngaka Modiri Molema DM"},
  greatertaung: {n: "Greater Taung Local Municipality", t: "Local", p: "NW", dm: "Dr Ruth Segomotsi Mompati DM"},
  lekwateemane: {n: "Lekwa-Teemane Local Municipality", t: "Local", p: "NW", dm: "Dr Ruth Segomotsi Mompati DM"},
  mamusa: {n: "Mamusa Local Municipality", t: "Local", p: "NW", dm: "Dr Ruth Segomotsi Mompati DM"},
  maquassi: {n: "Maquassi Hills Local Municipality", t: "Local", p: "NW", dm: "Dr Kenneth Kaunda DM"},
  emakhazeni: {n: "Emakhazeni Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  victorkhanye: {n: "Victor Khanye Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  jsmoroka: {n: "Dr JS Moroka Local Municipality", t: "Local", p: "MP", dm: "Nkangala DM"},
  dipaleseng: {n: "Dipaleseng Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  albertluthuli: {n: "Chief Albert Luthuli Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"},
  nkomazi: {n: "Nkomazi Local Municipality", t: "Local", p: "MP", dm: "Ehlanzeni DM"},
  thabachweu: {n: "Thaba Chweu Local Municipality", t: "Local", p: "MP", dm: "Ehlanzeni DM"},
  makhado: {n: "Makhado Local Municipality", t: "Local", p: "LP", dm: "Vhembe DM"},
  collinschabane: {n: "Collins Chabane Local Municipality", t: "Local", p: "LP", dm: "Vhembe DM"},
  greaterletaba: {n: "Greater Letaba Local Municipality", t: "Local", p: "LP", dm: "Mopani DM"},
  maruleng: {n: "Maruleng Local Municipality", t: "Local", p: "LP", dm: "Mopani DM"},
  molemole: {n: "Molemole Local Municipality", t: "Local", p: "LP", dm: "Capricorn DM"},
  blouberg: {n: "Blouberg Local Municipality", t: "Local", p: "LP", dm: "Capricorn DM"},
  eliasmotsoaledi: {n: "Elias Motsoaledi Local Municipality", t: "Local", p: "LP", dm: "Sekhukhune DM"},
  makhuduthamaga: {n: "Makhuduthamaga Local Municipality", t: "Local", p: "LP", dm: "Sekhukhune DM"},
  ephraimmogale: {n: "Ephraim Mogale Local Municipality", t: "Local", p: "LP", dm: "Sekhukhune DM"},
  thabazimbi: {n: "Thabazimbi Local Municipality", t: "Local", p: "LP", dm: "Waterberg DM"},
  kareeberg: {n: "Kareeberg Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  ubuntu: {n: "Ubuntu Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  siyancuma: {n: "Siyancuma Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  siyathemba: {n: "Siyathemba Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  renosterberg: {n: "Renosterberg Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  thembelihle: {n: "Thembelihle Local Municipality", t: "Local", p: "NC", dm: "Pixley ka Seme DM"},
  kaigarib: {n: "Kai !Garib Local Municipality", t: "Local", p: "NC", dm: "ZF Mgcawu DM"},
  kheis: {n: "!Kheis Local Municipality", t: "Local", p: "NC", dm: "ZF Mgcawu DM"},
  kgatelopele: {n: "Kgatelopele Local Municipality", t: "Local", p: "NC", dm: "ZF Mgcawu DM"},
  dikgatlong: {n: "Dikgatlong Local Municipality", t: "Local", p: "NC", dm: "Frances Baard DM"},
  magareng: {n: "Magareng Local Municipality", t: "Local", p: "NC", dm: "Frances Baard DM"},
  karoohoogland: {n: "Karoo Hoogland Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  kamiesberg: {n: "Kamiesberg Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  richtersveld: {n: "Richtersveld Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  khaima: {n: "Khâi-Ma Local Municipality", t: "Local", p: "NC", dm: "Namakwa DM"},
  joemorolong: {n: "Joe Morolong Local Municipality", t: "Local", p: "NC", dm: "John Taolo Gaetsewe DM"},
  maphumulo: {n: "Maphumulo Local Municipality", t: "Local", p: "KZN", dm: "iLembe DM"},
  ratlou: {n: "Ratlou Local Municipality", t: "Local", p: "NW", dm: "Ngaka Modiri Molema DM"},
  kagisanomolopo: {n: "Kagisano-Molopo Local Municipality", t: "Local", p: "NW", dm: "Dr Ruth Segomotsi Mompati DM"},
  edumbe: {n: "eDumbe Local Municipality", t: "Local", p: "KZN", dm: "Zululand DM"},
  mfolozi: {n: "Mfolozi Local Municipality", t: "Local", p: "KZN", dm: "King Cetshwayo DM"},
  umhlabuyalingana: {n: "Umhlabuyalingana Local Municipality", t: "Local", p: "KZN", dm: "uMkhanyakude DM"},
  tokologo: {n: "Tokologo Local Municipality", t: "Local", p: "FS", dm: "Lejweleputswa DM"},
  ndwedwe: {n: "Ndwedwe Local Municipality", t: "Local", p: "KZN", dm: "iLembe DM"},
  impendle: {n: "Impendle Local Municipality", t: "Local", p: "KZN", dm: "uMgungundlovu DM"},
  emadlangeni: {n: "Emadlangeni Local Municipality", t: "Local", p: "KZN", dm: "Amajuba DM"},
  umzumbe: {n: "Umzumbe Local Municipality", t: "Local", p: "KZN", dm: "Ugu DM"},
  pixleymp: {n: "Dr Pixley Ka Isaka Seme Local Municipality", t: "Local", p: "MP", dm: "Gert Sibande DM"}
};

/* Places → municipality, for the search box: [municipality key, "Place|Place=alternative names|…"].
   Runs are kept in search order (ties in the results list keep this order). The province comes from the municipality.
   Places in the former Naledi municipality (Free State) sit under Mangaung (man), which absorbed it in 2016. */
window.SA_PLACES = [
  ["jhb", "Johannesburg CBD=joburg cbd, jhb cbd|Sandton|Soweto|Rosebank|Yeoville|Hillbrow|Berea=berea johannesburg|Braamfontein|Newtown=newtown johannesburg|Alexandra=alex|Randburg|Roodepoort|Midrand|Lenasia|Diepsloot|Orange Farm|Eldorado Park|Melville|Parkhurst|Parktown|Houghton|Killarney|Bryanston|Fourways|Sunninghill|Linden|Greenside|Emmarentia|Northcliff|Westdene|Auckland Park|Mayfair|Fordsburg|Bezuidenhout Valley=bez valley|Kensington=kensington johannesburg|Bedfordview|Norwood|Orchards|Florida=florida roodepoort|Honeydew|Cosmo City|Ivory Park"],
  ["eku", "Tembisa"],
  ["jhb", "Orlando=orlando soweto|Pimville|Meadowlands|Diepkloof|Dobsonville|Jabavu|Protea Glen|Naledi=naledi soweto"],
  ["eku", "Kempton Park|Benoni|Boksburg|Germiston|Edenvale|Springs=springs ekurhuleni|Brakpan|Nigel|Alberton|Katlehong|Vosloorus|Thokoza|Daveyton|Wattville|Tsakane|Duduza|KwaThema|Etwatwa|OR Tambo Airport=ortambo airport, johannesburg airport"],
  ["tsh", "Pretoria CBD=pretoria, tshwane|Centurion|Hatfield|Brooklyn=brooklyn pretoria|Menlyn|Lynnwood|Waterkloof|Arcadia|Sunnyside=sunnyside pretoria|Mamelodi|Atteridgeville|Soshanguve|Mabopane|Ga-Rankuwa|Hammanskraal|Cullinan|Bronkhorstspruit|Akasia|Pretoria North|Olievenhoutbosch"],
  ["cpt", "Cape Town CBD=cape town city centre|Sea Point|Green Point|Camps Bay|Clifton|Bantry Bay|Bo-Kaap=bokaap|Woodstock=woodstock cape town|Salt River|Observatory=obs|Rondebosch|Newlands=newlands cape town|Claremont=claremont cape town|Kenilworth=kenilworth cape town|Wynberg|Constantia|Tokai|Hout Bay|Llandudno|Noordhoek|Kommetjie|Fish Hoek|Simon's Town=simonstown, simons town|Muizenberg|Khayelitsha=khaya|Mitchells Plain=mitchell's plain|Gugulethu=gugs|Langa=langa cape town|Nyanga=nyanga cape town|Philippi|Athlone=athlone cape town|Manenberg|Hanover Park|Mfuleni|Bellville|Parow|Goodwood|Brackenfell|Kuilsriver=kuils river|Durbanville|Milnerton|Table View|Bloubergstrand=blouberg|Atlantis=atlantis cape town|Strand|Somerset West|Gordons Bay=gordon's bay|Delft=delft cape town|Cape Town International=cape town airport"],
  ["eth", "Durban CBD=durban, ethekwini|Berea=berea durban|Morningside=morningside durban|Glenwood|Musgrave|Westville|Pinetown|Hillcrest=hillcrest durban|Kloof|Umhlanga|Durban North|La Lucia|Ballito|Amanzimtoti=toti|Umlazi|Chatsworth=chatsworth durban|Phoenix=phoenix durban|KwaMashu|Inanda|Ntuzuma|Cato Manor|Wentworth=wentworth durban|Merebank|Isipingo"],
  ["nmb", "Gqeberha=port elizabeth, pe|Summerstrand|Walmer=walmer gqeberha|Newton Park|Korsten|New Brighton|Motherwell|KwaZakhele|Zwide|Kwanobuhle=kwa nobuhle|Kariega=uitenhage|Despatch"],
  ["buf", "East London=east london eastern cape|Mdantsane|Gonubie|Bhisho=bisho|King William's Town=kwt, king williams town|Beacon Bay|Vincent=vincent east london|Berlin=berlin eastern cape|Zwelitsha"],
  ["man", "Bloemfontein=bloem|Botshabelo|Thaba Nchu|Bayswater=bayswater bloemfontein|Mangaung Township=mangaung|Heidedal"],
  ["stellenbosch", "Stellenbosch|Franschhoek"],
  ["drakenstein", "Paarl|Wellington=wellington wc"],
  ["george", "George=george western cape"],
  ["knysna", "Knysna|Sedgefield"],
  ["bitou", "Plettenberg Bay=plett"],
  ["mosselbay", "Mossel Bay|Hartenbos"],
  ["oudtshoorn", "Oudtshoorn|De Rust"],
  ["hessequa", "Riversdale=riversdale wc|Heidelberg=heidelberg wc|Stilbaai=still bay"],
  ["kannaland", "Ladismith|Calitzdorp"],
  ["overstrand", "Hermanus|Stanford=stanford wc|Gansbaai"],
  ["capeagulhas", "Bredasdorp|Struisbaai|Cape Agulhas=agulhas"],
  ["swellendam", "Swellendam"],
  ["theewaters", "Caledon|Grabouw|Villiersdorp"],
  ["saldanha", "Saldanha=saldanha bay|Vredenburg|Langebaan|Paternoster|St Helena Bay"],
  ["swartland", "Malmesbury|Riebeek-Kasteel=riebeek kasteel|Yzerfontein"],
  ["bergrivier", "Piketberg|Velddrif"],
  ["cederberg", "Clanwilliam|Citrusdal|Lambert's Bay=lamberts bay"],
  ["matzikama", "Vredendal|Vanrhynsdorp"],
  ["breedevallei", "Worcester|Rawsonville"],
  ["langeberg", "Robertson=robertson wc|Ashton|Bonnievale|Montagu"],
  ["witzenberg", "Ceres|Tulbagh|Wolseley"],
  ["beaufortwest", "Beaufort West|Murraysburg"],
  ["laingsburg", "Laingsburg"],
  ["prinsealbert", "Prince Albert"],
  ["makana", "Makhanda=grahamstown|Riebeek East"],
  ["ndlambe", "Port Alfred|Bathurst|Kenton-on-Sea=kenton on sea"],
  ["kouga", "Jeffreys Bay=jbay|Humansdorp|St Francis Bay"],
  ["ksd", "Mthatha=umtata|Mqanduli|Coffee Bay"],
  ["mhlontlo", "Tsolo|Qumbu"],
  ["emgijima", "Komani=queenstown|Whittlesea"],
  ["inxuba", "Cradock|Middelburg EC=middelburg eastern cape"],
  ["waltersisulu", "Aliwal North|Burgersdorp"],
  ["raymondmhlaba", "Fort Beaufort|Adelaide=adelaide ec|Bedford=bedford ec"],
  ["msunduzi", "Pietermaritzburg=pmb, maritzburg|Edendale|Imbali"],
  ["umngeni", "Howick|Hilton=hilton kzn"],
  ["newcastle", "Newcastle|Madadeni|Osizweni"],
  ["umhlathuze", "Richards Bay|Empangeni|eSikhawini"],
  ["raynkonyeni", "Margate=margate kzn|Port Shepstone|Ramsgate|Uvongo|Shelly Beach"],
  ["endumeni", "Dundee=dundee kzn|Glencoe"],
  ["ulundi", "Ulundi"],
  ["alfredduma", "Ladysmith=ladysmith kzn|Ezakheni"],
  ["inkosilang", "Estcourt|Wembezi"],
  ["metsimaholo", "Sasolburg|Zamdela"],
  ["ngwathe", "Parys|Heilbron|Koppies"],
  ["moqhaka", "Kroonstad|Steynsrus"],
  ["dihlabeng", "Bethlehem=bethlehem fs|Clarens|Fouriesburg"],
  ["maluti", "Phuthaditjhaba=qwaqwa|Harrismith"],
  ["matjhabeng", "Welkom|Virginia=virginia fs|Odendaalsrus|Hennenman|Thabong"],
  ["mahikeng", "Mahikeng=mafikeng|Mmabatho"],
  ["matlosana", "Klerksdorp|Orkney=orkney nw|Stilfontein|Khuma"],
  ["jbmarks", "Potchefstroom=potch|Ventersdorp"],
  ["madibeng", "Brits|Hartbeespoort=harties|Mothutlung"],
  ["naledi", "Vryburg"],
  ["ditsobotla", "Lichtenburg|Coligny"],
  ["rustenburg", "Rustenburg|Marikana|Phokeng|Tlhabane"],
  ["mbombela", "Mbombela=nelspruit|White River|Hazyview|Barberton|Kabokweni"],
  ["emalahleni", "Witbank=emalahleni"],
  ["stevet", "Middelburg MP=middelburg mpumalanga|Hendrina"],
  ["govanmbeki", "Secunda|Embalenhle|Evander"],
  ["msukaligwa", "Ermelo|Wesselton"],
  ["lekwa", "Standerton|Sakhile"],
  ["bushbuckridge", "Bushbuckridge|Acornhoek|Thulamahashe"],
  ["polokwane", "Polokwane=pietersburg|Seshego|Mankweng"],
  ["tzaneen", "Tzaneen|Nkowa Nkowa|Letsitele"],
  ["mogalakwena", "Mokopane=potgietersrus"],
  ["belabela", "Bela-Bela=warmbaths, warmbad"],
  ["modimollemookgo", "Modimolle=nylstroom|Mookgophong=naboomspruit"],
  ["thulamela", "Thohoyandou|Sibasa"],
  ["musina", "Musina=messina"],
  ["baphalaborwa", "Phalaborwa|Namakgale"],
  ["fetakgomo", "Burgersfort|Steelpoort|Praktiseer"],
  ["solplaatje", "Kimberley|Galeshewe|Ritchie"],
  ["dawidkruiper", "Upington"],
  ["kaigarib", "Keimoes|Kakamas"],
  ["gasegonyana", "Kuruman|Mothibistad"],
  ["namakhoi", "Springbok|Okiep|Nababeep"],
  ["gamagara", "Kathu|Dingleton"],
  ["emthanjeni", "De Aar|Britstown|Hanover=hanover nc"],
  ["hantam", "Calvinia|Brandvlei|Loeriesfontein"],
  ["drbeyers", "Graaff-Reinet=graaff reinet, graaf reinet|Aberdeen=aberdeen ec|Nieu-Bethesda=nieu bethesda|Willowmore"],
  ["mnquma", "Butterworth|Centane=kentani"],
  ["winniemandela", "Bizana=mbizana"],
  ["ingquza", "Lusikisiki|Flagstaff"],
  ["abaqulusi", "Vryheid"],
  ["kokstad", "Kokstad"],
  ["umlalazi", "Eshowe|Gingindlovu"],
  ["mtubatuba", "Mtubatuba|St Lucia=saint lucia"],
  ["mkhondo", "Piet Retief=emkhondo"],
  ["thembisile", "KwaMhlanga"],
  ["lephalale", "Lephalale=ellisras"],
  ["giyani", "Giyani"],
  ["lepellenkumpi", "Lebowakgomo"],
  ["tsantsabane", "Postmasburg"],
  ["umsobomvu", "Colesberg"],
  ["phokwane", "Hartswater|Jan Kempdorp"],
  ["setsoto", "Ficksburg|Senekal"],
  ["nala", "Bothaville"],
  ["mafube", "Frankfort=frankfort fs"],
  ["mantsopa", "Ladybrand"],
  ["emfuleni", "Vereeniging|Vanderbijlpark|Sebokeng|Evaton|Sharpeville|Boipatong"],
  ["midvaal", "Meyerton"],
  ["lesedi", "Heidelberg GP=heidelberg gauteng|Ratanda|Devon"],
  ["mogalecity", "Krugersdorp|Magaliesburg|Kagiso|Munsieville"],
  ["randwest", "Randfontein|Westonaria|Bekkersdal"],
  ["merafong", "Carletonville|Fochville|Khutsong"],
  ["sundaysriver", "Kirkwood|Addo|Paterson"],
  ["bluecrane", "Somerset East|Cookhouse|Pearston"],
  ["koukamma", "Kareedouw|Joubertina"],
  ["amahlathi", "Stutterheim|Cathcart|Keiskammahoek"],
  ["greatkei", "Komga|Kei Mouth"],
  ["mbhashe", "Dutywa=idutywa|Willowvale|Elliotdale"],
  ["ngqushwa", "Peddie"],
  ["intsikayethu", "Cofimvaba|Tsomo"],
  ["engcobo", "Engcobo=ngcobo"],
  ["sakhisizwe", "Cala|Elliot=elliot ec"],
  ["senqu", "Sterkspruit|Lady Grey|Barkly East"],
  ["elundini", "Mount Fletcher|Maclear|Ugie"],
  ["matatiele", "Matatiele|Cedarville"],
  ["umzimvubu", "Mount Frere=kwabhaca|Mount Ayliff=maxesibeni"],
  ["ntabankulu", "Ntabankulu"],
  ["nyandeni", "Libode|Ngqeleni"],
  ["portstjohns", "Port St Johns"],
  ["umshwathi", "Wartburg|New Hanover|Dalton"],
  ["mpofana", "Mooi River"],
  ["richmondkzn", "Richmond KZN=richmond kwazulu"],
  ["mkhambathini", "Camperdown"],
  ["umdoni", "Scottburgh|Umzinto"],
  ["umuziwabantu", "Harding"],
  ["kwadukuza", "KwaDukuza=stanger|Ballito|Shakaskraal"],
  ["mandeni", "Mandeni"],
  ["nkandla", "Nkandla"],
  ["mthonjaneni", "Melmoth"],
  ["nongoma", "Nongoma"],
  ["uphongolo", "Pongola=phongolo"],
  ["jozini", "Jozini|Mkuze=mkhuze"],
  ["bigfive", "Hluhluwe|Hlabisa"],
  ["okhahlamba", "Bergville|Winterton"],
  ["nquthu", "Nquthu"],
  ["msinga", "Tugela Ferry"],
  ["umvoti", "Greytown"],
  ["dannhauser", "Dannhauser"],
  ["umzimkhulu", "Umzimkhulu"],
  ["ubuhlebezwe", "Ixopo"],
  ["kwasani", "Underberg|Himeville"],
  ["nketoana", "Reitz|Petrus Steyn|Lindley"],
  ["phumelela", "Vrede|Memel"],
  ["tswelopele", "Bultfontein|Hoopstad"],
  ["masilonyana", "Theunissen|Brandfort|Winburg"],
  ["mohokare", "Zastron|Rouxville|Smithfield"],
  ["kopanong", "Trompsburg|Springfontein|Philippolis|Edenburg|Fauresmith"],
  ["letsemeng", "Koffiefontein|Jacobsdal|Petrusburg"],
  ["moseskotane", "Mogwase|Sun City|Madikwe"],
  ["kgetlengrivier", "Koster|Swartruggens"],
  ["moretele", "Makapanstad"],
  ["ramotshere", "Zeerust|Lehurutshe"],
  ["tswaing", "Delareyville|Sannieshof"],
  ["greatertaung", "Taung"],
  ["lekwateemane", "Christiana|Bloemhof"],
  ["mamusa", "Schweizer-Reneke"],
  ["maquassi", "Wolmaransstad|Leeudoringstad|Makwassie"],
  ["emakhazeni", "Belfast=emakhazeni|Dullstroom|Machadodorp=entokozweni|Waterval Boven=emgwenya"],
  ["victorkhanye", "Delmas"],
  ["jsmoroka", "Siyabuswa"],
  ["dipaleseng", "Balfour MP=balfour mpumalanga|Greylingstad"],
  ["albertluthuli", "Carolina|Badplaas|Elukwatini"],
  ["nkomazi", "Malalane=malelane|Komatipoort|Tonga|Marloth Park"],
  ["thabachweu", "Lydenburg=mashishing|Sabie|Graskop"],
  ["makhado", "Louis Trichardt=makhado town|Vuwani|Dzanani"],
  ["collinschabane", "Malamulele"],
  ["greaterletaba", "Modjadjiskloof=duiwelskloof"],
  ["maruleng", "Hoedspruit"],
  ["molemole", "Mogwadi=dendron"],
  ["blouberg", "Senwabarwana=bochum"],
  ["eliasmotsoaledi", "Groblersdal"],
  ["makhuduthamaga", "Jane Furse"],
  ["ephraimmogale", "Marble Hall"],
  ["thabazimbi", "Thabazimbi|Northam"],
  ["kareeberg", "Carnarvon|Vanwyksvlei"],
  ["ubuntu", "Victoria West|Richmond NC=richmond northern cape|Loxton"],
  ["siyancuma", "Douglas|Griekwastad|Campbell"],
  ["siyathemba", "Prieska|Marydale|Niekerkshoop"],
  ["renosterberg", "Petrusville|Vanderkloof"],
  ["thembelihle", "Hopetown|Strydenburg"],
  ["kaigarib", "Augrabies|Kenhardt"],
  ["kheis", "Groblershoop"],
  ["kgatelopele", "Danielskuil|Lime Acres"],
  ["dikgatlong", "Barkly West|Delportshoop|Windsorton"],
  ["magareng", "Warrenton"],
  ["karoohoogland", "Williston|Sutherland|Fraserburg"],
  ["kamiesberg", "Garies|Kamieskroon"],
  ["richtersveld", "Port Nolloth|Alexander Bay"],
  ["khaima", "Pofadder|Aggeneys"],
  ["eku", "Actonville|Alberton North|Alrapark|Alrode|Aston Manor|Atlasville|Bakerton|Bardene|Bartlett|Bedford Gardens|Bedfordview|Birchleigh|Boksburg North|Bonaero Park|Brackendowns|Brackenhurst|Brakpan North|Brenthurst|Brentwood Park|Breswol AH|Bronkhorstspruit NU|Bultfontein|Casseldale|Cerutiville|Chief A Luthuli Park|Chloorkop|Clayville|Croydon|Dalpark|Dalview|Dersley|Dinwiddie|Dowerglen|Dukathole|Dunnottar|Eastleigh|Eden Glen|Eden Glen Ext 60|Eden Park|Edendale|Elmapark|Elsburg|Farrarmere|Freeway Park|Geduld|Geldenhuis|Glenmarais|Hazel Park|Heather Bell|Highway Gardens|Inxiweni|Isando|Isiphetweni|Isithame|Jet Park|Kate Hamel|Lakefield|Lambton|Langaville|Laversburg|Leondale|Libradene|Lindelani Village|Mackenzieville|Marievale|Marister|Marlands|Mavimbela|Meadowbrook|Meadowdale|Midstream|Mngadi|Moleleki|Moleleki Ext. 3|Natalspruit|New Modder|New State Areas|Norkem Park|Northmead|Nuffield Springs|Olifantsfontein|Palm Ridge|Parkdene|Parkrand|Payneville|Petit|Primrose|Putfontein|Radebe|Randhart|Ravenswood|Reiger Park|Rhodesfield|Rosherville|Rynsoord|Schapenrust|Selcourt|Selection Park|Sesfontein|Siluma View|South Crest|Spartan|Strubenvale|Sunward Park|Thembisa|Van Riebeck Park|Wadeville|Webber|Welgedag|Welomlambo|Witfield|Wychwood|Zonkizizwe"],
  ["jhb", "Albertskroon|Albertynsville|Aldarapark|Allen's Nek|Alsef AH|Althea|Antwerp|Atholl Gardens|Avalon|Bantjesloo|Baragwanath|Barbeque Downs|Bassonia|Benmore Gardens|Benrose|Bergbron|Blackheath|Blairgowrie|Bloubosrand|Booysens|Boskruin|Bosmont|Bram Fischerville|Bramley|Brink’s Vlakfontein|Brixton|Broadacres|Bromhof|Bruma|Chartwell|Chartwell West|Chiawelo|Constantia Kloof|Coronationville|Country View|Craighall|Craighall Park|Cresta|Crown Garden|Dainfern|Dainfern Ridge|Darrenwood|Devland|Diepkloof Zone 5|Diepsloot West 6|Discovery|Dlamini|Doornkop|Douglasdale|Drie Ziek|Dube|Dunkeld|Dunkeld West|Duxberry|Eagle Canyon|Ebony Park|Edenburg|Eikenhof|Elandsfontein|Electron|Emdeni|Ennerdale|Ennerdale South|Erand|Fairland|Fairview|Farmall|Ferndale|Florida Glen|Fontainebleau|Glen Austin|Glenanda|Gleneagles|Glenhazel|Glenvista|Gold Reef City|Grasmere|Greenstone Hill|Gresswold|Halfway House|Helderkruin|Heriotdale|Hiltonia|Homestead Park|Horizon View|Houghton Estate|Hurlingham|Hyde Park|Inadan|Inanda|Jacanlee|Jackson’s Drift|Johannesburg|Johannesburg South|Jukskei Park|Kelland|Kelvin|Kenilworth|Kew|Kibler Park|Kloofendal|Kya Sands|Kyalami|Kyalami Park|Lakeside|Lanseria|Lawley|Lawley Estate|Lawley South|Lenasia Ext 13|Lenasia Ext 5|Lenasia Ext. 1|Lenasia South Ext 4|Linbro Park|Linksfield North|Little Falls|Lombardy East|Lone Hill|Longmeadow East|Lyndhurst|Malanshof|Malvern|Mapetla|Maraisburg|Marshalltown|Mayfair West|Meadowlands Zone 3|Melrose|Melrose Estate|Mid-Ennerdale|Modderfontein|Mofolo|Molapo|Moletsane|Mondeor|Montgomery Park|Montroux|Morningside|Morningside Manor|Moroka|Mulbarton|Nancefield|Newclare|Newlands|Noordgesig|Noordwyk|Norscot|North Riding|Northdene|Olivedale|Ophirton|Orange Grove|Orlando East|Orlando West|Paardekraal|Parkmore|Parktown North|Parkview|Paulshof|Pimville Zone 7|Poortje|Protea|Protea North|Protea South|Quellerina|Rabie Ridge|Radiokop|Randjesfontein|Randpark|Ridgeway|Risidale|Riverlea|Rivonia|Robertsham|Robertville|Robin Hills|Robindale|Roodekrans|Roosevelt Park|Roseacre|Rosettenville|Rossmore|Ruimsig|Sandhurst|Sandhurts|Sandown|Sandringham|Saxonwold|Selby|Senaoane|Sharonlea|South Hills|Southdale|Strathavon|Stretford|Strubens Valley|Strydompark|Suideroord|Sundowner|Thulani|Trevallyn|Triomf|Turffontein|Van Wyksrus|Victory Park|Vorna Valley|Vrededorp|Waverley|Weltevredenpark|Weltevreedenpark|Wemmer|Westbury|Westcliffe|Western Township|Wilgeheuwel|Willowdene|Wilrow Park|Winchester Hills|Windsor|Windsor Glen|Witpoortjie|Woodmead|Wynberg|Zola|Zondi|Zonnehoeve"],
  ["tsh", "Amandasig|Annlin|Avondzon|Baviaanspoort|Blue Valley Golf Estate|Boekenhoutfontein|Bon Accord|Brakfontein|Bromona|Bynespoort|Capital Park|Claremont|Clubview East|Clubview West|Colbyn|Constantiapark|Crown Douglas|Danville|Danville Ext 1|Daspoort|Denneboom|Doornpoort|Doornrandjies|East Lynne|Eastwood|Eerste Fabrieke|Eersterus|Ekandustria|Ekangala|Elandsfontein|Elandsrivier|Elarduspark|Eldoraigne|Equestria|Erasmia|Erasmuskloof|Faerie Glen|Florauna|Forfar|Garsfontein|Gezina|Graley|Greenview|Groenkloof|Hartebeestspruit|Hatherley|Hennopspark|Hercules|Hermanstad|Highveld|Honeyvale|Hornsnek|Innesdale|Irene|Isidule|Jan Niemand Park|Kaalfontein|Kameeldrift West|Kameelkraal|Kameelpoortnek|Klipdrift|Klipfontein|Kloofsig|Koedoe|Krauseville AH|Kromdraai|La Guelderland|Lady Selborne|Laudium|Lavenir|Leeukraal-Dos|Leeuwfontein|Lotus Gardens|Lynnwood Glen|Lynnwood Manor|Lynwood Glen|Lyttelton|Magalieskruin|Mahube Valley|Mamelodi East|Mamelodi West|Marokolong|Menlo Park|Menlyn Park|Meule|Meyerspark|Monavoni|Montana|Monument Park|Mooikloof|Mooiplaas|Mooka|Moregloed|Moreletapark|Nellmapius|Newlands|Nwelands|Olievenhoutbos Ext 36|Onderstepoort|Onverwacht|Panpoort|Percydale|Petronella|Pienaarsrivier Nedersetting|Pierre van Ryneveld|Pinedene|Pretoria|Pretoria Central|Pretoria East|Pretoria South|Pretoria West|Pretoria-Wes|Prinshof|Pylpunt|Pyramid|Queenswood|Ramotse|Rayton|Renosterspruit|Rethabiseng|Rhenosterfontein|Riamarpark|Rietfontein|Rietondale|Rietvalleirand|Riverside|Roodeplaat|Rooihuiskraal|Rooihuiskraal Noord|Rooiwal|Rosslyn|Salvokop|Saulsville|Section D|Silbermanspos|Silverlakes|Silverton|Sinoville|Sonderwater|Soshanguve L|Soshanguve WW|Soshanguve X|Soshanguve-H|Soshanguve-M|Soutpan|Sphinx|Spykerras|Stil Gelee|Strydfontein|Swartspruit|The Highlands|The Reeds|Thembisile|Theresapark|Tierpoort|Tweefontein|Vaalplaas|Valhalla|Van der Merwe|Vasfontein|Villieria|Voortrekkerhoogte|Wallmannstal|Wallmannsthal|Waltloo|Wapadrand|Waterkloof Glen|Waverley|Welbekend|Wespark|Westford|Wierdapark|Wilgerivier|Wingate Park|Winternest|Winterveldt|Wonderboom|Wonderboom South|Wonderfontein|Wylies Farm|Zithobeni|Zwartkop"],
  ["emfuleni", "Annaton|Arcon Park|Barrage|Bedworth Park|Boitumelo|Bophelong|Duncanville|Evaton West|Helena’s Rust|Houtkop|Lenteland|Lochvaal|Ottosdrif|Peacehaven|Redan|Roodia|Roshnee|Rust ter Vaal|Sebokeng Unit 12|Sebokeng Unit 14|Sonlandpark|Springfield Collieries|Three Rivers|Vaalview|Van der Merweskroon|Vanderbijlpark CE 2|Vlakplaas|Waterdal"],
  ["lesedi", "Aston Woods|Blinkpoort|Diepkloof|Emmasdale|Heidelberg|Heumingfontein|Jameson Park|Klipfontein|Rensburgdorp"],
  ["merafong", "Blyvooruitzicht|Doornfontein|Driefontein Country Club|East Village|Holfontein|Northdene|Oberholzer|Oberholzer Settlement|Oos-Driefontein|Southdene|The Village|Water’s Edge|Welverdiend|Westdene"],
  ["midvaal", "Balmoral|Blignautrus|Chrissiefontein|Daleside|De Deur|De Deur Estates|Glen Donald|Golf View|Hartsenbergfontein|Henley on Klip|Homestead Apple Orchards|Ironside|Kliprivier|Langlaagte|Mamello|McKay|Meyerton Farms|Ophir|Randvaal|Riversdale|Rothdene|Tokoza|Vaal Marina|Valley Settlements|Walkerville"],
  ["mogalecity", "Agavia|Bagale|Beckedan|Beckendan|Boltonia|Breaunanda|Eljeesee|Featherbrooke Estate|Gladysvale|Hekpoort|Helderblom|Kings Kloof|Komnader|Kromdraai|Krugersdorp North|Krugersdorp West|Lewisham|Madeteleli|Mogale City|Muldersdrift|Muldersdriseloop|Noordheuwel|Orient Hills|Pienaarville|Protea Ridge|Rant-En-Dal|Renos|Rietfontein|Rietvallei|Silverfields|Sonnedal|Tarlton|The Drift|Thorndale"],
  ["randwest", "Bhongwem|Brandvlei|Culemborgpark|Dancornia|Droogheuwel|Elands|Elsburg Gold Mine|Glenharvie|Government Village|Greenhills|Groot-Elandsvlei|Hillshaven|Hillside|Kalbasfontein|Klein Elandsvlei|Kocksoord|Leeudoorn Mine|Lenasia Ext 2|Loumarina|Mohlakeng|Ooster|Randfontein South|Randgate|Randridge|Rietfontein|Rikasrus|Rodora|Seberuberung|Ten Acre|Toekomsrus|Venterpos-West|Venterspos|Vleikop|Wes-Rand|West Rand Garden Estate|Westergloor|Western Areas|Wheatlands"],
  ["beaufortwest", "Merweville|Nelspoort|Nieuveld Park|Restvale"],
  ["bergrivier", "Aurora|Bergrivier|De Hoek|Dwarskersbos|Eendekuil|Goedverwag|Het Kruis|Laaiplek|Monte Bertha|Muishondfontein|Porterville|Redelinghuys|Sauer|Witwater"],
  ["bitou", "Beacon Island Estate|Covie|Die Barakke|Harkerville|Kafferkop|Keurboomsrivier|Keurboomstrand|Kranshoek|Kranshoek Griekwa Nedersetting|Kurland|Kwanokuthula|Nature’s Valley|New Horizons|The Crags|Vyekraal|Wittedrif"],
  ["breedevallei", "Aan de Doorns|Alfalfa|Brandvlei|Brandwacht|De Doorns|Drift Sands|Fairy Glen|Hexrivier|Hospital Park|Keurbos|Kleinstraat|Klipheuwel|Kwaggaskloofdam|Meirings Park|Moordkuil|Nooitgedacht|Nuy|Nuy Valley|Oude Scheur|Philipsdale|Sandhills|Skerpenhevwel|Slanghoek|Touwsrivier|Tweefontein|Werda|Wilgerhof|Wolwenkloof|Worcester NU|Zout Kuil|Zweletemba"],
  ["capeagulhas", "Aasfontein|Agulhas|Arniston|Brandfontein|Elim|Hotagterklip|Klipdale|Molshoop|Nacht Wacht|Napier|Noetsie|Prinskraal|Protem|Remhoogte|Skipskop"],
  ["cederberg", "Cederberg|Elandsbaai|Graafwater|Leipoldtville|Noordhoek|Sandberg|Theerivier|Wuppertal"],
  ["cpt", "Alphen|An-de-Waterkant|Avonwood|Bailey’s Cottage|Bakoven|Belhar|Belle Ombre|Bellville South|Belthorn|Belville|Bergvliet|Big Bay|Bishop Lavis|Bishopscourt|Bloekombos|Blommendal|Blomtuin|Blouberg|Bloubergsvlei|Blue Downs|Bo Oakdale|Bomakierie|Bontheuwel|Bothasig|Brakkefontein|Bridgetown|Brightwater|Briza|Brooklands|Brooklyn|Brookwood|Browns Farms|Cafda Village|Camphill Village|Cape Gate|Cape Town|Century City|Chantecler|Chemory|Clovelly|Conradie|Constantia Heights|Cravenby|Crawford|Crawley|Crossroads|Da Gama Park|Dagbreek|Danga|De Grendel|De Waterkant|Delft South|Dido Valley|Diep River|Dieprivier|Doordrift|Drieankerbaai|Dunoon|Durbanville Hills|Edgemead|Eersterivier|Eindhoven|Elsiesrivier|Endhoven|Epping|Epping Forest|Erica Township|Eureka|Eversdal|Factreton|Far Forest|Faure|Fernwood|Fisantekraal|Flat Acres|Foreshore|Forest Heights|Fresnaye|Garden Village|Gardens|Gatesville|Gaylee|Glen Dirk|Glen Marine|Glencairn|Glencairn Heights|Good Hope|Gordon’s Camp|Grassy Park|Groot Silwermyn|Guguletu|Harare|Harmony|Heathfield|Heideveld|Hiddingh|Higgovale|High Riding|Hillrise|Hoheizen|Ikwezi Park|Imhoff’s Gift|Kalkbaai|Katzenberg|Kenridge|Kensington|Khayelitsha T3-V2|Khayelitsha T3-V5|Kilfinan|Killarney Gardens|Kirstenhof|Klaasjagersberg|Klein Silwermyn|Klein Slangkop|Klein Steenberg|Kleinvlei|Klipfontein|Klipheuwel|Kogelfontein|Kraaifontein|Lakeside|Lansdowne|Lavender Hill|Lentegeur|Loch Venus|Loevenstein|Lotus River|Lwandle|Macassar|Maitland|Malay Quarter|Malibu Village|Mamre|Mandalay|Mandela Park|Marconi Beam|Marina da Gama|Matroosfontein|Meadowridge|Melkbosstrand|Montague Gardens|Montaque Gardens|Monte Vista|Monteray|Mouille Point|Mowbray|Murdoch Valley|Neptune’s Corner|New Crossroads|Nomzamo|Nooitgedacht|Northpine|Norwood|Nuweland|Oakdale|Oakglen|Oaklands|Oatlands|Ocean View|Oranjezicht|Ottery|Oude Raapkraal|Oudekraal|Outside|Paardeneiland|Parkwood|Parowvallei|Peerless Park East|Pelikan Park|Pella WC|Penhill|Philadelphia|Phoenix|Pinelands|Plattekloof|Plattekloof Glen|Plumstead|Portlands|Protea Hoogte|Proteaville|Raapkraal|Ravensmead|Retreat|Riverside|Rocklands|Roggebaai|Rondebosch East|Rosebank|Rosendal|Rugby|Ruyterwacht|Rylands Estate|Saint James|Sanddrift|Sarepta|Saxonsea|Scarborough|Schoongezicht|Schotschekloof|Scottsville|Seaforth|Shoebury Heights|Sidneyvale|Silver Sands|Silverglade|Silverhurst|Silvertown|Sir Lowry's Pass|Sonnendal|Sonstraal|Sonstraal Heights|Southfield|Springbok|Square Hill|Steelwater|Steenberg|Steenbras|Stellenberg|Strandfontein|Sun Valley|Sunnyacres|Sunnycroft|Sunnyside|Sunset Beach|Surrey Estates|Sweet Valley|Tafelsig|Tamboerskloof|The Boulders|The Homestead|The Lakes|Thornton|Three Anchor Bay|Townsend Estate|Tyger Valley|Tygerberg Hills|Uitsig|Van Riebeeckstrand|Vasco|Vergelegen|Vergesig|Victoria Merge|Victory Hill|Vierlanden|Vishoek|Vissershok|Vredehoek|Vredekloof|Vygeboom|Wattle Park|Welgelee|Welgelegen|Welgemoed|Weltevreden|Weltevreden Valley|Weltevreder|Welton|Wesbank|West Beach|Westlake|Wildeschutsbrand|Windermere|Windsor Park|Wittebome|Woodlands|Wynberg Hill|Wyndover|Ysterplaat|Zonnekus"],
  ["drakenstein", "Bain’s Kloof|Blauwvlei|Charleston Hill|Dal Josafat|Du Toitskloof|Goede Hoop|Gouda|Hartebeeskraal|Hermon|Hou Moed|Klein Bergrivier|Klein-Drakenstein|Malan|Mbekweni|Newtown|Nieuwe Drift|Northern Paarl|Ons Rust|Saron|Simondium|Suider-Paarl|Victor Verster|Windmeul"],
  ["george", "Avontuur|Barandas|Bergplaas|Blanco|Bo-Kouga|Borcherds|Buffelsdrif|Camfer|Conville|Delville Park|Die Vlug|Duiwerivier|Edmonton|Eseljag|Georgida|Haarlem|Hannskop|Heatherlands|Herold|Herolds Bay|Heroldsbaai|Hoekwil|Hot Springs|Keysers|Kleinplaat|Krigedam|Laudina|Lopenderivier|Marionhof|Mike|Molen Drift|Nenta|Newtons|Noll|Outeniekwa|Pacaltsdorp|Rooiloop|Rooirivier|Rosemoor|Rusoord|Saasveld|Sheepwalk|Standplaas|Thembalethu|Uniondale|Wilderness|Woodville"],
  ["hessequa", "Albertina|Askraal|Botterkloof|Brandrivier|Droëvlakte|Gouritzmond|Jongensfontein|Kruiskloof|Lappiesbaai|Melkhoutfontein|Muiskop|Port Beaufort|Rahloux|Riethuiskraal|Skilpadgat|Slangrivier|Stilbaai-Oos|Stilbaai-Wes|Vermaaklikheid|Witsand"],
  ["kannaland", "Amalienstein|Anysberg|Berghoek|Bersig|Buffelskloof|Calizdorp|Droëvlei|Hoeko|Kruisrivier|Nissenville|Platdrift|Plathuis|St. Helena|Van Wyksdorp|Vleirivier|Vyversrus|Windhoek|Zoar"],
  ["knysna", "Barrington|Bibby’s Hoek|Bracken Hill|Brenton-on-Sea|Buffelsbaai|Die Hoek|Diepwalle|Garden Route|Goukamma|Gouna|Highland Home|Hornlee|Hunters Home|Karatara Settlement|Kingfisher Creek|Kleinrivier|Kruisvallei|Leeuwbosch|Leisure Isle|Noetsie|Phantom Acres|Rheenendal|Sonskyn|Westford Bridge|Xolweni"],
  ["laingsburg", "Geelwal|Matjiesfontein|Middelplaas|Ouland|Seweweekspoort|Vleiland"],
  ["langeberg", "Alfalfa|Angora|Boesmanspad|Bruintjiesrivier|Drew|Geduld|Gelukshoop|Goedgemoed|Happy Valley|Klipdrif|Koningsrivier|Koo|Laaiplek|Laatsrivier|McGregor|Middelbosjesveld|New Look|Nooitgedacht|Orangezig|Pinegrove|Rhebokskraal|Rietvlei Number 1|Scheepersrus|Spes Bona|Stockville|Takkap|Voorspoed|Weltevrede"],
  ["matzikama", "Bitterfontein|Brakfontein A|Doringbaai|Ebenhaeser|Groot Matjiesfontein|Karoetjieskop|Klawer|Kliprand|Koekenaap|Koelfontein|Le Souvenir|Lutzville|Nuwerus|Papendorp|Rietpoort|South Africa|Strandfontein|Tahiti|Uitvlugt|Weltevrede"],
  ["mosselbay", "Bayview|Bergsig|Bland’s Drift|Boggoms Bay|Bonnievale|Bothastrand|Brandwag|D’Almeida|Da Nova|Danabaai|Diasstrand|Die Erwe|Dwarswegstrandoord|Friemersheim|Glentana|Greenhaven|Groot-Brakrivier|Heiderand|Hemelraad|Herbertsdale|Johnson’s Post|Jonkersberg|Klein-Brakrivier|Klein-Brakrivierstrand|Kleinberg|Kleinvlei|Kwanonqaba|Kwanonqaba Ext.|Linkside|New Sunnyside|Reebok|Ruitersbos|Sandhoogte|Suiderkruis|Tergniet|The Island|Vleesbaai|Voorbaai"],
  ["oudtshoorn", "Aangenaam|Bloupunt|Bongolethu|Bongoletu|Boplaas|Bridgeton|De Hoop|Dysselsdorp|Hazenjacht|Hoopvol|Kammanassiedam|Kerkrand|Kruisrivier|Matjiesrivier|Middelplaas|Schoemanshoek|Varkieskloof|Vlakteplaas|Volmoed|Wesbank|Zebra"],
  ["overstrand", "Arabella Country State|Baardskeerdersbos|Betty’s Bay|Clareport|De Kelders|Die Dam|Die Kelders|Fisherhaven|Franskraalstrand|Hawston|Hemel en Aarde|Hermanus Heights|Houhoek|Karwyderskraal|Kleinbaai|Kleinmond|Koude Rivier|Lake Marina|Malkopvlei|Mosselrivier|Onrus|Oude Bosch|Papiesvlei|Pearly Beach|Pringle Bay|Rooiels|Sand Bay|Sandbaai|Silver Sands|Strandskloof|Sunny Seas|Uilenkraal|Uilkraalmond|Vermont|Viljoenshof|Voëlklip|Zwelihle"],
  ["prinsealbert", "Bergwater|Bitterwater|Genasfontein|Klaarstroom|Leeu-Gamka|Moreson"],
  ["saldanha", "Bottelary|Bovenfontein|Churchhaven|Diazville|Donkergat|Grootfontein|Hopefield|Jacobs Bay|Laingville|Langebaanweg|Myburgh Park|Oudekraalfontein|Saint Helena Bay|Stompneusbaai|West Point"],
  ["stellenbosch", "Banghoek|Cloetesville|Dalsig|De Novo|Die Rand|Elsenburg|Groendal|Helderberg|Hugenote|Idasvallei|Jamestown|Kayamnandi|Klapmuts|Kylemore|Languedoc|Le Roux|Onder-Papegaaiberg|Paradyskloof|Pniel|Robertsvlei|Stellenbosch Central|Stellenbosch NU|Swiss Farm|Vlottenburg|Wemmershoek|Wiesiesdraai"],
  ["swartland", "Abbotsdale|Chatsworth|Darling|Grottobaai|Hooikraal|Jakkalsvlei|Kalbaskraal|Koringberg|Moorreesburg|Morelig|Nuwedorp|Riebeek West|Rietfontein|Riverlands|Swartwater|Vetkoekheuwel|Wesbank|Zonquasdrift"],
  ["swellendam", "Bakklysdrift|Barrydale|Boerboonfontein|Buffeljagsrivier|Bushman Drannings|Cloeteskraal|Doornrivier|Doornriviervlei|Goedgeloof|Infanta|Kontiki|Malgas|Matjieskloof|Ouplass|Sanbona Wildlife Reserve|Spitskop|Stormsvlei|Suurbraak|Warmwaterberg|Wydgeleë"],
  ["theewaters", "Aprilskraal|Bereaville|Bosmanskloof|Botrivier|Dennehof|Eikenhof|Elgin|Genadendal|Greyton|Hartebeesrivier|Helderstroom|Klipkraal|Langkloof|Middleton|Mispah|Morning Star|Ouda Brug|Oukraal|Pampoenkraal|Pineview|Riviersonderend|Rooidriffie|Snake Park|Speelmansrivier|Tesselaarsdal|Vleiview|Vredendal|Vyeboom|Weltevreden"],
  ["witzenberg", "Baviaanshoek|Bella Vista|Bierberg|Blesmerrie|Breërivier|De Meul|Elandsfontein|eNduli|Eselfontein|Groenfontein|Groot Zwaarmoed|Grootrivier|Jukfontein|Lochlynne|Matjiesrivier|Montana|Môreson|Newtown|Olkersia|Op-die-Berg|Prince Alfred Hamlet|Roggeveld|Romansrivier|Sandrivier|Spes Bona|Tankwa Padstal|Tulbaghweg|Uitkoms|Voorsorg|Waverley"],
  ["abaqulusi", "Bandlabathwa|Bloemendal|Boshoek|Brakfontein|Calvert|Clonleigh|Coronation|Coronation Road|Ekuhlengeni|Ekuthuthukeni|eMondlo|Emvunyane|Enhlahlehi|Ezibomvu|Glückstadt|Hlahlindlela|Hlobane|Hlomohlomo|Job’s Town|Kilegethe|KwaNtababomvu|Langkrans|Loss|Louwsburg|Massondale|Mayime|Messelfontein|Mondlo|Mount Ngwibi|Mountain View|Nantes|New Tendeka|Ngobeni|Nkongolwane|Nyembi|Oakhurst|Riversdale|Saint Pauls|Salvation|Sandlaer|Sewefontein|Siyakhathala|Steilrand|Trado|Uitzicht|Vaalbank|Vlakfontein|Vlaklaagte|Vryheid-Oos|Vumankala|Waverley|Welgevonden"],
  ["alfredduma", "Aloe Park|Besters|Burford|Colenso|Cremin|Ekuvukeni|Elandslaagte|eMhlwaneni|eNkuthu|eTholeni|Fitty Park|Kaffir Drift|Kliprivier|Langley|Limehill|Lombardskop Settlement|Mchunu|Mvelani|Namakazi|Nooitgedacht|Peace Town|Roosboom|Sand River Valley|Somshoek|Tugela Estates|Uitval|Vaalkop|Vulandondo|Waay Hoek|Watersmee"],
  ["bigfive", "Emoyeni|Godeni|Golweni|KwaJozana|KwaNibela|KwaNompondo|Makhowe|Manzibomvu|Mnqobokazi|Nagana|Nongoma|Sivivaneni|Somerset|Sungulwane|Yengweni|Zamokwake"],
  ["umhlathuze", "Alton|Arboretum|Bambela|Brackenham|Cyrildene|eBayala|Ellingham|eMatshana|eMevamhlophe|Empembeni|eNseleni|eSikhaleni|Esikhawini H|Fairview|Felixton|Grantham Park|Heatonville|Hlangasa|Hulett’s|Ichubo|Khandisa|Korhaan Hill|Kuleka|KwaMawanda|Kwashodlisa|Mandlazini|Meer en See|Mkhandwini|Mount Charnwood|Ndodwane|New Rail|Ngwelezana|Ngwelezane|Nontshingo|Ntiwa|Obesa|Ongoye|Panorama|Pension Farm|Port Durnford|River View|Sangoyana|Schoongezicht|Sobamdlovu|The Village|Umhlatuzi Valley|Umzimbete|Veldenvlei"],
  ["dannhauser", "Droogdal|Durnacol|Hattingspruit|Kalbassie|Mossdale|Nellie Valley|Normandien|Nyanyadu|Ramsgate|Springbok Laagte|Verdriet"],
  ["edumbe", "Doornkloof|Erfpach|Frischgewaagd|Hildesheim|Mahlone|Paulpietersburg|Piensrand|Sunkelsdrif|Warmbaths|Zungwini"],
  ["emadlangeni", "Flentershoek|Groenkloof|Groenvlei|Kingsley|Langhoek|Slates Drift|Utrecht|Waterval"],
  ["endumeni", "By-Products|Calrossie|eSibongile|Reamour|Strathmore Park|Van Rooyen|Vant’s Drift|Wasbank"],
  ["eth", "Adams College|Addington|Albert Park|aMatata|Amatikwe|Assagay|Athlone|Austerville|Bayhead|Bayview|Bedat|Bellair|Berea West|Bluff|Botha’s Hill|Bottlebrush|Brighton Beach|Brookdale|Buffelsdraai|Canelands|Cato Ridge|Caversham Glen|Centenary Park|Chesterville|Clairwood|Clausthal|Clermont|Cowies Hill|Craigieburn|Crestholme|Crossmoor|Cutting|Dassenhoek|Dawncrest|Densainagar|Doonside|Drummond|Duff’s Road|Durban|Durban Central|Durban Point|Earlsfield|Effingham Heights|Egolokodo|Egolomi|Elangeni|eMadundube|eManzimtoti|eMatikwe|Emberton|eMdloti|Emgidweni|eMkhomazi|eMlaza|Emona|Enkanyisweni|Ensutha|eNtshangwe|Escombe|Essenwood|eZimbokodweni|Flamingo Heights|Flnnland|Folweni|Forest Haven|Forest Hills|Fraser|Gillitts|Glen Ashley|Glen Hills|Gologodo|Golokodo-Ensimbini|Goqokazi|Greenwood Park|Greylands|Greystreet Complex|Greyville|Grosvenor|Grove End|Hambanathi|Hammarsdale|Harbour|Harrison|Havenside|Hazelmere|Herrwood Park|Hillary|Illovo Beach|Inanda Seminary|Inchanga Park|Isipingo Beach|Isipingo Rail|Island View|Ispongo|Jacobs|Karridene|Kenville|Kings Rest|Kingsborough|Kingsmead|Klaarwater|KwaDabeka|KwaKhangela|KwaMakhutha|KwaMnyandu|KwaNgcolosi|KwaNgendezi|La Mercy|Lamontville|Lenham|Lindley|Lotus Park|Lusaka|Magabeni|Maidstone|Malukaze|Malvern|Manor Gardens|Mariannhill|Mayville|Merewent|Mobeni|Montclair|Monteseel|Montford|Mount Edgecombe|Mount Moreland|Mount Vernon|Mountview|Mpumalanga|Mshayazafe|Naidooville|New Germany|New Kingsmead|New River|Newlands|Newlands East|Newlands West|Newtown Inanda|North Beach|Northcroft|Ocean Drive-In|Ocean View|Odidini|Ottawa|Overport|Park Hill|Pinelands|Point|Prestondale|Prospect|Prospecton|Puntans Hill|Qiniselani Manyuswa|Queensburgh|Ragbubee|Red Hill|Redfern|Reservoir Hills|Reunion|Richmond|Rietrivier|Risecliff|Riverside|Roseneath|Rossburgh|Rydalvale|Saint Winifred’s Beach|Salisbury Island|Sea View|Selection Beach|Shallcross|Sherwood|Silverton|Situndu|Sobonakhona|South Beach|Sparks|Springfield|Springfield Flats|St Wendolins Ridge|Sunford|Sydenham|Thornwood|Tongaat|Tongaat Beach|Treasure Beach|Trenance Manor|Trenance Park|Tshelimnyama|Umbilo|Umbumbulu|Umgababa|Umgeni Park|Umhlanga Rocks Suburb|Umlazi E|Umlazi G Section|Umlazi J|Umlazi L|Umlazi M|Umlazi U|Verulam|Warner Beach|Welbedacht|Westbrook|Westcliff|Westmead|Westridge|Wewe|Widenham|Wiggins|Winklespruit|Winston Park|Woodhurst|Woodlands"],
  ["kokstad", "Brechen|Chatwall|Cooperdale|Elandskop|Fettercairn|Franklin|Goxe|Kempdale|Kingscote|Kingston|Kruisfontein|Middle Valley|Nolangeni|Oatlands|Pine Cleugh|Rietfontein|Riversdale|Rustfontein|Spitskop|Swartberg|Telgte|Thornham|Water Fall"],
  ["impendle", "Assina|Boston|Brookes|Broteni|Bucklands Farm|Burners|Cibelichle|Elandsriver|Gomane|Impendle|KwaThunzi|Mahlutshini|Maitland|Mgodi|Nguka|Nhlabamkhosi|Nkangala|Nkothweni|Ntshishini|Nzinga|Painsacre|Sawongo|Shiyabantu|Sithunjwana|Sitofela|The Ridge|The Rockeries|Twin Streams"],
  ["inkosilang", "Belhambra|Blaauwkrantz|eBoshi|Edashi|Emakhekheni|eMangweni|Emnyangweni|eZinyosini|Frere|Game Warden|Game Wood|Greystorie|KwaDlamini|KwaMankonjane|KwaMkhiza|KwaMkhize|KwaNdaba|Kwanobamba|Kwezi|Mahlutshini|Mancana|Mnqamukantaba|Moorberg|Moorleigh|New Furrow|Nkaseni|Ntabamhlope|Otterburn|Shayamoya|Sobabili|Springfield|Stendal|Sweetwaters|Weenen|Wembesi|Willowgrange"],
  ["jozini", "Bhokweni|Dokolwani|Elgin|eMachobeni|eMangwasha|eManyuka|Embadleni|eMkhuze|Emngcelen|Godlogodlwane|Hlalanathi|Ingwavuma|Inyamane|Kuludake|KwaDinabanye|KwaJobe|KwaMnyaisa|KwaNonjinjikazi|Kwashukela|Lulwane|Lundini|Majozini|Mamfene|Manyiseni|Mbodla|Mfongosi|Mjindi|Mlambangwenya|Mtojeni|Nagana|Ndabeni|Ndumo|Ngazini|Nkwambane|Nkwambosi|Nondabuya|Ntabayengwe|Ntabayezulu|Ohlalwini|Ophansi|Ophondweni|Phapheni|Sarabub|Shemula|Siweni|Swelela|Thembalethu|Thombothi|Ubombo"],
  ["kwadukuza", "Ashton|Ballitoville|Blythedale Beach|Darnall|Doornkloof|Gledhow|Groutville|Highlands|Highridge|Isinembe|Melville|New Guelderland|Ocean View|Salt Rock|Shaka’s Rock|Shakaville|Sheffield Beach|Tinley Manor|UCC Informal|Umhali|Umhlali|Umvoti Mouth|Zimbali|Zinkwazi Beach"],
  ["kwasani", "Avocadale|Beersheba|Blackmoor|Buckquoy|Bulwer|Cars End|Centocow|Coleford|Costmore|Creighton|Donnybrook|Drakensberg Garden|e Dazini|Eastlyn|eFikesuthe|Ekuthuleni|eMdutshini|eMfulumane|eMkhohlwa|Epsom|Fairview|Forest View|Gailynn|Gala|Garden Castle|Glen Bain|Hansonia|Hartlea|Highbury|Hilltop|Jokweni|Keyelaer|KwaBhidla|KwaMphephethwa|KwaPheshe|KwaSandanezwe|Magadini|Magdalena|Makhuzeni|Makuzeni|Mangwanteni|Manston|Mashayilanga|Mbodleni|Mkhomazana|Mkobeni|Mpumulwane|Mqatsheni|Ngudwini|Ngwangwana|Nkelabantwana|Nkifa Farm|Nkronze|Nkumba|Nkwezela|Nsimbini|Oaklands|Pevensey Place|Polela|Retreat|Sani Pass|Scotston|Seaforth|Sebensa|Siphahleni|Steadmore|Sun Valley Farm|Sunnyside|Thembeni|Thonsini|Waterfall|Weathercote|Winters|Xosheyakhe"],
  ["mandeni", "Bonds Drift|Dunbarton|eDokodweni|Endlondlweni|Endulinde|eNyoni|Evutha|Fort Crealock|Lower Tugela|Macambini|Mangeti|Newark|Nkunzempunga|Saint Andrews|Sitebe|Sundumbili|Tugela|Tugela Mouth"],
  ["maphumulo", "Mapumulo|Mtandeni|Mushane|Ntunjambili|Otimati|Samungu|Umpumulo|Umyozene"],
  ["mfolozi", "Aboyne|Acme|eMabuyeni|eSitheza|Journey’s End|Klonge|KwaMbonambi|Makhwezini|Mfolozi|Mfuyeni|Nkiya|Ntuthunga|Nzalabantu|Salpine|Umfolozi|Vulamahlo"],
  ["mkhambathini", "Avondale|eGoqweni|Eyrie|Islay|Ka-Mampungushe|Mgugu|Mid Illovo|Millerton|Msholozi|Ngilanyoni|oGagwini|Power’s Court|Surats|Thornville|Umgeni Dam|Umkomanzi|Umlaasweg|Villa Maria"],
  ["mpofana", "Bloemendal|Brown Stones|Bruntville|Elandskop|Glendean|Glenside|Henburg Park|Mpofane|Newstead|Rayonne|Rev Estates|Rietvlei|The Grove|Thendele|Uitsien|Weston|Windside|Windy"],
  ["msinga", "Alva|Bassonsdrif|Bo|Collessie|Dunudunu|Elandskraal|eNhlalakahle|Enhlanhleni|Gunjana|Helpmekaar|Jolwayo|Keate’s Drift|Klingenberg|Klip River Location|Klipspruit|Mbangweni|Mhlangana|Mount Saint Bernard|Nadi|Nocomboshe|Othulini|Paddafontein|Rorke’s Drift|Solomon Linda|Thulini Lwezulu|Tugela Location|Van Tonders Pass|Waldheim|Woodleigh"],
  ["msunduzi", "Ashburton|Chase Valley|Claredon|Cleland|Copesville|eMafakatini|eMaswazini|eNtembani|Glenwood|Hay Paddock|Hayfields|KaNzakene|KwaDulela|KwaGezubuso|KwaMgwagwa|KwaMncane|KwaMntoqotho|KwaMpumuza|Lynnfield Park|New England|Northdale|Pelham|Plessislaer|Raisethorpe|Scottsville|Sinathingi|Sobantu|Sweet Waters|Taylors|Xamuxolo"],
  ["mthonjaneni", "eBayala|Ekutuleni|eNkwenkwe|Kortbegrip|KwaMagwaza|Ndundula|Saint Paul’s|Saxony|Spesbona|Welkom|Wilderness"],
  ["mtubatuba", "Kgwaripe|Kwa-Zuluvuka|KwaMshaya|KwaMthole|Lansdown|Makakatana|Maphelana|Monzi|Mpukunyoni|Mtuba Ridge|Nkonjane|Nyalazi River|Randgate|Ranger|River View|Saint Lucia|Somkele|Vergelee"],
  ["ndwedwe", "Dalibho|eMbuyeni|eNgedleni|Glen Mill|Hillandale|Hlomantethe|Kruisfontein|KwaGcwensa|KwaIllophe|KwaMagubane|KwaMapeyana|KwaMaqokomela|KwaMwema|KwaNgongoma|KwaNyuswa|Magidini|Makhuluseni|Mary Gray|Montebello|Ndwedwe|Newspaper|Nkivane|Nsuze|Ntapuka|oGonothini|Sanikidge|Sigedleni|Soberton|Ston|Tafamasi|Thrings Post|Umkhomazi|Upper Tongaat|Waterfall"],
  ["newcastle", "Alcockspruit|Amiel Park|Arbor Park|Ballengeich|Blaauwbosch|Cecelia|Charlestown|Clavis|Fairleigh|Hutton Heights|Ingogo|Lennoxton|Madadeni F|Madadeni Section 3|Ngagane|Thembalihle"],
  ["nkandla", "Bayete|Cungewane|Dolwana|Ekombe|Ekuthokozeni|Fort Louis|KwaZondi|Mabaleni|Makhanyezi|Mbiswe|Mdimela|Ohlelo|Pholela|Qudeni|Randalhurst|Sibhudeni|Spinnies|Tandanani"],
  ["nongoma", "Bangonomo|Bhicini|Buxedeni|Dayeni|Dongothuli|Gusenzamo|Hlambanyathi|KwaDuma|KwaMandlakazi|KwaMateni|KwaMememe|Lindizwe|Mahashem|Mahashini|Mahlombe|Majomela|Maphophoma|Mngamude|Ncungu|Ngwabe|Njampela|Ogedleni|Qonggo|Saint Alban|Sidinsi|Sizabantu|Sovane|Zihlakenpele"],
  ["nquthu", "Agatha|Eensgevonden|Hlazakazi|Jabavu|Luvisi|Magabeni|Magode|Magogo|Maphungu|Mhlungwane|Mkonjane|Nceceni|Ncepheni|Ndatshana|Nkande|Nondweni|Nqutu|Onvergenoeg|Saint Augustine’s|Saint James|Saint Johns|Saint Matthews|Saint Thomas|Silutshana|Vuna"],
  ["okhahlamba", "Acton Homes|Amanzana|Ardmore|Bergview|Bonjaneni|Busingatha|Cathkin Park|Delville|Dewdrop|Dragon Peaks|Dukuza|eMahhukwini|Emmaus|Ethels Drive|Forest Ranger|Geluksburg|Grantleigh|Hambrook|Home Farm|Isandlwana|Khethani|Kruisfontein|Makhwelela|Northern Drakensburg|Oliviershoek|Oqhumu|Rookdale|Roseville|Shambles|Wolwefontein|Zunckels|Zwelisha"],
  ["raynkonyeni", "Allerton|Anerley|Borderland Estate|Braemar|Bushyvales|Doc Wilson Point|Eden|Eedeswold|eSigodaneni|Frome|Ga-Malakhe|Gamalakhe-A|Gcilima|Glendale|Glenfield|Glenmore Beach|Hibberdene|Izingolweni|Izotsha|KwaCele|KwaGamalakhe|KwaHlomendlini|KwaMadlala|KwaMshiwa|KwaNkunswana|KwaNonhlanga|KwaNzimakwe|Leisure Crest|Louisiana|Mahlubeni|Marburg|Margate Retirement Village|Marina Beach|Mbango|Melville|Moguntia|Mpenjati|Mpeshu|Mpunzi Drift|Munster|Nositha|Nqabeni|Oatlands|Oribi Gorge|Oslo Beach|Paddock|Palm Beach|Patwa’s|Port Edward|Portobello|Portobello Beach|Saint Michael’s on Sea|Sanlameer|Sea Park|Sea-View|Seafield|Southbroom|Southport|Sunwich Port|Thorndale|Thundeza|Tonjeni|Trafalgar|Ubango|Umtentweni|Umzumbe|Uvongo Beach"],
  ["richmondkzn", "Aloe Corner|Atherstone|Baynesfield|Blarney|Byrne|Craig Side|Durslade|eKupholeni|eMgadleteni|eMngwenya|eNgqekweni|Greenhill|Hela Hela|Hopewell|KwaCebelele|KwaGengeshe|KwaMagoda|Lovodale|Pateni|Richmond|Simozomeni|The Rest|Thornville|Thurlough|Trewirgie"],
  ["ubuhlebezwe", "Alderly|Cartriff|Chatwell|Cranswick|Cromwell|Crystal Waters|Fairfield|Ferrby|Finchley|Highflats|Hlokozi|Islington|Ivanhoe|Joubertstroom|Lockwood Hall|Longlands|Matshetshisa|Mkunya|Mpesheya|Mphesheya|Ndonyane|New Garret|Pampa|Radley|Saint Elmo|Saint Isidore|Saint Mirlarm|Wycliffe"],
  ["ulundi", "Babanango|Bululwane|Denny Dalton|Dlebe|Feessaal|Goje|Koningskroon|KwaCeza|KwaMahlati|KwaZondela|Langgewacht|Mahlabatini|Mfabeni|Mkhiweni|Mpungamhlophe|Nhlazatshe|Nkaphane|Nkonjeni|Nqulwane|Nqunyaneni|Ntabankulu|Ntilingwe|Okhukho|Riversmeet|Rooidrif|Surreyvale|Swarthoogte|Thembeni|Warmbaths|Witvoloos"],
  ["umdoni", "Amandawe|Arborville|Coolgardie|Dududu|Elysium|eMbo|eMuziwezinto|Esperanza|Fairfield|Freeland Park|Guliga|Ifafa|Ifafa Beach|Kelso|Kelso Beach|KwaDonsa|KwaQiko|KwaRwayi|KwaVimbindlela|Mfume|Mgoqozi|Mkhumbani|Mtwalume|Nkwali|Ocean View|Odidini|Park Rynie|Pennington|Scottburgh South|Sezela|The Cedars|Umgwemphisi SP|Vongonzana|Wincanton"],
  ["umhlabuyalingana", "Bhukubhukwini|Enkovukeni|Esibhoweni|eVelabusha|eZindongeni|Kosi|KwaMbonia|KwaMjiji|KwaMlamula|KwaShiya|KwaSonto|KwaZamazama|Mabibi|Madonela|Manguzi|Mangwenya|Mbangweni|Mbazwana|Mboza|Mengu|Mpkakathini|Mseleni|Munyu|Nhlambeni|Phelandaba|Sihangwane|Sihlenga|Thengani|Tshongwe|uMkhumbikazana"],
  ["umlalazi", "aMatikulu|Blackburn|Brooklyn|Covington|Delville|Emaqeleni|eNdlayangubo|Ensingweni|eNtumeni|Entumeni Mission|Fasimba|Gaqangezandla|Gezinsila|Good Hope|Hamewith|Highfield|Holy Cross|Inkunzana|Khovothi|KwaGingindlovu|Macekane|Mbongolwane|Mngampondo|Mtunzini|Ngutweni|Nkwalini|Nozandla|Nsingweni|Obanjeni|Ohubandaba|Overdene Estate|Oyemeni|Shakaland|Tugela|Wombane"],
  ["umngeni", "Ashley|Balgowan|Cedara|Curry’s Post|Esseldene|Everdon|Fort Nottingham|Greendale Park|Homewood|Kildare|Lidgetton|Lions River|Maloen|Mansfield|Merrivale|Mpophomeni|Nottingham Road|Saint Annes College|Sarsden Estate|Spitzkop|Yarrow"],
  ["umshwathi", "Albert Falls|Ambleside|Appelsbosch|Bishopstowe|Bruyns Hill|Clan Syndicate Mill|Claridge|Cool Air|Echane|Ekuthuleni|eMboni|Harburg|Harden Heights|Hlathikhulu|Hylton|Jaagbaan|Kildare|Krommedraai|KwaGqugouma|KwaNdlovu|KwaNobhena|KwaYibusele|Mount Alida|Mount Elias|Mpolweni|Mtulwa|Noodsberg|Odlameni|Ozwatini|Proclamation|Schroeders|Shooters Hill|Swayimana|Swidi|Talavera|Thandisizwe|Trust Feed|Windy Hill|York|Zeekogat"],
  ["umuziwabantu", "Banginyama|Beckenham|Brookland|Burnside|Clarevale|Deemount|eNkoneni|Gansa|Hluku|Kuzameni|Kuze|KwaMaci|KwaMboto|Lamaci|Langeni|Lovat|Mackton|Mvenyane|Ndlovini|Ngqolo|Nhlangwini|Nhlanza|Njamhlophe|Nombengeza|Phoenix Park|Pisgah|Qwebela|Redlands|Slaters|Stafford’s Post|Sundrift|Sutherland|Ubambulos|Weza|Xamini"],
  ["umvoti", "Ahrens|Baviaanskrantz|Ematimatolo|Embulwane|Eshane|Fairfield Mill|Glen Avon|Hesselwood|Jameson’s Drift|Kranskop|Kromberg|Kromvlei|Lilani|Lucerne|Makabeleni|Mawozini|Mdlelanto|Merthley|Mpanza|Mpofana|Muden|Nophethu|Oakover|Oliphants Hoek|Opati|Regina|Sevenoaks|The Ranch|Umvoti|Umvoti Location"],
  ["umzimkhulu", "Gaybrook|Ibisikululwa|Mfulamhle|Nazareth|Njunga|Ntsikeni|Siphangeni"],
  ["umzumbe", "Ardee|Brooklands|Cold Place|Cymru|Deyi|Dingimbiza|Dingle|Ekubusisweni|Elupepeni|Frankland|Friedenau|Glen Echo|Hazeldene|Hlaba|Kunyana|KwaDweshula|KwaMaqikizana|KwaNguza|KwaSanti|Mbonje|Mgayi|Morrison|Msinsini|Ngwenda|Nhlalwani|Ntaba|Ntabazwe|Pulunjani|Punayi|Saint Faith’s|Turton|Victoria|Zuma"],
  ["uphongolo", "Altona|Bennezar|Bethel|Dlomodlomo|Dwarsrand|eSivule|Golela|Izitende|Khiphunyawo|KwaDumenkungwini|KwaMlimisi|Magudu|Mangengenene|Mbekakanye|Ncotshane|Ngotshe|Ouderdom|Uithoek"],
  ["amahlathi", "Bolo|Braunschweig|Burnshill|Cata|Cenyu|Chatha|Debe Nek|Dohne|Donnington|Ethembeni|Fort Cox|Frankfort|Gwili Gwili|Happy Valley|Heckel|Horseshoe|Isidenge Bosboustasie|Izeleni|Kei Road|Kubusie Woolwash|KwaWezo|Lenye|Lower Rabula|Lower Wolf River|Majuba|Mbem’s|Mfula|Mnyameni|Mpahlanas|Ngabangu|Nqolo Nqolo|Nqumeya|Patulweni’s|Pirie|Qwili Qwili|Saint Matthews|Stockton|Sunnyside|The Downs|Thomas River|Umgwali Reserve|Upper Rabula|Wartburg Reserve|Wolf River|Zanyokwe|Zibula"],
  ["bluecrane", "Bracefield|Glen Cliff|Golden Valley|Hoekskraal|Hopewell|Klipfontein|Middleton|Middlewater|Mt. Prospect|Nelsig|Onder-Smoordrif|Petersburg|Populierplaas|Renosterfontein|Sheldon|Spitskop|Uitkeer|Vaalblok|Webster"],
  ["buf", "Almondale|Amalinda|Arcadia|Balasi|Bay View|Blue Bend|Bonza Bay|Braelynn|Breidbach|Buffalo|Buffalo Flats|Buffalo Harbor|Bulembu|Bunkers Hill|Cambridge|Christmas Vale|Cyprus Dale|Dimbaza|Dongwe|Donny-brook|Ducats|Duncan Village|Dyam-Dyam|Eluxolweni|Ententeni|Fort Grey|Fort Murray|Gately|Ginsberg|Gompo|Gonubie Manor|Gonubie Park|Gqola|Greenfields|Gulu|Hanover|Igoda Mouth|Ilitha|Jafta’s|Jojweni|Kayser’s Beach Road|Khiwane|Kidd’s Beach|Kiwane|Kom Nader|Kwa-Altile|Kwa-Ngcamama|KwaMasingatha|KwaMdingi|KwaMpundu|KwaPosi|KwaSandile|Kwelera|Lujiza|Lushington|Macleantown|Mamata|Mcotsho|Mdantsane N|Mdantsane Unit 5|Mdantsane Unit 6|Mncotsho|Mngoesha|Mozana|Nahoon|Ndevana|Newlands|Ntabozuko|Old Green River|Orange Grove|Park Ridge|Peelton|Phakamisa|Pirie Mission|Potsdam|Punzana Location|Qonce|Quigney|Rocklands|Sandile|Schornville|Shwele-Shwele|Southernwood|Sunnyridge|Sunrise|Sunrise-on-Sea|Thorn Ridge|Tshabo|Tyusha|West Bank|Willow Park|Windbreak|Winterstrand|Xamini|Zhikova"],
  ["drbeyers", "Adendorp|Allemanskraal|Anthonys Kraal|Apieskraal|Baviaanskloof Farming Community|Bestersdal|Bluegum Grove|Boxmoor|De Vlakte|De Weg|Doornfontein|Fullarton|Glandale|Grootrivierdrif|Honeyville|Hottentotspoort|Jansenville|Kendrew|Keurbos|Klipfontein|Klipgat|Klipplaat|Knoetze|Koentekraal|Kommandokraal|Kroonvale|Laughing Waters|Miller|Minnehaha|Mount Stewart|Petits Hill|Quacha|Rietbron|Sandkraalspoort|Sandvlakte|Sonop|Spandau|Steytlerville|Studtis|Tjoksville|Uitkomst|Volstruisleegte|Vondeling|Wapadspoort|Waterford|Welgerus|Wolwefontein"],
  ["elundini", "Annyama|Antelope Park|Bethania|Bhantini|Black Fountain|Blekana|Bloekomhof|Bowden|Calucalu|Caweni|Chamisso|Chevy Chase|Cicira|Colon|Cransmoor|Diphini|Dipini|Dludlu|Dulwane|Elands Heights|Faluku|Feltham|Fletcherville|Fontana|Frankstead|Galatyeni|Gemfane|Glen Avice|Goji|Golomane|Gqaqala|Ha-Nokholoko|Ha-Qhadi|Ha-Sefoko|Hardale|High View|Hlangalane|Kaffersleg|Katkop|Kenmore|Killarney|Kinira Poort|Komkulu|Ku-Fefa|Ku-Mayima|Ku-Ndoda|Ku-Ngcengane|KuMathumbu|KuMbulunga|KuNtabankulu|KwaGcwabe|KwaJozana|KwaLanga|KwaMleko|KwaQala|Lahlangubo|Lalini|Lehlakaneng|Lekgwareng|Lekhoba|Lixeni|Lokishini|Longden|Louden|Lower Tsitsana|Lubisini|Lugcadweni|Luzi|Mabbalane|Mabheleni|Mabugulu|Madwaleni|Mafusini|Maghatseng|Magutyubeni|Magwaca|Mahaneng|Mahemeng|Mahlubini|Makeng|Makwatlane|Manfengwini|Mangoloaneng|Maplotini|Marombe|Matafeni|Mathunzini|Mazizini|Mbhulanja|Mbidlana|Mbinja|Mbizeni|Mcambalala|Mcwangele|Mdeni|Mdilingwa|Mewangele|Mfanta|Mlamlankunzi|Mohoabatsana|Moroka|Mount Hope|Moyeni|Mpharane|Mpukane|Mrwatyeni|Msingizane|Nayijele|Ncambalala|Ncembu|Ncfilukeni|Nelani|Ngcele|Ngdilwe|Ngonjaneni|Ngqayi|Ngxaza|Ngxazana|Ngxingweni|Ngxoto|Niagara|Njaboya|Njikelweni|Nkalweni|Nkangala|Nqoma|Ntabeni|Ntaberu|Ntaboduli|Ntatyaneni|Ntywenka|Nxotshana|Oakleigh|Oliviersrust|Philipsrust|Pholile|Platana|Pretoria|Printso|Qhoehane|Qobong|Qokolweni|Qulungashe|Qurana|Qutsuma|Ramatee|Reed Park|Rhodesia|Risler|Rosendal|Sakute|Sapulandake|Sekgutlong|Setabataba|Sethathi|Siginggini|Sigodini|Sikhepheni|Silindini|Sinqungweni|Sinxago|Sithana|Sixotgeni|Siyalweni|Somerton|Stinkord|Tabase|Templehorn|Thabakhubelu|Thabaputsoa|Thembekeni|Thembeni|Thokwano|Tinana|Tlokoeng|Tokwana|Triple Streams|Tsatsana|Tshikitsha|Tshoana|Tsitsa|Tsoelike|Tsolobeng|Tyeni|Uluxa|Umnga Flats|Upper Sinxago|Upper Tsitsana|Woodcliffs|Xaxazana|Zimbane|Zimbileni|Zingonyameni|Zintlawini"],
  ["emalahleni", "Aangewysd"],
  ["emalahleniec", "Agnes|Agnes Rest"],
  ["emalahleni", "Balmoral"],
  ["emalahleniec", "Bankies|Beauly|Benard"],
  ["emalahleni", "Benella"],
  ["emalahleniec", "Bengu|Bhoqo|Black Streams"],
  ["emalahleni", "Blesboklaagte"],
  ["emalahleniec", "Boniswa|Bonny Glen|Boqo|Bradgate|Braunville|Buffalo Thorns|Buffelsdoring"],
  ["emalahleni", "Bulpan"],
  ["emalahleniec", "Cacadu|Chachu|Cibini"],
  ["emalahleni", "Clewer|Coalville"],
  ["emalahleniec", "Cumakala"],
  ["emalahleni", "Del Judor"],
  ["emalahleniec", "Deochandorris|Dongweni|Doornlaagte|Dordrecht|Driversdrift|Dumdum|Dunvegan"],
  ["emalahleni", "Duvhapark|Eensaamheid"],
  ["emalahleniec", "Eiffel"],
  ["emalahleni", "Emalahleni"],
  ["emalahleniec", "Endwe|Fairview"],
  ["emalahleni", "Ferrobank"],
  ["emalahleniec", "Freemantle|Gertplaas|Glen Adelaide|Glen Grey|Glen Grey Hospital|Glen Kobus|Gqebenya|Groenedal|Groenvlei"],
  ["emalahleni", "Grootpan"],
  ["emalahleniec", "Guba|Gubahoek|Hali No 1|Hardeveld|Hillside|Hilltop|Hillview"],
  ["emalahleni", "Hlalanikahle"],
  ["emalahleniec", "Ida|Indwe"],
  ["emalahleni", "Jackaroo Park|Kendal|Klipfontein|Klippan"],
  ["emalahleniec", "Knapdale|Komanas"],
  ["emalahleni", "Kriel|Kriel Power Station|Kromfontein"],
  ["emalahleniec", "Ku-Dyobhudaka|Ku-Liweni|Ku-Qwempe|Ku-Tsolokazi|KuBoniswa|KuDubeni|KuFani|KuJaho|KuKavara|KuMaqashu|KuNdonga|Kundulu|KuNgcuka|KuNkolonga|KuTsembeyi|KwaGcina"],
  ["emalahleni", "KwaGuqa"],
  ["emalahleniec", "KwaMbhali|KwaMtonjana|KwaNcani|KwaTanda|KwaTshatshu|KwaXusha|Lady Frere|Lalini"],
  ["emalahleni", "Landau"],
  ["emalahleniec", "Langpoort|Lanti|Lapesini|Lavinia"],
  ["emalahleni", "Lehlaka Park"],
  ["emalahleniec", "Lemoenkloof|Lokasie|Longlands|Lupindweni|Lyngdal"],
  ["emalahleni", "Lynnville"],
  ["emalahleniec", "Macubeni|Magashu|Makasi|Malo|Mamfeneni|Mandlaneni|Manelspoort|Maqonqweni|Maqwatini|Mariba"],
  ["emalahleni", "Masakhane"],
  ["emalahleniec", "Masangweni"],
  ["emalahleni", "Matla"],
  ["emalahleniec", "Matyatywa|Mcwangele"],
  ["emalahleni", "Merlindale"],
  ["emalahleniec", "Mgwalana|Milan"],
  ["emalahleni", "Minnaar"],
  ["emalahleniec", "Mkapusi|Mount Arthur|Mpotula|Mtonjeni|Mtsheko|Ncalukeni"],
  ["emalahleni", "New Largo"],
  ["emalahleniec", "Ngcuka|Ngonyama|Ngqanda|Nkalweni|Nkolonga|Noholoza|Nottingham|Nozala|Ntshinindeni|Nzimankulu"],
  ["emalahleni", "Ogies"],
  ["emalahleniec", "Orel|Paradys"],
  ["emalahleni", "Paxton"],
  ["emalahleniec", "Perhamdown"],
  ["emalahleni", "Phoenix|Phola"],
  ["emalahleniec", "Qoqodala|Qugqwaru|Qutubeni"],
  ["emalahleni", "Reedstream Park|Reyno Ridge"],
  ["emalahleniec", "Riverside|Robertsdale|Rockcliff|Rodana"],
  ["emalahleni", "Rooibloem"],
  ["emalahleniec", "Rushkar|Rwantsana|Saint Michaels Mission|Sidakeni|Sidwadweni|Sihom"],
  ["emalahleni", "Springbok"],
  ["emalahleniec", "Staatsplaas|Stoney Croft|Swartwater|Tafeni"],
  ["emalahleni", "Tasbet Park"],
  ["emalahleniec", "Thaleni|The Mill|Thornlands"],
  ["emalahleni", "Thubelihle"],
  ["emalahleniec", "Tsembeyi|Tshamazimba|Tshatshu|Tsolokazi"],
  ["emalahleni", "Uitkyk"],
  ["emalahleniec", "Upper Agnes|Upper Ndonga"],
  ["emalahleni", "Vaalkrans"],
  ["emalahleniec", "Valelo’s Rest"],
  ["emalahleni", "Van Dyks|Vandyksdrif"],
  ["emalahleniec", "Ventersrust|Walsingham|Willow Park|Willowdale|Xolora|Xonxa|Zingqwene|Zisovini"],
  ["engcobo", "All Saints|All Saints Nek|Bangweni|Bekileni|Beyele|Bodini|Bumbane|Caba|Cefane|Clarkebury|Cobosi|Coghlan|Cwecweni|Debera|Egoso|Elabafazi|Engxogi|Equtubeni|Gingqi|Goboti|Goso|Gqaga|Gqobonco|Gqubonco|Gqutyini|Gulandoda|Hart Dale|Jojweni|Kanye|Katinyanga|Komkulu|Ku-Hlaba|Ku-Manzimdaka|Ku-Ndaca|Ku-Nonyentu|KuBeyele|KuBojane|KuDidi|KuGilanqodo|KuManyisani|KuMaqanda|KuMtala|KuMtukuma|KuNqumakala|KuNtsimba|KuPhahla|KuQengqeleka|KuQoba|KuTshatshu|Kwa-Dabula|Kwa-Gcina|Kwa-Mtyatyamba|Kwa-Xoxo|Kwa-Zwelinzima|KwaBinca|KwaDlomo|KwaFane|KwaGxubana|KwaMajija|KwaMaya|KwaMbekeni|KwaMhaga|KwaNdima|KwaNzolo|KwaQoba|Kwelesha|langdon|Lixeni|Lookout|Lower Flucwecwe|Lower Gqobonco|Lower Mnyolo|Lubisi|Lucwecwe|Luembo|Lugolwenie|Luhewini|Madela|Madladleni|Maerman|Mahlubini|Mamfengwini|Mandlaneni|Mangxongweni|Manuneni|Manzana|Maqomeni|Matolweni|Mbashe|Mbilini|Mboleni|Mdeni|Mgangweni|Mgwalana|Mhlahlane|Mhlopekazi|Mjanyana|Mkanzi|Mkunjana|Mntintloni|Mnyolo|Mpindweni|Mqabo|Mqonci|Mtaleni|Mtini|Munjana|Ncaluken|Ndlunkulu|Nduka|Ngapezulu|Ngcacu|Ngcobo|Ngojn|Ngqokoto|Ngquru|Ngqutura|Ngwangwane|Ngxangxasi|Ngxeko|Nkondla|Nkondlo|Nkwenkwana|Nkwenkwazi|Nokomis|Nqantosi|Nqutuha|Nqutwaneni|Ntabamakwenkwe|Ntakwendlcla|Ntibane|Ntwashini|Phillipsdale|Pulangweni|Qebe|Qota|Qutubeni|Qutyini|Rocky Valley|Roma|Saint Alban’s Mission|Sentubi|Sigangeni|Sigingini|Sikobeni|Sikungwini|Singumeni|Sitebe|Sitoleni|Sitoza|Springs|Sundwane|Taleni|Tora|Tsalaaba|Tsalaba|Upper Mnyolo|Whitmore|Xokonxa|Xuka|Xuka Drift|Zabasa|Zadungahi|Zadungeni"],
  ["emgijima", "Aandenk|Aasvoëlkop|Aberdour|Airlie|Alicedale|Allemansvlei|Allendale|Alva|Amsterdam|Annawater|Annex Kilvorskull|Anniedale|Arthurs Seat|Artmor|Avilion|B.K. Mond (2)|Bailey|Bakenshoek|Bakenskop|Balinguile|Balmoral|Bamboeshoek|Bandon|Beamont|Bede|Bellavista|Bellevue|Belvior|Bergfontein|Blaauwater|Blaauwskop (1)|Blaauwskop (2)|Blackwoods|Blenheim|Bloemof|Blouboschpoortjie|Blue Boulders|Bonaparte|Bonhill|Bonnyvale|Bossieshoek|Bothaskraal|Botterkop|Braamfontein|Branstone|Broadlands|Bromley|Broughton|Brymac|Burnley|Carnarvon|Carrghmore|Carrickmoor|Castleton|Cetha|Charnwood|Chasant|Christiana|Cilleria|Clifton|Clifton Vale|Coldstream|Collingham|Combleigh|Cuylerville|Dagbreek|Dalkeith|Dalmanutha|Damanskraal|De Hoek|De Hoop|De Kuien|De Leegte|De Rust|Den Haag|Dennie Park|Derrington|Dickenstone|Die Vlakte|Diepfontein|Doornbosch|Doornhoek|Doornkloof|Doornkop|Doornylei|Doringrivier|Downley|Dragospoortjie|Driefontein|Driehoek|Droëfontein|Drummond Gate|Duneden|Dyamala|Echodale|Elandsberg|Elandskop|Elandsrivier Poort|Elim|Emtabazo|Enqobokeni|Erfdeel|Esperanza|Eveneser|Everton (1)|Everton (2)|Excelsior|Ezibeleni|Fairfield|Fonteinplaas|Geluk|Geluksvlei|Gerluk|Gladswood|Glen Cave|Glen Ewan|Glen Rae|Glenrock|Goedehoop|Goedgedag|Goedvenwag|Goedverwacht|Good Hope|Grassdale|Grasslands|Greystone|Groenfontein|Grootdam|Grootschuur|Gruisklip|Haasfonteindorings|Hackney|Hackney and Cibini|Halseton|Hardop|Harmonie|Hartbeesnek|Hartebeesfontein|Hartebeesnek (1)|Hartebeesnek (2)|Heathfield|Hebron|Heilbron|Helmekaar|Herberg|Highlands|Hillcrest|Hillcroft|Hillside|Hofmeyr|Home Park|Hoogstede (1)|Hoogstede (2)|Hope Vale|Hopefield|Hopeleigh|Hopewell|Hopwood|Hughenden|Hukuwa|Ida|Ilinge|Imvani|Ivanhoe|Jakkals Pos|Jakkalspoort|Jericho|Joewyns Park|Kaalplaas|Kaffersleegte (1)|Kaffersleegte (2)|Kalkfontein|Kamastone|Kareebosleegte|Kareehoek|Kareekloof|Kareekloot|Kei and Bulhoek|Kenilworth|Kettershoek (1)|Keylock|Kings Glen|Klein Mayburgsdam|Kleingeluk|Kliodrift|Klipdam|Klipfontein|Klipkraal|Klipkraal (2)|Klipplaat (1)|Knowsley|Kraaiplaas|Kransplaat|Kransvoëlleegte|Kroonberg|Ku-Zitungu|KuZingqutu|Kwaggasvalkte|KwaKotilitye|KwaManzikraka|KwaTwalo|La Motte|Lahlangubo|Langkloof|Larochelle|Leeukuil|Leeuwkuil (1)|Lehmansdrif|Lesfontein|Lesseyton|Liebendal|Lily Vale|Lindesdal|Lismore|Lombardy|Lonely|Loskop|Love Dale|Lower Didimana|Lower Gretna|Luqolweni|Luxeni|Macibini|Magdala|Malfontein|Mamre|Manelsdam (1)|Maraisburg Studam|Marsden Flats|Marshmoor|Martindale|Mceula|Mecklenburg|Meriefontein|Merinowelk|Meyershoek|Mid Klipfontein|Middelburg|Middelplaat|Mitford|Modderbult|Molteno|Monderbult|Mooipoort|Môreson|Môrester|Morgenzon|Morning Sun|Mousa|Mtebele|Ndumangeni|Ngojini|Nkonkobe|Nomonde|Noordelike Haasfontein|Notcliffe Park|Nyana|Onverwacht (2)|Osberg|Osfontein|Oudelkraal|Palmietfontein|Peninsula|Penryn|Pleasant View|Primgradia|Proceshoek|Quaggafontein|Quarrelbrook|Queensdale|Queenstown|Randfontein|Retreat|Rhenosterhoek (1)|Riebeek|Rietfontein|Rietgat|Riverdale|Riverside|Rockdale|Rocklyn|Rocky Fountain|Romance|Romans Laagte|Romansfontein|Rondekop|Rondezvous|Rooikop|Rooiplass|Rooipoort|Rooirand|Rosendal|Rotterdam|Rusoord|Saaiplaas|Sada|Sandvlei|Sawutiya|Schaapkraal|Schoemanskraal|Serfontein|Sewefontein|Sieraadsfontein|Silverstream|Skietfontein|Skietlegte|Skikplaas|Slaapkop|Sleeohoek|Smithfield|Smithsriviere|Sonskyn|Souvereign|Spitskop (2)|Spreeufontein|Springvale|Sterkfontein|Sterkfontein (1)|Sterkfontein (2)|Sterkstroom|Sterling Park|Stockdale|Stormberg|Strathfield|Sunny Ridge|Sunnyside|Suurfontein (2)|Swaelkrans|Tafelkop|Tarkastad|Temple Vale|Templeton|Teviot|The Downs|The Glen|Thorneycroft|Toorkop|Tsitsikamma|Turveys Post|Tweefontein|Tweerivieren (2)|Tylden|Uitkyk|Uitryk|Umtwakazi|Upper Didimana|Upper Gretna|Upper Lonely|Uvongo|Vaaldrift|Valdai Hills|Vale End|Van Vuurenshoek (2)|Vegkoppies|Verdien|Vereeniging|Vleiland|Vosloosrust|Vrede|Vrederus|Vredevlei|Vreeniging|Vrolikskop|Vrolykskraal (1)|Vryheid|Waltersfontein|Waterkloof|Waterlea|Waverley|Welgesien|Weltevrede|Weltevreden|Welverdien|Welverdiend|Wildebeestekuil Noord|Wildehondefontein|Wilgerboschdam (1)|Wilgerbosdam|Willownook|Windy Ridge|Winterborn|Wintersrust|Woltemade|Wolwefontein|Wolwehoek|Yardley Chase|Zandfontein|Zangqokwe|Zigudu|Zingqutu|Zulumema"],
  ["greatkei", "Audie|Avalon|Barracuda|Bayview|Beacon Hill|Bernese|Black Hill|Bluerock|Bokpoort|Bylletrs|Carleen|Chintsa|Cintsa|Cintsa Mouth|Cintsa Mouth West|Crediton|Cwili|Dallas|Diphini|Double Mouth|Ewanrigg|Fort Warden|Geneva|Glen Muir|Glengariff|Gubeni|Gxarha|Haga-Haga|Happy Home|Harefield|Hatchleydene|Hopewell|Irisdale|Kefani|Kelswood|Khwenxurha|Kildare|Krauses Beach|KwaMahomba|KwaSilatsha|Kwelera|Kwelerha|Kwenxura|Lemoenfontein|Lily Vale|Lone Tree|Lusasa|Lusizini|Marshstrand|Moedershuis|Monzi Park|Morganville|Mountford|Mpetu|Mzwini|Ncalukeni|Ngxingxolo|Ocean View|Pine Tops|Puzana|Queensberry Bay|Quko Valley|Rockwood|Rocky Ridge|Round the Bend|Seaview Water Park|Sotho|Sparkling Hills|Sunray|Sutcliffe Vale|Toekoms|Towerhill|Try Again|Tyityaba|Van Der Kemp|Vista|Wildene"],
  ["ingquza", "Balasi|Bhala|Bhungeni|Bodweni|Buhlanyanga|Bukazi|Bumazi|Buziba|Cane|Cutweni|Dangwani|Dumasi|Fahla|Fokoxo|Gangeni|Hillside|Hiwahlwazi|Hlabati|Hlabatini|Hlapabomvu|Hlwahlwazi|Holy Cross Mission|Kanya|Kilroe Beach|Klondyke|Ku-Dupu|Ku-Gwexintaba|Ku-Masadala|Ku-Mate|Ku-Ndlazi|Ku-Nikwe|Ku-Nkongolo|Kwa-Bala|Kwa-Bhumbuta|Kwa-Cita|Kwa-Coka|Kwa-Dick|Kwa-Gqwaru|Kwa-Magcude|Kwa-Mbokotwebomvu|Kwa-Ndovelana|Kwa-Njeya|Kwa-Ntambula|KwaBhushula|KwaDlambula|KwaHome|KwaManci|KwaZulu|Lingeni|Lugongqozo|Lujecweni|Lukahlambeni|Lundini|Lupatana|Lutsheni|Lwandlana|Madotyeni|Magqabasini|Maliwa|Mandabeleni|Mantusini|Maramzeni|Mateku|Mavaleleni|Mawotsheni|Mbotyi|Mcatuve|Mcelu|Mcizanyetshe|Mcoboti Mission|Mcobotini|Mdikisweni|Meni|Mfinizweni|Mfundeni|Mgodini|Mgume|Mhlanga|Mhlumba|Mhlwazini|Mjelweni|Mjombela|Mkambati|Mkamela|Mkankomo|Mkata|Mncane|Mneketshe|Mount Hope|Mount Nelson|Mpolweni|Mpondombini|Mpumaze|Mreshaneni|Mseleni|Msikaba|Mtonjeni|Mtontsasa|Mtshekelweni|Mtwaku|Mvimvane|Mxotyelwa|Ndindini|Ngcweleni|Ngobozana|Ngojini|Ngpandulo|Ngqeleni|Ngqwabeni|Ngucini|Nkunzimbini|Nqaqumbe|Ntentula|Ntlavukazi|Ntontela|Ntsubane Bosboustasie|Nxuze|Nyareni|Nzimankulu|Palmerton|Port Grosvenor|Puffadder|Qamangeni|Qawukeni|Qolora|Rombityi|Rwantsana|Sicwenza|Sihlahleni|Sikolweni|Sipaqeni|Sipezini|Sizindini|South Sand Bluff|Tanga|Tembeni|Tembukazi|The Vlei|Tina|Tshandtshe|Tsweleni|Twazi|Upper Mkata|Xokozweni|Xopozo|Zadungeni"],
  ["intsikayethu", "Banzi|Bholothwa|Bilaty|Bongolethu|Camama|Cibini|Cotyeni|Cuba|Cungwana|Deckert’s Hill|Dikeni|Elima Soga|Fort Ivor|Garner’s Drift|Gesini|Guse|Keilands|Ku-Qwebeqwebe|KuBilatye|KuDlakavu|KuDudumashe|KuKose|Kulo-Ngqa|KuLoqolo|Kulufini|KuMabangula|KuMagwala|KuMahlungulu|KuMaya|KuMbaxa|KuMtyamde|KuNcwana|KuNgcaca|KuNgqwaru|KuNomadamba|KuNtlonze|KuNyongwane|KuTyawana|KuWohlo|Kwa-Mnqanqeni|KwaDlomo|KwaDudumashe|KwaGambu|KwaHala|KwaKwebulana|KwaMbombela|KwaMcatuve|KwaMpotulo|KwaNdibaniso|KwaNgali|KwaNgudle|KwaNgxuthu|KwaNobhokwe|KwaShwini|Kwezana|Lalini|Lawudini|Lower Mcambalala|Lower Mtingwevu|Lower Sabelele|Luqolweni|Madlotsheni|Mahlatini|Mahlubini|Main|Makwababa|Mamfeneni|Mamfengwini|Mampondweni|Maqwathini|Maqwatini|Matolanyile|Matshaba|Mawusheni|Mayireni|Mazizini|Mbinzana|Mbulu|Mbulukweza|Mdeni|Mgqanga|Mgxobozweni|Mhlahlane|Mhlobo|Mkonjana|Mkukwini|Mkwinti|Mount View|Mpunga|Mthonjeni|Mtingwevu|Mtonjeni|Mtshabe|Mtshanyana|Mtyintyin|Mtyintyini|Ncoha Flats|Ncora|Ncuncuzo|Ndulini|Ngaphantsi|Ngonyama|Ngxabangu|Nkomfeni|Nkxini|Nobhokhwe|Nomadamba|Nqinayo|Nququ|Ntwashwini|Nxelesa|Oaklands|Qamata|Qamata Poort|Qaqane|Qhumanco|Qineni|Qitsi|Qitsi-Ndlunkulu|Qolweni|Roda|Rwantsana|Saint Mark’s|Saint Patrick’s|Seplan|Sidubi Poort|Sidutyini|Sigangeni|Sigubudwini|Sikobeni|Singeni|Siqitini|Sixotyeni|Southeyville|Sweetlayini|Tabazini|Tatsi|Tsakana|Tsojana|uMzantsi|Upper Mcambalala|Upper Tsojana|Zingadini|Zingqutu"],
  ["inxuba", "Conway|Edenfield|El Alemein|Glen Alfa|Grassridge|Groenkloof|Groot-Samenkomst|Hazeldene|Herbou|Kwaairivier|Lingelihle|Lowlands|Magjuan|Maryland|Middelburg|Middelplaas|Midros|Mortimer|Perserance|Review|River View|Rodenia|Rosmead|Rusoord|Schoombee|Sunnyside|Tarkabrug|The Meadows|Thornwood|Uitkyk|Visrivier|West Burn"],
  ["ksd", "Bacela|Bakeni|Bashee Bridge|Belekana|Bellrock|Bhaziya|Bityi|Black Rock|Buwa|Caba|Cefane|Centuli|Cezu|Chizele|Chumbi|Cibini|Cicira|Cirira Opleidingskool|Crocodilevlei|Cunstula|Cwecwe|Dankeni|Darabe|Dikeni|Diova|Dlakatweni|Dulwini|Dwaleni|Fama|Fort Gale|Futye|Gazini|Gengqe|Golomi|Gotyibeni|Gqabati|Gqubeni|Griebdale|Guduse|Hely Grove|Hlabatshane|Hole in the Wall|Ironstone|Jabula|Jojweni|Kambi|Kohlo|Komkhulu|Kongeni|Kotishini|Ku-Buka|Ku-Canti|Ku-Duka|Ku-Gengqe|Ku-Hlope|Ku-Lozulu|Ku-Magubu|Ku-Malongwe|Ku-Mankazana|Ku-Mapahla|Ku-Mhlabubomvu|Ku-Mvezo|Ku-Ncengana|Ku-Ndlunkulu|Ku-Njombela|Ku-Nokana|Ku-Nongcwengana|Ku-Nqwati|Ku-Nyokinala|Ku-Raxa|Ku-Sigiba|Ku-Sinxuzula|Kubeka|KuBeke|KuGqangushe|KuGunjana|Kujonga|KuLudondolo|KuLuxomo|KuMayibe|KuMbozwana|KuMgawuli|KuNcalolo|KuNgqovu|KuSikulume|KuXenge|Kwa-Dukatole|Kwa-Gcaleka|Kwa-Gomatana|Kwa-Herman|Kwa-Kahla|Kwa-Maradede|Kwa-Mbanyaru|Kwa-Ndinja|Kwa-Ninwayo|Kwa-Ntabezulu|Kwa-Ntshoma|Kwa-Pahla|Kwa-Tshezi|Kwa-Xego|Kwaaiman|KwaCawu|KwaDilatashe|KwaGubevu|KwaMhaga|KwaMiya|KwaMlawu|KwaQiya|KwaSaba|KwaSidumo|KwaXokoshe|Kwenxura|Lalini|Lands End|Lindini|Lower-Ngqwara|Lubalekweni|Ludaka|Lukwetu|Lulwalweni|Lupondweni|Luxeni|Lwandlana|Mabehana|Madakeni|Madwaleni|Magontsini|mahlungulu|Malindini|Mampingeni|Mampondweni|Manangeni|Mancam|Mancotsheni|Mandileni|Mandlaneni|Mangqabasheni|Mantshilibeni|Manyosini|Manzotweni|Mapuzi|Maqadini|Maqanyeni|Maqhinebeni|Maqomeni|Maqwambini|Masana|Mateko|Matshongwe|Matyeni|Mavundleni|Maxwele|Mazizini|Mbanyaru|Mbholompo|Mbozisa|Mcata|Mdeni|Mdiliweni|Mgweni|Mhlahlane|Mhlangura|Mjikweni|Mmangweni|Mmelwane|Mncwasa|Mnqanda|Monarch|Mount Blazes|Moyeni|Mpafeni|Mpako|Mpambu|Mpandela|Mpapela|Mpeko|Mpindweni|Mpunzana|Mputi|Mqekezweni|Mqemeni|Mqokrweni|Msukeni|Mtentu|Mthentu|Mvasini|Mvezo|Mxambule|Mzinya|Nayisifili|Ncambedlana|Ncambele|Ncanaseni|Ncise|Ndibela|Ndlovana|Ndokwane|Ndundumeni|Nenga|New Brighton|Ngangelizwe|Ngaphezulu|Ngcatembeni|Ngcenduna|Ngcilibanzi|Ngcwanguba|Ngingqini|Ngqakayi|Ngqumane|Ngqungf|Ngqungu|Ngqwara|Ngumngum|Ngwangweni|Ngwevana|Ngxingweni|Njeni|Nkalweni|Nkwalini|Nomcama|Nooitgedacht|Nqati|Nqcekuma|Ntabeliza|Ntabeni|Ntilini|Ntlakwedlela|Ntlanjeni|Ntlekiseni|Ntlukuhla|Ntsitshana|Oakancu|Old Morley|Orange Grove|Phangindela|Qawukeni|Qelane|Qingqolo|Qiya|Qokolweni|Qolombana|Qolweni|Qota|Qozeleni|Qubeni|Qunu|Relegwini|Rini|Ross Mission|Rune|Sangoni|Selborne|Setebe|Sheshegu|Shilabeni|Shukenxa|Sigubudweni|Sigubudwini|Sihlabeni|Sikobeni|Sikolweni|Silevini|Siqikini|Sixonkxweni|Sixuzulu|South African National Tuberculosis Settlement|Spring Vale|Tabase|Tafani|Tala|Taleni|Tambekeni|Telegap|Thwalikhulu|Tungwana|Tungwane|Tunxe|Twane|Tyelebane|Tyeni|Tyolo|Tyolweni|Tyumbu|Upper Ngqwara|Upper Tabase|Upper Xongora|Waqu|Wilo|Xibeni|Xongora|Xonyeni|Xora|Xorana|Xwili|Zanci|Zidindi|Zimbane|Zinkawu|Zintukwini|Zitenjini|Zixekeni"],
  ["koukamma", "Bergheim|Bernardshoek|Boplaas|Brandhoek|Bruinklip|Clarkson|Coldstream|Eersterivierstrand|Fairview|Geelhout|Heights|Kleinbos|Krakeelrivier|Lottering|Louterwater|Lucerna|Marienburg|Nuweplaas|Onverwagslaagte|Oubosrand|Oubosstrand|Ravinia|Redclyffe|Rockdale|Sanddrif|Sardinia Bay|Stormsrivier|Stormsriviermond|Thornham|Twee Riviere|Two Streams|Witelsbos|Witkleibos|Woodlands"],
  ["kouga", "Andrieskraal|Armmansvriend|Aston Bay|C-Place|Cambria|Cape St Francis|Centerton|Crossways Farm Village|De Mistkraal|De Mistkraal Nedersetting|Ferreira Town|Fountains Estate|Gamtoosriviermond|Hankey|Jeffreys Bay Lifestyle Estate|Kabeljous|Klipheuwel|Kougadam|Kromriviermond|Kruisfontein|Loerie|Loerieheuwel|Longmore|Marina Glades|Melon|Milton|Mimosa|Mondplaas|Noorsekloof|Noorshoek|Otterford|Oyster Bay|Paradise Beach|Patensie|Pellsrus|Riversea|Sandland|Sea Vista|Thornhill|Wavecrest|Weston"],
  ["makana", "Alicedale|Armistice|Assegaairivier|Balcraig|Botha’s Ridge|Committees Drift|Farmer Field M|Fort Brown|Glen Ambrose|Grahamstown|Greenlands|Highlands|Howieson’s Poort|Kings Heights|Mitford Park|Riebeek-Oos|Rosedale|Salem|Seven Fountains|Sidbury|The Haven|Trumpeters|West Hill|Yarrow"],
  ["matatiele", "Afzondering|Bees Vallev|Belfort|Bertievale|Bittern|Cabhane|Dengwane|Dumasini|Elukoweni|Esehlabeni|Felleng|Gladstone|Gleneric|Good Hope|Ha-Majoro|Ha-Mothibisi|Ha-Ramarolong|Ha-Tlhakanelo|Hadiaho|Haisaka|Hasetati|Hilda Heath|Hlakoane|Hototo|Kepisini|Khohlong|Kholweni|Killarney|Kinira Drift|Komkhulu|Kroonhoek|KwaHlomendlwini|KwaKesa|KwaMagadla|KwaMbobo|KwaNkau|KwaPalani|KwaSibonda|KwaVikinduku|KwaZengele|Lehlohonola|Lekhalaneng|Lekhalong|Likamoreng|Likhetlane|Linotsing|Lubaleko|Lufefeni|Lugada|Lunda Gate|Lupindo|Luqaqeni|Luxeni|Mabula|Madlangeni|Maduna|Maghatseng|Magxeni|Mahlake|Makhalitseng|Makholweni|Makomereng|Maluti|Mampola|Mangolong|Mapfontein|Maphakatlaling|Mapoki|Mapolesene|Maqundane|Maria-Linden|Mariazell|Mashata|Masimangweni|Masiza|Matandela|Mateleng|Matlas|Matolweni|Mavundleni|Mdeni|Mehloloaneng|Mgxojeni|Mhlangeni|Mkhuhlane|Mnceba|Moeaneng|Monkhankhaneng|Moqhobi|Mosenene|Motley|Mount Hargreaves|Mount Plaisir|Moyeni|Mpharane|Mtumasi|Mvenyane|Myemaneni|Ncome|Ndulini|Nkadi|Nkaus|Nkaweni|Nkawulweni|Nkupelweni|Ntabatsewu|Nyaniso|O’Connors Camp|Otterburn|Paballong|Pamlaville|Phuthing|Pifane|Polite|Pontsene|Pontseng|Pote|Potlo|Queen’s Mercy|Ramas Gate|Roamers Rest|Rockhaven|Rossdale|Saint Columbus|Saint Francis|Santombe|Semonkong|Siberia|Sidakeni|Sigoga|Sijoka|Sikewini|Sikhetlane|Snakefield|Somabadi|Taylerville|Tereseng|Thaba Chitja|Thabana|Thabeng|Thaweni|The Gums|Tsitsong|Weltevreden|Zimpofu|Zincuka|Ziqalabeni|Zitapile"],
  ["mbhashe", "Alderley|Badi|Bashee|Beecham Woods|Bende|Bhetani|Bhongweni|Bhunga|Bikana|Bikanadale|Blue Lagoon|Bojeni|Bolotwa|Bomela|Bonde|Bulungulu|Camsha|Caphu|Ciko|Cingweni|Cizele|Collywobbles|Cooperdale|Cumakala|Cungweni|Cwebe|Dabane|Dadamba|Duff Bank|Dwesa|Ebenda|Ebufumbu|eMabeleni|eQokama|Esinquineni|Exeni|Fairview|Falakahla|Fort Malan|Garrick|Gosara|Gotyibene|Gotyibeni|Gqiba|Guxuxu|Gwadana|Gwadu|Gxara|Hobeni|Idutywa River|Jalamba|Jujura|Kalalo|Kampplek|Kasa|Keti|Kohlo|Komkulu|Kotyana|Ku-Gilandoda|Ku-Ludondolo|Ku-Msikiti|Ku-Xawuka|KuAmanzimnyama|KuBangqo|KuBom|KuFundakubi|KuGambushe|KuGroxo|KuGxara|KuLofumbata|KuLogongoto|KuLogqogqa|KuLojingqi|KuLombete|KuLombombo|KuLovulandi|KuMahasana|KuMbonda|KuMembesi|KuMkulu|KuNcityana|KuNgqungqumbe|KuNgqutu|KuNjemane|KuNkazana|KuNkumba|KuSunduza|KuVulindawo|KuXama|KwaBanqo|KwaBawu|KwaBitsha|KwaBoto|KwaDesi|KwaHadi|KwaLuvundu|KwaMayijl|KwaMazamisa|KwaMganu|KwaMyataza|KwaNditya|KwaNgezana|KwaNjana|KwaNokatana|KwaNongxeke|KwaNtloko|KwaPewuta|KwaRasi|KwaSogula|KwaSongwevu|KwaVelelo|Kwilini|Lalini|Lotha|Lubomnini|Lubomvini|Ludiza|Lukolweni|Lundie|Lututu|Lutwayizo|Luvundu|Ma-Africa|Mabheleni|Macireni|Madwaleni|Magazana|Magqabi|Mahasana|Mahliwane|Makaka|Malulwane|Mampondweni|Mandluntsha|Mandundu|Mangati|Mantanieni|Mantlaneni|Manxiwa|Manzi|Manzikahyi|Masakane|Masincedane|Matanzima|Matolweni|Matonana|Matunzini|Mazizini|Mbamba|Mbangcolo|Mbanyana|Mbashe|Mbeleni|Mbewana|Mbewula|Mbityana|Mboxo School|Mboya|Mbozi|Mcelwane|Mcinga|Mdikana|Mdwaka|Mdzonga|Melitafa|Mendu|Mendwana|Mevana|Mfezane|Mfula|Mgojo|Mgotwane|Mhlanganisweni|Mishini|Mkatazo|Mkuhlu|Mnandi|Mncwasa|Mndwaka|Mngeangatelo|Mount Pleasant|Mpame Bos|Mpeshewa|Mpolweni|Mpozolo|Mpuku|Mpume|Mputhi|Mqele|Mqinda|Mqonci|Msengeni|Mtogazi|Mtonga|Mtshayeleni|Mtshekelweni|Munyu|Mzantsi|Ncalukeni|Ncedana|Ncembezana|Ncihana|Ndesi|Nduku|Ndulini|Ngabara|Ngadla|Ngcingwane|Ngcizele|Ngingqini|Ngojini|Ngqakayi|Ngqangqaka|Ngqantsingana|Ngqatyana|Ngwane|Ngxutyana|Nikwalini|Nkanga|Nkanya|Nkawukazi|Nkelekete|Nkonjane|Nocwane|Noeza|Noizela|Nqabane|Nqabara|Nqabarha|Nqakanqa|Nqanda|Nsimbakazi|Ntengisani|Nthlabane|Nthlonyana|Ntilini|Ntlahlana|Ntlangano|Ntlanzini|Ntlonyana|Ntlonyane|Ntshangase|Ntshatshongo|Ntsimba|Ntsimbakazi|Ntsimbini|Ntubeni|Nyokana|Nywara|Old Idutywa|Pakati|Patankala|Prospect|Qakazana|Qatywa|Qawukeni|Qazini|Qokama|Qombe|Qora Mouth|Qwaninga|Ramra|Rivermead|Riverview|Rockville|Rothmere|Rwantsini|Rwegweni|Sea View|Sheshegu|Shixini|Sholora|Sikobeni|Singeni|Sitatwini|Sitishini|Sizini|Spring Hill|Sunduza|Tafalehashi|Talemofu|Taleni|Taleni School|Tenza|The Haven|Thomson|Timane|Timani|Tsholora|Tubeni|Tunzini|Tyiw|Upper Bolotwa|Upper Ciko|Upper Gwadu|Upper Nywara|Valray|Wattle Grove|Wellshot|Weza|Xama|Xanxo|Xobojiyne|Xonyeni|Xora Mouth|Ziqhorana|Zitenji|Zitenjini|Zithulele|Ziwundwane|Zwelidumile"],
  ["mhlontlo", "Balatsi|Beledale|Belekence|Bhubesi|Bokwana|Caba|Caba Vale|Cala|Ceka|Cokomfini|Culunca|Elujecweni|eLundi|Enca|Etyeni|Gabazi|Gaduka|Godini|Godzi|Gongo|Gotyibe|Gqogqora|Gqukunqa|Gqwesa|Gugwini|Gura|Hkankweni|Hlabati|Hukwini|Inxu Drift|Jengce|Junction Ferry|Khalankomo|Killarney|Ku-Goeyana|Ku-Madukuda|Ku-Nomadolo|Ku-Ntabo Sigogo|Ku-Ntlotshe|Ku-Qudu|Ku-Tikitiki|KuBhukazi|KuDlabhane|Kumajaba|KuNgcoti|Kwa-Beja|Kwa-Dumba|Kwa-Dunjane|Kwa-Madiba|Kwa-Magqadazeni|Kwa-Mampengeni|Kwa-Ngcanasa|Kwa-Ngxabane|Kwa-Notaza|Kwa-Nozizityana|Kwa-Ntiskwe|Kwa-Nyabeni|Kwa-Nyembezi|Kwa-Nyokana|Kwa-Qala|Kwam|KwaNgcanase|Lalini|Lotana|Lower Tyira|Ludlameni|Lujecweni|Luqolweni|Lutshini|Machibini|Madokodeni|Madwaleni|Magezimeni|Magontsini|Magqubeni|Magutywa|Magxeni|Mahlungulu|Majodini|Makuleni|Maladini|Malepelepe|Mangwaneni|Mangxamfu|Manxelene|Maqanyeni|Marambeni|Marwatini|Maswabantwana|Matyeba|Mavaleleni|Mavundleni|Mbebe|Mbizeni|Mbokotwana|Mbombo|Mdabukweni|Mdeni|Mditshwa|Mhlabamnyana|Mhlangala|Mhlani|Middle Mjika|Mjika|Mjikweni|Mjilana|Mjilikazi|Mmangonkone|Mmangweni|Mngceleni|Mngh|Mnqunyana|Moorespost|Mpendle|Mpetsheni|Mphehla|Mpindweni|Mpumaze|Mqandanto|Mtozelo|Mvumelwano|Mzembe|Mzuzanto|Ncalukeni|Ncolosi|Ncoti|Ncumbe|Ndakana|Ndakeni|Ndezebe|Ngcepeni|Ngcolokeni|Ngele|Ngowaneni|Ngqubusini|Ngqwaneni|Ngundani|Ngwemnyama|Ngxakolo|Nkamasana|Nkungwini|Nogeya|Nomhala|Noziyongwana|Nqadu|Ntabelanga|Ntsheleni|Ntshigo|Ntsimbini|Ntsukandihlale|Ntwenka|Nyanisweni|Qhankqu|Qhotira|Qotira|Qwelana|Rockdale|Saint Cuthbert’s|Sangqu|Sapompolo|Shawbury|Shukuna|Sidwadweni|Sikobeni|Singeni|Sisuza|Sithaleni|Sithangameni|Sivivane|Sulenkama|Swazini|Tabase|Thembeni|Tina|Tina Bridge|Tina Falls|Tintwa|Toleni|Tsitsa|Tsitsa Bridge|Tyira|Upper Mjika|Upper Roza|Xabane|Zilandana|Zingcuka|Zinyosini"],
  ["mnquma", "Bakaneni|Bawa|Bethel|Bhokhwe|Bogo|Bongweni|Bunga|Busila|Cafutweni|Cat’s Pass|Cebe|Cegcuwana|Centani|Centuli|Columba|Dadiyane|Diva|Dlepu|Dondashe|Dyashi|Dyushu|Ematshanganeni|Embangweni|Embugwini|Emgcwe|Esikhobeni|Fordini|Gciala|Gqunce|Gqunge|Gqunqe|Groxozayo|Gxara|Hebehebe|Hlabeni|Hlangani|Hlobo|Holela|Isityam|Jojweni|Kei Bridge|Khwetshe|Kobonqaba|Komkhulu|Kotana|KuLohopana|KuLotshazi|KwaCingane|KwaDebese|KwaFeni|KwaMacibe|KwaMbongendlu|KwaMdange|KwaMjo|KwaMtebele|KwaMtintsilana|KwaNdesane|KwaNduku|KwaNontsinga|KwaYimani|KwaZibunu|Lalini|Lindsay|Lixeni|Lower Qora|Lusizi|Luxhomo|Mahlenhlanzi|Mahlubini|Mampondweni|Mangola|Mantetyeni|Manu|Manyana|Manzana|Maranugeni|Masazane|Masele|Matatiela|Mawushweni|Maxambeni|Mazeppa Bay|Mbokotwana|Mcelwane|Merelisa|Mfeku|Mfulamde|Mgagasi|Mgobhozi|Mhlahlane|Milwa|Mjamkhulu|Mndundu|Mnenemba|Mngqalasini|Mntla|Mnyameni|Mnyibashe|Mofu|Mpahleni|Mpentse|Mpuluse|Msele|Msikaba|Mtonjeni|Mtwaku|Mzazi|Mziphewi|Nantsana|Ncalukeni|Ncata|Ncenjane|Ncerana|Nciba|Ncizele|Ndotshanga|Nduveni|Ngai School|Ngculu|Ngcweni|Ngede|Ngingqini|Ngozana|Ngqageni|Ngqamakhwe|Ngqaqini School|Ngundusa|Ngunduza|Ngunza|Ngwara|Ngwebelele|Ngxalathi|Njekeni|Njingini|Nkukhwana|Nomaheya|Nonyembesi|Nonyembezi|Nousi|Nqamakwe|Nqunduza|Nqusi|Ntilini|Ntlabathini|Ntlambonkulu|Nxaxo|Nxaxo Mouth|Nyumaga|Nyutura|Qina|Qoboqobo|Qolora|Qolora Mouth|Qolweni|Qombolo|Qora|Red Hill|Rwantsana|Seagulls|Seku|Sigitini|Silverstream|Singangala|Sirosheni|Sonkana|Spring’s|Takazi|Tanga|Teko Springs|Thafa-Lofefe|Thala|Thorn Drift|Toboni Skool|Tobotshana|Trennerys|Tshazibane|Tutura|Umgomanzi|Umsigazi School|Vaku|Velebi|Vuso|Waterdale|Wavecrest|Willow Spring|Xilinxa|Zangwa|Zazulwana|Zigadini|Zingxala"],
  ["ndlambe", "Alexandria|Beachfront|Bellcrest|Boesmansriviermond|Boknes|Cannon Rocks|Clumber|Dorset|East Bank|Fish River Mouth|Forest Downs|Glenretha|Glenview|Kasouga|Kasouga Road|Kenton|Kleinemonde|Kleinmonde|Locke Moore|Lombards Post|Nkwenkwezi|Ouplass|Piffway|Rietrivier|Royal Alfred Acre Golf and Lifestyle Resort|Seafield|Shenstone|Station Hill|West Bank|Westview Heights"],
  ["nmb", "Adcock|Algoapark|Amanzi|Amsterdamhoek|Beachview|Bethelsdorp|Blikkiesdorp|Blue Horizon Bay|Bluewater Bay|Booysen Park|Bothasrus|Bulvlei|Cannonvale|Clarendon Marine|Coega|Colchester|Cotswold|Deal Party|Delarey|Depus|Donkinvale|Dowerville|Elundini|Emerald Hill|Fairview|Ferguson|Fernglen|Framesby|Gelvandale|Glendinningvale|Glenhurd|Greenacres|Greenshields Park|Gunguluza|Hallack Rock|Holland Park|Humewood|Hunter's Retreat|Jarman Tsp|Jubilee Park|Kabega|Kamesh|Kensington|Khaya Mnandi|King Neptune|Kini Bay|Kleinskool|Korhaansdrif|KwaMagxaki|Lorraine|Lovemore Heights|Lovemore Park|Malabar|Marais|Markman|McLeanville|Millard Grange|Missionvale|Motherwell 4|Mount Pleasant|Mount Road|Mountain View|Neave|Noordhoek|North End|Northdowns|Olifants Kop|Parkside|Parsons Hill|Perridgevale|Pollockshaws|Port Elizabeth Airport|Redhouse|Retiefville|Rosedale|Rowallan Park|Saint George’s Strand|Salsoneville|Saweto-on-Sea|Schauder|Schauderville|Scotswood|Sea View|Sidwell|Skoenmakerskop|South End|Springfield|Struandale|Sunlands|Sunridge Park|Swartkops|Swinburne|Sydenham|The Springs|The Willows|Thomas Gamble|Van Riebeekhoogte|Van Stadensriviermond|Veeplaas|Walmer Heights|West End|Westering|Westville|Windvogel|Zwide 4"],
  ["ngqushwa", "Begha Mouth|Bell|Bodiam|Breakfast Vlei|Celetyuma|Chisirha|Crossroads|Dadeni|Damdam|Daninge|Dube Location|Durban Mission Location|eDrayini|eLalini|eLuqolweni|eMabaleni|eMablubini|eMxaxa|Etempen|Fairview|Feni|Gibralter|Glassridge|Glenmore|Goodhope|Goodi Location|Gqora|Hamburg|Hercules|Hopewell|Horton|Jokwenus Location|Kalana Location|Kaulela Location|Kings Lynn|Kingscofe|Klipplaat|Komhlulu|Komkulu|Kraal|KuMapiko|Kwa Lubilo|Kwa-Hoyi|Kwa-Hoza|Kwa-Lutiko|Kwa-Maqosha|Kwa-Mkontwana|Kwa-Ndaba|Kwa-Pikoli|KwaGwalani|KwaJaji|KwaLibalele|KwaMhlekwa|KwaMpeko|KwaMvemve|KwaNcwane|KwaNgquwa|KwaTuba|Lalini|Lewuswood|Mabofolweni|Mabongo Location|Magqazeni|Maitland|Majamanini|Mangweni|Masela|Matomelas Location|Mdolomba|Melton|Melville Park|Menziwe Location|Mgwalana|Mgwalana Mouth|Mpeko|Mpekweni|Msintsini|Mthonjeni|Mtombe Location|Mtyolo|Mywashu Location|Newtondale|Ngqowa|Nobumba|Nooitgedacht|Nquntsi|Ntloko|Ntsikizini|Nyanisos|Nyatyora Location|Pato’s Kop Location|Pera II|Posini|Qaga|Qamnyana|Qeto|Quakeni Location|Riverbend|Rode|Rura|Sentse|Tamara|Tuku|Tuwa|Tyata|Umtati|Wesley|Woodlands|Worthing|Zalara"],
  ["ntabankulu", "Amacwera|Annesville|Bakubha|Bandlana|Bhoneni|Bulembu|Cacadu|Cedarville|Cliffdale|Cola|Cwaka|Cwehaland|Dambeni|Dondi|Dungu|Dyivini|eBomvini|Glenlynden|Gudeka|Gxwaleni|Hlankomo|Isilindini|Koloni|Ku-Ndile|Ku-Nyongwane|KuGqaza|KuLutsheko|KuMabhikiji|KuManzamnyama|KuNgqane|KuNonyongothi|KuNoxhungutshe|KuNozolisa|KuTela|Kwa-Kumba|KwaBhala|KwaBiba|KwaCetshe|KwaGuga|KwaNdavini|KwaNyathi|KwaTsita|KwaZulu|Lugalakaxa|Lundzwana|Lunyingweni|Lutambeko|Lutanibebo|Mabofu|Madwakazana|Magqagqeni|Makelekete|Makhegwini|Makhetheng|Mampondweni|Maramzeni|Matshona|Matyhatyhasini|Mbangweni|Mbongweni|Mdabazweni|Mdini|Mfula|Mfundisweni|Mgqumangwe|Mgwedleni|Mhlonyaneni|Mjelweni|Mjila|Mngazana|Mngcefeni|Mngcipongweni|Mngwemnyama|Mowa|Mpemba|Mpisini|Mtukukazi|Mvenyane|Mzalwaneni|Mzumbane|Mzwakazi|Ndwana|Ngqobotshane|Ntabenkomo|Ntlambashe|Ntshamanzi|Nyegqeni|Nyiweni|Ravenscroft|Rwantsana|Saphukanduka|Sidakeni|Sihlonyaneni|Sikhulu|Sikweni|Sipetu|Siqitini|Siyate|Taleni|Tonti|Uniondale|Xamnyiba|Xopo|Xukula"],
  ["nyandeni", "Baca|Bantini|Bhakaleni|Bhantini|Bidiza|Buntingville|Canzibe|Cibeni|Combeni|Cumngce|Detyana|Dikelo|Dokodela|Double Falls|Elutubeni|Emandleni|Emoyeni|Empangala|Eskweleni|Gabeni|Gangeni|Gosshill|Gungululu|Hadi|Hamsini|Hluleka|Khohlombeni|Komkulu|Ku-Bungu|Ku-Kombe|Ku-Mtwebula|Ku-Ndlunkulu|Kulambeni|KuNkunzimbini|KuNomadolo|KuNomcamba|KuZele|Kwa-Gininda|Kwa-Gulwa|Kwa-Guqaza|Kwa-Ndata|Kwa-Nolokoza|Kwa-Zulu|KwaMaxaka|KwaMaya|KwaMjanyane|KwaNaqutywa|Lower Mdumbi|Lower Rainy|Lubanzi|Lujizweni|Lukuni|Lusizini|Lutoli|Lutshatsheni|Lutsheni|Lwandile|Lwandlana|Mabetshe|Mabhetsha|Mafini|Mafukeni|Magcakin|Mahlatini|Mamfenweni|Mampondomisini|Mandleni|Mandlovini|Mangewangulen|Maqadini|Maqanyeni|Mareweni|Marubeni|Masameni|Mayalweni|Mbangweni|Mbobheleni|Mdikane|Mdina|Mdumazulu|Mdumbi|Mevana|Mfabane|Mgamnye|Mgojweni|Mgoqweni|Mgwanggweni|Mgwenyana|Mhlahlane|Mhlakotshane|Mhlanganisweni|Mistymount|Mjaliswa|Mkangiso|Mlengana|Mngampunzi|Mngazana|Mpindweni|Mtakatye|Mtebelezi|Mtokwane|Mtombe|Mtonjana|Mtyu|Mzonyane|Ncambedlana|Ncedane|Ncolora|Ndungunyeni|Ngcitshana|Ngongeolweni|Ngowangi|Ngqongweni|Ngqumani|Ngwenyeni|Njiveni|Nkanga|Nkantini|Nomadolo|Notintsila|Noxova|Nqakamatye|Nqentsu|Ntabangcuka|Ntabantsimbi|Ntatweni|Ntibane|Ntlaza|Ntlaza Mission|Ntshilini|Ntshingeni|Ntsila|Ntsimbini|Ntsonyini|Ntsundwane|Nxotsheni|Nyandeni|Nyangweni|Old Bunting|Phezukwamawa|Preslies Bay|Qangu|Qiti|Qokama|Rawutini|Sidanda|Sileni|Sixambust|Tshani|Tshatseni|Tukela|Tyara|Umtata Mouth|Vernon’s Post|Vinitsh|Wicksdale|Zimbungu|Zincukutwini|Zinduneni|Zinkumbini|Zitatele"],
  ["portstjohns", "Amajola|Batweni|Bhakaleni|Bholani|Bhukada|Big Umngazi|Bizana|Buchele|Bulawa|Buto|Butulo|Camerondale|Cwebeni|Dangwana|Dukulweni|Fort Harrison|Gcwaleni|Gemvale|Glengazi|Goqwana|Gxokoza|Isinuka|Kings Ride|Kohla|Kohlogolo|Kote|Ku-Gcobane|Ku-Maqebevu|Ku-Rebu|KuSipusipu|Kwa-Gambushe|Kwa-Gangata|Kwa-Gora|Kwa-Nomsenge|Kwa-Qoboshendlini|Kwa-Zulu|KwaMhlaza|KwaNtandayo|Kwanyana|KwaQukuswayo|KwaRela|Langeni|Lower Mkate|Ludalasi|Ludonga|Lugaqweni|Lugongqoso|Luqoqweni|Lutengela|Lutengele|Luzupu|Mafusini|Majolantaba|Makeswa|Mangweni|Manteku|Mantusini|Matafana|Matane|Matombe|Mbokazi|Mbozizeni|Mfundeni|Mgubu|Mgxabakazi|Mkanzini|Mngazana|Mount Bleak|Mpamba|Mtambalala|Mtumbane|Mvukazi|Mvume Springs|Mzilanga|Mzintlavana|Ndulini|Ndumakude|Ndwalane|Ngcoya|Ngqotsini|Ngqwangu|Nkanti|Nkodusweni|Nomadi|Ntafufu|Ntile|Ntlanjeni|Ntshamate|Ntsimbini|Nzondeni|Orange Grove|Port Saint John’s|Qandu|Rawutini|Retreat|River View|Ross Common|Sea View|Sihlitho|Sikelweni|Sinangwana|Sitshayelweni|Swazini|Taleni|Tekwini|Thombo|Tombo|Tyityane|Umngazana|Umngazi Mouth|Valley View|Ziqangweni"],
  ["raymondmhlaba", "Alice|Ann Shaw|Argyle|Balfour|Brown’s Vale|Cullendale|Debe Marela|Ebenezer Mhlambiso’s|Ganda|Glen Gregor|Glen Lynden|Glenthorn|Gola Hashe’s Location|Healdton Fingo|Healdtown|Hogsback|Kama’s|Kamas Location|Karberg|Knapps Hope|Kwa-Ndlankomo|Kwa-Nomadola|KwaNcaza|KwaPita|Kwatinidubu|Kwezana|Leevdrift|Lilyvale|Lovedale|Mabandla’s|Mabandla’s Location|Magaleni|Maipase|Mama|Mcamemfene|Melani|Mfiki|Middledrift|Mnqaba Kulile|Mount Snell|Msobomvu|Msulugwa|Ncabasa|Ncera|Ncera Pezula|Ngenu|Ngobe|Ngobe Location|Ngoele|Ngqolowa|Ngwabeni|Njwaxa|Outubeni|Pewuleni Mission|Pheuleni|Qamdobowa|Quma’s|Roxeni|Schoongozicht|Seymour|Sheshego Fingo|Teba|Thorndale|Tyutyuza|Upper Clifton|Walkersvale|Windsor|Xengxe|Xukwane|Yantola’s|Zalis|Zibi’s|Zigodlo|Zihlahleni"],
  ["sakhisizwe", "Askeaton|Blue Gum Vale|Bumbana|Cala Pass|Cibini|Eensaam|Emnexe|Fama|Galili|Garryowen|Glen Alphen|Gubenxa Kroon|Hota-Mbeule|Indwana|Innistore|Kerrera|Khowa|Komkulu|Ku-Nomadambe|Ku-Zikonkwane|KuHota|KuLanganci|KuManzana|KuQwempe|KuSauti|KwaGcina|KwaMgcodo|KwaNokepeyi|Lahlangubo|Lalini|Langanci|Lokishini|Lower Cala|Ludakeni|Lufutha|Luhlalwini|Lutha|Luxeni|Macangceni|Magwateni|Mahlungulu|Manzimahle|Manzimdaka|Maqwateni|Marydale|Matanzima|Mbenge|Mbodlana|Mcewuli|Mdeni|Mgxumza|Mhlonyaneni|Mlungisi|Mmangweni|Mnxe|Mtingwevu|Mungisi|Mxatule|Ntsinga|Nyalasa|Paardekraal|Pama|Qiba|Rebelskloof|Saint Gabriel|Sifondile|Sigangeni|Siginqini|Stokwes Basin|Taynult|The Glen|The Home|The Willows|Trust|Tsengiwe|Tshukutshezi|Union|Upper Cala|Upper Ndwana"],
  ["senqu", "Bebeza|Bensonvale|Bhongolethu|Bikizana|Blikana|Bluegums|Brigg’s Haven|Cebano|Clanville|Clifford|Coville|Dangers Hoek|Dondolo|Dulcies Nek|Entsimekweni|Fort Hook|Gatberg|Gcina|Herschel|Hillside|Hlanjwa|Hlomendlini|Hohobeng|Jozannas Nek|Jozannashoek|Khiba|Khwabo|Kromspruit|Kwezinaledi|Longsought|Lundin’s Nek|Mabele|Macacuma|Magadla|Magwigi|Majuba Nek|Makhaba|Makhumsha|Malpas|Mangweni|Manxeba|Marakaneng|Mavelebayi|May|Mbihli|Mbobo|Mdlokovane|Mfinci|Mguli|Mkunyazo|Mlamli|Mokhesi|Mount Prospect|Musong|Mzondeki|Naledi|Ndofela|Ndungunya|Nkopane|Ou Tol|Palmietfontein|Pelandaba|Pen Hoek|Poplar Farm|Qhemegha|Qoboshane|Rhodes|Rock Cliff|Rockdale|Rossouw|Saint Barnabas|Saint Michael’s|Sipambo Basin|Sitoromo|Skisazana|Steinau|Swartlaagte|Tapoleng|Telle Falls|Teresa|Thaba Koloi|Tugela|Tyinindini|Upper Telle|Voyizane|Walaza"],
  ["sundaysriver", "Aloma|Barkly Bridge|Beans River|Bellevue|Bontrug|Bosfontein|Buyskloof|Doonside|Doringkloof|Driekoppen|East Bank|Enon|Fowlds|Glenconnor|Helpmekaar|Hermiston|Heynsrus|Houtkloof|Klein Camp|Kleinpoort|Kromriver|Kruithoring|Lokasie|Longlee|Malmaison|Matjesfontein|Maurice Hill|Melrose|Mfuleni|Ncanaha|Newlands|Nie Te Ver|Noagashoogte|Nomathamasanqa|North Hill|Prospect Vale|Rautenbach|Smaldeel|Sunland|Swanepoelskraal|Waaiheuvel|Wheatlands"],
  ["umzimvubu", "Baquqini|Betshwana|Bhayi|Bhibha|Bomvini|Buffalo Nek|Bumbana|Bumbeni|Butsheni|Cabane|Cabase|Cabazana|Cancele|Centuli|Colona|Coloti|Dambisa|Daymani|Dlabheneni|Dutyini|eKhethekhethe|eNyandeni|eQumrha|Gala|Galane|Glen Holy|Goso|Goxe|Gqoloma|Gubhuzi|Gubuzi|Gugwini|Guwini|Gxaku|Hlane|Hlani|Hofisi|Hohane|Kinira|Kirby’s Post|KuBhobhodla|KuCabazana|KuCane|KuCwalinkungu|KuGodola|KuGudlintaba|KuLudwele|KuMacibini|KuMahamane|KuMgedezi|KuMlandena|KuMnxekazi|KuMpurwana|KuNdindini|KuNomxhathalala|KuPapana|KuPapane|KuQuilikawa|KuSitana|KuSosiba|KuSusa|KuTshulu|KuWelakabini|KuXolo|KwaDungu|KwaHlombe|KwaKanya|KwaMahlazeka|KwaMnyamana|KwaNdarana|KwaNqana|KwaYoba|Lonci|Lower Mvenyane|Lubacweni|Lubaleko|Lufafa|Lugolweni|Lundini|Lusizini|Lusuthu|Lutateni|Lutshikini|Luwandlane|Luxwesa|Luyengweni|Mabomvu|Mabongweni|Maceneni|Macheleni|Macivini|Magqagqeni|Magunyeni|Magxeni|Mahobe|Majulumani|Malongwe|Mambebevini|Mandileni|Mangqamzeni|Manobe|Marwaga|Matyeni|Mawula|Maxesibeni|Mbangweni|Mbodleni|Mbujini|Mbumbatsa|Mbumbazi|Mdakeni|Mdeni|Mfagusha|Mfoba|Mgodi|Mhluzini|Mjikelweni|Mkangisa|Mkemane|Mkemani|Mkhonqo|Mlilweni|Mnambithi|Mnqwane|Moyeni|Mpamba|Mpendla|Mpendle|Mpindweni|Mpola|Mpongweni|Mpungutyana|Mqokweni|Mthonjeni|Mtshazi|Mtsila|Mvusi|Mxegwini|Natala|Nciniba|Ncome|Ncunteni|Ndakeni|Ndikini|Ndzongiseni|Ngabeni|Ngcozana|Ngonyameni|Ngqawara|Ngwegweni|Ngwekazana|Ngwetsheni|Ngxingweni|Niyona|Njeni|Nkanje|Nkungwini|Nkwazini|Nomkolokoto|Nqalweni|Ntabazwe|Ntibane|Ntlabeni|Ntlanomfula|Ntlavini|Ntshongweni|Ntsimeko|Ntsizwa|Nyalingeni|Nyanzela|Nyegqili|Nyosini|Nyushwini|Phitshini|Qabeni|Qangui|Quidlana|Qunubeni|Rode|Rwantsana|Sabungeni|Sandokazi|Santombe|Sibhozweni|Sidadeni|Sidakeni|Sigingeni|Sigundwaneni|Sijika|Sikemane|Silindini|Sinyaqa|Sipilini|Sipolweni|Sipundu|Siqhingeni|Siqingeni|Sirudlwini|Sitana|Sixhotyeni|Sugarbush|Swazini|Thwa|Toleni|Tshisane|Xhokonxa|Zidulini|Zimpawaneni|Zingcuka"],
  ["waltersisulu", "Aarbossiesplaat|Abelsruhe|Alfalfa|Alpha (1)|Alpha (2)|Altyre|Amalinda|Amana|Avondrust|Aylesby|Bakkraal|Bankfontein|Barensdam|Ben Avis|Berea|Bergplaas|Berseba|Bitterplat (1)|Blaufontein|Bloemendal|Bloemhof|Blomtuin|Bloubospooft|Blue Hills|Boonstepos|Borderville|Bospoort|Bosrand|Botterleegte|Braamhoek|Brakfontein|Brandpoort|Bravo|Brooklyn|Buffelsbadden|Bultfontein|Byrnavon|Caledonia|Cheddar Hill|Cheviotdale|Clarksdale|Clifton|Content|Corbetts Hope|Croston|Croxteth|Cynsen|Cyprusdale|Dagbreek|Dalmanutha|Damarusfontein|Damplaas|Davidsfontein|Dawn|De Dam|De Heim|De Hoop (2)|De Hoops|De Kloof|De Rust (2)|Deelspruit|Delila|Denhaga|Devon House|Die Draai|Die Viel|Die Vlak|Die Vlakte|Die Vlei|Die Wilge|Diepfontein|Diepfontein (1)|Diepfontein (4)|Dobo|Doringkraal|Driefontein|Driefontein (1)|Driehoek|Dyobhudaka|Edrom|Eenbult (1)|Eenbult (2)|Eendrag|Eensgevonden|Eerstegeluk|Ekron|El Alamen|Elandslaagte|Elberveld|Eldorado|Element|Elim|Elliot|Emmanuel|Erasmusdal|Erfdeel|Erinmore|Excelsior|Ezelsklip|Fairview|Fathershome|Fieldmoor|Finne|Floukraal|Fonteinkloof|Fonteintjie|Gatacre|Geduldfontein (2)|Gelukshof|Geluksoord|Gelukwaarts|Gelykfontein|Gleenmoor|Glenridge|Gloria|Goedehoop|Goedemoed|Goedverwacht|Good Hope|Goode Hoop (2)|Gougednik|Greenfontein|Groenvlei (1)|Groenvlei (2)|Groot Strydpoort (1)|Grootvlei (1)|Gumdale|Haarlem|Haaspoort|Harmonie|Hebron|Helena|Helmekaal|Helpmekaar|Hessiesdeel|Highlands|Hillhead|Hillside|Hilltop|Hillvue|Hoogland|Hoogstede|Hopewell|Huguenot|Inhoek|Jakkalsbank|James Calata|Josefsdeel|Joubertina|Kaffelskraal|Kafferskraal|Kamp|Kanossa|Kappiesfontein|Kareedouw|Kensington|Kildare|Kingslynn|Klein Kareepoort|Klein Strydpoort|Klein Withoek|Kleinvie|Kleinvlei|Klipbaken|Klipfontein|Klipkraal|Klipkuil|Knole Park|Kommandantskop|Komweer|Kopfontein|Koppiesfontein|Korenhof|Kraaifontein|Kraalfontein (2)|Kroonviel|La Mascotte|Lana|Langfontein|Langverwacht|Langverwag|Le Bron|Leeukop|Leeuwfontein|Leeuwkop|Lemaenfontein|Lemoen Kloof|Lemoendontein|Lemoenkloof (2)|Lentelus|Liepsfontein|Liviersrust|Loskop|Louis Botha|Louwsrust|Lucernedale|Luderitzbucht|Lushof|Lusthof|Lyndhurst|Magda|Magdalena|Marionvale|Marlow|Martindale|Martlesham|Masimo|Matjiesvlei|Meadows|Mentzrust|Meoivlei|Merino|Middelberg|Middelplass|Middlelwater|Middleplass|Midshaft|Milner|Modena|Montagu|Mooigelegen|Mooigelegon|Mooihoek|Mooiplaas|Mooivlei|Moreson|Morgenson|Mount Carmel|Murrayskop|Namaga|Naudely|Nebo|Nymanskraal|Oaklands|Oatlands|Oliewenberg|Oliewenkloof|Omdraai|Onverwag|Ooriogspos|Oorlogspoort|Orangesig|Orangia|Osnek|Ou Bokkraal|Oudedag|Outspan|Oviston|Palmskop|Paradys|Pelgrims Rust|Pie Hock|Pilgrimsrust|Plaaffontein (1)|Plaatfontein|Pleisterkraal|Poortjie|Raden|Ravensworth (2)|Rheboksfontein|Rheeboksfontein|Rhenosterfontein|Rietfontein (3)|Rietpoort|Rietvlei|Rockdale|Rondefontein|Rooihoogte (2)|Rooipoort|Rooiwal|Rosebank|Rosendal|Rosslands|Ruigtefontein|Rushof|Rusoord|Rust|Rust en Vrede|Saamwerk|Schalkwykskraal|Schoonbeeksfontein|Sewefontein|Sewefontein (1)|Sewefontein (2)|Silvermere|Skilderkrans|Skoemansdrif|Smaldeel|Smiling Valley|Smitsrust|Snymanskraal|Soetfontein|Sonneblom|Sonnig|Sorgvliet|Southwell|Spes Bona|Spitskop|Spring Valley|Springfield|Springfontein|Springvale|Stevnsrus|Stewarton|Steynsburg|Steynsnek|Steynsrust|Stillerust|Stockton|Stoneleigh|Stoneycroft|Strydfontein (2)|Summer Pride|Suurberg|Swakfontein (1)|Swartfontein (3)|Swartfontein (4)|Swartkop|Synmanskraal|Tafelberg|Teneriffe|The Glen|Thebus Waters|Tierhoek|Tiger Ridge|Tilwortb|Toekoms|Tolfelberg|Tolkop|Tugela|Tweedam|Tweekoppies|Uitkyk (2)|Uitkyk (4)|Uitsig|Uniedal|Vaalbank|Vaalpoort|Van de Merwes Fontein (2)|Van Zyls Kraal|Veelsgeluk|Veepos|Venter Fontein|Ventersdam|Ventershoop|Ventersrus|Venterstad|Venus|Verdun|Vermaakfontein|Vermont|Verstersfontein|Villiera|Villiersrust|Voëlfontein|Voorspoed|Vrede|Wasbank|Waterside|Waterval|Waterval (1)|Watervlei|Weigmoed|Welkom|Wellington|Weltevrede|Werda (2)|Whilton Valley|White House|Wilgerboom|Willowvale|Witbank (1)|Witbank (2)|Witfontein|Witkoppies|Wolwekloof|Wolweplaat|Wonderboom|Woodlands|Woodlands (1)|Zaaifontein"],
  ["winniemandela", "Betshawawini|Bhokweni|Bhungweni|Bolorhweni|Buttville|Cibini|Clarkville|Dudumeni|Ebenezer|eNcenjane|Envis|Fort Donald|Gabheni|Goxe|Gumzana|High View|Kanyayo|Ku-Mankenkeza|KuCitwayo|KuGwabeni|KuMabula|KuNdayingana|KuNkundla|KuNtlamvukazi|KuSiwisa Halt|Kwa-Qeda|KwaBipa|KwaGiniswayo|KwaHlati|KwaKati|KwaMbiba|KwaMkololwana|KwaMpisi|KwaNgutyana|KwaNikwe|KwaQungebe|Ludeke|Lukanyisweni|Luna|Lupilisweni|Lutambeko|Mabofu|Madada|Madadana|Magombeni|Magusheni|Mahlaba|Majavu|Makwanteni|Malongwana|Mampondweni|Manlatini|Mapheleni|Marambeni|Mazeni|Mbandana|Mbhongweni|Mbobeni|Mbobheni|Mbutweni|Mceleni|Mcwati|Mdikisweni|Mejela|Mgunga|Mianyelwa|Mkandlwini|Mlambondaba|Mnambiti|Mngomane|Mngungundlovu|Mount Zion|Mpeni|Mqeni|Mtayise|Ndlovu|Ndunge|Ngwelombaso|Nkantolo|Nkantsweni|Nkantswini|Nomlacu|Nqabeni|Ntabezulu|Nthlahlane|Ntlamvukazi|Ntlenzi|Ntloselo|Ntsingisi|Nyokweni|Qabangeni|Qasa|Redoubt|Rockville|Sea View|Sidanga|Sigodlweni|Sikelo|Sisele|Spes Bona|Swane|Swani Ridge|Topiya|Tsawana|Wofisi|Xolobeni|Zangotsho|Zibukweni|Zilangwe|Zizityaneni"],
  ["dihlabeng", "Afrikaskop|Bohlokong|Brandwater|Brindisi|Derots|Die Ark|Ebenhaezer|Eenzaamheid|Eureka|Glen Reenen|Kleinpaarl|Kommandant|Kransfontein|Letselaskraal|Mackenzie|Môrelig|Paul Roux|Rosendal|Sheridan|Slabberts|Stenekamps Kop|Thorisong|Twee Spruit|Uitkyk"],
  ["kopanong", "Alfa|Annex|Aqua|Arbeidsloon|Austin’s Post|Avondrust|Baakfontein|Bach Rust|Badsfontein (1)|Bakbank|Bakenkop|Bakensvlei|Bankfontein|Beginsel|Bergplaats|Bethany|Bethulie|Blesbokfontein (2)|Bloubank|Bloukop|Bluegumspoon|Blydskap|Boesaksfontain|Boesmanskop|Boomplaas|Boskop|Bosplaat|Brakdam|Brakfontein|Bullberg|Bultfontein|Charleron|Charlesville|Clifton|Cyferfontein|Dagbreek|Dampoort|De Put Wes|Deeigenoot|Deelvlei|Delemont|Diefontein|Driefontein|Driehoek|Drukop|Drupfontein|Du Toitskraal|Du Toitsrus|Ebenaeser|Ellerslie Suid|Endor|Erfenis|Erfurt|Erideel|Excelsior|Florida|Fonteintjie|Fouriespruitpoort|Gariep Dam|Geluksdam|Geluksfontein|Glaisnock Verona|Gleniffer|Goedchoop|Goedehoop (2)|Goedehoop (4)|Groenvlakte|Groot-Suurfontein|Grootfontein|Grootgeluk|Grootwater|Hagesdam|Hartbeesfontein|Helderhoek|Hessiesdeel|Holmdene|Hope|Iona|Itumeleng|Jagersfontein|Jakkalsfontein|Jonasfontein|Julies Post|Kalkoenkrans|Katfontein|Klaarwater|Klein|Kleinplaas|Klipdrif|Klipplaatdrif|Knoppiesfontein|Kommetjesfontein|Koppie Alleen|Koppieskraal|Korthoek|Koudekraal|Kraaifontein|Kraalfontein|Kroonspruit|Langkuil|Langlaagte|Langrand|Lasfontein|Leeuwpoort|Lemoen Hoek|Lemoenkloof|Lente|Libani|Liliefontein|Lilydale|Lyons Rose|Mamre|Meadows|Meriba|Merino|Middelfontein|Middelwater|Middendeel|Misgunsfontein|Montgomery|Mooifontein|Mooihoek|Mooiplaas|Môrester|Noodhulpsdam|Nooitgedacht|Nortjesnek|Olievenkop|Ommerin|Ongelukskop|Oorskot|Oosdeel|Oranjekrag|Oudestrypoort|Overskat|Paardedam|Paardekop|Paardeplass|Palmietfontein|Poortjiesfontein|Praalhoek|Reddersburg|Rietfontein|Riviera|Roodepoort|Rooderant|Rooidam|Rooikraal|Rooipoort|Rooirantjies|Rooirantjiés|Roorirantjies|Ruspiaas|Rusplaas|Saamwerk|Samekoms|Samesuiping|Schoongezicht|Schoonvlakte|Sertyn|Skemer|Skoonvlakte|Slagterskop|Soetfontein|Sonderlaag|Spitskop|Spitzkop|Spreeufontein|Springbok|Springbokfontein|Sterkfontein|Steunmekaar|Steynskraal|Stillerust|Stillestroom|Stinkhoutfontein|Swartkoppies|The Bend|The Hall|Tieniesrand|Truitjesfontein|Tweefontein|Tweelingdrift|Tweespruit|Twyfelfontein|Uitenhagesdoorn|Uitkyk|Vaalbank|Van Tonderspoortjie|Verfkraal|Visgat|Visserskop|Vlakfontein|Vnooifontein|Vogelfontein|Voorwaarts|Vrede|Vredevlei|Waterkloof|Waterval|Weltevrede|Werda|Werda (1)|Weston|Wilgerfontein|Witlaagte|Wolweleegte"],
  ["letsemeng", "Alton|Bloubospan (1)|Boereplaas|Concordia (2)|Dahlia|De Rust|De Werf|Deelpan|Doornhoek|Doornpan|Doornplaaf|Franshoek|Kaffershop|Krugersrus|Luckhoff|Markgraaf|Môreson|Morester|Olyvenkoppiespan|Oranje|Palmietfontein|Retiefsdal|Rietrivier|Seeda|Swesterpan|The Chase|Vlaklaagte|Wanda|Welkom"],
  ["mafube", "Belmont|Carolina|Cornelia|Geluk|Jacobs Erf|Kalwerspruit|Krompan|Mooibult|Mooiwater|Oufontein|Schoonspruit|Tweeling|Villiers|Welverdiend"],
  ["maluti", "42nd Hill|Aberfeldy|Arbeid Adelt|Bannocks|Barry Estate|Bergsig|Bolata|Brandis|Eeram|Greys|Ha-Rankopane|Kestell|Kratzenstein|Letshalemaduke|Mantsubise|Matsiliso|Mbhelé Namahali|Murphys Rust|Namahadi|Namahali|Roodebloem|Swinburne|Tebang|Tlholong|Tshiame|Tweefontein|Twishoek|Vaalburg|Vaarvel|Witsieshoek"],
  ["man", "Abramskraal|Alton|Archbell|Bain’s Vlei|Balaclava|Batho|Berlin|Beste Geluk|Bethesda|Biskop|Bloemanda|Bloemfontein NU|Bloemspruit|Blydskap|Bochabela|Bochebela|Boesmanskop|Bonolo|Boomerang|Borakanelo|Bosrand|Boston|Botshabelo C|Botshabelo G|Botshabelo H|Botshabelo T|Botshabelo U|Botshabelo-J|Botshabelo-W|Brabant (2)|Braklaagte|Brandkop|Brandwag|Bultfontein Number One|Bultfontein Number Three|Bultfontein Number Two|Cambellton|Cecilia|Ceciliasrust|Cerillio|Chris Hani|Chubane|Claradene|Conserva|Contest|Cornelia|Cyferkuil|Dakpoort|Damfontein|Dan Pienaar|Dankbaar|De Brug|Die Vlatke|Diepfontein|Dikgang|Doornaar|Drieloek|Dysselsrust|Eben|Endon|Erfdeel|Erica|Eureka|Fauna|Feloana|Ferreira|Fichardtpark|Folies Bergere|Gardenia Park|Generaal de Wet|Gladstone|Goedgedacht|Grasslands|Grootdam|Groothoek|Gwentham|Hanakoe|Harantsatsa|Harmonie|Hayfield|Hebron|Heeltevrede|Helderpoort|Highlands|Holfontein|Holmesdale|Homeward|Hope Valley|Houtnek|Huntley|Isabel|Joubert|Kafferrivier|Kagisanong|Kalkbult|Kayalami|Kebonoe|Kelly’s View|Kgalala|Kildare|Kleinstradt|Klipfontein|Kolbe|Kommissiedrif|Koppieskraal|Krapfontein|Kromdraai|Kromspruit|Kwaggafontein|Kwestiefontein|Langenhoven Park|Leeufontein|Leeuvlei|Lentevlei|Linden|Lockshoek|Lonalis|Lovedale|Lowlands|Lusaka|Lushof|Lynchfield|Mafane|Mandela View|Marianna|Mariasdal|Maronan|Maselspoort|Mathunyeng|Meadhurst|Meadowvale|Mearsgeluk|Merino|Middeldeel|Middelpoort|Midway|Milton|Mimosa Flars|Modutung|Mokoto|Mokwena|Mooivlakte|Morago|Moreson|Morokashoek|Moroto|Motlala|Motlatla|Naaupoort|Nalisview|Neoitgedacht|Noga’s Post|Noordhoek|Nooritgedacht|Nottingham|Ntshieng|Olga|Olievenkoppies|Onse Rust|Oranjezicht|Paardekuil|Pantydefaid|Papfontein|Paradys|Park West|Petruspan|Phahameng|Plaaitjiesfontein|Platrand|Poklenberg|Potsane|Putdam|Rakhoi|Rapulane|Ratabane|Ratlau|Revonne|Rietfontein|Riversdale|Riversford|Rocklands|Roodekop|Rooidam|Rooifontein|Rosendal|Rusplaas|Rustig|Sannaspos|Sans Souci|Schoonzicht|Sediba|Segene|Sekhutlong|Sekretarispan|Selosesha|Serwalo|Sibton|Sipres|Skoonsig|Soetvlei|Sonskyn|South Holme|Sperville|Spitskop|Springfontein|Sterlefontein|Stille Woning|Stoomhoek|Strydom College|Summer Pride|Swartjan|Tabane|Talla|Tempe|Tevrede|Thalassa|The Willows|Three Sisters|Thubisi|Tiger River|Turflaagte|Tweefontein|Uithoek|Universitas|Ursula|Van Heerdenskraal|Vredepoort|Vrywoning|Waterbron|Waterloo|Waterval|Welbedacht|Weltevrede|Wildealskloof|Wilgehof|Wilhelmshöhe|Willows|Wolfkop|Wonderklip|Woodbridge|Woodlands|Yoxford"],
  ["mantsopa", "Alida|Allandale|Balaclava|Bluff Point|Champagne|Clifton|Connaught|Cornflats|Damfontein|Driekuil|Egypt|Ellasrus|Evas Post|Excelsior|Fairhead|Fort Kelly|Gedenk|Glen Avon|Glen Mokopo|Hillandale|Hobhouse|Juistzoo|Klein Lowridge|Kommissiepoort|Langrand|Leeurivier|Linana|Lovedale|Malfa|Manyatseng|Marseilles|Meulplaas|Middelpunt|Modderpoort|Mooiplaas|Mooiwater|Negefontein|Newlands|Palmyra|Prairie|Rangershoek|Reliance|Rheboksfontein|Rootbult|Rose Valley|Samenkoms|Sandspruit|Sibylia|Springkaanfontein|Suurbult|Tandem|Thaba Phatshawa|The Haven|The Willows|Tweespruit|Vanzylsplaas|Vlakplaas|Waterland|Welbedacht|Welgestreden|Whitehills|Wonderkop|York"],
  ["masilonyana", "Florisbad|Ikgomotseng|Makeleketla|Marico|Molala|Salmonslaa|Soutpan|Uitkyk|Verkeerdevlei|Winnie Mandela"],
  ["matjhabeng", "Allanridge|Anglo Alpha|Bedelia|Bedelia West|Bloudrif|Bronville|Dagbreek|Flamingo Park|Hani Park|Kitty|Kutloanong|Kutlwanong|Mmamhabane|Naudeville|Nyakallong|Phomolong|Reitzpark|Riebeeckstad|Thbong Ext 6|Ventersburg|Whites"],
  ["metsimaholo", "Bertha Shaft Village|Botshabelo|Clifton|Clydesdale|Coalbrook|Coalbrook Collieries|De Rust|Deneysville|Kragbron|Middelbult|Oranjeville|Riviera Settlement|Roodia|Sigma Myn|Vaal|Vaalpark|Viljoensdrif|Weltevrede|Wolwehoek"],
  ["mohokare", "Aanhou|Aden|Annex|Antwerpen|Assvoëlkop|Avalon|Avondkraal|Avondrust|Babel|Badsfontein (2)|Bankfontein|Bankkraal|België|Bellvue|Belmont (2)|Berlyn|Bermuda|Bernardus|Bethel (2)|Betjeskraal|Biesiefontein|Biesiesvlei|Blanco|Bloemendat|Bloemhoek|Bloomplaas|Boesmanskop|Bolandsrus|Bonnievale|Bospoort (1)|Bospoort (2)|Bosrand|Bossieskraal|Bothaskop|Bothasrus|Brakgrond|Braklaagte|Brakvlei|Brandewynsgat|Bultfontein|Bultfontein (2)|Caledon|Charlespost|Colombo|Constantia|Copenhagen|Cronjesrust|Cyferfontein|Cypress Grove|Dankbaar|De Draai|De Hague|De Ron|De Schans|Deelfontein|Deelkraal|Deliahsfontein|Devlei|Die Hoogte|Diepkloof|Donkerhoek|Draaikloof|Driefontein (2)|Dronkfontein|Droogfontein|Duike|Eben|Eensaamkraal|Elandsberg|Elandshoek|Elim|Emmarentia|Endwey|Erasmus|Erfdeel|Erfhoek|Excelsior|Felicia|Franshoek|Franskraal Noord|Galilea|Geluk|Gladdegrond|Goed-en-Mooi|Goede Hoop (1)|Goede Hoop (2)|Goede Hoop (3)|Goede Trouw|Goedemoed|Goedgegund|Goewerneurskloof|Golden Valley|Goode Hoop (1)|Groenfontein|Groenpoort|Groot Highlands|Grootfontein|Grootvlei|Grysdal|Guinesses|Hamilton|Hartebeesfontein|Heelgoed|Helleton|Henningsdale|Hermanus|Hermitage|Hoekfontein|Holmesdale|Holstein|Hoogstede|Hoogte|Houtberg|Hueningkrans|Hugenoot|Illawarra|Inkruipsfontein|Jaagbaan|Jakhalsgezang|Jakkalsfontein|Juistzoo|Juta|Kafferspoort|Kalkfontein|Kapokfontein|Karreckloof|Klaarwater|Kleindam|Kleinfontein|Kleinsevenfontein|Klipdam|Klipdrift|Klipfontein|Kliphuis|Klipkuil|Klopperspruit|Knoffelspruit|Kornetspruit|Kranskloof|Kranskop|Krugersdeel|Krugersvlei|Kruidfontein|Kut-el-mara|Kwartfontein|La Rochelle|Langverwag|Leeuspruit|Lemoenfontein|Lincelles|Loeuwfontein|Lourensa|Lucernvlei|Maghaleen|Maidwell|Makkateesfontein|Manilla|Manitoba|Marcelapoort|Mentzburg|Merino|Meyers Halt|Meyerskraal|Middelkroon|Middelstuk|Middelvlei|Middelwater (1)|Middelwater (2)|Middleburg|Misgunst|Mispa|Moedhou|Moerbeidal|Montagu|Mooihoek|Mooiplaas|Môreson|Morgenzon|Niewejaarspruit|Nooitgedacht|Norway|Novo|Nuwevlei|Olyvenfontein|Ongegund|Ongeluksfontein|Oorlogspoort|Oostenryk|Oudersgift|Oudersorg|Overschot|Paalland|Pieterskop|Poortje|Poortjie|Raveloe|Ravensworth (1)|Reitfontein (1)|Reitfontein (2)|Reitput|Retreat|Rietfontein (1)|Rietfontein (5)|Rietfontein (6)|Riethork|Rietkuil|Rifle|Ringaroma|Roberts Rust|Roodebult|Rooidam|Rooikop|Rooikopfontein|Rooikuil|Rosemaryn|Rusplass|Rust en Vrede|Rustfontein|Saaiplass|Saaron|Sanddrif|Shoongesig|Skaapkraal|Skatfontein|Skietboek|Skiethoek|Smaldeel|Soetfontein|Soetvlei|Solferino|Somersvlakte|Sonneblom|Sonop|Spetfontein|Spitzkop|Stafpoort|Stefanus|Sterkfontein|Sterkstroom|Sterkwater|Strydfontein|Strydpoort|Suidelyn|Sunnydale|Swartfontein|Swartfontein (1)|Swartfontein (2)|Swartlaagte|Sweetfontein|The Willows|Tierhoek|Tlankaneng|Traacha|Tweefout|Tweevlei|Twyfelfontein|Uitkyk (3)|Uitzicht|Umballa|Union|Vaalkraal|Vaalspruit|Van Wyksrus|Venterskroon|Verdun|Vergaderrand|Vermont|Vetmaakfontein|Vinkelfontein|Visgat|Vlakfontein|Vleispruit|Voorharts|Vorstersvlakte|Vrede|Vryheid|Waaipoort|Wasbank|Waterford|Waterval|Welgedaap|Welkon|Weltevrede|Weltevreden|Welverdiend|Westree|Wildebeesfontein|Wildebeestlaagte|Windpoort|Woltemede|Wolwepan|Yestervarkfontein|Zeekoegat|Zevenjaarsfontein|Zuurspruit"],
  ["moqhaka", "Kroonstad Central|Majankeng|Rooderand|Skandinawiëdrif|Venterskroon|Vierfontein|Viljoenskroon"],
  ["nala", "Ditshehlong|Kommandodrif|Misgunst|Wesselsbron|Winkelpos"],
  ["man", "Anniesdale|Belmont (1)|Bestersdam|Biesiedal|Bloubank|Blouboskop|Bottelfontein|Brakfontein|Bremiker"],
  ["naledi", "Broedersput"],
  ["man", "Caledon Downs|Caledonia|Collingham|Daspoort|De hoek|De Hoop|Deelkraal|Deelsdam"],
  ["naledi", "Devonlea"],
  ["man", "Dewetsdorp"],
  ["naledi", "Dirkiesrus"],
  ["man", "Driehoek|Droogfontein|Eensaam|Elderslea|Eureka|Excelsior|Farao’s Fontein|Frankfort|Franskraal|Geluk|Gelukwaarts|Glen Isla|Glengary|Glenhee|Grootdam|Grootverlang|Heelfontein"],
  ["naledi", "Huhudi"],
  ["man", "Kaalhoek|Kafferrivier|Kafferskop"],
  ["naledi", "Karmeel"],
  ["man", "Karreehoek|Kassel|Kleinfontein|Kleinheek|Koppie|Koppie Alleen|Kromspruit|Kuruman|Leeufontein|Longlead|Lusthof|Maidstone|Malvern"],
  ["naledi", "Mansfield"],
  ["man", "Melrose|Middelbult|Middelburg|Middelplaas|Montrose|Mooihoek|Morovane|Niekerksvlei|Novo|Olievenhout Bank|Olivewoodpark|Paardekraal|Perdefontein|Perdekraal|Poortjie|Red Hill|Rietpoort|Robertsrus|Rohallion|Rondebult|Roodepoort|Runnymeade|Rus My Siel|Saaihoek|Sabella|Scarsdale|Schrynders Post"],
  ["naledi", "Setuat"],
  ["man", "Slangfontein|Sonskyn|Spitskop|Springs"],
  ["naledi", "Stella"],
  ["man", "Stellaland|Sterkfontein|Stilfontein|Stillerus|Sunnyside|The Cliff|The Poplars|Thorley|Torbrek|Twellsdale|Tylden|Uithoek|Uysklip|Vaalbank (2)|Vaalbank (3)|Vaalkraal|Van Stadensrus"],
  ["naledi", "Vicedale"],
  ["man", "Vlakfontein|Waterpas|Weltevrede-Oos|Wepener|Wilgedraai|Willow Park"],
  ["naledi", "Witpan"],
  ["man", "Wolwekop|Workshop|Yuleton|Zuurfontein"],
  ["ngwathe", "Edenville|Harmonie|Heuningspruit|Klipfontein|Koppies Nedersetting|Kwakwatsi|Lekabi|Mokwallo|Pamona|Phiritona|Rietfontein|Roodepoort|Roodepoort Nedersetting|Sandersville|Sunnyside|Tumahole|Vlaklaagte|Vredefort|Weiveld|Weltevrede Nedersetting"],
  ["nketoana", "Arlington|Buffelsvlei|Dankbaar|Fraaiuitzicht|Goede Hoop|Goedgedacht|Inhoek|Kruispad|Leratswana|Malans Post|Mamafubedu|Onverdiend|Susannas Rust|Swartfontein|Tweespruit"],
  ["phumelela", "Arcadia|Droogebult|Gruisplaats|Kafferstad|Kalkfontein|Kalwevlei|Kromhof|Langhoek|Meulrivier|Mooidraai|Mooifontein|Moreson|Oosterbeek|Roadside|Rouw|Sweet Valley|Verkykerskop|Warden|Waterbult|Wilgevlei|Zanddraai"],
  ["setsoto", "Aldam|Driefontein|Flora|Hibernia|Hlohlolwane|Koornland|Marquard|Matwabeng|Meoheleng|Mtwabeng|Rietspruit|Springfield|Wildebeeslaagte"],
  ["tokologo", "Bamokgoko|Boshof|Dealesville|Erickswill|Hertzogville|Kameelpan|Koetsrus|Kromkuilplaas|Leeuwkop|Malebogo|Neethlingshalte|Rademansval|Speranza|Talsen|Victor|Waterpaslaagte|Wolwedrift"],
  ["tswelopele", "Brackenhurst|Excelsior|Vlakleegte"],
  ["matlosana", "Alabama|Ariston|Boetrand|Buffelsfontein|Dominionville|Dupperspos|Erma|Hartbeesfontein|Hartebeesfontein|Jouberton|Kanana|Meiringspark|Neserhof|Opraap|Reebokfontein Wes|Rykaartspos|Sakhrol|Springvale|Syferkuil|Tigane|Umzimhle|Vaal Reefs|Wilkoppies|Witfontein"],
  ["ditsobotla", "Bakerville|Biesiesvlei|Blydeville|Bodenstein|Bodibe|Boikhutso|Bokkraal|Burgersdorp|Carlisonia|Driefontein|Elandsputte|Ga-Maloka|Ga-Motlatla|Ga-Ramodingwana|Hakboslaagte|Hauptsrus|Itekeng|Itsoseng|Itsoseng Unit 1|Itsoseng Unit 2|Itsoseng Unit 3|Kierserville|Lead Mine|Mabaalstad|Malapo Oog|Matila|Ooseinde|Putfontein|Rietvlei|Shukran|Springbokpan|Stewartby|Tlhabologang|Twycross|Verdwaal|Welverdiend|Wondermere"],
  ["greatertaung", "Bathlaping Ba Ga Mothibi|Boipelo|Bosdam|Buxton|Dikhuting|Diretsaneng|Dryharts|Ga-Mokake|Heavyrest Mission|Itireleng|Kgobadi|Khaukhwe|Khibitswane|Kokomeng|Lethola|Lokammona|Longaneng|Losasaneno|Lower Majeakgoro|Lower Mayeakgoro|Madipelesa|Magagaaphiri|Magobeng|Magogong|Makgori|Mammutla|Manoko|Manokwane|Manthestad|Maphoitsile|Marotaneng|Marubiseng|Matlhatlhale|Matolong|Mayeakgoro|Meganeng|Mokasa I|Mokasa II|Mokgareng|Molale|Mololema|Mookaothupa|Morokweng|Moshoso|Mothanthanyaneng|Motsweding|Norlim|Ntswanahatshe|Pholofolo|Pholoholo|Pitsong|Pudumong|Reivilo|Riet Vley|Rietfontein|Rooiwal|Saracen|Sedu Kung|Sekhing|Seoding|Shaleng|Stella|Takaneng|Tamasikwa|Thomeng|Thota va tau|Tswedintlhe|Tweelingspan|Vaalboschhoek"],
  ["jbmarks", "Baillie Park|Buffelsvallei|Dovesdale|Ga-Mogopa|Goedgevonden|Grimbeek Park|Haaskraal|Harpington|Ikageng|Klipdrif|Klipdrif Nedersetting|Klipplaatdrif|Kluitfontein|Makokskraal|Mesa|Mimosa Park|Mooibank|Niemeer|Noupoort|Promosa|Quest Mine|Rooipoort|Sacville|Taaibosbult|Tsêtsê|Tygerfontein|Vyfhoek|Wilgeboom"],
  ["kagisanomolopo", "Ainslie|Akron|Alettasrus|Algiers|Athole|Austrey|Bahurutshe|Bonabona|Bonmail|Bowen|Bray|Bull Run|Coetzersdam|Crafthole|Dihatshwe|Dijwe|Dinake|Dipodi|Driefontein|Drillhole|Egham|Eskdale|Eureka|Ewbank’s Store|Ga-Madikwe|Ga-Motsage|Ga-Motsoko|Gankwane|Gannahoek|Ganyesa|Gemsbokvlakte|Goodwood|Howden|Iowa|Itireleng|Kabayatlhose|Kagiso|Kang|Keisersrus|Kgareyatlhose|Kgokgojane|Kgokgole|Khudu|Khudunkgwane|Khunkwe|Kibikwe|Kibitlwe|Kirstonia|Klein-Tswaing|Konke|Laaspomp|Labera|Lejakane|Lotlapa|Louwna|Mabone|Mabule|Madiakgama|Madinonyane|Madithoke|Maeng|Maer Jan|Magaabue|Makarakong|Mapitiki|Matlhabatlhaba|Matloding|Matsaneng|Metsetoro|Mmaphuti|Mmolayatshephe|Modiselele|Mogalaneng|Mokgalong|Moloporivier|Monetsi|Monyenyane|Morna|Morokwaneng|Morokweng|Mositlane|Moswana|Ophir|Pautlane|Pembroke|Phaposane|Phepane|Piet Plessis|Pomfret|Povall|Redbarn|Roelofs Kamp|Ryno|Seatlane|Selobane|Setabeng|Soutbos|Southey|Stoffelshoek|Tlapeng|Tlhakgameng|Tosca|Tseng|Tshetshu|Tshetshwana|Tuhutsang|Vanwykshuis|Vergeleë|Viera|Vorstershoop|Vrygees|Vrywillig|Water-fouché"],
  ["kgetlengrivier", "Brakfontein|Brakkloof|Derby|Doringkloof|Mazista|Merindol|Moedwil|Nooitgedacht|Schoongezicht|Silveroaks|Suikerbostuin"],
  ["lekwateemane", "Boitumelong|Geelblom|Geluksoord|Westhuyzen"],
  ["madibeng", "Aasvogelboom|Assen|Atlanta|Bakwena Ba Magopa|Bapong|Beestekraal|Bosfontein|Broederstroom|Buffelspruit|De Wildt|Dipompong|Fafung|Ga-Kwate|Ga-Rasai|Garantlapane|Hartebeespoort|Hebron|Hoekfontein|Ifafi|Jacksonstuin|Jericho|Kalkheuvel|Kgabalatsane|Kgomo-Kgomo|Klipgat|Koedoespoort|Kosmos|Krokodilkraal|Kwarriekraal|Legonyane|Lerulaneng|Letlhabile|Lone Star Texas|Maboloka|Maboloko|Madinyane|Majakaneng|Makan|Makanyaneng|Makgabetlwane|Mankgekgetha|Mapella|Mapoch|Melodie|Mmakau|Mmakaunyane|Modderspruit|Moiletswane|Mooinooi|Mooke|Motshikiri|Moumong|Ntsopile|Pansdrif|Pelindaba|Rabokala|Ramolapong|Roodekuil|Rooikoppies|Sandfontein|Schoemansville|Segwaelane|Sephai|Seringa Stad|Shakung|Sonop|Soshanguve|Soshanguve South|Thabantswana|Tornado|Tshwara|Tshwee"],
  ["mahikeng", "Barolong Boo Ratshidi|Bethel|Bewley|Brooksby|Deelpan|Driehoek|Duikersbos|Enselsrus|Ga-Koi-Koi|Garatau|Gelukspan|Goratau|Grantleigh|Heathview|Hellsgate|Ikopeleng|Jacobsdal|Kagamayasha|Kapsteel|Kgomotso|Klaarstroom|Koikoi|KwaDithakong|KwaMakubung|KwaMatikiring|KwaSetlopo|Lokaleng|Lokgalong|Lokotsi|Lokung|Lomanyaneng|Lotlhakane|Lotlhogori|Louisdal|Madibe|Madibe-Makgabane|Mafikeng|Magogoe|Makouspan|Malmanie Oog|Mantsa|Mashutlhe|Mmabatho Unit 15|Mmanawane|Modimola|Modimola Morwamarapo|Mogosane|Moletsamongwe|Molewane|Montshiwa|Mooifontein|Mooipan|Morwatshetlha|Motlhabeng|Naauwpoort|Ottoshoop|Raghas|Rentse Village|Rooigrond|Roosendal|Roosplaas|Schoongezicht|Sehuba|Seweding|Siberia|Slurry|Thelesho|Thusong|Tlapeng|Tsetse|Tshunyane|Uitkyk|Weltevreden"],
  ["mamusa", "Amalia|Avondster|Glaudina|Ipelegeng|Migdol|Mimosa|Modimung|Raubenheim"],
  ["maquassi", "Diamantkuil|Glimlag|Husfeldt|Justitia|Trotsville|Tswelelang|Witpoort"],
  ["moretele", "Bedwang|Bollantlokwe|Bosplaas|Botshabelo|Carousel View|Dertig|Die Putte|Dikebu|Dikgophaneng|Dipetleloana|Ga-Habedi|Ga-Moeka|Ga-Motle|Kolofane|Kromkuil|KwaMmatlhwaela|KwaRatsiepane|Lebotlwane|Leeukraal|Lenatong|Mathibestad|Mmakaunyana|Mmukubyane|Modiane|Mogogelo|Mogohlwaneng|Olverton|Rabusula|Renostervlei|Ruigtesloo|Selepe|Slagboom|Sutelong|Swartbooistad|Swartboom|Swartdamstat|Thladistad|Thulwe"],
  ["moseskotane", "Bakubung Lodge|Bapong|Bierkraal|Bojating|Boriteng|Cronjes Boomen|Davidskuil|Dinokaneng|Doornspruit|Doringpoort|Driestat|Ga-Masilela|Ga-Mathako|Ga-Mokgatlha|Ga-Ramoga|Ga-Ramokoka|Ga-Raphiri|Goedgevond|Heystekrand|Kakoshong|Kayakulu|Kgamatha|Khavakhulu|Kolobeng|Ledig|Leeuwkuil|Legogolwe|Lekutung|Lesetlheng|Lesobeng|Lethakeng|Losmytjerrie|Mabele-a-podi|Mabeskraal|Magalane|Magong|Makgope|Makweleng|Manamakgoteng|Manamela|Mankaipaya|Mantsho|Mapaputle|Marapalalo|Maretlwana|Masekolane|Matlapeng|Matlhagame|Matooster|Matrooster|Metsikgetlane|Mmantserre|Mmatau|Mmopyane|Mmorogong|Modimong|Mogoditshane|Mokgalwaneng|Mokgoatsi|Molatedi|Molorwe|Mononono|Mosito|Motlhabe|Moubana|Mphonyoke|Nkogolwe|Nonceba|Ntsana-le-Metsing|Ou Thomas se Loop|Phuting|Pilanesberg Center|Pitsedisulejang|Ramosibitswana|Ratsegae|Saulspoort|Seolong|Sesibitswe|Silkaatskop|Sun Village|Thabeng|Tiokweng|Tlhatlhaganyane|Tswaaneng|Tumaskop|Uitlanderskraal|Vlakfontein|Vlakplaats|Vrede|Vrisgewaagd|Witrantjie|Wydhoek"],
  ["ramotshere", "Aapdraai|Borakalalo|Borothamadi|Botlhaolelo|Dinokana|Doornhoek|Doornlaagte|Driefontein|Driehoek|Ga-Matshogo|Ga-Suping|Ga-Titi|Goorathebe|Gopane|Groot-Marico|Kalkpan|Keatuka|Koedoesfontein|Kubu|Kuilenburg|Kwaggafontein|Lekgophung|Lekubu|Liversedge|Lobatieng|Lobotane|Loubsersrus|Madabana|Madikwe Game Reserve|Madutle|Manwane|Maphephane|Marico-Wes|Masewu|Matlhase|Matluetla|Matsiapane|Melorane|Meseg|Mmasebudule|Mokaleng|Mokgola|Motswedi|Nietverdiend|Nkwedumang|Puaneng|Ruitjesvlakte|Sandpoortjie|Seane|Sengoma|Setete|Sikwane|Snymansvlei|Supingstad|Swartkopfonteinhek|Torrington|Wegdraai|Welbedacht|Wilgeboomspruit|Witkleigat|Wykeham"],
  ["ratlou", "Bathobatho|Botshabelo|Disaneng|Freedom|Ga-Ralebelwane|Heathview|Jonkersrus|Keeley’s Ranch|Kgwedimopitlo|Kraaipan|Kwidi|Letsapa|Logagane|Logaging|Madibogo|Madibogo Pan|Mahukubung|Maipeng|Makgakgane|Makgobis Stadt|Makgori|Mareetsane|Masamane|Masibi|Matloding|Mohuti|Mokobisi|Morokwa|Motlhokaditse|Phiring|Phitshane|Ramabesa|Sasane|Setlagode|Shaleng|Steilnek|Thepe|Thultwane|Tlhakajeng|Tshidilamolomo"],
  ["rustenburg", "Bala|Bantu Township|Baraseba|Beestekraal|Bethanie|Boitekong|Boitekong Ext 2|Boons|Boshoek|Breetsvlei|Buampsa|Buffelshoek|Buffelspoort|Freedom Park|Ga-Kgale|Ga-Luka|Geelhout Park|Hartbeestfontein-A|Hermansburg|Kana|Kroondal|Kwa-Chaneng|Kwa-Luka|Leeukop|Lefaragatlhe|Lekkerrus|Lenotong|Lesung|Mabitse|Maile|Makolokwe|Mallaphiri|Manoka|Marakana|Masosobane|Mathopestat|Maumong|Mfidikoe|Modikwe|Mogono|Monnakato|Mudubung|Nooitgedacht|Phatsima|Photsaneng|Protea Park|Ramala|Rankelenyane|Rathipa|Rietfontein|Safari Tuine|Serutube|Thekwane|Thlabane|Tlaseng|Tshaneng|Tsitsing|Turfvlakte|Vlakfontein|Wevedeen"],
  ["tswaing", "Agisanang|Bahurutshe|Bospoort|Deelpan|Dirubi|Doornlaagte|Drieangle|Gannalaagte|Gerdau|Geysdorp|Hartsrivier|Khunwana|Kopela|Majaneng|Majeng|Manamolela|Manonyane|Mofufutso|Mokgalwane|Mokope|Ottosdal|Saamwerk|Saleng|Schoongezicht|Sias|Thaba-Sione|Vaalplaats|Vermaas|Witpan"],
  ["bushbuckridge", "Arthur’s Seat|Bolla-Tau|Bosbokrand|Burlington|Buyisonto|Calcutta|Casteel|Chavelgaza|Chochocho|Clare A|Clare B|Clare C|Croquet Lawn A|Croquet Lawn B|Die Brug|Dingleydale A|Dingleydale B|Dumfries A|Dumfries B|Dumfries C|Edinburgh A|Edinburgh B|Eglington A|Eglington B|eMakhazeni B|Exeter|Fayini|Ga-Boelang|Ga-Josepha|Godide|Gottenburg|Gqweta|Graigieburn|Green Valley|Hlalakahle|Hlanganani|Hlavekisa|Hoxani|Humulani|Inyati|Islington|Jim Brown|Jongilanga|Kamalamule|Kgapamadi|Khokhamoya|Khomanani|Klaserie Private Nature Reserve|Kumana|Mabharule|Maboke|Madras A|Madyembeni|Mafemani|Mahlobyanini|Mahukule B|Malamule|Mamelodi|Mangwazi|Manyakatana|Manyeleti Game reserve|Mapaleng A|Mapaleng B|Mapulaneng View|Mariepskop State Forest|Marite|Masakeng|Masana|Matsavana|Matshaye|Maviljan A|Maviljan B|Mbangwane|Mhlaba|Mission|Mkhuhlu|Moloro|Morea|Morolaneng|Motlamogale|Motlamogatsane|Mphenyatsatsi|New Forest B|New Line|Oakley|Orinoco A|Orinoco B|Orinoco C|Pelindaba|Rabelaisruskamp|Relani|Rivoni|Rooiboklaagte A|Rooiboklaagte B|Rulani|Sabi-Sand Game Reserve|Sabie Park|Salique State Forest|Sekrepeng|Setlhake|Seville A|Seville B|Seville C|Shata|Shatale|Silinda|Sparta|Tasakani|Teka Mahala|Thabakgolo|Thorndale|Thornybush Game Reserve|Timbavati|Tiyimeleni A|Tiyimeleni B|Tsakani|Tshunelani A|Tshunelani B|Tswafeng|Umbabat Nature Reserve|Utlha A|Utlha B|Varty|Violet Bank|Violetbank A|Violetbank B|Violetbank D|Wales|Xikhusese"],
  ["albertluthuli", "Armburg|Betty's Goed|Clarence|Diepdale|Dundonald|Ekulindeni|eManzana|eMbangweni|Empuluzu|Etjelembube|Excelsior|Fernie|Glenmore|Goedehoop|Grootpan|Ka-Ngubane|Koffiebank|Kranspan|Lukwatini|Lundzi|Maphundlwane|Maryvale Farm|Mooiplaas|Morgenster|Nazareth|Nhlazatje|Oranje|Redhill|Springfontein|Steynsdorp|Swalluwnest|Tjakastad|Tshaka"],
  ["dipaleseng", "Amersfoort|Balfour|Balfour North|Cairnleith|Crestlands|Ellisdale|Grootvlei|Herbstfontein|Kuilspruit|Mkhwanazi|Nthrowane|Pelgrims Rust|Russeldene|Thaba-Kgwali|Wilgefontein|Willemsdal"],
  ["jsmoroka", "Allemansdrif|Bamokgoko|Bloedfontein|Borolo|Bultfontein|Dihekeng|Dikgwale|Ditlhagane|Ditlhokwe|Ga-Mapogo|Ga-Matimpule|Ga-Maubane|Ga-Ramantshane|GaMmakola|Gertsepan|Kabete|Katsibane|Kwa-Phake|KwaMantlole|Leeuwfontein-C|Lefifi|Lefiswane|Leonie|Loding|Luckau|Mabaneis Location|Mabhoko|Magareng|Mapoch|Marapjane|Marapyane|Marothobolong|Masobye|Matshiding|Mdutjana|Mmametlhake|Moletsi|Morwe|Motati|Moteti|Nokaneng|Norman|Pankop|Phake|Rankaile|Rooifontein|Seabe|Segokgo|Senotlelo|Skilpadfontein|Sleutelfontein|Tambisha|Thabana|Vaalbank|Valsfontein|Wyedrif"],
  ["pixleymp", "Aankomst|Amersfoort|Brakfontein|Daggakraal|Enon|Hartbeesfontein|Jantjieshoek|Kafferfontein|Kalkoenkrans|Klipplaatdrift|Majuba|Mooifontein|Palmietfontein|Perdekop|Volksrust|Vukuzakhe|Wakkerstroom|Weltevreden|Wilhelmina|Zoo Als Hy Lykt"],
  ["emakhazeni", "Bambi|Bothasberg|Crossroads|Emgwenya|Gemsbokhoek|Helvetia-Noord|Hydro|Panorama|Schoemanskloof|Siyathuthuka|Sterkloop|Torburnlea|Tranquilitas camping|Wagenbietjieshoek|Waterval-Onder"],
  ["govanmbeki", "Bethal|Bethal East|Bethalrand|Boskrans|Brendan Village|Charl Cilliers|Eendrag|eMzinoni|Faith Hill Estates|Hoeveldrif|Kinross|Kleinfontein|Kortlaagte|Lebohang|Leslie|Rolyna Estates|Rooybank|Secunda Exit 6|Theuns|Thuli|Trichardt|Witbank"],
  ["lekwa", "Alpha|Aspley|Azalea|Bekkersrust|Brakfontein|Bromfield|Cedarmont|Darling|Donnelly|Dorpsplaas|Dunoran|Glenmarsh|Grootgewaagd|Hanover|Hoogekraal|Kenfield|Leeuwkraal|Maizefield|Makotopong|Meyerville|Morgenzon|Nooitgedacht|Norman Estate|Onverwags|Padgesvlei|Sewefontein|Standerton Ext 6|Stanfieldhill|Tutuka|Tweedronk|Vogelstruisfontein|Willowgrange|Wrosemore"],
  ["mbombela", "Alkmaar|Barclay Vale|Barretts|Barvale|Bojwana|Bongani|Boschrand|Boshalte|Broham|Bushman Rock|Chweni|Coetzeestroom|Crocodile Valley Estates|Daantjie|Daantjielokasie|Die Winkler|Dixie|Dollaaskraal|Dudu|Dwaleni|Elandshoek|eLegogoto|eLundi|eMakoko|eManzini|eMpumalanga|eNgcobaneni|Entre Nous|eNumbi|eNyalungu|eNyamazaneni|Frenchbobs|Ga-Tshwene|Gatehouse|Guthrie|Gutshwa|Highlands|Hillsowen|Hlauhlau|Honeybird|Kaapsehoop|Katoen|Kiepersol|KuMcogwaba|Ligfontein|Louw’s Creek|Luphisi|Madlabantu|Mahusha|Mahushu|Malekutu|Mataffin|Matsulu|Mpakeni|Msogwaba|Mtimba|Nelspruti|Nelsville|Ngodini|Ngodwana|Nkambeni|Noordkaap|Nsikazi|Numbi|Nyongane|Phasha|Pretoriuskop|Pumalanga|Rietvlei|Running Waters|Sabierivier|Saint John’s Mission|Saint Pauls|Sandrivier|Sarana Hall|Selapi|Sheba|Siphelanyane|Skukuza|Snymansbult|Sonheuwel|Sterkspruit|Swalala|Swartfontein|Tekwane|The Sands|Vergesig|Weltevreden|Ziest|Zwelisha"],
  ["mkhondo", "Augsburg|Berbice|Brereton|Brereton Park|Commondale|De Kraalen|Dirkiesdorp|Driefontein|eMkhondo|eMvelo|Enhlozana|Evergreen|Grootspruit|Insephe|Iswepe|Kommetjie|KwaNgema|KwaThandeka|Mooiplaas|Moolman|Ngema Tribal Trust|Nilgekozen|Spinnekop|Sulphur Springs|Vlakkloof|Westoe|Wittenberg"],
  ["msukaligwa", "Boomplaas|Brakfontein|Breyten|Camden|Carlchew|Cassim Park|Chrissiesmeer|Coalfields|Davel|Diepfontein|Estancia|Goedhoop|Hartebeestspruit|Kafferspruit|KwaDela|KwaZanele|Lothair|Nayfair Estates|Nederland Park|Neeuwplaas|New Ermelo|Retvallei|Saint Helen|Sheepmoor|Spitskop|Talfelkop|The Gem|Vlakfontein|Warburton|Wesselton Ext 6"],
  ["nkomazi", "Bob|Bosfontein|Compound|Disa Estates|Driekoppies|Dzuweni|Embhojeni|Emtfuntini|Esibayeni|Figtree|Good Luck|Hectorspruit|Hlengesha|Holnek|Homestead|Ivaura Estates|Kaapmuiden|Kamaqhekeza|Kamhlushwa|Kasibhejane|Kazibokwane|Keerom|Kemps Cottage|Krokodilbrug|KwaLugedlane|KwaMandulu|KwaSipunu|Landboukantoor|Lilydale|Linga Longa|Lomatimond|Louieville|M'hati|Madadeni|Magogeni|Magudu|Mahoho’s Kraal|Malelane|Mananga|Mangweni|Masibekela|Matsamo|Mbuzini|Mgobode|Mhlambanyatsi|Mhloshana|Middelplaas|Mpanganeni|Mzinti|Ngwenyeni|Ntunda|Phiva|Schoemansdal|Seekoeigat|Shiyalongubo|Shongwe|Shongwe Mission|Sibange|Sidlamafa|Sihlangu|Sikhwahlane|Singobile|Skoonplaas|Thambokhulu|Tongwe|Vlakbult|Willis-Myline"],
  ["stevet", "Arnot|Blesbok|Blinkpan|Boschkloof|Bosmanspan|Botshabelo|Braybank|Broodsnyersplaas|Dennesig|Doornkop|Douglas|Enkangala|Goedehoop|Groot Drakenstein|Hendrinakrag|Jonkerville|Kanonkop|Komati|Lammerkop|Many Waters|Meerlus|Mhluzi|Mhluzi Ext 4|Mhluzi Ext 8|Middelburg|Pullens Hope|Rietkuil|Schoonoord|Sizanane|Tienfontein|Tokologo|Uitskot|Vlakfontein|Wildebeesfontein|Winterkamp"],
  ["thabachweu", "Badfontein|Blyde|Boschfontein|Boschjeskop|Bosoord|Coromandel|Doornkop|Draaikraal|Ga-Sekubu|Goedewill|Hanslaagte|Kellysville|Kliprivier|Klipskool|Lehwiting|Leroro|London|Malieveld Valley Forestry Settlement|Mankolehlotlo|Maria Trost|Mashishing|Matibidi|Mauchsberg|Moremela|Mount Sheba|Nooitgedacht|Nyokosela|Onverwag|Oshoek|Phepene|Pilgrim’s Rest|Rhenosterhoek|Richmond|Rietfontein|Rosshill|Somerplaats|Vaalhoek|Weimershoek"],
  ["thembisile", "Bhundu|Boekenhouthoek|Chief Magodongo|Ekukhanyeni|Gemsbokspruit|Goederede-S|Kwaggafontein|Kwarsspruit|Matshipe|Rietfontein|Somaroboro|Stoffberg|Vlaklaagte Een|Vlaklaagte Twee|Vlaklaagte-Bb|Witfontein|Witnek|Wolfenkop"],
  ["victorkhanye", "Delmas Ext 2|Dwarsfontein|Eloff|Goededacht|Klipfontein|Klipspruit|Lionelton|Middelburg|Pinewood|Rietkol|Strazon Estates|Sun Valley In"],
  ["baphalaborwa", "Ga-Mashishimale|Ga-Masisimale|Gravelotte|Humulani|Josephine|Kostini|Leydsdorp|Makushane Location|Maseki Location|Mashishimale|Mashisimali Location|Mhalamhala|Mulati|Murchison|Namakgale-A|Nhlarweni|Nshawu|Salwana|Shilowa|Silwana’s Location|Tsende"],
  ["belabela", "Brownridge|Buffelsdrif|Codrington|Eersbewoond|Kalkfontein|Lehau|Mackenzie|Merinovlakte|Moheme|Ouklip|Pienaarsrivier|Radium|Rust de Winter|Serala|Settlers|The Carousel Entertainment Centre"],
  ["blouberg", "Addney|Alldays|Baltimore|Blouberg|Bobirwa|Bochum|Bodi|Borwalathoto|Botlokwe|Ditatsu|Dithabaneng|Esaurinca|Fritchley|Ga-Kibi|Ga-Kobe|Ga-Letswalo|Ga-Mabeba|Ga-Mabelebele|Ga-Mabotha|Ga-Maela|Ga-Malokela|Ga-Mamohwibidu|Ga-Mamoleka|Ga-Mamolele|Ga-Mampote|Ga-Mankgodi|Ga-Maphoto|Ga-Masalane|Ga-Masekwa|Ga-Maselela|Ga-Mmatemana|Ga-Mokopane|Ga-Monyebodi|Ga-Motshemi|Ga-Moyaga|Ga-Ngwepe|Ga-Ntshireletsa|Ga-Ntsoko|Ga-Raditshaba|Ga-Rakwele|Ga-Rammutla|Ga-Raphokola|Ga-Rawesi|Ga-Rummutla|Ga-Tefu|Ga-Tshabalala|Gregory|Grootpan|Hananwa|Helene Franz|Kawene|Kgatalala|Kgokonyane|Komatie|Kutumpa|Kwaring|Lebu|Lekiting|Letswatla|Loodmyn|Maasstroom|Madibeng|Makgari|Manthata|Mathateng|Matshira|Mmalebogoslokasie|Mokudung|Mokumuru|Mongalo|Mophamamona|Morotsi|Mosehleng|Mositone|Mothagale|Motshitong|Nonono|Royston|Sebotane|Sekhung|Sesalong|Sethonokgwa|Setlaole|Sewale|Skeenshoek|Swartwater|Terveen|Thalahane|Thusano|Tlhonasedimong|Tokio|Tolwe|Tonash|Tsola Metse|Tswatsane|Usutu|Vivo|Winterhoek"],
  ["collinschabane", "Bashasha|Ha-Folovhodwe|Ha-Matsheketsheke|Hamakuya|Khakhu|Khavhambe|Klein Tshipise|Luheni|Mabiligwe|Madimbo|Magovani|Makuleni|Masisi|Matavhela|Matshakatini|Musunda|Mutale|Mutshavhawe|Pafuri|Pile|Punda Maria|Rambuda|Sigonde|Thengwe|Tshabya|Tshamulongwe|Tshandama|Tshenzhelani|Tshikuyu"],
  ["eliasmotsoaledi", "Bafaladi|Bakoni|Barokgoga Bakopa|Dikgalaopeng|Dindela|Ga-Matloponya|Ga-Pamadz|Ga-Phetla|Hlogotlou|KwaDlaulale|Laersdrift|Legolaneng|Magukubjane|Mahlangu|Makpopeng|Manyanga|Maratheng|Mareleng|Matsepe|Mmotwaneng|Monsterlus|Ndambo|Nemba|Nkadimeng|Ramogwerane|Sephaku|Spitskop|Sterkfontein|Syferfontein-B|Tafelkop|Talane|Thabaleboto|Vlakfontein|Vrischgewaagd"],
  ["ephraimmogale", "Elandskraal|Ga-Makgatle|Ga-Makharankana|Ga-Matlala|Goru|Grass Valley|Klipspruit|Leeuwfontein|Mabitsi|Madilo|Mamphokgo|Manapsane|Matlala Ramosheba|Mela|Mogalatsana|Moganyake|Mohlotshi|Moomane|Motseleope|Ngwelemong|Paardensoek|Phetwane|Puleng|Seriteng|Tsimanyane|Van der Merwes Kraal|Voorreg"],
  ["fetakgomo", "Alverton|Amosa|Apel|Derdegelid|Dithabaneng|Driekop|Ga-Ishe|Ga-Kgwete|Ga-Mabotsa|Ga-Maditsa|Ga-Mafate|Ga-Mahlokwane|Ga-Makhwae|Ga-Makofane|Ga-Malepe|Ga-Mamphahlane|Ga-Manapane|Ga-Mankopane|Ga-Maroga|Ga-Masamothane|Ga-Mashishi|Ga-Mathipa|Ga-Matokomane|Ga-Matsi|Ga-Mmamogolo|Ga-Mongatane|Ga-Motodi|Ga-Motshana|Ga-Nkwana|Ga-Podile|Ga-Radingwana|Ga-Riba|Ga-Sekhukhune|Ga-Selala|Ga-Wannankaya|Gowe|Ironstone|Kgautswane|Kgoponeng|Kgotlopong|Kromellenboog|Leboeng|Ledingwe|Legobwe|Lekgwareng|Lesetse|Maahlashi|Maandagshoek|Mabitseng|Mabotsha|Magapaneng|Mahlasi|Mahubahuba|Makgake|Makgoba|Makgwareng|Makopung|Makubu|Malokele|Manawaneng|Manyaka|Maotsi|Mapareng|Maphopha|Maropeng|Masehleng|Matshiretsane|Melau|Modubeng|Mogaba|Mohlarutse|Mokgorwane|Mokoropo|Molapong|Monotwane|Mooiklip|Morapaneng|Moshira|Motlamotshe|Motlolo|Motsetladi|Motutulong|Mphanama|Naboomkoppies|Nakana|Ngkoane|Ntsapung|Pelangwe|Penge|Phahla|Phiring|Poung|Radingwane|Rietfontein|Sefosetladi|Segorong|Sehlaku|Sekhukhuneland|Sekopung|Seokodibeng|Serokolo|Sesehu|Sesesehu|Strydkraal|Swale|Taung|Thabantsho|Tiekiedraai|Tsao|Tshate|Tsidintsing|Tswenyane|Tukakgomo|Twyfelaar|Windhoek|Zwaartkop Native Location"],
  ["giyani", "Bend|Gaulu|Giyani A|Giyani-E|Hlophekane|Ka-Dzumeri|Ka-Homu|Ka-Mapayeni|Ka-Mininginisi|Ka-Ngove|Ka-Nkuri|Ka-Xihlakati|KaNdengeza|Khakhala|Mahlathi|Makhuva|Makuba’s Location|Malele|Masokis|Matidza|Mbhawula|Munywini|Nalatsi|Ndindani|Ngobi|Nkomo|Nsama|Phalakubeni|Sawutini|Scotch Camp|Shingwidzi|Shiviti|Sukani|Thomo|Tom|Zakeni"],
  ["greaterletaba", "Duiwelskloof|Dumeri|Ga-Kgapane|Ga-Matipane|Ga-Modjadji|Gandlanani|Hildreth Ridge|Malematsa|Mamaila|Mandlakzai|Middelwater|Modjadje’s Location|Modjadji|Mokgoba|Mokwasele|Nlaniki|Quantock|Raphahlelo|Rotterdam|Segop’s Location|Senwamokgope|Vaalkrans|Verlief"],
  ["tzaneen", "Bankuna|Botudi|Broedersdraai|Creag Roy|Dan|Diepgelegen|Duplex|Ga-Modjadji|Ga-Mogoboya|Glenshiel|Gluckauff|Haenertsburg|Hekpoort|Jouberts Kroon|Julesburg|Ka-Mandlhakazi|Ka-Mulaba|Ka-Nwamitwa|Khangela|Koppie Alleen|Lenyenye|Letaba|Letaba Estates|Maake|Maakeslokasie|Mabyepelong|Magoebaskloof|Mahlar’we|Makhwibiding|Maleketla|Mamathola Location|Mamitwa’s Location|Mamitwaskop|Mamokololo|Mandlakazi|Mariveni|Mawa|Meadowbank|Merensky|Mieliekloof|Mirogoma|Mmanopi|Mogapeng|Mogoboya|Mogoboyaslokasie|Mohlaba’s Location|Mohlahlareng|Monte Christo|Moruji|Nkambako|Nkowakowa|Nwamitwa|Ofcolaco|Olyfberg|Oochock|Palmietfontein|Patent|Rhulani|Ritakop|Runnymede|Sephaphaneng|Serare|Serolorolo|Shiluvane|Sterkloop|Thabina|Tours|Troosmy|Uitsig|Valencia Estate|Veekraal|Verbrandehoek|Weighton|Welbeloond"],
  ["lepellenkumpi", "Bolahlakgomo|Bolopa|Boschplaats|Byldrift|Dithabaneng|Doornfontein|Droogte|Eerste Geluk|Ga-Madisaleolo|Ga-Mafefe|Ga-Makgoba|Ga-Malegase|Ga-Mampa|Ga-Mathabatha|Ga-Matshele|Ga-Mmamogwasa|Ga-Molapo|Ga-Phaswana|Ga-Rakgwatha|Ganspoort|Good-Hope|Hwelereng|Hwelesangeng|Kapetseng|Kgaphamadi|Khureng|La Dinong|Lekhuswaneng|Lekurung|Lenting|Lesetsi|Leswika|Letlhokwaneng|Locatie van M’phatlele|Mabokotswane|Madika|Mafefeslokasie|Mafsiagobaba|Magatle|Magwaneng|Mahlatjani|Makurung|Makweng|Malehlage|Malipsdrif|Mamosweu|Manaileng|Manoge|Mapatjakeng|Marulaneng|Masite|Matabatas Location|Mathabatha|Mathibela|Matome|Mimosa|Mispah|Mmafefe|Mmakotse|Mmamati|Moepeng|Mogologolo|Mogoto|Moleke|Moletlane|Molsgat|Morotse|Mosetamong|Motantanyana|Motolong|Motsane|Motserereng|Mphahlele 1|Mphahlele 2|Mphahlele 3|Phosiri|Pruizen|Ramorake|Raymond Estates|Rivierplaats|Sampse|Sefalaolo|Sekgophokgophong|Sekurwaneng|Sepitsi|Seswikaneng|Streatham|Thabamoopo|Thabaneng|Thamagane|Tooseng|Tswaing|Twinvallei|Vaalboschlaagte|Volop|Zebediela|Zebedielas Location"],
  ["lephalale", "Abbotspoort|Bangalong|Beauty|Bossche-Diesch|Bulge River|Ga-Maeleletja|Ga-Monyeki|Ga-Seleka|Groblersbrug|Hardekraaltjie|Hoopdal|Kauletsi|Kokstad|Kransberg|Kremetartpan|KwaMadibaneng|KwaTshelamfake|Marapong|Marnitz|Melkrivier|Mmatladi|Mokurwanyane|Ons Hoop|Onverwacht|Overyssel|Ramabaras-kraal|Sandbult|Setateng|Steenbokpan|Strydomsdrift|Thabo Mbeki|Theunispan|Tom Burke|Vaalwater|Villa Nora|Woudend"],
  ["makhado", "Abrasive|Bandelierkop|Beaconsfield|Blouhak|Buysdorp|Chavani 3|Chiefs Kraal|Culvet|De Droom|De Hoop|Dzarani|Elim|Elsteg|Fort Edward|Fripp|Ga-Madulathoka|Ga-Mathule|Ga-Molema|Garside|Gertrudsburg|Gordon|Ha-Funyufunyu|Ha-Madodonga|Ha-Magau|Ha-Magoro|Ha-Mamuhoyi|Ha-Manavhela|Ha-Mantsha|Ha-Mavhunga|Ha-Mubua|Ha-Rabali|Ha-Ramahantsha|Happy Rest|Harmony|Hlanganani|Houtrivier|Ka-Bungeni|Ka-Madzivi|Ka-Mtititi|Ka-Shigamane|Klein-Letaba|Knunda|Kranskraal|Kurulen|Kutama’s Location|KwaMatatani|Levubu|Levubu-Nedersetting|Lincoln York|Locatie van Tabaan|Louis Trichardt Airforce Base|Louraine|Lovemore|Lushof|Luvhalani|Luvhola|Madabani|Madaheni|Madombidzha|Mapani|Mara|Maranikhwe|Mashapa|Matshavhawe|Matsila|Mauluma|Mawoni|Mbokota|Melanyi|Mitxetweni|Moebani|Molemaslokasie|Muduluni|Mulangaphuma|Muraleni|Musekwa|Muungadi|Natalie|Nebo|Ninlo|Nngwekhulu|Nthabalala|Nzhelele|Olifantshoek|Oporto|Raskhutuma|Ratombo|Rembander|Rietvlei|Rivierplaats|Schoemansdal|Sending|Senthimula’s Location|Seville|Shewasaulu|Shirley|Sinthumule|Stone Edge|Studholme|Sumsare|Toekoms|Tshakhuma|Tshikhwani|Tshikwarani|Tshimbupfe|Tshino|Tshiozwi|Tshirolwe|Tshishiru|Tshiswenda|Tshitavha|Tshituni|Tshitwi|Tshivangani|Tskani|Uitkyk|Uitsig|Vetfontein|Vongane|Vygeboomdrift|Waterpoort|Weltevrede|Wyllie’s Poort"],
  ["makhuduthamaga", "Deugdvlei|Ga-Madiba|Ga-Magatu|Ga-Maila|Ga-Malaka|Ga-Maloma|Ga-Marishane|Ga-Mashabela|Ga-Mashelane|Ga-Masukulale|Ga-Mogashoa|Ga-Mokalapa|Ga-Moloi|Ga-Monlala|Ga-Moretsele|Ga-Phahla|Ga-Sefoka|Ga-Sekhukhune|Ga-Seopela|Ga-Shopeyana|Ga-Tisana|Gaataan|Gara-Hupula|Gopeng|Kome|Lebaleng|Legapane|Lehlakong|Loopspruit|Madibong|Mafatle|Magogotiou|Magolapong|Mahlatse|Makadikwe|Malope|Mampana|Manganeng|Mare|Marishane Garden|Marogorogong|Marulaneng|Masanteng|Mashabela|Mashite|Mathapisa|Matlale|Matshupe|Matsoane|Mogaladi|Mogales|Mogashoa|Moripane|Mphake|Mpudulle|Nebo|Ngwaritsi|Ottensville|Patantswane|Phokwane|Photohlogwane|Pitsaneng|Platklip|Sekhuswane|Serageng|Skoonoord|Soetvelde|Thabanapitsi|Tholo-Mosilone|Tswaing|Tswatago|Veeplaats|Weltevreden"],
  ["maruleng", "Amanda|Angledale|Botswana|Dingapong|Diphuti|Finale|Fochabers|Ga-Mamatlhola|Ga-Mametsa|Ga-Mohlabe|Ga-Sekororo|Kubjaname|Lepelle|London|Lorraine|Makgaung|Mametjaslokasie|Mbabat|Mdlazi|Meetse-a-Bophelo|Metz|Mica|Moetladimo|Mokwena|Naphuno|Sekororoslokasie|Trichardtsdal|Worcester"],
  ["modimollemookgo", "Atoom|Beginplaas|Behoudeniskloof|Besonderheid|Bokpoortlaagte|Bracondale|Dryfsand|Elandsbosch|Gemsbokfontein|Glentig|Goedgedacht|Golders Green|Haningfontein|Hans se Kaalte|Hartebeesfontein|Hartebeespoort|Hoogstepunt|Kaalvallei|Kalkfontein|Kileneni Ranch|Klipfontein|Naboomfontein|Northern Flats|Palala|Rankin’s Pass|Renosterfontein|Rhenosterfontein|Rondedoorn|Rooifontein|Schiedam|Settlers Pride|Singapore|Sunningdale|Swanepoelsrust|Thusang|Trascate|Tuinplaas|Tuissenek|Tweetstroom|Vaalwater|Van Alphens Viei|Welkom|Witkoppies|Wolwefontein|Zoetkopjes"],
  ["mogalakwena", "Amatava|Babirwa|Bakenberg|Basterspad|Bloemhof|Bultongfontein|Dinakane|Diphitshi|Diretsaneng|Eckstein|Ga-Chokoe|Ga-Dukakgomo|Ga-Hlako|Ga-Kgubudi|Ga-Lebelo|Ga-Letwaba|Ga-Mabuela|Ga-Mabusela|Ga-Makoena|Ga-Malapile|Ga-Malebana|Ga-Maloka|Ga-Malope|Ga-Mapela|Ga-Masenya|Ga-Masiane|Ga-Mathapo|Ga-Mathekga|Ga-Modipana|Ga-Mokaba|Ga-Molekana|Ga-Molekwa|Ga-Monare|Ga-Monene|Ga-Mosidi|Ga-Mosoge|Ga-Motlana|Ga-Musi|Ga-Nkidikitlana|Ga-Ralenkwane|Ga-Ramela|Ga-Rammu|Ga-Rantlakane|Ga-Rapadi|Ga-Taueatswala|Ga-Tshaba|Ga-Tshipana|GaSekhaolelo|Groesbeek|Hanglip|Hans Masibislokasie|Hendrik Bakenberg Masibislokasie|Hoogedoorns|Janseput|Kabeana|Kafferboom|Kgaphamadi|Kgopeng|Kgopung|Koedoesrand|Laasteskof|Lefanyane|Lekhureng|Lenkwane|Luge|Luxemburg|Mabuladihlare|Madiiba|Magagamatala|Mahlwareng|Mahwelereng|Makapansgat|Makekeng|Malagakwini|Malokong|Mapela|Marken|Marulaneng|Matebeleng|Matsitsilene|Mmahlogo|Mmakala|Mmamatlakala|Moepel|Mogalakwena|Mogalakwenastroom|Mokerong|Mongatane|Mosira|Mosuka|Motswintswinyane|Mphelelo|Murchison|Nkwe|Nong|Ntsintsing|Phafula|Phatsane|Pholotsi|Platreef|Pudiyakgopa|Rhenosterfontein|Segole|Sekgakgapeng|Sekuruwe|Senita|Sepharene|Setuphulane|Sodoma|Steillopbrug|Sterkrivier|Suid-Holland|Suswe|Thupi|Thutlane|Tinmyne|Tlhogoyanku|Treves|Tshamahansi|Uitspan|Uitzicht|Waterval|Weltevreden"],
  ["molemole", "Brakspruit|Daviesville|Dendron|Die Onderste|Doringboom|Dwarsrivier|Eisleben|Fatima Mission|Ga-Kgare|Ga-Manthata|Ga-Mokgehle|Ga-Mokwele|Ga-Moleele|Ga-Phasha|Ga-Poopedi|Ga-Ramokgopa|Ga-Sako|Ga-Tibu|Groothoek|Kalkbank|Leeuwkraal|Legkraal|Legotlhong|Locatie van Ramagoep|Makgodu|Mangata|Matokslokasie|Mission|Mmatseke|Morbeng|Morebeng|Motshele|Mphakane|Mphakane 1|Naledi|Net Recht|Nthabiseng|Ramatshowe|Regdaar|Rita|Sekakene|Shakoleng|Soetdorings|Solomondale|Thorndale|Tshitale|Wagendrift"],
  ["musina", "Bonyani|Bosrand|Cato Smuts|Gaandrik|Gordonia Estates|Jungaan|Linton|Mopane|Musina-Nancefield|Palmgrove|Senator|Septimus|Skullpoint|Solitude|Tshipise"],
  ["polokwane", "Annadale|Bergnek|Bloedrivier|Blood River|Boratapelo|Boyne|Broadlands|Cornelia|Dalmada|Dibeng|Dikgale|Dikgaleslokasie|Ditenteng|Dithupaneng|Doornhoek|Dorsland|Eerstegoud|Enkelbosch|Ga-Dikgale|Ga-Hlahla|Ga-Keetse|Ga-Kgole|Ga-Kgorosi|Ga-Kobo|Ga-Kololo|Ga-Kolopo|Ga-Komape|Ga-Lamola|Ga-Lepadima|Ga-Mabitsela|Ga-Mabotsa|Ga-Madiba|Ga-Mahwai|Ga-Maidula|Ga-Maja|Ga-Makanye|Ga-Makgobathe|Ga-Makibelo|Ga-Mamadila|Ga-Mangou|Ga-Mankoeng|Ga-Mantlhodi|Ga-Mapangula|Ga-Maphoto|Ga-Maribana|Ga-Masehlong|Ga-Matabanyane|Ga-Mathiba|Ga-Matlapa|Ga-Mmabasotho|Ga-Mmathongwana|Ga-Modikana|Ga-Mogano|Ga-Mokgokong|Ga-Mokgopo|Ga-Mokobodi|Ga-Mokwane|Ga-Molepo|Ga-Moropa|Ga-Mothapo|Ga-Mothiba|Ga-Motlakgomo|Ga-Ngwetsana|Ga-Nonyane|Ga-Papo|Ga-Phago|Ga-Phagodi|Ga-Phaka|Ga-Phaudi|Ga-Ramakara|Ga-Rametlwane|Ga-Ramokadi-kadi|Ga-Ramongwana|Ga-Ramoshwane|Ga-Ramotlokana|Ga-Ramphere|Ga-Rampuru|Ga-Rankhuwa|Ga-Sebotse|Ga-Semenya|Ga-Setshaba|Ga-Thaba|Ga-Tshwene|GaMankgodi|Gladdeklipkop|Harmonie|Hoog-en-Droog|Hospital Park|Houtbosdorp|Hwibi|Ivydale|Jack|Jupiter|Kanana|Kgohlwane|Kgokong|Kgoroshi|Kgotia|Klein Dikgale|Knobel|Koloti|Komaneng|Kuschke|Laaste Hoop|Lehlohlong|Lekhureng|Leokaneng|Leshoane|Limburg|Locatie van Chune|Locatie van Malietzie|Lonsdale|Mabul’s Location|Machichaan’s Location|Madietane|Madiga|Mahwibitswane|Makatiane|Makgwadibeng|Makweya|Mamehlabe|Mamotintane|Manamela|Mankoeng|Mankweng Unit E|Mantheding|Manthorwane|Manyapje|Marabastad|Maribie|Maripathekong|Marobala|Marowe|Masekwameng|Mashashane|Masobohleng|Mataia’s Location|Matlala|Megoring|Mehlakong|Mekgobane|Mmadigorong|Mmankgaile|Moetagare|Mohlajeng|Molautse|Molepos Location|Monotwane|Monywaneng|Moria|Morowe|Moshate|Mphalong|Naledi|Neanderthal|New Pietersburg|Ngwanallela|Nokayamatlala|Nokaymatlala|Non-Pareil|Noute|Ntsima|Palmietfontein|Paxengwe|Perskebult|Phetole|Phoffu|Pinkie|Polokwane Central|Portugal|Ramakgaphola|Ramalapa|Rapitsi|Regenoeg|Sandfontein|Sebaeng|Sebayeng|Seema|Sefahlane|Segoahleng|Segwasi|Sekuruwe|Sekwala|Sengatane|Sepanapudi|Seshego-A|Seshego-C|Seshego-H|Setotolwane|Taung|Thabakgone|Thakgalang|Tholongwe|Thune|Tibane|Ticvo Tavo|Titibe|Toroponje Ntsho|Tshebeng|Tshware|Uitval|Uniepark|Utsane|Waterval|Westenburg|Wolkberg"],
  ["thabazimbi", "Adriaanshoop|Amandelbult|Bobbejaanstert|Breedpan|Doornfontein|Dwaalboom|Dwarsfontein|Groenvlei|Gwarriehoek|Hartbeesbult|Hartbeestfontein|Honingvley|Kiesel|Laastepoort|Leeupoort|Maraheki|Matlabas|Pony|Rhenosterkraal|Rooiberg|Rooibosbult|Sentrum|Swartklip|Two Rivers Estate|Voortrekkerspos|Wag ’n Bietjie Draai|Yskor|Zwartkop"],
  ["thulamela", "Begwa|Craighouse|Dzindi|Dzwerani|Fondwe|Georgenholtz|Gidjana|Gouldville|Ha-Lambani|Ha-Madala|Ha-Matsika|Ha-Radali|Ka-Dinga|Ka-Hasane|Ka-Madonsi|Ka-Mahonisi|Ka-Mapapila|Ka-Matiani|Ka-Matsakeli|Ka-Mavambe|Ka-Mavundani|Ka-Mbatlo|Ka-Mchipise|Ka-Mhinga|Ka-Mphambo|Ka-Mudavula|Ka-Muswane|Ka-Nghezimani|Ka-Nyavani|Ka-Phaphazela|Ka-Sunduza|Ka-Tshituugulwani|Ka-Xihosana|Ka-Xikundu|Ka-Xitlhelani|Khakhanwa|Khalavha|Khubvi|Lambani|Locatie van de Knopneuzen|Lomondo Location|Lukalo|Lwamondo|Madzingandevhe|Majika|Makonde|Makuleke|Makumbane|Makwarela|Malamulele|Manamane|Mangondi|Maphophe|Masikhwa|Matangari|Mavunde|Milaboni|Miohe|Mpapuli Location|Mtititi|Muhuyu|Mukhomi|Mukula|Mukumbani|Muledane|Mulenzhe|Mulenzheslokasie|Muthambi|Muthati|Mvelaphanda|Natal House|Palmaryville|Peninghotsa|Phaswane|Phaweni|Phugwane|Sambandou|Saselamani|Shayandima|Shigalo|Shikundu|Shingomeni|Shingwidzi|Shiphukuphuku|Stable|Takalani|Tshabvuma|Tshaulu|Tshianzwani|Tshiavha|Tshifudi|Tshiheni|Tshikonelo|Tshikundu|Tshilapfene|Tshitereke|Tshithotholwe|Tshivumbe|Tswera|Tswinga|Upper Shingwidzi|Vendaland|Vhutandabos|Xaswita"],
  ["kheis", "Arbeidsvreug|Balburney|Bastersput (1)|Bastersput (2)|Blouputs|Boegoeberg Besproeiings Nedersetting|Boegoeberg Dam|Bosbult (1)|Brierspan|Brussel|Constantia|Cruachan|Dagbreek|De Hoop|Deniel|Diemansput-suid|Droogenhoutputs|Edenville|Eldorado|Fransenville|Gannaput|Gariep|Geduld|Gemsbokbult|Gerhardtsput|Geselskap|Grootdrink|Hartebeest Vlakte|Hedley Plains|Holboskolk|Johnniesdale|Johnniesluck|Kameelpoort|Kheis|Klein Droëhout|Klein Mottelsrivier|Kraalkop|La Kocks Hoop|Langbaken|Malanswil|Merino|Middelerf|Moolmansdam|Môreson|Morrels Puts|Murasie|Patryspan|Putsies B|Putsonderwater|Rooilyf|Sidi Barrani|Skeerhok|Skerpioenpunt|Sonderpan-Oos|Sonop Veepos|Soutrivier|Swartbaken|Tarka se Kop|Titiespan|Trooilapspan|Vaalputs|Varsput|Veepos|Vivierspan|Vollgraaffsig|Wegdraai|Werda|Westerburg|Wilgenhoutsdrif|Witdrop (1)|Witdrop (2)|Witkoppies (1)|Witkoppies (2)|Ysterdoring"],
  ["dawidkruiper", "Ariemagom|Askham|Beginsil|Christiana|Donkiekraal|Groot Mier|Jagpad|Karos|Klein Mier Nommer Een|Klipaar|Klippunt|Kurrees|Lambrechtsdrif|Leerkrans|Leeu Bos|Louisvale|Maruping|Mooirivier|Noenieput|Norokei|Nuwerus NC|Oranjevallei|Paballelo|Philandersbron|Progress|Raaswater|Rietfontein|Rooiputs|Rosedale Ext. 2|Saulstraat|Schepkolk|Ses Brugge|Straussburg|Sultanaoord|Swartkop|Uitsoek|Vaal Koppies|Van Rooi’s Vlei"],
  ["dikgatlong", "Barker|Clearwater|Fort Peddie|Grey Hill|Kaaldraai|Klipdam|Koopmansfontein|Kutlwano|KwaNkwenkwazi|Limestone Kraal|Longlands|Merino Dale|Mount Rupert|Niekerks|Pniel Estates|Rusten|Smith’s Mine|Sydney on Vaal|The Bend|Tipperary|Ulco|Upper Gong-Gong|Vergaderplek|Waldecks Plant|Wilmae|Witputs"],
  ["emthanjeni", "Hanover Road|Oakglen|Wilput"],
  ["gasegonyana", "Batlharo|Bolelakgapu|Bretby|Ga-Tlhose|Grasrug|Khosis|Khudutlou|Klein-Koning|Koning|Lothakane|Rensville|Rietgat"],
  ["gamagara", "Dagbreek|Dibeng|Erlanksrus|Olifantshoek|Petersburg|Sishen"],
  ["hantam", "Bessiedam|Blaauboskom|Bloekomhoogte|Boomrivier|Brakputs|Bulsny|Damskolk|De Kruis (1)|De Kruis (2)|De Vloere|Die Hoek|Gannaholte|Haakdoorn|Halfpadrivier|Louwsrust|Lushof|Maansrus|Nieuwepos|Nieuwoudtville|Nuwerus (2)|O’Grabie West|Sakrivier|Sandkoppie Hut|Skerpioenkolk|Sonderwaterkraal|Stilstaan-en-Afspring|Stink Puts|Swartkop|Uitkyk|Vaderlandspan|Vendors Puts|Verneukpan|Voorspoed|Witkalk"],
  ["joemorolong", "Annasgeluk|Bokkraal|Dwarsvlei|Eldorado|Ga-Malelo|Geluk|Grootdrink|Hotazel|Kikafela|Lek-Lek|Lower Dikgatlhong|Sonstraal|Sutton|Van Zylsrus"],
  ["kaigarib", "Alheit|Ariesputs|Aseries Puts|Bladgrond-Noord|Boksputs|Brakboschkolk|Bussons Kloof|Cillie|Currie’s Camp|De Bakke (1)|De Halt|De Rust (1)|Driekop (1)|Driekop (3)|Eksteenkuil|Jackson|Kaimoepslaagte|Kakamas-Oos|Kanoneiland|Klein Koegab|Klein Rosynebos|Koekoeb|Location|Loxtonvale|Lutzburg|Marchand|Mary’s Rust|Melkboom|N’Rougas Noord|Neilersdrif|Neus|Onderste Doornknie|Ou Opdam|Putsies|Riemvasmaak|Rooikoenap|Rooipunt|Rooivloer|Rykheersputs|Schroder|Soutrivier|Suikersteek|Swartmodder|Uitzicht|Verschep|Welgelegen|Witdorp|Zandbergshoop|Zonderhule South|Zwaar Draai"],
  ["kamiesberg", "Blesbokhoek|De Kruis|Genoembies|Grootberg|Hondeklipbaai|Kamassies|Karkams|Klein-Nourivier|Koiingnaas|Kotzesrus|Langberg|Leliefontein|Lepelfontein|Namaroep|Naries|Osbak|Paulshoek|Rooidam|Rooifontein|Soebatsfontein|Somnaas|Speelmanshoek|Strandfontein|Wallekraal"],
  ["kareeberg", "Asbosbam|Badenhorstdam|Beesdam|Bergsig|Blaauwkrantz|Blinkklip|Bloupoort (2)|Blouvlei|Bossjesdam|Dagboetie|De Bruynsrus|Delvitle|Drieweeksleegte|Droogeboom|Farview|Gannapoortjie|Goodluck|Grasbult|Hoëveld|Hondepan|Inkbos|Kaffirskloof|Karnmelkkolk|Karringmelkskolk|Klein Springbokoog|Kleinberg|Kleinvlei|Klerkshoop|Koedoeskloof|Kommetjiesdam|Kwaggakolk|Maltrap|Marlo|Middelfontein|Môreson|Newlands|Nietemin|Nuwebegin|Nuwedam|Onverwags|Pappa Raas|Petersus|Pierings|Platdam|Request|Rivierplaas|Rooidam|Ruimte|Saaipoort|Skietfontein|Stinkbrak|Stuurmanspoort|Sukses|Swartbaadjie|Swartbaken|Tierputs|Toekoms|Vaalpunt|vaalput|Van Wyksvlei Settlements|Vermeulensput|Vleiplaas|Vliegpan|Vosburg|Vredelus|Witdam|Witput|Zandvlei"],
  ["karoohoogland", "Bethulie|Brospan|Exelsior|Helpmekaar|Jobseputs|Kaffir Kolk|Kompromise|Leeukloof|Lupapazi|Mantshilibeni|Ntshatshongo|Rietkloof|Stiebeuelvlei|Volminksvlei|Weltevrede|Wielkolk Laagte"],
  ["kgatelopele", "Bowden|Daniëlskuil|Karreeputs|Papkuil|Witputs"],
  ["khaima", "Buchufontein|Klavervlei|Onseepkans|Pella|Sandfontein|Stofbakkies|Swartoup"],
  ["magareng", "Content|Drift Hotel|Futchersplaas|Ikhutseng|Majeng|Veertien Strome|Windsorton Road"],
  ["namakhoi", "Biesies|Brandkloof|Carolusberg|Concordia|Gamoep|Goop|Grootmis|Henkries Mond|Kleinzee|Koeris|Komaggas|Kotzeshoop|Matjieskloof|Melkrivier|Narrap|Nigramoep|Plaathoek|Rietbergmyn|Rooiwal Suid|Steinkopf|Swartkop|Tweeloop|Uitkoms|Veggat|Vioolsdrif|Vriesklip"],
  ["phokwane", "Ganspan|Pampierstad|Valspan"],
  ["renosterberg", "Philipstown|Potfontein"],
  ["richtersveld", "Annisfontein|Auchas|Daberas|Doringrivier|Drifsand|Eksteenfontein|Green Island|Grootderm|Holgat|Jakkalsputs|Karoedap|Khubus|Kliphoogte|Koeskop|Kortdoorn|Kouefontein|Lekkersing|Modderfontein|Sabiesies|Sanddrif|Struishoek|Visagiesfontein|Wolfberg|Zwartwater"],
  ["siyancuma", "Annashoop|Bergsputte|Boegoeberg|Bucklands|Damplaats|Duikersdal|Genadedal|Groot Witberg|Heuningneskloof|Higgs’ Hope|Kareeboomcyfer|Klein Witberg|Koodoosbergdrift Store|Limewell|Matsap|Melkstort|Mooipan|Olie Rivier|Pelindaba|Plaatjiesdam|Plooysburg|Poljaspoort|Rietkloof|Rooidam|Rooikoppies|Schmidtsdrif|Seekoeibaardsnek|Smits Kraal|Soutputs|Subridge|Veepos (1)|Veepos (2)|Volop|Zirkie"],
  ["siyathemba", "Bonfoi|Boorwater|Bucklegraf|Copperton|De Hoek|Deelpan|Draghoender|Driehoek|Eierdopput|Eirdopput|Elim|Eureka|Geelbeksdam (1)|Geelbeksdam (2)|Geelbospan|Glen Allen|Grasbult|Graspan|Grassmoor|Groendal|Happy Valley|Helpmekaar|Irene|Kameelboom|Kielder (1)|Kielder (2)|Klein Gelukpan (1)|Klein Gelukpan (2)|Koegasbrug|Louretha|Lovedale|Merwelaagte|Middel|Middel Koegas|Middelfourieskolk|Mountain View|Nuwevlei|Platsambok|Poortjie|Ridgewater|Rooipan|Rosedale|Saalspan|Salsola|Seekoebaard Annex|Seekoebaard Number Two|Spesbona|Stillerus|Stilverwag|Swartkopspan|Uitkoms|Uitvlug|Waterval|Westerberg|Witfontein"],
  ["solplaatje", "Beaconsfield|Cassandra|Colville|De Beers Farm|El Toro Park|Hadison Park|Homevale|Kalkdam|Kenilworth|Koppies Dam|Moghul Park|Mon Repos|New Park|Pescodia|Redirile|Remount Camp|Reservoir|Rhodesdene|Riverton|Riviera|Ronald’s Vlei|Rooipan|Soul City|West End"],
  ["thembelihle", "Kraankuil|Orania"],
  ["tsantsabane", "Aucampsrus|Bloubospan|Boitshoko|Bojelakgomo|Bulkrans|Dedeben|Doornbank|Faans Grove|Glosam|Hoogland|Kalaharigrens|Kameelhoek|Krugersdam|Lohatlha|Lupanie|Malherbe|Mancorp Mine|Maremane|Matlakeng|Meruche|Mokala|Nokanna|Ongedad|Pieserton House|Rietfontein|Rusten|Skeerwater|Swartkoppies|Uithou|Ulyate|Van der Spuy|Vergenoeg|Whyenbah|Winton"],
  ["ubuntu", "Deelfontein|Hex River|Hutchinson|Meltonwold|Merriman|Richmond"],
  ["umsobomvu", "Kuyasa|Norvalspont|Noupoort|Teebus"]
];

/* Total population, Statistics South Africa, Census 2022: Provinces at a glance (Report 03-01-43, revised edition).
   mogalecity (438 216) and phokwane (80 482) follow the Census 2022 Municipal fact sheet (Report 03-01-82), corrected 6 Oct 2026 after fact-check. */
window.SA_POP22={jhb:4803262,kwasani:128565,cpt:4772846,tsh:4040315,eku:4066691,eth:4239901,nmb:1190496,buf:975255,man:811431,matzikama:69043,cederberg:55108,bergrivier:70276,saldanha:154635,swartland:148331,witzenberg:103765,drakenstein:276800,stellenbosch:175411,breedevallei:212682,langeberg:94045,theewaters:139563,overstrand:132495,capeagulhas:40274,swellendam:47114,kannaland:31986,hessequa:71918,mosselbay:140075,george:294929,oudtshoorn:138257,bitou:65240,knysna:96055,laingsburg:11366,prinsealbert:17836,beaufortwest:72972,drbeyers:101001,bluecrane:49883,makana:97815,ndlambe:87797,sundaysriver:53256,kouga:107014,koukamma:36487,mbhashe:240020,mnquma:232993,greatkei:35990,amahlathi:115703,ngqushwa:68300,raymondmhlaba:178594,inxuba:77578,intsikayethu:128101,emalahleniec:128873,engcobo:132799,sakhisizwe:63981,emgijima:297055,elundini:141762,senqu:147073,waltersisulu:104213,ingquza:354573,portstjohns:179325,nyandeni:304856,mhlontlo:186391,ksd:476558,matatiele:225562,umzimvubu:214477,winniemandela:350000,ntabankulu:146423,joemorolong:125420,gasegonyana:117454,gamagara:29580,richtersveld:24235,namakhoi:67089,kamiesberg:15130,hantam:22281,karoohoogland:11691,khaima:8510,ubuntu:15836,umsobomvu:29555,emthanjeni:46587,kareeberg:10961,renosterberg:10843,thembelihle:22542,siyathemba:27102,siyancuma:53165,kaigarib:85104,kheis:21954,tsantsabane:30969,kgatelopele:19854,dawidkruiper:125744,solplaatje:270078,dikgatlong:56967,magareng:26816,phokwane:80482,letsemeng:43101,kopanong:51832,mohokare:36968,masilonyana:63800,tokologo:29455,tswelopele:56896,matjhabeng:439034,nala:90561,setsoto:127918,dihlabeng:130434,nketoana:66488,maluti:398459,phumelela:52224,mantsopa:55897,moqhaka:155410,ngwathe:134962,metsimaholo:158391,mafube:61150,umdoni:156443,umzumbe:139045,umuziwabantu:115780,raynkonyeni:362134,umshwathi:118478,umngeni:105069,mpofana:33382,impendle:36648,msunduzi:817725,mkhambathini:61660,richmondkzn:62754,okhahlamba:143132,inkosilang:230924,alfredduma:415036,endumeni:100085,nquthu:201133,msinga:206001,umvoti:142042,newcastle:507710,emadlangeni:36948,dannhauser:142750,edumbe:96735,uphongolo:151541,abaqulusi:247263,nongoma:225278,ulundi:221977,umhlabuyalingana:191660,jozini:199153,mtubatuba:215869,bigfive:131755,mfolozi:159668,umhlathuze:412075,umlalazi:241416,mthonjaneni:99289,nkandla:108896,mandeni:180939,kwadukuza:324912,ndwedwe:165826,maphumulo:110983,kokstad:81676,ubuhlebezwe:133032,umzimkhulu:220620,moretele:219120,madibeng:522566,rustenburg:562315,kgetlengrivier:54759,moseskotane:265668,ratlou:128766,tswaing:128672,mahikeng:354504,ditsobotla:164176,ramotshere:161605,naledi:63755,mamusa:70483,greatertaung:202009,lekwateemane:59815,kagisanomolopo:112130,matlosana:431231,maquassi:90302,jbmarks:212670,emfuleni:945650,midvaal:112254,lesedi:132783,mogalecity:438216,merafong:225476,randwest:334773,albertluthuli:247664,msukaligwa:199314,mkhondo:255411,pixleymp:115304,lekwa:119669,dipaleseng:35980,govanmbeki:310117,victorkhanye:106149,emalahleni:434522,stevet:242031,emakhazeni:50165,thembisile:431248,jsmoroka:324855,thabachweu:118474,nkomazi:591928,bushbuckridge:750821,mbombela:809674,giyani:316841,greaterletaba:261038,tzaneen:478254,baphalaborwa:188603,maruleng:128137,musina:130899,thulamela:575929,makhado:502452,collinschabane:443798,blouberg:192109,molemole:127130,polokwane:843459,lepellenkumpi:284404,thabazimbi:65047,lephalale:125198,belabela:64306,mogalakwena:378198,modimollemookgo:130113,ephraimmogale:132468,eliasmotsoaledi:288049,makhuduthamaga:340328,fetakgomo:575960};

/* Unauthorised (u), irregular (i) and fruitless & wasteful (f) expenditure in rand, 2020/21 to 2024/25,
   and water / electricity losses (per cent, 2024/25). Source: AGSA MFMA 2024-25, "Additional Information.xlsx".
   Loss codes: na not a service provider · nd not disclosed · pnd percentage not disclosed · nf audit not finalised.
   wq / eq: 1 = the disclosure was qualified in the auditor's report. Districts sit under their dc_ keys. */
window.MF_UIFW = {
  years: ['2020/21', '2021/22', '2022/23', '2023/24', '2024/25'],
  data: {
    buf: {u: [0, 163700000, 0, 403500000, 646820000], i: [2690000000, 9220000000, 10930000000, 10560000000, 11630000000], f: [10730000, 10730000, 10730000, 981826, 6600000], water: 41.4, elec: 32.2},
    nmb: {u: [849460000, 8900000, 74170000, 1450000000, 3100000000], i: [19120000000, 20250000000, 20280000000, 22230000000, 24280000000], f: [668380000, 676210000, 722350000, 705310000, 710030000], water: 52.7, elec: 26.8},
    drbeyers: {u: [455880000, 516870000, 622640000, 203800000, 193470000], i: [217890000, 261070000, 465060000, 168820000, 47070000], f: [42450000, 63610000, 111930000, 128630000, 40830000], water: 51.5, elec: 12.2},
    bluecrane: {u: [0, 0, 0, 12260000, 10190000], i: [8050000, 8830000, 8830000, 11430000, 48140000], f: [6755, 42909, 344909, 16470000, 19760000], water: 30, elec: 30},
    makana: {u: [677600000, 779270000, 779270000, 558950000, 236710000], i: [323910000, 370140000, 407110000, 359220000, 316030000], f: [5510000, 7830000, 4710000, 20830000, 11390000], water: 'pnd', elec: 'pnd'},
    ndlambe: {u: [103650000, 112430000, 124270000, 82420000, 92530000], i: [633170000, 301840000, 235200000, 102020000, 53290000], f: [79519, 72511, 727190, 666807, 675081], water: 30.5, elec: 9.2},
    sundaysriver: {u: [231130000, 255140000, 454690000, 410630000, 410630000], i: [288840000, 332260000, 519490000, 689110000, 404190000], f: [13120000, 16430000, 18070000, 23920000, 20930000], water: 58, elec: 29, wq: 1, eq: 1},
    kouga: {u: [0, 0, 92830000, 0, 34760000], i: [1340000, 382748, 382748, 0, 0], f: [37528, 41005, 111999, 0, 0], water: 36, elec: 14.2},
    koukamma: {u: [10700000, 38240000, 83900000, 90000000, 137540000], i: [3110000, 60510000, 100190000, 111380000, 93500000], f: [58569, 449965, 825265, 1770000, 2540000], water: 83.2, elec: 1},
    dc_sarahbaartmandm: {u: [0, 0, 0, 0, 0], i: [1770000, 1000000, 1480000, 12370000, 1050000], f: [21200, 22764, 107718, 119418, 123700], water: 'na', elec: 'na'},
    mbhashe: {u: [0, 0, 0, 0, 0], i: [21140000, 0, 350724, 350724, 21970000], f: [419827, 11000000, 11000000, 10730000, 10890000], water: 'na', elec: 'na'},
    mnquma: {u: [0, 0, 0, 0, 0], i: [0, 0, 0, 648877, 0], f: [0, 0, 0, 0, 0], water: 'na', elec: 'na'},
    greatkei: {u: [58990000, 58990000, 0, 0, 0], i: [15700000, 16390000, 0, 0, 936327], f: [2350000, 2880000, 0, 0, 0], water: 'na', elec: 'na'},
    amahlathi: {u: [272800000, 288100000, 324320000, 161900000, 181030000], i: [112200000, 114930000, 115740000, 138500000, 38070000], f: [15360000, 12020000, 7330000, 10470000, 7270000], water: 'na', elec: 20},
    ngqushwa: {u: [28830000, 0, 0, 0, 3550000], i: [105710000, 81720000, 84660000, 5360000, 79032], f: [549114, 12640000, 13040000, 13640000, 1540000], water: 'na', elec: 'na'},
    raymondmhlaba: {u: [234110000, 3190000, 0, 0, 0], i: [276110000, 10430000, 13390000, 21910000, 84480000], f: [102580000, 5750000, 12340000, 344286, 13160000], water: 'na', elec: 22},
    dc_amatholedm: {u: [85140000, 69440000, 91660000, 351930000, 234030000], i: [39230000, 47650000, 252970000, 817190000, 661330000], f: [6960000, 61390000, 83090000, 110440000, 107310000], water: 34, elec: 'na'},
    inxuba: {u: [387590000, 528550000, 633040000, 648450000, 712820000], i: [370790000, 436620000, 472660000, 458130000, 428110000], f: [54750000, 73700000, 114250000, 114870000, 136370000], water: 'na', elec: 22.9},
    intsikayethu: {u: [5850000, 35250000, 10000000, 28860000, 91560000], i: [45210000, 46600000, 69840000, 91270000, 130260000], f: [16720000, 19260000, 39360000, 39370000, 39400000], water: 'na', elec: 'na'},
    emalahleniec: {u: [10370000, 47720000, 58200000, 85820000, 215970000], i: [45053, 27940000, 29410000, 45660000, 109490000], f: [105389, 1170000, 2030000, 2070000, 9330000], water: 'na', elec: 25.6},
    engcobo: {u: [0, 0, 0, 0, 0], i: [12260000, 117320000, 12260000, 1230000, 4510000], f: [0, 0, 8540000, 1360000, 699979], water: 'na', elec: 'na'},
    sakhisizwe: {u: [67780000, 76910000, 101470000, 122760000, 92990000], i: [98220000, 108360000, 125880000, 105050000, 91260000], f: [3160000, 3410000, 4400000, 5460000, 156748], water: 'na', elec: 11},
    emgijima: {u: [20380000, 427020000, 914950000, 381590000, 485790000], i: [54540000, 172180000, 508560000, 217270000, 197360000], f: [122460000, 169740000, 220410000, 131750000, 88800000], water: 'na', elec: 53},
    dc_chrishanidm: {u: [1010000000, 421860000, 346830000, 2750000, 766990000], i: [4930000, 4600000, 87370000, 2420000, 0], f: [5180000, 3440000, 86693, 441606, 348460], water: 30, elec: 'na', wq: 1},
    elundini: {u: [0, 86325, 86325, 0, 0], i: [0, 118556, 0, 0, 22440000], f: [102578, 102578, 103740, 103740, 27070], water: 'na', elec: 24},
    senqu: {u: [0, 0, 0, 2050000, 2050000], i: [22410000, 22530000, 59550000, 65330000, 1210000], f: [134906, 134906, 2020000, 2080000, 3300000], water: 'na', elec: 23.2},
    waltersisulu: {u: [130880000, 156720000, 94280000, 173350000, 267120000], i: [65560000, 83830000, 6310000, 12240000, 128950000], f: [240932, 34150000, 35850000, 8450000, 27560000], water: 'na', elec: 16},
    dc_joegqabidm: {u: [109470000, 164753, 24180000, 164753, 79100000], i: [0, 0, 0, 0, 0], f: [625130, 625130, 639488, 625130, 625130], water: 40.4, elec: 'na'},
    ingquza: {u: [0, 0, 0, 0, 0], i: [3500000, 11850000, 11760000, 20620000, 19160000], f: [0, 17290, 17290, 64067, 1460000], water: 'na', elec: 'na'},
    portstjohns: {u: [195830000, 245360000, 265580000, 182920000, 210530000], i: [245290000, 256100000, 256010000, 50090000, 59640000], f: [20220000, 21020000, 21800000, 5310000, 5400000], water: 'na', elec: 'na'},
    nyandeni: {u: [0, 0, 0, 0, 0], i: [0, 0, 17300000, 185810000, 168440000], f: [0, 0, 278088, 4980000, 8620000], water: 'na', elec: 'na'},
    mhlontlo: {u: [56860000, 68270000, 10550000, 12480000, 0], i: [105100000, 58680000, 28950000, 42270000, 46110000], f: [1150000, 1160000, 17842, 18880000, 18880000], water: 'na', elec: 'na'},
    ksd: {u: [107610000, 165520000, 233680000, 75260000, 29040000], i: [152400000, 345740000, 16130000, 34060000, 50700000], f: [20770000, 4600000, 8240000, 6950000, 12110000], water: 'na', elec: 13.6},
    dc_ortambodm: {u: [6340000, 38190000, 104400000, 267350000, 572720000], i: [1680000000, 1800000000, 997690000, 653060000, 463940000], f: [35630000, 56300000, 69580000, 50200000, 43870000], water: 13, elec: 'na'},
    matatiele: {u: [69600000, 93380000, 0, 85274, 0], i: [15130000, 10280000, 0, 0, 0], f: [900880, 948569, 0, 217842, 4523], water: 'na', elec: 7.9},
    umzimvubu: {u: [0, 0, 11030000, 0, 0], i: [0, 0, 26840000, 5530000, 0], f: [871710, 864042, 841038, 839721, 6700000], water: 'na', elec: 'na'},
    winniemandela: {u: [0, 0, 0, 0, 0], i: [0, 15795, 1840000, 167520000, 273651], f: [21912, 355000, 20400, 20400, 2200000], water: 'na', elec: 14},
    ntabankulu: {u: [0, 0, 0, 0, 0], i: [28710000, 17140000, 7910000, 0, 0], f: [23190000, 25170000, 25500000, 0, 0], water: 'na', elec: 'na'},
    dc_alfrednzodm: {u: [0, 0, 0, 0, 0], i: [435180000, 320810000, 214280000, 68340000, 27070000], f: [17840000, 18250000, 18250000, 1180000, 44430000], water: 31, elec: 'na'},
    man: {u: [4000000000, 5260000000, 6450000000, 7800000000, 8930000000], i: [2740000000, 2930000000, 3120000000, 3400000000, 3660000000], f: [101370000, 185300000, 325990000, 448510000, 283840000], water: 48, elec: 'nd'},
    letsemeng: {u: [694870000, 901160000, 1130000000, 1250000000, 1450000000], i: [504840000, 504840000, 587050000, 628080000, 635240000], f: [20310000, 30150000, 44280000, 53720000, 92450000], water: 79, elec: 22.3},
    kopanong: {u: [217650000, 678630000, 804940000, 709070000, 889860000], i: [323510000, 323910000, 334740000, 332250000, 338970000], f: [339850000, 410570000, 486270000, 581560000, 188110000], water: 28.5, elec: 24.7, eq: 1},
    mohokare: {u: [492840000, 322310000, 369490000, 369490000, 548660000], i: [243320000, 250520000, 255210000, 261970000, 258850000], f: [55660000, 27970000, 40700000, 46260000, 44280000], water: 22.5, elec: 40.4, wq: 1, eq: 1},
    dc_xhariepdm: {u: [24740000, 30850000, 35070000, 41410000, 34470000], i: [47830000, 51470000, 52760000, 56930000, 57050000], f: [1940000, 2120000, 2390000, 2320000, 1560000], water: 'na', elec: 'na'},
    masilonyana: {u: [1120000000, 1120000000, 1120000000, 0, 48670000], i: [226030000, 226030000, 1090000000, 112400000, 159840000], f: [17340000, 17400000, 17460000, 39760000, 46770000], water: 78, elec: 40},
    tokologo: {u: [671940000, 687910000, 687910000, 694080000, 21030000], i: [335270000, 438540000, 450380000, 265570000, 279650000], f: [38500000, 51820000, 68760000, 108410000, 145540000], water: 'nd', elec: 'nd'},
    tswelopele: {u: [13000000, 31770000, 9250000, 115750000, 85290000], i: [60270000, 77320000, 89350000, 115590000, 86880000], f: [543847, 2190000, 4730000, 4270000, 6350000], water: 14.6, elec: 9.1},
    matjhabeng: {u: [3360000000, 2280000000, 2490000000, 2470000000, 930340000], i: [1390000000, 1650000000, 1830000000, 1950000000, 1000000000], f: [519970000, 311570000, 339840000, 239020000, 0], water: 64, elec: 26, wq: 1, eq: 1},
    nala: {u: [289790000, 406470000, 508280000, 508280000, 867200000], i: [182820000, 189390000, 201230000, 271600000, 285860000], f: [40670000, 65230000, 113100000, 145350000, 231930000], water: 'nf', elec: 'nf'},
    dc_lejweleputswadm: {u: [2910000, 2910000, 2910000, 3720000, 3720000], i: [10950000, 6050000, 24740000, 48600000, 24630000], f: [0, 0, 0, 207336, 252579], water: 'na', elec: 'na'},
    setsoto: {u: [446920000, 623530000, 774010000, 852240000, 187840000], i: [282340000, 335950000, 355220000, 222880000, 207030000], f: [2740000, 4270000, 3280000, 1720000, 1720000], water: 24, elec: 8},
    dihlabeng: {u: [651450000, 927560000, 1260000000, 1570000000, 240100000], i: [362970000, 619800000, 791840000, 999460000, 554440000], f: [139100000, 180210000, 256020000, 247890000, 55550000], water: 38.6, elec: 20.8},
    nketoana: {u: [824840000, 810660000, 980790000, 1010000000, 817140000], i: [326120000, 426880000, 479930000, 548990000, 667080000], f: [126950000, 149260000, 196920000, 129300000, 163380000], water: 11, elec: 'nd', wq: 1},
    maluti: {u: [3490000000, 3860000000, 3860000000, 3960000000, 475420000], i: [839080000, 950600000, 1080000000, 1160000000, 1410000000], f: [2000000000, 2070000000, 2440000000, 2700000000, 2610000000], water: 'nf', elec: 'nf'},
    phumelela: {u: [837900000, 657280000, 729420000, 852050000, 660260000], i: [212910000, 185570000, 196220000, 198860000, 173960000], f: [40550000, 35220000, 50800000, 42340000, 37560000], water: 75, elec: 57},
    mantsopa: {u: [182820000, 308100000, 343310000, 12130000, 13890000], i: [9310000, 14640000, 19660000, 7410000, 26770000], f: [9380000, 18870000, 35950000, 31540000, 42400000], water: 36, elec: 35},
    dc_thabomofutsanyanadm: {u: [4270000, 1330000, 2830000, 3920000, 4460000], i: [33510000, 34490000, 25910000, 24900000, 21810000], f: [51959, 3626, 48278, 54455, 3230000], water: 'na', elec: 'na'},
    moqhaka: {u: [347620000, 451770000, 339490000, 462090000, 425790000], i: [771350000, 891840000, 142240000, 226140000, 147330000], f: [28840000, 58630000, 61000000, 66510000, 184660000], water: 23, elec: 32.6},
    ngwathe: {u: [99120000, 350560000, 545450000, 586720000, 143160000], i: [267190000, 301630000, 332640000, 392320000, 400670000], f: [30520000, 86870000, 141560000, 105630000, 105040000], water: 27, elec: 61},
    metsimaholo: {u: [113320000, 141420000, 141420000, 225370000, 254850000], i: [480720000, 649230000, 756550000, 904270000, 917750000], f: [38980000, 40030000, 45220000, 49720000, 53160000], water: 31, elec: 25},
    mafube: {u: [1080000000, 1180000000, 1550000000, 2470000000, 2820000000], i: [206620000, 279780000, 305780000, 335820000, 362310000], f: [157560000, 208530000, 270840000, 353570000, 416720000], water: 71, elec: 'nd'},
    dc_feziledabidm: {u: [46300000, 56200000, 61370000, 67940000, 92030000], i: [29620000, 43310000, 83100000, 89170000, 103680000], f: [86752, 4120000, 4120000, 5820000, 5800000], water: 'na', elec: 'na'},
    eku: {u: [0, 0, 0, 397110000, 397110000], i: [1540000000, 1140000000, 929310000, 1000000000, 1080000000], f: [146490000, 135560000, 68770000, 68770000, 68770000], water: 25.4, elec: 15.5},
    jhb: {u: [3850000000, 4250000000, 5470000000, 4400000000, 350150000], i: [5600000000, 6770000000, 7450000000, 7920000000, 7400000000], f: [145570000, 490030000, 436160000, 81980000, 112630000], water: 44.8, elec: 30},
    tsh: {u: [3610000000, 4960000000, 423280000, 2150000000, 3440000000], i: [9200000000, 10460000000, 13030000000, 16890000000, 18010000000], f: [627070000, 1470000000, 2820000000, 3080000000, 1390000000], water: 39, elec: 21},
    emfuleni: {u: [4800000000, 7510000000, 9730000000, 3720000000, 5140000000], i: [651150000, 883460000, 975780000, 1030000000, 1050000000], f: [902700000, 1730000000, 2330000000, 2500000000, 831160000], water: 57.4, elec: 25},
    midvaal: {u: [0, 0, 0, 0, 0], i: [0, 513521, 3100000, 4040000, 4510000], f: [1320000, 1320000, 1320000, 1410000, 6530000], water: 34.8, elec: 7.3},
    lesedi: {u: [234710000, 274200000, 462180000, 471200000, 67950000], i: [293710000, 301190000, 307690000, 131140000, 124850000], f: [14860000, 15880000, 30040000, 50370000, 11660000], water: 37, elec: 35},
    dc_sedibengdm: {u: [23490000, 26150000, 30700000, 49000000, 25520000], i: [53260000, 95570000, 116350000, 132620000, 84720000], f: [49629, 527910, 527910, 527910, 527910], water: 'na', elec: 'na'},
    mogalecity: {u: [166300000, 232520000, 232520000, 0, 0], i: [623240000, 719680000, 1190000000, 254360000, 488700000], f: [50810000, 56710000, 98230000, 0, 0], water: 19.3, elec: 14.1},
    merafong: {u: [0, 0, 0, 1500000000, 2570000000], i: [146250000, 195380000, 475750000, 676860000, 491110000], f: [94370000, 168540000, 306980000, 464760000, 387710000], water: 41, elec: 56, wq: 1, eq: 1},
    randwest: {u: [1420000000, 2020000000, 1090000000, 1270000000, 608060000], i: [573740000, 680660000, 730430000, 921950000, 134190000], f: [210510000, 295410000, 368520000, 288800000, 146420000], water: 58, elec: 41},
    dc_westranddm: {u: [69460000, 86510000, 89960000, 45810000, 31650000], i: [54140000, 71100000, 71100000, 2710000, 0], f: [4080000, 2390000, 2980000, 2450000, 2450000], water: 'na', elec: 'na'},
    eth: {u: [0, 0, 0, 0, 0], i: [3870000000, 4810000000, 3590000000, 1260000000, 3250000000], f: [48240000, 48320000, 14730000, 17220000, 81460000], water: 58.7, elec: 11.2},
    umdoni: {u: [120620000, 63020000, 27870000, 34450000, 26420000], i: [428380000, 179590000, 252754, 16610000, 320270000], f: [15950000, 16010000, 18260000, 18370000, 18640000], water: 'na', elec: 'na'},
    umzumbe: {u: [2380000, 2380000, 2380000, 2380000, 147450000], i: [0, 0, 16460000, 17060000, 188750000], f: [0, 0, 0, 0, 85747], water: 'na', elec: 'na'},
    umuziwabantu: {u: [9000, 9000, 9000, 0, 0], i: [0, 13250000, 1190000, 0, 11460000], f: [135000, 239425, 172305, 252787, 0], water: 'na', elec: 12},
    raynkonyeni: {u: [0, 0, 0, 0, 188230000], i: [55520000, 39190000, 423220000, 85280000, 41040000], f: [32309, 35092, 31342, 31342, 35097], water: 'na', elec: 11},
    dc_ugudm: {u: [327000000, 0, 0, 0, 0], i: [627660000, 514020000, 131920000, 79950000, 0], f: [9850000, 0, 0, 0, 0], water: 19.8, elec: 'na'},
    umshwathi: {u: [77090000, 9160000, 0, 0, 3030000], i: [393027, 241427, 0, 0, 2590000], f: [0, 0, 0, 0, 0], water: 'na', elec: 'na'},
    umngeni: {u: [268660000, 283020000, 145940000, 0, 3280000], i: [51700000, 68160000, 71480000, 30920000, 32860000], f: [4590000, 4620000, 4630000, 4327, 2759], water: 'na', elec: 34},
    mpofana: {u: [209280000, 271650000, 347690000, 333490000, 380740000], i: [84590000, 122740000, 96660000, 137810000, 107670000], f: [4680000, 871355, 871355, 12760000, 4830000], water: 'na', elec: 58},
    impendle: {u: [15960000, 29570000, 10300000, 51290000, 105070000], i: [26050000, 8360000, 6070000, 24000000, 36750000], f: [2456, 4510, 0, 132453, 133355], water: 'na', elec: 'na'},
    msunduzi: {u: [2260000000, 1670000000, 0, 0, 0], i: [492250000, 672390000, 708710000, 541700000, 522870000], f: [46150000, 17720000, 170900000, 214510000, 248620000], water: 20.3, elec: 23.3},
    mkhambathini: {u: [4700000, 9690000, 0, 0, 0], i: [4500000, 6160000, 1510000, 168600, 0], f: [3210000, 2157, 2567, 1701, 17910], water: 'na', elec: 'na'},
    richmondkzn: {u: [29020000, 17640000, 0, 0, 0], i: [3700000, 227688, 0, 0, 0], f: [9570000, 19014, 0, 0, 0], water: 'na', elec: 'na'},
    dc_umgungundlovudm: {u: [86580000, 65630000, 270840000, 186540000, 84520000], i: [32730000, 547125, 589768, 12400000, 50480000], f: [0, 535, 20080000, 293358, 0], water: 46, elec: 'na'},
    okhahlamba: {u: [0, 1880000, 8660000, 16920000, 81360], i: [432216, 845482, 39440000, 38840000, 5700000], f: [778169, 777606, 784462, 2720000, 777670], water: 'na', elec: 'na'},
    inkosilang: {u: [106350000, 205920000, 53530000, 72210000, 193630000], i: [239260000, 79140000, 18090000, 76350000, 17730000], f: [37440000, 1170000, 1500000, 42650000, 26200000], water: 'na', elec: 12},
    alfredduma: {u: [2030000, 20100000, 7200000, 11860000, 118240000], i: [21050000, 6770000, 1490000, 2310000, 0], f: [8440000, 1480000, 899250, 13162, 587866], water: 'na', elec: 17},
    dc_uthukeladm: {u: [121150000, 137890000, 293170000, 256330000, 601210000], i: [142480000, 389540000, 772630000, 385200000, 643430000], f: [13710000, 14190000, 62710000, 56100000, 69370000], water: 65, elec: 'na', wq: 1},
    endumeni: {u: [39550000, 20710000, 76710000, 70460000, 99260000], i: [20460000, 23030000, 33630000, 21880000, 32950000], f: [1430000, 3930000, 12640000, 3890000, 5610000], water: 'na', elec: 46},
    nquthu: {u: [0, 24950000, 10590000, 7410000, 5670000], i: [447930000, 196110000, 142890000, 44240000, 2640000], f: [33678, 71843, 978, 0, 206163], water: 'na', elec: 21},
    msinga: {u: [2150000, 31990000, 6760000, 0, 0], i: [808266, 7540000, 19960000, 0, 0], f: [0, 141232, 0, 0, 0], water: 'na', elec: 'na'},
    umvoti: {u: [28100000, 0, 36880000, 36880000, 37450000], i: [34120000, 0, 42400, 854116, 0], f: [1840000, 100384, 112459, 112776, 0], water: 'na', elec: 21},
    dc_umzinyathidm: {u: [221700000, 875280000, 1140000000, 323100000, 247750000], i: [1690000000, 1810000000, 1690000000, 1400000000, 644510000], f: [5050000, 31670000, 35000000, 42450000, 76220000], water: 69, elec: 'na'},
    newcastle: {u: [967780000, 220190000, 372850000, 344410000, 467790000], i: [498350000, 528120000, 534690000, 460310000, 341210000], f: [59400000, 20730000, 17120000, 27420000, 98990000], water: 37, elec: 11},
    emadlangeni: {u: [25840000, 38640000, 67220000, 83140000, 48620000], i: [81590000, 95360000, 140450000, 166700000, 199250000], f: [164351, 1110000, 1480000, 1650000, 582277], water: 'na', elec: 48},
    dannhauser: {u: [0, 37740000, 64650000, 93480000, 76880000], i: [21640000, 98100000, 4200000, 30490000, 40010000], f: [0, 400000, 34376, 115985, 84894], water: 'na', elec: 'na'},
    dc_amajubadm: {u: [677160000, 782100000, 788250000, 138100000, 184490000], i: [250540000, 285930000, 116910000, 64360000, 45550000], f: [5030000, 2410000, 5480000, 8810000, 11910000], water: 61, elec: 'na'},
    edumbe: {u: [99950000, 122650000, 152460000, 128930000, 89930000], i: [57150000, 28600000, 54320000, 2460000, 16900000], f: [8230000, 7880000, 7950000, 10240000, 6320000], water: 'na', elec: 32},
    uphongolo: {u: [34220000, 82890000, 32450000, 137760000, 100680000], i: [43850000, 68460000, 15200000, 14760000, 14610000], f: [621650, 654742, 7960000, 4530000, 6490000], water: 'na', elec: 11},
    abaqulusi: {u: [334460000, 486580000, 250140000, 106880000, 222790000], i: [251210000, 309450000, 298870000, 232490000, 265300000], f: [7400000, 24660000, 3630000, 2750000, 15350000], water: 58, elec: 23},
    nongoma: {u: [0, 0, 61640000, 5860000, 184940000], i: [72600, 0, 0, 43830000, 151090000], f: [0, 0, 1300000, 0, 0], water: 'na', elec: 'na'},
    ulundi: {u: [0, 0, 1870000, 52920000, 0], i: [16160000, 1010000, 42770000, 4010000, 8870000], f: [0, 0, 9830000, 0, 1920000], water: 'na', elec: 48},
    dc_zululanddm: {u: [127660000, 127450000, 233980000, 233750000, 243300000], i: [17920000, 58990000, 89230000, 23550000, 152950000], f: [437053, 303721, 1050000, 3250000, 52090000], water: 12, elec: 'na'},
    umhlabuyalingana: {u: [0, 0, 0, 0, 0], i: [3540000, 2540000, 12330000, 9360000, 13140000], f: [979402, 12700000, 344481, 0, 0], water: 'na', elec: 'na'},
    jozini: {u: [164470000, 521845, 21680000, 89350000, 128940000], i: [480300000, 579360000, 217280000, 140890000, 182590000], f: [13400000, 13400000, 13670000, 14860000, 21050000], water: 'na', elec: 'na'},
    mtubatuba: {u: [87010000, 46060000, 58250000, 80210000, 234030000], i: [232090000, 255990000, 235560000, 409890000, 361600000], f: [4330000, 5320000, 5420000, 6870000, 8880000], water: 'na', elec: 'na'},
    bigfive: {u: [224960000, 230030000, 230030000, 2650000, 0], i: [172160000, 172970000, 172970000, 27500000, 0], f: [3380000, 3720000, 3720000, 3720000, 3720000], water: 'na', elec: 'na'},
    dc_umkhanyakudedm: {u: [455160000, 503830000, 647320000, 819150000, 484450000], i: [3000000000, 4520000000, 4420000000, 1820000000, 1570000000], f: [90860000, 92400000, 93270000, 96470000, 96510000], water: 36.5, elec: 29.2, wq: 1, eq: 1},
    mfolozi: {u: [124980000, 148540000, 191520000, 230550000, 0], i: [122900000, 131570000, 113880000, 185050000, 6220000], f: [1360000, 1940000, 2380000, 2380000, 1550000], water: 'na', elec: 'na'},
    umhlathuze: {u: [0, 0, 0, 0, 0], i: [180680000, 4360000, 4760000, 4760000, 0], f: [0, 0, 0, 0, 0], water: 62, elec: 7.4},
    umlalazi: {u: [0, 25540000, 13190000, 7550000, 0], i: [631704, 6480000, 0, 0, 0], f: [1275, 1610, 0, 0, 0], water: 'na', elec: 22},
    mthonjaneni: {u: [38840000, 59290000, 97280000, 144680000, 91520000], i: [86340000, 73080000, 110660000, 197400000, 58200000], f: [1590000, 1830000, 3500000, 5970000, 4630000], water: 'na', elec: 8.4},
    nkandla: {u: [0, 46680000, 55160000, 7410000, 9820000], i: [9400000, 20980000, 13050000, 558585, 558585], f: [151098, 508081, 1390000, 56109, 102252], water: 'na', elec: 72},
    dc_kingcetshwayodm: {u: [20030000, 0, 0, 0, 0], i: [7840000, 3700000, 0, 0, 0], f: [900042, 872779, 12578, 0, 0], water: 29, elec: 'na'},
    mandeni: {u: [0, 0, 6240000, 8670000, 14490000], i: [150000, 1620000, 1330000, 4890000, 2330000], f: [0, 613998, 660494, 0, 0], water: 'na', elec: 1},
    kwadukuza: {u: [17080000, 27010000, 59210000, 116440000, 22130000], i: [222380000, 98290000, 65470000, 3290000, 106940000], f: [3720000, 0, 1860000, 1860000, 71609], water: 'na', elec: 26.7},
    ndwedwe: {u: [7270000, 7270000, 27830000, 36750000, 12590000], i: [60760000, 56680000, 59790000, 10650000, 2050000], f: [4900000, 4900000, 4910000, 1210000, 10080000], water: 'na', elec: 'na'},
    maphumulo: {u: [0, 0, 43460000, 0, 0], i: [40930000, 41520000, 29480000, 18080000, 0], f: [3470000, 1600000, 1630000, 4250000, 0], water: 'na', elec: 'na'},
    dc_ilembedm: {u: [14750000, 14750000, 14750000, 14750000, 0], i: [101410000, 149530000, 155880000, 149730000, 38610000], f: [4380000, 11750000, 11750000, 0, 0], water: 41, elec: 'na'},
    kokstad: {u: [0, 0, 0, 34150000, 61840000], i: [71380000, 61790000, 71700000, 71550000, 65020000], f: [459768, 832200, 832200, 2160000, 2160000], water: 'na', elec: 9},
    ubuhlebezwe: {u: [0, 0, 20040000, 7890000, 0], i: [21270000, 26140000, 3240000, 0, 1340000], f: [0, 1142, 7546, 219, 33857], water: 'na', elec: 'na'},
    umzimkhulu: {u: [0, 0, 0, 0, 0], i: [4780000, 3530000, 0, 0, 104010000], f: [0, 246769, 0, 0, 0], water: 'na', elec: 'na'},
    kwasani: {u: [0, 0, 0, 26620000, 0], i: [10000, 136348, 1140000, 103380, 0], f: [3450000, 5131, 2939, 4705, 3165], water: 'na', elec: 'na'},
    dc_harrygwaladm: {u: [0, 0, 9690000, 127980000, 34470000], i: [68560000, 553980000, 3500000, 0, 129290000], f: [8200000, 8220000, 8170000, 8170000, 8280000], water: 37, elec: 'na'},
    giyani: {u: [103260000, 49100000, 167970000, 0, 0], i: [11220000, 15920000, 30290000, 24190000, 7960000], f: [25039, 7240000, 7530000, 10380000, 14090000], water: 'na', elec: 'na'},
    greaterletaba: {u: [389960000, 471960000, 505080000, 176130000, 146970000], i: [233270000, 21520000, 20060000, 23980000, 2940000], f: [3350000, 3190000, 660503, 749452, 4390000], water: 'na', elec: 4},
    tzaneen: {u: [15080000, 108060000, 19890000, 0, 0], i: [110160000, 90120000, 187040000, 236440000, 42280000], f: [18850000, 26480000, 39870000, 44500000, 27570000], water: 'na', elec: 11},
    baphalaborwa: {u: [110100000, 61590000, 59930000, 84820000, 0], i: [304550000, 122370000, 34270000, 41100000, 29050000], f: [5230000, 509171, 128139, 7190000, 7190000], water: 'na', elec: 32.2},
    maruleng: {u: [39580000, 35140000, 39510000, 14100000, 59360000], i: [127700000, 207820000, 165530000, 38380000, 1840000], f: [3020000, 3820000, 3860000, 3580000, 3170000], water: 'na', elec: 'na'},
    dc_mopanidm: {u: [884770000, 1390000000, 1650000000, 1970000000, 1420000000], i: [1460000000, 1320000000, 1350000000, 1360000000, 1240000000], f: [402950000, 455840000, 472380000, 526160000, 181050000], water: 26, elec: 'na', wq: 1},
    musina: {u: [99280000, 118210000, 118210000, 126900000, 126900000], i: [194050000, 89550000, 122830000, 145410000, 185880000], f: [52620000, 52640000, 52640000, 54120000, 57630000], water: 'na', elec: 11.9},
    thulamela: {u: [0, 0, 0, 1000000, 152290000], i: [289909, 837730, 34290000, 8630000, 27730000], f: [2080000, 1180000, 3370000, 3230000, 3260000], water: 'na', elec: 'na'},
    makhado: {u: [0, 0, 0, 0, 58460000], i: [79528, 0, 636468, 1180000, 0], f: [199918, 207812, 426191, 1100000, 4310000], water: 'na', elec: 12},
    collinschabane: {u: [273060000, 141100000, 209370000, 210050000, 27710000], i: [15190000, 6900000, 4090000, 3150000, 3700000], f: [919019, 674812, 753978, 2480000, 915374], water: 'na', elec: 'na'},
    dc_vhembedm: {u: [1430000000, 577960000, 222590000, 0, 631130000], i: [140570000, 43750000, 37375, 0, 92060000], f: [8917, 84018, 2540000, 305780, 305780], water: 92, elec: 'na', wq: 1},
    blouberg: {u: [3350000, 7090000, 0, 0, 32360000], i: [33780000, 0, 4020000, 31880000, 35140000], f: [2492, 0, 0, 0, 0], water: 'na', elec: 16.9},
    molemole: {u: [0, 0, 0, 7490000, 366526], i: [2300000, 2480000, 2990000, 0, 238500], f: [28247, 0, 0, 0, 0], water: 'na', elec: 14},
    polokwane: {u: [1150000000, 1670000000, 1630000000, 273680000, 14570000], i: [551040000, 718300000, 268380000, 139570000, 36410000], f: [17708, 17130000, 17130000, 3930000, 32400000], water: 33, elec: 12.3},
    lepellenkumpi: {u: [277610000, 290760000, 294270000, 0, 322542], i: [391810000, 426030000, 79860000, 0, 26570000], f: [19220000, 9140000, 9180000, 9120000, 9140000], water: 'na', elec: 'na'},
    dc_capricorndm: {u: [0, 0, 0, 0, 0], i: [1388, 73276, 192420000, 5750000, 16090000], f: [663755, 1400000, 4780000, 773409, 1030000], water: 28.9, elec: 'na'},
    thabazimbi: {u: [554140000, 646040000, 654370000, 688030000, 796370000], i: [384490000, 392770000, 433340000, 456000000, 630900000], f: [133040000, 143450000, 157780000, 163870000, 183250000], water: 63, elec: 'nd'},
    lephalale: {u: [45350000, 5890000, 5890000, 42710000, 49400000], i: [376930000, 277940000, 59220000, 2470000, 2740000], f: [19620000, 21080000, 1460000, 1490000, 3860000], water: 42, elec: 11},
    belabela: {u: [115360000, 168310000, 35270000, 58370000, 128110000], i: [63050000, 138570000, 66420000, 13310000, 4280000], f: [9980000, 12140000, 4470000, 105752, 0], water: 47, elec: 19},
    mogalakwena: {u: [3510000000, 3870000000, 228160000, 0, 0], i: [2540000000, 2830000000, 336370000, 150360000, 39630000], f: [46130000, 55480000, 19130000, 14170000, 14170000], water: 17, elec: 16},
    modimollemookgo: {u: [374580000, 406240000, 539190000, 478800000, 1150000000], i: [32390000, 77770000, 155830000, 182940000, 26920000], f: [2800000, 18730000, 103300000, 147740000, 61360000], water: 40, elec: 16},
    dc_waterbergdm: {u: [0, 0, 0, 0, 0], i: [3500000, 0, 0, 0, 0], f: [0, 0, 0, 0, 0], water: 'na', elec: 'na'},
    ephraimmogale: {u: [0, 0, 0, 0, 0], i: [16840000, 56720000, 23820000, 5530000, 8620000], f: [3360000, 7220000, 20292, 807, 4980000], water: 'na', elec: 4.9},
    eliasmotsoaledi: {u: [159690000, 50770000, 48010000, 1120000, 0], i: [376960000, 386420000, 385540000, 165380000, 131370000], f: [6760000, 6540000, 6520000, 2970000, 4790000], water: 'na', elec: 11},
    makhuduthamaga: {u: [205190000, 4050000, 23010000, 30510000, 0], i: [187290000, 60370000, 65100, 0, 0], f: [571999, 64753, 64753, 64753, 5980000], water: 'na', elec: 'na'},
    fetakgomo: {u: [96540000, 36110000, 463420000, 275660000, 113250000], i: [248660000, 221880000, 181940000, 169540000, 150970000], f: [47960000, 9780000, 1360000, 1360000, 906177], water: 'na', elec: 'na'},
    dc_sekhukhunedm: {u: [410090000, 410590000, 410590000, 432320000, 575300000], i: [1200000000, 1280000000, 1380000000, 1470000000, 1350000000], f: [46570000, 56730000, 72430000, 73220000, 126050000], water: 39, elec: 'na'},
    albertluthuli: {u: [9860000, 0, 0, 0, 52510000], i: [226600000, 273240000, 2490000, 7440000, 0], f: [122284, 16634, 1925, 3420000, 4530000], water: 50.9, elec: 40.6},
    msukaligwa: {u: [276340000, 413260000, 648380000, 233340000, 490190000], i: [285530000, 359980000, 410950000, 24830000, 42710000], f: [89200000, 162400000, 220370000, 101810000, 207940000], water: 66, elec: 61},
    mkhondo: {u: [876210000, 970950000, 161110000, 260250000, 294390000], i: [118680000, 132070000, 51710000, 63910000, 47270000], f: [45950000, 76870000, 5180000, 91360000, 68840000], water: 36.9, elec: 48},
    pixleymp: {u: [0, 0, 0, 0, 0], i: [42210000, 48340000, 62060000, 75360000, 53330000], f: [29081, 2350000, 2100000, 2510000, 1280000], water: 32, elec: 15},
    lekwa: {u: [1340000000, 1490000000, 409420000, 354020000, 156230000], i: [502170000, 703560000, 178460000, 197860000, 1070000000], f: [461920000, 566360000, 414280000, 20870000, 168240000], water: 58, elec: 22},
    dipaleseng: {u: [243200000, 299420000, 559450000, 629530000, 65050000], i: [163980000, 239800000, 358090000, 239350000, 101680000], f: [22300000, 39960000, 46740000, 9680000, 40110000], water: 39, elec: 26},
    govanmbeki: {u: [815590000, 1600000000, 458660000, 1160000000, 449710000], i: [79610000, 180730000, 141290000, 157990000, 134700000], f: [85110000, 242110000, 327830000, 295680000, 250200000], water: 44, elec: 48},
    dc_gertsibandedm: {u: [0, 0, 0, 0, 0], i: [0, 0, 62860000, 508398, 0], f: [0, 0, 25620000, 0, 0], water: 'na', elec: 'na'},
    victorkhanye: {u: [189800000, 241720000, 62770000, 338440000, 156670000], i: [188320000, 357520000, 214190000, 176220000, 354680000], f: [60490000, 103510000, 130080000, 215220000, 89260000], water: 52, elec: 34},
    emalahleni: {u: [444730000, 909860000, 921200000, 1040000000, 1800000000], i: [618420000, 806220000, 812600000, 1270000000, 92240000], f: [0, 273780000, 807870000, 594070000, 271340000], water: 47, elec: 30},
    stevet: {u: [107010000, 0, 0, 95380000, 215250000], i: [488900, 0, 289910000, 332900000, 340760000], f: [39773, 0, 0, 4640000, 4970000], water: 26.8, elec: 16.9},
    emakhazeni: {u: [7490000, 4040000, 532720000, 157590000, 151260000], i: [160390000, 210290000, 35110000, 35440000, 35440000], f: [13090000, 18140000, 2540000, 2440000, 5250000], water: 73.3, elec: 45.5},
    thembisile: {u: [0, 0, 0, 58010000, 0], i: [68570000, 111310000, 19550000, 17080000, 27600], f: [11480000, 4590000, 4420000, 4420000, 7690000], water: 12, elec: 'na'},
    jsmoroka: {u: [91430000, 96600000, 109440000, 129520000, 0], i: [858640000, 930570000, 1160000000, 1360000000, 248790000], f: [4780000, 4870000, 5060000, 4140000, 3890000], water: 10, elec: 'na'},
    dc_nkangaladm: {u: [0, 0, 0, 0, 0], i: [3670000, 266881, 266881, 266881, 266881], f: [0, 8344, 261669, 277658, 0], water: 'na', elec: 'na'},
    thabachweu: {u: [258910000, 386080000, 554970000, 554970000, 554970000], i: [536540000, 625420000, 619930000, 666570000, 667940000], f: [60200000, 101280000, 182930000, 37360000, 87040000], water: 48, elec: 50},
    nkomazi: {u: [67430000, 365300000, 275010000, 472690000, 286940000], i: [301060000, 300510000, 246460000, 54900000, 24020000], f: [1880000, 1610000, 1240000, 4110000, 20710000], water: 9, elec: 7},
    bushbuckridge: {u: [346750000, 0, 9760000, 0, 0], i: [1700000000, 442810000, 38580000, 37980000, 51730000], f: [3100000, 4540000, 3350000, 9660000, 16790000], water: 70, elec: 'na'},
    mbombela: {u: [827600000, 1370000000, 2050000000, 2770000000, 2320000000], i: [562760000, 715420000, 920160000, 991380000, 882860000], f: [173079, 83580000, 218210000, 226780000, 368210000], water: 37.6, elec: 30.4},
    dc_ehlanzenidm: {u: [0, 0, 0, 0, 0], i: [60750, 692694, 0, 0, 0], f: [22400, 25052, 1531, 0, 0], water: 'na', elec: 'na'},
    moretele: {u: [678430000, 709530000, 709530000, 805770000, 696890000], i: [881260000, 927370000, 955330000, 965450000, 622880000], f: [16330000, 17100000, 18910000, 20160000, 20930000], water: 28, elec: 'na'},
    madibeng: {u: [2460000000, 2460000000, 4610000000, 4710000000, 4700000000], i: [2620000000, 3280000000, 2500000000, 2710000000, 3750000000], f: [87870000, 118390000, 181550000, 199370000, 316820000], water: 24, elec: 48},
    rustenburg: {u: [555920000, 723510000, 221660000, 16460000, 76490000], i: [6320000000, 5900000000, 6280000000, 6600000000, 6440000000], f: [33000000, 35590000, 38140000, 38250000, 63530000], water: 51.9, elec: 29.4},
    kgetlengrivier: {u: [126210000, 126210000, 317510000, 492230000, 561470000], i: [275330000, 359990000, 463160000, 507770000, 571900000], f: [0, 15790000, 93450000, 112360000, 142350000], water: 82, elec: 10},
    moseskotane: {u: [232530000, 432100000, 208930000, 291800000, 228400000], i: [1360000000, 1470000000, 1550000000, 1360000000, 779730000], f: [114770000, 131120000, 134280000, 152180000, 153560000], water: 32, elec: 'na'},
    dc_bojanalaplatinumdm: {u: [297090000, 305750000, 394690000, 394250000, 382700000], i: [564260000, 572490000, 643430000, 717340000, 899660000], f: [7180000, 7280000, 7420000, 7730000, 7930000], water: 'na', elec: 'na'},
    ratlou: {u: [0, 27080000, 41550000, 50970000, 57340000], i: [219850000, 242940000, 257040000, 247080000, 271170000], f: [934078, 1190000, 1250000, 1270000, 1570000], water: 'na', elec: 'na'},
    tswaing: {u: [619990000, 619990000, 437170000, 580500000, 711030000], i: [526850000, 584900000, 858820000, 954480000, 1030000000], f: [69890000, 79460000, 111870000, 133750000, 188250000], water: 'nd', elec: 28.5},
    mahikeng: {u: [1300000000, 1480000000, 913440000, 1050000000, 1240000000], i: [1400000000, 1620000000, 1850000000, 2160000000, 2490000000], f: [38210000, 37700000, 21150000, 36000000, 22110000], water: 43.6, elec: 'na', wq: 1},
    ditsobotla: {u: [203570000, 274560000, 556380000, 556380000, 556380000], i: [355570000, 379620000, 409320000, 409320000, 341340000], f: [228210000, 250230000, 314300000, 357660000, 188140000], water: 'nd', elec: 'nd'},
    ramotshere: {u: [165890000, 208250000, 394360000, 237260000, 419520000], i: [382050000, 391540000, 452530000, 426870000, 471430000], f: [30430000, 33780000, 42230000, 52860000, 42380000], water: 'nd', elec: 62},
    dc_ngakamodirimolemadm: {u: [1560000000, 9700000000, 10110000000, 10620000000, 9660000000], i: [3760000000, 4170000000, 4660000000, 4780000000, 5810000000], f: [17690000, 25500000, 26250000, 26720000, 22950000], water: 'nd', elec: 'na'},
    naledi: {u: [353520000, 413600000, 486350000, 601000000, 597360000], i: [239450000, 287750000, 413250000, 533270000, 671600000], f: [190250000, 241750000, 282940000, 276540000, 344620000], water: 'nd', elec: 15},
    mamusa: {u: [498760000, 460260000, 517250000, 555210000, 602840000], i: [263080000, 282880000, 314140000, 284390000, 334980000], f: [62900000, 64090000, 77710000, 76450000, 95570000], water: 'nd', elec: 33},
    greatertaung: {u: [78200000, 214390000, 262090000, 296780000, 174510000], i: [251500000, 14430000, 340000000, 383570000, 274390000], f: [2510000, 2650000, 2780000, 3280000, 2470000], water: 73, elec: 11},
    lekwateemane: {u: [657120000, 775810000, 905080000, 354730000, 386610000], i: [176690000, 179150000, 211400000, 241540000, 242190000], f: [43830000, 72580000, 111310000, 0, 6490000], water: 'nd', elec: 'nd'},
    kagisanomolopo: {u: [271580000, 327680000, 382430000, 414850000, 465230000], i: [589690000, 883670000, 1020000000, 1130000000, 1180000000], f: [2360000, 2450000, 3480000, 4030000, 9430000], water: 'na', elec: 'na'},
    dc_drruthsegomotsimompatidm: {u: [672140000, 920430000, 1060000000, 1400000000, 1630000000], i: [1450000000, 1580000000, 1860000000, 2170000000, 2050000000], f: [2790000, 15880000, 16810000, 17360000, 19620000], water: 'nd', elec: 'na'},
    matlosana: {u: [3230000000, 4300000000, 4500000000, 5630000000, 6340000000], i: [3670000000, 3970000000, 3000000000, 3250000000, 3640000000], f: [85510000, 198730000, 432110000, 536980000, 821460000], water: 57, elec: 44},
    maquassi: {u: [1480000000, 1040000000, 1070000000, 1510000000, 1750000000], i: [312810000, 482780000, 507710000, 541920000, 491030000], f: [17580000, 22970000, 30790000, 39380000, 52550000], water: 'nd', elec: 'nd'},
    jbmarks: {u: [841250000, 865230000, 898440000, 913440000, 1170000000], i: [2880000000, 3160000000, 3460000000, 3920000000, 4170000000], f: [78880000, 83440000, 89390000, 122860000, 201740000], water: 5, elec: 21},
    dc_drkennethkaundadm: {u: [70750000, 70750000, 72190000, 75700000, 75700000], i: [225830000, 259670000, 302110000, 349410000, 386490000], f: [11030000, 11110000, 12130000, 12370000, 13140000], water: 'na', elec: 'na'},
    richtersveld: {u: [111390000, 161970000, 185070000, 194060000, 239520000], i: [73010000, 112140000, 120300000, 124350000, 124630000], f: [1720000, 5100000, 11420000, 14650000, 16000000], water: 28, elec: 23},
    namakhoi: {u: [447850000, 461020000, 423000000, 480470000, 625730000], i: [208920000, 285280000, 261780000, 366550000, 358700000], f: [56860000, 52150000, 56000000, 62440000, 56720000], water: 13.7, elec: 16.1},
    kamiesberg: {u: [312640000, 368520000, 431180000, 137650000, 96610000], i: [111690000, 120330000, 132050000, 143890000, 45000000], f: [15010000, 19520000, 26800000, 36920000, 53800000], water: 21, elec: 22.4, wq: 1, eq: 1},
    hantam: {u: [11020000, 4440000, 0, 21480000, 86670000], i: [9960000, 9960000, 173099, 2920000, 21380000], f: [862561, 862561, 0, 50846, 65956], water: 31.6, elec: 11.2},
    karoohoogland: {u: [139060000, 158930000, 188510000, 172110000, 187550000], i: [49370000, 50460000, 50660000, 51200000, 53180000], f: [2360000, 2450000, 2790000, 3040000, 3200000], water: 12, elec: 20.6},
    khaima: {u: [29250000, 34880000, 34880000, 44010000, 53620000], i: [20050000, 19820000, 19820000, 20650000, 21050000], f: [7660000, 8400000, 11530000, 15430000, 17030000], water: 51, elec: 18, wq: 1},
    dc_namakwadm: {u: [6290000, 2040000, 371074, 528096, 76668], i: [132431, 0, 142126, 1820000, 1500000], f: [20065, 0, 0, 6789, 0], water: 'na', elec: 'na'},
    ubuntu: {u: [397570000, 440260000, 465000000, 515520000, 529350000], i: [89210000, 103960000, 93310000, 97900000, 118630000], f: [33050000, 36180000, 41490000, 41170000, 37430000], water: 30.9, elec: 35},
    umsobomvu: {u: [56790000, 56790000, 56790000, 0, 88430000], i: [12950000, 29940000, 32160000, 11980000, 482840], f: [0, 569874, 2470000, 2970000, 394730], water: 53, elec: 35.7},
    emthanjeni: {u: [204300000, 72180000, 230120000, 346750000, 881580000], i: [88310000, 26460000, 35120000, 58230000, 80140000], f: [15770000, 4640000, 16380000, 39810000, 79160000], water: 28.7, elec: 6.8},
    kareeberg: {u: [0, 0, 1430000, 17460000, 16030000], i: [2700000, 175338, 8270000, 8270000, 16420000], f: [1530000, 1570000, 1630000, 1630000, 2440000], water: 9, elec: 11, eq: 1},
    renosterberg: {u: [241660000, 0, 270470000, 270470000, 346470000], i: [125670000, 142880000, 164650000, 23120000, 47020000], f: [48550000, 0, 56390000, 14810000, 30600000], water: 'pnd', elec: 37.7, eq: 1},
    thembelihle: {u: [178460000, 178460000, 210860000, 261480000, 273610000], i: [156220000, 183660000, 191470000, 195320000, 171580000], f: [37730000, 44330000, 52450000, 62880000, 41720000], water: 75, elec: 25},
    siyathemba: {u: [414900000, 450380000, 494980000, 529870000, 610640000], i: [270960000, 278990000, 331090000, 341430000, 366250000], f: [33980000, 37770000, 51130000, 75400000, 105980000], water: 41.6, elec: 27.5, eq: 1},
    siyancuma: {u: [145110000, 204850000, 29090000, 88320000, 125720000], i: [77840000, 82380000, 16480000, 36220000, 39870000], f: [32020000, 35470000, 11220000, 12790000, 10590000], water: 32.6, elec: 30.8},
    dc_pixleykasemedm: {u: [0, 0, 5030000, 9080000, 0], i: [1480000, 2200000, 1270000, 2610000, 31930], f: [0, 71202, 0, 0, 0], water: 'na', elec: 'na'},
    kaigarib: {u: [893880000, 1070000000, 297760000, 504200000, 212050000], i: [347550000, 433240000, 155310000, 164420000, 172360000], f: [132850000, 157390000, 84190000, 119280000, 37980000], water: 58, elec: 31},
    kheis: {u: [46420000, 47720000, 47720000, 52370000, 34670000], i: [33970000, 34000000, 36640000, 38730000, 37560000], f: [8180000, 10990000, 13090000, 17390000, 20780000], water: 'nd', elec: 'nd'},
    tsantsabane: {u: [655780000, 715930000, 759890000, 855040000, 890710000], i: [44880000, 64130000, 80570000, 90160000, 92790000], f: [68720000, 107330000, 128060000, 170740000, 212030000], water: 64.7, elec: 26.5, eq: 1},
    kgatelopele: {u: [108100000, 108100000, 264470000, 730630000, 336760000], i: [87940000, 100870000, 112470000, 113110000, 114750000], f: [5030000, 5500000, 9080000, 7410000, 11510000], water: 36, elec: 30},
    dawidkruiper: {u: [81830000, 156130000, 0, 0, 74510000], i: [5750000, 6900000, 2070000, 29220000, 38170000], f: [0, 2160000, 10930000, 1088, 978292], water: 43.4, elec: 5.3},
    dc_zfmgcawudm: {u: [0, 0, 0, 0, 0], i: [0, 0, 25422, 0, 241476], f: [0, 9439, 23608, 0, 0], water: 'na', elec: 'na'},
    solplaatje: {u: [0, 0, 0, 29260000, 29260000], i: [427450000, 276870000, 184940000, 79750000, 251560000], f: [28150000, 64650000, 27440000, 31260000, 60270000], water: 67, elec: 25.8, wq: 1, eq: 1},
    dikgatlong: {u: [353090000, 333860000, 253940000, 253940000, 253940000], i: [169460000, 170270000, 178420000, 51620000, 51160000], f: [24430000, 31850000, 31100000, 36590000, 55380000], water: 16, elec: 43},
    magareng: {u: [178460000, 200990000, 225270000, 260770000, 297230000], i: [79780000, 106640000, 129520000, 175330000, 290790000], f: [14940000, 19040000, 25550000, 26530000, 30870000], water: 96, elec: 41},
    phokwane: {u: [1100000000, 1310000000, 1600000000, 868340000, 1120000000], i: [307890000, 342530000, 376650000, 395510000, 395510000], f: [37050000, 51270000, 67430000, 35750000, 105430000], water: 87, elec: 60, wq: 1},
    dc_francesbaarddm: {u: [0, 0, 387874, 0, 0], i: [127449, 0, 0, 0, 0], f: [1207, 1207, 138799, 138799, 182925], water: 'na', elec: 'na'},
    joemorolong: {u: [549940000, 592450000, 607950000, 672390000, 1540000000], i: [136210000, 303290000, 314940000, 453780000, 328950000], f: [4350000, 4940000, 5570000, 6060000, 20140000], water: 17, elec: 45},
    gasegonyana: {u: [67810000, 21760000, 35730000, 0, 0], i: [19640000, 160270000, 240061, 69140000, 17820000], f: [0, 0, 0, 0, 0], water: 12.8, elec: 23.6},
    gamagara: {u: [633140000, 745680000, 763660000, 815630000, 91850000], i: [263200000, 428550000, 394260000, 517760000, 42180000], f: [59330000, 77700000, 38040000, 43880000, 15450000], water: 67.3, elec: 13.6},
    dc_johntaologaetsewedm: {u: [17060000, 12520000, 0, 0, 0], i: [230254, 0, 1200000, 349485, 8230000], f: [966, 2638, 0, 0, 0], water: 'na', elec: 'na'},
    beaufortwest: {u: [123380000, 147780000, 169060000, 181740000, 6690000], i: [167340000, 175640000, 203420000, 224110000, 55980000], f: [1250000, 10170000, 19140000, 20350000, 2450000], water: 76.4, elec: 17.6},
    cpt: {u: [0, 0, 0, 0, 0], i: [587270000, 232640000, 51630000, 626120000, 40090000], f: [11820000, 12710000, 12310000, 0, 0], water: 5.9, elec: 11.2},
    witzenberg: {u: [1940000, 8930000, 8930000, 0, 0], i: [0, 0, 5440000, 11330000, 0], f: [0, 0, 0, 0, 0], water: 11.7, elec: 14.6},
    cederberg: {u: [1750000, 0, 2370000, 974750, 1510000], i: [12790000, 35200000, 71440000, 16600000, 10290000], f: [4790000, 8200000, 12110000, 14583, 115], water: 39.2, elec: 5.8},
    bergrivier: {u: [764459, 0, 0, 0, 0], i: [94750, 0, 1370000, 11090000, 3780000], f: [0, 0, 8223, 0, 590153], water: 16.6, elec: 11.6},
    matzikama: {u: [6000000, 14480000, 0, 0, 344865], i: [30020000, 63740000, 85190000, 59790000, 129000000], f: [1170000, 7230000, 14680000, 132948, 0], water: 41.4, elec: 14.9},
    saldanha: {u: [0, 0, 0, 2570000, 0], i: [157899, 1160000, 1150000, 33970000, 0], f: [0, 0, 0, 70520, 0], water: 22.2, elec: 13},
    swartland: {u: [13260000, 11720000, 5560000, 0, 0], i: [334098, 0, 0, 13350000, 0], f: [0, 0, 0, 0, 0], water: 19.7, elec: 3.2},
    dc_westcoastdm: {u: [0, 0, 0, 0, 0], i: [92097, 682294, 78120, 388525, 9600000], f: [635843, 635843, 635843, 674093, 671493], water: 11, elec: 'na'},
    drakenstein: {u: [0, 0, 0, 0, 0], i: [1050000, 6440000, 26859, 163010000, 2710000], f: [0, 0, 1450000, 2250000, 1470000], water: 23.1, elec: 7.8},
    stellenbosch: {u: [0, 0, 0, 0, 0], i: [99390000, 26400000, 30130000, 12430000, 2870000], f: [0, 4270000, 0, 0, 0], water: 31.2, elec: 5.6},
    breedevallei: {u: [0, 0, 0, 0, 0], i: [0, 0, 0, 0, 0], f: [0, 0, 0, 0, 0], water: 11.5, elec: 7.4},
    langeberg: {u: [14760000, 0, 0, 0, 0], i: [1100000, 0, 0, 0, 20430000], f: [54643, 0, 0, 0, 0], water: 10.6, elec: 16.9},
    dc_capewinelandsdm: {u: [0, 0, 0, 0, 0], i: [0, 0, 0, 0, 26019], f: [0, 0, 0, 0, 679001], water: 'na', elec: 'na'},
    theewaters: {u: [0, 0, 104360000, 153730000, 153910000], i: [2690000, 755639, 100240000, 353250000, 462260000], f: [1850, 0, 18386, 13954, 7500000], water: 16.2, elec: 3.7},
    overstrand: {u: [14250000, 14110000, 26060000, 0, 0], i: [263586, 110946, 534119, 3840000, 11722], f: [0, 27394, 4748, 0, 0], water: 31.2, elec: 7.1},
    capeagulhas: {u: [7640000, 2660000, 11220000, 41790000, 31920000], i: [4150000, 10040000, 2950000, 116660000, 2580000], f: [25000, 25000, 463263, 666700, 566127], water: 17.4, elec: 9},
    swellendam: {u: [3840000, 9250000, 1020000, 2000000, 47830000], i: [1100000, 13780000, 2730000, 66260000, 2310000], f: [0, 0, 0, 0, 3470], water: 36.4, elec: 9.4},
    dc_overbergdm: {u: [3630000, 1420000, 0, 0, 0], i: [1930000, 2530000, 3750000, 14050000, 11300000], f: [0, 0, 0, 0, 323295], water: 'na', elec: 'na'},
    kannaland: {u: [23060000, 59730000, 71350000, 68710000, 127580000], i: [133270000, 116900000, 124140000, 144260000, 200220000], f: [6100000, 5580000, 8880000, 0, 9930000], water: 'nd', elec: 'nd'},
    hessequa: {u: [6570000, 0, 5850000, 5600000, 0], i: [77276, 658, 5320000, 13021, 0], f: [0, 0, 0, 0, 0], water: 20.1, elec: 9.6},
    mosselbay: {u: [36250000, 237080000, 239230000, 0, 6230000], i: [0, 1210000, 3950000, 16850000, 42990000], f: [0, 0, 0, 0, 27227], water: 18.6, elec: 16.9},
    george: {u: [84130000, 3290000, 0, 31270000, 33740000], i: [5530000, 14350000, 173220, 40040000, 58740000], f: [21703, 728648, 728648, 728648, 982708], water: 24.6, elec: 9.7},
    oudtshoorn: {u: [0, 20590000, 0, 0, 0], i: [18560000, 4360000, 2560000, 20400000, 1590000], f: [0, 0, 0, 0, 0], water: 21.9, elec: 8},
    bitou: {u: [340640000, 1230000000, 0, 31890000, 12530000], i: [226160000, 226810000, 120540000, 136900000, 119860000], f: [4470000, 4470000, 4470000, 5630000, 5530000], water: 29.6, elec: 7},
    knysna: {u: [16220000, 50940000, 109850000, 168050000, 193600000], i: [60680000, 124520000, 196140000, 338950000, 419780000], f: [119231, 115521, 3010000, 3010000, 2900000], water: 48, elec: 10.5},
    dc_gardenroutedm: {u: [1370000, 0, 6940000, 18910000, 21430000], i: [32720000, 27420000, 36420000, 35160000, 43970000], f: [0, 0, 57406, 149141, 95867], water: 'na', elec: 'na'},
    laingsburg: {u: [22850000, 30540000, 68630000, 93670000, 101800000], i: [96450000, 101850000, 64960000, 110090000, 135570000], f: [1100000, 1630000, 1670000, 3210000, 5110000], water: 40.5, elec: 9.7, eq: 1},
    prinsealbert: {u: [1080000, 4720000, 7730000, 26860000, 27530000], i: [842695, 76223, 1690000, 6820000, 842961], f: [93716, 107355, 107355, 112025, 593512], water: 30.7, elec: 6},
    dc_centralkaroodm: {u: [8870000, 12730000, 10040000, 6760000, 221189], i: [30960000, 37630000, 25040000, 7340000, 3750000], f: [165885, 177974, 13006, 12110, 458], water: 'na', elec: 'na'}
  }
};

/* Audit opinions over five years, oldest to newest (2020/21 ... 2024/25). AGSA MFMA 2024-25, Annexure 3,
   financial audits before consolidation. C clean · U unqualified with findings · Q qualified · A adverse ·
   D disclaimer · O audit not finalised at the legislated date. Districts sit under their dc_ keys. */
window.AG_ANNEX3 = {
  years: ['2020/21', '2021/22', '2022/23', '2023/24', '2024/25'],
  codes: {C: 'clean', U: 'unqualified', Q: 'qualified', A: 'adverse', D: 'disclaimer', O: 'outstanding'},
  data: {
  jhb:"UUUUQ",
  cpt:"UCCCU",
  tsh:"UAQQQ",
  eku:"CCUUQ",
  eth:"UUUUU",
  nmb:"QQUQQ",
  buf:"QUQQQ",
  man:"UQQQQ",
  msunduzi:"UQQQU",
  polokwane:"QUUUU",
  rustenburg:"QQQQQ",
  mbombela:"UUUUU",
  emalahleni:"QQQUU",
  matlosana:"UUUQQ",
  solplaatje:"QQQQQ",
  stellenbosch:"CCCCC",
  drakenstein:"CCCCC",
  george:"CCCCC",
  knysna:"UUQUU",
  bitou:"UUCUQ",
  mosselbay:"CCCCC",
  oudtshoorn:"UUCUC",
  hessequa:"CCCCC",
  kannaland:"QDDDD",
  overstrand:"CCCCC",
  capeagulhas:"CCCCC",
  swellendam:"CCUCC",
  theewaters:"CCUQQ",
  saldanha:"CCCCC",
  swartland:"CCCCC",
  bergrivier:"CCCCC",
  cederberg:"CUUUC",
  matzikama:"CUUCC",
  breedevallei:"CCCCC",
  langeberg:"CCCCC",
  witzenberg:"CCCCC",
  beaufortwest:"QQQQU",
  laingsburg:"QAAAA",
  prinsealbert:"UCUUQ",
  makana:"DDDDD",
  ndlambe:"QUUUU",
  kouga:"UUUCC",
  ksd:"QUUUU",
  mhlontlo:"UQQQQ",
  emgijima:"QQQQQ",
  inxuba:"UUUUQ",
  waltersisulu:"DAQQQ",
  raymondmhlaba:"QQQQQ",
  newcastle:"UUUUU",
  umhlathuze:"CCCCC",
  raynkonyeni:"UCUUU",
  umngeni:"QUUUU",
  endumeni:"QQQDQ",
  ulundi:"UQUUU",
  alfredduma:"UUUUU",
  inkosilang:"DQQQQ",
  metsimaholo:"QQQQQ",
  ngwathe:"QQQQQ",
  moqhaka:"QUQQQ",
  dihlabeng:"QQQQU",
  maluti:"DDDDO",
  matjhabeng:"QQQQQ",
  mahikeng:"QQQQQ",
  jbmarks:"QQQQU",
  madibeng:"DDAQQ",
  naledi:"DDAQQ",
  ditsobotla:"DDDDD",
  stevet:"CUQQQ",
  govanmbeki:"QQQQU",
  msukaligwa:"QQQQQ",
  lekwa:"DDQQQ",
  bushbuckridge:"UUUUU",
  tzaneen:"UUUUU",
  mogalakwena:"QQQUU",
  belabela:"DQQQU",
  modimollemookgo:"QQAQQ",
  thulamela:"UUUQQ",
  musina:"UQUUU",
  baphalaborwa:"QQQQQ",
  fetakgomo:"UQUUU",
  dawidkruiper:"UUUQU",
  gasegonyana:"UQQUU",
  namakhoi:"QQQUU",
  gamagara:"QUUUU",
  emthanjeni:"QQQQQ",
  hantam:"CCUQQ",
  drbeyers:"QQUUQ",
  mnquma:"UCCCC",
  winniemandela:"CCCUU",
  ingquza:"QQQQQ",
  abaqulusi:"QUUUU",
  kokstad:"UUUUU",
  umlalazi:"UUCCC",
  mtubatuba:"QQQQU",
  mkhondo:"UUUUQ",
  thembisile:"UUUUU",
  lephalale:"UUUUU",
  giyani:"QUUUU",
  lepellenkumpi:"UQUUU",
  tsantsabane:"QQQDQ",
  umsobomvu:"QQQQU",
  phokwane:"QQQQQ",
  setsoto:"QUUUU",
  nala:"QQQQO",
  mafube:"QQQQQ",
  mantsopa:"QQQQQ",
  emfuleni:"UQQQQ",
  midvaal:"CCCCC",
  lesedi:"UUUUU",
  mogalecity:"UQQUU",
  randwest:"QUUUU",
  merafong:"ADDQQ",
  sundaysriver:"DDDDD",
  bluecrane:"UUUQQ",
  koukamma:"UUQAQ",
  amahlathi:"UUQUU",
  greatkei:"UUUUC",
  mbhashe:"UUUUU",
  ngqushwa:"QUUUU",
  intsikayethu:"QQUQU",
  emalahleniec:"QQQQU",
  engcobo:"QUUUU",
  sakhisizwe:"QQQQU",
  senqu:"CUCCC",
  elundini:"CUUUU",
  matatiele:"UUUQQ",
  umzimvubu:"UUUCC",
  ntabankulu:"UQUUC",
  nyandeni:"UUQQQ",
  portstjohns:"UQQQQ",
  umshwathi:"QUUCU",
  mpofana:"QQQUU",
  richmondkzn:"UUUCC",
  mkhambathini:"UUUUU",
  umdoni:"UUUQU",
  umuziwabantu:"UUUUU",
  kwadukuza:"UUUUU",
  mandeni:"UUUUU",
  nkandla:"UUUUU",
  mthonjaneni:"UUUUU",
  nongoma:"UUUQQ",
  uphongolo:"UUUUU",
  jozini:"UUQUU",
  bigfive:"UUUUU",
  okhahlamba:"CCCUU",
  nquthu:"DQUUU",
  msinga:"UUUCU",
  umvoti:"UUUCU",
  dannhauser:"QUUUU",
  umzimkhulu:"UUUUU",
  ubuhlebezwe:"UUUUU",
  kwasani:"UUUUU",
  nketoana:"DDDDD",
  phumelela:"UUUUU",
  tswelopele:"UUUUU",
  masilonyana:"DDDDD",
  mohokare:"QQDDD",
  kopanong:"DQQQQ",
  letsemeng:"QQQQQ",
  moseskotane:"QUQQU",
  kgetlengrivier:"DDQQQ",
  moretele:"UQUUU",
  ramotshere:"DQQQQ",
  tswaing:"QQQQQ",
  greatertaung:"DQQQU",
  lekwateemane:"QDDDA",
  mamusa:"DDDAQ",
  maquassi:"DDDAA",
  emakhazeni:"AAAQQ",
  victorkhanye:"QQQQQ",
  jsmoroka:"DQQQQ",
  dipaleseng:"DQQQU",
  albertluthuli:"UQQQU",
  nkomazi:"UUUUU",
  thabachweu:"UUQQU",
  makhado:"UUUUU",
  collinschabane:"UUUQU",
  greaterletaba:"UUUUU",
  maruleng:"UUUUU",
  molemole:"UUUUU",
  blouberg:"UUQQU",
  eliasmotsoaledi:"UUUQU",
  makhuduthamaga:"UUUUU",
  ephraimmogale:"UQUUU",
  thabazimbi:"QQQDQ",
  kareeberg:"UUQDQ",
  ubuntu:"QQQQQ",
  siyancuma:"QQQQQ",
  siyathemba:"QQQQQ",
  renosterberg:"DDQQQ",
  thembelihle:"QQQQQ",
  kaigarib:"QQQQQ",
  kheis:"DDDDQ",
  kgatelopele:"DDQQQ",
  dikgatlong:"QQQQU",
  magareng:"QQQQQ",
  karoohoogland:"UUUQU",
  kamiesberg:"QQQQD",
  richtersveld:"QQQQQ",
  khaima:"QQQQQ",
  joemorolong:"DDDQQ",
  maphumulo:"UUUUU",
  ratlou:"DDDDQ",
  kagisanomolopo:"QQQAA",
  edumbe:"QUUUU",
  mfolozi:"UUUUU",
  umhlabuyalingana:"UUUUU",
  tokologo:"QDQQQ",
  ndwedwe:"UUUUU",
  impendle:"UUUUA",
  emadlangeni:"QQUUU",
  umzumbe:"UUQAU",
  pixleymp:"QUUUU",
  dc_umgungundlovudm:"UUUUU",
  dc_capricorndm:"UCUCC",
  dc_bojanalaplatinumdm:"QQQUU",
  dc_ehlanzenidm:"CCCCC",
  dc_nkangaladm:"CCCCU",
  dc_drkennethkaundadm:"UUUUU",
  dc_francesbaarddm:"CCCCC",
  dc_capewinelandsdm:"CCCCC",
  dc_gardenroutedm:"CCCCC",
  dc_overbergdm:"CCCCC",
  dc_westcoastdm:"CCCCC",
  dc_centralkaroodm:"CUUUU",
  dc_sarahbaartmandm:"UUUUC",
  dc_ortambodm:"QQUUU",
  dc_chrishanidm:"DQQQQ",
  dc_joegqabidm:"CCCCC",
  dc_amatholedm:"ADDQQ",
  dc_amajubadm:"QQQQQ",
  dc_kingcetshwayodm:"CCCCC",
  dc_ugudm:"QUUUU",
  dc_umzinyathidm:"QAAAQ",
  dc_zululanddm:"UUUUU",
  dc_uthukeladm:"QQQQQ",
  dc_feziledabidm:"QQQQQ",
  dc_thabomofutsanyanadm:"UUUUU",
  dc_lejweleputswadm:"UUUUU",
  dc_ngakamodirimolemadm:"AAQQQ",
  dc_drruthsegomotsimompatidm:"QQQQQ",
  dc_gertsibandedm:"CUUUU",
  dc_mopanidm:"DDQQQ",
  dc_waterbergdm:"CCUCC",
  dc_vhembedm:"QQQQQ",
  dc_sekhukhunedm:"QQQQQ",
  dc_zfmgcawudm:"CCCUU",
  dc_johntaologaetsewedm:"CUUUU",
  dc_namakwadm:"CCCCU",
  dc_pixleykasemedm:"UUUUU",
  dc_alfrednzodm:"UUUCQ",
  dc_harrygwaladm:"UQUUU",
  dc_umkhanyakudedm:"DDQQQ",
  dc_sedibengdm:"UUUUU",
  dc_westranddm:"UUUCC",
  dc_ilembedm:"UUUUU",
  dc_xhariepdm:"UUUUU"
  }
};

(function () {
  var M = window.SA_MUNIS, P = window.SA_POP22, A = window.AG_ANNEX3;
  Object.keys(P).forEach(function (k) {
    var m = M[k], n = P[k];
    if (!m) return;
    m.popN = n;
    m.pop = n >= 1e6 ? (n / 1e6).toFixed(2).replace(/0$/, '') + 'm' : Math.round(n / 1000) + 'k';
  });
  // District municipalities, derived from the locals' dm field (nothing hand-entered).
  var byDm = {};
  Object.keys(M).forEach(function (k) { if (M[k].dm) (byDm[M[k].dm] = byDm[M[k].dm] || []).push(k); });
  Object.keys(byDm).forEach(function (dm) {
    var members = byDm[dm].slice().sort(function (a, b) {
      var na = M[a].n.toLowerCase(), nb = M[b].n.toLowerCase();
      return na < nb ? -1 : na > nb ? 1 : 0;
    });
    M['dc_' + dm.toLowerCase().replace(/[^a-z0-9]+/g, '')] = {
      n: dm.replace(/ DM$/, ' District Municipality'), dmName: dm, t: 'District', dtype: 'district',
      p: M[members[0]].p, members: members
    };
    // District residents: the sum of its local municipalities (Census 2022).
    if (members.every(function (k) { return M[k].popN; }))
      M['dc_' + dm.toLowerCase().replace(/[^a-z0-9]+/g, '')].popN = members.reduce(function (a, k) { return a + M[k].popN; }, 0);
  });
  Object.keys(A.data).forEach(function (k) {
    if (M[k]) M[k].ag5 = A.data[k].split('').map(function (c) { return A.codes[c]; });
  });
})();

/* Ward candidates, LGE 2026. Source: Electoral Commission of South Africa, certified candidate list, 16 September 2026.
   SA_WARD_INDEX[muniKey] = [province, 5-digit ward ID prefix, wards]: wards is the ward count when numbered 1..n,
   otherwise the list of ward numbers. Full ward ID = prefix + ward number padded to 3 digits (ward list: MDB Wards 2026). */
window.SA_WARD_INDEX = {"buf":["EC","29200",50],"drbeyers":["EC","21001",12],"bluecrane":["EC","21002",6],"makana":["EC","21004",13],"ndlambe":["EC","21005",10],"sundaysriver":["EC","21006",8],"kouga":["EC","21008",15],"koukamma":["EC","21009",6],"mbhashe":["EC","21201",32],"mnquma":["EC","21202",32],"greatkei":["EC","21203",7],"amahlathi":["EC","21204",14],"ngqushwa":["EC","21206",11],"raymondmhlaba":["EC","21209",21],"inxuba":["EC","21301",9],"intsikayethu":["EC","21305",20],"emalahleniec":["EC","21306",17],"engcobo":["EC","21307",19],"sakhisizwe":["EC","21308",9],"emgijima":["EC","21309",34],"elundini":["EC","21401",17],"senqu":["EC","21402",17],"waltersisulu":["EC","21405",11],"ingquza":["EC","21503",32],"portstjohns":["EC","21504",21],"nyandeni":["EC","21505",32],"mhlontlo":["EC","21506",26],"ksd":["EC","21507",37],"matatiele":["EC","24401",26],"umzimvubu":["EC","24402",28],"winniemandela":["EC","24403",32],"ntabankulu":["EC","24404",19],"nmb":["EC","29300",60],"letsemeng":["FS","41601",7],"kopanong":["FS","41602",9],"mohokare":["FS","41603",7],"masilonyana":["FS","41801",10],"tokologo":["FS","41802",7],"tswelopele":["FS","41803",8],"matjhabeng":["FS","41804",36],"nala":["FS","41805",12],"setsoto":["FS","41901",15],"dihlabeng":["FS","41902",19],"nketoana":["FS","41903",9],"maluti":["FS","41904",35],"phumelela":["FS","41905",8],"mantsopa":["FS","41906",9],"moqhaka":["FS","42001",20],"ngwathe":["FS","42003",14],"metsimaholo":["FS","42004",23],"mafube":["FS","42005",9],"man":["FS","49400",51],"eku":["GP","79700",112],"emfuleni":["GP","74201",45],"midvaal":["GP","74202",15],"lesedi":["GP","74203",13],"mogalecity":["GP","74801",39],"merafong":["GP","74804",[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,28]],"randwest":["GP","74805",35],"jhb":["GP","79800",135],"tsh":["GP","79900",107],"eth":["KZN","59500",112],"umdoni":["KZN","52102",19],"umzumbe":["KZN","52103",20],"umuziwabantu":["KZN","52104",11],"raynkonyeni":["KZN","52106",36],"umshwathi":["KZN","52201",14],"umngeni":["KZN","52202",13],"mpofana":["KZN","52203",6],"impendle":["KZN","52204",6],"msunduzi":["KZN","52205",41],"mkhambathini":["KZN","52206",10],"richmondkzn":["KZN","52207",9],"okhahlamba":["KZN","52305",15],"inkosilang":["KZN","52307",24],"alfredduma":["KZN","52308",37],"endumeni":["KZN","52401",8],"nquthu":["KZN","52402",20],"msinga":["KZN","52404",21],"umvoti":["KZN","52405",14],"newcastle":["KZN","52502",36],"emadlangeni":["KZN","52503",6],"dannhauser":["KZN","52504",13],"edumbe":["KZN","52601",10],"uphongolo":["KZN","52602",15],"abaqulusi":["KZN","52603",24],"nongoma":["KZN","52605",23],"ulundi":["KZN","52606",25],"umhlabuyalingana":["KZN","52701",20],"jozini":["KZN","52702",25],"mtubatuba":["KZN","52705",23],"bigfive":["KZN","52706",14],"mfolozi":["KZN","52801",18],"umhlathuze":["KZN","52802",36],"umlalazi":["KZN","52804",28],"mthonjaneni":["KZN","52805",13],"nkandla":["KZN","52806",14],"mandeni":["KZN","52901",18],"kwadukuza":["KZN","52902",30],"ndwedwe":["KZN","52903",19],"maphumulo":["KZN","52904",13],"kokstad":["KZN","54303",11],"umzimkhulu":["KZN","54305",22],"giyani":["LP","93301",31],"greaterletaba":["LP","93302",30],"tzaneen":["LP","93303",35],"baphalaborwa":["LP","93304",19],"maruleng":["LP","93305",14],"musina":["LP","93401",12],"thulamela":["LP","93403",41],"makhado":["LP","93404",38],"collinschabane":["LP","93405",36],"blouberg":["LP","93501",22],"molemole":["LP","93503",16],"polokwane":["LP","93504",45],"lepellenkumpi":["LP","93505",30],"thabazimbi":["LP","93601",12],"lephalale":["LP","93602",15],"belabela":["LP","93606",9],"mogalakwena":["LP","93607",32],"modimollemookgo":["LP","93608",14],"ephraimmogale":["LP","94701",16],"eliasmotsoaledi":["LP","94702",31],"makhuduthamaga":["LP","94703",31],"fetakgomo":["LP","94706",39],"albertluthuli":["MP","83001",25],"msukaligwa":["MP","83002",19],"mkhondo":["MP","83003",19],"pixleymp":["MP","83004",11],"lekwa":["MP","83005",15],"dipaleseng":["MP","83006",6],"govanmbeki":["MP","83007",33],"victorkhanye":["MP","83101",9],"emalahleni":["MP","83102",36],"stevet":["MP","83103",29],"emakhazeni":["MP","83104",8],"thembisile":["MP","83105",33],"jsmoroka":["MP","83106",31],"thabachweu":["MP","83201",14],"nkomazi":["MP","83204",35],"bushbuckridge":["MP","83205",40],"mbombela":["MP","83206",45],"moretele":["NW","63701",25],"madibeng":["NW","63702",41],"rustenburg":["NW","63703",45],"kgetlengrivier":["NW","63704",7],"moseskotane":["NW","63705",35],"ratlou":["NW","63801",14],"tswaing":["NW","63802",14],"mahikeng":["NW","63803",35],"ditsobotla":["NW","63804",20],"ramotshere":["NW","63805",19],"naledi":["NW","63902",9],"mamusa":["NW","63903",8],"greatertaung":["NW","63904",24],"lekwateemane":["NW","63906",7],"kagisanomolopo":["NW","63907",15],"matlosana":["NW","64003",39],"maquassi":["NW","64004",11],"jbmarks":["NW","64005",34],"richtersveld":["NC","30601",6],"namakhoi":["NC","30602",9],"kamiesberg":["NC","30604",6],"hantam":["NC","30605",7],"karoohoogland":["NC","30606",6],"khaima":["NC","30607",6],"ubuntu":["NC","30701",6],"umsobomvu":["NC","30702",7],"emthanjeni":["NC","30703",8],"kareeberg":["NC","30704",6],"renosterberg":["NC","30705",6],"thembelihle":["NC","30706",6],"siyathemba":["NC","30707",6],"siyancuma":["NC","30708",7],"kaigarib":["NC","30802",10],"kheis":["NC","30804",6],"tsantsabane":["NC","30805",7],"kgatelopele":["NC","30806",6],"dawidkruiper":["NC","30807",17],"solplaatje":["NC","30901",33],"dikgatlong":["NC","30902",8],"magareng":["NC","30903",6],"phokwane":["NC","30904",10],"joemorolong":["NC","34501",15],"gasegonyana":["NC","34502",15],"gamagara":["NC","34503",8],"cpt":["WC","19100",118],"matzikama":["WC","10101",8],"cederberg":["WC","10102",6],"bergrivier":["WC","10103",7],"saldanha":["WC","10104",16],"swartland":["WC","10105",12],"witzenberg":["WC","10202",12],"drakenstein":["WC","10203",33],"stellenbosch":["WC","10204",23],"breedevallei":["WC","10205",21],"langeberg":["WC","10206",12],"theewaters":["WC","10301",14],"overstrand":["WC","10302",15],"capeagulhas":["WC","10303",6],"swellendam":["WC","10304",6],"kannaland":["WC","10401",5],"hessequa":["WC","10402",9],"mosselbay":["WC","10403",17],"george":["WC","10404",28],"oudtshoorn":["WC","10405",13],"bitou":["WC","10407",7],"knysna":["WC","10408",11],"laingsburg":["WC","10501",5],"prinsealbert":["WC","10502",5],"beaufortwest":["WC","10503",7],"ubuhlebezwe":["KZN","54304",14],"kwasani":["KZN","54306",15]};
});

/* ==== locator map ==== */
guard("locator map", function () {
/* =========================================================
   South Africa locator map — for the Municipality Finder.
   Self-contained. No network.

   v20 · Province boundaries: South African Municipal
   Demarcation Board, via OCHA ROSEA (HDX) and geoBoundaries
   (ZAF ADM1, 2020). Licence CC BY 3.0 IGO, so the page needs a
   credit line, e.g. "Map: Municipal Demarcation Board via
   OCHA and geoBoundaries (CC BY 3.0 IGO)".

   Each province ring is composed from shared border arcs,
   forwards or reversed, so adjacent provinces share identical
   edges and tile without gaps. Lesotho and Eswatini fall out
   as a hole and a notch.
   ========================================================= */
(function () {
  'use strict';

  // ---- province boundaries ---------------------------------
  // Shared border arcs. Each arc: the first point as lon,lat in 1/200 of a degree (latitude
  // counted south), then the step to each next point. Simplified to about a quarter of a pixel
  // at the largest size the map is shown.
  var ARCS = [
    "4830,6358,-16,3,-8,-15,3,-5,-16,0,-3,14,-6,4,-1,5,-7,3,-10,-11,1,-2,-5,-1,8,-7,-2,-3,-17,-4,-4,-8,-4,-2,-15,3,-4,-2,-5,2,-4,6,-8,0,-2,3,-6,0,-16,-7,-2,9,-12,-1,-9,4,-7,9,-1,8,-7,8,1,4,-18,15,-7,2,-1,4,-8,-5,-2,-9,3,-4,-5,-3,-13,-3,-15,3,-5,-3,-3,-8,-17,7,-8,-11,-24,5,-7,-4,8,-16,-11,-2,0,-7,-14,-2,-37,-17,-7,2,-3,13,-11,21,0,5,-9,4,3,2,-2,15,-17,-8,4,14,-6,3,5,12,-4,4,4,5,8,4,-9,16,-4,-13,-11,7,-3,18,-13,4,-2,7,-4,-1,-1,3,-5,1,-19,-5,-1,-5,-6,0,-2,-4,-9,9,-9,-8,-22,4,5,17,-8,4,-9,-1,-9,9,-4,-1,-11,4,-11,-3,1,5,-5,8,-10,5,-10,9,-8,16,3,8,-12,5,-26,-3,-24,4,-4,7,-7,3,0,5,8,10,-6,22,-11,4,-3,6,-16,-3,-12,3,0,-4,-6,-9,-12,12,-12,0,-12,-8,-3,2,-2,-9,-11,-12,-16,-4,-6,-6,0,-14,-10,-8,-5,-15,2,-3,-6,-10,-3,-22,10,5,8,-8,-1,-6,10,-9,8,1,-3,-17,-15,0,3,-8,-9,1,-8,12,-8,0,-3,9,-21,16,-12,2,-5,-4,-6,-1,-3,7,-8,3,-6,-5,-1,5,-5,2,5,4,-10,5,-5,-5,-7,6,-3,32,-15,9,-9,-22,2,-13,4,-3,-4,-2,-12,-20,-5,-17,17,-9,-2,-2,3,-11,-4,-2,-1,-5,7,-4,0,-8,-4,7,-1,-9,-3,0,-9,-9,-6,-3,-6,6,-7,-6,-1,-6,-7,-4,-2,3,-3,-3,5,-20,-16,17,-2,-9,-6,1,-3,-2,-3,2,-23,-7,1,-8,11,-8,0,-2,-4,-1,0,-3,5,0,1,-3,-8,-16,4,-1,-1,-8,4,-5,-1,-6,-7,1,7,-10,-9,-1,-3,-3,-4,1,3,-2,5,-15,-3,-2,0,-5,-10,-7,7,-10,-10,-4,-4,-10,1,-24,-9,-15,1,-12,15,-7,-22,-12,17,-4,-2,-24,-17,-6,-14,-9,0,-9,-7,-11,-21,-3,-17,-25,-14,3,-3,15,7,17,-15,-19,-13,-10,7,13,-9,13,0,14,-24,34,-7,-4,-4,1,2,3,-7,4,-22,-15,-11,3,-2,26,-12,-1,-11,2,0,5,9,12,-23,17,5,16,-15,-5", // 0 NC | WC
    "3552,6230,7,10,15,13,3,7,-2,2,7,11,42,44,-1,3,22,29,1,15,9,11,1,7,-3,6,10,26,-3,9,9,33,-2,7,-4,0,4,30,-4,20,-14,23,-21,19,-17,2,-8,-9,-6,-2,-1,-5,-3,-1,-2,4,-7,-1,0,3,-5,2,2,11,-3,3,-1,-2,-1,3,-5,0,-2,3,6,3,2,4,-5,9,5,4,0,10,-3,4,6,1,-1,7,3,2,9,-5,3,4,1,-2,-6,-4,5,-4,5,1,-2,6,2,-4,7,3,3,5,-3,11,14,10,-3,4,8,1,0,2,-6,3,-3,-5,-11,-7,-2,-10,-7,0,5,-1,-2,-4,-5,0,2,4,-6,3,5,3,0,4,12,6,14,14,11,18,0,3,-3,1,30,23,6,10,-3,11,7,0,2,6,3,0,1,4,4,1,9,14,0,13,10,18,-1,8,-2,4,-6,-1,1,3,-5,-3,-2,1,2,-2,-5,0,-5,4,-1,11,-13,13,7,4,3,-3,3,4,-4,5,0,7,-6,5,5,6,4,1,3,18,2,0,2,7,12,6,2,4,6,-1,-6,-3,-2,-4,3,-8,-2,-3,3,-2,-4,-10,-7,-4,3,-11,13,-7,21,-4,17,-1,16,3,8,3,11,12,-10,5,7,11,-1,5,-6,5,1,2,-3,0,4,8,-4,1,3,9,2,0,-1,-2,6,2,1,-4,6,1,5,-4,9,2,4,-3,11,-2,13,6,4,5,-2,2,5,4,6,-2,10,5,4,-4,8,-2,7,4,9,11,4,12,-6,4,-4,9,-6,1,-1,4,23,-6,8,10,16,4,0,3,9,8,3,-1,3,6,5,0,2,6,8,0,-2,-2,3,-2,37,0,13,9,14,5,12,-6,-4,-4,7,-10,18,-8,13,-1,2,-9,30,-14,10,-13,17,-8,17,-4,23,0,24,5,4,-2,0,-7,-3,-1,-1,-5,17,-7,33,2,40,13,11,-4,3,1,2,-3,7,-2,0,-2,3,1,-1,-3,5,-3,6,1,9,-3,34,8,21,-2,23,-9,-2,-3,8,-5,-6,-2,-1,-3,9,-9,11,-4,16,0,14,-4,0,-2,-4,0,-6,-5,4,-9,4,-4,16,-6,16,-2,26,2,9,-2,14,-10,5,-1,37,8,1,-2,5,1,37,13,0,-3,6,-2,6,3,37,0,16,4,16,-1,0,2,5,0,-7,-2,-1,-3,3,-9,5,-4,12,-4,12,0,9,-4,14,0", // 1 WC outer edge
    "4729,6796,-2,-6,2,-6,-2,-1,4,-2,0,-4,6,0,4,-4,-29,-7,-1,-7,-7,-3,-6,2,0,4,-19,-3,7,-7,2,-9,7,1,13,-4,3,-10,6,5,17,0,1,-10,-11,-7,-1,-4,-4,1,2,-16,-18,-6,-4,-4,-28,-1,2,4,-14,-14,-32,0,-40,8,-32,-2,2,-1,-10,-4,1,-14,7,0,0,-3,3,-1,10,-17,7,-7,3,-9,13,-13,1,-6,-5,-6,7,-4,-4,-9,11,-10,0,-5,19,0,3,-3,-5,-12,12,-7,7,0,3,4,36,8,4,-12,-10,0,1,-7,-4,-5,-13,-7,6,-4,1,-8,-3,-12,-9,-7,1,-10,-6,-8,17,-6,6,-9,15,8,8,-13,43,4,3,-3,-6,-6,4,-12,19,-12,7,3,10,10,8,2,14,-10,14,-2,3,-3,-1,-4,12,1,3,-3,-3,0,7,-5,0,-5,-5,-3,-2,5,2,-10,5,0,1,-10,7,2,3,-2,-1,-3,7,-8,-11,-11,-12,1,4,-12,6,2,0,-7,6,-1,-7,-5", // 2 EC | WC
    "5093,6125,-12,-11,-15,-2,-5,3,-14,-15,-9,0,-7,-8,1,-3,-10,-8,-3,-6,-6,-4,-5,1,-1,-15,-10,1,-8,-8,2,-5,-4,-1,-2,-4,-5,1,-6,-14,-7,-4,1,-4,-9,-10,3,-4,-4,-6,-16,-1,-7,-3,-2,-15,-4,2,-10,-1,-11,-13,-8,-1,0,-4,-12,0,-18,-22,1,-9,-2,-1,111,-201,-14,-5,8,-22,-5,-2,8,-8,11,-28,-10,-3,-4,-8,7,1,4,-6,8,1,13,-35", // 3 FS | NC
    "5006,5615,-11,1,-5,7,-24,-37,6,-2,0,-2,-3,0,41,-42,-10,-4,-41,4,1,-9,-4,-4,1,-6,-6,1,1,5,-14,2,-3,10,4,8,-3,1,-1,9,-3,1,8,8,-2,1,1,3,-8,1,-5,10,-5,-1,5,7,-2,3,2,10,-4,2,-1,4,-8,1,0,7,-6,4,-18,-12,5,-7,-1,-3,-11,-11,-3,3,-7,-6,13,-14,6,-11,-9,-5,7,-11,-8,-5,-59,12,-3,-7,5,-17,-14,-3,0,-28,7,-22,-4,0,-22,-15,-12,-5,16,-35,12,-5,-2,-11,-11,-21,-11,-7,-9,-1,-3,7,-19,-10,-55,-20,20,-25,-24,-17,-40,-9,3,-29,-12,-14,18,-26,-12,-5,-7,0,3,-12,25,7,6,-17,-60,-4,1,12,-5,11,-16,-2,-1,13,-15,-2,-1,14,-10,32,-9,16,-19,-9,-1,-58,-15,1", // 4 NC | NW
    "4526,5225,-5,2,0,3,-6,-1,1,9,-5,7,-17,-5,-3,6,-7,-1,-4,4,1,6,-9,3,0,8,-7,-2,-4,5,-12,0,-1,5,-10,6,2,5,-4,3,1,4,-5,5,1,5,-5,2,-1,5,-4,0,-8,8,-5,10,-7,0,-13,7,-25,-2,-8,3,-3,6,3,2,2,11,-3,6,-16,12,-15,1,-6,-5,-11,1,-3,3,-24,-8,-6,2,-8,-1,-7,5,-5,-2,-11,1,-17,6,-5,-4,-21,-2,-7,-8,-5,2,-12,-4,-8,5,-5,0,-1,5,-6,-1,-4,5,-10,1,-6,7,-2,-9,2,-4,-8,-2,0,-6,-5,-3,4,-3,-3,-4,2,-5,-4,-5,0,-5,4,-1,0,-16,-5,-6,-1,-9,2,-14,7,-2,6,-8,3,1,0,-6,10,-10,3,-7,6,-3,6,-18,9,-9,-9,-6,4,-3,0,-3,-3,0,-1,-4,3,-4,-4,-6,5,-10,-8,-9,3,-8,-7,-4,2,-3,-1,-7,-9,5,5,-9,-7,-2,-1,-9,-9,-7,-1,-5,3,-6,-8,0,3,-6,7,-2,-10,-13,-4,-1,3,-5,-2,-5,7,-1,1,-3,-3,-2,-3,4,-4,-1,-2,-3,4,-3,-2,-2,-5,1,1,-5,-2,-2,-7,0,-4,-9,2,-4,-7,0,0,-4,6,-2,0,-2,-3,1,-2,-3,-3,0,-4,-4,3,-5,-6,0,-5,-6,5,-9,-7,1,-2,-2,1,-7,-4,-2,1,-4,-7,-4,1,-6,-6,-2,-7,-8,-5,-1,-7,-11,-8,-1,-3,-5,-5,3,-6,-6,-6,1,-2,-5,-5,-3,1,-2,-5,-1,0,-3,-5,-1,-8,-9,0,733,-6,-1,-11,4,-8,0,-7,5,-5,8,-15,-5,-14,9,-9,-4,-12,4,-4,3,0,6,-9,7,-2,14,-9,8,-19,5,-9,-3,-7,3,-5,9,-1,8,6,9,4,0,1,4,-2,3,-6,-2,-5,2,-1,3,-12,7,-9,2,-10,-2,-6,-6,-7,-1,-2,-8,-12,-6,-31,-2,-10,-3,-14,3,-7,-1,-7,4,-10,1,-6,5,-10,-1,-8,3,-11,-1,-3,-3,-18,0,-2,4,-6,-1,-6,4,-21,-9,-8,1,-11,-14,-5,-4,-7,0,-2,-4,-28,-1,-7,-4,-3,4,-7,-3,-3,4,-7,2,-6,-3,-3,-13,-6,-2,-6,3,-16,0,-8,5,-2,-2,1,-10,3,-3,0,-16,-10,0,-2,-10,-6,-5,-1,-4,2,-6,10,-3,3,-6,1,-5,-8,-11,2,-4,-10,-15,-6,0,-4,4,-7,-1,-7,2,-7,-9,3,-18,-2,-3,-9,-1,-3,-6,-10,-6,-5,3,-6,0,-3,5,-6,-3,-3,3,-11,-1,-4,4,1,17,-4,1,-8,-3,0,4,5,5,-4,2,-6,-1,0,4,4,2,0,5,-5,1,-5,-3,-4,3,0,5,11,12,-8,7,0,12,-4,2,-3,6,-7,1,0,-4,-6,-2,-10,6,-4,6,-24,7,-5,5,-1,8,13,8,3,7,3,0,5,5,-2,6,3,2,1,11,4,3,1,8,11,4,6,5,7,18,19,17,5,25,4,4,6,15,8,8,2,10,5,5,7,22,0,8,6,6,8,41,6,10,3,13,7,7,7,31,7,8,1,10,6,8,2,16,8,9,7,15,2,0,1,6,17,23,-3,4,7,7,1,6,11,10,14,33,19,23,-1,2,11,18,-1,2,5,5", // 5 NC outer edge
    "4830,6358,-1,-5,3,-5,13,1,12,4,6,-3,5,-7,17,-1,-2,-4,5,5,15,-2,2,-20,-4,-7,6,-12,-3,-2,8,-4,1,-12,6,-4,14,-3,9,5,16,-4,7,-7,8,4,-2,-9,9,-3,7,1,5,-7,9,-4,11,1,3,-3,5,1,6,-4,5,1,0,-3,3,2,2,-4,5,-1,1,-5,15,7,1,-2,13,4,6,-3,0,-14,12,-10,2,-4,-3,-4,5,-1,7,-10,-3,0,-2,-4,7,-6,-1,-4,3,-7,-10,-6,3,-4,7,-3,6,-9,-5,1,-9,-3,-1,-11,-3,-1,2,-11,-3,-6,2,-2", // 6 EC | NC
    "6039,6216,-6,-6,1,-5,-4,-2,-2,2,-1,-3,4,-7,-4,-2,2,-9,-5,-2,0,-4,-10,-3,5,1,0,-4,-4,1,-4,-4,-7,2,0,-3,-3,0,1,-3,-2,3,-5,0,-3,-3,2,0,0,-5,-1,2,-7,-1,2,-3,3,0,-1,-4,-6,0,2,5,-4,1,1,-6,-6,3,2,-5,-9,0,0,-5,-4,2,-1,-5,-4,1,2,-5,-3,2,-4,-3,1,3,-3,-1,0,3,-3,0,0,-3,-3,4,-1,-4,-7,0,-5,-7,-5,3,-10,1,-2,-6,-13,-4,-3,-4,-13,4,-9,0,-11,6,-5,-5,-9,-2,-3,-3,-11,0,-1,3,-4,1,1,-4,-2,1,-8,-4,2,-2,-6,-3,12,-6,-3,-2,-1,3,-3,-4,2,-5,5,1,5,-11,-1,-5,6,-2,3,-4,8,-2,-1,-4,6,1,-3,-7,2,-5,-13,-11,4,8,-4,0,-1,-2,-15,-3,2,-3,-3,0,0,-2,-3,1,-3,-8,2,-1,-4,-1,2,-4,-3,-2,3,-4,-2,-1,2,0,0,-9,-2,-1,2,-1,-6,-9,-15,-11", // 7 EC | KZN
    "5803,6000,-6,6,-9,1,-4,5,-8,2,-5,4,-9,1,-4,3,-8,-1,-16,7,-24,-4,-10,6,-9,2,-12,-3,-1,4,-5,1,-3,5,0,7,-4,0,-8,6,-5,-2,-6,2,-6,6,3,4,7,3,0,4,3,2,-2,12,-15,4,-6,6,5,7,-5,9,2,4,-11,9,3,8,-2,5,-6,-4,-16,1,-13,-3,-5,-9,-7,3,-17,1,-11,-3,-9,-9,-1,-4,-17,-10,2,0,-2,-8,-8,-1,-2,-9,-4,-3,-6,1,-1,-4,-2,1,-3,-4,0,-7,-4,-1,-13,5,-3,-3", // 8 EC outer edge
    "5475,6065,-5,1,3,2,1,7,4,-4,3,7,-6,4,-7,-2,-3,5,7,0,2,2,-4,3,-10,-1,-1,3,7,5,-5,1,-1,4,-5,-2,-5,1,-2,-5,-2,6,-2,0,-1,-5,-6,8,-3,-3,-8,0,2,4,-7,6,-4,-4,1,-2,-17,1,-1,4,4,1,1,4,4,2,-3,3,-6,-2,-12,4,-2,3,4,6,-9,2,-5,-2,-3,5,-4,0,-8,-9,-16,5,-6,5,-5,-4,-3,4,-5,1,0,-7,-14,1,-11,-7,-4,0,1,-7,-8,-5,-10,0,-8,5,-16,-1,-3,-9,-14,-3,0,-5,-6,-4,-4,0,-3,3,4,3,-1,5,-10,-5,-24,5,-6,3,-1,6,-3,0,0,-4,-4,-4,-4,0,-3,3,5,9,-7,2,-3,4,-10,0,-6,11,-3,-2,-10,0,-4,-3,1,-4,-2,-1,-7,4,-6,-1,3,-6,-6,-7,-7,5,-9,0,-8,4,-2,-2", // 9 EC | FS
    "4729,6796,0,2,49,9,3,-2,42,7,16,0,21,8,19,2,19,12,9,0,13,4,6,-4,17,5,4,-2,7,3,5,-1,8,4,1,-4,6,0,-8,-5,3,-6,15,-12,2,-13,12,-7,18,-3,25,0,41,14,12,-1,32,4,6,-5,9,1,-7,-9,-9,-5,3,-1,-5,-1,-1,-4,6,-16,13,-12,27,-13,48,-4,22,4,21,8,17,-1,18,3,18,-5,35,-19,27,-6,13,-9,15,-2,7,-3,3,-4,11,-2,6,-8,13,-4,7,-7,34,-18,21,-16,25,-13,18,-16,18,-6,20,-11,-2,-1,2,-3,5,-2,2,-4,15,-7,-1,-2,14,-9,4,-8,-1,-4,8,-7,23,-7,6,-6,15,-5,0,-3,12,-12,17,-6,2,-4,5,-2,0,-4,5,-5,5,-2,0,-3,9,-3,7,-10,12,-8,1,-4,13,-9,3,-5,11,-5,3,-7,9,-5,3,-7,10,-8,2,-5,14,-8,-1,-3,8,-7,2,-7,9,-9,7,-1,0,-3,17,-21,10,-4,1,-9,10,-5,3,-9,8,-3,3,1,6,-5,8,-2,2,-4,23,-15,13,-14,0,-3,7,-4,13,0,8,-8,6,-2,0,-3,11,-7,1,-5,6,-2,15,-15,0,-3,10,-8,15,-20", // 10 EC outer edge
    "5475,6065,4,-4,-3,-1,2,-3,-5,-2,1,-17,3,1,-1,-4,2,1,0,-3,4,-3,-2,-2,-15,2,-6,-19,-5,-2,0,-4,-10,-3,1,-3,-27,-55,-15,-12,-1,-2,4,-2,-3,-4,4,-1,4,4,2,-8,4,4,14,-11,10,2,3,-5,5,2,6,-6,6,2,0,-8,5,-3,6,1,-1,-6,5,-3,3,-6,6,-1,-4,-8,4,2,3,-2,-1,-6,7,-3,-3,-4,7,0,1,-3,9,-5,2,-3,-6,-1,-1,-3,12,-8,1,-4,7,0,-3,-6,7,-1,0,-3,2,1,1,-6,-2,-2,7,0,0,-3,-5,-1,-2,-3,7,0,-1,-4,4,0,-2,-4,7,1,-2,-6,4,-1,1,-6,6,-1,-1,-9,9,5,6,-1,0,-2,8,3,5,-2,0,-6,5,-1,-1,-2,5,-3,10,7,1,-3,7,2,-1,-4,6,-4,-1,-4,5,-1,9,-15,8,-2,1,-5,4,1,0,-3,2,3,9,-3,9,4,4,-5,3,3,3,-2,3,2,5,-5,-2,-3,8,-4,-1,-4,2,-1,2,2,10,-5,5,0,2,3,4,-4,2,2,4,-2,7,2,6,-6,2,1,4,-3,10,8,-1,7,6,9,6,-1,10,5,1,12,2,1,8,-4,3,3", // 11 FS outer edge
    "5775,5754,5,-13,-1,-3,10,-8,-1,-4,7,-11,24,-6,8,4,7,-7,2,3,3,0,4,-5,-5,-5,12,-14,8,3,7,-3,-1,-4,11,-7,8,1,5,-11,8,-6,1,-4,13,-5,2,3,12,-4,1,-3,-3,-2,3,-6,8,-2,-2,-17,-8,-9,5,-6,-1,-4,3,-6,6,-2,-5,-7,7,-5,-1,-7,4,-1,-2,-6,7,-3,-1,-3,-3,0,0,-19,-8,-6,0,-4,10,-4,3,-5,3,2,0,-2,7,-2,-5,-14,-10,-1,0,-4,4,-2,-5,-4,1,-2,10,-3", // 12 FS | KZN
    "5952,5489,-6,-3,-6,4,0,9,-16,2,-5,-8,-7,-7,-3,0,-1,-9,-3,2,0,-4,-1,2,-3,-5,-4,1,1,-6,-4,-2,-1,-7,-7,-7,-14,-2,-6,4,1,-12,-6,2,-9,-7,-1,3,-3,-1,-2,-9,-12,-1,-11,6,-2,-8,-10,-10,4,-3,-5,-12,-4,5,-4,-5,-9,-3,-2,4,-12,1,-2,2,3,1,-2,6,-6,-7,-3,3,-4,-1,-2,2,-2,-7,-2,4,-8,-7,-4,1,-4,-6,-6,1,-10,-4,-6,8,10,0,-2,5,-7,-2,-5,6,-3,-1,-3,5,-4,1,3,-5,-9,-6,1,-5,-5,-3,-1,-4,-2,7,-5,-5,-2,1,3,3,-6,7,-1,-2,3,-3,-6,-11,-9,-1,-6,4,1,-5,-6,3,-4,-7,-3,2,-4,-6", // 13 FS | MP
    "5649,5377,-2,-1,-2,3,3,4,-3,2,-8,-7,-1,-7,-5,-2,3,9,-10,0,-1,-9,-10,-4,-5,-6,-5,0,3,-3,-5,-2,-3,-8,2,-7,-4,-5,-5,0,-6,7,-6,1,-2,7,-21,1,-2,10,-8,-8,-8,0,-5,3,-7,-1,0,-8,-8,2", // 14 FS | GP
    "5518,5348,-4,1,3,5,-2,2,-5,-1,-9,3,3,4,-2,6,-5,2,-2,7,-12,8,-5,-2,-1,-3,-3,1,0,-3,-7,-7,-7,0,-2,5,-11,9,-6,11,-6,-2,1,-9,-4,0,-3,3,-6,-3,-6,3,-9,0,-17,-8,-3,-6,-4,7,0,14,-2,-6,-10,-5,-2,4,-6,3,-3,-5,-18,9,-5,9,-3,-5,-11,2,-1,4,-7,6,3,5,-2,6,-11,-4,-6,9,-4,0,-1,4,-9,-1,-2,4,4,8,11,10,0,12,-3,1,0,-4,-7,9,8,6,6,1,-1,3,-12,-3,-7,4,-5,-3,-9,-1,-4,4,0,6,-6,-4,-6,0,-2,3,-3,0,-4,9,2,7,-12,5,-3,6,-6,0,-2,6,-6,0,-2,5,2,6,-6,4,8,2,0,2,-6,6,-8,3,-4,-6,1,-8,-3,-5,-3,0,0,-3,-7,2,-1,-4,-5,-2,-4,1,1,3,-6,1,-5,-4,-2,-9,-2,0,-4,4,-5,0,-14,8,-5,0,-2,2,1,8,-3,4,-5,-2,-2,-4,-8,-2,-4,5,-11,3,-5,-1,-4,4,-15,4,-6,4,-5,9,-13,0,-7,8,4,4,-1,2,-10,4,-7,7,-7,1,0,4,-9,8,3,6,-6,10,-9,2", // 15 FS | NW
    "6039,6216,6,-4,4,-8,11,-11,3,-8,16,-16,6,-12,40,-54,15,-28,7,-7,5,-13,25,-43,35,-36,1,-3,-4,0,-2,-6,5,-13,22,-36,11,-11,5,-9,17,-20,21,-19,2,-5,22,-18,40,-42,54,-21,39,-36,27,-21,8,-11,3,-10,11,2,5,-24,17,-27,7,-18,7,-40,1,-22,16,-56,0,-8,34,-84,8,-44,-11,-2,-33,2,-76,-1,0,-2,-3,2,-1,-2,-14,-1,-7,-3,-8,6,-8,-5,-4,0,-4,-7,-9,3,-7,-3,-2,1,-7,61,1,41,-97,-1,-44,-14", // 16 KZN outer edge
    "6255,5449,-22,25,-5,-1,-8,-7,-11,5,-3,-2,-2,3,-3,-2,0,2,-4,-1,-9,3,-3,-13,-12,2,-1,6,-8,2,2,-2,-2,-2,-2,1,-4,-5,-4,2,-1,-4,-5,0,-4,-4,-12,1,-20,8,-13,-4,-9,4,-5,-3,0,-9,-11,-1,-1,9,-9,-2,-8,3,0,11,-9,2,-1,-3,-6,-2,-4,5,-6,2,-1,5,-15,-10,-11,7,-7,-5,-13,-4,-3,6,-3,-2,-4,2,-5,-1,-1,5,-3,1,1,3,-6,7,-7,-3", // 17 KZN | MP
    "5775,5754,3,1,4,-3,7,5,-3,1,4,3,-6,2,6,3,1,5,-3,1,5,2,-2,1,4,3,1,5,5,-2,3,-5,4,7,8,1,-2,1,1,3,4,-1,7,7,-1,2,6,2,1,3,10,3,0,5,9,9,5,-3,6,0,9,11,-2,11,4,4,9,1,-1,4,3,1,0,5,4,2,0,9,3,4,-3,2,2,5,-3,5,-3,0,1,4,-3,0,-2,3,1,3,-8,5,-9,1,-1,3,-4,-1,2,4,-2,3,4,3,-2,4,4,3,-2,3,-6,0,2,5,-3,7,-12,0,-2,3,-9,3,-1,6,-3,2,1,4,-3,1,1,4,-3,1,1,13,-6,3,8,3,0,3,5,2,1,6,-12,4,-1,6,-4,-2,-14,9", // 18 KZN outer edge
    "5518,5348,-2,-2,4,-1,1,-7,-6,5,-1,-14,-27,-3,-2,4,-9,-8,-3,-7,-5,-1,-2,4,3,5,-21,4,-2,-13,-9,1,-4,-5,-2,-5,7,0,8,-4,-1,-12,-7,-13,28,-20,-8,-27,14,2,0,-8,12,0,3,-18,3,-2,1,-19,2,0,-2,-6,3,0,-2,-4,16,-3,21,-12,0,9,4,0,4,7,12,-5,0,9,17,-7,6,-8,6,1,-1,7,3,0,0,-4,8,-1,-3,-2,7,-2,-1,-3,2,0,-3,-8,6,-2,-6,-11,1,-10,5,-2,-4,-8,4,-10,14,3,0,-5,-12,-3,4,-8,5,-2,-9,-9,-4,3,-5,-7,5,-8,6,-1,11,8,11,-7,0,3,13,-3,0,-7,5,-1,6,6,14,-3,0,-6", // 19 GP | NW
    "5660,5062,-11,-19,-7,-3,-15,1,-1,-12,-7,1,-2,-10,14,-3,4,7,8,2,9,-16,-27,-9,-1,-5,-17,1,-10,-5,-6,2,-2,6,-31,-7,-21,6,0,-2,-11,-2,-7,2,0,9,-10,14,-5,-5,-7,1,-1,-3,-29,5,-4,-10,-9,-1,-9,6,1,-6,-5,0,4,-14,-8,-3,-6,6,-2,-7,-9,-9,-12,-3,-3,-33,-10,0,1,11,-7,0,-33,13,-6,9,-26,-15,-11,2,-21,-2,0,-4,-5,-1,-2,-3,-1,-20,2,-2,-4,-3", // 20 LP | NW
    "5282,4929,-3,-2,-78,18,-8,5,-23,1,-2,7,5,4,-1,3,3,1,3,10,-3,2,1,5,-4,2,-26,66,-6,7,-8,37,-16,33,-13,9,-9,2,-9,7,-17,8,-34,-1,-5,-2,-5,2,-4,-3,1,-2,-9,-1,-5,-3,-7,2,1,2,-8,5,-3,-1,1,2,-4,1,-1,3,-3,-1,-3,5,-17,0,-4,3,-1,-2,-16,-2,-6,4,-14,-5,-6,-5,-6,0,-21,-8,-14,6,-10,-7,0,-4,-7,3,-2,-1,2,-5,-5,3,-1,-4,-3,-1,1,-2,-5,-4,1,-2,-3,0,-4,-5,-7,2,1,-3,-2,-1,-3,1,0,3,-7,0,-4,3,-3,-3,-1,4,-6,-3,-6,3,1,-5,-7,-2,-4,1,-2,4,-8,-2,0,-5,-5,-3,0,-3,-8,-1,-1,-6,-4,2,-2,-3,3,-4,-11,-2,-3,-5,2,-2,-5,-2,-1,-3,-6,3,-1,-3,-6,-1,1,-5,-5,4,-2,-1,0,-4,-5,-1,2,-4,-3,-1,-1,3,-3,0,0,-4,-6,-1,1,-3,-7,-3,-5,3,-1,-7,-3,-4,-4,0,1,-5,-5,0,-4,8,-10,-2,-3,-4,-7,1,-2,-2,-3,3,-3,-4,-17,0,-6,6,-5,2,-7,-2,-5,5,-5,-2,1,-6,-6,5,-4,-4,1,7,-7,2,-2,8,-12,8,-5,10,3,3,-7,-1,-4,2,3,3,-1,6,-8,9,8,7,-11,4,3,4,3,0,-2,7,-4,7,-7,3,-1,10,-5,1,8,4,1,4,-9,4,1,5,-6,3,8,5,-5,6,0,13,-12,1,2,11,-9,4,0,6", // 21 NW outer edge
    "5649,5377,4,-4,9,3,3,-8,-1,-9,17,-7,-2,-9,-2,1,3,-13,9,0,0,-3,9,-1,-2,-4,6,-2,-1,-3,5,0,0,-18,9,3,-1,2,3,-1,0,4,11,1,-2,-4,6,-4,21,3,0,-10,5,-9,14,-5,-4,-12,-4,1,-3,-8,-19,7,-7,-6,-10,-4,-1,-8,-18,-5,1,-11,-2,2,-1,-7,-6,-4,2,-7,3,-2,-2,-3,7,-3,8,2,2,-12,8,-6,16,4,10,-1,3,6,4,-2,14,0,4,-6,0,-21,11,4,2,-11,-2,-2,8,-16,-6,-3,4,-11,19,-7,-2,-1,2,-3,-5,0,1,-8,-2,-3,13,-5,-4,-9,-4,6,-9,-2,1,3,-5,3,-2,-1,5,7,-13,5,-6,-8,-1,-7,-10,9,3,-9,-5,-5,-11,8,3,7,7,-2,5,19,-6,-1,-1,-4,-5,2,0,3,7,4,-5,3,-13,2,2,-12,-8,-3,-3,11,-5,-2,-12,-29,2,-2,-4,-10,3,-2,-2,-10,4,-3,-3,-12,14,-8,9,-1,-2,-4,7,-10,4,2,-8,-24,-19,7", // 22 GP | MP
    "5730,5029,-7,1,8,13,5,-1,0,2,-2,6,-2,-3,-5,9,-6,-6,-8,0,-13,3,1,9,-24,2,-1,-6,-16,4", // 23 GP | LP
    "6255,5449,-25,-9,-18,-21,-15,-12,-5,-9,3,-5,0,-11,-14,-10,-3,-15,-1,4,-14,8,-5,-27,0,-28,3,-21,17,-29,14,-12,31,-55,2,-13,28,-22,10,-13,20,-5,91,56,21,-9,-9,-23,15,-39,-2,-24,-3,0,-1,-10,8,-17,3,-30,1,-21,-7,-89,3,-47,-6,-31,-15,-24,-5,-39", // 24 MP outer edge
    "6377,4797,-12,0,-2,3,-8,-4,-8,6,1,6,-8,4,-4,-1,-3,-8,-9,2,-4,6,-3,0,-2,-4,-5,0,-1,4,-5,0,-3,-3,-13,-4,-2,7,-6,3,-4,-4,-3,4,-9,3,-5,-2,-6,5,-3,0,-1,-6,-10,-8,-4,1,-1,5,-20,5,3,2,7,-1,-1,6,-4,-1,2,6,-11,8,1,27,20,0,9,-3,8,12,-16,2,0,12,9,-2,10,15,-6,11,-53,5,-1,-12,-17,4,-14,-8,-8,-8,-6,8,0,22,-6,-5,-4,8,6,8,2,8,-8,6,-9,0,0,5,6,3,-2,7,-4,9,-3,-2,-2,5,-6,3,0,6,-3,-4,-14,4,0,8,-9,-9,-2,-9,-3,-2,-7,-1,1,4,-8,-4,0,7,-9,-2,-1,2,-2,-3,-21,-3,-4,27,2,0,4,9,-10,-1,-1,19,-11,0,0,-3,-12,-9,0,4,-10,1,5,11,2,17,-3,10,1,12,-13,-2,-10,2,0,5,-10,4,-3,-5,-6,0,-5,8,-19,-6,-12,6,-18,1,-1,4,-13,-4,-11,2,-10,-2,-2,-6,-15,0,-4,6,-8,2,-2,-9,-13,4,7,-7,2,-7,-2,-3,-14,3,-1,-6,-10,-3,-2,-5,3,-22,9,2,-1,-3,9,-4,-5,-3,-3,1,-4,-8,-10,-2,-10,3,-7,-14,-5,1,-4,-10,10,-4,-3,-7,-16,7,-2,-4,-15,-1,-9,9,-11,3,-11,7,6,11,-32,6,4,8,-10,0,-13,5,6,10,-5,2,15,-3,14,-6,1,-4,12,-1,11,-6,0,6", // 25 LP | MP
    "6377,4797,-1,-6,-22,-13,-15,-34,-1,-18,-26,-30,-2,-14,3,-42,-51,-156,-5,-3,-4,-8,-10,1,-8,-8,-7,0,-10,4,-18,-7,-4,3,-2,-3,-5,0,-3,-3,-6,-1,-4,2,-9,-3,-25,5,-9,-1,-7,5,-7,-3,-8,2,-13,-3,-22,7,-19,1,-11,-12,-22,3,-12,-11,-7,0,-1,-5,-10,-1,-9,-7,-8,1,-5,-4,-11,-2,-6,-5,-12,1,-3,-2,-5,1,-4,-3,-9,6,-6,-3,-9,3,-1,5,-13,-3,-26,8,-3,-4,-12,2,-4,-3,-6,0,-11,7,-24,0,-1,3,-3,0,-2,9,-5,2,-3,5,1,15,-9,14,-14,-1,-5,2,0,6,-19,3,-19,11,-16,0,-10,6,-6,-4,-26,0,-4,5,-10,4,-4,6,-10,4,-9,9,0,8,-3,4,-16,12,-6,1,1,14,-17,11,-4,-1,-1,12,2,4,-5,7,-14,7,-7,0,1,5,-2,1,-6,2,0,-3,-3,1,4,7,-10,13,-4,-1,-5,-7,-4,1,-4,5,-10,-2,0,6,-5,3,0,7,-3,4,2,2,-1,5,-7,7,-18,0,-2,8,-6,-2,2,-5,-7,2,1,4,-4,2,-2,-1,1,-5,-4,0,-6,13,-3,-1,-5,4,-1,-2,-5,3,0,2,-2,-2,-7,3,4,4,-2,3,-6,-3,-1,3,-6,-2,4,9,-5,1,-3,-3,-3,9,-4,-1,0,3,-4,0,4,6,-2,5,-6,3,-3,-8,-6,1,2,7,-7,4,-1,14,-3,4,2,7,-6,4,5,3,0,3,-5,8,0,7,-3,3,-1,12,-4,5,-1,7,-5,3,2,4,-2,3,4,4,-3,4,4,2,-5,5,1,7,-13,10,-5,0,-4,3,-4,-2,-6,3,0,3,-8,4,-1,6,-3,-1,-2,3,-9,3,-6,9,-10,7,-8,20,-9,6,-3,5"  // 26 LP outer edge
  ];
  // Each province ring as arc numbers in order; ~n walks arc n backwards.
  var RINGS = {
    WC: [0, 1, 2],
    NC: [3, 4, 5, ~0, 6],
    EC: [7, 8, 9, ~6, ~2, 10],
    FS: [11, 12, 13, 14, 15, ~3, ~9],
    KZN: [16, 17, ~12, 18, ~7],
    NW: [19, 20, 21, ~4, ~15],
    GP: [22, 23, ~19, ~14],
    MP: [~17, 24, 25, ~22, ~13],
    LP: [~25, 26, ~20, ~23]
  };

  function decodeArc(s) {
    var v = s.split(','), out = [], x = 0, y = 0;
    for (var i = 0; i < v.length; i += 2) { x += +v[i]; y += +v[i + 1]; out.push([x / 200, -y / 200]); }
    return out;
  }
  var ARC_PTS = ARCS.map(decodeArc);
  function ring(ids) {
    var out = [];
    ids.forEach(function (n, k) {
      var a = ARC_PTS[n < 0 ? ~n : n];
      if (n < 0) a = a.slice().reverse();
      out = out.concat(k ? a.slice(1) : a);
    });
    out.pop();
    return out;
  }
  var PROV = {};
  Object.keys(RINGS).forEach(function (c) { PROV[c] = ring(RINGS[c]); });

  var PROV_ORDER = ['NC','WC','EC','FS','NW','GP','MP','LP','KZN'];

  // Approximate seat town of every metro and local municipality (213). Umzumbe's offices sit outside
  // its boundary and Joe Morolong's seat isn't in the gazetteer, so those two use the middle of their wards.
  // District files have no dot; they show the province only.
  var MUNI_LOC = {
    jhb:[28.04,-26.20], cpt:[18.42,-33.92], tsh:[28.19,-25.75], eku:[28.23,-26.15],
    eth:[31.02,-29.86], nmb:[25.60,-33.96], buf:[27.91,-33.02], man:[26.16,-29.12],
    msunduzi:[30.39,-29.60], polokwane:[29.45,-23.90], rustenburg:[27.24,-25.67],
    mbombela:[30.98,-25.47], emalahleni:[29.23,-25.87], matlosana:[26.67,-26.85],
    solplaatje:[24.77,-28.74], stellenbosch:[18.86,-33.93],
    drakenstein:[18.97,-33.73], george:[22.46,-33.96], knysna:[23.05,-34.04],
    bitou:[23.37,-34.05], mosselbay:[22.13,-34.185], oudtshoorn:[22.20,-33.59],
    hessequa:[21.26,-34.09], kannaland:[21.27,-33.49], overstrand:[19.23,-34.42],
    capeagulhas:[20.04,-34.53], swellendam:[20.44,-34.02], theewaters:[19.43,-34.23],
    saldanha:[17.94,-33.01], swartland:[18.73,-33.46], bergrivier:[18.76,-32.91],
    cederberg:[18.89,-32.18], matzikama:[18.50,-31.67], breedevallei:[19.45,-33.65],
    langeberg:[19.88,-33.80], witzenberg:[19.31,-33.37], beaufortwest:[22.58,-32.36],
    laingsburg:[20.86,-33.20], prinsealbert:[22.03,-33.23],
    makana:[26.53,-33.31], ndlambe:[26.89,-33.59], kouga:[24.77,-34.03],
    ksd:[28.79,-31.59], mhlontlo:[28.88,-31.16], emgijima:[26.88,-31.90],
    inxuba:[25.62,-32.16], waltersisulu:[26.71,-30.69], raymondmhlaba:[26.63,-32.78],
    newcastle:[29.93,-27.76], umhlathuze:[32.04,-28.76], raynkonyeni:[30.45,-30.74],
    umngeni:[30.21,-29.49], endumeni:[30.24,-28.17], ulundi:[31.42,-28.33],
    alfredduma:[29.78,-28.55], inkosilang:[29.87,-29.01],
    metsimaholo:[27.82,-26.81], ngwathe:[27.46,-26.90], moqhaka:[27.23,-27.65],
    dihlabeng:[28.30,-28.23], maluti:[28.81,-28.53], matjhabeng:[26.72,-27.98],
    mahikeng:[25.64,-25.85], jbmarks:[27.10,-26.72], madibeng:[27.78,-25.63],
    naledi:[24.73,-26.96], ditsobotla:[26.16,-26.15],
    stevet:[29.46,-25.77], govanmbeki:[29.17,-26.52], msukaligwa:[29.98,-26.53],
    lekwa:[29.24,-26.95], bushbuckridge:[31.10,-24.84],
    tzaneen:[30.16,-23.83], mogalakwena:[29.01,-24.19], belabela:[28.29,-24.88],
    modimollemookgo:[28.41,-24.70], thulamela:[30.48,-22.95], musina:[30.04,-22.35],
    baphalaborwa:[31.14,-23.94], fetakgomo:[30.33,-24.68],
    dawidkruiper:[21.26,-28.45], gasegonyana:[23.43,-27.45], namakhoi:[17.89,-29.66],
    gamagara:[23.05,-27.70], emthanjeni:[24.01,-30.65], hantam:[19.78,-31.47],
    drbeyers:[24.53,-32.25], mnquma:[28.15,-32.33], winniemandela:[29.85,-30.86],
    ingquza:[29.50,-31.08], abaqulusi:[30.79,-27.77], kokstad:[29.42,-30.55],
    emfuleni:[27.84,-26.71], midvaal:[28.02,-26.56], lesedi:[28.36,-26.50], mogalecity:[27.78,-26.09], randwest:[27.70,-26.18],
    merafong:[27.40,-26.36],
    sundaysriver:[25.44,-33.40], bluecrane:[25.59,-32.72], koukamma:[24.29,-33.95], amahlathi:[27.42,-32.57], greatkei:[27.89,-32.58],
    mbhashe:[28.30,-32.10], ngqushwa:[27.11,-33.20], intsikayethu:[27.58,-32.00], emalahleniec:[27.23,-31.70], engcobo:[28.00,-31.68],
    sakhisizwe:[27.70,-31.52], senqu:[27.22,-30.71], elundini:[28.35,-31.07], matatiele:[28.81,-30.34], umzimvubu:[28.99,-30.90],
    ntabankulu:[29.30,-30.96], nyandeni:[29.02,-31.54], portstjohns:[29.54,-31.62],
    tsantsabane:[23.07,-28.33], umsobomvu:[25.10,-30.72], phokwane:[24.80,-27.75], kareeberg:[22.13,-30.97], ubuntu:[23.11,-31.40],
    siyancuma:[23.77,-29.06], siyathemba:[22.74,-29.67], renosterberg:[24.66,-30.08], thembelihle:[24.09,-29.62], kaigarib:[20.61,-28.77],
    kheis:[21.98,-28.90], kgatelopele:[23.54,-28.19], dikgatlong:[24.52,-28.54], magareng:[24.85,-28.11], karoohoogland:[20.92,-31.34],
    kamiesberg:[17.99,-30.56], richtersveld:[16.87,-29.25], khaima:[19.39,-29.13], joemorolong:[23.66,-26.91],
    setsoto:[27.88,-28.87], nala:[26.62,-27.39], mafube:[28.50,-27.28], mantsopa:[27.46,-29.19], nketoana:[28.43,-27.80],
    phumelela:[29.17,-27.43], tswelopele:[26.15,-28.29], masilonyana:[26.70,-28.41], mohokare:[27.08,-30.30], kopanong:[25.78,-30.03],
    letsemeng:[25.00,-29.41], tokologo:[25.24,-28.54],
    umlalazi:[31.47,-28.89], mtubatuba:[32.18,-28.42], umshwathi:[30.58,-29.43], mpofana:[29.99,-29.21], richmondkzn:[30.27,-29.87],
    mkhambathini:[30.54,-29.73], umdoni:[30.75,-30.29], umuziwabantu:[29.88,-30.58], kwadukuza:[31.29,-29.33], mandeni:[31.41,-29.15],
    nkandla:[31.09,-28.62], mthonjaneni:[31.40,-28.59], nongoma:[31.65,-27.91], uphongolo:[31.62,-27.38], jozini:[32.07,-27.43],
    bigfive:[31.88,-28.15], okhahlamba:[29.35,-28.73], nquthu:[30.68,-28.21], msinga:[30.45,-28.75], umvoti:[30.59,-29.06],
    dannhauser:[30.06,-28.02], umzimkhulu:[29.94,-30.26], ubuhlebezwe:[30.08,-30.15], kwasani:[29.84,-30.03], maphumulo:[31.07,-29.16],
    edumbe:[30.82,-27.42], mfolozi:[32.09,-28.60], umhlabuyalingana:[32.75,-26.99], ndwedwe:[30.93,-29.52], impendle:[29.87,-29.60],
    emadlangeni:[30.32,-27.66], umzumbe:[30.46,-30.51],
    moseskotane:[27.22,-25.28], kgetlengrivier:[26.90,-25.86], moretele:[28.13,-25.24], ramotshere:[26.08,-25.54], tswaing:[25.46,-26.69],
    greatertaung:[24.79,-27.53], lekwateemane:[25.16,-27.91], mamusa:[25.33,-27.19], maquassi:[25.98,-27.20], ratlou:[25.11,-26.28],
    kagisanomolopo:[24.18,-26.60],
    mkhondo:[30.81,-27.01], thembisile:[28.70,-25.43], emakhazeni:[30.04,-25.69], victorkhanye:[28.68,-26.15], jsmoroka:[29.04,-25.11],
    dipaleseng:[28.59,-26.66], albertluthuli:[30.11,-26.07], nkomazi:[31.51,-25.49], thabachweu:[30.44,-25.10], pixleymp:[29.88,-27.37],
    lephalale:[27.74,-23.67], giyani:[30.72,-23.30], lepellenkumpi:[29.50,-24.31], makhado:[29.90,-23.04], collinschabane:[30.67,-22.97],
    greaterletaba:[30.14,-23.69], maruleng:[30.95,-24.35], molemole:[29.32,-23.37], blouberg:[29.14,-23.29], eliasmotsoaledi:[29.39,-25.17],
    makhuduthamaga:[29.87,-24.76], ephraimmogale:[29.29,-24.97], thabazimbi:[27.41,-24.59]
  };

  // ---- projection: lon/lat → SVG units (aspect-corrected equirectangular)
  var LON0 = 16.20, LON1 = 33.10, LAT0 = -35.15, LAT1 = -21.90;
  var KX   = Math.cos(28.4 * Math.PI / 180);
  var PAD  = 10, W = 240;
  var SXMAX = (LON1 - LON0) * KX;
  var H = Math.round(W * (LAT1 - LAT0) / SXMAX);

  function project(pt) {
    var x = (pt[0] - LON0) * KX / SXMAX * W + PAD;
    var y = (LAT1 - pt[1]) / (LAT1 - LAT0) * H + PAD;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }
  function toPath(ring) {
    return ring.map(function (p, i) {
      var q = project(p);
      return (i ? 'L' : 'M') + q[0] + ' ' + q[1];
    }).join(' ') + 'Z';
  }

  // ---- v20 · the red light ---------------------------------
  // It breathes (CSS) and sends out a faint ring that fades as it spreads, on a loop.
  // With reduced motion the ring is left out and the CSS stops the breathing.
  var VBW = W + PAD * 2, VBH = H + PAD * 2;
  function ripple() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return '';
    return '<circle r="5.4" fill="none" stroke="rgb(255,140,130)" stroke-width="0.6" opacity="0">' +
      '<animate attributeName="r" values="5.4;30" keyTimes="0;1" calcMode="spline" keySplines="0.15 0.55 0.35 1" dur="2.6s" repeatCount="indefinite"/>' +
      '<animate attributeName="opacity" values="0.6;0;0" keyTimes="0;0.65;1" dur="2.6s" repeatCount="indefinite"/>' +
    '</circle>';
  }

  function buildSVG(muniKey, provCode) {
    var loc = MUNI_LOC.hasOwnProperty(muniKey) ? MUNI_LOC[muniKey] : null;
    var d   = loc ? project(loc) : null;
    // v20 · the home province is drawn last, so its red edge isn't painted over by its neighbours
    var order = PROV_ORDER.filter(function (c) { return c !== provCode; });
    if (PROV[provCode]) order.push(provCode);
    var shapes = order.map(function (code) {
      var home = (code === provCode), sw = home ? '0.9' : '0.7';
      return '<path d="' + toPath(PROV[code]) + '" ' +
        'fill="' + (home ? 'rgba(226,36,26,0.20)' : 'rgba(255,255,255,0.05)') + '" ' +
        'stroke="' + (home ? 'rgba(255,140,130,0.65)' : 'rgba(255,255,255,0.34)') + '" ' +
        'stroke-width="' + sw + '" stroke-linejoin="round"/>';
    }).join('');
    return (
      '<svg viewBox="0 0 ' + VBW + ' ' + VBH + '" width="100%" height="100%" ' +
        'role="img" aria-label="Locator map of South Africa" preserveAspectRatio="xMaxYMin meet">' +
        '<defs>' +
          // v20 · a touch brighter than v19: the breathing (CSS) dims it from here, so on average it matches
          '<radialGradient id="sal-halo">' +
            '<stop offset="0%" stop-color="#E2241A" stop-opacity="0.55"/>' +
            '<stop offset="28%" stop-color="#E2241A" stop-opacity="0.264"/>' +
            '<stop offset="58%" stop-color="#E2241A" stop-opacity="0.11"/>' +
            '<stop offset="80%" stop-color="#E2241A" stop-opacity="0.044"/>' +
            '<stop offset="100%" stop-color="#E2241A" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<filter id="sal-fuzz" x="-70%" y="-70%" width="240%" height="240%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="7" result="sal-n"/>' +
            '<feDisplacementMap in="SourceGraphic" in2="sal-n" scale="6" xChannelSelector="R" yChannelSelector="G" result="sal-d"/>' +
            '<feGaussianBlur in="sal-d" stdDeviation="3"/>' +
          '</filter>' +
        '</defs>' +
        shapes +
          (d ? '<g class="sal-pin" transform="translate(' + d[0] + ' ' + d[1] + ')">' + ripple() + '<g class="sal-light">' +
            '<circle r="27" fill="url(#sal-halo)"/>' +
            '<circle r="5.4" fill="#E2241A" opacity="0.82" filter="url(#sal-fuzz)"/>' +
          '</g></g>' : '') +
      '</svg>'
    );
  }

  window.SA_LOCATOR = {
    render: function (el, muniKey, provCode) {
      if (el) el.innerHTML = buildSVG(muniKey, provCode);
    },
    // v19 · used only by the SAMPLE "Use my location" stand-in: the council whose seat town is
    // nearest a point (null outside South Africa's bounding box). Not ward-accurate.
    // post-elections · the geometry, for the councils map in Results across South Africa
    geo: { prov: PROV, loc: MUNI_LOC, project: project, path: toPath, w: VBW, h: VBH, order: PROV_ORDER },
    nearest: function (lng, lat) {
      if (!(lat < -22 && lat > -35 && lng > 16.3 && lng < 33)) return null;
      var best = null, bd = Infinity, kx = Math.cos(lat * Math.PI / 180);
      Object.keys(MUNI_LOC).forEach(function (k) {
        var p = MUNI_LOC[k], dx = (p[0] - lng) * kx, dy = p[1] - lat, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }
  };
}());
});

/* ==== responsibilities explainer ==== */
guard("responsibilities explainer", function () {
/* "What is this council responsible for?" — approved editorial copy, verbatim.
   Powers are set by national law (Constitution Schedules 4B & 5B; Municipal Structures Act s84) and depend on the
   type of municipality, so there is one template for metros and one for locals (which names the local's district).
   District files use their own explainer in the finder. */
(function () {
  'use strict';

  var METRO_RUNS = [
    ['Water &amp; sanitation', 'Piped water to your home, sewage and waste-water treatment.'],
    ['Electricity', 'Distribution and billing where the metro is your supplier (in some areas Eskom supplies you directly).'],
    ['Refuse &amp; cleaning', 'Household refuse removal, landfill sites, street sweeping.'],
    ['Roads &amp; stormwater', 'Municipal roads and potholes, traffic lights, stormwater drains.'],
    ['Public transport', 'Municipal bus / BRT services, taxi ranks, route licensing.'],
    ['By-laws &amp; enforcement', 'Metro police, traffic and parking, liquor and food-trading licences, noise.'],
    ['Planning &amp; building', 'Zoning, land-use decisions, building-plan approvals.'],
    ['Amenities &amp; safety', 'Parks, libraries, sports facilities, cemeteries, beaches, fire and rescue, municipal health inspection.']
  ];

  var LOCAL_RUNS = [
    ['Water, sewage &amp; electricity to your home', 'The local reticulation network &ndash; the pipes and lines that reach your house (where the council is the supplier).'],
    ['Refuse removal &amp; street cleaning', 'Household bins, local dumps, keeping streets clean.'],
    ['Local roads &amp; stormwater', 'Municipal roads and potholes, street lighting, stormwater drains.'],
    ['By-laws &amp; licences', 'Traffic and parking, noise, liquor and food-trading licences, enforcement.'],
    ['Planning &amp; building', 'Zoning, land use, building-plan approvals.'],
    ['Local amenities', 'Parks, libraries, sports facilities, local cemeteries.']
  ];

  var DISTRICT_RUNS = [
    ['District-wide planning', 'The integrated development plan for the whole district.'],
    ['Bulk water &amp; electricity', 'Bulk supply that feeds the local councils&rsquo; networks.'],
    ['Bulk sewage &amp; regional landfill', 'Main waste-water treatment and disposal sites serving the area.'],
    ['Regional roads &amp; transport', 'Roads and passenger-transport regulation across the district.'],
    ['District health &amp; fire', 'Municipal health services and area-wide fire-fighting.'],
    ['Shared facilities', 'Fresh-produce markets, abattoirs and cemeteries serving the whole area; distributing some grants.']
  ];

  // The universal "this is NOT your council" list — appears in all three templates.
  var NOT_COUNCIL = [
    ['Housing / RDP houses', 'Provincial Department of Human Settlements (a council can be accredited to deliver, but the mandate is provincial).'],
    ['Clinics &amp; hospitals', 'Provincial Department of Health.'],
    ['Schools &amp; education', 'Provincial and national education departments.'],
    ['Police &amp; crime (SAPS)', 'National government. Metro / municipal police only enforce by-laws and traffic.'],
    ['Social grants (Sassa)', 'National government.'],
    ['National &amp; provincial roads', 'N-roads, most R-roads and Sanral routes are not municipal.'],
    ['Electricity generation', 'Eskom / national. Your council only distributes power, it doesn&rsquo;t generate it.']
  ];

  function listHTML(rows, accent) {
    return '<ul class="mf-resp-list">' + rows.map(function (r) { return li(accent, r[0], r[1]); }).join('') + '</ul>';
  }

  // Returns the explainer HTML for a metro or local municipality record.
  function build(m, shortName) {
    var name = esc(shortName || (m && m.n) || 'this council');
    var type = m && m.t;
    var BLU = 'var(--dm-blue)', GRN = 'var(--dm-green)', RED = 'var(--dm-red-cta)';
    var intro, runsHd, runs, secondHd, second, caveat = '';

    if (type === 'Metropolitan') {
      intro = '<b>' + name + '</b> is a <b>metro</b> &ndash; a single-tier council. It holds both the ' +
        'local and the district powers itself, so it is responsible for almost every basic service where you live.';
      runsHd = 'What ' + name + ' runs';
      runs = listHTML(METRO_RUNS, BLU);
    } else {
      // Local municipality
      var dist = m && m.dm ? '<a class="mf-dm-link" href="#mf-widget" data-dm="' + esc(m.dm) + '">' + esc(m.dm) + '</a>' : 'its district municipality';
      intro = '<b>' + name + '</b> is a <b>local</b> municipality. It shares the job with <b>' + dist + '</b> &ndash; ' +
        name + ' runs the day-to-day services where you live, while the district handles bulk and shared functions.';
      runsHd = 'What ' + name + ' runs';
      runs = listHTML(LOCAL_RUNS, BLU);
      secondHd = 'What ' + dist + ' handles';
      second = listHTML(DISTRICT_RUNS, GRN);
      caveat = '<p class="mf-resp-caveat">The exact local/district split can be reassigned by the provincial MEC ' +
        '(member of the executive council), so a few functions may sit on the other side in your area.</p>';
    }

    var html =
      '<p class="mf-resp-intro">' + intro + '</p>' +
      '<div class="mf-resp-sec"><h4 class="mf-resp-h" style="color:var(--dm-blue)">' + runsHd + '</h4>' + runs + '</div>' +
      (second ? '<div class="mf-resp-sec"><h4 class="mf-resp-h" style="color:var(--dm-green)">' + secondHd + '</h4>' + second + '</div>' : '') +
      caveat +
      '<div class="mf-resp-sec"><h4 class="mf-resp-h" style="color:var(--dm-red-cta)">Not your council&rsquo;s job, a common mix-up</h4>' +
        listHTML(NOT_COUNCIL, RED) + '</div>' +
      '<p class="mf-resp-src">Powers are set nationally by the Constitution (Schedules 4B &amp; 5B) and the ' +
        'Municipal Structures Act &ndash; they depend on the <b>type</b> of municipality, not the individual council.</p>';

    return html;
  }

  window.SA_RESPONSIBILITIES = { build: build };
}());
});

/* ==== ward candidates (data files) ====
   Fast build: the ward candidates per province (IEC certified list, 16 September 2026) are not in this file. A province's list is read
   from the data files (ward-candidates-{EC|FS|GP|KZN|LP|MP|NC|NW|WC}.json, see "data files" at the top of this file) the first time a
   council in it is opened: loadWardProv in "municipality finder". */

/* ==== council stories ==== */
guard("council stories", function () {
// Municipality file: Daily Maverick stories for the open council, read from dailymaverick.co.za only (dm-feed.js).
// Councils with a DM tag read that tag. Every other council gets the local-elections-2026 stories
// that name it in the headline or standfirst; the block stays hidden when none do.
(function () {
  'use strict';

  var TAGS = {
    jhb:    ['City of Johannesburg', 'city-of-johannesburg'],
    cpt:    ['City of Cape Town', 'city-of-cape-town'],
    eth:    ['eThekwini Municipality', 'ethekwini-municipality'],
    eku:    ['City of Ekurhuleni Metropolitan Municipality', 'city-of-ekurhuleni-metropolitan-municipality'],
    tsh:    ['City of Tshwane Metropolitan Municipality', 'city-of-tshwane-metropolitan-municipality'],
    nmb:    ['Nelson Mandela Bay', 'nelson-mandela-bay'],
    buf:    ['Buffalo City Metropolitan Municipality', 'buffalo-city-metropolitan-municipality'],
    man:    ['Mangaung Metropolitan Municipality', 'mangaung-metropolitan-municipality'],
    makana: ['Makana Local Municipality', 'makana-local-municipality']
  };
  var ELECTIONS_TAG = 'local-elections-2026';

  // Tag pages as read on 24 September 2026. Shown only when dailymaverick.co.za can't be reached.
  var SNAP = {
    makana: [
      { headline: 'Infamous water pump is now in Makhanda, but accountability is missing', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2026-07-12-infamous-water-pump-is-now-in-makhanda-but-accountability-is-missing/' },
      { headline: 'Makhanda residents go to High Court over worsening stray animal problem', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2025-10-15-high-court-asked-to-intervene-in-makhandas-ongoing-stray-animal-crisis/' },
      { headline: 'Lost-and-found Makhanda water pump \u2014 residents to finally get it back, with an even heftier price tag', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2025-09-22-lost-and-found-makhanda-water-pump-residents-to-finally-get-it-back/' },
      { headline: 'Makana Municipality faces allegations of fraud and corruption over missing R2.6m water pump', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2025-08-02-makana-municipality-faces-allegations-of-fraud-and-corruption-over-missing-r2-6m-water-pump/' },
      { headline: 'Why I fled Makhanda \u2014 fired Cogta\u2019s Mr Fixit says his life was threatened', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2025-06-08-why-i-fled-makhanda-fired-cogtas-mr-fixit-says-life-was-threatened/' },
      { headline: 'Mayor insists they will solve Makhanda\u2019s many problems as hundreds gear up to demand her removal', byline: 'By Estelle Ellis', href: 'https://www.dailymaverick.co.za/article/2025-02-25-mayor-insists-they-will-solve-makhandas-problems-as-hundreds-gear-up-to-demand-her-removal/' }
    ]
  };

  var LIMIT = 6;
  var SWATCH = ['#7F8CA0','#B9AE9B','#9DB596','#DE6A4E','#9A9BB5','#C6B08C','#A8A487','#8697AC'];
  var cache = {}, ticket = 0;

  function shortName(n) {
    return String(n || '')
      .replace(/\s+(Local|Metropolitan|District)\s+Municipality$/i, '')
      .replace(/\s+(Municipality|Metro)$/i, '')
      .replace(/^City of\s+/i, '').trim();
  }

  function source(key, fullName) {
    var t = TAGS[key];
    if (t) return { kind: 'tag', label: t[0], slug: t[1], page: 'https://www.dailymaverick.co.za/article_tag/' + t[1] + '/' };
    var name = shortName(fullName);
    return { kind: 'name', label: name, name: name, slug: ELECTIONS_TAG, page: '' };
  }

  // Stories whose headline or standfirst names the council (whole-word match).
  function naming(items, name) {
    if (!name || name.length < 4) return [];
    var n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    var re = new RegExp('(^|[^A-Za-z\\u00C0-\\u024F])' + n + '(?![A-Za-z\\u00C0-\\u024F])', 'i');
    return (items || []).filter(function (a) { return re.test(a.headline + ' ' + (a.blurb || '')); });
  }

  function card(a, i) {
    var bg = a.img ? "url('" + esc(a.img.replace(/'/g, '%27')) + "') center/cover no-repeat" : SWATCH[i % SWATCH.length];
    return '<a class="mf-story" href="' + esc(a.href) + '" target="_blank" rel="noopener">' +
        '<div class="thumb" style="background:' + bg + ';"></div>' +
        '<h4>' + esc(a.headline) + '</h4>' +
        '<p class="byline">' + esc(a.byline) + '</p>' +
      '</a>';
  }

  function paint(el, src, items, state) {
    var list = (items || []).slice(0, LIMIT);
    if (state !== 'loading' && !list.length) { el.hidden = true; el.innerHTML = ''; return; }
    el.innerHTML =
      '<div class="mf-stories-head">' +
        '<div><h3>' + (src.kind === 'tag' ? 'Stories tagged to ' : 'Stories on ') + esc(src.label) + '</h3></div>' +
        (src.page ? '<a class="mf-stories-all" href="' + esc(src.page) + '" target="_blank" rel="noopener">See all stories</a>' : '') +
      '</div>' +
      (list.length ? '<div class="mf-stories-grid">' + list.map(card).join('') + '</div>' : '');
    el.hidden = false;
  }

  function render(el, m, key, name) {
    if (!el) return;
    var src = source(key, (m && m.n) || name);
    var t = ++ticket;
    if (cache[key]) return paint(el, src, cache[key].items, cache[key].state);
    if (src.kind === 'tag') paint(el, src, null, 'loading');
    else { el.hidden = true; el.innerHTML = ''; }
    if (window.DMFeed) window.DMFeed.tag(src.slug, done); else done(null);
    function done(items) {
      var res = items ? { items: src.kind === 'name' ? naming(items, src.name) : items, state: 'live' }
        : SNAP[key] ? { items: SNAP[key], state: 'snap' }
        : { items: null, state: 'none' };
      cache[key] = res;
      if (t === ticket) paint(el, src, res.items, res.state);
    }
  }

  window.MuniStories = { render: render, cancel: function () { ticket++; } };
})();
});

/* ==== v24 · IEC data for the elections API hooks (no developer setup) ====
   While data-api is empty, this block fills window.DM_EH_API (see the top of this file) from public sources, so
   "Use my location", the council vote breakdown and the ward box work on dailymaverick.co.za as they are:
     municipality(key)  governed by and mayor as before (fact-checked), plus the council's 2021 vote breakdown
                        from the Electoral Commission, read through Daily Maverick's RevEngine IEC service
                        (https://iec-api.revengine.dailymaverick.co.za, the source behind the DM results dashboards)
     ward(key, n, id)   the ward's 2021 result from the same service: who won it and the vote breakdown.
                        A ward number that didn't exist in 2021 has no result, so its box stays hidden.
     locate(pos)        the 2026 ward for the reader's location (v26). The wards whose extent holds the point (usually two
                        to six, from WARD_GEO below) are fetched with their real boundaries from the MDB's public 2026 ward
                        service, and the point is tested against them in the browser. Only those ward IDs are sent, never
                        the location. If the service doesn't answer within 8 s, the nearest ward centre is used, which
                        near a boundary can be the neighbouring ward (the v24 method).
   Setting data-api switches all three to the Daily Maverick elections service instead. */
guard("IEC data", function () {
  if (ehApiBase() || window.DM_EH_API) return;
  var BASE = 'https://iec-api.revengine.dailymaverick.co.za/local/2021';
  var SRC = 'Electoral Commission of South Africa, 2021 local government election';
  var PROVS = window.SA_PROVINCES || {}, MUNIS = window.SA_MUNIS || {}, WIX = window.SA_WARD_INDEX || {};
  var memo = {};
  function getJ(path) {
    if (memo[path]) return memo[path];
    var p = new Promise(function (resolve, reject) {
      if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 12 s')); }, 12000);
      fetch(BASE + path, { credentials: 'omit', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (r.status === 404) return null; if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) { clearTimeout(timer); resolve(d); }, function (e) { clearTimeout(timer); reject(e); });
    });
    memo[path] = p;
    p.catch(function (e) { delete memo[path]; if (window.console) console.warn('[elections-hub] IEC ' + path + ': ' + ((e && e.message) || e)); });
    return p;
  }
  // IEC council codes (JHB, WC024 ...) to this file's keys, through the ward ID prefixes in SA_WARD_INDEX.
  var PDIG = { WC: '1', EC: '2', NC: '3', FS: '4', KZN: '5', NW: '6', GT: '7', MP: '8', LIM: '9' };
  var METRO = { JHB: 'jhb', TSH: 'tsh', EKU: 'eku', CPT: 'cpt', ETH: 'eth', NMA: 'nmb', BUF: 'buf', MAN: 'man' };
  var BY_PREFIX = {};
  Object.keys(WIX).forEach(function (k) { if (WIX[k] && WIX[k][1]) BY_PREFIX[WIX[k][1]] = k; });
  function keyFor(code) {
    if (METRO[code]) return METRO[code];
    var m = /^([A-Z]{2,3})(\d{2})(\d)$/.exec(code);
    return m && PDIG[m[1]] ? BY_PREFIX[PDIG[m[1]] + m[2] + '0' + m[3]] || null : null;
  }
  var IX = {}, provP = {};
  function province(pc) {
    if (!provP[pc]) provP[pc] = getJ('/provinces/' + encodeURIComponent(PROVS[pc])).then(function (d) {
      ((d && d.municipal_results) || []).forEach(function (e) {
        var k = keyFor(String(e.municipality_name || '').split(' - ')[0].trim());
        if (k) IX[k] = e;
      });
      return d;
    });
    provP[pc].catch(function () { delete provP[pc]; });
    return provP[pc];
  }
  var ABBR = { ACTIONSA: 'ActionSA', 'VF PLUS': 'FF+', ALJAMA: 'Al Jama-ah', CAPEXIT: 'CapeXit' };
  var SMALL = { of: 1, the: 1, and: 1, for: 1, in: 1 };
  function title(s) {
    return String(s).toLowerCase().split(' ').map(function (w, i) {
      if (!w || (i && SMALL[w])) return w;
      return /^(sa|rsa)$/.test(w) ? w.toUpperCase() : w.replace(/(^|[-\/(])([a-z])/g, function (x, a, b) { return a + b.toUpperCase(); });
    }).join(' ');
  }
  function rows(list) {
    return (list || []).filter(function (r) { return +r.vote_perc > 0; }).map(function (r) {
      var s = String(r.party_name || '').replace(/\s+/g, ' ').trim(), k = s.indexOf(' - ');
      var ab = k > 0 && k <= 14 ? s.slice(0, k) : '', full = k > 0 && k <= 14 ? s.slice(k + 3) : s;
      if (+r.party_id === 0 || /^independent$/i.test(full)) return { party: 'Independent', name: 'Independent candidates', pct: +r.vote_perc };
      ab = ABBR[ab.toUpperCase()] || ab;
      var nm = ab && ab.toUpperCase() === full.toUpperCase() ? ab : title(full);
      return { party: ab || nm, name: nm, pct: +r.vote_perc };
    }).sort(function (a, b) { return b.pct - a.pct; });
  }
  var NAMES = { ANC: 'African National Congress', DA: 'Democratic Alliance', EFF: 'Economic Freedom Fighters', IFP: 'Inkatha Freedom Party', MK: 'uMkhonto weSizwe', ActionSA: 'ActionSA', PA: 'Patriotic Alliance', ICOSA: 'Independent Civic Organisation of South Africa', GOOD: 'GOOD', UDM: 'United Democratic Movement' };
  function municipality(key) {
    var g = EH_GOV[key], m = MUNIS[key], base = g ? { gov: g[0], mayor: g[1] } : null;
    var lead = g ? (g[0].match(/\b(ANC|DA|EFF|IFP|MK|PA|ActionSA|ICOSA|GOOD|UDM)\b/) || [])[1] : null;
    if (!m || m.dtype === 'district' || !PROVS[m.p]) return base;
    return province(m.p).then(function () {
      var e = IX[key], res = e ? rows(e.party_ballot_results) : [];
      if (!res.length) return base;
      var out = base ? { gov: base.gov, mayor: base.mayor } : {};
      out.results = res; out.year = '2021'; out.source = SRC;
      if (lead) { out.party = lead; out.name = NAMES[lead] || lead; }
      return out;
    }, function () { return base; });
  }
  function ward(key, wn, wid) {
    var m = MUNIS[key];
    if (!m || !PROVS[m.p]) return null;
    return province(m.p).then(function () {
      var e = IX[key];
      return e ? getJ('/provinces/' + encodeURIComponent(PROVS[m.p]) + '/municipalities/' + e.municipality_id + '/wards/' + encodeURIComponent(wid)) : null;
    }).then(function (d) {
      var res = d ? rows(d.party_ballot_results) : [];
      return res.length ? { party: res[0].party, name: res[0].name, results: res, year: '2021', source: SRC } : null;
    });
  }
  /* MDB 2026 wards: "prefix:n,x,y,a,b,c,d|n,...;..." — ward n of the council whose ward IDs start with prefix; x, y its centre
     (longitude, latitude) in thousandths of a degree; a, b, c, d how far its extent reaches west, south, east and north of the centre. */
  var WARD_GEO = '';   // fast build: filled from the data files' ward-geo.json on the first Use my location (geo below)
  var WARDS = null, geoP = null;
  // fast build: the ward extents come from the data files (see "data files" at the top of this file), read once, on the first Use my location
  function geo() {
    if (WARDS) return Promise.resolve(WARDS);
    if (geoP) return geoP;
    geoP = ehFilesJSON('/ward-geo.json').then(function (d) {
      var s = d && typeof d.geo === 'string' ? d.geo : '';
      if (!s) throw new Error('ward-geo.json: no ward extents in it');
      WARD_GEO = s;
      return wards();
    });
    geoP.catch(function () { geoP = null; });
    return geoP;
  }
  function wards() {
    if (WARDS) return WARDS;
    WARDS = [];
    WARD_GEO.split(';').forEach(function (grp) {
      var i = grp.indexOf(':'), pre = grp.slice(0, i);
      grp.slice(i + 1).split('|').forEach(function (w) {
        var v = w.split(',').map(Number), x = v[1] / 1000, y = v[2] / 1000;
        WARDS.push([pre + ('00' + v[0]).slice(-3), x, y, x - v[3] / 1000, y - v[4] / 1000, x + v[5] / 1000, y + v[6] / 1000]);
      });
    });
    return WARDS;
  }
  // v26 · real boundaries for the nearby wards, from the MDB's public 2026 ward service (CORS open, no key), kept for the visit.
  var MDB_WARDS = 'https://services7.arcgis.com/oeoyTUJC8HEeYsRB/arcgis/rest/services/MDB_Wards_2026/FeatureServer/0/query';
  var SHAPES = {};
  function shapes(ids) {
    var need = ids.filter(function (id) { return !SHAPES[id]; });
    if (!need.length) return Promise.resolve();
    if (!window.fetch) return Promise.reject(new Error('fetch unavailable'));
    var url = MDB_WARDS + '?f=json&outFields=WardID&returnGeometry=true&outSR=4326&geometryPrecision=5&maxAllowableOffset=0.00003&where=' +
      encodeURIComponent("WardID IN ('" + need.join("','") + "')");
    return new Promise(function (resolve, reject) {
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 8 s')); }, 8000);
      fetch(url, { credentials: 'omit', signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (d) {
          if (!d || d.error || !d.features) throw new Error((d && d.error && d.error.message) || 'no wards in the answer');
          d.features.forEach(function (f) { if (f.attributes && f.geometry && f.geometry.rings) SHAPES[f.attributes.WardID] = f.geometry.rings; });
          clearTimeout(timer); resolve();
        })
        .catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }
  // Even-odd test over all rings, so holes in a ward are handled.
  function inShape(lng, lat, rings) {
    var c = false;
    rings.forEach(function (r) {
      for (var i = 0, j = r.length - 1; i < r.length; j = i++) {
        if ((r[i][1] > lat) !== (r[j][1] > lat) && lng < (r[j][0] - r[i][0]) * (lat - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c;
      }
    });
    return c;
  }
  function locate(pos) {
    var lat = +pos.lat, lng = +pos.lng;
    if (!(lat < -22 && lat > -35.2 && lng > 16.3 && lng < 33.1)) return null;
    return geo().then(function () { return locateIn(pos, lat, lng); });   // fast build: the ward extents first
  }
  function locateIn(pos, lat, lng) {
    var kx = Math.cos(lat * Math.PI / 180), M = 0.002, all = [];
    wards().forEach(function (w) {
      var dx = (w[1] - lng) * kx, dy = w[2] - lat;
      all.push({ id: w[0], d: dx * dx + dy * dy,
        box: lng >= w[3] && lng <= w[5] && lat >= w[4] && lat <= w[6],
        near: lng >= w[3] - M && lng <= w[5] + M && lat >= w[4] - M && lat <= w[6] + M });
    });
    all.sort(function (a, b) { return a.d - b.d; });
    // The v24 guess: the nearest ward centre among the wards whose extent holds the point.
    var guess = (all.filter(function (w) { return w.box; })[0] || all[0]).id;
    // Candidates: those extents widened by about 200 m (WARD_GEO is rounded), plus the nearest centre.
    var ids = all.filter(function (w) { return w.near; }).slice(0, 12).map(function (w) { return w.id; });
    if (ids.indexOf(all[0].id) < 0) ids.unshift(all[0].id);
    // A rough fix (over 150 m, typical of laptops on Wi-Fi) keeps the "in or near" wording.
    var sure = !(+pos.accuracy > 150);
    return shapes(ids).then(function () {
      for (var i = 0; i < ids.length; i++) if (SHAPES[ids[i]] && inShape(lng, lat, SHAPES[ids[i]])) return { wardId: ids[i], exact: sure };
      return { wardId: guess };
    }, function (e) {
      if (window.console) console.warn('[elections-hub] MDB wards: ' + ((e && e.message) || e));
      return { wardId: guess };
    });
  }
  window.DM_EH_API = { municipality: municipality, ward: ward, locate: locate };
});

/* ==== post-elections v2 · seat board ====
   The AllMetrosEmbedV5 widget (Metros v5, from Johannesburg v25: the half circle of pegs, the party rows, the tabs, the i panel,
   the Majority flag and the tally), as v27 built it into the page, made into a component that draws real council results and can
   be mounted more than once:  EH_BOARD.mount(host, { data, start, head, fixed })  returns { set(data), current(), destroy() }.
     data   { metros: [council], parties: { key: { name, color } } }. A council: id, name, place, seats, majority, order (its party
            keys, largest first, with OTH, Other, last), max (the most seats any row holds) and polls, one per election with seats:
            { id, tab, when, seats: { key: n }, nr (the note for a party with no seats), info: { title, body, facts, foot, url, link } }.
     start  the council to open on; head: the headline and the council dropdown (the coalition section); fixed: the widget's fixed
            840px height (the coalition section) rather than the height its rows need (the municipal file).
   Results mode: the board opens as the widget's did. It stands full, the whole council with every seat in its party's colour,
   largest party from the left, and no tally; the first time half of the board is on screen, the seats sink in one sweep to the left
   and the tally comes up at 0. A click on a party starts a coalition, as in the widget (the seats pop up and sink in waves, Other's
   seats go in one at a time, the Majority flag rises once the coalition reaches a majority and the pegs hop); the button in the box's
   top right-hand corner clears the board. A council switch plays the opening again. The tabs switch elections and keep the
   coalition. The widget's template is src/board-tpl.html; its styles are under "seat board" in the stylesheet, scoped to .ehb.
   EH_BOARD.rows(host, rows, opts) draws plain rows of the same pegs, with nothing to pick (party support, district ballot seats).
   EH_BOARD.arc(host, { data, start }) draws one council as a half circle of the same pegs, with nothing to pick (the council seats
   in the municipal file; see "the half circle").
   If a board fails, its host is hidden and the rest of the page carries on. */
guard("seat board", function () {

  var SVGNS = 'http://www.w3.org/2000/svg';
  // The widget's settings, at the values v27 ships with, its opening included; results on is the results board's own.
  var BOARD_PROPS = {"viewAs":"Article width","cameraAngle":84,"pegHeight":1.65,"outlines":"Colour","sunAngle":85,"pegShadow":1,"waveTime":700,"waveEase":"Smooth end","hopHeight":1.2,"hopSpeed":1,"hopLength":"While it holds","intro":"On view and switches","holdTime":300,"labelSize":17,"labelWeight":400,"letterSpacing":-0.5,"lineHeight":1.2,"labelPop":4,"labelShadow":1.15,"results":true};
  // The template, read ahead of time from src/board-tpl.html (the same form as v27's: text, {x} text with bindings, {h} a part with
  // nothing to fill in, {i} sc-if, {f} sc-for, and elements; a binding is a path into renderVals()).
  var BOARD_TPL = [{"t":"div","s":0,"a":{"style":{"x":["max-width: ",["frameMax"],"; margin: 0 auto; background: #ffffff; color: #171717; font-family: Archivo, 'Helvetica Neue', Arial, sans-serif; container-type: inline-size; container-name: ehcb"]}},"on":{},"c":["\n  ",{"t":"div","s":0,"a":{"class":"e-pad","style":"height: 840px; box-sizing: border-box; padding: 22px 0 10px; display: flex; flex-direction: column; overflow: hidden; position: relative"},"on":{},"c":["\n\n    ",{"i":["hasHead"],"c":["\n    ",{"t":"div","s":0,"a":{"class":"e-head","style":"flex: none; position: relative; z-index: 5; margin-top: 5px"},"on":{},"c":["\n      ",{"t":"h1","s":0,"a":{"class":"e-title","style":"margin: 0; font-family: 'DM Custom', DMCustom, Georgia, serif; font-weight: 700; font-size: 36px; line-height: 1.05; letter-spacing: -0.4px; color: #171717; text-wrap: balance"},"on":{},"c":[{"h":"<span class=\"t1\">Who can build a</span>","s":0}," coalition",{"t":"span","s":0,"a":{"class":"vh"},"on":{},"c":[{"x":[" in ",["metroName"],""]}]},"? ",{"h":"<span class=\"e-room\" aria-hidden=\"true\"></span>","s":0}]},"\n      ",{"t":"div","s":0,"a":{"class":"e-metro","id":{"p":["metroWrapId"]},"style":"position: absolute; right: 0; bottom: -3px"},"on":{"keydown":["metroKey"],"focusout":["metroBlur"]},"c":["\n        ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["m-btn ",["metroBtnCls"],""]},"id":{"p":["metroBtnId"]},"aria-label":{"x":["Metro: ",["metroName"],""]},"aria-expanded":{"p":["metroExpanded"]},"aria-controls":{"p":["metroMenuId"]},"style":"height: 44px; box-sizing: border-box; padding: 0; display: flex; align-items: center; background: transparent; border: 0; color: #181818; cursor: pointer"},"on":{"click":["toggleMetro"]},"c":["\n          ",{"t":"span","s":0,"a":{"class":"m-face","style":{"x":["height: 44px; box-sizing: border-box; display: flex; align-items: center; gap: 11px; padding: 0 14px 0 19px; border: 1.5px solid #181818; border-radius: 10px; background-color: ",["metroFaceBg"],"; color: ",["metroFaceFg"],""]}},"on":{},"c":["\n            ",{"t":"span","s":0,"a":{"class":"m-name","style":"display: block; white-space: nowrap; font-family: 'DM Custom', DMCustom, Georgia, serif; font-weight: 700; font-size: 27px; line-height: 1; letter-spacing: -0.2px"},"on":{},"c":[{"x":["",["metroName"],""]}]},"\n            ",{"h":"<svg class=\"m-chev\" width=\"15\" height=\"15\" viewBox=\"0 0 12 12\" aria-hidden=\"true\" style=\"display: block; flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round\"><path d=\"M2 4.25l4 4 4-4\"></path></svg>","s":1},"\n          "]},"\n        "]},"\n        ",{"i":["menuOpen"],"c":["\n          ",{"t":"div","s":0,"a":{"class":"m-menu","id":{"p":["metroMenuId"]},"role":"group","aria-label":"Choose a metro","style":"position: absolute; right: 0; top: calc(100% + 6px); width: 236px; box-sizing: border-box; padding: 5px; background: #ffffff; border: 1.5px solid #181818; border-radius: 8px; box-shadow: 0 14px 28px -12px rgba(40, 32, 24, 0.45), 0 2px 6px rgba(40, 32, 24, 0.08)"},"on":{},"c":["\n            ",{"h":"<p aria-hidden=\"true\" style=\"margin: 0; padding: 8px 9px 7px; font-stretch: 87.5%; font-weight: 700; font-size: 11px; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase; color: #5e574e\">Choose a metro</p>","s":0},"\n            ",{"f":["metros"],"as":"m","c":["\n              ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["m-opt ",["m","cls"],""]},"id":{"p":["m","optId"]},"aria-current":{"p":["m","current"]},"style":{"x":["width: 100%; height: 44px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 12px; background-color: ",["m","bg"],"; color: ",["m","fg"],"; border: 0; border-radius: 5px; cursor: ",["m","cursor"],"; text-align: left"]}},"on":{"click":["m","pick"]},"c":["\n                ",{"t":"span","s":0,"a":{"style":"min-width: 0; white-space: nowrap; font-family: 'DM Custom', DMCustom, Georgia, serif; font-weight: 700; font-size: 20px; line-height: 1; letter-spacing: -0.2px"},"on":{},"c":[{"x":["",["m","name"],""]}]},"\n                ",{"t":"span","s":0,"a":{"style":{"x":["flex: none; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; font-size: 12.5px; font-weight: 500; line-height: 1; font-variant-numeric: tabular-nums; color: ",["m","sub"],""]}},"on":{},"c":[{"x":["",["m","seats"],""]}]},"\n              "]},"\n            "]},"\n          "]},"\n        "]},"\n      "]},"\n    "]},"\n    "]},"\n\n    ",{"t":"div","s":0,"a":{"class":"e-tabs","style":"flex: none; margin-top: 20px; position: relative; z-index: 3"},"on":{},"c":["\n      ",{"t":"div","s":0,"a":{"role":"group","aria-label":"Choose an election","style":"display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; border-bottom: 3px solid #181818"},"on":{},"c":["\n        ",{"f":["polls"],"as":"p","c":["\n          ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["tab ",["p","cls"],""]},"aria-pressed":{"p":["p","pressed"]},"style":{"x":["height: 54px; min-width: 0; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 3px; padding: 0 12px; background-color: ",["p","bg"],"; color: ",["p","fg"],"; border: 0; border-radius: ",["p","radius"],"; cursor: ",["p","cursor"],"; text-align: left; line-height: 1.15"]}},"on":{"click":["p","pick"]},"c":["\n            ",{"t":"span","s":0,"a":{"class":"tab-name","style":"display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12.5px; font-weight: 700; font-stretch: 87.5%; letter-spacing: 0.06em; text-transform: uppercase"},"on":{},"c":[{"x":["",["p","name"],""]}]},"\n            ",{"t":"small","s":0,"a":{"class":"tab-when","style":{"x":["display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: 400; color: ",["p","sub"],""]}},"on":{},"c":[{"x":["",["p","when"],""]}]},"\n          "]},"\n        "]},"\n      "]},"\n      ",{"i":["infoOpen"],"c":["\n        ",{"t":"div","s":0,"a":{"id":{"p":["infoId"]},"class":"e-info","role":"region","aria-label":"About these results","style":"position: absolute; left: 0; right: 0; top: 100%; box-sizing: border-box; padding: 14px 16px 16px; background: #181818; color: #ffffff; font-family: Geist, 'Helvetica Neue', Arial, sans-serif"},"on":{},"c":["\n          ",{"h":"<p style=\"margin: 0; padding-right: 40px; font-family: Archivo, 'Helvetica Neue', Arial, sans-serif; font-stretch: 87.5%; font-weight: 700; font-size: 11px; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase; color: #cdbfa7\">About these results</p>","s":0},"\n          ",{"t":"h2","s":0,"a":{"class":"e-info-title","style":"margin: 7px 0 0; padding-right: 40px; font-size: 17px; font-weight: 600; line-height: 1.25; letter-spacing: -0.01em; color: #ffffff"},"on":{},"c":[{"x":["",["info","title"],""]}]},"\n          ",{"t":"p","s":0,"a":{"class":"e-info-body","style":"margin: 8px 0 0; font-size: 14px; font-weight: 400; line-height: 1.45; color: #d4d4d4; text-wrap: pretty"},"on":{},"c":[{"x":["",["info","body"],""]}]},"\n          ",{"t":"dl","s":0,"a":{"class":"e-facts","style":"margin: 12px 0 0; padding-top: 10px; border-top: 1px solid #3d3d3d; display: flex; flex-wrap: wrap; column-gap: 24px; row-gap: 10px"},"on":{},"c":["\n            ",{"f":["info","facts"],"as":"f","c":["\n              ",{"t":"div","s":0,"a":{"class":"e-fact","style":"min-width: 0"},"on":{},"c":["\n                ",{"t":"dt","s":0,"a":{"style":"font-family: Archivo, 'Helvetica Neue', Arial, sans-serif; font-stretch: 87.5%; font-weight: 700; font-size: 10.5px; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase; color: #a3a3a3"},"on":{},"c":[{"x":["",["f","k"],""]}]},"\n                ",{"t":"dd","s":0,"a":{"style":"margin: 5px 0 0; font-size: 14px; font-weight: 600; line-height: 1.2; font-variant-numeric: tabular-nums; color: #ffffff; white-space: nowrap"},"on":{},"c":[{"x":["",["f","v"],""]}]},"\n              "]},"\n            "]},"\n          "]},"\n          ",{"t":"p","s":0,"a":{"class":"e-info-foot","style":"margin: 12px 0 0; font-size: 12.5px; line-height: 1.45; color: #a3a3a3"},"on":{},"c":[{"x":["",["info","foot"]," "]},{"t":"a","s":0,"a":{"href":{"p":["info","url"]},"target":"_blank","rel":"noopener","style":"color: #ffffff; text-underline-offset: 2px"},"on":{},"c":[{"x":["",["info","linkText"],""]}]}]},"\n        "]},"\n      "]},"\n\n    "]},"\n\n    ",{"t":"div","s":0,"a":{"class":{"x":["e-box ",["boxCls"],""]},"id":{"p":["boxId"]},"style":{"x":["flex: 1 1 0; min-height: 0; box-sizing: border-box; display: flex; flex-direction: column; padding: 8px 16px 14px; border: 1.5px solid #181818; border-top: 0; border-radius: 0 0 8px 8px; --majd: ",["majd"],"; --tlt: ",["tallyT"],"; --tld: ",["tallyD"],""]}},"on":{},"c":["\n\n      ",{"t":"div","s":0,"a":{"class":"e-chart","id":{"p":["chartId"]},"style":{"x":["flex: 0 1 auto; min-height: 0; height: calc((100cqw - var(--chin)) * ",["stage","k"]," + 40px); position: relative; container-type: size"]}},"on":{"mousemove":["hoverPeg"],"mouseleave":["leavePeg"]},"c":["\n        ",{"t":"div","s":0,"a":{"class":"e-stage","style":{"x":["position: absolute; left: ",["stage","left"],"; top: ",["stage","top"],"; width: ",["stage","w"],"; height: ",["stage","h"],"; container-type: inline-size; --stick: ",["stage","stick"],""]}},"on":{},"c":["\n          ",{"t":"div","s":0,"a":{"role":"img","aria-label":{"p":["chartLabel"]},"style":"position: absolute; inset: 0"},"on":{},"c":["\n            ",{"t":"div","s":0,"a":{"aria-hidden":"true","style":{"x":["position: absolute; left: 0; top: ",["stage","boardTop"],"; width: 100cqw; height: 53cqw; transform: scaleY(",["stage","sq"],"); transform-origin: 0 0"]}},"on":{},"c":["\n              ",{"t":"span","s":0,"a":{"style":{"x":["position: absolute; left: 50cqw; top: 0.21cqw; height: ",["stage","lineH"],"; border-left: 1.5px dashed #181818; transform: translateX(-0.75px)"]}},"on":{},"c":[]},"\n            "]},"\n          "]},"\n          ",{"t":"div","s":0,"a":{"class":"e-maj","style":{"x":["position: absolute; left: 50%; bottom: calc(100% + 14px); transform: ",["majTransform"],"; transform-origin: 50% 100%; opacity: ",["majOpacity"],"; visibility: ",["majVisibility"],"; padding: 5px 10px 4px calc(10px + 0.12em); border-radius: 5px; background: #d33d3d; color: #ffffff; font-stretch: 87.5%; font-weight: 700; font-size: 13px; line-height: 1; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap"]}},"on":{},"c":["Majority"]},"\n          ",{"t":"canvas","s":0,"a":{"class":"e-pegs","id":{"p":["boardId"]},"aria-hidden":"true","style":{"x":["position: absolute; left: ",["stage","cvL"],"; top: ",["stage","cvT"],"; width: ",["stage","cvW"],"; height: ",["stage","cvH"],""]}},"on":{},"c":[]},"\n          ",{"t":"div","s":0,"a":{"aria-live":"polite","style":{"x":["position: absolute; left: 50%; bottom: calc(",["stage","tallyBottom"]," - 0.145em); transform: translateX(-50%); display: flex; align-items: baseline; clip-path: inset(-100% -100% 0 -100%); font-family: Geist, 'Helvetica Neue', Arial, sans-serif; font-size: clamp(24px, 9cqw, 60px); line-height: 1; color: #171717; white-space: nowrap"]}},"on":{},"c":[{"t":"span","s":0,"a":{"class":{"x":["e-tally-in ",["tallyCls"],""]},"style":"display: flex; align-items: baseline"},"on":{},"c":[{"t":"span","s":0,"a":{"style":"font-weight: 700; letter-spacing: -0.04em; font-variant-numeric: tabular-nums"},"on":{},"c":[{"x":["",["tally"],""]}]},{"t":"span","s":0,"a":{"style":"margin-left: 0.25em; font-size: max(11px, 0.3em); font-weight: 600; letter-spacing: 0; color: #5e574e"},"on":{},"c":[{"x":["",["tallyOf"],""]}]}]}]},"\n        "]},"\n      ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["e-eye ",["eyeCls"],""]},"aria-label":"About these results","aria-expanded":{"p":["infoExpanded"]},"id":{"p":["eyeId"]},"aria-controls":{"p":["infoId"]},"style":"position: absolute; top: -8px; z-index: 1; width: 44px; height: 44px; box-sizing: border-box; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; border: 0; border-radius: 50%; color: #181818; cursor: pointer; left: -14px"},"on":{"click":["toggleInfo"]},"c":["\n        ",{"t":"span","s":0,"a":{"aria-hidden":"true","style":{"x":["width: 30px; height: 30px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1.5px solid ",["eyeRing"],"; background: ",["eyeBg"],"; color: #ffffff; transition: background-color .15s ease, border-color .15s ease"]}},"on":{},"c":[{"h":"<svg width=\"27\" height=\"27\" viewBox=\"-750 -750 1500 1500\" aria-hidden=\"true\" style=\"display: block; fill: currentColor\"><path d=\"M123.9 369.7V322.9L79.9 319.9C74.5 319.3 69.7 316.8 65.4 312.4C61.1 308 58.9 302.7 58.9 296.5V-129.7H12.7L-120.4 -80V-39H-62.1V296.5C-62.1 302.7 -64.1 308 -68.1 312.4C-72.1 316.8 -76.7 319.3 -82.1 319.9L-123.9 322.9V369.7H123.9ZM50.9 -347.3C37 -362.2 20.2 -369.7 0.7 -369.7C-18.9 -369.7 -35.5 -362.2 -49.2 -347.3C-62.8 -332.3 -69.6 -314.1 -69.6 -292.6C-69.6 -271.2 -62.8 -252.8 -49.2 -237.5C-35.5 -222.2 -18.9 -214.6 0.7 -214.6C20.2 -214.6 37 -222.2 50.9 -237.5C64.9 -252.8 71.9 -271.2 71.9 -292.6C71.9 -314.1 64.9 -332.3 50.9 -347.3Z\"></path></svg>","s":1}]},"\n      "]},"\n      ",{"t":"button","s":0,"a":{"type":"button","class":"e-reset","aria-label":{"p":["resetLabel"]},"title":{"p":["resetLabel"]},"style":"position: absolute; top: -8px; right: -14px; z-index: 1; width: 44px; height: 44px; box-sizing: border-box; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; border: 0; border-radius: 50%; color: #181818; cursor: pointer"},"on":{"click":["resetBoard"]},"c":["\n        ",{"h":"<span aria-hidden=\"true\" style=\"width: 30px; height: 30px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #ffffff; color: #181818; transition: background-color .15s ease\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" style=\"display: block; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round\"><path d=\"M18.76 13.81a7 7 0 1 1-2.26-7.17l2 1.67\"></path><path d=\"M18.5 3.8v4.5h-4.5\"></path></svg></span>","s":0},"\n      "]}]},"\n\n      ",{"h":"<div class=\"e-divide\" aria-hidden=\"true\" style=\"flex: none; height: 0; margin-top: 12px; border-top: 1px solid #181818\"></div>","s":0},"\n\n      ",{"t":"section","s":0,"a":{"class":"e-parties","id":{"p":["partsId"]},"aria-label":"Parties","style":{"x":["flex: 1 1 0; margin-top: 12px; container-type: size; --nrows: ",["nRows"],""]}},"on":{},"c":["\n        ",{"t":"div","s":0,"a":{"class":"e-rows","style":{"x":["height: 100%; box-sizing: border-box; padding: 0 var(--rp); display: grid; grid-template-rows: repeat(var(--nrows), minmax(0, 1fr)); --fit-rows: ",["fit","rows"],"; --fit-cols: ",["fit","cols"],"; --fit-dot: ",["fit","dot"],"; --hk: ",["stage","hk"],"; --fs: ",["labelSize"],"; --lfw: ",["labelWeight"],"; --lls: ",["letterSpacing"],"; --llh: ",["lineHeight"],"; --pop: ",["labelPop"],"; --lsh: ",["labelShadow"],""]}},"on":{},"c":["\n          ",{"f":["makeup"],"as":"mk","c":["\n            ",{"i":["mk","clickable"],"c":["\n              ",{"t":"button","s":0,"a":{"type":"button","class":{"p":["mk","cls"]},"aria-pressed":{"p":["mk","pressed"]},"aria-label":{"p":["mk","aria"]},"style":{"x":["min-width: 0; min-height: 0; height: 100%; box-sizing: border-box; display: grid; grid-template-columns: var(--name) minmax(0, 1fr); align-items: center; column-gap: var(--g); padding: 0 0 1px; background: transparent; border: 0; border-radius: 0; color: #171717; text-align: left; cursor: pointer; opacity: ",["mk","op"],""]}},"on":{"click":["mk","pick"]},"c":["\n                ",{"t":"span","s":0,"a":{"class":{"x":["mark ",["mk","markCls"],""]},"style":{"x":["min-width: 0; height: 100%; margin-left: -8px; display: flex; align-items: center; justify-content: center; --pd: ",["mk","pd"],"; --tw: ",["mk","tw"],"; --tn: ",["mk","tn"],""]}},"on":{},"c":["\n                  ",{"t":"span","s":0,"a":{"class":"mark-art","style":"width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 0 8px; border-radius: 6px"},"on":{},"c":["\n                    ",{"t":"span","s":0,"a":{"class":"mark-name","style":{"x":["display: block; white-space: nowrap; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; color: ",["mk","nameFg"],""]}},"on":{},"c":[{"x":["",["mk","name"],""]}]},"\n                  "]},"\n                "]},"\n                ",{"t":"span","s":0,"a":{"style":"min-width: 0; display: flex; align-items: center"},"on":{},"c":["\n                  ",{"t":"span","s":0,"a":{"class":"pdots","aria-hidden":"true","style":{"x":["--pc: ",["mk","pcols"],""]}},"on":{},"c":[{"t":"canvas","s":0,"a":{"id":{"p":["mk","cvId"]},"style":{"x":["position: absolute; left: -4px; top: -4px; width: calc(100% + 8px); height: calc(100% + 8px + ",["rowShb"],")"]}},"on":{},"c":[]}]},"\n                  ",{"h":"<span aria-hidden=\"true\" style=\"flex: 1 1 0; min-width: 0; height: 4px; margin-left: var(--g); background: radial-gradient(circle, #a3978a 0.9px, transparent 1.3px) 0 50% / 5px 4px repeat-x\"></span>","s":0},"\n                  ",{"t":"span","s":0,"a":{"class":"cnt","style":"flex: none; position: relative; min-width: var(--count); box-sizing: border-box; padding-left: 6px; text-align: right; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 18px; line-height: 1; font-variant-numeric: tabular-nums; color: #171717"},"on":{},"c":[{"t":"span","s":0,"a":{"class":"cnt-n"},"on":{},"c":[{"x":["",["mk","label"],""]}]},{"h":"<span class=\"cnt-x\" aria-hidden=\"true\" style=\"position: absolute; right: -1px; top: 50%; width: 16px; height: 16px; margin-top: -8px\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" style=\"display: block; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round\"><path d=\"M3 3l10 10M13 3L3 13\"></path></svg></span>","s":0}]},"\n                "]},"\n              "]},"\n            "]},"\n            ",{"i":["mk","nr"],"c":["\n              ",{"t":"div","s":0,"a":{"class":"chip-nr","role":"group","aria-label":{"p":["mk","aria"]},"title":{"p":["mk","title"]},"style":{"x":["min-width: 0; min-height: 0; height: 100%; box-sizing: border-box; display: grid; grid-template-columns: var(--name) minmax(0, 1fr); align-items: center; column-gap: var(--g); padding: 0 0 1px; color: #5e574e; opacity: ",["mk","op"],""]}},"on":{},"c":["\n                ",{"t":"span","s":0,"a":{"class":"mark","style":{"x":["min-width: 0; height: 100%; margin-left: -8px; display: flex; align-items: center; justify-content: center; --tw: ",["mk","tw"],"; --tn: ",["mk","tn"],""]}},"on":{},"c":["\n                  ",{"t":"span","s":0,"a":{"class":"mark-art","style":"width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 0 8px; border-radius: 6px"},"on":{},"c":["\n                    ",{"t":"span","s":0,"a":{"class":"mark-name","style":{"x":["display: block; white-space: nowrap; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; color: ",["mk","nameFg"],""]}},"on":{},"c":[{"x":["",["mk","name"],""]}]},"\n                  "]},"\n                "]},"\n                ",{"t":"span","s":0,"a":{"class":"chip-nr-note","style":"min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 500"},"on":{},"c":[{"x":["",["mk","note"],""]}]},"\n              "]},"\n            "]},"\n            ",{"i":["mk","step"],"c":["\n              ",{"t":"div","s":0,"a":{"class":"oth-row","style":"position: relative; min-width: 0; min-height: 0; height: 100%"},"on":{},"c":["\n                ",{"t":"button","s":0,"a":{"type":"button","class":{"p":["mk","cls"]},"aria-pressed":{"p":["mk","pressed"]},"aria-label":{"p":["mk","aria"]},"style":{"x":["width: 100%; min-width: 0; min-height: 0; height: 100%; box-sizing: border-box; display: grid; grid-template-columns: var(--name) minmax(0, 1fr); align-items: center; column-gap: var(--g); padding: 0 0 1px; background: transparent; border: 0; border-radius: 0; color: #171717; text-align: left; cursor: pointer; opacity: ",["mk","op"],""]}},"on":{"click":["mk","pick"]},"c":["\n                  ",{"t":"span","s":0,"a":{"class":{"x":["mark ",["mk","markCls"],""]},"style":{"x":["min-width: 0; height: 100%; margin-left: -8px; display: flex; align-items: center; justify-content: center; --pd: ",["mk","pd"],"; --tw: ",["mk","tw"],"; --tn: ",["mk","tn"],""]}},"on":{},"c":["\n                    ",{"t":"span","s":0,"a":{"class":"mark-art","style":"width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 0 8px; border-radius: 6px"},"on":{},"c":["\n                      ",{"t":"span","s":0,"a":{"class":"mark-name","style":{"x":["display: block; white-space: nowrap; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; color: ",["mk","nameFg"],""]}},"on":{},"c":[{"x":["",["mk","name"],""]}]},"\n                    "]},"\n                  "]},"\n                  ",{"t":"span","s":0,"a":{"style":"min-width: 0; display: flex; align-items: center"},"on":{},"c":["\n                    ",{"t":"span","s":0,"a":{"class":"pdots","aria-hidden":"true","style":{"x":["--pc: ",["mk","pcols"],""]}},"on":{},"c":[{"t":"canvas","s":0,"a":{"id":{"p":["mk","cvId"]},"style":{"x":["position: absolute; left: -4px; top: -4px; width: calc(100% + 8px); height: calc(100% + 8px + ",["rowShb"],")"]}},"on":{},"c":[]}]},"\n                    ",{"h":"<span aria-hidden=\"true\" style=\"flex: 1 1 0; min-width: 0; height: 4px; margin-left: var(--g); background: radial-gradient(circle, #a3978a 0.9px, transparent 1.3px) 0 50% / 5px 4px repeat-x\"></span>","s":0},"\n                    ",{"h":"<span aria-hidden=\"true\" style=\"flex: none; width: var(--stw)\"></span>","s":0},"\n                    ",{"t":"span","s":0,"a":{"class":"cnt","style":"flex: none; position: relative; width: var(--ocw); box-sizing: border-box; text-align: right; white-space: nowrap; font-family: Geist, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 18px; line-height: 1; font-variant-numeric: tabular-nums; color: #171717"},"on":{},"c":[{"t":"span","s":0,"a":{"class":"cnt-n"},"on":{},"c":[{"x":["",["mk","label"],""]},{"t":"span","s":0,"a":{"class":"cnt-of","style":"margin-left: 1px; font-size: 0.72em; color: #5e574e"},"on":{},"c":[{"x":["",["mk","of"],""]}]}]},{"h":"<span class=\"cnt-x\" aria-hidden=\"true\" style=\"position: absolute; right: -1px; top: 50%; width: 16px; height: 16px; margin-top: -8px\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" style=\"display: block; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round\"><path d=\"M3 3l10 10M13 3L3 13\"></path></svg></span>","s":0}]},"\n                  "]},"\n                "]},"\n                ",{"t":"div","s":0,"a":{"class":"oth-step","role":"group","aria-label":"Other’s seats in the coalition","style":"position: absolute; top: 0; bottom: 1px; right: var(--ocw); width: var(--stw); box-sizing: border-box; padding-right: 6px; display: flex; align-items: center; justify-content: flex-end"},"on":{},"c":["\n                  ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["step ",["mk","lessCls"],""]},"aria-label":{"p":["mk","lessAria"]},"aria-disabled":{"p":["mk","lessOff"]},"style":"flex: none; width: 34px; height: 44px; box-sizing: border-box; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; border: 0; color: #181818; cursor: pointer"},"on":{"pointerdown":["mk","lessDown"],"pointerleave":["mk","stopHold"],"click":["mk","lessClick"]},"c":["\n                    ",{"h":"<span class=\"step-face\" aria-hidden=\"true\" style=\"width: 26px; height: 26px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 1.5px solid #181818; border-radius: 50%; background: #ffffff\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\" style=\"display: block; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round\"><path d=\"M2 6h8\"></path></svg></span>","s":0},"\n                  "]},"\n                  ",{"t":"button","s":0,"a":{"type":"button","class":{"x":["step ",["mk","moreCls"],""]},"aria-label":{"p":["mk","moreAria"]},"aria-disabled":{"p":["mk","moreOff"]},"style":"flex: none; width: 34px; height: 44px; box-sizing: border-box; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; border: 0; color: #181818; cursor: pointer"},"on":{"pointerdown":["mk","moreDown"],"pointerleave":["mk","stopHold"],"click":["mk","moreClick"]},"c":["\n                    ",{"h":"<span class=\"step-face\" aria-hidden=\"true\" style=\"width: 26px; height: 26px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 1.5px solid #181818; border-radius: 50%; background: #ffffff\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\" style=\"display: block; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round\"><path d=\"M2 6h8M6 2v8\"></path></svg></span>","s":0},"\n                  "]},"\n                "]},"\n              "]},"\n            "]},"\n          "]},"\n        "]},"\n      "]},"\n\n    "]},"\n\n  "]},"\n"]}];

  // What the widget's script expects of the design-component runtime: props, state and a batched setState.
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    if (!patch || typeof patch !== 'object') return;
    var next = {}, k;
    for (k in this.state) if (Object.prototype.hasOwnProperty.call(this.state, k)) next[k] = this.state[k];
    for (k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) next[k] = patch[k];
    this.state = next;
    if (this.cbQueue) this.cbQueue();
  };

  // A party label's width in ems at a weight, measured in Geist (the widget kept a table for its nine parties). Measured again once
  // the font has loaded; until then a fallback face stands in, so a long label may draw a touch small for a moment.
  var EM = {}, emCtx = null;
  function geistIn() { try { return !document.fonts || !document.fonts.check || document.fonts.check('400 16px Geist'); } catch (e) { return true; } }
  var labelEm = function (name, wt) {
    var k = name + '|' + wt;
    if (EM[k]) return EM[k];
    if (!emCtx) { var c = document.createElement('canvas'); emCtx = c.getContext && c.getContext('2d'); }
    var w = 0.62 * name.length;
    if (emCtx) { emCtx.font = Math.round(wt) + ' 100px Geist, "Helvetica Neue", Arial, sans-serif'; w = emCtx.measureText(name).width / 100; }
    w *= 1.02;
    if (geistIn()) EM[k] = w;
    return w;
  };

/* ---- the embed's own script (AllMetrosEmbedV5), in ES5 ---- */
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var DM = {
  ink1: "#171717",
  ink2: "#292929",
  ink4: "#6b6c6d",
  ink5: "#8f9193",
  black: "#181818",
  panel: "#111111",
  grey1: "#e9e9e9",
  grey2: "#d4d4d4",
  grey3: "#f2f2f2",
  white: "#ffffff",
  red: "#d33d3d",
  redDark: "#a61212",
  green: "#567b43"
};
var PRINT = {
  tan: "#cdbfa7",
  tanPale: "#e2d9ca",
  ink2: "#4a443c",
  muted: "#5e574e"
};
var lum = function lum(hex) {
  var c = [1, 3, 5].map(function (i) {
    return parseInt(hex.slice(i, i + 2), 16) / 255;
  }).map(function (v) {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
var textOn = function textOn(hex) {
  var L = lum(hex);
  return 1.05 / (L + 0.05) >= (L + 0.05) / (lum(DM.ink1) + 0.05) ? DM.white : DM.ink1;
};
var toLin = function toLin(v) {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
var toSrgb = function toSrgb(v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
};
var shade = function shade(hex, f) {
  return "#" + [1, 3, 5].map(function (i) {
    return Math.round(Math.min(1, Math.max(0, toSrgb(toLin(parseInt(hex.slice(i, i + 2), 16) / 255) * f))) * 255).toString(16).padStart(2, "0");
  }).join("");
};
var TONE = {
  side: 0.5,
  line: 0.32
};
var tonesOf = function tonesOf(hex) {
  return {
    c: hex,
    s: shade(hex, TONE.side),
    k: shade(hex, TONE.line)
  };
};
var EMPTY_TONES = {
  c: "#f8f6f1",
  s: "#ebe6de",
  k: "#ddd7cd"
};
var PEG = {
  up: 32,
  rest: 9,
  sink: 1.7,
  hole: 2.6,
  shadow: 0.4,
  jitter: 8
};
var HOP = {
  tempo: 0.56,
  spread: 0.32,
  low: 0.55,
  burst: 1800
};
var WAVE_EASE = {
  "Smooth start and end": [0.65, 0, 0.35, 1],
  "Smooth start": [0.32, 0, 0.67, 0],
  "Smooth end": [0.33, 1, 0.68, 1],
  "Even": [0, 0, 1, 1]
};
var bez = function bez(p1, p2, s) {
  return 3 * p1 * s * (1 - s) * (1 - s) + 3 * p2 * s * s * (1 - s) + s * s * s;
};
var easeTime = function easeTime(c, f) {
  var lo = 0,
    hi = 1;
  for (var k = 0; k < 22; k++) {
    var m = (lo + hi) / 2;
    if (bez(c[1], c[3], m) < f) lo = m;else hi = m;
  }
  return bez(c[0], c[2], (lo + hi) / 2);
};
var INTRO = {
  settle: 700,
  view: 0.5
};
var STEP = {
  wait: 420,
  every: 120,
  speedup: 0.86,
  fastest: 40
};
var reducedMotion = function reducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
var rnd = function rnd(i, s) {
  return (Math.sin(i * 12.9898 + s * 78.233) * 43758.5453 % 1 + 1) % 1;
};
var num = function num(v, d, lo, hi) {
  var n = typeof v === "number" ? v : parseFloat(v);
  return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;
};
var FIT = {
  min: 3,
  max: 12
};
function bestFit(W, H, c) {
  var A = W - 2 * c.rp - c.name - 2 * c.g - c.count,
    rowH = H / c.n;
  var best = null;
  for (var R = FIT.min; R <= FIT.max; R++) {
    var C = Math.ceil(c.max / R);
    var d = Math.floor(Math.min(c.dmax, (A - (C - 1) * c.dg) / C, (rowH - c.air - (R - 1) * c.dv) / (R + 1.8 * c.hk)) + 1e-6);
    if (!best || d > best.dot) best = {
      rows: R,
      cols: C,
      dot: d
    };
  }
  return best;
}
function seatLayout(N) {
  var CX = 500,
    CY = 495,
    R0 = N <= 15 ? 172 : N <= 40 ? 300 : N <= 80 ? 230 : 172,
    EDGE = 494.6,
    K = 0.427;
  var best = null;
  for (var rows = N <= 15 ? 1 : N <= 40 ? 2 : N <= 80 ? 3 : 6; rows <= (N <= 15 ? 1 : N <= 40 ? 2 : N <= 80 ? 5 : 14); rows++) {
    var R1 = 480,
      dot = 14.6,
      radial = 0,
      arc = 0;
    for (var it = 0; it < 30; it++) {
      radial = rows > 1 ? (R1 - R0) / (rows - 1) : 1e9;
      arc = rows > 1 ? Math.PI * rows * (R0 + R1) / 2 / N : Math.PI * R1 / Math.max(1, N - 1);
      dot = K * Math.min(radial, arc);
      R1 = EDGE - dot;
    }
    var score = Math.abs(Math.log(arc / radial));
    if (!best || score < best.score) best = {
      rows: rows,
      R1: R1,
      dot: dot,
      pitch: Math.min(radial, arc),
      score: score
    };
  }
  var radii = [];
  for (var i = 0; i < best.rows; i++) radii.push(best.rows > 1 ? R0 + (best.R1 - R0) * i / (best.rows - 1) : best.R1);
  var sumR = radii.reduce(function (a, b) {
    return a + b;
  }, 0);
  var counts = radii.map(function (r) {
    return Math.floor(N * r / sumR);
  });
  var rem = N - counts.reduce(function (a, b) {
    return a + b;
  }, 0);
  radii.map(function (r, i) {
    return [N * r / sumR - counts[i], i];
  }).sort(function (a, b) {
    return b[0] - a[0];
  }).slice(0, rem).forEach(function (e) {
    counts[e[1]]++;
  });
  var pts = [];
  radii.forEach(function (r, i) {
    var n = counts[i];
    for (var j = 0; j < n; j++) {
      var a = n === 1 ? Math.PI / 2 : Math.PI * (1 - j / (n - 1));
      pts.push({
        x: CX + r * Math.cos(a),
        y: CY - r * Math.sin(a),
        a: a
      });
    }
  });
  pts.sort(function (p, q) {
    return q.a - p.a || p.y - q.y;
  });
  var fill = pts.map(function (p) {
    return {
      x: p.x,
      y: p.y,
      a: p.a
    };
  });
  var depth = fill.map(function (p, i) {
    return i;
  }).sort(function (i, j) {
    return fill[i].y - fill[j].y || fill[i].x - fill[j].x;
  });
  return {
    fill: fill,
    depth: depth,
    r: Math.min(0.37 * best.pitch, 30)
  };
}
var lin = function lin(stops) {
  return function (x) {
    if (x <= 0) return stops[0][0];
    if (x >= 1) return stops[stops.length - 1][0];
    var i = 1;
    while (stops[i][1] < x) i++;
    var a = stops[i - 1],
      b = stops[i];
    return a[0] + (b[0] - a[0]) * (x - a[1]) / (b[1] - a[1]);
  };
};
var cb = function cb(x1, y1, x2, y2) {
  var n = 160,
    xs = [],
    ys = [];
  for (var i = 0; i <= n; i++) {
    xs.push(bez(x1, x2, i / n));
    ys.push(bez(y1, y2, i / n));
  }
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var lo = 0,
      hi = n;
    while (hi - lo > 1) {
      var m = lo + hi >> 1;
      if (xs[m] < x) lo = m;else hi = m;
    }
    return ys[lo] + (ys[hi] - ys[lo]) * (x - xs[lo]) / (xs[hi] - xs[lo] || 1);
  };
};
var CURVE = {
  pop: lin([[0, 0], [0.095, 0.02], [0.269, 0.048], [0.659, 0.107], [0.835, 0.137], [0.958, 0.163], [1.052, 0.189], [1.118, 0.215], [1.16, 0.243], [1.176, 0.276], [1.161, 0.317], [1.083, 0.396], [1.01, 0.474], [0.978, 0.541], [0.973, 0.628], [1.004, 0.857], [1, 1]]),
  settle: lin([[0, 0], [0.069, 0.013], [0.195, 0.03], [0.591, 0.078], [0.746, 0.1], [0.859, 0.12], [0.945, 0.139], [1.012, 0.161], [1.055, 0.185], [1.075, 0.215], [1.065, 0.259], [1.007, 0.367], [0.994, 0.461], [1, 1]]),
  ease: cb(0.25, 0.1, 0.25, 1),
  hopIn: cb(0.2, 0.8, 0.3, 1),
  hopOut: cb(0.3, 1.3, 0.5, 1),
  rise: cb(0.333, 0.667, 0.667, 1),
  fall: cb(0.333, 0, 0.667, 0.333)
};
var HOP_KEYS = [[0, 0, CURVE.rise], [0.34, 1, CURVE.fall], [0.68, 0, CURVE.rise], [0.81, 0.16, CURVE.fall], [0.94, 0, null]];
var hopAt = function hopAt(f) {
  for (var i = 0; i < HOP_KEYS.length - 1; i++) {
    var a = HOP_KEYS[i],
      b = HOP_KEYS[i + 1];
    if (f < b[0]) return a[1] + (b[1] - a[1]) * a[2]((f - a[0]) / (b[0] - a[0]));
  }
  return 0;
};
var chan = function chan(v) {
  return {
    a: v,
    b: v,
    t0: 0,
    dur: 0,
    e: null
  };
};
var chanAt = function chanAt(c, now) {
  if (c.a === c.b || now >= c.t0 + c.dur) return c.b;
  if (now <= c.t0) return c.a;
  return c.a + (c.b - c.a) * c.e((now - c.t0) / c.dur);
};
var chanTo = function chanTo(c, v, now, wait, dur, e) {
  if (c.b === v) return false;
  c.a = chanAt(c, now);
  c.b = v;
  c.t0 = now + wait;
  c.dur = dur;
  c.e = e;
  return true;
};
var chanSet = function chanSet(c, v) {
  c.a = c.b = v;
  c.dur = 0;
};
var FADE = 120;
var fadeTo = function fadeTo(c, key, now, wait) {
  if (c.t === key) return false;
  if (c.f !== c.t && now - c.t0 >= FADE / 2) c.f = c.t;
  c.t = key;
  c.t0 = now + wait;
  return true;
};
var fadeAt = function fadeAt(c, now) {
  return c.f === c.t ? 1 : Math.min(1, Math.max(0, (now - c.t0) / FADE));
};
var TAU = Math.PI * 2;
var HOLE = {
  dark: "#6f675b",
  pale: "#e3ddd3"
};
var rgbOf = function rgbOf(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
};
var mix = function mix(a, b, k) {
  return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * k) + "," + Math.round(a[1] + (b[1] - a[1]) * k) + "," + Math.round(a[2] + (b[2] - a[2]) * k) + ")";
};
var HOLE_RGB = {
  dark: rgbOf(HOLE.dark),
  pale: rgbOf(HOLE.pale)
};
var ink = function ink(a) {
  return "rgba(70,56,40," + Math.max(0, Math.min(1, a)).toFixed(4) + ")";
};
var screenPx = function screenPx() {
  return typeof window !== "undefined" && window.devicePixelRatio || 1;
};
var overSample = function overSample() {
  return screenPx() < 1.5 ? 2 : 1;
};
var ROW_PAD = 4;
function boardGeo(lay, o) {
  var r = lay.r,
    ry = r * o.sq,
    hx = r + PEG.hole,
    hy = (r + PEG.hole) * o.sq;
  var riseUp = o.up * o.hk,
    sink = PEG.sink * o.sq;
  var ssu = (2 * r + o.up * o.shf) / (2 * r),
    shk = o.up * o.shf / (2 * r + o.up * o.shf);
  var x = lay.fill.map(function (p) {
      return p.x;
    }),
    y = lay.fill.map(function (p) {
      return o.TOP + p.y * o.sq;
    });
  var hop = lay.fill.map(function (p, i) {
    var hd = o.hopDur(i);
    return {
      hd: hd,
      hp: rnd(i, 3) * hd,
      hh: HOP.low + (1 - HOP.low) * rnd(i, 4)
    };
  });
  var over = 1.18,
    side = Math.max(hx, r);
  var reachUp = riseUp * (over + o.hopH) + ry;
  var reachDown = Math.max(hy, sink * 1.08 + ry, ry * (2 * (1 + (ssu - 1) * over) * (1 + o.hopH * shk) - 1));
  var ml = Math.max(0, side - Math.min.apply(null, x)) + 6,
    mr = Math.max(0, Math.max.apply(null, x) + side - 1000) + 6;
  var mt = Math.max(0, reachUp - Math.min.apply(null, y)) + 6,
    mb = Math.max(0, Math.max.apply(null, y) + reachDown - o.SH) + 6;
  return {
    key: o.key,
    x: x,
    y: y,
    depth: lay.depth,
    hop: hop,
    r: r,
    ry: ry,
    hx: hx,
    hy: hy,
    riseUp: riseUp,
    sink: sink,
    ssu: ssu,
    shk: shk,
    ml: ml,
    mr: mr,
    mt: mt,
    mb: mb,
    W: 1000 + ml + mr,
    H: o.SH + mt + mb
  };
}
var PegPainter = function () {
  "use strict";

  function PegPainter() {
    var _this = this;
    this.b = {
      cv: null,
      ctx: null,
      w: 0,
      h: 0,
      dw: 0,
      dh: 0,
      s: 1,
      geo: null,
      pegs: null,
      tc: null,
      toneKey: "",
      shSprite: null,
      shKey: "",
      until: 0,
      dirty: true,
      hopping: false,
      nUp: 0,
      hopk: 1,
      psh: 1
    };
    this.rows = [];
    this.rg = null;
    this.ds = null;
    this.raf = 0;
    this.last = 0;
    this.visible = true;
    this.gone = false;
    this.io = null;
    this.ro = typeof ResizeObserver === "function" ? new ResizeObserver(function (es) {
      return _this.resized(es);
    }) : null;
  }
  var _proto = PegPainter.prototype;
  _proto.attach = function attach(P) {
    var _this2 = this;
    if (typeof document === "undefined") return;
    var hook = function hook(T, el) {
      if (el === T.cv) return;
      if (T.cv && _this2.ro) _this2.ro.unobserve(T.cv);
      T.cv = el || null;
      T.ctx = el && el.getContext ? el.getContext("2d") : null;
      T.w = T.h = T.dw = T.dh = 0;
      T.dirty = true;
      if (!el) return;
      var cs = getComputedStyle(el);
      T.w = parseFloat(cs.width) || el.clientWidth || 0;
      T.h = parseFloat(cs.height) || el.clientHeight || 0;
      if (_this2.ro) {
        try {
          _this2.ro.observe(el, {
            box: "device-pixel-content-box"
          });
        } catch (err) {
          _this2.ro.observe(el);
        }
      }
    };
    hook(this.b, document.getElementById(P.boardId));
    P.rows.forEach(function (pr, j) {
      var R = _this2.rows[j] || (_this2.rows[j] = {
        cv: null,
        ctx: null,
        w: 0,
        h: 0,
        s: 1,
        dots: [],
        until: 0,
        dirty: true,
        color: "",
        side: "",
        line: null
      });
      hook(R, pr ? document.getElementById(pr.cvId) : null);
    });
    for (var j = P.rows.length; j < this.rows.length; j++) hook(this.rows[j], null);
    if (!this.io && typeof IntersectionObserver === "function") {
      var box = document.getElementById(P.boxId);
      if (box) {
        this.io = new IntersectionObserver(function (es) {
          var v = es.some(function (e) {
            return e.isIntersecting;
          });
          if (v === _this2.visible) return;
          _this2.visible = v;
          if (v) {
            _this2.b.dirty = true;
            _this2.rows.forEach(function (R) {
              R.dirty = true;
            });
            _this2.kick();
          } else if (_this2.raf) {
            cancelAnimationFrame(_this2.raf);
            _this2.raf = 0;
            _this2.last = 0;
          }
        }, {
          rootMargin: "100px 0px"
        });
        this.io.observe(box);
      }
    }
  };
  _proto.resized = function resized(es) {
    var _this3 = this;
    if (this.gone) return;
    es.forEach(function (e) {
      var T = e.target === _this3.b.cv ? _this3.b : _this3.rows.find(function (R) {
        return R.cv === e.target;
      });
      if (!T) return;
      var dp = e.devicePixelContentBoxSize && e.devicePixelContentBoxSize[0];
      T.w = e.contentRect.width;
      T.h = e.contentRect.height;
      T.dw = dp ? dp.inlineSize : 0;
      T.dh = dp ? dp.blockSize : 0;
      T.dirty = true;
    });
    this.frame(true);
  };
  _proto.apply = function apply(P, jump) {
    if (this.gone || !P) return;
    this.attach(P);
    var now = performance.now();
    this.setBoard(P.board, now, jump);
    this.setRows(P.rows, P.rowGeo, now, jump);
    this.kick();
  };
  _proto.setBoard = function setBoard(Q, now, jump) {
    var B = this.b,
      seats = Q.seats,
      instant = Q.snap || Q.reduce || !!jump;
    if (B.geo !== Q.geo) {
      B.geo = Q.geo;
      B.dirty = true;
    }
    if (!B.tc || B.toneKey !== Q.toneKey) {
      // post-elections v23.4: the tones the pegs are leaving stay on, so a peg's delayed fade still has a colour to fade from
      var oldTc = B.tc || {};
      B.tc = {};
      Object.keys(oldTc).forEach(function (k) { B.tc[k] = oldTc[k]; });
      Object.keys(Q.tones).forEach(function (k) {
        var t = Q.tones[k];
        B.tc[k] = {
          c: t.c,
          s: t.s,
          k: t.k,
          lw: t.lw,
          cr: rgbOf(t.c),
          sr: rgbOf(t.s),
          kr: rgbOf(t.k)
        };
      });
      B.toneKey = Q.toneKey;
      B.dirty = true;
    }
    if (B.psh !== Q.psh || B.hopk !== Q.hopk) {
      B.psh = Q.psh;
      B.hopk = Q.hopk;
      B.dirty = true;
    }
    // v6: Q.liftk, how high a lifted seat (s.lift) rises, over the height a peg stands
    var lk = Q.liftk > 0 ? Q.liftk : 0;
    if (B.liftk !== lk) {
      B.liftk = lk;
      B.dirty = true;
    }
    // v4: Q.ghost, the pegs' opacity (1, or none given: solid); v6: the opacity of their faces, their rims staying solid
    var gh = Q.ghost > 0 && Q.ghost < 1 ? Q.ghost : 1;
    if (B.ghost !== gh) {
      B.ghost = gh;
      B.dirty = true;
    }
    var fresh = !B.pegs || B.pegs.length !== seats.length;
    if (fresh) B.pegs = seats.map(function () {
      return {
        q: chan(0),
        on: chan(0),
        amp: chan(0),
        lift: chan(0),
        col: {
          f: "",
          t: "",
          t0: 0
        },
        hole: {
          f: "",
          t: "",
          t0: 0
        },
        up: false,
        clock: 0,
        hd: 1,
        hh: 1,
        qv: 0,
        h: 0,
        title: ""
      };
    });
    var until = B.until,
      nUp = 0;
    seats.forEach(function (s, i) {
      var p = B.pegs[i],
        loop = Q.geo.hop[i],
        q = s.up ? 1 : 0,
        amp = Q.hopping && s.up ? s.amp > 0 ? s.amp : 1 : 0;   // v22.10: s.amp, how high the seat hops over the board's height (none given: 1)
      if (s.hc != null) p.clock = s.hc; else if (fresh) p.clock = loop.hp;   // v23.3: s.hc, where the seat's hop clock starts (s)
      p.hd = loop.hd;
      p.hh = loop.hh;
      p.title = s.title;
      p.up = s.up;
      if (s.up) nUp++;
      if (fresh || instant) {
        chanSet(p.q, q);
        chanSet(p.on, q);
        chanSet(p.amp, amp);
        chanSet(p.lift, s.lift ? 1 : 0);
        p.col.f = p.col.t = s.tone;
        p.hole.f = p.hole.t = s.hole;
        return;
      }
      if (chanTo(p.q, q, now, s.d, 460, s.up ? CURVE.pop : CURVE.settle)) until = Math.max(until, p.q.t0 + 460);
      if (fadeTo(p.col, s.tone, now, s.d)) until = Math.max(until, p.col.t0 + FADE);
      if (fadeTo(p.hole, s.hole, now, s.d)) until = Math.max(until, p.hole.t0 + FADE);
      if (chanTo(p.on, q, now, s.d, 250, CURVE.ease)) until = Math.max(until, p.on.t0 + 250);
      // v23.3: s.hw, when given, the ms until the seat's hop comes in, or goes
      if (amp ? chanTo(p.amp, amp, now, s.hw >= 0 ? s.hw : Q.majd, 300, CURVE.hopIn) : chanTo(p.amp, 0, now, s.hw > 0 ? s.hw : 0, 550, CURVE.hopOut)) until = Math.max(until, p.amp.t0 + p.amp.dur);
      // v6: a lifted seat (its party picked out) rises a little out of its socket, and settles back when the party is put back
      if (chanTo(p.lift, s.lift ? 1 : 0, now, s.d || 0, s.lift ? 300 : 380, s.lift ? CURVE.hopIn : CURVE.ease)) until = Math.max(until, p.lift.t0 + p.lift.dur);
    });
    if (fresh || instant) B.dirty = true;
    B.until = until;
    B.nUp = nUp;
    B.hopping = Q.hopping && !Q.reduce;
    B.coast = !!Q.coast && !Q.reduce;   // v23.3: a peg's hop runs on while its hop goes, even once it stops standing
  };
  _proto.setRows = function setRows(list, rg, now, jump) {
    var _this4 = this;
    if (!rg) {
      this.rg = null;
      return;
    }
    if (!this.rg || this.rg.key !== rg.key) this.rows.forEach(function (R) {
      R.dirty = true;
    });
    this.rg = rg;
    var instant = rg.snap || rg.reduce || !!jump;
    list.forEach(function (pr, j) {
      var R = _this4.rows[j];
      if (!R) return;
      if (!pr) {
        if (R.dots.length) {
          R.dots = [];
          R.dirty = true;
        }
        return;
      }
      if (R.color !== pr.color || R.side !== pr.side || R.line !== pr.line) {
        R.color = pr.color;
        R.side = pr.side;
        R.line = pr.line;
        R.dirty = true;
      }
      if (R.dots.length > pr.dots.length) {
        R.dots.length = pr.dots.length;
        R.dirty = true;
      }
      var until = R.until;
      pr.dots.forEach(function (d, i) {
        var q = d.up ? 1 : 0,
          o = R.dots[i];
        if (!o || instant) {
          if (o) {
            chanSet(o.q, q);
            chanSet(o.op, d.op);
          } else R.dots[i] = {
            q: chan(q),
            op: chan(d.op)
          };
          R.dirty = true;
          return;
        }
        if (chanTo(o.q, q, now, d.wd, 460, d.up ? CURVE.pop : CURVE.settle)) until = Math.max(until, o.q.t0 + 460);
        if (chanTo(o.op, d.op, now, 0, 200, CURVE.ease)) until = Math.max(until, o.op.t0 + 200);
      });
      R.until = until;
    });
  };
  _proto.kick = function kick() {
    var _this5 = this;
    if (this.raf || this.gone || !this.visible || typeof requestAnimationFrame !== "function") return;
    this.raf = requestAnimationFrame(function () {
      _this5.raf = 0;
      _this5.frame(false);
    });
  };
  _proto.frame = function frame(sync) {
    var _this6 = this;
    if (this.gone) return;
    var now = performance.now();
    var dt = sync || !this.last ? 0 : Math.min(0.1, (now - this.last) / 1000);
    if (!sync) this.last = now;
    var more = this.drawBoard(now, dt);
    this.rows.forEach(function (R) {
      if (_this6.drawRow(R, now)) more = true;
    });
    if (more) this.kick();else if (!sync) this.last = 0;
  };
  _proto.size = function size(T) {
    var m = overSample(),
      dpr = screenPx(),
      ew = T.w * dpr,
      eh = T.h * dpr;
    var dw = T.dw && Math.abs(T.dw - ew) <= 1.5 ? T.dw : 0,
      dh = T.dh && Math.abs(T.dh - eh) <= 1.5 ? T.dh : 0;
    if (!dw || !dh) {
      var r = T.cv.getBoundingClientRect();
      if (Math.abs(r.width - T.w) < 0.05 && Math.abs(r.height - T.h) < 0.05) {
        dw = Math.round((r.left + r.width) * dpr) - Math.round(r.left * dpr);
        dh = Math.round((r.top + r.height) * dpr) - Math.round(r.top * dpr);
      } else {
        dw = Math.round(ew);
        dh = Math.round(eh);
      }
    }
    var bw = Math.max(1, dw * m),
      bh = Math.max(1, dh * m);
    if (T.cv.width !== bw) T.cv.width = bw;
    if (T.cv.height !== bh) T.cv.height = bh;
    T.s = bw / T.w;
  };
  _proto.shadowSprite = function shadowSprite(u, g, psh) {
    var B = this.b,
      key = [u.toFixed(4), g.key, psh].join("|");
    if (B.shKey === key) return B.shSprite;
    B.shKey = key;
    B.shSprite = null;
    if (!(psh > 0)) return null;
    var rx = g.r * u,
      ry = g.ry * u,
      w = Math.ceil(2 * rx + 4),
      h = Math.ceil(2 * ry + 4);
    var cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    var c = cv.getContext("2d");
    c.translate(w / 2, h / 2);
    c.scale(1, ry / rx);
    var gr = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0.3, ink(0.11 * psh));
    gr.addColorStop(0.68, ink(0.05 * psh));
    gr.addColorStop(1, ink(0));
    c.fillStyle = gr;
    c.beginPath();
    c.arc(0, 0, rx, 0, TAU);
    c.fill();
    B.shSprite = {
      cv: cv,
      w: w,
      h: h,
      cx: w / 2,
      top: h / 2 - ry
    };
    return B.shSprite;
  };
  _proto.drawBoard = function drawBoard(now, dt) {
    var B = this.b,
      g = B.geo;
    if (!B.ctx || !g || !B.pegs || !B.tc || B.w < 1 || B.h < 1) return false;
    var live = B.hopping && B.nUp > 0;
    var active = live || now < B.until;
    if (!active && !B.dirty) return false;
    this.size(B);
    var u = B.cv.width / g.W,
      ctx = B.ctx,
      pegs = B.pegs,
      n = pegs.length,
      tc = B.tc;
    var sh = this.shadowSprite(u, g, B.psh);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, B.cv.width, B.cv.height);
    // v4: ghost pegs are drawn on a layer of their own, laid over the board at B.ghost; their shadows fade to match. v6: their rims go on
    // a second layer, laid over that one solid, so each ghost keeps its outline in its own colours and its socket shows through the middle
    var gh = B.ghost < 1 ? B.ghost : 1,
      pc = gh < 1 ? this.layer(B.cv.width, B.cv.height) : ctx,
      rl = gh < 1 ? this.layer(B.cv.width, B.cv.height, 2) : null;
    ctx.globalAlpha = gh < 1 ? Math.sqrt(gh) : 1;
    var ox = g.ml * u,
      oy = g.mt * u,
      rU = g.riseUp,
      sink = g.sink,
      gs = g.ssu - 1;
    var rx = g.r * u,
      ry = g.ry * u,
      reach = g.hy + 0.05,
      S = this.shapes(rx, ry, g.hx * u, g.hy * u);
    var rw = rl ? Math.max(1.2, Math.min(2.2, 0.12 * rx / B.s)) * B.s : 0;   // v6: a ghost's rim, 1.2 to 2.2px
    for (var i = 0; i < n; i++) {
      var p = pegs[i];
      var amp = chanAt(p.amp, now);
      if (live && p.up || B.coast && amp !== 0) p.clock += dt;
      p.qv = chanAt(p.q, now);
      var h = 0;
      if (amp !== 0) {
        var on = chanAt(p.on, now);
        if (on !== 0) h = amp * B.hopk * p.hh * hopAt(p.clock % p.hd / p.hd) * on;
      }
      // v22.9: a lifted seat's hop goes on from the height it is lifted to, as high as ever (the higher of the two until v22.8)
      var lv = chanAt(p.lift, now);
      if (lv !== 0 && B.liftk) h += lv * B.liftk * Math.max(0, Math.min(1, p.qv));
      p.h = h;
      if (!sh) continue;
      var sY = (1 + gs * p.qv) * (1 + h * g.shk);
      if (g.ry * (2 * sY - 1) > reach) ctx.drawImage(sh.cv, ox + g.x[i] * u - sh.cx, oy + g.y[i] * u - ry - sh.top * sY, sh.w, sh.h * sY);
    }
    ctx.globalAlpha = 1;
    var order = g.depth;
    for (var j = 0; j < n; j++) {
      var _i = order[j],
        _p = pegs[_i],
        q = _p.qv,
        _h = _p.h;
      var X = ox + g.x[_i] * u,
        Y = oy + g.y[_i] * u;
      var kh = fadeAt(_p.hole, now);
      ctx.setTransform(1, 0, 0, 1, X, Y);
      ctx.fillStyle = kh >= 1 || !HOLE_RGB[_p.hole.f] ? HOLE[_p.hole.t] : mix(HOLE_RGB[_p.hole.f], HOLE_RGB[_p.hole.t], kh);
      ctx.fill(S.hole);
      var T = tc[_p.col.t];
      if (!T) continue;
      var F = tc[_p.col.f] || T,
        k = fadeAt(_p.col, now);
      var cc = T.c,
        cs = T.s,
        ck = T.k,
        lw = T.lw;
      if (k < 1 && F !== T) {
        cc = mix(F.cr, T.cr, k);
        cs = mix(F.sr, T.sr, k);
        ck = mix(F.kr, T.kr, k);
        lw = F.lw + (T.lw - F.lw) * k;
      }
      lw = rl ? 0 : lw * B.s;
      var topY = sink - (rU + sink) * q - rU * _h,
        footY = sink * (1 - q),
        band = rU * q * (1 + _h);
      if (band > 0.01 || Math.abs(topY - footY) > 0.01) this.oval(pc, S, X, Y + footY * u, cs, ck, lw);
      if (band > 0.01) {
        var bh = band * u;
        pc.setTransform(1, 0, 0, 1, X, Y);
        pc.fillStyle = cs;
        pc.fillRect(-rx, -bh, 2 * rx, bh);
        if (lw > 0) {
          pc.fillStyle = ck;
          pc.fillRect(-rx, -bh, lw, bh);
          pc.fillRect(rx - lw, -bh, lw, bh);
        }
      }
      this.oval(pc, S, X, Y + topY * u, cc, ck, lw);
      if (rl) this.rim(rl, S, X, Y, footY * u, topY * u, band > 0.01, cc, cs, rw);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (pc !== ctx) {
      pc.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = gh;
      ctx.drawImage(pc.canvas, 0, 0);
      ctx.globalAlpha = 1;
      if (rl) {
        rl.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(rl.canvas, 0, 0);
      }
    }
    B.dirty = active;
    return active;
  };
  _proto.shapes = function shapes(rx, ry, hx, hy) {
    var B = this.b,
      key = [rx, ry, hx, hy].join("|");
    if (B.shapeKey === key) return B.shapes;
    var make = function make(a, b) {
      var p = new Path2D();
      p.ellipse(0, 0, Math.max(0, a), Math.max(0, b), 0, 0, TAU);
      return p;
    };
    B.shapeKey = key;
    B.shapes = {
      hole: make(hx, hy),
      peg: make(rx, ry),
      inner: {},
      rx: rx,
      ry: ry,
      make: make
    };
    return B.shapes;
  };
  // v4: the ghost pegs' layer, the board's size, cleared (v6: k, another, for their rims)
  _proto.layer = function layer(w, h, k) {
    var n = "lay" + (k || ""), L = this[n] || (this[n] = document.createElement("canvas"));
    if (L.width !== w) L.width = w;
    if (L.height !== h) L.height = h;
    var c = L.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";
    c.clearRect(0, 0, w, h);
    return c;
  };
  // v6: a ghost peg's rim, on the rim layer c. First the peg's whole shape is cleared there, so the rims of the pegs behind it don't show
  // through it; then the rim of its top in the top's colour and, on a peg that stands, the edges of its side in the side's colour.
  // X, Y: the seat (px); fy, ty: its foot and its top, under the seat; stand: whether its side shows; w: the rim's width (px)
  _proto.rim = function rim(c, S, X, Y, fy, ty, stand, top, side, w) {
    var rx = S.rx, ry = S.ry, k = Math.round(w * 20) / 20, lo, ri;
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = "#000";
    if (stand) {
      c.setTransform(1, 0, 0, 1, X, Y + fy);
      c.fill(S.peg);
      c.setTransform(1, 0, 0, 1, X, Y);
      c.fillRect(-rx, ty, 2 * rx, fy - ty);
    }
    c.setTransform(1, 0, 0, 1, X, Y + ty);
    c.fill(S.peg);
    c.globalCompositeOperation = "source-over";
    if (stand) {
      lo = (S.low || (S.low = {}))[k];
      if (!lo) {
        lo = S.low[k] = new Path2D();
        lo.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
        lo.ellipse(0, 0, Math.max(0, rx - k), Math.max(0, ry - k), 0, Math.PI, 0, true);
        lo.closePath();
      }
      c.fillStyle = side;
      c.setTransform(1, 0, 0, 1, X, Y + fy);
      c.fill(lo);
      c.setTransform(1, 0, 0, 1, X, Y);
      c.fillRect(-rx, ty, k, fy - ty);
      c.fillRect(rx - k, ty, k, fy - ty);
    }
    ri = (S.ring || (S.ring = {}))[k];
    if (!ri) {
      ri = S.ring[k] = new Path2D();
      ri.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ri.moveTo(Math.max(0, rx - k), 0);
      ri.ellipse(0, 0, Math.max(0, rx - k), Math.max(0, ry - k), 0, 0, TAU);
    }
    c.fillStyle = top;
    c.setTransform(1, 0, 0, 1, X, Y + ty);
    c.fill(ri, "evenodd");
  };
  _proto.oval = function oval(ctx, S, x, y, fill, line, lw) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    if (lw > 0) {
      var w = Math.round(lw * 20) / 20,
        inner = S.inner[w] || (S.inner[w] = S.make(S.rx - w, S.ry - w));
      ctx.fillStyle = line;
      ctx.fill(S.peg);
      ctx.fillStyle = fill;
      ctx.fill(inner);
    } else {
      ctx.fillStyle = fill;
      ctx.fill(S.peg);
    }
  };
  _proto.dotShadow = function dotShadow(D, s, psh) {
    if (!(psh > 0)) return null;
    var key = D + "|" + s + "|" + psh;
    if (this.ds && this.ds.key === key) return this.ds;
    var blur = 1.5 * s,
      rad = D / 2 * s,
      size = Math.ceil(2 * rad + 4 * blur + 4);
    var cv = document.createElement("canvas");
    cv.width = cv.height = size;
    var c = cv.getContext("2d");
    c.shadowColor = ink(0.07 * psh);
    c.shadowBlur = blur;
    c.shadowOffsetX = size;
    c.fillStyle = "#000";
    c.beginPath();
    c.arc(size / 2 - size, size / 2, rad, 0, TAU);
    c.fill();
    this.ds = {
      key: key,
      cv: cv,
      c: size / 2
    };
    return this.ds;
  };
  _proto.drawRow = function drawRow(R, now) {
    var rg = this.rg;
    if (!R.ctx || !rg || R.w < 1 || R.h < 1) return false;
    var active = now < R.until;
    if (!active && !R.dirty) return false;
    this.size(R);
    var ctx = R.ctx,
      s = R.s,
      dots = R.dots,
      n = dots.length;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, R.cv.width, R.cv.height);
    if (n && R.color && rg.D > 0) {
      var D = rg.D,
        rad = D / 2 * s,
        ring = rad + 0.25 * s,
        m = ROW_PAD * s,
        top = D * 1.8 * rg.hk;
      var sp = this.dotShadow(D, s, rg.psh);
      var xs = new Float64Array(n),
        ys = new Float64Array(n),
        lift = new Float64Array(n),
        fall = new Float64Array(n),
        op = new Float64Array(n);
      var mixed = false;
      for (var i = 0; i < n; i++) {
        var d = dots[i],
          col = Math.floor(i / rg.R),
          row = i % rg.R,
          dh = 1.8 * D * chanAt(d.q, now) * s;
        xs[i] = m + col * (D + rg.dg) * s + rad;
        ys[i] = m + (top + row * (D + rg.dv)) * s + rad;
        lift[i] = dh * rg.hk;
        fall[i] = dh * rg.shf;
        op[i] = chanAt(d.op, now);
        if (op[i] !== 1) mixed = true;
      }
      var paint = function paint(list, a) {
        ctx.globalAlpha = a;
        if (sp) list.forEach(function (i) {
          ctx.drawImage(sp.cv, xs[i] - sp.c, ys[i] + fall[i] - sp.c);
        });
        if (R.line) {
          ctx.fillStyle = R.line;
          ctx.beginPath();
          list.forEach(function (i) {
            ctx.moveTo(xs[i] + ring, ys[i]);
            ctx.arc(xs[i], ys[i], ring, 0, TAU);
          });
          ctx.fill();
          ctx.beginPath();
          list.forEach(function (i) {
            ctx.moveTo(xs[i] + ring, ys[i] - lift[i]);
            ctx.arc(xs[i], ys[i] - lift[i], ring, 0, TAU);
          });
          ctx.fill();
        }
        var sides = false;
        ctx.fillStyle = R.side;
        ctx.beginPath();
        list.forEach(function (i) {
          if (lift[i] > 0.01) {
            sides = true;
            ctx.moveTo(xs[i] + rad, ys[i]);
            ctx.arc(xs[i], ys[i], rad, 0, TAU);
          }
        });
        if (sides) ctx.fill();
        ctx.fillStyle = R.color;
        ctx.beginPath();
        list.forEach(function (i) {
          var y = ys[i] - lift[i];
          ctx.moveTo(xs[i] + rad, y);
          ctx.arc(xs[i], y, rad, 0, TAU);
        });
        ctx.fill();
      };
      var all = [];
      for (var _i2 = 0; _i2 < n; _i2++) all.push(_i2);
      if (!mixed) paint(all, 1);else {
        var groups = new Map();
        all.forEach(function (i) {
          var a = Math.round(op[i] * 100) / 100;
          if (!groups.has(a)) groups.set(a, []);
          groups.get(a).push(i);
        });
        groups.forEach(function (list, a) {
          if (a > 0) paint(list, a);
        });
      }
      ctx.globalAlpha = 1;
    }
    R.dirty = active;
    return active;
  };
  _proto.destroy = function destroy() {
    this.gone = true;
    if (this.raf && typeof cancelAnimationFrame === "function") cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.ro) this.ro.disconnect();
    if (this.io) this.io.disconnect();
  };
  return PegPainter;
}();
var Component = function (_DCLogic) {
  "use strict";

  function Component(props) {
    var _ref;
    var _this7;
    _this7 = _DCLogic.call(this, props) || this;
    var introOn = ((_ref = props && props.intro) != null ? _ref : "On view and switches") !== "Off" && !reducedMotion();
    _this7.state = {
      metroId: null,
      menu: false,
      pollId: null,
      picked: [],
      oth: 0,
      activePath: -1,
      info: false,
      demo: introOn ? "hold" : null,
      view: "build",
      calm: 0,
      fit: null
    };
    _this7.layouts = {};
    _this7.tones = {};
    _this7.introTimers = [];
    _this7.wonId = 0;
    _this7.chartId = "e-chart-" + Math.random().toString(36).slice(2, 10);
    _this7.partsId = "e-parts-" + Math.random().toString(36).slice(2, 10);
    _this7.eyeId = "e-eye-" + Math.random().toString(36).slice(2, 10);
    _this7.infoId = "e-info-" + Math.random().toString(36).slice(2, 10);
    _this7.boardId = "e-board-" + Math.random().toString(36).slice(2, 10);
    _this7.boxId = "e-box-" + Math.random().toString(36).slice(2, 10);
    _this7.painter = new PegPainter();
    _this7.D = props.data;
    _this7.hoverPeg = function (e) {
      return _this7.showSeat(e);
    };
    _this7.leavePeg = function (e) {
      var el = e && e.currentTarget;
      if (el && el.removeAttribute) el.removeAttribute("title");
    };
    _this7.press = null;
    _this7.stepT = 0;
    _this7.stopHold = function () {
      clearTimeout(_this7.stepT);
      _this7.stepT = 0;
    };
    _this7.cancelHold = function () {
      if (_this7.press) _this7.press.held = true;
      _this7.stopHold();
    };
    _this7.metroWrapId = "e-metro-" + Math.random().toString(36).slice(2, 10);
    _this7.metroBtnId = _this7.metroWrapId + "-btn";
    _this7.metroMenuId = _this7.metroWrapId + "-menu";
    _this7.toggleMetro = function (e) {
      var open = !_this7.state.menu;
      _this7.metroFocus = open && e && e.detail === 0 ? "current" : null;
      _this7.setState({
        menu: open
      });
    };
    _this7.metroKey = function (e) {
      return _this7.keyMetro(e);
    };
    _this7.metroBlur = function (e) {
      return _this7.blurMetro(e);
    };
    return _this7;
  }
  _inheritsLoose(Component, _DCLogic);
  var _proto2 = Component.prototype;
  _proto2.watchRows = function watchRows() {
    var _this8 = this;
    var tries = 0;
    var _go = function go() {
      if (_this8.gone) return;
      var el = typeof document !== "undefined" ? document.getElementById(_this8.partsId) : null;
      if (!el) {
        if (tries++ < 20) _this8.fitTimer = setTimeout(_go, 50);
        return;
      }
      if (typeof ResizeObserver === "function") {
        _this8.ro = new ResizeObserver(function () {
          return _this8.fitRows();
        });
        _this8.ro.observe(el);
      }
      _this8.fitRows();
    };
    _go();
  };
  _proto2.fitRows = function fitRows() {
    if (this.gone || typeof document === "undefined" || typeof getComputedStyle !== "function") return;
    var el = document.getElementById(this.partsId);
    var rows = el && el.querySelector(".e-rows");
    if (!rows || !el.clientWidth || !el.clientHeight) return;
    var cs = getComputedStyle(rows);
    var px = function px(k, d) {
      var v = parseFloat(cs.getPropertyValue(k));
      return isFinite(v) ? v : d;
    };
    this.fitHkUsed = this.fitHk;
    var metro = this.metroOf();
    this.fitMetro = metro.id;
    var fit = bestFit(el.clientWidth, el.clientHeight, {
      max: metro.max,
      rp: px("--rp", 12),
      name: px("--name", 96),
      g: px("--g", 8),
      count: px("--count", 42),
      dg: px("--dg", 4),
      dv: px("--dv", 4),
      dmax: px("--dmax", 9),
      air: px("--air", 8),
      n: px("--nrows", 6),
      hk: this.fitHk || 0.105
    });
    fit.dot = Math.max(1, fit.dot);
    fit.dg = px("--dg", 4);
    fit.dv = px("--dv", 4);
    var was = this.state.fit;
    if (!was || was.rows !== fit.rows || was.cols !== fit.cols || was.dot !== fit.dot || was.dg !== fit.dg || was.dv !== fit.dv) this.setState({
      fit: fit
    });
  };
  _proto2.introMode = function introMode() {
    var _this$props$intro;
    return (_this$props$intro = this.props.intro) != null ? _this$props$intro : "On view and switches";
  };
  _proto2.introOnSwitch = function introOnSwitch() {
    var m = this.introMode();
    return (m === "On view and switches" || m === "On view and poll switch") && !reducedMotion();
  };
  _proto2.metroOf = function metroOf() {
    var _this$props$startMetr;
    var id = this.state.metroId,
      start = (_this$props$startMetr = this.props.startMetro) != null ? _this$props$startMetr : "Johannesburg";
    return this.D.metros.find(function (m) {
      return m.id === id;
    }) || this.D.metros.find(function (m) {
      return m.id === start || m.name === start;
    }) || this.D.metros[0];
  };
  _proto2.switchMetro = function switchMetro(id) {
    var next = {
      metroId: id,
      menu: false,
      picked: [],
      oth: 0,
      activePath: -1
    };
    if (this.introOnSwitch()) return this.playIntro(next);
    this.stopIntro();
    this.setState(Object.assign(next, {
      demo: null
    }));
  };
  _proto2.pickMetro = function pickMetro(id) {
    this.metroReturn = true;
    if (id === this.metroOf().id) {
      this.setState({
        menu: false
      });
      return;
    }
    this.switchMetro(id);
  };
  _proto2.watchMetro = function watchMetro(open) {
    var _this9 = this;
    if (typeof document === "undefined" || typeof window === "undefined") return;
    if (open && !this.metroAway) {
      var close = function close() {
        if (!_this9.gone && _this9.state.menu) _this9.setState({
          menu: false
        });
      };
      this.metroAway = function (e) {
        var wrap = document.getElementById(_this9.metroWrapId),
          p = e.composedPath ? e.composedPath() : [e.target];
        if (wrap && p.indexOf(wrap) >= 0) return;
        close();
      };
      this.metroGone = close;
      document.addEventListener("click", this.metroAway, true);
      window.addEventListener("blur", this.metroGone);
    } else if (!open && this.metroAway) {
      document.removeEventListener("click", this.metroAway, true);
      window.removeEventListener("blur", this.metroGone);
      this.metroAway = this.metroGone = null;
    }
  };
  _proto2.keyMetro = function keyMetro(e) {
    var k = e.key,
      open = !!this.state.menu;
    if (k === "Escape" || k === "Esc") {
      if (!open) return;
      e.preventDefault();
      e.stopPropagation();
      this.metroReturn = true;
      this.setState({
        menu: false
      });
      return;
    }
    if (k !== "ArrowDown" && k !== "ArrowUp" && k !== "Home" && k !== "End") return;
    if (!open) {
      if (k === "ArrowDown" || k === "ArrowUp") {
        e.preventDefault();
        this.metroFocus = k === "ArrowUp" ? "last" : "current";
        this.setState({
          menu: true
        });
      }
      return;
    }
    var menu = typeof document !== "undefined" ? document.getElementById(this.metroMenuId) : null;
    var list = menu ? Array.prototype.slice.call(menu.querySelectorAll("button")) : [];
    if (!list.length) return;
    e.preventDefault();
    var i = list.indexOf(document.activeElement);
    if (k === "Home") i = 0;else if (k === "End") i = list.length - 1;else if (i < 0) i = k === "ArrowDown" ? 0 : list.length - 1;else i = (i + (k === "ArrowDown" ? 1 : list.length - 1)) % list.length;
    list[i].focus();
  };
  _proto2.blurMetro = function blurMetro(e) {
    var to = e && e.relatedTarget,
      wrap = e && e.currentTarget;
    if (this.state.menu && to && wrap && wrap.contains && !wrap.contains(to)) this.setState({
      menu: false
    });
  };
  _proto2.stopIntro = function stopIntro() {
    this.introTimers.forEach(function (t) {
      return clearTimeout(t);
    });
    this.introTimers = [];
    this.introDone = true;
    if (this.io) {
      this.io.disconnect();
      this.io = null;
    }
  };
  _proto2.drainIntro = function drainIntro() {
    var _this0 = this;
    var waveT = num(this.props.waveTime, 600, 0, 3000),
      holdT = num(this.props.holdTime, 1000, 0, 6000);
    var at = function at(t, demo) {
      _this0.introTimers.push(setTimeout(function () {
        if (!_this0.gone) _this0.setState({
          demo: demo
        });
      }, t));
    };
    at(holdT, "out");
    at(holdT + waveT + INTRO.settle, null);
  };
  _proto2.playIntro = function playIntro(patch) {
    this.stopIntro();
    this.setState(Object.assign({
      demo: "hold"
    }, patch || {}));
    this.drainIntro();
  };
  _proto2.syncPegs = function syncPegs() {
    var _this1 = this;
    if (this.gone) return;
    var id = this.plan ? this.plan.metroId : null,
      jump = this.paintedMetro != null && id !== this.paintedMetro;
    this.paintedMetro = id;
    this.painter.apply(this.plan, jump);
    clearTimeout(this.pegTimer);
    if (!this.painter.b.cv && (this.pegTries = (this.pegTries || 0) + 1) < 20) this.pegTimer = setTimeout(function () {
      return _this1.syncPegs();
    }, 50);
  };
  _proto2.showSeat = function showSeat(e) {
    var el = e && e.currentTarget,
      B = this.painter.b,
      g = B.geo;
    if (!el || !el.setAttribute) return;
    var text = "";
    var t = e.target;
    if (g && B.cv && B.pegs && !(t && t.closest && t.closest("button"))) {
      var box = B.cv.getBoundingClientRect();
      if (box.width > 0 && box.height > 0) {
        var ux = (e.clientX - box.left) / box.width * g.W - g.ml,
          uy = (e.clientY - box.top) / box.height * g.H - g.mt;
        var best = 1,
          hit = -1;
        B.pegs.forEach(function (p, i) {
          var dx = (ux - g.x[i]) / g.hx,
            lift = (g.riseUp + g.sink) * Math.max(0, p.qv || 0);
          var dy0 = (uy - g.y[i]) / g.hy,
            dy1 = (uy - g.y[i] + lift) / g.hy;
          var d = dx * dx + Math.min(dy0 * dy0, dy1 * dy1);
          if (d < best) {
            best = d;
            hit = i;
          }
        });
        if (hit >= 0) text = B.pegs[hit].title;
      }
    }
    if (text) {
      if (el.getAttribute("title") !== text) el.setAttribute("title", text);
    } else if (el.hasAttribute("title")) el.removeAttribute("title");
  };
  _proto2.pressStep = function pressStep(e, dir) {
    var _this10 = this;
    if (e && e.button) return;
    this.stopHold();
    var press = this.press = {
      held: false,
      v: null
    };
    var _run = function run(wait, next) {
      _this10.stepT = setTimeout(function () {
        if (_this10.gone || _this10.press !== press) return;
        press.held = true;
        var was = press.v != null ? press.v : _this10.state.oth;
        press.v = _this10.stepOth(dir, was);
        if (press.v !== was) _run(next, Math.max(STEP.fastest, Math.round(next * STEP.speedup)));
      }, wait);
    };
    _run(STEP.wait, STEP.every);
  };
  _proto2.clickStep = function clickStep(e, dir) {
    var p = this.press;
    this.press = null;
    this.stopHold();
    if (p && p.held && !(e && e.detail === 0)) return;
    this.stepOth(dir);
  };
  _proto2.stepOth = function stepOth(dir, from) {
    var st = this.state,
      metro = this.metroOf(),
      poll = metro.polls.find(function (p) {
        return p.id === st.pollId;
      }) || metro.polls[0];
    var n = poll.seats.OTH || 0,
      cur = from != null ? from : st.oth,
      next = Math.max(0, Math.min(n, cur + dir));
    if (next === cur) return cur;
    var rest = st.picked.filter(function (k) {
      return k !== "OTH";
    });
    var picked = next === 0 ? rest : st.picked.includes("OTH") ? st.picked : rest.concat("OTH");
    this.stopIntro();
    this.setState({
      pollId: poll.id,
      picked: picked,
      oth: next,
      activePath: -1,
      demo: null,
      view: "build"
    });
    return next;
  };
  _proto2.componentDidMount = function componentDidMount() {
    var _this11 = this;
    if (_DCLogic.prototype.componentDidMount) _DCLogic.prototype.componentDidMount.call(this);
    this.watchRows();
    this.syncPegs();
    if (typeof window !== "undefined") {
      window.addEventListener("pointerup", this.stopHold);
      window.addEventListener("pointercancel", this.cancelHold);
      window.addEventListener("blur", this.cancelHold);
    }
    if (this.state.demo !== "hold" && this.state.demo !== "empty") return;
    var queue = function queue() {
      if (_this11.introDone) return;
      _this11.introDone = true;
      if (_this11.io) {
        _this11.io.disconnect();
        _this11.io = null;
      }
      if (_this11.state.demo === "empty") _this11.setState({
        demo: null
      });else _this11.drainIntro();
    };
    var tries = 0;
    var _watch = function watch() {
      if (_this11.introDone || _this11.gone) return;
      var el = typeof document !== "undefined" ? document.getElementById(_this11.chartId) : null;
      if (el && typeof IntersectionObserver === "function") {
        _this11.io = new IntersectionObserver(function (es) {
          if (es.some(function (e) {
            return e.isIntersecting && e.intersectionRatio >= INTRO.view - 0.01;
          })) queue();
        }, {
          threshold: INTRO.view
        });
        _this11.io.observe(el);
      } else if (!el && tries++ < 20) _this11.introTimers.push(setTimeout(_watch, 50));else queue();
    };
    _watch();
  };
  _proto2.watchInfo = function watchInfo(open) {
    var _this12 = this;
    if (typeof document === "undefined" || typeof window === "undefined") return;
    if (open && !this.infoAway) {
      var path = function path(e) {
        return e.composedPath ? e.composedPath() : [e.target];
      };
      var close = function close() {
        if (!_this12.gone && _this12.state.info) _this12.setState({
          info: false
        });
      };
      this.infoLink = false;
      this.infoAway = function (e) {
        var eye = document.getElementById(_this12.eyeId),
          panel = document.getElementById(_this12.infoId),
          p = path(e);
        _this12.infoLink = !!panel && p.some(function (n) {
          return n && n.tagName === "A" && panel.contains(n);
        });
        if (_this12.infoLink || eye && p.indexOf(eye) >= 0) return;
        close();
      };
      this.infoBlur = function () {
        var a = document.activeElement,
          panel = document.getElementById(_this12.infoId);
        if (_this12.infoLink || a && a.tagName === "A" && panel && panel.contains(a)) return;
        close();
      };
      this.infoBack = function () {
        _this12.infoLink = false;
      };
      document.addEventListener("click", this.infoAway, true);
      window.addEventListener("blur", this.infoBlur);
      window.addEventListener("focus", this.infoBack);
    } else if (!open && this.infoAway) {
      document.removeEventListener("click", this.infoAway, true);
      window.removeEventListener("blur", this.infoBlur);
      window.removeEventListener("focus", this.infoBack);
      this.infoAway = this.infoBlur = this.infoBack = null;
    }
  };
  _proto2.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _this$props$hopLength,
      _this13 = this;
    if (_DCLogic.prototype.componentDidUpdate) _DCLogic.prototype.componentDidUpdate.call(this, prevProps, prevState);
    this.watchInfo(!!this.state.info);
    this.watchMetro(!!this.state.menu);
    if (typeof document !== "undefined") {
      if (this.state.menu && this.metroFocus) {
        var menu = document.getElementById(this.metroMenuId),
          list = menu ? menu.querySelectorAll("button") : [];
        var el = this.metroFocus === "last" ? list[list.length - 1] : menu && menu.querySelector("[aria-current=\"true\"]") || list[0];
        if (el) el.focus();
        this.metroFocus = null;
      } else if (!this.state.menu && this.metroReturn) {
        var btn = document.getElementById(this.metroBtnId);
        if (btn) btn.focus();
        this.metroReturn = false;
      }
    }
    if (this.fitMetro && this.fitMetro !== this.metroOf().id) this.fitRows();
    if ((prevProps && prevProps.startMetro) !== this.props.startMetro) this.switchMetro(null);
    this.syncPegs();
    if (this.ro && this.fitHk !== this.fitHkUsed) this.fitRows();
    var w = this.wave;
    if (!w || !w.reached || this.burstFor === this.wonId || ((_this$props$hopLength = this.props.hopLength) != null ? _this$props$hopLength : "Short burst") !== "Short burst") return;
    var id = this.burstFor = this.wonId;
    clearTimeout(this.burstTimer);
    this.burstTimer = setTimeout(function () {
      if (!_this13.gone && _this13.wonId === id) _this13.setState({
        calm: id
      });
    }, (w.majd || 0) + HOP.burst);
  };
  _proto2.componentWillUnmount = function componentWillUnmount() {
    if (_DCLogic.prototype.componentWillUnmount) _DCLogic.prototype.componentWillUnmount.call(this);
    this.gone = true;
    this.watchInfo(false);
    this.watchMetro(false);
    this.introTimers.forEach(function (t) {
      return clearTimeout(t);
    });
    clearTimeout(this.burstTimer);
    clearTimeout(this.fitTimer);
    clearTimeout(this.pegTimer);
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect();
    this.painter.destroy();
    clearTimeout(this.stepT);
    if (typeof window !== "undefined") {
      window.removeEventListener("pointerup", this.stopHold);
      window.removeEventListener("pointercancel", this.cancelHold);
      window.removeEventListener("blur", this.cancelHold);
    }
  };
  _proto2.renderVals = function renderVals() {
    var _this14 = this,
      _this$props$outlines,
      _this$props$hopLength2,
      _this$props$viewAs;
    var st = this.state;
    var D = this.D;
    var metro = this.metroOf();
    var poll = metro.polls.find(function (p) {
      return p.id === st.pollId;
    }) || metro.polls[0];
    var picked = st.picked,
      oth = st.oth;
    var N = metro.seats,
      MAJ = metro.majority;
    var go = function go(patch) {
      _this14.stopIntro();
      _this14.setState(Object.assign({
        pollId: poll.id,
        demo: null,
        view: "build"
      }, patch));
    };
    var seatsOf = function seatsOf(k) {
      return poll.seats[k] || 0;
    };
    var tone = function tone(hex) {
      return _this14.tones[hex] || (_this14.tones[hex] = tonesOf(hex));
    };
    var polls = metro.polls.map(function (p, i, all) {
      var on = p === poll;
      return {
        name: p.tab,
        when: p.when,
        pressed: on ? "true" : "false",
        radius: (i === 0 ? "8px" : "0") + " " + (i === all.length - 1 ? "8px" : "0") + " 0 0",
        bg: on ? DM.black : DM.grey3,
        fg: on ? DM.white : DM.ink1,
        sub: on ? PRINT.tan : PRINT.ink2,
        cls: on ? "is-on" : "is-idle",
        cursor: on ? "default" : "pointer",
        pick: function pick() {
          if (on) return;
          var othNow = _this14.state.oth,
            othAllNow = poll.seats.OTH || 0,
            othAllNew = p.seats.OTH || 0;
          var othNew = othNow <= 0 ? 0 : othNow >= othAllNow ? othAllNew : Math.min(othNow, othAllNew);
          var keep = _this14.state.picked.filter(function (k) {
            return k !== "OTH" || othNew > 0;
          });
          var next = {
            pollId: p.id,
            picked: keep,
            oth: othNew,
            activePath: -1
          };
          if (!keep.length && !othNew && _this14.introOnSwitch()) return _this14.playIntro(next);
          _this14.stopIntro();
          _this14.setState(Object.assign(next, {
            demo: null
          }));
        }
      };
    });
    var infoOpen = !!st.info;
    var I = poll.info;
    var info = {
      title: I.title,
      body: I.body,
      url: I.url,
      linkText: I.link,
      foot: I.foot,
      seats: String(metro.seats),
      facts: I.facts.map(function (f) {
        return {
          k: f[0],
          v: f[1]
        };
      })
    };
    var pathLabel = function pathLabel(pt) {
      var s = pt.p.map(function (k) {
        return D.parties[k].name;
      }).join(" + ");
      if (pt.p.length === 1 && !pt.o) s += " alone";
      if (pt.o) s += pt.o === poll.seats.OTH ? " + Other" : " + " + pt.o + " of Other";
      return s;
    };
    var paths = poll.paths.map(function (pt, i) {
      var on = i === st.activePath;
      var label = pathLabel(pt);
      var total = pt.p.reduce(function (a, k) {
        return a + seatsOf(k);
      }, 0) + pt.o;
      return {
        label: label,
        seatsText: String(total),
        aria: label + ": " + total + " seats",
        pressed: on ? "true" : "false",
        cls: on ? "path is-on" : "path",
        bg: on ? DM.panel : DM.white,
        fg: on ? DM.white : DM.ink1,
        border: on ? DM.panel : DM.grey2,
        pick: function pick() {
          return go({
            picked: pt.p.concat(pt.o ? ["OTH"] : []),
            oth: pt.o,
            activePath: i
          });
        }
      };
    });
    var tilt = (90 - num(this.props.cameraAngle, 80, 15, 90)) * Math.PI / 180;
    var hScale = num(this.props.pegHeight, 1, 0.3, 2.5);
    var hopH = num(this.props.hopHeight, 1.5, 0, 3),
      hopV = num(this.props.hopSpeed, 1, 0.25, 3);
    var hopDur = function hopDur(i) {
      return HOP.tempo * (1 + HOP.spread * (2 * rnd(i, 2) - 1)) / hopV;
    };
    var waveT = num(this.props.waveTime, 600, 0, 3000),
      perSeat = waveT / N;
    var ease = WAVE_EASE[this.props.waveEase] || WAVE_EASE["Smooth start and end"];
    var easeAt = function easeAt(f) {
      return easeTime(ease, f);
    };
    var ms = function ms(v) {
      return Math.round(v) + "ms";
    };
    var sq = Math.cos(tilt),
      hk = Math.sin(tilt);
    this.fitHk = hk;
    if (!this.layouts[N]) this.layouts[N] = seatLayout(N);
    var lay = this.layouts[N];
    var r = lay.r;
    var up = PEG.up * hScale;
    var TOP = up * hk * 1.18 + r * sq + 5;
    var SH = TOP + 530 * sq;
    var cq = function cq(v) {
      return (v / 10).toFixed(3) + "cqw";
    };
    var shf = 1 / Math.tan(num(this.props.sunAngle, 75, 30, 89) * Math.PI / 180);
    var geoKey = [N, tilt, hScale, hopV, hopH, shf].join("|");
    if (!this.geo || this.geo.key !== geoKey) this.geo = boardGeo(lay, {
      key: geoKey,
      TOP: TOP,
      SH: SH,
      sq: sq,
      hk: hk,
      up: up,
      shf: shf,
      hopH: hopH,
      hopDur: hopDur
    });
    var geo = this.geo;
    var stage = {
      w: "min(100cqw, calc((100cqh - 40px) * " + (1000 / SH).toFixed(4) + "))",
      h: "calc(min(100cqw, calc((100cqh - 40px) * " + (1000 / SH).toFixed(4) + ")) * " + (SH / 1000).toFixed(5) + ")",
      left: "calc(50cqw - min(100cqw, calc((100cqh - 40px) * " + (1000 / SH).toFixed(4) + ")) / 2)",
      top: "calc(50cqh + 20px - min(100cqw, calc((100cqh - 40px) * " + (1000 / SH).toFixed(4) + ")) * " + (SH / 2000).toFixed(5) + ")",
      k: (SH / 1000).toFixed(4),
      stick: cq(TOP + 2.1 * sq),
      boardTop: cq(TOP),
      sq: sq.toFixed(4),
      hk: hk.toFixed(4),
      lineH: cq(Math.max(0, 495 - 75 / sq - 2.1)),
      tallyBottom: ((SH - TOP - 495 * sq) / SH * 100).toFixed(2) + "%",
      cvL: cq(-geo.ml),
      cvT: cq(-geo.mt),
      cvW: cq(geo.W),
      cvH: cq(geo.H)
    };
    var any = picked.length > 0 || oth > 0;
    var demo = st.demo,
      demoOn = demo === "hold";
    var empty = demo === "empty",
      council = !!this.props.results && st.view === "council" && !empty && !demoOn;
    var ranked = metro.order.filter(function (k) {
      return k !== "OTH" && poll.seats[k] != null;
    }).sort(function (a, b) {
      return poll.seats[b] - poll.seats[a];
    });
    var makeupOrder = ranked.concat(metro.order.filter(function (k) {
      return k === "OTH";
    }), metro.order.filter(function (k) {
      return k !== "OTH" && poll.seats[k] == null;
    }));
    var demoStart = {},
      demoSeq = [];
    makeupOrder.forEach(function (k) {
      var n = poll.seats[k] || 0;
      demoStart[k] = demoSeq.length;
      for (var i = 0; i < n; i++) demoSeq.push([k, true]);
    });
    var seq = demoOn || council ? demoSeq : [];
    if (!demoOn && !council && !empty) {
      var stack = picked.includes("OTH") || oth === 0 ? picked : picked.concat("OTH");
      stack.forEach(function (k) {
        var n = k === "OTH" ? oth : seatsOf(k);
        for (var i = 0; i < n; i++) seq.push([k, true]);
      });
      metro.order.forEach(function (k) {
        if (k !== "OTH" && picked.includes(k)) return;
        var n = k === "OTH" ? poll.seats.OTH - oth : seatsOf(k);
        for (var i = 0; i < n; i++) seq.push([k, false]);
      });
    }
    var lines = (_this$props$outlines = this.props.outlines) != null ? _this$props$outlines : "Colour";
    var tones = {};
    var toneKey = function toneKey(c, s, k, w) {
      var key = c + "|" + s + "|" + k + "|" + w;
      tones[key] = {
        c: c,
        s: s,
        k: k,
        lw: w
      };
      return key;
    };
    var litKey = function litKey(hex) {
      var t = tone(hex);
      return toneKey(t.c, t.s, lines === "Ink" ? DM.black : t.k, lines === "None" ? 0 : 0.35);
    };
    var emptyKey = toneKey(EMPTY_TONES.c, EMPTY_TONES.s, lines === "Ink" ? "#dddddd" : EMPTY_TONES.k, lines === "None" ? 0 : 0.3);
    metro.order.forEach(function (k) {
      litKey(D.parties[k].color);
    });
    var seats = lay.fill.map(function (p, i) {
      var k = seq[i] ? seq[i][0] : "OTH";
      var lit = (any || demoOn || council) && (seq[i] ? seq[i][1] : false);
      var Pk = D.parties[k] || D.parties.OTH;
      return {
        up: lit,
        color: lit ? Pk.color : "",
        tone: lit ? litKey(Pk.color) : emptyKey,
        hole: lit ? "dark" : "pale",
        title: seq[i] ? Pk.name + ": " + (poll.seats[k] || 0) + (poll.seats[k] === 1 ? " seat" : " seats") : "",
        d: 0
      };
    });
    var tally = picked.reduce(function (s, k) {
      return s + (k === "OTH" ? 0 : seatsOf(k));
    }, 0) + oth;
    var lead = ranked.length ? poll.seats[ranked[0]] || 0 : 0;
    var boardN = demoOn || council ? N : tally;
    var reached = council ? lead >= MAJ : !demoOn && !empty && tally >= MAJ;
    var keys = seats.map(function (s) {
      return s.color;
    });
    var sig = keys.join(",");
    if (!this.wave || this.wave.sig !== sig) {
      var was = this.wave,
        wd = keys.map(function () {
          return 0;
        });
      var majd = 0;
      if (was && was.keys.length === keys.length) {
        var ch = [];
        keys.forEach(function (k, i) {
          if (k !== was.keys[i]) ch.push(i);
        });
        if (ch.length) {
          var back = boardN < was.tally;
          var a0 = lay.fill[back ? ch[ch.length - 1] : ch[0]].a,
            a1 = lay.fill[back ? ch[0] : ch[ch.length - 1]].a;
          var span = Math.abs(a1 - a0) || 1,
            sweepT = span / Math.PI * waveT;
          ch.forEach(function (i) {
            wd[i] = easeAt(Math.abs(lay.fill[i].a - a0) / span) * sweepT + rnd(i, 5) * PEG.jitter;
          });
          if (reached !== !!was.reached) majd = wd[MAJ - 1];
        }
      }
      if (reached && !(was && was.reached)) this.wonId += 1;
      this.wave = {
        sig: sig,
        keys: keys,
        tally: boardN,
        reached: reached,
        wd: wd,
        majd: majd
      };
    }
    seats.forEach(function (s, i) {
      s.d = _this14.wave.wd[i];
    });
    var inPath = st.activePath >= 0;
    var fadeOp = inPath ? "0.3" : "0.45";
    var pickParty = function pickParty(k) {
      var othAll = poll.seats.OTH || 0;
      if (inPath || council) return go(k === "OTH" ? {
        picked: othAll ? ["OTH"] : [],
        oth: othAll,
        activePath: -1
      } : {
        picked: [k],
        oth: 0,
        activePath: -1
      });
      var rest = picked.filter(function (x) {
        return x !== k;
      });
      if (k === "OTH") return go(oth > 0 ? {
        picked: rest,
        oth: 0,
        activePath: -1
      } : {
        picked: othAll ? rest.concat("OTH") : rest,
        oth: othAll,
        activePath: -1
      });
      go({
        picked: picked.includes(k) ? rest : picked.concat(k),
        activePath: -1
      });
    };
    var fitR = st.fit ? st.fit.rows : 4;
    var rowPlans = [];
    var makeup = makeupOrder.map(function (k, j) {
      var n = poll.seats[k],
        name = D.parties[k].name,
        color = D.parties[k].color;
      var tw = labelEm(name, num(_this14.props.labelWeight, 400, 100, 900)).toFixed(4),
        tn = String(Math.max(0, name.length - 1));
      if (n == null) {
        rowPlans.push(null);
        return {
          name: name,
          color: color,
          note: poll.nr || "No seats",
          clickable: false,
          nr: true,
          op: any ? fadeOp : "1",
          tw: tw,
          tn: tn,
          nameFg: PRINT.muted,
          aria: name + ": " + (poll.nr || "no seats"),
          title: poll.nr || "No seats"
        };
      }
      var inN = k === "OTH" ? oth : picked.includes(k) ? n : 0;
      var on = inN > 0;
      var lit = on || demoOn || council;
      var out = any && !on;
      var partial = !demoOn && k === "OTH" && on && inN < n;
      var dots = [];
      var rowT = Math.max(0, n - 1) * perSeat;
      var first = Infinity;
      for (var i = 0; i < n; i++) {
        var left = partial && i >= inN,
          upD = lit && !left,
          w = demo || council ? _this14.wave.wd[demoStart[k] + i] || 0 : 0;
        if (w < first) first = w;
        dots.push({
          up: upD,
          op: left ? 0.3 : 1,
          wd: demo || council ? w : rowT * easeAt((upD ? i : n - 1 - i) / Math.max(1, n - 1))
        });
      }
      var t = tone(color),
        cvId = _this14.partsId + "-cv" + j;
      rowPlans.push({
        cvId: cvId,
        color: color,
        side: t.s,
        line: lines === "None" ? null : lines === "Ink" ? DM.black : t.k,
        dots: dots
      });
      var isOth = k === "OTH",
        shown = demoOn || council ? n : inN;
      return {
        name: name,
        color: color,
        label: isOth ? String(shown) : String(n),
        of: isOth ? "/" + n : "",
        clickable: !isOth,
        nr: false,
        step: isOth,
        lessCls: inN > 0 ? "" : "is-off",
        moreCls: inN < n ? "" : "is-off",
        lessOff: inN > 0 ? "false" : "true",
        moreOff: inN < n ? "false" : "true",
        lessAria: "Take one of Other’s seats out of the coalition (" + inN + " of " + n + " in)",
        moreAria: "Add one of Other’s seats to the coalition (" + inN + " of " + n + " in)",
        lessDown: function lessDown(e) {
          return _this14.pressStep(e, -1);
        },
        moreDown: function moreDown(e) {
          return _this14.pressStep(e, 1);
        },
        lessClick: function lessClick(e) {
          return _this14.clickStep(e, -1);
        },
        moreClick: function moreClick(e) {
          return _this14.clickStep(e, 1);
        },
        stopHold: _this14.stopHold,
        tw: tw,
        tn: tn,
        op: out ? fadeOp : "1",
        pressed: on ? "true" : "false",
        markCls: lit && !council ? "is-on" : "",
        nameFg: lit && !council ? DM.white : DM.ink1,
        pd: ms(demo && n > 0 ? first : 0),
        cls: (out ? "chip is-faded" : "chip") + (on ? " is-picked" : ""),
        pick: function pick() {
          return pickParty(k);
        },
        aria: name + ": " + n + (n === 1 ? " seat" : " seats") + (partial ? ", " + inN + " of them in this coalition" : ""),
        cvId: cvId,
        pcols: String(Math.ceil(n / fitR))
      };
    });
    var hopping = reached && !council && hopH > 0 && !(((_this$props$hopLength2 = this.props.hopLength) != null ? _this$props$hopLength2 : "Short burst") === "Short burst" && st.calm === this.wonId);
    var pegShade = num(this.props.pegShadow, 1, 0, 3);
    var reduce = reducedMotion();
    var F = st.fit;
    this.plan = {
      metroId: metro.id,
      boardId: this.boardId,
      boxId: this.boxId,
      board: {
        geo: geo,
        seats: seats,
        tones: tones,
        toneKey: Object.keys(tones).join(";"),
        snap: demoOn || empty,
        reduce: reduce,
        hopping: hopping,
        majd: demo ? 0 : this.wave.majd,
        hopk: hopH,
        psh: pegShade
      },
      rows: rowPlans,
      rowGeo: F ? {
        key: [F.dot, F.rows, F.dg, F.dv, hk, shf, pegShade].join("|"),
        D: F.dot,
        R: F.rows,
        dg: F.dg,
        dv: F.dv,
        hk: hk,
        shf: shf,
        psh: pegShade,
        snap: demoOn || empty,
        reduce: reduce
      } : null
    };
    var menuOpen = !!st.menu;
    var metros = D.metros.map(function (m, i) {
      var on = m === metro;
      return {
        name: m.name,
        seats: m.seats + " seats",
        optId: _this14.metroMenuId + "-" + i,
        current: on ? "true" : "false",
        cls: on ? "is-on" : "",
        bg: on ? DM.black : "transparent",
        fg: on ? DM.white : DM.ink1,
        sub: on ? PRINT.tan : PRINT.muted,
        cursor: on ? "default" : "pointer",
        pick: function pick() {
          return _this14.pickMetro(m.id);
        }
      };
    });
    return {
      frameMax: ((_this$props$viewAs = this.props.viewAs) != null ? _this$props$viewAs : "Article width") === "Phone (358px)" ? "358px" : "none",
      metroName: metro.name,
      metros: metros,
      menuOpen: menuOpen,
      metroExpanded: menuOpen ? "true" : "false",
      metroBtnCls: menuOpen ? "is-open" : "",
      metroFaceBg: menuOpen ? DM.black : DM.white,
      metroFaceFg: menuOpen ? DM.white : DM.ink1,
      metroWrapId: this.metroWrapId,
      metroBtnId: this.metroBtnId,
      metroMenuId: this.metroMenuId,
      toggleMetro: this.toggleMetro,
      metroKey: this.metroKey,
      metroBlur: this.metroBlur,
      polls: polls,
      paths: paths,
      makeup: makeup,
      stage: stage,
      partsId: this.partsId,
      nRows: makeup.length,
      fit: {
        rows: F ? String(F.rows) : "initial",
        cols: F ? String(F.cols) : "initial",
        dot: F ? F.dot + "px" : "initial"
      },
      rowShb: Math.ceil(1.8 * 1.18 * (F ? F.dot : 10) * shf) + "px",
      labelSize: num(this.props.labelSize, 17, 8, 40) + "px",
      labelWeight: String(num(this.props.labelWeight, 400, 100, 900)),
      letterSpacing: num(this.props.letterSpacing, -0.5, -4, 8) + "px",
      lineHeight: num(this.props.lineHeight, 1.2, 0.6, 3).toFixed(2),
      labelPop: num(this.props.labelPop, 4, 0, 16) + "px",
      labelShadow: num(this.props.labelShadow, 1.15, 0, 3).toFixed(2),
      tally: council ? N : tally,
      tallyOf: council ? " seats" : "/" + MAJ,
      majority: MAJ,
      hasHead: !!this.props.head,
      resetLabel: "Clear the board",
      boxCls: (hopping ? "is-maj" : "") + (demo === "hold" || empty ? " is-snap" : "") + (council ? " is-council" : ""),
      majd: ms(demo ? 0 : this.wave.majd),
      tallyCls: demo === "hold" || empty ? "is-hidden" : "",
      tallyT: ms(Math.max(400, waveT)),
      tallyD: ms(waveT * 0.2),
      chartId: this.chartId,
      boardId: this.boardId,
      boxId: this.boxId,
      hoverPeg: this.hoverPeg,
      leavePeg: this.leavePeg,
      majOpacity: reached ? "1" : "0",
      majTransform: reached ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(6px) scale(0.85)",
      majVisibility: reached ? "visible" : "hidden",
      info: info,
      infoOpen: infoOpen,
      infoExpanded: infoOpen ? "true" : "false",
      infoId: this.infoId,
      eyeId: this.eyeId,
      toggleInfo: function toggleInfo() {
        return _this14.setState({
          info: !_this14.state.info
        });
      },
      resetBoard: function resetBoard() {
        return go({
          picked: [],
          oth: 0,
          activePath: -1
        });
      },
      eyeCls: infoOpen ? "is-open" : "is-closed",
      eyeRing: infoOpen ? DM.white : DM.black,
      eyeBg: DM.black,
      chartLabel: metro.name + " council: " + metro.seats + " seats, " + MAJ + " for a majority. " + ranked.map(function (k) {
        return D.parties[k].name + " " + poll.seats[k];
      }).join(", ") + (poll.seats.OTH ? ", Other " + poll.seats.OTH : "")
    };
  };
  return Component;
}(DCLogic);


  /* ---- the renderer: fills the template and writes only what changed, so the canvases the pegs are drawn on stay (from v27) ---- */
  function look(sc, p) { var v = sc[p[0]]; for (var i = 1; i < p.length && v != null; i++) v = v[p[i]]; return v; }
  function interp(x, sc) {
    var s = '';
    for (var i = 0; i < x.length; i++) {
      if (!(i % 2)) { s += x[i]; continue; }
      var v = look(sc, x[i]);
      if (v != null && typeof v !== 'boolean') s += v;
    }
    return s;
  }
  function attrsOf(a, sc) {
    var o = {};
    for (var n in a) {
      var v = a[n];
      if (typeof v === 'string') o[n] = v;
      else if (v.p) { var r = look(sc, v.p); o[n] = r == null || (r === false && n.indexOf('aria-') !== 0) ? null : String(r); }
      else o[n] = interp(v.x, sc);
    }
    return o;
  }
  function eventsOf(on, sc) { var o = {}; for (var n in on) o[n] = look(sc, on[n]); return o; }
  function build(nodes, sc, pre, out) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], k = pre + i;
      if (typeof n === 'string') out.push({ k: k, txt: n });
      else if (n.x) out.push({ k: k, txt: interp(n.x, sc) });
      else if (n.h != null) out.push({ k: k, h: n });
      else if (n.i) { if (look(sc, n.i)) build(n.c, sc, k + '.', out); }
      else if (n.f) {
        var list = look(sc, n.f) || [];
        for (var j = 0; j < list.length; j++) { var s2 = Object.create(sc); s2[n.as] = list[j]; build(n.c, s2, k + '.' + j + '.', out); }
      }
      else out.push({ k: k, t: n.t, s: n.s, a: attrsOf(n.a, sc), on: eventsOf(n.on, sc), c: build(n.c, sc, k + '.', []) });
    }
    return out;
  }
  function dispatch(e) { var f = this.cbOn && this.cbOn[e.type]; if (typeof f === 'function') f(e); }
  function parseStyle(s) {
    var o = {}, ps = s ? s.split(';') : [];
    for (var i = 0; i < ps.length; i++) {
      var c = ps[i].indexOf(':');
      if (c < 0) continue;
      var k = ps[i].slice(0, c).trim();
      if (k) o[k.indexOf('--') === 0 ? k : k.toLowerCase()] = ps[i].slice(c + 1).trim();
    }
    return o;
  }
  function setStyle(el, s) {
    var o = parseStyle(s), p = el.cbStyle || {}, k;
    for (k in p) if (!(k in o)) el.style.removeProperty(k);
    for (k in o) if (p[k] !== o[k]) { if (o[k] === '') el.style.removeProperty(k); else el.style.setProperty(k, o[k]); }
    el.cbStyle = o;
  }
  function staticNode(n) {
    if (!n.node) {
      var d = document.createElement('div');
      if (n.s && !/^<svg[\s>]/i.test(n.h)) { d.innerHTML = '<svg xmlns="' + SVGNS + '">' + n.h + '</svg>'; n.node = d.firstChild.firstChild; }
      else { d.innerHTML = n.h; n.node = d.firstChild; }
    }
    var c = n.node.cloneNode(true);
    c.cbPart = n;
    return c;
  }
  function fits(node, v) {
    if (v.txt != null) return node.nodeType === 3;
    if (v.h) return node.cbPart === v.h;
    return node.cbTag === v.t;
  }
  function create(v) {
    if (v.txt != null) return document.createTextNode(v.txt);
    if (v.h) return staticNode(v.h);
    var el = v.s ? document.createElementNS(SVGNS, v.t) : document.createElement(v.t);
    el.cbTag = v.t; el.cbAttr = {}; el.cbListen = {};
    return el;
  }
  function update(node, v) {
    if (v.txt != null) { if (node.nodeValue !== v.txt) node.nodeValue = v.txt; return node; }
    if (v.h) return node;
    var A = v.a, P = node.cbAttr, L = node.cbListen, n;
    for (n in A) {
      if (n === 'style') { if (A[n] !== P[n]) setStyle(node, A[n]); }
      else if (A[n] == null) { if (P[n] != null) node.removeAttribute(n); }
      else if (A[n] !== P[n]) node.setAttribute(n, A[n]);
    }
    for (n in P) if (!(n in A) && P[n] != null) { if (n === 'style') setStyle(node, ''); else node.removeAttribute(n); }
    node.cbAttr = A;
    for (n in v.on) if (!L[n]) { L[n] = 1; node.addEventListener(n, dispatch); }
    node.cbOn = v.on;
    patchKids(node, v.c);
    return node;
  }
  function patchKids(el, list) {
    var old = el.cbKids || {}, now = {}, want = [], i;
    for (i = 0; i < list.length; i++) {
      var v = list[i], node = old[v.k];
      node = node && fits(node, v) ? update(node, v) : (v.txt != null || v.h ? create(v) : update(create(v), v));
      now[v.k] = node;
      want.push(node);
    }
    for (i = 0; i < want.length; i++) { var at = el.childNodes[i]; if (at !== want[i]) el.insertBefore(want[i], at || null); }
    while (el.childNodes.length > want.length) el.removeChild(el.lastChild);
    el.cbKids = now;
  }

  /* ---- mounting ---- */
  var LIVE = [];
  function mount(host, opts) {
    opts = opts || {};
    // boards whose host has left the page (a municipal file that was closed) stop drawing
    LIVE = LIVE.filter(function (b) { if (b.host.isConnected && b.host !== host) return true; b.destroy(); return false; });
    var inst = null, queued = false, mounted = false, broken = false, shown = null;
    host.classList.add('ehb');
    host.classList.toggle('is-auto', !opts.fixed);
    host.classList.toggle('no-head', !opts.head);
    host.style.display = '';
    var api = { host: host, set: function () {}, current: function () { return null; }, refresh: function () {}, destroy: function () {} };
    function fail(e) {
      broken = true;
      host.style.display = 'none';
      if (window.console) console.error('[elections-hub] seat board failed:', e);
    }
    function paint() { patchKids(host, build(BOARD_TPL, inst.renderVals(), '', [])); }
    function flush() {
      queued = false;
      if (broken || inst.gone) return;
      var prev = shown;
      try { paint(); shown = inst.state; if (inst.componentDidUpdate) inst.componentDidUpdate(inst.props, prev); }
      catch (e) { fail(e); }
    }
    try {
      if (!opts.data || !opts.data.metros || !opts.data.metros.length) throw new Error('no council to draw');
      var props = {};
      for (var k in BOARD_PROPS) props[k] = BOARD_PROPS[k];
      props.head = !!opts.head;
      props.startMetro = opts.start || null;
      props.data = opts.data;
      inst = new Component(props);
      inst.cbQueue = function () {
        if (queued || !mounted || broken) return;
        queued = true;
        if (window.Promise) Promise.resolve().then(flush); else setTimeout(flush, 0);
      };
      paint();
      shown = inst.state;
      mounted = true;
      if (inst.componentDidMount) inst.componentDidMount();
    } catch (e) { fail(e); return api; }
    api.set = function (data) {
      if (broken || inst.gone || !data || !data.metros || !data.metros.length) return;
      inst.D = data;
      inst.props.data = data;
      inst.setState({});
      setTimeout(function () { if (!inst.gone) inst.fitRows(); }, 0);
    };
    api.current = function () { return broken ? null : inst.metroOf().id; };
    // v4: the coalition builder puts a council a reader opened in the municipality finder on the board
    api.select = function (id) { if (!broken && !inst.gone && id !== inst.metroOf().id) inst.switchMetro(id); };
    api.refresh = function () { if (!broken && !inst.gone) { inst.setState({}); setTimeout(function () { if (!inst.gone) inst.fitRows(); }, 0); } };
    api.destroy = function () { if (inst && !inst.gone) { try { inst.componentWillUnmount(); } catch (e) {} } };
    LIVE.push(api);
    return api;
  }
  // Labels are measured again once Geist has loaded.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { EM = {}; LIVE.forEach(function (b) { b.refresh(); }); ROWS.forEach(function (r) { r.fit(); }); });

  /* ---- plain rows of pegs ----
     rows: [{ name, color, n (pegs), value (the figure at the end of the row), aria }]; opts: { R (rows of pegs a party gets, 2 by
     default), label (for screen readers) }. The pegs are drawn by the widget's own painter, standing as a picked party's do, and
     rise row by row, column by column, the first time the rows are on screen. */
  var ROWS = [];
  var ROW_HK = Math.sin((90 - BOARD_PROPS.cameraAngle) * Math.PI / 180), ROW_SHF = 1 / Math.tan(BOARD_PROPS.sunAngle * Math.PI / 180);
  function pegRows(host, rows, opts) {
    opts = opts || {};
    ROWS = ROWS.filter(function (r) { if (r.host.isConnected && r.host !== host) return true; r.stop(); return false; });
    var R = opts.R || 2, id = 'ehr-' + Math.random().toString(36).slice(2, 9), painter = new PegPainter(), shownUp = false, D = 0, ro = null, io = null;
    var max = rows.reduce(function (a, r) { return Math.max(a, r.n); }, 1);
    host.classList.add('ehr-host');
    host.innerHTML = '<div class="ehr" id="' + id + '" role="list"' + (opts.label ? ' aria-label="' + esc(opts.label) + '"' : '') + ' style="--nrows:' + rows.length + '">' +
      rows.map(function (r, j) {
        return '<div class="ehr-row" role="listitem" aria-label="' + esc(r.aria || (r.name + ': ' + r.value)) + '">' +
          '<span class="ehr-name" aria-hidden="true" style="--tw:' + labelEm(r.name, 400).toFixed(3) + ';--tn:' + Math.max(0, r.name.length - 1) + '">' + esc(r.name) + '</span>' +
          '<span class="ehr-bar" aria-hidden="true"><span class="ehr-dots" data-n="' + r.n + '"><canvas id="' + id + '-' + j + '"></canvas></span><span class="ehr-lead"></span></span>' +
          '<span class="ehr-val" aria-hidden="true">' + r.value + '</span></div>';
      }).join('') + '</div>';
    var box = host.firstChild;
    function plan(up) {
      var dg = box.clientWidth < 520 ? 2 : 4;
      return {
        boardId: id + '-none', boxId: id,
        board: { geo: { hop: [] }, seats: [], tones: {}, toneKey: '', snap: true, reduce: true, hopping: false, majd: 0, hopk: 0, psh: 1 },
        rows: rows.map(function (r, j) {
          var t = tonesOf(r.color), per = Math.min(28, 900 / Math.max(1, r.n));
          var dots = [];
          for (var i = 0; i < r.n; i++) dots.push({ up: up, op: 1, wd: up ? Math.floor(i / R) * per * R + j * 40 : 0 });
          return { cvId: id + '-' + j, color: r.color, side: t.s, line: t.k, dots: dots };
        }),
        rowGeo: D ? { key: [D, R, dg].join('|'), D: D, R: R, dg: dg, dv: dg, hk: ROW_HK, shf: ROW_SHF, psh: 1, snap: !up || reducedMotion(), reduce: reducedMotion() } : null
      };
    }
    // the biggest whole-pixel peg that fits the longest row across the room it has (as the widget's rows do), 9px at most
    function fit() {
      if (!host.isConnected) return;
      var row = box.querySelector('.ehr-bar');
      if (!row) return;
      var dg = box.clientWidth < 520 ? 2 : 4, A = row.clientWidth - 18, C = Math.ceil(max / R);
      var d = Math.max(2, Math.floor(Math.min(9, (A - (C - 1) * dg) / C)));
      var h = R * d + (R - 1) * dg + d * 1.8 * ROW_HK;
      box.querySelectorAll('.ehr-dots').forEach(function (el) {
        var c = Math.ceil((+el.getAttribute('data-n') || 0) / R);
        el.style.width = Math.max(0, c * d + (c - 1) * dg) + 'px';
        el.style.height = h.toFixed(2) + 'px';
        var cv = el.firstChild;
        cv.style.height = 'calc(100% + 8px + ' + Math.ceil(1.8 * 1.18 * d * ROW_SHF) + 'px)';
      });
      var was = D;
      D = d;
      if (was !== d || !painter.rg) painter.apply(plan(shownUp), true);
    }
    function show() {
      if (shownUp) return;
      shownUp = true;
      painter.apply(plan(true), false);
    }
    var api = { host: host, fit: fit, stop: function () { painter.destroy(); if (ro) ro.disconnect(); if (io) io.disconnect(); } };
    fit();
    if (typeof ResizeObserver === 'function') { ro = new ResizeObserver(function () { fit(); }); ro.observe(box); }
    if (reducedMotion() || opts.still || typeof IntersectionObserver !== 'function') show();
    else {
      io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); io = null; show(); } }, { threshold: 0.4 });
      io.observe(box);
    }
    ROWS.push(api);
    return api;
  }

  /* ---- the half circle (the council seats in the municipal file) ----
     EH_BOARD.arc(host, { data, start }): data as for mount; start, the council to draw. Every seat is a peg standing in its party's
     colour, largest party from the left and Other last, with the parties and their seats underneath. With more than one election in
     data a switch above picks one (the page passes one: 2026). The pegs rise in one sweep the first time half of the half circle is on screen. Returns
     { set(data), pick(key), picked(), destroy() }: pick(key) picks one party's seats out (its pegs stay up in its colour, the rest
     sink; a party grouped in Other stands in its own colour), pick(null) puts the whole council back. v6: a party picked out lifts its pegs a little instead,
     and the rest stay standing. The party under the pointer is picked out the same way (a tap on a touch screen: a second tap, or a tap off the pegs, puts
     the council back) and tells opts.onPick(key); while a party is picked out, the number in the middle is its seats. Other's seats are laid out
     party by party, largest first, from poll.oth ([key, seats] pairs), so each party in it can be picked out.
     The number of seats stands in the hole in the middle, set at ARC_NUM px for every council size (smaller only when the page is too
     narrow for the half circle, which then shrinks as a whole). hemi(N) works out the rows for N seats around it: for one row, two rows
     and so on, and for seats a little closer together or further apart than ARC_G, it finds the hole that puts the seats in each row as
     far apart as the rows are, then sizes the half circle so that the hole leaves ARC_GAP[0] px between the number and the nearest peg
     (never less than ARC_GAP[1]), with pegs no wider than ARC_DOT and the half circle no wider than ARC_MAX. It keeps the layout with
     the most even rows, the space round the number nearest ARC_GAP[0], the spacing nearest ARC_G and the biggest pegs. Each row runs
     from one end of the base line to the other, with seats in proportion to its length. So 7 to 16 seats sit in one row, 17 to 29 in
     two, 45 in three and 270 in nine, evenly spaced every time, with about the same space round the number.
     opts.cap, the lines of a caption (['Council', 'seats']), stands the caption under the number, in the hole with it, its last line
     on the foot of the bottom row of pegs; the hole grows to fit it (ARC_CAP). The caption is a button that opens opts.info (the explainer's HTML) underneath, as the page's ? buttons do. */
  var HEMI = {}, ARCS = [];
  var ARC_G = 0.76, ARC_R = 12.5, ARC_DOT = 36, ARC_MAX = 600;   // peg width over seat spacing; a peg's radius in board units; widest peg, widest half circle (px)
  var ARC_NUM = 48, ARC_FIG = [0.6, 0.75], ARC_GAP = [46, 30];   // the number's size (px); a figure's width and height over it; the space wanted and the least between the number and the pegs (px)
  var ARC_CAP = [1.23, 0.82];   // a caption's width, and its height with the space above it, over the number's size
  var ARC_GHOST = 0.25;   // v4: opts.ghost (a projection): the pegs' opacity; they stand in empty sockets. v6: their faces' opacity, their rims staying solid in their own colours
  var ARC_LIFT = 3.2, ARC_REACH = 4.8;   // v6: how high a party picked out lifts its pegs, over the height they stand (v22.9: 3.2, 1.6 until v22.8); how near a peg the pointer picks it, in peg radii squared
  // v5: the button that clears the coalition (the builder's)
  var ARC_CLEAR = '<span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" style="display:block;fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round"><path d="M18.76 13.81a7 7 0 1 1-2.26-7.17l2 1.67"></path><path d="M18.5 3.8v4.5h-4.5"></path></svg></span>';
  var ARC_RING = 0.14, ARC_RISE = 0.28, ARC_HOP = 2.2;   // ARC_HOP: how high the majority party's pegs hop, over the height they stand   // the socket's rim and the height a peg stands, over its radius: a touch lighter than the board's, as these pegs are bigger
  function spread(N, ideal, sum) {
    var c = ideal.map(function (v) { return Math.floor(v * N / sum); }), left = N, i;
    for (i = 0; i < c.length; i++) left -= c[i];
    ideal.map(function (v, j) { return [v * N / sum - c[j], j]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, left).forEach(function (e) { c[e[1]]++; });
    return c;
  }
  // The hole the number needs, as [wanted, least] in px: its corner (half its width, its height) plus the space round it.
  // With a caption (cap) the number stands on it, and the caption's own corner counts too.
  function arcHole(N, cap) {
    var w = String(N).length * ARC_FIG[0] * ARC_NUM / 2, t = (ARC_FIG[1] + (cap ? ARC_CAP[1] : 0)) * ARC_NUM, c = Math.sqrt(w * w + t * t);
    if (cap) c = Math.max(c, Math.sqrt(Math.pow(ARC_CAP[0] * ARC_NUM / 2, 2) + Math.pow(ARC_CAP[1] * ARC_NUM, 2)));
    return [c + ARC_GAP[0], c + ARC_GAP[1]];
  }
  // Seat centres for an outer radius of 1 (x from -1 to 1, y up from the base line), left to right; r, a peg's radius; h, the hole's;
  // W, the half circle's width in px. A layout's half circle is as wide as gives the hole wanted, a touch wider where that buys bigger
  // pegs (m), and no wider than ARC_DOT pegs or ARC_MAX allow.
  function hemi(N, cap) {
    var hkey = N + (cap ? 'c' : '');
    if (HEMI[hkey]) return HEMI[hkey];
    var H = arcHole(N, cap), m = Math.exp(1 / 16), best = null, pts = [], k, g, h, i, j, a, L;
    // the peg a council this size would have at ARC_G filling the widest half circle: no layout is marked down for pegs bigger than this
    var big = Math.min(ARC_DOT, ARC_G * Math.sqrt(Math.PI / 2 * (ARC_MAX * ARC_MAX / 4 - H[0] * H[0]) / N));
    for (k = 1; k <= 24; k++) {
      for (g = 0; g <= 13; g++) {
        for (h = 0.1; h < 0.95; h += 0.005) {
          var G = 0.6 + g * 0.02, p = (1 - h) / (k - 1 + G), r = G * p / 2, ideal = [], sum = 0, x;
          for (i = 0; i < k; i++) { x = p / (2 * (h + r + i * p)); ideal.push(x >= 1 ? 2 : 1 + Math.PI / (2 * Math.asin(x))); sum += ideal[i]; }
          if (sum < N * 0.8 || sum > N * 1.25) continue;
          var cnt = spread(N, ideal, sum), E = 0, cmin = p, ok = true;
          for (i = 0; i < k; i++) {
            if (cnt[i] < 2) { ok = false; break; }
            var c = 2 * (h + r + i * p) * Math.sin(Math.PI / (2 * (cnt[i] - 1)));
            E = Math.max(E, Math.abs(Math.log(c / p)));
            if (c < cmin) cmin = c;
          }
          if (!ok) continue;
          var rd = G * Math.min(p, cmin) / 2, ext = h + r + (k - 1) * p + rd, lr = rd / ext, lh = (h + r - rd) / ext;
          var W = Math.min(ARC_MAX, ARC_DOT / lr, m * 2 * H[0] / lh), hole = lh * W / 2;
          if (hole < H[1]) continue;
          var dh = Math.log(hole / H[0]), dg = Math.log(G / ARC_G);
          // uneven rows count most, then the space round the number, then seats spread out (closer together counts less), then small pegs
          var score = 5 * E + 8 * dh * dh + (dg < 0 ? 10 : 4) * dg * dg + 1.2 * Math.max(0, Math.log(big / (lr * W)));
          if (!best || score < best.score) best = { score: score, k: k, h: h, p: p, r: r, cnt: cnt, ext: ext, lr: lr, lh: lh, W: W };
        }
      }
    }
    if (!best) {
      // one or two seats
      var R = H[0] + ARC_DOT, rho0 = (H[0] + ARC_DOT / 2) / R;
      for (i = 0; i < N; i++) { a = Math.PI * (1 - (i + 0.5) / N); pts.push({ x: rho0 * Math.cos(a), y: rho0 * Math.sin(a), a: a, row: 0 }); }
      L = { pts: pts, r: ARC_DOT / 2 / R, h: H[0] / R, W: 2 * R };
    } else {
      for (i = 0; i < best.k; i++) {
        var rho = (best.h + best.r + i * best.p) / best.ext, n = best.cnt[i];
        for (j = 0; j < n; j++) { a = Math.PI * (1 - j / (n - 1)); pts.push({ x: rho * Math.cos(a), y: rho * Math.sin(a), a: a, row: i }); }
      }
      L = { pts: pts, r: best.lr, h: best.lh, W: best.W };
    }
    pts.sort(function (P, Q) { return Q.a - P.a || P.row - Q.row; });
    L.cap = !!cap;
    return (HEMI[hkey] = L);
  }
  // The painter's board for a half circle, in units that keep a peg's radius at ARC_R (so pegs look alike at every council size):
  // SW by SH is the half circle itself, from the outer edge of the pegs at the top to their foot on the base line.
  function arcGeo(L) {
    var tilt = (90 - BOARD_PROPS.cameraAngle) * Math.PI / 180, sq = Math.cos(tilt), hk = Math.sin(tilt);
    var shf = 1 / Math.tan(BOARD_PROPS.sunAngle * Math.PI / 180), up = ARC_RISE * ARC_R / hk;
    var U = ARC_R / L.r, r = ARC_R, ry = r * sq, hx = r * (1 + ARC_RING), hy = hx * sq, riseUp = up * hk, sink = PEG.sink * sq;
    var ssu = (2 * r + up * shf) / (2 * r), shk = up * shf / (2 * r + up * shf), SW = 2 * U, SH = (1 + L.r) * U * sq;
    var x = L.pts.map(function (p) { return (1 + p.x) * U; }), y = L.pts.map(function (p) { return (1 - p.y) * U * sq; });
    var depth = x.map(function (v, i) { return i; }).sort(function (i, j) { return y[i] - y[j] || x[i] - x[j]; });
    var side = Math.max(hx, r), reachUp = riseUp * (1.18 + ARC_HOP + ARC_LIFT) + ry, reachDown = Math.max(hy, sink * 1.08 + ry, ry * (2 * (1 + (ssu - 1) * 1.18) * (1 + (ARC_HOP + ARC_LIFT) * shk) - 1));
    var ml = Math.max(0, side - Math.min.apply(null, x)) + 6, mr = Math.max(0, Math.max.apply(null, x) + side - SW) + 6;
    var mt = Math.max(0, reachUp - Math.min.apply(null, y)) + 6, mb = Math.max(0, Math.max.apply(null, y) + reachDown - SH) + 6;
    return { key: 'arc' + L.pts.length + (L.cap ? 'c' : ''), x: x, y: y, depth: depth, hop: x.map(function (v, i) { var hd = HOP.tempo * (1 + HOP.spread * (2 * rnd(i, 2) - 1)); return { hd: hd, hp: rnd(i, 3) * hd, hh: HOP.low + (1 - HOP.low) * rnd(i, 4) }; }), r: r, ry: ry, hx: hx, hy: hy,
      riseUp: riseUp, sink: sink, ssu: ssu, shk: shk, ml: ml, mr: mr, mt: mt, mb: mb, W: SW + ml + mr, H: SH + mt + mb, SW: SW, SH: SH };
  }
  // A short, quiet click (a burst of filtered noise at freq Hz), for the caption's button. Silent where Web Audio isn't available.
  var TICK = null;
  function tick(freq) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!TICK) TICK = new AC();
      if (TICK.state === 'suspended') TICK.resume();
      var n = Math.round(TICK.sampleRate * 0.014), buf = TICK.createBuffer(1, n, TICK.sampleRate), ch = buf.getChannelData(0), i;
      for (i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5);
      var src = TICK.createBufferSource(), f = TICK.createBiquadFilter(), g = TICK.createGain();
      f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.4; g.gain.value = 0.22;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(TICK.destination); src.start();
    } catch (e) {}
  }
  function arc(host, opts) {
    opts = opts || {};
    ARCS = ARCS.filter(function (b) { if (b.host.isConnected && b.host !== host) return true; b.destroy(); return false; });
    var D = opts.data, id = 'ehh-' + Math.random().toString(36).slice(2, 9), painter = null, io = null, timer = 0, pick = 0, shown = false, gone = false, N = 0, nPolls = 0, G = null, hl = null, coal = null, was = null, ptype = 'mouse', whoPeg = null, opening = false, otimer = 0;
    var cap = opts.cap && opts.cap.length ? opts.cap : null;
    var api = { host: host, set: set, pick: pickOut, picked: function () { return hl; }, coalition: coalition, destroy: destroy };
    function council() { return D.metros.filter(function (m) { return m.id === opts.start; })[0] || D.metros[0]; }
    function poll() { var m = council(); return m.polls[Math.min(pick, m.polls.length - 1)]; }
    // the parties with seats in this election, largest first, Other last
    function seatsOf() {
      var P = poll(), list = council().order.filter(function (k) { return k !== 'OTH' && P.seats[k] > 0; }).map(function (k, i) { return { k: k, n: P.seats[k], i: i }; });
      list.sort(function (a, b) { return b.n - a.n || a.i - b.i; });
      if (P.seats.OTH > 0) list.push({ k: 'OTH', n: P.seats.OTH });
      return list;
    }
    // every seat from the left: k, the key it is drawn under; p, its party (Other's seats party by party)
    function seqOf() {
      var P = poll(), seq = [];
      seatsOf().forEach(function (s) {
        var by = s.k === 'OTH' && P.oth ? P.oth : null, i;
        if (by && by.reduce(function (a, o) { return a + o[1]; }, 0) === s.n) by.forEach(function (o) { for (i = 0; i < o[1]; i++) seq.push({ k: 'OTH', p: o[0] }); });
        else for (i = 0; i < s.n; i++) seq.push({ k: s.k, p: s.k });
      });
      return seq;
    }
    function party(k) { return D.parties[k] || D.parties.OTH; }
    // the party with a majority of the seats, if one has: its pegs hop and the Majority flag stands over the dashed line
    function majKey() { var t = seatsOf()[0]; return t && t.k !== 'OTH' && t.n >= council().majority ? t.k : null; }
    // v5 · coalition mode (the municipal file's "Build a coalition": coalition(list) turns it on, coalition(null) off). coal: the
    // parties in the coalition, in the order they were picked. Their seats stand from the left, party by party, each in its own
    // colour, and every other seat stands empty; the number is the coalition's seats and the caption what a majority needs (post-elections
    // v23: until a party is in, a line on how to build one in their place, and no dashed line down the middle). Once the coalition has a
    // majority the Majority flag (v23: black) stands over the middle and the coalition's pegs hop. A click on
    // a coalition's peg tells opts.onCoal(key). (v23.4 to v23.22 a button over the number told opts.onClear(); v23.23: the file clears the coalition from its head row.)
    function coalSeq() {
      var by = {}, seq = [], i;
      seqOf().forEach(function (s) { by[s.p] = (by[s.p] || 0) + 1; });
      coal.forEach(function (k) { for (i = 0; i < (by[k] || 0); i++) seq.push({ k: k, p: k }); });
      if (seq.length > N) seq.length = N;
      while (seq.length < N) seq.push(null);
      return seq;
    }
    function coalN() { return coalSeq().filter(Boolean).length; }
    // the seats that change go in a sweep from the first of them (from the last, as the coalition shrinks), as on the board; jump: at once
    function paintCoal(jump) {
      var seq = coalSeq(), tones = {}, ease = WAVE_EASE[BOARD_PROPS.waveEase], L = hemi(N, !!cap), M = council().majority, n = 0, ch = [], i;
      function tk(c, s, k, w) { var key = c + '|' + s + '|' + k + '|' + w; tones[key] = { c: c, s: s, k: k, lw: w }; return key; }
      var empty = tk(EMPTY_TONES.c, EMPTY_TONES.s, EMPTY_TONES.k, 0.3);
      var keys = seq.map(function (s) { if (s) n++; return s ? s.p : ''; });
      for (i = 0; i < keys.length; i++) if (!was || was.keys[i] !== keys[i]) ch.push(i);
      var d = keys.map(function () { return 0; }), reached = n >= M, majd = 0;
      if (ch.length && !jump && !reducedMotion()) {
        var back = !!was && n < was.n, a0 = L.pts[back ? ch[ch.length - 1] : ch[0]].a, a1 = L.pts[back ? ch[0] : ch[ch.length - 1]].a;
        var span = Math.abs(a1 - a0) || 1, T = span / Math.PI * BOARD_PROPS.waveTime;
        ch.forEach(function (j) { d[j] = easeTime(ease, Math.abs(L.pts[j].a - a0) / span) * T + rnd(j, 5) * PEG.jitter; });
        if (reached && !(was && was.reached)) majd = d[M - 1] || 0;
      }
      was = { keys: keys, n: n, reached: reached };
      G.hop = G.hop0.map(function (h, j) { return seq[j] ? h : { hd: h.hd, hp: h.hp, hh: 0 }; });
      var flag = host.querySelector('.ehh-maj');
      if (flag) { flag.style.transitionDelay = Math.round(majd) + 'ms'; flag.classList.toggle('is-on', reached); }
      var seats = L.pts.map(function (p, j) {
        var s = seq[j], t = s ? tonesOf(party(s.p).color) : null;
        return { up: !!s, tone: s ? tk(t.c, t.s, t.k, 0.35) : empty, hole: s && !opts.ghost ? 'dark' : 'pale', title: s ? party(s.p).name : '', d: d[j] };
      });
      painter.apply({ boardId: id + '-cv', boxId: id, rows: [], rowGeo: null,
        board: { geo: G, seats: seats, tones: tones, toneKey: Object.keys(tones).join(';'), snap: !!jump, reduce: reducedMotion(), hopping: reached, majd: majd, hopk: ARC_HOP, psh: BOARD_PROPS.pegShadow, ghost: opts.ghost ? ARC_GHOST : 1 } }, !!jump);
      return majd;
    }
    // the board as it stands, the whole council, for the first sweep
    function wasAll() {
      var sq = seqOf(), ks = [], i;
      for (i = 0; i < N; i++) ks.push(shown && sq[i] ? sq[i].p : '');
      was = { keys: ks, n: shown ? Math.min(N, sq.length) : 0, reached: !!majKey() };
    }
    // post-elections v23.2 · o.intro: coalition mode's opening, from the whole council. v23.4: at once its pegs sink in a sweep from the
    // right, out to the left (paintCoal's sweep back), as the number goes up and out and Select parties to reach a majority comes up in its
    // place. A council not yet risen rises first, with the number of its seats, and its pegs go once it stands (see build); a party put
    // in, or the mode closed, in the meantime ends the wait.
    function openWait(ms) { clearTimeout(otimer); otimer = setTimeout(function () { otimer = 0; if (!gone && opening) coalition(coal); }, ms); }
    function coalition(list, o) {
      if (gone) return 0;
      var on = !!list;
      if (on && !coal) { hl = null; wasAll(); }
      if (opening) { opening = false; clearTimeout(otimer); otimer = 0; wasAll(); }
      coal = on ? list.filter(function (k, j) { return list.indexOf(k) === j; }) : null;
      host.classList.toggle('is-coal', on);
      opening = on && !shown && !!(o && o.intro) && !reducedMotion();
      label();
      if (!shown) return 0;
      clearTimeout(timer);
      if (on) return paintCoal(false);   // v22.10: the ms until the coalition's pegs start to hop, as it reaches a majority (else 0)
      was = null;
      paint(true, true);
      return 0;
    }
    function pc(v) { return (v * 100).toFixed(3) + '%'; }
    // the seat under a point (client px), or -1: the nearest peg, standing or sunk, within a peg and a half of the point
    function seatAt(cx, cy, reach) {
      var st = host.querySelector('.ehh-stage'), r = st && st.getBoundingClientRect();
      if (!r || !r.width || !G) return -1;
      var s = r.width / G.SW, ux = (cx - r.left) / s, uy = (cy - r.top) / s, best = -1, bd = Infinity, i, dx, dy, d;
      for (i = 0; i < G.x.length; i++) {
        dx = ux - G.x[i]; dy = uy - (G.y[i] - G.riseUp * 0.5); d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      return bd <= G.r * G.r * (reach || 2.4) ? best : -1;
    }
    function build() {
      var m = council(), L = hemi(m.seats, !!cap), polls = m.polls;
      N = m.seats; nPolls = polls.length; G = arcGeo(L);
      if (pick >= nPolls) pick = 0;
      if (painter) painter.destroy();
      if (whoPeg) { whoPeg.stop(); whoPeg = null; }
      G.hop0 = G.hop;
      var mk = majKey(), sh = (1 + L.r), sw = Math.round(L.W), bot = pc(cap ? -L.r * ARC_RING / sh : L.r / sh);
      was = null;
      host.classList.toggle('has-maj', !!mk);
      host.innerHTML = (nPolls > 1 ? '<div class="res-tog ehh-tog" role="group" aria-label="Choose an election">' + polls.map(function (p, i) {
          return '<button type="button" data-i="' + i + '" aria-pressed="' + (i === pick) + '">' + esc(p.id) + '</button>';
        }).join('') + '</div>' : '') +
        '<div class="ehh-fig" style="width:min(100%,' + sw + 'px)">' +
          '<div class="ehh-stage" id="' + id + '" role="img" style="aspect-ratio:' + G.SW.toFixed(2) + ' / ' + G.SH.toFixed(2) + '">' +
            // v5: the Majority flag is always there, for coalition mode
            '<span class="ehh-maj" aria-hidden="true">Majority</span>' +
            '<canvas id="' + id + '-cv" aria-hidden="true" style="left:' + pc(-G.ml / G.SW) + ';top:' + pc(-G.mt / G.SH) + ';width:' + pc(G.W / G.SW) + ';height:' + pc(G.H / G.SH) + '"></canvas></div>' +
          // the number, and the caption under it, outside the stage (an image to screen readers) so the caption's button can be reached.
          '<span class="ehh-mid" style="bottom:calc(' + bot + ' - .04em);font-size:min(' + ARC_NUM + 'px,' + (ARC_NUM * 100 / sw).toFixed(2) + 'cqw)">' +
            '<span class="ehh-who" aria-hidden="true"><i></i><b></b></span><span class="ehh-num" aria-hidden="true">' + N + '</span>' +
            (cap ? '<span class="cs-info-wrap ehh-cap">' + (opts.info ? '<button type="button" class="ehh-cap-btn" aria-expanded="false">' : '<span class="ehh-cap-btn">') +
              cap.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join(' ') +
              (opts.info ? '</button><span class="cs-info-pop" role="note" style="border-radius:10px" hidden>' + opts.info + '</span>' : '</span>') + '</span>' : '') +
          '</span>' +
          // post-elections v23: coalition mode with no party in it yet: how to build one, in the hole in place of the number and its caption,
          // in two lines a little over the caption's foot (as wide as the hole allows), at the size the number's scale gives (16px at full size, never under 12px)
          (opts.coal ? '<span class="ehh-tip" style="bottom:calc(' + bot + ' + 8.5%);max-width:' + pc(L.h * 0.92) + ';font-size:max(12px,min(16px,' + (1600 / sw).toFixed(2) + 'cqw))"><span class="ehh-tip-a">Select parties</span> <span class="ehh-tip-b">to reach a majority</span></span>' : '') +
          '</div>' +
        '<ul class="ehh-key" aria-label="Seats by party"></ul>';
      painter = new PegPainter();
      label();
      paint(false, false);
      if (shown || reducedMotion() || typeof IntersectionObserver !== 'function') { shown = true; paint(true, false); return; }
      if (io) io.disconnect();
      io = new IntersectionObserver(function (es) {
        if (!es.some(function (e) { return e.isIntersecting; })) return;
        io.disconnect(); io = null; shown = true; paint(true, true);
        if (opening) openWait(BOARD_PROPS.waveTime + 300);   // v23.4: coalition mode's opening: the whole council rises, then its pegs go
      }, { threshold: 0.5 });
      io.observe(host.querySelector('.ehh-stage'));
    }
    // the switch, the stage's label and the parties underneath, for the election shown
    function label() {
      // v23.2: cv, the coalition shown (none while coalition mode's opening holds the whole council)
      var m = council(), P = poll(), list = seatsOf(), cv = opening ? null : coal, n = hl ? seqOf().filter(function (s) { return s.p === hl; }).length : 0, cn = cv ? coalN() : 0;
      // the number: the council's seats, the picked party's or (v5) the coalition's, popping in as it changes; the caption under it follows
      // (v23.2: both left as they are while the line on how to build a coalition stands in their place, so they go up and out as they were)
      var num = host.querySelector('.ehh-num'), zero = !!cv && !cv.length, nt = String(cv ? cn : hl ? n : N), cb = cap && host.querySelector('.ehh-cap-btn'), clr = host.querySelector('.ehh-clear');
      if (clr) clr.hidden = !(cv && cv.length);
      host.classList.toggle('is-coal0', zero);   // post-elections v23: the line on how to build a coalition, until a party is in
      if (num && !zero && num.textContent !== nt) { num.textContent = nt; num.classList.remove('is-pop'); void num.offsetWidth; num.classList.add('is-pop'); }
      // v11.4: over the number, the party picked out, its colour in a box and its name, as in the table below; it pops in with the number
      // and fades out as the council comes back
      // v22.9: the box is one of the half circle's pegs in the party's colour, hopping with the rest of its pegs if the party has a majority
      var who = host.querySelector('.ehh-who'), wk = coal ? null : hl, wh = !!wk && wk === majKey();
      if (who) {
        if (wk && who.getAttribute('data-k') !== wk) { who.setAttribute('data-k', wk); who.lastChild.textContent = party(wk).name; who.classList.remove('is-pop'); void who.offsetWidth; who.classList.add('is-pop'); }
        if (wk && (!whoPeg || whoPeg.k !== wk || whoPeg.hop !== wh)) { if (whoPeg) whoPeg.stop(); whoPeg = onePeg(who.firstChild, party(wk).color, { hop: wh }); whoPeg.k = wk; whoPeg.hop = wh; }
        if (!wk) { who.removeAttribute('data-k'); if (whoPeg) { whoPeg.stop(); whoPeg = null; } }
        who.classList.toggle('is-on', !!wk);
      }
      if (cb && !zero) cb.innerHTML = (cv ? ['of ' + m.majority, 'needed'] : hl ? [n === 1 ? 'seat' : 'seats'] : cap).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join(' ');
      host.querySelectorAll('.ehh-tog button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === pick)); });
      host.querySelector('.ehh-stage').setAttribute('aria-label', m.name + ' council' + (nPolls > 1 ? ', ' + P.id : '') + ': ' + N + ' seats, ' + m.majority + ' for a majority' +
        (coal ? '. Coalition: ' + (coal.length ? coal.map(function (k) { return party(k).name; }).join(', ') + ', ' + cn + (cn === 1 ? ' seat' : ' seats') : 'no parties yet') :
          hl ? '. Picked out: ' + party(hl).name + ', ' + n + (n === 1 ? ' seat' : ' seats') : ''));
      // v6: the party picked out is marked in the list under the half circle (a party grouped in Other marks Other) and the rest fade;
      // the list is only written again when it changes, so they fade in and out
      var ul = host.querySelector('.ehh-key'), sig = list.map(function (s) { return [s.k, s.n, party(s.k).name, party(s.k).color].join(':'); }).join('|');
      var hs = hl ? seqOf().filter(function (s) { return s.p === hl; })[0] : null, hk = hs ? hs.k : null;
      if (ul.getAttribute('data-sig') !== sig) {
        ul.setAttribute('data-sig', sig);
        ul.innerHTML = list.map(function (s) {
          return '<li data-k="' + esc(s.k) + '"><i style="background:' + esc(party(s.k).color) + '"></i><span>' + esc(party(s.k).name) + '</span><b>' + s.n + '</b></li>';
        }).join('');
      }
      ul.classList.toggle('has-hl', !!hk);
      [].forEach.call(ul.children, function (li) { li.classList.toggle('is-hl', li.getAttribute('data-k') === hk); });
    }
    // lit: every seat in its party's colour (else the empty board), and with a party picked out (v6), its seats lifted a little;
    // sweep: rising from the left, as the board's pegs do; soft: a quick change, the pegs popping up and sinking where they are
    function paint(lit, sweep, soft) {
      if (coal && !opening) { paintCoal(!sweep && !soft); return; }
      var seq = seqOf(), tones = {}, ease = WAVE_EASE[BOARD_PROPS.waveEase], still = !sweep && !soft;
      function tk(c, s, k, w) { var key = c + '|' + s + '|' + k + '|' + w; tones[key] = { c: c, s: s, k: k, lw: w }; return key; }
      var empty = tk(EMPTY_TONES.c, EMPTY_TONES.s, EMPTY_TONES.k, 0.3), L = hemi(N, !!cap);
      var mk = majKey(), hop = lit && !!mk, wait = sweep ? BOARD_PROPS.waveTime : soft ? 250 : 0;   // v6: the majority's pegs hop on while another party is picked out
      G.hop = G.hop0.map(function (h, i) { return seq[i] && seq[i].k === mk ? h : { hd: h.hd, hp: h.hp, hh: 0 }; });
      var flag = host.querySelector('.ehh-maj');
      if (flag) { flag.style.transitionDelay = (sweep ? Math.round(BOARD_PROPS.waveTime * 0.6) : 0) + 'ms'; flag.classList.toggle('is-on', hop); }
      var seats = L.pts.map(function (p, i) {
        // v6: the party picked out lifts its pegs and the rest stay standing; a party grouped in Other stands in its own colour while it is picked out
        var s = seq[i], on = lit && !!s, up = on && !!hl && s.p === hl, t = on ? tonesOf(party(up ? s.p : s.k).color) : null;
        return { up: on, lift: up, tone: on ? tk(t.c, t.s, t.k, 0.35) : empty, hole: on && !opts.ghost ? 'dark' : 'pale', title: s ? party(s.k).name : '',
          d: sweep ? easeTime(ease, 1 - p.a / Math.PI) * BOARD_PROPS.waveTime + rnd(i, 5) * PEG.jitter : soft ? rnd(i, 5) * PEG.jitter * 3 : 0 };
      });
      painter.apply({ boardId: id + '-cv', boxId: id, rows: [], rowGeo: null,
        board: { geo: G, seats: seats, tones: tones, toneKey: Object.keys(tones).join(';'), snap: still, reduce: reducedMotion(), hopping: hop, majd: wait, hopk: ARC_HOP, psh: BOARD_PROPS.pegShadow, ghost: opts.ghost ? ARC_GHOST : 1, liftk: ARC_LIFT } }, still);
    }
    function pickOut(k) {
      k = k || null;
      if (k && !seqOf().some(function (s) { return s.p === k; })) k = null;   // v6: only a party with seats here
      if (gone || coal || k === hl) return;
      hl = k;
      label();
      if (!shown) return;
      clearTimeout(timer);
      paint(true, false, !reducedMotion());
    }
    function show(i) {
      if (i === pick || gone) return;
      pick = i;
      label();
      clearTimeout(timer);
      if (reducedMotion()) { paint(true, false); return; }
      paint(false, false);
      timer = setTimeout(function () { if (!gone) paint(true, true); }, 90);
    }
    function onClick(e) {
      var t = e.target, b = t.closest && t.closest('.ehh-tog button');
      if (b && host.contains(b)) { show(+b.getAttribute('data-i')); return; }
      // v5: the clear button; in coalition mode a click on a coalition's peg takes its party out
      if (t.closest && t.closest('.ehh-clear')) { if (opts.onClear) opts.onClear(); return; }
      if (!shown || !t.closest || !t.closest('.ehh-fig') || t.closest('.ehh-cap')) return;
      if (coal) { var ci = seatAt(e.clientX, e.clientY), cs = ci >= 0 ? (opening ? seqOf() : coalSeq())[ci] : null; if (cs && opts.onCoal) opts.onCoal(cs.p); return; }   // v23.2: in the opening, a peg of the whole council puts its party in
      // v6: a mouse picks a party out by pointing at it (onMove); a tap picks one out, and a second tap or a tap off the pegs puts the council back
      if (ptype === 'mouse') return;
      var i = seatAt(e.clientX, e.clientY, ARC_REACH), s = i >= 0 ? seqOf()[i] : null, k = s ? s.p : null;
      if (!k && !hl) return;
      hover(k === hl ? null : k);
    }
    // v6: the party under the pointer is picked out, and the council put back as the pointer leaves the pegs (in coalition mode, a hand
    // over a coalition's peg instead, as in v5)
    function onMove(e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var f = host.querySelector('.ehh-fig'), t = e.target, over = shown && t.closest && t.closest('.ehh-fig') && !t.closest('.ehh-cap'), i, s;
      if (!f) return;
      if (coal) { i = over ? seatAt(e.clientX, e.clientY) : -1; f.style.cursor = i >= 0 && (opening ? seqOf() : coalSeq())[i] ? 'pointer' : ''; return; }
      if (f.style.cursor) f.style.cursor = '';
      i = over ? seatAt(e.clientX, e.clientY, ARC_REACH) : -1;
      s = i >= 0 ? seqOf()[i] : null;
      hover(s ? s.p : null);
    }
    function onLeave(e) { if ((!e.pointerType || e.pointerType === 'mouse') && !coal) hover(null); }
    // picks a party out (null puts the council back) and tells opts.onPick when that changes what is picked out
    function hover(k) {
      var prev = hl;
      pickOut(k);
      if (hl !== prev && opts.onPick) opts.onPick(hl);
    }
    // the caption's button clicks like a key: a tick as it goes down, a lower one as it comes back up
    function onPress(e) { ptype = e.pointerType || 'mouse'; if (e.button === 0 && e.target.closest && e.target.closest('button.ehh-cap-btn')) { tick(3400); host.addEventListener('pointerup', onLift, { once: true }); } }
    function onLift() { tick(2300); }
    // a live update: the same council, perhaps with an election more
    function set(data) {
      if (gone || !data || !data.metros || !data.metros.length) return;
      D = data;
      var m = council();
      if (m.seats !== N || m.polls.length !== nPolls) { build(); return; }
      label();
      if (shown) paint(true, true);
    }
    function destroy() {
      gone = true;
      clearTimeout(timer);
      clearTimeout(otimer);
      if (io) io.disconnect();
      if (painter) painter.destroy();
      if (whoPeg) { whoPeg.stop(); whoPeg = null; }
      host.removeEventListener('click', onClick);
      host.removeEventListener('pointerdown', onPress);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    }
    host.classList.add('ehh-host');
    host.style.display = '';
    try {
      if (!D || !D.metros || !D.metros.length) throw new Error('no council to draw');
      host.addEventListener('click', onClick);
      host.addEventListener('pointerdown', onPress);
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      build();
    } catch (e) {
      destroy();
      host.style.display = 'none';
      if (window.console) console.error('[elections-hub] half circle failed:', e);
      return { host: host, set: function () {}, pick: function () {}, picked: function () { return null; }, destroy: function () {} };
    }
    ARCS.push(api);
    return api;
  }

  /* ---- v5 · rows of pegs in cells laid out elsewhere (the municipal file's coalition mode) ----
     EH_BOARD.dots(list, opts): list, [{ el, n, color }]: each el (a span the caller sizes and places) gets a row of n pegs and a dotted
     leader to its end. The pegs are the board's, all one size: the biggest whole pixel, 9px at most, that lets the longest row fit el's
     width in 2, 3 or 4 rows no taller than opts.h (30px). opts.box: the element the rows sit in (they stop drawing while it is off
     screen). Returns { set(st, jump), fit(), stop() }: st[j], { up, op }: row j's pegs standing (its party in the coalition) or lying
     flat, at an opacity. A row stands up from the left and lies down from the right, as the board's rows do; jump: at once. */
  function cellDots(list, opts) {
    opts = opts || {};
    var id = 'ehd-' + Math.random().toString(36).slice(2, 9), painter = new PegPainter(), H = opts.h || 30, D = 0, R = 2, dg = 3, ro = null, gone = false;
    var st = list.map(function () { return { up: false, op: 1 }; }), max = list.reduce(function (a, r) { return Math.max(a, r.n); }, 1), box = opts.box || null;
    if (box && !box.id) box.id = id + '-box';
    list.forEach(function (r, j) {
      r.el.innerHTML = '<span class="ehr-dots" data-n="' + r.n + '"><canvas id="' + id + '-' + j + '"></canvas></span><span class="ehr-lead"></span>';
    });
    function plan(jump) {
      return {
        boardId: id + '-none', boxId: box ? box.id : id + '-none',
        board: { geo: { hop: [] }, seats: [], tones: {}, toneKey: '', snap: true, reduce: true, hopping: false, majd: 0, hopk: 0, psh: 1 },
        rows: list.map(function (r, j) {
          var t = tonesOf(r.color), s = st[j] || { up: false, op: 1 }, C = Math.max(1, Math.ceil(r.n / R)), per = Math.min(24, 420 / C), dots = [], i, c;
          for (i = 0; i < r.n; i++) { c = Math.floor(i / R); dots.push({ up: !!s.up, op: s.op == null ? 1 : s.op, wd: s.up ? c * per : (C - 1 - c) * per * 0.5 }); }
          return { cvId: id + '-' + j, color: r.color, side: t.s, line: t.k, dots: dots };
        }),
        rowGeo: D ? { key: [D, R, dg].join('|'), D: D, R: R, dg: dg, dv: dg, hk: ROW_HK, shf: ROW_SHF, psh: 1, snap: !!jump || reducedMotion(), reduce: reducedMotion() } : null
      };
    }
    function fit() {
      if (gone || !list.length || !list[0].el.isConnected) return;
      var A = list[0].el.clientWidth - 28, best = null, r, C, d;
      if (A <= 0) return;
      dg = A < 300 ? 2 : 3;
      for (r = 2; r <= 4; r++) {
        C = Math.ceil(max / r);
        d = Math.max(2, Math.floor(Math.min(9, (H - (r - 1) * dg) / (r + 1.8 * ROW_HK), (A - (C - 1) * dg) / C)));
        if (!best || d > best.d) best = { d: d, r: r };
      }
      var was = D + '|' + R + '|' + dg;
      D = best.d; R = best.r;
      var h = R * D + (R - 1) * dg + D * 1.8 * ROW_HK;
      list.forEach(function (row) {
        var el = row.el.firstChild, c = Math.ceil(row.n / R);
        el.style.width = Math.max(0, c * D + (c - 1) * dg) + 'px';
        el.style.height = h.toFixed(2) + 'px';
        el.firstChild.style.height = 'calc(100% + 8px + ' + Math.ceil(1.8 * 1.18 * D * ROW_SHF) + 'px)';
      });
      if (was !== D + '|' + R + '|' + dg || !painter.rg) painter.apply(plan(true), true);
    }
    fit();
    if (typeof ResizeObserver === 'function' && list.length) { var raf = 0; ro = new ResizeObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); }); ro.observe(list[0].el); }
    return {
      fit: fit,
      set: function (next, jump) { if (gone) return; st = next || st; painter.apply(plan(jump), !!jump); },
      stop: function () { gone = true; painter.destroy(); if (ro) ro.disconnect(); }
    };
  }

  /* ---- v22.8 · one peg on its own (the party chips at the foot of the municipal file's seats box in coalition mode) ----
     EH_BOARD.peg(el, color, opts): one of the half circle's pegs in color, in its socket, on a canvas in el. el (position: relative)
     is sized to the peg standing in its socket; the canvas runs over it for the hop and the shadow. The peg pops up after opts.d ms
     (opts.snap: stands at once), then hops as a majority's pegs do, ONE_HOP times as high as it stands; opts.i, its place in the row,
     sets it off at its own point in the hop. It stands still with reduced motion, and (v22.9) with opts.hop false. Returns { set(st, jump), stop() }.
     v22.10: set(st, jump) moves it on: st.lift, standing up ONE_LIFT times as high as it stands; st.hop, hopping; st.boost, hopping
     ONE_BOOST times as high, from st.wait ms on; jump: at once. */
  var ONE_D = 14, ONE_HOP = 2.8, ONE_LIFT = 2.8, ONE_BOOST = 1.4;   // the peg's width (px); how high it hops, and stands up, over the height it stands; how much higher a boost hops
  function onePeg(el, color, opts) {
    opts = opts || {};
    var id = 'ehp-' + Math.random().toString(36).slice(2, 9), painter = new PegPainter(), i = opts.i || 0, K = ONE_HOP, still = reducedMotion();
    var st = { lift: false, hop: opts.hop !== false, k: 1 }, bt = 0, gone = false, KM = K * ONE_BOOST + ONE_LIFT;
    var tilt = (90 - BOARD_PROPS.cameraAngle) * Math.PI / 180, sq = Math.cos(tilt), hk = Math.sin(tilt);
    var shf = 1 / Math.tan(BOARD_PROPS.sunAngle * Math.PI / 180), up = ARC_RISE * ARC_R / hk;
    var r = ARC_R, ry = r * sq, hx = r * (1 + ARC_RING), hy = hx * sq, riseUp = up * hk, sink = PEG.sink * sq;
    var ssu = (2 * r + up * shf) / (2 * r), shk = up * shf / (2 * r + up * shf);
    var ml = hx + 2, mt = riseUp * (1.18 + KM) + ry + 2, mb = Math.max(hy, sink * 1.08 + ry, ry * (2 * (1 + (ssu - 1) * 1.18) * (1 + KM * shk) - 1)) + 2;
    var hd = HOP.tempo * (1 + HOP.spread * (2 * rnd(i, 2) - 1)), u = (opts.w || ONE_D) / (2 * r), top = riseUp + ry;
    var G = { key: 'one', x: [0], y: [0], depth: [0], hop: [{ hd: hd, hp: rnd(i, 3) * hd, hh: 1 }], r: r, ry: ry, hx: hx, hy: hy, riseUp: riseUp, sink: sink, ssu: ssu, shk: shk,
      ml: ml, mr: ml, mt: mt, mb: mb, W: 2 * ml, H: mt + mb, SW: 0, SH: 0 };
    function px(v) { return (v * u).toFixed(2) + 'px'; }
    el.style.width = px(2 * hx);
    el.style.height = px(top + hy);
    el.innerHTML = '<canvas id="' + id + '" aria-hidden="true" style="position:absolute;display:block;pointer-events:none;left:' + px(hx - ml) + ';top:' + px(top - mt) + ';width:' + px(G.W) + ';height:' + px(G.H) + '"></canvas>';
    var t = tonesOf(color), tones = { one: { c: t.c, s: t.s, k: t.k, lw: 0.35 } }, d = Math.max(0, opts.d || 0), t0 = performance.now() + (still || opts.snap ? 0 : d + 380);
    // dd: when the peg pops up; its hop comes in once it has popped up (t0)
    function plan(on, dd) {
      return { boardId: id, boxId: id, rows: [], rowGeo: null,
        board: { geo: G, seats: [{ up: on, lift: on && st.lift, amp: st.k, tone: 'one', hole: 'dark', title: '', d: dd }], tones: tones, toneKey: 'one|' + t.c, snap: false, reduce: still, hopping: on && st.hop, majd: Math.max(0, t0 - performance.now()), hopk: K, liftk: ONE_LIFT, psh: BOARD_PROPS.pegShadow } };
    }
    if (still || opts.snap) painter.apply(plan(true, 0), true);
    else { painter.apply(plan(false, 0), true); painter.apply(plan(true, d), false); }
    function set(s, jump) {
      if (gone || !s) return;
      clearTimeout(bt);
      var k = s.hop && s.boost ? ONE_BOOST : 1, late = !jump && k > st.k && s.wait > 0;
      st.lift = !!s.lift; st.hop = !!s.hop;
      if (!late) st.k = k;
      painter.apply(plan(true, 0), !!jump);
      if (late) bt = setTimeout(function () { if (gone) return; st.k = k; painter.apply(plan(true, 0), false); }, s.wait);
    }
    return { set: set, stop: function () { gone = true; clearTimeout(bt); painter.destroy(); } };
  }

  window.EH_BOARD = { mount: mount, rows: pegRows, arc: arc, dots: cellDots, peg: onePeg, labelEm: labelEm };
});

/* ==== post-elections v2 · results ====
   Council, ward and national results from the Electoral Commission of South Africa, read through Daily Maverick's
   RevEngine IEC service (the source behind dailymaverick.co.za/local-government-elections-2021 and -2026):
     {base}/{year}                                                          national totals, party results, every province
     {base}/{year}/provinces/{Province}                                     a province and every council in it (votes, seats, turnout)
     {base}/{year}/provinces/{Province}/municipalities/{id}/wards/{wardId}  one ward (wardId: the IEC's 8-digit ward ID)
     {base}/{year}/wards/{wardId}/candidates                                the ward's candidates, with their party IDs (the ward box names the winner)
   base: https://iec-api.revengine.dailymaverick.co.za/local, or data-results on #dm-eh. year: data-year on #dm-eh (2026).
   Councils are matched to this file's keys through their IEC codes (JHB, WC024, DC42 ...) and the ward ID prefixes in SA_WARD_INDEX.
   While the IEC is counting, the page asks again every 5 minutes and offers "Refresh results"; final results are read once.
   v2: party colours are the coalition builder's (the AllMetrosEmbedV5 widget's), so a party looks the same on the board, in the
   bars and on the map; council seats are drawn as a half circle of the seat board's pegs, empty while counting (no 2021 council in
   its place) and 2026 alone once its seats are in (no switch to 2021); the source line links to the IEC results site, as in v27.
   The votes table sits just under the half circle, with no heading of its own, and always has a Seats column (a dash until the
   seats are allocated). Once they are, a click on a party with seats picks its seats out on the half circle; a second click puts them back.
   v3: seats won by independent ward candidates are counted (the feed gives them apart, in seats.independent_seats_won). A council whose
   seats don't add up says so: with 90% or more of them in, the half circle shows the rest empty; with fewer, no seats are shown, only the votes.
   v3: the ward box names the winning (or leading) candidate and the ward's vote list each party's candidate: from the feed's ward candidates,
   matched on the party ID;
   for 2026, while the feed has none, the IEC's certified list bundled in this file. The feed adds up a ward's independents in one row, so an
   independent is named only when one stood. The sample count's wards take the bundled list's parties and names, over made-up figures (see "sample count").
   CMS build: data-year's election only. The preview's ?data= (the 2021 results, or a sample count, in the 2026 page's place) is not in this build. */
guard("results", function () {
  (function () {
    'use strict';
    var ROOT = document.getElementById('dm-eh');
    var BASE = String((ROOT && ROOT.getAttribute('data-results')) || 'https://iec-api.revengine.dailymaverick.co.za/local').trim().replace(/\/+$/, '');
    var PROVS = window.SA_PROVINCES || {}, MUNIS = window.SA_MUNIS || {}, WIX = window.SA_WARD_INDEX || {};
    var PROV_ORDER = ['GP', 'WC', 'KZN', 'EC', 'LP', 'MP', 'NW', 'FS', 'NC'];
    var POLL = 300000, PREV = '2021';   // graphics library v2: 5 minutes (was 3), as on the hub since post-elections v28.1: the RevEngine feed updates every 5 minutes
    var IEC_URL = 'https://results.elections.org.za/';
    var CFG = String((ROOT && ROOT.getAttribute('data-year')) || '2026').replace(/\D/g, '') || '2026';
    var S = { year: CFG, src: CFG, sample: false, auto: false, nat: null, state: 'loading' };
    // v4 · the page's phase, from data-phase on #dm-eh (previews: ?phase=): count, from 22:00 on voting day while the IEC counts;
    // provisional, the count done (about day 3 to 7) and the results not yet declared; final, once the IEC has declared them.
    var PHASES = { count: 1, provisional: 1, final: 1 }, RAW = { nat: null, prov: {} };
    function qs() { return ''; }   // CMS build: the preview's address parameters (?phase=, ?at=, ?dec=, ?day=, ?now=) are not read, on any host
    /* ---- v9 · automatic phase ----
       data-phase="auto" (or none): the page picks its phase and moves on by itself. count until the Commission's count is complete
       (results_complete on the national totals, read every 5 minutes while counting); before voting day always count, whatever the feed
       says (it carries test figures before an election). provisional from the end of the count while the Commission allocates the councils'
       seats one by one (v23: the seats it publishes in the feed are provisional until it declares the results, see "declared councils").
       final from the first of: data-declared on #dm-eh (YYYY-MM-DD, the day the Commission declares the results; set it once it has), or
       seven days after voting day, the last day the law gives the Commission to declare the result (Municipal Electoral Act, s 64). v23: no
       longer on every council's seats being in, or on SeatCalculationCompleted in the feed's progress report (both come before the
       declaration; the report is no longer read). After the count the feed is read again every 10 minutes until the page is final (the
       totals and the provinces read so far), so a page left open moves on too; the coalition builder and Hung councils follow (see onPhase). Voting day: 4 November 2026, or data-voting-day on #dm-eh. data-phase="count|provisional|final" pins a phase.
       Before the feed answers, the page starts in the phase this browser last saw on dailymaverick.co.za, or the calendar's best guess.
       Previews: ?phase= pins; ?now=YYYY-MM-DD runs the rules as on that day (with it, the voting-day rule applies off dailymaverick.co.za too). */
    var PIN = String(qs('phase') || (ROOT && ROOT.getAttribute('data-phase')) || '').toLowerCase();
    var VOTE_DAY = dayNo((ROOT && ROOT.getAttribute('data-voting-day')) || '') || dayNo('2026-11-04'), PH_KEY = 'dm-eh-phase-' + CFG;
    var phaseSubs = [], watchT = null;
    S.autoPhase = !PHASES[PIN];
    function nowDay() { var p = qs('now'); return p && dayNo(p) != null ? dayNo(p) : sast(); }
    function declaredDay() { return dayNo((ROOT && ROOT.getAttribute('data-declared')) || ''); }
    function pastElection() { return S.src !== CFG && !S.sample; }
    // the phase the rules give on the totals d and the progress report prog
    function autoPhase(d) {
      var t = nowDay(), dec = declaredDay();
      if (pastElection()) return 'final';
      if ((EH_ON_DM || qs('now')) && t < VOTE_DAY) return 'count';
      if (dec != null && t >= dec) return 'final';
      if (t >= VOTE_DAY + 7) return 'final';
      var done = !!d && +d.vd_captured > 0 && (!!d.results_complete || (+d.vd_count > 0 && +d.vd_captured >= +d.vd_count));
      if (!done) return 'count';
      return 'provisional';   // v23: until the Commission declares the results (data-declared, or seven days after voting day), whatever seats the feed carries
    }
    // before the feed answers
    function guessPhase() {
      var t = nowDay(), dec = declaredDay(), seen = '';
      if (pastElection()) return 'final';
      if (dec != null && t >= dec) return 'final';
      if (t >= VOTE_DAY + 7) return 'final';
      if (EH_ON_DM) { if (t < VOTE_DAY) return 'count'; try { seen = String(localStorage.getItem(PH_KEY) || ''); } catch (e) {} }
      return PHASES[seen] && seen !== 'final' ? seen : t >= VOTE_DAY + 3 ? 'provisional' : 'count';   // v23: final only by the rules above
    }
    function setPhase(p) {
      if (!PHASES[p] || p === S.phase) return;
      S.phase = p;
      if (ROOT) ROOT.setAttribute('data-phase', p);
      if (EH_ON_DM) try { localStorage.setItem(PH_KEY, p); } catch (e) {}
      phaseSubs.forEach(function (f) { try { f(p); } catch (e) { if (window.console) console.error('[elections-hub] phase change:', e); } });
      emit();
    }
    function onPhase(fn) { phaseSubs.push(fn); }
    function rephase() { if (S.autoPhase) setPhase(autoPhase(S.nat)); }   // v23: no progress report (see "automatic phase")
    // after the count: the progress report and the calendar, every 10 minutes, until the page is final
    function startWatch() {
      if (watchT || !S.autoPhase || S.sample || S.auto) return;
      watchT = setInterval(function () {
        if (S.phase === 'final') { clearInterval(watchT); watchT = null; return; }
        if (pollT) return;
        refresh();   // v14: the totals and the provinces read so far, for the councils whose seats are in since (v23: no progress report)
      }, 600000);
    }
    S.phase = S.autoPhase ? guessPhase() : PIN;
    if (ROOT) ROOT.setAttribute('data-phase', S.phase);
    // previews only: how much of the sample count is in (the count slider, ?at=, in %), and the days since the councils were declared elected (?day=)
    S.at = Math.max(0.02, Math.min(1, (+qs('at') || (S.phase === 'count' ? 60 : 100)) / 100));
    S.dec = qs('dec') !== '' ? Math.max(0, Math.min(1, (+qs('dec') || 0) / 100)) : null;   // v14: the share of the sample's councils declared once the count is in (?dec=, in %; none: all of them)
    S.day = qs('day') !== '' ? Math.max(0, Math.min(20, Math.round(+qs('day') || 0))) : 3;
    S.updated = 0;

    /* ---- reading ---- */
    var cache = {};
    function get(path, fresh) {
      var url = BASE + path;
      if (cache[url] && !fresh) return cache[url];
      var p = new Promise(function (resolve, reject) {
        if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 20 s')); }, 20000);
        fetch(url, { credentials: 'omit', cache: fresh ? 'no-store' : 'default', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
          .then(function (r) {
            if (r.status === 404 || r.status === 204) return null;
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(function (d) { clearTimeout(timer); resolve(d); }, function (e) { clearTimeout(timer); reject(e); });
      });
      cache[url] = p;
      p.catch(function (e) {
        if (cache[url] === p) delete cache[url];
        if (window.console) console.warn('[elections-hub] ' + url + ': ' + ((e && e.message) || e));
      });
      return p;
    }

    /* ---- parties ---- */
    var ABBR = { ACTIONSA: 'ActionSA', 'VF PLUS': 'FF+', ALJAMA: 'Al Jama-ah', CAPEXIT: 'CapeXit', MKP: 'MK', 'MK PARTY': 'MK' };
    var FULL = { 'AL JAMA-AH': 'Al Jama-ah', GOOD: 'GOOD', ACTIONSA: 'ActionSA' };
    var SMALL = { of: 1, the: 1, and: 1, for: 1, in: 1, on: 1, to: 1, van: 1, der: 1, die: 1, en: 1 };
    function title(s) {
      return String(s).toLowerCase().split(' ').map(function (w, i) {
        if (!w || (i && SMALL[w])) return w;
        if (/^(sa|rsa)$/.test(w)) return w.toUpperCase();
        return w.replace(/(^|[-\/(])([a-z\u00e0-\u00fe])/g, function (m, a, b) { return a + b.toUpperCase(); });
      }).join(' ');
    }
    // The coalition builder's colours (party colours are data in the widget and stay as they are); other parties take a muted spare.
    var COL = { DA: '#5070ae', ActionSA: '#367c23', PA: '#3daa84', 'FF+': '#f2a22c', IFP: '#8e1f3d', EFF: '#c84837', MK: '#6aa852', ANC: '#e7d935' };
    var SPARE = ['#7f8ca0', '#b9ae9b', '#9db596', '#9a9bb5', '#c6b08c', '#a8a487', '#8697ac', '#b39c9c'];
    var OTHERS = '#c0c0c0', IND = '#a9aaab';
    function colour(p) { return COL[p.abbr] || (p.ind ? IND : SPARE[Math.abs(p.id) % SPARE.length]); }
    var REG = {};
    function party(id, raw) {
      var s = String(raw || '').replace(/\s+/g, ' ').trim(), k = s.indexOf(' - '), ab = '', full = s;
      if (k > 0 && k <= 14) { ab = s.slice(0, k).trim(); full = s.slice(k + 3).trim(); }
      if (!ab && REG[id]) ab = REG[id];
      ab = ABBR[ab.toUpperCase()] || ab;
      if (!ab && /UMKHONTO/i.test(full)) ab = 'MK';
      var ind = +id === 0 || /^independent$/i.test(full);
      var name = ind ? 'Independent candidates' : (FULL[full.toUpperCase()] || title(full));
      if (ab && ab.toUpperCase() === name.toUpperCase()) name = ab;
      if (ab && !REG[id]) REG[id] = ab;
      var p = { id: +id || 0, abbr: ind ? 'Independent' : ab, name: name, ind: ind, raw: full };
      p.label = p.abbr || p.name;
      p.col = colour(p);
      return p;
    }

    /* ---- one result (nation, province, council, district or ward) in one shape ---- */
    function norm(e) {
      if (!e || typeof e !== 'object') return null;
      var raw = String(e.municipality_name || ''), k = raw.indexOf(' - ');
      var code = k > 0 ? raw.slice(0, k).trim() : '';
      var rows = [], seen = {};
      (e.party_ballot_results || []).forEach(function (r) {
        var p = party(r.party_id, r.party_name);
        if (seen[p.id]) return;
        p.votes = +r.votes || 0; p.pct = +r.vote_perc || 0;
        p.wardVotes = +r.ward_votes || 0; p.prVotes = +r.pr_votes || 0; p.dcVotes = +r.dc40_votes || 0;
        p.seats = +r.total_seats || 0; p.wardSeats = +r.ward_seats || 0; p.prSeats = +r.pr_seats || 0;
        rows.push(p); seen[p.id] = p;
      });
      var st = e.seats || {}, sp = Array.isArray(st.party_results) ? st.party_results : [];
      var own = rows.length > 0, sumV = 0;
      sp.forEach(function (r) { sumV += +r.TotalValidVotes || 0; });
      sp.forEach(function (r) {
        var s = +r.TotalPartySeats || 0, ex = seen[r.ID];
        if (ex) { if (!ex.seats && s) { ex.seats = s; ex.wardSeats = +r.WardSeats || 0; ex.prSeats = +r.PRSeats || 0; } return; }
        if (own && !s) return;
        var p = party(r.ID, r.Name);
        p.votes = +r.TotalValidVotes || 0; p.pct = sumV ? Math.round(p.votes / sumV * 10000) / 100 : 0;
        p.wardVotes = p.prVotes = p.dcVotes = 0;
        p.seats = s; p.wardSeats = +r.WardSeats || 0; p.prSeats = +r.PRSeats || 0;
        rows.push(p); seen[p.id] = p;
      });
      var district = /^DC\d/.test(code), total = +st.total_seats_available || 0;
      var seated = rows.reduce(function (a, p) { return a + p.seats; }, 0);
      // v3: seats won by independent ward candidates. The feed leaves them out of the party seats and gives them apart, in
      // seats.independent_seats_won (a string); they go to the Independent candidates row once the parties' seats are in.
      var indW = +st.independent_seats_won || 0, ip = seen[0], add = indW - (ip ? ip.seats : 0);
      if (!district && seated > 0 && add > 0 && seated + add <= total) {
        if (!ip) { ip = party(0, 'INDEPENDENT'); ip.votes = ip.pct = ip.wardVotes = ip.prVotes = ip.dcVotes = 0; rows.push(ip); seen[0] = ip; }
        ip.seats = ip.wardSeats = indW; ip.prSeats = 0; seated += add;
      }
      // v3: seats that don't add up. With 90% or more of them in (a ward still to be filled), the half circle shows the rest empty and
      // says how many the figures account for; with fewer (a gap in the feed, as in Ditsobotla's 2021 seats), no seats are shown.
      var gap = !district && seated > 0 && seated < total ? total - seated : 0, broken = gap > 0 && seated < total * 0.9;
      // v14: the Commission has published the council's seats (its seat calculation, in seats). v23: alloc, the seats published; declared,
      // published and the results declared (the page final). No decDay: report_date on the seats is ignored (see "the first sitting")
      var pub = !district && rawDeclared(e);
      if (broken) { rows.forEach(function (p) { p.seats = p.wardSeats = p.prSeats = 0; }); seated = 0; gap = 0; }
      rows.sort(function (a, b) { return b.votes - a.votes || b.seats - a.seats; });
      return {
        name: k > 0 ? raw.slice(k + 3).trim() : (e.province_name || 'South Africa'), code: code,
        id: +e.municipality_id || +e.province_id || 0, ward: +e.ward_id || 0, district: district,
        declared: pub && S.phase === 'final', alloc: pub,
        parties: rows, seated: seated, seatsTotal: total, seatGap: gap, seatsBroken: broken,
        complete: district ? seated > 0 : !!e.results_complete || (+e.vd_count > 0 && +e.vd_captured >= +e.vd_count),   // v23: or every voting district in
        vdCount: +e.vd_count || 0, vdCaptured: +e.vd_captured || 0,
        registered: +e.registered_voters || 0,
        turnout: e.percent_voter_turnout != null && e.percent_voter_turnout !== '' && +e.vd_captured > 0 ? +e.percent_voter_turnout : null,
        cast: +e.total_votes_cast || 0, spoilt: +e.spoilt_votes || 0
      };
    }
    function bySeats(a, b) { return b.seats - a.seats || b.votes - a.votes; }
    // majority | hung | declared (the count complete, the seats not yet published; v14: the table says Count complete) | counting | district | none
    function outcome(R) {
      if (!R || !R.parties.length) return { state: 'none' };
      if (R.district) {
        if (!R.seated || S.phase !== 'final') return { state: 'none' };   // v23.34: a district council's seats wait for the declaration
        return { state: 'district', lead: R.parties.slice().sort(bySeats)[0], direct: R.seated, total: R.seatsTotal };
      }
      if (!(R.vdCaptured > 0)) return { state: 'none' };
      var need = R.seatsTotal ? Math.floor(R.seatsTotal / 2) + 1 : 0;
      if (R.complete && R.seated) {
        var top = R.parties.slice().sort(bySeats)[0];
        return { state: top.seats >= need ? 'majority' : 'hung', lead: top, need: need, total: R.seatsTotal };
      }
      return { state: R.complete ? 'declared' : 'counting', lead: R.parties[0], need: need, total: R.seatsTotal };
    }

    /* ---- council keys ---- */
    var PDIG = { WC: '1', EC: '2', NC: '3', FS: '4', KZN: '5', NW: '6', GT: '7', GP: '7', MP: '8', LIM: '9', LP: '9' };
    var METRO = { JHB: 'jhb', TSH: 'tsh', EKU: 'eku', CPT: 'cpt', ETH: 'eth', NMA: 'nmb', BUF: 'buf', MAN: 'man' };
    var BY_PREFIX = {}, BY_DC = {};
    Object.keys(WIX).forEach(function (k) { if (WIX[k] && WIX[k][1]) BY_PREFIX[WIX[k][1]] = k; });
    Object.keys(MUNIS).forEach(function (k) {
      var m = MUNIS[k];
      if (m.dtype !== 'district' || !m.members) return;
      m.members.some(function (mk) { var ix = WIX[mk]; if (!ix) return false; BY_DC[+String(ix[1]).slice(1, 3)] = k; return true; });
    });
    function keyFor(code) {
      if (METRO[code]) return METRO[code];
      var m = /^([A-Z]{2,3})(\d{2})(\d)$/.exec(code);
      if (m && PDIG[m[1]]) return BY_PREFIX[PDIG[m[1]] + m[2] + '0' + m[3]] || null;
      var d = /^DC(\d{1,2})$/.exec(code);
      return d ? BY_DC[+d[1]] || null : null;
    }
    var IX = {}, IXP = {};
    function index(into, pc, d) {
      (d.municipal_results || []).forEach(function (e) {
        var raw = String(e.municipality_name || ''), k = raw.indexOf(' - ');
        var key = keyFor(k > 0 ? raw.slice(0, k).trim() : raw.trim());
        if (key) into[key] = { pc: pc, id: +e.municipality_id, e: e };
      });
    }

    /* ---- v14 · declared councils ----
       v23: the Commission publishes a council's seats (its seat calculation; the feed's seats object, empty until then) once it has allocated
       them, days before it declares the results (in 2021 the declaration came on 4 November, after the seats), so published seats
       (rawDeclared) are provisional until the page is final: isDeclared, and declared on a result (norm), need both. DEC counts the metro
       and local councils with seats among the 213 (N_COUNCILS) in the provinces read so far (SEEN; all nine once Results across South
       Africa nears the screen, or at once after the count, see ready); the masthead shows it as Seats allocated until the declaration.
       Recounted after every province read (decTally); a change repaints the page. No declaration day per council: report_date is ignored
       (see "the first sitting"). */
    var DEC = { n: 0, total: 0, loaded: 0, all: false }, SEEN = {}, N_COUNCILS = 0;
    Object.keys(MUNIS).forEach(function (k) { if (MUNIS[k] && MUNIS[k].dtype !== 'district') N_COUNCILS++; });
    function rawDeclared(e) {
      var st = e && e.seats, sp = st && st.party_results;
      return !!(st && +st.total_seats_available > 0 && Array.isArray(sp) && sp.some(function (r) { return +r.TotalPartySeats > 0; }));
    }
    function isDeclared(k) { return !!(k && IX[k] && rawDeclared(IX[k].e)) && S.phase === 'final'; }   // v23: and the results declared
    function decTally() {
      var n = 0, was = DEC.n + '/' + DEC.loaded + '/' + DEC.all;
      Object.keys(IX).forEach(function (k) {
        var m = MUNIS[k];
        if (!m || m.dtype === 'district' || !rawDeclared(IX[k].e)) return;
        n++;
      });
      DEC = { n: n, total: N_COUNCILS, loaded: Object.keys(SEEN).length, all: n > 0 && (n >= N_COUNCILS || (S.sample && decShare() >= 1 && Object.keys(SEEN).length >= PROV_ORDER.length)) };   // the sample at 100%: all, though the 2021 feed has no seats for Thabazimbi
      return was !== DEC.n + '/' + DEC.loaded + '/' + DEC.all;
    }

    /* ---- sample count: not in the CMS build. S.sample is never set; these stand where the preview's simulators were, and change nothing ---- */
    function simNational(d) { return d; }
    function simProvince(d) { return d; }
    function simWard(d) { return d; }
    function ballot26(d) { return d; }
    function decShare() { return 1; }
    var IND26 = /^independent( candidates?)?$/i;

    /* ---- loading ---- */
    function stateOf(d) { return !d ? 'error' : !(+d.vd_captured > 0) ? 'waiting' : d.results_complete || (+d.vd_count > 0 && +d.vd_captured >= +d.vd_count) ? 'final' : 'counting'; }   // v23: or every voting district in
    /* ---- v23 · trying again ----
       ready() waits until the totals are read. A read that fails (no answer within 20 s, an error, or nothing) puts the page in S.state
       'error': the tabs and an open file say so (errMsg, with a Refresh results button) and the page tries again by itself 30 seconds
       later, then every 5 minutes, until the feed answers; the button tries at once (retry). Whatever waits on ready() (the provinces, a
       council, a ward) is read once it answers. Until v22 a failed first read stood until the reader reloaded the page. */
    var readyP = null, readyOk = null, tryP = null, retryT = null, retryN = 0;
    function firstRead(fresh) {   // fresh: past the cache (a try again: a 404 is cached like any answer)
      return get('/' + S.src, fresh).then(function (d) {
        return d;
      }).then(function (d) {
        if (!d) throw new Error('no results');   // v23: nothing (a 404) fails too
        RAW.nat = d;
        if (S.sample) d = simNational(d);
        S.nat = d;
        S.updated = Date.now();
        S.state = stateOf(d);
        if (!S.sample && !S.auto && (S.state === 'counting' || S.state === 'waiting')) startPoll();
        if (!S.autoPhase) return S.nat;
        // v9 · the phase before the page paints. v14 · once the count is done, the provinces too, waited for up to 1,5 s (every council's
        // seats, for the masthead and Hung councils); if they come later the phase is still applied. v23: no progress report
        var settled = false;
        var pv = S.state === 'final' ? Promise.all(PROV_ORDER.map(function (pc) { return (provP[pc] || provinceP(pc, false, null)).catch(function () {}); })) : Promise.resolve();
        pv.then(function () { if (settled) rephase(); });
        return Promise.race([pv, new Promise(function (r) { setTimeout(r, 1500); })]).then(function () { settled = true; rephase(); startWatch(); return S.nat; });
      });
    }
    function attempt() {
      if (tryP) return tryP;
      if (retryT) { clearTimeout(retryT); retryT = null; }
      var was = S.state;
      tryP = firstRead(was === 'error').then(function (d) {
        tryP = null; retryN = 0;
        readyOk(d);
        if (was === 'error') emit();
        return d;
      }, function (e) {
        tryP = null;
        S.state = 'error';
        retryT = setTimeout(attempt, retryN++ ? POLL : 30000);
        emit();
        throw e;
      });
      tryP.catch(function () {});
      return tryP;
    }
    function ready() {
      if (!readyP) { readyP = new Promise(function (r) { readyOk = r; }); attempt(); }
      return readyP;
    }
    function retry() { ready(); return S.state === 'error' ? attempt() : Promise.resolve(); }
    var provP = {}, prevP = {}, WANT = {}, provT = {}, provN = {};   // v23: WANT, the provinces asked for (each refresh reads them again, a failed one too); provT, provN: a failed province's next read
    function province(pc, fresh) {
      if (!PROVS[pc]) return Promise.resolve(null);
      WANT[pc] = 1;
      if (provP[pc] && !fresh) return provP[pc];
      return provinceP(pc, fresh, ready());
    }
    // v14: wait, what to read after (ready(); inside ready itself, nothing)
    function provinceP(pc, fresh, wait) {
      var p = (wait || Promise.resolve()).then(function () {
        return get('/' + S.src + '/provinces/' + encodeURIComponent(PROVS[pc]), fresh);
      }).then(function (d) {
        if (d) RAW.prov[pc] = d;
        if (d && S.sample) d = simProvince(d);
        if (d) index(IX, pc, d);
        SEEN[pc] = 1;
        if (decTally()) { rephase(); emit(); }   // v14: the councils declared, recounted; a change moves the page on
        return d;
      });
      provP[pc] = p;
      p.catch(function () {
        if (provP[pc] === p) delete provP[pc];
        SEEN[pc] = 1;
        if (decTally()) emit();
        // v23: read again 30 seconds later, then every 5 minutes, unless the 5-minute refresh does it (it reads WANT)
        var n = provN[pc] = (provN[pc] || 0) + 1;
        if (!provT[pc] && !pollT) provT[pc] = setTimeout(function () { provT[pc] = 0; if (!provP[pc] && !pollT) province(pc).then(function () { provN[pc] = 0; emit(); }, function () {}); }, n > 1 ? POLL : 30000);
      });
      return p;
    }
    function loadAllProv() { PROV_ORDER.forEach(function (pc) { if (!provP[pc]) province(pc).catch(function () {}); }); }   // v14: every province not yet read
    // The council before this one (2021): the coalition builder shows it until this election's seats are in. Only while the page shows a later election.
    function hasPrev() { return S.year !== PREV; }
    function provincePrev(pc) {
      if (!PROVS[pc] || !hasPrev()) return Promise.resolve(null);
      if (prevP[pc]) return prevP[pc];
      var p = get('/' + PREV + '/provinces/' + encodeURIComponent(PROVS[pc])).then(function (d) { if (d) index(IXP, pc, d); return d; });
      prevP[pc] = p;
      p.catch(function () { if (prevP[pc] === p) delete prevP[pc]; });
      return p;
    }
    function council(key) {
      var m = MUNIS[key];
      if (!m) return Promise.resolve(null);
      return province(m.p).then(function () { var R = IX[key] ? norm(IX[key].e) : null; return R && R.district ? dcCount(R, m) : R; });
    }
    // v23.34: a district council's own result (its district ballot's votes, with its seats) comes in with the end of the count. Until then the
    // district ballot's count is added up from its local councils' results (dc40_votes). Those list only the parties standing for the local
    // council, so a party's district ballot votes where it didn't stand locally are left out (0 to 0,9% of the votes in 2021); dcSum says so.
    function dcCount(R, m) {
      if (!m.members || R.parties.some(function (p) { return p.votes > 0; })) return R;
      var by = {}, rows = [], tot = 0;
      m.members.forEach(function (k) {
        ((IX[k] && IX[k].e.party_ballot_results) || []).forEach(function (r) {
          var v = +r.dc40_votes || 0, id = +r.party_id || 0, p = by[id];
          if (!v) return;
          if (!p) { p = by[id] = party(r.party_id, r.party_name); p.votes = p.pct = p.wardVotes = p.prVotes = p.dcVotes = p.seats = p.wardSeats = p.prSeats = 0; rows.push(p); }
          p.votes += v; tot += v;
        });
      });
      if (!tot) return R;
      rows.forEach(function (p) { p.pct = Math.round(p.votes / tot * 10000) / 100; });
      rows.sort(function (a, b) { return b.votes - a.votes; });
      return Object.assign({}, R, { parties: rows, dcSum: true });
    }
    // v15: the 2021 national totals, with each province's (Change since 2021)
    var natPrevP = null;
    function natPrev() {
      if (!hasPrev()) return Promise.resolve(null);
      if (natPrevP) return natPrevP;
      var p = get('/' + PREV);
      natPrevP = p;
      p.catch(function () { if (natPrevP === p) natPrevP = null; });
      return p;
    }
    function councilPrev(key) {
      var m = MUNIS[key];
      if (!m || !hasPrev()) return Promise.resolve(null);
      return provincePrev(m.p).then(function () { return IXP[key] ? norm(IXP[key].e) : null; }, function () { return null; });
    }
    function ward(key, wardId) {
      var m = MUNIS[key];
      if (!m) return Promise.resolve(null);
      return province(m.p).then(function () {
        var x = IX[key];
        if (!x) return null;
        return get('/' + S.src + '/provinces/' + encodeURIComponent(PROVS[x.pc]) + '/municipalities/' + x.id + '/wards/' + encodeURIComponent(wardId));
      }).then(function (d) {
        if (d && S.sample) d = ballot26(simWard(d), key, wardId);
        return d && d.ward_id ? norm(d) : null;
      });
    }
    // v22.1: a ward's 2021 result, by its 2021 ward ID, from the 2021 feed (the ward map's Change since 2021). Only while the page shows a later election.
    function wardPrev(key, wardId) {
      var m = MUNIS[key];
      if (!m || !hasPrev()) return Promise.resolve(null);
      return provincePrev(m.p).then(function () {
        var x = IXP[key];
        return x ? get('/' + PREV + '/provinces/' + encodeURIComponent(PROVS[x.pc]) + '/municipalities/' + x.id + '/wards/' + encodeURIComponent(wardId)) : null;
      }).then(function (d) { return d && d.ward_id ? norm(d) : null; });
    }
    var subs = [];
    function on(fn) { subs.push(fn); }
    function emit() { subs.forEach(function (f) { try { f(); } catch (e) { if (window.console) console.error('[elections-hub] results update:', e); } }); }
    var pollT = null;
    function startPoll() { if (!pollT) pollT = setInterval(refresh, POLL); }
    function refresh() {
      if (S.state === 'error') return retry().then(emit, emit);   // v23: the totals not read yet: try again now (see "trying again")
      if (S.sample || S.auto) return Promise.resolve();
      return get('/' + S.src, true).then(function (d) {
        if (d) { S.nat = d; S.state = stateOf(d); S.updated = Date.now(); }
        if (S.state === 'final' && pollT) { clearInterval(pollT); pollT = null; }
        else if (S.state !== 'final' && !pollT) startPoll();   // v23: counting again (a count that had read complete): every 5 minutes once more
        if (S.autoPhase) rephase();
        Object.keys(cache).forEach(function (u) { if (/\/municipalities\/[^/]+\/wards\//.test(u)) delete cache[u]; });
        // v14: once the count is done, every province (the councils with seats); before that, the ones asked for (v23: a failed one too)
        return Promise.all((S.state === 'final' ? PROV_ORDER : Object.keys(Object.assign({}, WANT, provP))).map(function (pc) { return province(pc, true).catch(function () {}); }));
      }).then(emit, emit);
    }

    /* ---- formats ---- */
    function pct(v) { return v == null || isNaN(v) ? '\u2014' : (Math.round(v * 10) / 10).toFixed(1).replace('.', ',') + '%'; }
    function int(n) { return String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
    function short(n) {
      n = +n || 0;
      if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/0$/, '').replace('.', ',') + 'm';
      if (n >= 1e4) return Math.round(n / 1000) + 'k';
      return int(n);
    }
    function declared(R) { return R && R.vdCount ? R.vdCaptured / R.vdCount * 100 : 0; }
    function decPct(R) { var v = declared(R); return R && R.vdCaptured >= R.vdCount ? '100%' : String(Math.floor(v * 10) / 10).replace('.', ',') + '%'; }
    function shortName(m) { return m.n.replace(/ Local Municipality$/, '').replace(/^City of /, '').replace(/ District Municipality$/, ' District'); }
    function info(html) {
      return '<span class="cs-info-wrap"><button type="button" class="cs-info" aria-label="What does this mean?" aria-expanded="false">?</button>' +
        '<span class="cs-info-pop" role="note" style="border-radius:10px" hidden>' + html + '</span></span>';
    }
    function def(h, t) { return '<span class="cs-def"><b class="cs-def-h">' + h + '</b><span class="cs-def-txt">' + t + '</span></span>'; }
    var SEATS_INFO = def('Votes turn into seats.', 'The person who wins your ward gets a seat on the council. The party votes decide the rest of the seats, so a party that gets a quarter of the votes ends up with roughly a quarter of the council.') +
      def('Who governs.', 'The council elects the mayor. A party with more than half the seats can do it alone; otherwise parties need a coalition that adds up to a majority.');
    var DIST_INFO = def('Who sits on the district council.', 'About 40% of the seats are filled from the district party-list ballot. The rest are councillors sent by the local councils in the district.');
    var TURN_INFO = def('Turnout', 'The share of registered voters who voted.') + def('Ballots cast', 'Every ballot paper counted. Most voters mark two or three ballots, so there are more ballots than voters.');

    /* ---- pieces shared by the municipal file, the ward box and the national section ---- */
    function segs(list, val, n) {
      var top = list.filter(function (p) { return val(p) > 0; }).slice(0, n || 3);
      var restV = list.slice(top.length).reduce(function (a, p) { return a + val(p); }, 0);
      var out = top.map(function (p) { return { lbl: p.label, v: val(p), col: p.col }; });
      if (restV > 0.05) out.push({ lbl: 'Others', v: restV, col: OTHERS });
      return out;
    }
    function bar(sg, fmt, marker) {
      return '<div class="wg-bar' + (marker != null ? ' has-mark' : '') + '" role="img" aria-label="' + esc(sg.map(function (s) { return s.lbl + ' ' + fmt(s.v); }).join(', ')) + '">' +
          sg.map(function (s) { return '<span style="flex:' + s.v + ' 1 0%;background:' + esc(s.col) + '"></span>'; }).join('') +
          (marker != null ? '<em class="wg-mark" style="left:' + marker + '%"></em>' : '') +
        '</div>' +
        '<ul class="wg-legend">' + sg.map(function (s) {
          return '<li><i style="background:' + esc(s.col) + '"></i>' + esc(s.lbl) + ' <b>' + fmt(s.v) + '</b></li>';
        }).join('') + '</ul>';
    }
    function partyLine(p) {
      return '<div class="wg-party"><span class="wg-sw" style="background:' + esc(p.col) + '"></span><b class="wg-ab">' + esc(p.label) + '</b>' +
        (p.name && p.name !== p.label ? '<span class="wg-full">' + esc(p.name) + '</span>' : '') + '</div>';
    }
    // v27's source line: small, and the source links to the IEC results site.
    function srcLine(R, cls, more) {   // v23.13: more, a note before the source (the ward box: where the candidate's name comes from)
      var bits = [];
      if (S.sample) bits.push('<strong>Sample data</strong>');
      if (R && R.complete) bits.push(R.declared || (R.ward && isDeclared(fileKey)) ? 'Declared' : S.phase === 'final' ? 'Final result' : 'Full count, provisional');   // v14: by the council's own declaration (a ward's, its council's)
      else if (R && R.vdCount) bits.push('Provisional: ' + int(R.vdCaptured) + ' of ' + int(R.vdCount) + ' voting districts declared');
      if (more) bits.push(more);
      bits.push('<a class="wg-src-link" href="' + IEC_URL + '" target="_blank" rel="noopener">Source: Electoral Commission of South Africa</a>');
      return '<p class="' + (cls || 'wg-src') + '">' + bits.join(' &middot; ') + '</p>';
    }
    function yr(y) { return '<b class="wg-yr">' + esc(y) + '</b>'; }
    function wait() { return '<div class="mf-res-wait" aria-hidden="true"><span></span><span></span><span></span></div>'; }
    function msg(t) { return '<p class="mf-res-msg">' + t + '</p>'; }
    // v23: the results not read (see "trying again"): what to say, and Refresh results (data-res-retry, handled under paintMast; attr: another handler's)
    var ERR_TXT = 'The results could not be loaded. The page will try again shortly.';
    function errMsg(cls, txt, attr) {
      cls = cls || 'mf-res-msg';
      return '<div class="eh-res-err' + (cls === 'mf-res-msg' ? ' is-c' : '') + '"><p class="' + cls + '">' + (txt || ERR_TXT) + '</p><button type="button" class="res-refresh" ' + (attr || 'data-res-retry') + '>Refresh results</button></div>';
    }
    var WAIT_TXT = 'Results appear here as voting districts declare.';
    function noneTxt(R) { return S.state === 'error' ? 'The results could not be loaded.' : S.state === 'waiting' || (R && !R.vdCaptured && !R.district) ? WAIT_TXT : R && R.district ? (S.phase === 'count' ? 'District seats are allocated once counting ends.' : S.phase !== 'final' ? 'District seats are shown once the Electoral Commission declares the results.' : 'The district council\u2019s seats aren\u2019t in the Electoral Commission\u2019s results yet.') : 'Results for this council aren\u2019t available.'; }

    // The council box in the black banner: who won (or leads) on the left; on the right the count tracker (post-elections v20: in the
    // vote breakdown's place, up from under the locator map), or a district council's seats (it has no voting districts of its own)
    function councilBox(R) {
      var o = outcome(R), trk = declBox(R), right = trk ? '<div class="wg-break wg-trk">' + trk + '</div>' : '';
      if (!R || o.state === 'none') {
        var none = '<p class="wg-note wg-note-solo">' + noneTxt(R) + '</p>';
        return right ? '<div class="wg-grid has-trk"><div class="wg-main">' + none + '</div>' + right + '</div>' : none;
      }
      var p = o.lead, seatView = o.state === 'majority' || o.state === 'hung' || o.state === 'district';
      var lbl = o.state === 'majority' ? 'Won by' : o.state === 'counting' ? 'Leading' : 'Largest party';
      var note = o.state === 'majority' ? ''
        : o.state === 'hung' ? ''
        : o.state === 'district' ? '<b>' + p.seats + ' of ' + o.direct + '</b> district ballot seats'
        : '';
      var left = '<div class="wg-main"><span class="wg-lbl">' + lbl + ' in ' + yr(S.year) + '</span>' + partyLine(p) + (note ? '<p class="wg-note">' + note + '</p>' : '') + '</div>';
      if (!right && seatView) right = '<div class="wg-break"><span class="wg-lbl">' + (R.district ? 'District ballot seats' : 'Council seats' + (R.declared ? '' : ' (provisional)') + ' &middot; ' + o.need + ' for a majority') + '</span>' +
            bar(segs(R.parties.slice().sort(bySeats), function (x) { return x.seats; }), function (v) { return String(v); }, R.district ? null : 50) + '</div>';
      return '<div class="wg-grid' + (trk ? ' has-trk' + (/\bis-done\b/.test(trk) ? ' is-done' : '') : right ? '' : ' is-single') + '">' + left + right + '</div>' + srcLine(R);
    }

    /* ---- the seat board's data: a council, one tab for each election it has seats for ---- */
    var NAMED = 6;   // more parties than NAMED + 1 with seats: the smallest are grouped as Other, as in the widget
    function pkey(p) { return 'p' + p.id; }
    function boardEntry(key, list, parties) {
      var m = MUNIS[key], N = list[0].R.seatsTotal, MAJ = Math.floor(N / 2) + 1;
      var best = {};
      list.forEach(function (it, yi) {
        it.R.parties.forEach(function (p) {
          if (!p.seats) return;
          var k = pkey(p), b = best[k] || (best[k] = { p: p, max: 0, cur: 0 });
          b.max = Math.max(b.max, p.seats);
          if (!yi) b.cur = p.seats;
          if (!parties[k]) parties[k] = { name: p.label, color: p.col };
        });
      });
      var keys = Object.keys(best).sort(function (a, b) { return best[b].cur - best[a].cur || best[b].max - best[a].max; });
      var named = keys.length > NAMED + 1 ? keys.slice(0, NAMED) : keys, grouped = keys.length > named.length;
      var name = m ? shortName(m) : list[0].R.name;
      var polls = list.map(function (it) {
        var R = it.R, seats = {}, oth = 0, othBy = [], ward = 0, prs = 0;
        named.forEach(function (k) { seats[k] = null; });
        R.parties.forEach(function (p) {
          ward += p.wardSeats; prs += p.prSeats;
          if (!p.seats) return;
          var k = pkey(p);
          if (named.indexOf(k) >= 0) seats[k] = p.seats; else { oth += p.seats; othBy.push([k, p.seats]); }
        });
        if (grouped) seats.OTH = oth;
        othBy.sort(function (a, b) { return b[1] - a[1]; });
        var top = R.parties.slice().sort(bySeats)[0], body;
        if (top && top.seats >= MAJ) body = top.label + ' won ' + top.seats + ' of the ' + N + ' seats, a majority, so it governs on its own.';
        else body = 'No party won a majority' + (top ? ': the largest, ' + top.label + ', has ' + top.seats + ' of the ' + N + ' seats' : '') + '. Parties need a coalition of at least ' + MAJ + ' seats to elect the mayor.';
        if (ward && prs) body += ' ' + ward + ' councillors won their wards and ' + prs + ' came from the party lists, which top up each party\u2019s seats to match its share of the vote.';
        if (grouped) body += ' Other is every party with fewer seats than ' + (best[named[named.length - 1]] ? best[named[named.length - 1]].p.label : 'those named') + '.';
        return {
          id: it.y, tab: it.y + ' result', when: S.sample && it.y === S.year ? 'Sample data' : 'Final',
          seats: seats, oth: othBy, nr: 'No seats in ' + it.y, paths: [],
          info: {
            title: (m ? m.n : name) + ', ' + it.y + ' election',
            body: body,
            facts: [['Seats', String(N)], ['Majority', String(MAJ)], ['Turnout', pct(R.turnout)], ['Registered voters', int(R.registered)]],
            foot: 'Seats as allocated by the Electoral Commission of South Africa' + (S.sample && it.y === S.year ? ' (sample data, made up from the 2021 results)' : '') + '.',
            url: IEC_URL, link: 'Source: IEC results'
          }
        };
      });
      var max = 0;
      polls.forEach(function (p) { Object.keys(p.seats).forEach(function (k) { if (p.seats[k] > max) max = p.seats[k]; }); });
      return { id: key, name: name, place: name, seats: N, majority: MAJ, order: named.concat(grouped ? ['OTH'] : []), max: Math.max(1, max), polls: polls };
    }
    // The one election a council's seats are shown for: this one once it is allocated, and 2021 while it is not. No 2021 tab next
    // to this election's seats. (2021 stands in on the coalition builder only: the municipal file's half circle never does, see fileData.)
    function seated(R) { return !!(R && !R.district && R.seated > 0 && R.seatsTotal); }
    // v4: the coalition builder's councils, each with the seats seatsView gives (no 2021 council in its place); a council with none is left out
    function boardData(keys) {
      return Promise.all(keys.map(function (k) {
        return council(k).catch(function () { return null; }).then(function (R) { return { k: k, v: seatsView(R) }; });
      })).then(function (all) {
        var parties = { OTH: { name: 'Other', color: OTHERS } }, metros = [];
        all.forEach(function (a) { if (drawn(a.v)) metros.push(tagPolls(boardEntry(a.k, [{ y: S.year, R: a.v.R }], parties), a.v)); });
        return { metros: metros, parties: parties };
      });
    }

    /* ---- v4 · seats by phase ----
       The half circle and the coalition builder show the IEC's seats once it has published them: provisional until the Commission declares the
       results, then final (v23; v14 to v22: final at once, see "declared councils"). Until then, once the council's count is done, the seats the full count gives (project), marked as provisional.
       v16: no projection while the count is under way: until every voting district has declared, the half circle stays empty (gate). */
    var GATE = 100;   // v16: the share of a council's voting districts in before its seats show (25 until v15, for a projection)
    // The IEC's method on the votes counted so far: a quota of the party votes on the ward and list ballots (not the district ballot) over
    // the seats, plus one; a seat for each whole quota, then the seats left to the largest remainders. Independent ward candidates aren't
    // projected. Run on the full 2021 count it gives the IEC's seats in 188 of 213 councils, and is half a seat out on average.
    function project(R) {
      var N = R && R.seatsTotal;
      if (!N) return null;
      function vOf(p) { return p.wardVotes + p.prVotes || p.votes; }
      var ps = R.parties.filter(function (p) { return !p.ind && vOf(p) > 0; }), V = 0, left = N, got = {};
      ps.forEach(function (p) { V += vOf(p); });
      if (!V) return null;
      var Q = Math.floor(V / N + 1);
      var list = ps.map(function (p) { var v = vOf(p), n = Math.floor(v / Q); left -= n; return { id: p.id, n: n, r: v / Q - n }; });
      list.slice().sort(function (a, b) { return b.r - a.r; }).forEach(function (x) { if (left > 0) { x.n++; left--; } });
      list.forEach(function (x) { got[x.id] = x.n; });
      return Object.assign({}, R, { parties: R.parties.map(function (p) { return Object.assign({}, p, { seats: got[p.id] || 0, wardSeats: 0, prSeats: 0 }); }), seated: N - left, seatGap: 0, projected: true });
    }
    // kind: final | provisional | gate (counting) | none   (v16: no projection)
    function seatsView(R) {
      if (!R || R.district || !R.seatsTotal || R.seatsBroken) return { kind: 'none', R: R };
      if (R.seated > 0) return { kind: S.phase === 'final' ? 'final' : 'provisional', R: R, iec: true };   // v23: the Commission's seats, provisional until it declares the results (v14 to v22: declared in any phase)
      var done = !!R.complete || (R.vdCount > 0 && R.vdCaptured >= R.vdCount), d = declared(R);
      if (!done) return { kind: 'gate', R: R, d: d };   // v16: empty until the count is done
      var P = R.vdCaptured > 0 ? project(R) : null;
      return P ? { kind: 'provisional', R: P, d: d } : { kind: 'none', R: R };
    }
    function drawn(v) { return !!v && (v.kind === 'final' || v.kind === 'provisional'); }
    function hungOf(v) {
      if (!drawn(v)) return null;
      var top = v.R.parties.slice().sort(bySeats)[0], need = Math.floor(v.R.seatsTotal / 2) + 1;
      return top ? { top: top, need: need, hung: top.seats < need, short: need - top.seats } : null;
    }
    // the seat board's tab and i panel for provisional seats
    function tagPolls(b, v) {
      var P = b.polls[0], smp = S.sample ? 'Sample data \u00b7 ' : '', h = hungOf(v), t = h && h.top;
      b.kind = v.kind; b.hung = !!(h && h.hung);
      if (v.kind === 'provisional') {
        P.when = smp + 'Provisional';
        P.info.foot = v.iec ? 'Seats as allocated by the Electoral Commission of South Africa. They are provisional until it declares the results.'
          : 'Worked out by Daily Maverick from the full count, before the Electoral Commission publishes its seat calculation: the ward and party-list votes divided by a quota, a seat for each full quota, the rest to the largest remainders. The Commission\u2019s own calculation can differ by a seat.';
      }
      return b;
    }

    /* ---- v4 · the first sitting ----
       A council must hold its first sitting, where councillors elect a speaker and a mayor, within 14 days of being declared elected.
       The last day comes from data-deadline on #dm-eh (YYYY-MM-DD; in 2021 it was 23 November). A council whose first sitting is called
       for an earlier day can have its own day in the JSON block #eh-sittings: { "jhb": "2026-11-20" }. v23: report_date on a council's
       seats is ignored (v14 to v22 counted 14 days from it); the 14 days run from the gazette of the names. Days are counted in South
       African time. Previews count as if the councils were declared elected S.day days ago (the day slider, ?day=). */
    var SITS = {};
    try { var sj = document.getElementById('eh-sittings'); if (sj) SITS = JSON.parse(sj.textContent || '{}') || {}; } catch (e) {}
    var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    function dayNo(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim()); return m ? Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5) : null; }
    function sast() { return Math.floor((Date.now() + 72e5) / 864e5); }
    function dlIso() { return String((ROOT && ROOT.getAttribute('data-deadline')) || '').trim() || (S.src === '2021' ? '2021-11-23' : ''); }
    function today() { if (EH_ON_DM) return sast(); var d = dayNo(dlIso()); return d != null ? d - 14 + S.day : sast(); }
    function dayTxt(n, short) { var t = new Date(n * 864e5), w = WD[t.getUTCDay()], m = MO[t.getUTCMonth()]; return short ? w.slice(0, 3) + ' ' + t.getUTCDate() + ' ' + m.slice(0, 3) : w + ' ' + t.getUTCDate() + '\u00a0' + m; }
    // a council's own last day: its first sitting (SITS), else data-deadline. v23: no longer 14 days after report_date on its seats (v14 to
    // v22), which comes with the seats, days before the names are gazetted; dec stays false.
    function deadline(key) {
      var own = key && SITS[key] ? dayNo(SITS[key]) : null, dec = null;
      var d = own != null ? own : dayNo(dlIso());
      if (d == null && !EH_ON_DM) d = sast() + 14 - S.day;
      if (d == null) return null;
      var left = d - today();
      return { left: left, own: own != null, dec: dec != null, date: dayTxt(d), short: dayTxt(d, true), txt: left > 1 ? left + ' days left' : left === 1 ? '1 day left' : left === 0 ? 'Due today' : 'Passed' };
    }
    // the Hung council banner, in the municipal file and under the coalition builder; h: {need, total}, the seats a coalition needs.
    // v11.6: prov (the seats provisional, the results not yet declared): no majority and what a coalition needs, no date, no countdown.
    // Final seats: the date of the first sitting and the countdown to it.
    function dlStrip(key, h, prov) {
      var coal = ', so it takes a coalition' + (h && h.need ? ' holding <b>' + h.need + ' of the ' + h.total + '</b> seats' : '') + ' to elect a speaker and a mayor.';
      if (prov) return '<div class="eh-dl is-prov"><span class="eh-dl-k">Hung<br>council</span><p>No party has a majority' + coal + '</p></div>';   // v13: Hung council on the left over two lines, a rule, the explanation on the right
      var D = deadline(key);
      var body = 'No party won a majority' + coal + ' ' +
        (D && D.own ? 'The council\u2019s first sitting, where that vote happens, is on <b>' + D.date + '</b>.'
        : 'The council must hold its first sitting, where that vote happens, ' + (D ? 'by <b>' + D.date + '</b>, 14 days after it was declared elected.' : 'within 14 days of being declared elected.'));
      var n = !D ? '' : D.left < 0 ? '<span class="eh-dl-n is-past"><strong>Passed</strong></span>'
        : '<span class="eh-dl-n"><strong>' + (D.left === 0 ? 'Today' : D.left) + '</strong>' + (D.left === 0 ? '' : '<span>' + (D.left === 1 ? 'day left' : 'days left') + '</span>') + '</span>';
      return '<div class="eh-dl' + (D && D.left >= 0 && D.left <= 3 ? ' is-due' : '') + (D && D.left < 0 ? ' is-past' : '') + '"><span class="eh-dl-k">Hung<br>council</span><p>' + body + '</p>' + n + '</div>';
    }
    // previews: the count slider cuts the sample again from the 2021 figures; the day slider moves the countdowns
    function resim() {
      if (!S.sample) return;
      if (RAW.nat) { S.nat = simNational(RAW.nat); S.state = stateOf(S.nat); }
      Object.keys(RAW.prov).forEach(function (pc) { index(IX, pc, simProvince(RAW.prov[pc])); });
      S.updated = Date.now();
      decTally();
      rephase();
      emit();
      if (S.state === 'final') loadAllProv();   // v14: the sample's count done: every province, for the councils declared
    }
    function setSample(at) { S.at = Math.max(0.02, Math.min(1, +at || 0)); resim(); }
    function setDec(v) { S.dec = v == null || v === '' ? null : Math.max(0, Math.min(1, +v || 0)); resim(); }   // v14: the preview's Declared slider
    function setDay(n) { S.day = Math.max(0, Math.min(20, Math.round(+n || 0))); emit(); }

    /* ---- council seats in the municipal file ---- */
    var fileBoard = null;   // { key, host, b }
    var fileKey = '';
    // v5 · coalition mode in the municipal file (see below): the council, on or off, the coalition's parties in the order they were
    // picked, and the rows of pegs over the table
    var CO = { key: '', on: false, picks: [], dots: null, gone: null, list: null, ro: null, t: 0, want: '', intro: false };
    // v22.8: the row of parties at the foot of the box: the row, its council, its pegs (v22.10: and the party standing up under the pointer)
    var PK = { row: null, key: '', pegs: null, hov: null, t: 0 };
    function seatsSec(R, o) {
      var dist = R.district;
      if (dist) return '';   // v23.21: no District ballot seats section in a district council's file
      if (!R.seatsTotal) return '';
      var maj = '<strong>' + (Math.floor(R.seatsTotal / 2) + 1) + ' of ' + R.seatsTotal + '</strong> are needed for a majority.';
      if (R.seatsBroken) return '<div class="mf-res-sec mf-res-seats">' + head('Council seats', info(SEATS_INFO)) +
        '<p class="mf-board-cap">The Electoral Commission\u2019s seat figures for this council are incomplete, so the seats aren\u2019t shown. ' + maj + '</p></div>';
      // v4: what the half circle shows depends on the phase and the count (see "seats by phase")
      var v = seatsView(R), h = hungOf(v), hung = !!(h && h.hung), coal = h ? 'A coalition needs <strong>' + h.need + ' of the ' + R.seatsTotal + '</strong> seats.' : '';
      var tag = '', cap = '', note = '', dl = '', m = MUNIS[fileKey], nm = m ? shortName(m) : R.name;
      // v5: a hung council's file can build a coalition where it stands, once its seats are provisional or final (v11: in any phase,
      // so a council whose count is done gets it on election night too)
      var can = hung && !!fileKey && (v.kind === 'final' || v.kind === 'provisional');
      // v11: the status tag (Projection, Provisional, Declared) is a button; the note on what the seats are, once a caption over the box,
      // drops down from it (the document click handler that runs the ? buttons opens and closes it). The caption stays only while the
      // half circle is empty after the count (none), where it says why. v20: while counting (gate), no caption; a small note in the box's top-left corner.
      var gap = R.seatGap && v.iec ? ' The Electoral Commission\u2019s figures account for ' + (R.seatsTotal - R.seatGap) + ' of the ' + R.seatsTotal + ' seats.' : '';
      function tagBtn(cls, lbl, sub, txt) {
        return '<span class="cs-info-wrap mf-seat-tag-wrap"><button type="button" class="mf-seat-tag ' + cls + '" aria-expanded="false" title="What does this mean?"><strong>' + lbl + '</strong></button>' +
          '<span class="cs-info-pop mf-seat-tag-pop" role="note" style="border-radius:10px" hidden>' + def(lbl, txt + gap) + '</span></span>';
      }
      if (v.kind === 'gate') note = 'Provisional seats appear<br>once the count is done.';   // v16: no projection
      else if (v.kind === 'none') cap = R.complete ? 'Counting is finished. The seats appear here once the Electoral Commission allocates them. ' + maj : 'Seats are allocated once counting ends. ' + maj;
      else if (v.kind === 'provisional') {
        tag = tagBtn('is-prov', 'Provisional', v.iec ? 'Not yet declared' : 'From the full count',
          (v.iec ? 'The count is done and the Electoral Commission has allocated the seats. They are final once it declares the results.' : 'The count is done but the Electoral Commission has not yet published its seat calculation. Until it does, Daily Maverick works the seats out from the full count: the ward and party-list votes are divided by a quota (the votes per seat), each party gets a seat for every full quota, and the seats left over go to the largest remainders. The Commission\u2019s own calculation can differ by a seat, which can decide whether a council is hung.') +
          (hung ? ' No party has a majority. ' + coal : ''));
        if (can) dl = dlStrip(fileKey, { need: h.need, total: R.seatsTotal }, true);   // v11.6: the Hung council banner as soon as the count is done, no countdown yet
      }
      else if (v.kind === 'final') {
        tag = tagBtn('is-final', 'Declared', 'Final results', 'The Electoral Commission of South Africa has declared the results. These seats are final.' + (hung ? ' No party won a majority. ' + coal : ''));
        if (can) dl = dlStrip(fileKey, { need: h.need, total: R.seatsTotal });   // v5: over a hung council's final seats, the countdown to its first sitting
      }
      // v5: "Build a coalition" turns the file to coalition mode
      // v8: the button stands in the box's top-right corner, across from the status tag (a solid black button, an arrow)
      // v11: it reads Who can build a coalition?; in coalition mode "Back to results" (solid black too, same size, a left arrow; the go button has none) stands in its place, and nothing
      // is drawn under the box
      // post-elections v23: no button: Who can build a coalition in <council>? in DM Custom, lifting under the pointer; in coalition mode it stays, lifted, with the
      // smaller "Back to results" under it (v23.4; v23.2 and v23.3 had it with the status tag).
      // v23.37: the button that clears the coalition hangs under Back to results, on the right (v23.23 to v23.36: under the status tag, top left; v23.4 to v23.22: in the
      // half circle, over the number); coalSync shows it in coalition mode once a party is in
      var clr = can && tag ? '<button type="button" class="mf-cb-clr" data-coal-clear aria-label="Clear the coalition" title="Clear the coalition" hidden><span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" style="display:block;fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round"><path d="M18.76 13.81a7 7 0 1 1-2.26-7.17l2 1.67"></path><path d="M18.5 3.8v4.5h-4.5"></path></svg></span></button>' : '';
      // v23.31: on a phone it reads Back (the stylesheet hides "to results"); its name is Back to results at every width
      var back = can ? '<button type="button" class="mf-cb-go mf-coal-back" data-coal-back aria-label="Back to results"><span class="arr" aria-hidden="true">&larr;</span><span>Back<span class="mf-back-to"> to results</span></span></button>' : '';
      var go = can ? '<div class="mf-cb-side"><button type="button" class="mf-cb-ask" data-coal-go>Who can build a coalition in ' + esc(nm) + '?</button>' + back + clr + '</div>' : '';
      // v8: the half circle stands in a white box with a thin black border; the status tag (Projection, Provisional, Declared) sits in its top-left corner
      return '<div class="mf-res-sec mf-res-seats is-' + v.kind + (can ? ' can-coal" data-maj="' + h.need : '') + '">' + dl + (cap ? '<p class="mf-board-cap">' + cap + '</p>' : '') +
        '<div class="mf-seat-box">' + (tag || go || note ? '<div class="mf-seat-head' + (go ? ' has-cb' : '') + '">' + (clr ? '<div class="mf-seat-l">' + tag + '</div>' : tag) + (note ? '<p class="mf-seat-note">' + note + '</p>' : '') + go + '</div>' : '') + '<div class="mf-res-board' + (can ? ' can-coal' : '') + '" data-board="1"></div>' + (can ? coalPick(v.R || R) : '') + '</div></div>';   // v22.8: the seats the half circle shows (provisional seats from the full count are on v.R)
    }
    // v22.8: the foot of a hung council's box (v22.10: shown in coalition mode only): every party with seats in a row, largest first, each its
    // name, under it one peg (EH_BOARD.peg, see pickShow) and its seats beside the peg. A click puts the party in the coalition or takes it out.
    function coalPick(R) {
      var ps = R.parties.filter(function (p) { return p.seats > 0; }).sort(bySeats);
      if (!ps.length) return '';
      var sig = ps.map(function (p) { return [p.id, p.seats, p.label, p.col].join(':'); }).join('|');
      return '<div class="mf-coal-row" role="group" aria-label="Seats by party" data-sig="' + esc(sig) + '">' + ps.map(function (p, i) {
        return '<button type="button" class="mf-cp" data-pk="p' + p.id + '" data-n="' + p.seats + '" data-col="' + esc(p.col) + '" aria-pressed="false" style="--i:' + i + '"' + (p.name !== p.label ? ' title="' + esc(p.name) + '"' : '') + '>' +
          '<span class="mf-cp-nm">' + esc(p.label) + '</span><span class="mf-cp-st"><span class="mf-cp-peg" aria-hidden="true"></span><b>' + p.seats + '</b><span class="vh">' + (p.seats === 1 ? ' seat' : ' seats') + '</span></span></button>';
      }).join('') + '</div>';
    }
    function head(t, extra) { return '<div class="mf-v4-ag-head"><span class="lbl">' + t + (extra || '') + '</span></div>'; }
    // Area declaration (the count tracker): red while the IEC counts, green once every voting district is in. In the black banner's
    // council box beside the leading or largest party (post-elections v20; under the locator map until then), and over the results tabs.
    function declBox(R) {
      if (!R || !R.vdCount) return '';
      var done = R.complete || R.vdCaptured >= R.vdCount, v = done ? 100 : declared(R);
      return '<div class="mf-decl ' + (done ? 'is-done' : 'is-live') + '" aria-label="Area declaration"><div class="mf-decl-row"><span class="st"><i aria-hidden="true"></i>' + (done ? 'Count complete' : 'Counting') + '</span><b>' + (done ? '100%' : decPct(R)) + '</b></div>' +
        '<span class="trk"><i style="width:' + v.toFixed(1) + '%"></i></span>' +
        '<span class="sub">' + int(done ? Math.max(R.vdCaptured, R.vdCount) : R.vdCaptured) + ' of ' + int(R.vdCount) + ' voting districts</span></div>';
    }
    // Votes, share and seats (a dash until the seats are allocated; ward and list seats once they are). Where the half circle shows
    // the seats, a party with seats is a button: it picks its seats out on the half circle (v6: while the pointer is over its row, see mark below).
    // v9: the share bar is split by ballot, the party's ward votes solid and its PR votes hatched (a local council's district council
    // ballot dotted), with the figures under it and the key in the head; a party with no breakdown (a district's parties, seats-only
    // rows) keeps one solid bar.
    // v11.3: the bar shows the party's whole tally; the split, its figures and the key in the head show only while the row is open
    // (see "a row open"), when the figures and the bar move up together.
    var BALLOTS = [['w', 'Ward', 'wardVotes'], ['l', 'PR', 'prVotes'], ['d', 'District', 'dcVotes']];
    var DC_SUM = 'Until the district council\u2019s own result is in, these votes are added up from its local councils\u2019 results, which leave out a party\u2019s district ballot votes wherever it didn\u2019t stand for the local council.';   // v23.34, see dcCount
    function ballots(p) {
      var out = [];
      BALLOTS.forEach(function (b) { if (p[b[2]] > 0) out.push({ k: b[0], lbl: b[1], v: p[b[2]] }); });
      return out.length > 1 ? out : null;
    }
    function tableSec(R) {
      var dist = R.district, split = R.seated > 0 && !dist, pick = split && !!R.seatsTotal, top = 4, hov = !dist && !!R.seatsTotal, on = !dist || (R.seated > 0 && S.phase === 'final');   // v23.34: on, the seats shown (a district council's, once declared)   // v11.4: four rows, the rest under Show all   // v6: hov, a row its party's seats on the half circle can mark (v11.3: the row no longer picks them out)
      var list = R.parties.filter(function (p) { return p.votes > 0 || p.seats > 0; });
      if (!list.length) return '';
      var mx = Math.max.apply(null, list.map(function (p) { return p.pct || 0; })) || 1, kinds = {};
      list.forEach(function (p) { (ballots(p) || []).forEach(function (b) { kinds[b.k] = 1; }); });
      var key = Object.keys(kinds).length ? '<span class="shk">' + BALLOTS.filter(function (b) { return kinds[b[0]]; }).map(function (b) { return '<span><i class="' + b[0] + '"></i>' + b[1] + '</span>'; }).join('') + '</span>' : '';
      var th = '<tr><th scope="col" class="p">Party</th><th scope="col" class="sh"><span class="sht">Share' + key + '</span></th><th scope="col" class="n v">Votes</th><th scope="col" class="n">Seats</th></tr>';
      var rows = list.map(function (p, i) {
        var can = pick && p.seats > 0, cls = [i >= top ? 'is-more' : '', can ? 'is-pick' : ''].join(' ').trim();
        var who = '<span class="sw" style="background:' + esc(p.col) + '"></span>' +
          '<span class="pn"><strong' + (p.name !== p.label ? ' title="' + esc(p.name) + '"' : '') + '>' + esc(p.label) + '</strong></span>';
        var bs = ballots(p) || [{ k: 'w', v: 1 }], c = '--c:' + esc(p.col);
        var bar = '<span class="bar" style="width:calc((100% - 56px) * ' + Math.max(0, Math.min(1, (p.pct || 0) / mx)).toFixed(4) + ');' + c + '">' +
          bs.map(function (b) { return '<i class="' + b.k + '" style="flex-grow:' + b.v + ';' + c + '"></i>'; }).join('') + '</span>';
        var sub = bs.length > 1 ? '<span class="shs">' + bs.map(function (b) { return '<span>' + b.lbl + ' ' + int(b.v) + '</span>'; }).join('') + '</span>' : '';
        return '<tr' + (cls ? ' class="' + cls + '"' : '') + (can ? ' data-pk="p' + p.id + '" data-n="' + p.seats + '" data-col="' + esc(p.col) + '"' : '') + (hov ? ' data-hk="p' + p.id + '"' : '') + (i >= top ? ' hidden' : '') + '><th scope="row" class="p">' +
            (can ? '<button type="button" class="pc" aria-pressed="false">' + who + '</button>' : '<div class="pc">' + who + '</div>') + '</th>' +
          '<td class="sh">' + (sub ? '<span class="shw">' : '') + '<span class="shb">' + bar + '<strong>' + pct(p.pct) + '</strong></span>' + sub + (sub ? '</span>' : '') + '</td>' +
          '<td class="n v">' + int(p.votes) + '</td>' +
          '<td class="n">' + (p.seats && on ? '<strong>' + p.seats + '</strong>' : '<span class="na">\u2013</span>') + '</td></tr>';
      }).join('');
      var more = list.length > top ? '<button class="mf-res-more" type="button" data-res-all="' + list.length + '" aria-expanded="false">Show all ' + list.length + ' parties</button>' : '';
      return '<div class="mf-res-sec mf-res-tbl"><div class="mf-res-tw"><table class="mf-res-table' + (split ? ' has-split' : '') + (key ? ' can-open' : '') + '"><caption class="vh">' + (R.seated > 0 && on ? 'Votes and seats' : 'Votes') + ' by party</caption>' +
        '<thead>' + th + '</thead><tbody>' + rows + '</tbody></table></div>' + more + (R.dcSum ? '<p class="mf-res-src">' + DC_SUM + '</p>' : '') + '</div>';
    }
    function turnoutSec(R) {
      var cells = [];
      if (R.turnout != null) cells.push(['Turnout', pct(R.turnout)]);
      if (R.registered) cells.push(['Registered voters', int(R.registered)]);
      if (R.cast) cells.push(['Ballots cast', int(R.cast)]);
      if (R.spoilt) cells.push(['Spoilt ballots', int(R.spoilt)]);
      if (!cells.length) return '';
      return '<div class="mf-res-sec mf-res-turn">' + head('Turnout', info(TURN_INFO)) +
        '<ul class="mf-res-figs">' + cells.map(function (c) { return '<li><span class="k">' + c[0] + '</span><b>' + c[1] + '</b></li>'; }).join('') + '</ul></div>';
    }
    function councilBody(R) {
      var o = outcome(R);
      if (!R || o.state === 'none') {
        // no count yet: the council's seats, still empty
        if (R && !R.district) return msg(noneTxt(R)) + seatsSec(R, o);
        if (R && R.parties.some(function (p) { return p.votes > 0; })) return tableSec(R);   // v23.34: a district council's count, its seats blank until the declaration
        return msg(noneTxt(R));
      }
      return seatsSec(R, o) + tableSec(R);
    }
    // Writes the file body and draws its half circle of seats; on a live update the half circle already on screen is kept.
    function fill(box, key, R) {
      var old = fileBoard && fileBoard.key === key && fileBoard.host.isConnected && box.contains(fileBoard.host) ? fileBoard.host : null;
      // v5: a live update keeps the file in coalition mode; a file opened afresh starts on the results
      var stay = !!old && CO.on && CO.key === key;
      if (!stay) { coalStop(); CO.on = false; box.classList.remove('is-coal'); }
      if (CO.key !== key) { CO.key = key; CO.picks = []; }
      if (old) old.parentNode.removeChild(old);
      var oldRow = PK.row && PK.key === key && box.contains(PK.row) ? PK.row : null;   // v22.8
      fileKey = key;
      box.innerHTML = councilBody(R);
      var ph = box.querySelector('[data-board]');
      if (old && ph) {
        old.classList.toggle('can-coal', ph.classList.contains('can-coal'));
        ph.parentNode.replaceChild(old, ph);
        // a party picked out on the half circle stays picked through a live update, while it has seats
        var pk = fileBoard.b.picked ? fileBoard.b.picked() : null, row = pk && box.querySelector('tr[data-hk="' + pk + '"]');
        if (row) { if (!row.hidden) mark(row, true); } else if (pk) fileBoard.b.pick(null);
      }
      hydrate(box, key);
      askFit(box);   // v23.22
      // v22.8: the row of parties stays through a live update while its parties and seats are the same, its pegs hopping on
      var nr = box.querySelector('.mf-coal-row');
      if (oldRow && nr && nr.getAttribute('data-sig') === oldRow.getAttribute('data-sig')) { nr.parentNode.replaceChild(oldRow, nr); coalSync(box, true); }
      pickPegs(box, key);
      // v13: a file opened from Build a coalition in Hung councils starts in coalition mode (see DM_EH_COAL)
      var ask = CO.want === key, bk;
      CO.want = '';
      if (stay) coalEnter(box, true);
      else if (ask && box.querySelector('.mf-res-seats.can-coal')) {
        coalEnter(box);
        if ((bk = box.querySelector('[data-coal-back]'))) { try { bk.focus({ preventScroll: true }); } catch (err) {} }
        coalAnchor(box);   // v23.5
      }
    }
    // The file's half circle: this election's seats once they are allocated, until then every seat empty.
    // The file's half circle (v4): the seats seatsView gives (the IEC's, or from the full count; v16: no projection), else every seat empty. D.kind says which.
    function fileData(key) {
      return council(key).then(function (R) {
        var v = seatsView(R), m = MUNIS[key], parties = { OTH: { name: 'Other', color: OTHERS } };
        if (drawn(v)) return { kind: v.kind, iec: !!v.iec, parties: parties, metros: [tagPolls(boardEntry(key, [{ y: S.year, R: v.R }], parties), v)] };
        var N = R && !R.district ? R.seatsTotal : 0, name = m ? shortName(m) : R ? R.name : '';
        return { kind: v.kind, parties: parties, metros: N ? [{ id: key, name: name, place: name, seats: N, majority: Math.floor(N / 2) + 1, order: [], max: 1, polls: [{ id: S.year, seats: {} }] }] : [] };
      });
    }
    function hydrate(box, key) {
      box.querySelectorAll('[data-pegrows]').forEach(function (el) {
        var rows = [];
        try { rows = JSON.parse(el.getAttribute('data-pegrows')); } catch (e) {}
        el.removeAttribute('data-pegrows');
        if (window.EH_BOARD && rows.length) EH_BOARD.rows(el, rows.map(function (r) { return { name: r[0], color: r[1], n: r[2], value: String(r[2]), aria: r[0] + ': ' + r[2] + (r[2] === 1 ? ' seat' : ' seats') }; }), { R: 2, label: 'District ballot seats' });
      });
      var host = box.querySelector('[data-board]');
      if (!host || !window.EH_BOARD) return;
      if (!host.firstChild) host.innerHTML = '<div class="mf-board-wait" aria-hidden="true"></div>';
      fileData(key).then(function (D) {
        if (!host.isConnected) return;
        if (!D.metros.length) { var sec = host.closest('.mf-res-seats'); if (sec) sec.parentNode.removeChild(sec); return; }
        if (fileBoard && fileBoard.host === host && fileBoard.kind === D.kind) { fileBoard.b.set(D); return; }
        if (fileBoard) fileBoard.b.destroy();
        host.innerHTML = '';
        fileBoard = { key: key, kind: D.kind, host: host, b: EH_BOARD.arc(host, { data: D, start: key, cap: ['Council', 'seats'], info: SEATS_INFO, onPick: function (k) { syncPick(host, k); }, coal: host.classList.contains('can-coal'), onCoal: coalToggle, onClear: coalClear }) };
        if (CO.on && CO.key === key) fileBoard.b.coalition(CO.picks, { intro: CO.intro });
        CO.intro = false;
      }, function () {});
    }
    // v23.35: a district's local council (DistrictMemberList): its leading party and the outcome tag, as in a province's table of councils
    function chip(R) {
      var o = outcome(R), p = o.lead;
      if (!R || o.state === 'none') return '<span class="mf-dist-na">' + (S.state === 'waiting' ? 'Awaiting results' : 'No results') + '</span>';
      var lead = '<span class="res-lead"><i style="background:' + esc(p.col) + '"></i><b>' + esc(p.label) + '</b></span>';
      if (o.state === 'majority') return lead + '<span class="res-oc is-maj">Majority</span>';
      if (o.state === 'hung') return lead + '<span class="res-oc is-hung">Hung council</span>';
      if (o.state === 'declared') return lead + '<span class="res-oc">Count complete</span>';
      return lead + '<span class="res-oc is-count">' + decPct(R) + ' declared</span>';
    }

    // Ward box: the winner (or leader) on the left; on the right (post-elections v21) Share on WhatsApp, with the source line under it,
    // in the place of the ward's turnout and registered voters. share: the button, from the municipality finder (WardShare); it links to
    // the ward. The vote breakdown bar goes (v11.7): the full list is in the panel below. The turnout leaves the source line (v11.6).
    // Contact your ward councillor (v13.21) goes in v21.
    function wardBox(R, nameOf, share) {
      var p = R.parties[0], cand = nameOf ? nameOf(p) : '';
      var left = '<div class="wg-main"><span class="wg-lbl">' + (R.complete ? 'Won in ' + yr(S.year) + ' by' : 'Leading in ' + yr(S.year)) + '</span>' +
        (cand ? '<p class="wg-cand">' + esc(cand) + '</p>' : '') + partyLine(cand && p.ind ? { col: p.col, label: 'Independent candidate', name: '' } : p) + '</div>';
      // v23.13: a name from the IEC's candidate list in our data (nameOf.listed), not from the results feed, says so on the source line
      var listed = !!cand && !!(nameOf.listed && nameOf.listed(p));
      var right = '<div class="wg-break"><div class="wg-acts">' + (share || '') + '</div>' + srcLine(R, null, listed ? 'Candidate name from the IEC\u2019s ' + esc(S.year) + ' candidate list' : '') + '</div>';
      return '<div class="wg-grid">' + left + right + '</div>';
    }
    // Party, share and votes, in the votes-and-seats table's form (ward results, party support). rows: {label, title, sub, col, pct, votes};
    // past the first `top` rows they wait for "Show all".
    function shareTable(rows, cap, top, cls) {
      var mx = Math.max.apply(null, rows.map(function (r) { return r.pct || 0; })) || 1, j = 0;
      // post-elections v23.9: r.grp, a row that opens the rows under it (r.oth), shown while r.open; shut, they stay in the table at no height (is-shut), so the columns never move
      return '<div class="mf-res-tw"><table class="mf-res-table is-3' + (cls ? ' ' + cls : '') + '"><caption class="vh">' + esc(cap) + '</caption>' +
        '<thead><tr><th scope="col" class="p">Party</th><th scope="col" class="sh">Share</th><th scope="col" class="n v">Votes</th></tr></thead><tbody>' +
        rows.map(function (r, i) {
          var more = top && i >= top, c = (more ? ' is-more' : '') + (r.grp ? ' is-grp' + (r.open ? ' is-open' : '') : '') + (r.oth ? ' is-oth' + (r.open ? '' : ' is-shut') : '');
          var who = '<span class="sw" style="background:' + esc(r.col) + '"></span>' +
            '<span class="pn"><strong' + (r.title && r.title !== r.label ? ' title="' + esc(r.title) + '"' : '') + '>' + esc(r.label) + '</strong>' + (r.sub ? '<span class="cd">' + esc(r.sub) + '</span>' : '') + '</span>' +
            (r.grp ? '<span class="vh"> (' + r.n + ' parties)</span><svg class="oth-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.25l4 4 4-4"></path></svg>' : '');
          return '<tr' + (c ? ' class="' + c.slice(1) + '"' : '') + (more ? ' hidden' : '') + '><th scope="row" class="p">' +
            (r.grp ? '<button type="button" class="pc" aria-expanded="' + (r.open ? 'true' : 'false') + '">' + who + '</button>' : '<div class="pc">' + who + '</div>') + '</th>' +
            '<td class="sh"><span class="shb"><i style="width:calc((100% - 56px) * ' + Math.max(0, Math.min(1, (r.pct || 0) / mx)).toFixed(4) + ');--i:' + (r.oth ? j++ : i) + ';background:' + esc(r.col) + '"></i><strong>' + pct(r.pct) + '</strong></span></td>' +
            '<td class="n v">' + int(r.votes) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    function wardList(R, nameOf, wn) {
      var list = R.parties.filter(function (p) { return p.votes > 0; }), top = 4, named = false;   // v11.4: four rows, the rest under Show all
      var rows = list.map(function (p) {
        var nm = nameOf ? nameOf(p) : '';
        if (nm) named = true;
        if (p.ind) return { label: nm ? 'Independent' : p.name, sub: nm, col: p.col, pct: p.pct, votes: p.votes };
        return { label: p.label, title: p.name, sub: nm && nm !== p.label ? nm : '', col: p.col, pct: p.pct, votes: p.votes };
      });
      // with the candidates' names: the party, the candidate under it (an independent's row too), and a shorter share bar (see results.css)
      return '<div class="wp-cands wr-list' + (named ? ' has-names' : '') + '">' +
        shareTable(rows, 'Votes by ' + (named ? 'party and candidate' : 'party') + ', Ward ' + wn, top) +
        (list.length > top ? '<button class="mf-res-more" type="button" data-res-all="' + list.length + '" aria-expanded="false">Show all ' + list.length + ' parties</button>' : '') + '</div>';
    }
    // Ward candidates (IEC 2026 list) to result rows, by party name; an independent only when there is one. The sample count too (v11.1).
    function useNames() { return S.year === '2026' && !S.auto; }
    function nameMatcher(cands, P) {
      function nk(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
      var byParty = {}, inds = [];
      cands.forEach(function (c) {
        var pt = P[c[0]] || [];
        if (IND26.test(pt[0] || '')) inds.push(c[1]);
        else { byParty[nk(pt[0])] = c[1]; if (pt[1]) byParty[nk(pt[1])] = c[1]; }
      });
      return function (p) { return p.ind ? (inds.length === 1 ? inds[0] : '') : byParty[nk(p.raw)] || byParty[nk(p.abbr)] || ''; };
    }

    // v3: the ward winner's name. The feed's ward candidates for this election (the IEC's list, with party IDs), matched to a result row on
    // the party ID; an independent only when one stood, as the feed adds up a ward's independents in one row. None for the sample count.
    var PARTICLE = { van: 1, der: 1, den: 1, de: 1, du: 1, le: 1, la: 1, von: 1 };
    function person(s) {
      var w = String(s || '').replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
      return w.map(function (x, i) {
        if (i && i < w.length - 1 && PARTICLE[x]) return x;
        return x.replace(/(^|[-'\u2019])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
      }).join(' ');
    }
    function wardNames(wardId) {
      var id = String(wardId || '').replace(/\D/g, '');
      if (S.sample || id.length !== 8) return Promise.resolve(null);
      return get('/' + S.src + '/wards/' + id + '/candidates').then(function (list) {
        var by = {}, inds = [], any = false;
        (Array.isArray(list) ? list : []).forEach(function (c) {
          var nm = person([c.Fullname, c.Surname].join(' '));
          if (!nm) return;
          any = true;
          if (+c.PartyID) by[+c.PartyID] = nm; else inds.push(nm);
        });
        return any ? function (p) { return p.ind ? (inds.length === 1 ? inds[0] : '') : by[p.id] || ''; } : null;
      }, function () { return null; });
    }
    // graphics library v3 · a ward's candidates from the feed, for the ward box before its result is in, in place of the province's data file
    // (the feed's list is the IEC's certified list of 16 September, name for name): in the shape the ward box reads, { p: [[party,
    // abbreviation]], m: { key: { ward: [[party, name]] } } }, with the parties' abbreviations from the council's contesting parties
    // ({year}/parties) and a bilingual party name (VRYHEIDSFRONT PLUS | FREEDOM FRONT PLUS) by its English. null: no list.
    function wardList(key, wn, wardId) {
      var id = String(wardId || '').replace(/\D/g, ''), ix = WIX[key] || [], pc = ix[0], code = ehFeedCode(ix[1]);
      if (S.sample || id.length !== 8) return Promise.resolve(null);
      var scope = PROVS[pc] && code ? '?province=' + encodeURIComponent(PROVS[pc]) + '&municipality=' + encodeURIComponent(code) : '';
      return Promise.all([
        get('/' + S.src + '/wards/' + id + '/candidates'),
        scope ? get('/' + S.src + '/parties' + scope).then(null, function () { return null; }) : null
      ]).then(function (r) {
        var list = Array.isArray(r[0]) ? r[0] : [], ab = {}, at = {}, rows = [], P = { p: [], m: {} };
        if (!list.length) return null;
        (Array.isArray(r[1]) ? r[1] : []).forEach(function (q) { if (+q.ID && q.Abbreviation) ab[+q.ID] = String(q.Abbreviation).trim(); });
        list.forEach(function (c) {
          var pid = +c.PartyID || 0;
          if (at[pid] == null) {
            var pt = pid ? party(pid, (ab[pid] ? ab[pid] + ' - ' : '') + String(c.PartyName || '').split('|').pop().trim()) : null;
            at[pid] = P.p.length;
            P.p.push(pt ? [pt.name, pt.abbr && pt.abbr.toUpperCase() !== pt.name.toUpperCase() ? pt.abbr : ''] : ['Independent', '']);
          }
          rows.push([at[pid], person([c.Fullname, c.Surname].join(' '))]);
        });
        (P.m[key] = {})[wn] = rows;
        return P;
      });
    }

    /* ---- hub masthead: share of voting districts counted, over the count's box. post-elections v23.15: three states. Counting, the red box
       with the voting districts in; Count complete, a charcoal box in its place (the results provisional until the Commission declares them);
       Results declared, green, with the day from data-declared. No councils counter after the count (v14 to v23.14: Seats allocated, then
       Councils declared): a council's count completes with its last voting district, and the page shows its seats from then. ---- */
    function paintMast() {
      var n = document.getElementById('eh-dec-n'), box = document.getElementById('eh-dec-box');
      if (!n) return;
      var R = norm(S.nat), fin = S.phase === 'final', lbl = document.getElementById('eh-dec-lbl');
      var done = fin || S.phase === 'provisional' || (!!(R && R.vdCount) && (R.complete || R.vdCaptured >= R.vdCount));
      var bar = box && box.querySelector('.trk i'), sub = box && box.querySelector('.sub'), doneBox = document.getElementById('eh-dec-done');
      if (lbl) lbl.innerHTML = 'Districts <span class="l2">counted</span>';
      n.textContent = done ? '100%' : R && R.vdCount ? decPct(R) : '0%';
      if (box) box.hidden = done;
      if (doneBox) {
        doneBox.hidden = !done;
        if (done) {
          var dd = declaredDay(); if (dd == null && S.src === '2021') dd = dayNo('2021-11-04');   // 2021: declared on 4 November
          var html = '<span class="st"><i aria-hidden="true"></i>' + (fin ? 'Results declared' : 'Count complete') + '</span><span class="sub">' +
            (fin ? (dd != null ? dayTxt(dd) : 'By the Electoral Commission') : 'Provisional until declared') + '</span>';
          if (doneBox.innerHTML !== html) doneBox.innerHTML = html;
          doneBox.classList.toggle('is-done', fin); doneBox.classList.toggle('is-prov', !fin);
        }
      }
      if (done || !box || !R || !R.vdCount) return;
      box.classList.add('is-live'); box.classList.remove('is-done');
      if (bar) bar.style.width = declared(R).toFixed(1) + '%';
      if (sub) sub.innerHTML = '<b>' + int(R.vdCaptured) + '</b> of <b>' + int(R.vdCount) + '</b> voting districts';
    }
    ready().then(paintMast, paintMast);
    on(paintMast);
    // v23: Refresh results on a "could not be loaded" message (errMsg) tries again at once; the open file and the tabs repaint (emit)
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('#dm-eh [data-res-retry]');
      if (!b || b.disabled) return;
      b.disabled = true; b.textContent = 'Refreshing\u2026';
      retry().then(emit, emit);
    });

    // "Show all parties" in any results table.
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('#dm-eh [data-res-all]');
      if (!b) return;
      var open = b.getAttribute('aria-expanded') !== 'true', box = b.parentNode;
      box.querySelectorAll('.is-more').forEach(function (r) { r.hidden = !open; });
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.textContent = open ? 'Show fewer parties' : 'Show all ' + b.getAttribute('data-res-all') + ' parties';
      // v23.1: "Show fewer" with the list's top above the screen brings the reader back up to it.
      if (!open) {
        var y = box.getBoundingClientRect().top;
        if (y < 0) window.scrollTo({ top: y + window.pageYOffset - 24, behavior: 'smooth' });
      }
    });
    // The button dips for 80ms when pressed, then springs back.
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('#dm-eh .mf-res-more');
      if (!b) return;
      b.classList.add('is-dip');
      setTimeout(function () { b.classList.remove('is-dip'); }, 80);
    });

    // v6: a party picked out on the half circle (the pointer over its seats, or a tap on them) marks its row, which lifts off the table.
    // v11.3 · a row open: the table no longer picks parties out on the half circle. A row opens while the pointer is over it (on a touch
    // screen a tap opens it, a second tap or a tap off it closes it; a party's button opens it while it has the keyboard's focus): it pops
    // up, still white, and its bar splits into ward and PR votes with the figures under it. The other rows stay as they are. Post-elections
    // v23: coalition mode leaves the table as it is, so its rows do the same there.
    function mark(row, on) {
      row.classList.toggle('is-sel', on);
      var b = row.querySelector('button.pc'), t = row.closest('table');
      if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (t) t.classList.toggle('has-sel', !!t.querySelector('tr.is-sel'));
    }
    // A party picked out on the half circle itself: its row is marked (not while it is under "Show all").
    function syncPick(host, k) {
      var box = host.closest('.mf-res');
      if (!box) return;
      box.querySelectorAll('tr.is-sel').forEach(function (r) { mark(r, false); });
      var row = k && box.querySelector('tr[data-hk="' + k + '"]');
      if (row && !row.hidden) mark(row, true);
    }
    var hovType = 'mouse';
    document.addEventListener('pointerdown', function (e) { hovType = e.pointerType || 'mouse'; }, true);
    // the row under t, in a file table with a split to show (post-elections v23: in coalition mode too)
    function openRow(t) {
      var row = t && t.closest && t.closest('#dm-eh .mf-res-table.can-open tbody tr');
      return row || null;
    }
    // opens row (on) or closes it; one row is open at a time
    function setOpen(row, on) {
      [].forEach.call(document.querySelectorAll('#dm-eh tr.is-open'), function (r) {
        if (r === row && on) return;
        r.classList.remove('is-open');
        var t = r.closest('table');
        if (t) t.classList.remove('has-open');
      });
      if (!row || !on) return;
      row.classList.add('is-open');
      row.closest('table').classList.add('has-open');
    }
    document.addEventListener('pointerover', function (e) {
      var row = e.pointerType === 'mouse' ? openRow(e.target) : null;
      if (row && !(e.relatedTarget && row.contains(e.relatedTarget))) setOpen(row, true);
    });
    document.addEventListener('pointerout', function (e) {
      var row = e.pointerType === 'mouse' ? openRow(e.target) : null;
      if (row && !(e.relatedTarget && row.contains(e.relatedTarget))) setOpen(row, false);
    });
    function keyed(el) { try { return el.matches(':focus-visible'); } catch (err) { return true; } }
    document.addEventListener('focusin', function (e) {
      var b = e.target.closest && e.target.closest('#dm-eh tr button.pc'), row = b && keyed(b) ? openRow(b) : null;
      if (row) setOpen(row, true);
    });
    document.addEventListener('focusout', function (e) {
      var b = e.target.closest && e.target.closest('#dm-eh tr button.pc'), row = b ? openRow(b) : null;
      if (row && row.classList.contains('is-open')) setOpen(row, false);
    });
    // post-elections v23: in coalition mode too a tap opens a row, as on the results (a row no longer puts its party in or out)
    document.addEventListener('click', function (e) {
      if (hovType === 'mouse' || !e.detail) return;
      var row = openRow(e.target);
      setOpen(row, !!row && !row.classList.contains('is-open'));
    });

    /* ---- v5 · coalition mode in the municipal file ----
       A hung council's "Build a coalition" (provisional and final phases) makes the file's seats a coalition builder where they stand,
       rather than taking the reader down to the one below: the half circle empties (its coalition mode, see "the half circle"), the
       table's share bars give way to rows of pegs, one a seat, as on the builder's board, and share and votes fade. A click on a
       party's row puts it in the coalition or takes it out (as does a click on its pegs on the half circle): its pegs stand up, its seats
       rise on the half circle and its name turns into a black chip. "Back to results", in the button's place in the box's head row, leads
       back (v11: no bar under the half circle; the half circle's own number says how far the coalition is from a majority). Nothing on the page moves: the half circle keeps the room
       for the Majority flag in both modes. The table keeps only the parties with seats, all of them. The coalition is kept while the file is open, and a live update keeps the file in
       coalition mode (fill). v22.8: at the foot of the box, a row of the parties with seats (coalPick, pickShow; v22.10: in coalition mode
       only); a party there puts itself in or out, its name turning black. Post-elections v23: coalition mode leaves the table under the
       box as it is (the results stay, as before the switch); parties go in and out from the row at the foot of the box and the half circle. */
    function coalStop() {
      clearTimeout(CO.t);
      if (CO.dots) CO.dots.stop();
      if (CO.gone) CO.gone.stop();
      if (CO.ro) CO.ro.disconnect();
      CO.dots = CO.gone = CO.ro = CO.list = null;
    }
    // v22.8: the row of parties at the foot of the box and its pegs. v22.10: the row shows in coalition mode only. As the mode opens its
    // parties come in one after another, each peg popping up as its party lands and standing still, just out of its socket (jump, a live
    // update, or reduced motion: there at once). A peg stands up while the pointer is over its party (or the party's button has the
    // keyboard's focus) and hops while the party is in the coalition, a little higher once the coalition has a majority (pickSync).
    function pickDrop() {
      clearTimeout(PK.t);
      (PK.pegs || []).forEach(function (p) { p.stop(); });
      PK.pegs = PK.hov = null;
      if (PK.row) PK.row.classList.remove('is-pop');
    }
    function pickStop() { pickDrop(); PK.row = null; PK.key = ''; }
    function pickPegs(box, key) {
      var row = box && box.querySelector('.mf-coal-row');
      if (row && row === PK.row) return;
      pickStop();
      if (row) { PK.row = row; PK.key = key; }
    }
    function pickShow(jump) {
      var row = PK.row, calm = !!jump || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (!row || !row.isConnected) return;
      if (PK.pegs && calm) { clearTimeout(PK.t); row.classList.remove('is-pop'); pickSync(true); return; }
      pickDrop();
      if (!calm) { void row.offsetWidth; row.classList.add('is-pop'); PK.t = setTimeout(function () { row.classList.remove('is-pop'); }, 1500); }
      if (!window.EH_BOARD || !EH_BOARD.peg) return;
      PK.pegs = [].map.call(row.querySelectorAll('.mf-cp'), function (c, i) {
        return EH_BOARD.peg(c.querySelector('.mf-cp-peg'), c.getAttribute('data-col') || OTHERS, { i: i, w: 17, snap: calm, hop: false, d: 140 + Math.min(i, 16) * 30 });
      });
      pickSync(calm);
    }
    // each peg for the coalition as it stands; md: the ms until the half circle's coalition starts to hop, as it reaches a majority
    function pickSync(jump, md) {
      var row = PK.row, sec = row && row.closest('.mf-res-seats'), M = sec ? +sec.getAttribute('data-maj') || 0 : 0, T = 0;
      if (!row || !PK.pegs) return;
      var cs = [].slice.call(row.querySelectorAll('.mf-cp')), ins = cs.map(function (c) { return CO.on && CO.picks.indexOf(c.getAttribute('data-pk')) >= 0; });
      cs.forEach(function (c, i) { if (ins[i]) T += +c.getAttribute('data-n') || 0; });
      cs.forEach(function (c, i) {
        var p = PK.pegs[i];
        if (p && p.set) p.set({ lift: !ins[i] && c === PK.hov, hop: ins[i], boost: ins[i] && M > 0 && T >= M, wait: md || 0 }, !!jump);
      });
    }
    function pickHov(c) { if (PK.hov === c) return; PK.hov = c; pickSync(false); }
    document.addEventListener('pointerover', function (e) {
      var c = e.pointerType === 'mouse' && e.target.closest ? e.target.closest('#dm-eh .mf-cp') : null;
      if (c && PK.row && PK.row.contains(c)) pickHov(c);
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.pointerType === 'mouse' && e.target.closest ? e.target.closest('#dm-eh .mf-cp') : null;
      if (c && c === PK.hov && !(e.relatedTarget && c.contains(e.relatedTarget))) pickHov(null);
    });
    document.addEventListener('focusin', function (e) {
      var c = e.target.closest && e.target.closest('#dm-eh .mf-cp');
      if (c && PK.row && PK.row.contains(c) && keyed(c)) pickHov(c);
    });
    document.addEventListener('focusout', function (e) {
      var c = e.target.closest && e.target.closest('#dm-eh .mf-cp');
      if (c && c === PK.hov) pickHov(null);
    });
    function coalRows(box) { return box ? [].slice.call(box.querySelectorAll('.mf-res-table tbody tr.is-pick[data-pk]')) : []; }
    function coalArc(box) { return box && fileBoard && fileBoard.b.coalition && fileBoard.host.isConnected && box.contains(fileBoard.host) ? fileBoard.b : null; }
    // the parties at the foot of the box, for the coalition as it stands (post-elections v23: the table's rows stay as they are)
    function coalSync(box) {
      var sec = box && box.querySelector('.mf-res-seats.can-coal'), seats = {};
      if (!sec) return;
      var rows = coalRows(box), chips = [].slice.call(sec.querySelectorAll('.mf-cp[data-pk]')), cr = sec.querySelector('.mf-coal-row');
      rows.forEach(function (r) { seats[r.getAttribute('data-pk')] = +r.getAttribute('data-n') || 0; });
      chips.forEach(function (c) { seats[c.getAttribute('data-pk')] = +c.getAttribute('data-n') || 0; });
      CO.picks = CO.picks.filter(function (k) { return seats[k] > 0; });
      chips.forEach(function (c) {
        var on = CO.on && CO.picks.indexOf(c.getAttribute('data-pk')) >= 0;
        c.classList.toggle('is-in', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (cr) cr.classList.toggle('has-in', CO.on && CO.picks.length > 0);
      var clr = sec.querySelector('[data-coal-clear]');   // v23.23
      if (clr) clr.hidden = !(CO.on && CO.picks.length > 0);
    }
    // post-elections v23.22: on a phone (640px and under) the question keeps the box's top-right corner beside the status tag, on two lines; where two
    // lines at 17px would not hold it, its type steps down half a pixel at a time until they do (12px at the least). Fitted again as the box changes
    // width and as fonts load.
    var askRO, askRaf;
    function askFit(root) {
      var phone = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
      (root || document).querySelectorAll('#dm-eh .mf-cb-ask').forEach(function (a) {
        a.style.removeProperty('--mf-ask-fs');
        if (!phone || !a.clientHeight) return;
        var cs = getComputedStyle(a), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), fs = parseFloat(cs.fontSize);
        while (fs > 12 && (a.clientHeight - pad) / parseFloat(getComputedStyle(a).lineHeight) > 2.5) { fs -= 0.5; a.style.setProperty('--mf-ask-fs', fs + 'px'); }
      });
      if (!root || typeof ResizeObserver !== 'function') return;
      if (!askRO) askRO = new ResizeObserver(function (es) {
        var moved = false;
        es.forEach(function (e) { var w = Math.round(e.contentRect.width); if (e.target._askW !== w) { e.target._askW = w; moved = true; } });
        if (moved) { cancelAnimationFrame(askRaf); askRaf = requestAnimationFrame(function () { askFit(); }); }
      });
      askRO.disconnect();
      root.querySelectorAll('.mf-seat-head.has-cb').forEach(function (h) { askRO.observe(h); });
    }
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () { askFit(); });
    // post-elections v23: in coalition mode the heading that opened it stays as its title, out of reach of the pointer and the keyboard
    function coalAsk(sec, on) {
      var a = sec && sec.querySelector('[data-coal-go]');
      if (!a) return;
      if (on) { a.setAttribute('aria-disabled', 'true'); a.tabIndex = -1; }
      else { a.removeAttribute('aria-disabled'); a.removeAttribute('tabindex'); }
    }
    function coalEnter(box, jump) {
      var sec = box && box.querySelector('.mf-res-seats.can-coal'), b;
      if (!sec) return;
      if (CO.key !== fileKey) { CO.key = fileKey; CO.picks = []; }
      CO.on = true;
      if (!jump && window.EH_ANCHOR) EH_ANCHOR.file(fileKey, { coal: true });   // v24: the address's anchor, #<council>-coalition (not on a repaint, jump)
      box.querySelectorAll('tr.is-sel').forEach(function (r) { mark(r, false); });   // the half circle puts down the party it had picked out
      if (jump) box.classList.add('is-coal-jump');
      box.classList.add('is-coal');
      sec.classList.add('is-coal');
      coalAsk(sec, true);
      coalSync(box);
      CO.intro = !jump;   // v23.2: the half circle's opening (hydrate hands it on if the half circle isn't drawn yet)
      if ((b = coalArc(box))) { b.coalition(CO.picks, { intro: CO.intro }); CO.intro = false; }
      pickShow(jump);
      if (jump) setTimeout(function () { box.classList.remove('is-coal-jump'); }, 80);
    }
    // post-elections v23.5 · a file opened from Hung councils' Build a coalition (fill) goes on from the top of the finder (openFile) to its
    // Hung council banner, 16px under the top of the screen, the seats box in coalition mode under it. For 2,5 s the banner is held there
    // while the file settles, unless the reader scrolls, presses a key or touches the page.
    function coalAnchor(box) {
      var sec = box && box.querySelector('.mf-res-seats.can-coal'), el = sec && (sec.querySelector(':scope > .eh-dl') || sec);
      if (!el) return;
      var t0 = Date.now(), y = -1, off = false, evs = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
      function stop() { off = true; evs.forEach(function (n) { window.removeEventListener(n, stop, true); }); }
      evs.forEach(function (n) { window.addEventListener(n, stop, { capture: true, passive: true }); });
      (function hold() {
        if (off) return;
        if (!el.isConnected || Date.now() - t0 > 2500) { stop(); return; }
        var ny = Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset - 16));
        if (Math.abs(ny - y) > 1) { y = ny; window.scrollTo({ top: ny, behavior: 'smooth' }); }
        requestAnimationFrame(hold);
      })();
    }
    function coalExit(box) {
      var sec = box && box.querySelector('.mf-res-seats'), b;
      CO.on = false; CO.intro = false;
      if (window.EH_ANCHOR && fileKey) EH_ANCHOR.file(fileKey);   // v24: back to the council's anchor
      if (box) box.classList.remove('is-coal');
      if (sec) sec.classList.remove('is-coal');
      coalAsk(sec, false);
      coalSync(box);
      pickDrop();
      if ((b = coalArc(box))) b.coalition(null);
    }
    function coalToggle(k) {
      var box = document.getElementById('mf-res'), b, i;
      if (!CO.on || !k || !box) return;
      i = CO.picks.indexOf(k);
      if (i >= 0) CO.picks.splice(i, 1); else CO.picks.push(k);
      coalSync(box);
      pickSync(false, (b = coalArc(box)) ? b.coalition(CO.picks) : 0);
    }
    function coalClear() {
      var box = document.getElementById('mf-res'), b;
      if (!CO.on || !box) return;
      CO.picks = [];
      coalSync(box);
      if ((b = coalArc(box))) b.coalition(CO.picks);
      pickSync(false);
    }
    document.addEventListener('click', function (e) {
      var t = e.target, b = t.closest && t.closest('#dm-eh [data-coal-go], #dm-eh [data-coal-back], #dm-eh [data-coal-clear]'), box = b && b.closest('.mf-res');
      if (!box) return;
      e.preventDefault();
      // v23: the clear button under the heading; the keyboard's focus goes on to the first party at the foot of the box
      if (b.hasAttribute('data-coal-clear')) {
        var had = document.activeElement === b, f;
        coalClear();
        if (had && (f = box.querySelector('.mf-cp[data-pk]'))) { try { f.focus({ preventScroll: true }); } catch (err) {} }
        return;
      }
      var go = b.hasAttribute('data-coal-go'), next;
      if (go && box.classList.contains('is-coal')) return;
      if (go) coalEnter(box); else coalExit(box);
      next = box.querySelector(go ? '[data-coal-back]' : '[data-coal-go]');
      if (next) { try { next.focus({ preventScroll: true }); } catch (err) {} }
    });
    // v22.8: a party at the foot of the box puts itself in the coalition or takes itself out, as its row does
    document.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('#dm-eh .mf-cp[data-pk]'), box = c && c.closest('.mf-res');
      if (!box || !CO.on || !fileBoard || !fileBoard.host.isConnected || !box.contains(fileBoard.host)) return;
      coalToggle(c.getAttribute('data-pk'));
    });
    // v13 · Hung councils' Build a coalition: opens the council's file (DM_EH_OPEN, see "municipality finder"), which fill puts in coalition mode
    // v23.5: and fill brings its Hung council banner to the top of the screen (coalAnchor)
    window.DM_EH_COAL = function (k) { if (!k || !window.DM_EH_OPEN) return; CO.want = k; window.DM_EH_OPEN(k); };

    window.EH_RES = {
      S: S, ready: ready, retry: retry, errMsg: errMsg, ERR_TXT: ERR_TXT, onPhase: onPhase, province: province, council: council, councilPrev: councilPrev, ward: ward, wardPrev: wardPrev, norm: norm, outcome: outcome, on: on, refresh: refresh,
      IX: IX, IXP: IXP, natPrev: natPrev, provincePrev: provincePrev, hasPrev: hasPrev, PROV_ORDER: PROV_ORDER, PREV: PREV, GATE: GATE, seatsView: seatsView, hungOf: hungOf, drawn: drawn, deadline: deadline, dlStrip: dlStrip, setSample: setSample, setDay: setDay, setDec: setDec, dec: function () { return DEC; }, isDeclared: isDeclared, hasDeadline: function () { return !!String((ROOT && ROOT.getAttribute('data-deadline')) || '').trim(); }, hasPrev: hasPrev, pct: pct, int: int, short: short, declared: declared, decPct: decPct, shortName: shortName,
      bySeats: bySeats, segs: segs, bar: bar, info: info, wait: wait, msg: msg, OTHERS: OTHERS, useNames: useNames, nameMatcher: nameMatcher, wardNames: wardNames, wardList: wardList, boardData: boardData,
      render: { councilBox: councilBox, declBox: declBox, councilBody: councilBody, fill: fill, hydrate: hydrate, chip: chip, wardBox: wardBox, wardList: wardList, shareTable: shareTable, srcLine: srcLine }
    };
  }());
});

/* ==== post-elections v24 · anchors ====
   Every part of the page has a link of its own: the hub's address with an anchor after the # (the list of every anchor, with what each
   opens, is in "Post-elections v24 - Anchors"). Anchors are lower case, the words joined by hyphens:
     #results, #turnout, #hung-councils, #change-since-2021   the tabs under the municipality finder, for South Africa
     #<tab>-<province>                                        a tab for a province: #turnout-gauteng, #hung-councils-kwazulu-natal (the
                                                              province's short code works too: #turnout-gp)
     #<tab>[-<province>]-<part>                               a part of a tab: on Results and Turnout, -councils (a province's table of
                                                              councils); on Hung councils, -list; on Change since 2021, -leading-parties,
                                                              -turnout, -hung-councils, -party-support and -councils (for South Africa
                                                              -provinces, the table of provinces)
     #<council>                                               a council's file, by its name in the finder: #johannesburg, #mossel-bay,
                                                              #cape-winelands-district (the two Emalahlenis with their provinces,
                                                              #emalahleni-mpumalanga; the finder's keys work too, #jhb, and former names)
     #<council>-ward-<n>, #ward-<IEC ward ID>                 a ward in its council's file: #johannesburg-ward-12, #ward-79800012
     #<council>-wards                                         the council's file at its ward dropdown
     #<council>-coalition                                     the council's file in coalition mode, once its count is done and no party
                                                              has a majority; until then the file
     #find-your-municipality, #latest-coverage, #manifesto-breakdowns, #newsletter   the sections of the page
   The page opens on what the anchor names and holds it at the top of the screen while what stands above it loads (hold), until it
   settles or the reader scrolls, presses a key or touches the page. An anchor the page doesn't know is left alone. The links before v24
   still work, and the address is rewritten as their anchor: ?muni=<key>&ward=<n>, ?tab=turnout|hung|cmp, #eh-turnout, #eh-hung, #eh-cmp.
   The address follows the reader: it ends in the anchor of the last thing opened (a council's file, a ward, coalition mode, a tab, an
   area), so a link copied from the address bar opens what the reader sees; Share on WhatsApp sends the same links. An anchor typed into
   the address bar, or a link to one on the page, opens too (hashchange, see "anchors: going there").
   ehAnchors makes and reads the anchors (it needs no page). EH_ANCHOR: start (what the address asked for as the page opened), parse(hash),
   council(key, o) and tab(id, pc, part) (an anchor, without the #), go(a, boot), hold(get, o), and file(key, o), tabs(id) and
   area(pc, quiet), which the municipality finder, the tabs and the area dropdown call as the reader moves. */
function ehAnchors(PROVS, MUNIS, WIX) {
  var TAB = { results: 'all', turnout: 'turnout', 'hung-councils': 'hung', 'change-since-2021': 'cmp' };
  var NAME = { all: 'results', turnout: 'turnout', hung: 'hung-councils', cmp: 'change-since-2021' };
  var TABS = ['change-since-2021', 'hung-councils', 'results', 'turnout'];
  var PARTS = { all: ['councils'], turnout: ['councils'], hung: ['list'], cmp: ['leading-parties', 'turnout', 'hung-councils', 'party-support', 'councils', 'provinces'] };
  var SECS = { 'find-your-municipality': 1, 'latest-coverage': 1, 'manifesto-breakdowns': 1, newsletter: 1 };
  var OLD = { 'eh-res': 'all', 'eh-turnout': 'turnout', 'eh-hung': 'hung', 'eh-cmp': 'cmp' };   // the tab anchors before v24
  function slug(s) {
    s = String(s || '');
    try { s = s.normalize('NFD'); } catch (e) {}
    return s.replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  // the provinces: their words in an anchor by code (PS: gauteng, kwazulu-natal ...), and back from the word or the code (PC)
  var PS = {}, PC = {};
  Object.keys(PROVS).forEach(function (pc) { PS[pc] = slug(PROVS[pc]); PC[PS[pc]] = pc; PC[pc.toLowerCase()] = pc; });
  var PW = Object.keys(PC).sort(function (a, b) { return b.length - a.length; });
  // the councils, made on first use: CS, each council's anchor, from its name in the finder (no City of, Local Municipality or Metro;
  // two councils of one name with their provinces); CK, the council an anchor names (also the finder's keys and former names)
  var CS = null, CK = null;
  function nameSlug(m) { return slug(String(m.n || '').replace(/ Local Municipality$/, '').replace(/^City of /, '').replace(/ Metro$/, '').replace(/ District Municipality$/, ' District')); }
  function councils() {
    if (CS) return;
    CS = {}; CK = {};
    var by = {};
    Object.keys(MUNIS).forEach(function (k) { var s = nameSlug(MUNIS[k]); if (s) (by[s] = by[s] || []).push(k); });
    Object.keys(by).forEach(function (s) {
      by[s].forEach(function (k) { var x = by[s].length > 1 ? s + '-' + (PS[MUNIS[k].p] || slug(k)) : s; CS[k] = x; CK[x] = k; });
    });
    Object.keys(MUNIS).forEach(function (k) { var x = k.toLowerCase(); if (!CK[x]) CK[x] = k; });
    Object.keys(MUNIS).forEach(function (k) { String(MUNIS[k].was || '').split('|').forEach(function (w) { var x = slug(w); if (x && !CK[x]) CK[x] = k; }); });
  }
  function tabOf(tab, rest) {
    var a = { tab: tab, pc: '', part: '' }, i, p;
    if (rest === 'south-africa' || rest.indexOf('south-africa-') === 0) rest = rest.slice(13);
    for (i = 0; i < PW.length && rest; i++) {
      p = PW[i];
      if (rest === p || rest.indexOf(p + '-') === 0) { a.pc = PC[p]; rest = rest.slice(p.length + 1); break; }
    }
    if (rest && PARTS[tab].indexOf(rest) >= 0) a.part = rest === 'provinces' ? 'councils' : rest;
    if (a.part === 'councils' && !a.pc && tab !== 'cmp') a.part = '';   // Results and Turnout have no table for South Africa
    return a;
  }
  function wardOf(id) {   // the IEC's 8-digit ward ID: the council's 5-digit prefix (SA_WARD_INDEX), then the ward's number
    var pre = id.slice(0, 5), n = +id.slice(5), k = Object.keys(WIX).filter(function (x) { return WIX[x] && WIX[x][1] === pre; })[0];
    return k && n ? { key: k, ward: String(n) } : null;
  }
  // what an anchor asks for: { tab, pc, part } (a tab by its id, the province's code or '' for South Africa, the part), { key, ward,
  // wards, coal } (a council), { sec } (a section of the page), or null
  function parse(h) {
    h = String(h || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) {}
    h = h.trim().toLowerCase().replace(/\s+/g, '-').replace(/\/+$/, '');
    if (!h) return null;
    if (OLD[h]) return { tab: OLD[h] };
    if (SECS[h]) return { sec: h };
    for (var i = 0; i < TABS.length; i++) if (h === TABS[i] || h.indexOf(TABS[i] + '-') === 0) return tabOf(TAB[TABS[i]], h.slice(TABS[i].length + 1));
    var w = /^ward-(\d{8})$/.exec(h);
    if (w) return wardOf(w[1]);
    councils();
    var m = /^(.+?)(?:-ward-?(\d{1,3})|-(wards|coalition))?$/.exec(h), k = m && CK[m[1]], a;
    if (!k) return null;
    a = { key: k };
    if (m[2] && +m[2]) a.ward = String(+m[2]);
    else if (m[3] === 'wards') a.wards = true;
    else if (m[3] === 'coalition') a.coal = true;
    return a;
  }
  // the anchors, without the #
  function council(key, o) {
    councils();
    var s = CS[key], wn;
    if (!s) return '';
    o = o || {};
    wn = +String(o.ward || '').replace(/\D/g, '');
    return s + (wn ? '-ward-' + wn : o.coal ? '-coalition' : o.wards ? '-wards' : '');
  }
  function tab(id, pc, part) {
    var n = NAME[id];
    if (!n) return '';
    pc = PS[pc] ? pc : '';
    if (part && PARTS[id].indexOf(part) < 0) part = '';
    if (part === 'councils' && !pc) part = id === 'cmp' ? 'provinces' : '';
    return n + (pc ? '-' + PS[pc] : '') + (part ? '-' + part : '');
  }
  function of(a) { return !a ? '' : a.key ? council(a.key, a) : a.tab ? tab(a.tab, a.pc, a.part) : a.sec || ''; }
  return { parse: parse, council: council, tab: tab, of: of, slug: slug, provinces: PS, councils: function () { councils(); return CS; } };
}
/* ehAnchors end */
guard("anchors", function () {
  var X = ehAnchors(window.SA_PROVINCES || {}, window.SA_MUNIS || {}, window.SA_WARD_INDEX || {}), MUNIS = window.SA_MUNIS || {};
  var LEGACY = ['muni', 'ward', 'tab'], quiet = 0, H = null;
  // the address: the anchor h (without the #; '' for none), the links before v24 taken out of it
  function write(h) {
    try {
      var u = new URL(location.href), was = u.href;
      LEGACY.forEach(function (k) { if (u.searchParams.has(k)) u.searchParams.delete(k); });
      u.hash = h ? '#' + h : '';
      if (u.href !== was) history.replaceState(history.state, '', u.href);
    } catch (e) { /* file:// — no history API */ }
  }
  function here() { return X.parse(location.hash); }
  // what the address asks for as the page opens: its anchor, or the links before v24
  var start = null;
  try {
    start = here();
    if (!start) {
      var q = new URL(location.href).searchParams, k = q.get('muni'), t = String(q.get('tab') || '').toLowerCase();
      if (k && MUNIS[k]) start = { key: k, ward: String(q.get('ward') || '').replace(/\D/g, '') };
      if (t === 'turnout' || t === 'hung' || t === 'cmp') (start = start || {}).tab = t;
    }
  } catch (e) {}

  /* ---- hold: el = get() (while it isn't there, o.fb()) o.off px under the top of the screen (16 by default), put back as what stands
     above it loads: at once, or gliding (o.smooth, the reader already on the page). It lets go once el has stood still for o.calm ms
     (1,2 s), no sooner than o.min ms (2 s), with the mastheads' images and the fonts in and o.ready() true; after o.max ms (20 s) in any
     case; at once when the reader scrolls, presses a key or touches the page, or moves the page another way (put back three times; a
     glide that hasn't arrived 1,2 s after it set off jumps the rest).
     Time with the page out of sight doesn't count. ---- */
  function vis(e) { return e && e.isConnected && e.getClientRects().length ? e : null; }
  function busyIn(sel) { var l = document.querySelectorAll(sel); for (var i = 0; i < l.length; i++) if (l[i].getClientRects().length) return true; return false; }
  function settled() {
    var im = document.querySelectorAll('#dm-eh .eh-dm-top img, #dm-eh .eh-mast img');
    for (var i = 0; i < im.length; i++) if (!im[i].complete) return false;
    return !document.fonts || document.fonts.status !== 'loading';
  }
  function to(y, smooth) { try { window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' }); } catch (e) { window.scrollTo(0, y); } }
  function hold(get, o) {
    o = o || {};
    if (H) H.stop();
    var t0 = Date.now(), last = t0, y = -1, moved = t0, sent = t0, back = 0, off = false, me = { stop: stop }, evs = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    H = me;
    function stop() { if (off) return; off = true; if (H === me) H = null; evs.forEach(function (n) { window.removeEventListener(n, stop, true); }); }
    evs.forEach(function (n) { window.addEventListener(n, stop, { capture: true, passive: true }); });
    (function tick() {
      if (off) return;
      var t = Date.now(), gap = t - last, el = vis(get()), fin = !!el, ny, max;
      last = t;
      if (gap > 250) { t0 += gap; moved += gap; }   // the page was out of sight
      if (t - t0 > (o.max || 20000)) { stop(); return; }
      if (!el && o.fb) el = vis(o.fb());
      if (el) {
        max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        ny = Math.min(max, Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset - (o.off == null ? 16 : o.off))));
        if (Math.abs(ny - y) > 1) { y = ny; moved = sent = t; to(ny, o.smooth); }
        else if (Math.abs(window.pageYOffset - ny) > 1 && (!o.smooth || t - sent > 1200)) { if (++back > 3) { stop(); return; } sent = t; to(ny, false); }   // put back; a glide that hasn't got there in 1,2 s jumps
      }
      if (fin && t - moved > (o.calm || 1200) && t - t0 > (o.min || 2000) && settled() && (!o.ready || o.ready())) { stop(); return; }
      requestAnimationFrame(tick);
    })();
  }
  // what loads above each part: the results (the council's file, the tabs), then the story feeds
  function $(id) { return document.getElementById(id); }
  function loaded() { var R = window.EH_RES; return !R || !R.S || R.S.state !== 'loading'; }
  function fileOk() { return loaded() && !busyIn('#mf-file .mf-res-wait, #mf-file .bf-wait'); }
  function tabsOk() { return loaded() && !busyIn('#eh-tabs-sec .mf-res-wait'); }
  function feedsOk() { var a = $('eh-live-grid'), b = $('eh-feed-grid'); return tabsOk() && (!a || a.childElementCount > 0) && (!b || b.childElementCount > 0); }
  // where each anchor's part stands
  function widget() { return $('mf-widget'); }
  function head() { return document.querySelector('#eh-tabs-sec .eh-tabs-head') || $('eh-tabs-sec'); }
  function wardEl() { return vis($('mf-ward')) ? vis($('mf-ward-share')) || $('mf-ward-row') : null; }   // the ward dropdown (phones: Share on WhatsApp over it)
  function coalEl() { var b = $('mf-res'), s = b && b.querySelector('.mf-res-seats'); return !s ? null : s.classList.contains('can-coal') ? s.querySelector(':scope > .eh-dl') || s : widget(); }   // the Hung council banner, as coalAnchor holds it; the file where there is none
  function partEl(a) {
    if (!a.part) return head();
    var p = $(a.tab === 'hung' ? 'eh-hung' : a.tab === 'cmp' ? 'eh-cmp' : 'eh-res');
    return !p || p.hidden ? null : a.tab === 'hung' ? p.querySelector('.hm-rest') : p.querySelector('[data-anchor="' + a.part + '"]');
  }
  var SEC = { 'find-your-municipality': ['#mf-widget', null, 24], 'latest-coverage': ['#eh-live .eh-sec-head', tabsOk], 'manifesto-breakdowns': ['#eh-feed .eh-sec-head', feedsOk], newsletter: ['#eh-cta .eh-cta-row', feedsOk] };
  // go to anchor a (from parse): the council (the municipality finder's DM_EH_GO) or the tab and the area, the address written as the
  // anchor, then the part held. boot: the page opening on it (the tabs and the finder have opened it in their boots; the area is set here)
  function go(a, boot) {
    if (!a) return;
    quiet++;
    try {
      if (a.key && !boot && window.DM_EH_GO) DM_EH_GO(a.key, a);
      if (a.tab) {
        if (a.pc != null && window.EH_AREA && EH_AREA.set) EH_AREA.set(a.pc, true);
        if (!boot && window.EH_TABS) EH_TABS.show(a.tab);
      }
    } catch (e) { if (window.console) console.error('[elections-hub] anchor:', e); }
    quiet--;
    write(X.of(a));
    var s = a.sec && SEC[a.sec];
    var o = a.key ? (a.ward || a.wards ? { get: wardEl, fb: widget, ready: fileOk } : a.coal ? { get: coalEl, fb: widget, ready: fileOk } : { get: widget, off: 24 })
      : a.tab ? { get: function () { return partEl(a); }, fb: head, ready: tabsOk }
      : s ? { get: function () { return document.querySelector(s[0]); }, ready: s[1], off: s[2] } : null;
    if (!o) return;
    o.smooth = !boot;
    hold(o.get, o);
  }
  window.EH_ANCHOR = {
    start: start, parse: X.parse, council: X.council, tab: X.tab, of: X.of, go: go, hold: hold,
    // the address follows the reader (not while go is at work): a council's file opened (key; o: its ward, coalition mode) or closed (no
    // key: its anchor goes, another stays), the tab shown, the area picked (quiet: the finder moving the area with a council it opens, so
    // a tab's anchor follows and a council's stays)
    file: function (key, o) {
      if (quiet) return;
      if (key) { write(X.council(key, o)); return; }
      var a = here();
      write(a && a.key ? '' : String(location.hash || '').replace(/^#/, ''));
    },
    tabs: function (id) { if (!quiet) write(X.tab(id, window.EH_AREA ? EH_AREA.get() : '')); },
    area: function (pc, q) {
      if (quiet) return;
      var a = here();
      if (q && !(a && a.tab)) return;
      write(X.tab((window.EH_TABS && EH_TABS.current()) || 'all', pc));
    }
  };
});

/* ==== post-elections v2 · results across South Africa ====
   The national block under the municipality finder, in the coalition builder's look: the headline ends in the builder's dropdown
   button (South Africa or a province), then the counting status, then one box hung from a 3px rule, as the builder's box hangs
   from its tabs: on top a map with a dot for every metro and local council at its seat town, coloured by the leading party or by
   turnout, and under it party support, a bar chart of the largest parties' share of the vote.
   Under the box, a table of provinces or councils. Councils and dots open the municipal file above.
   The map has no council boundaries: dots sit at the seat towns in the locator map (SA_LOCATOR).
   v7: the map and party support stand side by side, each hung from a 3px rule, with no box; see "map (v7)" for what the map does.
   v13: the councils are drawn as their boundaries, where v7 had dots; see "the councils by boundary". */
guard("results across South Africa", function () {
  (function () {
    'use strict';
    var R$ = window.EH_RES, sec = document.getElementById('eh-res');
    if (!R$ || !sec) return;
    var PROVS = window.SA_PROVINCES, MUNIS = window.SA_MUNIS, G = window.SA_LOCATOR && window.SA_LOCATOR.geo;
    var $wrap = document.getElementById('res-pick'), $btn = document.getElementById('res-pick-btn'), $name = document.getElementById('res-pick-name'), $menu = document.getElementById('res-pick-menu'), $vh = document.getElementById('res-vh');
    var $state = document.getElementById('res-state'), $stand = document.getElementById('res-stand'), $map = document.getElementById('res-map'), $tbl = document.getElementById('res-tbl');
    var $dslot = document.getElementById('res-dslot'), dslotHtml = null;   // v13.3: the declaration box's place in the head
    var view = { pc: '', mode: 'win' }, started = false, busy = {}, standKey = '', standPc = null, standMode = '', turnKey = null, standOth = false, standOthPc = null;
    var areaSubs = [], cmapSubs = [];   // v15: who follows the area, and the council outlines (EH_AREA)
    var OPTS = [['', 'South Africa']].concat(R$.PROV_ORDER.map(function (pc) { return [pc, PROVS[pc]]; }));
    var TURN_BINS = [[0, 40, '#e0ebf7', 'Under 40%'], [40, 50, '#a6c1dd', '40\u201350%'], [50, 60, '#6d98c3', '50\u201360%'], [60, 70, '#3d6ea4', '60\u201370%'], [70, 101, '#1f4778', '70% or more']];   // v18: in steps of ten, from under 40% to 70% or more
    function turnCol(v) { for (var i = 0; i < TURN_BINS.length; i++) if (v < TURN_BINS[i][1]) return TURN_BINS[i][2]; return TURN_BINS[TURN_BINS.length - 1][2]; }
    function provR(pc) {
      var n = R$.S.nat, e = n && (n.provincial_results || []).filter(function (p) { return p.province_name === PROVS[pc]; })[0];
      return e ? R$.norm(e) : null;
    }
    function councilR(k) { var x = R$.IX[k]; return x ? R$.norm(x.e) : null; }
    function open(k) { if (window.DM_EH_OPEN) window.DM_EH_OPEN(k); }
    function areaName(pc) { return pc ? PROVS[pc] : 'South Africa'; }
    // v13.19 · in a province, the way back to the whole country: a black magnifying glass with a minus (its handle to the left), right of the pill over the map
    var RES_ZOOM = '<button type="button" class="res-zoom" data-back aria-label="Zoom out to South Africa" title="Zoom out to South Africa"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="11.5" cy="8.5" r="5.25"></circle><path d="M7.6 12.4L3.5 16.5M9.2 8.5h4.6"></path></svg></button>';

    /* ---- the area dropdown: the coalition builder's metro button and menu ---- */
    var menuOpen = false;
    // v7: provLine, the area's leading party and its share as text (full: with the share of voting districts declared, while counting)
    function provLine(pc, full) {
      var R = pc ? provR(pc) : R$.norm(R$.S.nat), p = R && R.vdCaptured ? R.parties[0] : null;
      return p ? p.label + ' ' + R$.pct(p.pct) + (full && R$.S.state === 'counting' ? ' \u00b7 ' + R$.decPct(R) + ' declared' : '') : '';
    }
    function optSub(pc) { return esc(provLine(pc)); }
    function buildMenu() {
      $menu.innerHTML = '<p class="res-pm-h" aria-hidden="true">Choose an area</p>' + OPTS.map(function (o, i) {
        var on = o[0] === view.pc;
        return '<button type="button" class="res-opt' + (on ? ' is-on' : '') + '" data-v="' + o[0] + '" aria-current="' + (on ? 'true' : 'false') + '">' +
          '<span class="nm">' + esc(o[1]) + '</span><span class="sub">' + optSub(o[0]) + '</span></button>';
      }).join('');
    }
    function setMenu(on, focus) {
      menuOpen = !!on;
      $menu.hidden = !menuOpen;
      $btn.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
      $btn.classList.toggle('is-open', menuOpen);
      if (menuOpen) {
        buildMenu();
        var list = $menu.querySelectorAll('button'), el = focus === 'last' ? list[list.length - 1] : $menu.querySelector('[aria-current="true"]') || list[0];
        if (focus && el) el.focus();
      }
    }
    // v23.32: quiet, when the municipality finder sets the area (see followArea): the focus stays where it is
    function setView(pc, quiet) {
      setMenu(false);
      if (!quiet) { try { $btn.focus({ preventScroll: true }); } catch (err) { $btn.focus(); } }
      if (pc === view.pc) return;
      view.pc = pc;
      areaSubs.forEach(function (f) { try { f(pc); } catch (err) { if (window.console) console.error('[elections-hub] area change:', err); } });   // v15
      if (window.EH_ANCHOR) EH_ANCHOR.area(pc, quiet);   // v24: the address's anchor follows the area (see "anchors")
      $name.textContent = areaName(pc);
      $btn.setAttribute('aria-label', 'Area: ' + areaName(pc));
      if ($vh) $vh.textContent = ' ' + areaName(pc);
      paint();
      load();
    }
    $btn.addEventListener('click', function (e) { setMenu(!menuOpen, e.detail === 0 ? 'current' : null); });
    $wrap.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'Escape' || k === 'Esc') { if (menuOpen) { e.preventDefault(); setMenu(false); $btn.focus(); } return; }
      if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
      e.preventDefault();
      if (!menuOpen) { if (k === 'ArrowDown' || k === 'ArrowUp') setMenu(true, k === 'ArrowUp' ? 'last' : 'current'); return; }
      var list = Array.prototype.slice.call($menu.querySelectorAll('button')), i = list.indexOf(document.activeElement);
      if (k === 'Home') i = 0; else if (k === 'End') i = list.length - 1;
      else if (i < 0) i = k === 'ArrowDown' ? 0 : list.length - 1;
      else i = (i + (k === 'ArrowDown' ? 1 : list.length - 1)) % list.length;
      list[i].focus();
    });
    $wrap.addEventListener('focusout', function (e) { if (menuOpen && e.relatedTarget && !$wrap.contains(e.relatedTarget)) setMenu(false); });
    $menu.addEventListener('click', function (e) { var b = e.target.closest('.res-opt'); if (b) setView(b.getAttribute('data-v')); });
    document.addEventListener('click', function (e) { if (menuOpen && !$wrap.contains(e.target)) setMenu(false); }, true);
    window.addEventListener('blur', function () { if (menuOpen) setMenu(false); });

    /* ---- status: while the IEC counts, the declaration box for the area in view (South Africa or the province picked), full width:
       red while counting, green at 100%, as in the masthead and the black banner. Its "Counting" stands in for the live pill.
       v13.3: the box stands in the head, left of the area dropdown, the size of the black banner's (#res-dslot); full width here only where
       the markup has no place for it. ---- */
    function paintState() {
      var S = R$.S, st = S.state, nat = R$.norm(S.nat), area = view.pc ? provR(view.pc) : null;
      var live = st === 'counting' || st === 'waiting';
      var RA = area || nat, box = !RA ? '' : st === 'counting' ? R$.render.declBox(RA)
        : st === 'final' ? R$.render.declBox({ vdCount: RA.vdCount, vdCaptured: RA.vdCaptured, complete: true }) : '';
      var pill = box ? '' : st === 'final' ? '<span class="res-pill is-final">Final results</span>'
        : live && !box ? '<span class="res-pill is-live"><i></i>Live / counting</span>'
        : st === 'error' ? '<span class="res-pill">Results unavailable</span>' : '';
      var txt = st === 'error' ? R$.ERR_TXT : '';
      var meters = box && !$dslot ? '<div class="res-decl">' + box + '</div>' : !box && st === 'waiting' ? '<p class="res-waiting">Waiting for counting progress&hellip;</p>' : '';
      if ($dslot && dslotHtml !== box) { dslotHtml = box; $dslot.innerHTML = box; $dslot.hidden = !box; var th = $dslot.closest && $dslot.closest('.eh-tabs-head'); if (th) th.classList.toggle('has-dslot', !!box); }   // v15: with the box, the dropdown's row goes over the tabs
      var refresh = (live && !S.sample && !S.auto) || st === 'error' ? '<button class="res-refresh" type="button">Refresh results</button>' : '';   // v23: on the error too (refresh tries again)
      var note = S.auto ? '<p class="res-preview"><b>Preview only.</b> Counting for 2026 hasn&rsquo;t started, so the page shows the 2021 results.</p>'
        : S.sample ? '<p class="res-preview"><b>Preview only: sample data.</b> ' + (S.at >= 1 ? 'A full count: the 2021 results, standing in for 2026.' : 'A count in progress, made up from the 2021 results.') + ' Wards list the 2026 candidates; a party new to a ward gets made-up votes.</p>' : '';
      // v4: the time of the last update while counting; provisional results say so
      var upd = live && S.updated ? '<span class="res-upd">Updated ' + hhmm(S.updated) + (S.sample ? '' : ' &middot; every 5 minutes') + '</span>' : '';
      // v14: after the count, how far the Commission has got declaring the councils
      var dec = R$.dec(), prov = S.phase === 'provisional' && st === 'final' ? '<p class="res-prov"><b>The count is done.</b> ' + (dec.all ? 'The Electoral Commission has allocated every council\u2019s seats' : 'The Electoral Commission is allocating each council\u2019s seats' + (dec.loaded ? ': <b>' + dec.n + ' of ' + dec.total + '</b> so far' : '')) + '. They are provisional until it declares the results.</p>' : '';   // v23: allocated, then declared
      var top = pill || txt || refresh || upd ? '<div class="res-state-top">' + pill + (txt ? '<p class="res-msg">' + txt + '</p>' : '') + upd + refresh + '</div>' : '';
      $state.innerHTML = top + meters + prov + note;
      fitName();
    }
    // post-elections v23.17: phones, while counting, the area's name on one line in the dropdown, as large as fits it (the height of the declaration box beside it)
    var fitMq = window.matchMedia ? window.matchMedia('(max-width: 640px)') : null, fitRaf = 0;
    function fitName() {
      var th = $dslot && $dslot.closest && $dslot.closest('.eh-tabs-head'), box = $dslot && $dslot.firstElementChild;
      if (!fitMq || !fitMq.matches || !th || !th.classList.contains('has-dslot') || !box) { if ($name.style.fontSize) $name.style.fontSize = ''; return; }
      var face = $name.parentNode, cs = getComputedStyle(face), chev = face.querySelector('.res-pchev');
      var room = face.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - (chev ? chev.getBoundingClientRect().width + (parseFloat(cs.columnGap) || 0) : 0);
      var m = document.createElement('span');
      m.className = 'res-pname'; m.textContent = $name.textContent;
      m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px';
      face.appendChild(m);
      var w = m.getBoundingClientRect().width;
      face.removeChild(m);
      if (!(w > 0) || !(room > 0)) return;
      var cap = (box.getBoundingClientRect().height - 16) / 1.05;
      $name.style.fontSize = Math.max(12, Math.min(cap, 100 * room * 0.97 / w)).toFixed(2) + 'px';
    }
    window.addEventListener('resize', function () { if (!fitRaf) fitRaf = requestAnimationFrame(function () { fitRaf = 0; fitName(); }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
    // post-elections v23.9: a click on Others lists the parties under it, another folds them away
    $stand.addEventListener('click', function (e) {
      var tr = e.target.closest && e.target.closest('tr.is-grp'), tb = tr && tr.closest('table'), b;
      if (!tb || !$stand.contains(tb)) return;
      standOth = !standOth;
      tb.classList.add('is-reveal');
      tr.classList.toggle('is-open', standOth);
      if ((b = tr.querySelector('button.pc'))) b.setAttribute('aria-expanded', standOth ? 'true' : 'false');
      [].forEach.call(tb.querySelectorAll('tbody tr.is-oth'), function (r) { r.classList.toggle('is-shut', !standOth); });
    });
    $state.addEventListener('click', function (e) {
      var b = e.target.closest('.res-refresh');
      if (!b || b.disabled) return;
      b.disabled = true; b.textContent = 'Refreshing\u2026';
      R$.refresh().then(function () { paint(); });
    });

    /* ---- beside the map (v13.15). By leading party: party support alone, a bar for each of the seven largest parties, then Others, scaled
       to the largest share. By turnout: the area's turnout and registered voters over the map's key, which leaves the map for here: a bar
       for each band of turnout in its colour on the map, the councils in it, then the councils with no result yet. The pill over the map
       flicks between the two. ---- */
    function paintStand() {
      var S = R$.S, R = view.pc ? provR(view.pc) : R$.norm(S.nat), area = areaName(view.pc);
      if (!R || !R.parties.length || !R.vdCaptured) {
        var wk = 'wait|' + S.state;   // the map paints this too: the message stands until it changes
        if (standKey === wk) return;
        standKey = wk;
        $stand.innerHTML = S.state === 'loading' ? R$.wait() : S.state === 'error' ? R$.errMsg('res-sub') : '<p class="res-sub">Results appear here as voting districts declare.</p>';   // v23: the error with Refresh results, beside the map (the state row over the map is hidden since v15)
        return;
      }
      if (view.mode === 'turn') { paintTurn(R, area); return; }
      // post-elections v23.9: the five largest parties, then Others (the rest together, two or more), which opens the rest under it; open or shut holds through a live update, until the area changes
      var list = R.parties.filter(function (p) { return p.votes > 0; }), TOP = 5, more = list.length > TOP + 1 ? list.slice(TOP) : [];
      if (standOthPc !== view.pc) { standOth = false; standOthPc = view.pc; }
      var row = function (p) { return { label: p.label, title: p.name, col: p.col, pct: p.pct, votes: p.votes }; };
      var rows = (more.length ? list.slice(0, TOP) : list).map(row);
      if (more.length) {
        rows.push({ label: 'Others', col: R$.OTHERS, grp: true, open: standOth, n: more.length,
          pct: more.reduce(function (a, p) { return a + p.pct; }, 0), votes: more.reduce(function (a, p) { return a + p.votes; }, 0) });
        more.forEach(function (p) { var r = row(p); r.oth = true; r.open = standOth; rows.push(r); });
      }
      var key = view.pc + '|win|' + rows.map(function (r) { return r.label + R$.pct(r.pct) + r.votes; }).join(',');
      if (key === standKey) return;
      standKey = key;
      var grow = standPc !== view.pc || standMode !== 'win';
      standPc = view.pc; standMode = 'win';
      // post-elections v22.12: party support alone, at the top of the column (v21's leading party over it, and its rule, go)
      $stand.innerHTML = R$.render.shareTable(rows, 'Party support, ' + area, 0, 'res-ps' + (grow ? ' is-grow' : ''));
      [].forEach.call($stand.querySelectorAll('.mf-res-table tbody tr'), function (tr, i) { if (rows[i]) tr.setAttribute('data-party', rows[i].label); });   // v7: for the map
      liveCount(rows, grow);
    }
    function paintTurn(R, area) {
      var facts = [['Turnout', R$.pct(R.turnout)], ['Registered voters', R$.short(R.registered)]], k = turnKey;
      var rows = TURN_BINS.map(function (b, i) { return { label: b[3], col: b[2], n: k ? k.bins[i] : null }; }).reverse();   // the highest turnout first
      if (k && k.nr) rows.push({ label: 'No result yet', col: '#ecebe6', n: k.nr, nr: true });
      var key = view.pc + '|turn|' + facts.join('|') + '|' + rows.map(function (r) { return r.n; }).join(',');
      if (key === standKey) return;
      standKey = key;
      var grow = standPc !== view.pc || standMode !== 'turn', mx = Math.max.apply(null, rows.map(function (r) { return r.n || 0; })) || 1;
      standPc = view.pc; standMode = 'turn';
      $stand.innerHTML =   // post-elections v23.10: the turnout and registered voters over the key go
        '<div class="mf-res-tw"><table class="mf-res-table is-3 res-tkey' + (grow ? ' is-grow' : '') + '"><caption class="vh">' + esc('Councils by turnout, ' + area) + '</caption>' +
        '<thead><tr><th scope="col" class="p">Council turnout</th><th scope="col" class="sh">Councils</th></tr></thead><tbody>' +
        rows.map(function (r, i) {
          return '<tr' + (r.nr ? ' class="is-nr"' : '') + '><th scope="row" class="p"><div class="pc"><span class="sw" style="background:' + r.col + '"></span><span class="pn"><strong>' + esc(r.label) + '</strong></span></div></th>' +
            '<td class="sh"><span class="shb"><i style="width:calc((100% - 56px) * ' + ((r.n || 0) / mx).toFixed(4) + ');--i:' + i + ';background:' + r.col + '"></i><strong>' + (r.n == null ? '\u2014' : r.n) + '</strong></span></td></tr>';
        }).join('') + '</tbody></table></div>';
    }

    // v4 · the live count: on an update, each party's votes count up from the figures shown before
    var lastV = {};
    function liveCount(rows, fresh) {
      var cells = $stand.querySelectorAll('.mf-res-table tbody td.n.v'), still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      rows.forEach(function (r, i) {
        var c = cells[i], from = fresh ? null : lastV[r.label];
        if (c && from != null && from !== r.votes && !still) tweenNum(c, from, r.votes);
      });
      lastV = {};
      rows.forEach(function (r) { lastV[r.label] = r.votes; });
    }
    function tweenNum(el, a, b) {
      var t0 = 0;
      el.classList.add('is-ticking');
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
        el.textContent = R$.int(a + (b - a) * e);
        if (k < 1 && el.isConnected) requestAnimationFrame(step); else el.classList.remove('is-ticking');
      }
      requestAnimationFrame(step);
    }
    function hhmm(t) { var d = new Date(t + 72e5); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); }

    /* ---- v13 · the councils by boundary ----
       The map draws every metro and local council as its 2026 boundary, from the MDB's public local municipalities service (the source of
       the ward maps in the municipal file; CORS open, no key), in the colour of the party leading it or in the blues of its turnout, where
       v7 had dots. Over the whole country: the 213 councils, simplified to under a pixel, with the province borders (the MDB's provinces
       service) over them; a click anywhere in a province opens it. In a province: the councils in the province's own view, drawn more
       finely (until they come, the whole country's outlines stand in), the neighbouring provinces' councils faint; a click on a council
       opens its file in the municipality finder, where Results by ward has its wards, and a click on a neighbour opens its province.
       Councils are matched to this file's keys by their MDB codes (EKU, NC091 ...) through the ward ID prefixes in SA_WARD_INDEX, as the
       results are (keyFor in "results"). Under the pointer a council darkens, with a black outline, and its party lights up in the legend
       and the party support table; the party under the pointer in either keeps its councils while the rest fade. Each view is fetched
       once for the visit; if the service doesn't answer, the dots stand.
       v13.1: over the whole country the councils take no picking: under the pointer the province stands up out of the map with all its
       councils on it (on sides that grow as it rises, with its shadow on the provinces around it, as the chosen ward does on Results by
       ward), its tooltip names the province, and a click opens it. Councils are picked in a province.
       v13.18: in a province the council under the pointer rises the same way, and the tooltip says what the map shows: the leading
       parties or the turnout, the province's over the whole country and the council's in a province (see "the tooltip over the map"). */
    var CM_SRC = 'https://services7.arcgis.com/oeoyTUJC8HEeYsRB/arcgis/rest/services/';
    var CM_COUNCILS = CM_SRC + 'MDB_L_ocal_Municipalities_2026/FeatureServer/0/query', CM_PROVS = CM_SRC + 'Provinces/FeatureServer/0/query';
    var CM_DIG = { WC: '1', EC: '2', NC: '3', FS: '4', KZN: '5', NW: '6', GT: '7', GP: '7', MP: '8', LIM: '9', LP: '9' };
    var CM_METRO = { JHB: 'jhb', TSH: 'tsh', EKU: 'eku', CPT: 'cpt', ETH: 'eth', NMA: 'nmb', BUF: 'buf', MAN: 'man' };
    var CM_PRE = {}, CM_PC = {}, cmSet = {}, cmP = {}, cmFail = {};
    (function () {
      var WIX = window.SA_WARD_INDEX || {};
      Object.keys(WIX).forEach(function (k) { var pre = (WIX[k] || []).filter(function (v) { return /^\d{5}$/.test(String(v)); })[0]; if (pre) CM_PRE[String(pre)] = k; });
      Object.keys(PROVS).forEach(function (pc) { CM_PC[PROVS[pc].toLowerCase()] = pc; });
    }());
    function cmKey(code) {
      code = String(code || '').toUpperCase();
      if (CM_METRO[code]) return CM_METRO[code];
      var m = /^([A-Z]{2,3})(\d{2})(\d)$/.exec(code);
      return m && CM_DIG[m[1]] ? CM_PRE[CM_DIG[m[1]] + m[2] + '0' + m[3]] || '' : '';
    }
    // the locator map's projection (see "locator map"), without its rounding: [lon, lat] -> the map's units, and back
    var CM_LON0 = 16.20, CM_LAT0 = -35.15, CM_LAT1 = -21.90, CM_KX = Math.cos(28.4 * Math.PI / 180), CM_W = 240, CM_PAD = 10;
    var CM_SX = (33.10 - CM_LON0) * CM_KX, CM_H = Math.round(CM_W * (CM_LAT1 - CM_LAT0) / CM_SX);
    function cmXY(p) { return [(p[0] - CM_LON0) * CM_KX / CM_SX * CM_W + CM_PAD, (CM_LAT1 - p[1]) / (CM_LAT1 - CM_LAT0) * CM_H + CM_PAD]; }
    function cmLL(x, y) { return [(x - CM_PAD) / CM_W * CM_SX / CM_KX + CM_LON0, CM_LAT1 - (y - CM_PAD) / CM_H * (CM_LAT1 - CM_LAT0)]; }
    function cmShape(rings, tol) {   // graphics library v3: tol, the least distance (map units) from one point drawn to the next, for the feed's finer outlines
      var b = [Infinity, Infinity, -Infinity, -Infinity], t2 = (tol || 0) * (tol || 0);
      var d = rings.map(function (r) {
        var out = [], last = null;
        r.forEach(function (p, i) {
          var q = cmXY(p);
          if (t2 && last && i < r.length - 1 && (q[0] - last[0]) * (q[0] - last[0]) + (q[1] - last[1]) * (q[1] - last[1]) < t2) return;
          last = q; out.push(q);
          if (q[0] < b[0]) b[0] = q[0]; if (q[1] < b[1]) b[1] = q[1]; if (q[0] > b[2]) b[2] = q[0]; if (q[1] > b[3]) b[3] = q[1];
        });
        if (t2 && out.length < 4) return '';   // a speck at this size
        return 'M' + out.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L') + 'Z';
      }).join('');
      if (!d && t2) return cmShape(rings, 0);
      return { d: d, b: b };
    }
    // a box in the map's units, padded and widened to the map's shape (as viewBox does). Post-elections v21: a box wider than the map
    // isn't heightened to it (it was, centred, with a band of white over and under it): a wide province stands at the top of the
    // drawing, and the drawing is that much shorter
    function cmFit(x0, y0, x1, y1) {
      var pad = Math.max(x1 - x0, y1 - y0) * 0.08, vb = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2], ar = G.w / G.h;
      if (vb[2] / vb[3] < ar) { var nw = vb[3] * ar; vb[0] -= (nw - vb[2]) / 2; vb[2] = nw; }
      return vb;
    }
    function cmBox(list, pc) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      list.forEach(function (c) { if (c.pc !== pc) return; x0 = Math.min(x0, c.b[0]); y0 = Math.min(y0, c.b[1]); x1 = Math.max(x1, c.b[2]); y1 = Math.max(y1, c.b[3]); });
      return x1 > x0 ? cmFit(x0, y0, x1, y1) : null;
    }
    function cmGet(url, q) {
      return new Promise(function (resolve, reject) {
        if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 20 s')); }, 20000);
        fetch(url + '?f=json&' + q, { credentials: 'omit', signal: ctl ? ctl.signal : undefined })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (d) { clearTimeout(timer); if (!d || d.error) throw new Error((d && d.error && d.error.message) || 'no answer'); resolve(d); })
          .catch(function (e) { clearTimeout(timer); reject(e); });
      });
    }
    function cmGeom(off) { return '&returnGeometry=true&outSR=4326&geometryPrecision=' + Math.max(2, Math.min(6, Math.ceil(-Math.log(off) / Math.LN10))) + '&maxAllowableOffset=' + off.toFixed(6); }
    function cmCouncils(d) {
      var list = [];
      ((d && d.features) || []).forEach(function (f) {
        var a = f.attributes || {}, rings = f.geometry && f.geometry.rings, code = String(a.CAT_B || '').toUpperCase();
        if (!rings || !rings.length) return;
        var s = cmShape(rings);
        list.push({ code: code, key: cmKey(code), pc: CM_PC[String(a.PROVINCE || '').toLowerCase()] || '', name: String(a.MUNICNAME || code), d: s.d, b: s.b });
      });
      if (!list.length) throw new Error('no council outlines');
      return list;
    }
    // '' the whole country (the councils and the province borders); a province code, the councils in its view
    function cmLoad(id) {
      if (cmSet[id] || cmP[id] || cmFail[id]) return;
      // graphics library v3: from the feed's maps (cmFeed); the Demarcation Board's map services (cmMDB, as before) only if they can't be read
      var p = cmFeed(id).then(null, function (e) {
        if (window.console) console.warn('[elections-hub] council map ' + (id || 'South Africa') + ' from the feed: ' + ((e && e.message) || e) + '; the Demarcation Board\u2019s stands in');
        return cmMDB(id);
      });
      cmP[id] = p;
      p.then(function (set) { cmSet[id] = set; delete cmP[id]; paintMap(); cmapSubs.forEach(function (f) { try { f(); } catch (err) {} }); }, function (e) {
        delete cmP[id]; cmFail[id] = true; cmapSubs.forEach(function (f) { try { f(); } catch (err) {} });
        if (window.console) console.warn('[elections-hub] council map ' + (id || 'South Africa') + ': ' + ((e && e.message) || e));
        paintMap();
      });
    }
    function cmMDB(id) {
      var where = 'where=' + encodeURIComponent('1=1') + '&outFields=CAT_B,PROVINCE,MUNICNAME', p;
      if (!id) {
        p = Promise.all([
          cmGet(CM_COUNCILS, where + cmGeom(0.02)),
          cmGet(CM_PROVS, 'where=' + encodeURIComponent('1=1') + '&outFields=PROVINCE,CODE' + cmGeom(0.02)).catch(function () { return null; })
        ]).then(function (r) {
          var provs = ((r[1] && r[1].features) || []).map(function (f) {
            var a = f.attributes || {}, rings = f.geometry && f.geometry.rings, code = String(a.CODE || '').toUpperCase();
            var pc = CM_PC[String(a.PROVINCE || '').toLowerCase()] || (PROVS[code] ? code : { GT: 'GP', LIM: 'LP', NP: 'LP' }[code] || '');
            return rings && rings.length ? { pc: pc, d: cmShape(rings).d } : null;
          }).filter(Boolean);
          return { vb: [0, 0, G.w, G.h], councils: cmCouncils(r[0]), provs: provs };
        });
      } else {
        var vb0 = cmSet[''] ? cmBox(cmSet[''].councils, id) : null;
        p = (vb0 ? Promise.resolve(vb0) : cmGet(CM_COUNCILS, 'where=' + encodeURIComponent("PROVINCE = '" + PROVS[id] + "'") + '&returnExtentOnly=true&outSR=4326').then(function (d) {
          var e = d.extent || {};
          if (!(e.xmax > e.xmin && e.ymax > e.ymin)) throw new Error('no councils');
          var a = cmXY([e.xmin, e.ymax]), b = cmXY([e.xmax, e.ymin]);
          return cmFit(a[0], a[1], b[0], b[1]);
        })).then(function (vb) {
          var nw = cmLL(vb[0], vb[1]), se = cmLL(vb[0] + vb[2], vb[1] + vb[3]);
          var env = { xmin: nw[0], ymin: se[1], xmax: se[0], ymax: nw[1], spatialReference: { wkid: 4326 } };
          var span = Math.max(vb[2] / CM_W * CM_SX, vb[3] / CM_H * (CM_LAT1 - CM_LAT0));
          return cmGet(CM_COUNCILS, where + '&geometry=' + encodeURIComponent(JSON.stringify(env)) + '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects' + cmGeom(span / 1200))
            .then(function (d) { return { vb: vb, councils: cmCouncils(d), provs: [] }; });
        });
      }
      return p;
    }
    // graphics library v3 · the councils from the feed's maps: a province's file has its metro and local councils; over the whole country the
    // nine files and the provinces' outlines (national.json). A point closer than about half a pixel to the last one drawn is left out.
    function cmSlug(pc) { return String(PROVS[pc] || '').toLowerCase().replace(/\s+/g, '-'); }
    function cmFeed(id) {
      var pcs = id ? [id] : R$.PROV_ORDER.slice(), files = pcs.map(function (pc) { return ehMapJSON('/2026/provinces/' + cmSlug(pc) + '.json'); });
      if (!id) files.push(ehMapJSON('/2026/national.json').then(null, function () { return null; }));
      return Promise.all(files).then(function (r) {
        var feats = [], x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        pcs.forEach(function (pc, i) { r[i].features.forEach(function (f) { feats.push({ f: f, pc: pc, rings: ehRings(f.geometry) }); }); });
        if (id) feats.forEach(function (o) { o.rings.forEach(function (rg) { rg.forEach(function (pt) { var q = cmXY(pt); if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }); }); });
        var tol = (id ? Math.max(x1 - x0, y1 - y0) : G.w) / 940, councils = [];
        feats.forEach(function (o) {
          var a = o.f.properties || {}, code = String(a.MunicCode || '').toUpperCase(), nm = String(a.Municipali || code), k = nm.indexOf(' - ');
          if (!o.rings.length || !code) return;
          if (k > 0 && k <= 8) nm = nm.slice(k + 3).trim();
          var s = cmShape(o.rings, tol);
          councils.push({ code: code, key: cmKey(code), pc: CM_PC[String(a.Province || '').toLowerCase()] || o.pc, name: nm, d: s.d, b: s.b });
        });
        if (!councils.length) throw new Error('no council outlines in the feed');
        if (id) {
          var vb = cmBox(councils, id);
          if (!vb) throw new Error('no councils in the feed');
          return { vb: vb, councils: councils, provs: [] };
        }
        var nat = r[pcs.length], provs = ((nat && nat.features) || []).map(function (f) {
          var rings = ehRings(f.geometry), pc = CM_PC[String((f.properties || {}).Province || '').toLowerCase()] || '';
          return rings.length ? { pc: pc, d: cmShape(rings, tol).d } : null;
        }).filter(Boolean);
        return { vb: [0, 0, G.w, G.h], councils: councils, provs: provs };
      });
    }
    function cmBin(v) { for (var i = 0; i < TURN_BINS.length; i++) if (v < TURN_BINS[i][1]) return i; return TURN_BINS.length - 1; }
    // the map (from paintMap); false when the councils can't be drawn, so the dots stand
    function cmDraw(pc) {
      if (started) { cmLoad(pc || ''); if (pc && cmFail[pc]) cmLoad(''); }
      var set = (pc && cmSet[pc]) || cmSet[''] || null;
      if (!set && cmFail[''] && (!pc || cmFail[pc])) return false;
      var S = R$.S, turn = view.mode === 'turn', area = areaName(pc), fine = !!(pc && cmSet[pc]);
      var vb = !set ? viewBox(pc) : fine || !pc ? set.vb : cmBox(set.councils, pc) || viewBox(pc), ppu = 470 / vb[2];
      var body = '', nb = '', counts = {}, bins = TURN_BINS.map(function () { return 0; }), nC = 0, have = 0;
      if (set) {
        set.councils.forEach(function (c) {
          if (pc && c.pc !== pc) return;   // v13.19: a province alone, without its neighbours
          nC++;
          var R = c.key ? councilR(c.key) : null, o = R ? R$.outcome(R) : { state: 'none' }, m = c.key ? MUNIS[c.key] : null;
          var name = m ? R$.shortName(m).replace(/ Metro$/, '') + (m.t === 'Metropolitan' ? ' Metro' : '') : c.name, fill = '', lead = '';
          if (o.state !== 'none') {
            var p = o.lead;
            have++; lead = p.label;
            (counts[lead] = counts[lead] || { n: 0, col: p.col }).n++;
            if (R.turnout != null) bins[cmBin(R.turnout)]++;
            fill = !turn ? p.col : R.turnout != null ? turnCol(R.turnout) : '';
          }
          // v13.18: the council's name for its tooltip, which reads the rest from the results when the pointer comes (tipBody)
          body += '<path class="rc" d="' + c.d + '" data-c="' + esc(c.code) + '" data-pc="' + c.pc + '"' + (c.key ? ' data-k="' + c.key + '"' : '') + (lead ? ' data-p="' + esc(lead) + '"' : '') +
            (fill ? ' style="fill:' + esc(fill) + ';--fc:' + esc(fill) + '"' : '') + ' data-nm="' + esc(name) + '"></path>';
        });
        if (!pc) body += set.provs.map(function (p) { return '<path class="rp" d="' + p.d + '"' + (p.pc ? ' data-rp="' + p.pc + '"' : '') + '></path>'; }).join('');
      } else {
        var sw = (0.9 / ppu).toFixed(3);
        body = G.order.filter(function (c) { return !pc || c === pc; }).map(function (c) {   // v13.19: a province alone
          var home = !pc || c === pc;
          return '<path d="' + G.path(G.prov[c]) + '" fill="' + (home ? '#f1f0ec' : '#faf9f7') + '" stroke="' + (home ? '#a8a39a' : '#dcd8d0') + '" stroke-width="' + sw + '" stroke-linejoin="round"' + (home ? '' : ' data-prov="' + c + '"') + '></path>';
        }).join('');
      }
      var live = S.state === 'final' || S.state === 'counting', reading = Object.keys(busy).length > 0;
      var nr = set && live && !reading && have < nC ? nC - have : 0;
      turnKey = set ? { bins: bins, nr: nr } : null;   // v13.15: by turnout the key stands beside the map (paintTurn)
      var legend = !set || turn ? '' : Object.keys(counts).sort(function (a, b) { return counts[b].n - counts[a].n || a.localeCompare(b); }).map(function (l) { return '<li data-p="' + esc(l) + '"><i style="background:' + esc(counts[l].col) + '"></i>' + esc(l) + ' <b>' + counts[l].n + '</b></li>'; }).join('');
      if (!turn && nr) legend += '<li class="is-nr"><i></i>No result yet <b>' + nr + '</b></li>';
      var loading = !set ? '<span class="res-loading">Loading the council map&hellip;</span>' : have < nC && live && reading ? '<span class="res-loading">Loading councils&hellip;</span>' : '';
      cmLiftK = ''; cmLiftG = null;
      $map.innerHTML =
        '<div class="res-map-head">' +   // v13.4: no "Councils · area" label; the pill on the left (v13.5: no button back to South Africa; the area dropdown has it)
          '' +   // v15.1: no Leading party / Turnout toggle: the Results and Turnout tabs do that
          (pc ? RES_ZOOM : '') + '</div>' +
        '<div class="res-map-svg is-shapes' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img" aria-label="' + esc(area + ' councils, ' + (turn ? 'coloured by turnout' : 'coloured by leading party')) + '">' +
          nb + body + '</svg>' +   // v13.18: no hover overlay: the council under the pointer rises (cmLift)
          '<div class="res-tip" role="tooltip" hidden></div>' + loading + '</div>';   // v13.16: no legend under the map; v23: no note under it either
      return true;
    }
    // v13.1 · over the whole country, the province under the pointer raised: its shadow, its sides (copies of its outline, 1px or so apart,
    // darker at the foot) and its top (copies of its councils, in their colours, under its outline), which rise together. Every part but the
    // shadow carries the province (data-pc), so the pointer on the raised province keeps it up and a click opens it.
    // v13.18 · in a province, the council under the pointer rises the same way: its sides and shadow follow its own outline and its top is
    // the council in its colour. Every part but the shadow carries the council (data-c, data-k), so the pointer on it keeps it up and a click
    // opens its file. cmLift takes a key ('p:' and a province, 'c:' and a council's code), the outline the sides, shadow and edge follow, the
    // shapes on the top and what the sides and edge carry.
    var cmLiftK = '', cmLiftG = null, CM_NS = 'http://www.w3.org/2000/svg';
    function cmEl(tag, at) { var e = document.createElementNS(CM_NS, tag); for (var k in at) if (Object.prototype.hasOwnProperty.call(at, k)) e.setAttribute(k, at[k]); return e; }
    function cmLiftOff() { if (cmLiftG && cmLiftG.parentNode) cmLiftG.parentNode.removeChild(cmLiftG); cmLiftG = null; cmLiftK = ''; }
    function cmFoot(p) { if (p._ft == null) { try { var b = p.getBBox(); p._ft = b.y + b.height; } catch (e) { p._ft = 0; } } return p._ft; }   // v22.4: the foot of a shape's box, kept on it
    function cmLift(key, d, tops, at, now) {   // v23.38: now, standing up at once (a council pinned on a touch screen, put back after a repaint)
      if (key && key === cmLiftK && cmLiftG && cmLiftG.parentNode) return;
      cmLiftOff();
      var svg = key && tops && tops.length && $map.querySelector('.res-map-svg.is-shapes svg');
      if (!svg) return;
      var vb = svg.viewBox && svg.viewBox.baseVal, w = svg.getBoundingClientRect().width;
      if (!vb || !vb.width || !w) return;
      var u = vb.width / w, L = 7 * u, N = 9;   // u: map units to a pixel
      var defs = svg.querySelector('defs') || svg.insertBefore(cmEl('defs', {}), svg.firstChild), f = svg.querySelector('#res-rl-blur');
      if (!f) { f = cmEl('filter', { id: 'res-rl-blur' }); f.appendChild(cmEl('feGaussianBlur', { stdDeviation: '1' })); defs.appendChild(f); }
      f.firstChild.setAttribute('stdDeviation', (2.4 * u).toFixed(3));
      var g = cmEl('g', { 'class': now ? 'rl is-up' : 'rl', 'data-lift': key }), top = cmEl('g', { 'class': 'rl-top', style: '--k:' + L.toFixed(3) });
      // v22.4 · the sides and the edge in the colours of the shapes on the top, a shade darker (the stylesheet mixes them from each shape's
      // --fc): the sides are copies of each shape lifted in steps (rl-step), the more southerly over the more northerly, so over the whole
      // country the province stands on its councils' sides. v22.4.1: the top keeps its outlines as they are on the flat map
      var sh = [].map.call(tops, function (p) { return { d: p.getAttribute('d') || '', fc: p.style.getPropertyValue('--fc').trim(), y: cmFoot(p) }; })
        .filter(function (x) { return x.d; }).sort(function (a, b) { return a.y - b.y; });
      var part = function (cls, x) { return cmEl('path', Object.assign({ 'class': cls, d: x.d }, x.fc ? { style: '--fc:' + x.fc } : {}, at)); };
      if (d) g.appendChild(cmEl('path', { 'class': 'rl-sh', d: d, filter: 'url(#res-rl-blur)', style: 'transform:translate(' + (1.5 * u).toFixed(3) + 'px,' + (3.5 * u).toFixed(3) + 'px)' }));
      for (var i = 0; i < N; i++) {
        var st = cmEl('g', { 'class': 'rl-step' + (i ? '' : ' rl-foot'), style: '--k:' + (L * i / N).toFixed(3) });
        sh.forEach(function (x) { st.appendChild(part('rl-wall', x)); });
        g.appendChild(st);
      }
      [].forEach.call(tops, function (p) { top.appendChild(p.cloneNode(false)); });
      g.appendChild(top);
      svg.appendChild(g);
      cmLiftG = g; cmLiftK = key;
      if (now) return;
      g.getBoundingClientRect();
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (g.parentNode) g.setAttribute('class', 'rl is-up'); }); });
    }
    // under the pointer: over the whole country, its province raised (v13.1); in a province, the council raised (v13.18), a neighbour not
    // (it lightens through the stylesheet). On the raised shape itself, it stays up. Its tooltip: cmTip.
    function cmHov(c, now) {
      if (!c) { cmLiftOff(); return; }
      if (c.closest && c.closest('g.rl')) return;
      var pc = c.getAttribute('data-pc') || '', svg = $map.querySelector('.res-map-svg.is-shapes svg'), rp, at;
      if (!svg || !pc || (view.pc && (pc !== view.pc || c.classList.contains('is-nb')))) { cmLiftOff(); return; }
      if (!view.pc) {
        rp = svg.querySelector('path.rp[data-rp="' + pc + '"]');
        cmLift('p:' + pc, rp ? rp.getAttribute('d') : '', svg.querySelectorAll('path.rc[data-pc="' + pc + '"]'), { 'data-c': '', 'data-pc': pc });
        return;
      }
      at = { 'data-c': c.getAttribute('data-c') || '', 'data-pc': pc };
      if (c.getAttribute('data-k')) at['data-k'] = c.getAttribute('data-k');
      if (c.getAttribute('data-nm')) at['data-nm'] = c.getAttribute('data-nm');
      cmLift('c:' + at['data-c'], c.getAttribute('d') || '', [c], at, now);
    }
    // the tooltip: over the whole country (and on a neighbour in a province) the province's, in a province the council's (tipBody), worked
    // out when the pointer comes to it and kept while it moves over it (v13.18)
    function cmTip(e, c) {
      var tip = $map.querySelector('.res-tip'), cp = c.getAttribute('data-pc') || '', prov = !view.pc || c.classList.contains('is-nb');
      var key = (prov ? 'p:' + cp : 'c:' + c.getAttribute('data-c')) + '|' + view.mode, k, R;
      if (!tip) return;
      if (prov && !PROVS[cp]) { tipOff(); return; }
      if (tip._k !== key) {
        tip._k = key;
        if (prov) tip._b = tipBody(PROVS[cp], provR(cp), null);
        else { k = c.getAttribute('data-k'); R = k ? councilR(k) : null; tip._b = tipBody(c.getAttribute('data-nm') || '', R, R ? R$.outcome(R) : null); }
      }
      tipHtml(e.clientX, e.clientY, tip._b);
    }

    /* ---- map ---- */
    function viewBox(pc) {
      var vb = [0, 0, G.w, G.h];
      if (!pc || !G.prov[pc]) return vb;
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      G.prov[pc].forEach(function (pt) { var q = G.project(pt); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
      var pad = Math.max(x1 - x0, y1 - y0) * 0.08;
      vb = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2];
      var ar = G.w / G.h;
      if (vb[2] / vb[3] < ar) { var nw = vb[3] * ar; vb[0] -= (nw - vb[2]) / 2; vb[2] = nw; }   // v21: widened, not heightened (as cmFit)
      return vb;
    }
    /* ---- map (v7) ----
       A dot for every metro and local council at its seat town, sized by council seats (SEAT_REF, Johannesburg's 270, gives
       the biggest dot), coloured by the leading party or by turnout (the toggle over the map). A click on a province opens it (over the whole country the dots take no clicks: a council opens from its province); in a
       province, its neighbours open the same way and the button over the map goes back to the whole country. Nothing fades under the
       pointer: not for a party in the legend or in party support beside the map (v13.8), nor for a dot or a council (v13.2). */
    var SEAT_REF = 270;
    function dotPx(n, pc) { var mx = pc ? 26 : 14, mn = pc ? 3.2 : 2.6; return n > 0 ? Math.max(mn, mx * Math.sqrt(Math.min(1, n / SEAT_REF))) : mn; }
    function drawMap() {
      if (!G) { $map.hidden = true; return; }
      var S = R$.S, pc = view.pc, vb = viewBox(pc), ppu = 470 / vb[2], turn = view.mode === 'turn', sw = (0.9 / ppu).toFixed(3);
      if (cmDraw(pc)) return;   // v13: the councils by boundary; the dots below stand if the boundary service doesn't answer
      var keys = Object.keys(G.loc).filter(function (k) { return MUNIS[k] && (!pc || MUNIS[k].p === pc); });
      var items = keys.map(function (k) {
        var R = councilR(k), o = R ? R$.outcome(R) : { state: 'none' };
        return { k: k, R: R, o: o, metro: MUNIS[k].t === 'Metropolitan', r: dotPx(R && R.seatsTotal, pc) / ppu };
      }).sort(function (a, b) { return b.r - a.r; });   // the biggest dots first, so the small ones lie on top
      var shapes = G.order.filter(function (c) { return !pc || c === pc; }).map(function (c) {   // v13.19: a province alone
        var home = pc && c === pc;
        return '<path d="' + G.path(G.prov[c]) + '" fill="' + (home || !pc ? '#f1f0ec' : '#faf9f7') + '" stroke="' + (!pc || home ? '#a8a39a' : '#dcd8d0') + '" stroke-width="' + sw + '" stroke-linejoin="round"' + (home ? '' : ' data-prov="' + c + '"') + '></path>';
      }).join('');
      var counts = {}, have = 0, bins = TURN_BINS.map(function () { return 0; });
      var dots = items.map(function (it) {
        var q = G.project(G.loc[it.k]), m = MUNIS[it.k], name = R$.shortName(m).replace(/ Metro$/, '') + (it.metro ? ' Metro' : ''), fill = '#e6e3dd', lead = '', l2 = '', l3 = '';
        if (it.o.state !== 'none') {
          have++;
          var p = it.o.lead;
          lead = p.label;
          if (!turn) { fill = p.col; counts[lead] = counts[lead] || { n: 0, col: p.col }; counts[lead].n++; }
          else if (it.R.turnout != null) { fill = turnCol(it.R.turnout); bins[cmBin(it.R.turnout)]++; }
          l2 = lead + ' ' + R$.pct(p.pct) + (it.o.state === 'majority' ? ' \u00b7 majority' : it.o.state === 'hung' ? ' \u00b7 no majority' : it.o.state === 'counting' ? ' \u00b7 ' + R$.decPct(it.R) + ' declared' : '');
          l3 = [it.R.seatsTotal ? it.R.seatsTotal + ' seats' : '', it.R.turnout != null ? 'Turnout ' + R$.pct(it.R.turnout) : '', it.R.registered ? R$.short(it.R.registered) + ' registered' : ''].filter(Boolean).join(' \u00b7 ');
        }
        var hit = Math.max(it.r, 8 / ppu);
        return '<g data-k="' + it.k + '"' + (lead ? ' data-p="' + esc(lead) + '"' : '') + ' data-tip="' + esc([name, l2, l3].join('|')) + '">' +
          '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + hit.toFixed(3) + '" fill="transparent"></circle>' +
          '<circle class="dot" cx="' + q[0] + '" cy="' + q[1] + '" r="' + it.r.toFixed(3) + '" fill="' + esc(fill) + '" fill-opacity="0.9" stroke="#181818" stroke-opacity="0.5" stroke-width="' + sw + '"><title>' + esc(name + (l2 ? ': ' + l2 : '')) + '</title></circle></g>';
      }).join('');
      var area = areaName(pc);
      var legend = turn ? '' : Object.keys(counts).sort(function (a, b) { return counts[b].n - counts[a].n; }).map(function (l) { return '<li data-p="' + esc(l) + '"><i style="background:' + esc(counts[l].col) + '"></i>' + esc(l) + ' <b>' + counts[l].n + '</b></li>'; }).join('');
      turnKey = { bins: bins, nr: (S.state === 'final' || S.state === 'counting') && !Object.keys(busy).length && have < items.length ? items.length - have : 0 };
      var loading = have < items.length && (S.state === 'final' || S.state === 'counting') && Object.keys(busy).length ? '<span class="res-loading">Loading councils&hellip;</span>' : '';
      var sizes = '<span class="res-sizes" aria-hidden="true"><i style="--d:' + (2 * dotPx(50, pc)).toFixed(1) + 'px"></i>50<i style="--d:' + (2 * dotPx(200, pc)).toFixed(1) + 'px"></i>200 seats</span>';
      $map.innerHTML =
        '<div class="res-map-head">' +   // v13.4: no "Councils · area" label; the pill on the left (v13.5: no button back to South Africa; the area dropdown has it)
          '' +   // v15.1: no Leading party / Turnout toggle: the Results and Turnout tabs do that
          (pc ? RES_ZOOM : '') + '</div>' +
        '<div class="res-map-svg' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img" aria-label="' + esc(area + ' councils, ' + (turn ? 'coloured by turnout' : 'coloured by leading party') + ', sized by council seats') + '">' + shapes + dots + '</svg>' +
          '<div class="res-tip" role="tooltip" hidden></div>' + loading + '</div>';
    }
    // v13.15: the map, then what stands beside it: party support, or by turnout the map's key
    function paintMap() { drawMap(); paintStand(); cmPinAgain(); }   // v23.38: a council pinned on a touch screen put back
    // v13.18 · the tooltip over the map says what the map shows. By leading party: the three leading parties, each with a swatch in its colour
    // and its share (a council: under them, whether its leader has a majority, with its seats). By turnout: the turnout, with a swatch in its
    // colour on the map, then the registered voters and the ballots cast. While counting, the share of voting districts declared. R: the
    // province's or the council's result; o: the council's outcome (none for a province).
    function tipRow(col, label, val, key) {
      return '<span class="tr' + (key ? ' is-key' : '') + (col ? '' : ' is-ns') + '">' + (col ? '<i style="background:' + esc(col) + '"></i>' : '') +
        '<span class="l">' + esc(label) + '</span><b>' + esc(val) + '</b></span>';
    }
    function tipBody(name, R, o) {
      var rows = '', foot = '', lead;
      if (!R || !R.vdCaptured || !R.parties.length) foot = 'No result yet';
      else if (view.mode === 'turn') {
        rows = tipRow(R.turnout != null ? turnCol(R.turnout) : '', 'Turnout', R$.pct(R.turnout), true) +
          (R.registered ? tipRow('', 'Registered voters', R$.int(R.registered)) : '') + (R.cast ? tipRow('', 'Ballots cast', R$.int(R.cast)) : '');
      } else {
        lead = (o && o.lead) || R.parties[0];
        rows = [lead].concat(R.parties.filter(function (p) { return p !== lead && p.votes > 0; })).slice(0, 3)
          .map(function (p, i) { return tipRow(p.col, p.label, R$.pct(p.pct), !i); }).join('');
        if (o && (o.state === 'majority' || o.state === 'hung') && o.total) foot = (o.state === 'majority' ? 'Majority' : 'No majority') + ' \u00b7 ' + lead.label + ' ' + lead.seats + ' of ' + o.total + ' seats';
      }
      if (R && R.vdCaptured && (o ? o.state === 'counting' : R$.S.state === 'counting')) foot = R$.decPct(R) + ' declared';
      return '<span class="nm">' + esc(name) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
    }
    // the tooltip's markup over its point (client px), or under it where the map has no room above (v13.18)
    function tipHtml(x, y, html) {
      var tip = $map.querySelector('.res-tip'), box = $map.querySelector('.res-map-svg');
      if (!tip || !box) return;
      if (tip._h !== html) { tip._h = html; tip.innerHTML = html; }
      tip.hidden = false;
      var r = box.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, t = y - r.top - h - 32;
      tip.style.left = Math.max(4, Math.min(r.width - w - 4, x - r.left - w / 2)) + 'px';
      tip.style.top = (t < 0 ? y - r.top + 36 : t) + 'px';
    }
    function tipOff() { var tip = $map.querySelector('.res-tip'); if (tip) tip.hidden = true; }
    // post-elections v23.38 · on a touch screen a tap on a council in a province doesn't open its file: the council stands up, as under a
    // mouse, and its tooltip stays up with Go to municipality under its figures (tipGo), which opens the file. A tap on another council
    // moves them there (the same council again, nothing); a tap on the map off the councils, or a touch anywhere off the map, puts them
    // down; a repaint puts them back (cmPinAgain). A mouse is as before: the tooltip under the pointer, and a click opens the file.
    // cmPin: the council's code ('' for a dot, where the boundaries didn't load), its key, the province and the mode the map was in, and
    // the tap in the drawing's units.
    var cmPtr = '', cmPin = null;
    function cmPinOff() {
      var tip = $map.querySelector('.res-tip');
      if (!cmPin) return;
      cmPin = null;
      cmLiftOff();
      if (tip) { tip.classList.remove('is-pin'); tip.hidden = true; tip._k = ''; }
    }
    function cmPinShow(el, x, y, now) {
      var svg = $map.querySelector('.res-map-svg svg'), tip = $map.querySelector('.res-tip'), c = el.getAttribute('data-c') || '', k = el.getAttribute('data-k') || '', R = k ? councilR(k) : null, u = svg && svgPt(svg, x, y, false);
      if (!tip || !u) return;
      cmPin = { c: c, k: k, pc: view.pc, m: view.mode, u: [u.x, u.y] };
      if (c) cmHov(el, now); else cmLiftOff();
      tip._k = '';
      tip.classList.add('is-pin');
      tipHtml(x, y, tipBody(c ? el.getAttribute('data-nm') || '' : String(el.getAttribute('data-tip') || '').split('|')[0], R, R ? R$.outcome(R) : null) + (k ? tipGo(k) : ''));
    }
    function cmPinAgain() {
      var p = cmPin, svg = $map.querySelector('.res-map-svg svg'), el = null, q = null;
      if (!p) return;
      cmPin = null;
      if (svg && p.pc && p.pc === view.pc && p.m === view.mode) el = svg.querySelector(p.c ? 'path.rc[data-c="' + p.c + '"]' : 'g[data-k="' + p.k + '"]');
      if (el) q = svgPt(svg, p.u[0], p.u[1], true);
      if (q) cmPinShow(el, q.x, q.y, true);
    }
    $map.addEventListener('pointerdown', function (e) { cmPtr = e.pointerType || ''; });
    $map.addEventListener('click', function (e) {
      var t = e.target, b = t.closest && t.closest('[data-mode]'), go = t.closest && t.closest('[data-go]'), tap = tapPtr(cmPtr), g, p, c, cp, r;
      if (go) { cmPinOff(); open(go.getAttribute('data-go')); return; }   // v23.38: Go to municipality, in a council's tooltip on a touch screen
      if (t.closest && t.closest('.res-tip')) return;
      if (b) { if (b.getAttribute('aria-pressed') !== 'true') { view.mode = b.getAttribute('data-mode'); paintMap(); } return; }
      if (t.closest && t.closest('[data-back]')) { cmPinOff(); setView(''); return; }
      // v13: in a province, a council opens its file (and its neighbours their province); over the whole country, a council opens its province.
      // v23.38: on a touch screen a council in the province stands up with its tooltip and Go to municipality (cmPinShow)
      c = t.closest && t.closest('path[data-c]');
      if (c) {
        cp = c.getAttribute('data-pc');
        if (view.pc && cp === view.pc) { if (tap) { if (!cmPin || cmPin.c !== c.getAttribute('data-c')) cmPinShow(c, e.clientX, e.clientY); } else if (c.getAttribute('data-k')) open(c.getAttribute('data-k')); }
        else { cmPinOff(); if (PROVS[cp]) setView(cp); }
        return;
      }
      g = t.closest && t.closest('g[data-k]');
      if (g) {
        if (!view.pc) setView(MUNIS[g.getAttribute('data-k')].p);
        else if (!tap) open(g.getAttribute('data-k'));
        else if (!cmPin || cmPin.k !== g.getAttribute('data-k')) { r = (g.querySelector('.dot') || g).getBoundingClientRect(); cmPinShow(g, r.left + r.width / 2, r.top); }
        return;
      }
      cmPinOff();
      p = t.closest && t.closest('path[data-prov]');
      if (p) setView(p.getAttribute('data-prov'));
    });
    // the mouse (v23.38: pointer events, a touch left out: on a touch screen a tap is the click's, above)
    $map.addEventListener('pointerover', function (e) {
      if (tapPtr(e.pointerType)) return;
      var t = e.target, c = t.closest && t.closest('path[data-c]'), g = !c && t.closest && t.closest('g[data-k]'), p = !c && !g && t.closest && t.closest('path[data-prov]'), r, pc, R;
      cmPinOff();
      cmHov(c);
      if (c) { cmTip(e, c); return; }   // v13: a council: its province or (v13.18) itself raised, and its tooltip
      if (g) { r = (g.querySelector('.dot') || g).getBoundingClientRect(); R = councilR(g.getAttribute('data-k')); tipHtml(r.left + r.width / 2, r.top, tipBody(String(g.getAttribute('data-tip') || '').split('|')[0], R, R ? R$.outcome(R) : null)); return; }
      if (p) { pc = p.getAttribute('data-prov'); tipHtml(e.clientX, e.clientY, tipBody(PROVS[pc], provR(pc), null)); return; }
      tipOff();
    });
    $map.addEventListener('pointermove', function (e) {
      if (tapPtr(e.pointerType)) return;
      var c = e.target.closest && e.target.closest('path[data-c]'), p = !c && e.target.closest && e.target.closest('path[data-prov]'), pc;
      if (c) { cmTip(e, c); return; }   // v13: the tooltip follows the pointer over a council
      if (p) { pc = p.getAttribute('data-prov'); tipHtml(e.clientX, e.clientY, tipBody(PROVS[pc], provR(pc), null)); }
    });
    $map.addEventListener('pointerleave', function (e) { if (tapPtr(e.pointerType)) return; tipOff(); cmHov(null); });
    document.addEventListener('pointerdown', function (e) { if (cmPin && !$map.contains(e.target)) cmPinOff(); }, true);   // v23.38: a touch off the map

    /* ---- table: provinces, or the councils of one province ---- */
    function outcomeCell(R, o) {
      if (o.state === 'majority') return '<span class="res-oc is-maj">Majority</span>';
      if (o.state === 'hung') return '<span class="res-oc is-hung">Hung council</span>';
      if (o.state === 'counting') return '<span class="res-oc is-count">' + R$.decPct(R) + ' declared</span>';
      if (o.state === 'declared') return '<span class="res-oc">Count complete</span>';   // v14: the seats not yet published; Majority and No majority once they are
      return '<span class="res-oc is-na">\u2014</span>';
    }
    function leadCell(p) { return p ? '<span class="res-lead"><i style="background:' + esc(p.col) + '"></i><b>' + esc(p.label) + '</b></span>' : '\u2014'; }
    // v23: the leading party's share as a percentage alone, no bar
    function shareCell(p) { return p ? R$.pct(p.pct) : '\u2014'; }
    function paintTable() {
      var S = R$.S;
      $tbl.hidden = !view.pc;
      if (!view.pc) { $tbl.innerHTML = ''; return; }   // v22.13: no provinces table over the whole country; the councils table in a province
      var keys = Object.keys(MUNIS).filter(function (k) { return MUNIS[k].p === view.pc; });
      var nameOf = function (k) { return R$.shortName(MUNIS[k]); };
      var councils = keys.filter(function (k) { return MUNIS[k].dtype !== 'district'; }).sort(function (a, b) {
        var ma = MUNIS[a].t === 'Metropolitan', mb = MUNIS[b].t === 'Metropolitan';
        return ma !== mb ? (ma ? -1 : 1) : nameOf(a).localeCompare(nameOf(b));
      });
      var dists = keys.filter(function (k) { return MUNIS[k].dtype === 'district'; }).sort(function (a, b) { return nameOf(a).localeCompare(nameOf(b)); });
      var crow = councils.map(function (k) {
        var R = councilR(k), o = R ? R$.outcome(R) : { state: 'none' }, p = o.lead, has = o.state !== 'none';
        var lead = has ? leadCell(p) : (busy[view.pc] ? '<span class="res-dash"></span>' : '\u2014'), seats = has && R.seated ? p.seats + '<span class="of">/' + R.seatsTotal + '</span>' : '';
        // post-elections v23.20: phones have the leading party and its share in a line under the name (.res-meta), its seats under the outcome (.res-ms), in place of their columns (hide-s)
        return '<tr data-open="' + k + '" tabindex="0" role="button" aria-label="Open ' + esc(nameOf(k)) + '"><th scope="row"><span class="nm">' + esc(nameOf(k)) + '</span>' + (MUNIS[k].t === 'Metropolitan' ? '<span class="ty">Metro</span>' : '') +
          '<span class="res-meta" aria-hidden="true">' + lead + (has ? '<span class="res-mv">' + shareCell(p) + '</span>' : '') + '</span></th>' +
          '<td class="hide-s">' + lead + '</td>' +
          '<td class="n res-share hide-s">' + (has ? shareCell(p) : '') + '</td>' +
          '<td class="n hide-s">' + seats + '</td>' +
          '<td class="res-out">' + (has ? outcomeCell(R, o) : '') + (seats ? '<span class="res-ms" aria-hidden="true">' + seats + ' seats</span>' : '') + '</td>' +
          '<td class="n hide-s">' + (has ? R$.pct(R.turnout) : '') + '</td><td class="go" aria-hidden="true">&rsaquo;</td></tr>';
      }).join('');
      var drow = dists.map(function (k) {
        var R = councilR(k), o = R ? R$.outcome(R) : { state: 'none' }, p = o.lead, lead = o.state === 'district' ? leadCell(p) : '\u2014';
        return '<tr data-open="' + k + '" tabindex="0" role="button" aria-label="Open ' + esc(nameOf(k)) + '"><th scope="row"><span class="nm">' + esc(nameOf(k)) + '</span><span class="res-meta" aria-hidden="true">' + lead + '</span></th>' +
          '<td class="hide-s">' + lead + '</td>' +
          '<td class="n">' + (o.state === 'district' ? p.seats + '<span class="of">/' + R.seated + '</span>' : '') + '</td>' +
          '<td class="n hide-s">' + (R && R.seatsTotal ? R.seatsTotal : '') + '</td><td class="go" aria-hidden="true">&rsaquo;</td></tr>';
      }).join('');
      $tbl.innerHTML =
        '<h3 class="res-h3" data-anchor="councils">' + esc(PROVS[view.pc]) + '</h3>' +   // v23: headed with the province's name alone (v24: #results-gauteng-councils comes here)
        '<div class="res-tw"><table class="res-table"><thead><tr><th scope="col">Council</th><th scope="col" class="hide-s">Leading party</th><th scope="col" class="n res-share hide-s">Share</th><th scope="col" class="n hide-s">Seats</th><th scope="col" class="res-out">' + (R$.S.phase === 'final' ? 'Outcome' : 'Outcome, provisional') + '</th><th scope="col" class="n hide-s">Turnout</th><th class="go"></th></tr></thead><tbody>' + crow + '</tbody></table></div>' +
        (drow ? '<h3 class="res-h3">District councils</h3><div class="res-tw"><table class="res-table res-table-d"><thead><tr><th scope="col">District</th><th scope="col" class="hide-s">Largest party</th><th scope="col" class="n">District ballot seats</th><th scope="col" class="n hide-s">All seats</th><th class="go"></th></tr></thead><tbody>' + drow + '</tbody></table></div>' : '');
    }
    function tableAct(e) {
      var tr = e.target.closest('tr[data-open], tr[data-prov]');
      if (!tr) return false;
      if (tr.hasAttribute('data-prov')) { setView(tr.getAttribute('data-prov')); window.scrollTo({ top: sec.getBoundingClientRect().top + window.pageYOffset - 12, behavior: 'smooth' }); }
      else open(tr.getAttribute('data-open'));
      return true;
    }
    $tbl.addEventListener('click', function (e) { tableAct(e); });
    $tbl.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && tableAct(e)) e.preventDefault(); });

    /* ---- loading ---- */
    function paint() { paintState(); paintMap(); paintTable(); if (menuOpen) buildMenu(); }   // paintMap paints what stands beside the map too (v13.15)
    function load() {
      R$.ready().then(function () {
        paint();
        if (R$.S.state !== 'final' && R$.S.state !== 'counting') return;
        (view.pc ? [view.pc] : R$.PROV_ORDER).forEach(function (pc) {
          if (busy[pc]) return;
          busy[pc] = 1;
          R$.province(pc).then(function () {}, function () {}).then(function () { delete busy[pc]; paintMap(); if (view.pc === pc) paintTable(); });
        });
        paintMap();
      }, paint);
    }
    function start() { if (started) return; started = true; load(); }
    paint();
    R$.ready().then(paint, paint);
    R$.on(function () { standKey = ''; paint(); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); start(); } }, { rootMargin: '1200px 0px' });
      io.observe(document.getElementById('eh-tabs') || sec);   // v15: the tabs bar, which stands whichever tab is in view
    } else start();
    // v15: the area for the other tabs (Hung councils, Change since 2021), and the council outlines for Change since 2021's maps
    // v15.1: the Turnout tab is this panel with the councils coloured by turnout and the map's key beside it; Results, by leading party
    window.EH_RES_MODE = function (id) { var m = id === 'turnout' ? 'turn' : 'win'; if (view.mode === m) return; view.mode = m; if (started) paintMap(); };
    window.EH_AREA = {
      get: function () { return view.pc; }, name: areaName, provR: provR, on: function (f) { areaSubs.push(f); },
      set: function (pc, quiet) { if (OPTS.some(function (o) { return o[0] === pc; })) setView(pc, quiet); },
      cmap: {
        set: function (pc) { return (pc && cmSet[pc]) || cmSet[''] || null; },
        vb: function (set, pc) { return !pc || cmSet[pc] ? set.vb : cmBox(set.councils, pc) || viewBox(pc); },
        failed: function (pc) { return !!(cmFail[''] && (!pc || cmFail[pc])); },
        load: function (pc) { cmLoad(pc || ''); if (pc && cmFail[pc]) cmLoad(''); },
        on: function (f) { cmapSubs.push(f); }
      }
    };
  }());
});

/* ==== post-elections v4 · hung councils ====
   v14: from the first declared hung council, in any phase, growing as the Commission declares more (a council is declared once its seats
   are published, see "declared councils" in "results"); until every council is declared the banner counts the councils declared so far,
   and a council with a first-sitting day of its own (its own declaration day, or #eh-sittings) shows it in its row.
   v15: the Hung councils tab under the municipality finder, for the area the dropdown over the tabs picks (EH_AREA); the count stands
   on the tab, and with no hung council the panel says why (empty).
   Under the newsletter and questions buttons (v15: in its tab): the days left to the first sittings (see
   "the first sitting" in "results") and every metro and local council where no party won a majority, metros first, then the largest
   councils. A click on a council's row opens its municipal file; Build a coalition opens it in coalition mode, its Hung council banner at the top of the screen (v23.5, see DM_EH_COAL and coalAnchor). The councils are read with
   their provinces as the section nears the screen.
   v13: the banner over the list is the municipal file's Hung council banner (.eh-dl): Hung councils, a rule, the explanation, a rule,
   the days left to the first sittings. The list has no First sitting column; the banner gives the day.
   v13.10: Hung councils is the section's heading over the banner (in the markup); the banner has the explanation, a rule, the days left.
   post-elections v22: the tab opens on the councils map, in the place Results and Turnout have theirs (.res-grid, .res-map), with a few
   figures beside it over the map's key, as the Turnout tab has turnout over its key; the banner and the list stand under them, as before
   (the list keeps to the declared hung councils). On the map a council with no majority stands raised: a little, in charcoal, while its
   seats are provisional (its count done, the seats worked out from it), and all the way, in red, once the Electoral Commission declares
   it; one that goes from the one to the other pops up and turns red where it stands. See "the hung councils map". The panel paints while
   it is in view; the count on the tab follows the results all the time.
   v22.1: over the whole country the map answers by province: the province under the pointer stands up as one, its councils on it at
   the height of a declared hung council (as a province does on Results), with its councils by outcome in its tooltip, and a click opens
   it; its councils answer one by one from there.
   v22.2: the list under the map holds every hung council, provisional or declared, from the first council whose count is done, each
   with a tag after its name in the map's colours: charcoal, Provisional, while its seats are worked out from its count; red, Declared,
   once the Commission declares it. A council keeps its place as it is declared, and its tag pops as it turns red. The count on the tab
   counts them all.
   v22.3: no banner over the list and no note under the map (the key beside the map gives the colours): the list stands under the map.
   v22.8: the list by province, each under its label. */
guard("hung councils", function () {
  var sec = document.getElementById('eh-hung'), $b = document.getElementById('eh-hung-body'), R$ = window.EH_RES, A = window.EH_AREA;
  if (!sec || !$b || !R$) return;
  // v14 · the count on the tab follows the hung councils (v22.2: provisional or declared, as in the list) among the provinces read (Results across South Africa reads all nine as it
  // nears the screen, the results reader reads them all once the count is done, and start below reads them as the tabs near)
  function gate(n) { var b = document.getElementById('eh-tab-hung-n'); if (b) { b.textContent = n ? String(n) : ''; b.hidden = !n; } }   // v15: the count on the tab; the panel stays
  function areaPc() { return A ? A.get() : ''; }   // v15: the area the dropdown picks
  R$.onPhase(function () { paint(); });
  var MUNIS = window.SA_MUNIS, PROVS = window.SA_PROVINCES, done = 0, started = false, ST = {}, TURN = {}, TURN_MS = 900;
  // v22: the area's metros and local councils, each by what its seats say: hung and declared (d), hung with provisional seats (p), a
  // majority (m), or no seats yet (n: its count under way, or its province not read yet); the metros among them, the registered voters in
  // the hung ones, and the hung councils for the list (v22.2: provisional or declared, each with its state; v14 to v22.1, declared only),
  // metros first, then the largest councils
  function scan(pc) {
    var t = { c: { d: 0, p: 0, m: 0, n: 0 }, metros: 0, mIn: 0, mh: 0, mp: 0, regH: 0, reg: 0, st: {}, list: [] };
    Object.keys(MUNIS).forEach(function (k) {
      var m = MUNIS[k];
      if (!m || m.dtype === 'district' || (pc && m.p !== pc)) return;
      var x = R$.IX[k], R = x ? R$.norm(x.e) : null, v = R$.seatsView(R), h = R$.hungOf(v), metro = m.t === 'Metropolitan';
      var s = !h ? 'n' : !h.hung ? 'm' : v.kind === 'final' ? 'd' : 'p';
      t.c[s]++;
      t.st[k] = { s: s, R: h ? v.R : R, h: h, kind: v.kind };
      if (metro) { t.metros++; if (s !== 'n') t.mIn++; if (s === 'd' || s === 'p') t.mh++; if (s === 'p') t.mp++; }
      if (R && R.registered) { t.reg += R.registered; if (s === 'd' || s === 'p') t.regH += R.registered; }
      if (s === 'd' || s === 'p') t.list.push({ k: k, m: m, R: v.R, h: h, metro: metro, s: s });
    });
    t.list.sort(function (a, b) { return b.metro - a.metro || b.R.seatsTotal - a.R.seatsTotal || R$.shortName(a.m).localeCompare(R$.shortName(b.m)); });
    return t;
  }
  // v15: no hung council in the area: why not (the results loading or unavailable, every council with a majority, no council's count done
  // yet, or none hung among those counted so far). v22.2: a council is in once its count is done (provisional seats), not only once declared
  function empty(t, all, busy, pc, where) {
    var st = R$.S.state, m = t.c.m, run = st === 'counting' || st === 'waiting';
    if (st === 'loading' || (busy && !m && st !== 'error' && !run)) return R$.wait();
    if (st === 'error') return R$.errMsg('eh-hung-none');   // v23: with Refresh results; the page tries again by itself
    if (all) return '<p class="eh-hung-none"><b>Every council' + where + ' has a majority.</b> No coalition is needed' + where + '.</p>';
    var load = busy ? '<p class="eh-hung-load">Loading councils&hellip;</p>' : '';
    if (!m) return '<p class="eh-hung-none"><b>Counting is under way.</b> A council where no party has a majority appears here as soon as its count is done, marked provisional until the Electoral Commission declares the results.</p>' + load;
    return '<p class="eh-hung-none"><b>No hung council' + where + ' so far.</b> ' + (m === 1 ? 'The one council counted so far' + where + ' has a majority.' : 'Each of the <b>' + m + '</b> councils counted so far' + where + ' has a majority.') + '</p>' + load;
  }
  // the list of hung councils (v22.2: provisional or declared, each with its tag; a tag that has turned red since the last paint pops,
  // TURN_MS long, carried on through repaints by a negative delay). v22.3: no banner over it. v22.8: by province, in the results' order, each
  // under its label (the province and its count, in the head row of its columns). Under a council's name, Metro or Local council: the label
  // gives the province. v23: every hung council in the area, over the whole country too (until v23 the first three of each province over the
  // whole country and the first ten in a province, the rest under Show all).
  // v23: in the look of the province's councils table on Results: each province headed with its name (its count beside it), the columns'
  // heads under it; the council's name in the table's type, Metro as its tag, and its own first sitting, where it has one, under it
  function listHtml(L, busy) {
    var now = Date.now(), by = {}, pcs;
    L.forEach(function (it) { (by[it.m.p] || (by[it.m.p] = [])).push(it); });
    pcs = R$.PROV_ORDER.filter(function (p) { return by[p]; });
    Object.keys(by).forEach(function (p) { if (pcs.indexOf(p) < 0) pcs.push(p); });
    function row(it) {
      var p = it.h.top, d = R$.deadline(it.k), ownD = d && (d.own || d.dec) ? (d.own ? 'Sitting ' : 'By ') + d.short : '';   // v14: the council's own first-sitting day, where it has one
      var tn = TURN[it.k], age;
      if (it.s === 'd' && ST[it.k] === 'p') tn = TURN[it.k] = now;   // v22.2: declared since the last paint
      age = tn ? now - tn : TURN_MS;
      if (tn && age >= TURN_MS) delete TURN[it.k];
      var tag = '<span class="eh-hung-st is-' + it.s + (age < TURN_MS ? ' is-turn"' + (age > 0 ? ' style="animation-delay:-' + age + 'ms"' : '') : '"') + '>' + (it.s === 'd' ? 'Declared' : 'Provisional') + '</span>';
      return '<li class="eh-hung-row">' +
        '<button type="button" class="eh-hung-nm" data-open="' + it.k + '"><span class="nm">' + esc(R$.shortName(it.m).replace(/ Metro(politan)?( Municipality)?$/, '')) + '</span>' + (it.metro ? '<span class="ty">Metro</span>' : '') + (ownD ? '<span class="dt">' + ownD + '</span>' : '') + '</button>' + tag +
        '<span class="eh-hung-lead"><i style="background:' + esc(p.col) + '"></i><b>' + esc(p.label) + '</b></span>' +
        '<span class="eh-hung-need"><span class="k">Short of a majority: </span><b>' + it.h.short + '</b> ' + (it.h.short === 1 ? 'seat' : 'seats') + '</span>' +
        '<button type="button" class="eh-hung-go" data-cb="' + it.k + '">Build a coalition</button></li>';
    }
    var body = pcs.map(function (p) {
      var G = by[p], nm = esc(PROVS[p] || p);
      return '<div class="eh-hung-pv"><h3 class="res-h3 eh-hung-h3">' + nm + ' <span class="eh-hung-c">' + G.length + '<span class="vh">&nbsp;hung ' + (G.length === 1 ? 'council' : 'councils') + '</span></span></h3>' +
        '<div class="eh-hung-row eh-hung-hd" aria-hidden="true"><span>Council</span><span>Result</span><span>Largest party</span><span>Short of a majority</span><span></span></div>' +
        '<ul class="eh-hung-list" aria-label="Hung councils in ' + nm + '">' + G.map(row).join('') + '</ul></div>';
    }).join('');
    return body + (busy ? '<p class="eh-hung-load">Loading councils&hellip;</p>' : '');
  }
  // v22: the panel's parts, made once: the map and the figures beside it in Results' grid, then the list (or why there is
  // none), which are read out as they change
  var $grid = null, $hmap = null, $stand = null, $rest = null;
  function frame() {
    if ($grid) return;
    $b.removeAttribute('aria-live');
    $b.innerHTML = '<div class="res-grid hm-grid" hidden><div class="res-map hm-map"></div><div class="res-board hm-board"><div class="res-stand hm-stand"></div></div></div><div class="hm-rest" aria-live="polite"></div>';
    $grid = $b.firstChild; $hmap = $grid.firstChild; $stand = $grid.lastChild.firstChild; $rest = $b.lastChild;
    // v23.38: the mouse (pointer events, a touch left out: on a touch screen a tap is the click's, see hmPinShow)
    $hmap.addEventListener('pointerdown', function (e) { HM.ptr = e.pointerType || ''; });
    $hmap.addEventListener('pointermove', function (e) { if (tapPtr(e.pointerType)) return; hmPinOff(); hmMove(e); });
    $hmap.addEventListener('pointerleave', function (e) { if (tapPtr(e.pointerType)) return; hmTipOff(); hmProvOff(); });
  }
  function paint() {
    var pc = areaPc(), t = scan(pc), L = t.list;
    gate(L.length);
    if (sec.hidden) return;   // v22: painted as the tab comes into view (shown, below)
    frame();
    var S = R$.S, dec = R$.dec(), all = !!dec.all || S.phase === 'final', busy = dec.loaded < R$.PROV_ORDER.length;
    var where = pc ? ' in ' + esc(PROVS[pc] || '') : '';   // v15: the area in view
    var on = !!(A && A.cmap) && S.state !== 'loading' && S.state !== 'error';   // v22: the map and its figures once the results are in
    $grid.hidden = !on;
    if (on) { hmMap(pc, t, busy, all); hmStand(pc, t, busy, all); }
    var html = L.length ? listHtml(L, busy) : empty(t, all, busy, pc, where);
    Object.keys(t.st).forEach(function (k) { ST[k] = t.st[k].s; });   // v22.2: what each council was, for the tags that turn
    if (html !== $rest._h) { $rest._h = html; $rest.innerHTML = html; }   // v22.2: only when it changes
  }

  /* ---- v22 · the hung councils map ----
     Results' councils map, from the council outlines it reads (EH_AREA.cmap: the whole country, or a province drawn more finely once it
     comes), the same size in the same place, each council in the colour of what its seats say: no seats yet a pale grey and a majority a
     shade darker, both flat; a hung council stands raised over them, 3px and in charcoal while its seats are provisional, 7px (as a council
     under the pointer rises on Results) and in red once the Commission declares it. Each outline is drawn once, in the drawing's defs; the
     flat map, the sides and the tops are <use>s of it. The sides are copies of the outline lifted in steps, a shade darker than the top, the
     shadows blurred together under them; the raised councils stand from north to south, so the nearer stand over the farther. Heights are
     in pixels on screen whatever the map's size: --u (the map's units to a pixel) on the drawing, kept up to date as it resizes. A council
     whose seats change moves from what it was to what it is (provisional to declared: it pops up the rest of the way and turns red), and a
     new area's map rises from the flat. In a province, under the pointer a council lightens or darkens a shade, with its tooltip: its name,
     hung council or majority (declared or provisional), its largest party's seats and how far that party is short of a majority; a click
     opens its file (DM_EH_OPEN). v22.1: over the whole country a council answers for its province: the province under the pointer stands
     up as one (hmProvUp), with its tooltip (hmProvTip), and a click opens it. ---- */
  var HM_COL = { d: '#ca2828', p: '#3a3835', m: '#e3e0d9', n: '#f4f3ef' }, HM_UP = { d: 2, p: 1 }, HM_WALLS = 9;
  var HM_ZOOM = '<button type="button" class="res-zoom" data-back aria-label="Zoom out to South Africa" title="Zoom out to South Africa"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="11.5" cy="8.5" r="5.25"></circle><path d="M7.6 12.4L3.5 16.5M9.2 8.5h4.6"></path></svg></button>';
  var HM = { fk: '', sk: '', pc: null, prev: {}, list: null, order: null, box: null, vb: null, ro: null, tok: 0, n: 0, t: null, tipI: -1, tipH: '', sts: [], all: false, busy: false, pv: {}, pk: '', pg: null, pin: null, ptr: '' };
  function hmMap(pc, t, busy, all) {
    HM.t = t; HM.tipI = -1;
    var set = A.cmap.set(pc);
    if (!set) {
      var msg = A.cmap.failed(pc) ? 'The council map is not available.' : 'Loading the council map&hellip;';
      if (HM.fk !== msg) { HM.fk = msg; HM.sk = ''; HM.list = null; HM.box = null; $hmap.innerHTML = '<p class="res-sub hm-wait">' + msg + '</p>'; }
      return;
    }
    var fk = (set._hm || (set._hm = ++HM.n)) + '|' + pc;
    if (fk !== HM.fk) hmFrame(set, pc, fk);
    hmFill(t, busy, all);
    hmPinAgain();   // v23.38
  }
  function hmFrame(set, pc, fk) {
    var list = set.councils.filter(function (c) { return !pc || c.pc === pc; }), vb = A.cmap.vb(set, pc);
    if (pc !== HM.pc) { HM.prev = {}; HM.pc = pc; HM.pin = null; }   // a new area's map rises from the flat; the same area drawn more finely stands as it was (v23.38: a council pinned in the last area goes)
    HM.fk = fk; HM.sk = ''; HM.list = list; HM.vb = vb;
    HM.order = list.map(function (c, i) { return i; }).sort(function (a, b) { return list[a].b[3] - list[b].b[3] || a - b; });
    var defs = list.map(function (c, i) { return '<path id="eh-hm-' + i + '" d="' + c.d + '" vector-effect="non-scaling-stroke"></path>'; }).join('');
    var provs = '', pvDefs = '';
    HM.pv = {}; HM.pk = ''; HM.pg = null;
    // v22.1: over the whole country each province's outline in the defs too, for its sides and edge as it stands up (hmProvUp)
    if (!pc) (set.provs || []).forEach(function (p, j) {
      provs += '<path class="rp" d="' + p.d + '"></path>';
      if (p.pc && PROVS[p.pc] && HM.pv[p.pc] == null) { HM.pv[p.pc] = j; pvDefs += '<path id="eh-hm-pv-' + j + '" d="' + p.d + '" vector-effect="non-scaling-stroke"></path>'; }
    });
    $hmap.innerHTML = '<div class="res-map-head">' + (pc ? HM_ZOOM : '') + '</div>' +
      '<div class="res-map-svg hm-svg' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img">' +
        '<defs><filter id="eh-hm-blur"><feGaussianBlur stdDeviation="1"></feGaussianBlur></filter>' + defs + pvDefs + '</defs>' +
        '<g class="hm-base"></g>' + provs + '<g class="hm-shs" filter="url(#eh-hm-blur)"></g><g class="hm-lifts"></g><use class="hm-tap"></use></svg>' +   // v23.38: hm-tap, a council tapped on a touch screen
        '<div class="res-tip" role="tooltip" hidden></div><span class="res-loading" hidden>Loading councils&hellip;</span></div>';
    HM.box = $hmap.querySelector('.hm-svg');
    hmScale();
    if (window.ResizeObserver) { if (!HM.ro) HM.ro = new ResizeObserver(function () { hmScale(); }); HM.ro.disconnect(); HM.ro.observe(HM.box); }
  }
  // --u: the map's units to a pixel on screen, for the heights; the shadows' blur with it
  function hmScale() {
    var box = HM.box, w = box && box.isConnected ? box.getBoundingClientRect().width : 0, f;
    if (!w || !HM.vb) return;
    var u = HM.vb[2] / w;
    box.style.setProperty('--u', u.toFixed(5));
    f = box.querySelector('feGaussianBlur');
    if (f) f.setAttribute('stdDeviation', (2.2 * u).toFixed(3));
  }
  // the councils in their states. A raised council starts where it stood (a new one from the flat, in its own colour) and moves to where
  // it stands now two frames later, so the sides and the top rise or fall, and the colour turns, as the stylesheet eases them
  function hmFill(t, busy, all) {
    var list = HM.list, box = HM.box, svg = box && box.querySelector('svg');
    if (!list || !svg) return;
    var ld = box.querySelector('.res-loading'), c = t.c;
    if (ld) ld.hidden = !busy;
    svg.setAttribute('aria-label', A.name(HM.pc) + ' councils: ' + c.d + ' hung and declared, ' + c.p + ' hung with provisional seats, ' + c.m + ' with a majority' + (c.n ? ', ' + c.n + ' with no result yet' : ''));
    var sts = list.map(function (x) { var y = x.key && t.st[x.key]; return y ? y.s : 'n'; }), sk = sts.join('');
    HM.sts = sts; HM.all = all; HM.busy = busy;   // v22.1: for the province under the pointer
    if (sk === HM.sk) return;
    HM.sk = sk;
    var base = '', shs = '', lifts = '', now = {};
    sts.forEach(function (s, i) { base += '<use href="#eh-hm-' + i + '" class="hm-c is-' + s + '" data-i="' + i + '"></use>'; });
    HM.order.forEach(function (i) {
      var x = list[i], s = sts[i], id = x.code || 'i' + i, was = HM.prev[id], up = HM_UP[s] || 0, wup = (was && HM_UP[was]) || 0, ref = '#eh-hm-' + i, w = '';
      now[id] = s;
      if (!up && !wup) return;
      for (var j = 0; j < HM_WALLS; j++) w += '<use href="' + ref + '" class="hm-w' + (j ? '' : ' hm-ft') + '" style="--f:' + (j / HM_WALLS).toFixed(3) + '"></use>';
      lifts += '<g class="hm-l is-l' + wup + ' is-c' + (was || s) + '" data-to="hm-l is-l' + up + ' is-c' + s + '" data-i="' + i + '">' + w + '<use href="' + ref + '" class="hm-t"></use></g>';
      shs += '<use href="' + ref + '" class="hm-sh is-l' + wup + '" data-to="hm-sh is-l' + up + '"></use>';
    });
    HM.prev = now;
    svg.querySelector('.hm-base').innerHTML = base;
    svg.querySelector('.hm-shs').innerHTML = shs;
    svg.querySelector('.hm-lifts').innerHTML = lifts;
    if (HM.pk) hmProvTop();   // v22.1: the province standing up, its councils as they are now
    var tok = ++HM.tok;
    svg.getBoundingClientRect();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (tok !== HM.tok) return;
        [].forEach.call(svg.querySelectorAll('[data-to]'), function (el) { el.setAttribute('class', el.getAttribute('data-to')); el.removeAttribute('data-to'); });
      });
    });
  }
  // the tooltip: as on Results (the council's name, then rows with a swatch, then a line under a rule)
  function hmRow(col, label, val, key) {
    return '<span class="tr' + (key ? ' is-key' : '') + '"><i style="background:' + esc(col) + '"></i><span class="l">' + esc(label) + '</span><b>' + esc(val) + '</b></span>';
  }
  function hmTipBody(c, x) {
    var m = c.key ? MUNIS[c.key] : null, name = m ? R$.shortName(m).replace(/ Metro(politan)?( Municipality)?$/, '') + (m.t === 'Metropolitan' ? ' Metro' : '') : c.name;
    var s = x ? x.s : 'n', h = x && x.h, R = x && x.R, rows = '', foot = '';
    if (h) {
      rows = hmRow(HM_COL[s], s === 'm' ? 'Majority' : 'Hung council', x.kind === 'final' ? 'Declared' : 'Provisional', true) +
        hmRow(h.top.col, h.top.label, h.top.seats + ' of ' + R.seatsTotal + ' seats');
      if (h.hung) foot = h.short + (h.short === 1 ? ' seat' : ' seats') + ' short of a majority';
    } else foot = R && R.vdCaptured > 0 ? 'Count under way' : 'No result yet';
    return '<span class="nm">' + esc(name) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  // over its point (client px), or under it where the map has no room above (as tipHtml on Results)
  function hmTipAt(x, y, html) {
    var box = HM.box, tip = box && box.querySelector('.res-tip');
    if (!tip) return;
    if (tip._h !== html) { tip._h = html; tip.innerHTML = html; }
    tip.hidden = false;
    var r = box.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, top = y - r.top - h - 32;
    tip.style.left = Math.max(4, Math.min(r.width - w - 4, x - r.left - w / 2)) + 'px';
    tip.style.top = (top < 0 ? y - r.top + 36 : top) + 'px';
  }
  function hmTipOff() { var tip = HM.box && HM.box.querySelector('.res-tip'); if (tip) tip.hidden = true; }
  // post-elections v23.38 · on a touch screen a tap on a council in a province doesn't open its file: the council is outlined at the height it
  // stands (hm-tap, as the council under the pointer on Change since 2021's hung councils maps) and its tooltip stays up with Go to
  // municipality (tipGo), which opens the file. A tap on another council moves them there (the same council again, nothing); a tap on the
  // map off the councils, or a touch anywhere off the map, puts them down; a repaint puts them back (hmPinAgain). HM.pin: the council's
  // place in HM.list, its code and the tap in the drawing's units
  function hmTapMark() {
    var u = HM.box && HM.box.querySelector('.hm-tap'), p = HM.pin, s;
    if (!u) return;
    if (!p) { u.setAttribute('class', 'hm-tap'); return; }
    s = HM.sts[p.i] || 'n';
    u.setAttribute('href', '#eh-hm-' + p.i);
    u.setAttribute('class', 'hm-tap is-on is-l' + (HM_UP[s] || 0));
    u.style.setProperty('--fc', HM_COL[s]);
  }
  function hmPinOff() {
    var tip = HM.box && HM.box.querySelector('.res-tip');
    if (!HM.pin) return;
    HM.pin = null; HM.tipI = -1;
    hmTapMark();
    if (tip) { tip.classList.remove('is-pin'); tip.hidden = true; }
  }
  function hmPinShow(i, x, y) {
    var c = HM.list && HM.list[i], svg = HM.box && HM.box.querySelector('svg'), tip = HM.box && HM.box.querySelector('.res-tip'), u = svg && svgPt(svg, x, y, false);
    if (!c || !tip || !u) return;
    HM.pin = { i: i, id: c.code || c.name || '', u: [u.x, u.y] };
    HM.tipI = -1;
    hmTapMark();
    tip.classList.add('is-pin');
    hmTipAt(x, y, hmTipBody(c, c.key && HM.t ? HM.t.st[c.key] : null) + (c.key ? tipGo(c.key) : ''));
  }
  function hmPinAgain() {
    var p = HM.pin, svg = HM.box && HM.box.querySelector('svg'), i = -1, q = null;
    if (!p) return;
    if (HM.pc && HM.list && svg) HM.list.some(function (c, j) { if ((c.code || c.name || '') === p.id) { i = j; return true; } return false; });
    if (i >= 0) q = svgPt(svg, p.u[0], p.u[1], true);
    if (q) hmPinShow(i, q.x, q.y); else hmPinOff();
  }
  // v22.1: over the whole country, the province under the pointer (a council's, or the raised province's own) stands up, with its tooltip;
  // in a province, the council's tooltip
  function hmMove(e) {
    var el = HM.list && e.target.closest && e.target.closest('.hm-svg [data-pc], .hm-svg [data-i]'), i, c, pc;
    if (!el) { hmProvOff(); hmTipOff(); return; }
    if (!HM.pc) {
      pc = el.getAttribute('data-pc') || (HM.list[+el.getAttribute('data-i')] || {}).pc || '';
      if (!PROVS[pc]) { hmProvOff(); hmTipOff(); return; }
      hmProvUp(pc);
      if (HM.tipI !== 'p:' + pc) { HM.tipI = 'p:' + pc; HM.tipH = hmProvTip(pc); }
    } else {
      i = +el.getAttribute('data-i'); c = HM.list[i];
      if (!c) return;
      if (HM.tipI !== i) { HM.tipI = i; HM.tipH = hmTipBody(c, c.key && HM.t ? HM.t.st[c.key] : null); }
    }
    hmTipAt(e.clientX, e.clientY, HM.tipH);
  }
  // v22.1 · a province's tooltip over the whole country: its councils by outcome, as in the key beside the map (no result yet once it is
  // read); with no council's seats in yet, why
  function hmProvTip(pc) {
    var c = { d: 0, p: 0, m: 0, n: 0 }, read = false, rows = '', foot = '', R;
    HM.list.forEach(function (x, i) { if (x.pc !== pc) return; c[HM.sts[i] || 'n']++; if (x.key && R$.IX[x.key]) read = true; });
    if (c.d + c.p + c.m) {
      rows = hmRow(HM_COL.d, 'Hung, declared', String(c.d), true) + (!HM.all || c.p ? hmRow(HM_COL.p, 'Hung, provisional', String(c.p), true) : '') +
        hmRow(HM_COL.m, 'Majority', String(c.m)) + (c.n && read ? hmRow(HM_COL.n, 'No result yet', String(c.n)) : '');
    } else if (!read && HM.busy) foot = 'Loading councils\u2026';
    else { R = A.provR(pc); foot = R && R.vdCaptured > 0 ? 'Count under way' : 'No result yet'; }
    return '<span class="nm">' + esc(PROVS[pc]) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  // v22.1 · over the whole country, the province under the pointer standing up as one, as on Results: its shadow, its sides (copies of its
  // outline lifted in steps, dark) and its top (its councils in their colours, under its outline), which rise together to the height of a
  // declared hung council, over its own raised councils. Every part but the shadow carries the province (data-pc), so the pointer on the
  // raised province keeps it up and a click opens it. It drops when the pointer leaves it.
  function hmProvOff() { var g = HM.pg; if (g && g.parentNode) g.parentNode.removeChild(g); HM.pg = null; HM.pk = ''; }
  // v22.4: the province stands on its councils' sides, each council's copies in steps (hm-ps) in its colour a shade darker, the more
  // southerly over the more northerly (HM.order); they follow the councils' states, as the top does, whose outlines are as on the flat map
  function hmProvTop() {
    var g = HM.pg, top = g && g.lastChild, pc = HM.pk, h = '', w = '';
    if (!top || !HM.list) return;
    HM.order.forEach(function (i) {
      if (HM.list[i].pc !== pc) return;
      var s = HM.sts[i] || 'n';
      w += '<use href="#eh-hm-' + i + '" class="hm-pw is-' + s + '"></use>';
    });
    [].forEach.call(g.querySelectorAll('.hm-ps'), function (st) { st.innerHTML = w; });
    HM.list.forEach(function (x, i) { if (x.pc === pc) h += '<use href="#eh-hm-' + i + '" class="hm-c is-' + (HM.sts[i] || 'n') + '"></use>'; });
    top.innerHTML = h;
  }
  function hmProvUp(pc) {
    if (pc === HM.pk && HM.pg && HM.pg.parentNode) return;
    hmProvOff();
    var svg = HM.box && HM.box.querySelector('svg'), j = HM.pv[pc], w = '', g;
    if (!svg || !HM.list) return;
    if (j != null) w = '<use href="#eh-hm-pv-' + j + '" class="hm-psh" filter="url(#eh-hm-blur)"></use>';
    for (var k = 0; k < HM_WALLS; k++) w += '<g class="hm-ps' + (k ? '' : ' hm-pft') + '" style="--f:' + (k / HM_WALLS).toFixed(3) + '"></g>';   // v22.4: filled by hmProvTop
    g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hm-pl');
    g.setAttribute('data-pc', pc);
    g.innerHTML = w + '<g class="hm-ptop"></g>';
    svg.appendChild(g);
    HM.pg = g; HM.pk = pc;
    hmProvTop();
    g.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (g.parentNode) g.setAttribute('class', 'hm-pl is-up'); }); });
  }
  function hmPick(c) {
    if (!c) return;
    if (!areaPc()) { if (c.pc && A) A.set(c.pc); }
    else if (c.key && window.DM_EH_OPEN) window.DM_EH_OPEN(c.key);
  }

  /* ---- v22 · beside the map: the hung metros (with how many of them are provisional) and the share of the area's registered voters in
     hung councils, over the map's key (as the Turnout tab's): a bar for each state on the map in its colour, the councils in it. With every
     council declared there is no provisional row; the councils with no result yet once the area is read. ---- */
  var HS = { k: '', pc: null };
  function hmStand(pc, t, busy, all) {
    var c = t.c, any = c.d + c.p + c.m > 0, area = A.name(pc), facts = [];
    if (t.metros) facts.push(['Hung metros', t.mIn ? t.mh + '<small>of ' + t.metros + (t.mp ? ', ' + t.mp + ' provisional' : '') + '</small>' : '\u2014']);
    var AR = pc ? A.provR(pc) : R$.norm(R$.S.nat), den = (AR && AR.registered) || t.reg;
    facts.push(['Voters in hung councils', any && den ? R$.pct(Math.min(100, t.regH / den * 100)) : '\u2014']);
    var rows = [{ s: 'd', l: 'Hung, declared', n: c.d }];
    if (!all || c.p) rows.push({ s: 'p', l: 'Hung, provisional', n: c.p });
    rows.push({ s: 'm', l: 'Majority', n: c.m });
    if (c.n && !busy) rows.push({ s: 'n', l: 'No result yet', n: c.n });
    var key = pc + '|' + facts.join('|') + '|' + rows.map(function (r) { return r.s + r.n; }).join(',');
    if (key === HS.k) return;
    HS.k = key;
    var grow = HS.pc !== pc, mx = Math.max.apply(null, rows.map(function (r) { return r.n; })) || 1;
    HS.pc = pc;
    $stand.innerHTML =   // post-elections v23.10: the figures over the key go
      '<div class="mf-res-tw"><table class="mf-res-table is-3 res-tkey hm-key' + (grow ? ' is-grow' : '') + '"><caption class="vh">' + esc('Councils by outcome, ' + area) + '</caption>' +
      '<thead><tr><th scope="col" class="p">Outcome</th><th scope="col" class="sh">Councils</th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        return '<tr class="is-' + r.s + (r.s === 'n' ? ' is-nr' : '') + '"><th scope="row" class="p"><div class="pc"><span class="sw" style="background:' + HM_COL[r.s] + '"></span><span class="pn"><strong>' + r.l + '</strong></span></div></th>' +
          '<td class="sh"><span class="shb"><i style="width:calc((100% - 56px) * ' + (r.n / mx).toFixed(4) + ');--i:' + i + ';background:' + HM_COL[r.s] + '"></i><strong>' + r.n + '</strong></span></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  $b.addEventListener('click', function (e) {
    var t = e.target, z = t.closest && t.closest('[data-back]'), go = t.closest && t.closest('.hm-svg [data-go]'), c = !z && HM.list && t.closest && t.closest('.hm-svg [data-pc], .hm-svg [data-i]'), i;
    if (go) { hmPinOff(); if (window.DM_EH_OPEN) window.DM_EH_OPEN(go.getAttribute('data-go')); return; }   // v23.38: Go to municipality, in a council's tooltip on a touch screen
    if (t.closest && t.closest('.hm-svg .res-tip')) return;
    if (z) { hmPinOff(); if (A) A.set(''); return; }   // v22: in a province, back to the whole country
    if (c) {   // v22: a council on the map (v22.1: or the province standing up, which opens). v23.38: on a touch screen, in a province, its tooltip with Go to municipality
      i = +c.getAttribute('data-i');
      if (c.hasAttribute('data-pc')) { hmPinOff(); if (A) A.set(c.getAttribute('data-pc')); }
      else if (HM.pc && tapPtr(HM.ptr)) { if (!HM.pin || HM.pin.i !== i) hmPinShow(i, e.clientX, e.clientY); }
      else { hmPinOff(); hmPick(HM.list[i]); }
      return;
    }
    if (t.closest && t.closest('.hm-svg')) hmPinOff();   // v23.38: a tap on the map off the councils
    var o = t.closest('[data-open]');
    if (o) { if (window.DM_EH_OPEN) window.DM_EH_OPEN(o.getAttribute('data-open')); return; }
    var cb = t.closest('[data-cb]');
    if (cb) { if (window.DM_EH_COAL) window.DM_EH_COAL(cb.getAttribute('data-cb')); return; }
  });
  document.addEventListener('pointerdown', function (e) { if (HM.pin && !(HM.box && HM.box.contains(e.target))) hmPinOff(); }, true);   // v23.38: a touch off the map
  function start() {
    if (started) return;
    started = true;
    R$.ready().then(function () {
      R$.PROV_ORDER.forEach(function (pc) { R$.province(pc).then(function () { done++; paint(); }, function () { done++; paint(); }); });
    }, function () { done = R$.PROV_ORDER.length; paint(); });
  }
  paint();
  R$.on(paint);
  if (A) {
    A.on(function () { if (!sec.hidden && A.cmap) A.cmap.load(areaPc()); paint(); });   // v15: the area the dropdown picks
    if (A.cmap) A.cmap.on(paint);   // v22: the council outlines in
  }
  // v14: the councils are read as the tabs near the screen
  var host = document.getElementById('eh-tabs') || sec.parentNode || sec;   // v15: the tabs bar, which stands whichever tab is in view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); start(); } }, { rootMargin: '1200px 0px' });
    io.observe(host);
  } else start();
  // v22: the panel paints as its tab comes into view, with the outlines of the area's councils. The tabs are set up after this block.
  function shown() { if (A && A.cmap) A.cmap.load(areaPc()); start(); paint(); }
  Promise.resolve().then(function () {
    try {
      var T = window.EH_TABS;
      if (!T) { shown(); return; }
      T.on(function (id) { if (id === 'hung') shown(); });
      if (T.current() === 'hung') shown();
    } catch (err) { if (window.console) console.error('[elections-hub] hung councils failed:', err); }
  });
});

/* ==== post-elections v15 · the tabs under the municipality finder ====
   v17: Results, Turnout, Change since 2021 and Hung councils, in that order (the markup's), the full width of the column.
   v18: a switch glides (see "glide" below); the tab in view is black (the stylesheet's v18 rules).
   v18: Hung councils comes before Change since 2021 (the markup's order).
   All results (Results across South Africa), Hung councils and Change since 2021 share one place under the municipality finder, with
   the area dropdown over them: it picks South Africa or a province for all three. One panel shows at a time; the tabs take the arrow
   keys, Home and End. v24: an anchor opens a tab, for South Africa or a province (#turnout, #hung-councils-gauteng; see "anchors"), and
   the address's anchor follows the tab in view (until v24 ?tab=turnout, ?tab=hung or ?tab=cmp, and #eh-turnout, #eh-hung, #eh-cmp, which
   still work). EH_TABS: show(id), on(fn) (fn gets the id of the tab shown), current(). */
guard("results tabs", function () {
  var bar = document.getElementById('eh-tabs');
  if (!bar) return;
  var tabs = [].slice.call(bar.querySelectorAll('[role="tab"]')), cur = '', subs = [];
  function idOf(t) { return t.getAttribute('data-tab'); }
  function tabFor(id) { return tabs.filter(function (t) { return idOf(t) === id; })[0] || null; }
  function panel(t) { return document.getElementById(t.getAttribute('aria-controls') || ''); }
  // v18 · glide: on a switch the section (#eh-tabs-sec) eases from the height it stood at to the new tab's, and for a moment after the
  // switch also as the tab fills in (Change since 2021 reads its figures when it first opens), clipped while it moves; the panel shown
  // fades in (Results and Turnout share theirs, so it only softens). Nothing with reduced motion or without the Web Animations API.
  var glide = (function () {
    var sec = document.getElementById('eh-tabs-sec'), box = sec && sec.querySelector('.eh-wrap'), mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var anim = null, goal = -1, last = -1, until = 0, EASE = 'cubic-bezier(.4,0,.2,1)';
    function on() { return !!(sec && box && sec.animate && !(mq && mq.matches)); }
    function natural() { var cs = getComputedStyle(sec); return box.getBoundingClientRect().height + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth); }
    function stood() { return sec.getBoundingClientRect().height; }
    function run(a, b) {
      if (anim) { anim.onfinish = null; anim.cancel(); anim = null; }
      goal = b;
      if (Math.abs(b - a) < 1) { sec.classList.remove('is-gliding'); return; }
      sec.classList.add('is-gliding');
      var x = anim = sec.animate([{ height: a + 'px' }, { height: b + 'px' }], { duration: Math.round(Math.min(440, 240 + Math.abs(b - a) * 0.12)), easing: EASE });
      x.onfinish = function () { if (anim === x) { anim = null; sec.classList.remove('is-gliding'); } };
    }
    if (on() && window.ResizeObserver) new ResizeObserver(function () {   // the tab filling in: from where the section stands to its new height
      var b = natural(), a = anim ? stood() : last;
      last = b;
      if (!anim && performance.now() > until) return;
      if (anim && Math.abs(goal - b) < 1) return;
      if (a >= 0) run(a, b);
    }).observe(box);
    return {
      from: function () { return on() ? stood() : -1; },
      to: function (a, p, same) {
        if (!on() || a < 0) return;
        until = performance.now() + 1600;
        last = natural();
        run(a, last);
        if (p && p.animate) p.animate([{ opacity: same ? 0.35 : 0 }, { opacity: 1 }], { duration: same ? 200 : 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    };
  })();
  function show(id, focus) {
    var t = tabFor(id) || tabs[0];
    if (!t) return;
    id = idOf(t);
    var was = cur && id !== cur ? glide.from() : -1, before = cur ? panel(tabFor(cur)) : null;   // v18: where the section stands, and the panel in view, before the switch
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
    });
    tabs.forEach(function (x) {   // v15.1: Results and Turnout share a panel; it stands while either tab is on, named by that tab
      var p = panel(x);
      if (!p) return;
      var owner = tabs.filter(function (y) { return panel(y) === p && y.classList.contains('is-on'); })[0];
      p.hidden = !owner;
      if (owner) p.setAttribute('aria-labelledby', owner.id);
    });
    if (window.EH_RES_MODE && (id === 'all' || id === 'turnout')) window.EH_RES_MODE(id);
    if (focus) try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); }
    if (id === cur) return;
    var boot = !cur;
    cur = id;
    if (!boot && window.EH_ANCHOR) EH_ANCHOR.tabs(id);   // v24: the address's anchor follows the tab, with the area (see "anchors")
    subs.forEach(function (f) { try { f(id); } catch (e) { if (window.console) console.error('[elections-hub] tab change:', e); } });
    glide.to(was, panel(t), panel(t) === before);   // v18: after the tab's own painting, so the glide ends at its height
  }
  bar.addEventListener('click', function (e) {
    var t = e.target.closest('[role="tab"]');
    if (t && bar.contains(t)) show(idOf(t), false);
  });
  bar.addEventListener('keydown', function (e) {
    var k = e.key, i = tabs.indexOf(document.activeElement);
    if (i < 0 || (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End')) return;
    e.preventDefault();
    if (k === 'Home') i = 0; else if (k === 'End') i = tabs.length - 1;
    else i = (i + (k === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    show(idOf(tabs[i]), true);
  });
  var want = (window.EH_ANCHOR && EH_ANCHOR.start && EH_ANCHOR.start.tab) || '';   // v24: the tab the address asks for (see "anchors")
  show(tabFor(want) ? want : 'all', false);
  window.EH_TABS = { show: function (id) { show(id, false); }, on: function (f) { subs.push(f); }, current: function () { return cur; } };
});

/* ==== post-elections v15 · Change since 2021 ====
   The third tab under the municipality finder (v17: after Results and Turnout, before Hung councils), for the area the dropdown picks
   (South Africa or a province).
   v17: on top, the councils map coloured by the leading party in 2021 where Results has its map, the same size in the same place (Results'
   two columns, .res-grid and .res-map), so the map stays put from one tab to the other; the same map now where Results has party support.
   Under each, its key: the councils each party leads. The maps stand as soon as the council outlines are in, each filling in as its
   councils are read. Under them: the facts (hung councils in 2021 and now, the councils whose leading party changed, turnout then and
   now), party support (each party's share in 2021 beside its share now, with the change in points), then a table: over the whole country
   the provinces (each one's leading party then and now, and how many of its councils changed hands; a row opens the province), in a
   province its councils (a row opens the council's file), those that changed hands flagged.
   The 2021 figures are the feed's 2021 results (natPrev and provincePrev in "results": the national totals, and each province with its
   councils), read when the tab opens; the 2026 figures are the page's own. A leading party is the largest on the combined ballot; a
   hung council one the Commission has declared with no majority (as in Hung councils). While the Commission counts, the 2026 figures
   are the count so far. A page showing 2021 itself (previews before the count) has nothing to compare.
   v22.6: each pair of maps under its label: Leading parties, then Hung councils, the same two maps in the Hung councils tab's colours
   (hmapSvg); the figures, party support and the table under them.
   v22.11: over the whole country a council answers for its province (cmpProv), and a click opens the province on every tab; in a
   province each map has the way back to South Africa (CMP_ZOOM). */
guard("change since 2021", function () {
  var R$ = window.EH_RES, A = window.EH_AREA, sec = document.getElementById('eh-cmp'), $b = document.getElementById('eh-cmp-body');
  if (!R$ || !A || !sec || !$b) return;
  var PROVS = window.SA_PROVINCES, MUNIS = window.SA_MUNIS, PREV = R$.PREV, YEAR = R$.S.year;
  var nat21 = null, natFail = false, started = false, dirty = true, got = {};
  function provR21(pc) { var e = nat21 && (nat21.provincial_results || []).filter(function (p) { return p.province_name === PROVS[pc]; })[0]; return e ? R$.norm(e) : null; }
  function area21(pc) { return pc ? provR21(pc) : nat21 ? R$.norm(nat21) : null; }
  function area26(pc) { return pc ? A.provR(pc) : R$.norm(R$.S.nat); }
  function c26(k) { var x = R$.IX[k]; return x ? R$.norm(x.e) : null; }
  function c21(k) { var x = R$.IXP[k]; return x ? R$.norm(x.e) : null; }
  function lead(R) { var o = R ? R$.outcome(R) : null; return o && o.lead && o.state !== 'none' && o.state !== 'district' ? o.lead : null; }
  function hung(R) { if (!R) return false; var v = R$.seatsView(R), h = R$.hungOf(v); return !!(h && h.hung && (v.kind === 'final' || v.iec)); }   // v23: the Commission's seats, declared or still provisional
  function top(R) { return R && R.vdCaptured && R.parties.length ? R.parties[0] : null; }
  function leadCell(p) { return p ? '<span class="res-lead"><i style="background:' + esc(p.col) + '"></i><b>' + esc(p.label) + '</b></span>' : '<span class="res-oc is-na">\u2014</span>'; }
  function bar(v, mx, col) { return '<span class="res-sb"><i><b style="width:' + Math.round(100 * Math.max(0, Math.min(1, (v || 0) / (mx || 1)))) + '%;background:' + esc(col) + '"></b></i>' + R$.pct(v) + '</span>'; }
  function pts(d) {
    var a = Math.abs(d), s = (Math.round(a * 10) / 10).toFixed(1).replace('.', ',');
    return a < 0.05 ? '<span class="cmp-d is-flat">\u00b10,0</span>' : '<span class="cmp-d">' + (d > 0 ? '+' : '\u2212') + s + '<small> pts</small></span>';
  }
  function nameOf(k) { return R$.shortName(MUNIS[k]); }
  // the councils of the area, then and now
  function tally(pc) {
    var t = { n: 0, h21: 0, h26: 0, dec: 0, have: 0, changed: 0, rows: [] };
    Object.keys(MUNIS).forEach(function (k) {
      var m = MUNIS[k];
      if (!m || m.dtype === 'district' || (pc && m.p !== pc)) return;
      var a = c21(k), b = c26(k), la = lead(a), lb = lead(b), chg = !!(la && lb && la.label !== lb.label);
      t.n++;
      if (hung(a)) t.h21++;
      if (hung(b)) t.h26++;
      if (b && b.alloc) t.dec++;   // v23: the councils whose seats are in
      if (la && lb) { t.have++; if (chg) t.changed++; }
      t.rows.push({ k: k, m: m, a: a, b: b, la: la, lb: lb, chg: chg, metro: m.t === 'Metropolitan' });
    });
    t.rows.sort(function (x, y) { return y.metro - x.metro || nameOf(x.k).localeCompare(nameOf(y.k)); });
    return t;
  }
  // party support then and now: the parties by their larger share, the rest as Others
  function shares(a, b) {
    var by = {}, list = [];
    function add(R, f) { ((R && R.parties) || []).forEach(function (p) { if (!(p.votes > 0)) return; var r = by[p.label]; if (!r) { r = by[p.label] = { label: p.label, title: p.name, col: p.col, p21: 0, p26: 0 }; list.push(r); } r[f] = p.pct || 0; }); }
    add(a, 'p21'); add(b, 'p26');
    list.sort(function (x, y) { return Math.max(y.p21, y.p26) - Math.max(x.p21, x.p26) || y.p26 - x.p26; });
    var head = list.slice(0, 7), rest = list.slice(7);
    if (rest.length) head.push({ label: 'Others', col: R$.OTHERS, p21: rest.reduce(function (s, r) { return s + r.p21; }, 0), p26: rest.reduce(function (s, r) { return s + r.p26; }, 0) });
    return head;
  }
  // v22.11 · in a province, the way back to the whole country at the top right of each map, as on Results and Hung councils
  var CMP_ZOOM = '<button type="button" class="res-zoom" data-back aria-label="Zoom out to South Africa" title="Zoom out to South Africa"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="11.5" cy="8.5" r="5.25"></circle><path d="M7.6 12.4L3.5 16.5M9.2 8.5h4.6"></path></svg></button>';
  // v17: a column of Results' grid, laid out as Results' map (.res-map): the head with the year, the drawing, its key. busy: the year's
  // councils still being read, so the key leaves out those with no result yet
  function mapSvg(set, pc, year, get, area, busy) {
    var vb = A.cmap.vb(set, pc), counts = {}, body = '', n = 0, have = 0;
    set.councils.forEach(function (c) {
      if (pc && c.pc !== pc) return;
      var R = c.key ? get(c.key) : null, p = lead(R), m = c.key ? MUNIS[c.key] : null, name = m ? R$.shortName(m).replace(/ Metro$/, '') + (m.t === 'Metropolitan' ? ' Metro' : '') : c.name;
      n++;
      if (p) { have++; (counts[p.label] = counts[p.label] || { n: 0, col: p.col }).n++; }
      // v22.5: the council's code, key and name for the tooltips (cmpHov), in place of a title
      body += '<path class="rc" d="' + c.d + '" data-c="' + esc(c.code) + '" data-pc="' + c.pc + '"' + (c.key ? ' data-k="' + c.key + '"' : '') + ' data-nm="' + esc(name) + '"' + (p ? ' style="fill:' + esc(p.col) + ';--fc:' + esc(p.col) + '"' : '') + '></path>';
    });
    if (!pc) body += set.provs.map(function (p) { return '<path class="rp" d="' + p.d + '"' + (p.pc ? ' data-rp="' + p.pc + '"' : '') + '></path>'; }).join('');   // v22.11: named, for the shadow of the province standing up
    var keys = Object.keys(counts).sort(function (x, y) { return counts[y].n - counts[x].n || x.localeCompare(y); });
    var leg = keys.slice(0, 4).map(function (l) { return '<li><i style="background:' + esc(counts[l].col) + '"></i>' + esc(l) + ' <b>' + counts[l].n + '</b></li>'; }).join('');
    var rest = keys.slice(4).reduce(function (s, l) { return s + counts[l].n; }, 0);
    if (rest) leg += '<li><i style="background:' + esc(R$.OTHERS) + '"></i>Other parties <b>' + rest + '</b></li>';
    if (n > have && !busy) leg += '<li class="is-nr"><i></i>No result yet <b>' + (n - have) + '</b></li>';
    return '<div class="res-map cmp-map" data-y="' + esc(year) + '"><div class="res-map-head"><span class="cmp-yr">' + esc(year) + '</span>' + (pc ? CMP_ZOOM : '') + '</div>' +
      '<div class="res-map-svg is-shapes cmp-map-svg' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img" aria-label="' + esc(area + ' councils in ' + year + ', coloured by leading party') + '">' + body + '<path class="rc-hov" d="M0 0"></path></svg>' +
        '<i class="cmp-pt" aria-hidden="true" hidden></i><div class="res-tip" role="tooltip" hidden></div>' + (busy ? '<span class="res-loading">Loading councils&hellip;</span>' : '') + '</div>' +
      (leg ? '<ul class="cmp-legend">' + leg + '</ul>' : '') + '</div>';
  }
  /* v23.14 · the turnout pair, between Leading parties and Hung councils: the councils map in the Turnout tab's colours (its bands of ten,
     from under 40% to 70% or more; TURN_BINS in "results across South Africa"), the key under it the bands, highest first, each with its
     councils. The tooltips read as the Turnout tab's: the turnout, then the registered voters and the ballots cast */
  var CMP_TURN = [[70, '#1f4778', '70% or more'], [60, '#3d6ea4', '60\u201370%'], [50, '#6d98c3', '50\u201360%'], [40, '#a6c1dd', '40\u201350%'], [0, '#e0ebf7', 'Under 40%']];
  function tBin(v) { for (var i = 0; i < CMP_TURN.length - 1; i++) if (v >= CMP_TURN[i][0]) return i; return CMP_TURN.length - 1; }
  function tmapSvg(set, pc, year, get, area, busy) {
    var vb = A.cmap.vb(set, pc), bins = CMP_TURN.map(function () { return 0; }), body = '', n = 0, have = 0;
    set.councils.forEach(function (c) {
      if (pc && c.pc !== pc) return;
      var R = c.key ? get(c.key) : null, b = lead(R) && R.turnout != null ? tBin(R.turnout) : -1, col = b < 0 ? '' : CMP_TURN[b][1], m = c.key ? MUNIS[c.key] : null, name = m ? R$.shortName(m).replace(/ Metro$/, '') + (m.t === 'Metropolitan' ? ' Metro' : '') : c.name;
      n++;
      if (b >= 0) { have++; bins[b]++; }
      body += '<path class="rc" d="' + c.d + '" data-c="' + esc(c.code) + '" data-pc="' + c.pc + '"' + (c.key ? ' data-k="' + c.key + '"' : '') + ' data-nm="' + esc(name) + '"' + (col ? ' style="fill:' + col + ';--fc:' + col + '"' : '') + '></path>';
    });
    if (!pc) body += set.provs.map(function (p) { return '<path class="rp" d="' + p.d + '"' + (p.pc ? ' data-rp="' + p.pc + '"' : '') + '></path>'; }).join('');
    var leg = have ? CMP_TURN.map(function (t, i) { return '<li><i style="background:' + t[1] + '"></i>' + t[2] + ' <b>' + bins[i] + '</b></li>'; }).join('') : '';
    if (n > have && !busy) leg += '<li class="is-nr"><i></i>No result yet <b>' + (n - have) + '</b></li>';
    return '<div class="res-map cmp-map" data-y="' + esc(year) + '" data-v="t"><div class="res-map-head"><span class="cmp-yr">' + esc(year) + '</span>' + (pc ? CMP_ZOOM : '') + '</div>' +
      '<div class="res-map-svg is-shapes cmp-map-svg' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img" aria-label="' + esc(area + ' councils in ' + year + ', coloured by turnout') + '">' + body + '<path class="rc-hov" d="M0 0"></path></svg>' +
        '<i class="cmp-pt" aria-hidden="true" hidden></i><div class="res-tip" role="tooltip" hidden></div>' + (busy ? '<span class="res-loading">Loading councils&hellip;</span>' : '') + '</div>' +
      (leg ? '<ul class="cmp-legend">' + leg + '</ul>' : '') + '</div>';
  }
  /* v22.6 · the hung councils pair: the councils map in the Hung councils tab's colours, no seats yet a pale grey and a majority a shade
     darker, both flat, a hung council raised over them: 3px and in charcoal while its seats are provisional, 7px and in red once the
     Commission declares it. As hmFill draws them, without the motion: the sides are copies of the outline lifted in steps, a shade darker
     than the top, the shadows blurred together under them, the raised councils from north to south. Under it, its key: the councils in
     each state (all: every council declared, so no provisional row unless one is). The heights are in pixels on screen (--u, cmhScale) */
  // past: 2021, every count complete and declared, so a council with provisional seats there is declared. x: counted, with no seat figures
  var HC = { d: '#ca2828', p: '#3a3835', m: '#e3e0d9', n: '#f4f3ef', x: '#f4f3ef' }, HC_UP = { d: 2, p: 1 }, HC_PX = { d: 7, p: 3 }, HC_WALLS = 9;
  function hstate(R, past) {
    var v = R ? R$.seatsView(R) : null, h = v ? R$.hungOf(v) : null, s = !h ? 'n' : !h.hung ? 'm' : v.kind === 'final' || past ? 'd' : 'p';
    if (s === 'n' && R && R.vdCaptured > 0 && R.parties && R.parties.length && (past || R.complete || (R.vdCount > 0 && R.vdCaptured >= R.vdCount))) s = 'x';
    return { s: s, h: h, R: h ? v.R : R, kind: v ? v.kind : 'none', past: !!past };
  }
  function hmapSvg(set, pc, year, get, area, busy, all, past) {
    var vb = A.cmap.vb(set, pc), list = set.councils.filter(function (x) { return !pc || x.pc === pc; }), id = 'eh-cmh' + year;
    var c = { d: 0, p: 0, m: 0, n: 0, x: 0 }, sts = [], base = '', defs = '', shs = '', lifts = '', leg = '';
    list.forEach(function (x) {
      var s = hstate(x.key ? get(x.key) : null, past).s, m = x.key ? MUNIS[x.key] : null, name = m ? R$.shortName(m).replace(/ Metro$/, '') + (m.t === 'Metropolitan' ? ' Metro' : '') : x.name;
      sts.push(s); c[s]++;
      base += '<path class="hc is-' + s + '" d="' + x.d + '" data-c="' + esc(x.code) + '" data-pc="' + x.pc + '"' + (x.key ? ' data-k="' + x.key + '"' : '') + ' data-nm="' + esc(name) + '" data-l="' + (HC_PX[s] || 0) + '" style="--fc:' + HC[s] + '"></path>';
    });
    list.map(function (x, i) { return i; }).sort(function (a, b) { return ((list[a].b || [])[3] || 0) - ((list[b].b || [])[3] || 0) || a - b; }).forEach(function (i) {
      var s = sts[i], up = HC_UP[s], ref = id + '-' + i, w = '';
      if (!up) return;
      defs += '<path id="' + ref + '" d="' + list[i].d + '" vector-effect="non-scaling-stroke"></path>';
      for (var j = 0; j < HC_WALLS; j++) w += '<use href="#' + ref + '" class="hm-w' + (j ? '' : ' hm-ft') + '" style="--f:' + (j / HC_WALLS).toFixed(3) + '"></use>';
      lifts += '<g class="hm-l is-l' + up + ' is-c' + s + '" data-c="' + esc(list[i].code) + '" data-pc="' + list[i].pc + '">' + w + '<use href="#' + ref + '" class="hm-t"></use></g>';
      shs += '<use href="#' + ref + '" class="hm-sh is-l' + up + '"></use>';
    });
    var provs = pc ? '' : (set.provs || []).map(function (p) { return '<path class="rp" d="' + p.d + '"' + (p.pc ? ' data-rp="' + p.pc + '"' : '') + '></path>'; }).join(''), prov = c.p > 0 || !all;
    function li(s, l) { return '<li><i style="background:' + HC[s] + '"></i>' + l + ' <b>' + c[s] + '</b></li>'; }
    if (c.d + c.p + c.m) leg = li('d', prov ? 'Hung, declared' : 'Hung') + (prov ? li('p', 'Hung, provisional') : '') + li('m', 'Majority');
    if (c.x) leg += li('x', 'No seat figures');
    if (c.n && !busy) leg += li('n', 'No result yet');
    var lbl = area + ' councils in ' + year + ': ' + (c.d + c.p) + ' hung' + (c.p ? ' (' + c.p + ' provisional)' : '') + ', ' + c.m + ' with a majority' + (c.x ? ', ' + c.x + ' with no seat figures' : '') + (c.n ? ', ' + c.n + ' with no result yet' : '');
    return '<div class="res-map cmp-map" data-y="' + esc(year) + '" data-v="h"><div class="res-map-head"><span class="cmp-yr">' + esc(year) + '</span>' + (pc ? CMP_ZOOM : '') + '</div>' +
      '<div class="res-map-svg cmp-map-svg cmp-hsvg' + (pc ? '' : ' is-nat') + '"><svg viewBox="' + vb.map(function (v) { return v.toFixed(2); }).join(' ') + '" role="img" aria-label="' + esc(lbl) + '">' +
        '<defs><filter id="' + id + '-blur"><feGaussianBlur stdDeviation="1"></feGaussianBlur></filter>' + defs + '</defs>' + base + provs +
        '<g class="hm-shs" filter="url(#' + id + '-blur)">' + shs + '</g><g class="hm-lifts">' + lifts + '</g><path class="rc-hov" d="M0 0"></path></svg>' +
        '<i class="cmp-pt" aria-hidden="true" hidden></i><div class="res-tip" role="tooltip" hidden></div>' + (busy ? '<span class="res-loading">Loading councils&hellip;</span>' : '') + '</div>' +
      (leg ? '<ul class="cmp-legend">' + leg + '</ul>' : '') + '</div>';
  }
  // --u on each hung councils map (the map's units to a pixel on screen, for the heights), the shadows' blur with it
  function cmhScale() {
    [].forEach.call($b.querySelectorAll('.cmp-hsvg'), function (box) {
      var svg = box.querySelector('svg'), vb = svg && svg.viewBox && svg.viewBox.baseVal, w = box.getBoundingClientRect().width, u, f;
      if (!vb || !vb.width || !w) return;
      u = vb.width / w;
      box.style.setProperty('--u', u.toFixed(5));
      f = box.querySelector('feGaussianBlur');
      if (f) f.setAttribute('stdDeviation', (2.2 * u).toFixed(3));
    });
  }
  if (window.ResizeObserver) new ResizeObserver(function () { cmhScale(); }).observe($b);
  function facts(t, a, b, all) {
    function bf(l, v) { return '<div class="bf"><span class="lbl">' + l + '</span><span class="v">' + v + '</span></div>'; }
    return '<div class="res-facts cmp-facts">' +
      bf('Hung councils, ' + PREV, t.h21) +
      bf('Hung councils, ' + YEAR, t.h26 + (all || !t.dec ? '' : '<small>of ' + t.dec + ' with seats</small>')) +
      bf('Changed hands', t.have ? t.changed + '<small>of ' + t.have + ' councils</small>' : '\u2014') +
      bf('Turnout', (a ? R$.pct(a.turnout) : '\u2014') + '<span class="cmp-arr" aria-label="to">\u2192</span>' + (b ? R$.pct(b.turnout) : '\u2014')) +
      '</div>';
  }
  function flag(chg) { return chg ? '<span class="res-oc is-chg">Changed hands</span>' : '<span class="res-oc is-na">\u2014</span>'; }
  function table(pc, t, busy) {
    if (!pc) {
      var rows = R$.PROV_ORDER.map(function (p) {
        var la = top(area21(p)), lb = top(area26(p)), tp = tally(p);
        return '<tr data-prov="' + p + '" tabindex="0" role="button" aria-label="Show ' + esc(PROVS[p]) + '"><th scope="row"><span class="nm">' + esc(PROVS[p]) + '</span></th>' +
          '<td>' + leadCell(la) + '</td><td>' + leadCell(lb) + '</td>' +
          '<td class="n">' + (tp.have ? tp.changed + '<span class="of"> of ' + tp.have + '</span>' : busy ? '<span class="res-dash"></span>' : '\u2014') + '</td>' +
          '<td class="hide-s">' + (la && lb ? flag(la.label !== lb.label) : '') + '</td><td class="go" aria-hidden="true">&rsaquo;</td></tr>';
      }).join('');
      return '<h3 class="res-h3" data-anchor="councils">Provinces</h3><div class="res-tw"><table class="res-table cmp-table"><thead><tr><th scope="col">Province</th><th scope="col">Led in ' + PREV + '</th><th scope="col">Leads now</th><th scope="col" class="n">Councils changed hands</th><th scope="col" class="hide-s">Leading party</th><th class="go"></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    }
    var crow = t.rows.map(function (r) {
      return '<tr data-open="' + r.k + '" tabindex="0" role="button" aria-label="Open ' + esc(nameOf(r.k)) + '"><th scope="row"><span class="nm">' + esc(nameOf(r.k)) + '</span>' + (r.metro ? '<span class="ty">Metro</span>' : '') + (r.la && r.lb && r.chg ? '<span class="cmp-chg-s">' + flag(true) + '</span>' : '') + '</th>' +   // v23.30: on phones the flag under the name, for the Change column
        '<td>' + (r.la ? leadCell(r.la) : busy && !R$.IXP[r.k] ? '<span class="res-dash"></span>' : leadCell(null)) + '<span class="cmp-sh hide-s">' + (r.la ? R$.pct(r.la.pct) : '') + '</span></td>' +
        '<td>' + (r.lb ? leadCell(r.lb) : busy && !R$.IX[r.k] ? '<span class="res-dash"></span>' : leadCell(null)) + '<span class="cmp-sh hide-s">' + (r.lb ? R$.pct(r.lb.pct) : '') + '</span></td>' +
        '<td class="hide-s">' + (r.la && r.lb ? flag(r.chg) : '') + '</td><td class="go" aria-hidden="true">&rsaquo;</td></tr>';
    }).join('');
    return '<h3 class="res-h3" data-anchor="councils">Councils in ' + esc(PROVS[pc]) + '</h3><div class="res-tw"><table class="res-table cmp-table"><thead><tr><th scope="col">Council</th><th scope="col">Led in ' + PREV + '</th><th scope="col">Leads now</th><th scope="col" class="hide-s">Change</th><th class="go"></th></tr></thead><tbody>' + crow + '</tbody></table></div>';
  }
  function paint() {
    if (sec.hidden) { dirty = true; return; }
    dirty = false;
    var S = R$.S, pc = A.get(), area = A.name(pc);
    if (!R$.hasPrev()) {
      $b.innerHTML = '<p class="cmp-empty">' + (S.auto ? '<b>Counting for ' + YEAR + ' hasn\u2019t started.</b> Once it does, this tab compares the ' + YEAR + ' results with ' + PREV + '\u2019s, for ' + esc(area) + ' or any province.' : 'The page is showing the ' + esc(S.year) + ' results, so there is nothing to compare them with yet.') + '</p>';
      return;
    }
    if (S.state === 'loading') { $b.innerHTML = R$.wait(); return; }
    if (S.state === 'error' || natFail) { $b.innerHTML = S.state === 'error' ? R$.errMsg('cmp-empty') : R$.errMsg('cmp-empty', 'The ' + PREV + ' results could not be loaded.', 'data-cmp-retry'); return; }   // v23: with Refresh results
    var want = pc ? [pc] : R$.PROV_ORDER, busyA = want.some(function (p) { return !got['a' + p]; }), busyB = want.some(function (p) { return !got['b' + p]; }), busy = busyA || busyB;
    // v17: the two maps first, in Results' two columns, as soon as the council outlines are in (each fills in as its councils are read);
    // the figures under them once the 2021 totals are in
    // v22.6: each pair under its label, Leading parties then Hung councils (v23.14: Turnout between them)
    var set = A.cmap.set(pc), dec = R$.dec(), all = !!dec.all || S.phase === 'final';
    var maps = set ? '<h3 class="res-h3 cmp-sec" data-anchor="leading-parties">Leading parties</h3><div class="res-grid cmp-maps">' + mapSvg(set, pc, PREV, c21, area, busyA) + mapSvg(set, pc, YEAR, c26, area, busyB) + '</div>' +
        '<h3 class="res-h3 cmp-sec is-t" data-anchor="turnout">Turnout</h3><div class="res-grid cmp-maps">' + tmapSvg(set, pc, PREV, c21, area, busyA) + tmapSvg(set, pc, YEAR, c26, area, busyB) + '</div>' +
        '<h3 class="res-h3 cmp-sec is-h" data-anchor="hung-councils">Hung councils</h3><div class="res-grid cmp-maps">' + hmapSvg(set, pc, PREV, c21, area, busyA, true, true) + hmapSvg(set, pc, YEAR, c26, area, busyB, all, false) + '</div>'
      : '<p class="res-sub">' + (A.cmap.failed(pc) ? 'The council map is not available.' : 'Loading the council map&hellip;') + '</p>';
    if (!nat21) { $b.innerHTML = maps + R$.wait(); cmhScale(); again(); return; }
    var a = area21(pc), b = area26(pc), t = tally(pc);
    var note = S.state === 'counting' ? '<p class="res-note cmp-note">The ' + YEAR + ' figures are the count so far; they change as voting districts declare. A council counts as hung once the Electoral Commission has allocated its seats and no party has a majority.</p>' : '';
    var rows = shares(a, b), mx = Math.max.apply(null, rows.map(function (r) { return Math.max(r.p21, r.p26); })) || 1;
    var noB = !b || !(b.vdCaptured > 0) || !b.parties.some(function (p) { return p.votes > 0; });   // v25: no 2026 votes yet (the feed before counting starts)
    var share = !rows.length || noB ? '<p class="res-sub">Results appear here as voting districts declare.</p>'
      : '<div class="res-tw"><table class="res-table cmp-table cmp-share"><caption class="vh">' + esc('Party support, ' + area + ', ' + PREV + ' and ' + YEAR) + '</caption><thead><tr><th scope="col">Party</th><th scope="col" class="n">' + PREV + '</th><th scope="col" class="n">' + YEAR + '</th><th scope="col" class="n">Change</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><th scope="row">' + leadCell(r) + '</th><td class="n res-share">' + bar(r.p21, mx, '#c9c3b8') + '</td><td class="n res-share">' + bar(r.p26, mx, r.col) + '</td><td class="n">' + pts(r.p26 - r.p21) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    $b.innerHTML = maps + note +   // v23.15: no figures under the maps
     
      '<h3 class="res-h3" data-anchor="party-support">Party support, ' + esc(area) + '</h3>' + share + '<p class="res-note">Share of the vote on the combined ballot. Change in percentage points.</p>' +
      table(pc, t, busy) + (busy ? '<p class="eh-hung-load">Loading councils&hellip;</p>' : '');
    cmhScale();
    again();
  }
  /* v22.5 · the two maps answer each other: the council under the pointer is outlined on both, each with its tooltip for its year, and on
     the other map a dot marks the same spot, so the two years read side by side. A tap does the same; a tap off the maps clears them. The
     tooltips read as Results' do: the three leading parties with their shares, then whether the leader has a majority, with its seats
     (while counting, the share of voting districts declared). The pointer's place is kept, so a repaint puts them back (again). */
  var hov = null;
  function tipRow(col, label, val, key) { return '<span class="tr' + (key ? ' is-key' : '') + (col ? '' : ' is-ns') + '">' + (col ? '<i style="background:' + esc(col) + '"></i>' : '') + '<span class="l">' + esc(label) + '</span><b>' + esc(val) + '</b></span>'; }
  // v23.14 · on the turnout maps: the turnout in its band's colour, the registered voters and the ballots cast
  function tRows(R) { return tipRow(R.turnout != null ? CMP_TURN[tBin(R.turnout)][1] : '', 'Turnout', R$.pct(R.turnout), true) + (R.registered ? tipRow('', 'Registered voters', R$.int(R.registered)) : '') + (R.cast ? tipRow('', 'Ballots cast', R$.int(R.cast)) : ''); }
  function tTipFor(name, R) {
    var o = R ? R$.outcome(R) : null, rows = '', foot = '';
    if (!R || !R.vdCaptured || !R.parties.length) foot = 'No result yet';
    else { rows = tRows(R); if (o && o.state === 'counting') foot = R$.decPct(R) + ' declared'; }
    return '<span class="nm">' + esc(name) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  function tipFor(name, R) {
    var o = R ? R$.outcome(R) : null, rows = '', foot = '', ld;
    if (!R || !R.vdCaptured || !R.parties.length) foot = 'No result yet';
    else {
      ld = (o && o.lead) || R.parties[0];
      rows = [ld].concat(R.parties.filter(function (p) { return p !== ld && p.votes > 0; })).slice(0, 3).map(function (p, i) { return tipRow(p.col, p.label, R$.pct(p.pct), !i); }).join('');
      if (o && (o.state === 'majority' || o.state === 'hung') && o.total) foot = (o.state === 'majority' ? 'Majority' : 'No majority') + ' \u00b7 ' + ld.label + ' ' + ld.seats + ' of ' + o.total + ' seats';
      else if (o && o.state === 'counting') foot = R$.decPct(R) + ' declared';
    }
    return '<span class="nm">' + esc(name) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  // v22.6 · on the hung councils maps, as the Hung councils tab's: hung council or majority, declared or provisional, the largest party's
  // seats and how far it is short of a majority
  function hTipFor(name, R, past) {
    var x = hstate(R, past), h = x.h, rows = '', foot = '';
    if (x.s === 'x') foot = 'No seat figures';
    else if (h) {
      rows = tipRow(HC[x.s], x.s === 'm' ? 'Majority' : 'Hung council', x.kind === 'final' || past ? 'Declared' : 'Provisional', true) + tipRow(h.top.col, h.top.label, h.top.seats + ' of ' + x.R.seatsTotal + ' seats');
      if (h.hung) foot = h.short + (h.short === 1 ? ' seat' : ' seats') + ' short of a majority';
    } else foot = R && R.vdCaptured > 0 ? 'Count under way' : 'No result yet';
    return '<span class="nm">' + esc(name) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  // client px to the map's units, or (out) back
  function cmpPt(svg, x, y, out) { var m = svg && svg.getScreenCTM(), p; if (!m) return null; p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(out ? m : m.inverse()); }
  function cmpOff(keep) {
    [].forEach.call($b.querySelectorAll('.cmp-map-svg'), function (b) {
      if (keep && keep.indexOf(b) >= 0) return;
      var hl = b.querySelector('.rc-hov'), tip = b.querySelector('.res-tip'), pt = b.querySelector('.cmp-pt'), g = b.querySelector('g.rl');
      if (hl) hl.classList.remove('is-on');
      if (tip) { tip.hidden = true; tip.classList.remove('is-pin'); }
      if (pt) pt.hidden = true;
      if (g) g.parentNode.removeChild(g);   // v22.11: the province standing up
    });
    if (!keep) { upK = ''; cmpPin = null; }   // v23.38: and the council pinned on a touch screen
  }
  /* v22.11 · over the whole country the maps answer by province, as Results' and the Hung councils tab's do: the province under the
     pointer stands up as one on both maps of the pair (cmpLift, as Results' cmLift: its shadow, its sides in its councils' colours a shade
     darker, its councils on its top), each with the province's tooltip for its year (provTip), and a click opens it on every tab
     (EH_AREA.set). upK: the pair and the province standing up, so a repaint under the pointer puts it back up at once. */
  var CMP_NS = 'http://www.w3.org/2000/svg', upK = '';
  function cmpEl(tag, at) { var e = document.createElementNS(CMP_NS, tag); for (var k in at) if (Object.prototype.hasOwnProperty.call(at, k)) e.setAttribute(k, at[k]); return e; }
  function cmpFoot(p) { if (p._ft == null) { try { var b = p.getBBox(); p._ft = b.y + b.height; } catch (e) { p._ft = 0; } } return p._ft; }
  function cmpLift(svg, pc, v, fid, now) {
    var key = v + ':' + pc, g = svg.querySelector('g.rl');
    if (g && g.getAttribute('data-lift') === key) return;
    if (g) g.parentNode.removeChild(g);
    var vb = svg.viewBox && svg.viewBox.baseVal, w = svg.getBoundingClientRect().width, tops = svg.querySelectorAll('path.' + (v === 'h' ? 'hc' : 'rc') + '[data-pc="' + pc + '"]'), rp = svg.querySelector('path.rp[data-rp="' + pc + '"]');
    if (!vb || !vb.width || !w || !tops.length) return;
    var u = vb.width / w, L = 7 * u, N = 9, defs = svg.querySelector('defs') || svg.insertBefore(cmpEl('defs', {}), svg.firstChild), f = svg.querySelector('#' + fid);
    if (!f) { f = cmpEl('filter', { id: fid }); f.appendChild(cmpEl('feGaussianBlur', { stdDeviation: '1' })); defs.appendChild(f); }
    f.firstChild.setAttribute('stdDeviation', (2.4 * u).toFixed(3));
    g = cmpEl('g', { 'class': now ? 'rl is-up' : 'rl', 'data-lift': key, 'data-pc': pc });
    var top = cmpEl('g', { 'class': 'rl-top', style: '--k:' + L.toFixed(3) });
    // the sides: copies of each council lifted in steps, the more southerly over the more northerly; the top: the councils as they are
    var sh = [].map.call(tops, function (p) { return { d: p.getAttribute('d') || '', fc: p.style.getPropertyValue('--fc').trim(), y: cmpFoot(p) }; }).filter(function (x) { return x.d; }).sort(function (a, b) { return a.y - b.y; });
    if (rp) g.appendChild(cmpEl('path', { 'class': 'rl-sh', d: rp.getAttribute('d'), filter: 'url(#' + fid + ')', style: 'transform:translate(' + (1.5 * u).toFixed(3) + 'px,' + (3.5 * u).toFixed(3) + 'px)' }));
    for (var i = 0; i < N; i++) {
      var st = cmpEl('g', { 'class': 'rl-step' + (i ? '' : ' rl-foot'), style: '--k:' + (L * i / N).toFixed(3) });
      sh.forEach(function (x) { st.appendChild(cmpEl('path', x.fc ? { 'class': 'rl-wall', d: x.d, style: '--fc:' + x.fc } : { 'class': 'rl-wall', d: x.d })); });
      g.appendChild(st);
    }
    [].forEach.call(tops, function (p) { top.appendChild(p.cloneNode(false)); });
    g.appendChild(top);
    svg.appendChild(g);
    if (now) return;
    g.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (g.parentNode) g.setAttribute('class', 'rl is-up'); }); });
  }
  // the province's tooltip for the year: on the leading parties maps its three leading parties with their shares (as Results' over the
  // whole country); on the hung councils maps its councils by outcome, as in the map's key
  function provTip(pc, yr, v) {
    var past = yr === String(PREV), rows = '', foot = '', read = !!got[(past ? 'a' : 'b') + pc], R, set, c, two;
    if (v === 't') {   // v23.14: the province's turnout
      R = past ? provR21(pc) : A.provR(pc);
      if (R && R.vdCaptured && R.parties && R.parties.length) { rows = tRows(R); if (!past && R$.S.state === 'counting') foot = R$.decPct(R) + ' declared'; }
      else foot = past && !nat21 && !natFail ? 'Loading\u2026' : 'No result yet';
    } else if (v === 'h') {
      set = A.cmap.set(''); c = { d: 0, p: 0, m: 0, n: 0, x: 0 };
      if (set) set.councils.forEach(function (x) { if (x.pc === pc) c[hstate(x.key ? (past ? c21 : c26)(x.key) : null, past).s]++; });
      two = c.p > 0 || !(past || !!R$.dec().all || R$.S.phase === 'final');
      if (c.d + c.p + c.m) rows = tipRow(HC.d, two ? 'Hung, declared' : 'Hung', String(c.d), true) + (two ? tipRow(HC.p, 'Hung, provisional', String(c.p), true) : '') + tipRow(HC.m, 'Majority', String(c.m));
      if (c.x) rows += tipRow(HC.x, 'No seat figures', String(c.x));
      if (c.n && read && rows) rows += tipRow(HC.n, 'No result yet', String(c.n));
      if (!rows) foot = read ? 'No result yet' : 'Loading councils\u2026';
    } else {
      R = past ? provR21(pc) : A.provR(pc);
      if (R && R.vdCaptured && R.parties && R.parties.length) {
        rows = R.parties.filter(function (p) { return p.votes > 0; }).slice(0, 3).map(function (p, i) { return tipRow(p.col, p.label, R$.pct(p.pct), !i); }).join('');
        if (!past && R$.S.state === 'counting') foot = R$.decPct(R) + ' declared';
      } else foot = past && !nat21 && !natFail ? 'Loading\u2026' : 'No result yet';
    }
    return '<span class="nm">' + esc(PROVS[pc]) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
  }
  // the province under the pointer (a council's, or the standing province's own) up on both maps of the pair, each with its tooltip at the
  // same spot. keepK: after a repaint under the pointer, the province that stood up (upK) stands, wherever on it the pointer is
  function cmpProv(t, x, y, keepK) {
    var from = t.closest('.cmp-map-svg'), grp = from && from.closest('.cmp-maps'), el = t.closest('.cmp-map-svg [data-pc]'), mv = from && from.closest('.cmp-map'), v = (mv && mv.getAttribute('data-v')) || 'l';
    var pc = keepK && keepK.charAt(0) === v ? keepK.slice(2) : el ? el.getAttribute('data-pc') : '', u = from && cmpPt(from.querySelector('svg'), x, y, false), shown = [];
    if (!PROVS[pc] || !u || !grp) { cmpOff(null); return; }
    var key = v + ':' + pc, now = upK === key;
    [].forEach.call(grp.querySelectorAll('.cmp-map[data-y]'), function (mp) {
      var box = mp.querySelector('.cmp-map-svg'), svg = box && box.querySelector('svg'), yr = mp.getAttribute('data-y'), me = box === from;
      var tip = box && box.querySelector('.res-tip'), pt = box && box.querySelector('.cmp-pt'), hl = box && box.querySelector('.rc-hov'), q = me ? { x: x, y: y } : cmpPt(svg, u.x, u.y, true), k, r, w, h, tp;
      if (!svg || !tip || !q) return;
      shown.push(box);
      if (hl) hl.classList.remove('is-on');
      if (pt) pt.hidden = true;
      cmpLift(svg, pc, v, 'eh-cmpl-' + (v === 'l' ? '' : v) + yr, now);
      k = 'p' + (v === 'l' ? '' : v) + yr + '|' + pc;
      if (tip._k !== k) { tip._k = k; tip.innerHTML = provTip(pc, yr, v); }
      tip.hidden = false;
      r = box.getBoundingClientRect(); w = tip.offsetWidth; h = tip.offsetHeight; tp = q.y - r.top - h - 18;
      tip.style.left = Math.max(4, Math.min(r.width - w - 4, q.x - r.left - w / 2)) + 'px';
      tip.style.top = (tp < 0 ? q.y - r.top + 22 : tp) + 'px';
    });
    upK = key;
    cmpOff(shown);
  }
  // v23.39 · a council clicked or tapped stands up a little (CMP_POP px over where it stood: a hung council on the hung councils maps from
  // its own height), as on Results: its shadow, its sides in its colour a shade darker, its top outlined as the council under the pointer
  // is (rl-hl). It rises from where it stood (--k0) unless now (put back after a repaint). Its sides carry the council, so a click on them is on it
  var CMP_POP = 5;
  function cmpPop(svg, p, fid, now) {
    var code = p.getAttribute('data-c') || '', key = 'c:' + code, g = svg.querySelector('g.rl');
    if (g && g.getAttribute('data-lift') === key) return;
    if (g) g.parentNode.removeChild(g);
    var vb = svg.viewBox && svg.viewBox.baseVal, w = svg.getBoundingClientRect().width;
    if (!vb || !vb.width || !w) return;
    var u = vb.width / w, b0 = (+p.getAttribute('data-l') || 0) * u, L = b0 + CMP_POP * u, N = 9, d = p.getAttribute('d') || '', fc = p.style.getPropertyValue('--fc').trim();
    var defs = svg.querySelector('defs') || svg.insertBefore(cmpEl('defs', {}), svg.firstChild), f = svg.querySelector('#' + fid), st, top;
    if (!f) { f = cmpEl('filter', { id: fid }); f.appendChild(cmpEl('feGaussianBlur', { stdDeviation: '1' })); defs.appendChild(f); }
    f.firstChild.setAttribute('stdDeviation', (2.4 * u).toFixed(3));
    g = cmpEl('g', { 'class': now ? 'rl is-up' : 'rl', 'data-lift': key });
    g.appendChild(cmpEl('path', { 'class': 'rl-sh', d: d, filter: 'url(#' + fid + ')', style: 'transform:translate(' + (1.5 * u).toFixed(3) + 'px,' + (3.5 * u).toFixed(3) + 'px)' }));
    for (var i = 0; i < N; i++) {
      st = cmpEl('g', { 'class': 'rl-step' + (i ? '' : ' rl-foot'), style: '--k:' + (L * i / N).toFixed(3) + ';--k0:' + (b0 * i / N).toFixed(3) });
      st.appendChild(cmpEl('path', fc ? { 'class': 'rl-wall', d: d, 'data-c': code, style: '--fc:' + fc } : { 'class': 'rl-wall', d: d, 'data-c': code }));
      g.appendChild(st);
    }
    top = cmpEl('g', { 'class': 'rl-top', style: '--k:' + L.toFixed(3) + ';--k0:' + b0.toFixed(3) });
    top.appendChild(p.cloneNode(false));
    top.appendChild(cmpEl('path', fc ? { 'class': 'rl-hl', d: d, style: '--fc:' + fc } : { 'class': 'rl-hl', d: d }));
    g.appendChild(top);
    svg.appendChild(g);
    if (now) return;
    g.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (g.parentNode) g.setAttribute('class', 'rl is-up'); }); });
  }
  function cmpHov(t, x, y, keepK, now) {
    if (t && t.closest && t.closest('.cmp-map-svg.is-nat')) { cmpProv(t, x, y, keepK); return; }   // v22.11: over the whole country, by province
    upK = '';
    // v22.6: the pair under the pointer answers (Leading parties or Hung councils); a raised council answers on its top
    var c = t && t.closest && t.closest('.cmp-map-svg [data-c]'), from = c && c.closest('.cmp-map-svg'), grp = from && from.closest('.cmp-maps'), u = from && cmpPt(from.querySelector('svg'), x, y, false), shown = [];
    if (!u || !grp) { cmpOff(null); return; }
    [].forEach.call(grp.querySelectorAll('.cmp-map[data-y]'), function (mp) {
      var box = mp.querySelector('.cmp-map-svg'), svg = box && box.querySelector('svg'), yr = mp.getAttribute('data-y'), me = box === from, v = mp.getAttribute('data-v') || 'l';
      var p = svg && svg.querySelector('path[data-c="' + c.getAttribute('data-c') + '"]'), hl = box && box.querySelector('.rc-hov'), tip = box && box.querySelector('.res-tip'), pt = box && box.querySelector('.cmp-pt');
      var q = me ? { x: x, y: y } : cmpPt(svg, u.x, u.y, true), k, kk, r, w, h, tp, go;
      if (!p || !hl || !tip || !q) return;
      shown.push(box);
      hl.setAttribute('d', p.getAttribute('d'));
      hl.style.setProperty('--fc', p.style.getPropertyValue('--fc').trim() || '#ecebe6');   // in the council's colour, a shade darker (v22.4)
      hl.style.setProperty('--lift', p.getAttribute('data-l') || '0');   // v22.6: as high as the council stands
      hl.classList.toggle('is-on', !cmpPin);   // v23.39: a council clicked stands up a little in its place, outlined (cmpPop)
      if (cmpPin) cmpPop(svg, p, 'eh-cmpl-' + (v === 'l' ? '' : v) + yr, now);
      r = box.getBoundingClientRect();
      if (pt) { pt.hidden = me || !!cmpPin; pt.style.left = (q.x - r.left) + 'px'; pt.style.top = (q.y - r.top) + 'px'; }
      kk = p.getAttribute('data-k'); go = cmpPin && kk ? tipGo(kk) : '';   // v23.38: Go to municipality in the tooltip (v23.39: on both maps of the pair)
      k = (v === 'l' ? '' : v) + yr + '|' + p.getAttribute('data-c') + (go ? '|go' : '');
      if (tip._k !== k) { tip._k = k; tip.innerHTML = (v === 'h' ? hTipFor : v === 't' ? tTipFor : tipFor)(p.getAttribute('data-nm') || '', kk ? (yr === String(PREV) ? c21 : c26)(kk) : null, yr === String(PREV)) + go; }
      tip.classList.toggle('is-pin', !!go);
      tip.hidden = false;
      w = tip.offsetWidth; h = tip.offsetHeight; tp = q.y - r.top - h - 18;
      tip.style.left = Math.max(4, Math.min(r.width - w - 4, q.x - r.left - w / 2)) + 'px';
      tip.style.top = (tp < 0 ? q.y - r.top + 22 : tp) + 'px';
    });
    cmpOff(shown);
  }
  function again() { if (cmpPin) { pinAgain(); return; } if (!hov) return; var t = document.elementFromPoint(hov[0], hov[1]); if (t && $b.contains(t)) cmpHov(t, hov[0], hov[1], upK); else hov = null; }
  /* post-elections v23.39 · a click or a tap on a council in a province, with a mouse or on a touch screen (v23.38: touch screens only):
     the council stands up a little on both maps of the pair (cmpPop), each with its tooltip, and both tooltips stay up with Go to
     municipality (tipGo), which opens the council's file. While it stands the pointer's hover rests. A click on another council moves
     them there (the same council again, nothing); a click on a map off the councils, a click or touch anywhere off the maps, or Escape,
     puts them down; a repaint puts them back (pinAgain). cmpPin: the pair (its place among the pairs), the map's year, the council's code
     and the click in the drawing's units */
  var cmpPin = null;
  function cmpPinAt(t, x, y) {
    var c = t.closest && t.closest('.cmp-map-svg [data-c]'), from = c && c.closest('.cmp-map-svg'), mp = from && from.closest('.cmp-map[data-y]'), grp = mp && mp.closest('.cmp-maps');
    var svg = from && from.querySelector('svg'), u = svg && cmpPt(svg, x, y, false), g = grp ? [].indexOf.call($b.querySelectorAll('.cmp-maps'), grp) : -1, code = c ? c.getAttribute('data-c') : '';
    if (!u || g < 0) { cmpOff(null); return; }
    if (cmpPin && cmpPin.g === g && cmpPin.y === mp.getAttribute('data-y') && cmpPin.c === code) return;
    cmpPin = { g: g, y: mp.getAttribute('data-y'), c: code, u: [u.x, u.y] };
    cmpHov(c, x, y);
  }
  function pinAgain() {
    var p = cmpPin, grp = $b.querySelectorAll('.cmp-maps')[p.g], mp = grp && grp.querySelector('.cmp-map[data-y="' + p.y + '"]'), svg = mp && mp.querySelector('.cmp-map-svg:not(.is-nat) svg');
    var c = svg && svg.querySelector('path[data-c="' + p.c + '"]'), q = c && cmpPt(svg, p.u[0], p.u[1], true);
    if (q) cmpHov(c, q.x, q.y, '', true); else cmpOff(null);
  }
  $b.addEventListener('pointermove', function (e) {
    if (tapPtr(e.pointerType) || cmpPin) return;   // v23.39: no hover while a council clicked stands
    if (e.target.closest && e.target.closest('.cmp-map-svg')) { hov = [e.clientX, e.clientY]; cmpHov(e.target, e.clientX, e.clientY); }
    else if (hov) { hov = null; cmpOff(null); }
  });
  $b.addEventListener('pointerleave', function (e) { if (tapPtr(e.pointerType) || cmpPin) return; hov = null; cmpOff(null); });   // v23.38: not a touch's (its pointer leaves as it lifts, before the click)
  document.addEventListener('pointerdown', function (e) { if (cmpPin && !($b.contains(e.target) && e.target.closest('.cmp-map-svg'))) cmpOff(null); }, true);   // v23.38: a click or touch off the maps
  document.addEventListener('keydown', function (e) { if (cmpPin && e.key === 'Escape') cmpOff(null); });   // v23.39
  $b.addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-open], tr[data-prov]'), go = e.target.closest('.cmp-map-svg [data-go]'), pe;
    if (go) { cmpOff(null); if (window.DM_EH_OPEN) window.DM_EH_OPEN(go.getAttribute('data-go')); return; }   // v23.38: Go to municipality, in a council's tooltip
    if (e.target.closest('.cmp-map-svg .res-tip')) return;
    if (e.target.closest('[data-back]')) { hov = null; cmpOff(null); A.set(''); return; }   // v22.11: in a province, back to South Africa
    if (e.target.closest('.cmp-map-svg.is-nat')) {   // v22.11: over the whole country a click opens the province under it, on every tab
      pe = e.target.closest('.cmp-map-svg [data-pc]');
      if (pe && PROVS[pe.getAttribute('data-pc')]) { cmpOff(null); A.set(pe.getAttribute('data-pc')); }
      return;
    }
    if (e.target.closest('.cmp-map-svg')) { cmpPinAt(e.target, e.clientX, e.clientY); return; }   // v22.5: a tap shows the council on both maps (v23.39: and it stands, with Go to municipality, cmpPinAt)
    cmpOff(null);
    if (!tr) return;
    if (tr.hasAttribute('data-prov')) { A.set(tr.getAttribute('data-prov')); window.scrollTo({ top: sec.getBoundingClientRect().top + window.pageYOffset - 12, behavior: 'smooth' }); }
    else if (window.DM_EH_OPEN) window.DM_EH_OPEN(tr.getAttribute('data-open'));
  });
  $b.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('tr[data-open], tr[data-prov]')) { e.preventDefault(); e.target.click(); } });
  // v23: Refresh results when the 2021 results didn't load: read them again
  $b.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cmp-retry]');
    if (!b || b.disabled) return;
    b.disabled = true; b.textContent = 'Refreshing\u2026';
    natFail = false;
    Object.keys(got).forEach(function (k) { if (k.charAt(0) === 'a') delete got[k]; });
    load();
  });
  // reading: the 2021 totals once, then the provinces of the area in both years (the whole country: all nine)
  function load() {
    if (!R$.hasPrev()) { paint(); return; }
    var pc = A.get(), want = pc ? [pc] : R$.PROV_ORDER;
    R$.ready().then(function () {
      if (!nat21 && !natFail) R$.natPrev().then(function (d) { nat21 = d; natFail = !d; paint(); }, function () { natFail = true; paint(); });
      want.forEach(function (p) {
        if (!got['a' + p]) R$.provincePrev(p).then(function () { got['a' + p] = 1; paint(); }, function () { got['a' + p] = 1; paint(); });
        if (!got['b' + p]) R$.province(p).then(function () { got['b' + p] = 1; paint(); }, function () { got['b' + p] = 1; paint(); });
      });
      A.cmap.load(pc);
      paint();
    }, paint);
    paint();   // v23: at once too: the results may still be loading, or not loaded (ready() waits through a retry)
  }
  function start() { if (!started) { started = true; load(); } else if (dirty) paint(); }
  R$.on(paint);
  R$.onPhase(paint);
  A.on(function () { if (started) load(); else dirty = true; });
  A.cmap.on(paint);
  if (window.EH_TABS) {
    window.EH_TABS.on(function (id) { if (id === 'cmp') start(); });
    if (window.EH_TABS.current() === 'cmp') start();
  } else start();
});

/* ==== municipality finder ==== */
guard("municipality finder", function () {
    (function () {
      'use strict';

      var MUNIS    = window.SA_MUNIS;
      var PROVS    = window.SA_PROVINCES;

      // Expand the place runs. _k is the lowercase name plus any alternative names, for matching.
      var PLACES = [];
      window.SA_PLACES.forEach(function (run) {
        var m = run[0], p = MUNIS[m].p;
        run[1].split('|').forEach(function (s) {
          var eq = s.indexOf('='), n = eq < 0 ? s : s.slice(0, eq), _n = n.toLowerCase();
          PLACES.push({ n: n, m: m, p: p, _n: _n, _k: eq < 0 ? _n : _n + ' ' + s.slice(eq + 1).toLowerCase() });
        });
      });

      var $input   = document.getElementById('mf-input');
      var $row     = document.getElementById('mf-input-row');
      var $list    = document.getElementById('mf-suggest');
      var $clear   = document.getElementById('mf-clear');
      var $hint    = document.getElementById('mf-hint');
      var $widget  = document.getElementById('mf-widget');
      var $fileN   = document.getElementById('mf-file-name');
      // Long names (e.g. King Sabata Dalindyebo) would wrap onto a second line
      // and collide with the meta row below; shrink just enough to fit one line.
      function fitFileName(tries) {
        $fileN.style.fontSize = '';
        // Phones: the name wraps, so only shrink when a single word is wider than the line.
        if (getComputedStyle($fileN).whiteSpace !== 'nowrap') {
          var wb = parseFloat(getComputedStyle($fileN).fontSize);
          if (!wb) return;
          if (!$fileN.clientWidth) {
            if ((tries || 0) < 30) requestAnimationFrame(function () { fitFileName((tries || 0) + 1); });
            return;
          }
          $fileN.style.overflowWrap = 'normal';
          var ws = wb, wmin = wb * 0.55, wg = 0;
          // Compare exact (fractional) widths: scrollWidth/clientWidth are rounded, so a word
          // 0.03px too wide would slip through and then split under overflow-wrap.
          var nameOver = function () {
            var rg = document.createRange(); rg.selectNodeContents($fileN);
            var rs = rg.getClientRects(), lw = 0;
            for (var k = 0; k < rs.length; k++) lw = Math.max(lw, rs[k].width);
            var c = getComputedStyle($fileN);
            return lw > $fileN.getBoundingClientRect().width - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight) + 0.01;
          };
          while (($fileN.scrollWidth > $fileN.clientWidth || nameOver()) && ws > wmin && wg++ < 60) {
            ws -= 0.5;
            $fileN.style.fontSize = ws + 'px';
          }
          $fileN.style.overflowWrap = '';
          return;
        }
        var base = parseFloat(getComputedStyle($fileN).fontSize);
        if (!base) return;
        var avail = $fileN.clientWidth;
        // Called before the file panel is revealed: retry once laid out.
        if (!avail) {
          if ((tries || 0) < 30) requestAnimationFrame(function () { fitFileName((tries || 0) + 1); });
          return;
        }
        var full = $fileN.scrollWidth;
        if (full <= avail) return;
        var min = base * 0.55;
        var size = Math.max(min, base * (avail / full) - 0.5);
        $fileN.style.fontSize = size + 'px';
        var guard = 0;
        while ($fileN.scrollWidth > $fileN.clientWidth && size > min && guard++ < 24) {
          size -= 1;
          $fileN.style.fontSize = size + 'px';
        }
      }
      window.addEventListener('resize', function () { if ($fileN.textContent !== '\u2014') fitFileName(); });
      var $fileT   = document.getElementById('mf-file-type');
      var $bannerFacts = document.getElementById('mf-banner-facts');
      var $fileBody= document.getElementById('mf-file-body');
      var $stories = document.getElementById('mf-stories');
      var $map     = document.getElementById('mf-file-map-svg');
      var resp = modal('mf-resp-modal', 'data-resp-close', false);
      var $respTitle = document.getElementById('mf-resp-title');
      var currentMuni = null;
      var currentShort = '';
      var currentKey = null;
      var currentBallots = [];
      var booting = false;

      /* ------------- shared modal shell -------------
         Every explainer (responsibilities, district, ballot, audit outcome,
         Reality Check) renders into this one dialog. Pass a title only when
         the body doesn't already carry its own heading. */
      function openModal(html, title, variant) {
        $respTitle.style.display = title ? '' : 'none';
        $respTitle.textContent = title || '';
        // v21 · variant 'rc' gives the Reality Check explainer its own layout (black header, grey rules panel)
        resp.el.classList.toggle('is-rc', variant === 'rc');
        resp.open(html);
      }

      // v12 · phone helpers
      function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
      function isPhone() { return mq('(max-width: 640px)'); }
      function isTouch() { return mq('(hover: none), (pointer: coarse)'); }

      function scrollToWidget() {
        var target = $widget.getBoundingClientRect().top + window.pageYOffset - 24;
        window.scrollTo({ top: target, behavior: booting ? 'auto' : 'smooth' });
      }

      /* ------------- shareable URLs -------------
         v24: the address's anchor follows the file (#johannesburg, #johannesburg-ward-12; see "anchors"), so a story can link a reader
         straight to a council or a ward and an editor can share what they see. Until v24 ?muni=<key>&ward=<n>, which still works. */
      function syncUrl(key, ward) {
        if (window.EH_ANCHOR) { EH_ANCHOR.file(key, { ward: ward }); return; }
        try {
          var u = new URL(window.location.href);
          if (key) u.searchParams.set('muni', key); else u.searchParams.delete('muni');
          if (key && ward) u.searchParams.set('ward', ward); else u.searchParams.delete('ward');
          history.replaceState({ muni: key || null }, '', u);
        } catch (e) { /* file:// — no history API, ignore */ }
      }

      var active = -1;
      var current = [];

      // Show the clear (×) control whenever there's something to clear.
      function setClearVisible(v) { $clear.hidden = !v; }
      function closeList() {
        $list.classList.remove('is-open');
        $row.classList.remove('is-open');
        $input.setAttribute('aria-expanded', 'false');
      }

      /* ------------- search ------------- */

      function score(p, qLow) {
        var k = p._k;
        var idx = k.indexOf(qLow);
        if (idx < 0) return Infinity;
        if (idx === 0) return 0;
        // word-start bonus: preceded by a space, hyphen, or apostrophe
        var prev = k.charAt(idx - 1);
        if (prev === ' ' || prev === '-' || prev === "'" ) return 5;
        return 50 + idx;
      }

      function search(q) {
        var qLow = q.toLowerCase().trim();
        if (!qLow) return [];
        var shortQ = qLow.length < 3;   // 1–2 char queries: only start / word-start matches
        var hits = [];
        for (var i = 0; i < PLACES.length; i++) {
          var s = score(PLACES[i], qLow);
          if (s === Infinity) continue;
          if (shortQ && s > 5) continue;   // suppress mid-word noise (the "pe" inside "Cape")
          hits.push({p: PLACES[i], s: s});
        }
        // Also match municipality names directly (e.g. "Bitou", "Dr Beyers", "Mnquma")
        var seen = {};
        hits.forEach(function (h) { seen[h.p.m] = true; });
        Object.keys(MUNIS).forEach(function (key) {
          if (seen[key]) return;
          var m = MUNIS[key];
          var short = shortName(m);
          var sLow = short.toLowerCase();
          var idx = sLow.indexOf(qLow);
          if (idx < 0 && m.was && m.was.toLowerCase().split('|').some(function (w) { return w.indexOf(qLow) === 0; })) idx = 0;   // former name(s), e.g. "Ubuhlebezwe", "Ingwe|KwaSani"
          if (idx >= 0) {
            var prev = idx > 0 ? sLow.charAt(idx - 1) : '';
            var sc = idx === 0 ? 3 : ((prev === ' ' || prev === '-') ? 9 : 60 + idx);
            if (shortQ && sc > 5) return;
            seen[key] = true;
            hits.push({ p: { n: short, m: key, p: m.p, _muni: true, _kind: (m.dtype === 'district' ? 'district' : 'muni'), _n: sLow, _k: sLow }, s: sc });
            return;
          }
          if (m.dtype === 'district') return;   // districts only match by their own name, not via a dm field
          // District match: typing a district name (e.g. "Ehlanzeni" / "Ehlanzeni DM")
          // surfaces every municipality that sits inside it.
          var dmLow = (m.dm || '').toLowerCase();
          if (!dmLow) return;
          var dIdx = dmLow.indexOf(qLow);
          if (dIdx < 0 && qLow.length >= 3) {
            // also match without the trailing " dm"
            var bare = dmLow.replace(/ dm$/, '');
            dIdx = bare.indexOf(qLow);
          }
          if (dIdx < 0) return;
          if (shortQ) return;            // districts need a 3+ char query
          seen[key] = true;
          hits.push({ p: { n: short, m: key, p: m.p, _muni: true, _n: sLow, _k: sLow }, s: 30 + dIdx });
        });
        hits.sort(function (a, b) {
          if (a.s !== b.s) return a.s - b.s;
          return a.p._n.length - b.p._n.length;
        });
        return hits.slice(0, 8).map(function (h) { return h.p; });
      }

      /* ------------- highlight ------------- */

      function highlight(name, q) {
        if (!q) return esc(name);
        var nLow = name.toLowerCase();
        var qLow = q.toLowerCase();
        var i = nLow.indexOf(qLow);
        if (i < 0) return esc(name);
        return esc(name.slice(0, i)) +
               '<mark>' + esc(name.slice(i, i + qLow.length)) + '</mark>' +
               esc(name.slice(i + qLow.length));
      }

      /* ------------- render suggestions ------------- */

      function render(hits, q) {
        current = hits;
        active = hits.length ? 0 : -1;
        if (!q.trim()) {
          closeList();
          return;
        }
        if (!hits.length) {
          $list.innerHTML =
            '<div class="mf-empty">' +
              '<p>We don&rsquo;t have &ldquo;<b>' + esc(q) + '</b>&rdquo; in the index of 12,000+ places. A few farms and tiny settlements may not resolve. ' +
              'Try the nearest town or your municipality&rsquo;s name.</p>' +
            '</div>';
        } else {
          $list.innerHTML = hits.map(function (p, i) {
            var m = MUNIS[p.m];
            var prov = PROVS[p.p] || p.p;
            var muniLabel = m ? shortName(m) : p.m;
            var isMuni = p._muni;
            var isDist = p._kind === 'district' || (m && m.dtype === 'district');
            var metaLine = isDist
              ? 'District municipality · ' + prov + (m ? ' · ' + m.members.length + ' municipalities' : '')
              : (isMuni ? 'Municipality' : 'Town / area') + ' · ' + prov + (m && m.dm ? ' · ' + m.dm : '');
            var isMetro = m && m.t === 'Metropolitan';
            var rightCol = isDist
              ? 'District municipality'
              : (isMuni
                  ? (isMetro ? 'Metro' : 'Local municipality')
                  : esc(muniLabel) + (isMetro && !/ Metro$/.test(muniLabel) ? ' Metro' : ''));
            return (
              '<div class="mf-suggest-item' + (i === 0 ? ' is-active' : '') + '" ' +
                'role="option" data-i="' + i + '" tabindex="-1">' +
                '<div>' +
                  '<div class="name">' + highlight(p.n, q) + '</div>' +
                  '<div class="meta">' + metaLine + '</div>' +
                '</div>' +
                '<div class="muni">' + rightCol + '</div>' +
              '</div>'
            );
          }).join('');
        }
        $list.classList.add('is-open');
        $row.classList.add('is-open');
        $input.setAttribute('aria-expanded', 'true');
      }

      function setActive(i) {
        if (!current.length) return;
        if (i < 0) i = current.length - 1;
        if (i >= current.length) i = 0;
        active = i;
        var nodes = $list.querySelectorAll('.mf-suggest-item');
        nodes.forEach(function (n, j) {
          n.classList.toggle('is-active', j === i);
        });
        var el = nodes[i];
        if (el) {
          var top = el.offsetTop, bot = top + el.offsetHeight;
          if (top < $list.scrollTop) $list.scrollTop = top;
          else if (bot > $list.scrollTop + $list.clientHeight) $list.scrollTop = bot - $list.clientHeight;
        }
      }

      /* ------------- tagged-stories widget: live DM stories (muni-stories.js) ------------- */

      /* Off for now: set STORIES_ON to true to bring the widget back. */
      var STORIES_ON = false;
      function renderStories(m, key, name) {
        if (!STORIES_ON) { $stories.hidden = true; return; }
        if (window.MuniStories) MuniStories.render($stories, m, key, name);
      }

      /* ------------- pick + open file ------------- */

      function pick(p) {
        $input.value = p.n;
        setClearVisible(true);
        closeList();
        // v12: close the on-screen keyboard so the file it opens isn't hidden behind it.
        if (isTouch() && document.activeElement === $input) $input.blur();
        openFile(p);
        syncUrl(p.m);
      }
      // post-elections v23.32: a council found with the search, Use my location or a ?muni= link opens its province in the tabs under the
      // finder (EH_AREA), as the area dropdown would; the page opens on South Africa. Councils opened from the tabs leave the area as it is.
      function followArea(key) { var m = MUNIS[key], A = window.EH_AREA; if (m && m.p && A && A.set) A.set(m.p, true); }
      function choose(p) { pick(p); followArea(p.m); }

      /* ------------- open a district file from its label ------------- */

      function districtKey(dm) {
        var found = null;
        Object.keys(MUNIS).forEach(function (k) {
          if (MUNIS[k].dtype === 'district' && MUNIS[k].dmName === dm) found = k;
        });
        return found;
      }

      function openDistrict(dm) {
        if (!dm) return;
        var key = districtKey(dm);
        if (key) { pickKey(key); }
      }

      // Clicking a district-municipality label opens that district's file.
      document.addEventListener('click', function (e) {
        var dmEl = e.target.closest('a[data-dm]');
        if (!dmEl) return;
        e.preventDefault(); e.stopPropagation();
        if (!resp.el.hidden) resp.close();
        openDistrict(dmEl.getAttribute('data-dm'));
      }, true);
      function dmLink(dm) {
        return '<a class="mf-dm-link" href="#mf-widget" data-dm="' + esc(dm) + '">' + esc(dm) + '</a>';
      }

      function buildBallots(m, shortName) {
        var INK = '#6b6b66', BLU = '#946800', GRN = 'var(--dm-green)';
        var isMetro = (m.t === 'Metropolitan');
        var dist = m.dm || 'the district council';
        var list = isMetro ? [
          ['Ballot 1', INK, 'Ward councillor', 'The person who represents your ward directly',
            'On this ballot you vote for a <b>person</b>, not a party &ndash; the candidate you want to represent your specific ward on the ' + esc(shortName) + ' metro council. Whoever wins the most votes in your ward takes the seat outright (first-past-the-post). About <b>half</b> of the council&rsquo;s seats are filled this way, with one councillor per ward. This is your most direct line to a named representative you can hold accountable.'],
          ['Ballot 2', BLU, 'Council party list', 'Your party choice for ' + esc(shortName) + ' council seats',
            'Here you vote for a <b>party</b> (or a qualifying independent candidate). These votes are pooled across the whole metro and used to top up the council so that each party&rsquo;s total share of seats matches its share of the vote &ndash; this is known as <b>proportional representation</b>. Together with the ward results, this ballot decides the overall balance of the council and, ultimately, which party or coalition can assemble the majority needed to elect the mayor.']
        ] : [
          ['Ballot 1', INK, 'Ward councillor', 'Your ward&rsquo;s seat on the local council',
            'You vote for a <b>person</b> to represent your ward on the <b>' + esc(shortName) + ' council</b>. The candidate with the most votes in the ward wins the seat (first-past-the-post). About half of the local council is elected this way, with one councillor per ward.'],
          ['Ballot 2', BLU, 'Local party list', 'Your party for ' + esc(shortName) + ' council seats',
            'You vote for a <b>party</b> for the ' + esc(shortName) + ' council. These votes are added up across the whole municipality and used to make each party&rsquo;s share of seats proportional to its share of the vote. The ward seats and these proportional seats together make up your local council.</p><p class="mf-resp-note"><b>So who becomes mayor?</b><br>No one votes for the mayor directly. At the first sitting of the new council, the elected councillors vote to elect the mayor. That is why, when no party wins outright, coalitions decide who runs your municipality.'],
          ['Ballot 3', GRN, 'District party list', 'Your party for <b>' + (m.dm ? dmLink(m.dm) : esc(dist)) + '</b>',
            'Because ' + esc(shortName) + ' sits inside <b>' + (m.dm ? dmLink(m.dm) : esc(dist)) + '</b>, you also help to elect the <b>district municipality</b>, which is the body that coordinates services across several local municipalities. This is a party-list (proportional) vote. Around 40% of the district council is filled directly from these votes; the remaining seats are taken by councillors sent from the local councils in the district.']
        ];
        currentBallots = list.map(function (b) {
          return { label: b[0], color: b[1], title: b[2], lead: b[3], detail: b[4] };
        });
        var rows = list.map(function (b, i) {
          return '<div class="mf-ballot-row' + (!isMetro && i === 2 ? ' is-district' : '') + '" data-ballot="' + i + '" role="button" tabindex="0" ' +
              'aria-label="' + esc(b[0] + ': ' + b[2]) + ' — what this ballot is for">' + ballotPaper(b[1]) +
            '<div class="mf-ballot-cap">' +
              '<span class="mf-ballot-k" style="color:' + b[1] + '">' + b[0] + '</span>' +
              '<b>' + b[2] + '</b>' +
              '<span class="mf-ballot-d">' + b[3] + '</span>' +
            '</div></div>';
        }).join('');
        var intro = isMetro
          ? 'You get <b>two ballots</b>, each marked with a single X.'
          : 'You get <b>three ballots</b>. The third is for the district municipality.';
        return '<p class="mf-ballot-intro">' + intro + '</p>' +
          '<div class="mf-ballot-list">' + rows + '</div>';
      }

      // Short, human display name shared by search, suggestions and files.
      function shortName(m) {
        return m.n
          .replace(/ Local Municipality$/, '')
          .replace(/^City of /, '')
          .replace(/ District Municipality$/, ' District');
      }

      // Open a municipality by its MUNIS key (used by district member lists).
      function pickKey(key) {
        var m = MUNIS[key];
        if (!m) return;
        var s = shortName(m), sl = s.toLowerCase();
        pick({ n: s, m: key, p: m.p, _muni: true, _kind: (m.dtype === 'district' ? 'district' : 'muni'), _n: sl, _k: sl });
      }

      function DIST_RESP_HTML(name) {
        return '<p class="mf-resp-intro">South Africa has <b>three spheres of local government</b>. ' +
            'Where you don&rsquo;t live in a metro, the work is split between a <b>local municipality</b> ' +
            '(the one on your ballot) and the <b>district municipality</b> that sits above several locals.</p>' +
          '<div class="mf-resp-sec"><h3 class="mf-resp-h">What the district handles</h3><ul class="mf-resp-list">' +
            li('var(--dm-blue)', 'District-wide planning &amp; coordination', 'The integrated development plan that ties the local municipalities together.') +
            li('var(--dm-blue)', 'Bulk &amp; shared services', 'In many districts, bulk water and sanitation, regional landfill sites and firefighting that no single local could run alone.') +
            li('var(--dm-blue)', 'Supporting weaker municipalities', 'Capacity and shared technical staff for smaller local councils in the district.') +
            li('var(--dm-blue)', 'Municipal health services', 'Environmental health across the district.') +
          '</ul></div>' +
          '<div class="mf-resp-sec"><h3 class="mf-resp-h">What stays with your local municipality</h3>' +
            '<p class="mf-resp-note">Your day-to-day services &ndash; the water in your tap, refuse collection, local roads, electricity reticulation, building plans and libraries &ndash; are run by the <b>local</b> municipality, not ' + esc(name) + '. That is the council you elect directly with your ward and party ballots.</p></div>' +
          '<div class="mf-resp-sec"><h3 class="mf-resp-h">Who sits on the district council</h3>' +
            '<p class="mf-resp-note">You don&rsquo;t get a separate ballot for &ldquo;the district mayor&rdquo;. About <b>40%</b> of the district council is elected directly through the district party-list ballot you mark on election day; the remaining <b>~60%</b> are councillors delegated from the local councils inside the district. They then elect the district mayor between them.</p></div>' +
          '<p class="mf-resp-caveat">Exact powers vary: some functions (notably water and sanitation) are assigned to the district in some areas and to the local municipality in others, by the minister. (Source: Municipal Structures Act; division of functions per the Municipal Demarcation Board / the Department of Cooperative Governance and Traditional Affairs)</p>';
      }

      function openDistResp() {
        openModal(DIST_RESP_HTML(currentShort || 'this district'), 'What a district municipality does');
      }

      /* =========================================================
         FILE COMPONENTS
         Each function below returns the markup for one block of a
         municipal file. They are the seams a component rewrite would
         cut along — one function, one component, no shared state
         beyond the arguments passed in.
         ========================================================= */

      // <DistrictBannerFacts> — seat-count facts in the black banner.
      function DistrictBannerFacts(n) {
        return '<div class="bf bf-count"><span class="lbl">Local municipalities</span><span class="v">' + n + '</span></div>' +
          '<div class="bf wide"><span class="lbl">District council</span>' +
            '<span class="v">Indirectly elected<span class="sub">~40% by district PR ballot · ~60% delegated from local councils</span></span></div>';
      }

      // <DistrictMemberList> — post-elections v1: the local municipalities inside a district, each with its result
      // (filled from EH_RES) and clickable through to its own file.
      function DistrictMemberList(m) {
        var rows = m.members.map(function (k) {
          var mm = MUNIS[k];
          if (!mm) return '';
          var ms = shortName(mm);
          var pop = mm.pop ? '<span class="pop">' + esc(mm.pop) + ' residents</span>' : '';
          return '<button class="mf-dist-muni" type="button" data-pick="' + k + '" aria-label="Open ' + esc(ms) + '">' +
              '<span class="mf-dist-rt"><span class="nm">' + esc(ms) + '</span>' + pop + '</span>' +
              '<span class="mf-dist-rb" data-chip="' + k + '"><span class="bf-wait mf-chip-wait" aria-hidden="true"></span></span>' +
              '<span class="mf-dist-go" aria-hidden="true">&rsaquo;</span>' +
            '</button>';
        }).join('');
        return '<div class="mf-dist-list"><div class="mf-dist-munis">' + rows + '</div></div>';
      }
      function DistrictFactsRes(n, R) {
        var council = R && R.seatsTotal
          ? '<span class="v">' + R.seatsTotal + ' seats<span class="sub">' + (R.seated
              ? R.seated + ' elected on the district ballot, ' + (R.seatsTotal - R.seated) + ' sent by the local councils'
              : 'About 40% elected on the district ballot, the rest sent by the local councils') + '</span></span>'
          : '<span class="v">Indirectly elected<span class="sub">~40% by district PR ballot · ~60% delegated from local councils</span></span>';
        return '<div class="bf bf-count"><span class="lbl">Local municipalities</span><span class="v">' + n + '</span></div>' +
          '<div class="bf wide"><span class="lbl">District council</span>' + council + '</div>';
      }
      function paintDistrict(m, key, t) {
        if (EH_RES.S.state === 'error') {   // v23: the results not read yet; the page tries again by itself
          var $m0 = muniGovEl(), eb = document.getElementById('mf-res');
          $m0.innerHTML = EH_RES.render.councilBox(null); $m0.hidden = false; syncFileSrc();
          if (eb) eb.innerHTML = EH_RES.errMsg('mf-res-msg');
          return;
        }
        EH_RES.council(key).then(function (R) {
          if (t !== govTicket) return;
          $bannerFacts.innerHTML = DistrictFactsRes(m.members.length, R);
          var $mg = muniGovEl();
          $mg.innerHTML = EH_RES.render.councilBox(R);
          $mg.hidden = false;
          syncFileSrc();
          var box = document.getElementById('mf-res');
          if (box) EH_RES.render.fill(box, key, R);
        }, function () {
          if (t !== govTicket) return;
          var box = document.getElementById('mf-res');
          if (box) box.innerHTML = EH_RES.errMsg('mf-res-msg');
        });
        m.members.forEach(function (k) {
          EH_RES.council(k).then(function (R) {
            if (t !== govTicket) return;
            var el = $fileBody.querySelector('[data-chip="' + k + '"]');
            if (el) el.innerHTML = EH_RES.render.chip(R);
          }, function () {});
        });
      }

      function openDistrictFile(m, p) {
        var short = shortName(m);
        var n = m.members.length;

        $fileN.textContent = short; fitFileName();
        $fileT.innerHTML = '<strong>District municipality</strong> · ' + esc(PROVS[m.p] || m.p);
        $fileT.classList.remove('has-pop');
        var t = ++govTicket;
        var $mg = muniGovEl();
        $mg.innerHTML = RES_WAIT;
        $mg.hidden = false;
        syncFileSrc();
        $bannerFacts.className = 'mf-banner-facts is-district';
        $bannerFacts.innerHTML = DistrictFactsRes(n, null);

        wardHome();
        $fileBody.className = 'mf-file-body mf-file-body--res mf-file-body--dist';
        $fileBody.innerHTML =
          '<div class="mf-file-left">' +
            '<div class="mf-res" id="mf-res">' + EH_RES.wait() + '</div>' +   // v23.22: the district's results above its local councils
            '<div class="mf-res-sec mf-res-members">' + DistrictMemberList(m) + '</div>' +   // v23.35: no heading
          '</div>';   // v23.23: no What does a district municipality do? button
        paintDistrict(m, p.m, t);

        $hint.innerHTML = '<b>' + esc(short) + '</b> is a district municipality in <b>' +
          esc(PROVS[m.p] || m.p) + '</b>, covering ' + n + ' local ' + (n === 1 ? 'municipality' : 'municipalities') + '.';
        setClearVisible(true);
        $widget.classList.add('is-result');
        currentMuni = m;
        currentKey = p.m;
        currentShort = short;
        if (window.MuniStories) MuniStories.cancel(); $stories.hidden = true; $stories.innerHTML = '';
        if (window.SA_LOCATOR) SA_LOCATOR.render($map, p.m, m.p);
        hideWards();
        scrollToWidget();
      }

      /* ------------- Reality Check star rating (v7) -------------
         Calculated the same way for every local and metropolitan council,
         only from figures in the Auditor-General's MFMA 2024-25 report:
           ag  audit outcomes 2020/21-2024/25 (m.ag5): clean 5, unqualified 4,
               qualified 3, adverse 2, disclaimer / outstanding 1; averaged
           ex  unauthorised + irregular + fruitless & wasteful expenditure
               (MF_UIFW), five-year average per resident (Census 2022),
               scored by national fifth
           w/e water / electricity losses 2024/25, scored by national fifth
         Trend (ag, ex): 2024/25 against 2020/21, better +1, worse -1.
         Every measure score is kept within 1-5. Fifths: cut-offs at the
         20/40/60/80th percentile values (nearest rank) across all locals
         and metros reporting the figure; lower is better; compared at
         display precision, so the bands in the explainer are the rule.
         Losses: 'na' left out; 'nd' / 'pnd' / 'nf' score 1. Rating = mean
         of the measure scores, rounded to the nearest half star (halves
         round up). No overrides. */
      var RC_AG_PTS = { clean: 5, unqualified: 4, qualified: 3, adverse: 2, disclaimer: 1, outstanding: 1 };
      var RC_MEASURES = [
        { k: 'ag', name: 'Audit outcomes' },
        { k: 'ex', name: 'Unauthorised, irregular, fruitless and wasteful expenditure', rand: true },
        { k: 'w', name: 'Water losses', pct: true },
        { k: 'e', name: 'Electricity losses', pct: true }
      ];
      function rcRound(v, rand) {
        return rand ? (v < 10 ? Math.round(v * 100) / 100 : Math.round(v)) : Math.round(v * 10) / 10;
      }
      function rcClamp(v) { return Math.max(1, Math.min(5, Math.round(v * 10) / 10)); }
      function rcTotals(key) {
        var F = window.MF_UIFW, d = F && F.data[key];
        if (!d || !d.u || !d.i || !d.f) return null;
        var t = F.years.map(function (_, y) {
          return (d.u[y] == null || d.i[y] == null || d.f[y] == null) ? null : d.u[y] + d.i[y] + d.f[y];
        });
        return t.some(function (v) { return v == null; }) ? null : t;
      }
      function rcRaw(key, ms) {
        if (ms.k === 'ex') {
          var t = rcTotals(key), pop = MUNIS[key] && MUNIS[key].popN;
          if (!t || !pop) return null;
          return t.reduce(function (a, b) { return a + b; }, 0) / t.length / pop;
        }
        var d = window.MF_UIFW && window.MF_UIFW.data[key];
        if (!d) return null;
        return ms.k === 'w' ? d.water : d.elec;
      }
      // District municipalities are not rated: stars are for local and metropolitan councils only.
      var rcCuts = null;
      function rcIsDist(key) { return !!(MUNIS[key] && MUNIS[key].dtype === 'district'); }
      function rcCutoffs() {
        if (rcCuts) return rcCuts;
        rcCuts = {};
        var F = window.MF_UIFW;
        var keys = F ? Object.keys(F.data).filter(function (k) {
          return MUNIS[k] && MUNIS[k].dtype !== 'district' && k.indexOf('dc_') !== 0;
        }) : [];
        RC_MEASURES.forEach(function (ms) {
          if (!ms.rand && !ms.pct) return;
          var vals = [];
          keys.forEach(function (k) { var v = rcRaw(k, ms); if (typeof v === 'number') vals.push(rcRound(v, ms.rand)); });
          vals.sort(function (a, b) { return a - b; });
          rcCuts[ms.k] = { n: vals.length, t: [0.2, 0.4, 0.6, 0.8].map(function (p) { return vals[Math.max(0, Math.ceil(p * vals.length) - 1)]; }) };
        });
        return rcCuts;
      }
      function rcFifth(ms, v) {
        var t = rcCutoffs()[ms.k].t;
        for (var i = 0; i < 4; i++) if (v <= t[i]) return 5 - i;
        return 1;
      }
      function rcMeasure(key, ms) {
        if (ms.k === 'ag') {
          var a5 = MUNIS[key].ag5;
          if (!a5 || a5.length < 2) return null;
          var pts = a5.map(function (o) { return RC_AG_PTS[o]; });
          if (pts.some(function (p) { return p == null; })) return null;
          var avg = Math.round(pts.reduce(function (a, b) { return a + b; }, 0) / pts.length * 10) / 10;
          var last = pts[pts.length - 1];
          var tr = last > pts[0] ? 1 : last < pts[0] ? -1 : 0;
          return { ms: ms, pts: pts, base: avg, tr: tr, s: rcClamp(avg + tr) };
        }
        var v = rcRaw(key, ms);
        if (v == null) return null;
        if (v === 'na') return { ms: ms, skip: true, code: v };
        if (typeof v === 'string') return { ms: ms, s: 1, base: 1, code: v };
        var r = rcRound(v, ms.rand), base = rcFifth(ms, r);
        if (ms.k !== 'ex') return { ms: ms, v: r, base: base, s: base };
        var t = rcTotals(key), lastT = t[t.length - 1];
        var tr2 = lastT < t[0] ? 1 : lastT > t[0] ? -1 : 0;
        return { ms: ms, v: r, base: base, tr: tr2, first: t[0], last: lastT,
          avgT: t.reduce(function (a, b) { return a + b; }, 0) / t.length, s: rcClamp(base + tr2) };
      }
      function rcRating(key) {
        if (!key || !MUNIS[key] || rcIsDist(key)) return null;
        var parts = RC_MEASURES.map(function (ms) { return rcMeasure(key, ms); });
        if (parts.some(function (p) { return p === null; })) return null;
        var used = parts.filter(function (p) { return !p.skip; });
        if (!used.length) return null;
        var avg = Math.round(used.reduce(function (a, p) { return a + p.s; }, 0) / used.length * 1e4) / 1e4;
        return { parts: parts, used: used, avg: avg, stars: Math.round(avg * 2) / 2 };
      }
      function rcNum(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
      function rcThou(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
      function rcPer(v) { return !v ? 'R0' : v < 10 ? 'R' + v.toFixed(2).replace('.', ',') : 'R' + rcThou(v); }
      function rcPct(v) { return String(v).replace('.', ',') + '%'; }
      var RC_STAR = '<svg class="rc-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5L14.5 8.6L22 8.8L16 13.3L18.2 20.5L12 16.2L5.8 20.5L8 13.3L2 8.8L9.5 8.6Z"/></svg>';
      var RC_STARS5 = RC_STAR + RC_STAR + RC_STAR + RC_STAR + RC_STAR;
      function rcStarsHtml(s, cls) {
        return '<span class="rc-stars' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' +
          '<span class="base">' + RC_STARS5 + '</span>' +
          '<span class="fill" style="width:' + (s / 5 * 100).toFixed(1) + '%">' + RC_STARS5 + '</span></span>';
      }

      // <FileTypeLine> — "Local municipality · Eastern Cape · Amathole DM",
      // where the district is a link through to the district's own file.
      function FileTypeLine(m) {
        var dmLink = m.dm
          ? '<span class="mf-type-dm"><span class="sep"> · </span><a class="mf-type-link" href="#mf-widget" data-dm="' + esc(m.dm) +
              '" role="button" aria-label="Show every municipality in ' + esc(m.dm) + '"><strong>' +
              esc(m.dm) + '</strong></a></span>'
          : '';
        var txt = '<strong>' + esc(m.t + ' municipality') + '</strong> · ' + esc(PROVS[m.p] || m.p) + dmLink;
        return txt;
      }

      // <AuditPair> — the Auditor-General's opinions for the last five years
      // (MFMA 2024/25, Annexure 3), oldest to newest on one line, each chip
      // opening the outcome explainer.
      function AuditPair(m) {
        function agChipHtml(key, label, year) {
          var lead = AG_OUTCOMES.lead[key];
          var scale = AG_OUTCOMES.order.map(function (k) {
            return '<li' + (k === key ? ' class="is-current"' : '') + '><span class="ag-chip ag-' + k + '" aria-hidden="true">' + esc(AG_OUTCOMES.meta[k].short) + '</span>' +
              '<span class="mf-ag5-pop-txt">' + AG_OUTCOMES.scale[k] + '</span></li>';
          }).join('');
          return '<span class="ag-chip ag-' + key + ' mf-ag5-chip" data-ag="' + key + '" role="button" tabindex="0" aria-expanded="false" aria-label="' + year + ': ' + esc(label) +
            ' \u2014 what this Auditor-General result means">' + esc(label) + '</span>' +
            '<span class="cs-info-pop mf-ag5-pop" role="note" hidden><span class="cs-def"><b class="cs-def-h">' + year + ': ' + AG_OUTCOMES.meta[key].name + '</b><span class="cs-def-txt">' + lead + '</span></span>' +
              '<span class="cs-def mf-ag5-pop-scale"><b class="cs-def-h">The six outcomes \u2013 best to worst</b><ul>' + scale + '</ul></span></span>';
        }
        var years = window.AG_ANNEX3.years, keys = m.ag5 || [];
        var cells = years.map(function (y, i) {
          var k = (keys[i] && AG_OUTCOMES.meta[keys[i]]) ? keys[i] : 'none';
          return '<div class="mf-ag5-cell' + (i === years.length - 1 ? ' is-latest' : '') + '">' +
              '<span class="yr">' + y + '</span>' + agChipHtml(k, AG_OUTCOMES.meta[k].short, y) +
            '</div>';
        }).join('');
        return '<div class="mf-v4-ag">' +
            '<div class="mf-v4-ag-head" style="padding-top:0;margin-top:0"><span class="lbl" style="font-size:27px">Audit outcomes' + infoPop(AG_INFO, 'border-radius:10px') + '</span>' +
            '</div>' +
            '<div class="mf-ag5"><div class="mf-ag5-row" style="--n:' + years.length + '">' + cells + '</div></div>' +
          '</div>';
      }

      // <Expenditure> — unauthorised, irregular, fruitless & wasteful
      // expenditure as three lines on one chart, on the same five-year grid
      // as the audit outcomes. Hover a year for its three figures.
      function fmtRand(n, long) {
        if (n == null) return '\u2014';
        if (!n) return 'R0';
        function dec(v) { return v.toFixed(2).replace(/0$/, '').replace('.', ','); }
        if (n >= 1e9) return 'R' + dec(n / 1e9) + (long ? ' billion' : 'bn');
        if (n >= 1e6) return 'R' + dec(n / 1e6) + (long ? ' million' : 'm');
        return 'R' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
      }
      function fmtAxis(n) {
        if (!n) return 'R0';
        function t(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }
        if (n >= 1e9) return 'R' + t(n / 1e9) + 'bn';
        if (n >= 1e6) return 'R' + t(n / 1e6) + 'm';
        if (n >= 1e3) return 'R' + t(n / 1e3) + 'k';
        return 'R' + Math.round(n);
      }
      var UIFW_LINES = [
        { k: 'u', label: 'Unauthorised', color: 'var(--dm-blue)' },
        { k: 'i', label: 'Irregular', color: 'var(--dm-red)' },
        { k: 'f', label: 'Fruitless &amp; wasteful', color: 'var(--dm-orange)' }
      ];
      // "?" button and its definition popup; the document click handler below opens and closes them.
      function infoBtn(html, popStyle) {
        return '<button type="button" class="cs-info" aria-label="What does this mean?" aria-expanded="false">?</button>' +
          '<span class="cs-info-pop" role="note"' + (popStyle ? ' style="' + popStyle + '"' : '') + ' hidden>' + html + '</span>';
      }
      function infoPop(html, popStyle) { return '<span class="cs-info-wrap">' + infoBtn(html, popStyle) + '</span>'; }
      var AG_INFO = '<span class="cs-def"><b class="cs-def-h">What the audit measures.</b><span class="cs-def-txt">Every year the Auditor-General checks whether a municipality\u2019s financial statements are accurate, whether it obeyed the laws on how public money is spent, and whether it reported honestly on what it delivered. The outcome tells residents how far they can trust the council\u2019s own account of their money.</span></span>';
      var UIFW_INFO = '<span class="cs-def"><b class="cs-def-h">Unauthorised:</b><span class="cs-def-txt">Spending that went over the budget approved by council, or was used for something the budget did not allow.</span></span>' +
        '<span class="cs-def"><b class="cs-def-h">Irregular:</b><span class="cs-def-txt">Spending that broke the law or the rules, most often procurement rules. It does not necessarily mean money was stolen or lost.</span></span>' +
        '<span class="cs-def"><b class="cs-def-h">Fruitless and wasteful:</b><span class="cs-def-txt">Spending that bought nothing and could have been avoided with reasonable care, such as interest and penalties on late payments.</span></span>';
      function Expenditure(key) {
        var F = window.MF_UIFW, d = F && F.data[key];
        if (!d || !d.u || !d.i || !d.f) return '';
        var n = F.years.length, W = 540, H = 190, T = 22, B = 8;
        var max = 0;
        UIFW_LINES.forEach(function (L) { d[L.k].forEach(function (v) { if (v != null && v > max) max = v; }); });
        var step = 1;
        if (max > 0) {
          var raw = max / 3, mag = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / mag;
          step = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
        }
        var top = Math.max(step, Math.ceil(max / step) * step);
        function x(i) { return (i + 0.5) * W / n; }
        function y(v) { return T + (H - T - B) * (1 - v / top); }
        var grid = '';
        for (var g = 0; g <= top + step / 2; g += step) {
          grid += '<line x1="0" x2="' + W + '" y1="' + y(g) + '" y2="' + y(g) + '" class="mf-uifw-grid"' + (g === 0 ? ' style="stroke:var(--dm-ink-4)"' : '') + '></line>' +
            '<text x="2" y="' + (y(g) - 5) + '" class="mf-uifw-tick">' + fmtAxis(g) + '</text>';
        }
        var lines = UIFW_LINES.map(function (L) {
          var pts = [], dots = '';
          d[L.k].forEach(function (v, i) {
            if (v == null) return;
            pts.push(x(i).toFixed(1) + ',' + y(v).toFixed(1));
            dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5" style="fill:' + L.color + '"></circle>';
          });
          return '<polyline points="' + pts.join(' ') + '" fill="none" style="stroke:' + L.color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></polyline>' + dots;
        }).join('');
        var hits = F.years.map(function (yr, i) {
          var tip = yr + ': unauthorised ' + fmtRand(d.u[i], true) + ' \u00b7 irregular ' + fmtRand(d.i[i], true) +
            ' \u00b7 fruitless & wasteful ' + fmtRand(d.f[i], true);
          return '<rect x="' + (i * W / n) + '" y="0" width="' + (W / n) + '" height="' + H + '" fill="transparent"><title>' + esc(tip) + '</title></rect>';
        }).join('');
        var legend = UIFW_LINES.map(function (L) {
          return '<span class="mf-uifw-key"><i style="background:' + L.color + '"></i>' + L.label + '</span>';
        }).join('');
        var yrs = F.years.map(function (yr, i) {
          return '<div class="mf-ag5-cell' + (i === n - 1 ? ' is-latest' : '') + '"><span class="yr">' + yr + '</span></div>';
        }).join('');
        var srText = UIFW_LINES.map(function (L) {
          return L.label.replace('&amp;', 'and') + ': ' + F.years.map(function (yr, i) { return yr + ' ' + fmtRand(d[L.k][i], true); }).join(', ');
        }).join('. ');
        return '<div class="mf-v4-uifw">' +
            '<span class="cs-h" style="height:42px;padding-top:0;margin-top:2px">Unauthorised, irregular, fruitless &amp; wasteful <span style="white-space:nowrap">expenditure' + infoPop(UIFW_INFO) + '</span></span>' +
            '<div class="mf-uifw-legend">' + legend + '</div>' +
            '<div class="mf-ag5 mf-uifw-chart">' +
              '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(srText) + '">' + grid + lines + hits + '</svg>' +
              '<div class="mf-ag5-row" style="--n:' + n + '">' + yrs + '</div>' +
            '</div>' +
          '</div>';
      }

      // <Losses> — share of water and electricity lost, latest year only.
      // A code in place of a number prints the sheet's wording; an asterisk
      // marks a disclosure the Auditor-General qualified.
      document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('#dm-eh .cs-info, #dm-eh .mf-ag5-chip, #dm-eh button.ehh-cap-btn, #dm-eh button.mf-seat-tag');
        var pop = btn && btn.nextElementSibling, open = pop && pop.hidden;
        document.querySelectorAll('#dm-eh .cs-info-pop').forEach(function (p) {
          p.hidden = true;
          if (p.previousElementSibling) p.previousElementSibling.setAttribute('aria-expanded', 'false');
        });
        if (open) { pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
      });
      var LOSS_TXT = { na: 'Not a service provider', nd: 'Not disclosed', pnd: 'Percentage not disclosed', nf: 'Audit not finalised' };
      function Losses(key) {
        var F = window.MF_UIFW, d = F && F.data[key];
        if (!d) return '';
        var showW = d.water != null && d.water !== 'na', showE = d.elec != null && d.elec !== 'na';
        if (!showW && !showE) return '';
        function row(label, norm, info, v, q, pt, pb) {
          var val = v == null ? '<b class="cs-v">\u2014</b>'
            : typeof v === 'string' ? '<span class="cs-v is-txt">' + esc(LOSS_TXT[v] || v) + '</span>'
            : '<b class="cs-v">' + String(v).replace('.', ',') + '%' + (q ? '<span class="cs-q">*</span>' : '') + '</b>';
          return '<li style="padding-top:' + pt + 'px;padding-bottom:' + pb + 'px"><span class="cs-l" style="font-size:20px"><span class="cs-name">' + label + infoBtn(info) + '</span> <span class="cs-norm">(' + norm + ')</span></span>' + val + '</li>';
        }
        return '<div class="mf-v4-loss">' +
            (showW ? '<ul class="cs-list">' + row('Water losses', 'National Treasury norm: 15\u201330%', 'The share of water the municipality bought or produced that was never billed to a customer. It is lost through leaks, burst pipes, faulty meters and illegal connections.', d.water, d.wq, 21, showE ? 4 : 10) + '</ul>' : '') +
            (showE ? '<ul class="cs-list">' + row('Electricity losses', 'National Treasury norm: 7\u201310%', 'The share of electricity the municipality bought from Eskom or generated that was never billed to a customer. It is lost through ageing networks, theft, illegal connections and faulty meters.', d.elec, d.eq, showW ? 5 : 21, 10) + '</ul>' : '') +
            ((showW && d.wq) || (showE && d.eq) ? '<p class="cs-fn">* The disclosure was qualified in the auditor\u2019s report (AGSA MFMA 2024-25)</p>' : '') +
          '</div>';
      }

      // <RealityCheck> — the calculated star rating (see rcRating).
      function RealityCheck(m, key) {
        var r = rcRating(key);
        var wm = '<span class="rc-wm"><em>Reality Check</em></span>';
        // Rated: the whole black button opens the explainer. Not rated: same button look, not clickable.
        var top = r
          ? '<div class="mf-v4-assess-top is-btn" data-rc="1" role="button" tabindex="0" title="How this rating is calculated" aria-label="Reality Check rating: ' +
              rcNum(r.stars) + ' out of 5. How this rating is calculated">' + wm + '<span class="rc-rating">' + rcStarsHtml(r.stars) + '</span></div>'
          : '<div class="mf-v4-assess-top">' + wm + '<span class="rc-na">Not yet rated</span></div>';
        return '<div class="mf-v4-assess">' + top + '</div>';
      }

      // <VerifiedData> — the file's left column: audits, then Reality Check.
      function VerifiedData(m, key) {
        return '<div class="mf-v4-stats">' + AuditPair(m) + Expenditure(key) + Losses(key) + '<a class="mf-v4-ag-src mf-v4-mfma-src" href="https://mfma-2025.agsa.co.za/" target="_blank" rel="noopener">Source: Auditor-General of South Africa, MFMA 2024-25 report</a>' + RealityCheck(m, key) + WhatsAppShare(shortName(m), key).replace('class="mf-wa"', 'class="mf-wa mf-wa--m"') + '</div>';
      }

      // <BallotAside> — the file's right column: the ballot card, then the
      // WhatsApp share button for this municipality.
      function BallotAside(m, name, key) {
        return '<div class="mf-actions mf-actions-top">' +
            '<button class="mf-action-ghost" type="button" data-resp="1">What is this council responsible for?</button>' +
          '</div>' +
          '<div class="mf-file-card">' + buildBallots(m, name) + '</div>' + WhatsAppShare(name, key);
      }

      // <WhatsAppShare> — opens WhatsApp with a message that links straight
      // to this municipality's file on the current page (v24: by its anchor, #johannesburg-ward-12, see "anchors"; until v24 ?muni=<key>)
      function waHref(name, key, ward) {
        var an = window.EH_ANCHOR ? EH_ANCHOR.council(key, { ward: ward }) : '';
        var url = window.location.href.split(/[?#]/)[0] + (an ? '#' + an : '?muni=' + encodeURIComponent(key) + (ward ? '&ward=' + encodeURIComponent(ward) : ''));
        var msg = (ward ? name + ', Ward ' + ward : name) + ' election results on Daily Maverick\u2019s Elections Hub: ' + url;
        return 'https://wa.me/?text=' + encodeURIComponent(msg);
      }
      function waBtn(name, key, ward) {
        return '<a class="mf-wa-btn" data-name="' + esc(name) + '" data-key="' + esc(key) + '" href="' + waHref(name, key, ward) + '" target="_blank" rel="noopener">' +
          '<span>Share <span class="on">on</span> WhatsApp</span></a>';
      }
      function WhatsAppShare(name, key) {
        return '<div class="mf-wa">' + waBtn(name, key) + '</div>';
      }
      // post-elections v21: in a council's results file the button stands in the ward box, at the top of its right column (wardBox in
      // "results"), and links to the ward: ?muni=<key>&ward=<n>
      function WardShare(wm, wn) {
        return waBtn(wm.label, wm.key, wn);
      }

      /* <BannerFacts> — post-elections v1: turnout and registered voters in the black banner, then the
         council box: who won (or the largest party, or who leads while the IEC counts) and, beside it, the count
         tracker (post-elections v20; a district council's seats). Data: EH_RES (see "results"). quiet repaints in place for live updates. */
      var govTicket = 0;
      // Never break inside a short hyphenated word ("multi-party"): wrap at spaces only.
      function keepHyphenated(s) {
        return s.replace(/[A-Za-z]+(?:-[A-Za-z]+)+/g, function (w) {
          return w.length <= 12 ? '<span class="nb">' + w + '</span>' : w;
        });
      }
      var $muniGov = null;
      function muniGovEl() {
        if (!$muniGov) {
          $muniGov = document.getElementById('mf-munigov');
          if (!$muniGov) {
            $muniGov = document.createElement('div');
            $muniGov.id = 'mf-munigov';
            $bannerFacts.parentNode.insertBefore($muniGov, $bannerFacts.nextSibling);
          }
          $muniGov.className = 'mf-wardgov mf-munigov';
          $muniGov.hidden = true;
        }
        return $muniGov;
      }
      // post-elections v20.1: on desktop the council box's source line stands under the locator map, its foot level with the foot of
      // the count tracker (CSS); phones keep it in the council box. This is the copy under the map (the source link alone), refilled with every paint.
      var $fileSrc = null;
      function syncFileSrc() {
        if (!$fileSrc) {
          $fileSrc = document.createElement('p');
          $fileSrc.id = 'mf-file-src';
          $fileSrc.className = 'wg-src mf-file-src';
          var mapBox = $map.parentNode;
          mapBox.parentNode.insertBefore($fileSrc, mapBox.nextSibling);
        }
        var s = $muniGov && !$muniGov.hidden ? $muniGov.querySelector('.wg-src .wg-src-link') : null;   // the source link only
        $fileSrc.innerHTML = s ? s.outerHTML : '';
        $fileSrc.hidden = !s;
        fitParty();   // post-elections v23.22
      }
      // post-elections v23.22: phones, the council box on one row (the count tracker, then the party; v23.36: a district council's, the party, then its seats; see the stylesheet). A party's name too
      // long for its line beside its colour (ActionSA on the narrowest screens, a party with no abbreviation) is made smaller, down to 18px.
      var fitPartyRaf = 0;
      function fitParty(tries) {
        var ab = $muniGov && !$muniGov.hidden ? $muniGov.querySelector('.wg-grid:not(.is-single) .wg-ab') : null;   // v23.36: a district council's box too
        if (!ab) return;
        ab.style.fontSize = '';
        if (!isPhone()) return;
        var line = ab.parentNode, room = line.clientWidth;
        if (!room) { if ((tries || 0) < 30) requestAnimationFrame(function () { fitParty((tries || 0) + 1); }); return; }   // the file not shown yet
        var sw = line.querySelector('.wg-sw');
        if (sw) room -= sw.getBoundingClientRect().width + (parseFloat(getComputedStyle(line).columnGap) || 0);
        var m = document.createElement('b');
        m.className = 'wg-ab'; m.textContent = ab.textContent;
        m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap';
        line.appendChild(m);
        var w = m.getBoundingClientRect().width, base = parseFloat(getComputedStyle(m).fontSize);
        line.removeChild(m);
        if (w > room && base) ab.style.fontSize = Math.max(18, base * room / w - 0.25).toFixed(2) + 'px';
        if (document.fonts && document.fonts.status === 'loading') document.fonts.ready.then(function () { fitParty(); });
      }
      window.addEventListener('resize', function () { if (!fitPartyRaf) fitPartyRaf = requestAnimationFrame(function () { fitPartyRaf = 0; fitParty(); }); });
      // post-elections v20: no area declaration box under the locator map; the count tracker is in the council box (councilBox in "results")
      function bfCell(cls, lbl, v) {
        return '<div class="bf ' + cls + '"><span class="lbl">' + lbl + '</span><span class="v">' + v + '</span></div>';
      }
      var RES_WAIT = '<div class="wg-main"><span class="wg-lbl">Result</span><span class="bf-wait wg-wait" aria-hidden="true"></span></div>';
      function BannerFacts(m, key, quiet) {
        var t = ++govTicket, $mg = muniGovEl(), WAIT = '<span class="bf-wait" aria-hidden="true"></span>';
        $mg.setAttribute('data-muni', key);
        function paint(R) {
          var html = '';
          if (R === undefined) html = bfCell('bf-count is-wait', 'Turnout', WAIT) + bfCell('bf-count is-wait', 'Registered voters', WAIT);
          else if (R) html = (R.turnout != null ? bfCell('bf-count', 'Turnout', EH_RES.pct(R.turnout)) : '') +
            (R.registered ? bfCell('bf-count', 'Registered voters', EH_RES.short(R.registered)) : '');
          $bannerFacts.className = 'mf-banner-facts is-gov is-res';
          $bannerFacts.innerHTML = html;
          $mg.innerHTML = R === undefined ? RES_WAIT : EH_RES.render.councilBox(R);
          $mg.hidden = false;
          syncFileSrc();
        }
        if (EH_RES.S.state === 'error') { paint(null); return; }   // v23: the results not read yet (the council box says so)
        if (!quiet) paint(undefined);
        EH_RES.council(key).then(function (R) { if (t === govTicket) paint(R); }, function () { if (t === govTicket) paint(null); });
      }

      // <CouncilResults> — the file body (the count tracker is in the banner's council box, see councilBox): council seats (v2: on the seat board), votes and seats, turnout.
      var resTicket = 0;
      function fillResults(key, quiet) {
        var t = ++resTicket, el = document.getElementById('mf-res');
        if (EH_RES.S.state === 'error') { if (el) el.innerHTML = EH_RES.errMsg('mf-res-msg'); return; }   // v23: the results not read yet; the page tries again by itself
        if (el && !quiet) el.innerHTML = EH_RES.wait();
        EH_RES.council(key).then(function (R) {
          var box = document.getElementById('mf-res');
          if (t === resTicket && box) EH_RES.render.fill(box, key, R);
        }, function () {
          var box = document.getElementById('mf-res');
          if (t === resTicket && box) box.innerHTML = EH_RES.errMsg('mf-res-msg');
        });
      }

      function openFile(p) {
        var m = MUNIS[p.m];
        if (!m) return;
        if (m.dtype === 'district') { openDistrictFile(m, p); return; }

        $fileN.textContent = shortName(m); fitFileName();
        $fileT.innerHTML = FileTypeLine(m);
        $fileT.classList.remove('has-pop');

        BannerFacts(m, p.m);

        wardHome();
        $fileBody.className = 'mf-file-body mf-file-body--res';
        $fileBody.innerHTML =
          '<div class="mf-file-left">' +
            '<div class="mf-res" id="mf-res"></div>' +
          '</div>';   // post-elections v21: Share on WhatsApp is in the ward box (WardShare)
        fillResults(p.m);

        $hint.innerHTML = '<b>' + esc(p.n) + '</b> falls within the <b>' + esc(m.n) + '</b>.';
        setClearVisible(true);
        $widget.classList.add('is-result');
        currentMuni = m;
        currentKey = p.m;
        currentShort = $fileN.textContent;
        if (window.SA_LOCATOR) SA_LOCATOR.render($map, p.m, m.p);
        renderStories(m, p.m, $fileN.textContent);
        setupWards(p.m, $fileN.textContent);
        placeWard();
        scrollToWidget();
      }

      // Live count: repaint the open file, its district chips and its ward in place.
      if (window.EH_RES) EH_RES.on(function () {
        if (!$widget.classList.contains('is-result') || !currentKey || !MUNIS[currentKey]) return;
        if (MUNIS[currentKey].dtype === 'district') paintDistrict(currentMuni, currentKey, govTicket);
        else { BannerFacts(currentMuni, currentKey, true); fillResults(currentKey, true); }
        if (wardMuni && $wardSelect.value) WardGov(wardMuni, $wardSelect.value, wardListed(wardMuni, $wardSelect.value), true);
      });

      // Phones: the ward finder sits directly under the Reality Check rating.
      var wardMq = window.matchMedia('(max-width: 640px)');
      function wardHome() {
        var home = $fileBody.parentNode;
        if ($ward && home && $ward.parentNode !== home) home.insertBefore($ward, $fileBody.nextSibling);
      }
      // post-elections v1: the ward finder always sits under the results.
      function placeWard() { wardHome(); }
      if (wardMq.addEventListener) wardMq.addEventListener('change', placeWard); else if (wardMq.addListener) wardMq.addListener(placeWard);

      // Single reset path used by the × clear button, the banner "New search",
      // and Escape: wipe the box, close the file, return to a clean search.
      function resetSearch(refocus) {
        $widget.classList.remove('is-result');
        hideWards();
        locMsg('');
        $input.value = '';
        current = [];
        active = -1;
        setClearVisible(false);
        syncUrl(null);
        closeList();
        // v23.33: clearing the search puts the tabs under the finder back on South Africa
        if (window.EH_AREA && EH_AREA.set) EH_AREA.set('', true);
        scrollToWidget();
        if (refocus !== false) $input.focus();
      }

      /* ------------- ward finder (Option B: number + places) -------------
         Second selector under the municipality search. Only appears once a
         municipality with a ward index is open. Ward numbers mean nothing to
         most readers, so every option carries the places inside the ward. */
      var $ward       = document.getElementById('mf-ward');
      var $wardRow    = document.getElementById('mf-ward-row');
      var $wardSelect = document.getElementById('mf-ward-select');
      var $wardPanel  = document.getElementById('mf-wardpanel');
      var $wardSub    = document.getElementById('mf-ward-sub');
      var wardMuni    = null;
      var $wardGov    = document.getElementById('mf-wardgov');
      var wardGovTicket = 0;
      // post-elections v23.24: on phones Share on WhatsApp stands over the ward dropdown (#mf-ward-share), filled with the ward box; the stylesheet shows it there or in the box
      var $wardShare = document.getElementById('mf-ward-share'), wardShareHtml = '';
      if (!$wardShare && $wardRow) { $wardShare = document.createElement('div'); $wardShare.className = 'mf-ward-share'; $wardShare.id = 'mf-ward-share'; $wardShare.hidden = true; $wardRow.parentNode.insertBefore($wardShare, $wardRow); }
      function wardShareSet(h) { if (!$wardShare || h === wardShareHtml) return; wardShareHtml = h || ''; $wardShare.innerHTML = wardShareHtml; $wardShare.hidden = !wardShareHtml; }

      function hideWards() {
        $ward.hidden = true;
        $wardRow.classList.remove('is-set');
        $wardSelect.selectedIndex = 0;
        wdSync();
        $wardPanel.hidden = true;
        $wardPanel.innerHTML = '';
        wardMuni = null;
        hideWardGov();
        wmLoad(null);   // v8: the ward map
      }

      /* Real data: IEC certified candidate list, 16 September 2026.
         The ward index (ward count per council) is in this file. Graphics library v3: a ward's candidates are read from the results feed when
         the ward is opened (EH_RES.wardList in "results"), in place of the province's data file, and kept for the visit. */
      var wardLists = {}, wardListP = {};
      function wardListed(wm, wn) { return wardLists[wm.key + ':' + wn] || null; }
      function loadWardList(wm, wn, cb) {
        var k = wm.key + ':' + wn;
        if (wardLists[k]) { cb(wardLists[k]); return; }
        if (!window.EH_RES || !EH_RES.wardList) { cb(null); return; }
        var p = wardListP[k] || (wardListP[k] = EH_RES.wardList(wm.key, wn, wardId(wm.pre, wn)));
        p.then(function (P) { if (P) wardLists[k] = P; else delete wardListP[k]; cb(P || null); }, function () { delete wardListP[k]; cb(null); });
      }

      function setupWards(key, label) {
        var ix = (window.SA_WARD_INDEX || {})[key];
        if (!ix || !ix[2]) { hideWards(); return; }
        var nums = Array.isArray(ix[2]) ? ix[2] : Array.from({ length: ix[2] }, function (_, i) { return i + 1; });
        wardMuni = { key: key, label: label, pc: ix[0], pre: ix[1] };
        if ($wardSub) $wardSub.innerHTML = 'The <b style="letter-spacing:-0.2px">candidates standing for your ward</b> seat on the ' + esc(label) + ' council.';
        var html = '<option value="">Choose your ward&hellip;</option>';
        nums.forEach(function (i) { html += '<option value="' + i + '">Ward ' + i + ' &middot; ' + wardId(ix[1], i) + '</option>'; });
        $wardSelect.innerHTML = html;
        wdBuild();
        $wardRow.classList.remove('is-set');
        $wardPanel.hidden = true;
        $wardPanel.innerHTML = '';
        hideWardGov();   // v13.21: a newly opened council starts with no ward result (the last council's ward box no longer stays up)
        $ward.hidden = false;
        wmLoad(wardMuni);   // v8: the ward map
      }

      function wardId(pre, n) { return pre + ('00' + n).slice(-3); }
      var WARD_STAMP = '<p class="wp-stamp">Source: Electoral Commission of South Africa, certified candidate list, 16 September 2026. Listed alphabetically by party, not in ballot-paper order.</p>';

      function syncWardShare(wn) {
        $widget.querySelectorAll('.mf-wa-btn').forEach(function (a) { a.href = waHref(a.getAttribute('data-name'), a.getAttribute('data-key'), wn || null); });
        if (wardMuni) syncUrl(wardMuni.key, wn || null);
      }

      function openWardPanel() {
        var wn = $wardSelect.value;
        wdSync();
        wmPinChoose(); wmLocAt = null;   // v26.1: a ward chosen clears the ward map's pick, so the map comes clean (see "a ward picked out")
        syncWardShare(wn);
        if (!wardMuni || wn === '') {
          $wardRow.classList.remove('is-set');
          $wardPanel.hidden = true;
          $wardPanel.innerHTML = '';
          hideWardGov();
          return;
        }
        var wm = wardMuni;
        $wardRow.classList.add('is-set');
        hideWardGov(true);   // v23.24: the button over the dropdown stays while the next ward loads
        $wardPanel.hidden = true;
        $wardPanel.innerHTML = '';
        loadWardList(wm, wn, function (P) {
          if (wardMuni !== wm || $wardSelect.value !== wn) return;
          WardGov(wm, wn, P);
        });
      }

      // Before a ward declares (2026): the IEC's certified candidates, as in the pre-election hub.
      function WardCands(wm, wn, P, why) {
        var muni = esc(wm.label);
        var list = P ? ((P.m[wm.key] || {})[wn] || []) : [];
        if (!EH_RES.useNames() || !P) {
          $wardPanel.innerHTML = '<p class="wp-sub">' + (why === 'missing' ? 'No ' + esc(EH_RES.S.year) + ' results are available for this ward number.'
            : why === 'error' ? 'The ward result could not be loaded. Please try again later.'
            : 'Results for this ward appear here as its voting districts declare.') + '</p>';
          $wardPanel.hidden = false;
          return;
        }
        if (!list.length) {
          $wardPanel.innerHTML = '<p class="wp-sub">The IEC\u2019s certified list has no candidates for this ward on the <b>' + muni + '</b> council.</p>' + WARD_STAMP;
          $wardPanel.hidden = false;
          return;
        }
        $wardPanel.innerHTML =
          '<p class="wp-sub wp-wait">Results for this ward appear here as its voting districts declare.</p>' +
          '<div class="wp-cands"><p class="wp-lbl" style="font-size:35px;padding-top:10px;padding-bottom:5px">Candidates</p>' +
            list.map(function (c) {
              var pt = P.p[c[0]];
              var nm = c[1] ? esc(c[1]) : '<span style="color:var(--dm-ink-4)">Name not printed in the IEC list</span>';
              return '<div class="wp-cand"><div class="nm">' + nm + '</div>' +
                '<div class="pt">' + (pt[1] ? '<span class="ab">' + esc(pt[1]) + '</span> &middot; ' : '') + esc(pt[0]) + '</div></div>';
            }).join('') +
          '</div>' + WARD_STAMP;
        $wardPanel.hidden = false;
      }

      /* ------------- v19 · ward "Governed by" box -------------
         Under the ward selector: the party that holds the ward seat and, when the API sends
         results, the vote breakdown (three largest parties, the rest grouped as Others). */
      var PARTY_COL = { ANC: '#006633', DA: '#00529F', EFF: '#CA2828', IFP: '#B8235A', MK: '#FFC90E', ActionSA: '#009C8E', PA: '#F37421', 'FF+': '#5D4226', 'FF Plus': '#5D4226' };
      var PARTY_SPARE = ['#6B6C6D', '#8F9193', '#A9AAAB'];
      var PARTY_OTHERS = '#CFCAC0';
      function wgPct(v) { return String(Math.round(v * 10) / 10).replace('.', ',') + '%'; }
      function wgInt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
      function hideWardGov(keepShare) {
        wardGovTicket++;
        if (!keepShare) wardShareSet('');
        if (!$wardGov) return;
        $wardGov.hidden = true;
        $wardGov.innerHTML = '';
      }
      /* post-elections v1 · ward result: who won (or leads) and the vote breakdown in the box under the selector,
         every party (and, for 2026, its candidate) in the panel below. From EH_RES.ward(); the candidates' names from EH_RES.wardNames(). */
      function WardGov(wm, wn, P, quiet) {
        if (!$wardGov) return;
        var t = ++wardGovTicket;
        if (!quiet) {
          $wardGov.innerHTML = RES_WAIT;
          $wardGov.hidden = false;
        }
        var cands = P ? ((P.m[wm.key] || {})[wn] || []) : [];
        var wid = wardId(wm.pre, wn), names = EH_RES.wardNames ? EH_RES.wardNames(wid) : Promise.resolve(null);
        EH_RES.ward(wm.key, wid).then(function (R) {
          if (t !== wardGovTicket || wardMuni !== wm || $wardSelect.value !== wn) return;
          if (R && R.parties.length && R.vdCaptured > 0) {
            var nameOf = EH_RES.useNames() && cands.length ? EH_RES.nameMatcher(cands, P.p) : null;
            if (nameOf) nameOf.listed = function () { return true; };   // v23.13: its names are from the IEC's candidate list (our data)
            var paint = function (nf) {
              var open = !!$wardPanel.querySelector('[data-res-all][aria-expanded="true"]');
              var sh = WardShare(wm, wn);
              $wardGov.innerHTML = EH_RES.render.wardBox(R, nf, sh);
              wardShareSet(sh);
              $wardGov.hidden = false;
              $wardPanel.innerHTML = EH_RES.render.wardList(R, nf, wn);
              $wardPanel.hidden = false;
              var mb = open && $wardPanel.querySelector('[data-res-all]');
              if (mb) mb.click();
            };
            paint(nameOf);
            // the candidates' names from the feed's ward candidates, once they are in (see "results")
            names.then(function (fromFeed) {
              if (!fromFeed || t !== wardGovTicket || wardMuni !== wm || $wardSelect.value !== wn) return;
              var nf = function (p) { return fromFeed(p) || (nameOf ? nameOf(p) : ''); };
              nf.listed = function (p) { return !fromFeed(p) && !!(nameOf && nameOf(p)); };   // v23.13: the feed's name, where it has one, drops the note
              paint(nf);
            });
          } else {
            $wardGov.hidden = true;
            $wardGov.innerHTML = '';
            wardShareSet('');
            WardCands(wm, wn, P, R === null ? 'missing' : 'waiting');
          }
        }, function () {
          if (t !== wardGovTicket || wardMuni !== wm || $wardSelect.value !== wn) return;
          $wardGov.hidden = true;
          $wardGov.innerHTML = '';
          wardShareSet('');
          WardCands(wm, wn, P, 'error');
        });
      }

      $wardSelect.addEventListener('change', openWardPanel);

      /* Custom ward dropdown: "Ward 7" bold, ward ID regular. The native select stays as the value store. */
      var $wdBtn = null, $wdList = null;
      function wdLabel(o) {
        var t = o.textContent, k = t.indexOf(' \u00b7 ');
        if (!o.value || k < 0) return '<span class="wd-ph">' + esc(t) + '</span>';
        return '<b>' + esc(t.slice(0, k)) + '</b> &middot; ' + esc(t.slice(k + 3));
      }
      function wdInit() {
        if ($wdBtn || !$wardSelect) return;
        $wardSelect.classList.add('is-native');
        $wardSelect.tabIndex = -1;
        $wardSelect.setAttribute('aria-hidden', 'true');
        $wdBtn = document.createElement('button');
        $wdBtn.type = 'button'; $wdBtn.className = 'mf-wd-btn';
        $wdBtn.setAttribute('aria-haspopup', 'listbox'); $wdBtn.setAttribute('aria-expanded', 'false');
        $wdBtn.setAttribute('aria-label', 'Your ward');
        $wardSelect.parentNode.insertBefore($wdBtn, $wardSelect.nextSibling);
        $wdList = document.createElement('ul');
        $wdList.className = 'mf-wd-list'; $wdList.setAttribute('role', 'listbox'); $wdList.hidden = true;
        $wardRow.appendChild($wdList);
        $wdBtn.addEventListener('click', function () { wdOpen($wdList.hidden); });
        $wdBtn.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if ($wdList.hidden) { wdOpen(true); return; }
            var items = $wdList.querySelectorAll('li'), cur = $wdList.querySelector('li.is-hi'), i = Array.prototype.indexOf.call(items, cur);
            i = Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
            wdHi(items[i]);
          } else if (e.key === 'Enter' && !$wdList.hidden) {
            e.preventDefault(); var h = $wdList.querySelector('li.is-hi'); if (h) wdPick(h.getAttribute('data-v'));
          } else if (e.key === 'Escape') wdOpen(false);
        });
        $wdList.addEventListener('mousedown', function (e) { e.preventDefault(); });
        $wdList.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) wdPick(li.getAttribute('data-v')); });
        document.addEventListener('click', function (e) { if (!$wdList.hidden && !$wardRow.contains(e.target)) wdOpen(false); });
      }
      function wdHi(li) {
        $wdList.querySelectorAll('li.is-hi').forEach(function (x) { x.classList.remove('is-hi'); });
        if (!li) return; li.classList.add('is-hi');
        var top = li.offsetTop, bot = top + li.offsetHeight;
        if (top < $wdList.scrollTop) $wdList.scrollTop = top; else if (bot > $wdList.scrollTop + $wdList.clientHeight) $wdList.scrollTop = bot - $wdList.clientHeight;
      }
      function wdOpen(on) {
        if (!$wdList) return;
        $wdList.hidden = !on; $wdBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
        $wardRow.classList.toggle('is-open', !!on);
        if (on) { $wdBtn.focus(); wdHi($wdList.querySelector('li[aria-selected="true"]') || $wdList.querySelector('li')); }
      }
      function wdPick(v) { wdOpen(false); if ($wardSelect.value === v) return; $wardSelect.value = v; openWardPanel(); }   // v26.1: the ward chosen again changes nothing
      function wdBuild() {
        wdInit(); if (!$wdList) return;
        var html = '';
        Array.prototype.forEach.call($wardSelect.options, function (o) {
          if (!o.value) return;
          html += '<li role="option" data-v="' + esc(o.value) + '">' + wdLabel(o) + '</li>';
        });
        $wdList.innerHTML = html; wdSync();
      }
      function wdSync() {
        if (!$wdBtn) return;
        var o = $wardSelect.options[$wardSelect.selectedIndex];
        $wdBtn.innerHTML = o ? wdLabel(o) : '';
        $wdList.querySelectorAll('li').forEach(function (li) { li.setAttribute('aria-selected', li.getAttribute('data-v') === $wardSelect.value ? 'true' : 'false'); });
        wmSync();   // v8: the ward map follows the dropdown
      }
      wdInit();

      /* ------------- the ward maps (post-elections v8; v10: views; v11: two maps) -------------
         The council's 2026 wards from the MDB's public 2026 ward service (the one Use my location asks; CORS open, no key): the extent first,
         so the outlines come simplified to under a pixel, then the outlines, once per council for the visit. The wards are in the colours and
         lines of the South Africa map in Results across South Africa. The chosen ward stands up out of the map on sides that grow as it rises
         with a slight bounce, with its shadow on the wards around it; the ward it replaces drops back at once. If the service doesn't answer,
         the maps stay hidden.
         v10: every ward's result is read (EH_RES.ward, eight at a time, through the results module's cache, the chosen ward first) and the
         wards take the colour of the party leading each one (the ward ballot) or, in the blues of the South Africa map, their turnout; a black
         pill names the view and switches it.
         v11 · two maps. Under the black banner, Results by ward: the wards by leading party or by turnout (the pill: Leading party first;
         from the first result in, while the map is on screen, a run to Turnout and back, once, 1,6 s a view, up to 2,4 s while the results are
         still being read; a click on the pill ends it). The chosen ward stands up in the colour of the view; the wards take no clicks. Over
         the ward dropdown, Your ward: the plain wards on their own, with no views; the chosen ward stands up in dark charcoal, a ward darkens
         a shade under a mouse, and a click or tap on a ward chooses it, as the dropdown does (wdPick). The dropdown stays the way to choose
         by keyboard, so the maps themselves are hidden from screen readers. Beside each map (under it on a narrow screen), its facts in the
         style of the council box in the black banner (Won by, Council seats), stacked: the party with the most wards over the wards by party,
         or the council's turnout over the wards by turnout, then the reader's ward with its figure; beside Your ward, the chosen ward, who
         won or leads it, its turnout and registered voters. v11.1: the wards by party drawn as the council seats in the banner are (EH_RES.segs):
         the three parties with the most wards, the rest together as Others, on the map too, so every colour on it is in the bar. The results follow the live count (EH_RES.on), read again while a map is on
         screen, or when one comes back. v11.2: Results by ward moved from under the banner to under the council's seats and votes, at the top
         of the ward finder (#mf-ward), over Your ward. v11.6: the Your ward map is gone; the dropdown under Results by ward chooses the ward.
         v13.20: Results by ward takes the pointer: the ward under it rises halfway with its name over it, and a click or a tap chooses it (see
         "the pointer on Results by ward").
         v18: beside the map, each view's key as a table (v18.1: its rows take no pointer).
         v23.11: a flat map. The ward chosen in the dropdown no longer stands up on it, and a click or a tap no longer chooses a ward: the ward
         under the pointer (or tapped) is outlined, its tooltip naming it with its votes by party or its turnout (see "the pointer on Results by ward").
         v23.12: a click or a tap picks a ward out: it stands up with its box over it, and stays so on all three tabs (see "a ward picked out").
         v24.1: the ward chosen in the dropdown, by Use my location or by a ward's anchor is picked out too. */
      var WM_SRC = 'https://services7.arcgis.com/oeoyTUJC8HEeYsRB/arcgis/rest/services/MDB_Wards_2026/FeatureServer/0/query';
      var WM_NS = 'http://www.w3.org/2000/svg';
      var WM_WALL = [[37, 35, 33], [37, 35, 33]];   // the sides of a raised ward: at its foot, and just under its top (one shade)
      var wmCalm = true;   // v11.5: the ward finder holds still for every reader, as it did before only with reduced motion: no run on Results by ward, the chosen ward stands at once
      var wmCache = {}, wmDone = {}, wmCur = null, wmTicket = 0, wmResT = 0, wmStale = false;
      var WM_VIEWS = ['win', 'turn'], WM_NAMES = { win: 'Leading party', turn: 'Turnout' };
      var WM_HOLD = 1600, WM_HOLD_MAX = 2400, WM_GAP = 32, WM_NAMED = 3, WM_PLAIN = '#f6f5f2';
      var WM_WAIT_TXT = 'Ward results appear here as voting districts declare.';
      // the South Africa map's turnout scale (TURN_BINS in "results across South Africa"), highest first: [from %, colour, label]
      var WM_TURN = [[70, '#1f4778', '70% or more'], [60, '#3d6ea4', '60\u201370%'], [50, '#6d98c3', '50\u201360%'], [40, '#a6c1dd', '40\u201350%'], [0, '#e0ebf7', 'Under 40%']];
      var wmView = 'win', wmRun = false, wmRaf = 0, wmT0 = 0, wmAcc = 0, wmStep = 0, wmShown = false;
      // v22.1 · tabs over the map, in the look of the results tabs: Results by ward, Turnout by ward and Change since 2021 (2021's wards, from the
      // MDB's 2020 ward service, the delimitation the 2021 election used, beside this election's; see "Change since 2021" below)
      var WM_SRC21 = 'https://services7.arcgis.com/oeoyTUJC8HEeYsRB/arcgis/rest/services/MDB_Wards_2020/FeatureServer/0/query';
      var WM_PREV = (window.EH_RES && EH_RES.PREV) || '2021';
      var WM_TABS = ['win', 'turn', 'cmp'], WM_TAB_NAMES = { win: 'Results by ward', turn: 'Turnout by ward', cmp: 'Change since ' + WM_PREV };
      var wcP = null, wcRaf = 0, wcL = null, wcLast = null;   // v22.5: wcL, the Change since 2021 maps' scale and size as drawn; wcLast, the pointer over them
      // the two maps (v11.2): Results by ward under the council's seats and votes, at the top of the ward finder; Your ward under it, over the dropdown
      function wmMake(kind, after) {
        var el = document.createElement('div');
        el.className = 'mf-wmap mf-wmap--' + kind;
        el.hidden = true;
        after.parentNode.insertBefore(el, after.nextSibling);
        return { kind: kind, el: el, w: 0, D: null, L: 0, H: 0, sel: null, lift: null, hov: null, hovN: '', hp: null, side: '', sideN: null, named: '', seen: true };
      }
      var wmRes = wmMake('res', $wardPanel), WM_MAPS = [wmRes];   // v11.6: Results by ward only; the Your ward map is gone. v20: under the ward's results
      wmRes.el.setAttribute('data-view', wmView);
      function wmOwn(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
      function wmWards() { var q = []; [].forEach.call($wardSelect.options, function (o) { if (o.value) q.push(o.value); }); return q; }
      function wmBin(v) { for (var i = 0; i < WM_TURN.length; i++) if (v >= WM_TURN[i][0]) return i; return WM_TURN.length - 1; }
      function wmTurnCol(v) { return WM_TURN[wmBin(v)][1]; }
      function wmGet(q, src) {
        return new Promise(function (resolve, reject) {
          if (!window.fetch) { reject(new Error('fetch unavailable')); return; }
          var ctl = window.AbortController ? new AbortController() : null;
          var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('no answer within 10 s')); }, 10000);
          fetch((src || WM_SRC) + '?f=json&' + q, { credentials: 'omit', signal: ctl ? ctl.signal : undefined })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (d) {
              clearTimeout(timer);
              if (!d || d.error) throw new Error((d && d.error && d.error.message) || 'no answer');
              resolve(d);
            })
            .catch(function (e) { clearTimeout(timer); reject(e); });
        });
      }
      function wmFetch(pre, src) {
        var ck = (src ? 'p' : '') + pre;   // v22.1: src, the 2021 wards' service
        if (wmCache[ck]) return wmCache[ck];
        // graphics library v3: from the feed's maps (wmFeed); the Demarcation Board's ward services (wmMDB, as before) only if they can't be read
        var p = wmFeed(pre, !!src).then(null, function (e) {
          if (window.console) console.warn('[elections-hub] ward map ' + ck + ' from the feed: ' + ((e && e.message) || e) + '; the Demarcation Board\u2019s stands in');
          return wmMDB(pre, src);
        }).then(function (list) {
          if (!list.length) throw new Error('no ward outlines');
          return (wmDone[ck] = wmPrep(list));
        });
        wmCache[ck] = p;
        p.catch(function (e) { delete wmCache[ck]; if (window.console) console.warn('[elections-hub] ward map ' + ck + ': ' + ((e && e.message) || e)); });
        return p;
      }
      function wmMDB(pre, src) {
        var where = 'where=' + encodeURIComponent("WardID LIKE '" + pre + "%'");
        return wmGet(where + '&returnExtentOnly=true&outSR=4326', src).then(function (d) {
          var e = d.extent || {};
          if (!(e.xmax > e.xmin && e.ymax > e.ymin)) throw new Error('no wards');
          var span = Math.max((e.xmax - e.xmin) * Math.cos((e.ymin + e.ymax) / 2 * Math.PI / 180), e.ymax - e.ymin);
          var off = span / 1600, dp = Math.max(3, Math.min(6, Math.ceil(-Math.log(off) / Math.LN10)));
          return wmGet(where + '&outFields=WardID&returnGeometry=true&outSR=4326&geometryPrecision=' + dp + '&maxAllowableOffset=' + off.toFixed(7), src);
        }).then(function (d) {
          var list = [];
          (d.features || []).forEach(function (f) {
            var id = String((f.attributes && f.attributes.WardID) || ''), rings = f.geometry && f.geometry.rings;
            if (id.length > 5 && rings && rings.length) list.push({ n: String(parseInt(id.slice(5), 10)), rings: rings });
          });
          return list;
        });
      }
      // graphics library v3 · a council's wards from the feed's maps, as [{ n, rings }]: this election's from the council's ward file, 2021's put
      // together from its 2021 voting districts (ehWardsFromVDs)
      function wmFeed(pre, prev) {
        var code = ehFeedCode(pre);
        if (!code) return Promise.reject(new Error('no council code for ' + pre));
        return ehMapJSON(prev ? '/' + WM_PREV + '/voting-districts/' + code + '.json' : '/2026/municipalities/' + code + '.json').then(function (d) {
          var list = [], ws = prev ? ehWardsFromVDs(d.features) : d.features.map(function (f) { return { id: String((f.properties || {}).WardId || ''), rings: ehRings(f.geometry) }; });
          ws.forEach(function (w) { if (w.id.length > 5 && w.id.slice(0, 5) === pre && w.rings.length) list.push({ n: String(parseInt(w.id.slice(5), 10)), rings: w.rings }); });
          if (!list.length) throw new Error('no ward outlines in the feed');
          return list;
        });
      }
      // Onto a plane in degrees of latitude, north up (longitude scaled by the cosine of the middle latitude).
      function wmPrep(list) {
        var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        list.forEach(function (w) { w.rings.forEach(function (r) { r.forEach(function (p) {
          if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
        }); }); });
        var k = Math.cos((y0 + y1) / 2 * Math.PI / 180);
        list.forEach(function (w) { w.rings = w.rings.map(function (r) { return r.map(function (p) { return [(p[0] - x0) * k, y1 - p[1]]; }); }); });
        return { wards: list, w: (x1 - x0) * k, h: y1 - y0, x0: x0, y1: y1, k: k };   // v22.5: x0, y1 and k take a spot from one map to another (wcHov)
      }
      // v22.1: over the map, its tabs (in place of the title and the pill of views): Results by ward, Turnout by ward and, while the page
      // shows a later election, Change since 2021
      function wmHasPrev() { var R$ = window.EH_RES; return !!(R$ && R$.hasPrev && R$.wardPrev && R$.hasPrev()); }
      function wmHead() {
        return '<div class="mf-wm-tabs" role="tablist" aria-label="Wards">' + WM_TABS.filter(function (v) { return v !== 'cmp' || wmHasPrev(); }).map(function (v) {
          var on = v === wmView;
          return '<button type="button" class="mf-wm-tab' + (on ? ' is-on' : '') + '" id="mf-wm-tab-' + v + '" role="tab" aria-selected="' + on + '" aria-controls="mf-wm-panel" tabindex="' + (on ? '0' : '-1') + '" data-v="' + v + '">' + esc(WM_TAB_NAMES[v]) + '</button>';
        }).join('') + '</div>';
      }
      function wmLoad(wm) {
        var t = ++wmTicket;
        wmCur = null; wcP = null; wmPin = null;
        wmReset();   // back to Results by ward, no run
        WM_MAPS.forEach(function (M) { M.D = null; M.sel = null; M.lift = null; M.hov = null; M.hovN = ''; M.side = ''; M.sideN = null; M.named = ''; });
        if (!wm || !wm.pre) { WM_MAPS.forEach(function (M) { M.el.hidden = true; M.el.innerHTML = ''; }); return; }
        wmCur = { key: wm.key, label: wm.label, pre: wm.pre, geo: wmDone[wm.pre] || null, res: null };
        WM_MAPS.forEach(function (M) { M.el.hidden = false; });
        wmResults();   // the results alongside the outlines
        if (wmCur.geo) { wmPaintAll(false); return; }
        WM_MAPS.forEach(function (M) { wmCols(M); M.el.innerHTML = wmHead(M) + '<div class="mf-wm-panel" id="mf-wm-panel" role="tabpanel" aria-labelledby="mf-wm-tab-' + wmView + '"><div class="mf-wm-box is-wait"><span class="mf-wm-wait">Loading the ward map&hellip;</span></div></div>'; });
        wmFetch(wm.pre).then(function (geo) {
          if (t !== wmTicket || !wmCur) return;
          wmCur.geo = geo;
          wmPaintAll(false);
        }, function () {
          if (t !== wmTicket) return;
          wmCur = null;
          WM_MAPS.forEach(function (M) { M.el.hidden = true; M.el.innerHTML = ''; });
        });
      }
      function wmPaintAll(instant) { WM_MAPS.forEach(function (M) { wmPaint(M, instant); }); }
      // v18: the column beside the map (from 600px up, 210 to 260px wide; narrower, the facts go under the map), set on the map's box too,
      // so its head stands over the same columns: the title centred over the map, the pill over the key
      // v22.7: the map and its facts stand in a box under the tabs (the stylesheet's --wm-in: its line and padding, a side), so they take the
      // width inside it; the column beside the map comes and goes at the box's own width, as before
      function wmInset(M) { return Math.round(parseFloat(getComputedStyle(M.el).getPropertyValue('--wm-in')) || 0); }
      function wmCols(M) {
        var out = Math.round(M.el.clientWidth) || 600, inset = wmInset(M), full = out - 2 * inset, side = out >= 600, sw = side ? Math.round(Math.max(210, Math.min(260, full * 0.32))) : 0;
        M.el.classList.toggle('has-side', side);
        if (side) M.el.style.setProperty('--wm-side', sw + 'px'); else M.el.style.removeProperty('--wm-side');
        return { full: full, side: side, sw: sw, inset: inset };
      }
      // Drawn in the box's own pixels, so the rise and the shadow are the same size on every map; drawn again when the box changes width.
      // From 600px up the facts have a column beside the map (210 to 260px wide); narrower, they go under the map.
      function wmPaint(M, instant) {
        if (!wmCur || !wmCur.geo) return;
        var G = wmCur.geo, C = wmCols(M), full = C.full, side = C.side;
        var sw = C.sw, W = side ? full - sw - WM_GAP : full, small = W < 440 - 2 * C.inset;   // v22.7: small at the same widths as before the box
        var L = small ? 4.5 : 6.5, top = L + 10, pad = 4, maxH = small ? 330 : 440;
        var s = Math.min((W - 2 * pad) / G.w, (maxH - top - pad) / G.h), H = Math.ceil(G.h * s + top + pad), ox = (W - G.w * s) / 2;
        var has = {}, D = {}, base = '', fid = 'mf-wm-blur-' + M.kind;
        wmWards().forEach(function (n) { has[n] = 1; });
        G.wards.forEach(function (w) {
          var d = w.rings.map(function (r) { return 'M' + r.map(function (p) { return (ox + p[0] * s).toFixed(1) + ' ' + (top + p[1] * s).toFixed(1); }).join('L') + 'Z'; }).join('');
          D[w.n] = d;
          base += '<path d="' + d + '" data-w="' + w.n + '"' + (has[w.n] ? '' : ' class="is-off"') + '></path>';
        });
        M.w = full; M.D = D; M.L = L; M.H = H; M.sel = null; M.lift = null; M.hov = null; M.hovN = ''; M.hp = null; M.side = ''; M.sideN = null; M.named = '';
        M.s = s; M.ox = ox; M.oy = top;   // v23.12: how the wards were drawn, to take a click to its spot (wmSpot)
        M.el.innerHTML = wmHead(M) + '<div class="mf-wm-panel" id="mf-wm-panel" role="tabpanel" aria-labelledby="mf-wm-tab-' + wmView + '">' +
          '<div class="mf-wm-grid' + (side ? ' has-side" style="--wm-side:' + sw + 'px' : '') + '"><div class="mf-wm-box' + (instant ? '' : ' is-in') + '" style="height:' + H + 'px">' +
            '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true" focusable="false">' +
              '<defs><filter id="' + fid + '" filterUnits="userSpaceOnUse" x="-20" y="-20" width="' + (W + 40) + '" height="' + (H + 40) + '"><feGaussianBlur stdDeviation="' + (L * 0.32).toFixed(1) + '"></feGaussianBlur></filter></defs>' +
              '<g class="wm-base">' + base + '</g><g class="wm-lifts"></g></svg><div class="res-tip mf-wm-tip" aria-hidden="true" hidden></div></div>' +
          '<div class="mf-wm-side"></div></div><div class="mf-wm-cmp"></div></div>';   // v11.6: no source line under the map. v22.1: Change since 2021 in the grid's place
        if (M === wmRes) { wmColourAll(wmTally()); wmApply(); }
        wmSyncOne(M, instant);   // the chosen ward's facts follow (v23.11: it no longer stands up)
        if (M === wmRes) wmPinPaint();   // v23.12: the ward picked out stands up again
        wmSideRes();
        wmSrc(M);
        if (M === wmRes && wmCur.res && wmCur.res.any) wmStart();
      }
      function wmEl(tag, at) { var e = document.createElementNS(WM_NS, tag); for (var k in at) if (Object.prototype.hasOwnProperty.call(at, k)) e.setAttribute(k, at[k]); return e; }
      function wmMix(t) { var a = WM_WALL[0], b = WM_WALL[1]; return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; }
      // The chosen ward, raised: its shadow, its sides (copies of the ward 0.75px apart, darker at the foot, which keeps its black line) and its
      // top, which rise together (now: at once, without the rise). The top carries the ward's colours (--c1, --c2), so on Results by ward it
      // follows the view.
      function wmLift(M, n, now, st) {
        var lifts = M.el.querySelector('.wm-lifts'), d = M.D[n];
        if (!lifts || !d) return null;
        var L = M.L, N = Math.ceil(L / 0.75), cls = 'wm-up' + (now ? ' is-now' : ''), g = wmEl('g', { 'class': cls });
        var bp = M.el.querySelector('.wm-base path[data-w="' + n + '"]');
        if (bp) ['--c1', '--c2'].forEach(function (k) { var v = bp.style.getPropertyValue(k); if (v) g.style.setProperty(k, v); });
        g.appendChild(wmEl('path', { 'class': 'wm-sh', d: d, filter: 'url(#mf-wm-blur-' + M.kind + ')' }));
        for (var i = 0; i < N; i++) {
          var c = wmMix(N > 1 ? i / (N - 1) : 1);
          g.appendChild(wmEl('path', { 'class': i ? 'wm-wall' : 'wm-wall wm-foot', d: d, fill: c, stroke: c, style: '--k:' + (L * i / N).toFixed(2), 'data-w': n }));
        }
        g.appendChild(wmEl('path', { 'class': 'wm-top', d: d, style: '--k:' + L, 'data-w': n }));
        lifts.appendChild(g);
        g._st = st || 'is-up';   // v13.20: 'is-half' under the pointer
        var up = function () { if (g.parentNode) g.setAttribute('class', cls + ' ' + g._st); };
        if (now) up();
        else { g.getBoundingClientRect(); requestAnimationFrame(function () { requestAnimationFrame(up); }); }
        return g;
      }
      // The map follows the dropdown (wdSync): the ward chosen there is read first. v23.11: it no longer stands up on the map, which stays flat.
      function wmSync(instant) { WM_MAPS.forEach(function (M) { wmSyncOne(M, instant); }); }
      function wmSyncOne(M) {
        if (!wmCur || !M.D || !wardMuni || wardMuni.key !== wmCur.key) return;
        var n = $wardSelect.value || '';
        if (n === M.sel) return;
        M.sel = n;
        wmWardRes(n);
        wmSideRes();
      }

      /* ---- the results ---- */
      // Every ward's result, eight at a time, through the results module's cache (EH_RES.ward), the chosen ward first. Read again on a live
      // update (see EH_RES.on below): the count moves, the colours and the facts follow.
      function wmResults() {
        var R$ = window.EH_RES;
        if (!wmCur || !R$ || !R$.ward) return;
        var cur = wmCur, t = ++wmResT, q = wmWards(), i = 0, live = 0, done = 0, sel = $wardSelect.value || '';
        if (sel && q.indexOf(sel) > 0) { q.splice(q.indexOf(sel), 1); q.unshift(sel); }
        var res = cur.res = cur.res || { by: {}, any: false, done: false, cTurn: null, cReg: null, n: 0, got: 0 };
        res.done = false; res.n = q.length; res.got = 0;
        if (!q.length) { res.done = true; wmSrc(wmRes); return; }
        try { R$.council(cur.key).then(function (R) { if (t === wmResT && wmCur === cur) { res.cTurn = R ? R.turnout : null; res.cReg = R ? R.registered : null; wmSideRes(); } }, function () {}); } catch (e) {}
        function take(n, R) {
          live--; done++;
          if (t !== wmResT || wmCur !== cur) return;
          res.got = done;
          if (done >= q.length) res.done = true;
          wmPut(n, R);
          if (res.done || !(done % 8)) wmSrc(wmRes);
          if (!res.done) next();
        }
        function next() {
          while (live < 8 && i < q.length) (function (n) {
            live++;
            var pr;
            try { pr = R$.ward(cur.key, wardId(cur.pre, n)); } catch (e) { pr = Promise.reject(e); }
            Promise.resolve(pr).then(function (R) { take(n, R); }, function () { take(n, null); });
          })(q[i++]);
        }
        next();
      }
      // a ward chosen before the reading reaches it: asked for at once (EH_RES.ward caches it, so the reading's own ask costs nothing more)
      function wmWardRes(n) {
        var cur = wmCur, res = cur && cur.res, R$ = window.EH_RES, t = wmResT, pr;
        if (!n || !res || !R$ || !R$.ward || wmOwn(res.by, n)) return;
        try { pr = R$.ward(cur.key, wardId(cur.pre, n)); } catch (e) { return; }
        Promise.resolve(pr).then(function (R) { if (t === wmResT && wmCur === cur && !wmOwn(res.by, n)) wmPut(n, R); }, function () {});
      }
      // one ward's result: its colours on Results by ward, the facts beside both maps; the first result in shows the pill and starts the run
      function wmPut(n, R) {
        var res = wmCur && wmCur.res;
        if (!res) return;
        var p = R && R.parties && R.parties.length && R.vdCaptured > 0 ? R.parties[0] : null, first = !!p && !res.any;
        // v23.11: ps, its parties with votes, the most first, for the tooltip
        res.by[n] = p ? { lbl: p.label, name: p.name, col: p.col, pct: p.pct, turn: R.turnout, reg: R.registered, complete: !!R.complete, vdCount: R.vdCount, vdCaptured: R.vdCaptured,
          ps: R.parties.filter(function (q) { return q.votes > 0; }).map(function (q) { return { lbl: q.label, col: q.col, pct: q.pct }; }) } : null;
        if (p) res.any = true;
        var T = wmTally();
        if (wmRes.D) { if (T.key !== wmRes.named) wmColourAll(T); else wmColour(n, T); }
        wmSideRes(T);
        if (wmRes.hovN === n && wmRes.hp) wmTip(wmRes, n); else if (wmPinned(n)) wmPinTip();   // v23.11: the tooltip over it follows (v23.12: the box of the ward picked out too)
        if (first) wmSrc(wmRes);
        if (p) wmStart();
        wcSoon();   // v22.1: this election's map on Change since 2021 follows
      }
      // The wards by leading party (the WM_NAMED parties with the most wards, the rest together as Others, as EH_RES.segs does) and by turnout.
      function wmTally() {
        var res = wmCur && wmCur.res, q = wmWards(), c = {}, bins = WM_TURN.map(function () { return 0; }), nR = 0, nT = 0, all = true;
        q.forEach(function (n) {
          var r = res ? res.by[n] : null;
          if (!r) { all = false; return; }
          nR++;
          if (!r.complete) all = false;
          (c[r.lbl] = c[r.lbl] || { lbl: r.lbl, name: r.name, col: r.col, n: 0 }).n++;
          if (r.turn != null) { nT++; bins[wmBin(r.turn)]++; }
        });
        var list = Object.keys(c).map(function (k) { return c[k]; }).sort(function (a, b) { return b.n - a.n || a.lbl.localeCompare(b.lbl); });
        var named = list.slice(0, WM_NAMED), set = {};
        named.forEach(function (p) { set[p.lbl] = 1; });
        return { nW: q.length, nR: nR, nT: nT, all: all && nR > 0, list: list, named: named, set: set, bins: bins,
          others: list.slice(named.length).reduce(function (a, p) { return a + p.n; }, 0), key: named.map(function (p) { return p.lbl; }).join('|') };
      }
      // A ward's colours on Results by ward, on its outline and, if it is the raised one, on its lift: --c1 the party leading it (Others past
      // the named), --c2 its turnout shade.
      function wmColour(n, T) {
        var r = wmCur && wmCur.res ? wmCur.res.by[n] : null, p = wmRes.el.querySelector('.wm-base path[data-w="' + n + '"]');
        [p, wmPinned(n) ? wmRes.lift : null, wmRes.hovN === n ? wmRes.hov : null].forEach(function (el) {   // v23.12: the raised ward is the one picked out
          if (!el) return;
          if (r) { el.style.setProperty('--c1', T.set[r.lbl] ? r.col : window.EH_RES.OTHERS); el.style.setProperty('--c2', r.turn != null ? wmTurnCol(r.turn) : WM_PLAIN); }
          else { el.style.removeProperty('--c1'); el.style.removeProperty('--c2'); }
        });
      }
      function wmColourAll(T) {
        var res = wmCur && wmCur.res;
        wmRes.named = T.key;
        if (res && wmRes.D) for (var k in res.by) if (wmOwn(res.by, k)) wmColour(k, T);
      }

      /* ---- v11 · the facts beside the maps, in the style of the council box in the black banner ---- */
      function wmYr() { return '<b class="wg-yr">' + esc(window.EH_RES.S.year) + '</b>'; }
      function wmBlk(h, cls) { return '<div class="mf-wm-blk' + (cls ? ' ' + cls : '') + '">' + h + '</div>'; }
      function wmParty(p) {
        return '<div class="wg-party"><span class="wg-sw" style="background:' + esc(p.col) + '"></span><b class="wg-ab">' + esc(p.lbl) + '</b>' +
          (p.name && p.name !== p.lbl ? '<span class="wg-full">' + esc(p.name) + '</span>' : '') + '</div>';
      }
      // a bar and its legend in the markup of the council seats in the banner (EH_RES.bar): [{ lbl, v, col, nr: no result yet, keep: in the legend at 0 }]
      function wmBar(sg) {
        return '<div class="wg-bar" role="img" aria-label="' + esc(sg.filter(function (s) { return s.v > 0; }).map(function (s) { return s.lbl + ' ' + s.v; }).join(', ')) + '">' + sg.filter(function (s) { return s.v > 0; }).map(function (s) {
            return '<span' + (s.nr ? ' class="is-nr"' : '') + ' style="flex:' + s.v + ' 1 0%' + (s.nr ? '' : ';background:' + esc(s.col)) + '"></span>';
          }).join('') + '</div>' +
          '<ul class="wg-legend">' + sg.filter(function (s) { return s.v > 0 || s.keep; }).map(function (s) {
            return '<li' + (s.nr ? ' class="is-nr"' : '') + '><i' + (s.nr ? '' : ' style="background:' + esc(s.col) + '"') + '></i>' + esc(s.lbl) + ' <b>' + s.v + '</b></li>';
          }).join('') + '</ul>';
      }
      // Leading party (v18): the map's key as a table, as Turnout's: a row for each party the map names, the most wards first, with the wards
      // it leads, then Others, then the wards with no result yet
      function wmPaneWin(T) {
        if (!T.nR) return wmBlk('<span class="wg-lbl">Leading party in ' + wmYr() + '</span><p class="mf-wm-note">' + WM_WAIT_TXT + '</p>') + wmYou('win', T);
        var rows = T.named.map(function (p, i) { return { g: 'w' + i, lbl: p.lbl, col: p.col, n: p.n }; });
        if (T.others) rows.push({ g: 'wo', lbl: 'Others', col: window.EH_RES.OTHERS, n: T.others });
        if (T.nR < T.nW) rows.push({ g: 'wn', lbl: 'No result yet', col: WM_PLAIN, n: T.nW - T.nR, nr: true });
        return wmBlk(wmKey('Wards by leading party', 'Leading party', rows), 'mf-wm-key') + wmYou('win', T);
      }
      // Turnout (v18): the map's key as a table, a row for each band of turnout, the highest first, with the wards in it, then the wards with
      // no result yet
      function wmPaneTurn(T) {
        if (!T.nR) return wmBlk('<span class="wg-lbl">Turnout in ' + wmYr() + '</span><p class="mf-wm-note">' + WM_WAIT_TXT + '</p>') + wmYou('turn', T);
        var rows = WM_TURN.map(function (b, i) { return { g: 't' + i, lbl: b[2], col: b[1], n: T.bins[i] }; });
        if (T.nT < T.nW) rows.push({ g: 'tn', lbl: 'No result yet', col: WM_PLAIN, n: T.nW - T.nT, nr: true });
        return wmBlk(wmKey('Wards by turnout', 'Ward turnout', rows), 'mf-wm-key') + wmYou('turn', T);
      }
      // a key, as the Turnout tab's beside the councils map: each row with its wards (data-g names them), a bar scaled to the largest
      function wmKey(cap, head, rows) {
        var mx = Math.max.apply(null, rows.map(function (r) { return r.n; })) || 1;
        return '<div class="mf-res-tw"><table class="mf-res-table is-3 res-tkey"><caption class="vh">' + esc(cap + ', ' + (wmCur.label || '')) + '</caption>' +
          '<thead><tr><th scope="col" class="p">' + head + '</th><th scope="col" class="sh">Wards</th></tr></thead><tbody>' +
          rows.map(function (r) {
            return '<tr data-g="' + r.g + '"' + (r.nr ? ' class="is-nr"' : '') + '><th scope="row" class="p"><div class="pc"><span class="sw" style="background:' + esc(r.col) + '"></span><span class="pn"><strong>' + esc(r.lbl) + '</strong></span></div></th>' +
              '<td class="sh"><span class="shb"><i style="width:calc((100% - 56px) * ' + (r.n / mx).toFixed(4) + ');background:' + esc(r.col) + '"></i><strong>' + r.n + '</strong></span></td></tr>';
          }).join('') + '</tbody></table></div>';
      }
      // the reader's ward on Results by ward: a swatch in its colour on the view, raised as it stands on the map, and its figure
      function wmYou(v, T) {
        var n = wmRes.sel, R$ = window.EH_RES, r = n && wmCur.res ? wmCur.res.by[n] : null, col = WM_PLAIN, fig = 'No result yet';
        if (wmRes || !n || !wmRes.D || !wmRes.D[n]) return '';   // v11.6: off; the ward results box under the dropdown has the reader's ward
        if (r && v === 'win') { col = T.set[r.lbl] ? r.col : R$.OTHERS; fig = esc(r.lbl) + ' ' + R$.pct(r.pct); }
        else if (r && r.turn != null) { col = wmTurnCol(r.turn); fig = R$.pct(r.turn); }
        return wmBlk('<span class="wg-lbl">Your ward</span><p class="mf-wm-you"><i style="background:' + esc(col) + '"></i><span>Ward ' + esc(n) + '</span><b>' + fig + '</b></p>', 'is-you');
      }
      // Both views' facts share one cell (see the stylesheet), so the page under them holds still as the view turns; drawn again only when they change.
      function wmSideRes(T) {
        var el = wmRes.el.querySelector('.mf-wm-side');
        if (!el || !wmCur || !window.EH_RES) return;
        T = T || wmTally();
        var html = WM_VIEWS.map(function (v) {
          var on = v === wmView;
          return '<div class="mf-wm-pane' + (on ? ' is-on' : '') + '" data-v="' + v + '" aria-hidden="' + (on ? 'false' : 'true') + '">' + (v === 'win' ? wmPaneWin(T) : wmPaneTurn(T)) + '</div>';
        }).join('');
        if (html === wmRes.side) return;
        wmRes.side = html;
        el.innerHTML = html;
      }
      // the source line; on Results by ward, while the results are read, how many are in
      function wmSrc(M) {
        var src = M.el.querySelector('.mf-wm-src'), res = wmCur && wmCur.res, R$ = window.EH_RES;
        if (!src) return;
        var shown = !!(res && res.any && (M === wmRes || (M.sel && res.by[M.sel])));
        src.innerHTML = 'Ward boundaries: Municipal Demarcation Board, 2026.' +
          (shown ? ' Results: Electoral Commission of South Africa' + (R$ && R$.S.sample ? ' (sample data, made up from the 2021 results)' : '') + '.' : '') +
          (M === wmRes && res && !res.done && res.n ? ' <span class="mf-wm-read">Reading the ward results: ' + res.got + ' of ' + res.n + '&hellip;</span>' : '');
      }

      /* ---- the view on Results by ward, and the run ---- */
      // data-view on the map picks the fill (see the stylesheet), the pill names the view, its facts show
      function wmApply() {
        var el = wmRes.el, pn = el.querySelector('.mf-wm-panel');
        el.setAttribute('data-view', wmView);
        [].forEach.call(el.querySelectorAll('.mf-wm-tab'), function (b) { var on = b.getAttribute('data-v') === wmView; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
        if (pn) pn.setAttribute('aria-labelledby', 'mf-wm-tab-' + wmView);
        if (wmView === 'cmp') wcStart(); else wcOff(null);
        [].forEach.call(el.querySelectorAll('.mf-wm-pane'), function (p) { var on = p.getAttribute('data-v') === wmView; p.classList.toggle('is-on', on); p.setAttribute('aria-hidden', on ? 'false' : 'true'); });
      }
      // v11.5: off, as wmCalm is always set; the map stays on Leading party until the pill turns it. Before:
      // Once per council, from the first ward result in, while the map is on screen in a visible tab: Leading party, Turnout, and back to
      // Leading party, where it stays, WM_HOLD ms a view (WM_HOLD_MAX while the results are still being read). The time already run carries
      // over a pause; a click on the pill ends the run.
      function wmPaused() { return !wmRes.seen || document.hidden; }
      function wmHold() { var res = wmCur && wmCur.res; return res && !res.done ? WM_HOLD_MAX : WM_HOLD; }
      function wmPlay() { if (!wmRun || wmRaf || wmPaused()) return; wmT0 = 0; wmRaf = requestAnimationFrame(wmTick); }
      function wmHalt() { if (wmRaf) cancelAnimationFrame(wmRaf); wmRaf = 0; }
      function wmTick(now) {
        wmRaf = 0;
        if (!wmRun || wmPaused()) return;
        if (wmT0) wmAcc += Math.min(now - wmT0, 100);
        wmT0 = now;
        if (wmAcc >= wmHold()) {
          wmAcc = 0; wmStep++;
          wmShow(wmStep === 1 ? 'turn' : 'win');
          if (wmStep >= 2) { wmStop(); return; }
        }
        wmRaf = requestAnimationFrame(wmTick);
      }
      function wmStart() { if (wmShown || wmCalm || !wmRes.D) return; wmShown = true; wmRun = true; wmAcc = 0; wmStep = 0; wmRes.el.classList.add('is-loop'); wmShow('win'); wmPlay(); }
      function wmStop() { wmRun = false; wmHalt(); wmRes.el.classList.remove('is-loop'); }
      function wmReset() { wmStop(); wmResT++; wmShown = false; wmView = 'win'; wmRes.el.setAttribute('data-view', 'win'); }
      // one view: the fills, the pill and the facts; chosen on the pill, it stays: the run is over, or never starts
      function wmShow(v, pin) {
        if (WM_TABS.indexOf(v) < 0 || (v === 'cmp' && !wmHasPrev())) return;
        if (pin) { wmShown = true; wmStop(); }
        var was = v !== wmView ? wgFrom() : -1;   // v23.26: the height the box stood at (phones)
        wmView = v;
        wmApply();
        wmHovOff(wmRes);   // v23.11: the tooltip was the other view's (v23.12: the ward picked out keeps its box, in this view)
        wgTo(was);
      }
      // post-elections v23.26 · phones (640px and under): the box under the tabs as tall as the tab in view needs (the stylesheet takes the other
      // view's facts out of the flow). As the tab turns it eases from the height it stood at to the new tab's, and on Change since 2021 again as
      // the maps fill in (wcFill), clipped while it moves, as the results tabs' section glides. Nothing with reduced motion or without the Web
      // Animations API; wider, the box stays as tall as the taller view.
      var wgA = null, wgGoal = -1;
      function wgPanel() {
        var p = wmRes.el.querySelector('.mf-wm-panel');
        return p && p.animate && window.matchMedia && window.matchMedia('(max-width: 640px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? p : null;
      }
      function wgFrom() { var p = wgPanel(); return p ? p.getBoundingClientRect().height : -1; }
      function wgTo(a) {
        var p = a >= 0 ? wgPanel() : null, cs, b, x;
        if (!p) return;
        cs = getComputedStyle(p);
        b = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        [].forEach.call(p.children, function (c) { b += c.getBoundingClientRect().height; });   // its height without the glide
        if (wgA && wgA.effect && wgA.effect.target === p && Math.abs(wgGoal - b) < 1) return;   // already on its way there
        if (wgA) { wgA.onfinish = null; wgA.cancel(); wgA = null; }
        p.classList.remove('is-gliding');
        if (Math.abs(b - a) < 1) return;
        wgGoal = b;
        p.classList.add('is-gliding');
        x = wgA = p.animate([{ height: a + 'px' }, { height: b + 'px' }], { duration: Math.round(Math.min(440, 240 + Math.abs(b - a) * 0.12)), easing: 'cubic-bezier(.4,0,.2,1)' });
        x.onfinish = function () { if (wgA === x) { wgA = null; p.classList.remove('is-gliding'); } };
      }
      /* ---- v13.20 · the pointer on Results by ward: the ward under it rises halfway (the chosen ward stands all the way), its name in a black
         box over the pointer, as on the councils map; a click or a tap chooses it, as the dropdown does (wdPick), and it goes on up. The raised
         wards' sides and tops carry the ward (data-w), so the pointer is on the ward it is seen to be on. A touch only taps.
         v23.11: the map stays flat and chooses nothing. The ward under the pointer, or tapped, is outlined as on Change since 2021, in its
         colour a shade darker, and the box names it with, on Results by ward, its votes by party (the four largest shares, the rest together
         as Others) or, on Turnout by ward, its turnout; under them, while its count is under way, the share of its voting districts declared.
         The dropdown alone chooses the ward.
         v23.12 · a ward picked out: a click or a tap on a ward raises it out of the map (the v13.20 lift, at once, as the ward finder holds
         still), its box centred over it, and it stays so on all three tabs: on Change since 2021 this election's ward is outlined with its
         box, and on 2021's map the ward at the spot clicked, the spot marked. Another ward clicked takes its place; the same ward again, or
         the map off the wards, puts it back. The pointer still names the ward under it; off the wards, the box goes back over the ward
         picked out. It chooses nothing: the dropdown alone chooses the ward.
         v24.1: the ward chosen, in the dropdown, by Use my location or by a ward's anchor, is picked out too, in place of the one picked out
         before (wmPinChoose).
         v26.1: no longer. A ward chosen puts back the one picked out, so the map comes clean, and only the map picks a ward out. ---- */
      var wmPin = null, wmPtr = '', wmLocAt = null;   // wmPin: { key, n, lon, lat }, the council, the ward and the spot clicked; wmPtr: the last pointer's type; wmLocAt (v24.1): Use my location's spot, for the ward it chooses
      function wmPinned(n) { return !!wmPin && !!wmCur && wmPin.key === wmCur.key && (n == null || wmPin.n === n); }
      function wmHovOff(M) {
        if (M.hov && M.hov.parentNode) M.hov.parentNode.removeChild(M.hov);
        M.hov = null; M.hovN = ''; M.hp = null;
        if (wmPinTip()) return;   // v23.12: the box goes back over the ward picked out
        var tip = M.el.querySelector('.mf-wm-tip');
        if (tip) tip.hidden = true;
      }
      function wmHov(M, p, e) {
        var n = p ? p.getAttribute('data-w') || '' : '';
        if (!n || !M.D || !M.D[n] || p.classList.contains('is-off')) { wmHovOff(M); return; }
        if (n !== M.hovN) {
          if (M.hov && M.hov.parentNode) M.hov.parentNode.removeChild(M.hov);
          M.hovN = n;
          M.hov = wmPinned(n) ? null : wmHl(M, n);
        }
        if (wmPinned(n)) { M.hp = null; wmPinTip(); return; }   // v23.12: over the ward picked out, its box stays where it is
        M.hp = [e.clientX, e.clientY];
        wmTip(M, n);
      }
      // the ward's outline over the map, in its colours on both views (--c1, --c2, as on its outline underneath; wmColour keeps them as the count moves)
      function wmHl(M, n) {
        var lifts = M.el.querySelector('.wm-lifts'), bp = M.el.querySelector('.wm-base path[data-w="' + n + '"]'), g;
        if (!lifts || !M.D[n]) return null;
        g = wmEl('path', { 'class': 'wm-hl', d: M.D[n] });
        if (bp) ['--c1', '--c2'].forEach(function (k) { var v = bp.style.getPropertyValue(k); if (v) g.style.setProperty(k, v); });
        lifts.insertBefore(g, lifts.firstChild);   // v23.12: under the raised ward
        return g;
      }
      function wmTipRow(col, label, val, key) {
        return '<span class="tr' + (key ? ' is-key' : '') + (col ? '' : ' is-ns') + '">' + (col ? '<i style="background:' + esc(col) + '"></i>' : '') +
          '<span class="l">' + esc(label) + '</span><b>' + esc(val) + '</b></span>';
      }
      function wmTipBody(n) {
        var R$ = window.EH_RES, res = wmCur && wmCur.res, got = !!res && wmOwn(res.by, n), r = got ? res.by[n] : null, rows = '', foot = '', ps, rest;
        if (!r) foot = !got && res && !res.done ? 'Loading\u2026' : 'No result yet';
        else if (wmView === 'turn') rows = wmTipRow(r.turn != null ? wmTurnCol(r.turn) : '', 'Turnout', R$.pct(r.turn), true);
        else {
          ps = r.ps.length > 5 ? r.ps.slice(0, 4) : r.ps;
          rest = r.ps.slice(ps.length).reduce(function (a, q) { return a + q.pct; }, 0);
          rows = ps.map(function (q, i) { return wmTipRow(q.col, q.lbl, R$.pct(q.pct), !i); }).join('') + (rest > 0 ? wmTipRow(R$.OTHERS, 'Others', R$.pct(rest)) : '');
        }
        if (r && !r.complete && r.vdCount) foot = R$.decPct(r) + ' declared';
        return '<span class="nm">Ward ' + esc(n) + '</span>' + rows + (foot ? '<span class="ft">' + esc(foot) + '</span>' : '');
      }
      // over the pointer (M.hp, client px), or under it where the box has no room above
      function wmTip(M, n) {
        var tip = M.el.querySelector('.mf-wm-tip'), box = tip && tip.parentNode, html, r, w, h, t, x, y;
        if (!tip || !M.hp || !n) return;
        html = wmTipBody(n); x = M.hp[0]; y = M.hp[1];
        if (tip._h !== html) { tip._h = html; tip.innerHTML = html; }
        tip.hidden = false;
        r = box.getBoundingClientRect(); w = tip.offsetWidth; h = tip.offsetHeight; t = y - r.top - h - 18;
        tip.style.left = Math.max(4, Math.min(r.width - w - 4, x - r.left - w / 2)) + 'px';
        tip.style.top = (t < 0 ? y - r.top + 22 : t) + 'px';
      }
      // v23.12: the box of the ward picked out, centred over its top as it stands, or under it where the map has no room above; on Results by
      // ward and Turnout by ward, while the pointer names no other ward. Says whether it showed.
      function wmPinTip() {
        var M = wmRes, tip = M.el.querySelector('.mf-wm-tip'), n = wmPinned() ? wmPin.n : '', bp, bb, html, w, h, t;
        if (!tip || !n || M.hp || wmView === 'cmp' || !M.D || !M.D[n]) return false;
        bp = M.el.querySelector('.wm-base path[data-w="' + n + '"]');
        try { bb = bp ? bp.getBBox() : null; } catch (e) { bb = null; }
        if (!bb) return false;
        html = wmTipBody(n);
        if (tip._h !== html) { tip._h = html; tip.innerHTML = html; }
        tip.hidden = false;
        w = tip.offsetWidth; h = tip.offsetHeight; t = bb.y - M.L - h - 8;
        if (t < 0) t = Math.max(0, Math.min(bb.y + bb.height + 8, M.H - h - 4));
        tip.style.left = Math.max(4, Math.min(tip.parentNode.clientWidth - w - 4, bb.x + bb.width / 2 - w / 2)) + 'px';
        tip.style.top = t + 'px';
        return true;
      }
      // the ward picked out, standing up (drawn again with the map), and its box
      function wmPinPaint() {
        var M = wmRes, n = wmPinned() ? wmPin.n : '', tip;
        if (M.lift && M.lift.parentNode) M.lift.parentNode.removeChild(M.lift);
        M.lift = n && M.D && M.D[n] ? wmLift(M, n, true) : null;
        if (!wmPinTip() && !M.hp && (tip = M.el.querySelector('.mf-wm-tip'))) tip.hidden = true;
      }
      // n: the ward to pick out (none: the one picked out put back); s: the spot clicked, [longitude, latitude]
      function wmPinSet(n, s) {
        var M = wmRes;
        wmPin = n && s && wmCur ? { key: wmCur.key, n: n, lon: s[0], lat: s[1] } : null;
        if (M.hov && M.hov.parentNode) M.hov.parentNode.removeChild(M.hov);
        M.hov = null; M.hovN = ''; M.hp = null;
        wmPinPaint();
      }
      // v26.1 · the ward chosen is no longer picked out (v24.1 picked it out as a click does): the dropdown, Use my location or a ward's
      // anchor (openWardPanel) puts back the ward picked out before, so the map comes clean on all three tabs, and only a click or a tap
      // on the map picks a ward out. The ward chosen keeps its results over the map.
      function wmPinChoose() {
        var M = wmRes;
        if (!wmPin) return;
        wmPin = null;
        if (M.hov && M.hov.parentNode) M.hov.parentNode.removeChild(M.hov);
        M.hov = null; M.hovN = ''; M.hp = null;
        wmPinPaint();
        wcPinShow();
      }
      // the spot of a ward chosen, once the outlines are in: Use my location's where it falls in the ward, otherwise one well inside it
      function wmPinLL() {
        var P = wmPin, G = wmCur && wmCur.geo, w = null, i, q;
        if (!P || !P.chk || !G || G.x0 == null || P.key !== wmCur.key) return;
        for (i = 0; i < G.wards.length && !w; i++) if (G.wards[i].n === P.n) w = G.wards[i];
        P.chk = false;
        if (!w || (P.lon != null && wcIn(w, (P.lon - G.x0) * G.k, G.y1 - P.lat))) return;
        q = wmMid(w);
        P.lon = q ? G.x0 + q[0] / G.k : null; P.lat = q ? G.y1 - q[1] : null;
      }
      // where the line y = v (across: x = v) crosses the ward's rings, in order
      function wmCross(w, v, across) {
        var o = [], a = across ? 0 : 1, b = 1 - a;
        w.rings.forEach(function (r) {
          for (var i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][a] > v) !== (r[j][a] > v)) o.push(r[i][b] + (r[j][b] - r[i][b]) * (v - r[i][a]) / (r[j][a] - r[i][a]));
        });
        return o.sort(function (x, y) { return x - y; });
      }
      // a spot well inside the ward: on nine lines across it, the middle of each stretch inside; the one farthest from the ward's edge, across and down
      function wmMid(w) {
        var y0 = Infinity, y1 = -Infinity, best = null, top = -1, k, y, xs, i, x, ys, j, s;
        w.rings.forEach(function (r) { r.forEach(function (p) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }); });
        for (k = 1; k < 10; k++) {
          y = y0 + (y1 - y0) * k / 10; xs = wmCross(w, y, false);
          for (i = 0; i + 1 < xs.length; i += 2) {
            x = (xs[i] + xs[i + 1]) / 2; ys = wmCross(w, x, true);
            for (j = 0; j + 1 < ys.length; j += 2) if (ys[j] <= y && y <= ys[j + 1]) {
              s = Math.min(xs[i + 1] - x, y - ys[j], ys[j + 1] - y);
              if (s > top) { top = s; best = [x, y]; }
              break;
            }
          }
        }
        return best;
      }
      // a click on Results by ward or Turnout by ward to its spot, [longitude, latitude]
      function wmSpot(e) {
        var M = wmRes, G = wmCur && wmCur.geo, svg = M.el.querySelector('.mf-wm-box svg'), u = G && svg && M.s ? wcSvgPt(svg, e.clientX, e.clientY, false) : null;
        return u ? [G.x0 + (u.x - M.ox) / M.s / G.k, G.y1 - (u.y - M.oy) / M.s] : null;
      }
      function wmAt(e) { return e.target && e.target.closest ? e.target.closest('.mf-wm-box path[data-w]') : null; }
      wmRes.el.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch') wmHov(wmRes, wmAt(e), e); });
      wmRes.el.addEventListener('pointerleave', function () { wmHovOff(wmRes); });
      wmRes.el.addEventListener('pointerdown', function (e) { wmPtr = e.pointerType || ''; });
      wmRes.el.addEventListener('click', function (e) {
        var b = e.target && e.target.closest && e.target.closest('.mf-wm-tab[data-v]'), p, n;
        if (b) { wmShow(b.getAttribute('data-v'), true); return; }
        if (wmView === 'cmp') { wcClick(e); return; }   // v23.12: picks a ward out there too (v22.1: a tap named the ward)
        if (!e.target.closest || !e.target.closest('.mf-wm-box')) return;
        // v23.12: a ward picked out (v23.11: it no longer chooses the ward); the same ward again, or the map off the wards, puts it back
        p = wmAt(e); n = p && !p.classList.contains('is-off') ? p.getAttribute('data-w') || '' : '';
        wmPinSet(n && wmRes.D && wmRes.D[n] && !wmPinned(n) ? n : '', n ? wmSpot(e) : null);
        if (wmPtr === 'touch') wmHovOff(wmRes);
        else wmHov(wmRes, wmAt({ target: document.elementFromPoint(e.clientX, e.clientY) }), e);
      });
      /* ---- v22.1 · Change since 2021, the ward map's third tab: the council's wards in 2021 (2021's boundaries and results) beside this
         election's, half the width each, at one scale, each ward in the colour of the party leading it. The four parties leading the most
         wards on either map keep their colours on both; the rest are Other parties. Under each map its key. The 2021 wards are read when the
         tab first opens for a council, eight at a time; a ward under the pointer (or tapped) is outlined and named with its leading party. ---- */
      function wcStart() {
        if (!wmCur || !wmHasPrev()) return;
        if (!wcP || wcP.key !== wmCur.key) {
          var P = wcP = { key: wmCur.key, pre: wmCur.pre, geo: null, by: {}, n: 0, got: 0, done: false, fail: false };
          wmFetch(P.pre, WM_SRC21).then(function (geo) { if (wcP !== P) return; P.geo = geo; wcRead(P); wcFill(); },
            function () { if (wcP !== P) return; P.fail = true; wcFill(); });
        }
        wcPaint();
      }
      function wcRead(P) {
        var R$ = window.EH_RES, q = P.geo.wards.map(function (w) { return w.n; }), i = 0, live = 0;
        P.n = q.length;
        if (!q.length) { P.done = true; return; }
        function take(n, R) {
          live--;
          if (wcP !== P) return;
          var p = R && R.parties && R.parties.length && R.vdCaptured > 0 ? R.parties[0] : null;
          P.by[n] = p ? { lbl: p.label, name: p.name, col: p.col, pct: p.pct } : null;
          if (++P.got >= P.n) P.done = true;
          wcSoon();
          next();
        }
        function next() {
          while (live < 8 && i < q.length) (function (n) {
            var pr;
            live++;
            try { pr = R$.wardPrev(P.key, wardId(P.pre, n)); } catch (e) { pr = Promise.reject(e); }
            Promise.resolve(pr).then(function (R) { take(n, R); }, function () { take(n, null); });
          })(q[i++]);
        }
        next();
      }
      function wcSoon() { if (!wcRaf && wmView === 'cmp') wcRaf = setTimeout(function () { wcRaf = 0; wcFill(); }, 60); }   // a timer, so the map fills in a tab in the background too
      function wcFill() { var a = wgFrom(); wcPaint(); wgTo(a); }   // v23.26: painted again as it fills in; on phones the box eases to its new height
      // a map's outlines in the box's pixels, kept for the size they were drawn at
      function wcPaths(G, s, ox, oy) {
        var k = s.toFixed(5) + '/' + ox.toFixed(1) + '/' + oy.toFixed(1);
        if (G._wc && G._wc.k === k) return G._wc.D;
        var D = {};
        G.wards.forEach(function (w) { D[w.n] = w.rings.map(function (r) { return 'M' + r.map(function (p) { return (ox + p[0] * s).toFixed(1) + ' ' + (oy + p[1] * s).toFixed(1); }).join('L') + 'Z'; }).join(''); });
        G._wc = { k: k, D: D };
        return D;
      }
      // the wards each party leads on one map (has: the wards of this election's dropdown; none for 2021)
      function wcCount(G, by, has) {
        var c = {}, n = 0, have = 0;
        if (G) G.wards.forEach(function (w) {
          if (has && !has[w.n]) return;
          var r = by[w.n];
          n++;
          if (r) { have++; (c[r.lbl] = c[r.lbl] || { n: 0, col: r.col }).n++; }
        });
        return { c: c, n: n, have: have };
      }
      function wcMap(year, G, by, has, X, set, W, H, s, busy, fail) {
        var R$ = window.EH_RES, head = '<div class="mf-wc-head"><span class="cmp-yr">' + esc(year) + '</span></div>';
        if (!G) return '<div class="mf-wc-map">' + head + '<div class="mf-wc-box is-wait' + (fail ? ' is-fail' : '') + '" style="height:' + H + 'px"><span class="mf-wm-wait">' +
          (fail ? 'The ' + esc(year) + ' ward map is not available.' : 'Loading the ' + esc(year) + ' wards&hellip;') + '</span></div></div>';
        var ox = (W - G.w * s) / 2, oy = (H - G.h * s) / 2, D = wcPaths(G, s, ox, oy), body = '', oth = 0;
        G.wards.forEach(function (w) {
          var off = !!has && !has[w.n], r = off ? null : by[w.n], col = r ? esc(set[r.lbl] ? r.col : R$.OTHERS) : '';
          body += '<path d="' + D[w.n] + '" data-n="' + w.n + '"' + (off ? ' class="is-off"' : col ? ' style="fill:' + col + ';--fc:' + col + '"' : '') + '></path>';   // v22.4: --fc for its outline
        });
        var keys = Object.keys(X.c).filter(function (l) { if (set[l]) return true; oth += X.c[l].n; return false; })
          .sort(function (x, y) { return X.c[y].n - X.c[x].n || x.localeCompare(y); });
        var leg = keys.map(function (l) { return '<li><i style="background:' + esc(X.c[l].col) + '"></i>' + esc(l) + ' <b>' + X.c[l].n + '</b></li>'; }).join('') +
          (oth ? '<li><i style="background:' + esc(R$.OTHERS) + '"></i>Other parties <b>' + oth + '</b></li>' : '') +
          (X.n > X.have && !busy ? '<li class="is-nr"><i></i>No result yet <b>' + (X.n - X.have) + '</b></li>' : '');
        return '<div class="mf-wc-map" data-y="' + esc(year) + '">' + head + '<div class="mf-wc-box" style="height:' + H + 'px">' +
          '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc((wmCur.label || '') + ' wards in ' + year + ', coloured by leading party') + '">' + body + '<path class="wc-hl" d="M0 0"></path></svg>' +
          (busy ? '<span class="res-loading">Loading wards&hellip;</span>' : '') + '<i class="cmp-pt" aria-hidden="true" hidden></i><div class="res-tip mf-wm-tip" aria-hidden="true" hidden></div></div>' +
          (leg ? '<ul class="cmp-legend">' + leg + '</ul>' : '') + '</div>';
      }
      function wcPaint() {
        var box = wmRes.el.querySelector('.mf-wm-cmp');
        if (!box || wmView !== 'cmp' || !wmCur) return;
        var R$ = window.EH_RES, P = wcP && wcP.key === wmCur.key ? wcP : null, G21 = P && P.geo, G26 = wmCur.geo, res = wmCur.res;
        var full = Math.round(box.clientWidth) || Math.round(wmRes.el.clientWidth) || 600, gap = full < 520 ? 16 : WM_GAP, W = Math.max(120, Math.floor((full - gap) / 2));
        var maxH = Math.max(240, Math.round(W * 1.3)), s = Infinity, H, has = {};
        [G21, G26].forEach(function (G) { if (G) s = Math.min(s, (W - 4) / G.w, (maxH - 4) / G.h); });
        H = s < Infinity ? Math.ceil(Math.max(G21 ? G21.h * s : 0, G26 ? G26.h * s : 0)) + 4 : Math.round(W * 0.85);
        wcL = { s: s, W: W, H: H };
        wmWards().forEach(function (n) { has[n] = 1; });
        var by21 = P ? P.by : {}, by26 = res ? res.by : {}, A = wcCount(G21, by21, null), B = wcCount(G26, by26, has), top = {}, set = {};
        [A, B].forEach(function (X) { Object.keys(X.c).forEach(function (l) { top[l] = Math.max(top[l] || 0, X.c[l].n); }); });
        Object.keys(top).sort(function (x, y) { return top[y] - top[x] || x.localeCompare(y); }).slice(0, 4).forEach(function (l) { set[l] = 1; });
        box.innerHTML = '<div class="mf-wc-grid" style="column-gap:' + gap + 'px">' +
          wcMap(WM_PREV, G21, by21, null, A, set, W, H, s, !P || !P.done, !!(P && P.fail)) +
          wcMap(R$.S.year, G26, by26, has, B, set, W, H, s, !res || !res.done, false) + '</div>' +
          '<p class="res-note mf-wc-note">Each map shows the wards as they were drawn for that election.</p>';
        wcAgain();
      }
      function wcAt(e) { return e.target && e.target.closest ? e.target.closest('.mf-wc-box path[data-n]') : null; }
      function wcOff(keep) {
        [].forEach.call(wmRes.el.querySelectorAll('.mf-wc-box'), function (b) {
          if (keep && (keep === b || (keep.indexOf && keep.indexOf(b) >= 0))) return;   // v22.5: keep, a box or the boxes to leave as they are
          var hl = b.querySelector('.wc-hl'), tip = b.querySelector('.mf-wm-tip'), pt = b.querySelector('.cmp-pt');
          if (hl) hl.classList.remove('is-on');
          if (tip) tip.hidden = true;
          if (pt) pt.hidden = true;
        });
      }
      // v22.5 · the two maps answer each other: the ward under the pointer is outlined and named, and on the other map the ward at the same
      // spot (the wards were redrawn between the elections, so it can be another ward, or none) is outlined and named too, a dot on the
      // spot. A spot goes from one map to the other by its longitude and latitude (wmPrep keeps each map's x0, y1 and k).
      function wcGeo(y) { return !wmCur ? null : y === WM_PREV ? (wcP && wcP.key === wmCur.key ? wcP.geo : null) : wmCur.geo; }
      function wcIn(w, x, y) {
        var bb = w._bb, inn = false;
        if (!bb) { bb = w._bb = [Infinity, Infinity, -Infinity, -Infinity]; w.rings.forEach(function (r) { r.forEach(function (p) { if (p[0] < bb[0]) bb[0] = p[0]; if (p[1] < bb[1]) bb[1] = p[1]; if (p[0] > bb[2]) bb[2] = p[0]; if (p[1] > bb[3]) bb[3] = p[1]; }); }); }
        if (x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]) return false;
        w.rings.forEach(function (r) {
          for (var i = 0, j = r.length - 1; i < r.length; j = i++) {
            if ((r[i][1] > y) !== (r[j][1] > y) && x < (r[j][0] - r[i][0]) * (y - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) inn = !inn;
          }
        });
        return inn;
      }
      function wcSvgPt(svg, x, y, out) { var m = svg && svg.getScreenCTM(), p; if (!m) return null; p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(out ? m : m.inverse()); }
      // one map: its ward p outlined and named over (x, cy), client px; dot: the spot marked. v23.12: o, for the ward picked out: { dx, dy }, the
      // spot marked, and foot, the ward's foot (client px; the box goes under it where the map has no room above)
      function wcOne(b, p, y, x, cy, dot, o) {
        var R$ = window.EH_RES, n = p.getAttribute('data-n'), rc = b.getBoundingClientRect();
        var by = y === WM_PREV ? (wcP ? wcP.by : {}) : (wmCur && wmCur.res ? wmCur.res.by : {}), r = by[n], hl = b.querySelector('.wc-hl'), tip = b.querySelector('.mf-wm-tip'), pt = b.querySelector('.cmp-pt'), k, w, h, t;
        if (hl) { hl.setAttribute('d', p.getAttribute('d')); hl.style.setProperty('--fc', p.style.getPropertyValue('--fc').trim() || '#f6f5f2'); hl.classList.add('is-on'); }   // v22.4: in the ward's colour, a shade darker
        if (pt) { pt.hidden = !dot; pt.style.left = ((o ? o.dx : x) - rc.left) + 'px'; pt.style.top = ((o ? o.dy : cy) - rc.top) + 'px'; }
        if (!tip) return;
        k = y + '/' + n + '/' + (r ? r.lbl + '/' + r.pct : '');
        if (tip._k !== k) {
          tip._k = k;
          tip.innerHTML = '<span class="nm">Ward ' + esc(n) + '</span>' + (r ? '<span class="tr"><i style="background:' + esc(r.col) + '"></i><span class="l">' + esc(r.lbl) + '</span><b>' + R$.pct(r.pct) + '</b></span>' : '<span>No result yet</span>');
        }
        tip.hidden = false;
        w = tip.offsetWidth; h = tip.offsetHeight; t = cy - rc.top - h - (o ? 8 : 18);
        tip.style.left = Math.max(-4, Math.min(rc.width - w + 4, x - rc.left - w / 2)) + 'px';
        tip.style.top = (t < 0 ? (o ? Math.max(0, Math.min(o.foot - rc.top + 8, rc.height - h - 4)) : cy - rc.top + 22) : t) + 'px';
      }
      function wcHov(e) {
        var p = wcAt(e), b = p && p.closest('.mf-wc-box'), L = wcL, y, GA, u, lon, lat, shown;
        if (!p || p.classList.contains('is-off')) { wcPinShow(); return; }   // v23.12: off the wards, the ward picked out (if any)
        y = p.closest('.mf-wc-map').getAttribute('data-y'); GA = wcGeo(y); shown = [b];
        if (y !== WM_PREV && wmPinned(p.getAttribute('data-n'))) { wcPinShow(); return; }   // v23.12: over the ward picked out, its boxes stay where they are
        wcOne(b, p, y, e.clientX, e.clientY, false);
        u = GA && L && GA.x0 != null ? wcSvgPt(b.querySelector('svg'), e.clientX, e.clientY, false) : null;
        if (u) {
          lon = GA.x0 + (u.x - (L.W - GA.w * L.s) / 2) / L.s / GA.k; lat = GA.y1 - (u.y - (L.H - GA.h * L.s) / 2) / L.s;
          [].forEach.call(wmRes.el.querySelectorAll('.mf-wc-map[data-y]'), function (mp) {
            var y2 = mp.getAttribute('data-y'), G = y2 !== y ? wcGeo(y2) : null, b2 = mp.querySelector('.mf-wc-box'), svg = b2 && b2.querySelector('svg'), gx, gy, n = '', p2, q, i;
            if (!G || G.x0 == null || !svg) return;
            gx = (lon - G.x0) * G.k; gy = G.y1 - lat;
            for (i = 0; i < G.wards.length && !n; i++) if (wcIn(G.wards[i], gx, gy)) n = G.wards[i].n;
            p2 = n && svg.querySelector('path[data-n="' + n + '"]');
            q = p2 && !p2.classList.contains('is-off') && wcSvgPt(svg, (L.W - G.w * L.s) / 2 + gx * L.s, (L.H - G.h * L.s) / 2 + gy * L.s, true);
            if (!q) return;
            wcOne(b2, p2, y2, q.x, q.y, true);
            shown.push(b2);
          });
        }
        wcOff(shown);
      }
      // after a repaint (the 2021 wards come in eight at a time), the wards under the pointer again
      function wcAgain() {
        var t = wcLast && document.elementFromPoint(wcLast[0], wcLast[1]);
        if (t && t.closest && t.closest('.mf-wc-box')) wcHov({ target: t, clientX: wcLast[0], clientY: wcLast[1] });
        else wcPinShow();   // v23.12
      }
      // v23.12 · the ward picked out, on Change since 2021: on this election's map outlined, its box over its top; on 2021's, the ward at the
      // spot clicked outlined, with its box, the spot marked
      function wcPinShow() {
        var L = wcL, shown = [];
        if (wmView !== 'cmp' || !wmPinned() || !L) { wcOff(null); return; }
        wmPinLL();   // v24.1: the spot of a ward chosen
        [].forEach.call(wmRes.el.querySelectorAll('.mf-wc-map[data-y]'), function (mp) {
          var y = mp.getAttribute('data-y'), G = wcGeo(y), b = mp.querySelector('.mf-wc-box'), svg = b && b.querySelector('svg'), m = '', gx, gy, i, p, bb, a, f, d;
          if (!G || G.x0 == null || !svg || (y === WM_PREV && wmPin.lon == null)) return;
          gx = (wmPin.lon - G.x0) * G.k; gy = G.y1 - wmPin.lat;
          if (y === WM_PREV) { for (i = 0; i < G.wards.length && !m; i++) if (wcIn(G.wards[i], gx, gy)) m = G.wards[i].n; } else m = wmPin.n;
          p = m && svg.querySelector('path[data-n="' + m + '"]');
          if (!p || p.classList.contains('is-off')) return;
          try { bb = p.getBBox(); } catch (e) { return; }
          a = wcSvgPt(svg, bb.x + bb.width / 2, bb.y, true); f = wcSvgPt(svg, bb.x + bb.width / 2, bb.y + bb.height, true);
          d = y === WM_PREV ? wcSvgPt(svg, (L.W - G.w * L.s) / 2 + gx * L.s, (L.H - G.h * L.s) / 2 + gy * L.s, true) : null;
          if (!a || !f) return;
          wcOne(b, p, y, a.x, a.y, !!d, { dx: d ? d.x : a.x, dy: d ? d.y : a.y, foot: f.y });
          shown.push(b);
        });
        wcOff(shown);
      }
      // a click on one of the maps to its spot, [longitude, latitude] (y: the map's year)
      function wcSpot(e, y) {
        var G = wcGeo(y), L = wcL, b = e.target.closest && e.target.closest('.mf-wc-box'), svg = b && b.querySelector('svg'), u = G && L && G.x0 != null && svg ? wcSvgPt(svg, e.clientX, e.clientY, false) : null;
        return u ? [G.x0 + (u.x - (L.W - G.w * L.s) / 2) / L.s / G.k, G.y1 - (u.y - (L.H - G.h * L.s) / 2) / L.s] : null;
      }
      // v23.12 · a click or a tap on Change since 2021 picks out this election's ward: the one clicked on its map, or on 2021's the one at the
      // spot clicked (none there: nothing). The ward picked out again, or a map off the wards, puts it back.
      function wcClick(e) {
        var p = wcAt(e), mp = p && p.closest('.mf-wc-map'), y = mp ? mp.getAttribute('data-y') : '', s = null, n = '', G = wmCur && wmCur.geo, gx, gy, i;
        if (!e.target.closest || !e.target.closest('.mf-wc-box')) return;
        if (p && !p.classList.contains('is-off')) s = wcSpot(e, y);
        if (s && y === WM_PREV) {
          if (G && G.x0 != null) { gx = (s[0] - G.x0) * G.k; gy = G.y1 - s[1]; for (i = 0; i < G.wards.length && !n; i++) if (wcIn(G.wards[i], gx, gy)) n = G.wards[i].n; }
        } else if (s) n = p.getAttribute('data-n') || '';
        if (n && !wmRes.el.querySelector('.wm-base path[data-w="' + n + '"]:not(.is-off)')) n = '';
        if (s && !n) return;
        wmPinSet(n && !wmPinned(n) ? n : '', s);
        wcAgain();
      }
      wmRes.el.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch' && wmView === 'cmp') { wcLast = [e.clientX, e.clientY]; wcHov(e); } });
      wmRes.el.addEventListener('pointerleave', function () { wcLast = null; wcPinShow(); });   // v23.12: the ward picked out keeps its boxes
      // the tabs take the arrow keys, Home and End, as the results tabs do
      wmRes.el.addEventListener('keydown', function (e) {
        var t = e.target && e.target.closest && e.target.closest('.mf-wm-tab'), k = e.key, all, i;
        if (!t || (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End')) return;
        all = [].slice.call(wmRes.el.querySelectorAll('.mf-wm-tab')); i = all.indexOf(t);
        e.preventDefault();
        i = k === 'Home' ? 0 : k === 'End' ? all.length - 1 : (i + (k === 'ArrowRight' ? 1 : all.length - 1)) % all.length;
        wmShow(all[i].getAttribute('data-v'), true);
        try { all[i].focus({ preventScroll: true }); } catch (x) { all[i].focus(); }
      });
      document.addEventListener('visibilitychange', function () { if (document.hidden) wmHalt(); else wmPlay(); });
      if (window.IntersectionObserver) {
        var wmIO = new IntersectionObserver(function (es) {
          es.forEach(function (en) { WM_MAPS.forEach(function (M) { if (M.el === en.target) M.seen = en.isIntersecting; }); });
          if (wmRes.seen) wmPlay(); else wmHalt();
          if (wmStale && wmRes.seen) { wmStale = false; wmResults(); }
        }, { threshold: 0.2 });
        WM_MAPS.forEach(function (M) { wmIO.observe(M.el); });
      }
      // the live count: the colours and the facts follow, read again while a map is on screen; off screen, when one comes back
      if (window.EH_RES && EH_RES.on) EH_RES.on(function () {
        if (!wmCur || wmRes.el.hidden) return;
        if (wmRes.seen && !document.hidden) wmResults(); else wmStale = true;
      });
      function wmFit() { WM_MAPS.forEach(function (M) { if (!M.el.hidden && wmCur && M.D && M.el.clientWidth && Math.abs(M.el.clientWidth - 2 * wmInset(M) - M.w) >= 1) wmPaint(M, true); }); }
      // the repaint changes the box's height, so it waits for the next frame, out of the observer's callback
      var wmRaf2 = 0;
      function wmFitSoon() { if (wmRaf2) return; wmRaf2 = requestAnimationFrame(function () { wmRaf2 = 0; wmFit(); }); }
      if (window.ResizeObserver) { var wmRO = new ResizeObserver(wmFitSoon); WM_MAPS.forEach(function (M) { wmRO.observe(M.el); }); } else window.addEventListener('resize', wmFitSoon);


      /* ------------- responsibilities modal ------------- */

      function openResp() {
        if (!currentMuni || !window.SA_RESPONSIBILITIES) return;
        // The intro paragraph carries the framing, so no separate modal title here.
        openModal(SA_RESPONSIBILITIES.build(currentMuni, currentShort));
      }

      // Ballot explainer — reuses the same modal shell as the responsibilities popup.
      function openBallot(i) {
        var b = currentBallots[i];
        if (!b) return;
        openModal(
          '<div class="mf-ballot-modal-head">' +
            ballotPaper(b.color) +
            '<div class="mf-ballot-modal-cap">' +
              '<span class="mf-ballot-k" style="color:' + b.color + '">' + esc(b.label) + '</span>' +
              '<b class="t">' + b.title + '</b>' +
            '</div>' +
          '</div>' +
          '<p class="mf-resp-note">' + b.detail + '</p>');
      }

      /* ------------- Auditor-General outcome explainer ------------- */
      var AG_OUTCOMES = {
        order: ['clean', 'unqualified', 'qualified', 'adverse', 'disclaimer', 'outstanding'],
        meta: {
          clean:       { name: 'Clean audit',              short: 'Clean' },
          unqualified: { name: 'Unqualified with findings', short: 'Unqualified' },
          qualified:   { name: 'Qualified opinion',        short: 'Qualified' },
          adverse:     { name: 'Adverse opinion',          short: 'Adverse' },
          disclaimer:  { name: 'Disclaimer of opinion',    short: 'Disclaimer' },
          outstanding: { name: 'Audit outstanding',        short: 'Outstanding' },
          none:        { name: 'No outcome on file',        short: 'Not on file' }
        },
        lead: {
          clean:       'A clean audit means the financial statements are free of material error <b>and</b> the municipality complied with the key laws and reported reliably on its service delivery. It is the best of the outcomes \u2013 and relatively rare.',
          unqualified: 'The financial statements are reliable and can be trusted. But the Auditor-General still raised material findings \u2013 usually non-compliance with laws and regulations, or unreliable performance reporting. The money is accounted for; the governance around it is not yet clean.',
          qualified:   'The financial statements are reliable <b>except</b> for specific areas where the municipality made material misstatements it could not correct. Those parts of the books cannot be relied on.',
          adverse:     'The financial statements contain misstatements so material and widespread that the accounts, taken as a whole, are misleading. The numbers cannot be trusted.',
          disclaimer:  'The municipality could not provide enough evidence for the Auditor-General to form an opinion at all. So much information was missing or unreliable that the books are effectively un-auditable. This is the worst outcome and a strong signal of administrative collapse.',
          outstanding: 'The audit for this period has not been completed or submitted, so no opinion has been issued. A late or missing audit is a red flag in itself.',
          none:        'We have not yet recorded this municipality\u2019s Auditor-General outcome in the Elections Hub. This is a gap in our data, <b>not</b> an audit result \u2013 the outcomes shown below the line reflect the full scale the AG uses. Check the AG\u2019s Municipal Finance Management Act report for the official finding.'
        },
        scale: {
          clean:       'Clean financials, plus compliance and performance reporting in order.',
          unqualified: 'Financials are reliable, but with material findings on compliance or performance.',
          qualified:   'Reliable except for specific misstatements that could not be corrected.',
          adverse:     'Misstatements so widespread the accounts as a whole are misleading.',
          disclaimer:  'Too little reliable evidence for any opinion.',
          outstanding: 'Audit not completed or submitted on time \u2014 no opinion issued.'
        }
      };

      function openAG(key) {
        key = (key && AG_OUTCOMES.meta[key]) ? key : 'none';
        var meta = AG_OUTCOMES.meta[key];
        var scale = AG_OUTCOMES.order.map(function (k) {
          var mt = AG_OUTCOMES.meta[k];
          var cur = (k === key);
          return '<li' + (cur ? ' class="is-current"' : '') + '>' +
              '<span class="ag-chip ag-' + k + '" aria-hidden="true">' + esc(mt.short) + '</span>' +
              '<span class="mf-resp-txt">' +
                AG_OUTCOMES.scale[k] +
              '</span>' +
            '</li>';
        }).join('');
        openModal(
          '<div class="mf-ag-hero">' +
            '<span class="ag-chip ag-' + key + ' mf-ag-modal-chip">' + esc(meta.short) + '</span>' +
            '<b class="mf-ag-title">' + meta.name + '</b>' +
            '<p class="mf-ag-lead">' + AG_OUTCOMES.lead[key] + '</p>' +
            '</div>' +
          '<div class="mf-resp-sec mf-ag-scale-sec">' +
            '<h3 class="mf-resp-h">The six outcomes — <span style="text-transform:uppercase">best to worst</span></h3>' +
            '<ul class="mf-resp-list mf-ag-scale">' + scale + '</ul>' +
          '</div>');
      }

      /* ------------- Reality Check rating explainer (v21) -------------
         A black header with the result, like the button that opens it. Then the
         working as a ledger: each measure's score in the left column, the figures
         behind it beside the score, and the rating under a rule. The rules that
         apply to every council sit in a grey panel at the foot.
         Styles: "v21 · Reality Check explainer" in the stylesheet. */
      var RC_CODE_TXT = { nd: 'Not disclosed', pnd: 'Disclosed, but not as a percentage', nf: 'Audit not finalised' };
      // The national fifths for one measure, with this council's band in black.
      function rcScale(p) {
        var t = rcCutoffs()[p.ms.k].t, fmt = p.ms.rand ? rcPer : rcPct;
        return '<div class="rcx-scale" aria-hidden="true">' + [0, 1, 2, 3, 4].map(function (i) {
          return '<span class="rcx-band' + (p.base === 5 - i ? ' is-on' : '') + '"><span class="sc">' + (5 - i) + '</span>' +
            '<span class="rg">' + (i < 4 ? 'up to ' + fmt(t[i]) : 'over ' + fmt(t[3])) + '</span></span>';
        }).join('') + '</div>';
      }
      function rcCap(p) {
        var raw = p.base + (p.tr || 0);
        return raw > 5 ? ' Capped at 5.' : raw < 1 ? ' Kept at the minimum of 1.' : '';
      }
      // The improvement adjustment (2024/25 against 2020/21), led by its points.
      function rcAdj(p, txt) {
        var v = p.tr > 0 ? '+1' : p.tr < 0 ? '\u22121' : 'No change';
        return '<p class="rcx-adj"><span class="rcx-adj-v' + (p.tr > 0 ? ' is-up' : p.tr < 0 ? ' is-down' : '') + '">' + v + '</span>' +
          '<span class="rcx-adj-t">' + txt + rcCap(p) + '</span></p>';
      }
      function rcBody(key, p) {
        var F = window.MF_UIFW, yrs = F.years, y0 = yrs[0], y1 = yrs[yrs.length - 1];
        if (p.ms.k === 'ag') {
          var a5 = MUNIS[key].ag5, ay = (window.AG_ANNEX3 && AG_ANNEX3.years) || yrs;
          var nm = function (o) { return AG_OUTCOMES.meta[o].short.toLowerCase(); };
          var o0 = a5[0], o1 = a5[a5.length - 1];
          var cmp = p.tr > 0 ? 'better than' : p.tr < 0 ? 'worse than' : 'the same as';
          return '<div class="rcx-years" style="--n:' + a5.length + '">' + a5.map(function (o, i) {
              return '<span class="rcx-yr"><span class="y">' + ay[i] + '</span><span class="ag-chip ag-' + o + ' rcx-ag">' +
                esc(AG_OUTCOMES.meta[o].short) + '</span><span class="pt">' + p.pts[i] + '</span></span>';
            }).join('') + '</div>' +
            '<p class="rcx-fig">Average: (' + p.pts.join(' + ') + ') \u00f7 ' + p.pts.length + ' = <strong>' + rcNum(p.base) + '</strong></p>' +
            rcAdj(p, ay[ay.length - 1] + ' (' + nm(o1) + ') is ' + cmp + ' ' + ay[0] + ' (' + nm(o0) + ').');
        }
        if (p.code === 'na') return '<p class="rcx-fig">Not a service provider, so this measure is left out.</p>';
        if (p.code) return '<p class="rcx-fig">' + esc(RC_CODE_TXT[p.code] || p.code) + ' (' + y1 + '), so this measure scores 1.</p>' + rcScale(p);
        if (p.ms.k === 'ex') {
          var dir = p.tr > 0 ? 'down from' : p.tr < 0 ? 'up from' : 'the same as';
          return '<p class="rcx-fig">Five-year average: ' + fmtRand(p.avgT) + ' \u00f7 ' + rcThou(MUNIS[key].popN) +
              ' residents = <strong>' + rcPer(p.v) + ' per resident</strong></p>' + rcScale(p) +
            rcAdj(p, y1 + ': ' + fmtRand(p.last) + ', ' + dir + ' ' + fmtRand(p.first) + ' in ' + y0 + '.');
        }
        var w = p.ms.k === 'w', q = w ? F.data[key].wq : F.data[key].eq;
        return '<p class="rcx-fig">' + y1 + ': <strong>' + rcPct(p.v) + (q ? '*' : '') + '</strong> of ' + (w ? 'water' : 'electricity') + ' lost</p>' +
          rcScale(p) + (q ? '<p class="rcx-note">* The Auditor-General qualified this figure.</p>' : '');
      }
      var RC_RULES = [
        'The rating uses only figures from the Auditor-General\u2019s MFMA 2024-25 report: five years of audit outcomes and of unauthorised, irregular, fruitless and wasteful expenditure, and the 2024/25 water and electricity losses. No editorial judgement is involved.',
        'Each year\u2019s audit outcome earns points on the Auditor-General\u2019s own scale: clean 5, unqualified with findings 4, qualified 3, adverse 2, disclaimer or audit not finalised 1. The five years are averaged.',
        'Expenditure is averaged over the five years and divided by the number of residents (Stats SA Census 2022), so that large and small councils can be compared.',
        'Improvement counts. For audit outcomes and expenditure, 2024/25 is compared with 2020/21, the last financial year before the 2021 local elections: better adds 1 point, worse takes 1 off. No score goes below 1 or above 5.',
        'Expenditure, water losses and electricity losses are ranked against every local and metropolitan municipality and split into fifths: the best fifth scores 5, the worst fifth 1, and lower is always better. The cut-offs are set by the national figures, not chosen by Daily Maverick.',
        'The rating is the average of the four scores, rounded to the nearest half star. An average exactly between two half stars rounds up.',
        'Where a council does not supply water or electricity itself, that measure is left out. A loss that was not disclosed, not given as a percentage, or not reported because the audit was not finalised scores 1: the Municipal Finance Management Act requires councils to disclose material losses. Figures the Auditor-General qualified (*) are used as published.'
      ];
      var RC_SR5 = '<span class="rcx-sr"> out of 5</span>';
      // One ledger line: the measure, its score (left column on wide screens, right on phones) and its working.
      function rcRow(key, p) {
        return '<div class="rcx-row' + (p.skip ? ' is-off' : '') + '"><h4 class="rcx-name">' + p.ms.name + '</h4>' +
          '<span class="rcx-sc">' + (p.skip ? '<span aria-hidden="true">\u2014</span><span class="rcx-sr">Left out</span>' : rcNum(p.s) + RC_SR5) + '</span>' +
          '<div class="rcx-body">' + rcBody(key, p) + '</div></div>';
      }
      function openRC() {
        if (!currentMuni || !currentKey) return;
        var r = rcRating(currentKey);
        if (!r) return;
        var n = r.used.length, st = rcNum(r.stars);
        var total = '<div class="rcx-row rcx-total"><h4 class="rcx-name">The rating</h4><span class="rcx-sc">' + st + RC_SR5 + '</span>' +
          '<div class="rcx-body"><p class="rcx-fig">Average of the ' + ['', '', 'two', 'three', 'four'][n] + ' scores' +
            (n < 4 ? ' that apply' : '') + ': (' + r.used.map(function (p) { return rcNum(p.s); }).join(' + ') + ') \u00f7 ' + n + ' = ' + rcNum(r.avg) +
            (r.avg !== r.stars ? ', rounded to the nearest half star: ' : ', or ') + '<strong>' + st + ' out of 5</strong>.</p></div></div>';
        openModal(
          '<div class="rcx">' +
            '<div class="rcx-hero">' +
              '<span class="rcx-wm">Reality Check</span>' +
              '<h2 class="rcx-title">' + esc(currentShort || shortName(currentMuni)) + '</h2>' +
              '<div class="rcx-rating">' + rcStarsHtml(r.stars) + '<span class="rcx-of">' + st + ' out of 5</span></div>' +
            '</div>' +
            '<div class="rcx-main">' +
              '<h3 class="rcx-h">How the rating is calculated</h3>' +
              '<div class="rcx-ledger">' + r.parts.map(function (p) { return rcRow(currentKey, p); }).join('') + total + '</div>' +
            '</div>' +
            '<div class="rcx-rules">' +
              '<h3 class="rcx-h">The rules, applied to every council</h3>' +
              '<ol class="rcx-rl">' + RC_RULES.map(function (t, i) {
                return '<li><span class="n" aria-hidden="true">' + (i + 1) + '</span><span class="t">' + t + '</span></li>';
              }).join('') + '</ol>' +
              '<p class="rcx-src">Sources: <a href="https://www.agsa.co.za/Reporting/MFMAReports.aspx" target="_blank" rel="noopener">Auditor-General of South Africa, MFMA 2024-25</a> \u00b7 ' +
                '<a href="https://census.statssa.gov.za" target="_blank" rel="noopener">Stats SA Census 2022</a></p>' +
            '</div>' +
          '</div>', '', 'rc');
      }

      // Explainer triggers inside the file. The keyboard path covers the role="button" elements and member buttons.
      function fileAction(e, keyboard) {
        var t = e.target, el;
        if (t.closest('.mf-ag5-chip')) { if (keyboard) { e.preventDefault(); t.closest('.mf-ag5-chip').click(); } return; }
        if ((el = t.closest('[data-rc]'))) openRC();
        else if ((el = t.closest('[data-ag]'))) openAG(el.getAttribute('data-ag'));
        else if ((el = t.closest('[data-ballot]'))) openBallot(parseInt(el.getAttribute('data-ballot'), 10));
        else if ((el = t.closest('[data-pick]'))) pickKey(el.getAttribute('data-pick'));
        else if (!keyboard && t.closest('[data-distresp]')) openDistResp();
        else if (!keyboard && t.closest('[data-resp]')) openResp();
        else return;
        e.preventDefault();
      }
      $fileBody.addEventListener('click', function (e) { fileAction(e, false); });
      $fileBody.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileAction(e, true); });

      /* ------------- v19 · use my location -------------
         The browser gives the reader's coordinates; ehCall('locate') turns them into a municipality
         and, when the API knows it, a ward, which is then selected. Typing a place works as before. */
      var $locate = document.getElementById('mf-locate');
      var $locMsg = document.getElementById('mf-loc-msg');
      var $locLbl = $locate && $locate.querySelector('.mf-locate-lbl');
      var LOC_IDLE = $locLbl ? $locLbl.textContent : 'Use my location';
      function locMsg(text) {
        if (!$locMsg) return;
        $locMsg.textContent = text || '';
        $locMsg.hidden = !text;
      }
      function locBusy(on) {
        $locate.disabled = on;
        $locate.classList.toggle('is-busy', on);
        $locate.setAttribute('aria-busy', on ? 'true' : 'false');
        if ($locLbl) $locLbl.textContent = on ? 'Locating\u2026' : LOC_IDLE;
      }
      function openFromLocation(r, ll) {   // v24.1: ll, the reader's spot, [longitude, latitude]
        var m = MUNIS[r.muni], s = shortName(m), sl = s.toLowerCase();
        pick({ n: r.place || s, m: r.muni, p: m.p, _muni: true, _kind: m.dtype === 'district' ? 'district' : 'muni', _n: sl, _k: sl });
        followArea(r.muni);
        var wn = r.ward == null ? '' : String(r.ward).replace(/\D/g, '');
        var hasWard = !!(wn && wardMuni && wardMuni.key === r.muni && $wardSelect.querySelector('option[value="' + wn + '"]'));
        if (hasWard) { $wardSelect.value = wn; wmLocAt = ll || null; openWardPanel(); }
        $hint.innerHTML = hasWard ? 'Your location is ' + (r.exact ? 'in' : 'in or near') + ' <b>Ward ' + esc(wn) + '</b> of the <b>' + esc(m.n) + '</b>. Not sure? Use the IEC link under the ward box.' : 'Your location falls within the <b>' + esc(m.n) + '</b>.';
      }
      function locFail(text) {
        locMsg(text);
      }
      function locateMe() {
        locMsg('');
        locBusy(true);
        function onPos(pos) {
          var c = pos.coords;
          ehCall('locate', [{ lat: c.latitude, lng: c.longitude, accuracy: c.accuracy }]).then(function (r) {
            locBusy(false);
            if (r && MUNIS[r.muni]) openFromLocation(r, [c.longitude, c.latitude]);
            else locMsg('We couldn\u2019t match your location to a South African municipality. Type a place name instead.');
          }, function () {
            locBusy(false);
            locMsg('We couldn\u2019t look up your location just now. Try again, or type a place name instead.');
          });
        }
        function onErr(err) {
          locBusy(false);
          locFail(err && err.code === 1
            ? 'Location access is blocked for this page. Allow it in your browser settings, or type a place name instead.'
            : err && err.code === 3
              ? 'Finding your location took too long. Try again, or type a place name instead.'
              : 'Your location isn\u2019t available right now. Type a place name instead.');
        }
        try {
          navigator.geolocation.getCurrentPosition(onPos, onErr, { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 });
        } catch (e) { onErr(null); }
      }
      if ($locate) {
        if (!navigator.geolocation || !ehApi('locate')) $locate.hidden = true;
        else $locate.addEventListener('click', locateMe);
      }

      /* ------------- events ------------- */

      $input.addEventListener('input', function () {
        setClearVisible(!!$input.value);
        locMsg('');
        // Editing the box starts a fresh search: drop any open file so the
        // result panel can never get out of sync with what's typed.
        if ($widget.classList.contains('is-result')) {
          $widget.classList.remove('is-result');
        }
        render(search($input.value), $input.value);
      });

      $input.addEventListener('focus', function () {
        if ($input.value.trim()) render(search($input.value), $input.value);
        // v12 · phones: lift the search box towards the top of the screen once the keyboard
        // is up, so the suggestions have room to show above it.
        if (!isPhone()) return;
        setTimeout(function () {
          if (document.activeElement !== $input) return;
          var top = $row.getBoundingClientRect().top;
          if (top > 76) window.scrollTo({ top: window.pageYOffset + top - 16, behavior: 'smooth' });
        }, 300);
      });

      $input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
        else if (e.key === 'Enter') {
          if (current.length && active >= 0) { e.preventDefault(); choose(current[active]); }
        }
        else if (e.key === 'Escape') {
          if ($list.classList.contains('is-open')) {
            closeList();
          } else if ($input.value || $widget.classList.contains('is-result')) {
            resetSearch();
          }
        }
      });

      $list.addEventListener('mousedown', function (e) {
        var el = e.target.closest('.mf-suggest-item');
        if (!el) return;
        e.preventDefault();
        var i = parseInt(el.getAttribute('data-i'), 10);
        if (!isNaN(i) && current[i]) choose(current[i]);
      });

      $clear.addEventListener('click', function () {
        resetSearch();
      });

      // Click-outside dismiss
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.mf-combo')) {
          closeList();
        }
      });

      // post-elections · Results across South Africa opens files through this.
      window.DM_EH_OPEN = function (key) { if (MUNIS[key]) pickKey(key); };

      // post-elections v24 · a council from an anchor (see "anchors"): its file, its province in the tabs under the finder (followArea), then
      // the ward the anchor names, or coalition mode (DM_EH_COAL). now: the page opening on it, no scroll animation. A ward of the council
      // already open is chosen where it stands.
      window.DM_EH_GO = function (key, o, now) {
        if (!MUNIS[key]) return false;
        o = o || {};
        var wn = String(o.ward || '').replace(/\D/g, ''), same = !o.coal && currentKey === key && $widget.classList.contains('is-result');
        booting = !!now;
        try {
          if (!same) {
            if (o.coal && window.DM_EH_COAL) DM_EH_COAL(key); else pickKey(key);
            followArea(key);
          }
          if (wn && wardMuni && wardMuni.key === key && $wardSelect.value !== wn && $wardSelect.querySelector('option[value="' + wn + '"]')) {
            $wardSelect.value = wn;
            openWardPanel();
          }
        } finally { booting = false; }
        return true;
      };
      // Boot: open the council the address asks for, no scroll animation (v24: its anchor, EH_ANCHOR.start; or ?muni=<key>&ward=<n>, the links before v24)
      try {
        var st = window.EH_ANCHOR ? EH_ANCHOR.start : (function () { var q = new URL(window.location.href).searchParams; return { key: q.get('muni'), ward: q.get('ward') }; })();
        if (st && st.key && MUNIS[st.key]) DM_EH_GO(st.key, st, true);
      } catch (e) { /* no URL API / file:// — skip the deep link */ }
    }());
});

/* ==== post-elections v24 · anchors: going there ====
   Last, once every part of the page is set up: the anchor the page opened with (EH_ANCHOR.start, see "anchors"; the tabs and the
   municipality finder have opened what it asks for in their boots), the address rewritten as its anchor and the part held at the top of
   the screen; then any anchor typed into the address bar or followed from a link on the page. */
guard("anchors, going there", function () {
  var X = window.EH_ANCHOR;
  if (!X) return;
  if (X.start) X.go(X.start, true);
  window.addEventListener('hashchange', function () { var a = X.parse(location.hash); if (a) X.go(a, false); });
});

/* ==== v27 · coalition builder ====
   post-elections v2: the builder now runs on the results, from the seat board (see "seat board" and "coalition builder, results"). */

/* ==== election-day countdown ====
   post-elections: removed. The masthead shows the share of voting districts declared (see "results"). */

} var started = false, tries = 0;
  function ready() { return document.getElementById('mf-widget') && document.getElementById('eh-live-more'); }
  function start() {
    if (started) return;
    if (ready()) { started = true; run(); }
    else if (tries++ < 600) setTimeout(start, 50);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
