import { NextResponse } from "next/server";

import decrypt from "@/app/lib/encode_key";
import { color } from "@/app/lib/colorLog";

const env = process.env.ENVIRONMENT;
// const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SPOTIFY_REDIRECT_URI = "http://localhost:3000/api/spotify/callback";

let SPOTIFY_CLIENT_ID;
let SPOTIFY_CLIENT_SECRET;

if (env == "dev") {
  SPOTIFY_CLIENT_ID = decrypt(process.env.SPOTIFY_CLIENT_ID);
  SPOTIFY_CLIENT_SECRET = decrypt(process.env.SPOTIFY_CLIENT_SECRET);

} else {
  SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
}

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;

  if (!code) return NextResponse.json({ error: "Code not found" }, { status: 400 });

  const token = await getToken(code);
  const user = await getUser(token.access_token);

  const data = {
    id: user.id,
    display_name: user.display_name,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  const saved = await saveToDatabase(data);
  if (!saved) return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });

  return NextResponse.json({ id: user.id, display_name: user.display_name }, { status: 200 });

}


async function getToken(code) {
  const getTokenFetch = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });
  const data = await getTokenFetch.json();
  return data;

  /*   
  {
    "access_token": "******",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "********",
    "scope": "user-modify-playback-state user-read-currently-playing"
  } 
  */
}

async function getUser(token) {
  const getUserFetch = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await getUserFetch.json();
  return data;

  /* 
    {
      "display_name": "c4ldas",
      "href": "https://api.spotify.com/v1/users/c4ldas",
      "id": "c4ldas",
      "type": "user",
      "uri": "spotify:user:c4ldas",
      "external_urls": {
        "spotify": "https://open.spotify.com/user/c4ldas"
      },
      "followers": {
        "href": null,
        "total": 21
      },
      "images": [
        {
          "url": "https://i.scdn.co/image/ab67757000003b82d3ff308820a44bfa543ef303",
          "height": 64,
          "width": 64
        },
        {
          "url": "https://i.scdn.co/image/ab6775700000ee85d3ff308820a44bfa543ef303",
          "height": 300,
          "width": 300
        }
      ]
    }
   */
}

async function saveToDatabase(user) {
  // Table name: spotify
  // Columns: id, display_name, access_token, refresh_token

  // Save to database (pending)

  if (failed) return false;
  return true;
}

/* 

const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
const Database = require("@replit/database");
const db = new Database();

router.get("/", async (req, res) => {
  if (req.query.error) {
    res.send(`Aplicação não foi aceita: ${req.query.error}`);
    return;
  }

  const getTokenFetch = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }),
  });
  const getTokenJson = await getTokenFetch.json();

  const me = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${getTokenJson.access_token}`,
    },
  });
  const meFetch = await me.json();

  const id = meFetch.id;
  const displayName = meFetch.display_name;
  const token = getTokenJson.access_token;
  const refreshToken = getTokenJson.refresh_token;

  const values = {
    _displayName: displayName,
    _token: token,
    _refreshToken: refreshToken,
  };

  console.log(`ID: ${id}, displayName: ${displayName}`);
  await db.set(id, values);
  res.render(__dirname + "/callback.ejs", { displayName: displayName, id: id });
});

module.exports = router;



*/