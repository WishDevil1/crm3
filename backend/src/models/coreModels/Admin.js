import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  branchs: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true, lowercase: true },
  surname: { type: String, lowercase: true },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'staff',
    enum: ['superadmin', 'admin', 'staffAdmin', 'staff', 'createOnly', 'readOnly'],
  },
});

export default mongoose.model('Admin', adminSchema);
