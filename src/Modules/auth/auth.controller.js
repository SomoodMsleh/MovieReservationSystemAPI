import userModel from '../../../DB/models/user.model.js';
import bcryptjs from 'bcryptjs';
import {generateTokenAndSetCookie} from "../../utils/generateTokenAndSetCookie.js";
import {customAlphabet} from "nanoid";
import {sendEmail} from "../../utils/sendEmail.js";
import { verificationEmailTemplate,welcomeEmailTemplate } from "../../utils/emailTemplates/verificationEmailTemplate.js";

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
    req.body.verificationCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)();
    req.body.verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    req.body.password = hashPassword;
    const user = await userModel.create(req.body);
    const subject = "Verify your email";
    const html = verificationEmailTemplate.replace("{verificationCode}", req.body.verificationCode);
    await sendEmail(email,subject,html);
    return res.status(201).json({success: true,message: "User created successfully",user: {...user._doc,password: undefined,},});

};

export const  verifyEmail = async (req,res,next)=>{
    const {verificationCode} = req.body;
    const user = await userModel.findOne({verificationCode,verificationCodeExpiresAt:{$gt:Date.now()}});
    if(!user){
        return next(new AppError("Invalid or expired verification code",400));
    }
    user.isEmailConfirmed = true;
    user.verificationCode = undefined;
	user.verificationCodeExpiresAt = undefined;
    await user.save();

    const subject = `Welcome to ${process.env.APP_NAME} – Email Verified Successfully`;
    const html = welcomeEmailTemplate(user.username);;

    await sendEmail(user.email,subject,html);
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });    

}

export const login = async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
        return next(new AppError("Invalid credentials",400));
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
	if (!isPasswordValid) {
        return next(new AppError("Invalid credentials",400));
    }
    if(!user.isEmailConfirmed){
        return next(new AppError("Plz confirm your email",400));
    }
    if(!user.isActive){
        return next(new AppError("Your account is blocked",400));
    }
    const userInfo = {_id:user._id,email,username:user.username,role:user.role,firstName:user.firstName,lastName:user.lastName};
    const token = generateTokenAndSetCookie(res,userInfo);
    user.lastLogin = new Date();
	await user.save();

	res.status(200).json({
		success: true,
		message: "Logged in successfully",
		user: token
	});
};

export const logout = async(req,res,next)=>{
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });  
}