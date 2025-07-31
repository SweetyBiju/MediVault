import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['general', 'heart', 'diabetes', 'alert'], required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
});

const Insight = mongoose.model('Insight', insightSchema);
export default Insight;