import { Router } from "express";
import {register} from "./auth.controller.js";
import {asyncHandler} from "../../utils/catchError.js";
import {registerSchema} from "./auth.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();

router.post('/register',validation(registerSchema),asyncHandler(register));

export default router;