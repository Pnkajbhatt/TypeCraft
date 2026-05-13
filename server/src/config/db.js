import env from "../config/env.js";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.Dburl,
});

pool.on("connect", () => {
  console.log(
    "PostgreSQL Database connected successfully via Connection String! 🚀",
  );
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
  process.exit(-1);
});

export default pool;
