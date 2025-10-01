"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, Coins, Activity, TrendingUp, RefreshCw, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { blockchainClient } from "@/lib/blockchain-client"

interface DashboardSectionProps {
  account: string
}

export default function DashboardSection({ account }: DashboardSectionProps) {
  const [balance, setBalance] = useState("0.0")
  const [isLoading, setIsLoading] = useState(false)
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Mock data for demonstration
  const [transactions] = useState([
    { id: 1, type: "send", amount: "0.5", to: "0x742d...4e8f", hash: "0xabc123...", status: "confirmed" },
    { id: 2, type: "receive", amount: "1.2", from: "0x123a...9d2c", hash: "0xdef456...", status: "confirmed" },
    { id: 3, type: "send", amount: "0.3", to: "0x456b...1a3e", hash: "0x789ghi...", status: "pending" },
  ])

  useEffect(() => {
    if (account) {
      fetchBalance()
    }
  }, [account])

  const fetchBalance = async () => {
    if (!account) return

    try {
      setIsLoading(true)
      const balanceWei = await blockchainClient.getBalance(account)
      const bnbBalance = blockchainClient.weiToBNB(balanceWei)
      setBalance(bnbBalance)
    } catch (error: any) {
      console.error("Error fetching balance:", error)
      setBalance("0.0000")
      toast({
        title: "Balance Fetch Failed",
        description: error.message || "Could not fetch BNB balance",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    await fetchBalance()
    setIsRefreshing(false)
    toast({
      title: "Balance Refreshed",
      description: "Your BNB balance has been updated",
    })
  }

  const handleSendTransaction = async () => {
    if (!sendAmount || !recipientAddress) {
      toast({
        title: "Invalid Input",
        description: "Please enter both amount and recipient address",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (Number.parseFloat(sendAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (!blockchainClient.validateAddress(recipientAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid BNB Smart Chain address",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(sendAmount) > Number.parseFloat(balance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough BNB for this transaction",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const amountWei = blockchainClient.bnbToWei(sendAmount)

      const txHash = await blockchainClient.sendTransaction({
        from: account,
        to: recipientAddress,
        value: amountWei,
      })

      toast({
        title: "Transaction Sent Successfully",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`${blockchainClient.getExplorerUrl()}/tx/${txHash}`, "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
        ),
      })

      // Reset form
      setSendAmount("")
      setRecipientAddress("")

      // Refresh balance after a delay
      setTimeout(() => {
        fetchBalance()
      }, 3000)
    } catch (error: any) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send BNB transaction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currency = blockchainClient.getCurrency()

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Your BNB Dashboard</h3>
          <p className="text-gray-600">Manage your BNB assets and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-orange-600" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                {isLoading ? "Loading..." : `${balance} ${currency}`}
              </div>
              <p className="text-xs text-orange-600">≈ ${(Number.parseFloat(balance) * 300).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{blockchainClient.getNetworkName()}</div>
              <p className="text-xs text-muted-foreground">Current network</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Send {currency}</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send {currency}</CardTitle>
                <CardDescription>Send {currency} to another address on BNB Smart Chain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Address</label>
                  <Input
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount ({currency})</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="0.0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Available: {balance} {currency}
                  </p>
                </div>
                <Button
                  onClick={handleSendTransaction}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  {isLoading ? "Sending..." : `Send ${currency}`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest BNB Smart Chain transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {tx.type === "send" ? (
                          <ArrowUpRight className="h-5 w-5 text-red-500" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {tx.type === "send" ? "Sent" : "Received"} {tx.amount} {currency}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tx.type === "send" ? `To: ${tx.to}` : `From: ${tx.from}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tx.status === "confirmed" ? "default" : "secondary"}>{tx.status}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{tx.hash.slice(0, 10)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
