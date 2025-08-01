"use client"

import { useMemo } from "react"
import { useState, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import IntegratedSummaryStats from "./integrated-summary-stats"
import cookie from "js-cookie"

interface PlantationDashboardMasterpieceProps {
  title?: string
  description?: string
  initialFilters?: Partial<DashboardFilters>
  onFiltersChange?: (filters: DashboardFilters) => void
}
import MonevDashboard from "./track-monev"
import TBMContractStatusChart from "./custom/kontrak"
import ParameterAnalysisChart from "./monev-pi"

export default function PlantationDashboardMasterpiece({
  title = "Dashboard Monitoring Perkebunan",
  description = "Sistem Monitoring dan Evaluasi Perkebunan Terpadu - Real Time Analytics",
  initialFilters = {},
  onFiltersChange,
}: PlantationDashboardMasterpieceProps) {
  console.log("Initializing Plantation Dashboard with initial filters:", initialFilters)

  const user = cookie.get('user')
  const app_type = user ? JSON.parse(user).app_type : ''
  const account_type = user ? JSON.parse(user).account_type : ''
  const rpc = user ? JSON.parse(user).rpc : ''

  // Initialize state with proper fallbacks
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    // If RPC is available in cookies, use it as the default regional filter
    const defaultRegional = rpc !== '' ? rpc : initialFilters.regional ?? ""
    
    return {
      dari_tanggal: initialFilters.dari_tanggal ?? format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      sampai_tanggal: initialFilters.sampai_tanggal ?? format(new Date(), "yyyy-MM-dd"),
      regional: defaultRegional,
      kode_unit: initialFilters.kode_unit ?? "",
      afdeling: initialFilters.afdeling ?? "",
      blok: initialFilters.blok ?? "",
    }
  })

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

  console.log("Dashboard data loaded:", {
    plantationData,
    monitoringData,
    correctiveActionData,
    jobPositionData,
    regionals,
    kebuns,
    afdelings,
  })

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

  const [monevBlokTUData, setMonevBlokTUData] = useState<any[]>([])

  const fetchMonev = async () => {
    if (!dateRange) return

    setIsLoading(true)
    try {
      const data = await apiService.getMonevDetailBlokTU({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
        region: filters.regional,
      })

      console.log("Fetched Monev Blok TU Data:", data)
      setMonevBlokTUData(data)
    } catch (error) {
      console.error("Error fetching Monev Detail Data:", error)
      setMonevBlokTUData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonev()
  }, [dateRange])

  const [monevDataPalmco, setMonevDataPalmco] = useState<any[]>([])

  const fetchMonevDataPalmco = async () => {
    if (!dateRange) return

    setIsLoading(true)
    try {
      const data = await apiService.getPalmcoData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23"
      })

      console.log("Fetched Monev Data Palmco:", data)
      setMonevDataPalmco(data)
    } catch (error) {
      console.error("Error fetching Monev Data Palmco:", error)
      setMonevDataPalmco([])
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMonevDataPalmco()
  }, [dateRange])

  const [monevPiData, setMonevPiData] = useState<any[]>([])

  const fetchMonevPiData = async () => {
    if (!dateRange) return

    setIsLoading(true)
    try {
      const data = await apiService.getMonevPiData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
        region: filters.regional,
        kode_unit: filters.kode_unit,
        afdeling: filters.afdeling
      })

      console.log("Fetched Monev PI Data:", data)
      setMonevPiData(data)
    } catch (error) {
      console.error("Error fetching Monev PI Data:", error)
      setMonevPiData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonevPiData()
  }, [dateRange, filters.regional, filters.kode_unit, filters.afdeling])

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <Alert className="bg-destructive/10 border-destructive text-destructive-foreground max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Error loading dashboard data:</p>
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2 border-destructive text-destructive-foreground hover:bg-destructive hover:text-white"
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

  const chartData = useMemo(() => {
    // Apply filters
    const filteredData = monevBlokTUData.filter((item) => {
      const regionalMatch = !filters.regional || item.regional === filters.regional
      const kodeUnitMatch = !filters.kode_unit || item.kode_unit === filters.kode_unit
      const afdelingMatch = !filters.afdeling || item.afdeling === filters.afdeling

      return regionalMatch && kodeUnitMatch && afdelingMatch
    })

    // Determine aggregation level based on filters
    let displayLevel = ""

    if (filters.afdeling) {
      displayLevel = "blok" // Show individual bloks when afdeling is selected
    } else if (filters.kode_unit) {
      displayLevel = "afdeling" // Show afdelings when unit is selected
    } else if (filters.regional) {
      displayLevel = "unit" // Show units when regional is selected
    } else {
      displayLevel = "regional" // Show regionals when no filter
    }

    // Group data based on determined level
    const grouped = filteredData.reduce((acc, item) => {
      let key = ""

      if (displayLevel === "regional") {
        key = item.regional
      } else if (displayLevel === "unit") {
        key = `${item.regional}-${item.kode_unit}`
      } else if (displayLevel === "afdeling") {
        key = `${item.regional}-${item.kode_unit}-${item.afdeling}`
      } else if (displayLevel === "blok") {
        key = `${item.regional}-${item.kode_unit}-${item.afdeling}-${item.blok}`
      }

      if (!acc[key]) {
        acc[key] = {
          regional: item.regional,
          kode_unit: displayLevel === "regional" ? "" : item.kode_unit, // Clear unit for regional level
          afdeling: displayLevel === "regional" || displayLevel === "unit" ? null : item.afdeling, // Clear afdeling for regional/unit level
          blok: displayLevel === "blok" ? item.blok : "",
          nama_unit: item.nama_unit,
          total_blok: 0,
          blok_sudah_monev: 0,
          blok_belum_monev: 0,
          items: [],
          displayLevel: displayLevel,
        }
      }

      // Tambah total blok
      acc[key].total_blok += 1
      acc[key].items.push(item)

      // Hitung berdasarkan status monev per blok
      if (item.status_monev === "Sudah") {
        acc[key].blok_sudah_monev += 1
      } else {
        acc[key].blok_belum_monev += 1
      }

      return acc
    }, {} as any)

    // Convert to array and calculate percentages
    return Object.values(grouped)
      .map((group: any) => {
        const total = group.total_blok
        const sudah = group.blok_sudah_monev
        const belum = group.blok_belum_monev

        // Determine display label based on level
        let displayLabel = ""
        let sortKey = ""

        if (group.displayLevel === "regional") {
          displayLabel = `Regional ${group.regional}`
          sortKey = group.regional
        } else if (group.displayLevel === "unit") {
          displayLabel = group.nama_unit
          sortKey = group.nama_unit
        } else if (group.displayLevel === "afdeling") {
          displayLabel = group.afdeling
          sortKey = group.afdeling
        } else if (group.displayLevel === "blok") {
          displayLabel = group.blok
          sortKey = group.blok
        }

        return {
          regional: group.regional,
          kode_unit: group.kode_unit,
          afdeling: group.afdeling, // This will be null for unit-level data
          blok: group.blok,
          nama_unit: group.nama_unit,
          sudah: sudah,
          belum: belum,
          total: total,
          percentage_sudah: total > 0 ? (sudah / total) * 100 : 0,
          percentage_belum: total > 0 ? (belum / total) * 100 : 0,
          items: group.items,
          displayLabel: displayLabel,
          sortKey: sortKey,
          displayLevel: group.displayLevel,
        }
      })
      .sort((a, b) => {
        // Sort by the appropriate key
        if (a.displayLevel === "regional") {
          return Number.parseInt(a.regional) - Number.parseInt(b.regional)
        }
        return a.sortKey.localeCompare(b.sortKey)
      })
  }, [monevBlokTUData, filters.regional, filters.kode_unit, filters.afdeling])

  return (
    <ErrorBoundary>
      <div className={`${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"}`}>
        <div className={`p-6 space-y-8 ${isFullscreen ? "h-full overflow-y-auto" : ""}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg">
                <TreePine className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-muted-foreground text-lg">{description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="border-green-600 text-green-600 dark:text-green-400">
                    {loading ? "Updating..." : "Live Data"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
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
                className="border-border text-foreground hover:bg-accent"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">
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

          {loading && (
            <Card className="bg-background border">
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <div className="text-center">
                    <p className="text-xl font-semibold text-foreground mb-2">Loading Dashboard Data</p>
                    <p className="text-muted-foreground">Mengambil data terbaru dari server...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && (
            <>
              {/* Summary Cards */}
              <SummaryCardsEnhanced
                regionals={filters.regional}
                monitoringData={monitoringData}
                plantationData={plantationData}
                jobPositionData={jobPositionData}
                correctiveActionData={correctiveActionData}
              />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="xl:col-span-2">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="w-full h-full rounded-lg">
                      <div className=" bg-white dark:bg-gradient-to-br from-slate-900 to-slate-800  rounded-lg p-4 h-full border shadow-lg">
                        <div className="flex justify-between items-center mb-4"></div>
                        <IntegratedSummaryStats 
                          filteredData={chartData}
                          data={monevBlokTUData}
                          personnelData={monevDetailData}
                          regional={filters.regional}
                          kode_unit={filters.kode_unit}
                        />
                      </div>
                    </div>
                    <MonevDashboard
                      data={monevBlokTUData}
                      personnelData={monevDetailData}
                      regional={filters.regional}
                      kode_unit={filters.kode_unit}
                      afdeling={filters.afdeling}
                    />

                    <TBMContractStatusChart
                      data={monevBlokTUData}
                      personnelData={monevDetailData}
                      regional={filters.regional}
                      kode_unit={filters.kode_unit}
                      afdeling={filters.afdeling}
                    />

                    <MonitoringOverviewChart
                      data={monitoringData}
                      region={filters.regional}
                      kode_unit={filters.kode_unit}
                      onDataPointClick={(data) => console.log("Monitoring clicked:", data)}
                    />
                  </div>
                </div>

                <Card className="bg-white dark:bg-gradient-to-br from-slate-900 to-slate-800  border">
                  <CardHeader>
                    <CardTitle className="text-center font-bold text-lg">Top 10 Problem Identification per Parameter</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ParameterAnalysisChart
                      data={monevPiData}
                    />
                  </CardContent>  
                </Card>

                {/* Corrective Action Chart */}
                <CorrectiveActionChart
                  data={correctiveActionData}
                  start_date={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
                  end_date={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
                  region={filters.regional}
                />

                <div className="xl:col-span-2">
                  <JobPositionChartWithDialog
                    regional={filters.regional}
                    kode_unit={filters.kode_unit}
                    afdeling={filters.afdeling}
                    data={jobPositionData}
                  />
                </div>
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
                region={filters.regional}
                kode_unit={filters.kode_unit}
                afdeling={filters.afdeling}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}