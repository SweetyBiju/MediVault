import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};

const register = asyncHandler(async (req, res) => {
  const {
    name, email, phone, password, role, dateOfBirth, allergies, conditions,
    licenseNumber, specialty, hospitalAffiliation
  } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email' });
  }

  // Password length check
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  // Role-specific validation
  if (role === 'doctor' && (!licenseNumber || !specialty || !hospitalAffiliation)) {
    return res.status(400).json({ success: false, error: 'All doctor fields are required' });
  }
  if (role === 'patient' && !dateOfBirth) {
    return res.status(400).json({ success: false, error: 'Date of birth is required for patients' });
  }

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const userData = {
    name, email, phone, password, role,
    ...(role === 'patient' && { dateOfBirth, allergies, conditions }),
    ...(role === 'doctor' && { licenseNumber, specialty, hospitalAffiliation })
  };

  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid user data' });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

export { register, login };