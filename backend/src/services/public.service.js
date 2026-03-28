import prisma from "../config/prisma.js";
import { blockchainService } from "./blockchain.service.js";
import {
  generateMilestoneHash,
  generateDocumentHash
} from "../utils/hash.js";

export const publicService = {

  getProjectPublicData: async (projectId) => {

    // 🔹 Fetch full project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        government: true,
        milestones: {
          include: {
            documents: true,
            transaction: true,
          },
          orderBy: { sequence: "asc" },
        },
      },
    });

    if (!project) throw new Error("Project not found");

    const contractor = await prisma.user.findUnique({
      where: { cppUserId: project.contractorCppId }
    });

    const result = [];

    // 🔹 Process each milestone
    for (const milestone of project.milestones) {

      // =========================
      // 🔐 Recompute document hashes
      // =========================
      const documentHashes = [];

      for (const doc of milestone.documents) {
        const hash = generateDocumentHash({
          filePath: doc.fileUrl,
          fileName: doc.fileName,
          documentId: doc.id,
          type: doc.type,
        });

        documentHashes.push({
          id: doc.id,
          fileName: doc.fileName,
          hash,
        });
      }

      // =========================
      // 🔐 Recompute milestone hash
      // =========================
      const milestoneHash = generateMilestoneHash({
        milestone,
        documentHashes: documentHashes.map(d => d.hash),
      });

      // =========================
      // 🖨️ DEBUG LOGS (NEW - useful)
      // =========================
      console.log("====================================");
      console.log("📊 PUBLIC VERIFICATION CHECK");
      console.log("Milestone ID:", milestone.id);
      console.log("🔐 Recomputed Milestone Hash:", milestoneHash);
      console.log("📄 Document Hashes:");
      documentHashes.forEach(d => {
        console.log(`- ${d.fileName}: ${d.hash}`);
      });
      console.log("====================================");

      // =========================
      // ⛓️ Fetch blockchain data
      // =========================
      let blockchainStatus = "NOT_STORED";

      try {
        const blockchainData = await blockchainService.getMilestone(milestone.id);

        // If exists on chain
        if (blockchainData && blockchainData.timestamp !== 0) {

          const isMatch = await blockchainService.verifyMilestone(
            milestone.id,
            milestoneHash
          );

          blockchainStatus = isMatch ? "VERIFIED" : "TAMPERED";
        }

      } catch (err) {
        console.warn("⚠️ Blockchain not available or record missing");
        blockchainStatus = "NOT_STORED";
      }

      // =========================
      // 🔍 Verify each document
      // =========================
      const verifiedDocuments = [];

      for (const doc of documentHashes) {

        let docStatus = "NOT_STORED";

        if (blockchainStatus !== "NOT_STORED") {
          try {
            const isValid = await blockchainService.verifyDocument(
              milestone.id,
              doc.hash
            );
            docStatus = isValid ? "VERIFIED" : "TAMPERED";
          } catch (err) {
            console.warn("⚠️ Document not found on blockchain");
            docStatus = "NOT_STORED";
          }
        }

        verifiedDocuments.push({
          id: doc.id,
          fileName: doc.fileName,
          status: docStatus,
        });
      }

      // =========================
      // 📦 Final Response Object
      // =========================
      result.push({
        id: milestone.id,
        title: milestone.title,
        amount: milestone.amount,
        status: milestone.status,

        blockchainStatus: {
          status: blockchainStatus,
          reason:
            blockchainStatus === "NOT_STORED"
              ? "Blockchain record not found or node reset"
              : null,
        },

        documents: verifiedDocuments,
      });
    }

    // Fetch complaints
    const complaints = await prisma.complaint.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // 📤 FINAL RESPONSE
    // =========================
    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        location: {
          state: project.locationState,
          city: project.locationCity,
          full: `${project.locationCity}, ${project.locationState}`,
        },
        assignedBy: project.government?.name || "N/A",
        assignedTo: contractor?.cppUserId || "N/A",
        contractorName: contractor?.name || "N/A",
        createdAt: project.createdAt,
      },
      milestones: result,
      complaints: complaints.map(c => ({
        id: c.id,
        message: c.message,
        submittedBy: c.submittedBy,
        createdAt: c.createdAt
      }))
    };
  },

  getAllProjects: async () => {
    return await prisma.project.findMany({
      include: {
        government: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  submitComplaint: async (data) => {
    return await prisma.complaint.create({
      data: {
        projectId: data.projectId,
        message: data.message,
        submittedBy: data.submittedBy || "Citizen",
      },
    });
  },
};