/*
- Cache requests for 15 min
- base URL: https://api.tracker.gg/api/v2/marvel-rivals
- Method: GET
- Headers:
Cache-Control: -
Origin: -
User-Agent: -


- Get current season and username:
https://api.tracker.gg/api/v2/marvel-rivals/standard/profile/ign/USERNAME
current_season: json.data.metadata.currentSeason
username: json.data.platformInfo.platformUserHandle


Incorrect username:
{
  "errors": [
    {
      "code": "CollectorResultStatus::NotFound",
      "message": "We could not find the player XXXXXXX. Are you using the right Account Name?",
      "data": {}
    }
  ]
}


- Get Rank and score:
https://api.tracker.gg/api/v2/marvel-rivals/standard/profile/ign/USERNAME/stats/overview/ranked?mode=competitive
rank: json.data.history.data[0][1].value[0] // Celestial II
score: json.data.history.data[0][1].value[1] // 4974

No rank data:
{
  "data": {
    "history": null,
    "leaderboard": null,
    "expiryDate": "2025-05-01T04:51:42.6637698+00:00",
    "bestMatches": null
  }
}


- Get wins amount:
https://api.tracker.gg/api/v2/marvel-rivals/standard/profile/ign/USERNAME/segments/career?mode=competitive&season=CURRENT_SEASON
wins: json.data[0].stats.matchesWon.value // 15

No data:
{
  "data": []
}
*/

import { NextResponse } from "next/server";

// Tiers data to be translated to Portuguese
export const tiers = [
  { tier_name: "Unranked", tier_name_pt: "Sem classificação" },
  { tier_name: "Bronze I", tier_name_pt: "Bronze I" },
  { tier_name: "Bronze II", tier_name_pt: "Bronze II" },
  { tier_name: "Bronze III", tier_name_pt: "Bronze III" },
  { tier_name: "Silver I", tier_name_pt: "Prata I" },
  { tier_name: "Silver II", tier_name_pt: "Prata II" },
  { tier_name: "Silver III", tier_name_pt: "Prata III" },
  { tier_name: "Gold I", tier_name_pt: "Ouro I" },
  { tier_name: "Gold II", tier_name_pt: "Ouro II" },
  { tier_name: "Gold III", tier_name_pt: "Ouro III" },
  { tier_name: "Platinum I", tier_name_pt: "Platina I" },
  { tier_name: "Platinum II", tier_name_pt: "Platina II" },
  { tier_name: "Platinum III", tier_name_pt: "Platina III" },
  { tier_name: "Diamond I", tier_name_pt: "Diamante I" },
  { tier_name: "Diamond II", tier_name_pt: "Diamante II" },
  { tier_name: "Diamond III", tier_name_pt: "Diamante III" },
  { tier_name: "Celestial I", tier_name_pt: "Celestial I" },
  { tier_name: "Celestial II", tier_name_pt: "Celestial II" },
  { tier_name: "Celestial III", tier_name_pt: "Celestial III" },
  { tier_name: "Eternity", tier_name_pt: "Eternidade" },
  { tier_name: "One Above All", tier_name_pt: "Acima de Todos" }
];

export async function GET(request) {
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  let { player, type = "text", lang = "pt", channel, msg } = obj;

  if (!player) return NextResponse.json({ error: "Missing player name" }, { status: 200 });
  if (!channel) return NextResponse.json({ error: "Missing channel" }, { status: 200 });

  if (!msg && lang == "pt") msg = "(player) está (rank) com score (score) e (vitorias) vitórias.";
  if (!msg && lang != "pt") msg = "(player) is (rank) with score (score) and (wins) wins.";

  const baseURL = "https://api.tracker.gg/api/v2/marvel-rivals/standard/profile/ign";
  const seasonURL = (player) => `${baseURL}/${player}`;
  const rankURL = (player) => `${baseURL}/${player}/stats/overview/ranked?mode=competitive`;
  const winsURL = (player, season) => `${baseURL}/${player}/segments/career?mode=competitive&season=${season}`;

  // Get current season and username
  const seasonRequest = await fetch(seasonURL(player), {
    method: "GET",
    next: { revalidate: 3600 * 12 }, // 12 hours
    headers: {
      "Cache-Control": "-",
      "Origin": "-",
      "User-Agent": "-",
    }
  });

  console.log(seasonRequest);
  const seasonResponse = await seasonRequest.json();

  if (seasonResponse.errors) {
    return NextResponse.json({ error: `Player not found: ${player}` }, { status: 200 });
  }

  // Get rank
  const rankRequest = await fetch(rankURL(player), {
    method: "GET",
    next: { revalidate: 900 }, // 15 minutes
    headers: {
      "Cache-Control": "-",
      "Origin": "-",
      "User-Agent": "-",
    }
  });

  const rankResponse = await rankRequest.json();

  if (!rankResponse.data.history) {
    return NextResponse.json({ error: `Player not ranked (yet): ${player}` }, { status: 200 });
  }

  // Get wins
  const winsRequest = await fetch(winsURL(player, seasonResponse.data.metadata.currentSeason), {
    method: "GET",
    next: { revalidate: 900 }, // 15 minutes
    headers: {
      "Cache-Control": "-",
      "Origin": "-",
      "User-Agent": "-",
    }
  });

  const winsResponse = await winsRequest.json();

  const username = seasonResponse.data.platformInfo.platformUserHandle; // Coreano
  const rankInfo = rankResponse.data.history.data[0][1].value[0]; // Celestial II
  const score = rankResponse.data.history.data[0][1].value[1]; // 4974
  const wins = winsResponse.data[0]?.stats.matchesWon.value || 0; // 15

  // return NextResponse.json({ username, rank, score, wins, current_season }, { status: 200 });
  return sendResponse({ username, rankInfo, score, wins }, type, msg, lang);

}

// Format and send response
async function sendResponse(data, type, msg, lang) {

  const { username, rankInfo, score, wins } = data;

  const rank = lang == "pt" ? tiers.find(t => t.tier_name == rankInfo).tier_name_pt : rankInfo;

  const formattedMessage = msg
    .replace(/\(player\)/g, username)
    .replace(/\(rank\)/g, rank)
    .replace(/\(score\)/g, score)
    .replace(/\(vitorias\)/g, wins)
    .replace(/\(wins\)/g, wins);

  if (type != "text") {
    data.message = formattedMessage;
    console.log(formattedMessage);
    return NextResponse.json(data, { status: 200 });
  }
  console.log(formattedMessage);
  return new Response(formattedMessage, { status: 200 });
}


/*
// Old code using mrapi.org API, which is now dead
// https://mrapi.org/api/player-id/Coreano
// https://mrapi.org/api/player/1688689681 

import { NextResponse } from "next/server";
const MARVEL_RIVALS_API_KEY = process.env.MARVEL_RIVALS_API_KEY;

export const tiers = [
  { tier: 0, tier_name: "Unranked", tier_name_pt: "Sem classificação" },
  { tier: 1, tier_name: "Bronze 3", tier_name_pt: "Bronze 3" },
  { tier: 2, tier_name: "Bronze 2", tier_name_pt: "Bronze 2" },
  { tier: 3, tier_name: "Bronze 1", tier_name_pt: "Bronze 1" },
  { tier: 4, tier_name: "Silver 3", tier_name_pt: "Prata 3" },
  { tier: 5, tier_name: "Silver 2", tier_name_pt: "Prata 2" },
  { tier: 6, tier_name: "Silver 1", tier_name_pt: "Prata 1" },
  { tier: 7, tier_name: "Gold 3", tier_name_pt: "Ouro 3" },
  { tier: 8, tier_name: "Gold 2", tier_name_pt: "Ouro 2" },
  { tier: 9, tier_name: "Gold 1", tier_name_pt: "Ouro 1" },
  { tier: 10, tier_name: "Platinum 3", tier_name_pt: "Platina 3" },
  { tier: 11, tier_name: "Platinum 2", tier_name_pt: "Platina 2" },
  { tier: 12, tier_name: "Platinum 1", tier_name_pt: "Platina 1" },
  { tier: 13, tier_name: "Diamond 3", tier_name_pt: "Diamante 3" },
  { tier: 14, tier_name: "Diamond 2", tier_name_pt: "Diamante 2" },
  { tier: 15, tier_name: "Diamond 1", tier_name_pt: "Diamante 1" },
  { tier: 16, tier_name: "Grandmaster 3", tier_name_pt: "Grão-Mestre 3" },
  { tier: 17, tier_name: "Grandmaster 2", tier_name_pt: "Grão-Mestre 2" },
  { tier: 18, tier_name: "Grandmaster 1", tier_name_pt: "Grão-Mestre 1" },
  { tier: 19, tier_name: "Celestial 3", tier_name_pt: "Celestial 3" },
  { tier: 20, tier_name: "Celestial 2", tier_name_pt: "Celestial 2" },
  { tier: 21, tier_name: "Celestial 1", tier_name_pt: "Celestial 1" },
  { tier: 22, tier_name: "Eternity", tier_name_pt: "Eternidade" },
  { tier: 23, tier_name: "One Above All", tier_name_pt: "Acima de Todos" }
]

export async function GET(request) {
  try {

    const obj = Object.fromEntries(request.nextUrl.searchParams);
    let msg = obj.msg;
    const { player, type = "text", lang = "pt", channel } = obj;
    if (!msg && lang == "pt") msg = "(player) está (rank) com score (score) e (vitorias) vitórias.";
    if (!msg && lang != "pt") msg = "(player) is (rank) with score (score) and (wins) wins.";

    // Check if player is provided
    if (!player) return NextResponse.json({ error: "Player is required." }, { status: 200 });
    if (!channel || channel == "channel") return NextResponse.json({ error: "Missing channel." }, { status: 200 });

    // Get player id
    const idRequest = await fetch(`https://mrapi.org/api/player-id/${player}`, {
      method: "GET",
      next: { revalidate: 3600 * 12 }, // 12 hours
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": MARVEL_RIVALS_API_KEY
      }
    });

    const idResponse = await idRequest.json();

    if (!idResponse.id) {
      return NextResponse.json({ error: "User not found." }, { status: 200 });
    }


    // Update player data
    await fetch(`https://mrapi.org/api/player-update/${idResponse.id}`, {
      next: { revalidate: 300 }, // 5 minutes
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": MARVEL_RIVALS_API_KEY
      }
    });

    // Get player data
    const playerRequest = await fetch(`https://mrapi.org/api/player/${idResponse.id}`, {
      next: { revalidate: 300 }, // 5 minutes
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": MARVEL_RIVALS_API_KEY
      }
    });

    const playerResponse = await playerRequest.json();
    // console.log("playerResponse:", playerResponse);

    if (playerResponse.error || playerResponse.is_profile_private) {
      return NextResponse.json({ error: "Private profile or User not found." }, { status: 200 });
    }

    if (!playerResponse.rank_history.length) {
      return new Response(`${playerResponse.player_name} not ranked.`, { status: 200 });
    }

    const playerName = playerResponse.player_name;
    const rankObj = playerResponse.rank_history[0].rank; // { new_score: 4201, new_rank: "Diamond 3", new_level: 13 }
    const score = rankObj.new_score;
    const wins = playerResponse.stats.ranked.total_wins;

    return sendResponse({ playerName, rankObj, score, wins }, type, msg, lang);

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: "Internal error, please try again later." }, { status: 200 });

  }
}

async function sendResponse(data, type, msg, lang) {

  const { playerName, rankObj, score, wins } = data;
  const rank = lang == "pt" ? tiers[rankObj.new_level].tier_name_pt : rankObj.new_rank;

  const formattedMessage = msg
    .replace(/\(player\)/g, playerName)
    .replace(/\(rank\)/g, rank)
    .replace(/\(score\)/g, score)
    .replace(/\(vitorias\)/g, wins)
    .replace(/\(wins\)/g, wins);

  if (type != "text") {
    data.message = formattedMessage;
    console.log(formattedMessage);
    return NextResponse.json(data, { status: 200 });
  }
  console.log(formattedMessage);
  return new Response(formattedMessage, { status: 200 });
}
*/