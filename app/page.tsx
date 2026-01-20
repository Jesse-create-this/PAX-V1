"use client"

import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import VerificationPortal from "@/components/verification-portal"
import LoginModal from "@/components/login-modal"
import DashboardDemo from "@/components/dashboard-demo"
import CertificateDownload from "@/components/certificate-download"
import Image from "next/image"
import { UserRole } from "@/types/user-role"
import { LoadingSpinner } from "@/components/loading-spinner"
import { GoogleSignIn } from "@/components/google-sign-in"
import { WalletConnection } from "@/components/wallet-connection"
import { ArrowRight } from "@/components/icons/arrow-right"
import { RoleSelector } from "@/components/role-selector"
import { CheckCircle } from "@/components/icons/check-circle"
import { Award } from "@/components/icons/award"
import { Shield } from "@/components/icons/shield"
import { GraduationCap } from "@/components/icons/graduation-cap"
import { Globe } from "@/components/icons/globe"
import { IssuerDashboard } from "@/components/issuer-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"

type DemoStep = "verification" | "dashboard" | "certificate"

export default function PaxDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("verification")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [studentData, setStudentData] = useState<any>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")
  const [authMethod, setAuthMethod] = useState<"wallet" | "google" | null>(null)

  const handleLogin = (data: any) => {
    setStudentData(data)
    setCurrentStep("dashboard")
    setShowLoginModal(false)
  }

  const handleWalletConnect = () => {
    setWalletConnected(true)
  }

  const handleProceedToNextStep = () => {
    if (walletConnected) {
      setCurrentStep("certificate")
    }
  }

  const handleDownloadCertificate = () => {
    // Certificate download logic handled in component
    alert("Certificate downloaded!")
  }

  const resetToRoleSelection = () => {
    setUserRole(null)
  }

  const handleGoogleSignInChange = (signedIn: boolean, account: string) => {
    setIsConnected(signedIn)
    setAccount(account)
    setAuthMethod("google")
  }

  const handleConnectionChange = (connected: boolean, account: string) => {
    setIsConnected(connected)
    setAccount(account)
    setAuthMethod("wallet")
  }

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Pax Logo" fill className="object-contain" priority />
            </div>
            <h1 className="text-xl font-bold text-black">Pax Credentials</h1>
          </div>

          <div className="flex items-center gap-4">
            {currentStep !== "verification" && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === "verification" && (
          <VerificationPortal
            onLoginClick={() => setShowLoginModal(true)}
          />
        )}

        {currentStep === "dashboard" && studentData && (
          <DashboardDemo
            studentData={studentData}
            walletConnected={walletConnected}
            onWalletConnect={handleWalletConnect}
            onNext={handleProceedToNextStep}
          />
        )}

        {currentStep === "certificate" && (
          <CertificateDownload studentData={studentData} />
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onOpenChange={setShowLoginModal}
        />
      )}
    </div>
  )
}
