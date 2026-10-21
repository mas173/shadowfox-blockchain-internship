# Deploying the contract with Remix + MetaMask (Sepolia)

You deploy the contract yourself, from your own wallet. No private key goes into this project anywhere — the only config the app needs is the contract address, pasted into one `.env` file. There is no backend to configure.

## Before you start

- MetaMask installed, with some **Sepolia ETH** in the wallet you will deploy from. Free test ETH: Google Cloud Sepolia faucet (https://cloud.google.com/application/web3/faucet/ethereum/sepolia) or Alchemy's Sepolia faucet (https://www.alchemy.com/faucets/ethereum-sepolia).
- In MetaMask, switch the network to **Sepolia**. (If Sepolia is not in the network list, turn on "Show test networks" in MetaMask settings.)

## Steps

1. Open **https://remix.ethereum.org**
2. In the File Explorer, create a new file called `DecentralisedVoting.sol` and paste the full contents of `contracts/DecentralisedVoting.sol` from this project into it. (Or upload the file using the upload icon.)
3. Open the **Solidity Compiler** tab (second icon on the left):
   - Compiler version: **0.8.20** or any newer 0.8.x (the contract uses `pragma solidity ^0.8.20`)
   - Click **Compile DecentralisedVoting.sol** — you should get a green tick with no errors.
4. Open the **Deploy & Run Transactions** tab (third icon):
   - Environment: **Injected Provider - MetaMask**. MetaMask will pop up — connect it.
   - Check the ACCOUNT shown in Remix is your Sepolia account with test ETH.
   - Contract dropdown: `DecentralisedVoting`.
   - Click **Deploy** and confirm the transaction in MetaMask. It costs a little Sepolia ETH.
5. The contract appears under **Deployed Contracts** in Remix. Copy its address (the copy icon next to it — it looks like `0x...`). This is the only thing the rest of the project needs.
6. **Important, still in Remix:** right after deploying, only the deployer wallet (you) can create proposals. If you want any wallet to create proposals in the demo, expand the deployed contract in Remix, enter `true` next to **setAllowPublicProposals** and click it, then confirm in MetaMask. If you skip this, just always connect the app with the same wallet that deployed.

## Paste the address into the project

One place only — **`frontend/.env`**:

```
VITE_CONTRACT_ADDRESS=0xYourCopiedAddress
```

`VITE_CHAIN_ID` (Sepolia, 11155111) and `VITE_RPC_URL` (a public Sepolia RPC used for read-only browsing) are already set in that file. There is no address hardcoded anywhere in the code — the ABI lives in `frontend/src/contracts/abi.js`, the address only ever comes from `.env`.

## Then run the app

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Connect MetaMask (on Sepolia), create a proposal, vote, then try voting again with the same wallet — it gets blocked with the on-chain receipt. Switch to a second MetaMask account to cast another vote.

Note: after editing `.env`, restart the frontend — Vite only reads it at startup.
