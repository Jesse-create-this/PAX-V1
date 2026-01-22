"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardDemo from "@/components/dashboard-demo"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const [studentData, setStudentData] = useState<any>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get student data from sessionStorage
    const storedData = sessionStorage.getItem("studentData")
    if (storedData) {
      setStudentData(JSON.parse(storedData))
      setIsLoading(false)
    } else {
      // If no data, redirect to home
      router.push("/")
    }
  }, [router])

  const handleWalletConnect = () => {
    setWalletConnected(true)
  }

  const handleProceedToCertificate = () => {
    if (walletConnected && studentData) {
      // Store data for certificate page
      sessionStorage.setItem("certificateStudentData", JSON.stringify(studentData))
      router.push("/certificate")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!studentData) {
    return null
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

          <div>
            <button
              onClick={() => {
                sessionStorage.removeItem("studentData")
                router.push("/")
              }}
              className="px-6 py-2 text-gray-700 hover:text-black font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <DashboardDemo
          studentData={studentData}
          walletConnected={walletConnected}
          onWalletConnect={handleWalletConnect}
          onNext={handleProceedToCertificate}
        />
      </main>
    </div>
  )
}
