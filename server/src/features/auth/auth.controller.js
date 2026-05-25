import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { name, email, password, password_hash, profession_name } = req.body;
  const rawPassword = password || password_hash;

  try {
    const userExists = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use." });
    }
    const professionResult = await db.query(
      `SELECT id FROM professions WHERE name = $1`,
      [profession_name],
    );
    const profession = professionResult.rows[0];
    if (!profession || profession.length === 0) {
      return res.status(400).json({ message: "Profession Doesn't exist" });
    }

    if (!profession) {
      return res.status(400).json({ message: "Profession Doesn't exist" });
    }

    const profession_id = profession.id;

    if (!rawPassword) {
      return res.status(400).json({ error: "Password is required." });
    }

    const salt = await bcrypt.genSalt(
      parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
    );
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, profession_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, profession_id, created_at`,
      [name, email, passwordHash, profession_id],
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(201).json({
      message: "User registered successfully.",
      user: { ...user },
      token: token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query(
      "SELECT id , name , email , password_hash,profession_id FROM users WHERE email = $1",
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user_data = userResult.rows[0];

    const ispasswordValid = await bcrypt.compare(
      password,
      user_data.password_hash,
    );

    if (!ispasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user_data.id, email: user_data.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const { password_hash, ...user } = user_data;

    res.status(200).json({
      message: "Login Successfully",
      user: { ...user },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default register;
