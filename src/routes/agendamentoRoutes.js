import { Router } from "express";
import {
  cancelarAgendamento,
  criarAgendamento,
  listarAgendamentosPaciente,
  reagendarAgendamento
} from "../controllers/agendamentoController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.use(autenticarToken);

router.post("/", asyncHandler(criarAgendamento));
router.get("/meus-agendamentos", asyncHandler(listarAgendamentosPaciente));
router.put("/:id/reagendar", asyncHandler(reagendarAgendamento));
router.put("/:id/cancelar", asyncHandler(cancelarAgendamento));

export default router;

