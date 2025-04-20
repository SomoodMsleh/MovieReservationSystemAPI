import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:30,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:3,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        enum: ["male", "female"],
    },
    role:{
        type:String,
        required:true,
        enum:["user", "admin", "superAdmin"],
        default:"user"
    },
    isEmailConfirmed:{
        type:Boolean,
        default:false,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    sendCode:{
        type:String,
        default:null,   
    }
},{timestamps:true});


const userModel = mongoose.models.User || model("User",userSchema);

export default userModel;