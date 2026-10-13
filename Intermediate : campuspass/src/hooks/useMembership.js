import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MEMBERSHIP_ABI } from "../contract/abi";
import { contractConfig, isContractConfigured } from "../contract/config";

// status: idle | checking | member | not-member | wrong-network | not-configured | error
export function useMembership({ account, chainId }) {
  const [membershipStatus, setMembershipStatus] = useState("idle");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);
  const [tx, setTx] = useState({ status: "idle", hash: null, message: "" });

  const expectedChainId = contractConfig.chainId;
  const isWrongNetwork =
    chainId !== null && expectedChainId !== null && chainId !== expectedChainId;

  async function getContract(withSigner) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(contractConfig.address, MEMBERSHIP_ABI, signer);
    }
    return new ethers.Contract(contractConfig.address, MEMBERSHIP_ABI, provider);
  }

  async function checkMembership() {
    if (!account) {
      setMembershipStatus("idle");
      return;
    }

    if (!isContractConfigured()) {
      setMembershipStatus("not-configured");
      setError(
        "Contract address is not set. Add VITE_CONTRACT_ADDRESS to your .env file and restart the dev server."
      );
      return;
    }

    if (isWrongNetwork) {
      setMembershipStatus("wrong-network");
      setError(null);
      return;
    }

    setMembershipStatus("checking");
    setError(null);

    try {
      const contract = await getContract(false);
      const member = await contract.isMember(account);
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
      setMembershipStatus(member ? "member" : "not-member");
    } catch (err) {
      console.log("membership check failed", err);
      setMembershipStatus("error");
      setError(
        "Could not read membership from the contract. Check the network and contract address."
      );
    }
  }

  // re-check whenever the wallet or network changes
  useEffect(() => {
    if (!account) {
      setMembershipStatus("idle");
      setIsOwner(false);
      setError(null);
      setTx({ status: "idle", hash: null, message: "" });
      return;
    }
    checkMembership();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  async function sendMembershipTx(targetAddress, method) {
    if (!ethers.isAddress(targetAddress)) {
      setTx({
        status: "failed",
        hash: null,
        message: "That doesn't look like a valid wallet address.",
      });
      return;
    }

    if (isWrongNetwork) {
      setTx({
        status: "failed",
        hash: null,
        message: "Wrong network. Switch to the expected network first.",
      });
      return;
    }

    setTx({
      status: "pending",
      hash: null,
      message: "Waiting for MetaMask confirmation...",
    });

    try {
      const contract = await getContract(true);
      const txResponse = await contract[method](targetAddress);
      setTx({
        status: "pending",
        hash: txResponse.hash,
        message: "Transaction sent. Waiting for confirmation...",
      });
      await txResponse.wait();
      setTx({
        status: "success",
        hash: txResponse.hash,
        message:
          method === "grantMembership"
            ? "Membership granted."
            : "Membership removed.",
      });
    } catch (err) {
      console.log("tx failed", err);
      if (err.code === "ACTION_REJECTED" || err.code === 4001) {
        setTx({
          status: "failed",
          hash: null,
          message: "Transaction was rejected in MetaMask.",
        });
      } else {
        setTx({
          status: "failed",
          hash: null,
          message:
            "Transaction failed. Only the contract owner can change membership.",
        });
      }
    }
  }

  function grantMembership(address) {
    sendMembershipTx(address, "grantMembership");
  }

  function removeMembership(address) {
    sendMembershipTx(address, "removeMembership");
  }

  function clearTx() {
    setTx({ status: "idle", hash: null, message: "" });
  }

  return {
    membershipStatus,
    isOwner,
    isWrongNetwork,
    error,
    tx,
    refreshMembership: checkMembership,
    grantMembership,
    removeMembership,
    clearTx,
  };
}
