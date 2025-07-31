import express from 'express';
import {
  createAppointment,
  cancelAppointment,
  requestChange,
  reviewChangeRequest,
  getAppointmentsForUser,
  getAppointmentCount
} from '../controllers/appointments.controller.js';

const router = express.Router();

router.post('/', createAppointment);
router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/change-request', requestChange);
router.patch('/:id/change-decision', reviewChangeRequest);
router.get('/user/:userId', getAppointmentsForUser);
router.get('/count/:userId', getAppointmentCount);


export default router;
