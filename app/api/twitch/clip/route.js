// Description:
// - This file contains the route for the twitch clip endpoint
// - The route will create a clip for the user and return the clip URL
// - The functions for the database are in the lib/database.js file
// - The user that creates the clip is in the environment variable CLIP_CHANNEL

import { twitchGetTokenDatabase, twitchSaveToDatabase } from "@/app/lib/database";
import { NextResponse } from "next/server";

const client_id = process.env.CLIP_TWITCH_CLIENT_ID;
const client_secret = process.env.CLIP_TWITCH_CLIENT_SECRET;
const clipChannel = process.env.CLIP_CHANNEL;
const code = process.env.CLIP_CODE;
const clipBaseURL = "https://clips.twitch.tv/";


export async function GET(request) {
  try {

    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text" } = obj;

    // Check if the user is missing from the request
    if (!channel) return NextResponse.json({ status: "failed", message: "User missing" }, { status: 200 });

    // Get the token from c4ldasbot user
    const token = await twitchGetTokenDatabase(code, clipChannel);

    // Check if the token is valid
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });

    // Get a new token to avoid token expiration
    const newToken = await getNewToken(token.refresh_token);

    // Data to save to database
    const data = {
      id: token.id,
      username: clipChannel,
      access_token: newToken.access_token,
      refresh_token: newToken.refresh_token,
      code: code
    }

    // Save to database
    const saveToDatabase = await twitchSaveToDatabase(data);
    if (!saveToDatabase) return NextResponse.json({ status: "failed", error: "Error while saving to database" }, { status: 200 });

    // Get user data
    const userData = await getUserData(channel, newToken.access_token);

    // Create a clip
    const clipData = await createClip(userData.id, newToken.access_token);

    // Create a sleep to wait for the clip to be created
    console.log("Waiting for clip to be created...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if the clip is created
    // const getClip = await getClipData(clipData.id, newToken.access_token);
    // if (!getClip) return NextResponse.json({ statu: "failed", message: "Clip not created" }, { status: 400 });

    // Get the clip URL
    const clipURL = clipBaseURL + clipData.id;

    if (type === "text") return new Response(clipURL, { status: 200 });
    return NextResponse.json({ status: "success", data: clipURL }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 200 });

  }
}


export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}


// Get user data based on the username
// curl -X GET `https://api.twitch.tv/helix/users?login=${user}` -H "Authorization: Bearer ACCESS_TOKEN" -H "Client-Id: CLIENT_ID"
async function getUserData(channel, token) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Client-Id": client_id,
        "Authorization": `Bearer ${token}`,
      },
    });
    const response = await request.json();
    return response.data[0];

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Create a clip
// curl -X POST "https://api.twitch.tv/helix/clips?broadcaster_id=CHANNEL" -H "Authorization: Bearer ACCESS_TOKEN" -H "Client-Id: CLIENT_ID"
async function createClip(broadcaster_id, token) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcaster_id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Client-Id": client_id,
        "Authorization": `Bearer ${token}`,
      },
    });
    const response = await request.json();

    if (response.error) throw { status: "failed", message: response.message };
    return response.data[0];

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Get clip data to check if it's created
// curl -X GET 'https://api.twitch.tv/helix/clips?id=CLIP_ID' -H 'Authorization: Bearer ACCESS_TOKEN' -H 'Client-Id: CLIENT_ID'
async function getClipData(clip_id, token) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/clips?id=${clip_id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Client-Id": client_id,
        "Authorization": `Bearer ${token}`,
      },
    });
    const response = await request.json();
    return response.data[0];

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Get a new token
async function getNewToken(refreshToken) {
  try {
    const request = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}