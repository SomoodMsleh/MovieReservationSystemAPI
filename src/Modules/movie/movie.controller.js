import {AppError} from "../../utils/appError.js";
import movieModel from "../../../DB/models/movie.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js';
import genreModel from '../../../DB/models/genre.model.js'
import { json } from "express";

export const createMovie = async (req,res,next) => {
    const {title,description, duration, releaseDate,genres,cast, contentRating, language} = req.body;
    if(!title||!description||!duration||!releaseDate||!genres||!contentRating||!cast){
        return next(new AppError("All fields are required",400));
    }
    const genres_ids = [];
    for (const name of genres){
        const genre = await genreModel.findOne({name:name.toLowerCase()});
        if(!genre){
            return next(new AppError(`Genre '${name}' not found`,400));
        }
        genres_ids.push(genre._id);
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
        posterImage,releaseDate: new Date(releaseDate),genres:genres_ids,
        contentRating,cast,language: movieLanguage?.toLowerCase()
    });
    
    return res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie
    });
};

export const getAllMovie = async (req,res,next)=>{

};

export const getMovieById = async (req,res,next)=>{
    const { id } = req.params;
    const movie = await movieModel.findById(id).populate('genres', 'name');
    if (!movie) {
        return next(new AppError("Movie not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: { movie }
    });
};
