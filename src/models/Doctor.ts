import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password needs to be at least 6 characters long'],
    select: false, // Don't return password by default
  },
  specialization: {
    type: String,
    required: [true, 'Please provide a specialization'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Method to compare password
DoctorSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if model exists before compiling to prevent overwrite error in hot reload
export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
