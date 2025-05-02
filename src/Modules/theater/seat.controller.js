import {AppError} from "../../utils/appError.js";
import seatModel from "../../../DB/models/seat.model.js";
import theaterModel from "../../../DB/models/theater.model.js";

export const configureTheaterSeats = async(req,res,next)=>{
    const { id: theaterId } = req.params;
    const { seats } = req.body;
    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        return next(new AppError("Theater not found", 404));
    }

    if (req.user.role !== "superAdmin" &&  (req.user.role !== "admin" || req.user._id.toString() !== theater.manager?.toString())) {
        return next(new AppError("Not authorized to configure seats for this theater", 403));
    }

    try {
        const seatsWithTheaterId = seats.map(seat => ({
            ...seat,
            theaterId
        }));
        const createdSeats = await seatModel.insertMany(seatsWithTheaterId, { ordered: false });
        const populatedSeats = await seatModel.find({
            _id: { $in: createdSeats.map(seat => seat._id) }
        }).populate('theaterId', 'name');
        return res.status(201).json({
            success:true,
            message: "Seats configured successfully",
            count: populatedSeats.length,
            createdSeats:  populatedSeats.map(seat => ({
                theaterName: seat.theaterId.name,
                seatLabel: seat.seatLabel,
                type: seat.type,
                price: seat.price,
                isActive: seat.isActive
            }))
        });
    }catch(error){
        if (error.code === 11000) {
            return next(new AppError("Some seats already exist. Please check row and number combinations.", 409));
        }
        return next(error);
    }
};

export const getTheaterSeats = async (req, res, next) => {
    const { id: theaterId } = req.params;
    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        return next(new AppError("Theater not found", 404));
    }
    const seats = await seatModel.find({ theaterId }).sort({ row: 1, number: 1 });
    return res.status(200).json({
        success:true,
        message: "Seats retrieved successfully",
        count: seats.length,
        data: seats
    });
};