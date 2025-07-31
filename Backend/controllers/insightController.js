

import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Insight from '../models/Insight.js';
import Upload from '../models/Upload.js';
import mongoose from 'mongoose';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInsights = async (req, res) => {
  try {
    const { reportId, userId } = req.body;

    if (!reportId || !userId) {
      return res.status(400).json({ error: 'reportId and userId are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    console.log('[Incoming POST] reportId:', reportId, 'userId:', userId);

    const upload = await Upload.findById(reportId);
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    const filePath = upload.filePath;
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found on server' });
    }

    console.log(`[POST /api/insights/generate] Generating insights for report: ${reportId}`);

    let extractedText = '';
    const ext = upload.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      console.log('[Parsing PDF file]');
      const { default: pdfParse } = await import('pdf-parse');
      const parsed = await pdfParse(fs.readFileSync(filePath));
      extractedText = parsed.text;
    } else if (ext === 'docx') {
      console.log('[Parsing DOCX file]');
      const { extractRawText } = await import('mammoth');
      const result = await extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    console.log('[Extracted Text Length]:', extractedText.length);
    const limitedText = extractedText.substring(0, 4000);

    const prompt = `
      You are a medical report summarizer. Analyze the following report text and provide structured output in JSON:
      - summary: Brief patient-friendly summary
      - parameters: Array of { name, value, range, meaning (layman terms), status, organ }
      - recommendations: Array of lifestyle/diet recommendations

      Report Text:
      ${limitedText}

      Respond ONLY in valid JSON. No extra text.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    console.log('[Gemini Raw Response]:', aiResponse);

    let insights;
    try {
      insights = JSON.parse(aiResponse.replace(/```json|```/g, '').trim());
    } catch (err) {
      console.error('[JSON Parse Error]:', err);
      return res.status(500).json({ error: 'AI response invalid JSON format' });
    }

    const savedInsight = await Insight.findOneAndUpdate(
      { reportId },
      { userId, reportId, ...insights },
      { upsert: true, new: true }
    );

    console.log('[Insights Saved]:', savedInsight._id);
    res.json(savedInsight);
  } catch (err) {
    console.error('[Error generating AI insights]:', err);
    res.status(500).json({ error: `Failed to generate insights: ${err.message}` });
  }
};

export const getInsights = async (req, res) => {
  try {
    const { reportId } = req.params;
    console.log('[GET /api/insights/:reportId] Fetching insights for:', reportId);

    const insight = await Insight.findOne({ reportId });
    if (!insight) return res.status(404).json({ error: 'No insights found for this report' });

    res.json(insight);
  } catch (err) {
    console.error('[Error fetching insights]:', err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
};

export const getOverallInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await Insight.find({ userId });
    if (!insights.length) return res.status(404).json({ error: 'No insights found' });

    const combined = {
      summary: 'Overall health analysis based on all uploaded reports.',
      parameters: insights.flatMap(i => i.parameters),
      recommendations: [...new Set(insights.flatMap(i => i.recommendations))]
    };
    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overall insights' });
  }
};
