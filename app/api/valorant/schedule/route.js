/*
This endpoint shows the games of the day based on the tournament searched.
Information can be found here: 
https://c4ldas.com.br/api/valorant/schedule

Endpoint: 
https://repl.c4ldas.com.br/api/valorant/schedule?channel=$(channel)&league=LEAGUE_NAME&type=text

Original endpoint:
https://api.henrikdev.xyz/valorant/v1/esports/schedule?league=vct_lock_in

Response example:
"Game Changers BR: 17h - Black Dragons 0 x 0 LOUD"
*/

import { NextResponse } from "next/server";
import { Temporal } from "@js-temporal/polyfill";
import { color } from "@/app/lib/colorLog";

const url = (league) => `https://api.henrikdev.xyz/valorant/v1/esports/schedule?league=${league}`;

const validLeagues = {
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

const timeZone = Temporal.TimeZone.from('America/Sao_Paulo'); // Using Brazil time zone

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, league, type = "text" } = obj;
  const todayDate = Temporal.Now.plainDateISO(timeZone).toString(); // Date for Brazil time zone
  const matches = [];

  try {
    const validParams = await checkParams(league, channel);
    // color.log("green", `Valid Params: ${JSON.stringify(validParams)}`);
    if (!validParams.status) return sendResponse({ error: validParams.error }, 400, type, channel);

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
      if (gameDate == todayDate) {
        return { teams: game.match.teams, date_original: game.date, date_brazil: gameDate, time_brazil: gameTime }
      }
    }).filter(Boolean) // Remove undefined values

    return sendResponse(todayGames, 200, type, channel)
  } catch (error) {
    color.log("red", error)
    return NextResponse.json({ error: { message: "An error has occurred. Please try again later.", code: error.code } }, { status: 500 });
  }
}

async function checkParams(league, channel) {
  // if ((!player || !tag) && !id) return { status: false, error: "Missing player / tag or id" };
  if (!channel) return { status: false, error: "Missing channel" };
  if (!(league in validLeagues)) return { status: false, error: `Invalid league name. Valid leagues: ${Object.keys(validLeagues).join(", ")}` };
  return { status: true, error: null };
}

async function sendResponse(response, status, type, channel) {
  const matches = [];
  if (type == "text" && response.length > 0) {
    response.forEach((match) => {
      const nameTeam1 = match.teams[0].name;
      const nameTeam2 = match.teams[1].name;
      const winsTeam1 = match.teams[0].game_wins;
      const winsTeam2 = match.teams[1].game_wins;
      matches.push(`${match.time_brazil}h - ${nameTeam1} ${winsTeam1}x${winsTeam2} ${nameTeam2}`)
    })
    return new Response(matches.toString().replaceAll(',', ' // '), { status: status });
  } else if (type == "text" && response.length == 0) {
    return new Response("No games for  today", { status: status });
  }

  return NextResponse.json(response, { status: status });
}
