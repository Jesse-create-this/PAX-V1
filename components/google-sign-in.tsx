"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Image from "next/image"

let useSession: any = () => ({ data: null, status: "unauthenticated" })
let signIn: any = async () => {}
let signOut: any = async () => {}

try {
  const nextAuth = require("next-auth/react")
  useSession = nextAuth.useSession
  signIn = nextAuth.signIn
  signOut = nextAuth.signOut
} catch (e) {
  console.warn("[v0] NextAuth not available in preview")
}

interface GoogleSignInProps {
  onSignInChange?: (signedIn: boolean, email?: string) => void
}

export default function GoogleSignIn({ onSignInChange }: GoogleSignInProps) {
  const { data: session, status } = useSession()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && onSignInChange) {
      onSignInChange(!!session?.user, session?.user?.email)
    }
  }, [session, isMounted, onSignInChange])

  if (!isMounted) {
    return null
  }

  if (status === "loading") {
    return (
      <Button size="sm" variant="outline" disabled className="text-xs hidden sm:inline-flex px-3 py-2 bg-transparent">
        Loading...
      </Button>
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
          {session.user.image && (
            <Image
              src={session.user.image || "/placeholder.svg"}
              alt={session.user.name || "User"}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span className="text-xs font-medium text-gray-700 hidden sm:inline max-w-[100px] truncate">
            {session.user.name}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => signOut()}
          className="text-xs px-2 py-1"
          title="Sign out from Google"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="text-xs hidden sm:inline-flex bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 font-medium"
    >
      Sign in with Google
    </Button>
  )
}
