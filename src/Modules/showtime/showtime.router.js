import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createShowtime, getAllShowtime} from "./showtime.controller.js"
import { createShowtimeSchema,getAllShowtimeQuerySchema} from "./showtime.validation.js";

const router = Router();
router.post('/',auth(['admin','superAdmin']),validation(createShowtimeSchema),asyncHandler(createShowtime));
router.get("/",validation(getAllShowtimeQuerySchema), asyncHandler(getAllShowtime));
export default router;