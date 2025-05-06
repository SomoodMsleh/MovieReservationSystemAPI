import {AppError} from "../../utils/appError.js";
import movieModel from "../../../DB/models/movie.model.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js';
import genreModel from '../../../DB/models/genre.model.js'

export const createMovie = async (req,res,next) => {
    const {title,description, duration, releaseDate,genres,cast, contentRating, language,trailerUrl} = req.body;
    if(!title||!description||!duration||!releaseDate||!genres||!contentRating||!cast||!trailerUrl){
        return next(new AppError("All fields are required",400));
    }
    if (!req.file) {
        return next(new AppError("Please upload an movie poster", 400));
    }
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
    const genres_ids = [];
    for (const name of genres){
        const genre = await genreModel.findOne({name:name.toLowerCase()});
        if(!genre){
            return next(new AppError(`Genre '${name}' not found`,400));
        }
        genres_ids.push(genre._id);
    }
    const defaultLanguage = 'english';
    const movieLanguage = language || defaultLanguage;
    const movie = await movieModel.create({
        title:title?.toLowerCase(),slug,description,duration,
        posterImage,trailerUrl,releaseDate: new Date(releaseDate),genres:genres_ids,
        contentRating,cast,language: movieLanguage?.toLowerCase()
    });
    
    return res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie
    });
};

export const getAllMovie = async (req,res,next)=>{
    const { page = 1, limit = 10, sort, title, genre, releaseYear } = req.query;
    const query = {};
    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }
    if (genre) {
        const genreDoc = await genreModel.findOne({ name: { $regex: genre, $options: 'i' } });
        if (genreDoc) {
            query.genres = genreDoc._id;
        } else {
            query.genres = null; // Will return empty result
        }
    }

    if (releaseYear) {
        const startDate = new Date(`${releaseYear}-01-01`);
        const endDate = new Date(`${releaseYear}-12-31`);
        query.releaseDate = { $gte: startDate, $lte: endDate };
    }
    const sortOptions = sort ? sort.split(',').reduce((acc, sortItem) => {
        const [field, order] = sortItem.split(':');
        acc[field] = order === 'desc' ? -1 : 1;
        return acc;
    }, {}) : { releaseDate: -1 };
    query.isActive = 'true';
    const movies = await movieModel.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('genres', 'name'); 

    const totalMovies = await movieModel.countDocuments(query);
    
    res.status(200).json({
        status: "success",
        results: movies.length,
        pagination: {
            totalMovies,
            totalPages: Math.ceil(totalMovies / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit)
        },
        data: { movies }
    });

};

export const getMovieById = async (req,res,next)=>{
    const { id } = req.params;
    const movie = await movieModel.findById(id).populate('genres', 'name');
    if (!movie || !movie.isActive) {
        return next(new AppError("Movie not found", 404));
    }
    res.status(200).json({
        success: true,
        data: { movie }
    });
};

export const updateMovie = async (req,res,next)=>{
    const { id } = req.params;
    const { title, description, duration, releaseDate, genres, contentRating, cast, language,trailerUrl } = req.body;
    const movie = await movieModel.findById(id);
    if (!movie) {
        return next(new AppError("Movie not found", 404));
    }
    let slug;
    if (title && title.toLowerCase() !== movie.title) {
        const existingMovie = await movieModel.findOne({ title: title.toLowerCase() });
        if (existingMovie && existingMovie._id.toString() !== id) {
            return next(new AppError("Movie with this title already exists", 409));
        }
        slug =  slugify(title, { lower: true, strict: true });
    }
    let posterImage;
    if(req.file){
        try {
            await cloudinary.uploader.destroy(movie.posterImage.public_id);
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: `/${process.env.APP_NAME}/moviesPoster//${movie.title}`,
                transformation: [
                    { width: 400, height: 400, crop: "fill" }, // Resize to standard profile image size
                    { quality: "auto" }                       // Optimize quality   
            ]});
            posterImage = { secure_url, public_id };
        }catch(error){
            console.error("Error deleting previous image from cloudinary:", error);
        }
    }
    let genres_ids = [];
    if(genres){
        for (const name of  genres){
            const genre = await genreModel.findOne({name:name.toLowerCase()});
            if(!genre){
                return next(new AppError(`Genre '${name}' not found`,400));
            }
            genres_ids.push(genre._id);
        }
    }else{
        genres_ids=movie.genres;
    }

    const movieUpdate = await movieModel.findByIdAndUpdate(id,{
        title: title|| movie.title,
        description:description  || movie.description,
        slug: slug || movie.slug,
        duration:duration || movie.duration,
        posterImage:posterImage||movie.posterImage,
        trailerUrl:trailerUrl || movie.trailerUrl,
        releaseDate:releaseDate || movie.releaseDate,
        genres:genres_ids,
        contentRating:contentRating || movie.contentRating,
        cast: cast || movie.cast,
        language:language || movie.language,

    },
    { new: true, runValidators: true }).populate('genres', 'name');

    res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: { movieUpdate}
    });
};

export const deleteMovie = async (req,res,next)=>{
    const { id } = req.params;
    const movie = await movieModel.findById(id);
    if (!movie) {
        return next(new AppError("Movie not found", 404));
    }
    await cloudinary.uploader.destroy(movie.posterImage.public_id);

    await movieModel.findByIdAndDelete(id);
    return res.status(200).json({
        success: true,
        message: "Movie deleted successfully"
    });
};

export const toggleMovieStatus = async (req,res,next)=>{
    const  {id} = req.params;
    const movie = await movieModel.findById(id);
    if(!movie){
        return next(new AppError('Movie not found', 404));
    }
    movie.isActive = !movie.isActive;
    await movie.save();
    res.status(200).json({ success: true, message: `Movie is now ${movie.isActive ? 'active' : 'inactive'}` });
};


export const getShowtimeByMovie = async (req, res, next) => {
    const { id } = req.params;
    

    const movie = await movieModel.findById(id);
    if (!movie) {
        return next(new AppError('Movie not found', 404));
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const showtimes = await showtimeModel.find({ 
        movieId: id,
        startTime: { $gte: now },
        isActive: true
    })
    .populate('theaterId', 'name location')
    .sort({ startTime: 1 });
    
    const groupedShowtime = {};
    
    showtimes.forEach(showtime => {
        const date = showtime.startTime.toISOString().split('T')[0];
        if (!groupedShowtime[date]) {
            groupedShowtime[date] = [];
        }
        groupedShowtime[date].push(showtime);
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            movie: {
                id: movie._id,
                title: movie.title,
                posterImage: movie.posterImage
            },
            dates: Object.keys(groupedShowtime),
            showtimes: groupedShowtime
        }
    });
};