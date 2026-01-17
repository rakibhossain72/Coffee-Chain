# Coffee Chain

Coffee Chain is a decentralized platform built on the Ethereum blockchain that allows supporters to send tips to creators. This project enables creators to build a profile, receive ETH contributions, and manage messages from supporters in a transparent and secure manner.

## Live Application

The application is deployed and can be accessed at:
[Here](https://coffee-chain-sepolia.vercel.app/)

## Smart Contract Details

The smart contract is deployed on the Ethereum Sepolia Testnet.

*   Contract Address: 0x035efEe092383e2baFdAAAacF79167c55178fa59
*   Network: Ethereum Sepolia

## Key Features

### For Creators

*   Profile Registration: Creators can register their name and bio on-chain.
*   Profile Management: Creators can update their display name and bio at any time.
*   Tip Collection: Accumulated ETH tips are stored securely in the contract until the creator withdraws them.
*   Fund Withdrawal: Creators can withdraw their total balance to their wallet address.
*   Supporter Messages: Creators can view all messages and tips sent to them.

### For Supporters

*   Send Tips: Supporters can send ETH to any registered creator.
*   Personalized Messages: Supporters can include their name and a message with their tip.
*   Transparency: All transactions and messages are permanently recorded on the blockchain.

## Technical Stack

### Smart Contracts

The core logic is implemented in Solidity and managed using the Foundry development toolkit. Features include:
*   Secure fund management using the Checks-Effects-Interactions pattern.
*   Gas-efficient data retrieval with paginated memos.
*   Robust error handling with custom Solidity errors.

### Frontend

The user interface is built with:
*   Next.js: Application framework.
*   Wagmi and Viem: Blockchain interaction libraries.
*   Tailwind CSS: Interface styling.

## Getting Started

### Smart Contract Development

To work with the smart contracts:
1. Navigate to the contracts directory.
2. Install dependencies using forge install.
3. Compile the contracts with forge build.
4. Execute tests with forge test.

### Frontend Development

To run the web application locally:
1. Navigate to the frontend directory.
2. Install dependencies using npm install.
3. Start the development server with npm run dev.
