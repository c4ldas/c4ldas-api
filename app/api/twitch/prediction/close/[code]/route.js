import { NextResponse } from "next/server";
import { twitchGetTokenDatabase } from "@/app/lib/database";
import { closePrediction, getOpenPrediction } from "@/app/lib/twitch";

export async function GET(request, { params }) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const { channel, winner } = obj

    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 400 });
    if (!winner) return NextResponse.json({ status: "failed", error: "Winner missing" }, { status: 400 });

    const token = await twitchGetTokenDatabase(code, channel);
    if (!token) {
      console.log("Code and channel do not match");
      return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 400 });
    }

    const openPrediction = await getOpenPrediction(token.access_token, token.id);
    if (!openPrediction) return NextResponse.json({ status: "failed", message: "No open prediction" }, { status: 400 });

    const winnerInfo = openPrediction.outcomes.find(outcome => outcome.title.toLowerCase() === winner.toLowerCase());
    console.log("Winner Id:", winnerInfo);

    if (!winnerInfo) {
      console.log("Invalid winner option:", winner);
      return NextResponse.json({ status: "failed", message: `Invalid winner option: '${winner}'` }, { status: 400 });
    }

    const result = await closePrediction(token.access_token, token.id, openPrediction.id, winnerInfo);
    console.log("Close Prediction Result:", JSON.stringify(result));
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
