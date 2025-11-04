"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, CheckCircle, Copy, AlertCircle, Smartphone, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, address: string) => void
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
    trustWallet?: any
    BinanceChain?: any
  }
}

// BNB Smart Chain network configuration
const BSC_MAINNET = {
  chainId: "0x38", // 56 in hex
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
}

const BSC_TESTNET = {
  chainId: "0x61", // 97 in hex
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
}

interface WalletOption {
  name: string
  icon: string
  provider: any
  type: "injected" | "mobile"
  installed: boolean
  downloadUrl?: string
}

export default function WalletConnection({ onConnectionChange }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [connectedWallet, setConnectedWallet] = useState<string>("")
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>([])
  const { toast } = useToast()

  useEffect(() => {
    detectWallets()
    checkConnection()
  }, [])

  const detectWallets = () => {
    const wallets: WalletOption[] = []

    if (typeof window !== "undefined") {
      // MetaMask
      if (window.ethereum?.isMetaMask) {
        wallets.push({
          name: "MetaMask",
          icon: "🦊",
          provider: window.ethereum,
          type: "injected",
          installed: true,
        })
      } else {
        wallets.push({
          name: "MetaMask",
          icon: "🦊",
          provider: null,
          type: "injected",
          installed: false,
          downloadUrl: "https://metamask.io/download/",
        })
      }

      // Trust Wallet
      if (window.ethereum?.isTrust) {
        wallets.push({
          name: "Trust Wallet",
          icon: "🛡️",
          provider: window.ethereum,
          type: "injected",
          installed: true,
        })
      } else {
        wallets.push({
          name: "Trust Wallet",
          icon: "🛡️",
          provider: null,
          type: "injected",
          installed: false,
          downloadUrl: "https://trustwallet.com/download",
        })
      }

      // Binance Chain Wallet
      if (window.BinanceChain) {
        wallets.push({
          name: "Binance Chain Wallet",
          icon: "🟡",
          provider: window.BinanceChain,
          type: "injected",
          installed: true,
        })
      } else {
        wallets.push({
          name: "Binance Chain Wallet",
          icon: "🟡",
          provider: null,
          type: "injected",
          installed: false,
          downloadUrl: "https://www.bnbchain.org/en/wallet",
        })
      }

      // Coinbase Wallet
      if (window.ethereum?.isCoinbaseWallet) {
        wallets.push({
          name: "Coinbase Wallet",
          icon: "🔵",
          provider: window.ethereum,
          type: "injected",
          installed: true,
        })
      }

      // Generic Ethereum provider
      if (
        window.ethereum &&
        !window.ethereum.isMetaMask &&
        !window.ethereum.isTrust &&
        !window.ethereum.isCoinbaseWallet
      ) {
        wallets.push({
          name: "Web3 Wallet",
          icon: "💼",
          provider: window.ethereum,
          type: "injected",
          installed: true,
        })
      }

      // Mobile wallet option
      wallets.push({
        name: "Mobile Wallets",
        icon: "📱",
        provider: null,
        type: "mobile",
        installed: true,
        downloadUrl: "https://trustwallet.com/download",
      })
    }

    setAvailableWallets(wallets)
  }

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setChainId(currentChainId)
          setIsConnected(true)
          setConnectedWallet(getWalletName())
          onConnectionChange(true, accounts[0])
          setError("")
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const getWalletName = (): string => {
    if (typeof window !== "undefined" && window.ethereum) {
      if (window.ethereum.isMetaMask) return "MetaMask"
      if (window.ethereum.isTrust) return "Trust Wallet"
      if (window.ethereum.isCoinbaseWallet) return "Coinbase Wallet"
      if (window.BinanceChain) return "Binance Chain Wallet"
      return "Web3 Wallet"
    }
    return "Unknown"
  }

  const setupEventListeners = (provider: any) => {
    if (!provider) return

    // Remove existing listeners to prevent duplicates
    if (provider.removeAllListeners) {
      provider.removeAllListeners("accountsChanged")
      provider.removeAllListeners("chainChanged")
      provider.removeAllListeners("connect")
      provider.removeAllListeners("disconnect")
    }

    // Listen for account changes
    provider.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAccount(accounts[0])
        onConnectionChange(true, accounts[0])
        toast({
          title: "Account Changed",
          description: `Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    })

    // Listen for chain changes
    provider.on("chainChanged", (newChainId: string) => {
      setChainId(newChainId)
      toast({
        title: "Network Changed",
        description: `Switched to ${getNetworkName(newChainId)}`,
      })
    })

    // Listen for connection
    provider.on("connect", (connectInfo: any) => {
      console.log("Wallet connected:", connectInfo)
    })

    // Listen for disconnection
    provider.on("disconnect", (error: any) => {
      console.log("Wallet disconnected:", error)
      disconnectWallet()
    })
  }

  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      "0x38": "BNB Smart Chain",
      "0x61": "BNB Testnet",
      "0x1": "Ethereum Mainnet",
      "0xaa36a7": "Sepolia Testnet",
    }
    return networks[chainId] || `Unknown Network (${chainId})`
  }

  const addBSCNetwork = async (provider: any, isTestnet = false) => {
    const networkConfig = isTestnet ? BSC_TESTNET : BSC_MAINNET

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [networkConfig],
      })

      toast({
        title: "Network Added",
        description: `${networkConfig.chainName} has been added to your wallet`,
      })
    } catch (error: any) {
      console.error("Error adding network:", error)
      toast({
        title: "Failed to Add Network",
        description: error.message || "Could not add BNB Smart Chain",
        variant: "destructive",
      })
    }
  }

  const switchToBSC = async (provider: any) => {
    const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "56"
    const isTestnet = expectedChainId === "97"
    const targetChainId = isTestnet ? "0x61" : "0x38"

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added
      if (switchError.code === 4902) {
        await addBSCNetwork(provider, isTestnet)
      } else {
        throw switchError
      }
    }
  }

  const connectWallet = async (wallet: WalletOption) => {
    setIsConnecting(true)
    setError("")
    setShowWalletOptions(false)

    try {
      // Handle mobile wallet connection
      if (wallet.type === "mobile") {
        toast({
          title: "Mobile Wallet Connection",
          description: "Please use Trust Wallet mobile app or scan QR codes from other mobile wallets",
        })

        // Open Trust Wallet mobile app if on mobile
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          const deepLink = `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encodeURIComponent(
            window.location.href,
          )}`
          window.open(deepLink, "_blank")
        } else {
          // On desktop, show instructions
          toast({
            title: "Mobile Connection",
            description: "Open Trust Wallet on your mobile device and navigate to this website",
          })
        }
        setIsConnecting(false)
        return
      }

      // Handle wallet installation
      if (!wallet.installed) {
        if (wallet.downloadUrl) {
          window.open(wallet.downloadUrl, "_blank")
          toast({
            title: "Install Wallet",
            description: `Please install ${wallet.name} and refresh the page`,
          })
        }
        setIsConnecting(false)
        return
      }

      const provider = wallet.provider

      if (!provider) {
        throw new Error("Wallet provider not found")
      }

      // Request account access
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts returned")
      }

      // Get current chain ID
      const currentChainId = await provider.request({ method: "eth_chainId" })

      setAccount(accounts[0])
      setChainId(currentChainId)
      setIsConnected(true)
      setConnectedWallet(wallet.name)
      onConnectionChange(true, accounts[0])
      setupEventListeners(provider)

      toast({
        title: "Wallet Connected Successfully",
        description: `Connected to ${wallet.name}: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      })

      // Check if we're on the correct BNB network
      const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "56"
      const expectedChainIdHex = expectedChainId === "97" ? "0x61" : "0x38"

      if (currentChainId !== expectedChainIdHex) {
        toast({
          title: "Switching Network",
          description: "Switching to BNB Smart Chain...",
        })
        await switchToBSC(provider)
      }
    } catch (error: any) {
      console.error("Connection error:", error)
      let errorMessage = "Failed to connect wallet"

      if (error.code === 4001) {
        errorMessage = "Connection rejected by user"
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending"
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount("")
    setChainId("")
    setIsConnected(false)
    setConnectedWallet("")
    setError("")
    onConnectionChange(false, "")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(account)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  // Show wallet selection
  if (showWalletOptions) {
    const installedWallets = availableWallets.filter((w) => w.installed)
    const notInstalledWallets = availableWallets.filter((w) => !w.installed)

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="w-full max-w-md max-h-[80vh] overflow-y-auto mt-4 sm:mt-8">
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Choose Your Wallet</h3>
                <p className="text-xs sm:text-sm text-gray-600">Connect with one of available wallet providers</p>
              </div>

              {/* Installed Wallets */}
              {installedWallets.length > 0 && (
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Available Wallets</h4>
                  {installedWallets.map((wallet, index) => (
                    <Button
                      key={index}
                      onClick={() => connectWallet(wallet)}
                      disabled={isConnecting}
                      variant="outline"
                      className="flex items-center justify-between w-full h-10 sm:h-12 px-3 sm:px-4 hover:bg-gray-50 text-sm"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl">{wallet.icon}</span>
                        <span className="font-medium text-sm sm:text-base">{wallet.name}</span>
                      </div>
                      {wallet.type === "mobile" && <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />}
                      {isConnecting && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                    </Button>
                  ))}
                </div>
              )}

              {/* Not Installed Wallets */}
              {notInstalledWallets.length > 0 && (
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Install Wallet</h4>
                  {notInstalledWallets.map((wallet, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl opacity-50">{wallet.icon}</span>
                        <span className="font-medium text-gray-600 text-sm sm:text-base">{wallet.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => connectWallet(wallet)}
                        disabled={isConnecting}
                        className="text-xs"
                      >
                        <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Install
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3 sm:mb-4">
                <div className="flex items-start space-x-2">
                  <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Mobile Wallets</p>
                    <p className="text-xs">
                      Use Trust Wallet mobile app or other mobile wallets by visiting this site directly in the wallet
                      browser
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowWalletOptions(false)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://ethereum.org/wallets/", "_blank")}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  More Wallets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">{error}</span>
        <Button onClick={() => setShowWalletOptions(true)} size="sm" variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Show connected state
  if (isConnected && account) {
    const networkName = getNetworkName(chainId)
    const isCorrectNetwork = chainId === "0x38" || chainId === "0x61" // BSC Mainnet or Testnet

    return (
      <Card
        className={`border-2 ${isCorrectNetwork ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}
      >
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <CheckCircle
              className={`h-4 w-4 sm:h-5 sm:w-5 ${isCorrectNetwork ? "text-green-600" : "text-orange-600"} flex-shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs sm:text-sm font-medium ${isCorrectNetwork ? "text-green-800" : "text-orange-800"} truncate`}
              >
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <p className={`text-xs ${isCorrectNetwork ? "text-green-600" : "text-orange-600"} truncate`}>
                {connectedWallet} • {networkName}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                <Copy className="h-2 w-2 sm:h-3 sm:w-3" />
              </Button>
              {!isCorrectNetwork && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => switchToBSC(window.ethereum)}
                  className="text-xs bg-transparent px-2 py-1 hidden sm:inline-flex"
                >
                  Switch to BSC
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={disconnectWallet}
                className="text-xs bg-transparent px-2 py-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show connect button
  return (
    <Button
      onClick={() => setShowWalletOptions(true)}
      disabled={isConnecting}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
