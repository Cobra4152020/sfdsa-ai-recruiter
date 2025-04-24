"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Download, RefreshCw, Users, MessageSquare, FileCheck } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useUser } from "@/context/user-context"

// Mock data for demonstration
const mockAnalyticsData = {
  overview: {
    totalVisitors: 1245,
    newUsers: 328,
    chatInteractions: 876,
    applications: 42,
    conversionRate: 3.37,
  },
  dailyVisitors: [
    { date: "2023-06-01", count: 45 },
    { date: "2023-06-02", count: 52 },
    { date: "2023-06-03", count: 38 },
    { date: "2023-06-04", count: 41 },
    { date: "2023-06-05", count: 63 },
    { date: "2023-06-06", count: 57 },
    { date: "2023-06-07", count: 59 },
  ],
  topQuestions: [
    { question: "What are the requirements to become a deputy sheriff?", count: 87 },
    { question: "What is the starting salary?", count: 76 },
    { question: "How long is the training program?", count: 64 },
    { question: "Do I need a college degree?", count: 58 },
    { question: "What benefits do deputies receive?", count: 52 },
  ],
  conversionFunnel: [
    { stage: "Website Visit", count: 1245 },
    { stage: "Chat Interaction", count: 876 },
    { stage: "Sign Up", count: 328 },
    { stage: "Application Started", count: 98 },
    { stage: "Application Completed", count: 42 },
  ],
}

interface AnalyticsDashboardProps {
  adminView?: boolean
}

export function AnalyticsDashboard({ adminView = false }: AnalyticsDashboardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData)
  const { isLoggedIn, currentUser } = useUser()

  // Check if user is admin
  const isAdmin = isLoggedIn && currentUser?.isAdmin

  // If not admin and adminView is required, show access denied
  if (adminView && !isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You do not have permission to view this dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please contact an administrator if you believe you should have access.</p>
        </CardContent>
      </Card>
    )
  }

  const refreshData = () => {
    setIsLoading(true)

    // In a real implementation, this would fetch data from an API
    setTimeout(() => {
      // Simulate data refresh with slight variations
      setAnalyticsData({
        ...analyticsData,
        overview: {
          ...analyticsData.overview,
          totalVisitors: analyticsData.overview.totalVisitors + Math.floor(Math.random() * 10),
          newUsers: analyticsData.overview.newUsers + Math.floor(Math.random() * 5),
        },
      })
      setIsLoading(false)
    }, 1000)
  }

  const exportData = () => {
    // In a real implementation, this would generate a CSV or Excel file
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `analytics-export-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Track user engagement and recruitment metrics</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} align="end" className="w-full sm:w-auto" />
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading} aria-label="Refresh data">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={exportData} aria-label="Export data">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-2xl font-bold">{analyticsData.overview.totalVisitors}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Chat Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-2xl font-bold">{analyticsData.overview.chatInteractions}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-2xl font-bold">{analyticsData.overview.applications}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-2xl font-bold">{analyticsData.overview.newUsers}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="text-sm">
                      {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Daily Visitors</CardTitle>
                <CardDescription>Number of visitors per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
                <div className="mt-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Date</th>
                        <th className="text-right">Visitors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.dailyVisitors.map((day) => (
                        <tr key={day.date}>
                          <td className="text-left">{day.date}</td>
                          <td className="text-right">{day.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Top Questions</CardTitle>
                <CardDescription>Most frequently asked questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topQuestions.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.question}</p>
                      </div>
                      <div className="ml-4">
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from visit to application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Funnel visualization would go here</p>
                </div>
                <div className="mt-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Stage</th>
                        <th className="text-right">Count</th>
                        <th className="text-right">Conversion %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.conversionFunnel.map((stage, index) => (
                        <tr key={index}>
                          <td className="text-left">{stage.stage}</td>
                          <td className="text-right">{stage.count}</td>
                          <td className="text-right">
                            {index === 0
                              ? "100%"
                              : `${((stage.count / analyticsData.conversionFunnel[0].count) * 100).toFixed(1)}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
