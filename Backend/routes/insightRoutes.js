import express from 'express';
import { generateInsights, getInsights, getOverallInsights } from '../controllers/insightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateInsights); // Generate + Save, no multer
router.get('/:reportId', protect, getInsights); // Retrieve only
router.get('/overall/:userId', protect, getOverallInsights);

export default router;
