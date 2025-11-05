"use client"

import { type ReactNode, useEffect, useState } from "react"
import { createWeb3Modal, defaultConfig } from "web3modal-web3js"
import { projectId, bscMainnet, bscTestnet } from "@/lib/web3-config"

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!projectId) {
      console.warn("[v0] NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set")
      setIsReady(true)
      return
    }

    try {
      const metadata = {
        name: "PAX - Certificate Manager",
        description: "Verify and manage digital certificates on blockchain",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: ["https://avatars.githubusercontent.com/u/179229932"],
      }

      const web3Config = defaultConfig({
        metadata,
        enableEIP6963: true,
        enableInjected: true,
        enableCoinbase: true,
        rpcUrl: bscMainnet.rpcUrl,
        defaultChainId: bscMainnet.chainId,
      })

      createWeb3Modal({
        web3Config,
        chains: [bscMainnet, bscTestnet],
        projectId,
        enableAnalytics: false,
      })

      setIsReady(true)
    } catch (error) {
      console.error("[v0] Failed to initialize Web3Modal:", error)
      setIsReady(true)
    }
  }, [])

  if (!isReady) {
    return <>{children}</>
  }

  return <>{children}</>
}
