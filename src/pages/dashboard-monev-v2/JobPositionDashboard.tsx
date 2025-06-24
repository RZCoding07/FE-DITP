"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Download,
  Share2,
  RefreshCw,
  Filter,
  Eye,
  Users,
  TrendingUp,
  Award,
  Building2,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/DatePickermonev"
import { JobPositionChart } from "@/components/charts-m/JobPositionChart"
import { EmployeeDialog } from "@/components/dialogs-m/EmployeeDialog"
import { PersonDialog } from "@/components/dialogs-m/PersonDialog"
import { apiService } from "@/services/api-monev-2"
import { formatNumber, formatDate } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import type { JobPositionData } from "@/services/api-monev-2"

export default function JobPositionDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 4, 24),
    to: new Date(2025, 5, 23),
  })
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedUnit, setSelectedUnit] = useState<string>("")
  const [selectedAfdeling, setSelectedAfdeling] = useState<string>("")
  const [selectedBlok, setSelectedBlok] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedJobPosition, setSelectedJobPosition] = useState<JobPositionData | null>(null)
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [personDialogOpen, setPersonDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<{ nik_sap: string; nama: string } | null>(null)

  // Fetch job position data
  const {
    data: jobPositionData,
    isLoading: jobPositionLoading,
    refetch: refetchJobPosition,
  } = useQuery({
    queryKey: ["job-position-data", dateRange, selectedRegion, selectedUnit, selectedAfdeling, selectedBlok],
    queryFn: () =>
      apiService.getJobPositionData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
        region: selectedRegion || undefined,
        kode_unit: selectedUnit || undefined,
        afdeling: selectedAfdeling || undefined,
        blok: selectedBlok || undefined,
      }),
    enabled: !!dateRange,
  })

  // Fetch regional data for filter options
  const { data: regionalData } = useQuery({
    queryKey: ["regional-data-filter"],
    queryFn: () =>
      apiService.getRegionalData({
        start_date: "2024-05-24",
        end_date: "2025-06-23",
      }),
  })

  // Fetch unit data for filter options
  const { data: unitData } = useQuery({
    queryKey: ["unit-data-filter", selectedRegion],
    queryFn: () =>
      apiService.getUnitData({
        start_date: "2024-05-24",
        end_date: "2025-06-23",
        region: selectedRegion,
      }),
    enabled: !!selectedRegion,
  })

  // Calculate summary statistics
  const summaryStats = jobPositionData
    ? {
        totalPositions: jobPositionData.length,
        totalEmployees: jobPositionData.reduce((sum, pos) => sum + pos.karyawans.length, 0),
        totalMonev: jobPositionData.reduce((sum, pos) => sum + pos.jumlah_monev, 0),
        avgNilai: jobPositionData.reduce((sum, pos) => sum + pos.rata_rata_nilai, 0) / jobPositionData.length,
        avgBobot: jobPositionData.reduce((sum, pos) => sum + pos.rata_rata_bobot, 0) / jobPositionData.length,
        topPerformer: jobPositionData.reduce((best, current) =>
          current.rata_rata_nilai > best.rata_rata_nilai ? current : best,
        ),
      }
    : null

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchJobPosition()
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const handleJobPositionClick = (jobPosition: JobPositionData) => {
    setSelectedJobPosition(jobPosition)
    setEmployeeDialogOpen(true)
  }

  const handleEmployeeClick = (employee: { nik_sap: string; nama: string }) => {
    setSelectedEmployee(employee)
    setPersonDialogOpen(true)
  }

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 5000 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const activeFilters = [
    selectedRegion && "Regional",
    selectedUnit && "Unit",
    selectedAfdeling && "Afdeling",
    selectedBlok && "Blok",
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-emerald-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Job Position Analytics</h1>
                  <p className="text-sm text-gray-300">Advanced Employee Performance & Monitoring Dashboard</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                Live Data
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <p className="text-gray-300">Last updated:</p>
                <p className="text-white font-medium">{lastUpdated.toLocaleString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Advanced Filters */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Advanced Filters</CardTitle>
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {activeFilters} filter{activeFilters > 1 ? "s" : ""} aktif
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
                onClick={() => {
                  setSelectedRegion("")
                  setSelectedUnit("")
                  setSelectedAfdeling("")
                  setSelectedBlok("")
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Periode</label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                  className="bg-white/5 border-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Regional</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Pilih Regional" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="">Semua Regional</SelectItem>
                    {regionalData?.map((region) => (
                      <SelectItem key={region.kode} value={region.kode} className="text-white">
                        {region.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Unit/Kebun</label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit} disabled={!selectedRegion}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Pilih Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="">Semua Unit</SelectItem>
                    {unitData?.map((unit) => (
                      <SelectItem key={unit.kode_unit} value={unit.kode_unit} className="text-white">
                        {unit.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Afdeling</label>
                <Select value={selectedAfdeling} onValueChange={setSelectedAfdeling}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Pilih Afdeling" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="ALL" className="text-white">
                      Semua Afdeling
                    </SelectItem>
                    <SelectItem value="AFD01" className="text-white">
                      AFD01
                    </SelectItem>
                    <SelectItem value="AFD02" className="text-white">
                      AFD02
                    </SelectItem>
                    <SelectItem value="AFD03" className="text-white">
                      AFD03
                    </SelectItem>
                    <SelectItem value="AFD04" className="text-white">
                      AFD04
                    </SelectItem>
                    <SelectItem value="AFD05" className="text-white">
                      AFD05
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Blok</label>
                <Select value={selectedBlok} onValueChange={setSelectedBlok}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Pilih Blok" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="ALL">Semua Blok</SelectItem>
                    <SelectItem value="01A" className="text-white">
                      01A
                    </SelectItem>
                    <SelectItem value="01B" className="text-white">
                      01B
                    </SelectItem>
                    <SelectItem value="01C" className="text-white">
                      01C
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleRefresh}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Jabatan</CardTitle>
              <Building2 className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats?.totalPositions || 0}</div>
              <p className="text-xs text-emerald-200">Posisi aktif</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 text-xs">
                  Real-time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Karyawan</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats?.totalEmployees || 0}</div>
              <p className="text-xs text-blue-200">Karyawan aktif</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                  Monitoring
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Monev</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(summaryStats?.totalMonev || 0)}</div>
              <p className="text-xs text-purple-200">Aktivitas monitoring</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
                <span className="text-xs text-purple-200">Active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Rata-rata Nilai</CardTitle>
              <Award className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {summaryStats ? summaryStats.avgNilai.toFixed(1) : "0.0"}
              </div>
              <p className="text-xs text-orange-200">Performance score</p>
              <Progress value={summaryStats?.avgNilai || 0} className="mt-2 h-2 bg-orange-900/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-100">Top Performer</CardTitle>
              <PieChart className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white truncate">
                {summaryStats?.topPerformer?.jabatan || "N/A"}
              </div>
              <p className="text-xs text-cyan-200">
                Score: {summaryStats?.topPerformer?.rata_rata_nilai.toFixed(1) || "0.0"}
              </p>
              <div className="flex items-center mt-2">
                <Award className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs text-cyan-200">Best</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Position Chart */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Performance per Jabatan</CardTitle>
            <CardDescription className="text-gray-300">
              Analisis monitoring berdasarkan posisi jabatan - Klik bar untuk melihat detail karyawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobPositionLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : jobPositionData && jobPositionData.length > 0 ? (
              <JobPositionChart data={jobPositionData} onBarClick={handleJobPositionClick} />
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tidak ada data jabatan tersedia</p>
                  <p className="text-sm mt-2">Coba ubah filter atau periode waktu</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Position Summary Cards */}
        {jobPositionData && jobPositionData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobPositionData.map((position, index) => (
              <Card
                key={position.jabatan}
                className="bg-black/20 border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handleJobPositionClick(position)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg truncate">{position.jabatan}</CardTitle>
                    <Badge
                      variant={position.rata_rata_nilai > 50 ? "default" : "secondary"}
                      className={
                        position.rata_rata_nilai > 50
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }
                    >
                      {position.rata_rata_nilai.toFixed(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Karyawan</p>
                      <p className="text-lg font-semibold text-white">{position.karyawans.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Total Monev</p>
                      <p className="text-lg font-semibold text-blue-400">{position.jumlah_monev}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Performance</span>
                      <span className="text-white">{position.rata_rata_nilai.toFixed(1)}%</span>
                    </div>
                    <Progress value={position.rata_rata_nilai} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Bobot: {position.rata_rata_bobot.toFixed(1)}</span>
                    <span>Klik untuk detail →</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* System Insights */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-400">Workforce Analytics</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Total Positions: {summaryStats?.totalPositions || 0}</p>
                  <p>Active Employees: {summaryStats?.totalEmployees || 0}</p>
                  <p>
                    Avg Employees/Position:{" "}
                    {summaryStats ? (summaryStats.totalEmployees / summaryStats.totalPositions).toFixed(1) : "0.0"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Performance Metrics</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Avg Score: {summaryStats ? summaryStats.avgNilai.toFixed(1) : "0.0"}</p>
                  <p>Avg Weight: {summaryStats ? summaryStats.avgBobot.toFixed(1) : "0.0"}</p>
                  <p>Total Activities: {formatNumber(summaryStats?.totalMonev || 0)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-400">System Status</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Data Sources: Active</p>
                  <p>Last Update: {lastUpdated.toLocaleTimeString()}</p>
                  <p>
                    Status: <span className="text-emerald-400">Online</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Dialog */}
      <EmployeeDialog
        data={selectedJobPosition}
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        onEmployeeClick={handleEmployeeClick}
      />

      {/* Person Dialog */}
      <PersonDialog
        employee={selectedEmployee}
        open={personDialogOpen}
        onOpenChange={setPersonDialogOpen}
        filters={{
          start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
          end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
          region: selectedRegion,
          kode_unit: selectedUnit,
          afdeling: selectedAfdeling,
          blok: selectedBlok,
        }}
      />
    </div>
  )
}
