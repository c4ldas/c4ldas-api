import { NextResponse } from "next/server";
import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
let SPOTIFY_CLIENT_ID;
let SPOTIFY_CLIENT_SECRET;

if (env == "dev") {
  SPOTIFY_CLIENT_ID = decrypt(process.env.SPOTIFY_CLIENT_ID);
  SPOTIFY_CLIENT_SECRET = decrypt(process.env.SPOTIFY_CLIENT_SECRET);

} else {
  SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
}


async function getTokenCode(code) {
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


async function getAccessToken(refreshToken, type) {
  const getAccessTokenFetch = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
  });
  const data = await getAccessTokenFetch.json();
  return data.access_token;
}


async function getUserData(token) {
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
      "external_urls": {},
      "followers": {},
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


async function getSong(accessToken, type) {
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
    // console.log("getSong() error: ", error);
    throw (error);
  }
}

async function getNextSong(accessToken, type) {
  try {
    const request = await fetch("https://api.spotify.com/v1/me/player/queue", {
      "method": "GET",
      "next": { revalidate: 0 },
      "headers": {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (request.status == 204) throw { error: "No song playing!", status: 204 };
    const response = await request.json();
    return response.queue[0].name;

  } catch (error) {
    // console.log("getNextSong() error: ", error.message);
    // throw (error);
    return null;
  }
}

async function sendResponse(song, nextSong, type, channel) {
  try {
    const songName = song.item.name;
    const artists = song.item.artists.map(artist => artist.name).join(" & ");
    const songIsPlaying = song.is_playing;

    if (type == "json") {
      const data = {
        "name": song.item.name,
        "artists": song.item.artists.map(artist => artist.name).join(" & "),
        "artists_array": song.item.artists,
        "is_playing": song.is_playing,
        "album": song.item.album.name,
        "album_art": song.item.album.images,
        "timestamp": song.timestamp,
        "progress_ms": song.progress_ms,
        "duration_ms": song.item.duration_ms,
        "popularity": song.item.popularity,
        "song_preview": song.item.preview_url,
        "next_song": nextSong,
      }

      return NextResponse.json(data, { status: 200 });
    }

    if (!songIsPlaying) {
      return new Response("No song playing!", { status: 200 });
    }

    return new Response(`${artists} - ${songName}`, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.error }, { status: 200 });
  }
}


export { getSong, getNextSong, getUserData, getTokenCode, getAccessToken, sendResponse };