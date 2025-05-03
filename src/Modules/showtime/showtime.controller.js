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
