import { Router } from "express";
import {
  atualizarPerfilPaciente,
  cadastrarPaciente,
  loginPaciente,
  obterPerfilPaciente
} from "../controllers/authController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/cadastro", asyncHandler(cadastrarPaciente));
router.post("/login", asyncHandler(loginPaciente));
router.get("/perfil", autenticarToken, asyncHandler(obterPerfilPaciente));
router.put("/perfil", autenticarToken, asyncHandler(atualizarPerfilPaciente));

export default router;
