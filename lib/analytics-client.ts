export class AnalyticsClient {
  private static instance: AnalyticsClient
  private baseUrl = "/api/analytics"

  static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient()
    }
    return AnalyticsClient.instance
  }

  private sanitizeData(data: any): any {
    if (data === null || data === undefined) return null
    if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") return data
    if (Array.isArray(data)) return data.map((item) => this.sanitizeData(item))
    if (typeof data === "object") {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip functions, symbols, and undefined values
        if (typeof value !== "function" && typeof value !== "symbol" && value !== undefined) {
          sanitized[key] = this.sanitizeData(value)
        }
      }
      return sanitized
    }
    return null
  }

  async trackEvent(eventType: string, eventData?: any, walletAddress?: string) {
    try {
      // Sanitize the event data to ensure it's JSON serializable
      const sanitizedEventData = this.sanitizeData(eventData || {})

      const payload = {
        event_type: eventType,
        event_data: {
          ...sanitizedEventData,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        },
        wallet_address: walletAddress || null,
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Analytics tracking failed:", response.status, response.statusText, errorText)
        return { success: false, error: `HTTP ${response.status}: ${errorText}` }
      }

      // Try to parse response, but don't fail if it's not JSON
      let result
      try {
        const responseText = await response.text()
        result = responseText ? JSON.parse(responseText) : { success: true }
      } catch (parseError) {
        // If response is not JSON but request was successful, assume success
        result = { success: true }
      }

      return result
    } catch (error) {
      console.error("Failed to track event:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async getAnalytics(days = 7) {
    try {
      const response = await fetch(`${this.baseUrl}?days=${days}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analytics")
      }

      return result.data
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      throw error
    }
  }

  // Convenience methods
  async trackPageView(page?: string) {
    return this.trackEvent("page_view", {
      page: page || (typeof window !== "undefined" ? window.location.pathname : "/"),
    })
  }

  async trackWalletConnection(walletType: string, address: string) {
    return this.trackEvent("wallet_connected", { walletType }, address)
  }

  async trackRoleSelection(role: string, walletAddress: string) {
    return this.trackEvent("role_selected", { role }, walletAddress)
  }

  async trackCredentialIssued(credentialType: string, walletAddress: string) {
    return this.trackEvent("credential_issued", { credentialType }, walletAddress)
  }

  async trackVerificationRequest(credentialHash: string, walletAddress?: string) {
    return this.trackEvent(
      "verification_requested",
      { credentialHash: credentialHash.slice(0, 10) + "..." },
      walletAddress,
    )
  }

  async trackAdminAccess(method: string, walletAddress?: string) {
    return this.trackEvent("admin_access", { method }, walletAddress)
  }
}

export const analyticsClient = AnalyticsClient.getInstance()
