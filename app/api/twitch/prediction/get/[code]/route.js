import { NextResponse } from "next/server";
import { twitchGetTokenDatabase } from "@/app/lib/database";
import { getOpenPrediction } from "@/app/lib/twitch";

export async function GET(request, { params }) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const channel = obj.channel;

    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 400 });

    const token = await twitchGetTokenDatabase(code, channel);
    const result = await getOpenPrediction(token.access_token, token.id);
    if (!result) return NextResponse.json({ status: "failed", message: "No open prediction" }, { status: 400 });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
