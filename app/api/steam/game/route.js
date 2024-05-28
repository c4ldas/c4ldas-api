import { NextResponse } from "next/server";

const obj = {
  "name": "Stardew Valley",
  "price": "R$ 24,99",
  "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg?t=1711128146",
  "timePlayed": 244
}

const validRegions = [
  "ar", "at", "au", "be", "br", "cl", "cn", "ca", "co", "cr",
  "cy", "ee", "es", "fi", "fr", "de", "gr", "hk", "id", "ie",
  "il", "in", "it", "jp", "kz", "kw", "lt", "lu", "lv", "my",
  "mt", "mx", "nl", "no", "nz", "pe", "ph", "pl", "pt", "qa",
  "ru", "sg", "sk", "si", "za", "kr", "tw", "th", "tr", "ua",
  "uk", "ae", "us", "uy", "vn"
]


const getGameId = (apiKey, id) => `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${id}`;
const getGameDetails = (appId, region) => `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${region}&l=${region}`;
const getPlayTime = (key, steamId, appId) => `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}`

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  // Get the parameters from URL
  const { id = "", region = "" } = obj;

  try {
    if (!id) throw ({ error: { message: "Missing id", id: "Find your steam ID in https://cdn.streamelements.com/uploads/ae698e6d-5ee8-4c65-bcc8-559cf8d75fdd.png", region: region, status: 400, } });
    if (!validRegions.includes(region)) throw ({ error: { message: "Invalid or missing region", id: id, region: region, regions_available: validRegions, status: 400, } });

    const gameIdRequest = await fetch(getGameId(process.env.STEAM_KEY, id))
    const gameId = await gameIdRequest.json();
    const appId = gameId.response.players[0].gameid;

    const gameDetailsRequest = await fetch(getGameDetails(appId, region));
    const gameDetails = await gameDetailsRequest.json();

    const playTimeRequest = await fetch(getPlayTime(process.env.STEAM_KEY, id, appId));
    const playTime = await playTimeRequest.json();

    const gameName = gameDetails[appId].data.name;
    const gamePrice = gameDetails[appId].data.price_overview.final_formatted;
    const gameHeaderImage = gameDetails[appId].data.header_image;
    const timePlayed = parseInt(playTime.response.games[0].playtime_forever / 60);
    const game = { name: gameName, price: gamePrice, header_image: gameHeaderImage, timePlayed: timePlayed };
    return NextResponse.json(game, { status: 200 });

  } catch (error) {

    console.log(error);
    return NextResponse.json({ error: error.error }, { status: 400 });
  }
}






/* 
router.get("/", async (req, res) => {
  const steamId = req.query.id;
  const region = req.query.region;

  const appIdFetch = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`,
  );

  try {
    const appId = appIdFetch.data.response.players[0]
      ? appIdFetch.data.response.players[0].gameid
      : null;

    if (!appId) {
      res.status(200).json({ name: "" });
      return;
    }

    const gameDetails = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${region}&l=${region}`,
    );

    const playTimeFetch = await axios.get(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}`,
    );

    const gameName = gameDetails.data[appId].data.name;
    const gamePrice = gameDetails.data[appId].data.price_overview
      ? gameDetails.data[appId].data.price_overview.final_formatted
      : "0";
    const gameImage = gameDetails.data[appId].data.header_image;
    const playTime = parseInt(
      playTimeFetch.data.response.games[0].playtime_forever / 60,
    );

    console.log({
      name: gameName,
      price: gamePrice,
      header_image: gameImage,
      timePlayed: playTime,
    });
    res.status(200).json({
      name: gameName,
      price: gamePrice,
      header_image: gameImage,
      timePlayed: playTime,
    });
  } catch (error) {
    //if (error.startsWith('TypeError')){
    console.log(red(`${new Date().toLocaleTimeString("en-UK")} - Steam error: ${error}`));
    res.status(400).json({ error: "error" });
    //}
  }
});
*/


/* 
getGameId
https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${id}
{
  "response": {
    "players": [
      {
        "avatar": "https://avatars.steamstatic.com/6fa33d2d5506be58ced3bdf782a32d16ba3968e0.jpg",
        "avatarfull": "https://avatars.steamstatic.com/6fa33d2d5506be58ced3bdf782a32d16ba3968e0_full.jpg",
        "avatarhash": "6fa33d2d5506be58ced3bdf782a32d16ba3968e0",
        "avatarmedium": "https://avatars.steamstatic.com/6fa33d2d5506be58ced3bdf782a32d16ba3968e0_medium.jpg",
        "communityvisibilitystate": 3,
        "gameextrainfo": "Stardew Valley",
        "gameid": "413150",
        "lastlogoff": 1716334732,
        "loccityid": 8708,
        "loccountrycode": "BR",
        "locstatecode": "05",
        "personaname": "c4ldas",
        "personastate": 1,
        "personastateflags": 0,
        "primaryclanid": "103582791429521408",
        "profilestate": 1,
        "profileurl": "https://steamcommunity.com/id/c4ldas/",
        "realname": "Rodrigo Caldas",
        "steamid": "76561197988140715",
        "timecreated": 1171387255
      }
    ]
  }
}
*/


/* 
getGameDetails
https://store.steampowered.com/api/appdetails?appids=413150&cc=br&l=br&key=0566E35059724C1FFC9392924042AA03

{
  "413150": {
    "data": {
      "about_the_game": "Stardew Valley is an open-ended country-life RPG! <br><br> [...]<strong>Over two hours of original music. </strong></li></ul>",
      "achievements": {
        "highlighted": [
          {
            "name": "Greenhorn",
            "path": "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/413150/dac82a85ceb1493bb2155d41890b4a6099f5eaa5.jpg"
          },
          [...]
          {
            "name": "Cliques",
            "path": "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/413150/dafe0ceff688bebb1c8554cbfa478e9826eb7074.jpg"
          }
        ],
        "total": 49
      },
      "background": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/page_bg_generated_v6b.jpg?t=1711128146",
      "background_raw": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/page_bg_generated.jpg?t=1711128146",
      "capsule_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/capsule_231x87.jpg?t=1711128146",
      "capsule_imagev5": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/capsule_184x69.jpg?t=1711128146",
      "categories": [
        {
          "description": "Single-player",
          "id": 2
        },
        [...]
        {
          "description": "Family Sharing",
          "id": 62
        }
      ],
      "content_descriptors": {
        "ids": [
        ],
        "notes": null
      },
      "controller_support": "full",
      "detailed_description": "Stardew Valley is an open-ended country-life RPG! [...]",
      "developers": [
        "ConcernedApe"
      ],
      "dlc": [
        440820
      ],
      "genres": [
        {
          "description": "Indie",
          "id": "23"
        },
        [...]
        {
          "description": "Simulation",
          "id": "28"
        }
      ],
      "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1711128146",
      "is_free": false,
      "linux_requirements": {
        "minimum": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Ubuntu 12.04 LTS<br></li><li><strong>[...]"
      },
      "mac_requirements": {
        "minimum": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Mac OSX 10.10+<br></li><li><strong>[...]"
      },
      "metacritic": {
        "score": 89,
        "url": "https://www.metacritic.com/game/pc/stardew-valley?ftag=MCD-06-10aaa1f"
      },
      "movies": [
        {
          "highlight": true,
          "id": 256660296,
          "mp4": {
            "480": "http://cdn.akamai.steamstatic.com/steam/apps/256660296/movie480.mp4?t=1454099186",
            "max": "http://cdn.akamai.steamstatic.com/steam/apps/256660296/movie_max.mp4?t=1454099186"
          },
          "name": "Stardew Valley Trailer",
          "thumbnail": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/256660296/movie.293x165.jpg?t=1454099186",
          "webm": {
            "480": "http://cdn.akamai.steamstatic.com/steam/apps/256660296/movie480.webm?t=1454099186",
            "max": "http://cdn.akamai.steamstatic.com/steam/apps/256660296/movie_max.webm?t=1454099186"
          }
        }
      ],
      "name": "Stardew Valley",
      "package_groups": [
        {
          "description": "",
          "display_type": 0,
          "is_recurring_subscription": "false",
          "name": "default",
          "save_text": "",
          "selection_text": "Select a purchase option",
          "subs": [
            {
              "can_get_free_license": "0",
              "is_free_license": false,
              "option_description": "",
              "option_text": "Stardew Valley - R$ 24,99",
              "packageid": 82712,
              "percent_savings": 0,
              "percent_savings_text": " ",
              "price_in_cents_with_discount": 2499
            }
          ],
          "title": "Buy Stardew Valley"
        }
      ],
      "packages": [
        82712
      ],
      "pc_requirements": {
        "minimum": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS *:</strong> Windows Vista or greater<br></li><li><strong>[...]"
      },
      "platforms": {
        "linux": true,
        "mac": true,
        "windows": true
      },
      "price_overview": {
        "currency": "BRL",
        "discount_percent": 0,
        "final": 2499,
        "final_formatted": "R$ 24,99",
        "initial": 2499,
        "initial_formatted": ""
      },
      "publishers": [
        "ConcernedApe"
      ],
      "ratings": {
        "dejus": {
          "descriptors": "Violência fantasiosa\r\nViolência\r\nDrogas lícitas",
          "rating": "12",
          "required_age": "12",
          "use_age_gate": "true"
        },
        [...]
        "usk": {
          "rating": "6"
        }
      },
      "recommendations": {
        "total": 602495
      },
      "release_date": {
        "coming_soon": false,
        "date": "26 Feb, 2016"
      },
      "required_age": "12",
      "reviews": "“Far more than just a farming game, this one-man labor of love is filled with seemingly endless content and heart.”[...]",
      "screenshots": [
        {
          "id": 0,
          "path_full": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_b887651a93b0525739049eb4194f633de2df75be.1920x1080.jpg?t=1711128146",
          "path_thumbnail": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_b887651a93b0525739049eb4194f633de2df75be.600x338.jpg?t=1711128146"
        },
        [...],
        {
          "id": 15,
          "path_full": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_f6f4c727570d753b2b5d8da6af4e0c38fe489059.1920x1080.jpg?t=1711128146",
          "path_thumbnail": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_f6f4c727570d753b2b5d8da6af4e0c38fe489059.600x338.jpg?t=1711128146"
        }
      ],
      "short_description": "You've inherited your grandfather's old farm plot in Stardew Valley. [...]",
      "steam_appid": 413150,
      "support_info": {
        "email": "support@stardewvalley.net",
        "url": ""
      },
      "supported_languages": "English, German, Spanish - Spain, Japanese, Portuguese - Brazil, Russian, Simplified Chinese, French, Italian, Hungarian, Korean, Turkish",
      "type": "game",
      "website": "http://www.stardewvalley.net"
    },
    "success": true
  }
}
*/


/* 
getPlayTime
https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=76561197988140715&include_appinfo=true&appids_filter[0]=413150&key=0566E35059724C1FFC9392924042AA03

{
  "response": {
    "game_count": 1,
    "games": [
      {
        "appid": 413150,
        "has_community_visible_stats": true,
        "img_icon_url": "35d1377200084a4034238c05b0c8930451e2fb40",
        "name": "Stardew Valley",
        "playtime_2weeks": 8,
        "playtime_deck_forever": 0,
        "playtime_disconnected": 0,
        "playtime_forever": 14653,
        "playtime_linux_forever": 0,
        "playtime_mac_forever": 0,
        "playtime_windows_forever": 14312,
        "rtime_last_played": 1716936450
      }
    ]
  }
}
*/