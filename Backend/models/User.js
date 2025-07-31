import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  dateOfBirth: { type: Date, required: function() { return this.role === 'patient'; } },
  allergies: [{ type: Array }],
  conditions: [{ type: String }],
  licenseNumber: { type: String, required: function() { return this.role === 'doctor'; } },
  specialty: { type: String, required: function() { return this.role === 'doctor'; } },
  hospitalAffiliation: { type: String, required: function() { return this.role === 'doctor'; } },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;