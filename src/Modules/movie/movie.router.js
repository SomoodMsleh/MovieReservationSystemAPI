import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createMovie, getAllMovie, getMovieById, updateMovie } from './movie.controller.js';
import { createMovieSchema, getMovieByIdSchema, updateMovieSchema } from './movie.validation.js';
import fileUpload,{fileValidation} from '../../utils/multer.js';
import {preProcessArrayFields} from '../../middleware/preProcessArrayFields.js'
const router = Router();

router.post('/',auth(['admin','superAdmin']),fileUpload(fileValidation.image).single('poster'),preProcessArrayFields(['genres', 'cast']),validation(createMovieSchema),asyncHandler(createMovie));
router.get('/',asyncHandler(getAllMovie));
router.get('/:id',validation(getMovieByIdSchema),asyncHandler(getMovieById));
router.put('/:id',auth(['admin','superAdmin']),fileUpload(fileValidation.image).single('poster'),preProcessArrayFields(['genres', 'cast']),validation(updateMovieSchema),asyncHandler(updateMovie));


export default router;