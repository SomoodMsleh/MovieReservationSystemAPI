import {AppError} from "../../utils/appError.js";
import theaterModel from "../../../DB/models/theater.model.js";
import userModel from "../../../DB/models/user.model.js";
import slugify from "slugify";



export const createTheater = async (req,res,next)=>{
    const {name,username} = req.body;
    if(req.user.role !== 'superAdmin'){
        return next(new AppError("Not authorized to create theaters", 403));
    }
    const user = await userModel.findOne({username,role:'admin'});
    if(!user || !user.isActive){
        return next(new AppError("Not authorized to be manager", 403));
    }

    const existTheater = await theaterModel.findOne({name});
    if(existTheater){
        return next(new AppError("Theater with this name already exists", 409));
    }
    req.body.slug = slugify(name);
    req.body.manager = user._id;
    req.body.contactInfo = {
        phone: user.phoneNumber || undefined,
        email: user.email
    };
    
    const theater = await theaterModel.create(req.body);
    
    res.status(201).json({
        success: true,
        message: "Theater created successfully",
        data: theater
    });
}

