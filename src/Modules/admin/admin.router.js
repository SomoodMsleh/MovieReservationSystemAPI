import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import { updateUserRole } from "./admin.controller.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js"
import {updateUserRoleSchema} from './admin.validation.js';
const router = Router();

router.put('/:id',auth(['superAdmin']),validation(updateUserRoleSchema),asyncHandler(updateUserRole));

export default router;