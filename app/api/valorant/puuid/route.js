import { NextResponse } from 'next/server';

import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

const urlByPlayer = (player, tag) => `https://api.henrikdev.xyz/valorant/v1/account/${player}/${tag}?force=true`;

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  try {
    // Get the parameters from URL
    const { player = "", tag = "", type = "json" } = obj;

    const validParams = checkParams(player, tag);

    const getData = await fetch(urlByPlayer(player, tag), {
      headers: {
        "Authorization": apiToken
      }
    });
    if (!getData.ok) throw ({ error: { message: getData.statusText, player: player, tag: tag, code: getData.status } });

    const response = await getData.json();

    if (type === "json") return NextResponse.json(response, { status: 200 });

    return new Response((response.data.puuid), { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.error }, { status: 200 });
  }
}

function checkParams(player, tag) {
  if (!player || !tag) throw ({ error: { message: "Missing player / tag", player: player, tag: tag, status: 200 } });
  return { status: true, error: null };
}

