import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a safe client that handles missing environment variables
let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
} else {
  // Create a mock client for build time when env vars are missing
  console.warn("Supabase environment variables not found. Using mock client.")
  supabase = {
    from: () => ({
      select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      order: () => Promise.resolve({ data: [], error: null }),
      limit: () => Promise.resolve({ data: [], error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
    }),
  }
}

// Database types
export interface User {
  id: string
  wallet_address: string
  user_type: "student" | "issuer" | "admin"
  name?: string
  email?: string
  institution_name?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
}

export interface Credential {
  id: string
  student_wallet: string
  issuer_wallet: string
  credential_hash: string
  document_type: string
  institution_name: string
  student_name: string
  issue_date: string
  metadata: any
  status: "issued" | "verified" | "revoked"
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  event_data: any
  wallet_address?: string
  user_agent?: string
  ip_address?: string
  url?: string
  created_at: string
}

export interface DailyAnalytics {
  id: string
  date: string
  total_visitors: number
  new_users: number
  credentials_issued: number
  verifications: number
  wallet_connections: number
  page_views: number
  unique_visitors: number
  created_at: string
}

export class DatabaseService {
  private static checkSupabaseAvailable(): boolean {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }

  // User operations
  static async createOrUpdateUser(
    walletAddress: string,
    userType: "student" | "issuer" = "student",
    additionalData?: Partial<User>,
  ) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning mock data")
      return {
        id: "mock-id",
        wallet_address: walletAddress.toLowerCase(),
        user_type: userType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        ...additionalData,
      }
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            wallet_address: walletAddress.toLowerCase(),
            user_type: userType,
            last_login: new Date().toISOString(),
            is_active: true,
            ...additionalData,
          },
          {
            onConflict: "wallet_address",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("Supabase error in createOrUpdateUser:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error creating/updating user:", error)
      throw error
    }
  }

  static async getUserByWallet(walletAddress: string) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning null")
      return null
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Supabase error in getUserByWallet:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error getting user:", error)
      throw error
    }
  }

  // Credential operations
  static async createCredential(credentialData: {
    student_wallet: string
    issuer_wallet: string
    credential_hash: string
    document_type: string
    institution_name: string
    student_name: string
    issue_date: string
    metadata?: any
  }) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning mock credential")
      return {
        id: "mock-credential-id",
        ...credentialData,
        status: "issued",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    try {
      const { data, error } = await supabase
        .from("credentials")
        .insert({
          ...credentialData,
          student_wallet: credentialData.student_wallet.toLowerCase(),
          issuer_wallet: credentialData.issuer_wallet.toLowerCase(),
          status: "issued",
          metadata: credentialData.metadata || {},
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase error in createCredential:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error creating credential:", error)
      throw error
    }
  }

  static async getCredentialsByStudent(walletAddress: string) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning empty array")
      return []
    }

    try {
      const { data, error } = await supabase
        .from("credentials")
        .select("*")
        .eq("student_wallet", walletAddress.toLowerCase())
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error in getCredentialsByStudent:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data || []
    } catch (error) {
      console.error("Error getting student credentials:", error)
      throw error
    }
  }

  static async getCredentialsByIssuer(walletAddress: string) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning empty array")
      return []
    }

    try {
      const { data, error } = await supabase
        .from("credentials")
        .select("*")
        .eq("issuer_wallet", walletAddress.toLowerCase())
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error in getCredentialsByIssuer:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data || []
    } catch (error) {
      console.error("Error getting issuer credentials:", error)
      throw error
    }
  }

  static async verifyCredential(credentialHash: string) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning null")
      return null
    }

    try {
      const { data, error } = await supabase
        .from("credentials")
        .select("*")
        .eq("credential_hash", credentialHash)
        .single()

      if (error) {
        console.error("Supabase error in verifyCredential:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error verifying credential:", error)
      throw error
    }
  }

  // Analytics operations
  static async trackEvent(eventData: {
    event_type: string
    event_data?: any
    wallet_address?: string
    user_agent?: string
    ip_address?: string
    url?: string
  }) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, skipping event tracking")
      return null
    }

    try {
      // Ensure event_data is properly serializable
      let sanitizedEventData = {}
      if (eventData.event_data) {
        try {
          // Test serialization
          const testJson = JSON.stringify(eventData.event_data)
          sanitizedEventData = JSON.parse(testJson)
        } catch (serializeError) {
          console.warn("Failed to serialize event_data, using empty object:", serializeError)
          sanitizedEventData = { serialization_error: "Failed to serialize original data" }
        }
      }

      const insertData = {
        event_type: eventData.event_type,
        event_data: sanitizedEventData,
        wallet_address: eventData.wallet_address || null,
        user_agent: eventData.user_agent || null,
        ip_address: eventData.ip_address || null,
        url: eventData.url || null,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("analytics_events").insert(insertData).select()

      if (error) {
        console.error("Supabase error in trackEvent:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error tracking event:", error)
      throw error
    }
  }

  static async getAnalyticsSummary() {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning mock analytics")
      return {
        totalUsers: 0,
        totalCredentials: 0,
        totalEvents: 0,
        recentAnalytics: null,
      }
    }

    try {
      // Get counts with proper error handling
      const usersPromise = supabase.from("users").select("id", { count: "exact", head: true })
      const credentialsPromise = supabase.from("credentials").select("id", { count: "exact", head: true })
      const eventsPromise = supabase.from("analytics_events").select("id", { count: "exact", head: true })

      const [usersResult, credentialsResult, eventsResult] = await Promise.all([
        usersPromise,
        credentialsPromise,
        eventsPromise,
      ])

      // Check for errors
      if (usersResult.error) {
        console.error("Error getting users count:", usersResult.error)
      }
      if (credentialsResult.error) {
        console.error("Error getting credentials count:", credentialsResult.error)
      }
      if (eventsResult.error) {
        console.error("Error getting events count:", eventsResult.error)
      }

      // Get recent daily analytics
      const { data: recentAnalytics, error: analyticsError } = await supabase
        .from("daily_analytics")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (analyticsError) {
        console.error("Error getting recent analytics:", analyticsError)
      }

      return {
        totalUsers: usersResult.count || 0,
        totalCredentials: credentialsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        recentAnalytics: recentAnalytics || null,
      }
    } catch (error) {
      console.error("Error getting analytics summary:", error)
      throw error
    }
  }

  static async getDailyAnalytics(days = 7) {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, returning empty analytics")
      return []
    }

    try {
      const { data, error } = await supabase
        .from("daily_analytics")
        .select("*")
        .order("date", { ascending: false })
        .limit(days)

      if (error) {
        console.error("Supabase error in getDailyAnalytics:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data || []
    } catch (error) {
      console.error("Error getting daily analytics:", error)
      throw error
    }
  }

  static async updateDailyAnalytics() {
    if (!this.checkSupabaseAvailable()) {
      console.warn("Supabase not available, skipping daily analytics update")
      return null
    }

    try {
      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("daily_analytics")
        .upsert(
          {
            date: today,
            page_views: 1,
            unique_visitors: 1,
            total_visitors: 1,
            new_users: 0,
            credentials_issued: 0,
            verifications: 0,
            wallet_connections: 0,
          },
          {
            onConflict: "date",
          },
        )
        .select()

      if (error) {
        console.error("Supabase error in updateDailyAnalytics:", error)
        throw new Error(`Database error: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error("Error updating daily analytics:", error)
      throw error
    }
  }
}
