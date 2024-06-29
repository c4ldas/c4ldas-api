import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  // console.log(request)
  return NextResponse.redirect(`${origin}/api/twitch/`);
};