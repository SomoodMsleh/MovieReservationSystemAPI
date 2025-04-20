import cors from "cors";
import {AppError} from './utils/appError.js';
import connectDB from "../DB/connection.js";
const initApp = (app,express)=>{
    app.use(express.json());
    app.use(cors());
    connectDB();
    
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"Welcome ...."});
    });
    app.use((req,res,next) => {
        return next(new AppError("page not found",400));
    });
};

export default initApp;