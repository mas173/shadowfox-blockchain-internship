
export const contractConfig = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS || "",
  chainId: import.meta.env.VITE_CHAIN_ID
    ? Number(import.meta.env.VITE_CHAIN_ID)
    : null,
};

export function isContractConfigured() {
  return !!contractConfig.address;
}
