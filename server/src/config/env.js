import "dotenv/config";

const env = {
  PORT: process.env.PORT,
  Dburl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
};

if (!env.Dburl) {
  console.error("❌ ERROR: DATABASE_URL is missing in your .env file!");
  process.exit(1);
}

export default env;
