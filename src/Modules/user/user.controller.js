import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js";
import cloudinary from '../../utils/cloudinary.js'
import bcryptjs from 'bcryptjs';

export const getAllUsers = async (req, res,next) => {
    const users = await userModel.find({ role: 'user' }).select(['_id','username','email','firstName','lastName','phoneNumber','gender' , 'isActive']);
    res.status(200).json({ success: true,count: users.length, users});
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
    const previousStatus = user.isActive;
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
    res.status(200).json({ success: true, message: 'User deleted successfully' });
};


export const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId).select('+password');
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

export const getUserStats = async (req, res, next) => {
    const totalUsers = await userModel.countDocuments({ role: 'user' });
    const activeUsers = await userModel.countDocuments({ role: 'user', isActive: true });
    const inactiveUsers = await userModel.countDocuments({ role: 'user', isActive: false });
    const newUsers = await userModel.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Created in last 30 days
    });
    const recentlyActiveUsers = await userModel.countDocuments({
        role: 'user',
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Active in last 7 days
    });
        
    res.status(200).json({
        success: true,
        stats: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            new: newUsers,
            recentlyActive: recentlyActiveUsers
        }
    });
};

export const uploadProfileImage = async(req,res,next) => {
    const userId = req.userId;
    if (!req.file) {
        return next(new AppError("Please upload an image", 400));
    }
    const user = await userModel.findById(userId);
    if(user == null){
        return next(new AppError("user not found",404));
    }
    if(user.profileImage && user.profileImage.public_id){
        try {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
            user.profileImage.secure_url = undefined;
            user.profileImage.public_id = undefined;
        }catch (error) {
            console.error("Error deleting previous image from cloudinary:", error);
            // Continue with the upload even if delete fails
        }
    }
    // Upload to cloudinary with optimized settings
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `/${process.env.APP_NAME}/users/profileImages/${user.username}`,
        transformation: [
            { width: 400, height: 400, crop: "fill" }, // Resize to standard profile image size
            { quality: "auto" }                       // Optimize quality
        ]
    });
    user.profileImage = {secure_url,public_id};
    await user.save();
    return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        profileImage: {
            url: secure_url
        }
    });
};