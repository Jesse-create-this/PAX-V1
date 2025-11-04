"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ExplainerStep {
  id: string
  title: string
  description: string
  elementSelector?: string
  position?: "top" | "bottom" | "left" | "right"
}

interface ExplainerCursorProps {
  steps: ExplainerStep[]
  onComplete?: () => void
  autoStart?: boolean
}

export function ExplainerCursor({ steps, onComplete, autoStart = true }: ExplainerCursorProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [elementPosition, setElementPosition] = useState<any>(null)

  useEffect(() => {
    if (autoStart) {
      setIsVisible(true)
    }
  }, [autoStart])

  useEffect(() => {
    if (!isVisible || !steps[currentStep]?.elementSelector) {
      setElementPosition(null)
      return
    }

    const element = document.querySelector(steps[currentStep].elementSelector!)
    if (element) {
      const rect = element.getBoundingClientRect()
      setElementPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [currentStep, isVisible, steps])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsVisible(false)
      onComplete?.()
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible || !steps[currentStep]) return null

  const step = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      {elementPosition && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Dimmed background */}
          <div className="fixed inset-0 bg-black/40 z-40" />
          {/* Spotlight */}
          <motion.div
            className="fixed border-2 border-orange-500 shadow-lg rounded-lg"
            initial={{
              top: elementPosition.top - 8,
              left: elementPosition.left - 8,
              width: elementPosition.width + 16,
              height: elementPosition.height + 16,
            }}
            animate={{
              top: elementPosition.top - 8,
              left: elementPosition.left - 8,
              width: elementPosition.width + 16,
              height: elementPosition.height + 16,
              boxShadow: "0 0 40px rgba(249, 115, 22, 0.4), inset 0 0 40px rgba(249, 115, 22, 0.1)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: "transparent",
            }}
          />
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-orange-500 max-w-xs p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            top: elementPosition
              ? Math.min(elementPosition.top + elementPosition.height + 20, window.innerHeight - 200)
              : "50%",
            left: elementPosition ? Math.max(20, Math.min(elementPosition.left, window.innerWidth - 340)) : "50%",
            transform: !elementPosition ? "translate(-50%, -50%)" : "none",
          }}
        >
          {/* Close button */}
          <button onClick={handleSkip} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              <h3 className="text-lg font-bold text-black">{step.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSkip}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {currentStep === steps.length - 1 ? "Done" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
