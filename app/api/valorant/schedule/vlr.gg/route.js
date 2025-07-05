import { JSDOM } from "jsdom";
import { Temporal } from "@js-temporal/polyfill";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {




    // Convert query strings (map format) to object format - Only works for this specific case!+
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { id, series = "all", channel, type = "text", msg = "No games for (league) today" } = obj;
    const url = (eventId, seriesId) => `https://www.vlr.gg/event/matches/${eventId}/?series_id=${seriesId}`;

    if (!channel) return NextResponse.json({ status: "failed", error: "Missing channel" }, { status: 200 });
    if (!id) return NextResponse.json({ status: "failed", error: "Missing id" }, { status: 200 });

    const html = await fetch(url(id, series), { /* next: { revalidate: 60 }, */ headers: { "User-Agent": "Mozilla/5.0" } }).then((res) => res.text());
    if (!html) return NextResponse.json({ status: "failed", error: "Not possible to get the schedule. Please try again" }, { status: 200 });

    const document = new JSDOM(html).window.document;

    // Check for page not found
    const pageNotFound = document.querySelectorAll(".col.mod-1")[0].textContent.trim().startsWith("Page not found");
    if (pageNotFound) return NextResponse.json({ status: "failed", error: "Invalid id" }, { status: 200 });


    const title = Array.from(document.querySelectorAll(".wf-title")).map((item) => cleanText(item.textContent)).toString();
    const dayGroup = document.querySelectorAll('[class="wf-card"]');

    const matches = [];

    dayGroup.forEach((day) => {
      const date = cleanText(day.previousElementSibling.textContent);
      day.querySelectorAll(".wf-module-item").forEach((match) => {
        const time = match.querySelector(".match-item-time").textContent.trim();

        const isToday = getIsToday(parseDate(date, time, "brDateTimeNoTZ"));

        if (isToday) {
          const team1 = match.querySelectorAll(".match-item-vs-team-name")[0].textContent.trim();
          const team2 = match.querySelectorAll(".match-item-vs-team-name")[1].textContent.trim();
          const team1Score = +match.querySelectorAll(".match-item-vs-team-score")[0].textContent.trim() || "0";
          const team2Score = +match.querySelectorAll(".match-item-vs-team-score")[1].textContent.trim() || "0";

          // Create response to send
          const response = {
            br_date: parseDate(date, time, "brDate"),
            br_hour: parseDate(date, time, "brHour"),
            br_minute: parseDate(date, time, "brMinute"),
            br_date_time: parseDate(date, time, "brDateTimeFull"),
            utc_date_time: parseDate(date, time, "utcDateTimeFull"),
            team_1: team1,
            team_2: team2,
            team_1_score: team1Score,
            team_2_score: team2Score,
            message: `${parseDate(date, time, "brTimeNoSeconds")} - ${team1} ${team1Score}x${team2Score} ${team2}`,
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


function parseDate(rawDate, time, property = "brDateTimeNoTZ") {
  // Check if time is "TBD"
  if (time == "TBD") return null;

  // Clean input: remove weekday and "Today"/"Yesterday"
  let cleanedDate = rawDate.replace(/^\w{3},\s*/, '');
  cleanedDate = cleanedDate.replace(/\s+(Today|Yesterday)$/i, '').trim();

  // Build string like "July 4, 2025 9:00 PM"
  const fullDateTime = `${cleanedDate} ${time}`;

  // System time zone (e.g. "Europe/Dublin")
  const localTimezone = Temporal.Now.timeZoneId();
  console.log(localTimezone.toString())

  // 1. Parse with legacy Date (assumes local time zone)
  const legacy = new Date(fullDateTime);

  // 2. Convert to Temporal.Instant
  const instant = Temporal.Instant.from(legacy.toISOString());


  // 3. Create a ZonedDateTime in Brazilian time
  const brDateTime = instant.toZonedDateTimeISO('America/Sao_Paulo');

  // 4. Convert to UTC (ZonedDateTime in UTC)
  const utcDateTime = instant.toZonedDateTimeISO('UTC');

  // 5. Convert to JSON
  const json = {
    utcDateTimeFull: utcDateTime.toInstant().toString(),    // e.g. "2025-07-04T20:00:00Z"
    utcDateTimeNoTZ: utcDateTime.toPlainDateTime().toString(), // e.g. "2025-07-04T20:00:00"
    utcDate: utcDateTime.toPlainDate().toString(), // e.g. "2025-07-04"
    utcTime: utcDateTime.toPlainTime().toString(), // e.g. "20:00:00"
    utcTimeNoSeconds: utcDateTime.minute === 0 ? utcDateTime.hour + "h" : utcDateTime.toPlainTime().toString({ smallestUnit: 'minute' }), // e.g. "20h" or "20:15"
    utcHour: utcDateTime.hour,    // e.g. "20"
    utcMinute: String(utcDateTime.minute).padStart(2, '0'), // e.g. "00" or "05"

    brDateTimeFull: brDateTime.toString().split("[")[0],    // e.g. "2025-07-04T17:00:00-03:00"
    brDateTimeNoTZ: brDateTime.toPlainDateTime().toString(), // e.g. "2025-07-04T17:00:00"
    brDate: brDateTime.toPlainDate().toString(), // e.g. "2025-07-04"
    brTime: brDateTime.toPlainTime().toString(), // e.g. "17:00:00"
    brTimeNoSeconds: brDateTime.minute === 0 ? brDateTime.hour + "h" : brDateTime.toPlainTime().toString({ smallestUnit: 'minute' }), // e.g. "17h" or "17:15"
    brHour: brDateTime.hour,    // e.g. "17"
    brMinute: String(brDateTime.minute).padStart(2, '0'), // e.g. "00" or "05"
  };

  return json[property];
}


function getIsToday(date) {
  date = new Date(date);
  const now = Temporal.Now.instant();
  const today = now.toZonedDateTimeISO("America/Sao_Paulo");

  const isToday = date.getDate() === today.day && date.getMonth() === today.month - 1 && date.getFullYear() === today.year;
  return isToday;
}


async function sendResponse(data) {
  const { matches, type, channel, title, msg } = data;

  const games = matches.map((match) => match.message);
  const message = msg.replaceAll(/\(league\)/g, title);

  if (type != "text") return NextResponse.json({ matches, title, channel }, { status: 200 });
  if (type == "text" && matches.length == 0) return new Response(message, { status: 200 });
  return new Response(games.join(" // "), { status: 200 });
}