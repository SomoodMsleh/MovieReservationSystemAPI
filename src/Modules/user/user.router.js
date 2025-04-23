import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import {getAllUsers} from "./user.controller.js"
const router = Router();

router.get('/', auth(['admin', 'superAdmin']), asyncHandler(getAllUsers));

export default router;