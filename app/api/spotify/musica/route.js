import { NextResponse } from "next/server";
import { getAccessToken, getSong, sendResponse } from "@/app/lib/spotify";
import { spotifyGetRefreshTokenDatabase } from "@/app/lib/database";

export async function GET(request, { params }) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { id, channel, type = "text" } = obj;


  try {
    const refreshToken = await spotifyGetRefreshTokenDatabase(id);
    const accessToken = await getAccessToken(refreshToken, type);
    const song = await getSong(accessToken, type);

    return sendResponse(song, type, channel);

  } catch (error) {
    console.log("GET() error: ", error);
    if (type == "text") return new Response(error.error, { status: 200 });
    return NextResponse.json(error, { status: 200 });
  }
};
