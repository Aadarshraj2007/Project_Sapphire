import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  locationState: z.string().min(2),
  locationCity: z.string().min(2),
  budget: z.number().positive(),
  contractorCppId: z.string().optional(),
});

export const getProjectsSchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
});