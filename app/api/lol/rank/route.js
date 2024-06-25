import { NextResponse } from "next/server";
import { getSummonerPuuid, getSummonerId, getRank } from "@/app/lib/lol_rank.js";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;
  const type = obj.type || "text";
  const game = "lol";
  const queueType = "RANKED_SOLO_5x5";

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

    const summonerIdRequest = await getSummonerId({ puuid, region, game, player, tag });
    const { id, accountId, summonerLevel } = summonerIdRequest;

    const rankRequest = await getRank({ id, gameName, region, game });

    const soloRank = rankRequest.find((response) => response.queueType === queueType);
    const { tier, rank, leaguePoints, wins, losses } = soloRank || nullValues;

    const response = { gameName, tagLine, tier, rank, leaguePoints, wins, losses };

    if (type == "text") {
      return NextResponse.json(`${response.gameName}: ${response.tier} ${response.rank} - ${response.leaguePoints} points`, { status: 200 })
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    if (type == "text") {
      console.log(error)
      const { message, player, tag, } = error.error;
      return NextResponse.json(`Error: ${message}. Player: ${player}, tag: ${tag}`);
    }
    console.log(error);
    return NextResponse.json(error, { status: error.code });
  }
}
