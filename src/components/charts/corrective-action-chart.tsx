"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { useState, useMemo } from "react"
import axios from "axios"
import { ChevronUp, ChevronDown, Calendar, MapPin, FileText, User, AlertCircle, Loader2 } from "lucide-react"

interface CorrectiveActionData {
  nama_unit: string | null
  kode_unit: string
  jumlah_corrective_action: string
  jumlah_corrective_action_selesai: string
}

interface CorrectiveActionDetail {
  id: number
  tanggal: string
  kode_unit: string
  kode_afdeling: string
  kode_blok: string
  luas: string
  mekanis: string
  chemis: string
  created_at: string
  deleted_at: string | null
  m_kertas_kerja_id: string
  created_by: string
  regional: string
  kode_regional: string
  gis_id: string
  latitude: string
  longitude: string
  jabatan: string
  catatan_tambahan: string | null
  judul_pekerjaan: string
  nama_vendor: string
  job: string
  preview_link: string
  author_name: string
  nama_unit: string
  corrective_actions: {
    kode_unit: string
    created_at: string
    parameter_id: string
    corrective_action: string | null
    parameter_name: string
    pengamatan_name: string
    tahapan_name: string
    sub_tahapan_name: string
    header_kertas_kerja_id: string
    created_by: string
    jabatan: string
    kode_afdeling: string
    kode_blok: string
    progress: string | null
    nama_pembuat: string
    nama_unit: string
  }[]
}

interface CorrectiveActionChartProps {
  data:any[]
  showTop10?: boolean
  region?: string
  start_date?: string
  end_date?: string
}

interface ChartData {
  name: string
  total: number
  completed: number
  completionRate: number
  kode_unit: string
}

type SortField =
  | "tanggal"
  | "kode_afdeling"
  | "kode_blok"
  | "parameter_name"
  | "pengamatan_name"
  | "corrective_action"
  | "nama_pembuat"
type SortDirection = "asc" | "desc"

export function CorrectiveActionChart({
  data,
  showTop10 = true,
  region,
  start_date,
  end_date,
}: CorrectiveActionChartProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailCa, setDetailCa] = useState<CorrectiveActionDetail[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<ChartData | null>(null)
  const [sortField, setSortField] = useState<SortField>("tanggal")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Process data for chart
  const processDataByUnit = (data: CorrectiveActionData[]): ChartData[] => {
    const unitMap = new Map<string, { total: number; completed: number; kode_unit: string }>()

    data.forEach((item) => {
      const unitName = item.nama_unit?.replace("KEBUN ", "").substring(0, 15) ?? "Unknown Kebun"
      const totalActions = Number.parseInt(item.jumlah_corrective_action) || 0
      const completedActions = Number.parseInt(item.jumlah_corrective_action_selesai) || 0

      if (unitMap.has(unitName)) {
        const existing = unitMap.get(unitName)!
        unitMap.set(unitName, {
          total: existing.total + totalActions,
          completed: existing.completed + completedActions,
          kode_unit: existing.kode_unit,
        })
      } else {
        unitMap.set(unitName, {
          total: totalActions,
          completed: completedActions,
          kode_unit: item.kode_unit,
        })
      }
    })

    const result: ChartData[] = []
    unitMap.forEach((values, unitName) => {
      if (values.total > 0) {
        result.push({
          name: unitName,
          total: values.total,
          completed: values.completed,
          completionRate: Math.round((values.completed / values.total) * 100),
          kode_unit: values.kode_unit,
        })
      }
    })

    return result.sort((a, b) => b.total - a.total)
  }

  const allData = processDataByUnit(data)
  const chartData = showTop10 ? allData.slice(0, 10) : allData

  // Flatten corrective actions for table display
  const flattenedActions = useMemo(() => {
    return detailCa.flatMap(item => 
      item.corrective_actions.map(action => ({
        ...action,
        tanggal: item.tanggal,
        nama_pembuat: item.author_name,
        jabatan: item.jabatan
      }))
    )
  }, [detailCa])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedActions = useMemo(() => {
    return [...flattenedActions].sort((a, b) => {
      const aValue = a[sortField] ?? ""
      const bValue = b[sortField] ?? ""
      
      if (sortDirection === "asc") {
        return String(aValue).localeCompare(String(bValue))
      } else {
        return String(bValue).localeCompare(String(aValue))
      }
    })
  }, [flattenedActions, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  // Chart configuration
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: "auto",
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: { speed: 400 },
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.15,
      },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const index = config.dataPointIndex
          const selected = chartData[index]

          if (selected) {
            setSelectedUnit(selected)
            setIsModalOpen(true)
            setLoading(true)
            setError(null)

            try {
              const apiUrl = import.meta.env.VITE_API_REPLANTING
              const response = await axios.post<CorrectiveActionDetail[]>(`${apiUrl}/api/d-rekap-ca-detail`, {
                kode_unit: selected.kode_unit,
                region: region,
                start_date: start_date,
                end_date: end_date,
              })

              setDetailCa(response.data)
            } catch (error) {
              console.error("Error fetching corrective action details:", error)
              setError("Failed to fetch details. Please try again later.")
            } finally {
              setLoading(false)
            }
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        barHeight: "80%",
        columnWidth: "60%",
        dataLabels: {
          position: "center",
          hideOverflowingLabels: false,
        },
      },
    },
    colors: ["#3B82F6"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#FFFFFF"],
      },
      offsetX: 10,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.8,
      },
    },
    stroke: {
      width: 1,
      colors: ["#0F172A"],
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      labels: {
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#E2E8F0",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} actions`,
      },
      style: {
        fontSize: "14px",
      },
      marker: {
        show: true,
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = w.globals.initialSeries[0].data[dataPointIndex]
        const completed = chartData[dataPointIndex].completed
        const rate = chartData[dataPointIndex].completionRate
        return `
          <div class="p-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <div class="text-sm font-bold text-slate-200">${w.globals.labels[dataPointIndex]}</div>
            <div class="text-sm text-slate-300">Total: ${data}</div>
            <div class="text-sm text-slate-300">Completed: ${completed}</div>
            <div class="text-sm text-slate-300">Completion: ${rate}%</div>
            <div class="text-xs text-blue-400 mt-1">Click to view details</div>
          </div>
        `
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 500 },
          plotOptions: { bar: { barHeight: "70%" } },
          dataLabels: { enabled: false },
        },
      },
    ],
  }

  const series = [{ name: "Total Actions", data: chartData.map((item) => item.total) }]

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-center font-bold text-lg">
            {showTop10 ? "Top 10 Problem Identification Kebun" : "Problem Identification by Unit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ReactApexChart options={chartOptions} series={series} type="bar" height={500} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-center max-w-xs">No corrective actions data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] bg-slate-900 border-slate-700 overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Corrective Actions Detail - {selectedUnit?.name}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-2 text-slate-400">Loading details...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="w-8 h-8 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-400">Total Actions</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{selectedUnit?.total || 0}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-400">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{selectedUnit?.completed || 0}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-slate-400">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{selectedUnit?.completionRate || 0}%</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Total Records</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{flattenedActions.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Table */}
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-slate-800">
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("tanggal")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Date <SortIcon field="tanggal" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("kode_afdeling")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Afdeling <SortIcon field="kode_afdeling" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("kode_blok")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Block <SortIcon field="kode_blok" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("parameter_name")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Parameter <SortIcon field="parameter_name" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("pengamatan_name")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Observation <SortIcon field="pengamatan_name" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("corrective_action")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Action <SortIcon field="corrective_action" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("nama_pembuat")}
                            className="h-auto p-0 font-medium text-slate-300 hover:text-slate-100"
                          >
                            Created By <SortIcon field="nama_pembuat" />
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedActions.length > 0 ? (
                        sortedActions.map((action, index) => (
                          <TableRow
                            key={`${action.header_kertas_kerja_id}-${action.parameter_id}-${index}`}
                            className="border-slate-700 hover:bg-slate-800/50"
                          >
                            <TableCell className="text-slate-300">
                              {new Date(action.tanggal).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {action.kode_afdeling}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {action.kode_blok}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300 max-w-xs">
                              <div className="truncate" title={action.parameter_name}>
                                {action.parameter_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {action.tahapan_name} - {action.sub_tahapan_name}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400 border-yellow-600">
                                {action.pengamatan_name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300 max-w-xs">
                              {action.corrective_action ? (
                                <div className="truncate" title={action.corrective_action}>
                                  {action.corrective_action}
                                </div>
                              ) : (
                                <Badge variant="outline" className="border-slate-600 text-slate-500">
                                  Not specified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-sm">{action.nama_pembuat}</span>
                              </div>
                              <div className="text-xs text-slate-500">{action.jabatan}</div>
                            </TableCell>
          
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                            No corrective actions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}