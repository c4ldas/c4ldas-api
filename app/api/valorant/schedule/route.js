/*
This endpoint shows the games of the day based on the tournament searched.
Information can be found here: 
https://c4ldas.com.br/api/valorant/schedule

Endpoint: 
https://repl.c4ldas.com.br/api/valorant/schedule?channel=$(channel)&league=LEAGUE_NAME&type=text

Response example:
"Game Changers BR: 17h - Black Dragons 0 x 0 LOUD"
*/

import { NextResponse } from "next/server";
import { Temporal } from "@js-temporal/polyfill";

const url = (league) => `https://api.henrikdev.xyz/valorant/v1/esports/schedule?league=${league}`;

const timeZone = Temporal.TimeZone.from('America/Sao_Paulo'); // Using Brazil time zone

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, league, type = "text" } = obj;

  const todayDate = Temporal.Now.plainDateISO(timeZone).toString(); // Date for Brazil time zone
  // console.log("Today date: ", todayDate);

  try {
    const request = await fetch(url(league), {
      method: "GET",
      headers: {
        "Authorization": process.env.VALORANT_TOKEN
      }
    });
    const response = await request.json();

    const todayGames = response.data.map((game) => {
      const gameDateTime = timeZone.getPlainDateTimeFor(game.date).toString();
      const gameDate = timeZone.getPlainDateTimeFor(game.date).toString().split('T')[0];
      const gameTime = Temporal.PlainTime.from(gameDateTime).hour;
      /*       console.log("Game dateTime: ", gameDateTime);
            console.log("Game date: ", gameDate);
            console.log("Game time: ", gameTime); */
      if (gameDate == todayDate) {
        /*         console.log("Game.date:", game.date);
                console.log("Time: ", gameTime + "h"); */
        return { teams: game.match.teams, date_original: game.date, date_brazil: gameDate, time_brazil: gameTime }
      }
    })

    const matches = [];

    todayGames.forEach((match) => {
      if (match == undefined) return
      const nameTeam1 = match.teams[0].name;
      const nameTeam2 = match.teams[1].name;
      const winsTeam1 = match.teams[0].game_wins;
      const winsTeam2 = match.teams[1].game_wins;
      matches.push(`${match.time_brazil}h - ${nameTeam1} ${winsTeam1} x ${winsTeam2} ${nameTeam2}`);
    })

    if (type == "text") {
      return new Response(matches.toString().replaceAll(',', ' // '), { status: 200 });
    }
    return NextResponse.json(todayGames, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: { message: "An error has occurred. Please try again later.", code: error.code } }, { status: 500 });
  }
}




/*
// ENDPOINT:
// https://repl.c4ldas.com.br/api/valorant/schedule?&league=challengers_br&channel=$(channel)
// https://api.henrikdev.xyz/valorant/v1/esports/schedule?league=vct_lock_in

const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()
const { Temporal } = require('@js-temporal/polyfill'); // Easier way to work with Date

// Defining colors for console:
const clc = require("cli-color")
const red = clc.red
const green = clc.green
const yellow = clc.yellow;

router.get('/', async (req, res) => {

  try {
    const timeZone = Temporal.TimeZone.from('America/Sao_Paulo'); // Using Brazil time zone
    const todayDate = Temporal.Now.plainDateTimeISO(timeZone).toString(); // Time and date for Brazil time zone
    const channel = req.query.channel || null
    const league = req.query.league

    const leagues = {
      challengers_br: 'Challengers BR',
      vct_lock_in: 'VCT LOCK//IN',
      game_changers_series_brazil: 'Game Changers BR',
      last_chance_qualifier_br_and_latam: 'Last Chance Qualifier',
      last_chance_qualifier_americas: 'Last Chance Qualifier',
      vct_americas: 'VCT Americas',
      vct_masters: 'Masters',
      champions: 'Champions',
      ascension_americas: 'Ascension Americas',
      game_changers_championship: 'Game Changers Championship',
      vct_emea: 'VCT EMEA'
    }

    // In case query string "channel" does not exist, return an error message
    if (!channel) {
      const response = 'Parâmetro "channel" ausente. Adicione o seguinte ao fim do endereço: &channel=$(channel)'
      console.log(red(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${response}`))
      res.status(200).send(response)
      return
    }

    // In case the league is different from "leagues" object, return an error message
    if (!league || Object.keys(leagues).indexOf(league) == -1) {
      const response = `Parâmetro "league" ausente ou incorreto. Valores aceitos: ${Object.keys(leagues)}`
      console.log(yellow(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${response}`))
      res.status(200).send(response)
      return
    }

    const getLeagueFetch = await fetch(`https://api.henrikdev.xyz/valorant/v1/esports/schedule?league=${league}`, {
      headers: {
        "Accept": "application/json",
        "Authorization": process.env.VALORANT_API_TOKEN
      }
    })
    const getLeague = await getLeagueFetch.json()

    // In case the API respond with status 500, there is not much to do unless informing there is an issue
    if (getLeague.status == 500) {
      const response = `Infelizmente, a API está offline no momento para mostrar o resultado ao vivo`
      res.status(200).send(response)
      return
    }

    if (!getLeague.data[0]) {
      const response = `Sem jogos do ${leagues[league]} hoje!`
      console.log(yellow(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${response}`))
      res.status(200).send(response)
      return
    }

    // Defining todayGames as an empty array and adding the games of the day to that array
    let todayGames = []

    for (let x = 0; x < getLeague.data.length; x++) {
      dateGameConverted = timeZone.getPlainDateTimeFor(getLeague.data[x].date)

      if (dateGameConverted.toString().split('T')[0] == todayDate.split('T')[0]) {
        todayGames.push(getLeague.data[x])
      }
    }

    // In case todayGames.length is empty, it means there is no game today
    if (!todayGames.length) {
      const response = `Sem jogos do ${getLeague.data[0].league.name} hoje!`
      console.log(yellow(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${response}`))
      res.status(200).send(response)
      return
    }

    // Formatting the matches "Team1 0 x 0 Team2"
    let matches = []

    todayGames.forEach((game) => {
      const hour = new Date(timeZone.getPlainDateTimeFor(game.date).toString()).getHours()
      if (game.match.id != null) {
        const nameTeam1 = game.match.teams[0].name;
        const nameTeam2 = game.match.teams[1].name;
        const winsTeam1 = game.match.teams[0].game_wins;
        const winsTeam2 = game.match.teams[1].game_wins;

        matches.push(`${hour}h - ${nameTeam1} ${winsTeam1} x ${winsTeam2} ${nameTeam2}`)
      }
    })

    const response = `${getLeague.data[0].league.name}: ${matches.toString().replaceAll(',', ' // ')}`
    console.log(green(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${channel} - ${response}`))

    res.status(200).send(response)

  } catch (error) {
    const response = `Infelizmente, a API está offline no momento para mostrar o resultado ao vivo`
    console.log(red(response + ' / ' + error))
    res.status(200).send(response)
  }
})

module.exports = router;

*/


/*
{
  endpoint: `/api/valorant/schedule`,
  description: "Display the games of the day based on the tournament searched.",
  usage: `${origin}${pathname}?channel=$(channel)&league=LEAGUE_NAME&type=text`,
  params: {
    channel: {
      description: "Your Twitch channel",
      required: true
    },
    league: {
      description: "Name of the league",
      required: true,
      available_variables: [
        "challengers_br",
        "vct_lock_in",
        "game_changers_series_brazil",
        "last_chance_qualifier_br_and_latam",
        "vct_americas",
        "vct_masters",
        "champions",
        "ascension_americas",
        "last_chance_qualifier_americas",
        "game_changers_championship",
        "vct_emea"
      ]
    },
    type: {
      description: "Format of the response",
      required: false,
      default: "text",
      available_variables: ["json", "text"],
    }
  }
}

*/