import { saveProgress } from "./session.service.js";

export const completeSession = async (req, res) => {
  const { paragraphId, wpm, accuracy, mistakes, time_taken } = req.body;
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

    try {
      const progress = await saveProgress(userId, paragraph_id, {
        wpm,
        accuracy,
        mistakes,
      });
      res.status(201).json({ progress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
