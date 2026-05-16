import db from "../../config/db.js";
const getNextparagraph = async (req, res) => {
  const userId = req.userId;

  try {
    const userResult = await db.query(
      "SELECT profession_id FROM users WHERE id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "user Not found" });
    }
    const professionId = userResult.rows[0].profession_id;

    const paragraphResult = await db.query(
      `
      SELECT p.id, p.text
      FROM paragraphs p
      LEFT JOIN user_paragraphs up ON p.id = up.paragraph_id AND up.user_id = $1
      WHERE p.profession_id = $2 AND up.id IS NULL
      LIMIT 1
    `,
      [userId, professionId],
    );

    if (paragraphResult.rows.length === 0) {
      return res.status(404).json({ error: "user Not found" });
    }

    const paragraph = paragraphResult.rows[0];

    await db.query(
      `
      INSERT INTO user_paragraphs (user_id, paragraph_id, seen_at)
      VALUES ($1, $2, NOW())
    `,
      [userId, paragraph.id],
    );

    res.status(200).json({ paragraph });
  } catch (err) {
    console.error("Error fetching paragraph:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default getNextparagraph;
