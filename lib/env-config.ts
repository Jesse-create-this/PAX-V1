// Updated environment configuration without sensitive client-side keys
export const envConfig = {
  // Client-side variables (prefixed with NEXT_PUBLIC_)
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  walletConnectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,

  // Server-side variables (no prefix needed) - these are NOT exposed to client
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,

  // Server-side only API keys (secure)
  alchemyKey: process.env.ALCHEMY_API_KEY, // Note: no NEXT_PUBLIC_ prefix

  // Validation
  isValid: function () {
    if (typeof window !== "undefined") {
      // Client-side validation - only check public variables
      return !!(this.projectId && this.walletConnectId && this.chainId)
    } else {
      // Server-side validation - can check private variables
      return !!this.rpcUrl
    }
  },
}

// Debug function to check environment variables (safe for client)
export function debugEnvVars() {
  console.log("Environment Variables Debug:")
  console.log("PROJECT_ID:", envConfig.projectId ? "✅ Set" : "❌ Missing")
  console.log("WALLET_CONNECT_ID:", envConfig.walletConnectId ? "✅ Set" : "❌ Missing")
  console.log("CHAIN_ID:", envConfig.chainId ? "✅ Set" : "❌ Missing")

  // Don't log sensitive server-side variables in client
  if (typeof window === "undefined") {
    console.log("RPC_URL:", envConfig.rpcUrl ? "✅ Set" : "❌ Missing")
    console.log("ALCHEMY_KEY:", envConfig.alchemyKey ? "✅ Set" : "❌ Missing")
  }

  if (!envConfig.isValid()) {
    console.error("❌ Required environment variables are missing!")
  } else {
    console.log("✅ All required environment variables are set")
  }
}
