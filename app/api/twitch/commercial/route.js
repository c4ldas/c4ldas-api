import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}

export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed (yet)" });
}