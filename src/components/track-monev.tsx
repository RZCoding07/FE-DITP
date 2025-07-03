"use client"

import { CommandEmpty } from "@/components/ui/command"
import IntegratedSummaryStats from "./integrated-summary-stats"
import PersonnelDetailTabs from "./personnel-detail-tabs"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Papa from "papaparse"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandList, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronDown, Filter } from "lucide-react"

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

interface PersonnelData {
  sap: string
  name: string
  gender: string
  personnel_area: string
  desc_personnel_area: string
  personnel_subarea: string
  region: string
  desc_personnel_subarea: string
  desc_org_unit: string
  desc_position: string
  desc_job: string
  level: string
  cost_center: string
  afd_code: string | null
  headerkertaskerja: any[]
}

interface MonevDashboardProps {
  data: DataItem[]
  personnelData?: PersonnelData[]
  title?: string
  height?: number
  regional?: string // Optional, if you want to filter by regional
  kode_unit?: string // Optional, if you want to filter by kode unit
  afdeling?: string // Optional, if you want to filter by afdeling
}

interface ChartData {
  regional: string
  kode_unit: string
  afdeling: string | null // Make this nullable for unit-level data
  sudah: number
  belum: number
  total: number
  percentage_sudah: number
  percentage_belum: number
  displayLabel: string
  sortKey: string
  items: DataItem[]
  displayLevel?: string
}

const MonevDashboard: React.FC<MonevDashboardProps> = ({
  data,
  personnelData = [],
  title = "Dashboard Monitoring & Evaluasi",
  height = "400px",
  regional,
  kode_unit,
  afdeling,
}) => {

  // State for dialog and selected dat
  console.log("Initializing MonevDashboard with data length:", data)


  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<ChartData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)


  const [selectedRegional, setSelectedRegional] = useState<string>(regional || "")
  const [selectedKodeUnit, setSelectedKodeUnit] = useState<string>(kode_unit || "")
  const [selectedAfdeling, setSelectedAfdeling] = useState<string>(afdeling || "")
  const [openPopover, setOpenPopover] = useState<string | null>(null)

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

  // Regional name mapping
  const getRegionalName = (regionalCode: string) => {
    const regionalNames: Record<string, string> = {
      "1": "Regional 1",
      "2": "Regional 2",
      "3": "Regional 3",
      "4": "Regional 4",
      "5": "Regional 5",
      "6": "Regional 6",
      "7": "Regional 7",
      "8": "KSO Sulawesi",
      M: "KSO Ex N2",
    }
    return regionalNames[regionalCode] || `Regional ${regionalCode}`
  }


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
  }, [data, selectedRegional, selectedKodeUnit, selectedAfdeling])

  let categories: string[] = []

  categories = chartData.map((item) => {
    if (item.displayLevel === "regional") {
      return getRegionalName(item.regional)
    }
    return item.displayLabel
  })


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
      categories: categories,
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
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: undefined, // Use default colors
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
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

  return (
    <div className="w-full text-white h-full rounded-lg">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 h-full max-h-[800px] border border-slate-700 shadow-lg flex flex-col ">
        <IntegratedSummaryStats data={data} filteredData={chartData} personnelData={personnelData} />

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
        <DialogContent className="max-w-full h-full bg-slate-900 border-slate-700 justify-content-start">

          <div className="p-0 m-0 justify-normal align-top items-start">
            <p>
              Detail Monitoring - {selectedData?.regional} | {selectedData?.kode_unit}
              {selectedData?.afdeling && ` | ${selectedData.afdeling}`}
            </p>

            <PersonnelDetailTabs
              selectedData={selectedData}
              personnelData={personnelData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortConfig={sortConfig}
              handleSort={handleSort}
              getFilteredAndSortedData={getFilteredAndSortedData}
              exportToExcel={exportToExcel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MonevDashboard
