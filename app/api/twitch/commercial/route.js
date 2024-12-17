/*
The idea of this endpoint is to create an option to run commercial when the Lol game is not running.
This will be done by a widget on Streamelements that will check if the game is finished, and if so, run the commercial.
The widget will check the game status using Riot API through the /api/lol/active-game endpoint.

The active-game endpoint will return a JSON object with the following structure:

{
  "inGame": true,
  "info": {
    "player": "playerName",
    "tag": "playerTag",
    "gameId": 3040033177,
    "matchId": "BR1_3040033177",
    "gameStartTime": 1734385418545,
    "gameLength": 874
  }
}

*/

import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}

export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}