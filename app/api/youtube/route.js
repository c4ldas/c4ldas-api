import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  // console.log(request)
  return NextResponse.json(
    {
      Usage: `${origin}${pathname}/youtube/<id>?type=TYPE`,
      info: `<id> can be retrieved on ${origin}/spotify/login`,
      type: ["json", "text"],
    }
  );
};