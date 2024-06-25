import { tiers, urlById, urlByPlayer, getRank, validRegions } from '@/app/lib/valorant_rank';
import { NextResponse } from "next/server";
import { color } from "@/app/lib/colorLog";

import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;


const urlLeaderboardId = (region, id) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?puuid=${id}`;
const urlLeaderboardPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?name=${player}&tag=${tag}`;

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);

    // Get the parameters from URL
    const { player, tag, id, channel, region = "br", msg = "(player) está (rank) com (pontos) pontos.", type = "text" } = obj;
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
        const response = await sendResponse(data, type, msg);
        return NextResponse.json(response, { status: 200 });
      }

      // Get leaderboard
      const leaderboard = await getRank(urlLeaderboardId(region, id), apiToken);
      if (leaderboard.status !== 200) {
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        const response = await sendResponse(data, type, msg);
        return NextResponse.json(response, { status: 200 });
      };
      data.data.leaderboardRank = leaderboard.data[0].leaderboardRank;
      data.data.numberOfWins = leaderboard.data[0].numberOfWins;

      // Send response
      const response = await sendResponse(data, type, msg);
      return NextResponse.json(response, { status: 200 })
    }

    // Check if player and tag are provided
    if (player && tag) {
      const data = await getRank(urlByPlayer(region, player, tag, type), apiToken);

      // If not Immmortal and not Radiant, return with leaderboardRank and numberOfWins set to 0
      if (data.data.currenttier <= 23) { // Below Immortal and Radiant
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        const response = await sendResponse(data, type, msg);
        return NextResponse.json(response, { status: 200 });
      }

      // Get leaderboard
      const leaderboard = await getRank(urlLeaderboardPlayer(region, player, tag), apiToken);
      if (leaderboard.status !== 200) {
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        const response = await sendResponse(data, type, msg);
        return NextResponse.json(response, { status: 200 });
      };

      data.data.leaderboardRank = leaderboard.data[0].leaderboardRank;
      data.data.numberOfWins = leaderboard.data[0].numberOfWins;

      // Send response
      const response = await sendResponse(data, type, msg);
      //console.log(response);
      return NextResponse.json(response, { status: 200 })
    }

    // If id or player/tag are not provided, return error
    return NextResponse.json({ error: "Id or player / tag are required" }, { status: 400 })
  } catch (error) {
    console.log("This is the error: ", error);
    return NextResponse.json({ error: error.error }, { status: 400 })
  }
}

async function checkParams(player, tag, id, channel, region) {
  if ((!player || !tag) && !id) return { status: false, error: "Missing player / tag or id" };
  if (!channel) return { status: false, error: "Missing channel" };
  if (!validRegions.includes(region)) return { status: false, error: `Invalid region. Valid regions: ${validRegions.join(", ")}` };
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

  color.log("green", formattedMessage);

  if (type != "text") return data;
  return formattedMessage;
}
