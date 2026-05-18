import db from "../../config/db.js";

export const saveProgress = async (
  user_id,
  paragraph_id,
  wpm,
  accuracy,
  mistakes,
  time_taken,
) => {
  try {
    const result = await db.query(
      `INSERT INTO progress (user_id, paragraph_id, wpm, accuracy, mistakes,time_taken)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, paragraph_id, wpm, accuracy, mistakes,time_taken, created_at`,
      [userId, paragraphId, wpm, accuracy, mistakes, time_taken],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Progress save error:", error);
    throw new Error("Failed to save progress.");
  }
};
