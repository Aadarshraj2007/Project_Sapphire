import { z } from "zod";

const strongPassword = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

export const contractorSignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required"),
  cppUserId: z.string().min(3),
  password: strongPassword,
});

export const govSignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required"),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  newPassword: strongPassword,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: strongPassword,
});