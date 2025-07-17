/**
 * This endpoint shows the League of Legends games of the current day from EWC. Games and scores are updated automatically.
 * Text response format: 6h - Team1 0x0 Team2 // 7h - Team3 0x0 Team4
 * Time in text format is in Brazilian time.
 * Time in JSON format is available in both UTC and Brazilian time.
 * Information can be found here: 
 * https://c4ldas.com.br/lol/schedule/ewc
 * 
 * Endpoint: 
 * https://repl.c4ldas.com.br/api/lol/schedule/ewc?channel=$(channel)&type=text
*/

import { Temporal } from "@js-temporal/polyfill";
import { NextResponse } from "next/server";

const baseURL = "https://dzuvpjnlus2rx.cloudfront.net/2025-03-11/graphql";
const operationName = "MatchSeries";
const variables = `{ "tournamentIds": ["66936630-ec85-4f1b-9e67-325d0389eb87", "13bd2b48-922d-4800-8df9-1e9f646221be"] }`;
const extensions = `{ "persistedQuery": { "version": 1, "sha256Hash": "48a028dd531ba27242b908d22c175384e78014e53615d6c933200b43a1fc29c2" } }`;

let title = "League of Legends EWC";
const localTimeZone = "America/Sao_Paulo";

export async function GET(request) {
  try {

    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text", msg = "No games for (league) today" } = obj;

    if (!channel) return NextResponse.json({ status: "failed", error: "Missing channel" }, { status: 200 });

    const gameRequest = await fetch(`${baseURL}?` +
      new URLSearchParams({
        "operationName": operationName,
        "variables": variables,
        "extensions": extensions
      }),
      { method: "GET" }
    );

    if (!gameRequest.ok) {
      return sendResponse({ gameRequest, error: true });
    }

    const gameResponse = await gameRequest.json();
    const matches = listTodayMatches(gameResponse);

    return sendResponse({ matches, type, channel, msg });

  } catch (error) {
    console.log("Error:", error.message);
    return sendResponse({ error: error });
  }
}


// Function to list today's matches
function listTodayMatches(data) {
  title = data.data.matchSeries.items[0].tournament.name;
  const matchList = data.data.matchSeries.items;
  const todayBR = Temporal.Now.zonedDateTimeISO(localTimeZone);

  const matches = [];

  for (let i = 0; i < matchList.length; i++) {
    const match = matchList[i];
    const matchDateBR = Temporal.Instant.from(match.startTime).toZonedDateTimeISO(localTimeZone);

    if (matchDateBR.day !== todayBR.day) continue;
    if (!match.contestants || match.contestants.length < 2) continue;

    const team1 = match.contestants[0];
    const team2 = match.contestants[1];

    if (!team1?.team?.name || !team2?.team?.name) continue;

    const startTime = Temporal.Instant.from(match.startTime).toZonedDateTimeISO("UTC");
    const startTimeBR = Temporal.Instant.from(match.startTime).toZonedDateTimeISO(localTimeZone);

    const game = {
      startTime: match.startTime,
      startTimeBR: startTimeBR.toString({ timeZoneName: 'never' }),
      startHour: startTime.hour,
      startHourBR: startTimeBR.hour,
      team1Name: team1.team.name,
      team1Score: team1.score || 0,
      team2Name: team2.team.name,
      team2Score: team2.score || 0,
      message: `${startTimeBR.hour}h - ${team1.team.name} ${team1.score}x${team2.score} ${team2.team.name}`
    }
    matches.push(game);
  }
  return matches;
}

// Function to send the response
async function sendResponse(data) {

  if (data.error) return NextResponse.json({ status: "failed", message: "Failed to list League of Legends EWC matches. Please try again." }, { status: 200 });

  const { matches, type, channel, msg } = data;

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