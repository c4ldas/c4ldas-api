/**
* This is the future route for schedule
* This page uses vlr.gg as a data source
* Currently, there are 3 endpoints for schedule:
* - /valorant/schedule
* - /valorant/schedule/vlr
* - /valorant/schedule/vlr.gg
* The idea is to move /api/valorant/schedule/vlr.gg to /api/valorant/schedule and use it for all requests
* So, in the future, only one endpoint will be used (/api/valorant/schedule) and it will gather data from vlr.gg website
* 
* TO DO:  
* - Check how many people are using /api/valorant/schedule endpoint
* - If not many (or none at all), just put the /vlr.gg code directly on /api/valorant/schedule
* - Move the endpoint /api/valorant/schedule/vlr.gg to /api/valorant/schedule
* - Remove the page /valorant/schedule-vlrgg
* - Remove page.jsx from /(frontend)/valorant/schedule
* - Rename page_new.jsx to page.jsx from /(frontend)/valorant/schedule
* - Add a response (for a limited time) on /api/valorant/schedule/vlr.gg to use /api/valorant/schedule instead (just remove the /vlr.gg from the URL)
* - Remove any /api/valorant/schedule/vlr.gg from the this page (lines 46, 68, 95, and 102) and use /api/valorant/schedule
*
* Future TO DO:
* - Remove the route /api/valorant/schedule/vlr and /api/valorant/schedule/vlr.gg
*/


import { JSDOM } from "jsdom";
import { Temporal } from "@js-temporal/polyfill";
import { NextResponse } from "next/server";
import { convertTZ, regionToTZ } from "@/app/lib/convert_timezone";

// Check if project is local or on Vercel and set the correct time zone
const localTimeZone = process.env.VERCEL_URL ? regionToTZ[process.env.AWS_REGION] : Temporal.Now.timeZoneId();

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!+
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { id, series_id = "all", channel, type = "text", msg = "No games for (league) today" } = obj;
    const url = (eventId, seriesId) => `https://www.vlr.gg/event/matches/${eventId}/?series_id=${seriesId}`; // URL base to get the schedule

    if (!channel) return NextResponse.json({ status: "failed", error: "Missing channel" }, { status: 200 });
    if (!id) return NextResponse.json({ status: "failed", error: "Missing id" }, { status: 200 });

    const html = await fetch(url(id, series_id), {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then((res) => res.text());

    if (!html) return NextResponse.json({ status: "failed", error: "Not possible to get the schedule. Please try again" }, { status: 200 });
    const document = new JSDOM(html).window.document;

    // Check for page not found, possibly invalid id
    const pageNotFound = document.querySelectorAll(".col.mod-1")[0].textContent.trim().startsWith("Page not found");
    if (pageNotFound) return NextResponse.json({ status: "failed", error: "Invalid id" }, { status: 200 });

    // Get championiship name
    const title = Array.from(document.querySelectorAll(".wf-title")).map((item) => cleanText(item.textContent)).toString();

    // Array to store matches
    const matches = [];

    // Get matches
    const dayGroup = document.querySelectorAll('[class="wf-card"]');
    dayGroup.forEach((day) => {
      const date = cleanText(day.previousElementSibling.textContent);
      day.querySelectorAll(".wf-module-item").forEach((match) => {
        const time = match.querySelector(".match-item-time").textContent.trim();
        const isToday = getIsToday(parseDate(date, time, "br", "noTZ"));

        if (isToday) {
          const team1 = match.querySelectorAll(".match-item-vs-team-name")[0].textContent.trim();
          const team2 = match.querySelectorAll(".match-item-vs-team-name")[1].textContent.trim();
          const team1Score = +match.querySelectorAll(".match-item-vs-team-score")[0].textContent.trim() || "0";
          const team2Score = +match.querySelectorAll(".match-item-vs-team-score")[1].textContent.trim() || "0";

          // Create response to be sent
          const response = {
            br_date: parseDate(date, time, "br", "date"),
            br_hour: parseDate(date, time, "br", "hour"),
            br_minute: parseDate(date, time, "br", "minute"),
            br_date_time: parseDate(date, time, "br", "full"),
            utc_date_time: parseDate(date, time, "utc", "full"),
            team_1: team1,
            team_2: team2,
            team_1_score: team1Score,
            team_2_score: team2Score,
            message: `${parseDate(date, time, "br", "timeNoSec")} - ${team1} ${team1Score}x${team2Score} ${team2}`,
          }

          matches.push(response);
        }
      })
    })

    return sendResponse({ matches, type, channel, title, msg });

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ status: "failed", error: "Internal server error" }, { status: 200 });
  }
}


function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Parse date from raw date
function parseDate(rawDate, time, timezoneId = "br", property = "noTZ") {
  // Check if time is "TBD"
  if (time == "TBD") return null;

  // 1.Clean input: remove weekday and "Today"/"Yesterday"
  let cleanedDate = rawDate
    .replace(/^\w{3},\s*/, '')
    .replace(/\s+(Today|Yesterday)$/i, '')
    .trim();

  // 2. Parse date
  const parts = new Date(`${cleanedDate} ${time}`);
  if (Number.isNaN(parts)) return null; // invalid date

  const date = Temporal.ZonedDateTime.from({
    year: parts.getFullYear(),
    month: parts.getMonth() + 1,
    day: parts.getDate(),
    hour: parts.getHours(),
    minute: parts.getMinutes(),
    timeZone: localTimeZone
  });

  return convertTZ(date, timezoneId, property);
}


function getIsToday(date) {
  date = new Date(date);
  const now = Temporal.Now.instant();
  const today = now.toZonedDateTimeISO("America/Sao_Paulo");

  const isToday = date.getDate() == today.day && date.getMonth() == today.month - 1 && date.getFullYear() == today.year;
  return isToday;
}


async function sendResponse(data) {
  const { matches, type, channel, title, msg } = data;

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