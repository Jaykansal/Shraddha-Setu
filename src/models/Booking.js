import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    poojaId: { type: String, required: true },
    poojaTitle: { type: String, required: true },
    withSamagri: { type: Boolean, default: true, required: true },
    basePrice: { type: Number, required: true },
    samagriPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED' }
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
