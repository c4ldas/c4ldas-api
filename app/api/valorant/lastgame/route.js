import { NextResponse } from 'next/server';

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;

  const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${player}/${tag}?filter=competitive&size=1`;

  const lastMatchRequest = await fetch(urlByPlayer(region, player, tag), {
    headers: {
      "Authorization": process.env.VALORANT_TOKEN
    }
  });

  const lastMatch = await lastMatchRequest.json();
  const data = lastMatch.data[0]
  const allPlayers = data.players.all_players;

  const playerInfo = allPlayers.find((info) => info.name.toLowerCase() == player.toLowerCase());
  const playerTeam = playerInfo.team.toLowerCase();
  const winner = (data.teams.blue.has_won == true) ? "Blue" : "Red";

  playerInfo.hasWon = (winner == playerInfo.team);
  playerInfo.roundsWon = data.teams[playerTeam].rounds_won;
  playerInfo.roundsLost = data.teams[playerTeam].rounds_lost;
  playerInfo.gameDuration = parseInt(data.metadata.game_length) / 60;;
  playerInfo.map = data.metadata.map;
  playerInfo.rounds_played = data.metadata.rounds_played;

  if (obj.data == "full") {
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json(playerInfo, { status: 200 });
}


