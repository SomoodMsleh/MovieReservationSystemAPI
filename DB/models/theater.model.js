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
        required: true,
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
        type: Object,
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
    createdBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

const theaterModel = mongoose.models.Theater || model("Theater", theaterSchema);
export default theaterModel;