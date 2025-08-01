import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from 'multer';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2);

export const handleTextBot = async (req, res) => {
  try {
    const { message, userAllergies = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const prompt = `
You are a medical assistant chatbot. The user has the following allergies: ${JSON.stringify(
      userAllergies
    )}.
Provide a friendly, non-diagnostic response to the question below.
If medications are mentioned, warn about possible allergy interactions.

Question:
${message}

Respond in plain text (no JSON).
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({
      reply,
      disclaimer:
        "This is not medical advice. Always consult a licensed healthcare professional.",
    });
  } catch (err) {
    console.error("[Chatbot Error]:", err.message);
    res.status(500).json({ error: "Failed to process your question." });
  }
};

// Memory storage for image upload

// For multer memory upload (used in routes)
export const uploadImage = multer({ storage: multer.memoryStorage() }).single("image");

export const handleImageBot = async (req, res) => {
  try {
    const { userAllergies = [] } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const prompt = `
You are a medical assistant. Extract medicine names, strengths, and forms from the image.
Highlight any risks or allergic ingredients based on these allergies: ${JSON.stringify(userAllergies)}.
Summarize your findings in plain English. Avoid extra formatting or JSON.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: prompt,
      },
    ]);

    const reply = result.response.text();

    res.json({
      reply,
      disclaimer:
        "This is not a medical diagnosis. Always consult a licensed doctor.",
    });
  } catch (err) {
    console.error("[Image Bot Error]:", err.message);
    res.status(500).json({ error: "Failed to analyze image." });
  }
};
