import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const showtimeSeatSchema = new Schema({
    showtimeId: {
        type: Types.ObjectId,
        ref: "Showtime",
        required: true
    },
    seatId: {
        type: Types.ObjectId,
        ref: "Seat",
        required: true
    },
    status: {
        type: String,
        enum: ["available", "reserved", "occupied", "disabled"],
        default: "available"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    
    reservedAt: Date
}, { timestamps: true });

// Create compound index for showtime and seat
showtimeSeatSchema.index({ showtimeId: 1, seatId: 1 }, { unique: true });

const showtimeSeatModel = mongoose.models.ShowtimeSeat || model("ShowtimeSeat", showtimeSeatSchema);

export default showtimeSeatModel;
