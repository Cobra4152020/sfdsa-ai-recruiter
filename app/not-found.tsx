import Link from "next/link"
import { logger } from "@/lib/logger"

export default function NotFound() {
  // Log the 404 error
  logger.warn("404 Not Found", { path: typeof window !== "undefined" ? window.location.pathname : "server-side" })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link href="/" className="inline-block px-4 py-2 bg-[#0A3C1F] text-white rounded hover:bg-[#0A3C1F]/90">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
