import { NextResponse } from "next/server";
import { twitchSaveToDatabase, checkUser } from "@/app/lib/database";
import { getTokenCode, getUserData } from "@/app/lib/twitch";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;
  const origin = request.nextUrl.origin;

  if (!code) return Response.redirect(`${origin}/twitch?error=Code not found`);

  const token = await getTokenCode(code);
  console.log('token', token);
  const user = await getUserData(token.access_token);
  console.log('user', user);
  const userExists = await checkUser(user.id); // return user data if user exists, else null
  console.log('userExists', userExists);

  const userCode = userExists ? userExists.code : crypto.randomUUID().replace(/-/g, '');

  const data = {
    id: user.id,
    username: user.login,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    code: userCode
  };

  const saved = await twitchSaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}/twitch?error=Error while saving to database`);

  return Response.redirect(`${origin}/twitch?id=${data.id}&username=${data.username}&code=${data.code}`);

}
