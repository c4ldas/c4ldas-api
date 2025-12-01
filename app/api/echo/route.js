// This is just an echo test
// The goal is to test if the API is working correctly

import { NextResponse } from "next/server";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);

  const msg = obj.msg || "Hello World!";
  const type = obj.type || "text";

  return sendResponse(msg, type);
}

async function sendResponse(msg, type) {

  console.log(msg);

  if (type == "json") {
    return NextResponse.json({ response: msg }, { status: 200 });
  }

  return new Response(msg, { status: 200 });

}
