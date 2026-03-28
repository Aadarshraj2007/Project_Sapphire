import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { documentController } from "../controllers/document.controller.js";
import { UserRole } from "../constants/roles.js";

const router = Router();

// Upload document (Contractor)
router.post(
  "/upload",
  authMiddleware([UserRole.CONTRACTOR]),
  upload.single("file"),
  documentController.uploadDocument
);

// Submit document (Contractor)
router.put(
  "/submit/:documentId",
  authMiddleware([UserRole.CONTRACTOR]),
  documentController.submitDocument
);

// Verify document (Government)
router.put(
  "/verify/:documentId",
  authMiddleware([UserRole.GOVERNMENT]),
  documentController.verifyDocument
);

router.post(
  "/resubmit/:documentId",
  authMiddleware([UserRole.CONTRACTOR]),
  upload.single("file"),
  documentController.resubmitDocument
);

// Get documents for milestone (Any authenticated user)
router.get(
  "/milestone/:milestoneId",
  authMiddleware([UserRole.CONTRACTOR, UserRole.GOVERNMENT]),
  documentController.getDocumentsByMilestone
);

// View single document (Any authenticated user)
router.get(
  "/view/:documentId",
  authMiddleware([UserRole.CONTRACTOR, UserRole.GOVERNMENT]),
  documentController.viewDocument
);

export default router;