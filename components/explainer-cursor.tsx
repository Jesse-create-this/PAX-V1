"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft, Play, Pause, XCircle } from "lucide-react"

interface ExplainerStep {
  id: string
  title: string
  text: string
  targetSelector?: string
  position: "top" | "bottom" | "left" | "right"
  action?: () => void
}

const explainerSteps: ExplainerStep[] = [
  {
    id: "welcome",
    title: "Welcome to Pax!",
    text: "👋 Welcome to Pax! The blockchain for secure, verifiable credentials. Let's get you started.",
    position: "bottom",
  },
  {
    id: "connect-wallet",
    title: "Connect Your Wallet",
    text: "First, connect your wallet to begin. Pax supports wallets like MetaMask and others.",
    targetSelector: "[data-explainer='connect-wallet']",
    position: "bottom",
  },
  {
    id: "choose-role",
    title: "Choose Your Role",
    text: "Are you an Institution or a Student?\n👉 Continue as an Institution to issue new credentials.\n🎓 Continue as a Student to view and verify your credentials.",
    targetSelector: "[data-explainer='role-selector']",
    position: "top",
  },
  {
    id: "issuer-dashboard",
    title: "Issuer Dashboard",
    text: "Welcome to your Issuer Dashboard. From here, you can:\n📄 Issue new digital credentials\n🗂 Manage issued credentials\n👥 Track students and records\n✅ Verify authenticity instantly",
    targetSelector: "[data-explainer='issuer-dashboard']",
    position: "right",
  },
  {
    id: "issue-credential",
    title: "Issue New Credential",
    text: "Click here to issue a new credential to a student. All credentials are timestamped and verifiable on Pax.",
    targetSelector: "[data-explainer='issue-credential']",
    position: "bottom",
  },
  {
    id: "credential-management",
    title: "Credential Management",
    text: "Here you can view all the credentials you've issued, revoke if necessary, or update records.",
    targetSelector: "[data-explainer='credential-list']",
    position: "top",
  },
  {
    id: "holder-dashboard",
    title: "Holder Dashboard",
    text: "Welcome to your Holder Dashboard. From here, you can:\n🎓 View all your credentials in one place\n🔍 Verify the authenticity of your credentials\n📤 Share them securely with employers or institutions\n💾 Download your certificates",
    targetSelector: "[data-explainer='holder-dashboard']",
    position: "right",
  },
  {
    id: "view-credential",
    title: "View Your Credentials",
    text: "Click here to open and view your verified digital credentials.",
    targetSelector: "[data-explainer='view-credentials']",
    position: "bottom",
  },
  {
    id: "verification-section",
    title: "Public Verification",
    text: "Employers or schools can use the Verification button to instantly verify credential authenticity. They can input a wallet address (Pax ID) to view all verified certificates for that person.",
    targetSelector: "[data-explainer='verification-button']",
    position: "bottom",
  },
  {
    id: "blockchain-explorer",
    title: "Pax Blockchain Explorer",
    text: "This mini blockchain explorer lets anyone verify credentials by entering a Pax ID (wallet address). All NFT certificates for that address will be displayed, making verification transparent and trustworthy.",
    targetSelector: "[data-explainer='blockchain-explorer']",
    position: "top",
  },
  {
    id: "completion",
    title: "You're All Set! 🎉",
    text: "That's it 🎉 — You now know how to use Pax MVP. Institutions can issue, Students can view, and everyone can verify.",
    position: "bottom",
  },
]

interface ExplainerCursorProps {
  isActive: boolean
  onClose: () => void
  currentStep?: string
}

export function ExplainerCursor({ isActive, onClose, currentStep }: ExplainerCursorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showOptOut, setShowOptOut] = useState(false)

  const currentStepData = explainerSteps[currentStepIndex]

  // Show opt-out option for first 3 seconds
  useEffect(() => {
    if (isActive && currentStepIndex === 0) {
      setShowOptOut(true)
      const timer = setTimeout(() => {
        setShowOptOut(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive, currentStepIndex])

  useEffect(() => {
    if (isActive && currentStepData.targetSelector) {
      const targetElement = document.querySelector(currentStepData.targetSelector)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

        let x = rect.left + scrollLeft + rect.width / 2
        let y = rect.top + scrollTop + rect.height / 2

        // Adjust position based on desired placement
        switch (currentStepData.position) {
          case "top":
            y = rect.top + scrollTop - 20
            break
          case "bottom":
            y = rect.bottom + scrollTop + 20
            break
          case "left":
            x = rect.left + scrollLeft - 20
            break
          case "right":
            x = rect.right + scrollLeft + 20
            break
        }

        setCursorPosition({ x, y })

        // Scroll element into view
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentStepIndex, isActive, currentStepData])

  const nextStep = () => {
    if (currentStepIndex < explainerSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleOptOut = () => {
    localStorage.setItem("pax-explainer-disabled", "true")
    onClose()
  }

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && isActive) {
      const timer = setTimeout(() => {
        if (currentStepIndex < explainerSteps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1)
        } else {
          setIsPlaying(false)
          onClose()
        }
      }, 4000) // 4 seconds per step

      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStepIndex, isActive, onClose])

  if (!isActive) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none" />

      {/* Opt-out button */}
      {showOptOut && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOptOut}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Skip Tutorial
          </Button>
        </div>
      )}

      {/* Cursor Tooltip */}
      <div
        className="fixed z-50 pointer-events-none transition-all duration-500 ease-in-out"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Animated cursor dot */}
        <div className="relative">
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Explanation Card */}
      <Card className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 shadow-2xl border-2 border-orange-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black">{currentStepData.title}</h3>
                <p className="text-xs text-gray-500">
                  Step {currentStepIndex + 1} of {explainerSteps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentStepData.text}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / explainerSteps.length) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>

            <Button onClick={nextStep} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              {currentStepIndex === explainerSteps.length - 1 ? "Finish" : "Next"}
              {currentStepIndex !== explainerSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
