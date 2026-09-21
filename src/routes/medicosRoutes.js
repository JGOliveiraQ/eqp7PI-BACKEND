import { Router } from "express";
import {
  listarEspecialidades,
  listarMedicos,
  obterDetalhesMedico
} from "../controllers/medicoController.js";

const router = Router();

router.get("/", listarMedicos);
router.get("/especialidades", listarEspecialidades);
router.get("/:id", obterDetalhesMedico);

export default router;
