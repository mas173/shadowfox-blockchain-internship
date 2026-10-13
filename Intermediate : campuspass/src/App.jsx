import { useWallet } from "./hooks/useWallet";
import { useMembership } from "./hooks/useMembership";
import { contractConfig } from "./contract/config";
import Navbar from "./components/Navbar";
import ConnectWallet from "./components/ConnectWallet";
import WalletStatus from "./components/WalletStatus";
import MembershipStatus from "./components/MembershipStatus";
import MemberDashboard from "./components/MemberDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedContent from "./components/ProtectedContent";

function NonMemberScreen({ account, onRefresh }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
      <h2 className="text-2xl font-bold">Membership Required</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Your wallet does not have an active CampusPass membership.
      </p>
      <p className="mt-4 break-all font-mono text-sm text-slate-500">
        {account}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Ask the contract owner to grant membership to this address, then
        refresh.
      </p>
      <button
        onClick={onRefresh}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
      >
        Refresh Membership Status
      </button>
    </section>
  );
}

function WrongNetworkCard({ expectedChainId, onSwitch }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm sm:p-10">
      <h2 className="text-2xl font-bold text-red-800">Wrong Network</h2>
      <p className="mx-auto mt-3 max-w-md text-red-700">
        This app expects chain ID <strong>{expectedChainId}</strong>. Your
        wallet is connected to a different network.
      </p>
      <button
        onClick={onSwitch}
        className="mt-6 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
      >
        Switch Network
      </button>
      <p className="mt-3 text-sm text-red-600">
        Or switch manually inside MetaMask.
      </p>
    </section>
  );
}

export default function App() {
  const wallet = useWallet();
  const membership = useMembership({
    account: wallet.account,
    chainId: wallet.chainId,
  });

  const isMember = membership.membershipStatus === "member";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        isConnected={wallet.isConnected}
        shortAddress={wallet.shortAddress}
        isConnecting={wallet.isConnecting}
        onConnect={wallet.connectWallet}
        onDisconnect={wallet.disconnectWallet}
      />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {wallet.isConnected && wallet.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {wallet.error}
          </div>
        )}

        {!wallet.isConnected ? (
          <>
            <section className="py-6 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                CampusPass
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                A wallet-connected, membership-gated student portal. Connect
                your wallet, prove your membership on-chain, and unlock
                member-only content.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-indigo-600">Step 1</p>
                <h3 className="mt-1 font-semibold">Connect wallet</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Connect MetaMask. Your wallet address is your identity - no
                  username or password.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-indigo-600">Step 2</p>
                <h3 className="mt-1 font-semibold">Verify membership</h3>
                <p className="mt-1 text-sm text-slate-600">
                  The app reads the Membership smart contract and checks
                  whether your wallet is a member.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-indigo-600">Step 3</p>
                <h3 className="mt-1 font-semibold">Access content</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Members unlock the dashboard and premium resources. Everyone
                  else sees a Membership Required screen.
                </p>
              </div>
            </section>

            <ConnectWallet
              isMetaMaskInstalled={wallet.isMetaMaskInstalled}
              isConnecting={wallet.isConnecting}
              error={wallet.error}
              onConnect={wallet.connectWallet}
            />
          </>
        ) : (
          <>
            <WalletStatus
              account={wallet.account}
              chainId={wallet.chainId}
              isOwner={membership.isOwner}
              isMember={isMember}
            />

            {membership.isWrongNetwork ? (
              <WrongNetworkCard
                expectedChainId={contractConfig.chainId}
                onSwitch={() => wallet.switchNetwork(contractConfig.chainId)}
              />
            ) : (
              <>
                <MembershipStatus
                  status={membership.membershipStatus}
                  error={membership.error}
                  onRefresh={membership.refreshMembership}
                />

                <ProtectedContent
                  isAllowed={isMember}
                  isLoading={membership.membershipStatus === "checking"}
                  fallback={
                    membership.membershipStatus === "not-member" ? (
                      <NonMemberScreen
                        account={wallet.account}
                        onRefresh={membership.refreshMembership}
                      />
                    ) : null
                  }
                >
                  <MemberDashboard account={wallet.account} />
                </ProtectedContent>

                {membership.isOwner && (
                  <AdminDashboard
                    tx={membership.tx}
                    onGrant={membership.grantMembership}
                    onRemove={membership.removeMembership}
                    onClearTx={membership.clearTx}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        CampusPass - membership is verified on-chain, not in a database.
      </footer>
    </div>
  );
}
