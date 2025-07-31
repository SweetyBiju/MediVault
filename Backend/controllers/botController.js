import { geminiText, geminiVision } from "../services/gemini.service.js";
import {
  getRxcuiByName,
  getIngredientsByRxcui,
  getInteractionsByRxcui,
} from "../services/rxnorm.service.js";
import { getDrugLabelByIngredient } from "../services/openfda.service.js";

export async function handleTextBot(req, res) {
  try {
    const { message, userAllergies = [] } = req.body;

    // 1. Extract medicine names using Gemini
    const extractPrompt = `
You are a medical assistant. Extract medicine names (brand or generic) from this text as a JSON array.
Text: "${message}"
Return only JSON.
`;
    const extractJson = await geminiText(extractPrompt);
    let meds = [];
    try {
      meds = JSON.parse(extractJson);
    } catch {
      meds = [];
    }

    const analysis = [];

    for (const med of meds) {
      const rxcui = await getRxcuiByName(med);
      const ingredientsData = await getIngredientsByRxcui(rxcui);
      const ingredients = ingredientsData.map((i) => i.name);

      const allergyHits = ingredients.filter((ing) =>
        userAllergies.map((a) => a.toLowerCase()).includes(ing.toLowerCase())
      );

      const fdaData = {};
      for (const ing of ingredients) {
        fdaData[ing] = await getDrugLabelByIngredient(ing, 1);
      }

      const interactions = rxcui ? await getInteractionsByRxcui(rxcui) : null;

      analysis.push({
        med,
        rxcui,
        ingredients,
        allergyHits,
        fdaData,
        interactions,
      });
    }

    const finalPrompt = `
User allergies: ${JSON.stringify(userAllergies)}
Analysis: ${JSON.stringify(analysis, null, 2)}
Summarize which medicines are risky, why, and what to avoid. Give concise bullet points.
`;
    const reply = await geminiText(finalPrompt);

    res.json({
      analysis,
      reply,
      disclaimer:
        "This is not a medical diagnosis. Consult a licensed physician for clinical decisions.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function handleImageBot(req, res) {
  try {
    const { userAllergies = [] } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image file is required" });

    const base64 = req.file.buffer.toString("base64");
    const visionPrompt = `
Extract medicine names, strengths, and forms from this image. Return JSON:
{ "medicines": [ { "name": "...", "strength":"...", "form":"..." } ] }
If nothing, return {"medicines":[]}
`;
    const visionText = await geminiVision({
      base64Image: base64,
      mimeType: req.file.mimetype,
      prompt: visionPrompt,
    });

    let parsed = { medicines: [] };
    try {
      parsed = JSON.parse(visionText);
    } catch {}

    const analysis = [];

    for (const m of parsed.medicines) {
      const rxcui = await getRxcuiByName(m.name);
      const ingredientsData = await getIngredientsByRxcui(rxcui);
      const ingredients = ingredientsData.map((i) => i.name);

      const allergyHits = ingredients.filter((ing) =>
        userAllergies.map((a) => a.toLowerCase()).includes(ing.toLowerCase())
      );

      const fdaData = {};
      for (const ing of ingredients) {
        fdaData[ing] = await getDrugLabelByIngredient(ing, 1);
      }

      const interactions = rxcui ? await getInteractionsByRxcui(rxcui) : null;

      analysis.push({
        ...m,
        rxcui,
        ingredients,
        allergyHits,
        fdaData,
        interactions,
      });
    }

    const finalPrompt = `
User allergies: ${JSON.stringify(userAllergies)}
Image-extracted analysis: ${JSON.stringify(analysis, null, 2)}
Summarize risks, overlaps, and important warnings. Keep it short.
`;
    const reply = await geminiText(finalPrompt);

    res.json({
      extracted: parsed,
      analysis,
      reply,
      disclaimer:
        "This is not a medical diagnosis. Consult a licensed physician for clinical decisions.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
