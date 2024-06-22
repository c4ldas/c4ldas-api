import { NextResponse } from 'next/server';

import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.YOUTUBE_KEY) :
  process.env.YOUTUBE_KEY;

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { username, type = "json" } = obj;
    // const innerTube = await Innertube.create(/* options */);
    const url = "https://youtube.googleapis.com/youtube/v3/channels";

    const id = await getChannelByHandle(username);
    const channelInfo = id != 0 ? await getChannelById(id, url, apiToken) : { items: [] };

    const results = await channelInfo.items[0] || {
      snippet: {
        publishedAt: null,
        channelId: null,
        title: null,
        description: null,
        thumbnails: {
          medium: {
            url: "https://www.c4ldas.com.br/api/youtube/not-found.png",
          },
        },
      },
    };

    const { title, description, publishedAt, thumbnails } = results.snippet;
    if (type == "text") return new Response(id, { status: 200 });
    return NextResponse.json({ channelId: id, title, description, publishedAt, thumbnails }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 400 });
  }
}

async function getChannelByHandle(username) {
  try {
    const htmlRequest = await fetch(`https://youtube.com/${username}`, {
      revalidate: 900, // 15 minutes
    });
    const html = await htmlRequest.text();

    const channelId = html.match(
      /itemprop="url"\s*href="https:\/\/www\.youtube\.com\/channel\/([^"]+)"/,
    )[1];
    return channelId;

    // Using Youtubei.js library
    // const resolved = await innerTube.resolveURL(`https://youtube.com/${username}`);
    // console.log("Resolved:", resolved)
    // return resolved.payload.browseId;
  } catch (error) {
    // console.log(error)
    // const errorMessage = JSON.parse(error.info);
    // console.log("Youtube: ", errorMessage.error.message);
    return 0;
  }
}

async function getChannelById(id, url, key) {
  try {
    const info = await (await fetch(`${url}?part=id,snippet&id=${id}&key=${key}`)).json();
    // console.log("Info: ", info)
    return await info;

  } catch (error) {
    // console.log("Catch get ChannelById Youtube: ", error);
    return 0;
  }
}