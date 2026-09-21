import { Router } from "express";
import { triagemIa } from "../controllers/iaController.js";

const router = Router();

router.post("/triagem", triagemIa);

export default router;
