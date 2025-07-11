import { NextResponse } from "next/server";
import { getSummonerPuuid, getRank } from "@/app/lib/lol_rank.js";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag, type = "text", msg = "(player): (rank) - (points) points" } = obj;
  const game = "tft";
  const queueType = "RANKED_TFT";

  // Creating null values for non ranked players
  const nullValues = {
    "tier": "No_Rank",
    "rank": "0",
    "leaguePoints": 0,
    "wins": 0,
    "losses": 0
  }

  try {
    const puuidRequest = await getSummonerPuuid({ player, tag, region, game });
    const { puuid, gameName, tagLine } = puuidRequest;

    const rankRequest = await getRank({ puuid, gameName, tag, region, game });

    const soloRank = rankRequest.find((response) => response.queueType === queueType);
    const { tier, rank, leaguePoints, wins, losses } = soloRank || nullValues;

    const response = { gameName, tagLine, tier, rank, leaguePoints, wins, losses };

    return sendResponse(response, type, msg);

  } catch (error) {
    console.log(error);
    return sendResponse("", type, "", error);
  }
}

async function sendResponse(response, type, msg, error) {

  if (error) {
    console.log(msg);
    if (type == "text") {
      const { message, player, tag, } = error.error;
      return new Response(`Error: ${message}. Player: ${player}, tag: ${tag}`, { status: 200 });
    }
    return NextResponse.json(error, { status: 200 });
  }

  const message = msg
    .replace(/\(player\)/g, response.gameName)
    .replace(/\(rank\)/g, response.tier + " " + response.rank)
    .replace(/\(points\)/g, response.leaguePoints)
    .replace(/\(wins\)/g, response.wins)
    .replace(/\(losses\)/g, response.losses);

  console.log(message);

  if (type == "text") {
    return new Response(message, { status: 200 });
  }

  response.message = message;
  return NextResponse.json(response, { status: 200 });
}