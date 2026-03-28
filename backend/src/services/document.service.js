import prisma from "../config/prisma.js";
import { Messages } from "../constants/messages.js";
import {
  VerificationStatus,
} from "@prisma/client";

import { milestoneService } from "./milestone.service.js";
import { generateDocumentHash } from "../utils/hash.js";

export const documentService = {

  // =========================
  // 📤 UPLOAD DOCUMENT
  // =========================
  uploadDocument: async ({ file, milestoneId, uploadedBy, type, isPublic }) => {
  
    const documentHash = generateDocumentHash({
      filePath: file.path,
      fileName: file.originalname,
      documentId: crypto.randomUUID(), // or DB-generated id if available
      type,
    });
  
    const existing = await prisma.document.findUnique({
      where: { hash: documentHash },
    });
  
    if (existing) {
      throw new Error(Messages.DOCUMENT.HASH_EXISTS);
    }
  
    return await prisma.document.create({
      data: {
        fileName: file.originalname,
        fileUrl: file.path,
        hash: documentHash,
        type,
        isPublic: isPublic || true,
        milestoneId,
        uploadedBy,
        verification: VerificationStatus.PENDING,
      },
    });
  },

  // =========================
  // 📥 SUBMIT DOCUMENT
  // =========================
  submitDocument: async (documentId, contractorId) => {

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) throw new Error(Messages.MILESTONE.NOT_FOUND);

    if (doc.uploadedBy !== contractorId) {
      throw new Error("Unauthorized to submit this document");
    }

    if (doc.verification !== VerificationStatus.PENDING) {
      throw new Error("Document already submitted");
    }

    return await prisma.document.update({
      where: { id: documentId },
      data: {
        verification: VerificationStatus.SUBMITTED,
      },
    });
  },

  // =========================
  // 🔍 VERIFY DOCUMENT
  // =========================
  verifyDocument: async ({
    documentId,
    verification,
    rejectionReason,
    govUserId,
  }) => {

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) throw new Error(Messages.MILESTONE.NOT_FOUND);

    if (doc.verification !== VerificationStatus.SUBMITTED) {
      throw new Error("Document must be submitted before verification");
    }

    let verificationEnum;

    if (verification === "APPROVED") {
      verificationEnum = VerificationStatus.APPROVED;
    } else if (verification === "REJECTED") {
      verificationEnum = VerificationStatus.REJECTED;
    } else {
      throw new Error("Invalid verification status");
    }

    // ✅ Update document
    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: {
        verification: verificationEnum,
        rejectionReason:
          verificationEnum === VerificationStatus.REJECTED
            ? rejectionReason
            : null,
      },
    });

    // ❌ If rejected → stop here
    if (verificationEnum === VerificationStatus.REJECTED) {
      return updatedDoc;
    }

    // =========================
    // 🔥 CHECK + FINALIZE VIA MILESTONE SERVICE
    // =========================
    await milestoneService.checkAndFinalizeMilestone(
      doc.milestoneId,
      govUserId
    );

    return updatedDoc;
  },

  // =========================
  // 🔁 RESUBMIT DOCUMENT
  // =========================
  resubmitDocument: async ({ documentId, file, userId }) => {

    const oldDoc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!oldDoc) throw new Error("Document not found");

    if (oldDoc.verification !== VerificationStatus.REJECTED) {
      throw new Error("Only rejected documents can be resubmitted");
    }

    if (oldDoc.uploadedBy !== userId) {
      throw new Error("Unauthorized");
    }

    const newHash = generateFileHash(file.path);

    const existing = await prisma.document.findUnique({
      where: { hash: newHash },
    });

    if (existing) {
      throw new Error("Same document already exists");
    }

    const newDoc = await prisma.document.create({
      data: {
        fileName: file.originalname,
        fileUrl: file.path,
        hash: newHash,
        type: oldDoc.type,
        isPublic: oldDoc.isPublic,
        milestoneId: oldDoc.milestoneId,
        uploadedBy: userId,
        verification: VerificationStatus.PENDING,
        previousDocumentId: oldDoc.id,
      },
    });

    return newDoc;
  },

  // =========================
  // 📄 GET DOCUMENTS BY MILESTONE
  // =========================
  getDocumentsByMilestone: async (milestoneId) => {
    return await prisma.document.findMany({
      where: { milestoneId },
      orderBy: { createdAt: "desc" },
    });
  },

  // =========================
  // 📄 GET SINGLE DOCUMENT
  // =========================
  getDocumentById: async (id) => {
    const doc = await prisma.document.findUnique({
      where: { id },
    });

    if (!doc) throw new Error(Messages.DOCUMENT.HASH_EXISTS);

    return doc;
  },
};