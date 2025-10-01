"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Shield, CheckCircle, Calendar, Building2, Award, ExternalLink, Copy } from "lucide-react"

interface VerificationExplorerProps {
  onClose: () => void
}

// Mock blockchain data
const mockCredentials = [
  {
    id: "0x1a2b3c4d5e6f",
    title: "Bachelor of Computer Science",
    institution: "Tech University",
    issueDate: "2024-05-15",
    status: "verified",
    type: "degree",
    blockNumber: "18,234,567",
    transactionHash: "0x9f8e7d6c5b4a3928374650192837465019283746501928374650192837465019",
    description: "Bachelor's degree in Computer Science with honors",
  },
  {
    id: "0x2b3c4d5e6f7a",
    title: "Web Development Certificate",
    institution: "Code Academy",
    issueDate: "2024-03-20",
    status: "verified",
    type: "certificate",
    blockNumber: "18,156,789",
    transactionHash: "0x8e7d6c5b4a39283746501928374650192837465019283746501928374650192837",
    description: "Full-stack web development certification",
  },
]

export function VerificationExplorer({ onClose }: VerificationExplorerProps) {
  const [searchAddress, setSearchAddress] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchAddress.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // Mock search delay
    setTimeout(() => {
      // Mock results - in real app, this would query the blockchain
      if (searchAddress.toLowerCase().includes("0x") || searchAddress.length > 10) {
        setSearchResults(mockCredentials)
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-white" data-explainer="blockchain-explorer">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onClose} className="text-gray-600 hover:text-orange-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-black">Pax Verification</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-black">Pax Blockchain Explorer</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Enter a wallet address (Pax ID) to view all verified credentials for that person. All data is retrieved
              directly from the blockchain for maximum transparency.
            </p>
          </div>

          {/* Search Section */}
          <Card className="bg-white border shadow-lg">
            <CardHeader>
              <CardTitle className="text-black flex items-center">
                <Search className="w-5 h-5 mr-2 text-orange-600" />
                Credential Verification
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter a wallet address to verify credentials on the Pax blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-black">
                  Wallet Address (Pax ID)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="address"
                    placeholder="0x1234567890abcdef..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="flex-1 border-gray-300"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchAddress.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isSearching ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Search Examples */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Try:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchAddress("0x1234567890abcdef1234567890abcdef12345678")}
                  className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sample Address 1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchAddress("0x9876543210fedcba9876543210fedcba98765432")}
                  className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sample Address 2
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <Card className="bg-white border shadow-lg">
              <CardHeader>
                <CardTitle className="text-black">
                  Verification Results
                  {searchResults.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      {searchResults.length} credential{searchResults.length !== 1 ? "s" : ""} found
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} verified credential${searchResults.length !== 1 ? "s" : ""} for this address`
                    : "No credentials found for this address"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.length > 0 ? (
                  <div className="space-y-6">
                    {searchResults.map((credential) => (
                      <div
                        key={credential.id}
                        className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-xl text-black">{credential.title}</h3>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                              <Badge variant="outline" className="border-orange-500 text-orange-600">
                                {credential.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Building2 className="w-4 h-4 mr-1" />
                                {credential.institution}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(credential.issueDate).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4">{credential.description}</p>
                          </div>
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>

                        {/* Blockchain Details */}
                        <div className="border-t pt-4 space-y-3">
                          <h4 className="font-medium text-black">Blockchain Details</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Token ID:</span>
                              <div className="flex items-center space-x-2">
                                <code className="bg-white px-2 py-1 rounded border text-black font-mono">
                                  {credential.id}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(credential.id)}
                                  className="p-1 h-auto"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Block Number:</span>
                              <div className="flex items-center space-x-2">
                                <code className="bg-white px-2 py-1 rounded border text-black font-mono">
                                  {credential.blockNumber}
                                </code>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Transaction Hash:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="bg-white px-2 py-1 rounded border text-black font-mono text-xs break-all">
                                {credential.transactionHash}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(credential.transactionHash)}
                                className="p-1 h-auto"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">No Credentials Found</h3>
                    <p className="text-gray-600 mb-4">
                      This wallet address doesn't have any verified credentials on the Pax blockchain.
                    </p>
                    <p className="text-sm text-gray-500">Make sure the address is correct and try again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className="bg-white border shadow-lg">
            <CardHeader>
              <CardTitle className="text-black">How Verification Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-black mb-2">1. Enter Address</h3>
                  <p className="text-sm text-gray-600">Input the wallet address (Pax ID) you want to verify</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-black mb-2">2. Blockchain Query</h3>
                  <p className="text-sm text-gray-600">We query the Pax blockchain for all NFT credentials</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-black mb-2">3. Instant Results</h3>
                  <p className="text-sm text-gray-600">View all verified credentials with blockchain proof</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
