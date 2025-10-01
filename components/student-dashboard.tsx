"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CertificateViewer } from "@/components/certificate-viewer"
import { GraduationCap, Download, Share2, Eye, Calendar, Building2, LogOut, Award, CheckCircle } from "lucide-react"

interface User {
  wallet_address: string
  user_type: "student" | "issuer" | "admin"
  name?: string
  institution_name?: string
}

interface StudentDashboardProps {
  user: User
  onDisconnect: () => void
}

// Mock data for demonstration
const mockCredentials = [
  {
    id: "1",
    title: "Bachelor of Computer Science",
    institution: "Tech University",
    issueDate: "2024-05-15",
    status: "verified",
    type: "degree",
    description: "Bachelor's degree in Computer Science with honors",
  },
  {
    id: "2",
    title: "Web Development Certificate",
    institution: "Code Academy",
    issueDate: "2024-03-20",
    status: "verified",
    type: "certificate",
    description: "Full-stack web development certification",
  },
  {
    id: "3",
    title: "Data Science Bootcamp",
    institution: "Data Institute",
    issueDate: "2024-01-10",
    status: "verified",
    type: "certificate",
    description: "Intensive data science and machine learning program",
  },
]

export function StudentDashboard({ user, onDisconnect }: StudentDashboardProps) {
  const [selectedCredential, setSelectedCredential] = useState<any>(null)

  const handleViewCredential = (credential: any) => {
    setSelectedCredential(credential)
  }

  const handleDownload = (credential: any) => {
    // Mock download functionality
    console.log("Downloading credential:", credential.title)
    alert(`Downloading ${credential.title}...`)
  }

  const handleShare = (credential: any) => {
    // Mock share functionality
    const shareUrl = `https://pax.verify/${credential.id}`
    navigator.clipboard.writeText(shareUrl)
    alert(`Verification link copied to clipboard: ${shareUrl}`)
  }

  if (selectedCredential) {
    return <CertificateViewer credential={selectedCredential} onClose={() => setSelectedCredential(null)} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Student Dashboard</h1>
            <p className="text-gray-600">Manage your verified credentials</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onDisconnect}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credentials</p>
                <p className="text-2xl font-bold text-black">{mockCredentials.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-black">
                  {mockCredentials.filter((c) => c.status === "verified").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Institutions</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(mockCredentials.map((c) => c.institution)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credentials List */}
      <Card className="bg-white border shadow-sm" data-explainer="view-credentials">
        <CardHeader>
          <CardTitle className="text-black">Your Credentials</CardTitle>
          <CardDescription className="text-gray-600">
            View, download, and share your verified credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCredentials.map((credential) => (
              <div key={credential.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-black">{credential.title}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {credential.institution}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(credential.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{credential.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCredential(credential)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(credential)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(credential)}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
