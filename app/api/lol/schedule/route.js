const { NextResponse } = require("next/server");


const language = "pt-BR";
const baseURL = "https://esports-api.lolesports.com/persisted/gw";
const LOL_ESPORTS_TOKEN = process.env.LOL_ESPORTS_TOKEN;

const leagues = {
  "lck": "98767991310872058",
  "lpl": "98767991314006698",
  "lec": "98767991302996019",
  "lcp": "113476371197627891",
  "msi": "98767991325878492",
  "worlds": "98767975604431411",
  "lta_north": "113470291645289904",
  "lta_south": "113475181634818701",
  "lta_cross": "113475149040947852",
  "first_stand": "113464388705111224",
  "circuito_desafiante": "105549980953490846",
}

export async function GET(data) {
  return NextResponse.json({ status: "success", message: "Coming soon: today's official LoL matches" }, { status: 200 });

  try {

    const obj = Object.fromEntries(data.nextUrl.searchParams);
    const { league, channel } = obj;

    if (!league) return NextResponse.json({ status: "failed", error: "Missing league" }, { status: 400 });

    const tournamentId = await getLatestTournamentId(league);
    return NextResponse.json(tournamentId);



  } catch (error) {

    console.log("Error!", error.message);
    return NextResponse.json({ status: "failed", message: "Failed to list League of Legends matches. Please try again." }, { status: 200 });
  }
}


async function getLatestTournamentId(league) {
  const request = await fetch(`${baseURL}/getTournamentsForLeague?hl=${language}&leagueId=${leagues[league]}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-api-key": LOL_ESPORTS_TOKEN
    }
  });

  const response = await request.json();
  // return response;
  return { tournamentId: response.data.leagues[0].tournaments[0].id, slug: response.data.leagues[0].tournaments[0].slug };
}