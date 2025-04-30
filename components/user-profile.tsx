"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/user-context"
import { LogOut, LayoutDashboard, Award } from "lucide-react"

export function UserProfile() {
  const { currentUser } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  const navigateTo = (path: string) => {
    window.location.href = path
  }

  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!currentUser?.name) return "U"
    return currentUser.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="bg-[#FFD700] text-[#0A3C1F] border-2 border-white">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        align="end"
        forceMount
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1 leading-none">
            <span>{currentUser?.name}</span>
            <span className="text-sm text-muted-foreground">{currentUser?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigateTo("/dashboard")} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigateTo("/awards")} className="cursor-pointer">
          <Award className="mr-2 h-4 w-4" />
          <span>Top Recruit Awards</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
