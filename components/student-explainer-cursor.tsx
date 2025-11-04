"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, SkipForward } from "lucide-react"

interface ExplainerStep {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

const studentSteps: ExplainerStep[] = [
  {
    target: "[data-tutorial='stats-section']",
    title: "View Your Credentials Overview",
    description:
      "See all your verified credentials at a glance. This shows your total credentials, verified count, institutions, and sharing statistics.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='credentials-tab']",
    title: "Access Your Credentials",
    description:
      "Click here to view all your blockchain-verified credentials. Each credential is secured and linked to your wallet address.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='view-certificate']",
    title: "View Certificate Details",
    description:
      "Click 'View Certificate' to see the full details of your credential, including issuer information and blockchain verification data.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='download-button']",
    title: "Download Your Certificate",
    description:
      "Download a copy of your certificate as a text file that you can save or share with employers and institutions.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='share-button']",
    title: "Share Your Credential",
    description:
      "Generate a shareable link to your credential. Anyone can verify its authenticity using this link without needing blockchain access.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='profile-tab']",
    title: "Manage Your Profile",
    description:
      "View your wallet address, membership details, and credential verification status. This is your professional credential hub.",
    position: "bottom",
  },
]

export default function StudentExplainerCursor() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  useEffect(() => {
    const hasSeenBefore = localStorage.getItem("student-explainer-cursor-seen")
    if (!hasSeenBefore) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasSeenTutorial(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const step = studentSteps[currentStep]
    const element = document.querySelector(step.target)

    if (element) {
      setTargetElement(element)
      const rect = element.getBoundingClientRect()
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      setPosition({
        x: centerX,
        y: centerY,
      })
    }
  }, [currentStep, isVisible])

  const handleSkip = () => {
    setIsVisible(false)
    localStorage.setItem("student-explainer-cursor-seen", "true")
  }

  const handleNext = () => {
    if (currentStep < studentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSkip()
    }
  }

  const [targetElement, setTargetElement] = useState<Element | null>(null)

  if (!isVisible) return null

  const step = studentSteps[currentStep]
  const targetRect = targetElement?.getBoundingClientRect()

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay with spotlight */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Spotlight effect around target */}
          {targetRect && (
            <motion.div
              className="fixed z-[9991] pointer-events-none rounded-lg border-2 border-orange-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            className="fixed z-[9992] bg-white text-gray-900 rounded-xl shadow-2xl border border-orange-200 max-w-sm p-5"
            style={{
              left: targetRect ? Math.max(16, Math.min(targetRect.left, window.innerWidth - 320)) : 0,
              top: targetRect ? targetRect.bottom + 16 : 0,
            }}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                  Step {currentStep + 1} of {studentSteps.length}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{step.title}</h3>
              </div>
              <button
                onClick={handleSkip}
                className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed mb-5">{step.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex gap-1">
                {studentSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx <= currentStep ? "bg-orange-500 w-3" : "bg-gray-300 w-1.5"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1"
                >
                  {currentStep === studentSteps.length - 1 ? "Done" : "Next"}
                  <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
