import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;
let SPOTIFY_CLIENT_ID;
let SPOTIFY_CLIENT_SECRET;

if (env == "dev") {
  SPOTIFY_CLIENT_ID = decrypt(process.env.SPOTIFY_CLIENT_ID);
  SPOTIFY_CLIENT_SECRET = decrypt(process.env.SPOTIFY_CLIENT_SECRET);

} else {
  SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
}

export async function GET(request, { params }) {
  try {

    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { channel, type = "text" } = obj;
    const id = params.id;

    const refreshToken = await getRefreshToken(id);
    const accessToken = await getAccessToken(refreshToken);
    const song = await getSong(accessToken);

    return NextResponse.json({ song }, { status: 200 });
  } catch (error) {
    console.log("GET(): ", error);
    return NextResponse.json({ error: error.error }, { status: 200 });
  }
};



async function getRefreshToken(id) {
  try {

    const refreshTokenQuery = {
      text: 'SELECT refresh_token FROM spotify WHERE id = $1',
      values: [id],
    }

    const client = await sql.connect();
    const { rows } = await client.query(refreshTokenQuery);
    client.release();

    if (!rows[0]) {
      throw { error: "User not registered!" };
    }
    return rows[0].refresh_token;

  } catch (error) {
    console.log("getRefreshToken(): ", error);
    throw (error);
  }
}



async function getAccessToken(refreshToken) {
  try {

    const accessTokenRequest = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      next: { revalidate: 300 },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      }),
      headers: {
        'Authorization': `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString("base64")}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!accessTokenRequest.ok || accessTokenRequest.status != 200) throw { error: "Failed to get access token.", status: 500 };

    const accessToken = await accessTokenRequest.json();
    return accessToken.access_token;

  } catch (error) {
    console.log("getAccessToken(): ", error);
    throw (error);
  }
}


async function getSong(accessToken) {
  try {

    const musicFetch = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      "method": "GET",
      "next": { revalidate: 0 },
      "headers": {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (musicFetch.status == 204) throw { error: "No song playing!", status: 204 };
    const music = await musicFetch.json();
    return music;

  } catch (error) {
    console.log("getSong(): ", error);
    throw (error);
  }
}