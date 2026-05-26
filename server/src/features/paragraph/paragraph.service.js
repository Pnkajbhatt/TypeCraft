import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateParagraph = async (professionName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
      Generate a **single short paragraph** (3–5 sentences) for typing practice for a **${professionName}**.

Requirements:
- Use **realistic, profession-specific terminology** and **natural natural language**.
- Make each output **substantially different** from previous generations.
- Randomize:
  - scenario/context (daily tasks, emergencies, meetings, problem-solving, planning, analysis, reports, client interactions, technical issues, etc.)
  - sentence structure and wording
  - focus area within the profession
  - tools, methods, technologies, or concepts used
- Avoid repeating:
  - opening phrases
  - sentence patterns
  - common templates
  - identical terminology combinations
- Create unique situations rather than rewriting the same paragraph with minor word changes.
- Include occasional realistic numbers, metrics, deadlines, or measurable outcomes where appropriate.
- Keep the paragraph useful for typing practice with varied word lengths and punctuation.
- Do not mention that it is generated text.

Return **only the paragraph text**, without quotes, labels, markdown, or extra formatting.
    `;

    const result = await model.generateContent(prompt);
    const paragraphText = result.response.text().trim();

    return paragraphText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate paragraph.");
  }
};

export const saveParagraph = async (text, profession_id) => {
  try {
    const result = await db.query(
      `INSERT INTO paragraphs (text, profession_id, is_used)
       VALUES ($1, $2, FALSE)
       RETURNING id, text, profession_id, created_at`,
      [text, profession_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Failed to save paragraph.");
  }
};

export const generateAndSaveParagraph = async (professionId) => {
  const professionResult = await db.query(
    "SELECT name FROM professions WHERE id = $1",
    [professionId],
  );
  if (professionResult.rows.length === 0) {
    throw new Error("Profession not found.");
  }
  const professionName = professionResult.rows[0].name;

  const paragraphText = await generateParagraph(professionName);

  const savedParagraph = await saveParagraph(paragraphText, professionId);

  return savedParagraph;
};
