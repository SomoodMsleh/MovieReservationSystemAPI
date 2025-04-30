import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createMovie } from './movie.controller.js';
import { createMovieSchema } from './movie.validation.js';
import fileUpload,{fileValidation} from '../../utils/multer.js';
import {preProcessArrayFields} from '../../middleware/preProcessArrayFields.js'
const router = Router();

router.post('/',auth(['admin','superAdmin']),fileUpload(fileValidation.image).single('poster'),preProcessArrayFields(['genres', 'cast']),validation(createMovieSchema),asyncHandler(createMovie));

export default router;