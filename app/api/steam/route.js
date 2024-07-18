import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  // console.log(request)
  return NextResponse.json(
    {
      endpoint: `/api/steam/game/`,
      description: "Get the details of the currently running Steam game.",
      usage: `${origin}${pathname}/game/?id=ID&region=REGION&type=TYPE`,
      params: {
        id: {
          description: "Steam ID",
          required: true
        },
        region: {
          description: "Region of the game",
          required: true,
          available_variables: [
            "ar", "at", "au", "be", "br", "cl", "cn", "ca", "co", "cr",
            "cy", "ee", "es", "fi", "fr", "de", "gr", "hk", "id", "ie",
            "il", "in", "it", "jp", "kz", "kw", "lt", "lu", "lv", "my",
            "mt", "mx", "nl", "no", "nz", "pe", "ph", "pl", "pt", "qa",
            "ru", "sg", "sk", "si", "za", "kr", "tw", "th", "tr", "ua",
            "uk", "ae", "us", "uy", "vn"
          ]
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "json",
          available_variables: ["json", "text"],
        }
      },
    }
  );
};