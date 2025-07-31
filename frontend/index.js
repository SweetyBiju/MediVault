import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import { config } from './config/env.js';
//import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import allergyRoutes from './routes/allergyRoutes.js';
//import insightRoutes from './routes/insightRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Match your frontend URL
  credentials: true,
}));
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
//app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/allergies', allergyRoutes);
//app.use('/api/insights', insightRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong' });
});

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
