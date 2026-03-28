import prisma from "../config/prisma.js";

export const bankService = {

  // Create bank account
  createAccount: async ({ userId, accountNo, holderName, balance, type }) => {

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Prevent duplicate account
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { userId }
    });

    if (existingAccount) {
      throw new Error("User already has a bank account");
    }

    // Validate role vs account type
    if (
      (user.role === "GOVERNMENT" && type !== "GOV") ||
      (user.role === "CONTRACTOR" && type !== "CONTRACTOR")
    ) {
      throw new Error("Account type does not match user role");
    }

    // Create account
    const account = await prisma.bankAccount.create({
      data: {
        userId,
        accountNo,
        holderName,
        balance,
        type
      }
    });

    return account;
  },


  // Update holder name
  updateHolderName: async ({ accountId, holderName }) => {

    const account = await prisma.bankAccount.findUnique({
      where: { id: accountId }
    });
  
    if (!account) {
      throw new Error("Bank account not found");
    }
  
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: accountId },
      data: { holderName }
    });
  
    return updatedAccount;
  },


  // Get account by user
  getAccountByUser: async (userId) => {

    const account = await prisma.bankAccount.findFirst({
      where: { userId }
    });

    if (!account) {
      throw new Error("Bank account not found");
    }

    return account;
  },


  // Get all accounts (Admin)
  getAllAccounts: async () => {

    const accounts = await prisma.bankAccount.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            cppUserId: true
          }
        }
      }
    });

    return accounts;
  }

};