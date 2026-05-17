import GoogleGenerativeAI from "@google/generative-ai";
import db from "../../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateParagraph = async (professionName) => {
  try {
    const model = genAI.getGeneratuveModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
      Generate a **single, short paragraph** (3-5 sentences) for typing practice for a **${professionName}**.
      Use **realistic, profession-specific terminology** and **natural language**.
      Example for "Software Engineer":
      "The developer implemented a RESTful API endpoint using Node.js and Express, ensuring proper error handling and input validation. They optimized the database query by adding an index, reducing the response time significantly."
      Example for "Doctor":
      "The patient presented with symptoms of tachycardia and hypertension, requiring immediate administration of beta-blockers and lifestyle modifications."
      Return **only the paragraph text**, no quotes or extra formatting.
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
      [text, professionId],
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
