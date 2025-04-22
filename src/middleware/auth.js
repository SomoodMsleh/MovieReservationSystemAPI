import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import userModel from "../models/user.model.js";

export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const token = req.cookies?.token;

        if (!token) {
            return next(new AppError("Not authorized, no token", 401));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded._id).select("-password");

            if (!user) {
                return next(new AppError("User not found", 404));
            }

            if (accessRoles.length && !accessRoles.includes(user.role)) {
                return next(new AppError("Invalid auth user", 403));
            }

            req.userId = user._id;
            req.user = user;

            next();
        } catch (err) {
            return next(new AppError("Invalid or expired token", 401));
        }
    };
};
