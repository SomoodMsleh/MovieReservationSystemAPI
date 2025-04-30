import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createGenreSchema } from './genre.validation.js';
import { createGenre, getAllGenre, getAllGenreDetails,  } from './genre.controller.js';
const router = Router();

router.post('/',auth(['admin','superAdmin']),validation(createGenreSchema),asyncHandler(createGenre));
router.get('/details',auth(['admin','superAdmin']),asyncHandler(getAllGenreDetails));
router.get('/',asyncHandler(getAllGenre));

export default router;