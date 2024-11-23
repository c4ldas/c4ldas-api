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
