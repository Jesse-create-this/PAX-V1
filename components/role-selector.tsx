"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Building2, CheckCircle, Users, Award, Shield, TrendingUp } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelect: (role: "issuer" | "student") => void
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"issuer" | "student" | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleRoleClick = (role: "issuer" | "student") => {
    setSelectedRole(role)
  }

  const handleConfirm = () => {
    if (selectedRole) {
      setIsConfirming(true)
      setTimeout(() => {
        onRoleSelect(selectedRole)
        setIsConfirming(false)
      }, 500)
    }
  }

  const handleCancel = () => {
    setSelectedRole(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">Choose Your Role</h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Select your role to access the appropriate dashboard and features tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Issuer Card */}
        <Card
          className={`border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl ${
            selectedRole === "issuer"
              ? "border-orange-500 bg-orange-50 shadow-lg"
              : "border-orange-200 hover:border-orange-400"
          }`}
          onClick={() => handleRoleClick("issuer")}
        >
          <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className={`p-3 sm:p-4 rounded-full transition-all duration-300 ${
                  selectedRole === "issuer" ? "bg-orange-600" : "bg-orange-100 group-hover:bg-orange-200"
                }`}
              >
                <Building2
                  className={`h-8 w-8 sm:h-12 sm:w-12 transition-all duration-300 ${
                    selectedRole === "issuer" ? "text-white" : "text-orange-600"
                  }`}
                />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-2xl mb-2">Educational Institution</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Issue and manage digital credentials for your students with blockchain security
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Issue certificates and diplomas</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Manage student records</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Blockchain verification</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Analytics and reporting</span>
              </div>
            </div>

            {selectedRole === "issuer" && (
              <div className="flex items-center justify-center space-x-2 text-orange-600 bg-orange-100 p-2 sm:p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">Selected</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Card */}
        <Card
          className={`border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl ${
            selectedRole === "student"
              ? "border-purple-500 bg-purple-50 shadow-lg"
              : "border-purple-200 hover:border-purple-400"
          }`}
          onClick={() => handleRoleClick("student")}
        >
          <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className={`p-3 sm:p-4 rounded-full transition-all duration-300 ${
                  selectedRole === "student" ? "bg-purple-600" : "bg-purple-100 group-hover:bg-purple-200"
                }`}
              >
                <GraduationCap
                  className={`h-8 w-8 sm:h-12 sm:w-12 transition-all duration-300 ${
                    selectedRole === "student" ? "text-white" : "text-purple-600"
                  }`}
                />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-2xl mb-2">Student</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View, manage, and share your blockchain-verified digital credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">View your credentials</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Share with employers</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Verify authenticity</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Download certificates</span>
              </div>
            </div>

            {selectedRole === "student" && (
              <div className="flex items-center justify-center space-x-2 text-purple-600 bg-purple-100 p-2 sm:p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">Selected</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {selectedRole && (
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-transparent w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`px-6 sm:px-8 py-2 sm:py-3 font-semibold w-full sm:w-auto ${
              selectedRole === "issuer" ? "bg-orange-600 hover:bg-orange-700" : "bg-black hover:bg-gray-800"
            }`}
          >
            {isConfirming ? "Setting up..." : `Continue as ${selectedRole === "issuer" ? "Institution" : "Student"}`}
          </Button>
        </div>
      )}

      {!selectedRole && (
        <div className="text-center px-4">
          <p className="text-gray-500 text-xs sm:text-sm">Click on a role above to get started</p>
        </div>
      )}
    </div>
  )
}
