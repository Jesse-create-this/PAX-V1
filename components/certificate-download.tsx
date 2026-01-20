"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Wallet } from "lucide-react"

interface CertificateDownloadProps {
  studentData: any
}

export default function CertificateDownload({ studentData }: CertificateDownloadProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(86400) // 24 hours in seconds
  const [downloaded, setDownloaded] = useState(false)
  const [receivedInWallet, setReceivedInWallet] = useState(false)

  useEffect(() => {
    // Only start timer if certificate was received and not yet downloaded
    if (!receivedInWallet || downloaded) {
      return
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [receivedInWallet, downloaded])

  const hours = Math.floor(secondsRemaining / 3600)
  const minutes = Math.floor((secondsRemaining % 3600) / 60)
  const seconds = secondsRemaining % 60

  const handleReceiveCertificate = () => {
    setReceivedInWallet(true)
    alert(`Certificate sent to your Pax Wallet!\n\nWallet: 0x${studentData.marticNumber.replace(/\D/g, "").slice(0, 20)}...`)
  }

  const handleDownloadCertificate = () => {
    setDownloaded(true)
    alert("Certificate downloaded successfully!")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Receive Your Certificate</h1>
        <p className="text-gray-600">Secure, blockchain-verified digital certificate</p>
      </div>

      {/* Certificate Preview */}
      <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <div className="text-3xl font-bold text-black mb-4">Certificate of Achievement</div>
          <p className="text-gray-600 text-lg">This certifies that</p>
          <p className="text-2xl font-bold text-black">{studentData.name}</p>
          <p className="text-gray-600">Martic Number: {studentData.marticNumber}</p>
          <div className="border-t-2 border-orange-600 pt-4 mt-6">
            <p className="text-sm text-gray-600">Has successfully completed the degree program</p>
            <p className="text-lg font-semibold text-black">{studentData.degreeProgram}</p>
            <p className="text-sm text-gray-600 mt-2">Faculty of {studentData.faculty}</p>
            <p className="text-sm text-gray-600">Year of Graduation: {studentData.yearOfGraduation}</p>
          </div>
          <div className="border-t pt-4 mt-6 text-xs text-gray-500">
            <p>Blockchain Hash: 0x{Math.random().toString(16).slice(2, 66)}</p>
            <p>Issue Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Certificate Details */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-black mb-4">Certificate Details</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>This certificate is sent to your <strong>Pax Wallet</strong> where you can store all your certificates securely on the blockchain.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>You have <strong>24 hours</strong> to download your certificate. Download it within this time window.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>If you don't download within 24 hours, the certificate will be automatically sent to your email: <strong>{studentData.email}</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>Your certificate is permanently stored on the BNB Smart Chain blockchain and can be verified anytime using our verification portal.</span>
          </li>
        </ul>
      </Card>

      {/* Countdown Timer - Only show after receive certificate is clicked */}
      {receivedInWallet && (
        <Card className="p-6 bg-orange-50 border border-orange-200">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Time Remaining to Download</p>
            <div className="text-4xl font-bold text-black font-mono">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {downloaded
                ? "Certificate downloaded successfully! It will still be sent to your email after 24 hours as a backup."
                : "Download your certificate before time expires"}
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleReceiveCertificate}
          disabled={receivedInWallet}
          className="bg-black text-white hover:bg-gray-800 h-auto py-4 flex items-center justify-center gap-2 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <Wallet className="h-5 w-5" />
          {receivedInWallet ? "Certificate Received ✓" : "Receive Certificate in Pax Wallet"}
        </Button>
        <Button
          onClick={handleDownloadCertificate}
          disabled={!receivedInWallet}
          className="bg-orange-600 text-white hover:bg-orange-700 h-auto py-4 flex items-center justify-center gap-2 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          Download Certificate
        </Button>
      </div>
      
      {!receivedInWallet && (
        <Card className="p-4 bg-orange-50 border border-orange-200">
          <p className="text-orange-900 text-sm text-center font-medium">
            Please click "Receive Certificate in Pax Wallet" first before downloading
          </p>
        </Card>
      )}

      {/* Completion Message */}
      {downloaded && (
        <Card className="p-6 bg-green-50 border border-green-200">
          <p className="text-green-800 font-semibold text-center">
            Congratulations! Your certificate has been successfully downloaded and stored in your Pax Wallet. 
            You can verify it anytime using our verification portal.
          </p>
        </Card>
      )}
    </div>
  )
}
