import { z } from "zod";

// Validate payment request (route param)
export const processPaymentSchema = z.object({
  milestoneId: z.string().uuid("Invalid milestone ID"),
});