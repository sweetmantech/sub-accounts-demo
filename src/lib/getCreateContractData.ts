import { Address, encodeFunctionData } from "viem";
import {
  zoraCreator1155ImplABI as abi,
  zoraCreator1155FactoryImplABI as factoryAbi,
} from "@zoralabs/protocol-deployments";

const getCreateContractData = (defaultAdmin: Address) => {
  // Collection details
  const contractUri = "ar://YD2R8yUf0AH9zWFkAxb9er_wEmcvydaB8X1GDSPrkW0"; // Your contract metadata URI
  const collectionName = "My Art Collection"; // Your collection name

  // Royalty configuration
  const royaltyConfig = {
    royaltyMintSchedule: 0,
    royaltyBPS: 0, // 0% royalties (set to 1000 for 10%)
    royaltyRecipient: defaultAdmin,
  };

  const setupNewTokenData = encodeFunctionData({
    abi,
    functionName: "setupNewToken",
    args: [contractUri, BigInt(100)],
  });

  const args = [
    contractUri,
    collectionName,
    royaltyConfig,
    defaultAdmin, // defaultAdmin
    [setupNewTokenData], // setupActions
  ] as const;

  console.log(args);
  // Encode the function call data
  const createContractData = encodeFunctionData({
    abi: factoryAbi,
    functionName: "createContract",
    args,
  });

  return createContractData;
};

export default getCreateContractData;
