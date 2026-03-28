// constants/message.js

export const Messages = {
  AUTH: {
    NO_TOKEN: "No token provided",
    INVALID_TOKEN: "Invalid token",
    INVALID_CREDENTIALS: "Invalid email or password",
    CPP_ALREADY_REGISTERED: "CPP ID already registered",
    SIGNUP_SUCCESS: "Signup successful",
    LOGIN_SUCCESS: "Login successful",
  },

  PROJECT: {
    CREATED: "Project created successfully",
    NOT_FOUND: "Project not found",
    ACCESS_DENIED: "You are not authorized to access this project",
  },

  MILESTONE: {
    CREATED: "Milestone created successfully",
    UPDATED: "Milestone updated successfully",
    NOT_FOUND: "Milestone not found",
  },

  DOCUMENT: {
    UPLOADED: "Document uploaded successfully",
    HASH_EXISTS: "Document with same hash already exists",
  },

  TRANSACTION: {
    INITIATED: "Transaction initiated",
    SUCCESS: "Transaction successful",
    FAILED: "Transaction failed",
  },

  NOTIFICATION: {
    SENT: "Notification sent",
  },

  COMPLAINT: {
    SUBMITTED: "Complaint submitted",
    NOT_FOUND: "Complaint not found",
  },

  AUDIT: {
    LOGGED: "Action logged in audit",
  },

  GENERAL: {
    SERVER_ERROR: "Internal server error",
    VALIDATION_ERROR: "Validation failed",
  },
};