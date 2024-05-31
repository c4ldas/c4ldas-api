import { NextResponse } from 'next/server';

const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${player}/${tag}?filter=competitive&size=1`;
const validRegions = ["ap", "br", "eu", "kr", "latam", "na"];

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { region, player, tag } = obj;

    const validParams = checkParams(region, player, tag);

    const lastMatchRequest = await fetch(urlByPlayer(region, player, tag), {
      headers: {
        "Authorization": process.env.VALORANT_TOKEN
      }
    });

    if (!lastMatchRequest.ok) throw ({ error: { message: lastMatchRequest.statusText, player: player, tag: tag, code: lastMatchRequest.status } });

    const lastMatch = await lastMatchRequest.json();
    const data = lastMatch.data[0]
    const allPlayers = data.players.all_players;

    const playerInfo = allPlayers.find((info) => info.name.toLowerCase() == player.toLowerCase());
    const playerTeam = playerInfo.team.toLowerCase();
    const winner = (data.teams.blue.has_won == true) ? "Blue" : "Red";

    playerInfo.has_won = (winner == playerInfo.team);
    playerInfo.rounds_won = data.teams[playerTeam].rounds_won;
    playerInfo.rounds_lost = data.teams[playerTeam].rounds_lost;
    playerInfo.game_duration_minutes = parseInt(data.metadata.game_length / 60);
    playerInfo.map = data.metadata.map;
    playerInfo.rounds_played = data.metadata.rounds_played;
    playerInfo.game_start = data.metadata.game_start;
    playerInfo.game_start_patched = data.metadata.game_start_patched;

    if (obj.data == "full") {
      return NextResponse.json(data, { status: 200 });
    }

    if (obj.type == "text") {
      const results = `Map: ${playerInfo.map} / ${playerInfo.has_won ? 'Victory' : 'Defeat'} / Score: ${playerInfo.rounds_won}x${playerInfo.rounds_lost} / KDA: ${playerInfo.stats.kills}/${playerInfo.stats.deaths}/${playerInfo.stats.assists} / Game Time: ${playerInfo.game_duration_minutes}min`;

      return NextResponse.json(results, { status: 200 });
    }
    return NextResponse.json(playerInfo, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.error }, { status: 400 });

  }
}

function checkParams(region, player, tag) {
  if (!player || !tag) throw ({ error: { message: "Missing player / tag", player: player, tag: tag, region: region, status: 400, } });
  /* if (!player || !tag) throw ({ error: { message: "Missing id", id: "Find your steam ID in https://imgur.com/a/EBYhudl", region: region, status: 400, } }); */
  if (!validRegions.includes(region)) throw ({ error: { message: "Invalid or missing region", player: player, tag: tag, region: region, regions_available: validRegions, status: 400, } });

  return { status: true, error: null };
}


