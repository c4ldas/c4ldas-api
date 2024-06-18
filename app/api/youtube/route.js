import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/youtube/channel/?username=USERNAME&type=TYPE`,
      description: "Retrieve information about a YouTube channel.",
      usage: `${origin}${pathname}/channel/?username=USERNAME&type=TYPE`,
      params: {
        username: {
          description: "YouTube handle, also known as @username",
          required: true,
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
      endpoint: `/api/youtube/search/<id>/?type=TYPE`,
      description: "Retrieve information about a video from YouTube.",
      usgae: `${origin}${pathname}/search/<id>/?type=TYPE`,
      params: {
        id: {
          description: "Video ID",
          required: true,
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
      endpoint: `/api/youtube/search?id=ID&type=TYPE`,
      description: "Retrieve information about a video from YouTube.",
      usage: `${origin}${pathname}/search/?id=ID&type=TYPE`,
      params: {
        id: {
          description: "Video ID",
          required: true,
        },
        type: {
          description: "Format of the response",
          required: false,
          default: "json",
          available_variables: ["json", "text"],
        },
      }
    }
  ]);
};
