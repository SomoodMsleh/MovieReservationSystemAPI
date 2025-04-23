import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js";

export const getAllUsers = async (req, res,next) => {
    const users = await userModel.find({ role: 'user' }).select(['_id','username','email','firstName','lastName','phoneNumber','gender' , 'isActive']);
    res.status(200).json({ success: true, users});
};

export const getUserById = async (req, res, next) => {
    const  {id} = req.params;
    const user = await userModel.findOne({ _id:id, role: 'user' }).select(['_id','username','email','firstName','lastName','phoneNumber','gender' , 'isActive','lastLogin']);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ success: true, user });
};

export const toggleUserStatus = async (req, res, next) => {
    const  {id} = req.params;
    const user = await userModel.findById(id);
    if (!user || user.role !== 'user') {
        return next(new AppError('User not found', 404));
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User is now ${user.isActive ? 'active' : 'inactive'}` });
};
