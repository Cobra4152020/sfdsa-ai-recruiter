"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Download, Search, ZoomIn, ZoomOut } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PDFViewerProps {
  pdfUrl: string
  title?: string
  description?: string
}

export function PDFViewer({ pdfUrl, title, description }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [pdfText, setPdfText] = useState<string>("")

  useEffect(() => {
    // Fetch PDF metadata to get page count
    const fetchMetadata = async () => {
      try {
        setIsLoading(true)
        const filename = pdfUrl.split("/").pop()

        if (!filename) {
          console.error("Invalid PDF URL")
          return
        }

        const response = await fetch(`/api/pdf/metadata?filename=${encodeURIComponent(filename)}`)
        const data = await response.json()

        if (data.success && data.metadata) {
          setPageCount(data.metadata.pageCount || 1)
        } else {
          setPageCount(1)
        }

        // Also fetch the text content for search functionality
        const contentResponse = await fetch(`/api/pdf/content?filename=${encodeURIComponent(filename)}`)
        const contentData = await contentResponse.json()

        if (contentData.success && contentData.content) {
          setPdfText(contentData.content)
        }
      } catch (error) {
        console.error("Error fetching PDF metadata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [pdfUrl])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 25, 50))
  }

  const handleSearch = () => {
    if (!searchTerm.trim() || !pdfText) return

    // Simple search implementation
    const searchTermLower = searchTerm.toLowerCase()
    const textLower = pdfText.toLowerCase()

    if (textLower.includes(searchTermLower)) {
      // Highlight would be implemented in a real viewer
      alert(`Found "${searchTerm}" in the document!`)
    } else {
      alert(`"${searchTerm}" not found in the document.`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title || "PDF Viewer"}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div
              className="border rounded-lg overflow-hidden bg-white"
              style={{
                width: `${zoomLevel}%`,
                maxWidth: "100%",
                height: "500px",
                position: "relative",
              }}
            >
              <iframe src={`${pdfUrl}#page=${currentPage}`} className="w-full h-full" title={title || "PDF Document"} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage <= 1 || isLoading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {pageCount}
        </div>
        <Button variant="outline" onClick={handleNextPage} disabled={currentPage >= pageCount || isLoading}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
