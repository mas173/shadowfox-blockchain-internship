// wrong network is handled by its own card in App.jsx
export default function MembershipStatus({ status, error, onRefresh }) {
  if (status === "idle" || status === "wrong-network") return null;

  if (status === "checking") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-700">
          Checking membership on-chain...
        </p>
      </div>
    );
  }

  if (status === "member") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-800">
          Membership status: VERIFIED
        </p>
        <p className="mt-1 text-sm text-emerald-700">
          Your wallet holds an active CampusPass membership.
        </p>
      </div>
    );
  }

  if (status === "not-member") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-semibold text-amber-800">
          Membership status: NOT A MEMBER
        </p>
        <p className="mt-1 text-sm text-amber-700">
          This wallet does not have an active CampusPass membership.
        </p>
      </div>
    );
  }

  if (status === "not-configured") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-800">Contract not configured</p>
        <p className="mt-1 text-sm text-red-700">
          Set VITE_CONTRACT_ADDRESS in a .env file (see .env.example) and
          restart the dev server.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-800">
          Could not check membership
        </p>
        <p className="mt-1 text-sm text-red-700">
          {error || "The contract call failed."}
        </p>
        <button
          onClick={onRefresh}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return null;
}
