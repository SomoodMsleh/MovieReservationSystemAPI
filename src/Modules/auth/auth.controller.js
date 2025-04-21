import userModel from '../../../DB/models/user.model.js';
import bcryptjs from 'bcryptjs';
import {generateTokenAndSetCookie} from "../../utils/generateTokenAndSetCookie.js";
import {customAlphabet} from "nanoid";
import {sendEmail} from "../../utils/sendEmail.js";
import { verificationEmailTemplate } from "../../utils/emailTemplates/verificationEmailTemplate.js"
export const register = async (req,res)=>{
    const {username,email,password,firstName,lastName} = req.body;
    if (!email || !password || !username ||!firstName||!lastName) {
        return next(new AppError("All fields are required",400));
    }

    const userAlreadyExists = await userModel.findOne({ username });
    if (userAlreadyExists) {
        return next(new AppError("User already exists",400));
	}
    
    const emailAlreadyExists = await userModel.findOne({ email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailAlreadyExists || !emailRegex.test(email)) {
        return next(new AppError("Invalid email",400));
    }
	if (password.length < 6) {
		return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
	}

    const hashPassword = bcryptjs.hashSync(password,parseInt(process.env.SALT));
    const verificationCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)();
    const verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const user = await userModel.create({username,email,firstName,lastName,password:hashPassword,verificationCode,verificationCodeExpiresAt});
    const userInfo = {_id:user._id,email,username,role:user.role};
    const token = generateTokenAndSetCookie(res,userInfo);
    const subject = "Verify your email";
    const html = verificationEmailTemplate.replace("{verificationCode}", verificationCode);
    await sendEmail(email,subject,html);
    return res.status(201).json({success: true,message: "User created successfully",token});

}