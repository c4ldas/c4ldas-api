// Description:
// - This file contains the route for the twitch clip endpoint
// - The route will create a clip for the user and return the clip URL
// - The functions for the database are in the lib/database.js file
// - The user that creates the clip is in the environment variable CLIP_CHANNEL

import { twitchGetTokenDatabase, twitchSaveToDatabase } from "@/app/lib/database";
import { createClip, editClipData, getClipData, getClipDownloadURL, getUserData } from "@/app/lib/twitch";
import { NextResponse } from "next/server";

const CLIP_TWITCH_CLIENT_ID = process.env.CLIP_TWITCH_CLIENT_ID;
const CLIP_TWITCH_CLIENT_SECRET = process.env.CLIP_TWITCH_CLIENT_SECRET;
const CLIP_CHANNEL = process.env.CLIP_CHANNEL;
const CLIP_CODE = process.env.CLIP_CODE;
const clipBaseURL = "https://clips.twitch.tv/";

export const maxDuration = 25; // Vercel config for max duration of the route

export async function GET(request) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text", duration = 30, title } = obj;

    // Check if the user is missing from the request
    if (!channel) return NextResponse.json({ status: "failed", message: "Missing channel" }, { status: 200 });

    // Check if the duration is valid
    if (isNaN(duration) || duration < 5 || duration > 30) return NextResponse.json({ status: "failed", message: "duration should be a number between 5 and 30" }, { status: 200 });

    // Get the token from c4ldasbot user
    const token = await twitchGetTokenDatabase(CLIP_CODE, CLIP_CHANNEL);

    // Check if the token is valid
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });

    // Get a new token to avoid token expiration
    const newToken = await getNewToken(token.refresh_token);
    const newAccessToken = newToken.access_token;

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

    // Get user data
    const userData = await getUserData(newAccessToken, channel);

    // Create a clip
    // console.log(`Creating clip for ${channel}...`);
    const clipData = await createClip(userData.id, newToken.access_token);

    if (duration == 30) {
      if (type === "text") return new Response(clipBaseURL + clipData.id, { status: 200 });
      return NextResponse.json({ status: "success", data: { id: clipData.id, url: clipBaseURL + clipData.id } }, { status: 200 });
    }

    // Create a sleep to wait for the clip to be created
    console.log(`Waiting for clip to be created for ${channel}...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check if the clip is created
    let clipFailed = 0;
    let getClip = await getClipData(clipData.id, newToken.access_token);

    while (!getClip && clipFailed < 3) {
      clipFailed++;
      console.log(`Clip not yet created for ${channel}, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      getClip = await getClipData(clipData.id, newToken.access_token);
    }

    if (!getClip) return NextResponse.json({ status: "failed", message: "Failed to create clip, try again later" }, { status: 200 });

    // Get the clip data to edit the title and duration
    const clipURL = getClip.url;
    const assetId = getClip.thumbnail_url.split("/").at(-2);
    const slug = getClip.id;
    const originalTitle = getClip.title;

    // Edit the clip
    const editClip = await editClipData({ slug, assetId, title, duration, originalTitle });
    // console.log(editClip);
    if (editClip[0].errors) { console.log("Error editing clip", editClip[0].data.error); }

    if (type === "text") return new Response(clipURL, { status: 200 });

    // Get the download URL
    console.log(`Generating download URL for clip ${clipData.id}...`);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const downloadURL = await getClipDownloadURL(clipData.id);
    return NextResponse.json({ status: "success", data: { id: clipData.id, url: clipURL, video_url: downloadURL, title: editClip[0].data.editClipMedia.clip.title } }, { status: 200 });

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