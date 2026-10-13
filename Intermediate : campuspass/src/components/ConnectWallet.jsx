export default function ConnectWallet({
  isMetaMaskInstalled,
  isConnecting,
  error,
  onConnect,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold">Connect your wallet</h2>
      <p className="mt-2 text-slate-600">
        CampusPass uses your wallet as your identity. No username or password
        needed - connect MetaMask and your membership is verified on-chain.
      </p>

      {!isMetaMaskInstalled && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          MetaMask was not detected in this browser.{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline"
          >
            Install MetaMask
          </a>{" "}
          and refresh the page.
        </div>
      )}

      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60 sm:w-auto"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}
    </section>
  );
}
