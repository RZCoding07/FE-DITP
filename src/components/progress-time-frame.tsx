"use client"

import { useRef, useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface CorrectiveAction {
  id: string
  bulan: string
  tahun: string
  regional: string
  kebun: string
  afdeling: string
  tahun_tanam: string
  vegetatif_id: string
  why1: string
  why2: string
  why3: string
  blok: string
  value_pi: string
  keterangan: string
  corrective_ca: string
  corrective_value: string
  corrective_start_date: string
  corrective_end_date: string
  corrective_budget_available: string
  project_id: string | null
  max_progress_percentage: number | null
  status_penyelesaian: "Selesai" | "Belum Selesai"
  durasi_ca: "Jangka Pendek" | "Jangka Menengah" | "Jangka Panjang"
}

interface ProgressByTimeframeProps {
  isDarkMode: boolean
  data: CorrectiveAction[]
}

interface ModalData {
  title: string
  status: "Selesai" | "Belum Selesai"
  duration: "Jangka Pendek" | "Jangka Menengah" | "Jangka Panjang"
}

const CorrectiveActionsModal = ({ 
  data,
  isOpen,
  onClose,
  modalData
}: {
  data: CorrectiveAction[]
  isOpen: boolean
  onClose: () => void
  modalData: ModalData | null
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CorrectiveAction
    direction: "ascending" | "descending"
  } | null>(null)

  const filteredData = data.filter(item => {
    if (!modalData) return false
    return (
      item.status_penyelesaian === modalData.status &&
      item.durasi_ca === modalData.duration
    )
  })

  const searchedData = filteredData.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.blok.toLowerCase().includes(searchLower) ||
      item.kebun.toLowerCase().includes(searchLower) ||
      item.afdeling.toLowerCase().includes(searchLower) ||
      item.corrective_ca.toLowerCase().includes(searchLower) ||
      item.regional.toLowerCase().includes(searchLower)
    )
  })

  const sortedData = [...searchedData].sort((a, b) => {
    if (!sortConfig) return 0
    const key = sortConfig.key

    // Add null/undefined check for a[key] and b[key]
    const aValue = a[key] ?? ""
    const bValue = b[key] ?? ""

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof CorrectiveAction) => {
    let direction: "ascending" | "descending" = "ascending"
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIndicator = (key: keyof CorrectiveAction) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }


    const getBarColor = (value: number) => {
    if (value > 93) return "#34a853"; // Hijau
    if (value > 70) return "#46bdc6"; // Biru
    if (value > 50) return "#fbbc04"; // Kuning
    return "#ea4335"; // Merah
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modalData?.title} - {modalData?.status}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Input
            placeholder="Cari berdasarkan blok, kebun, afdeling, atau tindakan korektif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  onClick={() => requestSort("regional")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Regional{getSortIndicator("regional")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("kebun")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Kebun{getSortIndicator("kebun")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("afdeling")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Afdeling{getSortIndicator("afdeling")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("blok")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Blok{getSortIndicator("blok")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("why3")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Akar Masalah {getSortIndicator("why3")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("corrective_ca")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Tindakan Korektif{getSortIndicator("corrective_ca")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("corrective_start_date")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Mulai{getSortIndicator("corrective_start_date")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("corrective_end_date")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Selesai{getSortIndicator("corrective_end_date")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("corrective_budget_available")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Anggaran{getSortIndicator("corrective_budget_available")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("value_pi")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Nilai PI{getSortIndicator("value_pi")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("corrective_value")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Nilai CA{getSortIndicator("corrective_value")}
                </TableHead>
                <TableHead 
                  onClick={() => requestSort("max_progress_percentage")}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Progress CA{getSortIndicator("max_progress_percentage")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.regional}</TableCell>
                    <TableCell>{item.kebun}</TableCell>
                    <TableCell>{item.afdeling}</TableCell>
                    <TableCell>{item.blok}</TableCell>
                    <TableCell>{item.why3}</TableCell>
                    <TableCell>{item.corrective_ca}</TableCell>
                    <TableCell>
                      {new Date(item.corrective_start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(item.corrective_end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.corrective_budget_available ? "Tersedia" : "Tidak Tersedia"}</TableCell>
                    <TableCell>{item.value_pi}</TableCell>
                    <TableCell>{Math.round(Number(item.corrective_value) * 100) / 100}</TableCell>
                    <TableCell>
                      <span className="ml-2">
                        {item.max_progress_percentage ? `${Math.round(item.max_progress_percentage)}%` : "0%"}
                      </span>
                      <Progress value={parseFloat(String(item.max_progress_percentage ?? "0"))} bgColor={getBarColor(parseFloat(String(item.max_progress_percentage ?? "0")))} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ProgressByTimeframe = ({ isDarkMode, data }: ProgressByTimeframeProps) => {
  const shortTermRef = useRef<HighchartsReact.RefObject>(null)
  const mediumTermRef = useRef<HighchartsReact.RefObject>(null)
  const longTermRef = useRef<HighchartsReact.RefObject>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [selectedData, setSelectedData] = useState<CorrectiveAction[]>([])

  const textColor = isDarkMode ? "#e0e0e0" : "#333333"

  const calculateCompletion = () => {
    const counts = {
      shortTerm: { completed: 0, total: 0 },
      mediumTerm: { completed: 0, total: 0 },
      longTerm: { completed: 0, total: 0 },
    }

    data.forEach(item => {
      const isCompleted = item.status_penyelesaian === 'Selesai'
      
      switch(item.durasi_ca) {
        case 'Jangka Pendek':
          counts.shortTerm.total++
          if (isCompleted) counts.shortTerm.completed++
          break
        case 'Jangka Menengah':
          counts.mediumTerm.total++
          if (isCompleted) counts.mediumTerm.completed++
          break
        case 'Jangka Panjang':
          counts.longTerm.total++
          if (isCompleted) counts.longTerm.completed++
          break
      }
    })

    return {
      shortTerm: {
        completed: counts.shortTerm.total > 0 ? (counts.shortTerm.completed / counts.shortTerm.total) * 100 : 0,
        notCompleted: counts.shortTerm.total > 0 ? 100 - (counts.shortTerm.completed / counts.shortTerm.total) * 100 : 100
      },
      mediumTerm: {
        completed: counts.mediumTerm.total > 0 ? (counts.mediumTerm.completed / counts.mediumTerm.total) * 100 : 0,
        notCompleted: counts.mediumTerm.total > 0 ? 100 - (counts.mediumTerm.completed / counts.mediumTerm.total) * 100 : 100
      },
      longTerm: {
        completed: counts.longTerm.total > 0 ? (counts.longTerm.completed / counts.longTerm.total) * 100 : 0,
        notCompleted: counts.longTerm.total > 0 ? 100 - (counts.longTerm.completed / counts.longTerm.total) * 100 : 100
      },
      counts
    }
  }

  const completionData = calculateCompletion()

  const baseChartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "none",
      height: 300,
      style: {
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
    },
    title: { text: "" },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ({point.custom.count})",
    },
    accessibility: { point: { valueSuffix: "%" } },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "55%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: { color: textColor, textOutline: "none" },
        },
      },
    },
    credits: { enabled: false },
  }

  const handlePieClick = (duration: "Jangka Pendek" | "Jangka Menengah" | "Jangka Panjang", 
                         status: "Selesai" | "Belum Selesai") => {
    const title = `${duration} - ${status}`
    setModalData({
      title,
      status,
      duration
    })
    
    const filtered = data.filter(item => 
      item.durasi_ca === duration && 
      item.status_penyelesaian === status
    )
    setSelectedData(filtered)
    setModalOpen(true)
  }

  const shortTermOptions: Highcharts.Options = {
    ...baseChartOptions,
    plotOptions: {
      pie: {
        ...baseChartOptions.plotOptions?.pie,
        colors: isDarkMode ? ["#66b3ff", "#99ccff"] : ["#66b3ff", "#99ccff"],
        point: {
          events: {
            click: function() {
              handlePieClick("Jangka Pendek", this.name === "Selesai" ? "Selesai" : "Belum Selesai")
            }
          }
        }
      },
    },
    series: [{
      name: "Progress",
      type: "pie",
      data: [
        {
          name: "Selesai",
          y: completionData.shortTerm.completed,
          custom: {
            count: completionData.counts.shortTerm.completed
          }
        },
        {
          name: "Belum Selesai",
          y: completionData.shortTerm.notCompleted,
          custom: {
            count: completionData.counts.shortTerm.total - completionData.counts.shortTerm.completed
          }
        },
      ],
    }],
  }

  const mediumTermOptions: Highcharts.Options = {
    ...baseChartOptions,
    plotOptions: {
      pie: {
        ...baseChartOptions.plotOptions?.pie,
        colors: isDarkMode ? ["#3399ff", "#66b3ff"] : ["#3399ff", "#66b3ff"],
        point: {
          events: {
            click: function() {
              handlePieClick("Jangka Menengah", this.name === "Selesai" ? "Selesai" : "Belum Selesai")
            }
          }
        }
      },
    },
    series: [{
      name: "Progress",
      type: "pie",
      data: [
        {
          name: "Selesai",
          y: completionData.mediumTerm.completed,
          custom: {
            count: completionData.counts.mediumTerm.completed
          }
        },
        {
          name: "Belum Selesai",
          y: completionData.mediumTerm.notCompleted,
          custom: {
            count: completionData.counts.mediumTerm.total - completionData.counts.mediumTerm.completed
          }
        },
      ],
    }],
  }

  const longTermOptions: Highcharts.Options = {
    ...baseChartOptions,
    plotOptions: {
      pie: {
        ...baseChartOptions.plotOptions?.pie,
        colors: isDarkMode ? ["#6680b3", "#0066cc"] : ["#6680b3", "#0066cc"],
        point: {
          events: {
            click: function() {
              handlePieClick("Jangka Panjang", this.name === "Selesai" ? "Selesai" : "Belum Selesai")
            }
          }
        }
      },
    },
    series: [{
      name: "Progress",
      type: "pie",
      data: [
        {
          name: "Selesai",
          y: completionData.longTerm.completed,
          custom: {
            count: completionData.counts.longTerm.completed
          }
        },
        {
          name: "Belum Selesai",
          y: completionData.longTerm.notCompleted,
          custom: {
            count: completionData.counts.longTerm.total - completionData.counts.longTerm.completed
          }
        },
      ],
    }],
  }

  useEffect(() => {
    const refs = [shortTermRef, mediumTermRef, longTermRef]
    refs.forEach((ref) => {
      if (ref.current && ref.current.chart) {
        ref.current.chart.update({
          plotOptions: {
            pie: {
              dataLabels: {
                style: { color: textColor },
              },
            },
          },
        })
      }
    })
  }, [isDarkMode, textColor])

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-lg shadow-md text-center">
      <div className="progress-charts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-4 gap-4">
        <div className="p-2">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Jangka Pendek (≤4 Bulan)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total: {completionData.counts.shortTerm.total}
          </p>
          <hr className="my-2 border-cyan-600 mx-4" />
          <HighchartsReact 
            highcharts={Highcharts} 
            options={shortTermOptions} 
            ref={shortTermRef} 
          />
        </div>
        
        <div className="p-2">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Jangka Menengah (5-8 Bulan)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total: {completionData.counts.mediumTerm.total}
          </p>
          <hr className="my-2 border-cyan-600 mx-4" />
          <HighchartsReact 
            highcharts={Highcharts} 
            options={mediumTermOptions} 
            ref={mediumTermRef} 
          />
        </div>
        
        <div className="p-2">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Jangka Panjang (9-12 Bulan)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total: {completionData.counts.longTerm.total}
          </p>
          <hr className="my-2 border-cyan-600 mx-4" />
          <HighchartsReact 
            highcharts={Highcharts} 
            options={longTermOptions} 
            ref={longTermRef} 
          />
        </div>
      </div>
      
      <CorrectiveActionsModal
        data={selectedData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modalData={modalData}
      />
    </div>
  )
}

export default ProgressByTimeframe