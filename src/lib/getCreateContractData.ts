import { Address, encodeFunctionData } from "viem";

// ABI for the token contract (create function)
const tokenAbi = [
  {
    inputs: [
      { internalType: "string", name: "newContractURI", type: "string" },
      { internalType: "string", name: "name", type: "string" },
      {
        components: [
          {
            internalType: "uint32",
            name: "royaltyMintSchedule",
            type: "uint32",
          },
          { internalType: "uint32", name: "royaltyBPS", type: "uint32" },
          {
            internalType: "address",
            name: "royaltyRecipient",
            type: "address",
          },
        ],
        internalType: "struct ICreatorRoyaltiesControl.RoyaltyConfiguration",
        name: "defaultRoyaltyConfiguration",
        type: "tuple",
      },
      {
        internalType: "address payable",
        name: "defaultAdmin",
        type: "address",
      },
      { internalType: "bytes[]", name: "setupActions", type: "bytes[]" },
    ],
    name: "createContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const getCreateContractData = (defaultAdmin: Address) => {
  // Collection details
  const contractUri = "ar://contractUri"; // Your contract metadata URI
  const collectionName = "My Art Collection"; // Your collection name

  // Royalty configuration
  const royaltyConfig = {
    royaltyMintSchedule: 0,
    royaltyBPS: 0, // 0% royalties (set to 1000 for 10%)
    royaltyRecipient: defaultAdmin,
  };

  const args = [
    contractUri,
    collectionName,
    royaltyConfig,
    defaultAdmin, // defaultAdmin
    [], // setupActions
  ] as const;

  console.log(args);
  // Encode the function call data
  const createContractData = encodeFunctionData({
    abi: tokenAbi,
    functionName: "createContract",
    args,
  });

  return createContractData;
};

export default getCreateContractData;
