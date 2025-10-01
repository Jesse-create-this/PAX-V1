"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle, Loader2 } from "lucide-react"

interface WalletConnectionProps {
  onWalletConnected: (address: string, walletType: string) => void
}

export function WalletConnection({ onWalletConnected }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>("")

  const connectMetaMask = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }

      // Check if MetaMask is locked
      const accounts = await window.ethereum.request({ method: "eth_accounts" })

      // Request account access
      const requestedAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (requestedAccounts.length === 0) {
        throw new Error("No accounts found. Please make sure MetaMask is unlocked.")
      }

      // Check network (optional - you can specify which network you want)
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      console.log("Connected to chain:", chainId)

      const address = requestedAccounts[0]

      // Verify the address format
      if (!address || !address.startsWith("0x") || address.length !== 42) {
        throw new Error("Invalid wallet address received")
      }

      onWalletConnected(address, "MetaMask")
    } catch (err: any) {
      console.error("MetaMask connection error:", err)
      if (err.code === 4001) {
        setError("Connection rejected. Please approve the connection request in MetaMask.")
      } else if (err.code === -32002) {
        setError("Connection request pending. Please check MetaMask.")
      } else {
        setError(err.message || "Failed to connect to MetaMask")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setError("Wallet disconnected")
        } else {
          // User switched accounts
          onWalletConnected(accounts[0], "MetaMask")
        }
      }

      const handleChainChanged = (chainId: string) => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [onWalletConnected])

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={connectMetaMask}
        disabled={isConnecting}
        className="bg-orange-500 hover:bg-orange-600 text-white border-0"
        size="sm"
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

      {error && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have MetaMask?{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              Install it here
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
