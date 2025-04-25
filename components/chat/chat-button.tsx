"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { ChatInterface } from "./chat-interface"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  // Inline styles for the dialog
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    display: isOpen ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  }

  const dialogStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    overflow: "hidden",
  }

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "50%",
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        size="icon"
        aria-label="Chat with Sergeant Ken"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Custom dialog implementation with inline styles */}
      <div style={overlayStyle} onClick={() => setIsOpen(false)}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <button style={closeButtonStyle} onClick={() => setIsOpen(false)} aria-label="Close dialog">
            <X size={24} />
          </button>
          <ChatInterface />
        </div>
      </div>
    </>
  )
}
