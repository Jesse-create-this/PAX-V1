"use server"

export async function generateAISummary(certificateData: {
  credentialType: string
  subject: string
  issueDate: string
  expiryDate?: string
  grade?: string
  issuer?: string
  documentType?: string
  description?: string
}) {
  try {
    // Mock AI Summary generation
    const issueDate = new Date(certificateData.issueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const summaryParts = []

    // Base summary about the credential
    if (certificateData.documentType === "license") {
      summaryParts.push(
        `This is a professional ${certificateData.credentialType.toLowerCase()} issued on ${issueDate}.`,
      )
    } else {
      summaryParts.push(
        `This ${certificateData.credentialType.toLowerCase()} in ${certificateData.subject} was issued on ${issueDate}.`,
      )
    }

    // Add performance/grade info if available
    if (certificateData.grade) {
      summaryParts.push(`The holder achieved a ${certificateData.grade}.`)
    }

    // Add expiry information
    if (certificateData.expiryDate) {
      const expiryDate = new Date(certificateData.expiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
      const today = new Date()
      const expiryDateTime = new Date(certificateData.expiryDate).getTime()
      const isExpired = expiryDateTime < today.getTime()

      if (isExpired) {
        summaryParts.push(`This credential expired on ${expiryDate} and is no longer valid.`)
      } else {
        summaryParts.push(`This credential is valid and expires on ${expiryDate}.`)
      }
    } else {
      summaryParts.push(`This credential has no expiration date and remains valid indefinitely.`)
    }

    // Add importance statement
    if (certificateData.documentType === "license") {
      summaryParts.push(
        `This ${certificateData.credentialType.toLowerCase()} demonstrates professional qualification and authorization in the specified field.`,
      )
    } else {
      summaryParts.push(
        `This credential verifies the holder's successful completion and achievement in ${certificateData.subject}.`,
      )
    }

    const summary = summaryParts.join(" ")
    return summary
  } catch (error) {
    console.error("[v0] Summary generation failed:", error)
    return null
  }
}
