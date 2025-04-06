"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/user-context"

export function UserProfile() {
  const { currentUser } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt={currentUser?.name} />
          <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem disabled>
          <div className="flex flex-col space-y-1 leading-none">
            <span>{currentUser?.name}</span>
            <span className="text-sm text-muted-foreground">{currentUser?.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}