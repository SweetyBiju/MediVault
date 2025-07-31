const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  sharedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWithUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date },
  accessLevel: { type: String, enum: ['read', 'write'], default: 'read' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Share', shareSchema);