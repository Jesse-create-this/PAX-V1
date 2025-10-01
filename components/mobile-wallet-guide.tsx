"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, ExternalLink } from "lucide-react"

export default function MobileWalletGuide() {
  const mobileWallets = [
    {
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Most popular mobile wallet for BNB Smart Chain",
      downloadUrl: "https://trustwallet.com/download",
      instructions: "Download Trust Wallet → Open DApps browser → Visit this website",
    },
    {
      name: "MetaMask Mobile",
      icon: "🦊",
      description: "MetaMask mobile app with built-in browser",
      downloadUrl: "https://metamask.io/download/",
      instructions: "Download MetaMask → Open browser → Visit this website",
    },
    {
      name: "Binance Chain Wallet",
      icon: "🟡",
      description: "Official wallet for BNB Smart Chain",
      downloadUrl: "https://www.bnbchain.org/en/wallet",
      instructions: "Download wallet → Open DApp browser → Visit this website",
    },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Mobile Wallet Guide</span>
        </CardTitle>
        <CardDescription>How to connect mobile wallets to Pax DApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mobileWallets.map((wallet, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h4 className="font-semibold">{wallet.name}</h4>
                  <p className="text-sm text-gray-600">{wallet.description}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => window.open(wallet.downloadUrl, "_blank")}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{wallet.instructions}</p>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Quick Steps:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Download a mobile wallet app</li>
            <li>Create or import your wallet</li>
            <li>Add BNB Smart Chain network (usually pre-configured)</li>
            <li>Open the wallet's built-in browser</li>
            <li>Navigate to this website</li>
            <li>Click "Connect Wallet" and select your wallet</li>
          </ol>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => window.open("https://ethereum.org/wallets/", "_blank")}>
            <ExternalLink className="h-3 w-3 mr-1" />
            More Wallet Options
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
