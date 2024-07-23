import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const id = cookies().get('id').value;
    const username = cookies().get('username').value;
    const code = cookies().get('code').value;

    console.log(id, username, code);

    cookies().delete('id');
    cookies().delete('username');
    cookies().delete('code');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

