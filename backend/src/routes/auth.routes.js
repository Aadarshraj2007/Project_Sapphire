import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserRole } from "../constants/roles.js";

const router = express.Router();

router.post("/contractor/signup", authController.contractorSignup);
router.post("/gov/signup", authController.govSignup);

// Get approval status (auth required)
router.get(
  "/approval-status",
  authMiddleware([UserRole.CONTRACTOR, UserRole.GOVERNMENT, UserRole.SUPREME_ADMIN]),
  authController.getApprovalStatus
);

// Supreme Admin approval
router.post(
  "/approve",
  authMiddleware([UserRole.SUPREME_ADMIN]),
  authController.approveUser
);

// Login
router.post("/login", authController.login);

// Forgot & Reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Change password (auth required)
router.post("/change-password", authMiddleware([UserRole.CONTRACTOR, UserRole.GOVERNMENT]), authController.changePassword);

router.get(
  "/users",
  authMiddleware([UserRole.SUPREME_ADMIN]),
  authController.getAllUsers
);

export default router;