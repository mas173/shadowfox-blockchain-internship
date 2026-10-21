import { useWallet } from "../context/WalletProvider";
import { shortAddress, TARGET_CHAIN_ID } from "../lib/helpers";

export default function HeaderNavbar() {
  const { account, balance, connect, disconnect, chainId, isWrongNetwork, switchNetwork, hasWallet } = useWallet();

  const networkName = chainId === 11155111 ? "Sepolia Testnet" : "Chain " + chainId;

  return (
    <div>
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-indigo-700">Decentralised Voting</h1>
            <p className="text-xs text-gray-500">Votes on chain, nobody can edit them later</p>
          </div>

          <div className="flex items-center gap-3">
            {account && (
              <span className={`text-xs px-2 py-1 rounded-full ${isWrongNetwork ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {networkName}
              </span>
            )}
            {account ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium">{shortAddress(account)}</p>
                  <p className="text-xs text-gray-500">{balance ? Number(balance).toFixed(4) + " ETH" : ""}</p>
                </div>
                <button onClick={disconnect} className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50">
                  Disconnect
                </button>
              </>
            ) : (
              <button onClick={connect} className="bg-indigo-600 text-white text-sm rounded px-4 py-2 hover:bg-indigo-700">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {!hasWallet && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm text-center py-2 px-4">
          No wallet detected. Install{" "}
          <a className="underline font-medium" href="https://metamask.io/download/" target="_blank" rel="noreferrer">
            MetaMask
          </a>{" "}
          to vote - you can still browse proposals below.
        </div>
      )}

      {isWrongNetwork && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm text-center py-2 px-4">
          Wrong network. This app runs on chain {TARGET_CHAIN_ID}.{" "}
          <button onClick={switchNetwork} className="underline font-medium">
            Switch to target network
          </button>
        </div>
      )}
    </div>
  );
}
