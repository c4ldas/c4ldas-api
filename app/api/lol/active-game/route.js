import { NextResponse } from "next/server";
import { getSummonerPuuid, getActiveGame, getPreviousGame } from "@/app/lib/lol_rank.js";

export async function GET(request) {
  const data = {
    "inGame": false,
    "player": "",
    "tag": "",
    "currentGame": {
      "gameId": 0,
      "replayId": null,
      "gameStartTime": 0,
      "championName": ""
    },
    "previousGame": {
      "gameId": 0,
      "replayId": null,
      "gameStartTime": 0,
      "gameLength": 0,
      "gameDuration": 0,
      "result": "",
      "championName": "",
      "kda": ""
    }
  }

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag, type = "text" } = obj;
  const game = "lol";

  try {
    const puuidRequest = await getSummonerPuuid({ player, tag, region, game });
    const { puuid, gameName, tagLine } = puuidRequest;
    const gameInfo = await getActiveGame({ puuid, region, game, player, tag });
    const previousGame = await getPreviousGame({ puuid, region, game, player, tag });

    data.player = gameName;
    data.tag = tagLine;
    data.inGame = gameInfo.inGame;
    data.currentGame.gameId = gameInfo.gameId || 0;
    data.currentGame.replayId = gameInfo.replayId || null;
    data.currentGame.gameStartTime = gameInfo.gameStartTime || 0;
    data.currentGame.championName = gameInfo.championName || null;

    data.previousGame.gameId = previousGame.gameId;
    data.previousGame.replayId = previousGame.replayId;
    data.previousGame.gameStartTime = previousGame.gameStartTime;
    data.previousGame.gameLength = previousGame.gameLength;
    data.previousGame.gameDuration = previousGame.gameDuration;
    data.previousGame.result = previousGame.result;
    data.previousGame.championName = previousGame.championName;
    data.previousGame.kda = previousGame.kda;

    return sendResponse(data, type);

  } catch (error) {
    return sendResponse("", type, error);
  }
}

async function sendResponse(response, type, error) {
  if (error) {
    console.log(`sendResponse error: ${JSON.stringify(error)}`);

    if (type == "text") {
      const { message, player, tag, } = error;
      return new Response(`Error: ${message}. Player: ${player}, tag: ${tag}`, { status: 200 });
    }

    return NextResponse.json(error, { status: error.code });
  }

  if (type == "text") {
    const message = `${response.player}#${response.tag} is ${response.inGame ? "in game" : "not in game"}. Previous game result: ${response.previousGame.result}`;
    return new Response(message, { status: 200 });
  }

  return NextResponse.json(response, { status: 200 });
}
