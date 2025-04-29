import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import {getAllUsers, getUserById,toggleUserStatus,deleteUser, changePassword, uploadProfileImage, getUserStats} from "./user.controller.js"
import { changePasswordSchema, deleteUserSchema, getUserByIdSchema, toggleUserStatusSchema } from "./user.validation.js";
import fileUpload,{ fileValidation } from '../../utils/multer.js'
const router = Router();

router.get('/', auth(['admin', 'superAdmin']), asyncHandler(getAllUsers));
router.get('/stats', auth(['admin', 'superAdmin']), asyncHandler(getUserStats));
router.get('/:id', auth(['admin', 'superAdmin']), validation(getUserByIdSchema) ,asyncHandler(getUserById));
router.put('/:id/status', auth(['admin', 'superAdmin']),validation(toggleUserStatusSchema), asyncHandler(toggleUserStatus));
router.put("/uploadProfileImage",auth(),fileUpload(fileValidation.image).single("image"),asyncHandler(uploadProfileImage));
router.delete('/:id', auth(['admin', 'superAdmin']), validation(deleteUserSchema),asyncHandler(deleteUser));
router.put('/changePassword', auth(), validation(changePasswordSchema) ,asyncHandler(changePassword));


export default router;