"use client"

import { useState } from "react"
import VerificationPortal from "@/components/verification-portal"
import LoginModal from "@/components/login-modal"
import DashboardDemo from "@/components/dashboard-demo"
import CertificateDownload from "@/components/certificate-download"
import Image from "next/image"


type DemoStep = "verification" | "dashboard" | "certificate"

export default function PaxDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("verification")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [studentData, setStudentData] = useState<any>(null)
  const [walletConnected, setWalletConnected] = useState(false)

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
            {currentStep !== "verification" && !studentData && (
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
