"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, CheckCircle, GraduationCap, Award, Globe } from "lucide-react"
import WalletConnection from "@/components/wallet-connection"
import IssuerDashboard from "@/components/issuer-dashboard"
import StudentDashboard from "@/components/student-dashboard"
import RoleSelector from "@/components/role-selector"
import LoadingSpinner from "@/components/loading-spinner"
import Image from "next/image"
import GoogleSignIn from "@/components/google-sign-in"

type UserRole = "issuer" | "student" | null
type AuthMethod = "wallet" | "google" | null

export default function PaxDApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null)

  const handleRoleSelect = (role: UserRole) => {
    setIsLoading(true)
    setTimeout(() => {
      setUserRole(role)
      setIsLoading(false)
    }, 1000)
  }

  const handleConnectionChange = (connected: boolean, address: string) => {
    setIsConnected(connected)
    setAccount(address)
    if (connected) {
      setAuthMethod("wallet")
    } else {
      setAuthMethod(null)
      setUserRole(null)
    }
  }

  const handleGoogleSignInChange = (signedIn: boolean, email?: string) => {
    if (signedIn) {
      setIsConnected(true)
      setAccount(email || "Google User")
      setAuthMethod("google")
    } else {
      setIsConnected(false)
      setAccount("")
      setAuthMethod(null)
      setUserRole(null)
    }
  }

  const resetToRoleSelection = () => {
    setUserRole(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0">
              <Image src="/logo.png" alt="Pax Logo" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Pax DApp</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Blockchain Credentials</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {userRole && (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Badge variant="outline" className="text-xs sm:text-sm capitalize px-2 py-1">
                  {userRole === "issuer" ? "🏛️ Institution" : "🎓 Student"}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetToRoleSelection}
                  className="text-xs hidden sm:inline-flex"
                >
                  Switch Role
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 scale-90 sm:scale-100 origin-right">
              <GoogleSignIn onSignInChange={handleGoogleSignInChange} />
              <WalletConnection onConnectionChange={handleConnectionChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Hero Section */}
      {!isConnected || !userRole ? (
        <section className="py-12 sm:py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
              🎓 Next-Generation Credential Platform
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 via-black to-gray-900 bg-clip-text text-transparent leading-tight">
              Pax Credential System
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Issue, verify, and manage educational credentials on the blockchain. Secure, transparent, and tamper-proof
              certification system powered by BNB Smart Chain.
            </p>

            {!isConnected ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    Connect Wallet to Start <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-4 px-4">
                  Supports MetaMask, Trust Wallet, Binance Chain Wallet, and more
                </p>
              </div>
            ) : !userRole ? (
              <div className="space-y-4 px-4">
                <RoleSelector onRoleSelect={handleRoleSelect} />
                <div className="flex items-center justify-center space-x-2 text-green-600 mt-6">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-sm sm:text-base">
                    {authMethod === "wallet" ? "Wallet Connected - " : "Signed in with Google - "}
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Features Section - Only show when not in dashboard mode */}
      {(!isConnected || !userRole) && (
        <>
          <section className="py-12 sm:py-16 px-4 bg-white/50">
            <div className="container mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Pax Credentials?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                  Revolutionary blockchain technology meets educational excellence
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-base sm:text-lg">Issue Credentials</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Educational institutions can issue tamper-proof digital certificates and diplomas
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-black mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-base sm:text-lg">Verify Authenticity</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Instantly verify the authenticity of any credential using blockchain technology
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-base sm:text-lg">Student Portfolio</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Students can manage and share their verified credentials with employers and institutions
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-gray-800 mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-base sm:text-lg">Global Recognition</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Blockchain-verified credentials are recognized worldwide with instant verification
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-black mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-base sm:text-lg">Public Verification</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Anyone can verify certificate authenticity without a wallet connection
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section for Certificate Verification */}
          <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="container mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Verify Your Certificates Instantly</h3>
              <p className="text-orange-100 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
                Students and certificate holders can verify certificate authenticity in seconds using your Pax ID or
                wallet address. No wallet connection needed!
              </p>
              <Button asChild size="lg" className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3">
                <a href="/verify">Go to Verification Portal</a>
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Role-based Dashboard */}
      {isConnected && userRole === "issuer" && <IssuerDashboard account={account} />}
      {isConnected && userRole === "student" && <StudentDashboard account={account} />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative w-8 h-8">
                  <Image src="/logo.png" alt="Pax Logo" fill className="object-contain brightness-0 invert" />
                </div>
                <span className="text-lg sm:text-xl font-bold">Pax Credentials</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Securing education credentials on the blockchain with transparency and trust.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">For Institutions</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Issue Credentials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Manage Students
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">For Students</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    View Credentials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Share Portfolio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Verify Certificates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Download Proof
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 Pax Credential System. All rights reserved. Powered by BNB Smart Chain.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
