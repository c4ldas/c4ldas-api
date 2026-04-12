import { NextResponse } from 'next/server';

import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

const urlByPlayer = (player, tag) => `https://api.henrikdev.xyz/valorant/v1/account/${player}/${tag}?force=true`;
const urlByPuuid = (puuid) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${puuid}?force=true`;

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  try {
    // Get the parameters from URL
    const { player = "", tag = "", type = "text", puuid = "", msg = "(puuid)" } = obj;

    const validParams = checkParams(player, tag, puuid);

    const url = puuid ? urlByPuuid(puuid) : urlByPlayer(player, tag);

    const getData = await fetch(url, {
      headers: {
        "Authorization": apiToken
      }
    });
    if (!getData.ok) throw ({ error: { message: getData.statusText, player: player, tag: tag, code: getData.status } });

    const response = await getData.json();

    return sendResponse(response, type, msg);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.error }, { status: 200 });
  }
}

function checkParams(player, tag, puuid) {
  if ((!player || !tag) && (!puuid)) throw ({ error: { message: "Missing player / tag or puuid", player: player, tag: tag, puuid: puuid, status: 200 } });
  return { status: true, error: null };
}


async function sendResponse(data, type, msg) {

  const { name, tag, puuid, account_level } = data.data;
  const formattedMessage = msg
    .replace(/\(player\)/g, name)
    .replace(/\(tag\)/g, tag)
    .replace(/\(puuid\)/g, puuid)
    .replace(/\(level\)/g, account_level);

  if (type != "text") {
    data.message = formattedMessage;
    console.log(formattedMessage);
    return NextResponse.json(data, { status: 200 });
  }
  console.log(formattedMessage);
  return new Response(formattedMessage, { status: 200 });
}
