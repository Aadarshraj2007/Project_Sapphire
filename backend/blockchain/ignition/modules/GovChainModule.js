import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GovChainModule", (m) => {
  const govChain = m.contract("GovChain");
  return { govChain };
});