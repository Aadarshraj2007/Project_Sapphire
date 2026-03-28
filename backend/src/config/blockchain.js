import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct path to blockchain folder (outside src)
const abiPath = path.join(
  __dirname,
  "../../blockchain/artifacts/contracts/GovChain.sol/GovChain.json"
);

// Safety check (recommended)
if (!fs.existsSync(abiPath)) {
  throw new Error(`ABI file not found at: ${abiPath}`);
}

// Load ABI
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
const contractABI = contractJson.abi;

// Provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Signer (government/admin wallet)
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

// Contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

export { provider, signer, contract };