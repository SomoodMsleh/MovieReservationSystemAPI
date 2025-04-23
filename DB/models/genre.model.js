import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 300
    }
}, { timestamps: true });
// Case-insensitive unique index
genreSchema.index({ name: 1 },{unique: true,collation: { locale: 'en', strength: 2 }});

const genreModel = mongoose.models.Genre || model("Genre", genreSchema);

export default genreModel;