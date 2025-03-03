import { NextResponse } from "next/server";
import { getAccessToken, getNextSong, getSong, sendResponse } from "@/app/lib/spotify";
import { spotifyGetRefreshTokenDatabase } from "@/app/lib/database";

export async function GET(request, { params }) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, type = "text" } = obj;
  const id = params.id;

  try {
    const refreshToken = await spotifyGetRefreshTokenDatabase(id);
    const accessToken = await getAccessToken(refreshToken, type);
    const song = await getSong(accessToken, type);
    const nextSong = await getNextSong(accessToken, type) || '';

    return sendResponse(song, nextSong, type, channel);

  } catch (error) {
    if (type == "text") return new Response(error.error, { status: 200 });
    return NextResponse.json({ error: error.error, status: error.status }, { status: 200 });
  }
};
