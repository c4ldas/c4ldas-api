import { NextResponse } from 'next/server';

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const { player = "", tag = "", type = "json" } = obj;
  const urlByPlayer = (player, tag) => `https://api.henrikdev.xyz/valorant/v1/account/${player}/${tag}?force=true`;

  try {
    const getData = await fetch(urlByPlayer(player, tag), {
      headers: {
        "Authorization": process.env.VALORANT_TOKEN
      }
    });
    if (!getData.ok) throw ({ error: { message: getData.statusText, player: player, tag: tag, code: getData.status } });

    const response = await getData.json();

    if (type === "json") return NextResponse.json(response, { status: 200 });

    return NextResponse.text((response.data.puuid), { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.error }, { status: error.error.code });
  }
}


