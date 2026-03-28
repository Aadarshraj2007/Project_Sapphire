import { Router } from "express";
import { publicController } from "../controllers/public.controller.js";

const router = Router();

// 🌍 PUBLIC ACCESS (no auth)
router.get("/all", publicController.getAllProjects);
router.get("/project/:projectId", publicController.getProjectDetails);
router.get("/document/:documentId", publicController.viewPublicDocument);
router.post("/complaint", publicController.submitComplaint);

export default router;