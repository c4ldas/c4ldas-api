import { NextResponse } from "next/server";
import { twitchGetTokenDatabase } from "@/app/lib/database";
import { cancelPrediction, getOpenPrediction } from "@/app/lib/twitch";

export async function GET(request, { params }) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const channel = obj.channel;

    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 400 });

    const token = await twitchGetTokenDatabase(code, channel);
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 400 });

    const openPrediction = await getOpenPrediction(token.access_token, token.id);
    if (!openPrediction) return NextResponse.json({ status: "failed", message: "No open prediction" }, { status: 400 });

    const result = await cancelPrediction(token.access_token, token.id, openPrediction.id);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
