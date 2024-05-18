import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  console.log(request)
  return NextResponse.json(
    {
      Usage: `${origin}${pathname}/rank?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE`,
      Region: `Regions available in ${origin}/tft`,
      type: ["json", "text"],
    }
  );
};

