"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Smartphone } from "lucide-react"
import { detectAvailableWallets, getWalletDownloadUrl, type WalletInfo } from "@/lib/wallet-utils"

interface WalletSelectorProps {
  onWalletSelect: (wallet: WalletInfo) => void
  onCancel: () => void
  isConnecting: boolean
}

export default function WalletSelector({ onWalletSelect, onCancel, isConnecting }: WalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletInfo[]>([])

  useEffect(() => {
    setWallets(detectAvailableWallets())
  }, [])

  const installedWallets = wallets.filter((w) => w.installed)
  const notInstalledWallets = wallets.filter((w) => !w.installed)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>Choose from available wallet providers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Installed Wallets */}
        {installedWallets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Available Wallets</h4>
            {installedWallets.map((wallet, index) => (
              <Button
                key={index}
                onClick={() => onWalletSelect(wallet)}
                disabled={isConnecting}
                variant="outline"
                className="flex items-center justify-between w-full h-12 px-4"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{wallet.icon}</span>
                  <span className="font-medium">{wallet.name}</span>
                </div>
                {wallet.type === "walletconnect" && <Smartphone className="h-4 w-4" />}
                {wallet.installed && wallet.type === "injected" && (
                  <Badge variant="secondary" className="text-xs">
                    Detected
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Not Installed Wallets */}
        {notInstalledWallets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Install Wallet</h4>
            {notInstalledWallets.map((wallet, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-xl opacity-50">{wallet.icon}</span>
                  <span className="font-medium text-gray-600">{wallet.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(getWalletDownloadUrl(wallet.name), "_blank")}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* WalletConnect Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Smartphone className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Mobile Wallets</p>
              <p>Use WalletConnect to connect Trust Wallet, Rainbow, and 300+ other mobile wallets</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => window.open("https://ethereum.org/wallets/", "_blank")}
            variant="outline"
            className="flex-1"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            More Wallets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
