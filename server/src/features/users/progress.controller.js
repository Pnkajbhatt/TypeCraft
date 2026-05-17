import { getUserProgress } from "./progress.service.js";

export const getProgress = async (req, res) => {
  const userId = req.userId;

  try {
    const progress = await getUserProgress(userId);
    res.status(200).json({ progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
