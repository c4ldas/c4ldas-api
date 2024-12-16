import { NextResponse } from "next/server";
import { getSummonerPuuid, getActiveGame } from "@/app/lib/lol_rank.js";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag, type = "text" } = obj;
  const game = "lol";

  try {
    const puuidRequest = await getSummonerPuuid({ player, tag, region, game });
    const { puuid, gameName, tagLine } = puuidRequest;
    const gameInfo = await getActiveGame({ puuid, region, game, player, tag });

    if (gameInfo.status) {
      const data = {
        "inGame": false,
        "info": {
          "player": player,
          "tag": tagLine,
          "gameId": 0,
          "replayId": 0,
          "gameStartTime": 0,
          "gameLength": 0
        }
      };
      return sendResponse(data, type);
    }

    const data = {
      "inGame": true,
      "info": {
        "player": player,
        "tag": tagLine,
        "gameId": gameInfo.gameId,
        "matchId": `${region.toUpperCase()}_${gameInfo.gameId}`,
        "gameStartTime": gameInfo.gameStartTime,
        "gameLength": gameInfo.gameLength
      }
    };

    return sendResponse(data, type);

  } catch (error) {
    console.log(error);
    return sendResponse("", type, "", error);
  }
}

async function sendResponse(response, type, error) {

  if (error) {
    if (type == "text") {
      const { message, player, tag, } = error.error;
      return new Response(`Error: ${message}. Player: ${player}, tag: ${tag}`, { status: 200 });
    }
    return NextResponse.json(error, { status: 200 });
  }

  const message = `${response.info.player}#${response.info.tag} is ${response.inGame ? "in game" : "not in game"}`;

  if (type == "text") {
    return new Response(message, { status: 200 });
  }

  return NextResponse.json(response, { status: 200 });
}