import { shortenAddress } from "../hooks/useWallet";

// Sample resources - generated in the browser so no backend is needed.
const RESOURCES = [
  {
    title: "Member Handbook",
    description:
      "Rules, perks and how CampusPass membership works on campus.",
    fileName: "campuspass-member-handbook.txt",
    content: `CampusPass - Member Handbook (sample)

Welcome to CampusPass! As a verified member you get access to:
- Member-only workshops and study sessions
- The campus events calendar
- Career prep resources

Your membership is stored on-chain and checked every time you connect your wallet.`,
  },
  {
    title: "Workshop Notes: Blockchain Basics",
    description: "Intro notes from the CampusPass blockchain workshop series.",
    fileName: "workshop-notes-blockchain-basics.txt",
    content: `Workshop Notes - Blockchain Basics (sample)

1. A wallet address is your identity on-chain.
2. A smart contract is code that runs on the blockchain.
3. Reading state (isMember) is free. Writing state (grantMembership) costs gas.
4. onlyOwner means only the deployer can change membership.`,
  },
  {
    title: "Campus Events Calendar",
    description: "Upcoming member-only events, meetups and hackathons.",
    fileName: "campuspass-events.txt",
    content: `CampusPass Events (sample)

- Web3 101 Workshop - Friday, 5 PM, CS Lab 2
- Members Meetup - Saturday, 11 AM, Main Auditorium
- Mini Hackathon - Last weekend of the month`,
  },
  {
    title: "Career Prep Checklist",
    description: "Internship-ready checklist for blockchain developer roles.",
    fileName: "career-prep-checklist.txt",
    content: `Career Prep Checklist (sample)

[ ] Deploy a contract with Remix
[ ] Build a wallet-connected dApp
[ ] Understand gas, transactions and confirmations
[ ] Write a README that explains your project`,
  },
];

function downloadResource(fileName, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function MemberDashboard({ account }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Welcome back, member</h2>
        <p className="mt-2 text-slate-600">
          You are signed in with{" "}
          <span className="font-mono font-medium text-slate-900">
            {shortenAddress(account)}
          </span>
          . Your membership was verified on-chain from the Membership smart
          contract.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Membership: VERIFIED
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Access: Full member content
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Premium member resources</h3>
        <p className="mt-1 text-sm text-slate-600">
          Only verified members can see and download these resources.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {RESOURCES.map((resource) => (
            <div
              key={resource.fileName}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h4 className="font-semibold">{resource.title}</h4>
              <p className="mt-1 flex-1 text-sm text-slate-600">
                {resource.description}
              </p>
              <button
                onClick={() =>
                  downloadResource(resource.fileName, resource.content)
                }
                className="mt-4 self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Membership information</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your membership lives in the Membership smart contract, not in a
          database. If the contract owner removes your wallet, access stops
          immediately - no password to reset, no account to delete. The
          contract is the single source of truth.
        </p>
      </div>
    </section>
  );
}
