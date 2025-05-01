import { AppError } from "../utils/appError.js";

const validation = (schema)=>{
    return (req,res,next)=>{
        const inputData = {...req.body,...req.params,...req.query}
        const validationResult = schema.validate(inputData,{abortEarly:false});
        if(validationResult?.error){
            const errors = validationResult.error.details.map(e => e.message);
            return next(new AppError(errors.join(", "), 400));
        }
        next()
    };
};


export default validation;
