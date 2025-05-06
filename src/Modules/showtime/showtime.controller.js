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

export const getShowtimeByDate = async (req, res, next) => {
    const { date } = req.params;
    
    if (!date || isNaN(new Date(date).getTime())) {
        return next(new AppError('Invalid date format. Please use YYYY-MM-DD', 400));
    }
    
    const showtime = await showtimeModel.findByDate(date);
    
    res.status(200).json({
        status: 'success',
        results: showtime.length,
        data: showtime
    });
};

export const getShowtimeById = async (req, res, next) => {
    const { id } = req.params;
    
    const showtime = await showtimeModel.findById(id)
        .populate('movieId')
        .populate('theaterId');
    
    if (!showtime) {
        return next(new AppError('Showtime not found', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: showtime
    });
};

export const updateShowtime = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;
    
    const showtime = await showtimeModel.findById(id);
    if (!showtime) {
        return next(new AppError('Showtime not found', 404));
    }
    
    let needToRecalculateEndTime = false;
    let movieForDuration;
    
    if (updates.movieId) {
        const movie = await movieModel.findById(updates.movieId);
        if (!movie) {
            return next(new AppError('Movie not found', 404));
        }
        if (!movie.isActive) {
            return next(new AppError('Cannot assign an inactive movie', 400));
        }
        if (!movie.duration || movie.duration <= 0) {
            return next(new AppError('Movie has invalid duration', 400));
        }
        
        movieForDuration = movie;
        needToRecalculateEndTime = true;
    }
    
    if (updates.theaterId) {
        const theater = await theaterModel.findById(updates.theaterId);
        if (!theater) {
            return next(new AppError('Theater not found', 404));
        }
        if (!theater.isActive) {
            return next(new AppError('Cannot assign an inactive theater', 400));
        }
    }
    
    if (updates.startTime || needToRecalculateEndTime) {

        const startDateTime = updates.startTime ? new Date(updates.startTime) : showtime.startTime;
        
        if (!movieForDuration && needToRecalculateEndTime) {
            movieForDuration = await movieModel.findById(updates.movieId || showtime.movieId);
            if (!movieForDuration) {
                return next(new AppError('Associated movie not found', 404));
            }
        }
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + 
            (movieForDuration ? movieForDuration.duration : 0) + 30); // Adding 30 minutes for cleanup/ads
        
        updates.endTime = endDateTime;
        
        const theaterId = updates.theaterId || showtime.theaterId;
        

        const conflictingShowtime = await showtimeModel.findOne({
            _id: { $ne: id },
            theaterId,
            isActive: true,
            $or: [
                { startTime: { $lte: startDateTime }, endTime: { $gt: startDateTime } },
                { startTime: { $lt: endDateTime }, endTime: { $gte: endDateTime } },
                { startTime: { $gte: startDateTime }, endTime: { $lte: endDateTime } }
            ]
        });
        
        if (conflictingShowtime) {
            return next(new AppError('Schedule conflict with an existing showtime in this theater', 400));
        }
    }
    

    const updatedShowtime = await showtimeModel.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
    )
    .populate('movieId', 'title duration')
    .populate('theaterId', 'name');
    
    res.status(200).json({
        status: 'success',
        message: 'Showtime updated successfully',
        data: updatedShowtime
    });
};

export const deleteShowtime = async (req, res, next) => {
    const { id } = req.params;
    
    const showtime = await showtimeModel.findById(id);
    if (!showtime) {
        return next(new AppError('Showtime not found', 404));
    }
    
    await showtimeModel.findByIdAndDelete(id);
    res.status(200).json({
        status: 'success',
        message: 'Showtime deleted successfully'
    });
};

export const toggleShowtimeStatus = async (req,res,next)=>{
    const  {id} = req.params;
    const showtime = await showtimeModel.findById(id);
    if(!showtime){
        return next(new AppError('Showtime not found', 404));
    }
    showtime.isActive = !showtime.isActive;
    await showtime.save();
    res.status(200).json({ success: true, message: `Showtime is now ${showtime.isActive ? 'active' : 'inactive'}` });
};

