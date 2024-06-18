import { NextResponse } from 'next/server';


export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { id, type = "json" } = obj;


  try {
    const data = await getVideoData(id, type);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 400 });
  }
}


export async function getVideoData(videoId, type) {
  const url = `https://www.youtube.com/oembed?url=www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const dataRequest = await fetch(url);
    const data = await dataRequest.json();

    if (type == "json") {
      const { title, author_name, author_url, thumbnail_url } = data;
      return { title, author_name, author_url, thumbnail_url, video_url: `https://youtu.be/${videoId}` };
    }
    return (`${data.title} - https://youtu.be/${videoId}`);

  } catch (error) {
    // console.error(error);
    if (type == "json") {
      return {
        error: {
          message: "Request Failed. Please check the video ID is correct or try again later.",
          video_id: `${videoId}`,
          code: 400
        }
      }
    }
    return `Request failed. Please check the video ID is correct or try again later. Video ID: ${videoId}`;
  }
}