import { NextResponse } from "next/server";

// Base Riot API URL 
const apiURL = "api.riotgames.com";

// Creating null values for players not yet ranked
const nullValues = {
  "tier": null,
  "rank": null,
  "leaguePoints": null,
  "wins": null,
  "losses": null
}

export async function GET(request) {

  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;
  let server;

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
      return ('Parameter "region" missing or invalid. Please check valid regions in https://c4ldas.com.br/lol')
  }

  const response = await getSummonerId({ region, player, tag, server })

  return NextResponse.json(response, { status: 200 });
}

// Get Summoner Id based on Username#Tag
async function getSummonerId(request) {

  const { region, player, tag, server } = request;

  const puuid = await (await fetch(`https://${server}.${apiURL}/riot/account/v1/accounts/by-riot-id/${player}/${tag}`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      "X-Riot-Token": process.env.LOL_TOKEN
    }
  })).json();

  if (puuid.status) return (puuid.status.message)

  const summoner = await (await fetch(`https://${region}.${apiURL}/lol/summoner/v4/summoners/by-puuid/${puuid.puuid}`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      "X-Riot-Token": process.env.LOL_TOKEN
    }
  })).json();

  return getRank_SOLO_5x5(summoner.id, region);
}

// Get Solo 5x5 Rank info
async function getRank_SOLO_5x5(summonerId, region) {

  const getRank = await (await fetch(`https://${region}.${apiURL}/lol/league/v4/entries/by-summoner/${summonerId}`, {
    method: "GET",
    next: {
      revalidate: 600 // revalidate each 10 minutes
    },
    headers: {
      "X-Riot-Token": process.env.LOL_TOKEN
    }
  })).json();
  const soloRank = getRank.find((response) => response.queueType === "RANKED_SOLO_5x5");

  if (!soloRank) { return nullValues };
  const { tier, rank, leaguePoints, wins, losses } = soloRank;
  return { tier, rank, leaguePoints, wins, losses };
}   