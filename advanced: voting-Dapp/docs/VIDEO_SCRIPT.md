# Demo video script (3–5 minutes)

For the ShadowFox submission video, shared via a Google Drive link.

- **0:00–0:45 — Why blockchain for voting.** Centralised voting stores ballots in one database an admin can silently edit. This app commits every vote as a signed transaction to an append-only chain, enforces one-wallet-one-vote in the contract, and lets anyone audit the `VoteCast` events.
- **0:45–1:45 — Contract and architecture walkthrough.** Show `DecentralisedVoting.sol`: `Proposal`/`Option` structs (description and category stored on-chain — there is no backend at all), `hasVoted` mapping, custom errors, `createProposal` / `castVote` / `finalizeProposal`. Then show how the React frontend talks straight to the contract: MetaMask for signing, public RPC for reads.
- **1:45–3:30 — Live demo.** Show the contract already deployed on Sepolia from Remix (paste the address into `frontend/.env`), start the frontend. Connect MetaMask, create a proposal, cast a vote and follow the 4-stage stepper: signature → tx hash in mempool → confirmed block → tallies update.
- **3:30–4:30 — Tamper resistance and audit.** Try voting again from the same wallet: UI shows the verified receipt and the contract reverts with `AlreadyVotedOnProposal`. Switch to a second MetaMask account and vote successfully. Open the Audit Explorer and show the `VoteCast` events with block numbers and tx hashes. If time permits, create a 5-minute proposal, let it expire, and finalize it to show the winner being recorded on chain.
