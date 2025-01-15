/*
The idea of this endpoint is to create an option to run commercial when a League of Legends match is not running.
This will be done by a widget on Streamelements that will check if the game is finished, and if so, run the commercial.
The widget will check the game status using Riot API through the /api/lol/active-game endpoint.

The active-game endpoint will return a JSON object with the following structure:

{
  "inGame": false,
  "player": "Minerva",
  "tag": "BR1",
  "currentGame": {
    "gameId": 0,
    "replayId": null,
    "gameStartTime": 0,
    "championName": null
  },
  "previousGame": {
    "gameId": 3053457257,
    "replayId": "BR1_3053457257",
    "gameStartTime": 1736906589405,
    "gameLength": 1941349,
    "gameDuration": "32m 21s",
    "result": "lose",
    "championName": "Zyra",
    "kda": "7/8/18"
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