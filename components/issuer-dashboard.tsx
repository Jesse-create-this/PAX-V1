"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, Award, Calendar, LogOut, CheckCircle, Clock, Send } from "lucide-react"

interface User {
  wallet_address: string
  user_type: "student" | "issuer" | "admin"
  name?: string
  institution_name?: string
}

interface IssuerDashboardProps {
  user: User
  onDisconnect: () => void
}

// Mock data for demonstration
const mockIssuedCredentials = [
  {
    id: "1",
    title: "Bachelor of Computer Science",
    studentName: "John Doe",
    studentAddress: "0x1234...5678",
    issueDate: "2024-05-15",
    status: "issued",
    type: "degree",
  },
  {
    id: "2",
    title: "Web Development Certificate",
    studentName: "Jane Smith",
    studentAddress: "0x9876...4321",
    issueDate: "2024-03-20",
    status: "issued",
    type: "certificate",
  },
  {
    id: "3",
    title: "Data Science Bootcamp",
    studentName: "Mike Johnson",
    studentAddress: "0x5555...7777",
    issueDate: "2024-01-10",
    status: "pending",
    type: "certificate",
  },
]

export function IssuerDashboard({ user, onDisconnect }: IssuerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isIssuing, setIsIssuing] = useState(false)
  const [newCredential, setNewCredential] = useState({
    title: "",
    description: "",
    studentAddress: "",
    studentName: "",
    type: "certificate",
  })

  const handleIssueCredential = async () => {
    setIsIssuing(true)
    // Mock credential issuance
    setTimeout(() => {
      alert(`Credential "${newCredential.title}" issued successfully to ${newCredential.studentName}!`)
      setNewCredential({
        title: "",
        description: "",
        studentAddress: "",
        studentName: "",
        type: "certificate",
      })
      setIsIssuing(false)
      setActiveTab("credentials")
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Institution Dashboard</h1>
            <p className="text-gray-600">Issue and manage credentials</p>
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
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issued</p>
                <p className="text-2xl font-bold text-black">{mockIssuedCredentials.length}</p>
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
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-black">
                  {mockIssuedCredentials.filter((c) => c.status === "issued").length}
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
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-black">
                  {mockIssuedCredentials.filter((c) => c.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(mockIssuedCredentials.map((c) => c.studentAddress)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="issue" className="data-[state=active]:bg-white">
            Issue Credential
          </TabsTrigger>
          <TabsTrigger value="credentials" className="data-[state=active]:bg-white">
            Manage Credentials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">Common tasks for credential management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setActiveTab("issue")}
                  className="h-20 bg-orange-500 hover:bg-orange-600 text-white"
                  data-explainer="issue-credential"
                >
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-2" />
                    <div>Issue New Credential</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("credentials")}
                  className="h-20 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto mb-2" />
                    <div>View All Credentials</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issue" className="space-y-6">
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Issue New Credential</CardTitle>
              <CardDescription className="text-gray-600">
                Create and issue a new credential to a student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-black">
                    Credential Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Bachelor of Computer Science"
                    value={newCredential.title}
                    onChange={(e) => setNewCredential({ ...newCredential, title: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-black">
                    Credential Type
                  </Label>
                  <Select
                    value={newCredential.type}
                    onValueChange={(value) => setNewCredential({ ...newCredential, type: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="badge">Badge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the credential and its requirements..."
                  value={newCredential.description}
                  onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="text-black">
                    Student Name
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="e.g., John Doe"
                    value={newCredential.studentName}
                    onChange={(e) => setNewCredential({ ...newCredential, studentName: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentAddress" className="text-black">
                    Student Wallet Address
                  </Label>
                  <Input
                    id="studentAddress"
                    placeholder="0x..."
                    value={newCredential.studentAddress}
                    onChange={(e) => setNewCredential({ ...newCredential, studentAddress: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <Button
                onClick={handleIssueCredential}
                disabled={isIssuing || !newCredential.title || !newCredential.studentAddress}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isIssuing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Issuing Credential...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Issue Credential
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <Card className="bg-white border shadow-sm" data-explainer="credential-list">
            <CardHeader>
              <CardTitle className="text-black">Issued Credentials</CardTitle>
              <CardDescription className="text-gray-600">View and manage all credentials you've issued</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIssuedCredentials.map((credential) => (
                  <div key={credential.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg text-black">{credential.title}</h3>
                          <Badge
                            variant="secondary"
                            className={
                              credential.status === "issued"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {credential.status === "issued" ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Issued
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {credential.studentName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(credential.issueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 font-mono">{credential.studentAddress}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
