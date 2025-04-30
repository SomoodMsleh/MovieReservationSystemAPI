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

