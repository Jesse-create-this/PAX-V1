"use client"

import type { ReactNode } from "react"

export function Web3Provider({ children }: { children: ReactNode }) {
  // No initialization needed - wallet connection is handled directly via window.ethereum
  // in the wallet-connection component
  return <>{children}</>
}
