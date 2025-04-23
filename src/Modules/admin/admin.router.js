import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import { deleteAdmin, forceResetPassword, getAdminById, getAllAdmins, toggleAdminStatus, updateUserRole } from "./admin.controller.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js"
import {deleteAdminSchema, forceResetPasswordSchema, getAdminByIdSchema, toggleAdminStatusSchema, updateUserRoleSchema} from './admin.validation.js';
const router = Router();

router.put('/:id',auth(['superAdmin']),validation(updateUserRoleSchema),asyncHandler(updateUserRole));
router.get('/:id',auth(['superAdmin']),validation(getAdminByIdSchema),asyncHandler(getAdminById));
router.get('/',auth(['superAdmin']),asyncHandler(getAllAdmins));
router.put('/:id/status',auth(['superAdmin']),validation(toggleAdminStatusSchema),asyncHandler(toggleAdminStatus));
router.delete('/:id',auth(['superAdmin']),validation(deleteAdminSchema),asyncHandler(deleteAdmin));
router.put('/:id/password',auth(['superAdmin']),validation(forceResetPasswordSchema),asyncHandler(forceResetPassword));
export default router;