import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createGenreSchema, getGenreByIdSchema } from './genre.validation.js';
import { createGenre, getAllGenre, getAllGenreDetails, getGenreById,  } from './genre.controller.js';
const router = Router();

router.post('/',auth(['admin','superAdmin']),validation(createGenreSchema),asyncHandler(createGenre));
router.get('/details',auth(['admin','superAdmin']),asyncHandler(getAllGenreDetails));
router.get('/',asyncHandler(getAllGenre));
router.get('/:id',auth(['admin','superAdmin']),validation(getGenreByIdSchema),asyncHandler(getGenreById));

export default router;