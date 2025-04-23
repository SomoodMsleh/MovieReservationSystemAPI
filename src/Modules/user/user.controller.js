import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js";

export const getAllUsers = async (req, res,next) => {
    const users = await userModel.find({ role: 'user' }).select(['_id','username','email','firstName','lastName','phoneNumber','gender' , 'isActive']);
    res.status(200).json({ success: true, users});
};

