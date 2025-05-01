import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createTheater, getALLTheater, getTheaterById } from './theater.controller.js';
import { createTheaterSchema, getTheaterByIdSchema } from './theater.validation.js';

const router = Router();

router.post('/',auth(['superAdmin']),validation(createTheaterSchema),asyncHandler(createTheater));
router.get('/',asyncHandler(getALLTheater));
router.get('/:id',validation(getTheaterByIdSchema),asyncHandler(getTheaterById));
export default router;