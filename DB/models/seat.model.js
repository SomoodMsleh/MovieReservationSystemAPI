import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";


const seatSchema = new Schema({
    theaterId: {
        type: Types.ObjectId,
        ref: "Theater",
        required: true
    },
    row: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["standard", "premium", "handicap"],
        default: "standard"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Create a compound index for row and number to ensure uniqueness within a theater
seatSchema.index({ theaterId: 1, row: 1, number: 1 }, { unique: true });

const seatModel = mongoose.models.Seat || model("Seat", seatSchema);

export default seatModel;