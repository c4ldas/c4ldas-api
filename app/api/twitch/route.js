import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  // console.log(request)
  return NextResponse.json(
    {
      Usage: `${origin}${pathname}/twitch/<id>?type=TYPE`,
      info: `<id> can be retrieved on ${origin}/twitch/login`,
      type: ["json", "text"],
    }
  );
};