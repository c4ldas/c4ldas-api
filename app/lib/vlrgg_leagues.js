/*
Leagues list from https://vlr.gg
This list is used on the /valorant/schedule-vlr endpoint as well as the /valorant/schedule-vlrgg page

Structure: 
  {
    name: "Name of the league on VLRGG. Must be exactly the same as the name on VLRGG",
    displayName: "Display name of the league on the response",
    code: "Code used on the endpoint.",
    round_info: "For leagues that have qualifiers, the name of the stage on VLRGG. I.e.: https://www.vlr.gg/event/2449/esports-world-cup-2025"
  },

  Round info is used for events that have qualifiers, that work as a sub-league. Example: 
  "Esports World Cup 2025" has some regional qualifiers:
  - Pacific X Asian Champions League Qualifier
  - Americas Qualifier
  - EMEA Qualifier

  In vlr.gg, they are all inside Espoerts World Cup 2025, but to separate them, we use round_info, otherwise, we would have a lot of games on the same day
*/

const leagues = [
  {
    name: "Tixinha Invitational by BONOXS",
    displayName: "Tixinha Invitational by BONOXS",
    code: "tixinha_invitational"
  },
  {
    name: "Gamers Club Challengers League 2025 Brazil: Split 1",
    displayName: "Challengers BR - Split 1",
    code: "vcb_split_1"
  },
  {
    name: "Gamers Club Challengers League 2025 Brazil: Split 2",
    displayName: "Challengers BR - Split 2",
    code: "vcb_split_2"
  },
  {
    name: "Champions Tour 2025: Americas Stage 1",
    displayName: "VCT Americas",
    code: "vct_americas"
  },
  {
    name: "Champions Tour 2025: EMEA Stage 1",
    displayName: "VCT EMEA",
    code: "vct_emea"
  },
  {
    name: "Champions Tour 2025: Masters Bangkok",
    displayName: "Masters Bangkok",
    code: "masters_bangkok"
  },
  {
    name: "Valorant Masters Toronto 2025",
    displayName: "Masters Toronto",
    code: "masters_toronto"
  },
  {
    name: "Valorant Champions 2025",
    displayName: "Champions 2025",
    code: "valorant_champions_2025"
  },
  {
    name: "Esports World Cup 2025",
    displayName: "EWC 2025",
    code: "ewc_2025"
  },
  {
    name: "Esports World Cup 2025",
    displayName: "EWC 2025 - Americas Qualifier",
    code: "ewc_2025_americas_qualifier",
    round_info: "Americas Qualifier"
  },
  {
    name: "Esports World Cup 2025",
    displayName: "EWC 2025 - EMEA Qualifier",
    code: "ewc_2025_emea_qualifier",
    round_info: "EMEA Qualifier"
  },
  {
    name: "Esports World Cup 2025",
    displayName: "EWC 2025 - Pacific x Asian Champions League Qualifier",
    code: "ewc_2025_pacific_qualifier",
    round_info: "Pacific X Asian Champions League Qualifier"
  },
];

export default leagues;
