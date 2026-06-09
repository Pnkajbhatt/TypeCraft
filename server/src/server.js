import express from "express";
import app from "./app.js";
import env from "./config/env.js";
import pool from "./config/db.js";

const PORT = env.PORT;
const server = app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  server.close(() => {
    pool.end();
    console.log("Server closed");
  });
});

export default server;
