import { getTokenCode, getUserData } from "@/app/lib/spotify";
import { spotifySaveToDatabase } from "@/app/lib/database";
import { cookies } from "next/headers";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;
  const origin = request.nextUrl.origin;

  if (!code) return Response.redirect(`${origin}/spotify?error=Code not found`);

  const token = await getTokenCode(code);
  const user = await getUserData(token.access_token);



  const data = {
    id: user.id,
    display_name: user.display_name,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };


  const saved = await spotifySaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}/spotify?error=Error while saving to database`);
  // if (!saved) return NextResponse.json({ error: "Failed to save to database, try again later." }, { status: 500 });
  cookies().set('spotify_id', data.id);
  cookies().set('spotify_display_name', data.display_name);


  return Response.redirect(`${origin}/spotify`);

}
