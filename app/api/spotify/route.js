import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/spotify/musica/<id>?type=TYPE`,
      description: "Shows which song is currently playing for the user",
      usage: `${origin}${pathname}/musica/<id>/?type=TYPE`,
      params: {
        id: {
          description: `ID of the user after registering on API. Can be retrieved on ${origin}/spotify/login`,
          required: true,
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "text",
          available_variables: ["json", "text"],
        },
      },
    },
  ]);
}

