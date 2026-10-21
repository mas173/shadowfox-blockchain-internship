import { useState } from "react";
import { useWallet } from "../context/WalletProvider";
import { friendlyError } from "../lib/helpers";
import TxStepper from "./TxStepper";

export default function VotingModal({ proposal, receipt, onClose, onDone }) {
  const { account, getWriteContract, isWrongNetwork } = useWallet();
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState(0); // 0 idle, 1 sign, 2 mining, 3 confirmed, 4 synced
  const [txHash, setTxHash] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const alreadyVoted = receipt && receipt.voted;
  const total = proposal.totalVotes || 0;

  async function castVote() {
    setError("");
    if (selected === null) {
      setError("Pick an option first");
      return;
    }
    try {
      setStage(1);
      const contract = await getWriteContract();
      if (!contract) {
        setError("Contract address is not set. Paste it in frontend/.env as VITE_CONTRACT_ADDRESS and restart.");
        setStage(0);
        return;
      }
      const tx = await contract.castVote(proposal.id, selected);
      setTxHash(tx.hash);
      setStage(2);
      const done = await tx.wait(1);
      setBlockNumber(done.blockNumber);
      setStage(3);
      // last step is just re-reading the contract, loadProposals does it
      setStage(4);
      setTimeout(() => onDone(), 700);
    } catch (err) {
      console.log(err);
      setStage(0);
      setError(friendlyError(err));
    }
  }

  async function finalize() {
    setError("");
    setFinalizing(true);
    try {
      const contract = await getWriteContract();
      const tx = await contract.finalizeProposal(proposal.id);
      await tx.wait(1);
      onDone();
    } catch (err) {
      setError(friendlyError(err));
    }
    setFinalizing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">{proposal.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {proposal.description && <p className="text-sm text-gray-600 mt-2">{proposal.description}</p>}
        {proposal.category && <p className="text-xs text-gray-400 mt-1">#{proposal.category} · stored on-chain</p>}

        {alreadyVoted && (
          <p className="text-sm mt-3 bg-indigo-50 text-indigo-700 rounded px-3 py-2">
            You voted for Option #{Number(receipt.choice) + 1} - Verified On-Chain
          </p>
        )}

        <div className="mt-4 space-y-2">
          {proposal.options.map((opt) => {
            const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
            const isWinner = proposal.finalized && Number(proposal.winningOptionId) === opt.id;
            return (
              <label
                key={opt.id}
                className={`block border rounded p-3 cursor-pointer ${selected === opt.id ? "border-indigo-500 bg-indigo-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="radio"
                      name="option"
                      disabled={alreadyVoted || proposal.status !== "active"}
                      checked={selected === opt.id}
                      onChange={() => setSelected(opt.id)}
                    />
                    {opt.name}
                    {isWinner && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Winner</span>}
                  </span>
                  <span className="text-sm text-gray-500">
                    {opt.voteCount} votes · {pct}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded mt-2">
                  <div className="h-2 bg-indigo-500 rounded" style={{ width: pct + "%" }}></div>
                </div>
              </label>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <TxStepper stage={stage} txHash={txHash} blockNumber={blockNumber} />

        <div className="flex gap-2 mt-5">
          {proposal.status === "active" && (
            <button
              onClick={castVote}
              disabled={!account || alreadyVoted || isWrongNetwork || stage > 0}
              className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm disabled:opacity-40 hover:bg-indigo-700"
            >
              {!account ? "Connect Wallet to Vote" : alreadyVoted ? "Already Voted" : "Cast Vote"}
            </button>
          )}
          {proposal.status === "ended" && (
            <button
              onClick={finalize}
              disabled={!account || isWrongNetwork || finalizing}
              className="flex-1 bg-gray-800 text-white rounded py-2 text-sm disabled:opacity-40"
            >
              {finalizing ? "Finalizing..." : "Finalize Result"}
            </button>
          )}
          <button onClick={onClose} className="border rounded px-4 py-2 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
