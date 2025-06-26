"use client"

import { CommandEmpty } from "@/components/ui/command"
import SummaryStats from "./summary-stats-monev"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, ArrowUpDown } from "lucide-react"
import Papa from "papaparse"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandList, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown, Filter, RotateCcw } from "lucide-react"

interface MonevItem {
  id: number
  tanggal: string
  kode_unit: string
  kode_afdeling: string
  kode_blok: string
  luas: string
  pn: string | null
  mn: string | null
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
  createdby: {
    sap: string
    name: string
  }
}

interface DataItem {
  regional: string
  kode_unit: string
  nama_unit: string
  afdeling: string
  blok: string
  status_monev: "Sudah" | "Belum"
  list_monev: MonevItem[]
}

interface MonevDashboardProps {
  data: DataItem[]
  title?: string
  height?: number
  regional?: string // Optional, if you want to filter by regional
  kode_unit?: string // Optional, if you want to filter by kode unit
  afdeling?: string // Optional, if you want to filter by afdeling
}

interface ChartData {
  regional: string
  kode_unit: string
  afdeling: string
  sudah: number
  belum: number
  total: number
  percentage_sudah: number
  percentage_belum: number
  displayLabel: string
  sortKey: string
  items: DataItem[] // Add this line to fix the error
  displayLevel?: string // Optional, as used in chartData mapping
}

const MonevDashboard: React.FC<MonevDashboardProps> = ({
  data,
  title = "Dashboard Monitoring & Evaluasi",
  height = 400,
  regional,
  kode_unit,
  afdeling,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<ChartData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  // Single selection filters - initialize from props
  const [selectedRegional, setSelectedRegional] = useState<string>(regional || "")
  const [selectedKodeUnit, setSelectedKodeUnit] = useState<string>(kode_unit || "")
  const [selectedAfdeling, setSelectedAfdeling] = useState<string>(afdeling || "")
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  // Sync filters with props when they change
  useEffect(() => {
    if (regional !== undefined) {
      setSelectedRegional(regional)
    }
    if (kode_unit !== undefined) {
      setSelectedKodeUnit(kode_unit)
    }
    if (afdeling !== undefined) {
      setSelectedAfdeling(afdeling)
    }
  }, [regional, kode_unit, afdeling])

  // Get cascading filter options
  const filterOptions = useMemo(() => {
    // All regionals
    const regionals = [...new Set(data.map((item) => item.regional))].sort()

    // Kode units based on selected regional - fix deduplication
    const kodeUnits = selectedRegional
      ? (() => {
          const uniqueUnits = new Map()
          data
            .filter((item) => item.regional === selectedRegional)
            .forEach((item) => {
              if (!uniqueUnits.has(item.kode_unit)) {
                uniqueUnits.set(item.kode_unit, {
                  kode: item.kode_unit,
                  nama: item.nama_unit,
                })
              }
            })
          return Array.from(uniqueUnits.values()).sort((a, b) => a.kode.localeCompare(b.kode))
        })()
      : []

    // Afdelings based on selected regional and kode unit
    const afdelings =
      selectedRegional && selectedKodeUnit
        ? [
            ...new Set(
              data
                .filter((item) => item.regional === selectedRegional && item.kode_unit === selectedKodeUnit)
                .map((item) => item.afdeling),
            ),
          ].sort()
        : []

    return { regionals, kodeUnits, afdelings }
  }, [data, selectedRegional, selectedKodeUnit])

  // Process and filter data for chart
  const chartData = useMemo(() => {
    // Apply filters
    const filteredData = data.filter((item) => {
      const regionalMatch = !selectedRegional || item.regional === selectedRegional
      const kodeUnitMatch = !selectedKodeUnit || item.kode_unit === selectedKodeUnit
      const afdelingMatch = !selectedAfdeling || item.afdeling === selectedAfdeling

      return regionalMatch && kodeUnitMatch && afdelingMatch
    })

    // Determine aggregation level based on filters
    let displayLevel = ""

    if (selectedAfdeling) {
      displayLevel = "blok" // Show individual bloks when afdeling is selected
    } else if (selectedKodeUnit) {
      displayLevel = "afdeling" // Show afdelings when unit is selected
    } else if (selectedRegional) {
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
          kode_unit: item.kode_unit,
          afdeling: item.afdeling,
          blok: item.blok,
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
          afdeling: group.afdeling,
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
  }, [data, selectedRegional, selectedKodeUnit, selectedAfdeling])

  // Chart configuration
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: height,
      stacked: true,
      stackType: "100%",
      background: "transparent",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedItem = chartData[config.dataPointIndex]
          setSelectedData(selectedItem)
          setIsDialogOpen(true)
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              color: "#ffffff",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return val > 5 ? `${val.toFixed(1)}%` : ""
      },
      style: {
        colors: ["#ffffff"],
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.displayLabel),
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
        rotate: chartData.length > 5 ? -45 : 0,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: "#94a3b8",
      },
    },
    colors: ["#f97316", "#475569"],
    theme: {
      mode: "dark",
    },
    grid: {
      borderColor: "#334155",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, opts: any) => {
          const dataIndex = opts.dataPointIndex
          const item = chartData[dataIndex]
          const seriesName = opts.series[opts.seriesIndex].name

          if (seriesName === "Sudah Monev") {
            return `${item.sudah} blok dari ${item.total} total (${val.toFixed(1)}%)`
          } else {
            return `${item.belum} blok dari ${item.total} total (${val.toFixed(1)}%)`
          }
        },
      },
    },
  }

  const chartSeries = [
    {
      name: "Sudah Monev",
      data: chartData.map((item) => item.percentage_sudah),
    },
    {
      name: "Belum Monev",
      data: chartData.map((item) => item.percentage_belum),
    },
  ]

  // Filter and sort data for tables
  const getFilteredAndSortedData = (items: DataItem[]) => {
    const filtered = items.filter((item) =>
      Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof DataItem]
        const bValue = b[sortConfig.key as keyof DataItem]

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Export to Excel
  const exportToExcel = (dataToExport: any[], filename: string) => {
    const csv = Papa.unparse(dataToExport)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearAllFilters = () => {
    // Only clear filters that aren't controlled by props
    if (regional === undefined) {
      setSelectedRegional("")
    }
    if (kode_unit === undefined) {
      setSelectedKodeUnit("")
    }
    if (afdeling === undefined) {
      setSelectedAfdeling("")
    }
  }

  // Handle cascading filter changes
  const handleRegionalChange = (value: string) => {
    // Only update if not controlled by props
    if (regional === undefined) {
      setSelectedRegional(value)
      setSelectedKodeUnit("") // Reset dependent filters
      setSelectedAfdeling("")
    }
    setOpenPopover(null)
  }

  const handleKodeUnitChange = (value: string) => {
    // Only update if not controlled by props
    if (kode_unit === undefined) {
      setSelectedKodeUnit(value)
      setSelectedAfdeling("") // Reset dependent filter
    }
    setOpenPopover(null)
  }

  const handleAfdelingChange = (value: string) => {
    // Only update if not controlled by props
    if (afdeling === undefined) {
      setSelectedAfdeling(value)
    }
    setOpenPopover(null)
  }

  const SingleSelectDropdown = ({
    type,
    options,
    selected,
    onSelect,
    placeholder,
    disabled = false,
  }: {
    type: string
    options: any[]
    selected: string
    onSelect: (value: string) => void
    placeholder: string
    disabled?: boolean
  }) => (
    <Popover open={openPopover === type} onOpenChange={(open) => setOpenPopover(open ? type : null)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={`justify-between bg-slate-800 border-slate-600 text-white hover:bg-slate-700 min-w-[200px] ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selected || placeholder}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-slate-800 border-slate-600">
        <Command className="bg-slate-800">
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="text-white" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => {
                const value = typeof option === "string" ? option : option.kode
                const label =
                  typeof option === "string"
                    ? type === "regional"
                      ? `Regional ${option}`
                      : option
                    : `${option.kode} - ${option.nama}`

                return (
                  <CommandItem key={value} onSelect={() => onSelect(value)} className="text-white hover:bg-slate-700">
                    <Check className={`mr-2 h-4 w-4 ${selected === value ? "opacity-100" : "opacity-0"}`} />
                    {label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  const sudahMonevData = selectedData?.items?.filter((item) => item.status_monev === "Sudah") || []
  const belumMonevData = selectedData?.items?.filter((item) => item.status_monev === "Belum") || []

  // Get current filter breadcrumb
  const getFilterBreadcrumb = () => {
    const breadcrumb = []
    if (selectedRegional) {
      breadcrumb.push(`Regional ${selectedRegional}`)
    }
    if (selectedKodeUnit) {
      const unitData = data.find((item) => item.kode_unit === selectedKodeUnit)
      breadcrumb.push(unitData?.nama_unit || selectedKodeUnit)
    }
    if (selectedAfdeling) {
      breadcrumb.push(selectedAfdeling)
    }
    return breadcrumb
  }

  return (
    <div className="w-full bg-slate-900 text-white p-6 rounded-lg">
      {/* Filter Section */}
      <div className="pb-4">


        {/* Breadcrumb */}
        {getFilterBreadcrumb().length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              {getFilterBreadcrumb().map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-slate-500">›</span>}
                  <Badge variant="outline" className="bg-slate-700 border-slate-600 text-white">
                    {crumb}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <SummaryStats data={data} filteredData={chartData} />

      {/* Chart Section */}
      <div className="bg-slate-800 rounded-lg p-4">
        {chartData.length > 0 ? (
          <Chart options={chartOptions} series={chartSeries} type="bar" height={height} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No data matches the selected filters</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Detail Monitoring - {selectedData?.regional} | {selectedData?.kode_unit} | {selectedData?.afdeling}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <Button
              onClick={() =>
                exportToExcel(selectedData?.items || [], `monev-${selectedData?.kode_unit}-${selectedData?.afdeling}`)
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>

          <Tabs defaultValue="sudah" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="sudah" className="data-[state=active]:bg-slate-700">
                Sudah Monev ({sudahMonevData.length})
              </TabsTrigger>
              <TabsTrigger value="belum" className="data-[state=active]:bg-slate-700">
                Belum Monev ({belumMonevData.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sudah" className="mt-4">
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead
                        className="text-slate-300 cursor-pointer hover:text-white"
                        onClick={() => handleSort("blok")}
                      >
                        <div className="flex items-center gap-2">
                          Blok
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Jumlah Monev</TableHead>
                      <TableHead className="text-slate-300">Terakhir Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredAndSortedData(sudahMonevData).map((item, index) => (
                      <TableRow key={index} className="border-slate-700">
                        <TableCell className="text-white">{item.blok}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                            {item.status_monev}
                          </span>
                        </TableCell>
                        <TableCell className="text-white">{item.list_monev.length}</TableCell>
                        <TableCell className="text-slate-300">
                          {item.list_monev.length > 0
                            ? new Date(item.list_monev[item.list_monev.length - 1].created_at).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="belum" className="mt-4">
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead
                        className="text-slate-300 cursor-pointer hover:text-white"
                        onClick={() => handleSort("blok")}
                      >
                        <div className="flex items-center gap-2">
                          Blok
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Afdeling</TableHead>
                      <TableHead className="text-slate-300">Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredAndSortedData(belumMonevData).map((item, index) => (
                      <TableRow key={index} className="border-slate-700">
                        <TableCell className="text-white">{item.blok}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs">
                            {item.status_monev}
                          </span>
                        </TableCell>
                        <TableCell className="text-white">{item.afdeling}</TableCell>
                        <TableCell className="text-slate-300">{item.nama_unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MonevDashboard
