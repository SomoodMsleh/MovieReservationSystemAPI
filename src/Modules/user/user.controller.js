import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js";
import bcryptjs from 'bcryptjs';
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


export const deleteUser = async (req, res, next) => {
    const  {id} = req.params;
    const user = await userModel.findOneAndDelete({ _id: id, role: 'user' });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ success: true, message: 'User deleted' });
};


export const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId
    const user = await userModel.findById(userId);
    if(!user){
        return next(new AppError('User not found', 404));
    }
    const valid = await bcryptjs.compare(currentPassword, user.password);
    if (!valid){
        return next(new AppError('Current password is incorrect', 401));
    }
    if (await bcryptjs.compare(newPassword, user.password)) {
        return next(new AppError('New password must be different', 400));
    }
    const hash = await bcryptjs.hash(newPassword, parseInt(process.env.SALT));
    user.password = hash;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
};