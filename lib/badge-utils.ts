/**
 * Assigns a badge to a user
 * @param userId The ID of the user
 * @param badgeType The type of badge to assign
 * @returns A promise that resolves to the result of the operation
 */
export async function assignBadgeToUser(userId: string, badgeType: string) {
    try {
      const response = await fetch("/api/badges/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, badgeType }),
      })
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error assigning badge:", error)
      throw error
    }
  }
  
  /**
   * Automatically assigns badges to a user based on their activity
   * @param userId The ID of the user
   * @param participationCount The user's participation count
   * @param hasApplied Whether the user has applied
   * @returns A promise that resolves when all badges have been assigned
   */
  export async function assignAutomaticBadges(userId: string, participationCount: number, hasApplied: boolean) {
    const badgesToAssign = []
  
    // Chat participation badge
    if (participationCount > 0) {
      badgesToAssign.push("chat-participation")
    }
  
    // Frequent user badge
    if (participationCount >= 10) {
      badgesToAssign.push("frequent-user")
    }
  
    // Application started badge
    if (hasApplied) {
      badgesToAssign.push("application-started")
    }
  
    // Assign all badges
    const results = await Promise.allSettled(badgesToAssign.map((badgeType) => assignBadgeToUser(userId, badgeType)))
  
    // Log any errors
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Failed to assign badge ${badgesToAssign[index]}:`, result.reason)
      }
    })
  
    return results
  }
  