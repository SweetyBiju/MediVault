import axios from "axios";

const GEMINI_KEY = process.env.GEMINI_API_KEY_2; // Make sure it's set in .env
const BASE = "https://generativelanguage.googleapis.com/v1";

// TEXT-only queries
export async function geminiText(prompt) {
  const url = `${BASE}/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  console.log("🔎 Gemini Request →", { url, body }); // Debug

  try {
    const { data } = await axios.post(url, body);
    console.log("✅ Gemini Response →", data); // Debug
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response from Gemini."
    );
  } catch (err) {
    console.error("❌ Gemini API Call Failed");
    console.error("Status:", err?.response?.status);
    console.error("Data:", err?.response?.data);
    console.error("Message:", err.message);
    throw new Error("Gemini text model failed.");
  }
}



// IMAGE + TEXT queries
export async function geminiVision({ base64Image, mimeType, prompt }) {
  const url = `${BASE}/models/gemini-pro-vision:generateContent?key=${GEMINI_KEY}`;
  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
  };
  try {
    const { data } = await axios.post(url, body);
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no vision response."
    );
  } catch (err) {
    console.error("Gemini Vision Error:", err?.response?.data || err.message);
    throw new Error("Gemini vision model failed.");
  }
}
