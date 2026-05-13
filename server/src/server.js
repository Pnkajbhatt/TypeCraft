import express from "express";

import env from "./config/env.js";
import pool from "./config/db.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("good");
});

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  pool.connect();
  console.log(`Server running on port ${PORT}`);
});
