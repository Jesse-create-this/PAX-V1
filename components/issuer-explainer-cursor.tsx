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

const issuerSteps: ExplainerStep[] = [
  {
    target: "[data-tutorial='document-type']",
    title: "Choose Document Type",
    description: "Start by selecting whether you want to issue an Academic Credential or Professional License",
    position: "bottom",
  },
  {
    target: "[data-tutorial='student-name']",
    title: "Enter Recipient Name",
    description: "Fill in the full name of the student or license holder receiving this credential",
    position: "bottom",
  },
  {
    target: "[data-tutorial='wallet-address']",
    title: "Specify Wallet Address",
    description:
      "Enter the recipient's blockchain wallet address where the credential will be recorded. This links the credential to their identity on the blockchain.",
    position: "bottom",
  },
  {
    target: "[data-tutorial='credential-type']",
    title: "Select Credential Type",
    description: "Choose the specific type of credential or license you're issuing",
    position: "bottom",
  },
  {
    target: "[data-tutorial='issue-button']",
    title: "Issue Credential",
    description:
      "Click this button to record the credential on the blockchain. The recipient will instantly receive verification of their achievement.",
    position: "top",
  },
]

export default function IssuerExplainerCursor() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  useEffect(() => {
    const hasSeenBefore = localStorage.getItem("issuer-explainer-cursor-seen")
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

    const step = issuerSteps[currentStep]
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
    localStorage.setItem("issuer-explainer-cursor-seen", "true")
  }

  const handleNext = () => {
    if (currentStep < issuerSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSkip()
    }
  }

  const [targetElement, setTargetElement] = useState<Element | null>(null)

  if (!isVisible) return null

  const step = issuerSteps[currentStep]
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
                  Step {currentStep + 1} of {issuerSteps.length}
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
                {issuerSteps.map((_, idx) => (
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
                  {currentStep === issuerSteps.length - 1 ? "Done" : "Next"}
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
