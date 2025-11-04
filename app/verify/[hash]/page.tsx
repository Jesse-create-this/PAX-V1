"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import VerifyPage from "../page"

export default function VerifyHashPage() {
  const params = useParams()
  const hash = params?.hash as string

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (hash) {
      // Pre-fill the hash in the verification form
      const input = document.querySelector('input[placeholder*="certificate hash"]') as HTMLInputElement
      if (input) {
        input.value = hash as string
      }
      setIsReady(true)
    }
  }, [hash])

  return <VerifyPage />
}
