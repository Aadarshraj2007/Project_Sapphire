import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRE_IN || "1h",
  DATABASE_URL: process.env.DATABASE_URL,
  HARDHAT_RPC_URL: process.env.BLOCKCHAIN_RPC_URL,
};