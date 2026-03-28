import jwt from "jsonwebtoken";
import { Messages } from "../constants/messages.js";
import { ENV } from "../config/env.js";

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ msg: Messages.AUTH.NO_TOKEN });

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ msg: "Forbidden" });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: Messages.AUTH.INVALID_TOKEN });
    }
  };
};