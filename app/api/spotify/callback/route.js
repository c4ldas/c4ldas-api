import { NextResponse } from "next/server";
import { getTokenCode, getUserData } from "@/app/lib/spotify";
import { spotifySaveToDatabase } from "@/app/lib/database";

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


  const saved = await spotifySaveToDatabase(data);
  if (!saved) return NextResponse.json({ error: "Failed to save to database, try again later." }, { status: 500 });

  return Response.redirect(`${origin}/spotify?id=${user.id}&display_name=${user.display_name}`);

}
