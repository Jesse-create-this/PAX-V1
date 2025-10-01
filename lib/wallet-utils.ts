// Simplified wallet utilities without WalletConnect dependencies
export interface WalletInfo {
  name: string
  icon: string
  provider: any
  type: "injected" | "mobile"
  installed: boolean
  downloadUrl?: string
}

export const detectAvailableWallets = (): WalletInfo[] => {
  const wallets: WalletInfo[] = []

  if (typeof window === "undefined") return wallets

  // MetaMask
  wallets.push({
    name: "MetaMask",
    icon: "🦊",
    provider: window.ethereum?.isMetaMask ? window.ethereum : null,
    type: "injected",
    installed: !!window.ethereum?.isMetaMask,
    downloadUrl: "https://metamask.io/download/",
  })

  // Trust Wallet
  wallets.push({
    name: "Trust Wallet",
    icon: "🛡️",
    provider: window.ethereum?.isTrust ? window.ethereum : null,
    type: "injected",
    installed: !!window.ethereum?.isTrust,
    downloadUrl: "https://trustwallet.com/download",
  })

  // Binance Chain Wallet
  wallets.push({
    name: "Binance Chain Wallet",
    icon: "🟡",
    provider: window.BinanceChain || null,
    type: "injected",
    installed: !!window.BinanceChain,
    downloadUrl: "https://www.bnbchain.org/en/wallet",
  })

  // Coinbase Wallet
  wallets.push({
    name: "Coinbase Wallet",
    icon: "🔵",
    provider: window.ethereum?.isCoinbaseWallet ? window.ethereum : null,
    type: "injected",
    installed: !!window.ethereum?.isCoinbaseWallet,
    downloadUrl: "https://www.coinbase.com/wallet",
  })

  // Mobile wallets (simplified approach)
  wallets.push({
    name: "Mobile Wallets",
    icon: "📱",
    provider: null,
    type: "mobile",
    installed: true,
    downloadUrl: "https://trustwallet.com/download",
  })

  return wallets
}

export const getWalletDownloadUrl = (walletName: string): string => {
  const urls: { [key: string]: string } = {
    MetaMask: "https://metamask.io/download/",
    "Trust Wallet": "https://trustwallet.com/download",
    "Binance Chain Wallet": "https://www.bnbchain.org/en/wallet",
    "Coinbase Wallet": "https://www.coinbase.com/wallet",
  }

  return urls[walletName] || "https://ethereum.org/wallets/"
}

export const isWalletInstalled = (walletName: string): boolean => {
  if (typeof window === "undefined") return false

  switch (walletName) {
    case "MetaMask":
      return !!window.ethereum?.isMetaMask
    case "Trust Wallet":
      return !!window.ethereum?.isTrust
    case "Binance Chain Wallet":
      return !!window.BinanceChain
    case "Coinbase Wallet":
      return !!window.ethereum?.isCoinbaseWallet
    default:
      return !!window.ethereum
  }
}
