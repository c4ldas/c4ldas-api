import { NextResponse } from 'next/server';
// import { getRank, urlById as rankById, urlByPlayer as rankByPlayer } from '../rank/route';
import { tiers, urlById as rankById, urlByPlayer as rankByPlayer, getRank, validRegions } from '@/app/lib/valorant_rank';
import decrypt from "@/app/lib/encode_key";
const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.VALORANT_TOKEN) :
  process.env.VALORANT_TOKEN;

const urlByPlayer = (region, player, tag) => `https://api.henrikdev.xyz/valorant/v1/lifetime/matches/${region}/${player}/${tag}?filter=competitive&size=1`
const urlById = (region, id) => `https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/${region}/${id}?filter=competitive&size=1`

// const validRegions = ["ap", "br", "eu", "kr", "latam", "na"];

export async function GET(request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(request.nextUrl.searchParams);
    const { region, player, tag, id } = obj;

    const validParams = checkParams(region, player, tag, id);

    const url = id ? urlById(region, id) : urlByPlayer(region, player, tag);
    // const rank = id ? await getRank(rankById(region, id), apiToken) : await getRank(rankByPlayer(region, player, tag), apiToken);

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
    console.log(data)
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

    if (obj.type == "text") {
      // const results = `Map: ${playerInfo.map} / Outcome: ${playerInfo.outcome} / Score: ${playerInfo.rounds_won}x${playerInfo.rounds_lost} / KDA: ${playerInfo.stats.kills}/${playerInfo.stats.deaths}/${playerInfo.stats.assists} / Game Time: ${playerInfo.game_duration_minutes}min`;
      const results = `Map: ${map} / Outcome: ${outcome} / Score: ${rounds_won}x${rounds_lost} / KDA: ${kills}/${deaths}/${assists}`;
      return new Response(results, { status: 200 });
    }
    return NextResponse.json(playerInfo, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.error }, { status: 500 /* error.error.status */ });
  }
}

function checkParams(region, player, tag, id) {
  if ((!player || !tag) && !id) throw ({ error: { message: "Missing player / tag or id", player: player, tag: tag, id: id, region: region, status: 400, } });
  if (!validRegions.includes(region)) throw ({ error: { message: "Invalid or missing region", player: player, tag: tag, region: region, regions_available: validRegions, status: 400, } });

  return { status: true, error: null };
}
