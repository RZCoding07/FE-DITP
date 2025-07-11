"use client"

import PersonnelDetailTabs from "./personnel-detail-tabs"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Papa from "papaparse"
import { Filter } from "lucide-react"

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
  regional?: string
  kode_unit?: string
  afdeling?: string
}

interface ChartData {
  regional: string
  kode_unit: string
  afdeling: string | null
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
  height = 400,
  regional,
  kode_unit,
  afdeling,
}) => {
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

  // Process data for Palm Co overall summary (single aggregated bar)
  const palmCoSummaryData = useMemo(() => {
    const totalBlok = data.length
    const sudahMonev = data.filter((item) => item.status_monev === "Sudah").length
    const belumMonev = data.filter((item) => item.status_monev === "Belum").length

    return [
      {
        regional: "PALMCO",
        kode_unit: "",
        afdeling: null,
        sudah: sudahMonev,
        belum: belumMonev,
        total: totalBlok,
        percentage_sudah: totalBlok > 0 ? (sudahMonev / totalBlok) * 100 : 0,
        percentage_belum: totalBlok > 0 ? (belumMonev / totalBlok) * 100 : 0,
        items: data,
        displayLabel: "Palm Co",
        sortKey: "PALMCO",
        displayLevel: "company",
      },
    ]
  }, [data])

  // Process data for individual regional breakdown (when regional == "")
  const individualRegionalData = useMemo(() => {
    if (selectedRegional && selectedRegional !== "") return []

    // Group by regional for individual regional view
    const grouped = data.reduce((acc, item) => {
      const key = item.regional
      if (!acc[key]) {
        acc[key] = {
          regional: item.regional,
          kode_unit: "",
          afdeling: null,
          total_blok: 0,
          blok_sudah_monev: 0,
          blok_belum_monev: 0,
          items: [],
          displayLevel: "regional",
        }
      }
      acc[key].total_blok += 1
      acc[key].items.push(item)
      if (item.status_monev === "Sudah") {
        acc[key].blok_sudah_monev += 1
      } else {
        acc[key].blok_belum_monev += 1
      }
      return acc
    }, {} as any)

    return Object.values(grouped)
      .map((group: any) => {
        const total = group.total_blok
        const sudah = group.blok_sudah_monev
        const belum = group.blok_belum_monev
        return {
          regional: group.regional,
          kode_unit: group.kode_unit,
          afdeling: group.afdeling,
          sudah: sudah,
          belum: belum,
          total: total,
          percentage_sudah: total > 0 ? (sudah / total) * 100 : 0,
          percentage_belum: total > 0 ? (belum / total) * 100 : 0,
          items: group.items,
          displayLabel: getRegionalName(group.regional),
          sortKey: group.regional,
          displayLevel: group.displayLevel,
        }
      })
      .sort((a, b) => Number.parseInt(a.regional) - Number.parseInt(b.regional))
  }, [data, selectedRegional])

  // Process data for regional-specific chart (when specific regional is selected)
  const regionalChartData = useMemo(() => {
    if (!selectedRegional || selectedRegional === "") return []

    const filteredData = data.filter((item) => item.regional === selectedRegional)
    // Group by unit for regional view
    const grouped = filteredData.reduce((acc, item) => {
      const key = `${item.regional}-${item.kode_unit}`
      if (!acc[key]) {
        acc[key] = {
          regional: item.regional,
          kode_unit: item.kode_unit,
          nama_unit: item.nama_unit,
          afdeling: null,
          total_blok: 0,
          blok_sudah_monev: 0,
          blok_belum_monev: 0,
          items: [],
          displayLevel: "unit",
        }
      }
      acc[key].total_blok += 1
      acc[key].items.push(item)
      if (item.status_monev === "Sudah") {
        acc[key].blok_sudah_monev += 1
      } else {
        acc[key].blok_belum_monev += 1
      }
      return acc
    }, {} as any)

    return Object.values(grouped)
      .map((group: any) => {
        const total = group.total_blok
        const sudah = group.blok_sudah_monev
        const belum = group.blok_belum_monev
        return {
          regional: group.regional,
          kode_unit: group.kode_unit,
          afdeling: group.afdeling,
          sudah: sudah,
          belum: belum,
          total: total,
          percentage_sudah: total > 0 ? (sudah / total) * 100 : 0,
          percentage_belum: total > 0 ? (belum / total) * 100 : 0,
          items: group.items,
          displayLabel: group.nama_unit,
          sortKey: group.nama_unit,
          displayLevel: group.displayLevel,
        }
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [data, selectedRegional])

  // Create chart options function
  const createChartOptions = (chartData: ChartData[], chartTitle: string): ApexOptions => ({
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
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: undefined,
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
  })

  // Create series data function
  const createChartSeries = (chartData: ChartData[]) => [
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 h-full max-h-[800px] border border-slate-700 shadow-lg flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-medium text-slate-300 mb-2">
            Status Monev -{" "}
            {!selectedRegional || selectedRegional === "" ? "Palm Co" : getRegionalName(selectedRegional)}
          </h2>
          <p className="text-sm text-slate-400">
            {!selectedRegional || selectedRegional === ""
              ? "Keseluruhan Perusahaan & Detail per Regional"
              : `Detail Regional: ${getRegionalName(selectedRegional)}`}
          </p>
        </div>

        {/* Charts Container */}
        <div className="flex gap-4 flex-1">
          {/* Left Chart */}
          <div className="w-1/5 bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            {!selectedRegional || selectedRegional === "" ? (
              // Palm Co Summary Chart
              <>
                <h3 className="text-lg font-medium text-slate-300 mb-3">Rekap Palm Co (Keseluruhan)</h3>
                {palmCoSummaryData.length > 0 ? (
                  <Chart
                    options={createChartOptions(palmCoSummaryData, "Palm Co Summary")}
                    series={createChartSeries(palmCoSummaryData)}
                    type="bar"
                    height={height - 50}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No data available</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Overall Chart when regional is selected
              <>
                <h3 className="text-lg font-medium text-slate-300 mb-3">Status Monev Palm Co (Keseluruhan)</h3>
                {palmCoSummaryData.length > 0 ? (
                  <Chart
                    options={createChartOptions(palmCoSummaryData, "Palm Co Overall")}
                    series={createChartSeries(palmCoSummaryData)}
                    type="bar"
                    height={height - 50}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No data available</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Chart */}
          <div className="w-4/5 bg-slate-800/50 rounded-lg p-3 border border-slate-600">
            {!selectedRegional || selectedRegional === "" ? (
              // Individual Regional Chart
              <>
                <h3 className="text-lg font-medium text-slate-300 mb-3">Detail per Regional</h3>
                {individualRegionalData.length > 0 ? (
                  <Chart
                    options={createChartOptions(individualRegionalData, "Regional Details")}
                    series={createChartSeries(individualRegionalData)}
                    type="bar"
                    height={height - 50}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                      <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No data</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Regional Unit Chart when specific regional is selected
              <>
                <h3 className="text-lg font-medium text-slate-300 mb-3">Detail {getRegionalName(selectedRegional)}</h3>
                {regionalChartData.length > 0 ? (
                  <Chart
                    options={createChartOptions(regionalChartData, `${getRegionalName(selectedRegional)} Details`)}
                    series={createChartSeries(regionalChartData)}
                    type="bar"
                    height={height - 50}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="text-center">
                      <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No data</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for detailed view */}
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
