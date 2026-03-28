// src/middlewares/role.middleware.js
import { UserRole } from "../constants/roles.js";

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ msg: "You are not authorized to access this resource" });
    }

    next();
  };
};