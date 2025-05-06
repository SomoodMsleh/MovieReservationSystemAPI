import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createMovie, deleteMovie, getAllMovie, getMovieById, getShowtimeByMovie, toggleMovieStatus, updateMovie } from './movie.controller.js';
import { createMovieSchema, deleteMovieSchema, getAllMoviesSchema, getMovieByIdSchema, getShowtimeByMovieSchema, toggleMovieStatusSchema, updateMovieSchema } from './movie.validation.js';
import fileUpload,{fileValidation} from '../../utils/multer.js';
import {preProcessArrayFields} from '../../middleware/preProcessArrayFields.js'
const router = Router();

router.post('/',auth(['admin','superAdmin']),fileUpload(fileValidation.image).single('poster'),preProcessArrayFields(['genres', 'cast']),validation(createMovieSchema),asyncHandler(createMovie));
router.get('/',validation(getAllMoviesSchema),asyncHandler(getAllMovie));
router.get('/:id',validation(getMovieByIdSchema),asyncHandler(getMovieById));
router.get("/:id/showtime", validation(getShowtimeByMovieSchema), asyncHandler(getShowtimeByMovie));
router.put('/:id',auth(['admin','superAdmin']),fileUpload(fileValidation.image).single('poster'),preProcessArrayFields(['genres', 'cast']),validation(updateMovieSchema),asyncHandler(updateMovie));
router.put('/:id/status', auth(['admin', 'superAdmin']),validation(toggleMovieStatusSchema), asyncHandler(toggleMovieStatus));

router.delete('/:id',auth(['admin','superAdmin']),validation(deleteMovieSchema),asyncHandler(deleteMovie));

export default router;