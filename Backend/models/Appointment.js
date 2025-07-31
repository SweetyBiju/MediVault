// backend/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 30 },
  type: { type: String, enum: ['consultation', 'followup', 'emergency', 'telemedicine'], required: true },
  status: { type: String, enum: ['requested', 'scheduled', 'confirmed', 'pending-doctor-decision', 'completed', 'cancelled', 'no-show'], default: 'requested' },
  reason: { type: String, required: true },
  notes: { type: String },
  isVirtual: { type: Boolean, default: false },
  meetingLink: { type: String },

  // NEW: Audit trail for changes
  changeRequests: [
    {
      requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changeType: { type: String, enum: ['prepone', 'postpone', 'change-mode'] },
      newDate: String,
      newTime: String,
      newMode: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date
    }
  ]
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
