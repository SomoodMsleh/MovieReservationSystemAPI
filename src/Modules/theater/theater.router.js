import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createTheater, deleteTheater, getALLTheater, getTheaterById, toggleTheaterStatus, updateTheater } from './theater.controller.js';
import { createTheaterSchema, deleteTheaterSchema, getAllTheaterSchema, getTheaterByIdSchema, toggleTheaterStatusSchema, updateTheaterSchema } from './theater.validation.js';
import { configureTheaterSeatsSchema, deleteSeatSchema, getTheaterSeatsSchema, toggleSeatStatusSchema, updateSeatSchema } from './seat.validation.js';
import { configureTheaterSeats, deleteSeat, getTheaterSeats, toggleSeatStatus, updateSeat } from './seat.controller.js';

const router = Router();

router.post('/',auth(['superAdmin']),validation(createTheaterSchema),asyncHandler(createTheater));
router.post('/:id/seats',auth(['superAdmin','admin']),validation(configureTheaterSeatsSchema),asyncHandler(configureTheaterSeats));

router.get('/',validation(getAllTheaterSchema),asyncHandler(getALLTheater));
router.get('/:id',validation(getTheaterByIdSchema),asyncHandler(getTheaterById));
router.get('/:id/seats',validation(getTheaterSeatsSchema),asyncHandler(getTheaterSeats));

router.put('/:id',auth(['admin', 'superAdmin']),validation(updateTheaterSchema),asyncHandler(updateTheater));
router.put('/seats/:id',auth(['admin', 'superAdmin']),validation(updateSeatSchema), asyncHandler(updateSeat));

router.patch('/:id/status',auth(['admin', 'superAdmin']),validation(toggleTheaterStatusSchema),asyncHandler(toggleTheaterStatus));
router.patch('/seats/:id/status',auth(['admin', 'superAdmin']),validation(toggleSeatStatusSchema), asyncHandler(toggleSeatStatus));

router.delete('/:id',auth(['admin', 'superAdmin']),validation(deleteTheaterSchema),asyncHandler(deleteTheater));
router.delete('/seats/:id',auth(['admin', 'superAdmin']),validation(deleteSeatSchema), asyncHandler(deleteSeat));
export default router;