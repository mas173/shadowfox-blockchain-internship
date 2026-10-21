import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "../contracts/abi";
import { RPC_URL, TARGET_CHAIN_ID } from "../lib/helpers";

const WalletContext = createContext(null);

// the address only comes from frontend/.env, it is never hardcoded.
// paste the address you get from Remix after deploying on Sepolia there.
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
export { CONTRACT_ABI };

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [hasWallet, setHasWallet] = useState(true);

  useEffect(() => {
    if (!window.ethereum) {
      setHasWallet(false);
      return;
    }
    // if the wallet is already connected, pick it up silently
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) loadAccount(accounts[0]);
    });
    window.ethereum.request({ method: "eth_chainId" }).then((id) => setChainId(parseInt(id, 16)));

    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setBalance(null);
      } else {
        loadAccount(accounts[0]);
      }
    });
    window.ethereum.on("chainChanged", (id) => setChainId(parseInt(id, 16)));
  }, []);

  async function loadAccount(address) {
    setAccount(address);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
    } catch (e) {
      setBalance(null);
    }
  }

  async function connect() {
    if (!window.ethereum) {
      alert("No wallet found. Please install MetaMask.");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    setChainId(Number(net.chainId));
    await loadAccount(accounts[0]);
  }

  function disconnect() {
    // metamask has no real disconnect, just forget the account in the ui
    setAccount(null);
    setBalance(null);
  }

  async function switchNetwork() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + TARGET_CHAIN_ID.toString(16) }],
    });
  }

  function getReadContract() {
    if (!CONTRACT_ADDRESS) return null;
    // wallet connected: read through it. no wallet: read through the public
    // Sepolia RPC so visitors can still browse proposals and results.
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }

  async function getWriteContract() {
    if (!CONTRACT_ADDRESS) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  const isWrongNetwork = account && chainId !== null && chainId !== TARGET_CHAIN_ID;

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        balance,
        hasWallet,
        connect,
        disconnect,
        switchNetwork,
        isWrongNetwork,
        getReadContract,
        getWriteContract,
        contractAddress: CONTRACT_ADDRESS,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
