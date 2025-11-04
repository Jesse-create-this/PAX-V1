"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Download, Share2, Shield, ExternalLink, Eye, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CertificateViewer from "./certificate-viewer"
import StudentExplainerCursor from "./student-explainer-cursor"

interface StudentDashboardProps {
  account: string
}

interface Certificate {
  id: number
  studentName?: string
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
}

export default function StudentDashboard({ account }: StudentDashboardProps) {
  const [credentials] = useState<Certificate[]>([
    {
      id: 1,
      studentName: "Your Name",
      studentAddress: account,
      credentialType: "Bachelor's Degree",
      subject: "Computer Science",
      issueDate: "2024-01-15",
      status: "verified",
      grade: "3.8 GPA",
      description:
        "Completed 4-year program with focus on software engineering, algorithms, and blockchain technology. Demonstrated exceptional performance in advanced coursework including data structures, machine learning, and distributed systems.",
      issuer: "Tech University",
      issuerAddress: "0x789ghi012jkl345mno678pqr901stu234vwx567yz8",
      credentialHash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
      blockchainTxHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: 2,
      studentName: "Your Name",
      studentAddress: account,
      credentialType: "Certificate",
      subject: "Blockchain Development",
      issueDate: "2024-01-10",
      status: "verified",
      grade: "A",
      description:
        "Successfully completed comprehensive blockchain development course covering smart contracts, DeFi protocols, dApp development, and Web3 integration. Hands-on experience with Solidity, Ethereum, and BNB Smart Chain.",
      issuer: "Crypto Academy",
      issuerAddress: "0x456def789ghi012jkl345mno678pqr901stu234vwx",
      credentialHash: "0x789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
      blockchainTxHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: 3,
      studentName: "Your Name",
      studentAddress: account,
      credentialType: "Certificate",
      subject: "Data Science Bootcamp",
      issueDate: "2023-12-20",
      status: "verified",
      grade: "B+",
      description:
        "Intensive 12-week program covering machine learning, data analysis, statistical modeling, and big data technologies. Completed projects in Python, R, and SQL with real-world datasets.",
      issuer: "Data Institute",
      issuerAddress: "0x123abc456def789ghi012jkl345mno678pqr901st",
      credentialHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abc123def456",
      blockchainTxHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    },
  ])

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showCertificateViewer, setShowCertificateViewer] = useState(false)
  const { toast } = useToast()

  const handleViewCertificate = (credential: Certificate) => {
    setSelectedCertificate(credential)
    setShowCertificateViewer(true)
  }

  const handleDownload = (credential: Certificate) => {
    // Generate certificate data
    const certificateData = `
PAX BLOCKCHAIN CERTIFICATE
==========================

Certificate Details:
- Student: ${credential.studentName || "Student"}
- Credential: ${credential.credentialType}
- Subject: ${credential.subject}
- Grade: ${credential.grade || "N/A"}
- Issue Date: ${credential.issueDate}
- Status: ${credential.status}

Blockchain Information:
- Student Address: ${credential.studentAddress}
- Issuer: ${credential.issuer || "Unknown"}
- Issuer Address: ${credential.issuerAddress || "N/A"}
- Certificate Hash: ${credential.credentialHash}
- Transaction Hash: ${credential.blockchainTxHash || "Pending"}

Description:
${credential.description || "No additional description provided."}

This certificate is verified on the BNB Smart Chain blockchain.
Verify at: ${window.location.origin}/verify/${credential.credentialHash}

Generated on: ${new Date().toISOString()}
    `.trim()

    // Create downloadable file
    const element = document.createElement("a")
    const file = new Blob([certificateData], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${credential.credentialType.replace(/\s+/g, "_")}_${credential.subject.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Certificate Downloaded",
      description: `${credential.credentialType} certificate downloaded successfully`,
    })
  }

  const handleShare = (credential: Certificate) => {
    const shareUrl = `${window.location.origin}/verify/${credential.credentialHash}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Share Link Copied",
      description: "Verification link copied to clipboard",
    })
  }

  const handleVerify = (credential: Certificate) => {
    toast({
      title: "Verification Complete",
      description: "Credential authenticity confirmed on BNB Smart Chain blockchain",
    })
  }

  return (
    <section className="py-16 px-4">
      <StudentExplainerCursor />

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Student Dashboard</h3>
          <p className="text-gray-600">View and manage your blockchain-verified digital credentials</p>
        </div>

        <div data-tutorial="stats-section" className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credentials.length}</div>
              <p className="text-xs text-muted-foreground">Across all institutions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{credentials.filter((c) => c.status === "verified").length}</div>
              <p className="text-xs text-muted-foreground">Blockchain verified</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(credentials.map((c) => c.issuer)).size}</div>
              <p className="text-xs text-muted-foreground">Different issuers</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Times shared</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger data-tutorial="credentials-tab" value="credentials">
              My Credentials
            </TabsTrigger>
            <TabsTrigger value="verify">Verify Credential</TabsTrigger>
            <TabsTrigger data-tutorial="profile-tab" value="profile">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4">
            <div className="grid gap-6">
              {credentials.map((credential) => (
                <Card key={credential.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center space-x-2">
                          <Award className="h-5 w-5 text-blue-600" />
                          <span>{credential.credentialType}</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span>Subject: {credential.subject}</span>
                          <Badge variant={credential.status === "verified" ? "default" : "secondary"}>
                            {credential.status}
                          </Badge>
                          {credential.grade && <Badge variant="outline">Grade: {credential.grade}</Badge>}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{credential.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Issued by: </span>
                          <span>{credential.issuer}</span>
                        </div>
                        <div>
                          <span className="font-medium">Issue Date: </span>
                          <span>{credential.issueDate}</span>
                        </div>
                        <div>
                          <span className="font-medium">Issuer Address: </span>
                          <span className="font-mono text-xs">
                            {credential.issuerAddress?.slice(0, 10)}...{credential.issuerAddress?.slice(-6)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Certificate Hash: </span>
                          <span className="font-mono text-xs">{credential.credentialHash.slice(0, 20)}...</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4">
                        <Button
                          data-tutorial="view-certificate"
                          size="sm"
                          onClick={() => handleViewCertificate(credential)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Certificate
                        </Button>
                        <Button
                          data-tutorial="download-button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(credential)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          data-tutorial="share-button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(credential)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleVerify(credential)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://bscscan.com/tx/${credential.blockchainTxHash}`, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on Chain
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verify Credential</CardTitle>
                <CardDescription>Verify the authenticity of any credential using its blockchain hash</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Credential Verification</h3>
                  <p className="text-gray-600 mb-4">
                    Enter a credential hash to verify its authenticity on the blockchain
                  </p>
                  <div className="max-w-md mx-auto space-y-4">
                    <input
                      type="text"
                      placeholder="Enter certificate hash (0x...)"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <Button className="w-full">Verify on Blockchain</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Manage your profile and credential preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Wallet Address</label>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">{account}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Credentials</label>
                    <p className="text-sm text-gray-600">{credentials.length} blockchain-verified credentials</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-sm text-gray-600">January 2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Verification Status</label>
                    <p className="text-sm text-green-600 flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      All credentials blockchain verified
                    </p>
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
            viewerType="student"
          />
        )}
      </div>
    </section>
  )
}
