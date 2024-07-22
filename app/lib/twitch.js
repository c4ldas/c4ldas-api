import { NextResponse } from "next/server";
import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
let TWITCH_CLIENT_ID;
let TWITCH_CLIENT_SECRET;

if (env == "dev") {
  TWITCH_CLIENT_ID = decrypt(process.env.TWITCH_CLIENT_ID);
  TWITCH_CLIENT_SECRET = decrypt(process.env.TWITCH_CLIENT_SECRET);

} else {
  TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
}

async function getTokenCode(code) {
  const request = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: TWITCH_REDIRECT_URI,
    }),
  });
  const response = await request.json();
  return response;

  /* 
  {
    access_token: '*************',
    expires_in: 14940,
    refresh_token: '*************',
    token_type: 'bearer'
  }
  */
}

async function getUserData(token) {
  const request = await fetch("https://api.twitch.tv/helix/users", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Client-Id": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${token}`,
    },
  });
  const response = await request.json();
  return response.data[0];

  /* 
  {
    data: [
      {
        id: '28057703',
        login: 'c4ldas',
        display_name: 'c4ldas',
        type: '',
        broadcaster_type: 'affiliate',
        description: 'Eu sou uma pessoa sem biografia, então não sei o que escrever aqui. Sei que gosto da cor verde! Sim, o c4ldasBOT foi criado por mim. É apenas uma conta para testes.',
        profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/451dd285-491d-49e0-b1e0-20147f3ab56b-profile_image-300x300.png',
        offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/062ba782-40d8-4086-9ac2-07c052ecf04b-channel_offline_image-1920x1080.png',
        view_count: 0,
        created_at: '2012-02-07T21:56:05Z'
      }
    ]
  }
  */
}

// Not Used
async function getAccessToken(refreshToken, type) {
  const request = await fetch("", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      "Authorization": ``,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
  });
  const response = await request.json();
  return response.access_token;
}

// Not used
async function sendResponse(song, type, channel) {
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



async function createPrediction() {
  try {

  } catch (error) {
    console.log(error);
  }
}

async function closePrediction() {
  try {

  } catch (error) {
    console.log(error);
  }
}


async function cancelPrediction(accessToken, broadcasterId, predictionId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions`, {
      "method": "PATCH",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "broadcaster_id": broadcasterId,
        "status": "CANCELED",
        "id": predictionId
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to cancel prediction', { status: response.status });

    console.log("Cancel prediction:", response);
    return { status: "success", message: 'Prediction cancelled successfully' };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function getOpenPrediction(accessToken, broadcasterId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions?broadcaster_id=${broadcasterId}&first=1`, {
      "method": "GET",
      "next": { revalidate: 0 },
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID
      }
    });
    const response = await request.json();
    // console.log('getOpenPrediction: ', response.data[0]);

    // If no open prediction, return {}
    if (response.data[0].status != "ACTIVE" && response.data[0].status != "LOCKED") return null;

    // Return the open prediction
    return response.data[0];

  } catch (error) {
    console.log(error);
  }
}

export { getTokenCode, getUserData, cancelPrediction, getOpenPrediction };