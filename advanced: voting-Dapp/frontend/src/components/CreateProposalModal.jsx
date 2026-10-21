import { useState } from "react";
import { useWallet } from "../context/WalletProvider";
import { friendlyError } from "../lib/helpers";
import TxStepper from "./TxStepper";

const DURATIONS = [
  { label: "5 minutes (demo)", seconds: 300 },
  { label: "1 hour", seconds: 3600 },
  { label: "24 hours", seconds: 86400 },
  { label: "7 days", seconds: 604800 },
];

export default function CreateProposalModal({ onClose, onDone }) {
  const { account, getWriteContract, isWrongNetwork } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(300);
  const [stage, setStage] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");

  function setOption(i, value) {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  }

  async function submit() {
    setError("");
    const cleanOptions = options.map((o) => o.trim()).filter((o) => o !== "");
    if (title.trim().length < 5 || title.trim().length > 120) {
      setError("Title should be between 5 and 120 characters");
      return;
    }
    if (description.trim().length < 5) {
      setError("Add a short description so voters know the context");
      return;
    }
    if (cleanOptions.length < 2) {
      setError("Add at least 2 options");
      return;
    }
    if (new Set(cleanOptions.map((o) => o.toLowerCase())).size !== cleanOptions.length) {
      setError("Options should be different from each other");
      return;
    }

    try {
      // everything goes straight into the contract in one transaction -
      // title, description and category are all stored on chain
      setStage(1);
      const contract = await getWriteContract();
      if (!contract) {
        setError("Contract address is not set. Paste it in frontend/.env as VITE_CONTRACT_ADDRESS and restart.");
        setStage(0);
        return;
      }
      const tx = await contract.createProposal(title.trim(), description.trim(), category.trim() || "general", cleanOptions, duration);
      setTxHash(tx.hash);
      setStage(2);
      await tx.wait(1);
      setStage(3);
      setStage(4);
      setTimeout(() => onDone(), 700);
    } catch (err) {
      console.log(err);
      setStage(0);
      setError(friendlyError(err));
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">Create a proposal</h2>
        <p className="text-xs text-gray-500 mt-1">Title, description and options are stored on-chain in one transaction.</p>

        <label className="block text-sm mt-4 mb-1">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" placeholder="Should the fest be held in March?" />

        <label className="block text-sm mt-3 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border rounded px-3 py-2 text-sm" placeholder="Give voters the full context..." />

        <label className="block text-sm mt-3 mb-1">Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />

        <label className="block text-sm mt-3 mb-1">Options</label>
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => setOption(i, e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-2"
            placeholder={"Option " + (i + 1)}
          />
        ))}
        {options.length < 10 && (
          <button onClick={() => setOptions([...options, ""])} className="text-sm text-indigo-600">
            + Add option
          </button>
        )}

        <label className="block text-sm mt-3 mb-1">Voting duration</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-sm">
          {DURATIONS.map((d) => (
            <option key={d.seconds} value={d.seconds}>
              {d.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <TxStepper stage={stage} txHash={txHash} />

        <div className="flex gap-2 mt-5">
          <button
            onClick={submit}
            disabled={!account || isWrongNetwork || stage > 0}
            className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm disabled:opacity-40 hover:bg-indigo-700"
          >
            {!account ? "Connect Wallet First" : "Create Proposal"}
          </button>
          <button onClick={onClose} className="border rounded px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
