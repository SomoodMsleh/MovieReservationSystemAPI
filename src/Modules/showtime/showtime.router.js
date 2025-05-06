import { Router } from "express";
import {asyncHandler} from "../../utils/catchError.js";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createShowtime, deleteShowtime, getAllShowtime, getShowtimeByDate, getShowtimeById, toggleShowtimeStatus} from "./showtime.controller.js"
import { createShowtimeSchema,deleteShowtimeSchema,getAllShowtimeQuerySchema, getShowtimeByDateSchema, getShowtimeByIdSchema, toggleShowtimeStatusSchema} from "./showtime.validation.js";

const router = Router();
router.post('/',auth(['admin','superAdmin']),validation(createShowtimeSchema),asyncHandler(createShowtime));
router.get("/",validation(getAllShowtimeQuerySchema), asyncHandler(getAllShowtime));
router.get("/:id", validation(getShowtimeByIdSchema), asyncHandler(getShowtimeById));
router.get("/date/:date", validation(getShowtimeByDateSchema), asyncHandler(getShowtimeByDate));

router.patch('/:id/status', auth(['admin', 'superAdmin']),validation(toggleShowtimeStatusSchema), asyncHandler(toggleShowtimeStatus));
router.delete("/:id", auth(['admin', 'superAdmin']),validation(deleteShowtimeSchema),asyncHandler(deleteShowtime));
export default router;