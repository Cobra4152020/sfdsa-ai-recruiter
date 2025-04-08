"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { FileText, RefreshCw, Check, AlertTriangle } from "lucide-react"

export default function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Fetch the list of PDF documents
  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setMessage(null)

      const response = await fetch("/api/update-knowledge-base")
      const data = await response.json()

      if (data.success) {
        setDocuments(data.documents || [])
        setMessage({ text: data.message, type: "success" })
      } else {
        setMessage({ text: data.message || "Failed to update knowledge base", type: "error" })
      }
    } catch (error) {
      console.error("Error updating knowledge base:", error)
      setMessage({ text: "An error occurred while updating the knowledge base", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={() => {}} />

        <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
              Document Management
            </h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl mb-8">
              Manage PDF documents and update the knowledge base with their content.
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Update Knowledge Base</CardTitle>
                <CardDescription>
                  Scan the public/documents directory for PDF files and update the knowledge base.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {message && (
                  <div
                    className={`p-4 mb-4 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center">
                      {message.type === "success" ? (
                        <Check className="h-5 w-5 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 mr-2" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[#0A3C1F]/70 dark:text-white/70">
                    Click the button below to scan the public/documents directory for PDF files and update the knowledge
                    base with their content.
                  </p>

                  <Button
                    onClick={fetchDocuments}
                    disabled={isLoading}
                    className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Update Knowledge Base
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Documents</CardTitle>
                <CardDescription>PDF documents found in the public/documents directory.</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E0D6B8] dark:border-[#333333]"
                      >
                        <FileText className="h-8 w-8 text-[#0A3C1F] dark:text-[#FFD700] mr-3" />
                        <div>
                          <h3 className="font-medium text-[#0A3C1F] dark:text-white">
                            {doc
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </h3>
                          <p className="text-sm text-[#0A3C1F]/60 dark:text-white/60">{doc}.pdf</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#0A3C1F]/60 dark:text-white/60">
                    {isLoading ? (
                      <p>Scanning for documents...</p>
                    ) : (
                      <p>No documents found. Place PDF files in the public/documents directory.</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-[#0A3C1F]/60 dark:text-white/60">
                  Documents should be placed in the public/documents directory with descriptive filenames.
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>

        <ImprovedFooter />
      </div>
    </UserProvider>
  )
}
