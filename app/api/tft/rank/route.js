import { NextResponse } from "next/server";
import { getSummonerPuuid, getSummonerId, getRank } from "@/app/components/lol_tft_rank.js";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;
  const type = obj.type || "text";

  try {

    const puuidRequest = await getSummonerPuuid({ player, tag, region, game: "tft" });
    const { puuid, gameName, tagLine } = puuidRequest;

    const summonerIdRequest = await getSummonerId({ puuid, region, game: "tft" });
    const { id, accountId, summonerLevel } = summonerIdRequest;

    const rankRequest = await getRank({ id, gameName, region, game: "tft" });
    const { tier, rank, leaguePoints, wins, losses } = rankRequest;

    const response = { gameName, tagLine, tier, rank, leaguePoints, wins, losses };

    if (type == "text") {
      return NextResponse.json(`${response.gameName}: ${response.tier} ${response.rank} - ${response.leaguePoints} points`, { status: 200 })
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    if (type == "text") {
      const { message, player, tag, } = error.error;
      return NextResponse.json(`Error: ${message}. Player: ${player}, tag: ${tag}`);
    }
    return NextResponse.json(error, { status: error.code });
  }
}
