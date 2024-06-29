import { NextResponse } from "next/server";
import { twitchSaveToDatabase } from "@/app/lib/database";

// Pending
// import { getTokenCode, getUserData } from "@/lib/twitch";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;
  const origin = request.nextUrl.origin;

  if (!code) return NextResponse.json({ error: "Code not found" }, { status: 400 });

  const token = await getTokenCode(code);
  const user = await getUserData(token.access_token);

  const data = {
    id: user.id,
    display_name: user.display_name,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };


  const saved = await twitchSaveToDatabase(data);
  if (!saved) return NextResponse.json({ error: "Failed to save to database, try again later." }, { status: 500 });

  return Response.redirect(`${origin}/twitch?id=${user.id}&display_name=${user.display_name}`);

}
// If it is already registered, do not generate new code but save the new token information
// code = userDb ? userDb.code : uuidv4().replace(/-/g, '');
// code, username, id, access_token, refresh_token

async function getTokenCode(code) {
  return true
}

async function getUserData(token) {
  return true
}