"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle, AlertCircle } from "lucide-react"

interface VerificationPortalProps {
  onLoginClick: () => void
}

export default function VerificationPortal({ onLoginClick }: VerificationPortalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock certificate data
  const mockCertificates: Record<string, any> = {
    PAX001: {
      holderName: "John Doe",
      paxId: "PAX001",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      certificateType: "Bachelor of Science",
      institution: "Federal University of Technology, Akure",
      issueDate: "2024-01-15",
      expiryDate: null,
      status: "valid",
    },
    PAX002: {
      holderName: "Jane Smith",
      paxId: "PAX002",
      walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      certificateType: "Professional License - Software Engineer",
      institution: "Professional Development Board",
      issueDate: "2023-06-20",
      expiryDate: "2026-06-20",
      status: "valid",
    },
  }

  const handleSearch = () => {
    setIsLoading(true)
    setHasSearched(true)

    setTimeout(() => {
      const result = mockCertificates[searchQuery.toUpperCase()]
      if (result) {
        setSearchResult(result)
      } else {
        setSearchResult(null)
      }
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Verify Your Certificate
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Search for and verify the authenticity of any Pax credential using your Pax ID or wallet address
        </p>

        {/* Search Section */}
        <Card className="border-2 border-orange-500 shadow-lg">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-900">Certificate Verification</CardTitle>
            <CardDescription>
              Enter your Pax ID or wallet address to verify your certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter Pax ID (e.g., PAX001) or Wallet Address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-gray-300"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!searchQuery || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Results */}
              {hasSearched && (
                <div className="mt-8">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="text-gray-600 mt-2">Searching...</p>
                    </div>
                  ) : searchResult ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-900">Certificate Found & Valid</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Holder Name</label>
                          <p className="font-semibold text-black">{searchResult.holderName}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Pax ID</label>
                          <p className="font-semibold text-black">{searchResult.paxId}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Certificate Type</label>
                          <p className="font-semibold text-black">{searchResult.certificateType}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Institution</label>
                          <p className="font-semibold text-black">{searchResult.institution}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Issue Date</label>
                          <p className="font-semibold text-black">{searchResult.issueDate}</p>
                        </div>
                        {searchResult.expiryDate && (
                          <div>
                            <label className="text-sm text-gray-600">Expiry Date</label>
                            <p className="font-semibold text-black">{searchResult.expiryDate}</p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-600">Wallet Address</label>
                          <p className="font-mono text-sm text-black break-all">{searchResult.walletAddress}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-green-200">
                        <p className="text-sm text-gray-600 mb-3">This certificate has been verified on the blockchain and is authentic.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-900">Certificate Not Found</h3>
                      </div>
                      <p className="text-red-800">
                        No certificate found for "{searchQuery}". Please check your Pax ID or wallet address and try again.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-orange-600">For Students</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm space-y-2">
            <p>
              Verify your certificates issued by your institution. Use your Pax ID to quickly find and authenticate your credentials.
            </p>
            <Button
              onClick={onLoginClick}
              variant="outline"
              className="w-full mt-4 border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              Get Your Certificate
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-black">For Employers</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm space-y-2">
            <p>
              Employers can input the certificate ID above to verify the authenticity of candidate credentials instantly.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Use the search bar at the top to enter a Pax ID or certificate hash to verify credentials.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
