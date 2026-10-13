import { useState } from "react";
import { ethers } from "ethers";
import TransactionStatus from "./TransactionStatus";

// Only rendered when the connected wallet is the contract owner.
// No password or admin login - the contract's onlyOwner does the real check.
export default function AdminDashboard({
  tx,
  onGrant,
  onRemove,
  onClearTx,
}) {
  const [grantAddress, setGrantAddress] = useState("");
  const [removeAddress, setRemoveAddress] = useState("");
  const [grantError, setGrantError] = useState("");
  const [removeError, setRemoveError] = useState("");

  const isTxPending = tx && tx.status === "pending";

  function handleGrant(e) {
    e.preventDefault();
    const address = grantAddress.trim();
    if (!ethers.isAddress(address)) {
      setGrantError("Enter a valid wallet address (starts with 0x).");
      return;
    }
    setGrantError("");
    onGrant(address);
  }

  function handleRemove(e) {
    e.preventDefault();
    const address = removeAddress.trim();
    if (!ethers.isAddress(address)) {
      setRemoveError("Enter a valid wallet address (starts with 0x).");
      return;
    }
    setRemoveError("");
    onRemove(address);
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <p className="mt-1 text-sm text-slate-600">
        You are the contract owner. Granting or removing membership sends a
        real on-chain transaction - MetaMask will ask you to confirm it.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form
          onSubmit={handleGrant}
          className="rounded-xl border border-slate-200 p-4"
        >
          <h3 className="font-semibold">Grant Membership</h3>
          <label className="mt-3 block text-sm font-medium text-slate-700">
            Wallet address
          </label>
          <input
            value={grantAddress}
            onChange={(e) => setGrantAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-violet-600"
          />
          {grantError && (
            <p className="mt-2 text-sm text-red-600">{grantError}</p>
          )}
          <button
            type="submit"
            disabled={isTxPending}
            className="mt-3 w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {isTxPending ? "Transaction pending..." : "Grant Membership"}
          </button>
        </form>

        <form
          onSubmit={handleRemove}
          className="rounded-xl border border-slate-200 p-4"
        >
          <h3 className="font-semibold">Remove Membership</h3>
          <label className="mt-3 block text-sm font-medium text-slate-700">
            Wallet address
          </label>
          <input
            value={removeAddress}
            onChange={(e) => setRemoveAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-violet-600"
          />
          {removeError && (
            <p className="mt-2 text-sm text-red-600">{removeError}</p>
          )}
          <button
            type="submit"
            disabled={isTxPending}
            className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isTxPending ? "Transaction pending..." : "Remove Membership"}
          </button>
        </form>
      </div>

      <TransactionStatus tx={tx} onClear={onClearTx} />
    </section>
  );
}
