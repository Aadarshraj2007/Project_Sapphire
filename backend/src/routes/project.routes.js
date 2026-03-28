import express from "express";
import * as projectController from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserRole } from "../constants/roles.js";

const router = express.Router();

// Create project (Gov only)
router.post("/", authMiddleware(UserRole.GOVERNMENT), projectController.createProject);

// Get all projects for current user (Gov or Contractor)
router.get("/my", authMiddleware(), projectController.getProjects);

// Get all contractors (Gov only)
router.get("/contractors", authMiddleware(UserRole.GOVERNMENT), projectController.getAllContractors);

// Get single project by ID
router.get("/:id", authMiddleware(), projectController.getProject);

// Assign contractor to existing project (Gov only)
router.put("/assign-contractor", authMiddleware(UserRole.GOVERNMENT), projectController.assignContractor);

// Update project status (Gov only)
router.put("/update-status", authMiddleware(UserRole.GOVERNMENT), projectController.updateProjectStatus);

export default router;