import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js"
import bcryptjs from 'bcryptjs';


export const updateUserRole = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
        return next(new AppError("Invalid role. Allowed roles: 'user', 'admin'", 400));
    }
    const user = await userModel.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const issues = [];

    if (!user.isEmailConfirmed) {
        issues.push("Email is not confirmed");
    }

    if (!user.isActive) {
        issues.push("Account is inactive");
    }

    if (user.role === role) {
        issues.push(`User already has the '${role}' role`);
    }

    if (issues.length) {
        return next(new AppError(issues.join(". "), 400));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
        success: true,
        message: `Role updated to '${role}'`,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.role,
            isActive: user.isActive,
        },
    });
};


export const getAdminById = async (req,res,next)=>{
    const { id } = req.params;
    const admin = await userModel.findOne({ _id: id, role: "admin" }).select("-password");
    if (!admin) {
        return next(new AppError("Admin not found", 404));
    }
    res.status(200).json({ success: true, admin});
};

export const getAllAdmins = async (req, res) => {
    const admins = await userModel.find({ role: "admin" }).select("-password");
    res.status(200).json({ success: true, admins });
};


export const toggleAdminStatus = async (req, res, next) => {
    const { id } = req.params;
    const admin = await userModel.findOne({ _id: id, role: "admin" });
    if (!admin) {
        return next(new AppError("Admin not found", 404));
    }
    admin.isActive = !admin.isActive;
    await admin.save();
    res.status(200).json({
        success: true,
        message: `Admin is now ${admin.isActive ? "active" : "inactive"}`,
        admin,
    });
};

export const deleteAdmin = async (req, res, next) => {
    const { id } = req.params;
    const admin = await userModel.findOneAndDelete({ _id: id, role: "admin" });
    if (!admin) {
        return next(new AppError("Admin not found", 404));
    }
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
};


export const forceResetPassword = async (req, res, next) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const user = await userModel.findById(id);
    if (!user || user.role !== "admin") {
        return next(new AppError("Admin not found", 404));
    }
    const hashed = await bcryptjs.hash(newPassword, parseInt(process.env.SALT));
    user.password = hashed;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successfully" });
};