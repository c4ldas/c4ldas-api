import { NextResponse } from "next/server";
import { color } from "@/app/lib/colorLog";

const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${region}/${id}`;
const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}`;

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  // Get the parameters from URL
  const { player, tag, region, id, type = "text" } = obj;
  const game = "valorant";

  if (id) return NextResponse.json(await getRank(urlById(region, id)));
  if (player && tag) return NextResponse.json(await getRank(urlByPlayer(region, player, tag)));

  async function getRank(url) {
    const rankRequest = await fetch(url, {
      method: "GET",
      next: { revalidate: 600 }, // 10 minutes
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VALORANT_TOKEN
      }
    });
    const data = await rankRequest.json();
    color.log("green", "Date requested:", rankRequest.headers.get("date"));
    color.log("yellow", "Date now:", new Date());
    color.log("red", "Rate Limit Remaining:", rankRequest.headers.get("x-ratelimit-remaining"));
    return data;
  }
};




/* 
// console.log(request)
const origin = request.nextUrl.origin;
const pathname = request.nextUrl.pathname;
return NextResponse.json(
  {
    Usage: `${origin}${pathname}/rank?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE`,
    Region: `Regions available in ${origin}/tft`,
    type: ["json", "text"],
  }
); 
*/


/* 
export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { region, player, tag } = obj;
  const type = obj.type || "text";
  const game = "lol";
  const queueType = "RANKED_SOLO_5x5";
*/