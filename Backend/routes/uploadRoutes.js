import express from 'express';
import { getUploads, createUpload, updateUploadOtp, deleteUpload } from '../controllers/uploadController.js';
import {protect} from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUploads);
router.post('/', protect, createUpload);
router.put('/otp/:id', protect, updateUploadOtp);
router.delete('/:id', protect, deleteUpload);

export default router;