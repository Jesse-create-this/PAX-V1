// Analytics service for tracking user interactions and system metrics

export class AnalyticsService {
  private static instance: AnalyticsService
  private baseUrl = "/api/analytics"

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Track user actions
  async trackEvent(action: string, data?: any) {
    try {
      await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  // Get analytics data
  async getAnalytics(timeRange = "7d", type = "overview") {
    try {
      const response = await fetch(`${this.baseUrl}?timeRange=${timeRange}&type=${type}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      throw error
    }
  }

  // Track wallet connections
  trackWalletConnection(walletType: string, address: string) {
    this.trackEvent("wallet_connected", {
      walletType,
      address: address.slice(0, 10) + "...", // Privacy-safe
    })
  }

  // Track credential issuance
  trackCredentialIssued(credentialType: string, documentType: string) {
    this.trackEvent("credential_issued", {
      credentialType,
      documentType,
    })
  }

  // Track verification requests
  trackVerificationRequest(credentialHash: string) {
    this.trackEvent("verification_requested", {
      credentialHash: credentialHash.slice(0, 10) + "...", // Privacy-safe
    })
  }

  // Track downloads
  trackDownload(documentType: string, format: string) {
    this.trackEvent("document_downloaded", {
      documentType,
      format,
    })
  }

  // Track admin access
  trackAdminAccess(method: string) {
    this.trackEvent("admin_access", {
      method,
    })
  }
}

export const analytics = AnalyticsService.getInstance()
