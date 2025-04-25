"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
          aria-label="Chat with Sergeant Ken"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        <ChatInterface />
      </DialogContent>
    </Dialog>
  )
}
