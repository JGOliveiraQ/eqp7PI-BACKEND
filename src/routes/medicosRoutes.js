import { Router } from "express";
import {
  listarEspecialidades,
  listarMedicos,
  obterDetalhesMedico
} from "../controllers/medicoController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listarMedicos));
router.get("/especialidades", asyncHandler(listarEspecialidades));
router.get("/:id", asyncHandler(obterDetalhesMedico));

export default router;
