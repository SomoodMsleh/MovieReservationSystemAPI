import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    slug:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    posterImage: {
        type:Object,
        required:true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    genres: [{
        type: Types.ObjectId,
        ref: "Genre",
        required: true
    }],
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    director: {
        type: String,
        trim: true
    },
    cast: [{
        type: String,
        trim: true,
        maxlength: 100
    }],
    language: {
        type: String,
        trim: true,
        default: 'english'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


movieSchema.index({ title: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const movieModel = mongoose.models.Movie || model("Movie", movieSchema);

export default movieModel;
