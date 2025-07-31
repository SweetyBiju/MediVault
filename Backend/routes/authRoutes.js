import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
// Add protected route for testing
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

export default router;