// the 4 stages every transaction goes through, shown while waiting
const STEPS = [
  "Waiting for wallet signature",
  "Broadcasting & mining in mempool",
  "Confirmed on blockchain",
  "State synchronized",
];

export default function TxStepper({ stage, txHash, blockNumber }) {
  if (stage === 0) return null;
  return (
    <div className="mt-4 border rounded p-3 bg-gray-50">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = stage > n;
        const current = stage === n;
        return (
          <div key={label} className="flex items-center gap-2 py-1">
            <span
              className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${
                done ? "bg-green-500 text-white" : current ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {done ? "✓" : n}
            </span>
            <span className={`text-sm ${current ? "font-medium" : "text-gray-600"}`}>{label}</span>
            {current && n === 2 && <span className="text-xs text-gray-400">waiting...</span>}
          </div>
        );
      })}
      {txHash && (
        <p className="text-xs text-gray-500 mt-2 break-all">
          tx: {txHash}
          {blockNumber ? " · block " + blockNumber : ""}
        </p>
      )}
    </div>
  );
}
