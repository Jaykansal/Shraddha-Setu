import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['CLIENT', 'PANDIT', 'ADMIN'], default: 'CLIENT', required: true },
    city: { type: String, required: true },
    panditProfile: {
      gurukul: { type: String, default: '' },
      vedicSpecialization: [{ type: String }],
      experienceYears: { type: Number, default: 0 },
      languages: [{ type: String }],
      isVerified: { type: Boolean, default: false },
      rating: { type: Number, default: 5.0 },
      poojasConducted: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
