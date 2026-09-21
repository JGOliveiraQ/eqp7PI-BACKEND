import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import agendamentoRoutes from "./agendamentoRoutes.js";
import authRoutes from "./authRoutes.js";
import medicosRoutes from "./medicosRoutes.js";
import especialidadesRoutes from "./especialidadesRoutes.js";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/medicos", medicosRoutes);
router.use("/especialidades", especialidadesRoutes);
router.use("/agendamentos", agendamentoRoutes);

export default router;
