import { Router } from "express";
import {register, verifyEmail} from "./auth.controller.js";
import {asyncHandler} from "../../utils/catchError.js";
import {registerSchema,verifyEmailSchema} from "./auth.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();

router.post('/register',validation(registerSchema),asyncHandler(register));
router.post('/verifyEmail',validation(verifyEmailSchema),asyncHandler(verifyEmail));


export default router;