import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545"; // Hardhat local network

const provider = new ethers.JsonRpcProvider(RPC_URL);

const txHash = "0x48c4f9688ab9bce76bffaf6a59f7435314f30c369a0361c8149b96d4d562504a";

async function checkTransaction() {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);

    console.log("Transaction Receipt:");
    console.log(receipt);

    if (receipt) {
      console.log("Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
      console.log("Block Number:", receipt.blockNumber);
      console.log("Gas Used:", receipt.gasUsed.toString());
    } else {
      console.log("Transaction not found");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkTransaction();