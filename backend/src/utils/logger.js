// utils/logger.js

/**
 * Log info messages
 * @param {string} message
 * @param {any} extra optional extra data
 */
export const logInfo = (message, extra = null) => {
  console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
  if (extra) console.log(extra);
};

/**
 * Log error messages
 * @param {string} message
 * @param {any} extra optional extra data
 */
export const logError = (message, extra = null) => {
  console.error(`[ERROR] [${new Date().toISOString()}] ${message}`);
  if (extra) console.error(extra);
};