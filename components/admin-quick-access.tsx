"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Settings, Eye, EyeOff, AlertCircle } from "lucide-react"

const ADMIN_PASSWORD = "admin123"

export function AdminQuickAccess() {
  const [showButton, setShowButton] = useState(true)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleQuickAccessClick = () => {
    setShowPasswordPrompt(true)
    setError("")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
      setShowButton(false)
      setPassword("")
      setError("")
    } else {
      setError("Invalid password")
    }
  }

  const handleClose = () => {
    setIsAuthenticated(false)
    setShowPasswordPrompt(false)
    setShowButton(true)
    setPassword("")
    setError("")
  }

  const handleCancel = () => {
    setShowPasswordPrompt(false)
    setPassword("")
    setError("")
  }

  if (isAuthenticated) {
    return <AdminDashboard onClose={handleClose} />
  }

  return (
    <>
      {showButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={handleQuickAccessClick}
            className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow"
            size="icon"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      )}

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Admin Access
              </CardTitle>
              <CardDescription>Enter the admin password to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quick-admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="quick-admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Access Dashboard
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
