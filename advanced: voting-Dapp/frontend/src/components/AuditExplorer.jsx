import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletProvider";
import { shortAddress } from "../lib/helpers";

// reads contract events directly from the chain with queryFilter.
// public RPCs limit how far back one query can go, so we scan the
// most recent ~9000 blocks, which is plenty for a demo audit trail.
export default function AuditExplorer() {
  const { getReadContract, contractAddress } = useWallet();
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function load() {
      const contract = getReadContract();
      if (!contract) return;
      try {
        const provider = contract.runner.provider;
        const latest = await provider.getBlockNumber();
        const from = Math.max(0, latest - 9000);

        const created = await contract.queryFilter("ProposalCreated", from, latest);
        const votes = await contract.queryFilter("VoteCast", from, latest);
        const finals = await contract.queryFilter("ProposalFinalized", from, latest);

        const all = [
          ...created.map((e) => ({
            key: e.transactionHash + "-" + e.index,
            type: "ProposalCreated",
            proposalId: Number(e.args.proposalId),
            who: e.args.creator,
            optionIndex: undefined,
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
          ...votes.map((e) => ({
            key: e.transactionHash + "-" + e.index,
            type: "VoteCast",
            proposalId: Number(e.args.proposalId),
            who: e.args.voter,
            optionIndex: Number(e.args.optionIndex),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
          ...finals.map((e) => ({
            key: e.transactionHash + "-" + e.index,
            type: "ProposalFinalized",
            proposalId: Number(e.args.proposalId),
            who: "",
            optionIndex: Number(e.args.winningOptionIndex),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
        ];
        all.sort((a, b) => b.blockNumber - a.blockNumber);
        setEvents(all.slice(0, 50));
      } catch (err) {
        console.log("audit load failed:", err.message);
        setNote("Could not load events from the chain right now.");
      }
    }
    load();
  }, [contractAddress]);

  return (
    <div className="bg-white border rounded-xl p-4 mt-8">
      <h2 className="font-bold">Audit Explorer</h2>
      <p className="text-xs text-gray-500 mb-3">Read directly from contract events on-chain - no server in between.</p>

      {note && <p className="text-sm text-gray-500">{note}</p>}
      {!note && events.length === 0 && <p className="text-sm text-gray-500">No events yet. Create a proposal or cast a vote.</p>}

      {events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-3">Event</th>
                <th className="pr-3">Proposal</th>
                <th className="pr-3">Voter / Creator</th>
                <th className="pr-3">Option</th>
                <th className="pr-3">Block</th>
                <th>Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.key} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium">{e.type}</td>
                  <td className="pr-3">#{e.proposalId}</td>
                  <td className="pr-3">{e.who ? shortAddress(e.who) : "-"}</td>
                  <td className="pr-3">{e.optionIndex !== undefined ? "#" + (e.optionIndex + 1) : "-"}</td>
                  <td className="pr-3">{e.blockNumber}</td>
                  <td className="break-all text-gray-500">{e.txHash ? e.txHash.slice(0, 18) + "..." : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
