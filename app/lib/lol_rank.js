import decrypt from "./encode_key";
const env = process.env.ENVIRONMENT;

const apiURL = "api.riotgames.com";

const gameInfo = {
  lol: {
    name: "League of Legends",
    puuidUrl: "lol/summoner/v4/summoners/by-puuid",
    rankUrl: "lol/league/v4/entries/by-summoner",
    activeGameUrl: "lol/spectator/v5/active-games/by-summoner",
    tokenName: "LOL_TOKEN"
  },
  tft: {
    name: "Teamfight Tactics",
    puuidUrl: "tft/summoner/v1/summoners/by-puuid",
    rankUrl: "tft/league/v1/entries/by-summoner",
    tokenName: "TFT_TOKEN"
  }
}

const servers = [
  {
    name: "americas",
    regions: ["br", "br1", "la1", "la2", "na1"]
  },
  {
    name: "asia",
    regions: ["jp1", "kr", "me1", "oc1", "ph2", "sg2", "th2", "tw2", "vn2"]
  },
  {
    name: "europe",
    regions: ["eun1", "euw1", "ru1", "tr1"]
  }
];


export async function getSummonerPuuid(request) {
  try {
    const { player, tag, region, game } = request;
    const server = servers.find(serverObj => serverObj.regions.includes(region));

    const apiToken = env == "dev" ?
      decrypt(process.env[gameInfo[game].tokenName]) :
      process.env[gameInfo[game].tokenName];

    if (!player || !tag) throw ({ error: { message: "Missing player / tag", player: player, tag: tag, region: region, code: 400 } });
    if (!server) throw ({ error: { message: "Incorrect or missing region", player: player, tag: tag, region: region, code: 400 } });

    const puuidRequest = await fetch(`https://${server.name}.${apiURL}/riot/account/v1/accounts/by-riot-id/${player}/${tag}`, {
      method: "GET",
      next: { revalidate: 3600 * 12 }, // 12 hour cache
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (!puuidRequest.ok) {
      throw ({ error: { message: "Failed to get summoner puuid, try again later", player: player, tag: tag, code: puuidRequest.status } });
    }

    const puuidResponse = await puuidRequest.json();
    return (puuidResponse);

  } catch (error) {
    throw error;
  }
}


export async function getSummonerId(request) {
  try {
    const { puuid, region, game, player, tag } = request;

    const apiToken = env == "dev" ?
      decrypt(process.env[gameInfo[game].tokenName]) :
      process.env[gameInfo[game].tokenName];

    const summonerRequest = await fetch(`https://${region}.${apiURL}/${gameInfo[game].puuidUrl}/${puuid}`, {
      method: "GET",
      next: { revalidate: 3600 * 12 }, // 12 hours cache
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (!summonerRequest.ok) {
      throw ({ error: { message: "Failed to get summoner id, try again later", player: player, tag: tag, code: summonerRequest.status } });
    }

    const summonerResponse = await summonerRequest.json();
    return (summonerResponse);

  } catch (error) {
    throw (error);
  }
}


export async function getRank(request) {
  try {
    const { id, gameName, tag, region, game } = request;

    const apiToken = env == "dev" ?
      decrypt(process.env[gameInfo[game].tokenName]) :
      process.env[gameInfo[game].tokenName];

    const rankRequest = await fetch(`https://${region}.${apiURL}/${gameInfo[game].rankUrl}/${id}`, {
      method: "GET",
      // cache: "force-cache",
      next: { revalidate: 900 }, // 15 minutes
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (!rankRequest.ok) {
      throw ({ error: { message: "Failed to get player rank, try again later", player: gameName, tag: tag, code: rankRequest.status } });
    }

    const rankResponse = await rankRequest.json();
    return (rankResponse);

  } catch (error) {
    throw (error);
  }
}


export async function getPreviousGame(request) {
  let data = {};
  try {
    const { puuid, region, game, player, tag } = request;
    const server = servers.find(serverObj => serverObj.regions.includes(region));

    const apiToken = env == "dev" ?
      decrypt(process.env[gameInfo[game].tokenName]) :
      process.env[gameInfo[game].tokenName];


    // Get id of the last game
    const idRequest = await fetch(`https://${server.name}.${apiURL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`, {
      method: "GET",
      next: { revalidate: 0 }, // 0 seconds cache
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (!idRequest.ok) {
      throw ({ message: "Failed to get previous game id, try again later", player: player, tag: tag, code: idRequest.status });
    }

    const idResponse = await idRequest.json();
    const previousGameId = idResponse[0];

    // Get stats of last game
    const gameRequest = await fetch(`https://${server.name}.${apiURL}/lol/match/v5/matches/${previousGameId}`, {
      method: "GET",
      // cache: "force-cache",
      next: { revalidate: 0 }, // 0 seconds cache
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (!gameRequest.ok) {
      throw ({ message: "Failed to get previous game info, try again later", player: player, tag: tag, code: gameRequest.status });
    }

    const gameResponse = await gameRequest.json();

    const userGameInfo = gameResponse.info.participants.find(user => user.puuid == puuid);

    // check remake status
    const remake = userGameInfo.gameEndedInEarlySurrender;

    data.result = remake ? "remake" : userGameInfo.win ? "win" : "lose";
    data.gameId = gameResponse.info.gameId;
    data.replayId = gameResponse.metadata.matchId;
    data.gameStartTime = gameResponse.info.gameStartTimestamp;
    data.gameLength = gameResponse.info.gameEndTimestamp - gameResponse.info.gameStartTimestamp;
    data.gameDuration = formatDuration(data.gameLength);
    data.championName = await getChampionName({ key: userGameInfo.championId }); // userGameInfo.championName;
    data.kda = `${userGameInfo.kills}/${userGameInfo.deaths}/${userGameInfo.assists}`;

    return data;

  } catch (error) {
    console.log(`getPreviousGame error: ${error}`)
    throw (error);
  }
}


export async function getActiveGame(request) {
  let data = {};
  try {
    const { puuid, region, game, player, tag } = request;

    const apiToken = env == "dev" ?
      decrypt(process.env[gameInfo[game].tokenName]) :
      process.env[gameInfo[game].tokenName];

    const apiRequest = await fetch(`https://${region}.${apiURL}/${gameInfo[game].activeGameUrl}/${puuid}`, {
      method: "GET",
      next: { revalidate: 0 }, // 0 seconds cache
      headers: {
        "X-Riot-Token": apiToken
      }
    });

    if (apiRequest.status != 404 && !apiRequest.ok) {
      throw ({ message: "Failed to get active game, try again later", player: player, tag: tag, code: apiRequest.status });
    }

    const response = await apiRequest.json();

    // If not in a game, send inGame as false
    // Otherwise, send inGame as true and game information
    if (response.errorCode == "NOT_FOUND" && response.httpStatus == 404) {
      data.inGame = false;

    } else {
      data.inGame = true;
      data.gameId = response.gameId;
      data.replayId = `${response.platformId}_${response.gameId}`;
      data.gameStartTime = response.gameStartTime;
      const championInfo = response.participants.find(user => user.puuid == puuid);
      data.championName = await getChampionName({ key: championInfo.championId });
    }
    return data;

  } catch (error) {
    throw (error);
  }
}


async function getChampionName(data) {
  try {
    const { key } = data;
    const request = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json", {
      next: { revalidate: 3600 * 12 } // 12 hour cache
    });
    const response = await request.json();

    const champion = response.find(item => item.id == key)?.name || "New Champion";
    return champion;

  } catch (error) {
    console.log("getChampionName():", error.message);
    throw error;
  }
}


// Format game duration in "1h 1m 1s" format
function formatDuration(milliseconds) {
  const totalSeconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) { // Include minutes if there are hours
    result += `${minutes}m `;
  }
  result += `${seconds}s`;

  return result.trim();
}