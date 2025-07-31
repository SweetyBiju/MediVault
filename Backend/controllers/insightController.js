import Insight from '../models/Insight.js';

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await Insight.find({ userId }).sort({ type: 1 });
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};