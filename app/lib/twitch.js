import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
let TWITCH_CLIENT_ID;
let TWITCH_CLIENT_SECRET;
const CLIP_TWITCH_CLIENT_ID = process.env.CLIP_TWITCH_CLIENT_ID;
const GQL_TWITCH_CLIENT_ID = process.env.GQL_TWITCH_CLIENT_ID;
const GQL_TWITCH_CLIENT_SECRET = process.env.GQL_TWITCH_CLIENT_SECRET;

if (env == "dev") {
  TWITCH_CLIENT_ID = decrypt(process.env.TWITCH_CLIENT_ID);
  TWITCH_CLIENT_SECRET = decrypt(process.env.TWITCH_CLIENT_SECRET);

} else {
  TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
}

async function getTokenCode(code) {
  try {
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

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function getNewToken(refreshToken) {
  try {
    const request = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
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

async function getUserData(accessToken, channel) {
  const url = channel ? `https://api.twitch.tv/helix/users?login=${channel}` : "https://api.twitch.tv/helix/users";
  try {
    const request = await fetch(url, {
      method: "GET",
      next: { revalidate: 0 }, // Remove cache
      headers: {
        "Content-type": "application/json",
        "Client-Id": channel ? CLIP_TWITCH_CLIENT_ID : TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`
      },
    });

    const response = await request.json();
    if (response.error) throw { status: "failed", message: response.message };
    return response.data[0];

  } catch (error) {
    console.log(error);
    return { status: "failed", message: error.message };
    // throw { status: "failed", message: error.message };
  }
}

async function createPrediction(accessToken, broadcasterId, question, options, time) {
  try {
    const request = await fetch('https://api.twitch.tv/helix/predictions', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'broadcaster_id': broadcasterId,
        'title': question !== null ? question : 'Quem ganha esse mapa?',
        'prediction_window': time,
        'outcomes': options.map(option => { return { "title": option } })
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to create prediction', { status: response.status });

    // console.log("Create prediction:", response);
    return { status: "success", message: `Prediction created successfully. Question: ${question}` };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function closePrediction(accessToken, broadcasterId, predictionId, winner) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions`, {
      "next": { revalidate: 0 },
      "method": "PATCH",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "broadcaster_id": broadcasterId,
        "status": "RESOLVED",
        "id": predictionId,
        "winning_outcome_id": winner.id
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to close prediction', { status: response.status });

    // console.log("Close prediction:", response);
    return { status: "success", message: `Prediction closed successfully. Chosen option: ${winner.title}` };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function cancelPrediction(accessToken, broadcasterId, predictionId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions`, {
      "next": { revalidate: 0 },
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

    // console.log("Cancel prediction:", response);
    return { status: "success", message: 'Prediction cancelled successfully' };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function getOpenPrediction(accessToken, broadcasterId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions?broadcaster_id=${broadcasterId}&first=1`, {
      "next": { revalidate: 0 },
      "method": "GET",
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
    throw { status: "failed", message: error.message };
  }
}


// Create a clip
async function createClip(broadcaster_id, token, title = 0, duration = 30) {
  try {
    if (title == 0) title = '';

    const request = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcaster_id}&duration=${duration}&title=${title}`, {
      method: "POST",
      next: { revalidate: 0 }, // disable cache
      headers: {
        "Content-type": "application/json",
        "Client-Id": CLIP_TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    if (response.error) throw { status: "failed", message: response.message };
    return response.data[0];

  } catch (error) {
    console.log("createClip:", error);
    throw { status: "failed", message: error.message };
  }
}

// Get clip data to check if it's created
async function getClipData(clip_id, token) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/clips?id=${clip_id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Client-Id": CLIP_TWITCH_CLIENT_ID,
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


// Edit the clip data to add the download URL
// "assetID" is the ID from the thumbnail URL (from Get Clips endpoint), second last argument when split the "/" from the URL
// curl -X POST 'https://gql.twitch.tv/gql' -H 'Client-ID: kimne78kx3ncx6brgo4mv6wki5h1ko'
// -H 'Content-Type: application/json'
// -H 'Authorization oAuth <CLIP_CREATOR_USERNAME_TOKEN>'
// -d '[{"operationName":"ClipEdit_EditClipMedia","variables":{"input":{"slug":"ID","assetID":"ASSET_ID","title":"NEW_TITLE","segments":[{"durationSeconds":"DURATION","offsetSeconds":"OFFSET"}]}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"db8a234612a642d3b35e582fd54541e1b9602c6f39093403715555d47e718642"}}}]'
async function editClipData(data) {
  try {
    let { slug, assetId, title, duration, originalTitle } = data;
    duration = parseInt(duration);

    title = title ? decodeURIComponent(title) : originalTitle;

    const request = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Client-Id": GQL_TWITCH_CLIENT_ID,
        "Authorization": `OAuth ${GQL_TWITCH_CLIENT_SECRET}`,
      },
      body: JSON.stringify([{
        operationName: "ClipEdit_EditClipMedia",
        variables: {
          input: {
            slug: slug,
            assetID: assetId,
            title: title,
            segments: [
              {
                durationSeconds: duration,
                offsetSeconds: 30 - duration, // offset is removed from the beginning of the clip
              },
            ],
          },
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash: "db8a234612a642d3b35e582fd54541e1b9602c6f39093403715555d47e718642",
          },
        },
      }]),
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Get the Twitch download URL using Twitch GQL
// curl -X POST 'https://gql.twitch.tv/gql' -H 'Client-ID: kimne78kx3ncx6brgo4mv6wki5h1ko' 
// -H 'Content-Type: application/json' 
// -d '[{"operationName":"VideoAccessToken_Clip","variables":{"slug":"CLIP_ID"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11"}}}]'
async function getClipDownloadURL(slug) {
  try {
    const request = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Client-Id": GQL_TWITCH_CLIENT_ID,
      },
      body: JSON.stringify([{
        operationName: "VideoAccessToken_Clip",
        variables: { slug: slug },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash: "36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11",
          },
        },
      }]),
    });
    const response = await request.json();

    const sig = response[0].data.clip.playbackAccessToken.signature;
    const token = encodeURIComponent(response[0].data.clip.playbackAccessToken.value);
    const mp4 = response[0].data.clip.videoQualities[0].sourceURL;

    const downloadURL = `${mp4}?sig=${sig}&token=${token}`;
    return downloadURL;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

export { getTokenCode, getNewToken, getUserData, createPrediction, cancelPrediction, getOpenPrediction, closePrediction, createClip, getClipData, editClipData, getClipDownloadURL };