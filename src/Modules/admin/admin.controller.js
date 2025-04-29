import userModel from '../../../DB/models/user.model.js';
import {AppError} from "../../utils/appError.js"
import bcryptjs from 'bcryptjs';


export const updateUserRole = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.userId; 
    if (!["user", "admin"].includes(role)) {
        return next(new AppError("Invalid role. Allowed roles: 'user', 'admin'", 400));
    }
    const user = await userModel.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (user.role === "superAdmin") {
        return next(new AppError("Cannot modify a superAdmin's role", 403));
    }
    if (user._id.toString() === adminId) {
        return next(new AppError("You cannot modify your own role", 403));
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
    const previousRole = user.role;
    user.role = role;
    await user.save();

    res.status(200).json({
        success: true,
        message: `Role updated from '${previousRole}' to '${role}'`,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
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
    res.status(200).json({ success: true, admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phoneNumber: admin.phoneNumber,
        gender: admin.gender,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
    }});
};

export const getAllAdmins = async (req, res,next) => {
    const admins = await userModel.find({ role: "admin" }).select("-password").sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ success: true, count: admins.length, admins });
};


export const toggleAdminStatus = async (req, res, next) => {
    const { id } = req.params;
    const adminId = req.userId; // Current admin making the change

    const admin = await userModel.findOne({ _id: id, role: "admin" });
    if (!admin) {
        return next(new AppError("Admin not found", 404));
    }
    if (admin._id.toString() === adminId) {
        return next(new AppError("You cannot modify your own active status", 403));
    }
    
    const previousStatus = admin.isActive;
    admin.isActive = !admin.isActive;
    await admin.save();
    res.status(200).json({
        success: true,
        message:  `Admin is now ${admin.isActive ? "active" : "inactive"}`,
        admin: {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            isActive: admin.isActive
        },
    });
};

export const deleteAdmin = async (req, res, next) => {
    const { id } = req.params;
    const adminId = req.userId; // Current admin making the change
    if (id === adminId) {
        return next(new AppError("You cannot delete your own account", 403));
    }
    const admin = await userModel.findOneAndDelete({ _id: id, role: "admin" });
    if (!admin) {
        return next(new AppError("Admin not found", 404));
    }

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
};


export const forceResetPassword = async (req, res, next) => {
    const { id } = req.params;
    const adminId = req.userId;
    const { newPassword } = req.body;

    const user = await userModel.findById(id).select('+password');
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (user.role !== "admin") {
        return next(new AppError("User is not an admin", 400));
    }
    if (user._id.toString() === adminId) {
        return next(new AppError("Please use the regular password reset flow to change your own password", 400));
    }
    
    if (user.password) {
        const isSamePassword = await bcryptjs.compare(newPassword, user.password);
        if (isSamePassword) {
            return next(new AppError("New password must be different from the current password", 400));
        }
    }

    const hashed = await bcryptjs.hash(newPassword, parseInt(process.env.SALT));
    user.password = hashed;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
};

export const getAdminStats = async (req, res, next) => {
    const totalAdmins = await userModel.countDocuments({ role: "admin" });
    const activeAdmins = await userModel.countDocuments({ role: "admin", isActive: true });
    const inactiveAdmins = await userModel.countDocuments({ role: "admin", isActive: false });
    const recentlyActiveAdmins = await userModel.countDocuments({ 
        role: "admin", 
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Active in last 7 days
    });
        
    return res.status(200).json({
        success: true,
        stats: {
            total: totalAdmins,
            active: activeAdmins,
            inactive: inactiveAdmins,
            recentlyActive: recentlyActiveAdmins
        }
    })
};