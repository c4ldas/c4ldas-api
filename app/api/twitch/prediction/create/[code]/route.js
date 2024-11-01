import { NextResponse } from "next/server";
import { twitchGetTokenDatabase, twitchSaveToDatabase } from "@/app/lib/database";
import { createPrediction, getOpenPrediction, getNewToken } from "@/app/lib/twitch";

export async function GET(request, { params }) {
  try {
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const { channel, question, time = 300 } = obj;

    // Get each option from the object
    const options = Object.keys(obj)
      .filter((key) => key.startsWith("option"))
      .map(key => obj[key]);

    // Check if all required fields are present (channel, question, options)
    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 200 });
    if (!question) return NextResponse.json({ status: "failed", error: "Question missing" }, { status: 200 });
    if (!options || options.length < 2 || options.length > 10) return NextResponse.json({ status: "failed", error: "Invalid number of options. Min: 2, Max: 10" }, { status: 200 });


    const token = await twitchGetTokenDatabase(code, channel);
    if (!token) return NextResponse.json({ status: "failed", error: "Code and channel do not match" }, { status: 200 });

    // Get a new token to avoid token expiration
    const newToken = await getNewToken(token.refresh_token);

    // Data to save to database
    const data = {
      id: token.id,
      username: channel,
      access_token: newToken.access_token,
      refresh_token: newToken.refresh_token,
      code: code
    }

    // Save to database
    const saveToDatabase = await twitchSaveToDatabase(data);
    if (!saveToDatabase) return NextResponse.json({ status: "failed", error: "Error while saving to database" }, { status: 200 });

    // Check if prediction already exists
    const openPrediction = await getOpenPrediction(newToken.access_token, token.id);
    if (openPrediction) return NextResponse.json({ status: "failed", message: "Prediction already created" }, { status: 200 });

    const result = await createPrediction(newToken.access_token, token.id, question, options, time);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
