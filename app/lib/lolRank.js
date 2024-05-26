const apiURL = "api.riotgames.com";

const gameInfo = {
  lol: {
    name: "League of Legends",
    puuidUrl: "lol/summoner/v4/summoners/by-puuid",
    rankUrl: "lol/league/v4/entries/by-summoner",
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
    regions: ["br1", "la1", "la2", "na1", "br"]
  },
  {
    name: "asia",
    regions: ["jp1", "kr", "oc1"]
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

    if (!player || !tag) throw ({ error: { message: "Missing player / tag", player: player, tag: tag, region: region, code: 400 } });
    if (!server) throw ({ error: { message: "Incorrect or missing region", player: player, tag: tag, region: region, code: 400 } });

    const puuidRequest = await fetch(`https://${server.name}.${apiURL}/riot/account/v1/accounts/by-riot-id/${player}/${tag}`, {
      method: "GET",
      cache: "force-cache",
      // next: { revalidate: 0 },
      headers: {
        "X-Riot-Token": `${process.env[gameInfo[game].tokenName]}`
      }
    });

    if (!puuidRequest.ok) {
      throw ({ error: { message: puuidRequest.statusText, player: player, tag: tag, code: puuidRequest.status } });
    }

    const puuidResponse = await puuidRequest.json();
    return (puuidResponse);

  } catch (error) {
    throw error;
  }
}

export async function getSummonerId(request) {
  try {
    const { puuid, region, game } = request;
    const summonerRequest = await fetch(`https://${region}.${apiURL}/${gameInfo[game].puuidUrl}/${puuid}`, {
      method: "GET",
      cache: "force-cache",
      headers: {
        "X-Riot-Token": `${process.env[gameInfo[game].tokenName]}`
      }
    });

    if (!summonerRequest.ok) {
      throw ({ error: { message: summonerRequest.statusText, player: player, tag: tag, code: summonerRequest.status } });
    }

    const summonerResponse = await summonerRequest.json();
    return (summonerResponse);

  } catch (error) {
    throw (error);
  }
}

export async function getRank(request) {
  try {
    const { id, gameName, region, game } = request;
    const rankRequest = await fetch(`https://${region}.${apiURL}/${gameInfo[game].rankUrl}/${id}`, {
      method: "GET",
      // cache: "force-cache",
      next: { revalidate: 900 }, // 15 minutes
      headers: {
        "X-Riot-Token": `${process.env[gameInfo[game].tokenName]}`
      }
    });

    if (!rankRequest.ok) {
      throw ({ error: { message: rankRequest.statusText, player: player, tag: tag, code: rankRequest.status } });
    }

    const rankResponse = await rankRequest.json();
    return (rankResponse);

  } catch (error) {
    throw (error);
  }
}

