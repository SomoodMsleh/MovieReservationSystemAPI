import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address"
        ]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    firstName:{
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName:{
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    phoneNumber:{
        type:String,
        trim: true
    },
    gender:{
        type:String,
        enum: ["male", "female", "other"],
    },
    role:{
        type:String,
        enum:["user", "admin", "superAdmin"],
        default:"user"
    },
    profileImage:{
        type:Object,
    },
    isEmailConfirmed:{
        type:Boolean,
        default:false,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
	verificationCode: String,
	verificationCodeExpiresAt: Date,
},{
    timestamps:true,
});


// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });


const userModel = mongoose.models.User || model("User",userSchema);

export default userModel;