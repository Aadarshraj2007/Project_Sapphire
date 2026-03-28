import { z } from "zod";
import { VerificationStatus, DocumentType } from "../constants/status.js";

// Upload document validator
export const uploadDocumentSchema = z.object({
  milestoneId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
  isPublic: z.boolean().optional(),
});

// Submit document validator
export const submitDocumentSchema = z.object({
  documentId: z.string().uuid(),
});

// Verify document validator (Gov)
export const verifyDocumentSchema = z.object({
  verification: z.nativeEnum(VerificationStatus).refine(
    val => val === "APPROVED" || val === "REJECTED",
    { message: "Verification must be APPROVED or REJECTED" }
  ),
  rejectionReason: z.string().optional(),
});

export const resubmitDocumentSchema = z.object({
  documentId: z.string().uuid(), // old rejected doc
});