import express from 'express';
import { getAllergies, createAllergy } from '../controllers/allergyController.js';
import {protect} from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllergies);
router.post('/', protect, createAllergy);

export default router;
