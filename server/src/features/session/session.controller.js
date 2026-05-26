import {
  getUserSessionById,
  getUserSessions,
  saveProgress,
} from "./session.service.js";

export const completeSession = async (req, res) => {
  const { paragraph_id, wpm, accuracy, mistakes, time_taken } = req.body;
  const user_id = req.userId;

  if (
    !paragraph_id ||
    wpm === undefined ||
    accuracy === undefined ||
    mistakes === undefined
  ) {
    return res.status(400).json({
      error: "Missing required fields: paragraph_id, wpm, accuracy, mistakes.",
    });
  }

  try {
    const result = await saveProgress({
      user_id,
      paragraph_id,
      wpm,
      accuracy,
      mistakes,
      time_taken,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessions = async (req, res) => {
  const user_id = req.userId;

  try {
    const sessions = await getUserSessions(user_id);
    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionById = async (req, res) => {
  const user_id = req.userId;
  const { sessionId } = req.params;

  try {
    const session = await getUserSessionById(user_id, sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
