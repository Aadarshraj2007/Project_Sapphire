import prisma from "../config/prisma.js";
import {
  TransactionStatus,
  MilestoneStatus
} from "@prisma/client";

import crypto from "crypto";

import {
  generateTransactionHash,
  generateDataHash
} from "../utils/hash.js";

export const paymentService = {

  processPayment: async (milestoneId, governmentUserId) => {

    // 1️⃣ Fetch milestone
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    if (!milestone) throw new Error("Milestone not found");

    if (milestone.status !== MilestoneStatus.VERIFIED) {
      throw new Error("Milestone must be VERIFIED before payment");
    }

    // Prevent duplicate payment
    const existingTx = await prisma.transaction.findUnique({
      where: { milestoneId }
    });

    if (existingTx && existingTx.status === TransactionStatus.SUCCESS) {
      throw new Error("Payment already completed");
    }

    // 2️⃣ Government account
    const govAccount = await prisma.bankAccount.findFirst({
      where: { userId: governmentUserId }
    });

    if (!govAccount) throw new Error("Government account not found");

    // 3️⃣ Contractor
    const contractor = await prisma.user.findUnique({
      where: { cppUserId: milestone.project.contractorCppId }
    });

    if (!contractor) throw new Error("Contractor not found");

    // 4️⃣ Contractor account
    const contractorAccount = await prisma.bankAccount.findFirst({
      where: { userId: contractor.id }
    });

    if (!contractorAccount) throw new Error("Contractor account not found");

    // 5️⃣ Balance check
    if (govAccount.balance < milestone.amount) {
      throw new Error("Insufficient government balance");
    }

    try {

      const transaction = await prisma.$transaction(async (tx) => {

        // 6️⃣ Deduct from government
        const updatedGov = await tx.bankAccount.update({
          where: { id: govAccount.id },
          data: {
            balance: govAccount.balance - milestone.amount
          }
        });

        // 7️⃣ Credit contractor
        const updatedContractor = await tx.bankAccount.update({
          where: { id: contractorAccount.id },
          data: {
            balance: contractorAccount.balance + milestone.amount
          }
        });

        // ✅ 8️⃣ Generate transaction hash (CLEAN)
        const transactionHash = generateTransactionHash({
          milestoneId,
          fromAccount: updatedGov.accountNo,
          toAccount: updatedContractor.accountNo,
          amount: milestone.amount,
          timestamp: Date.now()
        });

        // 9️⃣ Save transaction
        const createdTx = await tx.transaction.create({
          data: {
            milestoneId,
            amount: milestone.amount,
            fromAccount: updatedGov.accountNo,
            toAccount: updatedContractor.accountNo,
            transactionHash,
            bankTransactionId: crypto.randomUUID(),
            status: TransactionStatus.SUCCESS,
            timestamp: new Date()
          }
        });

        // 🔟 Update milestone
        await tx.milestone.update({
          where: { id: milestoneId },
          data: { status: MilestoneStatus.PAID }
        });

        return createdTx;
      });

      return transaction;

    } catch (err) {

      // ❌ FAILED TRANSACTION (CLEAN HASH)
      await prisma.transaction.create({
        data: {
          milestoneId,
          amount: milestone.amount,
          fromAccount: govAccount.accountNo,
          toAccount: contractorAccount.accountNo,
          transactionHash: generateDataHash({
            milestoneId,
            status: "FAILED",
            timestamp: Date.now()
          }),
          bankTransactionId: crypto.randomUUID(),
          status: TransactionStatus.FAILED,
          timestamp: new Date()
        }
      });

      throw new Error("Payment failed");
    }
  }
};