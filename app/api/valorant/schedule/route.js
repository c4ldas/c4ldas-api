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
import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

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
  vct_emea: 'VCT EMEA',
  vct_china: 'VCT China',
  game_changers_emea: 'Game Changers EMEA',
  challengers_na: "Challengers NA",
  game_changers_na: "Game Changers NA",
  vct_pacific: "VCT Pacific",
  challengers_jpn: "Challengers Japan",
  challengers_kr: "Challengers Korea",
  challengers_latam: "Challengers LATAM",
  challengers_latam_n: "Challengers LATAM North",
  challengers_latam_s: "Challengers LATAM South",
  challengers_apac: "Challengers APAC",
  challengers_sea_id: "Challengers SEA Indonesia",
  challengers_sea_ph: "Challengers SEA Philippines",
  challengers_sea_sg_and_my: "Challengers SEA Singapore & Malaysia",
  challengers_sea_th: "Challengers SEA Thailand",
  challengers_sea_hk_and_tw: "Challengers SEA Hong Kong & Taiwan",
  challengers_sea_vn: "Challengers SEA Vietnam",
  valorant_oceania_tour: "Valorant Oceania Tour",
  challengers_south_asia: "Challengers South Asia",
  game_changers_sea: "Game Changers SEA",
  game_changers_east_asia: "Game Changers East Asia",
  game_changers_jpn: "Game Changers Japan",
  game_changers_kr: "Game Changers Korea",
  game_changers_latam: "Game Changers LATAM",
  masters: "Masters",
  last_chance_qualifier_apac: "Last Chance Qualifier APAC",
  last_chance_qualifier_east_asia: "Last Chance Qualifier East Asia",
  last_chance_qualifier_emea: "Last Chance Qualifier EMEA",
  last_chance_qualifier_na: "Last Chance Qualifier NA",
  vrl_spain: "VRL Spain",
  vrl_northern_europe: "VRL Northern Europe",
  vrl_dach: "VRL DACH",
  vrl_france: "VRL France",
  vrl_east: "VRL East",
  vrl_turkey: "VRL Turkey",
  vrl_cis: "VRL CIS",
  mena_resilence: "MENA Resilience",
  challengers_italy: "Challengers Italy",
  challengers_portugal: "Challengers Portugal"
}

const timeZone = Temporal.TimeZone.from('America/Sao_Paulo'); // Using Brazil time zone

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, league, type = "text", msg = "No games for (league) today" } = obj;
  const todayDate = Temporal.Now.plainDateISO(timeZone).toString(); // Date for Brazil time zone
  // const matches = [];

  try {
    const validParams = await checkParams(league, channel);
    if (!validParams.status) return sendResponse({ error: validParams.error }, 400, type, channel);

    const request = await fetch(url(league), {
      method: "GET",
      headers: {
        "Authorization": apiToken
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

    // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST 
    // const gameDateTime = timeZone.getPlainDateTimeFor(response["data"][0].date).toString();
    // const gameDate = timeZone.getPlainDateTimeFor(response["data"][0].date).toString().split('T')[0];
    // const gameTime = Temporal.PlainTime.from(gameDateTime).hour;
    // const result = [{ teams: response["data"][0].match.teams, date_original: response["data"][0].date, date_brazil: gameDate, time_brazil: gameTime }]
    // return sendResponse(result, 200, type, channel)
    // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST 

    return sendResponse(todayGames, 200, type, channel, league, msg)

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: { message: "An error has occurred. Please try again later.: ", code: error.code } }, { status: 500 });
  }
}

async function checkParams(league, channel) {
  if (!channel) return { status: false, error: "Missing channel" };
  if (!(league in validLeagues)) return { status: false, error: `Invalid league name. Valid leagues: ${Object.keys(validLeagues).join(", ")}` };
  return { status: true, error: null };
}

async function sendResponse(response, status, type, channel, league, msg) {
  const matches = [];

  if (type == "text" && response.length > 0) {
    response.forEach((match) => {
      const nameTeam1 = match.teams[0].name;
      const nameTeam2 = match.teams[1].name;
      const winsTeam1 = match.teams[0].game_wins;
      const winsTeam2 = match.teams[1].game_wins;
      matches.push(`${match.time_brazil}h - ${nameTeam1} ${winsTeam1}x${winsTeam2} ${nameTeam2}`)
    })
    // Format the response like below:
    /* Team1 0x2 Team2 // Team3 2x0 Team4 // Team5 1x1 Team6 */
    const finalResponse = matches.toString().replaceAll(',', ' // ');
    return new Response(finalResponse, { status: 200 });

  } else if (type == "text" && response.length == 0) {

    // Created a new custom message and send it when there are no games
    const message = msg.replaceAll(/\(league\)/g, validLeagues[league]);
    console.log(message);
    return new Response(message, { status: 200 });

  }

  // The below doesn't work because response is an array, not an object
  // response.message = matches.length > 0 ? matches.toString().replaceAll(',', ' // ') : "No games for today";
  return NextResponse.json(response, { status: status });
}
