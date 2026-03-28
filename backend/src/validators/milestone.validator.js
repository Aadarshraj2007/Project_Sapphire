import { z } from "zod";

export const createMilestoneSchema = z.object({
  projectId: z.string().uuid({ message: "Invalid project ID" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  amount: z.number().min(0, { message: "Amount must be non-negative" }),
  sequence: z.number().min(1, { message: "Sequence must be at least 1" }),
});

export const updateMilestoneSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  amount: z.number().min(0).optional(),
  status: z.enum(["PENDING", "SUBMITTED", "VERIFIED", "REJECTED", "PAID"]).optional(),
  siteInspection: z.enum(["PENDING", "PASSED", "FAILED"]).optional(),
});