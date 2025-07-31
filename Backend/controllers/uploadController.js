

import Upload from '../models/Upload.js';

export const getUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await Upload.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: uploads });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};



export const createUpload = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const userId = req.user.id;
    const uploadsData = Array.isArray(req.body) ? req.body : [req.body];

    const uploads = await Promise.all(
      uploadsData.map(async (data) => {
        const { name, size, type } = data; // Remove preview from destructuring
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 3600000); // 1 hour
        return await Upload.create({ userId, name, size, type, otp, otpExpiry });
      })
    );

    res.status(201).json({ success: true, data: uploads });
  } catch (error) {
    console.error('Error in createUpload:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


export const updateUploadOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const upload = await Upload.findOneAndUpdate(
      { _id: id, userId },
      { otp: Math.floor(100000 + Math.random() * 900000), otpExpiry: new Date(Date.now() + 3600000) },
      { new: true, runValidators: true }
    );
    if (!upload) return res.status(404).json({ success: false, error: 'Upload not found' });
    res.status(200).json({ success: true, data: upload });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const upload = await Upload.findOneAndDelete({ _id: id, userId });
    if (!upload) return res.status(404).json({ success: false, error: 'Upload not found' });
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};