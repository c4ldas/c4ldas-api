import { NextResponse } from 'next/server';
import { getVideoData } from '../route';

export async function GET(request, { params }) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { type = "json" } = obj;
  const id = params.id;

  try {
    const data = await getVideoData(id, type);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 400 });
  }
}
