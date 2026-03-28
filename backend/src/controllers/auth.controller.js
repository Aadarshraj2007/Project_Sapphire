// backend/src/controllers/auth.controller.js
import { authService } from "../services/auth.service.js";
import { Messages } from "../constants/messages.js";
import {
  contractorSignupSchema,
  govSignupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

export const authController = {

  // ---------------- Contractor Signup ----------------
  contractorSignup: async (req, res) => {
    try {
      const data = contractorSignupSchema.parse(req.body);
      const user = await authService.contractorSignup(data);
      res.status(201).json({
        msg: Messages.AUTH.SIGNUP_SUCCESS,
        userId: user.id, // ✅ added userId
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Government Signup ----------------
  govSignup: async (req, res) => {
    try {
      const data = govSignupSchema.parse(req.body);
      const user = await authService.govSignup(data);
      res.status(201).json({
        msg: Messages.AUTH.SIGNUP_SUCCESS,
        userId: user.id, // ✅ added userId
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Get Approval Status ----------------
  getApprovalStatus: async (req, res) => {
    try {
      const userId = req.user?.id || req.body.userId;
  
      const user = await authService.getApprovalStatus({ userId });
  
      res.json({
        userId: user.id,
        email: user.email,
        role: user.role,
        approved: user.approved,
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Supreme Admin Approve ----------------
  approveUser: async (req, res) => {
    try {
      const { userId, approve } = req.body;
      const user = await authService.approveUser({ userId, approve });
      
      res.json({
        msg: `User ${approve ? "approved" : "rejected"} successfully`,
        user: {
          id: user.id,
          email: user.email,
          approved: user.approved
        }
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Login ----------------
  login: async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const { user, token } = await authService.login(data);
      res.json({
        msg: Messages.AUTH.LOGIN_SUCCESS,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Forgot Password ----------------
  forgotPassword: async (req, res) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const otp = await authService.forgotPassword(data.email);
      res.json({
        msg: "OTP sent to log (for now)",
        otp, // ✅ for testing, remove in production
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Reset Password ----------------
  resetPassword: async (req, res) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(data);
      res.json({ msg: "Password reset successfully" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  // ---------------- Change Password ----------------
  changePassword: async (req, res) => {
    try {
      const data = changePasswordSchema.parse(req.body);
      await authService.changePassword({ ...data, userId: req.user.id });
      res.json({ msg: "Password changed successfully" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await authService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};