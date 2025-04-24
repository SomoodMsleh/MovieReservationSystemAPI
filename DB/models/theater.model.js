import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

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
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    seatingLayout: {
        type: Map,
        of: new Schema({
            rows: Number,
            cols: Number,
            seatType: {
            type: String,
                enum: ['regular', 'vip', 'accessible'],
                default: 'regular'
            }
        }),
        default: {}
    },
    isActive: {
        type: Boolean,
        default: true
    },
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
},{timestamps:true});

const theaterModel = mongoose.models.Theater || model("Theater", theaterSchema);
export default theaterModel;