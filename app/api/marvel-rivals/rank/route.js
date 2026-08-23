import { NextResponse } from "next/server";

// const userAgent = process.env.USER_AGENT;

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

export const revalidate = 900;

export async function GET(request) {

  const obj = Object.fromEntries(request.nextUrl.searchParams);
  let { player, type = "text", lang = "pt", channel, msg } = obj;

  // Return a message informing the API is not in operation
  if (lang == "pt") return NextResponse.json({ message: "Infelizmente, a API de Marvel Rivals está indisponível :(" }, { status: 200 });
  if (lang != "pt") return NextResponse.json({ message: "Unfortunately, the Marvel Rivals API is unavailable :(" }, { status: 200 });

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
    // next: { revalidate: 3600 * 12 }, // 12 hours
    browser: "chrome_149",
    headers: {
      // "User-Agent": userAgent
    }
  });

  console.log("seasonRequest: ", seasonRequest);

  const seasonResponse = await seasonRequest.json();

  if (seasonResponse.errors) {
    return NextResponse.json({ error: `Player not found: ${player}` }, { status: 200 });
  }

  // Get rank
  const rankRequest = await fetch(rankURL(player), {
    method: "GET",
    browser: "chrome_149",
    // next: { revalidate: 900 }, // 15 minutes
    headers: {
      // "User-Agent": userAgent
    }
  });

  const rankResponse = await rankRequest.json();

  if (!rankResponse.data.history) {
    return NextResponse.json({ error: `Player not ranked (yet): ${player}` }, { status: 200 });
  }

  // Get wins
  const winsRequest = await fetch(winsURL(player, seasonResponse.data.metadata.currentSeason), {
    method: "GET",
    browser: "chrome_149",
    // next: { revalidate: 900 }, // 15 minutes
    headers: {
      // "User-Agent": userAgent
    }
  });

  const winsResponse = await winsRequest.json();

  const username = seasonResponse.data.platformInfo.platformUserHandle; // Coreano
  const rankInfo = rankResponse.data.history.data[0][1].value[0]; // Celestial II
  const score = rankResponse.data.history.data[0][1].value[1]; // 4974
  const wins = winsResponse.data[0]?.stats.matchesWon.value || 0; // 15

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