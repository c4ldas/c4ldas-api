// Description:
// - This file contains the route for the twitch clip endpoint
// - The route will create a clip for the user and return the clip URL
// - In case the type is "full" or "overlay", it will return the download URL as well
// - The functions for the database are in the lib/database.js file
// - The user that creates the clip is in the environment variable CLIP_CHANNEL

import { twitchGetTokenDatabase, twitchSaveToDatabase } from "@/app/lib/database";
import { createClip, editClipData, getClipData, getClipDownloadURL, getUserData } from "@/app/lib/twitch";
import { NextResponse } from "next/server";

export const maxDuration = 25; // Vercel config for max duration of the route

const CLIP_TWITCH_CLIENT_ID = process.env.CLIP_TWITCH_CLIENT_ID;
const CLIP_TWITCH_CLIENT_SECRET = process.env.CLIP_TWITCH_CLIENT_SECRET;
const CLIP_CHANNEL = process.env.CLIP_CHANNEL;
const CLIP_CODE = process.env.CLIP_CODE;
const CLIP_BASE_URL = "https://clips.twitch.tv/";

// type "full" of "overlay" should have the download link
const validTypes = ["text", "json", "full", "overlay"];

export async function GET(request) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text", duration = 30, title = '0' } = obj;

    // Check if the user is missing from the request
    if (!channel) return NextResponse.json({ status: "failed", message: "Missing channel" }, { status: 200 });

    // Check if the type is valid
    if (!validTypes.includes(type)) return NextResponse.json({ status: "failed", message: `Invalid type. 'type' should be one of ${validTypes.join(", ")}` }, { status: 200 });

    // Check if the duration is valid
    if (isNaN(duration) || duration < 5 || duration > 30) return NextResponse.json({ status: "failed", message: `Invalid duration. 'duration' should be a number between 5 and 30` }, { status: 200 });

    // Get the token from c4ldasbot user and check if it is valid
    let token = await twitchGetTokenDatabase(CLIP_CODE, CLIP_CHANNEL);
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });

    // Get user data
    let userData = await getUserData(token.access_token, channel);

    // Check if token worked for user
    if (userData.status == "failed") {
      let userId = token.id;
      console.log(`Token expired for ${CLIP_CHANNEL}, getting a new one...`);
      token = await getNewToken(token.refresh_token);

      // Data to save to database
      const data = {
        id: userId,
        username: CLIP_CHANNEL,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        code: CLIP_CODE
      }

      // Save to database
      const saveToDatabase = await twitchSaveToDatabase(data);
      if (!saveToDatabase) return NextResponse.json({ status: "failed", error: "Error while saving to database" }, { status: 200 });
      userData = await getUserData(token.access_token, channel);
    }

    // Create a clip
    const clipData = await createClip(userData.id, token.access_token, title, duration);
    console.log(`Creating clip for ${channel}...`);

    if (type != "full" && type != "overlay") {
      console.log(`Clip created: ${CLIP_BASE_URL}${clipData.id}`);
      if (type === "text") return new Response(CLIP_BASE_URL + clipData.id, { status: 200 });
      if (type == "json") return NextResponse.json({ status: "success", data: { id: clipData.id, url: CLIP_BASE_URL + clipData.id } }, { status: 200 });
    }

    // Create a sleep to wait for the clip to be created
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Check if the clip is created
    let getClipFailed = 0;
    let getClip = await getClipData(clipData.id, token.access_token);

    while (!getClip && getClipFailed < 5) {
      console.log(`Clip not yet created for ${channel}, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      getClip = await getClipData(clipData.id, token.access_token);
      getClipFailed++;
    }

    if (!getClip) return NextResponse.json({ status: "failed", message: "Failed to create clip, try again later" }, { status: 200 });

    /*
    // Get the clip data to edit the title and duration
    const clipURL = getClip.url;
    const assetId = getClip.thumbnail_url.split("/").at(-2);
    const slug = getClip.id;
    const originalTitle = getClip.title;

    // Edit the clip
    const editClip = await editClipData({ slug, assetId, title, duration, originalTitle });
    if (editClip[0].errors) { console.log("Error editing clip", editClip[0].data.error); }

    // Get the download URL
    console.log(`Generating download URL for clip ${clipData.id}...`);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const downloadURL = await getClipDownloadURL(clipData.id);

    return NextResponse.json({ status: "success", data: { id: clipData.id, url: clipURL, video_url: downloadURL, title: editClip[0].data.editClipMedia.clip.title } }, { status: 200 });
*/

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
      next: { revalidate: 0 }, // Disable cache for this request
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