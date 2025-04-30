import cors from "cors";
import {AppError} from './utils/appError.js';
import connectDB from "../DB/connection.js";
import authRouter from './Modules/auth/auth.router.js';
import cookieParser from "cookie-parser";
import adminRouter from "./Modules/admin/admin.router.js";
import userRouter from "./Modules/user/user.router.js";
import genreRouter from './Modules/genre/genre.router.js';
import movieRouter from './Modules/movie/movie.router.js';
const initApp = (app,express)=>{
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    connectDB();
    
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"Welcome ...."});
    });
    
    app.use('/auth',authRouter);
    app.use('/admin',adminRouter);
    app.use('/user',userRouter);
    app.use('/genre',genreRouter);
    app.use('/movie',movieRouter);

    app.use((req,res,next) => {
        return next(new AppError("page not found",400));
    });
};

export default initApp;