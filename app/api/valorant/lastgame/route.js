import { NextResponse } from 'next/server';
// import { getSummonerPuuid } from '@/app/components/LolRank'

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  // const obj = Object.fromEntries(request.nextUrl.searchParams);
  // obj.game = "lol";
  // const puuid = await getSummonerPuuid(obj)
  // console.log(puuid)

  const id = "7cd4994f-3255-5575-b8a2-968f428bf9a1";

  const lastMatchRequest = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/na/${id}?filter=competitive&size=1`, {
    headers: {
      "Authorization": "HDEV-c079302a-3ba8-432a-9ce6-9d1adacf52f2"
    }
  });

  const lastMatch = await lastMatchRequest.json();
  const data = lastMatch.data[0]

  const allPlayers = data.players.all_players;
  const map = data.metadata.map
  const gameStart = data.metadata.game_start
  const gameDuration = data.metadata.game_length
  const gameFinish = gameStart + gameDuration
  const winner = (data.teams.blue.has_won == true) ? "Blue" : "Red"
  const player = allPlayers.find((player) => player.puuid == id)

  /*   console.log(`Map is ${map}`)
    console.log(`Winner is ${winner}`)
    console.log(`Result is ${(winner == player.team) ? "Win!" : "Lose :("}`)
    console.log(`Player name is ${player.name}`)
    console.log(`Character is ${player.character}`)
    console.log(`KDA is ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}`); */


  // console.log(data)
  return NextResponse.json(player);
}


