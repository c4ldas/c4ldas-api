/*
This endpoint shows the games of the day based on the tournament searched. This is aimed to unofficial Riot tournaments.
The code is not very well written, but it works for a while.

Endpoint: 
https://repl.c4ldas.com.br/api/valorant/schedule/vlr?channel=$(channel)&league=LEAGUE_NAME&type=text

Original endpoint:
https://vlrggapi.vercel.app/
https://vlrggapi.vercel.app/match?q=results
https://vlrggapi.vercel.app/match?q=live_score
https://vlrggapi.vercel.app/match?q=upcoming

Response example:
"Tixinha Invitational by BONOXS: 23h - Furia 0 x 0 ShindeN"
*/

import { NextResponse } from "next/server";
import { Temporal } from "@js-temporal/polyfill";

const vlrQuery = (query) => `https://vlrggapi.vercel.app/match?q=${query}`;
const list = ["upcoming", "live_score", "results"];
const validLeagues = {
  "tixinha_invitational": "Tixinha Invitational by BONOXS",
}

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, league, type = "text", msg = "No games for (league) today" } = obj;

  const timeZone = Temporal.TimeZone.from('America/Sao_Paulo'); // Using Brazil time zone
  const todayDate = Temporal.Now.plainDateISO(timeZone).toString(); // Date for Brazil time zone

  try {
    const validParams = await checkParams(league, channel);
    if (!validParams.status) return sendResponse({ error: validParams.error }, 400, type, channel);

    // Get the matches and return the ones that match with the league name
    const results = await Promise.all(
      list.map(async (query) => {
        const request = await fetch(vlrQuery(query), { method: "GET" });
        const response = await request.json();
        const segments = response.data.segments.map((segment) => {

          if (segment.match_event == validLeagues[league] || segment.tournament_name == validLeagues[league]) {
            if (!segment.unix_timestamp) {
              // create unix_timestamp based on property "time_completed": "3h 41m ago"
              segment.unix_timestamp = parseTimeCompleted(segment.time_completed); // 2024-12-12T19:59:48Z
            } else {
              // Format unix_timestamp to "2024-12-12T19:59:48Z"
              segment.unix_timestamp = `${segment.unix_timestamp.replace(" ", "T")}Z`; // 2024-12-12T19:59:48Z
            }

            const brGameDateTime = timeZone.getPlainDateTimeFor(segment.unix_timestamp).toString();
            const gameMinute = Temporal.PlainTime.from(brGameDateTime).minute;

            // If minute is greater than 40, add 1 hour. That avoids games that start at 16:59h show as started at 16h
            if (gameMinute > 40) {
              segment.br_hour = Temporal.PlainTime.from(brGameDateTime).hour + 1; // gameTime + 1;
            } else {
              segment.br_hour = Temporal.PlainTime.from(brGameDateTime).hour // gameTime;
            }

            // Create br_timestamp using unix_timestamp and converting to Brazilian time
            segment.br_timestamp = timeZone.getPlainDateTimeFor(segment.unix_timestamp).toString();
            segment.br_date = segment.br_timestamp.split('T')[0]; // gameDate;
            return segment;
          };
        })
        // Remove undefined and null values
        return segments.filter(Boolean);
      })
    );

    // Check today games
    const todayGames = results.flat().map((game) => {
      const gameDate = timeZone.getPlainDateTimeFor(game.unix_timestamp).toString().split('T')[0];
      if (gameDate == todayDate) {
        return game;
      }
    }).filter(Boolean);


    // Parse time based on when the match was completed
    function parseTimeCompleted(timeCompleted) {
      // Extract days, hours, and minutes using a regular expression
      const match = /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*ago/.exec(timeCompleted);
      const [_, days = "0", hours = "0", minutes = "0"] = match;

      // Convert extracted values into numbers
      const duration = {
        days: parseInt(days, 10),
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
      };

      // Get the current date-time in the system time zone
      const now = Temporal.Now.zonedDateTimeISO();

      // Subtract the duration from the current date-time
      const matchTime = now.subtract(duration);

      // Format the ZonedDateTime as "YYYY-MM-DD HH:mm:ss" (excluding milliseconds)
      const formattedDateTime = matchTime.toPlainDateTime().toString().split('.')[0];
      return `${formattedDateTime}Z`;
    };

    return sendResponse(todayGames.flat(), 200, type, channel, league, msg)

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

  // First, sort the array by `br_hour` in ascending order
  response.sort((a, b) => a.br_hour - b.br_hour);

  if (type == "text" && response.length > 0) {
    response.forEach((match) => {
      const nameTeam1 = match.team1;
      const nameTeam2 = match.team2;
      const winsTeam1 = match.score1 || 0;
      const winsTeam2 = match.score2 || 0;
      matches.push(`${match.br_hour}h - ${nameTeam1} ${winsTeam1}x${winsTeam2} ${nameTeam2}`)
    })

    // Format the response like below:
    /* Team1 0x2 Team2 // Team3 2x0 Team4 // Team5 1x1 Team6 */
    const finalResponse = matches.toString().replaceAll(',', ' // ');
    console.log(finalResponse);
    return new Response(finalResponse, { status: 200 });

  } else if (type == "text" && response.length == 0) {
    // Created a new custom message and send it when there are no games
    const message = msg.replaceAll(/\(league\)/g, validLeagues[league]);
    console.log(message);
    return new Response(message, { status: 200 });
  }

  return NextResponse.json(response, { status: 200 });
}
