import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { UserRole } from "../constants/roles.js";
import {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  getMilestoneById,
} from "../controllers/milestone.controller.js";

const router = express.Router();

// Only Government can create milestones
router.post(
  "/",
  authMiddleware([UserRole.GOVERNMENT]),
  createMilestone
);

// Any authorized user can fetch milestones of a project
router.get(
  "/project/:projectId",
  authMiddleware([UserRole.GOVERNMENT, UserRole.CONTRACTOR]),
  getMilestonesByProject
);

// Fetch single milestone
router.get(
  "/:milestoneId",
  authMiddleware([UserRole.GOVERNMENT, UserRole.CONTRACTOR]),
  getMilestoneById
);

// Update milestone (Gov only)
router.put(
  "/:milestoneId",
  authMiddleware([UserRole.GOVERNMENT]),
  updateMilestone
);

export default router;