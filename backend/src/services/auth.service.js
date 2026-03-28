// backend/src/services/auth.service.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "../constants/roles.js";
import { ENV } from "../config/env.js";
import { logInfo, logError } from "../utils/logger.js";

export const authService = {

  // ---------------- Contractor Signup ----------------
  contractorSignup: async (data) => {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: data.email }, { cppUserId: data.cppUserId }] },
      });
      if (existingUser) throw new Error("Email or CPP ID already registered");

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: UserRole.CONTRACTOR,
          cppUserId: data.cppUserId,
          approved: false, // must be added in Prisma schema
        },
      });

      logInfo(`Contractor signed up: ${user.email}`);
      return user; // returns full user including id
    } catch (err) {
      logError("Contractor Signup Error", err);
      throw err;
    }
  },

  // ---------------- Government Signup ----------------
  govSignup: async (data) => {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) throw new Error("Email already registered");

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: UserRole.GOVERNMENT,
          approved: false, // must be added in Prisma schema
        },
      });

      logInfo(`Government signed up: ${user.email}`);
      return user;
    } catch (err) {
      logError("Government Signup Error", err);
      throw err;
    }
  },

  // ---------------- Get Approval Status ----------------
  getApprovalStatus: async ({ userId }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        approved: true,
        role: true,
      },
    });
  
    if (!user) throw new Error("User not found");
  
    return user;
  },

  // ---------------- Supreme Admin Approve/Reject ----------------
  approveUser: async ({userId, approve = true }) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { approved: approve },
    });

    logInfo(`User ${approve ? "approved" : "rejected"} by Supreme Admin: ${user.email}`);
    return user;
  },

  // ---------------- Login ----------------
  login: async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    // Check if approved
    if (user.approved === false) throw new Error("User not approved yet");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    logInfo(`User logged in: ${user.email}`);
    return { user, token };
  },

  // ---------------- Forgot Password ----------------
  forgotPassword: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    logInfo(`OTP for ${user.email}: ${otp} (expires at ${otpExpiry})`);
    return otp;
  },

  // ---------------- Reset Password ----------------
  resetPassword: async ({ email, otp, newPassword }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    if (!user.otp || user.otp !== otp) throw new Error("Invalid OTP");
    if (user.otpExpiry && user.otpExpiry < new Date()) throw new Error("OTP expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, otp: null, otpExpiry: null },
    });

    logInfo(`Password reset for ${user.email}`);
    return true;
  },

  // ---------------- Change Password ----------------
  changePassword: async ({ userId, oldPassword, newPassword }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

    logInfo(`Password changed for ${user.email}`);
    return true;
  },

  getAllUsers: async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approved: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return users;
  },
};