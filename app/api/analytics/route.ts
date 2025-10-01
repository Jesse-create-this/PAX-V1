import { type NextRequest, NextResponse } from "next/server"

// Check if Supabase is available
const isSupabaseAvailable = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Only import DatabaseService if Supabase is available
let DatabaseService: any = null
if (isSupabaseAvailable) {
  try {
    const supabaseModule = await import("@/lib/supabase")
    DatabaseService = supabaseModule.DatabaseService
  } catch (error) {
    console.error("Failed to import DatabaseService:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseAvailable || !DatabaseService) {
      // Return mock data when Supabase is not available
      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalUsers: 0,
            totalCredentials: 0,
            totalEvents: 0,
            recentAnalytics: null,
          },
          dailyAnalytics: [],
        },
      })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const summary = await DatabaseService.getAnalyticsSummary()
    const dailyAnalytics = await DatabaseService.getDailyAnalytics(days)

    return NextResponse.json({
      success: true,
      data: {
        summary,
        dailyAnalytics,
      },
    })
  } catch (error) {
    console.error("Analytics GET API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseAvailable || !DatabaseService) {
      // Return success when Supabase is not available (skip tracking)
      return NextResponse.json({ success: true })
    }

    let body
    try {
      const requestText = await request.text()
      if (!requestText) {
        return NextResponse.json({ success: false, error: "Empty request body" }, { status: 400 })
      }
      body = JSON.parse(requestText)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ success: false, error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { event_type, event_data, wallet_address } = body

    if (!event_type || typeof event_type !== "string") {
      return NextResponse.json(
        { success: false, error: "event_type is required and must be a string" },
        { status: 400 },
      )
    }

    // Validate and sanitize event_data
    let sanitizedEventData = {}
    if (event_data) {
      try {
        // Ensure it's JSON serializable by doing a round-trip
        const jsonString = JSON.stringify(event_data)
        sanitizedEventData = JSON.parse(jsonString)
      } catch (serializeError) {
        console.error("Failed to serialize event_data:", serializeError)
        sanitizedEventData = { error: "Failed to serialize event data" }
      }
    }

    const userAgent = request.headers.get("user-agent") || undefined
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || undefined

    try {
      await DatabaseService.trackEvent({
        event_type,
        event_data: sanitizedEventData,
        wallet_address: wallet_address || null,
        user_agent: userAgent,
        ip_address: ip,
        url: request.headers.get("referer") || undefined,
      })
    } catch (dbError) {
      console.error("Database error while tracking event:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: dbError instanceof Error ? dbError.message : "Database error",
        },
        { status: 500 },
      )
    }

    // Update daily analytics for page views
    if (event_type === "page_view") {
      try {
        await DatabaseService.updateDailyAnalytics()
      } catch (analyticsError) {
        console.error("Failed to update daily analytics:", analyticsError)
        // Don't fail the request if daily analytics update fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics POST API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to track event",
      },
      { status: 500 },
    )
  }
}
