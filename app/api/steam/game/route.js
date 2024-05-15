import { NextResponse } from "next/server";

const obj = {
  "name": "Stardew Valley",
  "price": "R$ 24,99",
  "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg?t=1711128146",
  "timePlayed": 244
}

export async function GET(request) {

  return NextResponse.json(obj);
}



