import { NextResponse } from "next/server";
import { color } from "@/app/lib/colorLog";

const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${region}/${id}`;
const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}`;

const badges = {
  "Unrated": "Sem rank/elo",
  "Iron 1": "Ferro 1",
  "Iron 2": "Ferro 2",
  "Iron 3": "Ferro 3",
  "Bronze 1": "Bronze 1",
  "Bronze 2": "Bronze 2",
  "Bronze 3": "Bronze 3",
  "Silver 1": "Prata 1",
  "Silver 2": "Prata 2",
  "Silver 3": "Prata 3",
  "Gold 1": "Ouro 1",
  "Gold 2": "Ouro 2",
  "Gold 3": "Ouro 3",
  "Platinum 1": "Platina 1",
  "Platinum 2": "Platina 2",
  "Platinum 3": "Platina 3",
  "Diamond 1": "Diamante 1",
  "Diamond 2": "Diamante 2",
  "Diamond 3": "Diamante 3",
  "Ascendant 1": "Ascendente 1",
  "Ascendant 2": "Ascendente 2",
  "Ascendant 3": "Ascendente 3",
  "Immortal 1": "Imortal 1",
  "Immortal 2": "Imortal 2",
  "Immortal 3": "Imortal 3",
  "Radiant": "Radiante",
};

const validRegions = ["ap", "br", "eu", "kr", "latam", "na"];

export async function GET(request) {
  console.log("Hello world");
  try {

    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);

    // Get the parameters from URL
    const { player, tag, id, region = "br", msg = "(player) está (rank) com (pontos) pontos.", type = "text", } = obj;
    const game = "valorant";

    // Check if the region is valid
    if (!validRegions.includes(region)) {
      return NextResponse.json({ error: `Invalid region. Valid regions: ${validRegions.join(", ")}` });
    }

    // Check if id or player and tag are provided
    if (id) {
      const data = await getRank(urlById(region, id, type));
      const response = await sendResponse(data, type, msg);
      console.log(response)
      return NextResponse.json(response)
    }

    if (player && tag) {
      const data = await getRank(urlByPlayer(region, player, tag, type));
      const response = await sendResponse(data, type, msg);
      console.log(response)
      return NextResponse.json(response)
    }

    return NextResponse.json({ error: "Id or player and tag are required" })
  } catch (error) {
    return NextResponse.json({ error: error.error })
  }
}


async function getRank(url) {
  try {
    const rankRequest = await fetch(url, {
      method: "GET",
      next: { revalidate: 0 }, // 10 minutes
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VALORANT_TOKEN
      }
    });

    const data = await rankRequest.json();
    console.log(data);
    if (data.status !== 200) throw ({ error: { message: data.errors[0].message, code: data.errors[0].code } });
    return data;

  } catch (error) {
    throw (error);
  }
}


async function sendResponse(data, type, msg) {

  // color.log("blue", "Data in Send Response:", JSON.stringify(data));
  const { name: player, ranking_in_tier: pontos, currenttierpatched: elo, vitorias, posicao } = data.data;

  const formattedMessage = msg
    .replace(/\(player\)/g, player)
    .replace(/\(pontos\)/g, pontos)
    .replace(/\(rank\)/g, badges[elo])
    .replace(/\(vitorias\)/g, vitorias)
    .replace(/\(posicao\)/g, posicao);

  color.log("green", formattedMessage);

  if (type === "json") return data;
  if (type === "text") return formattedMessage;
}


/* 
{
  "data": {
    "currenttier": 19,
    "currenttierpatched": "Diamond 2",
    "elo": 1615,
    "images": {
      "large": "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png",
      "small": "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/smallicon.png",
      "triangle_down": "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/ranktriangledownicon.png",
      "triangle_up": "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/ranktriangleupicon.png"
    },
    "mmr_change_to_last_game": 16,
    "name": "Aprendendo",
    "old": false,
    "ranking_in_tier": 15,
    "tag": "BR10"
  },
  "status": 200
}
*/
