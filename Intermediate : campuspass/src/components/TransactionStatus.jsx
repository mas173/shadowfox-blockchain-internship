export default function TransactionStatus({ tx, onClear }) {
  if (!tx || tx.status === "idle") return null;

  if (tx.status === "pending") {
    return (
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
          <p className="font-semibold text-blue-800">Transaction pending</p>
        </div>
        <p className="mt-2 text-sm text-blue-700">{tx.message}</p>
        {tx.hash && (
          <p className="mt-1 break-all font-mono text-xs text-blue-700">
            Tx hash: {tx.hash}
          </p>
        )}
      </div>
    );
  }

  if (tx.status === "success") {
    return (
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-semibold text-emerald-800">
          Transaction successful
        </p>
        <p className="mt-1 text-sm text-emerald-700">{tx.message}</p>
        {tx.hash && (
          <p className="mt-1 break-all font-mono text-xs text-emerald-700">
            Tx hash: {tx.hash}
          </p>
        )}
        <button
          onClick={onClear}
          className="mt-3 text-sm font-medium text-emerald-700 underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="font-semibold text-red-800">Transaction failed</p>
      <p className="mt-1 text-sm text-red-700">{tx.message}</p>
      <button
        onClick={onClear}
        className="mt-3 text-sm font-medium text-red-700 underline"
      >
        Dismiss
      </button>
    </div>
  );
}
