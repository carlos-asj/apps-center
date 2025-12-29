import { Client } from "pg";

async function query(queryObject) {
    const client = new Client({
        host: "localhost",
        port: 5432,
        user: "local_user",
        database: "local_db",
        password: "local_password"
        // host: process.env.POSTGRES_HOST,
        // port: process.env.POSTGRES_PORT,
        // user: process.env.POSTGRES_USER,
        // database: process.env.POSTGRES_DB,
        // password: process.env.POSTGRES_PASSWORD
    });
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query, // same as query:query
};