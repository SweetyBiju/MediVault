
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
  
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;