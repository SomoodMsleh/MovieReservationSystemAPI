import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";


const seatSchema = new Schema({
    theaterId: {
        type: Types.ObjectId,
        ref: "Theater",
        required:[true, "Theater ID is required"]
    },
    row: {
        type: String,
        required: [true, "Row is required"],
        trim: true,
        uppercase: true,
    },
    number: {
        type: Number,
        required: [true, "Seat number is required"],
        min: [1, "Seat number must be at least 1"]
    },
    type: {
        type: String,
        enum: {
            values: ["standard", "premium", "handicap"],
            message: "Type must be one of: standard, premium, handicap"
        },
        default: "standard"
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true ,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// Create a compound index for row and number to ensure uniqueness within a theater
seatSchema.index({ theaterId: 1, row: 1, number: 1 }, { unique: true });

seatSchema.virtual('seatLabel').get(function() {
    return `${this.row}${this.number}`;
});

const seatModel = mongoose.models.Seat || model("Seat", seatSchema);

export default seatModel;