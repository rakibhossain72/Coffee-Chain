export const CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "registerCreator",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_about", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCreator",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_about", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buyCoffee",
    inputs: [
      { name: "_creator", type: "address" },
      { name: "_name", type: "string" },
      { name: "_message", type: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getCreator",
    inputs: [{ name: "_creator", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "about", type: "string" },
          { name: "owner", type: "address" },
          { name: "totalReceived", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMemos",
    inputs: [{ name: "_creator", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "from", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "name", type: "string" },
          { name: "message", type: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMemosPaginated",
    inputs: [
      { name: "_creator", type: "address" },
      { name: "_offset", type: "uint256" },
      { name: "_limit", type: "uint256" },
    ],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "from", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "name", type: "string" },
          { name: "message", type: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCreatorBalance",
    inputs: [{ name: "_creator", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMemoCount",
    inputs: [{ name: "_creator", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const
