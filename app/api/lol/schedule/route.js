const { NextResponse } = require("next/server");
import { Temporal } from "@js-temporal/polyfill";

const baseURL = "https://esports-api.lolesports.com/persisted/gw";
const LOL_ESPORTS_TOKEN = process.env.LOL_ESPORTS_TOKEN;
const localTimeZone = "America/Sao_Paulo";

const leagues = {
  "lck": "98767991310872058",
  "lpl": "98767991314006698",
  "lec": "98767991302996019",
  "lcp": "113476371197627891",
  "msi": "98767991325878492",
  "worlds": "98767975604431411",
  "lta_north": "113470291645289904",
  "lta_norte": "113470291645289904",
  "lta_south": "113475181634818701",
  "lta_sul": "113475181634818701",
  "lta_cross": "113475149040947852",
  "first_stand": "113464388705111224",
  "circuito_desafiante": "105549980953490846",
}

export async function GET(data) {
  try {

    const obj = Object.fromEntries(data.nextUrl.searchParams);
    const { league, channel, type = "text", msg = "No games for (league) today", language = "en-US" } = obj;

    if (!league || !leagues[league]) return NextResponse.json({ status: "failed", error: `Missing or invalid league. Available leagues: ${Object.keys(leagues).join(", ")}` }, { status: 200 });
    if (!channel) return NextResponse.json({ status: "failed", error: "Missing channel" }, { status: 200 });

    const title = await getLeagueName(league, language);

    const matches = await listTodayMatches(leagues[league], language);

    // return NextResponse.json(matches, { status: 200 });
    return sendResponse({ matches, type, channel, title, msg });


  } catch (error) {
    console.log("Error!", error.message);
    return sendResponse({ status: "failed", error: "Failed to list League of Legends matches. Please try again." });
  }
}


async function listTodayMatches(leagueId, language) {
  try {

    const request = await fetch(`${baseURL}/getSchedule?hl=${language}&leagueId=${leagueId}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "x-api-key": LOL_ESPORTS_TOKEN
      }
    });

    const response = await request.json();
    const todayGames = response.data.schedule.events.filter(game => new Date(game.startTime).toDateString() == new Date().toDateString());

    const matches = [];

    for (let i = 0; i < todayGames.length; i++) {
      const match = todayGames[i];

      const startTime = Temporal.Instant.from(match.startTime).toZonedDateTimeISO("UTC");
      const startTimeBR = Temporal.Instant.from(match.startTime).toZonedDateTimeISO(localTimeZone);

      const game = {
        startTime: match.startTime,
        startTimeBR: startTimeBR.toString({ timeZoneName: 'never' }),
        startHour: startTime.hour,
        startHourBR: startTimeBR.hour,
        team1: match.match.teams[0].name,
        team2: match.match.teams[1].name,
        team1Score: match.match.teams[0].result.gameWins,
        team2Score: match.match.teams[1].result.gameWins,
        date: match.startTime.split("T")[0],
        time: match.startTime.split("T")[1].split("+")[0],
        message: `${startTimeBR.hour}h - ${match.match.teams[0].name} ${match.match.teams[0].result.gameWins}x${match.match.teams[1].result.gameWins} ${match.match.teams[1].name}`
      }

      matches.push(game);
    }

    return matches;

  } catch (error) {
    console.log("Error!", error.message);
    return sendResponse({ status: "failed", error: "Failed to list League of Legends matches. Please try again." });
  }
}


async function sendResponse(data) {

  if (data.error) return NextResponse.json({ status: "failed", message: "Failed to list League of Legends matches. Please try again." }, { status: 200 });

  const { matches, type, channel, msg, title } = data;

  const games = matches.map((match) => match.message);
  const message = msg.replaceAll(/\(league\)/g, title);

  if (type != "text") {
    console.log(games.join(" // "));
    console.log(title);
    return NextResponse.json({ matches, title }, { status: 200 });
  }

  if (type == "text" && matches.length == 0) {
    console.log(message);
    return new Response(message, { status: 200 });
  }

  console.log(title);
  console.log(games.join(" // "));
  return new Response(games.join(" // "), { status: 200 });
}


async function getLeagueName(league, language) {
  const request = await fetch(`${baseURL}/getLeagues?hl=${language}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-api-key": LOL_ESPORTS_TOKEN
    }
  });

  const response = await request.json();
  return response.data.leagues.find(l => l.id == leagues[league]).name;
}
