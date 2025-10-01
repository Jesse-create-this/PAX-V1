// Web3 utility functions for the Pax DApp

export interface Web3Window extends Window {
  ethereum?: any
}

declare let window: Web3Window

export const getWeb3Provider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum
  }
  return null
}

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false
  return Boolean(window.ethereum && window.ethereum.isMetaMask)
}

export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatBalance = (balance: string, decimals = 4): string => {
  const num = Number.parseFloat(balance)
  return num.toFixed(decimals)
}

export const weiToEth = (wei: string): string => {
  const ethValue = Number.parseInt(wei, 16) / Math.pow(10, 18)
  return ethValue.toString()
}

export const ethToWei = (eth: string): string => {
  const weiValue = Number.parseFloat(eth) * Math.pow(10, 18)
  return `0x${weiValue.toString(16)}`
}

// Network configurations
export const NETWORKS = {
  1: { name: "Ethereum Mainnet", currency: "ETH" },
  5: { name: "Goerli Testnet", currency: "ETH" },
  137: { name: "Polygon", currency: "MATIC" },
  80001: { name: "Mumbai Testnet", currency: "MATIC" },
}

export const getNetworkName = (chainId: number): string => {
  return NETWORKS[chainId as keyof typeof NETWORKS]?.name || "Unknown Network"
}

export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
