import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import {getAllUsers, getUserById,toggleUserStatus,deleteUser, changePassword} from "./user.controller.js"
import { changePasswordSchema, deleteUserSchema, getUserByIdSchema, toggleUserStatusSchema } from "./user.validation.js";
const router = Router();

router.get('/', auth(['admin', 'superAdmin']), asyncHandler(getAllUsers));
router.get('/:id', auth(['admin', 'superAdmin']), validation(getUserByIdSchema) ,asyncHandler(getUserById));
router.put('/:id/status', auth(['admin', 'superAdmin']),validation(toggleUserStatusSchema), asyncHandler(toggleUserStatus));
router.delete('/:id', auth(['admin', 'superAdmin']), validation(deleteUserSchema),asyncHandler(deleteUser));
router.put('/changePassword', auth(), validation(changePasswordSchema) ,asyncHandler(changePassword));


export default router;