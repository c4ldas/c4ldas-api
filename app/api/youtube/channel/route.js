import { NextResponse } from 'next/server';

import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.YOUTUBE_KEY) :
  process.env.YOUTUBE_KEY;

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  try {
    let { username, type = "json" } = obj;

    // const innerTube = await Innertube.create(/* options */);
    const url = "https://youtube.googleapis.com/youtube/v3/channels";

    const id = await getChannelByHandle(username);
    const channelInfo = id != 0 ? await getChannelById(id, url, apiToken) : { items: [] };

    const results = await channelInfo.items[0] || {
      snippet: {
        publishedAt: "N/A",
        channelId: "N/A",
        title: "N/A",
        description: "N/A",
        thumbnails: {
          medium: {
            url: "/images/not-found.png",
          },
        },
      },
    };

    const { title, description, publishedAt, thumbnails } = results.snippet;
    if (type == "text") return new Response(id, { status: 200 });
    return NextResponse.json({ channelId: id, title, description, publishedAt, thumbnails }, { status: 200 });

  } catch (error) {
    console.log("Youtube GET:", error);
    return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 400 });
  }
}

async function getChannelByHandle(username) {
  try {
    const htmlRequest = await fetch(`https://youtube.com/${username}`, {
      revalidate: 900, // 15 minutes
    });
    const html = await htmlRequest.text();

    const channelId = html.match(/itemprop="url"\s*href="https:\/\/www\.youtube\.com\/channel\/([^"]+)"/)[1];
    console.log("channelId: ", channelId);
    return channelId;

    // Using Youtubei.js library
    // const resolved = await innerTube.resolveURL(`https://youtube.com/${username}`);
    // console.log("Resolved:", resolved)
    // return resolved.payload.browseId;
  } catch (error) {
    // console.log(error)
    // const errorMessage = JSON.parse(error.info);
    console.log("Youtube getChannelByHandle:", error.message);
    return 0;
  }
}

async function getChannelById(id, url, key) {
  try {
    const infoFetch = await fetch(`${url}?part=id,snippet&id=${id}&key=${key}`);
    const info = await infoFetch.json();

    if (info.error) throw new Error(info.error.message);
    return await info;

  } catch (error) {
    console.log("Youtube getChannelById:", error);
    return 0;
  }
}