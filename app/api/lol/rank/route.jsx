import { NextResponse } from "next/server";

// Base Riot API URL 
const apiURL = "api.riotgames.com";

// Creating null values for players not yet ranked
const nullValues = {
  "tier": "No_Rank",
  "rank": "0",
  "leaguePoints": 0,
  "wins": 0,
  "losses": 0
}

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;
  const type = obj.type || "text";
  let server;

  try {
    switch (region) {
      case 'br1': case 'la1': case 'la2': case 'na1':
        server = 'americas';
        break;
      case 'jp1': case 'kr': case 'oc1':
        server = 'asia';
        break;
      case 'eun1': case 'euw1': case 'ru1': case 'tr1':
        server = 'europe';
        break;
      default:
        return NextResponse.json({ error: { message: "Parameter 'region' missing or invalid. Please check valid regions in https://c4ldas.com.br/lol", code: 400 } }, { status: 400 });
    }

    const puuidRequest = await getSummonerPuuid({ player, tag, server });
    const { puuid, gameName, tagLine } = puuidRequest;

    const summonerIdRequest = await getSummonerId({ puuid, region });
    const { id, accountId, summonerLevel } = summonerIdRequest;

    const rankRequest = await getRank_SOLO_5x5({ id, gameName, region });
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

// Get puuid based on Username#Tag
async function getSummonerPuuid(request) {
  try {
    const { player, tag, server } = request;

    const puuidRequest = await fetch(`https://${server}.${apiURL}/riot/account/v1/accounts/by-riot-id/${player}/${tag}`, {
      method: "GET",
      cache: "force-cache",
      // next: { revalidate: 0 },
      headers: {
        "X-Riot-Token": process.env.LOL_TOKEN
      }
    });

    if (!puuidRequest.ok) {
      throw ({ error: { message: puuidRequest.statusText, player: player, tag: tag, code: puuidRequest.status } });
    }

    const puuidResponse = await puuidRequest.json();
    return (puuidResponse);

  } catch (error) {
    throw error;
  }
}

// Get Summoner Id based on puuid
async function getSummonerId(request) {
  try {
    const { puuid, region } = request;
    const summonerRequest = await fetch(`https://${region}.${apiURL}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
      method: "GET",
      cache: "force-cache",
      headers: {
        "X-Riot-Token": process.env.LOL_TOKEN
      }
    });

    if (!summonerRequest.ok) {
      throw ({ error: { message: summonerRequest.statusText, player: player, tag: tag, code: summonerRequest.status } });
    }

    const summonerResponse = await summonerRequest.json();

    return (summonerResponse);

  } catch (error) {
    throw (error);
  }
}

// Get Solo 5x5 Rank info
async function getRank_SOLO_5x5(request) {
  try {
    const { id, gameName, region } = request;

    const getRankRequest = await fetch(`https://${region}.${apiURL}/lol/league/v4/entries/by-summoner/${id}`, {
      method: "GET",
      next: {
        revalidate: 900 // revalidate each 15 minutes
      },
      headers: {
        "X-Riot-Token": process.env.LOL_TOKEN
      }
    });

    if (!getRankRequest.ok) {
      throw ({ error: { message: getRankRequest.statusText, player: gameName, tag: tag, code: getRankRequest.status } });
    }

    const getRankResponse = await getRankRequest.json();

    const soloRank = getRankResponse.find((response) => response.queueType === "RANKED_SOLO_5x5");

    // In case there isn't a Solo 5x5, return null values
    if (!soloRank) {
      return nullValues;
    };

    return (soloRank);
  }
  catch (error) {
    return (nullValues);
  }
}
