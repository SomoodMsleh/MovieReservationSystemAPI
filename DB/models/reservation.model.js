import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const reservationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    showtimeId: {
        type: Types.ObjectId,
        ref: "Showtime",
        required: true
    },
    seats: [{
        type: Types.ObjectId,
        ref: "ShowtimeSeat",
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "refunded"],
        default: "pending"
    },
    reservationStatus: {
        type: String,
        enum: ["active", "cancelled", "completed"],
        default: "active"
    },
    reservationDate: {
        type: Date,
        default: Date.now
    },
    confirmationCode: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

// Create index for user's reservations
reservationSchema.index({ userId: 1, reservationDate: -1 });
reservationSchema.index({ showtimeId: 1 });

const reservationModel = mongoose.models.Reservation || model("Reservation", reservationSchema);

export default reservationModel;