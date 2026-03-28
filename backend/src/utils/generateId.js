// utils/generateId.js

import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique ID
 * @returns {string} UUID v4
 */
export const generateId = () => {
  return uuidv4();
};