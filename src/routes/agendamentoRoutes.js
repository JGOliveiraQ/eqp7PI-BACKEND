import { Router } from "express";
import {
  criarAgendamento,
  listarAgendamentosPaciente
} from "../controllers/agendamentoController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(autenticarToken);

router.post("/", criarAgendamento);
router.get("/meus-agendamentos", listarAgendamentosPaciente);

export default router;

