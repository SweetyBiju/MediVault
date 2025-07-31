import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};

const registerUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    };
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return { success: false, error: 'Invalid email or password' };
    }
    return {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    };
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

export { registerUser, loginUser };
