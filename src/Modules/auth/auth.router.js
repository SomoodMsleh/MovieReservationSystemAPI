import { Router } from "express";
import {forgotPassword, login, logout, register, resetPassword, verifyEmail} from "./auth.controller.js";
import {asyncHandler} from "../../utils/catchError.js";
import {forgotPasswordSchema, loginSchema, registerSchema,resetPasswordSchema,verifyEmailSchema} from "./auth.validation.js";
import validation from "../../middleware/validation.js";
import { forgotPasswordLimiter } from "../../middleware/rateLimiter.js";
const router = Router();

router.post('/register',validation(registerSchema),asyncHandler(register));
router.post('/verifyEmail',validation(verifyEmailSchema),asyncHandler(verifyEmail));
router.post('/login',validation(loginSchema),asyncHandler(login));
router.post('/logout',asyncHandler(logout));
router.post('/forgotPassword',forgotPasswordLimiter,validation(forgotPasswordSchema),asyncHandler(forgotPassword));
router.post('/resetPassword/:token',validation(resetPasswordSchema),asyncHandler(resetPassword));
export default router;