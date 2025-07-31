import axios from "axios";

const GEMINI_KEY = process.env.GEMINI_API_KEY_2;
const BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function geminiText(prompt) {
  const url = `${BASE}/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };
  const { data } = await axios.post(url, body);
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, no response from Gemini."
  );
}

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
  const { data } = await axios.post(url, body);
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, no vision response."
  );
}
