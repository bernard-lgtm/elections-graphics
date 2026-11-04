/* graphics.js — every graphic in the library, read by the library (index.html) and by the embed page (graphic.html).
   group: area (South Africa or a province) or muni (a council). views: [id, label in the library, kicker on the graphic].
   h: the embed's fixed height, the same on desktop and phones (the frame's height in the embed code; the graphic fits itself to it,
   see embed-fit.js and README.md). hv: a view's own height where it differs. */
window.EHX_PROV = [['', 'South Africa'], ['GP', 'Gauteng'], ['WC', 'Western Cape'], ['KZN', 'KwaZulu-Natal'], ['EC', 'Eastern Cape'], ['LP', 'Limpopo'], ['MP', 'Mpumalanga'], ['NW', 'North West'], ['FS', 'Free State'], ['NC', 'Northern Cape']];
window.EHX_GRAPHICS = [
  { id: 'map', h: 780, group: 'area', tab: 'results', name: 'Councils by leading party', kicker: 'Leading party by council',
    desc: 'Every metro and local council coloured by the party leading it, with party support beside the map. Readers can open a province from the map and point at a party to find its councils.' },
  { id: 'support', h: 520, group: 'area', tab: 'results', name: 'Party support', kicker: 'Party support',
    desc: 'Each party\u2019s share of the vote as a bar, for South Africa or a province.' },
  { id: 'turnout', h: 780, group: 'area', tab: 'turnout', name: 'Councils by turnout', kicker: 'Turnout by council',
    desc: 'The councils in bands of turnout, with the key beside the map.' },
  { id: 'table', h: 760, group: 'area', tab: 'results', name: 'Results by council', kicker: 'Results by council', provOnly: true,
    desc: 'A province\u2019s councils with the party leading each and its share of the vote, then the district councils.' },
  { id: 'hung', h: 760, group: 'area', tab: 'hung-councils', name: 'Hung councils', kicker: 'Hung councils',
    views: [['map', 'Map', 'Hung councils'], ['list', 'List', 'Hung councils']],
    desc: 'Councils where no party has a majority. Map: the hung councils raised, with the figures beside it. List: each hung council with its largest party and the seats that party is short of a majority.' },
  { id: 'cmp', h: 640, group: 'area', tab: 'change-since-2021', name: 'Change since 2021', kicker: 'Change since 2021',
    views: [['party', 'Leading party', 'Change since 2021: leading party'], ['turnout', 'Turnout', 'Change since 2021: turnout'], ['hung', 'Hung councils', 'Change since 2021: hung councils'], ['support', 'Party support', 'Change since 2021: party support'], ['councils', 'Councils', 'Change since 2021: councils']],
    desc: 'This election beside the last: the councils map in 2021 and 2026 side by side by leading party, turnout or hung councils; or party support and the councils with the change.' },
  { id: 'council', h: 660, group: 'muni', name: 'Council at a glance', kicker: 'Council results',
    desc: 'The council\u2019s banner from the hub: turnout, registered voters, the count in the council and the leading party, with the locator map.' },
  { id: 'seats', h: 760, group: 'muni', name: 'Council seats', kicker: 'Council seats',
    desc: 'The council\u2019s seats as a half circle, largest party from the left. Empty until the council\u2019s count is done, then Provisional, then Declared.' },
  { id: 'coalition', h: 760, group: 'muni', name: 'Coalition builder', kicker: 'Coalition builder',
    desc: 'For a council with no majority: readers pick parties, the tally in the middle of the council\u2019s seats counts towards a majority, and Start again clears it. Until the council\u2019s count is done, and where a party has a majority, it shows the seats.' },
  { id: 'votes', h: 720, group: 'muni', name: 'Votes by party', kicker: 'Votes by party',
    desc: 'The council\u2019s parties with their votes, share of the vote and seats.' },
  { id: 'wards', h: 760, group: 'muni', name: 'Results by ward', kicker: 'Results by ward',
    views: [['win', 'Leading party', 'Results by ward'], ['turn', 'Turnout', 'Turnout by ward'], ['cmp', 'Change since 2021', 'Wards: change since 2021']],
    desc: 'The council\u2019s wards coloured by the party leading each, by turnout, or by the change since 2021.' },
  { id: 'ward', h: 760, group: 'muni', ward: true, name: 'Ward result', kicker: 'Ward result',
    desc: 'One ward: the candidate leading or elected, and every candidate\u2019s votes.' }
];
