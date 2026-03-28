import { contract } from "../config/blockchain.js";
import { ethers } from "ethers";

export const blockchainService = {

  // =========================
  // 🔹 Store milestone + docs (NEW SINGLE TX)
  // =========================
  storeMilestone: async (
    milestoneId,
    milestoneHash,
    transactionHash,
    documentHashes = []
  ) => {
    try {

      if (!milestoneId || !milestoneHash || !transactionHash) {
        throw new Error("Missing required parameters");
      }

      console.log("⛓️ Storing milestone + documents on blockchain...");
      console.log("Milestone ID:", milestoneId);

      // ✅ Convert to bytes32
      const milestoneHashBytes = ethers.keccak256(
        ethers.toUtf8Bytes(milestoneHash)
      );

      const transactionHashBytes = ethers.keccak256(
        ethers.toUtf8Bytes(transactionHash)
      );

      const docHashesBytes = documentHashes.map((hash) =>
        ethers.keccak256(ethers.toUtf8Bytes(hash))
      );

      const tx = await contract.storeMilestone(
        milestoneId,
        milestoneHashBytes,
        transactionHashBytes,
        docHashesBytes
      );

      const receipt = await tx.wait();

      console.log("====================================");
      console.log("✅ Blockchain Transaction Successful");
      console.log("Milestone ID:", milestoneId);
      console.log("📄 Documents Stored:", documentHashes.length);
      console.log("⛓️ Tx Hash:", tx.hash);
      console.log("Block Number:", receipt.blockNumber);
      console.log("====================================");

      return tx.hash;

    } catch (error) {
      console.error("❌ Blockchain store error:");
      console.error(error);
      throw error;
    }
  },

  // =========================
  // 🔹 Fetch milestone
  // =========================
  getMilestone: async (milestoneId) => {
    try {

      if (!milestoneId) {
        throw new Error("milestoneId is required");
      }

      const data = await contract.getMilestone(milestoneId);

      console.log("====================================");
      console.log("📥 Fetched milestone from blockchain");
      console.log("Milestone ID:", milestoneId);
      console.log("Milestone Hash (bytes32):", data.milestoneHash);
      console.log("Transaction Hash (bytes32):", data.transactionHash);
      console.log("Timestamp:", Number(data.timestamp));
      console.log("====================================");

      return {
        milestoneHash: data.milestoneHash,
        transactionHash: data.transactionHash,
        timestamp: Number(data.timestamp),
      };

    } catch (error) {
      console.error("❌ Fetch error:");
      console.error(error);
      throw error;
    }
  },

  // =========================
  // 🔹 Verify milestone
  // =========================
  verifyMilestone: async (milestoneId, incomingHash) => {
    try {

      if (!milestoneId || !incomingHash) {
        throw new Error("milestoneId and hash required");
      }

      const hashBytes = ethers.keccak256(
        ethers.toUtf8Bytes(incomingHash)
      );

      console.log("🔍 Verifying milestone...");
      console.log("Incoming Hash (original):", incomingHash);
      console.log("Incoming Hash (bytes32):", hashBytes);

      const isValid = await contract.verifyMilestoneHash(
        milestoneId,
        hashBytes
      );

      console.log("✅ Milestone verification result:", isValid);

      return isValid;

    } catch (error) {
      console.error("❌ Verification error:");
      console.error(error);
      throw error;
    }
  },

  // =========================
  // 🔹 Verify document
  // =========================
  verifyDocument: async (milestoneId, docHash) => {
    try {

      if (!milestoneId || !docHash) {
        throw new Error("milestoneId and docHash required");
      }

      const hashBytes = ethers.keccak256(
        ethers.toUtf8Bytes(docHash)
      );

      console.log("🔍 Verifying document...");
      console.log("Document Hash (original):", docHash);
      console.log("Document Hash (bytes32):", hashBytes);

      const isValid = await contract.verifyDocumentHash(
        milestoneId,
        hashBytes
      );

      console.log("✅ Document verification result:", isValid);

      return isValid;

    } catch (error) {
      console.error("❌ Document verification error:");
      console.error(error);
      throw error;
    }
  },

};