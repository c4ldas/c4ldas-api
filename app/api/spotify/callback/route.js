import { NextResponse } from "next/server";
import { getTokenCode, getUserData } from "@/app/lib/spotify";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;

  if (!code) return NextResponse.json({ error: "Code not found" }, { status: 400 });

  const token = await getTokenCode(code);
  const user = await getUserData(token.access_token);

  const data = {
    id: user.id,
    display_name: user.display_name,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  // Pending 
  // const saved = await saveToDatabase(data);
  // if (!saved) return NextResponse.json({ error: "Failed to save to database, try again later." }, { status: 500 });

  return NextResponse.json({ id: user.id, display_name: user.display_name }, { status: 200 });
}
