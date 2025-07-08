const { Pool } = require("pg");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
};

async function connectDB() {
  try {
    const pool = new Pool(config);
    await pool.query("SELECT NOW()"); // Test the connection
    console.log("Connected to PostgreSQL Database");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

module.exports = { connectDB };
