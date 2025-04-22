import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import { updateUserRole } from "./admin.controller.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js"
import {} from './admin.validation.js';
const router = Router();

router.put('/:id',auth(['superAdmin']),asyncHandler(updateUserRole));

export default router;