import Allergy from '../models/Allergy.js';

export const getAllergies = async (req, res) => {
  try {
    const userId = req.user.id;
    const allergies = await Allergy.find({ userId });
    res.status(200).json({ success: true, data: allergies });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createAllergy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, severity, description } = req.body;
    const allergy = await Allergy.create({ userId, name, severity, description });
    res.status(201).json({ success: true, data: allergy });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
