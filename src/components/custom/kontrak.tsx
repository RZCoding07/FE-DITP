"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Users, BarChart3, Filter } from "lucide-react"

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

const TBMContractStatusChart: React.FC<MonevDashboardProps> = ({
  data,
  personnelData = [],
  title = "Dashboard Monitoring & Evaluasi",
  height = 400,
  regional,
  kode_unit,
  afdeling,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRegional, setSelectedRegional] = useState<string | null>(regional || null)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(kode_unit || null)
  const [selectedData, setSelectedData] = useState<ChartData | null>(null)

  // Data kontrak TBM per regional
  const regionalBerkontrakBlokData: Record<string, number> = {
    "1": 121,
    "2": 298,
    "3": 19,
    "4": 93,
    "5": 172,
    "6": 52,
    "7": 0,
    "8": 0,
    M: 64,
  }

  const regionalBelumBerkontrakBlokData: Record<string, number> = {
    "1": 415,
    "2": 0,
    "3": 84,
    "4": 0,
    "5": 8,
    "6": 22,
    "7": 0,
    "8": 0,
    M: 13,
  }

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

  const datasAfdYgSudahBerkontrak = [
    { region: "1", unit: "1E14", afdeling: "AFD04" },
    { region: "1", unit: "1E14", afdeling: "AFD02" },
    { region: "1", unit: "1E06", afdeling: "AFD08" },
    { region: "1", unit: "1E29", afdeling: "AFD03" },
    { region: "1", unit: "1E19", afdeling: "AFD05" },
    { region: "3", unit: "3E14", afdeling: "AFD02" },
    { region: "3", unit: "3E14", afdeling: "AFD09" },
    { region: "6", unit: "6E16", afdeling: "AFD02" },
    { region: "6", unit: "6E16", afdeling: "AFD04" },
    { region: "6", unit: "6E16", afdeling: "AFD05" },
    { region: "6", unit: "6E16", afdeling: "AFD06" },
    { region: "6", unit: "6E19", afdeling: "AFD02" },
    { region: "2", unit: "2E01", afdeling: "AFD02" },
    { region: "2", unit: "2E01", afdeling: "AFD05" },
    { region: "2", unit: "2E01", afdeling: "AFD08" },
    { region: "2", unit: "2E02", afdeling: "AFD01" },
    { region: "2", unit: "2E02", afdeling: "AFD03" },
    { region: "2", unit: "2E02", afdeling: "AFD04" },
    { region: "2", unit: "2E02", afdeling: "AFD06" },
    { region: "2", unit: "2E02", afdeling: "AFD08" },
    { region: "2", unit: "2E02", afdeling: "AFD09" },
    { region: "2", unit: "2E02", afdeling: "AFD10" },
    { region: "2", unit: "2E03", afdeling: "AFD02" },
    { region: "2", unit: "2E03", afdeling: "AFD03" },
    { region: "2", unit: "2E05", afdeling: "AFD01" },
    { region: "2", unit: "2E09", afdeling: "AFD02" },
    { region: "2", unit: "2E09", afdeling: "AFD03" },
    { region: "2", unit: "2E11", afdeling: "AFD01" },
    { region: "2", unit: "2E11", afdeling: "AFD02" },
    { region: "2", unit: "2E11", afdeling: "AFD03" },
    { region: "2", unit: "2E11", afdeling: "AFD04" },
    { region: "2", unit: "2E11", afdeling: "AFD05" },
    { region: "2", unit: "2E11", afdeling: "AFD07" },
    { region: "2", unit: "2E11", afdeling: "AFD08" },
    { region: "2", unit: "2E12", afdeling: "AFD01" },
    { region: "2", unit: "2E12", afdeling: "AFD02" },
    { region: "2", unit: "2E12", afdeling: "AFD03" },
    { region: "2", unit: "2E12", afdeling: "AFD05" },
    { region: "2", unit: "2E14", afdeling: "AFD01" },
    { region: "2", unit: "2E14", afdeling: "AFD06" },
    { region: "2", unit: "2E15", afdeling: "AFD02" },
    { region: "2", unit: "2E16", afdeling: "AFD04" },
    { region: "2", unit: "2E16", afdeling: "AFD08" },
    { region: "2", unit: "2E22", afdeling: "AFD04" },
    { region: "2", unit: "2E22", afdeling: "AFD05" },
    { region: "2", unit: "2E26", afdeling: "AFD01" },
    { region: "2", unit: "2E26", afdeling: "AFD03" },
    { region: "2", unit: "2E26", afdeling: "AFD07" },
    { region: "2", unit: "2E26", afdeling: "AFD08" },
    { region: "2", unit: "2E26", afdeling: "AFD09" },
    { region: "2", unit: "2E29", afdeling: "AFD01" },
    { region: "2", unit: "2E29", afdeling: "AFD02" },
    { region: "2", unit: "2E29", afdeling: "AFD04" },
    { region: "4", unit: "4E05", afdeling: "AFD09" },
    { region: "4", unit: "4E06", afdeling: "AFD01" },
    { region: "4", unit: "4E06", afdeling: "AFD02" },
    { region: "4", unit: "4E06", afdeling: "AFD03" },
    { region: "4", unit: "4E06", afdeling: "AFD04" },
    { region: "4", unit: "4E06", afdeling: "AFD05" },
    { region: "4", unit: "4E06", afdeling: "AFD07" },
    { region: "4", unit: "4E06", afdeling: "AFD08" },
    { region: "4", unit: "4E07", afdeling: "AFD01" },
    { region: "4", unit: "4E07", afdeling: "AFD02" },
    { region: "4", unit: "4E07", afdeling: "AFD03" },
    { region: "4", unit: "4E07", afdeling: "AFD04" },
    { region: "4", unit: "4E07", afdeling: "AFD05" },
    { region: "4", unit: "4E07", afdeling: "AFD06" },
    { region: "4", unit: "4E07", afdeling: "AFD08" },
    { region: "4", unit: "4E08", afdeling: "AFD01" },
    { region: "4", unit: "4E08", afdeling: "AFD02" },
    { region: "4", unit: "4E08", afdeling: "AFD03" },
    { region: "4", unit: "4E08", afdeling: "AFD04" },
    { region: "4", unit: "4E08", afdeling: "AFD05" },
    { region: "4", unit: "4E08", afdeling: "AFD06" },
    { region: "4", unit: "4E08", afdeling: "AFD07" },
    { region: "4", unit: "4E08", afdeling: "AFD08" },
    { region: "4", unit: "4E09", afdeling: "AFD01" },
    { region: "4", unit: "4E09", afdeling: "AFD02" },
    { region: "4", unit: "4E09", afdeling: "AFD03" },
    { region: "4", unit: "4E09", afdeling: "AFD04" },
    { region: "4", unit: "4E09", afdeling: "AFD05" },
    { region: "4", unit: "4E09", afdeling: "AFD06" },
    { region: "4", unit: "4E09", afdeling: "AFD07" },
    { region: "4", unit: "4E09", afdeling: "AFD08" },
    { region: "4", unit: "4E10", afdeling: "AFD01" },
    { region: "4", unit: "4E10", afdeling: "AFD02" },
    { region: "4", unit: "4E10", afdeling: "AFD03" },
    { region: "4", unit: "4E10", afdeling: "AFD04" },
    { region: "4", unit: "4E10", afdeling: "AFD05" },
    { region: "4", unit: "4E10", afdeling: "AFD06" },
    { region: "4", unit: "4E10", afdeling: "AFD07" },
    { region: "4", unit: "4E10", afdeling: "AFD08" },
    { region: "4", unit: "4E11", afdeling: "AFD01" },
    { region: "4", unit: "4E11", afdeling: "AFD02" },
    { region: "4", unit: "4E11", afdeling: "AFD03" },
    { region: "4", unit: "4E11", afdeling: "AFD04" },
    { region: "4", unit: "4E11", afdeling: "AFD05" },
    { region: "4", unit: "4E11", afdeling: "AFD06" },
    { region: "4", unit: "4E11", afdeling: "AFD07" },
    { region: "4", unit: "4E11", afdeling: "AFD11" },
    { region: "4", unit: "4E12", afdeling: "AFD01" },
    { region: "4", unit: "4E12", afdeling: "AFD02" },
    { region: "4", unit: "4E12", afdeling: "AFD03" },
    { region: "4", unit: "4E12", afdeling: "AFD04" },
    { region: "4", unit: "4E05", afdeling: "AFD05" },
    { region: "4", unit: "4E05", afdeling: "AFD06" },
    { region: "4", unit: "4E12", afdeling: "AFD06" },
    { region: "4", unit: "4E12", afdeling: "AFD07" },
    { region: "4", unit: "4E12", afdeling: "AFD08" },
    { region: "5", unit: "5E01", afdeling: "AFD03" },
    { region: "5", unit: "5E01", afdeling: "AFD05" },
    { region: "5", unit: "5E02", afdeling: "AFD05" },
    { region: "5", unit: "5E03", afdeling: "AFD01" },
    { region: "5", unit: "5E03", afdeling: "AFD02" },
    { region: "5", unit: "5E03", afdeling: "AFD04" },
    { region: "5", unit: "5E03", afdeling: "AFD05" },
    { region: "5", unit: "5E04", afdeling: "AFD01" },
    { region: "5", unit: "5E04", afdeling: "AFD03" },
    { region: "5", unit: "5E07", afdeling: "AFD04" },
    { region: "5", unit: "5E08", afdeling: "AFD02" },
    { region: "5", unit: "5E09", afdeling: "AFD03" },
    { region: "5", unit: "5E16", afdeling: "AFD08" },
    { region: "5", unit: "5E17", afdeling: "AFD01" },
    { region: "5", unit: "5E17", afdeling: "AFD02" },
    { region: "M", unit: "ME02", afdeling: "AFD01" },
    { region: "M", unit: "ME02", afdeling: "AFD10" },
    { region: "M", unit: "ME03", afdeling: "AFD01" },
    { region: "M", unit: "ME03", afdeling: "AFD02" },
    { region: "M", unit: "ME03", afdeling: "AFD03" },
    { region: "M", unit: "ME03", afdeling: "AFD07" },
    { region: "M", unit: "ME03", afdeling: "AFD08" },
    { region: "M", unit: "ME04", afdeling: "AFD01" },
    { region: "M", unit: "ME04", afdeling: "AFD02" },
    { region: "M", unit: "ME05", afdeling: "AFD02" },
    { region: "M", unit: "ME05", afdeling: "AFD03" },
    { region: "M", unit: "ME05", afdeling: "AFD04" },
    { region: "M", unit: "ME06", afdeling: "AFD04" },
    { region: "M", unit: "ME06", afdeling: "AFD05" },
    { region: "M", unit: "ME07", afdeling: "AFD02" },
    { region: "M", unit: "ME11", afdeling: "AFD04" },
  ]

  // Process data for Palm Co overall summary (single aggregated bar)
  const palmCoSummaryData = useMemo(() => {
    const totalSudah = Object.values(regionalBerkontrakBlokData).reduce((sum, val) => sum + val, 0)
    const totalBelum = Object.values(regionalBelumBerkontrakBlokData).reduce((sum, val) => sum + val, 0)
    const total = totalSudah + totalBelum

    return [
      {
        regional: "PALMCO",
        kode_unit: "",
        afdeling: null,
        sudah: totalSudah,
        belum: totalBelum,
        total: total,
        percentage_sudah: total > 0 ? (totalSudah / total) * 100 : 0,
        percentage_belum: total > 0 ? (totalBelum / total) * 100 : 0,
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

    const regionals = Object.keys(regionalBerkontrakBlokData)
    return regionals
      .map((regional) => {
        const sudah = regionalBerkontrakBlokData[regional] || 0
        const belum = regionalBelumBerkontrakBlokData[regional] || 0
        const total = sudah + belum
        const regionalItems = data.filter((item) => item.regional === regional)

        return {
          regional,
          kode_unit: "",
          afdeling: null,
          sudah,
          belum,
          total,
          percentage_sudah: total > 0 ? (sudah / total) * 100 : 0,
          percentage_belum: total > 0 ? (belum / total) * 100 : 0,
          displayLabel: getRegionalName(regional),
          sortKey: regional,
          items: regionalItems,
          displayLevel: "regional",
        }
      })
      .sort((a, b) => {
        if (a.regional === "M" || a.regional === "8") return 1
        if (b.regional === "M" || b.regional === "8") return -1
        return Number.parseInt(a.regional) - Number.parseInt(b.regional)
      })
  }, [data, selectedRegional])

  // Process data for regional-specific chart (when specific regional is selected)
  const regionalChartData = useMemo(() => {
    if (!selectedRegional || selectedRegional === "") return []

    const filteredDataByRegional = data.filter((item) => item.regional === selectedRegional)
    // Group by unit
    const unitGroups = filteredDataByRegional.reduce(
      (acc, item) => {
        const key = item.kode_unit
        if (!acc[key]) {
          acc[key] = {
            kode_unit: item.kode_unit,
            nama_unit: item.nama_unit,
            regional: item.regional,
            items: [],
          }
        }
        acc[key].items.push(item)
        return acc
      },
      {} as Record<string, { kode_unit: string; nama_unit: string; regional: string; items: DataItem[] }>,
    )

    return Object.values(unitGroups)
      .map((unitGroup) => {
        const sudahBerkontrak = unitGroup.items.filter((item) => {
          return datasAfdYgSudahBerkontrak.some(
            (kontrak) =>
              kontrak.region === item.regional && kontrak.unit === item.kode_unit && kontrak.afdeling === item.afdeling,
          )
        })

        const belumBerkontrak = unitGroup.items.filter((item) => {
          return !datasAfdYgSudahBerkontrak.some(
            (kontrak) =>
              kontrak.region === item.regional && kontrak.unit === item.kode_unit && kontrak.afdeling === item.afdeling,
          )
        })

        const sudah = sudahBerkontrak.length
        const belum = belumBerkontrak.length
        const total = sudah + belum

        return {
          regional: unitGroup.regional,
          kode_unit: unitGroup.kode_unit,
          afdeling: null,
          sudah,
          belum,
          total,
          percentage_sudah: total > 0 ? (sudah / total) * 100 : 0,
          percentage_belum: total > 0 ? (belum / total) * 100 : 0,
          displayLabel: unitGroup.nama_unit,
          sortKey: unitGroup.kode_unit,
          items: unitGroup.items,
          displayLevel: "unit",
        }
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [data, selectedRegional])

  // Filter data based on contract status
  const filteredData = useMemo(() => {
    let dataToFilter = data
    // Filter by selected regional if one is selected
    if (selectedRegional) {
      dataToFilter = data.filter((item) => item.regional === selectedRegional)
    }
    // Filter by selected unit if one is selected
    if (selectedUnit) {
      dataToFilter = dataToFilter.filter((item) => item.kode_unit === selectedUnit)
    }

    const sudahBerkontrak = dataToFilter.filter((item) => {
      return datasAfdYgSudahBerkontrak.some(
        (kontrak) =>
          kontrak.region === item.regional && kontrak.unit === item.kode_unit && kontrak.afdeling === item.afdeling,
      )
    })

    const belumBerkontrak = dataToFilter.filter((item) => {
      return !datasAfdYgSudahBerkontrak.some(
        (kontrak) =>
          kontrak.region === item.regional && kontrak.unit === item.kode_unit && kontrak.afdeling === item.afdeling,
      )
    })

    return {
      sudah: sudahBerkontrak,
      belum: belumBerkontrak,
    }
  }, [data, selectedRegional, selectedUnit])

  // Helper function to extract unit code and afdeling from personnel data
  const getPersonnelUnitAndAfdeling = (person: PersonnelData): { unit: string; afdeling: string } => {
    // Extract unit from personnel_subarea
    const unit = person.personnel_subarea || ""
    // Extract afdeling from desc_org_unit
    let afdeling = ""
    if (person.desc_org_unit) {
      // Look for AFD pattern in desc_org_unit
      const afdMatch = person.desc_org_unit.match(/AFD\d+/i)
      if (afdMatch) {
        afdeling = afdMatch[0].toUpperCase()
      }
    }
    return { unit, afdeling }
  }

  // Filter personnel data based on contract status
  const filteredPersonnelData = useMemo(() => {
    let personnelToFilter = personnelData
    // Filter by selected regional if one is selected
    if (selectedRegional) {
      personnelToFilter = personnelData.filter((person) => person.region === selectedRegional)
    }

    // Filter by selected unit if one is selected
    if (selectedUnit) {
      personnelToFilter = personnelToFilter.filter((person) => {
        const { unit } = getPersonnelUnitAndAfdeling(person)
        return unit === selectedUnit
      })
    }

    const sudahBerkontrakPersonnel = personnelToFilter.filter((person) => {
      const { unit, afdeling } = getPersonnelUnitAndAfdeling(person)
      // Check if this exact combination exists in datasAfdYgSudahBerkontrak
      return datasAfdYgSudahBerkontrak.some(
        (kontrak) => kontrak.region === person.region && kontrak.unit === unit && kontrak.afdeling === afdeling,
      )
    })

    const belumBerkontrakPersonnel = personnelToFilter.filter((person) => {
      const { unit, afdeling } = getPersonnelUnitAndAfdeling(person)
      // Personnel is "belum berkontrak" if:
      // 1. They have valid region, unit, and afdeling data
      // 2. Their combination is NOT in datasAfdYgSudahBerkontrak
      if (!person.region || !unit || !afdeling) {
        return false // Skip personnel with incomplete data
      }
      return !datasAfdYgSudahBerkontrak.some(
        (kontrak) => kontrak.region === person.region && kontrak.unit === unit && kontrak.afdeling === afdeling,
      )
    })

    return {
      sudah: sudahBerkontrakPersonnel,
      belum: belumBerkontrakPersonnel,
    }
  }, [personnelData, selectedRegional, selectedUnit])

  // Personnel summary by regional
  const personnelSummaryByRegional = useMemo(() => {
    const summary: Record<string, { sudah: number; belum: number; total: number }> = {}
    personnelData.forEach((person) => {
      const region = person.region
      if (!summary[region]) {
        summary[region] = { sudah: 0, belum: 0, total: 0 }
      }
      const { unit, afdeling } = getPersonnelUnitAndAfdeling(person)
      // Only count personnel with complete data
      if (region && unit && afdeling) {
        const isContracted = datasAfdYgSudahBerkontrak.some(
          (kontrak) => kontrak.region === person.region && kontrak.unit === unit && kontrak.afdeling === afdeling,
        )
        if (isContracted) {
          summary[region].sudah++
        } else {
          summary[region].belum++
        }
        summary[region].total++
      }
    })
    return summary
  }, [personnelData])

  // Create chart options function
  const createChartOptions = (chartData: ChartData[], chartTitle: string): ApexOptions => ({
    chart: {
      type: "bar",
      height: height,
      stacked: true,
      stackType: "100%",
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          pan: false,
        },
      },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const clickedData = chartData[config.dataPointIndex]
          setSelectedData(clickedData)
          if (!selectedRegional || selectedRegional === "") {
            // If we're in overview mode, set selected regional for drill down
            if (clickedData.displayLevel === "regional") {
              setSelectedRegional(clickedData.regional)
              setSelectedUnit(null)
            }
          } else {
            // If we're in regional mode, set selected unit and open modal
            if (clickedData.displayLevel === "unit") {
              setSelectedUnit(clickedData.kode_unit)
            }
          }
          setIsModalOpen(true)
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
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
      max: 100,
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
    colors: ["#10b981", "#64748b"],
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
          const seriesIndex = opts.seriesIndex
          if (seriesIndex === 0) {
            return `${item.sudah} ${item.displayLevel === "unit" ? "afdeling" : "blok"} dari ${item.total} total (${val.toFixed(1)}%)`
          } else {
            return `${item.belum} ${item.displayLevel === "unit" ? "afdeling" : "blok"} dari ${item.total} total (${val.toFixed(1)}%)`
          }
        },
      },
    },
  })

  // Create series data function
  const createChartSeries = (chartData: ChartData[]) => [
    {
      name: "Sudah Berkontrak",
      data: chartData.map((item) => item.percentage_sudah),
    },
    {
      name: "Belum Berkontrak",
      data: chartData.map((item) => item.percentage_belum),
    },
  ]

  return (
    <div className="w-full text-white h-full rounded-lg">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 h-full max-h-[800px] border border-slate-700 shadow-lg flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-medium text-slate-300 mb-2">
            Status Kontrak TBM -{" "}
            {!selectedRegional || selectedRegional === "" ? "Palm Co" : getRegionalName(selectedRegional)}
          </h2>
          <p className="text-sm text-slate-400">
            {!selectedRegional || selectedRegional === ""
              ? "Keseluruhan Perusahaan & Detail per Regional"
              : `Detail Regional: ${getRegionalName(selectedRegional)}`}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
                onClick={() => {
                  if (!selectedRegional || selectedRegional === "") {
                    setSelectedRegional(null)
                  }
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Detail Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[100vh] bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold text-white">
                    Detail Status Kontrak
                    {selectedRegional && (
                      <span className="text-sm font-normal text-slate-400 ml-2">
                        - {getRegionalName(selectedRegional)}
                      </span>
                    )}
                    {selectedUnit && <span className="text-sm font-normal text-slate-400 ml-2">- {selectedUnit}</span>}
                  </DialogTitle>
                  {(selectedRegional || selectedUnit) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRegional(null)
                        setSelectedUnit(null)
                      }}
                      className="text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
                    >
                      Tampilkan Semua
                    </Button>
                  )}
                </div>
              </DialogHeader>
              <Tabs defaultValue="belum" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                  <TabsTrigger value="belum" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Belum Berkontrak ({filteredData.belum.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="sudah"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Sudah Berkontrak ({filteredData.sudah.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="personnel-belum"
                    className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Personnel Belum Berkontrak ({filteredPersonnelData.belum.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="personnel-sudah"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Personnel Sudah Berkontrak ({filteredPersonnelData.sudah.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="belum" className="mt-4">
                  <div className="rounded-md border border-slate-700 max-h-96 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-800">
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Regional</TableHead>
                          <TableHead className="text-slate-300">Unit</TableHead>
                          <TableHead className="text-slate-300">Nama Unit</TableHead>
                          <TableHead className="text-slate-300">Afdeling</TableHead>
                          <TableHead className="text-slate-300">Blok</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Monev</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.belum.map((item, index) => (
                          <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="text-slate-300">{getRegionalName(item.regional)}</TableCell>
                            <TableCell className="text-slate-300">{item.kode_unit}</TableCell>
                            <TableCell className="text-slate-300">{item.nama_unit}</TableCell>
                            <TableCell className="text-slate-300">{item.afdeling}</TableCell>
                            <TableCell className="text-slate-300">{item.blok}</TableCell>
                            <TableCell>
                              <Badge variant="destructive" className="bg-red-600">
                                Belum Berkontrak
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.status_monev === "Sudah" ? "default" : "secondary"}
                                className={item.status_monev === "Sudah" ? "bg-green-600" : "bg-slate-600"}
                              >
                                {item.status_monev} ({item.list_monev.length})
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredData.belum.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                              Tidak ada data yang belum berkontrak
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="sudah" className="mt-4">
                  <div className="rounded-md border border-slate-700 max-h-96 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-800">
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Regional</TableHead>
                          <TableHead className="text-slate-300">Unit</TableHead>
                          <TableHead className="text-slate-300">Nama Unit</TableHead>
                          <TableHead className="text-slate-300">Afdeling</TableHead>
                          <TableHead className="text-slate-300">Blok</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Monev</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.sudah.map((item, index) => (
                          <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="text-slate-300">{getRegionalName(item.regional)}</TableCell>
                            <TableCell className="text-slate-300">{item.kode_unit}</TableCell>
                            <TableCell className="text-slate-300">{item.nama_unit}</TableCell>
                            <TableCell className="text-slate-300">{item.afdeling}</TableCell>
                            <TableCell className="text-slate-300">{item.blok}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-600">
                                Sudah Berkontrak
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.status_monev === "Sudah" ? "default" : "secondary"}
                                className={item.status_monev === "Sudah" ? "bg-green-600" : "bg-slate-600"}
                              >
                                {item.status_monev} ({item.list_monev.length})
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredData.sudah.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                              Tidak ada data yang sudah berkontrak
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="personnel-belum" className="mt-4">
                  <div className="mb-4 p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Rekap Personnel Belum Berkontrak
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Total Personnel</div>
                        <div className="text-xl font-bold text-orange-400">{filteredPersonnelData.belum.length}</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Regional Terbanyak</div>
                        <div className="text-sm font-semibold text-orange-400">
                          {Object.entries(personnelSummaryByRegional).sort((a, b) => b[1].belum - a[1].belum)[0]?.[0]
                            ? getRegionalName(
                                Object.entries(personnelSummaryByRegional).sort(
                                  (a, b) => b[1].belum - a[1].belum,
                                )[0][0],
                              )
                            : "N/A"}
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Laki-laki</div>
                        <div className="text-xl font-bold text-blue-400">
                          {filteredPersonnelData.belum.filter((p) => p.gender === "M").length}
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Perempuan</div>
                        <div className="text-xl font-bold text-pink-400">
                          {filteredPersonnelData.belum.filter((p) => p.gender === "F").length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-700 max-h-96 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-800">
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">SAP</TableHead>
                          <TableHead className="text-slate-300">Nama</TableHead>
                          <TableHead className="text-slate-300">Regional</TableHead>
                          <TableHead className="text-slate-300">Unit</TableHead>
                          <TableHead className="text-slate-300">Afdeling</TableHead>
                          <TableHead className="text-slate-300">Posisi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPersonnelData.belum.map((person, index) => {
                          const { unit, afdeling } = getPersonnelUnitAndAfdeling(person)
                          return (
                            <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                              <TableCell className="text-slate-300 font-mono text-xs">{person.sap}</TableCell>
                              <TableCell className="text-slate-300">{person.name}</TableCell>
                              <TableCell className="text-slate-300">{getRegionalName(person.region)}</TableCell>
                              <TableCell className="text-slate-300">{unit || "N/A"}</TableCell>
                              <TableCell className="text-slate-300">{afdeling || "N/A"}</TableCell>
                              <TableCell className="text-slate-300 text-xs">{person.desc_position}</TableCell>
                            </TableRow>
                          )
                        })}
                        {filteredPersonnelData.belum.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                              Tidak ada personnel yang belum berkontrak
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="personnel-sudah" className="mt-4">
                  <div className="mb-4 p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Rekap Personnel Sudah Berkontrak
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Total Personnel</div>
                        <div className="text-xl font-bold text-blue-400">{filteredPersonnelData.sudah.length}</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Regional Terbanyak</div>
                        <div className="text-sm font-semibold text-blue-400">
                          {Object.entries(personnelSummaryByRegional).sort((a, b) => b[1].sudah - a[1].sudah)[0]?.[0]
                            ? getRegionalName(
                                Object.entries(personnelSummaryByRegional).sort(
                                  (a, b) => b[1].sudah - a[1].sudah,
                                )[0][0],
                              )
                            : "N/A"}
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Laki-laki</div>
                        <div className="text-xl font-bold text-blue-400">
                          {filteredPersonnelData.sudah.filter((p) => p.gender === "M").length}
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-slate-400">Perempuan</div>
                        <div className="text-xl font-bold text-pink-400">
                          {filteredPersonnelData.sudah.filter((p) => p.gender === "F").length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-700 max-h-96 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-800">
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">SAP</TableHead>
                          <TableHead className="text-slate-300">Nama</TableHead>
                          <TableHead className="text-slate-300">Regional</TableHead>
                          <TableHead className="text-slate-300">Unit</TableHead>
                          <TableHead className="text-slate-300">Afdeling</TableHead>
                          <TableHead className="text-slate-300">Posisi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPersonnelData.sudah.map((person, index) => {
                          const { unit, afdeling } = getPersonnelUnitAndAfdeling(person)
                          return (
                            <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                              <TableCell className="text-slate-300 font-mono text-xs">{person.sap}</TableCell>
                              <TableCell className="text-slate-300">{person.name}</TableCell>
                              <TableCell className="text-slate-300">{getRegionalName(person.region)}</TableCell>
                              <TableCell className="text-slate-300">{unit || "N/A"}</TableCell>
                              <TableCell className="text-slate-300">{afdeling || "N/A"}</TableCell>
                              <TableCell className="text-slate-300 text-xs">{person.desc_position}</TableCell>
                            </TableRow>
                          )
                        })}
                        {filteredPersonnelData.sudah.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                              Tidak ada personnel yang sudah berkontrak
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
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
                <h3 className="text-lg font-medium text-slate-300 mb-3">Status Kontrak Palm Co (Keseluruhan)</h3>
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

        {/* Info Text */}
        <div className="mt-4">
          <p className="text-sm text-slate-400">
            {!selectedRegional || selectedRegional === ""
              ? "Menampilkan rekap keseluruhan Palm Co dan detail per regional"
              : `Menampilkan persentase afdeling yang sudah dan belum berkontrak per unit di ${getRegionalName(selectedRegional)}`}
            <span className="block text-xs text-slate-500 mt-1">
              💡 Klik pada chart untuk{" "}
              {!selectedRegional || selectedRegional === "" ? "drill down ke level regional" : "melihat detail data"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TBMContractStatusChart
