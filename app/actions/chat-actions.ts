"use server";

import { getServiceSupabase } from "@/lib/supabase-client";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function saveUserOptIn(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || null;

    if (!name || !email) {
      return { success: false, message: "Name and email are required" };
    }

    const supabase = getServiceSupabase();

    const { data: existingUser, error: checkError } = await supabase
      .from("chat_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      logger.error(`Error checking for existing user: ${checkError.message}`);
      throw new Error(`Error checking for existing user: ${checkError.message}`);
    }

    if (existingUser) {
      const { error: updateError } = await supabase
        .from("chat_users")
        .update({
          name,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id);

      if (updateError) {
        logger.error(`Error updating user: ${updateError.message}`);
        throw new Error(`Error updating user: ${updateError.message}`);
      }

      revalidatePath("/");
      return { success: true, message: "Information updated successfully", userId: existingUser.id };
    }

    const { data: newUser, error: insertError } = await supabase
      .from("chat_users")
      .insert({
        name,
        email,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      logger.error(`Error inserting new user: ${insertError.message}`);
      throw new Error(`Error inserting new user: ${insertError.message}`);
    }

    revalidatePath("/");
    return { success: true, message: "Information saved successfully", userId: newUser.id };
  } catch (error: any) {
    logger.error(`Error saving user opt-in: ${error.message}`);
    return { success: false, message: `Failed to save your information: ${error.message}` };
  }
}

export async function saveChatMessage(userId: string, message: string) {
  try {
    if (!userId || !message) {
      return { success: false, message: "User ID and message are required" };
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      logger.error(`Error saving chat message: ${error.message}`);
      throw new Error(`Error saving chat message: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    logger.error(`Error in saveChatMessage: ${error.message}`);
    return { success: false, message: `Failed to save message: ${error.message}` };
  }
}
