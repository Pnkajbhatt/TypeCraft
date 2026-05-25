import db from "../../config/db.js";

export const getUserProgress = async (userId) => {
  try {
    const result = await db.query(
      `SELECT
          p.id,
          p.paragraph_id,
          pr.text AS paragraph_text,
          p.wpm,
          p.accuracy,
          p.mistakes,
          p.time_taken,
          p.created_at
        FROM progress p
        JOIN paragraphs pr ON p.paragraph_id = pr.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC`,
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.error("Progress fetch error:", error);
    throw new Error("Failed to fetch progress.");
  }
};
