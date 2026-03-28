import { z } from "zod";

export const createBankAccountSchema = z.object({
  userId: z.string().uuid(),
  accountNo: z.string().min(5, "Account number is required"),
  holderName: z.string().min(2, "Holder name required"),
  balance: z.number().nonnegative(),
  type: z.enum(["GOV", "CONTRACTOR"])
});

export const updateHolderNameSchema = z.object({
  accountId: z.string().uuid(),
  holderName: z.string().min(2, "Holder name required"),
});