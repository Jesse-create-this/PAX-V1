// Updated blockchain client for BNB Smart Chain
export class BlockchainClient {
  private chainId: string
  private projectId: string
  private networkConfig: any

  constructor() {
    this.chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "56"
    this.projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

    // Set network configuration based on chain ID
    this.networkConfig = this.getNetworkConfig()
  }

  private getNetworkConfig() {
    const configs: { [key: string]: any } = {
      "56": {
        name: "BNB Smart Chain",
        currency: "BNB",
        explorer: "https://bscscan.com",
        rpcUrls: [
          "https://bsc-dataseed.binance.org/",
          "https://bsc-dataseed1.defibit.io/",
          "https://bsc-dataseed1.ninicoin.io/",
        ],
      },
      "97": {
        name: "BNB Smart Chain Testnet",
        currency: "tBNB",
        explorer: "https://testnet.bscscan.com",
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/", "https://data-seed-prebsc-2-s1.binance.org:8545/"],
      },
    }

    return configs[this.chainId] || configs["56"]
  }

  // Check if wallet is available
  isWalletAvailable(): boolean {
    return typeof window !== "undefined" && !!(window.ethereum && window.ethereum.isMetaMask)
  }

  // Get BNB balance with better error handling
  async getBalance(address: string): Promise<string> {
    if (!address) {
      throw new Error("Address is required")
    }

    // Try wallet provider first
    if (this.isWalletAvailable()) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
        return balance
      } catch (error) {
        console.error("Error getting balance from wallet:", error)
        // Fall back to RPC call
      }
    }

    // Fallback to direct RPC call
    return this.getBalanceFromRPC(address)
  }

  private async getBalanceFromRPC(address: string): Promise<string> {
    const rpcUrls = this.networkConfig.rpcUrls

    for (const rpcUrl of rpcUrls) {
      try {
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [address, "latest"],
            id: 1,
          }),
        })

        const result = await response.json()

        if (result.error) {
          throw new Error(result.error.message)
        }

        return result.result || "0x0"
      } catch (error) {
        console.error(`Error with RPC ${rpcUrl}:`, error)
        continue // Try next RPC
      }
    }

    // If all RPCs fail, try server API
    return this.getBalanceFromServer(address)
  }

  private async getBalanceFromServer(address: string): Promise<string> {
    try {
      const response = await fetch("/api/blockchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getBalance",
          data: { address },
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result = await response.json()
      return result.result || "0x0"
    } catch (error) {
      console.error("Error getting balance from server:", error)
      return "0x0"
    }
  }

  async sendTransaction(params: any): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error("MetaMask not available")
    }

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [params],
      })
      return txHash
    } catch (error: any) {
      console.error("Transaction error:", error)

      let errorMessage = "Transaction failed"
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user"
      } else if (error.code === -32603) {
        errorMessage = "Internal error - check your BNB balance and network"
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  getNetworkName(): string {
    return this.networkConfig.name
  }

  getCurrency(): string {
    return this.networkConfig.currency
  }

  getExplorerUrl(): string {
    return this.networkConfig.explorer
  }

  // Convert wei to BNB
  weiToBNB(wei: string): string {
    try {
      const bnbValue = Number.parseInt(wei, 16) / Math.pow(10, 18)
      return bnbValue.toFixed(4)
    } catch (error) {
      console.error("Error converting wei to BNB:", error)
      return "0.0000"
    }
  }

  // Convert BNB to wei
  bnbToWei(bnb: string): string {
    try {
      const weiValue = Number.parseFloat(bnb) * Math.pow(10, 18)
      return `0x${weiValue.toString(16)}`
    } catch (error) {
      console.error("Error converting BNB to wei:", error)
      return "0x0"
    }
  }

  // Validate BNB address (same as Ethereum)
  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
}

export const blockchainClient = new BlockchainClient()
