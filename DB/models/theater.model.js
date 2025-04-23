import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const screenSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    layout: {
        rows: {
            type: Number,
            required: true
        },
        cols: {
            type: Number,
            required: true
        },
        seatType: {
            type: String,
      enum: ['regular', 'vip', 'accessible'],
      default: 'regular'
        }
    }
}, { _id: false });

const theaterSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    screens: {
        type: [screenSchema],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const theaterModel = mongoose.models.Theater || model("Theater", theaterSchema);
export default theaterModel;
