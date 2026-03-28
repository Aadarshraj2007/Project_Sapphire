import { z } from "zod";

export const createComplaintSchema = z.object({
  projectId: z.string().uuid(),
  message: z.string().min(10, "Complaint must be at least 10 characters long"),
  submittedBy: z.string().optional(),
});
