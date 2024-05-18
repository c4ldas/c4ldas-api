import { NextResponse } from 'next/server';
// import { getSummonerPuuid } from '@/app/components/LolRank'

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  // obj.game = "lol";
  // const puuid = await getSummonerPuuid(obj)
  // console.log(puuid)

  const id = obj.id

  const lastMatchRequest = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/na/${id}?filter=competitive&size=1`, {
    headers: {
      "Authorization": process.env.VALORANT_TOKEN
    }
  });

  const lastMatch = await lastMatchRequest.json();
  const data = lastMatch.data[0]

  const allPlayers = data.players.all_players;
  const map = data.metadata.map;
  const gameStart = data.metadata.game_start;
  const gameDuration = data.metadata.game_length;
  const gameFinish = gameStart + gameDuration;
  const winner = (data.teams.blue.has_won == true) ? "Blue" : "Red";
  const player = allPlayers.find((player) => player.puuid == id);
  player.hasWon = (winner == player.team);
  player.gameDuration = gameDuration;
  player.map = map;
  player.rounds_played = data.metadata.rounds_played;

  console.log(player.map)
  /*   console.log(`Map is ${map}`)
    console.log(`Winner is ${winner}`)
    console.log(`Result is ${(winner == player.team) ? "Win!" : "Lose :("}`)
    console.log(`Player name is ${player.name}`)
    console.log(`Character is ${player.character}`)
    console.log(`KDA is ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}`); */

  // console.log(data)
  if (obj.data == "full") {
    return NextResponse.json(data);
  }
  return NextResponse.json(player);
}


