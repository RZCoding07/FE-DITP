"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { TreePine, AlertTriangle, RefreshCw, Download, Share2, Settings, Maximize2, BarChart3, Calendar } from "lucide-react"
import { useDashboardDataEnhanced } from "@/hooks/use-dashboard-data"
import { DashboardFiltersEnhanced } from "./dashboard-filters"
import { SummaryCardsEnhanced } from "./summary-cards-enhanced"
import { MonitoringOverviewChart } from "./charts/monitoring-overview-chart"
import { JobPositionChartWithDialog } from "./charts/job-position-chart"
import { CorrectiveActionChart } from "./charts/corrective-action-chart"
import { PlantationAreaChart } from "./charts/plantation-area-chart"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorBoundary } from "./error-boundary"
import { MonevDetailTable } from "./MonevDetailTable"
import { format, subDays } from "date-fns"
import { id } from "date-fns/locale"
import type { DashboardFilters } from "@/types/api"
import type { DateRange } from "react-day-picker"
import { apiService } from "@/services/api-monev-2"
import { formatDate } from "@/lib/utils"

interface PlantationDashboardMasterpieceProps {
  title?: string
  description?: string
  initialFilters?: Partial<DashboardFilters>
  onFiltersChange?: (filters: DashboardFilters) => void
}
import MonevDashboard from "./track-monev"

export default function PlantationDashboardMasterpiece({
  title = "Dashboard Monitoring Perkebunan",
  description = "Sistem Monitoring dan Evaluasi Perkebunan Terpadu - Real Time Analytics",
  initialFilters = {},
  onFiltersChange,
}: PlantationDashboardMasterpieceProps) {
  console.log("Initializing Plantation Dashboard with initial filters:", initialFilters)




  // Initialize state with proper fallbacks
  const [filters, setFilters] = useState<DashboardFilters>(() => ({
    dari_tanggal: initialFilters.dari_tanggal ?? format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    sampai_tanggal: initialFilters.sampai_tanggal ?? format(new Date(), "yyyy-MM-dd"),
    regional: initialFilters.regional ?? "2",
    kode_unit: initialFilters.kode_unit ?? "",
    afdeling: initialFilters.afdeling ?? "",
    blok: initialFilters.blok ?? "",
  }))

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Sync with external filter changes
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters,
        dari_tanggal: initialFilters.dari_tanggal ?? prev.dari_tanggal,
        sampai_tanggal: initialFilters.sampai_tanggal ?? prev.sampai_tanggal
      }))

      if (initialFilters.dari_tanggal && initialFilters.sampai_tanggal) {
        setDateRange({
          from: new Date(initialFilters.dari_tanggal),
          to: new Date(initialFilters.sampai_tanggal)
        })
      }
    }
  }, [initialFilters])

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const {
    plantationData,
    monitoringData,
    correctiveActionData,
    jobPositionData,
    regionals,
    kebuns,
    afdelings,
    loading,
    error,
    refreshData,
    setFilters: setDataFilters,
  } = useDashboardDataEnhanced(filters)

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      const newFilters = {
        ...filters,
        dari_tanggal: format(range.from, "yyyy-MM-dd"),
        sampai_tanggal: format(range.to, "yyyy-MM-dd")
      }
      handleFiltersChange(newFilters)
    }
  }

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    console.log("Filters changed:", newFilters)
    setFilters(newFilters)
    setDataFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleRefresh = async () => {
    console.log("Refreshing data...")
    await refreshData()
    setLastUpdated(new Date())
  }

  const handleExport = () => {
    console.log("Exporting dashboard data...")
  }

  const handleShare = () => {
    console.log("Sharing dashboard...")
  }

  const [isLoading, setIsLoading] = useState(false)

  const [monevDetailData, setMonevDetailData] = useState<any[]>([])
  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 5000 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])


  const fetchMonevDetailData = async () => {
    if (!dateRange) return

    setIsLoading(true)
    try {
      const data = await apiService.getMonevDetailByBelumMonev({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
        region: filters.regional,
      })

      console.log("Fetched Monev Detail Data:", data)

      setMonevDetailData(data)


    } catch (error) {
      console.error("Error fetching Monev Detail Data:", error)
      setMonevDetailData([])

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonevDetailData()
  }, [dateRange])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
        <Alert className="bg-red-950 border-red-800 text-red-200 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Error loading dashboard data:</p>
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white ${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"}`}>
        <div className={`p-6 space-y-8 ${isFullscreen ? "h-full overflow-y-auto" : ""}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg">
                <TreePine className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-slate-400 text-lg">{description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    {loading ? "Updating..." : "Live Data"}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Last updated: {format(lastUpdated, "PPp", { locale: id })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Filters */}
          <DashboardFiltersEnhanced
            filters={filters}
            onFiltersChange={handleFiltersChange}
            regionals={regionals}
            kebuns={kebuns}
            afdelings={afdelings}
            loading={loading}
            onRefresh={handleRefresh}
          />

          {/* Date Range Picker for Monev Table */}

          {loading && (
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <div className="text-center">
                    <p className="text-xl font-semibold text-white mb-2">Loading Dashboard Data</p>
                    <p className="text-slate-400">Mengambil data terbaru dari server...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && (
            <>
              {/* Summary Cards */}
              <SummaryCardsEnhanced
                monitoringData={monitoringData}
                plantationData={plantationData}
                jobPositionData={jobPositionData}
                correctiveActionData={correctiveActionData}
              />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="xl:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MonitoringOverviewChart
                      data={monitoringData}
                      onDataPointClick={(data) => console.log("Monitoring clicked:", data)}
                    />

                  </div>
                </div>

                <JobPositionChartWithDialog
                  data={jobPositionData}
                />

                <CorrectiveActionChart
                  data={correctiveActionData}
                />

                <div className="xl:col-span-2">
                  <PlantationAreaChart
                    data={plantationData}
                    onDataPointClick={(data) => console.log("Plantation clicked:", data)}
                  />
                </div>
              </div>

              {/* Monev Detail Table */}
              <MonevDetailTable
                dateRange={dateRange}
                onRefresh={handleRefresh}
              />

              {/* Additional Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Monitoring Insights</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Total Kebun Aktif:</span>
                        <span className="text-white font-semibold">{monitoringData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Rata-rata Nilai:</span>
                        <span className="text-white font-semibold">
                          {monitoringData.length > 0
                            ? (
                              monitoringData.reduce((sum, item) => sum + item.rata_rata_nilai, 0) /
                              monitoringData.length
                            ).toFixed(2)
                            : "0"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TreePine className="h-6 w-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Plantation Stats</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-200">Total Plantation:</span>
                        <span className="text-white font-semibold">{plantationData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Largest Area:</span>
                        <span className="text-white font-semibold">
                          {plantationData.length > 0
                            ? Math.max(...plantationData.map((item) => item.luas_blok_tu)).toLocaleString("id-ID") +
                            " Ha"
                            : "0 Ha"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="h-6 w-6 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">System Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-200">Data Sources:</span>
                        <span className="text-white font-semibold">4 Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Last Sync:</span>
                        <span className="text-white font-semibold">{format(lastUpdated, "HH:mm", { locale: id })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}