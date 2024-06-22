import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;

  return NextResponse.json([
    {
      endpoint: `/api/twitch/prediction/create`,
      description: "Control Twitch predictions.",
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
      description: "Cancel a previously created prediction",
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
      description: "Callback URL for Twitch.",
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
    }
  ]
  );
};
