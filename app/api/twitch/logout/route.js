import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { twitchRemoveIntegration } from "@/app/lib/database";

// Pending refresh_token expiration on Twitch API
// curl -X POST 'https://id.twitch.tv/oauth2/revoke' \
// -H 'Content-Type: application/x-www-form-urlencoded' \
// -d 'client_id=<client id goes here>&token=<access token goes here>'

export async function POST(request) {
  try {
    const id = cookies().get('twitch_id').value;
    const username = cookies().get('twitch_username').value;
    const code = cookies().get('twitch_code').value;

    const isRemoved = await twitchRemoveIntegration(id, username, code);

    cookies().delete('twitch_id');
    cookies().delete('twitch_username');
    cookies().delete('twitch_code');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}
