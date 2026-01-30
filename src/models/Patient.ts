import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide an age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please provide a gender'],
  },
  diagnosis: {
    type: String,
    trim: true,
    required: [true, 'Please provide a diagnosis'],
  },
  notes: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
