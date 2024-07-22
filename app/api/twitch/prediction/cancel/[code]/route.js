import { twitchGetTokenDatabase } from "@/app/lib/database";
import { cancelPrediction, getOpenPrediction } from "@/app/lib/twitch";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {

    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const code = params.code;
    const channel = obj.channel;
    if (!channel) return NextResponse.json({ status: "failed", error: "Channel missing" }, { status: 400 });

    const token = await twitchGetTokenDatabase(code, channel);
    const openPrediction = await getOpenPrediction(token.access_token, token.id);

    if (!openPrediction) return NextResponse.json({ status: "failed", message: "No open prediction" }, { status: 400 });

    const result = await cancelPrediction(token.access_token, token.id, openPrediction.id);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}

/* 
router.get('/cancel/:code', async (req, res) => {
  const channel = req.query.channel
  const code = req.params.code
  const result = await cancelPrediction(code, channel)

  console.log(`Twitch Prediction - Channel: ${channel} - ${result}`)
  res.status(200).send(result)
})
*/

