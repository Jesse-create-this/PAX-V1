"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Copy,
  ExternalLink,
  Award,
  Calendar,
  Hash,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ExplainerCursor } from "@/components/explainer-cursor"
import { generateAISummary } from "@/app/actions/generate-summary"

interface Certificate {
  id: number
  studentName: string
  studentAddress: string
  paxId: string
  credentialType: string
  subject: string
  issueDate: string
  status: "verified" | "pending" | "revoked" | "not_found"
  grade?: string
  description?: string
  issuer?: string
  issuerAddress?: string
  credentialHash: string
  blockchainTxHash?: string
  expiryDate?: string
  verificationTimestamp?: string
  issuanceTimestamp?: string
  aiSummary?: string
}

interface SearchResult {
  found: boolean
  paxId: string
  studentName: string
  studentAddress: string
  totalCertificates: number
  certificates: Certificate[]
}

export default function VerifyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [loadingSummaries, setLoadingSummaries] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const mockHolders: Record<string, SearchResult> = {
    PAX001: {
      found: true,
      paxId: "PAX001",
      studentName: "John Doe",
      studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
      totalCertificates: 3,
      certificates: [
        {
          id: 1,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
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
          issuanceTimestamp: "2024-01-15T10:30:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
        {
          id: 2,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
          credentialType: "Professional License",
          subject: "Software Engineering",
          issueDate: "2024-01-10",
          status: "verified",
          grade: "A",
          description:
            "Successfully completed comprehensive blockchain development course covering smart contracts, DeFi protocols, dApp development, and Web3 integration.",
          issuer: "Engineering Board",
          issuerAddress: "0x456def789ghi012jkl345mno678pqr901stu234vwx",
          credentialHash: "0x789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
          blockchainTxHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          expiryDate: "2027-01-10",
          issuanceTimestamp: "2024-01-10T14:20:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
        {
          id: 3,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
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
          issuanceTimestamp: "2023-12-20T09:15:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
      ],
    },
    "0x1234567890abcdef1234567890abcdef12345678": {
      found: true,
      paxId: "PAX001",
      studentName: "John Doe",
      studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
      totalCertificates: 3,
      certificates: [
        {
          id: 1,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
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
          issuanceTimestamp: "2024-01-15T10:30:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
        {
          id: 2,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
          credentialType: "Professional License",
          subject: "Software Engineering",
          issueDate: "2024-01-10",
          status: "verified",
          grade: "A",
          description:
            "Successfully completed comprehensive blockchain development course covering smart contracts, DeFi protocols, dApp development, and Web3 integration.",
          issuer: "Engineering Board",
          issuerAddress: "0x456def789ghi012jkl345mno678pqr901stu234vwx",
          credentialHash: "0x789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
          blockchainTxHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          expiryDate: "2027-01-10",
          issuanceTimestamp: "2024-01-10T14:20:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
        {
          id: 3,
          studentName: "John Doe",
          studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
          paxId: "PAX001",
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
          issuanceTimestamp: "2023-12-20T09:15:00Z",
          verificationTimestamp: new Date().toISOString(),
        },
      ],
    },
  }

  const handleGenerateSummary = async (certificateId: number, certificate: Certificate) => {
    if (certificate.aiSummary) return

    setLoadingSummaries((prev) => new Set([...prev, certificateId]))

    try {
      const summary = await generateAISummary({
        credentialType: certificate.credentialType,
        subject: certificate.subject,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        grade: certificate.grade,
        issuer: certificate.issuer,
        documentType: certificate.expiryDate ? "license" : "credential",
        description: certificate.description,
      })

      if (summary && searchResults) {
        const updatedResults = { ...searchResults }
        const certIndex = updatedResults.certificates.findIndex((c) => c.id === certificateId)
        if (certIndex >= 0) {
          updatedResults.certificates[certIndex].aiSummary = summary
          setSearchResults(updatedResults)
        }
      }
    } catch (error) {
      console.error("Failed to generate summary:", error)
      toast({
        title: "Summary Generation Failed",
        description: "Could not generate AI summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingSummaries((prev) => {
        const next = new Set(prev)
        next.delete(certificateId)
        return next
      })
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a Pax ID or wallet address to search",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    // Simulate blockchain query delay
    setTimeout(() => {
      const result = mockHolders[searchQuery] || null

      if (result && result.found) {
        setSearchResults(result)
        toast({
          title: "Certificates Found!",
          description: `Found ${result.totalCertificates} certificate(s) for this holder`,
        })
      } else {
        setSearchResults({
          found: false,
          paxId: "",
          studentName: "",
          studentAddress: "",
          totalCertificates: 0,
          certificates: [],
        })
        toast({
          title: "No Certificates Found",
          description: "No certificates found for this Pax ID or wallet address",
          variant: "destructive",
        })
      }

      setIsSearching(false)
    }, 1500)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: `${label} Copied`,
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: `Failed to copy ${label.toLowerCase()}`,
        variant: "destructive",
      })
    }
  }

  const explainerSteps = [
    {
      id: "search-box",
      title: "Enter Your Details",
      description: "Type your Pax ID (like PAX001) or wallet address to find all your certificates",
      elementSelector: "#search-input",
      position: "bottom" as const,
    },
    {
      id: "search-button",
      title: "Search for Certificates",
      description: "Click the search button to retrieve all verified certificates linked to your account",
      elementSelector: "#search-button",
      position: "bottom" as const,
    },
  ]

  return (
    <>
      <ExplainerCursor steps={explainerSteps} autoStart={!hasSearched} />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0">
                <Image src="/logo.png" alt="Pax Logo" fill className="object-contain" priority />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-black">Pax Verification</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Certificate Authenticity Check</p>
              </div>
            </div>
            <a href="/" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Back to Home
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Search Section */}
            <Card className="border-2 border-orange-200 shadow-lg mb-8">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span>Verify Your Certificates</span>
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Enter your Pax ID or wallet address to view all your certificates
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="search" className="text-sm font-medium text-black">
                      Pax ID or Wallet Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., PAX001 or 0x1234567890..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500"
                      />
                      <Button
                        id="search-button"
                        type="submit"
                        disabled={isSearching}
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                      >
                        {isSearching ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">
                    Try: <span className="font-semibold text-orange-600">PAX001</span> or{" "}
                    <span className="font-semibold text-orange-600">0x1234567890abcdef1234567890abcdef12345678</span>
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            {hasSearched && searchResults && (
              <>
                {searchResults.found && searchResults.certificates.length > 0 && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Success Banner */}
                    <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between space-x-4">
                          <div className="flex items-center space-x-4">
                            <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-green-900">{searchResults.studentName}</h3>
                              <p className="text-sm text-green-700 mt-1">
                                {searchResults.totalCertificates} verified certificate
                                {searchResults.totalCertificates !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-orange-600 text-white px-3 py-1 text-base">
                              {searchResults.paxId}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Holder Info Card */}
                    <Card className="border-2 border-black/10">
                      <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="text-black">Holder Information</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">Pax ID</label>
                            <div className="flex items-center space-x-2">
                              <p className="text-lg font-semibold text-black bg-orange-50 px-3 py-2 rounded">
                                {searchResults.paxId}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(searchResults.paxId, "Pax ID")}
                                className="h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">Wallet Address</label>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-2 rounded font-mono flex-1 truncate text-black">
                                {searchResults.studentAddress}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(searchResults.studentAddress, "Wallet Address")}
                                className="h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certificates Grid */}
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-6">All Certificates</h3>
                      <div className="space-y-6">
                        {searchResults.certificates.map((cert, idx) => (
                          <Card
                            key={cert.id}
                            className="border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all"
                          >
                            <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-orange-500 rounded-full p-2">
                                    <Award className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-white">{cert.credentialType}</CardTitle>
                                    <CardDescription className="text-gray-300">{cert.subject}</CardDescription>
                                  </div>
                                </div>
                                <Badge className="bg-orange-500 text-white">{cert.status}</Badge>
                              </div>
                            </CardHeader>

                            <CardContent className="p-6">
                              <div className="space-y-6">
                                {/* Main Information */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Issuing Institution</label>
                                    <p className="text-base font-semibold text-black mt-1">{cert.issuer}</p>
                                  </div>
                                  {cert.grade && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Grade/Performance</label>
                                      <Badge className="mt-1 bg-orange-100 text-orange-800 text-base px-3 py-1">
                                        {cert.grade}
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                {/* Dates */}
                                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>Issue Date</span>
                                    </label>
                                    <p className="text-sm text-black font-mono mt-1">
                                      {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {cert.expiryDate && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Expiry Date</span>
                                      </label>
                                      <p className="text-sm text-black font-mono mt-1">
                                        {new Date(cert.expiryDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="pt-4 border-t">
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                      <Sparkles className="h-4 w-4 text-orange-500" />
                                      <span>AI Summary</span>
                                    </label>
                                    {!cert.aiSummary && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleGenerateSummary(cert.id, cert)}
                                        disabled={loadingSummaries.has(cert.id)}
                                        className="border-orange-200 hover:border-orange-500 text-orange-600 hover:text-orange-700"
                                      >
                                        {loadingSummaries.has(cert.id) ? (
                                          <>
                                            <span className="animate-spin mr-2">⟳</span>
                                            Generating...
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Generate
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                  {cert.aiSummary ? (
                                    <p className="text-sm text-gray-700 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200 leading-relaxed">
                                      {cert.aiSummary}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">
                                      Click "Generate" to create an AI-powered summary of this certificate.
                                    </p>
                                  )}
                                </div>

                                {/* Blockchain Details */}
                                <div className="pt-4 border-t space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                                      <Hash className="h-4 w-4" />
                                      <span>Certificate Hash</span>
                                    </label>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <code className="text-xs bg-gray-100 px-2 py-2 rounded font-mono flex-1 truncate break-all text-black">
                                        {cert.credentialHash}
                                      </code>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(cert.credentialHash, "Hash")}
                                        className="h-8 w-8 p-0 flex-shrink-0"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  {cert.blockchainTxHash && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                                        <Hash className="h-4 w-4" />
                                        <span>Transaction Hash</span>
                                      </label>
                                      <div className="flex items-center space-x-2 mt-2">
                                        <code className="text-xs bg-gray-100 px-2 py-2 rounded font-mono flex-1 truncate break-all text-black">
                                          {cert.blockchainTxHash}
                                        </code>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            window.open(`https://bscscan.com/tx/${cert.blockchainTxHash}`, "_blank")
                                          }
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            copyToClipboard(cert.blockchainTxHash || "", "Transaction Hash")
                                          }
                                          className="h-8 w-8 p-0"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!searchResults.found && (
                  <Card className="border-2 border-red-300 bg-red-50">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <AlertTriangle className="h-16 w-16 text-red-600" />
                        <div>
                          <h3 className="text-2xl font-bold text-red-900 mb-2">No Certificates Found</h3>
                          <p className="text-red-800 mb-2">
                            No certificates found for the Pax ID or wallet address you provided.
                          </p>
                          <p className="text-sm text-red-700">
                            Please check and try again, or contact the issuing institution.
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSearchQuery("")
                            setHasSearched(false)
                            setSearchResults(null)
                          }}
                          className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Search Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!hasSearched && (
              <Card className="border-2 border-black/10 bg-gradient-to-br from-gray-50 to-orange-50">
                <CardContent className="p-12 text-center">
                  <div className="bg-orange-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">Verify Your Certificates</h3>
                  <p className="text-gray-700 max-w-md mx-auto mb-6 leading-relaxed">
                    Enter your Pax ID or wallet address to view and verify all your blockchain-backed certificates.
                  </p>
                  <div className="max-w-md mx-auto space-y-2 text-left text-sm text-gray-700">
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>View all your certificates instantly</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>No wallet connection needed</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Blockchain-verified authenticity</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-white py-8 px-4 mt-16">
          <div className="container mx-auto text-center text-sm text-gray-400">
            <p>Pax Credential Verification System | Powered by BNB Smart Chain</p>
            <p className="mt-2">
              <a href="/" className="text-orange-500 hover:text-orange-600 transition-colors">
                Back to Home
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
