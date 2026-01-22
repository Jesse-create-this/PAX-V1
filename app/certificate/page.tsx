"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CertificateDownload from "@/components/certificate-download"
import Image from "next/image"

export default function CertificatePage() {
  const router = useRouter()
  const [studentData, setStudentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get student data from sessionStorage
    const storedData = sessionStorage.getItem("certificateStudentData")
    if (storedData) {
      setStudentData(JSON.parse(storedData))
      setIsLoading(false)
    } else {
      // If no data, redirect to dashboard
      router.push("/dashboard")
    }
  }, [router])

  const handleCertificateDownloaded = () => {
    // Optionally redirect after download or show completion message
    setTimeout(() => {
      sessionStorage.removeItem("certificateStudentData")
      router.push("/")
    }, 2000)
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

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 text-gray-700 hover:text-black font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("studentData")
                sessionStorage.removeItem("certificateStudentData")
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
        <CertificateDownload studentData={studentData} />
      </main>
    </div>
  )
}
