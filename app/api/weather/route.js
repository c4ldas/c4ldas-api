/**
 * It uses the OpenWeather API to get the current temperature in a city.
 * API key can be generated on https://home.openweathermap.org/api_keys
 * 
 * Route description:
 * 1. GET /api/weather
 * 2. Get the city name from the query string
 * 3. Get the temperature from the OpenWeather API
 * 5. Return the temperature in the city with a custom message, city name, type, and channel
 * 
 * Issues: 
 * - With cities with the same name, it can return the wrong city, in this case, use the zip code and country
 */

import { NextResponse } from 'next/server';

const apiToken = process.env.OPENWEATHER_API_KEY;

export async function GET(data) {

  const obj = Object.fromEntries(data.nextUrl.searchParams);
  const { channel, city, zipcode, country, unit = "metric", msg = "A temperatura atual em (city) é (temp).", type = "text" } = obj;
  const searchParams = new URLSearchParams({ appid: apiToken, lang: "pt-br", units: unit });

  if (!city && (!zipcode || !country)) {
    return NextResponse.json({ error: "Missing city or zip code/country" }, { status: 200 });
  }
  if (!channel || channel == "channel" || channel == "YOUR_CHANNEL_NAME") {
    return NextResponse.json({ error: "Missing channel, please add `&channel=YOUR_CHANNEL_NAME` at the end of the URL." }, { status: 200 });
  }

  try {

    if (zipcode && country) searchParams.append("zip", `${zipcode},${country}`);
    if (city) searchParams.append("q", city);

    console.log(`https://api.openweathermap.org/data/2.5/weather?${searchParams.toString()}`);

    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?${searchParams.toString()}`, {
      method: 'GET',
      next: { revalidate: 60 * 30 } // 30 minutes
    });

    const response = await request.json();
    console.log("Response:", response);

    const temp = Math.floor(response.main.temp);
    const cityName = response.name

    return sendResponse({ channel, msg, type, cityName, temp });
    // return NextResponse.json({ message: `A temperatura atual em ${response.name} é ${temp}.` }, { status: 200 });

  } catch (error) {
    console.log("Weather GET:", error.message);
    return NextResponse.json({ error: `City not found: ${city}` }, { status: 400 });
  }
}

function sendResponse(data) {

  const { channel, msg, type, cityName, temp } = data;
  const formattedMessage = msg
    .replace(/\(city\)/g, cityName)
    .replace(/\(temp\)/g, `${temp}°C`);

  if (type == "text") {
    console.log(formattedMessage);
    return new Response(formattedMessage, { status: 200 });

  } else {
    console.log({ channel, formattedMessage, type, cityName, temp });
    return NextResponse.json({ channel, msg: formattedMessage, type, cityName, temp }, { status: 200 });
  }
}