import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  // console.log(request)
  return NextResponse.json(
    {
      endpoint: `/api/lol/rank`,
      description: "Display your real-time rank and elo in League of Legends.",
      usage: `${origin}${pathname}/rank?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE&msg=MSG`,
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
          available_variables: ["eun1", "euw1", "ru1", "tr1", "br1", "la1", "la2", "na1", "jp1", "kr", "oc1"]
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
          default: "(player): (rank) - (points) points",
          available_variables: ["(player)", "(tag)", "(rank)", "(points)", "(wins)", "(losses)"],
        },
      }
    }
  );
};




/*
{
  endpoint: `/api/tft/rank`,
  description: "Display your real-time rank and elo in TFT.",
  usage: `${origin}${pathname}/rank?player=PLAYERNAME&tag=TAG&region=REGION&type=TYPE&msg=MSG`,
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
      available_variables: ["eun1", "euw1", "ru1", "tr1", "br1", "la1", "la2", "na1", "jp1", "kr", "oc1"]
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
      default: "(player): (rank) - (points) points",
      available_variables: ["(player)", "(tag)", "(rank)", "(points)", "(wins)", "(losses)"],
    }
  }
}
*/