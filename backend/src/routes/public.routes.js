import { Router } from "express";
import { publicController } from "../controllers/public.controller.js";

const router = Router();

// 🌍 PUBLIC ACCESS (no auth)
router.get("/project/:projectId", publicController.getProjectDetails);

export default router;