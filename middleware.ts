import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  // Get the user's session using the request cookie
  const authCookie = request.cookies.get("sb-auth-token")?.value

  if (!authCookie) {
    // No auth cookie, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify the session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(authCookie)

    if (error || !user) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (userError || !userData?.is_admin) {
      // User is not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }

    // User is authenticated and is an admin, allow access
    return NextResponse.next()
  } catch (err) {
    console.error("Error in auth middleware:", err)
    // On error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
}
