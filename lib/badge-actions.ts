"use server"

import { getServiceSupabase } from "./supabase-client"

export type TestType = "written" | "oral" | "physical" | "polygraph" | "psychological"

export async function awardTestCompletionBadge(userId: string, testType: TestType) {
  try {
    const supabase = getServiceSupabase()

    // Call the database function to award the badge
    const { data, error } = await supabase.rpc("award_test_completion_badge", {
      p_user_id: userId,
      p_test_type: testType,
    })

    if (error) {
      console.error(`Error awarding ${testType} badge:`, error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in awardTestCompletionBadge:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function awardResourceDownloaderBadge(userId: string) {
  try {
    const supabase = getServiceSupabase()

    // Call the database function to award the badge
    const { data, error } = await supabase.rpc("award_resource_downloader_badge", {
      p_user_id: userId,
    })

    if (error) {
      console.error(`Error awarding resource downloader badge:`, error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in awardResourceDownloaderBadge:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function awardApplicationCompletedBadge(userId: string) {
  try {
    const supabase = getServiceSupabase()

    // Insert the badge directly
    const { error } = await supabase
      .from("badges")
      .insert({
        user_id: userId,
        badge_type: "application-completed",
      })
      .onConflict(["user_id", "badge_type"])
      .ignore()

    if (error) {
      console.error(`Error awarding application completed badge:`, error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in awardApplicationCompletedBadge:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}