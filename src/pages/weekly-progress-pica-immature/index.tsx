"use client"
import { Layout } from "@/components/custom/layout"
import { UserNav } from "@/components/user-nav"
import ThemeSwitch from "@/components/theme-switch"
import { useNavigate, useParams } from "react-router-dom"
import WeeklyDateList from "@/components/custom/weekly-data-list"
import { useEffect, useState } from "react"

export default function UpdateProgressWeekly() {
  const { vegetativeId, startDates, endDates, caNames, caValues, caBudgets } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [caDateRanges, setCaDateRanges] = useState<any[]>([])
  const [overallStartDate, setOverallStartDate] = useState<Date>(new Date())
  const [overallEndDate, setOverallEndDate] = useState<Date>(new Date())

  const decodeBase64 = (base64Str: string = ""): string => {
    try {
      // Handle URL-safe base64 (replace - with +, _ with /)
      const safeStr = base64Str.replace(/-/g, '+').replace(/_/g, '/')
      // Add padding if needed
      const paddedStr = safeStr + '='.repeat((4 - (safeStr.length % 4)) % 4)
      return atob(paddedStr)
    } catch (error) {
      console.error("Error decoding base64:", error)
      return ""
    }
  }

  const parseDateSafe = (dateStr: string): Date => {
    const date = new Date(dateStr.trim())
    return isNaN(date.getTime()) ? new Date() : date
  }

  useEffect(() => {
    if (!vegetativeId || !startDates || !endDates) {
      console.error("Missing required parameters")
      navigate('/404')
      return
    }

    try {
      // Decode all parameters
      const decodedStartDates = decodeBase64(startDates)
      const decodedEndDates = decodeBase64(endDates)
      const decodedCaNames = decodeBase64(caNames || "")
      const decodedCaValues = decodeBase64(caValues || "")
      const decodedCaBudgets = decodeBase64(caBudgets || "")

      console.log("Decoded params:", {
        decodedStartDates,
        decodedEndDates,
        decodedCaNames,
        decodedCaValues,
        decodedCaBudgets
      })

      // Split into arrays
      const startDateList = decodedStartDates.split(", ").filter(Boolean)
      const endDateList = decodedEndDates.split(", ").filter(Boolean)
      const caNameList = decodedCaNames.split(", ").filter(Boolean)
      const caValueList = decodedCaValues.split(", ").filter(Boolean)
      const caBudgetList = decodedCaBudgets.split(", ").filter(Boolean)

      // Create CA date ranges
      const ranges = startDateList.map((startDate, index) => ({
        startDate: parseDateSafe(startDate),
        endDate: parseDateSafe(endDateList[index] || startDate),
        caIndex: index,
        caName: caNameList[index] || `CA ${index + 1}`,
        value: caValueList[index] || '',
        budgetAvailable: caBudgetList[index] || 'Unknown'
      }))

      setCaDateRanges(ranges)

      // Calculate overall date range
      if (ranges.length > 0) {
        const startDates = ranges.map(d => d.startDate.getTime())
        const endDates = ranges.map(d => d.endDate.getTime())
        setOverallStartDate(new Date(Math.min(...startDates)))
        setOverallEndDate(new Date(Math.max(...endDates)))
      }

    } catch (error) {
      console.error("Error processing parameters:", error)
      navigate('/404')
    } finally {
      setIsLoading(false)
    }
  }, [vegetativeId, startDates, endDates, caNames, caValues, caBudgets, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <WeeklyDateList 
          id={vegetativeId} 
          startDate={overallStartDate} 
          endDate={overallEndDate} 
          caDateRanges={caDateRanges} 
        />
      </Layout.Body>
    </Layout>
  )
}