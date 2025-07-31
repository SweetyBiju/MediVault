
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true }, // in MB
  type: { type: String, enum: ['Prescription', 'Report', 'Bill', 'Other'], required: true },
  date: { type: Date, default: Date.now },
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
  preview: { type: String }, // URL or path to preview
  filePath: { type: String },
  description: { type: String },
  date: { type: Date, default: Date.now },
  bodyPart: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  tags: { type: [String], default: [] },
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }
  
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;