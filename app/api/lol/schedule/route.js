const { NextResponse } = require("next/server");

export async function GET(data) {
  return NextResponse.json({
    status: "success",
    message: "Coming soon: today's official LoL matches.",
  });
}