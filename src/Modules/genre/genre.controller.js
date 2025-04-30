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

export const updateGenre = async (req,res,next)=>{
    const {id} = req.params;
    const {name, description} = req.body;
    
    const genre = await genreModel.findById(id);
    if(!genre) {
        return next(new AppError('Genre not found', 404));
    }
    
    // Check if the new name already exists (if name is being changed)
    if(name && name.toLowerCase() !== genre.name) {
        const existingGenre = await genreModel.findOne({ name: name.toLowerCase() });
        if(existingGenre) {
            return next(new AppError('Genre with this name already exists', 409));
        }
    }
    
    // Only update slug if name is changing
    const editGenre = {
        name: name || genre.name,
        description: description !== undefined ? description : genre.description,
        updateBy: req.userId
    };
    
    if(name && name.toLowerCase() !== genre.name) {
        editGenre.slug = slugify(name, { lower: true });
    }
    
    const updatedGenre = await genreModel.findByIdAndUpdate(
        id,
        editGenre,
        {new: true}
    ).populate([
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
        message: 'Genre updated successfully',
        genre: updatedGenre
    });
};

export const deleteGenre = async (req, res, next) => {
    const {id} = req.params;
    
    const genre = await genreModel.findByIdAndDelete(id);
    
    if(!genre) {
        return next(new AppError('Genre not found', 404));
    }
    
    res.status(200).json({
        success: true,
        message: 'Genre deleted successfully'
    });
};