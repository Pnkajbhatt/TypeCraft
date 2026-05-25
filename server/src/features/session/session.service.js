import db from "../../config/db.js";

export const saveProgress = async ({
  user_id,
  paragraph_id,
  wpm,
  accuracy,
  mistakes,
  time_taken,
}) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const sessionResult = await client.query(
      `INSERT INTO progress (user_id, paragraph_id, wpm, accuracy, mistakes, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, paragraph_id, wpm, accuracy, mistakes, time_taken, created_at`,
      [user_id, paragraph_id, wpm, accuracy, mistakes, time_taken ?? 0],
    );

    const progressResult = await client.query(
      `INSERT INTO progress (user_id, paragraph_id, wpm, accuracy, mistakes, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, paragraph_id, wpm, accuracy, mistakes, time_taken, created_at`,
      [user_id, paragraph_id, wpm, accuracy, mistakes, time_taken ?? 0],
    );

    await client.query("COMMIT");

    return {
      session: sessionResult.rows[0],
      progress: progressResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Progress save error:", error);
    throw new Error("Failed to save session progress.");
  } finally {
    client.release();
  }
};

export const getUserSessions = async (userId) => {
  try {
    const result = await db.query(
      `SELECT
          s.id,
          s.user_id,
          s.paragraph_id,
          p.text AS paragraph_text,
          s.wpm,
          s.accuracy,
          s.mistakes,
          s.time_taken,
          s.created_at
        FROM progress s
        JOIN paragraphs p ON p.id = s.paragraph_id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC`,
      [userId],
    );

    return result.rows;
  } catch (error) {
    console.error("Session fetch error:", error);
    throw new Error("Failed to fetch progress.");
  }
};

export const getUserSessionById = async (userId, sessionId) => {
  try {
    const result = await db.query(
      `SELECT
          s.id,
          s.user_id,
          s.paragraph_id,
          p.text AS paragraph_text,
          s.wpm,
          s.accuracy,
          s.mistakes,
          s.time_taken,
          s.created_at
        FROM progress s
        JOIN paragraphs p ON p.id = s.paragraph_id
        WHERE s.user_id = $1 AND s.id = $2
        LIMIT 1`,
      [userId, sessionId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Session detail fetch error:", error);
    throw new Error("Failed to fetch session.");
  }
};
