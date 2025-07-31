import mongoose from 'mongoose';

const allergySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low'], required: true },
  description: { type: String, required: true },
});

const Allergy = mongoose.model('Allergy', allergySchema);
export default Allergy;
