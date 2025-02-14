/**
 * https://mrapi.org/api/player-id/Coreano
 * https://mrapi.org/api/player/1688689681 
**/

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
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  let msg = obj.msg;
  const { player, type = "text", lang = "pt" } = obj;
  if (!msg && lang == "pt") msg = "(player) está (rank) com score (score) e (vitorias) vitórias.";
  if (!msg && lang != "pt") msg = "(player) is (rank) with score (score) and (vitorias) wins.";

  // Check if player is provided
  if (!player) {
    return NextResponse.json({ error: "Player is required." }, { status: 200 });
  }

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

}

async function sendResponse(data, type, msg, lang) {

  const { playerName, rankObj, score, wins } = data;
  const rank = lang == "pt" ? tiers[rankObj.new_level].tier_name_pt : rankObj.new_rank;

  const formattedMessage = msg
    .replace(/\(player\)/g, playerName)
    .replace(/\(rank\)/g, rank)
    .replace(/\(score\)/g, score)
    .replace(/\(vitorias\)/g, wins);

  if (type != "text") {
    data.message = formattedMessage;
    console.log(formattedMessage);
    return NextResponse.json(data, { status: 200 });
  }
  console.log(formattedMessage);
  return new Response(formattedMessage, { status: 200 });
}
/*


import { tiers, urlById, urlByPlayer, getRank, validRegions } from '@/app/lib/valorant_rank';
import { NextResponse } from "next/server";

import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;


const urlLeaderboardId = (region, id) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?puuid=${id}`;
const urlLeaderboardPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?name=${player}&tag=${tag}`;

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  // Get the parameters from URL
  const { player, tag, id, channel, region = "br", msg = "(player) está (rank) com (pontos) pontos.", type = "text" } = obj;

  try {
    const game = "valorant";

    const validParams = await checkParams(player, tag, id, channel, region);
    if (!validParams.status) return NextResponse.json({ error: validParams.error }, { status: 400 });

    // Check if id is provided
    if (id) {
      const data = await getRank(urlById(region, id, type), apiToken);

      // If not Immmortal and not Radiant, return with leaderboardRank and numberOfWins set to 0
      if (data.data.currenttier <= 23) { // Below Immortal and Radiant
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        return sendResponse(data, type, msg);
      }

      // Get leaderboard
      const leaderboard = await getRank(urlLeaderboardId(region, id), apiToken);
      if (leaderboard.status !== 200) {
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        return sendResponse(data, type, msg);
      };
      data.data.leaderboardRank = leaderboard.data[0].leaderboardRank;
      data.data.numberOfWins = leaderboard.data[0].numberOfWins;

      // Send response
      return sendResponse(data, type, msg);
    }

    // Check if player and tag are provided
    if (player && tag) {
      const data = await getRank(urlByPlayer(region, player, tag, type), apiToken);

      // If not Immmortal and not Radiant, return with leaderboardRank and numberOfWins set to 0
      if (data.data.currenttier <= 23) { // Below Immortal and Radiant
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;

        return sendResponse(data, type, msg);
      }

      // Get leaderboard
      const leaderboard = await getRank(urlLeaderboardPlayer(region, player, tag), apiToken);
      if (leaderboard.status !== 200) {
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        return sendResponse(data, type, msg);
      };

      data.data.leaderboardRank = leaderboard.data[0].leaderboardRank;
      data.data.numberOfWins = leaderboard.data[0].numberOfWins;

      // Send response
      return sendResponse(data, type, msg);
    }

    // If id or player/tag are not provided, return error
    return NextResponse.json({ error: "Id or player / tag are required" }, { status: 200 })
  } catch (error) {
    console.log("Valorant Rank: ", error.message);
    return NextResponse.json({ error: "Not found. Please check the username/tag or id", player: player, tag: tag }, { status: 200 })
  }
}

async function checkParams(player, tag, id, channel, region) {
  if ((!player || !tag) && !id) return { status: false, error: "Missing player / tag or id" };
  if (!channel || channel == "channel") return { status: false, error: "Missing channel name" };

  const validRegionCodes = validRegions.map((item) => item.code);
  if (!validRegionCodes.includes(region)) return { status: false, error: `Invalid or missing region. Valid regions: ${validRegionCodes.join(", ")}` };
  return { status: true, error: null };
}


async function sendResponse(data, type, msg) {

  const { name: player, ranking_in_tier: pontos, currenttier, numberOfWins: vitorias, leaderboardRank: posicao } = data.data;
  const formattedMessage = msg
    .replace(/\(player\)/g, player)
    .replace(/\(pontos\)/g, pontos)
    .replace(/\(rank\)/g, tiers[currenttier].tier_name_pt)
    .replace(/\(vitorias\)/g, vitorias)
    .replace(/\(posicao\)/g, posicao);

  if (type != "text") {
    data.message = formattedMessage;
    console.log(formattedMessage);
    return NextResponse.json(data, { status: 200 });
  }
  console.log(formattedMessage);
  return new Response(formattedMessage, { status: 200 });
}
*/