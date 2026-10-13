import { useEffect, useState } from "react";
import { ethers } from "ethers";

// 0x7A21...93F4
export function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMaskInstalled = !!(window.ethereum && window.ethereum.isMetaMask);

  async function connectWallet() {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Install the extension and refresh the page.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {
      console.log("connect failed", err);
      if (err.code === 4001) {
        setError("Connection request was rejected in MetaMask.");
      } else {
        setError("Could not connect wallet. Please try again.");
      }
    }
    setIsConnecting(false);
  }

  // MetaMask doesn't let a site disconnect the wallet, so we just
  // clear our own state and go back to the guest view.
  function disconnectWallet() {
    setAccount(null);
    setChainId(null);
    setError(null);
  }

  async function switchNetwork(targetChainId) {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + targetChainId.toString(16) }],
      });
    } catch (err) {
      if (err.code === 4902) {
        setError("This network is not added to MetaMask. Add it manually and try again.");
      } else if (err.code === 4001) {
        setError("Network switch was rejected in MetaMask.");
      } else {
        setError("Could not switch networks. Try switching manually in MetaMask.");
      }
    }
  }

  // keep track of account / network changes made inside metamask
  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : null);
    };
    const onChainChanged = (hexChainId) => {
      setChainId(parseInt(hexChainId, 16));
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, []);

  // check if a wallet is already connected (no popup)
  useEffect(() => {
    async function checkExisting() {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setAccount(accounts[0]);
          setChainId(Number(network.chainId));
        }
      } catch (err) {
        console.log("no existing connection", err);
      }
    }
    checkExisting();
  }, []);

  return {
    account,
    chainId,
    isConnected: !!account,
    isConnecting,
    error,
    isMetaMaskInstalled,
    shortAddress: shortenAddress(account),
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}
