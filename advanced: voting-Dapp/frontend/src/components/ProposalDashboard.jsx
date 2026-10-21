import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../context/WalletProvider";
import { timeLeft } from "../lib/helpers";
import VotingModal from "./VotingModal";
import CreateProposalModal from "./CreateProposalModal";
import AuditExplorer from "./AuditExplorer";

export default function ProposalDashboard() {
  const { account, getReadContract, contractAddress } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [receipts, setReceipts] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  // everything is read straight from the contract, there is no backend
  const loadProposals = useCallback(async () => {
    setLoading(true);
    const contract = getReadContract();
    if (!contract) {
      setProposals([]);
      setLoading(false);
      return;
    }
    try {
      const count = Number(await contract.proposalCount());
      const list = [];
      for (let i = 1; i <= count; i++) {
        const [p, status, options] = await contract.getProposal(i);
        list.push({
          id: Number(p.id),
          title: p.title,
          description: p.description,
          category: p.category,
          creator: p.creator,
          startTime: Number(p.startTime),
          endTime: Number(p.endTime),
          totalVotes: Number(p.totalVotes),
          finalized: p.finalized,
          winningOptionId: Number(p.winningOptionId),
          status: ["active", "ended", "finalized"][Number(status)],
          options: options.map((o) => ({ id: Number(o.id), name: o.name, voteCount: Number(o.voteCount) })),
        });
      }
      list.reverse(); // newest first
      setProposals(list);
    } catch (err) {
      console.log("could not load proposals:", err.message);
      setProposals([]);
    }
    setLoading(false);
  }, [account]);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  // check which proposals this wallet already voted on
  useEffect(() => {
    async function loadReceipts() {
      const contract = getReadContract();
      if (!contract || !account || proposals.length === 0) {
        setReceipts({});
        return;
      }
      const map = {};
      for (const p of proposals) {
        try {
          const [voted, choice] = await contract.getVoterReceipt(p.id, account);
          if (voted) map[p.id] = { voted: true, choice: Number(choice) };
        } catch (e) {}
      }
      setReceipts(map);
    }
    loadReceipts();
  }, [account, proposals]);

  const visible = proposals.filter((p) => {
    if (filter === "active" && p.status !== "active") return false;
    if (filter === "ended" && p.status === "active") return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !(p.description || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalVotes = proposals.reduce((sum, p) => sum + (p.totalVotes || 0), 0);
  const activeCount = proposals.filter((p) => p.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {!contractAddress && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded p-3 mb-4">
          Contract address not set. Deploy the contract in Remix, paste its address in frontend/.env as VITE_CONTRACT_ADDRESS, then restart the frontend.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold">{proposals.length}</p>
          <p className="text-xs text-gray-500">Total Proposals</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs text-gray-500">Active Polls</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold">{totalVotes}</p>
          <p className="text-xs text-gray-500">Total On-Chain Votes Cast</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        {["all", "active", "ended"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-full border capitalize ${filter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
          >
            {f}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search proposals..."
          className="border rounded px-3 py-1.5 text-sm flex-1 min-w-[180px]"
        />
        <button onClick={() => setShowCreate(true)} className="bg-indigo-600 text-white text-sm rounded px-4 py-2 hover:bg-indigo-700">
          + New Proposal
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading proposals from the contract...</p>}
      {!loading && visible.length === 0 && (
        <p className="text-sm text-gray-500 bg-white border rounded-xl p-6 text-center">No proposals here yet. Create the first one.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((p) => (
          <div key={p.id} className="bg-white border rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold">{p.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  p.status === "active" ? "bg-green-100 text-green-700" : p.status === "finalized" ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"
                }`}
              >
                {p.status}
              </span>
            </div>
            {p.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
            {p.category && <p className="text-xs text-gray-400 mt-1">#{p.category}</p>}

            <div className="mt-3 space-y-2">
              {p.options.map((opt) => {
                const pct = p.totalVotes > 0 ? Math.round((opt.voteCount / p.totalVotes) * 100) : 0;
                return (
                  <div key={opt.id}>
                    <div className="flex justify-between text-sm">
                      <span>{opt.name}</span>
                      <span className="text-gray-500">
                        {opt.voteCount} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded mt-1">
                      <div className="h-2 bg-indigo-500 rounded" style={{ width: pct + "%" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">
                {p.totalVotes} votes · {p.status === "active" ? timeLeft(p.endTime) : "closed"}
              </span>
              {receipts[p.id] ? (
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">You voted for Option #{receipts[p.id].choice + 1}</span>
              ) : null}
            </div>

            <button onClick={() => setSelected(p)} className="w-full mt-3 border rounded py-2 text-sm hover:bg-gray-50">
              {p.status === "active" ? (receipts[p.id] ? "View / Receipt" : "Vote Now") : "View Result"}
            </button>
          </div>
        ))}
      </div>

      <AuditExplorer key={proposals.length + "-" + totalVotes} />

      {selected && (
        <VotingModal
          proposal={selected}
          receipt={receipts[selected.id]}
          onClose={() => setSelected(null)}
          onDone={() => {
            setSelected(null);
            loadProposals();
          }}
        />
      )}
      {showCreate && (
        <CreateProposalModal
          onClose={() => setShowCreate(false)}
          onDone={() => {
            setShowCreate(false);
            loadProposals();
          }}
        />
      )}
    </div>
  );
}
