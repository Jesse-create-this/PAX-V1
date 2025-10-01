// Updated API route for BNB Smart Chain
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    // Get environment variables
    const rpcUrl = process.env.RPC_URL
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "56"

    // BNB Smart Chain RPC endpoints
    const bscRpcUrls = [
      rpcUrl, // User's configured RPC
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed1.ninicoin.io/",
    ].filter(Boolean) // Remove null/undefined values

    // For testnet
    if (chainId === "97") {
      bscRpcUrls.push(
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "https://data-seed-prebsc-2-s1.binance.org:8545/",
      )
    }

    switch (action) {
      case "getBalance":
        if (!data.address) {
          return NextResponse.json({ error: "Address is required" }, { status: 400 })
        }

        // Try multiple RPC endpoints
        for (const rpcEndpoint of bscRpcUrls) {
          try {
            const response = await fetch(rpcEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getBalance",
                params: [data.address, "latest"],
                id: 1,
              }),
            })

            const result = await response.json()

            if (result.error) {
              console.error(`RPC error from ${rpcEndpoint}:`, result.error)
              continue // Try next RPC
            }

            return NextResponse.json(result)
          } catch (error: any) {
            console.error(`RPC request failed for ${rpcEndpoint}:`, error)
            continue // Try next RPC
          }
        }

        return NextResponse.json({ error: "All RPC endpoints failed" }, { status: 500 })

      case "getChainId":
        try {
          const response = await fetch(bscRpcUrls[0], {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_chainId",
              params: [],
              id: 1,
            }),
          })

          const result = await response.json()
          return NextResponse.json(result)
        } catch (error) {
          console.error("Chain ID error:", error)
          return NextResponse.json({ error: "Failed to get chain ID" }, { status: 500 })
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blockchain API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
