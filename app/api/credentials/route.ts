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
      // Return empty data when Supabase is not available
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")
    const type = searchParams.get("type") // 'student' or 'issuer'
    const hash = searchParams.get("hash") // for verification

    if (!walletAddress && !hash) {
      return NextResponse.json({ success: false, error: "wallet address or hash is required" }, { status: 400 })
    }

    if (hash) {
      // Verification request
      const credential = await DatabaseService.verifyCredential(hash)
      return NextResponse.json({
        success: true,
        data: credential,
      })
    }

    if (walletAddress) {
      let credentials
      if (type === "issuer") {
        credentials = await DatabaseService.getCredentialsByIssuer(walletAddress)
      } else {
        credentials = await DatabaseService.getCredentialsByStudent(walletAddress)
      }

      return NextResponse.json({
        success: true,
        data: credentials,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Credentials GET API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch credentials",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseAvailable || !DatabaseService) {
      // Return mock success when Supabase is not available
      return NextResponse.json({
        success: true,
        data: {
          id: "mock-credential-id",
          message: "Credential created successfully (demo mode)",
        },
      })
    }

    const body = await request.json()
    const { student_wallet, issuer_wallet, document_type, institution_name, student_name, issue_date, metadata } = body

    // Validate required fields
    if (!student_wallet || !issuer_wallet || !document_type || !institution_name || !student_name || !issue_date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate credential hash (in a real app, this would be more sophisticated)
    const credentialData = {
      student_wallet,
      issuer_wallet,
      document_type,
      institution_name,
      student_name,
      issue_date,
      timestamp: new Date().toISOString(),
    }

    const credential_hash = Buffer.from(JSON.stringify(credentialData)).toString("base64")

    const credential = await DatabaseService.createCredential({
      student_wallet,
      issuer_wallet,
      credential_hash,
      document_type,
      institution_name,
      student_name,
      issue_date,
      metadata: metadata || {},
    })

    return NextResponse.json({
      success: true,
      data: credential,
    })
  } catch (error) {
    console.error("Credentials POST API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create credential",
      },
      { status: 500 },
    )
  }
}
