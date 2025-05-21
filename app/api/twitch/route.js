import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/twitch/prediction/get`,
      description: "Get open Twitch prediction.",
      usage: `${origin}${pathname}/prediction/get/<code>/?channel=CHANNELNAME`,
      params: {
        code: {
          description: "Code received by application",
          required: true,
        },
        channel: {
          description: "Twitch channel name",
          required: true,
        },
      },
    },
    {
      endpoint: `/api/twitch/prediction/create`,
      description: "Create a new Twitch prediction.",
      usage: `${origin}${pathname}/prediction/create/<code>/?channel=CHANNELNAME&option1=OPTION1&option2=OPTION2&&question=QUESTION`,
      params: {
        code: {
          description: "Code received by application",
          required: true,
        },
        channel: {
          description: "Twitch channel name",
          required: true,
        },
        option1: {
          description: "First option of prediction.",
          required: true,
        },
        option2: {
          description: "Second option of prediction.",
          required: true,
        },
        question: {
          description: "Question of prediction. Use query escape to include special characters.",
          required: true,
        },
      },
    },
    {
      endpoint: `/api/twitch/prediction/close`,
      description: "Closes a previously created prediction and chooses a winner.",
      usage: `${origin}${pathname}/prediction/close/<code>/?channel=CHANNELNAME&winner=OPTION`,
      params: {
        code: {
          description: "Code received by application",
          required: true,
        },
        channel: {
          description: "Twitch channel name",
          required: true,
        },
        winner: {
          description: "Prediction results. Should be either one of the options created for option1 or option2.",
          required: true,
        }
      },
    },
    {
      endpoint: `/api/twitch/prediction/cancel`,
      description: "Cancel a previously created Twitchprediction",
      usage: `${origin}${pathname}/prediction/cancel/<code>/?channel=CHANNELNAME`,
      params: {
        code: {
          description: "Code received by application",
          required: true,
        },
        channel: {
          description: "Twitch channel name",
          required: true,
        }
      },
    },
    {
      endpoint: `/api/twitch/callback/`,
      description: "Callback for Twitch authentication",
      usage: `${origin}${pathname}/callback/?code=CODE&scope=SCOPE&state=STATE`,
      params: {
        code: {
          description: "Code returned by Twitch",
          required: true,
        },
        scope: {
          description: "List of scopes requested",
          required: true,
        },
        state: {
          description: "State sent and returned by Twitch",
          required: false,
        }
      }
    },
    {
      endpoint: `/api/twitch/clip/`,
      description: "Create a Twitch clip.",
      usage: `${origin}${pathname}/clip/?channel=CHANNELNAME&duration=DURATION&title=TITLE&type=TYPE`,
      params: {
        channel: {
          description: "Twitch channel name to create the clip",
          required: true,
        },
        duration: {
          description: "Duration of the clip in seconds",
          required: false,
          default: 30,
          additional_info: "Custom duration is not available for type 'text' and 'json', which will default to 30 seconds. Minimum: 5 seconds, Maximum: 30 seconds.",
        },
        title: {
          description: "Title of the clip",
          required: false,
          additional_info: "Custom title is not available for type 'text' and 'json', which will default to the current stream title.",
        },
        type: {
          description: "Type of response.",
          required: false,
          default: "text",
          available_variables: ["text", "json", "full", "overlay"],
          additional_info: ""
        }
      }
    },
    {
      endpoint: `/api/twitch/replay/`,
      description: "Generate a direct link to a Twitch clip (download URL).",
      usage: `${origin}${pathname}/replay/?channel=CHANNELNAME&id=CLIPID&type=TYPE`,
      params: {
        channel: {
          description: "Twitch channel name",
          required: true,
        },
        id: {
          description: "Clip ID",
          required: true,
        },
        type: {
          description: "Type of response.",
          required: false,
          default: "text",
          available_variables: ["text", "json"],
          additional_info: "'json' type will return more information about the clip whereas 'text' will return only the clip direct link."
        }
      }
    }
  ]
  );
};
