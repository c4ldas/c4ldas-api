import { NextResponse } from 'next/server';
import { testConnectionDatabase } from '@/app/lib/database';

export async function GET(request) {

  const test = await testConnectionDatabase();
  // console.log(test)

  return NextResponse.json(test, { status: 200 });
}