"use client"

import { useEffect } from "react"
import { envConfig, debugEnvVars } from "@/lib/env-config"

export default function EnvChecker() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === "development") {
      debugEnvVars()
    }
  }, [])

  if (process.env.NODE_ENV === "development" && !envConfig.isValid()) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 z-50">
        <strong>⚠️ Environment Variables Missing!</strong>
        <p>Check your .env.local file and ensure all required variables are set.</p>
      </div>
    )
  }

  return null
}
