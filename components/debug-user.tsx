"use client"

import { useUser } from "@/context/user-context"
import { useState } from "react"

export function DebugUser() {
  const { currentUser, isLoggedIn, isInitialized } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-md text-xs z-50"
      >
        Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg z-50 max-w-md text-xs">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">User Debug</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500">
          Close
        </button>
      </div>
      <div>
        <p>Initialized: {isInitialized ? "Yes" : "No"}</p>
        <p>Logged In: {isLoggedIn ? "Yes" : "No"}</p>
        <p>User: {currentUser ? "Found" : "Not Found"}</p>
        {currentUser && (
          <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        )}
        <div className="mt-2 space-y-2">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser")
              window.location.reload()
            }}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Clear User Data
          </button>
          <button
            onClick={() => {
              console.log("Current localStorage:", localStorage.getItem("currentUser"))
              console.log("User context:", currentUser)
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs ml-2"
          >
            Log User Data
          </button>
        </div>
      </div>
    </div>
  )
}
