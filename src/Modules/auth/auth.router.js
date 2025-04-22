import { Router } from "express";
import {forgotPassword, login, logout, register, verifyEmail} from "./auth.controller.js";
import {asyncHandler} from "../../utils/catchError.js";
import {loginSchema, registerSchema,verifyEmailSchema} from "./auth.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();

router.post('/register',validation(registerSchema),asyncHandler(register));
router.post('/verifyEmail',validation(verifyEmailSchema),asyncHandler(verifyEmail));
router.post('/login',validation(loginSchema),asyncHandler(login));
router.post('/logout',asyncHandler(logout));
router.post('/forgotPassword',asyncHandler(forgotPassword));
export default router;