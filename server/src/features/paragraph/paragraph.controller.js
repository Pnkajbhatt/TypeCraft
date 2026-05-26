import db from "../../config/db.js";
import { generateAndSaveParagraph } from "./paragraph.service.js";

export const getNextparagraph = async (req, res) => {
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

    let paragraph = paragraphResult.rows[0];

    if (!paragraph) {
      paragraph = await generateAndSaveParagraph(professionId);
    }

    res.status(200).json({ paragraph });
  } catch (err) {
    console.error("Error fetching paragraph:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const guestParagraphs = [
  {
    id: "guest-1",
    text: "Typing practice requires consistency and focus. When you first start learning to type without looking at the keyboard, your speed will likely be very slow, perhaps only 15 to 20 words per minute. This is completely normal and happens to everyone. The most important skill to develop is accuracy rather than raw speed. If you force yourself to type too quickly, you will develop bad habits and make many errors that become difficult to correct later. Instead, place your fingers on the home row keys—left hand on A, S, D, F and right hand on J, K, L, semicolon. Keep your wrists straight and maintain a relaxed posture. Practice typing common English words repeatedly until your fingers memorize their positions automatically. Over time, your brain will stop thinking about individual keys and start thinking in full words. This transition is the key to becoming a fast and efficient typist. Many professional typists can reach speeds above 80 words per minute simply because they practiced consistently for months. Remember that progress happens slowly, so do not get discouraged if you do not see immediate improvement. Even fifteen minutes of daily practice is far better than two hours once per week. Stay patient and trust the process, because every professional typist once started exactly where you are right now.",
  },
  {
    id: "guest-2",
    text: "Proper finger placement makes an enormous difference in typing speed and accuracy. Each finger is responsible for specific keys on the keyboard, and respecting these zones prevents unnecessary hand movement. Your left pinky finger controls the Q, A, and Z keys along with the left Shift and Caps Lock. Your left ring finger handles W, S, and X. Your left middle finger manages E, D, and C. Your left index finger covers R, F, V, T, G, and B. On the right hand, your index finger controls Y, H, N, U, J, and M. Your right middle finger handles I, K, and the comma. Your right ring finger manages O, L, and the period. Finally, your right pinky covers P, semicolon, slash, and the right Shift key. Your thumbs should rest on the space bar. At first, reaching for keys with the correct finger will feel awkward and slow. However, this discipline prevents your fingers from wandering across the keyboard, which ultimately increases your speed. Typists who use proper finger placement can often type for hours without fatigue, whereas those who hunt and peck with two fingers experience hand strain much faster. Learning these zones takes approximately two weeks of daily practice before they become natural.",
  },
  {
    id: "guest-3",
    text: "One common mistake beginners make is looking down at their hands while typing. This habit severely limits your potential speed because your eyes cannot move faster than your fingers anyway. Instead, you should train yourself to trust your muscle memory. Covering your keyboard with a cloth or using a keyboard with blank keycaps forces you to memorize key positions without visual confirmation. Another frequent error is pressing the keys too hard. Modern keyboards register a keypress with very little force, so striking keys aggressively only slows you down and causes finger fatigue. Try to develop a light, flowing touch where your fingers barely lift off the home row. Poor posture also reduces typing efficiency. Your chair height should allow your elbows to form a ninety-degree angle, and your wrists should float slightly above the keyboard rather than resting on a pad. Slouching or sitting too low restricts blood flow to your hands and makes your fingers feel sluggish. Finally, many typists forget to use both Shift keys properly. The left Shift key should be pressed by your left pinky when typing capital letters on the right side of the keyboard, and the right Shift key should be used for capital letters on the left side. This technique keeps your hands balanced and prevents awkward stretches.",
  },
  {
    id: "guest-4",
    text: "Effective typing practice requires structured exercises rather than random typing. One excellent method is repeating common English letter combinations such as th, he, in, er, an, re, nd, at, on, nt, ha, es, st, and en. These pairs appear constantly in written English, so mastering them dramatically improves your flow. Another useful exercise involves typing full sentences that contain every letter of the alphabet. For example, 'The quick brown fox jumps over the lazy dog' is a classic pangram that forces your fingers to hit all keys. You should also practice typing words with difficult transitions such as 'minimum,' 'judgment,' and 'frequency' because these require precise finger coordination. Timed tests help measure your progress and keep you motivated. Start with one-minute tests and gradually increase to five minutes as your stamina improves. Always review your errors after each practice session. If you consistently misspell certain words or struggle with specific letter combinations, create custom drills that target those weaknesses. Many online typing tutors offer detailed analytics showing exactly which keys cause the most errors. Use this data to focus your practice on problem areas rather than repeating material you have already mastered. Remember that typing is a physical skill similar to playing a musical instrument, so regular, focused practice always produces better results than occasional marathon sessions.",
  },
  {
    id: "guest-5",
    text: "Building typing speed from thirty to sixty words per minute typically takes three to six months of consistent practice. During this period, your fingers gradually develop automaticity, meaning they type words without conscious thought. The transition from thinking about individual letters to thinking about whole words represents a major milestone. At this stage, your brain sends movement instructions to your fingers directly from your visual cortex, bypassing the slower language processing centers. This neurological change explains why expert typists can type while carrying on a conversation. To accelerate this process, practice typing entire phrases rather than isolated words. For instance, type common email greetings like 'Dear Sir or Madam' or closing phrases such as 'Thank you for your consideration' repeatedly until they become one fluid motion. Another advanced technique involves rhythmic typing, where you maintain a steady, even keystroke pace instead of rushing through easy words and pausing before difficult ones. Using a metronome set to a comfortable beat can help develop this rhythm. Avoid the temptation to backspace and correct every mistake immediately while practicing. Continuous corrections interrupt your flow and train your brain to expect do-overs. Instead, finish the entire sentence or paragraph first, then review and correct errors afterward. This approach builds confidence and prevents hesitation. With dedication, most typists can reach seventy words per minute within one year of daily practice.",
  },
];

export const getGuestParagraph = async (req, res) => {
  const random =
    guestParagraphs[Math.floor(Math.random() * guestParagraphs.length)];
  res.status(200).json({ paragraph: random });
};

export default getNextparagraph;
