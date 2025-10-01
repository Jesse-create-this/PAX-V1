"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WalletConnection } from "@/components/wallet-connection"
import { RoleSelector } from "@/components/role-selector"
import { StudentDashboard } from "@/components/student-dashboard"
import { IssuerDashboard } from "@/components/issuer-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ExplainerCursor } from "@/components/explainer-cursor"
import { VerificationExplorer } from "@/components/verification-explorer"
import { Shield, Award, Users, Zap, CheckCircle, Globe, Lock, Search, HelpCircle } from "lucide-react"

interface User {
  wallet_address: string
  user_type: "student" | "issuer" | "admin"
  name?: string
  institution_name?: string
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showExplainer, setShowExplainer] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [hasSeenExplainer, setHasSeenExplainer] = useState(false)

  // Auto-start explainer on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("pax-visited")
    if (!hasVisited && !hasSeenExplainer) {
      setShowExplainer(true)
      setHasSeenExplainer(true)
      localStorage.setItem("pax-visited", "true")
    }
  }, [hasSeenExplainer])

  // Restore wallet connection on page load
  useEffect(() => {
    const savedAddress = localStorage.getItem("pax-wallet-address")
    const savedType = localStorage.getItem("pax-wallet-type")

    if (savedAddress && savedType && typeof window.ethereum !== "undefined") {
      // Verify the wallet is still connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.includes(savedAddress)) {
            setWalletAddress(savedAddress)
          } else {
            // Clear saved data if wallet is no longer connected
            localStorage.removeItem("pax-wallet-address")
            localStorage.removeItem("pax-wallet-type")
          }
        })
        .catch(() => {
          // Clear saved data on error
          localStorage.removeItem("pax-wallet-address")
          localStorage.removeItem("pax-wallet-type")
        })
    }
  }, [])

  const handleWalletConnected = async (address: string, walletType: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Validate the address
      if (!address || !address.startsWith("0x") || address.length !== 42) {
        throw new Error("Invalid wallet address")
      }

      console.log(`Wallet connected: ${address} via ${walletType}`)
      setWalletAddress(address)

      // Optional: You could also store this in localStorage for persistence
      localStorage.setItem("pax-wallet-address", address)
      localStorage.setItem("pax-wallet-type", walletType)
    } catch (err) {
      console.error("Error handling wallet connection:", err)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelected = async (role: "student" | "issuer") => {
    if (!walletAddress) return

    setIsLoading(true)
    setError("")

    try {
      // Create user object
      const userData: User = {
        wallet_address: walletAddress,
        user_type: role,
      }
      setUser(userData)
    } catch (err) {
      console.error("Error selecting role:", err)
      setError("Failed to set user role. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setWalletAddress("")
    setUser(null)
    setError("")

    // Clear saved wallet data
    localStorage.removeItem("pax-wallet-address")
    localStorage.removeItem("pax-wallet-type")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    )
  }

  if (showVerification) {
    return <VerificationExplorer onClose={() => setShowVerification(false)} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Pax</h1>
                <p className="text-sm text-gray-600">Credential Verification Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!walletAddress && (
                <div data-explainer="connect-wallet">
                  <WalletConnection onWalletConnected={handleWalletConnected} />
                </div>
              )}
              {walletAddress && (
                <Badge variant="outline" className="font-mono text-xs border-orange-500 text-orange-600">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={() => setShowVerification(true)}
                data-explainer="verification-button"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Search className="w-4 h-4 mr-2" />
                Verify
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowExplainer(true)}
                className="text-gray-600 hover:text-orange-600"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {!walletAddress ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-2xl mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 text-black">Secure Credential Verification</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Issue, verify, and manage educational credentials on the blockchain with complete security and
                transparency.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="px-4 py-2 bg-gray-100 text-black">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Blockchain Secured
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 bg-gray-100 text-black">
                  <Globe className="w-4 h-4 mr-2 text-blue-600" />
                  Globally Accessible
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 bg-gray-100 text-black">
                  <Lock className="w-4 h-4 mr-2 text-purple-600" />
                  Privacy Protected
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-black">For Students</CardTitle>
                  <CardDescription className="text-gray-600">
                    Access and share your verified credentials securely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      View all your credentials
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Download certificates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Share verification links
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-black">For Institutions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Issue and manage credentials for your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Issue new credentials
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Track issued certificates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Manage student records
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-black">Instant Verification</CardTitle>
                  <CardDescription className="text-gray-600">Verify any credential in seconds</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Real-time verification
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Tamper-proof records
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Global accessibility
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Message */}
            <Card className="max-w-2xl mx-auto border shadow-xl bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-black">Welcome to Pax</CardTitle>
                <CardDescription className="text-gray-600">
                  Connect your wallet above to get started with secure credential management
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto" data-explainer="role-selector">
            <RoleSelector onRoleSelected={handleRoleSelected} onDisconnect={handleDisconnect} />
          </div>
        ) : (
          <div>
            {user.user_type === "student" && (
              <div data-explainer="holder-dashboard">
                <StudentDashboard user={user} onDisconnect={handleDisconnect} />
              </div>
            )}
            {user.user_type === "issuer" && (
              <div data-explainer="issuer-dashboard">
                <IssuerDashboard user={user} onDisconnect={handleDisconnect} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-black">Pax</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 Pax Credential Platform. Securing education credentials on the blockchain.
            </div>
          </div>
        </div>
      </footer>

      {/* Explainer Cursor */}
      <ExplainerCursor isActive={showExplainer} onClose={() => setShowExplainer(false)} />
    </div>
  )
}
