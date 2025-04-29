import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js"
import bcryptjs from 'bcryptjs';
import {generateTokenAndSetCookie} from "../../utils/generateTokenAndSetCookie.js";
import {customAlphabet} from "nanoid";
import {sendEmail} from "../../utils/sendEmail.js";
import { verificationEmailTemplate,welcomeEmailTemplate } from "../../utils/emailTemplates/verificationEmailTemplate.js";
import crypto from "crypto";
import {passwordResetRequestTemplate} from "../../utils/emailTemplates/passwordResetRequestTemplate.js";
import {passwordResetSuccessTemplate} from "../../utils/emailTemplates/passwordResetSuccessTemplate.js";

// Constants
const VERIFICATION_CODE_LENGTH = 8;
const VERIFICATION_CODE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_EXPIRY = 1 * 60 * 60 * 1000; // 1 hour
const PASSWORD_RESET_TOKEN_SIZE = 20;


export const register = async (req,res,next)=>{
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
    req.body.verificationCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', VERIFICATION_CODE_LENGTH)();
    req.body.verificationCodeExpiresAt = Date.now() + VERIFICATION_CODE_EXPIRY
    req.body.password = hashPassword;
    const user = await userModel.create(req.body);
    const subject = "Verify your email";
    const html = verificationEmailTemplate.replace("{verificationCode}", req.body.verificationCode);
    await sendEmail(email,subject,html);
    return res.status(201).json({success: true,message: "User created successfully",user: {_id: user._id,username: user.username,email: user.email,firstName: user.firstName,lastName: user.lastName}});

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
        message: "Email verified successfully. You can now log in.",
    });    

}

export const login = async (req,res,next)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email}).select('+password');
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
};

export const forgotPassword = async (req, res, next) => {
    const {email} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return next(new AppError("If this email exists in our system, a password reset link has been sent",404));
    }
    // Generate reset token
	const resetToken = crypto.randomBytes(PASSWORD_RESET_TOKEN_SIZE).toString("hex");
	const resetTokenExpiresAt = Date.now() + PASSWORD_RESET_EXPIRY; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    const resetURL = `${process.env.CLIENT_URL}/auth/resetPassword/${resetToken}`;
	// send email
    
    const html = passwordResetRequestTemplate.replace("{resetURL}", resetURL);
    const subject =  "Reset your password";
	await sendEmail(user.email,subject,html);

    res.status(200).json({ success: true, message: "If this email exists in our system, a password reset link has been sent" });
};

export const resetPassword = async (req, res,next) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError("Invalid or expired reset token",400));
    }
    const hashedPassword = await bcryptjs.hash(password, parseInt(process.env.SALT));
    user.password = hashedPassword;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpiresAt = undefined;
	await user.save();
    const html = passwordResetSuccessTemplate;
    
    const subject = "Password Reset Successful";
	await sendEmail(user.email,subject,html);
	res.status(200).json({ success: true, message: "Password reset successful. You can now log in with your new password." });

};

export const updateProfile = async (req,res,next)=>{
    const {firstName,lastName,phoneNumber,gender} = req.body;
    const user = await userModel.findById(req.userId);
    if (!user) {
        return next(new AppError("Invalid credentials",400));
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            gender: user.gender
        }
    });
};

export const getUserProfile = async (req, res, next) => {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.role,
            isEmailConfirmed: user.isEmailConfirmed,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    });
};
