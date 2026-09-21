import { Router } from "express";
import { listarEspecialidades } from "../controllers/medicoController.js";

const router = Router();

router.get("/", listarEspecialidades);

export default router;
