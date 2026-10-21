# Decentralised Voting dApp

A Web3 voting prototype built for the **ShadowFox Blockchain Developer Internship (Advanced Level)**. There is no backend in this project at all — the Solidity smart contract holds everything (proposals, descriptions, options, votes, tallies, deadlines) and the React frontend talks directly to the contract through MetaMask and a public Sepolia RPC.

Normal voting sites keep ballots in one database that an admin can quietly edit. Here every vote is a signed on-chain transaction, the contract itself rejects a second vote from the same wallet (`hasVoted[proposalId][voter]`), and anyone can audit the `VoteCast` events straight from the chain.

**Deployment is manual, on purpose:** you deploy the contract yourself in Remix with MetaMask on the Sepolia testnet, and the only setup after that is pasting the contract address into one `.env` file. No private key is stored anywhere in this project.

## Project structure

```
contracts/    DecentralisedVoting.sol - single file, no imports, paste straight into Remix
frontend/     React (Vite) + Tailwind + Ethers.js v6 app, config in frontend/.env
docs/         SRS, architecture notes, Remix deploy guide, demo video script
```

## How it works

1. **Create** — the creator fills in title, description, category, options and duration, and signs one transaction: `createProposal(title, description, category, options, duration)`. Everything is stored in the contract, including the full description text — there is no off-chain copy anywhere.
2. **Vote** — the voter picks an option and signs `castVote(proposalId, optionIndex)` in MetaMask. A 4-stage stepper shows: wallet signature → mempool (tx hash) → confirmed (block number) → UI synchronized by re-reading the contract.
3. **Verify** — the contract blocks duplicate votes with the custom error `AlreadyVotedOnProposal`. Voters see a receipt badge ("You voted for Option #2 — Verified On-Chain") from `getVoterReceipt`. The Audit Explorer reads `ProposalCreated` / `VoteCast` / `ProposalFinalized` events directly from the chain with `queryFilter` — no server indexes anything.
4. **Finalize** — after the deadline, anyone can call `finalizeProposal`; the contract counts the winner and emits `ProposalFinalized`. Voting after the deadline reverts with `VotingWindowClosed`.

Visitors who have not connected a wallet can still browse proposals and results: the frontend reads through a public Sepolia RPC (`VITE_RPC_URL`). Writes always need MetaMask.

## Setup

### 1. Deploy the contract in Remix (Sepolia)

Full click-by-click version: [docs/REMIX_DEPLOY.md](docs/REMIX_DEPLOY.md). Short version:

1. Get some Sepolia ETH in MetaMask (any public Sepolia faucet).
2. On [remix.ethereum.org](https://remix.ethereum.org), paste `contracts/DecentralisedVoting.sol` into a new file, compile with Solidity **0.8.20+**.
3. Deploy & Run → Environment **Injected Provider - MetaMask**, network Sepolia → **Deploy**, confirm in MetaMask.
4. Copy the deployed contract address.
5. Optional: in Remix, call `setAllowPublicProposals(true)` on the deployed contract so wallets other than the deployer can also create proposals. Without this, only the deployer wallet can create them.

### 2. Paste the contract address into `.env`

One file, one line — this is the only configuration step:

**`frontend/.env`**
```
VITE_CONTRACT_ADDRESS=0xYourCopiedAddress
```

`VITE_CHAIN_ID` is already set to `11155111` (Sepolia) and `VITE_RPC_URL` already points at a public Sepolia RPC in that file. The address is read from `.env` at startup and is never hardcoded — the contract ABI is committed at `frontend/src/contracts/abi.js`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Connect MetaMask (Sepolia network), create a proposal, vote, then try voting again from the same wallet — it gets blocked and you see your verified receipt. Switch MetaMask accounts to cast a vote from a second wallet. If you change `.env` later, restart the frontend — Vite only reads it at startup.

## Contract functions (quick reference)

| Function | What it does |
|---|---|
| `createProposal(title, description, category, optionNames, durationSeconds)` | creates a proposal, storing everything on-chain. Admin only, or anyone if `allowPublicProposals` is on. Needs 2–10 options, duration ≥ 60s |
| `castVote(proposalId, optionIndex)` | one vote per wallet per proposal, only before the deadline |
| `finalizeProposal(proposalId)` | after the deadline; records the winning option |
| `getProposal(proposalId)` | proposal, computed status (0 active / 1 ended / 2 finalized) and options with live tallies |
| `getVoterReceipt(proposalId, voter)` | whether this wallet voted, and which option |

Custom errors: `UnauthorizedCreator`, `InvalidProposalId`, `VotingWindowClosed`, `VotingStillActive`, `AlreadyVotedOnProposal`, `InvalidOptionIndex`, `NotAdmin`.
Events: `ProposalCreated`, `VoteCast`, `ProposalFinalized`.

The original SRS (which specified an Express backend tier) is kept in `docs/SRS.pdf` for reference; this build deliberately replaces that tier with full on-chain storage — see `docs/ARCHITECTURE.md`. Demo video script: `docs/VIDEO_SCRIPT.md`.
