import cors from "cors";
import {AppError} from './utils/appError.js';
import connectDB from "../DB/connection.js";
import authRouter from './Modules/auth/auth.router.js';
import cookieParser from "cookie-parser";
import superAdminRouter from "./Modules/superAdmin/superAdmin.router.js"
const initApp = (app,express)=>{
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    connectDB();
    
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"Welcome ...."});
    });
    app.use('/auth',authRouter);
    app.use('/superAdmin',superAdminRouter);
    app.use((req,res,next) => {
        return next(new AppError("page not found",400));
    });
};

export default initApp;