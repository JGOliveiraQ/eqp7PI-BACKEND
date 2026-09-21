import { Router } from "express";
import {
  atualizarPerfilPaciente,
  cadastrarPaciente,
  loginPaciente,
  obterPerfilPaciente
} from "../controllers/authController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/cadastro", cadastrarPaciente);
router.post("/login", loginPaciente);
router.get("/perfil", autenticarToken, obterPerfilPaciente);
router.put("/perfil", autenticarToken, atualizarPerfilPaciente);

export default router;
