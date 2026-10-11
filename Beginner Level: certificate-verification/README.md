# CertiChain — Certificate Verification System

A minimal blockchain-inspired certificate verification application. An issuer creates a certificate record and a user verifies it using a unique certificate ID. SHA-256 hashes and previous-hash links demonstrate basic blockchain concepts such as tamper resistance and record verification.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Blockchain concept:** SHA-256 hashing + linked records
- **HTTP client:** Axios

## Project Structure

```
certificate-verification/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── blockchain.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation

1. **Install Node.js** — install a current Node.js LTS release and confirm with `node -v` and `npm -v`.
2. **Install MongoDB** — run MongoDB locally, or use MongoDB Atlas. The included URI uses `mongodb://127.0.0.1:27017/certificate_chain`.
3. **Install backend packages** — open a terminal in the `server` folder and run:
   ```
   npm install
   ```
4. **Start backend**:
   ```
   npm run dev
   ```
   The API should run on port 5000.
5. **Install frontend packages** — open another terminal in the `client` folder and run:
   ```
   npm install
   ```
6. **Start frontend**:
   ```
   npm run dev
   ```
   Open the Vite URL, normally http://localhost:5173.

## How to Test

Open the frontend and choose **Issue Certificate**. Enter a student name, course, institution and date. After issuing, copy the generated Certificate ID. Open **Verify Certificate**, enter the ID and verify it. A valid record should display its certificate details and hash. Try an unknown ID to demonstrate the failed verification path.

## How the Blockchain Concept Works

Each block contains certificate data, its SHA-256 hash, and the hash of the previous block. Changing the data changes the calculated hash, which provides a simple demonstration of tamper detection. This is a simplified blockchain-inspired implementation, not a decentralized production blockchain.

## Important Notes

This beginner implementation does not use MetaMask, WalletConnect, Solidity, Ethereum or a real decentralized blockchain. Wallet connection is part of the intermediate level.
