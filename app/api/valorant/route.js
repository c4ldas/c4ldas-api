import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/valorant/rank`,
      usage: `${origin}${pathname}/rank/?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE`,
      additional_info: "",
      region: ["eu", "na", "latam", "br", "ap", "kr"],
      type: ["json", "text"],
    },
    {
      endpoint: `/api/valorant/lastgame`,
      usage: `${origin}${pathname}/lastgame/?player=PLAYERNAME&tag=TAG&region=REGION`,
      additional_info: "Add '&data=full' at the end of URL to get full game data",
      region: ["eu", "na", "latam", "br", "ap", "kr"],
    },
    {
      endpoint: `/api/valorant/puuid`,
      usage: `${origin}${pathname}/puuid/?player=PLAYERNAME&tag=TAG&type=TYPE`,
      additional_info: "",
      type: ["json", "text"],
    }
  ]
  );
};
