/* graphics.js — every graphic in the library, read by the library (index.html) and by the embed page (graphic.html).
   group: area (South Africa or a province) or muni (a council). views: [id, label in the library, kicker on the graphic].
   h: the embed's fixed height, the same on desktop and phones (the frame's height in the embed code; the graphic fits itself to it,
   see embed-fit.js and README.md). hv: a view's own height where it differs. noStill: interactive only, not among the still graphics
   (the coalition builder and the ward finder need a reader). sdesc: the still graphic's description, where it differs (v3.4: its lists are kept short, see embed.js).
   auto (v3.7): the code's height is measured for the place picked, as tall as the graphic needs there (library.js: AUTO); h is the height
   where it can't be measured. aw: the widths measured where not the article column's and a phone's (the larger taken). muni: the council
   the library opens the graphic on, where not Johannesburg. ballots (v3.8): the note on the ballots over the credit (embed.js), on the
   graphics of the full count (a party's votes on every ballot): true, or the views that have it. A metro's note names its two ballots.
   fluid (v3.11, with auto): measured at the article column's width and a phone's for the council and view picked, the code's height follows
   its width between the two (library.js: fluid), never taller than h. */
window.EHX_PROV = [['', 'South Africa'], ['GP', 'Gauteng'], ['WC', 'Western Cape'], ['KZN', 'KwaZulu-Natal'], ['EC', 'Eastern Cape'], ['LP', 'Limpopo'], ['MP', 'Mpumalanga'], ['NW', 'North West'], ['FS', 'Free State'], ['NC', 'Northern Cape']];
window.EHX_GRAPHICS = [
  { id: 'map', h: 840, ballots: true, group: 'area', tab: 'results', name: 'Councils by leading party', kicker: 'Leading party by council',
    desc: 'Every metro and local council coloured by the party leading it, with party support beside the map. Readers can open a province from the map and point at a party to find its councils.',
    sdesc: 'Every metro and local council coloured by the party leading it, with party support: the five largest parties, then the rest together as Others.' },
  { id: 'support', h: 580, ballots: true, group: 'area', tab: 'results', name: 'Party support', kicker: 'Party support',
    desc: 'Each party\u2019s share of the vote as a bar, for South Africa or a province.',
    sdesc: 'Each party\u2019s share of the vote as a bar, for South Africa or a province: the five largest parties, then the rest together as Others.' },
  { id: 'turnout', h: 800, group: 'area', tab: 'turnout', name: 'Councils by turnout', kicker: 'Turnout by council',
    desc: 'The councils in bands of turnout, with the key beside the map.' },
  { id: 'table', h: 820, ballots: true, group: 'area', tab: 'results', name: 'Results by council', kicker: 'Results by council', provOnly: true,
    desc: 'A province\u2019s councils with the party leading each and its share of the vote, then the district councils.' },
  { id: 'hung', h: 780, group: 'area', tab: 'hung-councils', name: 'Hung councils', kicker: 'Hung councils',
    views: [['map', 'Map', 'Hung councils'], ['list', 'List', 'Hung councils']],
    desc: 'Councils where no party has a majority. Map: the hung councils raised, with the figures beside it. List: each hung council with its largest party and the seats that party is short of a majority.',
    sdesc: 'Councils where no party has a majority. Map: the hung councils raised, with the figures beside it. List: each hung council on a line, with its largest party and the seats that party is short of a majority.' },
  { id: 'cmp', h: 660, hv: { party: 700, support: 700, councils: 700 }, ballots: ['party', 'support', 'councils'], group: 'area', tab: 'change-since-2021', name: 'Change since 2021', kicker: 'Change since 2021',
    views: [['party', 'Leading party', 'Change since 2021: leading party'], ['turnout', 'Turnout', 'Change since 2021: turnout'], ['hung', 'Hung councils', 'Change since 2021: hung councils'], ['support', 'Party support', 'Change since 2021: party support'], ['councils', 'Councils', 'Change since 2021: councils']],
    desc: 'This election beside the last: the councils map in 2021 and 2026 side by side by leading party, turnout or hung councils; or party support and the councils with the change.' },
  { id: 'seats', h: 820, auto: true, ballots: true, group: 'muni', name: 'Council seats', kicker: 'Council seats',
    desc: 'The council\u2019s seats as a half circle, largest party from the left, and under it every party with seats, with its votes as a bar split into ward, PR and district votes (the figures under it) and its seats. The code is as tall as the council\u2019s parties need. Empty until the council\u2019s count is done, then Provisional, then Declared.' },
  { id: 'coalition', h: 620, auto: true, aw: [360], muni: 'lesedi', group: 'muni', name: 'Coalition builder', kicker: 'Coalition builder', noStill: true, hungOnly: true,
    desc: 'For a council with no majority: readers pick parties, the tally in the middle of the council\u2019s seats counts towards a majority, and the button at the top right clears it. The list has only the hung councils in the figures the preview shows, and opens on Lesedi. The code is as tall as a phone needs; in the article column the parties stand beside the half circle where that draws it larger.' },
  { id: 'votes', h: 780, ballots: true, group: 'muni', name: 'Votes by party', kicker: 'Votes by party',
    desc: 'The council\u2019s parties with their votes, share of the vote and seats.',
    sdesc: 'Every party with seats on the council, with its votes, share of the vote and seats; the parties without seats together as Others.' },
  { id: 'wards', h: 780, auto: true, fluid: true, group: 'muni', name: 'Results by ward', kicker: 'Results by ward',
    views: [['win', 'Leading party', 'Results by ward'], ['turn', 'Turnout', 'Turnout by ward'], ['cmp', 'Change since 2021', 'Wards: change since 2021']],
    desc: 'The council\u2019s wards coloured by the party leading each, by turnout, or by the change since 2021. The code is as tall as the council\u2019s map needs in the view picked, in the article column and on a phone.' },
  { id: 'ward', h: 780, group: 'muni', ward: true, name: 'Ward result (single)', kicker: 'Ward result',
    desc: 'One ward: the candidate leading or elected, and every candidate\u2019s votes.',
    sdesc: 'One ward: the candidate leading or elected, and the votes of the candidates of the parties with seats on the council and of any other with 5% of the ward\u2019s votes; the rest together as Others.' },
  { id: 'wardpick', h: 860, group: 'muni', ward: true, locate: true, noStill: true, name: 'All ward results with finder', kicker: 'Ward result',
    desc: 'Ward result with a dropdown of every ward in the council and Use my location, which opens the reader\u2019s own ward, in any council. It opens on the ward picked here.' }
];
