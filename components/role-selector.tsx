"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Building2, LogOut } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelected: (role: "student" | "issuer") => void
  onDisconnect: () => void
}

export function RoleSelector({ onRoleSelected, onDisconnect }: RoleSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-black">Choose Your Role</h2>
        <p className="text-gray-600">Select how you want to use Pax</p>
      </div>

      <div className="grid gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-200 bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-black">Student</CardTitle>
            <CardDescription className="text-gray-600">View and manage your credentials</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3 mb-6">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                View Certificates
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Download Credentials
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Share Verification
              </Badge>
            </div>
            <Button
              onClick={() => onRoleSelected("student")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue as Student
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-200 bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-black">Institution</CardTitle>
            <CardDescription className="text-gray-600">Issue and manage credentials</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3 mb-6">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Issue Credentials
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Manage Students
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Track Records
              </Badge>
            </div>
            <Button
              onClick={() => onRoleSelected("issuer")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue as Institution
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onDisconnect} className="text-gray-600 hover:text-orange-600">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect Wallet
        </Button>
      </div>
    </div>
  )
}
