// backend/controllers/appointments.controller.js
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, type, reason, notes, isVirtual, meetingLink } = req.body;

    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);
    if (!patient || !doctor) return res.status(404).json({ message: 'Patient or Doctor not found' });

    const appointment = await Appointment.create({
      patientId, doctorId, date, time, type, reason, notes, isVirtual, meetingLink,
      status: 'requested'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.status === 'cancelled') return res.status(400).json({ message: 'Appointment already cancelled' });

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

// Request change (prepone/postpone/change mode)
// Replace your requestChange with:
// export const requestChange = async (req, res) => {
//   try {
//     const { changeType, newDate, newTime, newMode } = req.body;
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
//     if (appointment.status === 'cancelled') return res.status(400).json({ message: 'Cannot modify a cancelled appointment' });

//     if (changeType === 'postpone' || changeType === 'prepone') {
//       appointment.date = newDate;
//       appointment.time = newTime;
//       appointment.status = changeType;
//     } else if (changeType === 'change mode') {
//       appointment.isVirtual = newMode === 'virtual';
//       appointment.status = 'mode-changed';
//     }

//     await appointment.save();
//     res.json({ message: `${changeType} applied successfully`, appointment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error applying change', error: error.message });
//   }
// };
// Replace requestChange with this
export const requestChange = async (req, res) => {
  try {
    console.log("📩 Incoming change request:", req.params.id, req.body);

    const { changeType, newDate, newTime, newMode } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      console.log("❌ Appointment not found");
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      console.log("⚠️ Cannot modify cancelled appointment");
      return res.status(400).json({ message: 'Cannot modify a cancelled appointment' });
    }

    if (changeType === 'postpone' || changeType === 'prepone') {
      console.log("🗓 Updating date/time:", newDate, newTime);
      if (newDate) appointment.date = newDate;
      if (newTime) appointment.time = newTime;
      appointment.status = changeType;
    } 
    if (changeType === 'change mode') {
      console.log("🎥 Changing mode to:", newMode);
      appointment.isVirtual = newMode?.toLowerCase() === 'virtual';
      appointment.status = 'mode-changed';
    }

    await appointment.save();

    const updated = await Appointment.findById(req.params.id).populate('doctorId patientId', 'name email role');
    console.log("✅ Updated appointment saved & populated:", updated);

    res.json({ message: `${changeType} applied successfully`, appointment: updated });
  } catch (error) {
    console.error("🔥 Error in requestChange:", error);
    res.status(500).json({ message: 'Error applying change', error: error.message });
  }
};






// Doctor approves/rejects change
export const reviewChangeRequest = async (req, res) => {
  try {
    const { requestId, decision, reviewedBy } = req.body; // decision: 'approved' or 'rejected'
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const changeRequest = appointment.changeRequests.id(requestId);
    if (!changeRequest) return res.status(404).json({ message: 'Change request not found' });

    changeRequest.status = decision;
    changeRequest.reviewedBy = reviewedBy;
    changeRequest.reviewedAt = new Date();

    let decisionMessage;

    if (decision === 'approved') {
      if (changeRequest.newDate) appointment.date = changeRequest.newDate;
      if (changeRequest.newTime) appointment.time = changeRequest.newTime;
      if (changeRequest.newMode) appointment.isVirtual = changeRequest.newMode === 'virtual';
      appointment.status = 'confirmed';
    } else if (decision === 'rejected') {
      appointment.status = 'cancelled';
      decisionMessage = `${changeRequest.changeType} request rejected — Appointment cancelled by Doctor`;
    } else {
      appointment.status = 'scheduled';
    }

    changeRequest.decisionMessage = decisionMessage;
    appointment.latestDecisionMessage = decisionMessage;

    await appointment.save();

    const updated = await Appointment.findById(req.params.id).populate('patientId doctorId', 'name email role');

    res.json({ message: `Change request ${decision}`, appointment : updated});
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing change request', error: error.message });
  }
};

// Get appointments for a user
export const getAppointmentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({
      $or: [{ patientId: userId }, { doctorId: userId }]
    }).populate('patientId doctorId', 'name email role');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get appointment count for a user
export const getAppointmentCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Appointment.countDocuments({
      $or: [{ patientId: userId }, { doctorId: userId }]
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment count', error: error.message });
  }
};
