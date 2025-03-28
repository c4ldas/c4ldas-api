// Description:
// - This file contains the route for the twitch replay
// - The route will create clip direct link based on the clip id

import { twitchGetTokenDatabase, twitchSaveToDatabase } from "@/app/lib/database";
import { getClipData, getClipDownloadURL } from "@/app/lib/twitch";
import { NextResponse } from "next/server";

const CLIP_TWITCH_CLIENT_ID = process.env.CLIP_TWITCH_CLIENT_ID;
const CLIP_TWITCH_CLIENT_SECRET = process.env.CLIP_TWITCH_CLIENT_SECRET;
const CLIP_CHANNEL = process.env.CLIP_CHANNEL;
const CLIP_CODE = process.env.CLIP_CODE;

export async function GET(request) {
  try {

    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text", id } = obj;

    // Check if the user is missing from the request
    if (!channel) return NextResponse.json({ status: "failed", message: "Missing channel" }, { status: 200 });
    if (!id) return NextResponse.json({ status: "failed", message: "Missing id" }, { status: 200 });

    // Get the token from c4ldasbot user
    const token = await twitchGetTokenDatabase(CLIP_CODE, CLIP_CHANNEL);

    // Check if the token is valid
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });

    // Get a new token to avoid token expiration
    const newToken = await getNewToken(token.refresh_token);

    // Data to save to database
    const data = {
      id: token.id,
      username: CLIP_CHANNEL,
      access_token: newToken.access_token,
      refresh_token: newToken.refresh_token,
      code: CLIP_CODE
    }

    // Save to database
    const saveToDatabase = await twitchSaveToDatabase(data);
    if (!saveToDatabase) return NextResponse.json({ status: "failed", error: "Error while saving to database" }, { status: 200 });

    // Check if clip id is valid
    const clipData = await getClipData(id, newToken.access_token);
    if (!clipData) return NextResponse.json({ status: "failed", message: "Clip does not exist" }, { status: 200 });

    const assetId = clipData.thumbnail_url.split("/").at(-2);
    clipData.asset_id = assetId;

    const downloadURL = await getClipDownloadURL(id);
    clipData.video_url = downloadURL;

    if (type === "text") return new Response(downloadURL, { status: 200 });
    return NextResponse.json({ status: "success", data: clipData }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 200 });

  }
}


export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}


// Get a new token
async function getNewToken(refreshToken) {
  try {
    const request = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIP_TWITCH_CLIENT_ID,
        client_secret: CLIP_TWITCH_CLIENT_SECRET,
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
