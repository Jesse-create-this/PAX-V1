"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, TrendingUp, Plus, Send, Eye, Share2, ShieldCheck, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CertificateViewer from "./certificate-viewer"
import IssuerExplainerCursor from "./issuer-explainer-cursor"

interface IssuerDashboardProps {
  account: string
}

interface Certificate {
  id: number
  studentName: string
  studentAddress: string
  credentialType: string
  subject: string
  issueDate: string
  status: "verified" | "pending" | "issued"
  grade?: string
  description?: string
  issuer?: string
  issuerAddress?: string
  credentialHash: string
  blockchainTxHash?: string
  documentType: "credential" | "license"
  licenseNumber?: string
  expiryDate?: string
  licenseClass?: string
  restrictions?: string
  issuingAuthority?: string
}

export default function IssuerDashboard({ account }: IssuerDashboardProps) {
  const [issuedCredentials, setIssuedCredentials] = useState<Certificate[]>([
    {
      id: 1,
      studentName: "Alice Johnson",
      studentAddress: "0x123abc456def789ghi012jkl345mno678pqr901st",
      credentialType: "Bachelor's Degree",
      subject: "Computer Science",
      issueDate: "2024-01-15",
      status: "verified",
      grade: "3.8 GPA",
      description:
        "Completed 4-year program with focus on software engineering, algorithms, and blockchain technology. Demonstrated exceptional performance in advanced coursework.",
      issuer: "Tech University",
      issuerAddress: account,
      credentialHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
      blockchainTxHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      documentType: "credential",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentAddress: "0x456def789ghi012jkl345mno678pqr901stu234vwx",
      credentialType: "Driving License",
      subject: "Class A Commercial",
      issueDate: "2024-01-10",
      status: "issued",
      description: "Commercial driving license with endorsements for hazardous materials and passenger transport.",
      issuer: "Department of Motor Vehicles",
      issuerAddress: account,
      credentialHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
      blockchainTxHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      documentType: "license",
      licenseNumber: "CDL-2024-001234",
      expiryDate: "2028-01-10",
      licenseClass: "Class A",
      restrictions: "Must wear corrective lenses",
      issuingAuthority: "State DMV",
    },
    {
      id: 3,
      studentName: "Carol Davis",
      studentAddress: "0x789ghi012jkl345mno678pqr901stu234vwx567yz8",
      credentialType: "Professional License",
      subject: "Software Engineering",
      issueDate: "2024-01-05",
      status: "verified",
      description:
        "Professional software engineering license with specialization in blockchain and cybersecurity systems.",
      issuer: "Professional Engineering Board",
      issuerAddress: account,
      credentialHash: "0xghi789jkl012mno345pqr678stu901vwx234yz567abc123def456",
      blockchainTxHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      documentType: "license",
      licenseNumber: "PE-2024-567890",
      expiryDate: "2026-01-05",
      licenseClass: "Professional Engineer",
      restrictions: "Valid for software systems only",
      issuingAuthority: "State Engineering Board",
    },
  ])

  const [newCredential, setNewCredential] = useState({
    studentName: "",
    studentAddress: "",
    credentialType: "",
    subject: "",
    description: "",
    grade: "",
    // License fields
    licenseNumber: "",
    expiryDate: "",
    licenseClass: "",
    restrictions: "",
    issuingAuthority: "",
  })

  const [documentType, setDocumentType] = useState<"credential" | "license">("credential")
  const [isIssuing, setIsIssuing] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showCertificateViewer, setShowCertificateViewer] = useState(false)
  const { toast } = useToast()

  const handleIssueCredential = async () => {
    const requiredFields =
      documentType === "credential"
        ? ["studentName", "studentAddress", "credentialType"]
        : ["studentName", "studentAddress", "credentialType", "licenseNumber", "expiryDate"]

    const missingFields = requiredFields.filter((field) => !newCredential[field as keyof typeof newCredential])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsIssuing(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const credential: Certificate = {
        id: issuedCredentials.length + 1,
        studentName: newCredential.studentName,
        studentAddress: newCredential.studentAddress,
        credentialType: newCredential.credentialType,
        subject: newCredential.subject,
        issueDate: new Date().toISOString().split("T")[0],
        status: "issued",
        grade: documentType === "credential" ? newCredential.grade : undefined,
        description: newCredential.description,
        issuer:
          documentType === "credential" ? "Tech University" : newCredential.issuingAuthority || "Licensing Authority",
        issuerAddress: account,
        credentialHash: "0x" + Math.random().toString(16).substr(2, 64),
        blockchainTxHash: "0x" + Math.random().toString(16).substr(2, 64),
        documentType,
        // License-specific fields
        licenseNumber: documentType === "license" ? newCredential.licenseNumber : undefined,
        expiryDate: documentType === "license" ? newCredential.expiryDate : undefined,
        licenseClass: documentType === "license" ? newCredential.licenseClass : undefined,
        restrictions: documentType === "license" ? newCredential.restrictions : undefined,
        issuingAuthority: documentType === "license" ? newCredential.issuingAuthority : undefined,
      }

      setIssuedCredentials([credential, ...issuedCredentials])

      // Reset form
      setNewCredential({
        studentName: "",
        studentAddress: "",
        credentialType: "",
        subject: "",
        description: "",
        grade: "",
        licenseNumber: "",
        expiryDate: "",
        licenseClass: "",
        restrictions: "",
        issuingAuthority: "",
      })

      toast({
        title: `${documentType === "credential" ? "Credential" : "License"} Issued Successfully`,
        description: `${documentType === "credential" ? "Credential" : "License"} issued to ${newCredential.studentName} and recorded on blockchain`,
      })
    } catch (error) {
      toast({
        title: "Issuance Failed",
        description: `Failed to issue ${documentType}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsIssuing(false)
    }
  }

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setShowCertificateViewer(true)
  }

  const handleShareCertificate = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify/${certificate.credentialHash}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Share Link Copied",
      description: `Verification link for ${certificate.studentName}'s ${certificate.documentType} copied to clipboard`,
    })
  }

  const credentialTypes = {
    credential: [
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
      "Certificate",
      "Diploma",
      "Associate Degree",
      "Professional Certificate",
    ],
    license: [
      "Driving License",
      "Professional License",
      "Business License",
      "Medical License",
      "Legal License",
      "Teaching License",
      "Pilot License",
      "Contractor License",
    ],
  }

  const licenseClasses = {
    "Driving License": ["Class A", "Class B", "Class C", "CDL", "Motorcycle", "Commercial"],
    "Professional License": ["Professional Engineer", "Architect", "Surveyor", "Contractor"],
    "Business License": ["General Business", "Food Service", "Retail", "Manufacturing"],
    "Medical License": ["General Practice", "Specialist", "Nurse", "Pharmacist"],
    "Legal License": ["Attorney", "Paralegal", "Notary Public"],
    "Teaching License": ["Elementary", "Secondary", "Special Education", "Administrator"],
    "Pilot License": ["Private", "Commercial", "Airline Transport", "Instructor"],
    "Contractor License": ["General", "Electrical", "Plumbing", "HVAC"],
  }

  return (
    <section className="py-16 px-4">
      <IssuerExplainerCursor />

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Issuer Dashboard</h3>
          <p className="text-gray-600">
            Issue and manage digital credentials and licenses with blockchain transparency
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issuedCredentials.length}</div>
              <p className="text-xs text-muted-foreground">
                +{issuedCredentials.filter((c) => c.status === "issued").length} this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credentials</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {issuedCredentials.filter((c) => c.documentType === "credential").length}
              </div>
              <p className="text-xs text-muted-foreground">Academic credentials</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Licenses</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {issuedCredentials.filter((c) => c.documentType === "license").length}
              </div>
              <p className="text-xs text-muted-foreground">Professional licenses</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">Verification success</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="issue" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="issue">Issue Document</TabsTrigger>
            <TabsTrigger value="manage">Manage Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="issue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Issue New Document</span>
                </CardTitle>
                <CardDescription>Create and issue a new digital credential or license</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Type Toggle */}
                <div
                  data-tutorial="document-type"
                  className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1"
                >
                  <Button
                    variant={documentType === "credential" ? "default" : "ghost"}
                    onClick={() => setDocumentType("credential")}
                    className={`flex-1 ${documentType === "credential" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Academic Credential
                  </Button>
                  <Button
                    variant={documentType === "license" ? "default" : "ghost"}
                    onClick={() => setDocumentType("license")}
                    className={`flex-1 ${documentType === "license" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Professional License
                  </Button>
                </div>

                {/* Common Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div data-tutorial="student-name" className="space-y-2">
                    <label className="text-sm font-medium">
                      {documentType === "credential" ? "Student Name" : "License Holder Name"} *
                    </label>
                    <Input
                      placeholder={
                        documentType === "credential" ? "Enter student's full name" : "Enter license holder's full name"
                      }
                      value={newCredential.studentName}
                      onChange={(e) => setNewCredential({ ...newCredential, studentName: e.target.value })}
                    />
                  </div>
                  <div data-tutorial="wallet-address" className="space-y-2">
                    <label className="text-sm font-medium">Wallet Address *</label>
                    <Input
                      placeholder="0x..."
                      value={newCredential.studentAddress}
                      onChange={(e) => setNewCredential({ ...newCredential, studentAddress: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div data-tutorial="credential-type" className="space-y-2">
                    <label className="text-sm font-medium">
                      {documentType === "credential" ? "Credential Type" : "License Type"} *
                    </label>
                    <Select
                      value={newCredential.credentialType}
                      onValueChange={(value) => setNewCredential({ ...newCredential, credentialType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${documentType} type`} />
                      </SelectTrigger>
                      <SelectContent>
                        {credentialTypes[documentType].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {documentType === "credential" ? "Subject/Field" : "Specialization/Category"}
                    </label>
                    <Input
                      placeholder={
                        documentType === "credential" ? "e.g., Computer Science" : "e.g., Commercial Driving"
                      }
                      value={newCredential.subject}
                      onChange={(e) => setNewCredential({ ...newCredential, subject: e.target.value })}
                    />
                  </div>
                </div>

                {/* Credential-specific fields */}
                {documentType === "credential" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grade/GPA</label>
                      <Input
                        placeholder="e.g., 3.8 GPA or A"
                        value={newCredential.grade}
                        onChange={(e) => setNewCredential({ ...newCredential, grade: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* License-specific fields */}
                {documentType === "license" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">License Number *</label>
                        <Input
                          placeholder="e.g., DL-2024-123456"
                          value={newCredential.licenseNumber}
                          onChange={(e) => setNewCredential({ ...newCredential, licenseNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiry Date *</label>
                        <Input
                          type="date"
                          value={newCredential.expiryDate}
                          onChange={(e) => setNewCredential({ ...newCredential, expiryDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">License Class</label>
                        <Select
                          value={newCredential.licenseClass}
                          onValueChange={(value) => setNewCredential({ ...newCredential, licenseClass: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select license class" />
                          </SelectTrigger>
                          <SelectContent>
                            {newCredential.credentialType &&
                              licenseClasses[newCredential.credentialType as keyof typeof licenseClasses]?.map(
                                (cls) => (
                                  <SelectItem key={cls} value={cls}>
                                    {cls}
                                  </SelectItem>
                                ),
                              )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issuing Authority</label>
                        <Input
                          placeholder="e.g., State DMV, Professional Board"
                          value={newCredential.issuingAuthority}
                          onChange={(e) => setNewCredential({ ...newCredential, issuingAuthority: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Restrictions/Conditions</label>
                      <Input
                        placeholder="e.g., Must wear corrective lenses, Valid for specific equipment only"
                        value={newCredential.restrictions}
                        onChange={(e) => setNewCredential({ ...newCredential, restrictions: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder={`Additional details about the ${documentType}...`}
                    value={newCredential.description}
                    onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                  />
                </div>

                <Button
                  data-tutorial="issue-button"
                  onClick={handleIssueCredential}
                  disabled={isIssuing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isIssuing
                    ? `Issuing ${documentType}...`
                    : `Issue ${documentType === "credential" ? "Credential" : "License"}`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issued Documents</CardTitle>
                <CardDescription>
                  View and manage all issued credentials and licenses with full blockchain transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issuedCredentials.map((credential) => (
                    <div
                      key={credential.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{credential.studentName}</h4>
                          <Badge
                            variant={
                              credential.status === "verified"
                                ? "default"
                                : credential.status === "issued"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {credential.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              credential.documentType === "license"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-green-50 text-green-700"
                            }
                          >
                            {credential.documentType === "license" ? (
                              <>
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                License
                              </>
                            ) : (
                              <>
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Credential
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {credential.credentialType} {credential.subject && `in ${credential.subject}`}
                          {credential.grade && ` • Grade: ${credential.grade}`}
                          {credential.licenseNumber && ` • License #: ${credential.licenseNumber}`}
                          {credential.expiryDate && ` • Expires: ${credential.expiryDate}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {credential.issueDate} | To: {credential.studentAddress.slice(0, 10)}...
                          {credential.studentAddress.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          Hash: {credential.credentialHash.slice(0, 20)}...
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewCertificate(credential)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShareCertificate(credential)}>
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issuance Analytics</CardTitle>
                <CardDescription>Track your document issuance performance and blockchain transparency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Document Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Academic Credentials</span>
                        <span className="text-sm font-medium">
                          {issuedCredentials.filter((c) => c.documentType === "credential").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Professional Licenses</span>
                        <span className="text-sm font-medium">
                          {issuedCredentials.filter((c) => c.documentType === "license").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Documents</span>
                        <span className="text-sm font-medium">{issuedCredentials.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Blockchain Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Verified on Chain</span>
                        <span className="text-sm font-medium text-green-600">
                          {issuedCredentials.filter((c) => c.status === "verified").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending Verification</span>
                        <span className="text-sm font-medium text-yellow-600">
                          {issuedCredentials.filter((c) => c.status === "issued").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Transactions</span>
                        <span className="text-sm font-medium">{issuedCredentials.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Certificate Viewer Modal */}
        {selectedCertificate && (
          <CertificateViewer
            certificate={selectedCertificate}
            isOpen={showCertificateViewer}
            onClose={() => {
              setShowCertificateViewer(false)
              setSelectedCertificate(null)
            }}
            viewerType="issuer"
          />
        )}
      </div>
    </section>
  )
}
