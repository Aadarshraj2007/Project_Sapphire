import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserRole } from "../constants/roles.js";

const router = Router();

router.post(
  "/pay/:milestoneId",
  authMiddleware([UserRole.GOVERNMENT]),
  paymentController.processPayment
);

export default router;