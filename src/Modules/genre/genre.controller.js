import {AppError} from "../../utils/appError.js"
import genreModel from "../../../DB/models/genre.model.js"
import slugify from "slugify";

export const createGenre = async (req,res,next)=>{
    const {name} = req.body;
    if(!name){
        return next(new AppError('Genre name is required', 400));
    }
    const existingGenre = await genreModel.findOne({ name: name.toLowerCase() });
    if(existingGenre) {
        return next(new AppError('Genre already exists', 409));
    }
    req.body.slug = slugify(name,{ lower: true });
    req.body.createdBy = req.userId;
    req.body.updateBy = req.userId;
    const genre = await genreModel.create(req.body);
    res.status(201).json({
        success: true,
        message: 'Genre created successfully',
        genre
    });
} ;

export const getAllGenreDetails = async (req,res,next)=>{
    const genres = await genreModel.find().populate([
        {
            path: 'createdBy',
            select: 'username email'
        },
        {
            path: 'updateBy',
            select: 'username email'
        }
    ]);
    
    res.status(200).json({
        success: true,
        count: genres.length,
        genres
    });
};

export const getAllGenre= async (req,res,next)=>{
    const genres = await genreModel.find().select(['name','description']);
    
    res.status(200).json({
        success: true,
        count: genres.length,
        genres
    });
};

export const getGenreById= async (req,res,next)=>{
    const {id} = req.params;
    
    const genre = await genreModel.findById(id).populate([
        {
            path: 'createdBy',
            select: 'username email'
        },
        {
            path: 'updateBy',
            select: 'username email'
        }
    ]);
    
    if(!genre) {
        return next(new AppError('Genre not found', 404));
    }
    
    res.status(200).json({
        success: true,
        genre
    });
};

