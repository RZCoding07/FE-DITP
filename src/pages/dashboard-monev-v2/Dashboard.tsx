"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, Share2, RefreshCw, Filter, Eye, TrendingUp, TrendingDown, Activity, MapPin, BarChart3, PieChart, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DatePickerWithRange } from "@/components/DatePickermonev"
import { RegionalChart } from "@/components/charts-m/RegionalChart"
import { PerformanceChart } from "@/components/charts-m/PerformanceChart"
import { CorrectiveActionChart } from "@/components/charts-m/CorrectiveActionChart"
import { AreaBlockChart } from "@/components/charts-m/AreaBlockChart"
import { apiService } from "@/services/api-monev-2"
import { formatNumber, formatPercentage, formatDate } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { MonevDetailTable } from "@/components/MonevDetailTable"
import type { RegionalData, CARegionalData } from "@/services/api-monev-2"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import ThemeSwitch from "@/components/theme-switch"
import { TopNav } from "@/components/top-nav"

const topNav = [
  {
    title: "Nursery",
    href: "/dashboard-nursery",
    isActive: false,
  },
  {
    title: "Replanting (TU/TK/TB)",
    href: "/dashboard-replanting",
    isActive: false,
  },
  {
    title: "Immature",
    href: "/dashboard-immature",
    isActive: false,
  },
  {
    title: "Monica",
    href: "/dashboard-monica",
    isActive: false,
  },
  {
    title: "Monev TU (Inspire-KKMV)",
    href: "/dashboard-inspire",
    isActive: false,
  },
  {
    title: "Dashboard Monev TU",
    href: "/dashboard-monev",
    isActive: true,
  },
]

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 4, 24), // May 24, 2024
    to: new Date(2025, 5, 23), // June 23, 2025
  })
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // State for regional data
  const [regionalData, setRegionalData] = useState<RegionalData[]>([])
  const [regionalLoading, setRegionalLoading] = useState(false)
  const [regionalError, setRegionalError] = useState<string | null>(null)

  // State for CA data
  const [caData, setCaData] = useState<CARegionalData[]>([])
  const [caLoading, setCaLoading] = useState(false)
  const [caError, setCaError] = useState<string | null>(null)

  // Fetch regional data
  const fetchRegionalData = async () => {
    if (!dateRange) return

    setRegionalLoading(true)
    setRegionalError(null)
    try {
      const data = await apiService.getRegionalData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
      })
      setRegionalData(data)
    } catch (error) {
      setRegionalError(error instanceof Error ? error.message : "Failed to fetch regional data")
    } finally {
      setRegionalLoading(false)
    }
  }

  // Fetch CA data
  const fetchCAData = async () => {
    if (!dateRange) return

    setCaLoading(true)
    setCaError(null)
    try {
      const data = await apiService.getCARegionalData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
      })
      setCaData(data)
    } catch (error) {
      setCaError(error instanceof Error ? error.message : "Failed to fetch CA data")
    } finally {
      setCaLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (dateRange) {
      fetchRegionalData()
      fetchCAData()
    }
  }, [dateRange])

  // Calculate summary statistics
  const summaryStats =
    regionalData.length > 0
      ? {
        totalArea: regionalData.reduce((sum, region) => sum + Number.parseFloat(region.luas_areal_ha_seluruh), 0),
        totalBlocks: regionalData.reduce((sum, region) => sum + Number.parseInt(region.jumlah_blok_seluruh), 0),
        totalBlocksTU: regionalData.reduce((sum, region) => sum + Number.parseInt(region.jumlah_blok_tu), 0),
        totalMonevedBlocks: regionalData.reduce(
          (sum, region) => sum + Number.parseInt(region.jumlah_blok_sudah_monev.toString()),
          0,
        ),
        totalMonev: regionalData.reduce((sum, region) => sum + Number.parseInt(region.jumlah_monev.toString()), 0),
        avgPercentageMonev:
          regionalData.reduce((sum, region) => sum + Number.parseFloat(region.persentase_monev.toString()), 0) /
          regionalData.length,
        avgKesesuaian:
          regionalData.reduce((sum, region) => sum + Number.parseFloat(region.persentase_kesesuaian.toString()), 0) /
          regionalData.length,
        activeRegions: regionalData.length,
      }
      : null

  const caSummary =
    caData.length > 0
      ? {
        totalCA: caData.reduce((sum, region) => sum + Number.parseInt(region.jumlah_corrective_action), 0),
        totalCASelesai: caData.reduce(
          (sum, region) => sum + Number.parseInt(region.jumlah_corrective_action_selesai),
          0,
        ),
        avgCAPercentage:
              caData.reduce((sum, region) => sum + Number.parseFloat(region.persentase_corrective_action_selesai.toString()), 0) / caData.length,
      }
      : null

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchRegionalData(), fetchCAData()])
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        handleRefresh()
      },
      5000 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  const isLoading = regionalLoading || caLoading

  return (
    <Layout className=" text-white flex flex-col h-screen bg-slate-900">
      <div className="flex-1 flex flex-col h-full">
        <Layout.Header
          sticky
          className="top-0 z-20 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl"
        >
          <TopNav links={topNav} />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>

        <div className="min-h-screen bg-white dark:bg-slate-900">
          {/* Header */}
          <div className="border-b border-white/10 bg-black/80 backdrop-blur-sm">
            <div className="container mx-auto px-2 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-8 w-8 text-emerald-400" />
                    <div>
                      <h1 className="text-2xl font-bold text-white">Monev TU Dashboard</h1>
                      <p className="text-sm text-gray-300">Advanced Analytics & Real-time Monitoring</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/80">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    Live Data
                  </Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Link to="/job-positions">
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/80 text-white hover:bg-white/10">
                      <Users className="h-4 w-4 mr-2" />
                      Job Positions
                    </Button>
                  </Link>
                  <div className="text-right text-sm">
                    <p className="text-gray-300">Last updated:</p>
                    <p className="text-white font-medium">{lastUpdated.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-white/5 border-white/80 text-white hover:bg-white/10"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/80 text-white hover:bg-white/10">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/80 text-white hover:bg-white/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto px-6 py-6 space-y-6">
            {/* Rest of your existing dashboard content remains exactly the same */}
            {/* Filters */}
            <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Data Filter</CardTitle>
                    <Badge variant="secondary" className="bg-blue-500/80 text-blue-300">
                      1 filter aktif
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    Tampilkan Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="bg-white/5 border-white/80"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500/80 to-emerald-600/80 border-emerald-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-100">Total Luas Area</CardTitle>
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {summaryStats ? formatNumber(summaryStats.totalArea) : "0"}
                  </div>
                  <p className="text-xs text-emerald-200">Hektar</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary" className="bg-emerald-500/80 text-emerald-300 text-xs">
                      {summaryStats?.activeRegions || 0} regional aktif
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/80 to-blue-600/80 border-blue-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Blok</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {summaryStats ? formatNumber(summaryStats.totalBlocks) : "0"}
                  </div>
                  <p className="text-xs text-blue-200">Blok TU</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary" className="bg-blue-500/80 text-blue-300 text-xs">
                      {summaryStats ? formatNumber(summaryStats.totalMonevedBlocks) : "0"} sudah dimonev
                    </Badge>
                  </div>
                </CardContent>
              </Card>


              <Card className="bg-gradient-to-br from-orange-500/80 to-orange-600/80 border-orange-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Rata-rata Kesesuaian</CardTitle>
                  <PieChart className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {summaryStats ? formatPercentage(summaryStats.avgKesesuaian) : "0.0%"}
                  </div>
                  <p className="text-xs text-orange-200">Tingkat kesesuaian</p>
                  <div className="flex items-center mt-2">
                    {summaryStats && summaryStats.avgKesesuaian > 90 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                    )}
                    <span className="text-xs text-orange-200">Real-time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-500/80 to-cyan-600/80 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-cyan-100">Total Monev</CardTitle>
                  <Activity className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {summaryStats ? formatNumber(summaryStats.totalMonev) : "0"}
                  </div>
                  <p className="text-xs text-cyan-200">Aktivitas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/80 to-red-600/80 border-red-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-100">Corrective Action</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {caSummary ? formatPercentage(caSummary.avgCAPercentage) : "0.0%"}
                  </div>
                  <p className="text-xs text-red-200">
                    {caSummary ? `${caSummary.totalCASelesai}/${caSummary.totalCA}` : "0/0"} selesai
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/80 to-yellow-600/80 border-yellow-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-100">System Status</CardTitle>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-white">Online</div>
                  <p className="text-xs text-yellow-200">Data Sources: 4 Active</p>
                  <p className="text-xs text-yellow-200">Last Sync: {lastUpdated.toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Overview Monitoring Regional</CardTitle>
                  <CardDescription className="text-gray-300">Persentase monitoring per regional</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <RegionalChart data={regionalData || []} />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Analysis</CardTitle>
                  <CardDescription className="text-gray-300">Analisis kesesuaian per regional</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <PerformanceChart data={regionalData || []} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Corrective Action Progress</CardTitle>
                  <CardDescription className="text-gray-300">
                    Persentase penyelesaian corrective action per regional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <CorrectiveActionChart data={caData || []} />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Luas Area & Jumlah Blok</CardTitle>
                  <CardDescription className="text-gray-300">
                    Perbandingan luas area dan jumlah blok per regional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <AreaBlockChart data={regionalData || []} />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Insights Section */}
            <Card className="bg-black/80 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Monitoring Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-emerald-400">Plantation Stats</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Total Regional: {summaryStats?.activeRegions || 0}</p>
                      <p>
                        Largest Area:{" "}
                        {summaryStats
                          ? formatNumber(Math.max(...regionalData!.map((r) => Number.parseFloat(r.luas_areal_ha_seluruh))))
                          : "0"}{" "}
                        Ha
                      </p>
                      <p>
                        Avg Block Size:{" "}
                        {summaryStats ? formatNumber(summaryStats.totalArea / summaryStats.totalBlocks) : "NaN"} Ha
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">Performance Metrics</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Avg Monitoring: {summaryStats ? formatPercentage(summaryStats.avgPercentageMonev) : "0.0%"}</p>
                      <p>
                        Best Performer:{" "}
                        {regionalData.length > 0
                          ? regionalData.reduce((best, current) =>
                            Number.parseFloat(current.persentase_kesesuaian.toString()) >
                              Number.parseFloat(best.persentase_kesesuaian.toString())
                              ? current
                              : best,
                          ).nama
                          : "N/A"}
                      </p>
                      <p>Total Monev: {summaryStats ? formatNumber(summaryStats.totalMonev) : "0"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">System Health</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Data Sources: 4 Active</p>
                      <p>Last Sync: {lastUpdated.toLocaleTimeString()}</p>
                      <p>
                        Status: <span className="text-emerald-400">Online</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Detail Table */}
            <MonevDetailTable dateRange={dateRange} onRefresh={handleRefresh} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
