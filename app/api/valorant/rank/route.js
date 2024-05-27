import { NextResponse } from "next/server";
import { color } from "@/app/lib/colorLog";

const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${region}/${id}`;
const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}`;
const urlLeaderboardId = (region, id) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?puuid=${id}`;
const urlLeaderboardPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?name=${player}&tag=${tag}`;

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
  try {

    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);

    // Get the parameters from URL
    const { player, tag, id, channel, region = "br", msg = "(player) está (rank) com (pontos) pontos.", type = "text" } = obj;
    const game = "valorant";

    const validParams = await checkParams(player, tag, id, channel, region);
    if (!validParams.status) return NextResponse.json({ error: validParams.error }, { status: 400 });

    // Check if id or player and tag are provided
    if (id) {
      const data = await getRank(urlById(region, id, type));
      // If not Immmortal and not Radiant, set leaderboardRank and numberOfWins to 0
      if (!data.data.currenttierpatched.startsWith("Immortal") && data.data.currenttierpatched !== "Radiant") {
        data.data.leaderboardRank = 0;
        data.data.numberOfWins = 0;
        const response = await sendResponse(data, type, msg);
        return NextResponse.json(response, { status: 200 });
      }

      // Get leaderboard
      const leaderboard = await getRank(urlLeaderboardId(region, id));
      console.log("Leaderboard", leaderboard);
      data.data.leaderboardRank = leaderboard.data[0].leaderboardRank;
      data.data.numberOfWins = leaderboard.data[0].numberOfWins;

      // Send response
      const response = await sendResponse(data, type, msg);
      return NextResponse.json(response, { status: 200 })
    }

    if (player && tag) {
      const data = await getRank(urlByPlayer(region, player, tag, type));
      const response = await sendResponse(data, type, msg);
      console.log(response);
      return NextResponse.json(response, { status: 200 })
    }

    return NextResponse.json({ error: "Id or player / tag are required" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.error }, { status: 400 })
  }
}

async function checkParams(player, tag, id, channel, region) {
  if ((!player || !tag) && !id) return { status: false, error: "Missing player / tag or id" };
  if (!channel) return { status: false, error: "Missing channel" };
  if (!validRegions.includes(region)) return { status: false, error: `Invalid region. Valid regions: ${validRegions.join(", ")}` };
  return { status: true, error: null };
}


async function getRank(url) {
  try {
    const rankRequest = await fetch(url, {
      method: "GET",
      next: { revalidate: 600 }, // 10 minutes
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VALORANT_TOKEN
      }
    });
    const data = await rankRequest.json();
    if (data.status !== 200) throw ({ error: { message: data.errors[0].message, code: data.errors[0].code } });
    return data;

  } catch (error) {
    throw (error);
  }
}

async function sendResponse(data, type, msg) {

  const { name: player, ranking_in_tier: pontos, currenttierpatched: elo, numberOfWins: vitorias, leaderboardRank: posicao } = data.data;
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


// Check if the channel is missing
// if (!channel || channel == "${channel}") {
//   const noChannel = `Parameter &channel=$(channel) required. Add it to the end of URL`;
//   const example = `${origin}${pathname}?player=PLAYERNAME&tag=TAG&region=REGION&channel=$(channel)`
//   return NextResponse.json({ error: noChannel, example: example, status: 400 }, { status: 400 });
// }

// Check if the region is invalid
// if (!validRegions.includes(region)) {
//   return NextResponse.json({ error: `Invalid region. Valid regions: ${validRegions.join(", ")}` }, { status: 400 });
// }