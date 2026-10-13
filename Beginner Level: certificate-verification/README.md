# Blockchain Development Internship — ShadowFox

A collection of blockchain and Web3 projects developed as part of the **ShadowFox Blockchain Developer Internship**. This repository progresses from a beginner-friendly certificate verification system to wallet-connected decentralized applications and smart contract-based crowdfunding.

## Projects

### 1. Beginner — CertiChain

**Certificate Verification and Tamper Detection**

CertiChain is a blockchain-inspired application designed to issue and verify digital certificates using cryptographic hashing.

**Planned features**
- Web interface for entering certificate details.
- Unique certificate IDs and record storage.
- SHA-256 hashing for certificate fingerprints.
- Certificate verification and tamper detection.
- Display of verification results.
- Explanation of how blockchain provides integrity, transparency, and trust.

**Technologies:** React, Vite, Node.js, Express.js, SHA-256.

### 2. Intermediate — MemberGate

**Wallet-Based Token-Gated Access**

MemberGate is a decentralized application that connects a user's Web3 wallet and checks token ownership before granting access to protected content.

**Planned features**
- MetaMask wallet connection.
- Wallet address and connection status display.
- Token ownership verification.
- Access control for members.
- Smart contract interaction and transaction feedback where applicable.

**Technologies:** React, Vite, Solidity, Hardhat, ethers.js, MetaMask.

### 3. Advanced — FundChain

**Smart Contract-Based Crowdfunding**

FundChain is a Web3 crowdfunding prototype that allows users to contribute funds to a campaign through blockchain transactions.

**Planned features**
- Campaign information and fundraising progress.
- Wallet connection.
- Smart contract-based contributions.
- Transaction confirmation and status display.
- Contribution records and campaign progress.
- End-to-end testing of the application.

**Technologies:** React, Vite, Solidity, Hardhat, ethers.js, MetaMask.

## Repository Structure

```text
BlockChain-ShadowFox-Internship/
├── beginner/
│   └── certichain/
│       ├── frontend/
│       ├── backend/
│       └── README.md
├── intermediate/
│   └── membergate/
│       ├── frontend/
│       ├── contracts/
│       ├── scripts/
│       ├── test/
│       ├── hardhat.config.js
│       ├── package.json
│       └── README.md
├── advanced/
│   └── fundchain/
│       ├── frontend/
│       ├── contracts/
│       ├── scripts/
│       ├── test/
│       ├── hardhat.config.js
│       ├── package.json
│       └── README.md
├── docs/
│   ├── architecture.md
│   ├── screenshots/
│   └── video-script.md
├── .gitignore
└── README.md
```

*Note: This is the planned structure. Some folders and features will be added as development progresses.*

## Prerequisites

Install the following tools as needed for each project:

- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MetaMask](https://metamask.io/) for wallet-based projects
- [Hardhat](https://hardhat.org/) for smart contract development

## Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/BlockChain-ShadowFox-Internship.git
cd BlockChain-ShadowFox-Internship
```

Replace `YOUR-USERNAME` with your GitHub username.

### Run the Beginner Project

```bash
cd beginner/certichain/frontend
npm install
npm run dev
```

Follow the terminal output to open the local development URL, usually `http://localhost:5173/`.

The backend and blockchain projects will have their own setup instructions in their respective README files as they are implemented.

## Development Roadmap

- [x] Create the GitHub repository and define the project structure.
- [x] Initialize the CertiChain React frontend.
- [ ] Implement certificate issuance and verification.
- [ ] Add SHA-256 fingerprints and backend record storage.
- [ ] Build the MemberGate wallet connection and token verification.
- [ ] Develop and test the FundChain crowdfunding contract.
- [ ] Integrate the smart contracts with their frontends.
- [ ] Add screenshots, project documentation, and demonstration videos.
- [ ] Complete end-to-end testing and prepare the internship submission.

## Security Considerations

- Never commit private keys, seed phrases, passwords, or API secrets.
- Use environment variables for sensitive configuration.
- Test smart contracts on a local blockchain or test network before considering deployment.
- Do not store sensitive personal information directly on a public blockchain.
- Treat certificate hashes as integrity checks, not proof that the original certificate was legitimately issued.

## Learning Objectives

Through these projects, this repository demonstrates the practical application of:

- Cryptographic hashing and data integrity.
- Record validation and tamper detection.
- Blockchain fundamentals and decentralized trust.
- Ethereum wallets and smart contract interaction.
- Solidity development and testing.
- Transaction handling and frontend integration.
- Documentation and end-to-end project development.

## Internship Submission

The repository will contain the source code, project-specific documentation, and supporting screenshots for the internship tasks. Demonstration videos and submission details will be added when the projects are ready.

## Disclaimer

These projects are educational prototypes developed for learning and internship purposes. They are not intended for production use without appropriate security reviews, testing, and deployment safeguards.

---

**Built as part of the ShadowFox Blockchain Developer Internship.**