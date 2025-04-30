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
        type: String,
        required: true,
        lowercase: true,
        unique: true
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
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    releaseDate: {
        type: Date,
        required: true
    },
    genres: [{
        type: Types.ObjectId,
        ref: "Genre",
        required: true
    }],
    contentRating:{
        type: String, 
        enum: ['G', 'PG', 'PG-13', 'R', 'NC-17']
    },
    cast: [{
        type: String,
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
}, { timestamps: true });


movieSchema.index({ title: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
movieSchema.index({ slug: 1 }, { unique: true });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ isActive: 1});

const movieModel = mongoose.models.Movie || model("Movie", movieSchema);

export default movieModel;
