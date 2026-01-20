"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface DashboardDemoProps {
  studentData: any
  walletConnected: boolean
  onWalletConnect: () => void
  onNext: () => void
}

export default function DashboardDemo({
  studentData,
  walletConnected,
  onWalletConnect,
  onNext,
}: DashboardDemoProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  const handleConnectWallet = () => {
    // Demo wallet connection - no real wallet modal
    setTimeout(() => {
      onWalletConnect()
    }, 500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Student Info Card */}
      <Card className="p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-black mb-8">Your Information</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="text-lg font-semibold text-black">{studentData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Martic Number</p>
            <p className="text-lg font-semibold text-black">{studentData.marticNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Part</p>
            <p className="text-lg font-semibold text-black">Part {studentData.part}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Year of Graduation</p>
            <p className="text-lg font-semibold text-black">{studentData.yearOfGraduation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Department</p>
            <p className="text-lg font-semibold text-black">{studentData.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Faculty</p>
            <p className="text-lg font-semibold text-black">{studentData.faculty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Degree Programme</p>
            <p className="text-lg font-semibold text-black">{studentData.degreeProgram}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg font-semibold text-black">{studentData.email}</p>
          </div>
        </div>

        {/* Edit Info Button */}
        <button
          onClick={() => setShowEditModal(true)}
          className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
        >
          Edit My Info
        </button>
      </Card>

      {/* Wallet Connection Required */}
      <Card className={`p-6 border ${walletConnected ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <div className="flex items-start gap-4">
          <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${walletConnected ? "text-green-600" : "text-orange-600"}`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-2 ${walletConnected ? "text-green-900" : "text-orange-900"}`}>
              {walletConnected
                ? "Pax Wallet Connected"
                : "Connect Your Pax Wallet to Continue"}
            </h3>
            <p className={walletConnected ? "text-green-700 text-sm" : "text-orange-700 text-sm"}>
              {walletConnected
                ? "Your wallet is connected. You can now proceed to receive your certificate."
                : "You must connect your Pax Wallet to store your certificate on the blockchain."}
            </p>
          </div>
        </div>

        {!walletConnected && (
          <button
            onClick={handleConnectWallet}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors"
          >
            Connect Pax Wallet (Demo)
          </button>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onNext}
          disabled={!walletConnected}
          className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
        >
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Edit Information</h2>
            <p className="text-gray-600 mb-6">
              Please note: For this demo, your information cannot be edited. This is a read-only demonstration.
            </p>
            <Button
              onClick={() => setShowEditModal(false)}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
