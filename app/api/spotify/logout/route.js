import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { spotifyRemoveIntegration } from "@/app/lib/database";

// Pending refresh_token expiration on Spotify API
// It seems that option doesn't exist on Spotify API

export async function POST(request) {
  try {
    const id = cookies().get('spotify_id').value;
    const username = cookies().get('spotify_display_name').value;

    const isRemoved = await spotifyRemoveIntegration(id, username);

    cookies().delete('spotify_id');
    cookies().delete('spotify_display_name');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}
