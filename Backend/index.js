import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { config } from './config/env.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointments.router.js';
import doctorRoutes from './routes/doctors.js';
import insightRoutes from './routes/insightRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import allergyRoutes from './routes/allergyRoutes.js';
// import dashboardRoutes from './routes/dashboardRoutes.js'; // Uncomment if needed

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: 'http://localhost:5173', // Match your frontend URL
  credentials: true,
}));
app.use(express.json());

// ===== Database Connection =====
connectDB();

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', doctorRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/allergies', allergyRoutes);
// app.use('/api/dashboard', dashboardRoutes); // Uncomment if needed

console.log("All routes are mounted");

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong' });
});

// ===== Server Listen =====
const PORT = config.port || 5600;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
