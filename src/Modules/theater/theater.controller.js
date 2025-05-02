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
    req.body.slug = slugify(name,{lower: true });
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
};

export const  getALLTheater = async (req,res,next)=>{
    const { page = 1, limit = 10,name, city, facilities } = req.query;
    const query = {};
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (city) {
        query["address.city"] = { $regex: city, $options: "i" };
    }
    query.isActive = 'true';
    if (facilities) {
        const facilitiesArray = facilities.split(",");
        query.facilities = { $all: facilitiesArray };
    }
    const skip = (page - 1) * limit;
    
    // Find theaters
    const theaters = await theaterModel
        .find(query)
        .select("-seatingLayout.configuration") 
        .limit(Number(limit))
        .skip(skip)
        .sort({ createdAt: -1 }
    ).populate('manager','username');

    const totalTheaters = await theaterModel.countDocuments(query);
    
    res.status(200).json({
        success:true,
        results: theaters.length,
        totalPages: Math.ceil(totalTheaters / limit),
        currentPage: Number(page),
        data: theaters
    });

};



export const  getTheaterById = async (req,res,next)=>{
    const { id } = req.params;
    
    const theater = await theaterModel.findById(id).populate('manager','username');
    
    if (!theater) {
        return next(new AppError("Theater not found", 404));
    }
    
    res.status(200).json({
        success: true,
        data: theater
    });
};

export const updateTheater = async (req,res,next)=>{
    const {id} = req.params;
    const { name, location,address, totalSeats, seatingLayout,facilities,phone,username} = req.body;
    const theater = await theaterModel.findById(id);
    if (!theater) {
        return next(new AppError("Theater not found", 404));
    }
    if ((req.user.role !== "admin" || req.user._id !== theater.manager) && req.user.role !== "superAdmin") {
        return next(new AppError("Not authorized to update theaters", 403));
    }
    let slug;
    if(name){
        const existTheater = await theaterModel.findOne({name});
        if(existTheater || name === theater.name){
            return next(new AppError("Theater with this name already exists", 409));
        }
        slug = slugify(name,{lower: true });
    }
    let manger ;
    if(username && req.user.role === "superAdmin"){
        const user = await userModel.findOne({username,role:"admin"});
        if(!user || !user.isActive){
            return next(new AppError("Not authorized to be manager", 403));
        }
        manager = user._id;
        req.body.contactInfo = {
            phone: phone || user.phoneNumber || undefined,
            email: user.email
        }
    }
    if(!req.body.contactInfo){
        req.body.contactInfo = {
            phone: phone || theater.contactInfo.phone || undefined,
            email: theater.contactInfo.email,
        }
    }
    

    const updatedTheater = await theaterModel.findByIdAndUpdate(id,{
        name:name.toLowerCase() || theater.name,
        slug:slug || theater.slug,
        location:location || theater.location,
        address:address || theater.address,
        totalSeats:totalSeats || theater.totalSeats,
        seatingLayout:seatingLayout || theater.seatingLayout,
        facilities:facilities||theater.facilities,
        manager:manger||theater.manager,
        contactInfo:req.body.contactInfo
    },{new:true , runValidators: true }).populate('manager', 'username');

    return res.status(200).json({
        success: true,
        message: "Theater updated successfully",
        theater: updatedTheater
    });
};

export const deleteTheater = async (req,res,next)=>{
    const { id } = req.params;
    if ((req.user.role !== "admin" || req.user._id !== theater.manager) && req.user.role !== "superAdmin") {
        return next(new AppError("Not authorized to update theaters", 403));
    }
    const theater = await theaterModel.findByIdAndDelete(id);
    
    if (!theater) {
        return next(new AppError("Theater not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "Theater deleted successfully",
    });
};

export const toggleTheaterStatus = async (req,res,next)=>{
    const  {id} = req.params;
    const theater = await theaterModel.findById(id);
    if(!theater){
        return next(new AppError('theater not found', 404));
    }
    theater.isActive = !theater.isActive;
    await theater.save();
    res.status(200).json({ success: true, message: `Theater is now ${theater.isActive ? 'active' : 'inactive'}` });

};