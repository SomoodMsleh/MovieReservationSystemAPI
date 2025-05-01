import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { } from './seat.validation.js';
import { } from './seat.controller.js';

const router = Router();

export default router;