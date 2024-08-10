import { Pool } from 'pg';
const pool = new Pool();

async function connectToDatabase() {
  try {
    const client = await pool.connect();
    // console.log("Client connected");
    return client;

  } catch (error) {
    console.log("connectToDatabase():", error);
    throw (error);
  }
}


async function testConnectionDatabase() {
  let client;
  try {

    const select = {
      text: 'SELECT id, display_name FROM spotify where id = $1',
      values: ["c4ldas"],
    }

    client = await connectToDatabase();
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


async function spotifyGetRefreshTokenDatabase(id) {
  let client;

  try {
    const refreshTokenQuery = {
      text: 'SELECT refresh_token FROM spotify WHERE id = $1',
      values: [id],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(refreshTokenQuery);

    if (!rows[0]) {
      throw { error: "User not registered!" };
    }
    return rows[0].refresh_token;

  } catch (error) {
    console.log("spotifyGetRefreshTokenDatabase(): ", error);
    throw (error);

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function spotifySaveToDatabase(data) {
  let client;

  try {
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

    client = await connectToDatabase();
    const { rows } = await client.query(insertQuery);

    return true;

  } catch (error) {
    console.log("spotifySaveToDatabase(): ", error);
    return false;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function spotifyRemoveIntegration(id, username) {
  let client;

  try {
    const removeQuery = {
      text: 'DELETE FROM spotify WHERE id = $1 AND display_name = $2',
      values: [id, username],
    }
    client = await connectToDatabase();
    const { rowCount } = await client.query(removeQuery);
    console.log("removeQuery: ", rowCount);

    if (rowCount === 0) {
      throw { error: "User not registered!" };
    }
    return true;

  } catch (error) {
    console.log("spotifyRemoveIntegration(): ", error);
    throw error.message;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function twitchSaveToDatabase(data) {
  let client;

  try {
    const { id, username, access_token, refresh_token, code } = data;

    const insertQuery = {
      text: `
      INSERT INTO twitch (id, username, access_token, refresh_token, code) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO
      UPDATE SET username = $2, access_token = $3, refresh_token = $4, code = $5
    `,
      values: [id, username, access_token, refresh_token, code],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(insertQuery);
    return true;

  } catch (error) {
    console.log("twitchSaveToDatabase(): ", error);
    return false;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function twitchCheckUser(id) {
  let client;

  try {
    const select = {
      text: 'SELECT id, username, code FROM twitch where id = $1',
      values: [id],
    }
    client = await connectToDatabase();
    const { rows } = await client.query(select);
    return rows[0];

  } catch (error) {
    console.log("checkUser(): ", error);
    return null;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function twitchGetTokenDatabase(code, channel) {
  let client;

  try {
    const getTokenQuery = {
      text: 'SELECT id, access_token, refresh_token FROM twitch WHERE code = $1 AND username = $2',
      values: [code, channel]
    }
    client = await connectToDatabase();
    const { rows } = await client.query(getTokenQuery);
    if (!rows[0]) return null
    return rows[0];

  } catch (error) {
    console.log("twitchGetTokenDatabase(): ", error);
    throw (error);

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


async function twitchRemoveIntegration(id, username, code) {
  let client;

  try {
    const removeQuery = {
      text: 'DELETE FROM twitch WHERE id = $1 AND username = $2 AND code = $3',
      values: [id, username, code],
    }
    client = await connectToDatabase();
    const { rowCount } = await client.query(removeQuery);
    console.log("removeQuery: ", rowCount);

    if (rowCount === 0) {
      throw { error: "User not registered!" };
    }
    return true;

  } catch (error) {
    console.log("twitchRemoveIntegration(): ", error);
    throw error.message;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}


export { testConnectionDatabase, spotifyGetRefreshTokenDatabase, spotifySaveToDatabase, spotifyRemoveIntegration, twitchSaveToDatabase, twitchCheckUser, twitchGetTokenDatabase, twitchRemoveIntegration };