import prisma from "../config/prisma.js";
import { Messages } from "../constants/messages.js";
import { generateId } from "../utils/generateId.js";
import { paymentService } from "./payment.service.js";
import { MilestoneStatus,SiteInspectionStatus,VerificationStatus,ProjectStatus } from "@prisma/client";
import { generateDocumentHash,generateMilestoneHash } from "../utils/hash.js";
import { blockchainService } from "./blockchain.service.js";

export const milestoneService = {

  createMilestone: async ({ projectId, title, description, amount, sequence }) => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error("Project not found");
    if (project.status === ProjectStatus.COMPLETED) {
      throw new Error("Cannot add milestones to a completed project");
    }

    const existing = await prisma.milestone.findUnique({
      where: { projectId_sequence: { projectId, sequence } },
    });

    if (existing) throw new Error("Milestone with this sequence already exists");

    return await prisma.milestone.create({
      data: {
        id: generateId(),
        projectId,
        title,
        description,
        amount,
        sequence,
      },
    });
  },

  getMilestonesByProject: async (projectId) => {
    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: { documents: true, transaction: true },
      orderBy: { sequence: "asc" },
    });

    if (!milestones.length) throw new Error(Messages.MILESTONE.NOT_FOUND);

    return milestones;
  },

  updateMilestone: async (milestoneId, data) => {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) throw new Error(Messages.MILESTONE.NOT_FOUND);

    if (data.status === MilestoneStatus.VERIFIED || data.status === MilestoneStatus.PAID ) {
    throw new Error("Manual status update is not allowed");
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data,
    });

    return updatedMilestone;
  },

  getMilestoneById: async (milestoneId) => {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { documents: true, transaction: true },
    });

    if (!milestone) throw new Error(Messages.MILESTONE.NOT_FOUND);

    return milestone;
  },

  // ✅ NEW: Central finalization logic

  checkAndFinalizeMilestone: async (milestoneId, govUserId) => {
  
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: true,
        documents: true,
      },
    });
  
    if (!milestone) throw new Error("Milestone not found");
  
    // ✅ Condition 1: All documents approved
    const allDocsApproved = milestone.documents.every(
      (doc) => doc.verification === VerificationStatus.APPROVED
    );
  
    if (!allDocsApproved) return null;
  
    // ✅ Condition 2: Site inspection passed
    if (milestone.siteInspection !== SiteInspectionStatus.PASSED) return null;
  
    // ✅ Prevent duplicate execution
    if (milestone.status === MilestoneStatus.VERIFIED) return null;
  
    // ✅ Update milestone
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: "VERIFIED",
        verifiedBy: govUserId,
      },
    });
  
    // ✅ Trigger payment
    const transaction = await paymentService.processPayment(
      milestoneId,
      milestone.project.governmentId
    );
  
    if (!transaction || transaction.status !== "SUCCESS") {
      return { updatedMilestone, transaction };
    }
  
    // =========================
    // 🔐 Generate document hashes
    // =========================
    const documentHashes = [];
  
    for (const doc of milestone.documents) {
      const freshHash = generateDocumentHash({
        filePath: doc.fileUrl,
        fileName: doc.fileName,
        documentId: doc.id,
        type: doc.type,
      });
      documentHashes.push(freshHash);
    }
  
    // =========================
    // 🔐 Generate milestone hash
    // =========================
    const milestoneHash = generateMilestoneHash({
      milestone,
      documentHashes,
    });
  
    // =========================
    // 🖨️ CONSOLE LOGS
    // =========================
    console.log("====================================");
    console.log("✅ MILESTONE VERIFIED");
    console.log("Milestone ID:", milestoneId);
  
    console.log("📄 Document Hashes:");
    console.log(documentHashes);
  
    console.log("🔐 Milestone Hash:");
    console.log(milestoneHash);
  
    console.log("💰 Transaction Hash:");
    console.log(transaction.transactionHash);
    console.log("====================================");
  
    // =========================
    // ⛓️ STORE ON BLOCKCHAIN (UPDATED)
    // =========================
    try {
      const blockchainTxHash = await blockchainService.storeMilestone(
        milestoneId,
        milestoneHash,
        transaction.transactionHash,
        documentHashes   // ✅ NEW (IMPORTANT)
      );
  
      console.log("⛓️ Blockchain Stored Successfully");
      console.log("Blockchain Tx Hash:", blockchainTxHash);
  
    } catch (err) {
      console.error("❌ Blockchain storage failed:", err);
      // IMPORTANT: do not break flow
    }
  
    return {
      updatedMilestone,
      transaction,
      milestoneHash,
    };
  },
};