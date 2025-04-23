import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const genreModel = mongoose.models.Genre || model("Genre", genreSchema);

export default genreModel;