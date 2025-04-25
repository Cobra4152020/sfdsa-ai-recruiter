"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function ChatButtonSimple() {
  return (
    <Link href="/chat">
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        size="icon"
        aria-label="Chat with Sergeant Ken"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </Link>
  )
}
