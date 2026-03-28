import "dotenv/config"; // ensures process.env is loaded
import app from "./app.js";
import { seedAdmin } from "./config/seedAdmin.js";
import { ENV } from "./config/env.js"; // your env variables
import { logInfo, logError } from "./utils/logger.js";
import { cleanUnapprovedUsers } from "./services/cleanupService.js"; // optional cleanup

const PORT = ENV.PORT || 5000;

app.listen(PORT, async () => {
  logInfo(`Server running on http://localhost:${PORT}/api`);

  // Optional: Cleanup unapproved users on startup
  if (typeof cleanUnapprovedUsers === "function") {
    try {
      await cleanUnapprovedUsers();
      logInfo("Cleanup of unapproved users executed successfully");
    } catch (err) {
      logError("Cleanup error", err);
    }
  }
   await seedAdmin(); // ✅ create admin automatically
});

// Handle unexpected errors gracefully
process.on("unhandledRejection", (err) => {
  logError("Unhandled Rejection", err);
});

process.on("uncaughtException", (err) => {
  logError("Uncaught Exception", err);
  process.exit(1); // Optional: Exit process on fatal error
});