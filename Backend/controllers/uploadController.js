import Upload from '../models/Upload.js';
import Share from '../models/Share.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = './Uploads';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.docx', '.png', '.jpg', '.jpeg'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and image files are allowed'), false);
    }
  },
}).array('files');

export const createUpload = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }

    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const userId = req.user.id;
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'No files uploaded' });
      }

      const uploads = await Promise.all(
        req.files.map(async (file, index) => {
          const { originalname: name, size, mimetype } = file;
          const type = Array.isArray(req.body.type) ? req.body.type[index] : req.body.type || 'Other';
          const otp = Math.floor(100000 + Math.random() * 900000);
          const otpExpiry = new Date(Date.now() + 3600000);
          const preview = `${process.env.API_BASE_URL || 'http://localhost:5600'}/Uploads/${file.filename}`;
          const filePath = file.path;

          return await Upload.create({
            userId,
            name,
            size: (size / 1024 / 1024).toFixed(2),
            type,
            otp,
            otpExpiry,
            preview,
            filePath,
            description: req.body.description,
            date: req.body.date || Date.now(),
            bodyPart: req.body.bodyPart,
            severity: req.body.severity || 'low',
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
          });
        })
      );

      res.status(201).json({ success: true, data: uploads });
    } catch (error) {
      console.error('Error in createUpload:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });
};

export const getUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await Upload.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: uploads });
  } catch (error) {
    console.error('Error in getUploads:', error);
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
    console.error('Error in updateUploadOtp:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const upload = await Upload.findOneAndDelete({ _id: id, userId });
    if (!upload) return res.status(404).json({ success: false, error: 'Upload not found' });
    if (upload.filePath && await fs.access(upload.filePath).then(() => true).catch(() => false)) {
      await fs.unlink(upload.filePath);
    }
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error in deleteUpload:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid record ID' });
    }
    if (!otp) {
      return res.status(400).json({ success: false, error: 'OTP is required' });
    }

    const upload = await Upload.findById(id);
    if (!upload || !upload.filePath) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    if (upload.otp !== parseInt(otp) || (upload.otpExpiry && upload.otpExpiry < new Date())) {
      return res.status(403).json({ success: false, error: 'Invalid or expired OTP' });
    }

    const filePath = path.resolve(upload.filePath);
    if (!await fs.access(filePath).then(() => true).catch(() => false)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${upload.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error in getFile:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const shareRecord = async (req, res) => {
  try {
    const { recordId, sharedWithEmail, expiresAt, accessLevel, message, sharedByUserId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(recordId) || !mongoose.Types.ObjectId.isValid(sharedByUserId)) {
      return res.status(400).json({ success: false, error: 'Invalid record ID or user ID' });
    }
    if (!sharedWithEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sharedWithEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid doctor email' });
    }

    const upload = await Upload.findById(recordId);
    if (!upload) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    const doctor = await User.findOne({ email: sharedWithEmail, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found on the platform' });
    }

    const share = new Share({
      recordId,
      sharedByUserId,
      sharedWithUserId: doctor._id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      accessLevel,
      message
    });
    await share.save();

    // Copy the record to the doctor's uploads with a reference to the original
    await Upload.create({
      userId: doctor._id,
      name: upload.name,
      size: upload.size,
      type: upload.type,
      otp: Math.floor(100000 + Math.random() * 900000),
      otpExpiry: new Date(Date.now() + 3600000),
      preview: upload.preview,
      filePath: upload.filePath,
      description: `Shared by ${req.user.email}: ${upload.description || ''}`,
      date: upload.date,
      bodyPart: upload.bodyPart,
      severity: upload.severity,
      tags: upload.tags,
      sharedFrom: recordId
    });

    res.status(200).json({ success: true, message: 'Record shared successfully' });
  } catch (error) {
    console.error('Error in shareRecord:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};