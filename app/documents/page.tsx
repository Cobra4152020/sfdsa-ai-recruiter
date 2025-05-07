"use client"

import { useState, useEffect } from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PDFViewer } from "@/components/pdf-viewer"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [documents, setDocuments] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/pdf/list")
        const data = await response.json()

        if (data.success) {
          setDocuments(data.pdfs || [])
        } else {
          console.error("Failed to fetch documents:", data.message)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Format document name for display
  const formatDocumentName = (fileid: string) => {
    return filename
      .replace(".pdf", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={() => setIsOptInFormOpen(true)} />

        <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link href="/" prefetch={false}>
                <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                Resource Documents
              </h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
                Access important documents related to the San Francisco Sheriff's Office, including benefits
                information, employee handbooks, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Documents</CardTitle>
                    <CardDescription>Select a document to view</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3C1F]"></div>
                      </div>
                    ) : documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <Button
                            key={doc}
                            variant={selectedDocument === doc ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {formatDocumentName(doc)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#0A3C1F]/60 dark:text-white/60">No documents found</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {selectedDocument ? (
                  <PDFViewer
                    pdfUrl={`/documents/${selectedDocument}`}
                    title={formatDocumentName(selectedDocument)}
                    description="View and search through the document"
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>PDF Viewer</CardTitle>
                      <CardDescription>Select a document from the list to view it</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-12 text-center">
                        <FileText className="h-16 w-16 text-[#0A3C1F]/30 dark:text-white/30 mb-4" />
                        <p className="text-[#0A3C1F]/60 dark:text-white/60">
                          Select a document from the list on the left to view it here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <ImprovedFooter />
      </div>
    </UserProvider>
  )
}
