import { NextResponse } from "next/server";
import { color } from "/app/lib/colorLog";
import decrypt from "/app/lib/encode_key";

const env = process.env.ENVIRONMENT;

const apiToken = env == "dev" ?
  decrypt(process.env.STEAM_KEY) :
  process.env.STEAM_KEY;

/**
 * Check valid regions from Steam
**/
const validRegions = [
  "ar", "at", "au", "be", "br", "cl", "cn", "ca", "co", "cr",
  "cy", "ee", "es", "fi", "fr", "de", "gr", "hk", "id", "ie",
  "il", "in", "it", "jp", "kz", "kw", "lt", "lu", "lv", "my",
  "mt", "mx", "nl", "no", "nz", "pe", "ph", "pl", "pt", "qa",
  "ru", "sg", "sk", "si", "za", "kr", "tw", "th", "tr", "ua",
  "uk", "ae", "us", "uy", "vn"
]

const nullValues = {
  name: "",
  price: "",
  header_image: "",
  timePlayed: ""
}


const getGameId = (apiKey, id) => `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=${id}&key=${apiKey}`;
const getGameDetails = (apiKey, appId, region) => `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${region}&l=${region}&key=${apiKey}`;
const getPlayTime = (apiKey, steamId, appId) => `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}&key=${apiKey}`

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  // Get the parameters from URL
  const { id = "", region = "" } = obj;

  try {
    const validParams = checkParams(id, region);

    const gameIdRequest = await fetch(getGameId(apiToken, id));
    // color.log("blue", JSON.stringify(gameIdRequest));
    const gameId = await gameIdRequest.json();

    // console.log("game id: ", gameId);
    const appId = gameId.response.players[0]?.gameid || "";

    // color.log("green", `Game ID: ${JSON.stringify(appId)}`);
    if (!appId) return NextResponse.json(nullValues, { status: 404 });;

    const gameDetailsRequest = await fetch(getGameDetails(apiToken, appId, region));
    const gameDetails = await gameDetailsRequest.json();

    const playTimeRequest = await fetch(getPlayTime(apiToken, id, appId));
    const playTime = await playTimeRequest.json();

    const name = gameDetails[appId].data.name || "";
    const price = gameDetails[appId].data.price_overview.final_formatted || 0;
    const header_image = gameDetails[appId].data.header_image;
    const timePlayed = parseInt(playTime.response.games[0].playtime_forever / 60);
    const game = { name, price, header_image, timePlayed };
    return NextResponse.json(game, { status: 200 });

  } catch (error) {
    console.log("Error reported:", error);
    return NextResponse.json({ error: error.error }, { status: error.error.status });
  }
}

/**
 * Checks if the provided parameters are valid and throws an error if they are not.
 *
 * @param {string} id - The ID to be checked.
 * @param {string} region - The region to be compared with the validRegions 
 * @throws {Error} Throws an error if the ID is missing or the region is invalid or missing.
 * @return {Object} Returns an object with a status: true and error: null if the parameters are valid.
 */

function checkParams(id, region) {
  if (!id) throw ({ error: { message: "Missing id", id: "Find your steam ID in https://imgur.com/a/EBYhudl", region: region, status: 400, } });
  if (!validRegions.includes(region)) throw ({ error: { message: "Invalid or missing region", id: id, region: region, regions_available: validRegions, status: 400, } });

  return { status: true, error: null };
}
