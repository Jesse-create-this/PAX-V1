export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

if (!projectId) {
  console.warn("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set")
}

export const bscMainnet = {
  chainId: 56,
  name: "BNB Smart Chain",
  currency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org",
}

export const bscTestnet = {
  chainId: 97,
  name: "BNB Smart Chain Testnet",
  currency: "tBNB",
  explorerUrl: "https://testnet.bscscan.com",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
}
