import { Router } from "express";
import { bankController } from "../controllers/bank.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserRole } from "../constants/roles.js";

const router = Router();

// Create account (Supreme Admin)
router.post(
  "/create",
  authMiddleware([UserRole.SUPREME_ADMIN]),
  bankController.createAccount
);


// Update holder name (Admin)
router.put(
  "/update-holder",
  authMiddleware([UserRole.SUPREME_ADMIN]),
  bankController.updateHolderName
);

// Get own account
router.get(
  "/me",
  authMiddleware([UserRole.GOVERNMENT, UserRole.CONTRACTOR]),
  bankController.getMyAccount
);

// Get all accounts
router.get(
  "/all",
  authMiddleware([UserRole.SUPREME_ADMIN]),
  bankController.getAllAccounts
);

export default router;