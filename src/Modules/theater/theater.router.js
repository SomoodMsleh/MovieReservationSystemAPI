import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createTheater, deleteTheater, getALLTheater, getTheaterById, toggleTheaterStatus, updateTheater } from './theater.controller.js';
import { createTheaterSchema, deleteTheaterSchema, getTheaterByIdSchema, toggleTheaterStatusSchema, updateTheaterSchema } from './theater.validation.js';

const router = Router();

router.post('/',auth(['superAdmin']),validation(createTheaterSchema),asyncHandler(createTheater));
router.get('/',asyncHandler(getALLTheater));
router.get('/:id',validation(getTheaterByIdSchema),asyncHandler(getTheaterById));
router.put('/:id',auth(['admin', 'superAdmin']),validation(updateTheaterSchema),asyncHandler(updateTheater));
router.patch('/:id/status',auth(['admin', 'superAdmin']),validation(toggleTheaterStatusSchema),asyncHandler(toggleTheaterStatus));
router.delete('/:id',auth(['admin', 'superAdmin']),validation(deleteTheaterSchema),asyncHandler(deleteTheater));

export default router;