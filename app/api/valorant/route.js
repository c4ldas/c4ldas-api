import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/valorant/rank`,
      description: "Display your real-time rank and elo in Valorant.",
      usage: `${origin}${pathname}/rank/?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE&msg=MSG`,
      params: {
        player: {
          description: "Name of the player",
          required: true,
        },
        tag: {
          description: "Tag of the player, same as #",
          required: true,
        },
        region: {
          description: "Region of the player",
          required: true,
          available_variables: ["eu", "na", "latam", "br", "ap", "kr"],
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "text",
          available_variables: ["json", "text"],
        },
        msg: {
          description: "Message to be displayed as response",
          required: false,
          default: "(player) está (rank) com (points) points",
          available_variables: ["(player)", "(tag)", "(rank)", "(pontos)", "(vitorias)", "(posicao)"],
          additional_info: "(wins) and (posicao) are only available for Immortal and Radiant.",
        },
      },
    },
    {
      endpoint: `/api/valorant/lastgame`,
      description: "Display your last game stats in Valorant.",
      usage: `${origin}${pathname}/lastgame/?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE`,
      params: {
        player: {
          description: "Name of the player",
          required: true,
        },
        tag: {
          description: "Tag of the player, same as #",
          required: true,
        },
        region: {
          description: "Region of the player",
          required: true,
          available_variables: ["eu", "na", "latam", "br", "ap", "kr"],
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "json",
          available_variables: ["json", "text"],
        },
      }
    },
    {
      endpoint: `/api/valorant/puuid`,
      description: "Display your puuid in Valorant.",
      usage: `${origin}${pathname}/puuid/?player=PLAYERNAME&tag=TAG&type=TYPE`,
      params: {
        player: {
          description: "Name of the player",
          required: true,
        },
        tag: {
          description: "Tag of the player, same as #",
          required: true,
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "text",
          available_variables: ["json", "text"],
        },
      }
    },
    {
      endpoint: `/api/valorant/schedule`,
      description: "Display the games of the day based on the tournament searched.",
      usage: `${origin}${pathname}/schedule?channel=$(channel)&league=LEAGUE_NAME&type=TYPE`,
      params: {
        channel: {
          description: "Your channel name, no need to change",
          required: true
        },
        league: {
          description: "Name of the league",
          required: true,
          available_variables: [
            "challengers_br",
            "vct_lock_in",
            "game_changers_series_brazil",
            "last_chance_qualifier_br_and_latam",
            "vct_americas",
            "vct_masters",
            "champions",
            "ascension_americas",
            "last_chance_qualifier_americas",
            "game_changers_championship",
            "vct_emea"
          ]
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "text",
          available_variables: ["json", "text"],
        }
      }
    },
    {
      endpoint: `/api/valorant/schedule/vlr`,
      description: "Display the games of the day from vlr.gg.",
      usage: `${origin}${pathname}schedule/vlr?channel=$(channel)&league=LEAGUE_NAME&type=TYPE`,
      params: {
        channel: {
          description: "Your channel name, no need to change",
          required: true
        },
        league: {
          description: "Name of the league",
          required: true,
          available_variables: ["tixinha_invitational", "vcb", "vct_americas", "vct_emea", "masters_bangkok", "masters_toronto", "valorant_champions_2025"],
          additional_info: "More leagues can be added, just contact me requesting the name of the league and the link of the vlr.gg page."
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "text",
          available_variables: ["json", "text"],
        },
        msg: {
          description: "Message to be displayed as response when no game is found",
          required: false,
          default: "No games for (league) today",
          available_variables: ["(league)"],
        },
      }
    }
  ]
  );
};

