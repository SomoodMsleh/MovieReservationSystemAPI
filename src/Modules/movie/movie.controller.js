import {AppError} from "../../utils/appError.js";
import movieModel from "../../../DB/models/movie.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js';

export const createMovie = async (req,res,next) => {
    const {title,description, duration, releaseDate,genres,cast, contentRating, language} = req.body;
    if(!title||!description||!duration||!releaseDate||!genres||!contentRating||!cast){
        return next(new AppError("All fields are required",400));
    }
    if (!req.file) {
        return next(new AppError("Please upload an movie poster", 400));
    }
    const defaultLanguage = 'english';
    const movieLanguage = language || defaultLanguage;

    const existingMovie = await movieModel.findOne({ title: title.toLowerCase() });
    if(existingMovie){
        return next(new AppError("Movie with this title already exists", 409));
    }
    const slug = slugify(title,{lower: true });
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `/${process.env.APP_NAME}/moviesPoster//${title}`,
            transformation: [
                { width: 400, height: 400, crop: "fill" }, // Resize to standard profile image size
                { quality: "auto" }                       // Optimize quality
            ]
    });
    const posterImage = { secure_url, public_id };
    const movie = await movieModel.create({
        title:title?.toLowerCase(),slug,description,duration,
        posterImage,releaseDate: new Date(releaseDate),genres,
        contentRating,cast,language: movieLanguage?.toLowerCase()
    });
    
    return res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie
    });
};

