"use client"

import { useState, useEffect } from "react"
import { UserProvider } from "@/context/user-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { assignBadgeToUser } from "@/lib/badge-utils"

interface Badge {
  id: string
  badge_id: string
  id: string
  description: string
}

interface User {
  id: string
  id: string
  email: string
}

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedBadge, setSelectedBadge] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Fetch badges
    fetch("/api/badges")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBadges(data.badges)
        }
      })
      .catch((err) => console.error("Error fetching badges:", err))

    // Fetch users
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users)
        }
      })
      .catch((err) => console.error("Error fetching users:", err))
  }, [])

  const handleAssignBadge = async () => {
    if (!selectedUser || !selectedBadge) {
      setMessage("Please select a user and a badge")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const result = await assignBadgeToUser(selectedUser, selectedBadge)

      if (result.success) {
        setMessage("Badge assigned successfully!")
      } else {
        setMessage(`Error: ${result.message}`)
      }
    } catch (error) {
      setMessage("An error occurred while assigning the badge")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={() => {}} />
        <main className="flex-1 pt-32 pb-16 bg-[#F8F5EE] dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Badge Management</h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">Assign badges to users</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Assign Badge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select User</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Select Badge</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedBadge}
                        onChange={(e) => setSelectedBadge(e.target.value)}
                      >
                        <option value="">Select a badge</option>
                        {badges.map((badge) => (
                          <option key={badge.id} value={badge.badge_type}>
                            {badge.name} ({badge.badge_type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {message && (
                      <div
                        className={`p-2 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {message}
                      </div>
                    )}

                    <Button
                      onClick={handleAssignBadge}
                      disabled={isLoading || !selectedUser || !selectedBadge}
                      className="w-full"
                    >
                      {isLoading ? "Assigning..." : "Assign Badge"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <ImprovedFooter />
      </div>
    </UserProvider>
  )
}
