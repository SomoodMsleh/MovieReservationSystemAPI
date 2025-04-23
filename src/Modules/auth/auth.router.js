import { Router } from "express";
import {forgotPassword, getUserProfile, login, logout, register, resetPassword, updateProfile, verifyEmail} from "./auth.controller.js";
import {asyncHandler} from "../../utils/catchError.js";
import {forgotPasswordSchema, loginSchema, registerSchema,resetPasswordSchema,updateProfileSchema,verifyEmailSchema} from "./auth.validation.js";
import validation from "../../middleware/validation.js";
import { forgotPasswordLimiter } from "../../utils/rateLimiter.js"
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post('/register',validation(registerSchema),asyncHandler(register));
router.post('/verifyEmail',validation(verifyEmailSchema),asyncHandler(verifyEmail));
router.post('/login',validation(loginSchema),asyncHandler(login));
router.post('/logout',auth(),asyncHandler(logout));
router.post('/forgotPassword',forgotPasswordLimiter,validation(forgotPasswordSchema),asyncHandler(forgotPassword));
router.post('/resetPassword/:token',validation(resetPasswordSchema),asyncHandler(resetPassword));
router.put('/profile', auth(),validation(updateProfileSchema), asyncHandler(updateProfile));
router.get('/profile', auth(),asyncHandler(getUserProfile));

export default router;