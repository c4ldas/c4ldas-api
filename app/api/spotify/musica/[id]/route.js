import { NextResponse } from "next/server";
import { getRefreshTokenDatabase, getAccessToken, getSong } from "@/app/lib/spotify";

export async function GET(request, { params }) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { channel, type = "text" } = obj;
  const id = params.id;

  try {
    const refreshToken = await getRefreshTokenDatabase(id);
    const accessToken = await getAccessToken(refreshToken, type);
    const song = await getSong(accessToken, type);

    return sendResponse(song, type, channel);

  } catch (error) {
    console.log("GET() error: ", error);
    if (type == "text") return new Response(error.error, { status: 200 });
    return NextResponse.json(error, { status: 200 });
  }
};

export async function sendResponse(song, type, channel) {
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