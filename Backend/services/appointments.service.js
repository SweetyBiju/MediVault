const Appointment = require('../models/Appointment');

exports.getAppointments = async ({ userId, role, status, date }) => {
  const query = role === 'patient' ? { patientId: userId } : { doctorId: userId };
  if (status) query.status = status;
  if (date) query.date = date;

  return await Appointment.find(query)
    .populate('patientId', 'name email phone')
    .populate('doctorId', 'name specialty hospitalAffiliation avatar');
};

exports.createAppointment = async (appointmentData) => {
  const { doctorId, date, time, type, reason, isVirtual, notes } = appointmentData;
  if (!doctorId || !date || !time || !type || !reason) {
    throw new Error('Missing required fields');
  }

  const appointment = new Appointment({
    patientId: appointmentData.patientId,
    doctorId,
    date,
    time,
    type,
    reason,
    isVirtual,
    notes,
    meetingLink: isVirtual ? `https://meet.medivault.com/room/${Date.now()}` : null
  });

  return await appointment.save();
};

exports.updateAppointment = async (id, updates, user) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (user.role === 'patient' && appointment.patientId.toString() !== user.id) {
    throw new Error('Access denied');
  }
  if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
    throw new Error('Access denied');
  }

  appointment.status = updates.status;
  return await appointment.save();
};

exports.addNote = async (id, notes, user) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (user.role === 'patient' && appointment.patientId.toString() !== user.id) {
    throw new Error('Access denied');
  }
  if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
    throw new Error('Access denied');
  }

  appointment.notes = notes;
  return await appointment.save();
};