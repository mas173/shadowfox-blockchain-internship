import { useState } from "react";
import { shortenAddress } from "../hooks/useWallet";

export default function WalletStatus({ account, chainId, isOwner, isMember }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("copy failed", err);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">Connected wallet</p>
          <p className="mt-1 font-mono text-lg font-semibold">
            {shortenAddress(account)}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-slate-500">
            {account}
          </p>
        </div>
        <button
          onClick={copyAddress}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
        >
          {copied ? "Copied!" : "Copy address"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Chain ID: {chainId}
        </span>
        {isOwner && (
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            CONTRACT OWNER
          </span>
        )}
        {isMember && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            MEMBER
          </span>
        )}
      </div>
    </section>
  );
}
