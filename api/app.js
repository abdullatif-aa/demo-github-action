const express = require('express');
const cors = require("cors");
const { connectDB } = require("./config/db.config");

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Create users table if it doesn't exist
async function initializeDB() {
  try {
    const pool = await connectDB();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        age INTEGER,
        address VARCHAR(255)
      );
    `);
    console.log("Database initialized");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}

// GET all users
app.get("/api/user", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
app.post("/api/user", async (req, res) => {
  try {
    const { name, email, age, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const pool = await connectDB();
    const result = await pool.query(
      `INSERT INTO users (name, email, age, address)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, age, address]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
app.put("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const pool = await connectDB();
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, age = $3, address = $4
       WHERE id = $5`,
      [name, email, age, address, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDB();
});
