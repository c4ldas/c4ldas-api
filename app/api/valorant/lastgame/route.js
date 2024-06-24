// https://api.henrikdev.xyz/valorant/v1/lifetime/matches/br/loud%20coreano/lll?api_key=HDEV-c079302a-3ba8-432a-9ce6-9d1adacf52f2&size=1&mode=competitive
// https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/br/10726a29-ce65-5471-a794-32733f309a16?mode=competitive&size=1


import { NextResponse } from 'next/server';
import { getRank, urlById as rankById, urlByPlayer as rankByPlayer } from '../rank/route';

import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${player}/${tag}?filter=competitive&size=1`;
const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${region}/${id}`
const validRegions = ["ap", "br", "eu", "kr", "latam", "na"];

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { region, player, tag, id } = obj;

    const validParams = checkParams(region, player, tag, id);

    const url = id ? urlById(region, id) : urlByPlayer(region, player, tag);
    const rank = id ? await getRank(rankById(region, id)) : await getRank(rankByPlayer(region, player, tag));

    const lastMatchRequest = await fetch(url, {
      // cache: "force-cache",
      next: { revalidate: 0 },
      headers: {
        "Authorization": apiToken
      }
    });

    if (!lastMatchRequest.ok) throw ({ error: { message: lastMatchRequest.statusText, id: id, player: player, tag: tag, code: lastMatchRequest.status } });

    const lastMatch = await lastMatchRequest.json();
    const data = lastMatch.data[0]
    const allPlayers = data.players.all_players;

    const playerInfo = allPlayers.find((info) => info.name.toLowerCase() == player?.toLowerCase() || info.puuid == id);
    const playerTeam = playerInfo.team.toLowerCase();
    if (playerTeam != "blue" && playerTeam != "red") throw ({ error: { message: "It was not possible to determine player team. Try again later", player: player, tag: tag, id: id, team: playerTeam, region: region, status: 500 } });
    const winner = (data.teams.blue.has_won == true) ? "Blue" : (data.teams.red.has_won == true) ? "Red" : "None";

    playerInfo.has_won = (winner == playerInfo.team);
    playerInfo.outcome = playerInfo.has_won ? "Victory" : (winner == "None") ? "Draw" : "Defeat";
    playerInfo.rounds_won = data.teams[playerTeam].rounds_won;
    playerInfo.rounds_lost = data.teams[playerTeam].rounds_lost;
    playerInfo.game_duration_minutes = parseInt(data.metadata.game_length / 60);
    playerInfo.map = data.metadata.map;
    playerInfo.rounds_played = data.metadata.rounds_played;
    playerInfo.game_start = data.metadata.game_start;
    playerInfo.game_start_patched = data.metadata.game_start_patched;
    playerInfo.ranking_in_tier = rank.data.ranking_in_tier;

    if (obj.data == "full") {
      return NextResponse.json(data, { status: 200 });
    }

    if (obj.type == "text") {
      const results = `Map: ${playerInfo.map} / Outcome: ${playerInfo.outcome} / Score: ${playerInfo.rounds_won}x${playerInfo.rounds_lost} / KDA: ${playerInfo.stats.kills}/${playerInfo.stats.deaths}/${playerInfo.stats.assists} / Game Time: ${playerInfo.game_duration_minutes}min`;

      return new Response(results, { status: 200 });
    }
    return NextResponse.json(playerInfo, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.error }, { status: 500 /* error.error.status */ });

  }
}

function checkParams(region, player, tag, id) {
  if ((!player || !tag) && !id) throw ({ error: { message: "Missing player / tag or id", player: player, tag: tag, id: id, region: region, status: 400, } });
  /* if (!player || !tag) throw ({ error: { message: "Missing id", id: "Find your steam ID in https://imgur.com/a/EBYhudl", region: region, status: 400, } }); */
  if (!validRegions.includes(region)) throw ({ error: { message: "Invalid or missing region", player: player, tag: tag, region: region, regions_available: validRegions, status: 400, } });

  return { status: true, error: null };
}


