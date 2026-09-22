import { Router } from "express";
import { listarEspecialidades } from "../controllers/medicoController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listarEspecialidades));

export default router;
