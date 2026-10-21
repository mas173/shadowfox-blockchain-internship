# Architecture

Two layers only. There is no backend, no database and no indexer server — the contract is the whole system, the frontend is a window into it.

| Layer | Tech | Job |
|---|---|---|
| Frontend | React 18 (Vite), Tailwind, Ethers.js v6 `BrowserProvider` | wallet connection, network check, proposal dashboard, transaction stepper, signing, reading events |
| Contract | Solidity ^0.8.20, deployed on Sepolia via Remix + MetaMask | proposals with full description/category stored on-chain, deadlines, one-wallet-one-vote, tallies, finalization, audit events |

Read path: frontend → public Sepolia RPC (no wallet) or MetaMask provider (wallet connected) → contract. Write path: frontend → MetaMask signature → contract. Nothing else is involved.

## Trust rules

- Private keys never leave MetaMask; the frontend never sees or stores one.
- `hasVoted[proposalId][voter]` in the contract is the only duplicate-vote check that matters; UI locks are just convenience.
- Proposal text cannot be edited after creation — title, description, category and options are written into contract storage by `createProposal` and there is no update function.
- Audit trail is the contract's own events (`ProposalCreated`, `VoteCast`, `ProposalFinalized`), read directly with `queryFilter`. Anyone can verify them on a block explorer too.

## Note on the SRS

The SRS in `docs/SRS.pdf` originally specified a third tier (Express.js backend for metadata storage, SHA-256 hashing and event indexing). That tier was removed at the project owner's request: the description and category moved into the `Proposal` struct, event reading moved into the frontend, and hashing/off-chain storage is no longer needed because nothing lives off-chain.

## Contract functions

- `createProposal(title, description, category, optionNames, durationSeconds)` — admin, or anyone if `allowPublicProposals` is on. Needs 2–10 options and duration ≥ 60s.
- `castVote(proposalId, optionIndex)` — one vote per wallet per proposal, only before `endTime`.
- `finalizeProposal(proposalId)` — after the deadline; records `winningOptionId`.
- `getProposal(proposalId)` — proposal, computed status (0 active / 1 ended / 2 finalized) and options with tallies.
- `getVoterReceipt(proposalId, voter)` — whether this wallet voted and which option.

Custom errors: `UnauthorizedCreator`, `InvalidProposalId`, `VotingWindowClosed`, `VotingStillActive`, `AlreadyVotedOnProposal`, `InvalidOptionIndex`, `NotAdmin`.
Events: `ProposalCreated`, `VoteCast`, `ProposalFinalized`.
