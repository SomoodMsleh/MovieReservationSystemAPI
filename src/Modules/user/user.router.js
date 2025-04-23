import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import {getAllUsers, getUserById,toggleUserStatus,deleteUser} from "./user.controller.js"
import { deleteUserSchema, getUserByIdSchema, toggleUserStatusSchema } from "./user.validation.js";
const router = Router();

router.get('/', auth(['admin', 'superAdmin']), asyncHandler(getAllUsers));
router.get('/:id', auth(['admin', 'superAdmin']), validation(getUserByIdSchema) ,asyncHandler(getUserById));
router.put('/:id/status', auth(['admin', 'superAdmin']),validation(toggleUserStatusSchema), asyncHandler(toggleUserStatus));
router.delete('/:id', auth(['admin', 'superAdmin']), validation(deleteUserSchema),asyncHandler(deleteUser));



export default router;