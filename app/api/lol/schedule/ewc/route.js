import { NextResponse } from "next/server";

const baseURL = "https://dzuvpjnlus2rx.cloudfront.net/2025-03-11/graphql";
const operationName = "MatchSeries";
const variables = `{ "tournamentIds": ["66936630-ec85-4f1b-9e67-325d0389eb87", "13bd2b48-922d-4800-8df9-1e9f646221be"] }`;
const extensions = `{ "persistedQuery": { "version": 1, "sha256Hash": "48a028dd531ba27242b908d22c175384e78014e53615d6c933200b43a1fc29c2" } }`;
let title = "League of Legends EWC";

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
      return sendResponse(gameRequest, error = true);
    }

    const gameResponse = await gameRequest.json();
    const matches = listTodayMatches(gameResponse);

    return sendResponse({ matches, type, channel, msg });

  } catch (error) {
    console.log("Error!", error.message);
    return NextResponse.json({ status: "failed", message: "Failed to list League of Legends EWC matches. Please try again." }, { status: 200 });
  }
}


function listTodayMatches(data) {
  title = data.data.matchSeries.items[0].tournament.name;
  const matchList = data.data.matchSeries.items;

  const matches = [];

  for (let i = 0; i < matchList.length; i++) {
    const match = matchList[i];
    const matchDate = new Date(match.startTime);
    const today = new Date();
    if (matchDate.getDate() == today.getDate()) {
      const hour = match.startTime.split("T")[1].split(":")[0] - 3;
      const game = {
        startTime: match.startTime,
        team1Name: match.contestants[0]?.team.name,
        team2Name: match.contestants[1]?.team.name,
        team1Score: match.contestants[0]?.score,
        team2Score: match.contestants[1]?.score,
        message: `${hour}h - ${match.contestants[0]?.team.name} ${match.contestants[0]?.score}x${match.contestants[1]?.score} ${match.contestants[1]?.team.name}`
      }
      if (!game.team1Name || !game.team2Name) continue;
      matches.push(game);
    }
  }
  return matches;
}

async function sendResponse(data) {
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