export const CONTRACT_ADDRESS = "0x035efEe092383e2baFdAAAacF79167c55178fa59";

export const CONTRACT_ABI = [
  { inputs: [], name: "AlreadyRegistered", type: "error" },
  { inputs: [], name: "CreatorNotRegistered", type: "error" },
  { inputs: [], name: "EmptyName", type: "error" },
  { inputs: [], name: "NoFundsSent", type: "error" },
  { inputs: [], name: "NoFundsToWithdraw", type: "error" },
  { inputs: [], name: "NotACreator", type: "error" },
  { inputs: [], name: "WithdrawFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "about", type: "string" },
    ],
    name: "CreatorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "about", type: "string" },
    ],
    name: "CreatorUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "NewCoffee",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address payable", name: "_creator", type: "address" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_message", type: "string" },
    ],
    name: "buyCoffee",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "creators",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "about", type: "string" },
      { internalType: "address payable", name: "owner", type: "address" },
      { internalType: "uint256", name: "totalReceived", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getCreator",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "about", type: "string" },
          { internalType: "address payable", name: "owner", type: "address" },
          { internalType: "uint256", name: "totalReceived", type: "uint256" },
        ],
        internalType: "struct BuyMeACoffee.Creator",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getCreatorBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }],
    name: "getCreatorByName",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "about", type: "string" },
          { internalType: "address payable", name: "owner", type: "address" },
          { internalType: "uint256", name: "totalReceived", type: "uint256" },
        ],
        internalType: "struct BuyMeACoffee.Creator",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getMemoCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_creator", type: "address" }],
    name: "getMemos",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "message", type: "string" },
        ],
        internalType: "struct BuyMeACoffee.Memo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_creator", type: "address" },
      { internalType: "uint256", name: "_offset", type: "uint256" },
      { internalType: "uint256", name: "_limit", type: "uint256" },
    ],
    name: "getMemosPaginated",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "message", type: "string" },
        ],
        internalType: "struct BuyMeACoffee.Memo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_about", type: "string" },
    ],
    name: "registerCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_about", type: "string" },
    ],
    name: "updateCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
