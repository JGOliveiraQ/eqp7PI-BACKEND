import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import agendamentoRoutes from "./agendamentoRoutes.js";

const router = Router();

router.use("/", healthRoutes);
router.use("/agendamentos", agendamentoRoutes);

export default router;
