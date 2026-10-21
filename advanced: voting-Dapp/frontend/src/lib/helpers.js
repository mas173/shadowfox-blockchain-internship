// small helpers used in a few places

// public Sepolia RPC, only used for read-only browsing when no wallet
// is connected. All writes always go through MetaMask.
export const RPC_URL = import.meta.env.VITE_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
export const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111);

export function shortAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function timeLeft(endTime) {
  if (!endTime) return "";
  const diff = endTime * 1000 - Date.now();
  if (diff <= 0) return "ended";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + " min left";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hr left";
  return Math.floor(hrs / 24) + " days left";
}

export function friendlyError(err) {
  const msg = (err && (err.message || "")) + " " + (err && err.code ? err.code : "");
  if (msg.includes("4001") || msg.toLowerCase().includes("user rejected") || msg.toLowerCase().includes("denied")) {
    return "Transaction signature was cancelled in your wallet";
  }
  if (msg.includes("AlreadyVotedOnProposal")) return "This wallet has already cast a vote on this proposal";
  if (msg.includes("VotingWindowClosed")) return "Voting for this proposal has ended";
  if (msg.includes("VotingStillActive")) return "Voting is still active, it can only be finalized after the deadline";
  if (msg.includes("InvalidOptionIndex")) return "That option does not exist on this proposal";
  if (msg.includes("UnauthorizedCreator")) return "This wallet is not allowed to create proposals";
  if (msg.includes("insufficient funds")) return "Not enough ETH in this wallet for gas";
  return "Transaction failed. Check your wallet and try again.";
}
