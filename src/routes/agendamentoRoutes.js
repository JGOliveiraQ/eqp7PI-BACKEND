import { Router } from "express";
import {
  cancelarAgendamento,
  criarAgendamento,
  listarAgendamentosPaciente,
  reagendarAgendamento
} from "../controllers/agendamentoController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(autenticarToken);

router.post("/", criarAgendamento);
router.get("/meus-agendamentos", listarAgendamentosPaciente);
router.put("/:id/reagendar", reagendarAgendamento);
router.put("/:id/cancelar", cancelarAgendamento);

export default router;

