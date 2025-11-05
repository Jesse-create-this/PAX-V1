"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Copy, Wallet, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, address: string) => void
}

export default function WalletConnection({ onConnectionChange }: WalletConnectionProps) {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [chainId, setChainId] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          onConnectionChange(true, accounts[0])

          // Get chain ID
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainIdHex, 16))
        }
      }
    } catch (error) {
      console.error("[v0] Failed to check wallet connection:", error)
    }
  }

  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "No Wallet Detected",
          description: "Please install a Web3 wallet like MetaMask or Trust Wallet",
          variant: "destructive",
        })
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        onConnectionChange(true, accounts[0])

        // Get chain ID
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(Number.parseInt(chainIdHex, 16))

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    } catch (error: any) {
      console.error("[v0] Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    setAddress("")
    setIsConnected(false)
    setChainId(null)
    onConnectionChange(false, "")
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet",
    })
  }

  const isCorrectNetwork = chainId === 56 || chainId === 97
  const networkName = chainId === 56 ? "BNB Smart Chain" : chainId === 97 ? "BNB Smart Chain Testnet" : "Unknown"

  if (!isMounted) {
    return (
      <Button disabled className="bg-gray-400">
        Loading...
      </Button>
    )
  }

  if (isConnected && address) {
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
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <p className={`text-xs ${isCorrectNetwork ? "text-green-600" : "text-orange-600"} truncate`}>
                {networkName}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(address)
                  toast({
                    title: "Address Copied",
                    description: "Wallet address copied to clipboard",
                  })
                }}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <Copy className="h-2 w-2 sm:h-3 sm:w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDisconnect}
                className="text-xs bg-transparent px-2 py-1"
              >
                <LogOut className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
