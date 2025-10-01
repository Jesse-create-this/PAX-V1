"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2, X, Award, Calendar, Building, User, Hash } from "lucide-react"
import type { Credential } from "@/lib/supabase"

interface CertificateViewerProps {
  credential: Credential
  onClose: () => void
}

export function CertificateViewer({ credential, onClose }: CertificateViewerProps) {
  const downloadCredential = () => {
    const data = {
      credentialHash: credential.credential_hash,
      studentName: credential.student_name,
      documentType: credential.document_type,
      institutionName: credential.institution_name,
      issueDate: credential.issue_date,
      status: credential.status,
      metadata: credential.metadata,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${credential.document_type}_${credential.student_name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareCredential = async () => {
    const shareData = {
      title: `${credential.document_type} - ${credential.student_name}`,
      text: `Credential issued by ${credential.institution_name}`,
      url: `${window.location.origin}/verify?hash=${credential.credential_hash}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert("Verification link copied to clipboard!")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Certificate Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{credential.document_type}</h2>
                <p className="text-lg text-gray-700">Awarded to</p>
                <p className="text-xl font-semibold text-blue-600 mb-4">{credential.student_name}</p>
                <p className="text-gray-600">by</p>
                <p className="text-lg font-medium text-gray-800">{credential.institution_name}</p>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(credential.issue_date).toLocaleDateString()}</span>
                </div>
                <Badge
                  variant={credential.status === "issued" ? "default" : "secondary"}
                  className={
                    credential.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : credential.status === "revoked"
                        ? "bg-red-100 text-red-800"
                        : ""
                  }
                >
                  {credential.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Student:</span>
                <span>{credential.student_name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Institution:</span>
                <span>{credential.institution_name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Issue Date:</span>
                <span>{new Date(credential.issue_date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-sm">
                <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium">Hash:</span>
                  <p className="font-mono text-xs text-gray-600 break-all mt-1">{credential.credential_hash}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {credential.metadata && Object.keys(credential.metadata).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(credential.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={downloadCredential}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={shareCredential}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
