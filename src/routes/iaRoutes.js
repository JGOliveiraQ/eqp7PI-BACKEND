import { Router } from "express";
import { triagemIa } from "../controllers/iaController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/triagem", asyncHandler(triagemIa));

export default router;
