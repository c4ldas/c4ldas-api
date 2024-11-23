import { NextResponse } from 'next/server';
import { tiers, validRegions } from '@/app/lib/valorant_rank';
import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/stored-matches/${region}/${player}/${tag}?mode=competitive&size=1`
const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/stored-matches/${region}/${id}?mode=competitive&size=1`

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  try {
    const { region, player, tag, id } = obj;
    const validParams = checkParams(region, player, tag, id);

    const url = id ? urlById(region, id) : urlByPlayer(region, player, tag);

    const lastMatchRequest = await fetch(url, {
      // cache: "force-cache",
      next: { revalidate: 0 },
      headers: {
        "Authorization": apiToken
      }
    });

    if (!lastMatchRequest.ok) throw ({ error: { message: lastMatchRequest.statusText, id: id, player: player, tag: tag, code: lastMatchRequest.status } });

    const lastMatch = await lastMatchRequest.json();
    const data = lastMatch.data[0];
    const { team, tier, kills, deaths, assists, character, puuid } = data.stats;
    const map = data.meta.map.name;
    const started_at = data.meta.started_at;
    const agent = character.name;
    const agent_id = character.id;
    const agent_portrait = `https://media.valorant-api.com/agents/${agent_id}/fullportrait.png`;
    const tier_name = tiers[tier].tier_name;
    const tier_name_pt = tiers[tier].tier_name_pt;
    const enemy_team = team == "Blue" ? "Red" : "Blue";
    const rounds_won = data.teams[team.toLowerCase()];
    const rounds_lost = data.teams[enemy_team.toLowerCase()];
    const outcome = rounds_won > rounds_lost ? "Victory" : (rounds_won == rounds_lost) ? "Draw" : "Defeat";
    const outcome_pt = rounds_won > rounds_lost ? "Vitória" : (rounds_won == rounds_lost) ? "Empate" : "Derrota";
    const has_won = (outcome == "Victory");
    const display_name = lastMatch.name;
    const display_tag = lastMatch.tag;

    const playerInfo = {
      puuid, display_name, display_tag, tier, tier_name, tier_name_pt, team,
      started_at, enemy_team, kills, deaths, assists, agent, agent_id, agent_portrait,
      rounds_won, rounds_lost, outcome, outcome_pt, has_won, map
    };

    const message = `Map: ${map} / Outcome: ${outcome} / Score: ${rounds_won}x${rounds_lost} / KDA: ${kills}/${deaths}/${assists}`;

    if (obj.type == "text") {
      return new Response(message, { status: 200 });
    }
    playerInfo.message = message;
    return NextResponse.json(playerInfo, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.error }, { status: 500 });
  }
}

function checkParams(region, player, tag, id) {
  const validRegionCodes = validRegions.map((item) => item.code);
  if ((!player || !tag) && !id) throw ({ error: { message: "Missing player / tag or id", player: player, tag: tag, id: id, region: region, status: 400, } });
  if (!validRegionCodes.includes(region)) throw ({ error: { message: "Invalid or missing region", player: player, tag: tag, region: region, regions_available: validRegionCodes.join(", "), status: 400, } });

  return { status: true, error: null };
}

