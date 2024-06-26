import { Pool } from 'pg';

const pool = new Pool();

async function testConnectionDatabase() {
  const select = {
    text: 'SELECT id, display_name FROM spotify where id = $1',
    values: ["c4ldas"],
  }

  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(select);

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows.map(row => ({ "id": row.id, "display_name": row.display_name })),
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
  }
}


// Pending
async function spotifyGetRefreshTokenDatabase(id) {
  try {

    const refreshTokenQuery = {
      text: 'SELECT refresh_token FROM spotify WHERE id = $1',
      values: [id],
    }

    const client = await sql.connect();
    const { rows } = await client.query(refreshTokenQuery);
    client.release();

    if (!rows[0]) {
      throw { error: "User not registered!" };
    }
    return rows[0].refresh_token;

  } catch (error) {
    console.log("getRefreshToken(): ", error);
    throw (error);
  }
}


// Pending
async function spotifySaveToDatabase(data) {

  const { id, display_name, access_token, refresh_token } = data;

  const insertQuery = {
    text: `
      INSERT INTO spotify (id, display_name, access_token, refresh_token) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO
      UPDATE SET display_name = $2, access_token = $3, refresh_token = $4
    `,
    values: [id, display_name, access_token, refresh_token],
  }

  let client;

  try {
    client = await pool.connect();
    const { rows } = await client.query(insertQuery);
    console.log("Rows: ", rows);

    return true;

  } catch (error) {
    console.log("spotifySaveToDatabase(): ", error);
    return false;

  } finally {
    if (client) client.release();

  }
}

export { testConnectionDatabase, spotifySaveToDatabase, spotifyGetRefreshTokenDatabase }