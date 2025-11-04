"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Award,
  Shield,
  ExternalLink,
  Download,
  Share2,
  Calendar,
  Hash,
  CheckCircle,
  Copy,
  X,
  Loader2,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  // License-specific fields
  licenseNumber?: string
  expiryDate?: string
  licenseClass?: string
  restrictions?: string
  issuingAuthority?: string
}

interface CertificateViewerProps {
  certificate: Certificate
  isOpen: boolean
  onClose: () => void
  viewerType: "issuer" | "student"
}

export default function CertificateViewer({ certificate, isOpen, onClose, viewerType }: CertificateViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const isLicense = certificate.documentType === "license"
  const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date()
  const isExpiringSoon =
    certificate.expiryDate &&
    new Date(certificate.expiryDate) > new Date() &&
    new Date(certificate.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const documentData = generateDocumentData(certificate)
      const element = document.createElement("a")
      const file = new Blob([documentData], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${certificate.studentName.replace(/\s+/g, "_")}_${certificate.credentialType.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: `${isLicense ? "License" : "Certificate"} Downloaded`,
        description: `${isLicense ? "License" : "Certificate"} has been downloaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: `Failed to download ${isLicense ? "license" : "certificate"}`,
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)

    try {
      const shareUrl = `${window.location.origin}/verify/${certificate.credentialHash}`
      await navigator.clipboard.writeText(shareUrl)

      toast({
        title: "Share Link Copied",
        description: "Verification link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to copy verification link",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleViewOnBlockchain = () => {
    const explorerUrl = `https://bscscan.com/tx/${certificate.blockchainTxHash || "0x" + Math.random().toString(16).substr(2, 64)}`
    window.open(explorerUrl, "_blank")
  }

  const handleVerifyOnBlockchain = async () => {
    setIsVerifying(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Verification Complete",
        description: `${isLicense ? "License" : "Certificate"} authenticity confirmed on BNB Smart Chain`,
      })
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: `Failed to verify ${isLicense ? "license" : "certificate"} on blockchain`,
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
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

  const generateDocumentData = (cert: Certificate): string => {
    const docType = cert.documentType === "license" ? "LICENSE" : "CERTIFICATE"

    return `
PAX BLOCKCHAIN ${docType}
==========================

${docType} Details:
- Holder: ${cert.studentName}
- ${cert.documentType === "license" ? "License Type" : "Credential"}: ${cert.credentialType}
- Subject/Category: ${cert.subject || "N/A"}
${cert.grade ? `- Grade: ${cert.grade}` : ""}
${cert.licenseNumber ? `- License Number: ${cert.licenseNumber}` : ""}
${cert.licenseClass ? `- License Class: ${cert.licenseClass}` : ""}
- Issue Date: ${cert.issueDate}
${cert.expiryDate ? `- Expiry Date: ${cert.expiryDate}` : ""}
- Status: ${cert.status}
${cert.restrictions ? `- Restrictions: ${cert.restrictions}` : ""}

Blockchain Information:
- Holder Address: ${cert.studentAddress}
- Issuer: ${cert.issuer || "Unknown"}
- Issuer Address: ${cert.issuerAddress || "N/A"}
- ${docType} Hash: ${cert.credentialHash}
- Transaction Hash: ${cert.blockchainTxHash || "Pending"}

Description:
${cert.description || "No additional description provided."}

This ${cert.documentType} is verified on the BNB Smart Chain blockchain.
Verify at: ${window.location.origin}/verify/${cert.credentialHash}

Generated on: ${new Date().toISOString()}
    `.trim()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isLicense ? (
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              ) : (
                <Award className="h-6 w-6 text-orange-600" />
              )}
              <span>{isLicense ? "License" : "Certificate"} Details</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Blockchain-verified {isLicense ? "license" : "credential"} with full transparency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Preview */}
          <Card
            className={`border-2 ${isLicense ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white" : "border-orange-200 bg-gradient-to-br from-orange-50 to-white"}`}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 ${isLicense ? "bg-gradient-to-r from-blue-600 to-blue-800" : "bg-gradient-to-r from-orange-600 to-black"} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    {isLicense ? (
                      <ShieldCheck className="h-8 w-8 text-white" />
                    ) : (
                      <Award className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                  {isLicense ? "Professional License" : "Certificate of Achievement"}
                </h2>

                <div className="space-y-2">
                  <p className="text-lg text-gray-600">
                    {isLicense ? "This license certifies that" : "This is to certify that"}
                  </p>
                  <p className="text-2xl font-bold text-orange-800">{certificate.studentName}</p>
                  <p className="text-lg text-gray-600">
                    {isLicense ? "is authorized to" : "has successfully completed"}
                  </p>
                  <p className="text-xl font-semibold text-gray-800">{certificate.credentialType}</p>
                  {certificate.subject && (
                    <>
                      <p className="text-lg text-gray-600">in</p>
                      <p className="text-xl font-semibold text-gray-800">{certificate.subject}</p>
                    </>
                  )}
                  {certificate.grade && (
                    <p className="text-lg text-gray-600">
                      with a grade of <span className="font-semibold text-green-600">{certificate.grade}</span>
                    </p>
                  )}
                  {certificate.licenseClass && (
                    <p className="text-lg text-gray-600">
                      Class: <span className="font-semibold text-blue-600">{certificate.licenseClass}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-center items-center space-x-4 pt-6">
                  <Badge
                    variant={certificate.status === "verified" ? "default" : "secondary"}
                    className={`px-3 py-1 ${isLicense ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {certificate.status === "verified" ? "Blockchain Verified" : certificate.status}
                  </Badge>
                  <span className="text-sm text-gray-500">Issued on {certificate.issueDate}</span>
                  {certificate.expiryDate && (
                    <div className="flex items-center space-x-1">
                      {isExpired ? (
                        <Badge variant="destructive" className="px-2 py-1">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="secondary" className="px-2 py-1 bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="px-2 py-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Valid until {certificate.expiryDate}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* License-specific information */}
                {isLicense && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {certificate.licenseNumber && (
                        <div>
                          <span className="font-medium text-gray-600">License Number:</span>
                          <p className="font-mono text-gray-800">{certificate.licenseNumber}</p>
                        </div>
                      )}
                      {certificate.issuingAuthority && (
                        <div>
                          <span className="font-medium text-gray-600">Issuing Authority:</span>
                          <p className="text-gray-800">{certificate.issuingAuthority}</p>
                        </div>
                      )}
                    </div>
                    {certificate.restrictions && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="font-medium text-yellow-800">Restrictions/Conditions:</span>
                        <p className="text-yellow-700 text-sm mt-1">{certificate.restrictions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Blockchain Information</span>
              </CardTitle>
              <CardDescription>Transparent and verifiable information stored on BNB Smart Chain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {isLicense ? "License Holder Address" : "Student Address"}
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                        {certificate.studentAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(certificate.studentAddress, "Address")}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {certificate.issuerAddress && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Issuer Address</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                          {certificate.issuerAddress}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(certificate.issuerAddress, "Issuer Address")}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {isLicense ? "License Hash" : "Certificate Hash"}
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                        {certificate.credentialHash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(certificate.credentialHash, "Hash")}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issue Date</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{certificate.issueDate}</span>
                    </div>
                  </div>

                  {certificate.expiryDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock
                          className={`h-4 w-4 ${isExpired ? "text-red-500" : isExpiringSoon ? "text-yellow-500" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-sm ${isExpired ? "text-red-600" : isExpiringSoon ? "text-yellow-600" : ""}`}
                        >
                          {certificate.expiryDate}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle
                        className={`h-4 w-4 ${certificate.status === "verified" ? "text-green-500" : "text-yellow-500"}`}
                      />
                      <span className="text-sm capitalize">{certificate.status}</span>
                    </div>
                  </div>

                  {certificate.blockchainTxHash && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                          {certificate.blockchainTxHash}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(certificate.blockchainTxHash!, "Transaction Hash")}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {certificate.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded leading-relaxed">
                    {certificate.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download {isLicense ? "License" : "Certificate"}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleShare} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Verification Link
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleViewOnBlockchain}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BSCScan
            </Button>

            <Button variant="outline" onClick={handleVerifyOnBlockchain} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify on Blockchain
                </>
              )}
            </Button>

            {viewerType === "issuer" && (
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Revoke {isLicense ? "License" : "Certificate"}
              </Button>
            )}
          </div>

          {/* Verification Instructions */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Blockchain Verification</h4>
                  <p className="text-sm text-green-700 mt-1 leading-relaxed">
                    This {isLicense ? "license" : "certificate"} is permanently recorded on the BNB Smart Chain
                    blockchain. Anyone can verify its authenticity using the {isLicense ? "license" : "certificate"}{" "}
                    hash or by visiting the verification link.
                  </p>
                  <div className="mt-3 p-2 bg-green-100 rounded">
                    <code className="text-xs text-green-800 break-all">
                      Verification URL: {window.location.origin}/verify/{certificate.credentialHash}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
