import { AppError } from "./appError.js";
export const asyncHandler = (fun)=>{
    return async (req,res,next)=>{
        try{
            return await fun(req,res,next);
        }catch(error){
            return next(new AppError(`server error : ${error.stack}`,500));
        }
    }
}