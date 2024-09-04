import { NextResponse } from "next/server";
import { twitchGetTokenDatabase } from "@/app/lib/database";
import { createPrediction, getOpenPrediction } from "@/app/lib/twitch";

export async function GET(request, { params }) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const { channel, question, time = 300 } = obj;

    // Get each option from the object
    const options = Object.keys(obj)
      .filter((key) => key.startsWith("option"))
      .map(key => obj[key]);

    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 200 });
    if (!question) return NextResponse.json({ status: "failed", error: "Question missing" }, { status: 200 });
    if (!options || options.length < 2 || options.length > 10) return NextResponse.json({ status: "failed", error: "Invalid number of options. Min: 2, Max: 10" }, { status: 200 });

    const token = await twitchGetTokenDatabase(code, channel);
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });
    const openPrediction = await getOpenPrediction(token.access_token, token.id);

    if (openPrediction) return NextResponse.json({ status: "failed", message: "Prediction already created" }, { status: 200 });
    const result = await createPrediction(token.access_token, token.id, question, options, time);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
