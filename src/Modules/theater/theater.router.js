import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createTheater } from './theater.controller.js';
import { createTheaterSchema } from './theater.validation.js';

const router = Router();

router.post('/',auth(['superAdmin']),validation(createTheaterSchema),asyncHandler(createTheater));

export default router;