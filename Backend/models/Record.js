import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['consultation', 'lab-result', 'imaging', 'prescription', 'surgery', 'vaccination', 'other'], required: true },
  description: { type: String },
  date: { type: Date, required: true },
  bodyPart: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  tags: [{ type: String }],
  files: [{ name: String, size: String, type: String }],
  doctor: { name: String, specialty: String },
  aiInsights: {
    riskScore: Number,
    recommendations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Record', recordSchema);