import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const showtimeSchema = new Schema({
    movieId: {
        type: Types.ObjectId,
        ref: "Movie",
        required: true
    },
    theaterId: {
        type: Types.ObjectId,
        ref: "Theater",
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
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



// Create index for querying by date range
showtimeSchema.index({ startTime: 1 });
showtimeSchema.index({ movieId: 1, startTime: 1 });
showtimeSchema.index({ theaterId: 1, startTime: 1 });
showtimeSchema.index({ isActive: 1 });

// Static method to This method returns all active showtimes for a specific day, including full movie and theater info, sorted by start time.
showtimeSchema.statics.findByDate = function(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.find({
        startTime: { $gte: startOfDay, $lte: endOfDay },
        isActive: true
    }).populate('movieId').populate('theaterId').sort('startTime');
};


const showtimeModel = mongoose.models.Showtime || model("Showtime", showtimeSchema);

export default showtimeModel;
