"use client"

import { useEffect, useState } from "react"

interface DeploymentStatus {
  envVarsConfigured: boolean
  buildSuccessful: boolean
  deploymentUrl?: string
  errors: string[]
}

export default function DeploymentChecker() {
  const [status, setStatus] = useState<DeploymentStatus>({
    envVarsConfigured: false,
    buildSuccessful: false,
    errors: [],
  })

  useEffect(() => {
    checkDeploymentStatus()
  }, [])

  const checkDeploymentStatus = () => {
    const errors: string[] = []

    // Check required environment variables
    const requiredEnvVars = ["NEXT_PUBLIC_PROJECT_ID", "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID", "NEXT_PUBLIC_CHAIN_ID"]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      errors.push(`Missing environment variables: ${missingVars.join(", ")}`)
    }

    setStatus({
      envVarsConfigured: missingVars.length === 0,
      buildSuccessful: errors.length === 0,
      deploymentUrl: process.env.VERCEL_URL,
      errors,
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Pax-DApp Deployment Status</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${status.envVarsConfigured ? "bg-green-500" : "bg-red-500"}`} />
          <span>Environment Variables: {status.envVarsConfigured ? "Configured" : "Missing"}</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${status.buildSuccessful ? "bg-green-500" : "bg-yellow-500"}`} />
          <span>Build Status: {status.buildSuccessful ? "Successful" : "In Progress"}</span>
        </div>

        {status.deploymentUrl && (
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span>
              Deployment URL:
              <a
                href={`https://${status.deploymentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                {status.deploymentUrl}
              </a>
            </span>
          </div>
        )}

        {status.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-semibold mb-2">Deployment Errors:</h3>
            <ul className="text-red-700 space-y-1">
              {status.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
        <ol className="text-blue-700 space-y-1 list-decimal list-inside">
          <li>Configure all required environment variables in Vercel dashboard</li>
          <li>Ensure your blockchain dependencies are properly installed</li>
          <li>Test the build locally with `npm run build`</li>
          <li>Deploy and monitor the build logs</li>
        </ol>
      </div>
    </div>
  )
}
