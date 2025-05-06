import showtimeModel from '../../../DB/models/showtime.model.js';
import {AppError} from "../../utils/appError.js";
import movieModel from '../../../DB/models/movie.model.js';
import theaterModel from '../../../DB/models/theater.model.js';


export const createShowtime = async (req, res, next) => {
    const {movieId, theaterId, startTime, price } = req.body;

    const movie = await movieModel.findById(movieId);
    if (!movie) {
        return next(new AppError('Movie not found', 404));
    }
    
    if (!movie.isActive) {
        return next(new AppError('Cannot create showtime for an inactive movie', 400));
    }

    if (!movie.duration || movie.duration <= 0) {
        return next(new AppError('Movie has invalid duration', 400));
    }

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        return next(new AppError('Theater not found', 404));
    }
    
    if (!theater.isActive) {
        return next(new AppError('Cannot create showtime in an inactive theater', 400));
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + movie.duration + 30); // Adding 30 minutes for cleanup/ads
    
    const conflictingShowtime = await showtimeModel.findOne({
        theaterId,
        isActive: true,
        $or: [
            // New showtime starts during an existing showtime
            { startTime: { $lte: startDateTime }, endTime: { $gt: startDateTime } },
            // New showtime ends during an existing showtime
            { startTime: { $lt: endDateTime }, endTime: { $gte: endDateTime } },
            // New showtime encompasses an existing showtime
            { startTime: { $gte: startDateTime }, endTime: { $lte: endDateTime } }
        ]
    });

    if (conflictingShowtime) {
        return next(new AppError('Schedule conflict with an existing showtime in this theater', 400));
    }

    const newShowtime = await showtimeModel.create({
        movieId,
        theaterId,
        startTime: startDateTime,
        endTime: endDateTime,
        price
    });

    const showtime = await showtimeModel
    .findById(newShowtime._id)
    .populate({ path: 'movieId', select: 'title' })
    .populate({ path: 'theaterId', select: 'name' });


    res.status(201).json({
        success:true,
        message: 'Showtime created successfully',
        showtime
    });

};


export const getAllShowtime = async (req,res,next) =>{
    try {
        const { movie, theater, startAfter, startBefore} = req.query;
        const filter = {};
        

        if (movie) {
            const foundMovie = await movieModel.findOne({ 
                title: new RegExp(movie, 'i') 
            });
            
            if (!foundMovie) {
                return res.status(404).json({
                    status: 'error',
                    message: `No movie found with title: ${movie}`
                });
            }
            
            filter.movieId = foundMovie._id;
        }
        
        
        if (theater) {
            const foundTheater = await theaterModel.findOne({ 
                name: new RegExp(theater, 'i')
            });
            if (!foundTheater) {
                return res.status(404).json({
                    status: 'error',
                    message: `No theater found with name: ${theater}`
                });
            }
            filter.theaterId = foundTheater._id;
        }
        
        
        if (startAfter || startBefore) {
            filter.startTime = {};
            if (startAfter) {
                filter.startTime.$gte = new Date(startAfter);
            }
            if (startBefore) {
                filter.startTime.$lte = new Date(startBefore);
            }
        }
        
        filter.isActive = true;
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const totalDocs = await showtimeModel.countDocuments(filter);
        
        const showtime = await showtimeModel.find(filter)
            .populate('movieId', 'title posterImage duration')
            .populate('theaterId', 'name location')
            .sort({ startTime: 1 })
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            status: 'success',
            results: showtime.length,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalDocs / limit),
                totalResults: totalDocs,
                hasNextPage: page * limit < totalDocs,
                hasPrevPage: page > 1
            },
            data: showtime
        });
    } catch (error) {
        next(error);
    }
};