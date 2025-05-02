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
    address: {
        city: { type: String, trim: true },
        street: { type: String, trim: true },
        zipCode: { type: String, trim: true }
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },

    seatingLayout: {
        rows: { type: Number, default: 0 },
        columns: { type: Number, default: 0 },
        configuration: { type: Object, default: {} }
    },

    facilities: [{
        type: String,
        enum: ['parking', 'food_court', 'wheelchair_access', 'dolby_sound', 'imax', '3d', 'vip_lounge']
    }],

    isActive: {
        type: Boolean,
        default: true
    },
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    contactInfo: {
        phone: { type: String },
        email: { type: String }
    }
},{
    timestamps:true,
});

theaterSchema.index({ name: 1 }, { unique: true });
theaterSchema.index({ slug: 1 }, { unique: true });
theaterSchema.index({ location: 1 });
theaterSchema.index({ isActive: 1 });
theaterSchema.index({ "address.city": 1 });
theaterSchema.index({ manager: 1 });

const theaterModel = mongoose.models.Theater || model("Theater", theaterSchema);
export default theaterModel;