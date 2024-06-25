import { NextResponse } from "next/server";
import { getTokenCode, getUserData } from "@/app/lib/spotify";
import { sql } from "@vercel/postgres";


export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;

  if (!code) return NextResponse.json({ error: "Code not found" }, { status: 400 });

  const token = await getTokenCode(code);
  const user = await getUserData(token.access_token);

  const data = {
    id: user.id,
    display_name: user.display_name,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  // Pending 
  // const saved = await saveToDatabase(data);
  // if (!saved) return NextResponse.json({ error: "Failed to save to database, try again later." }, { status: 500 });

  return NextResponse.json({ id: user.id, display_name: user.display_name }, { status: 200 });
}

// Pending function
/* 
async function saveToDatabase(data) {

  const { id, display_name, access_token, refresh_token } = data;

  const selectQuery = {
    text: 'SELECT refresh_token FROM spotify WHERE id = $1',
    values: [id],
  }
  const insertQuery = {
    text: 'INSERT INTO spotify (id, display_name, access_token, refresh_token) VALUES ($1, $2, $3, $4)',
    values: [id, display_name, access_token, refresh_token],
  }

  const updateQuery = {
    text: 'UPDATE spotify SET display_name = $2, access_token = $3, refresh_token = $4 WHERE id = $1',
    values: [id, display_name, access_token, refresh_token],
  }

  const client = await sql.connect();
  const { rows } = await client.query(selectQuery);
  client.release();

  console.log("Rows: ", rows);

  if (!rows[0]) {
    console.log("User not found! Inserting...");
    const insert = await client.query(insertQuery);
    console.log("Insert Query: ", insert.rows);
    client.release();

    if (insert.rows[0]) {
      console.log("Inserted into database successfully!");
      return true;
    } else {
      console.log("Failed to insert into database!");
      return false;
    }
  }

  return true;
}
 */



