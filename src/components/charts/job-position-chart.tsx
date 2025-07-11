"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import type { JobPositionData } from "@/types/api"
import { Users, Award } from "lucide-react"
import { EmployeeDialog } from "../employee-dialog"

interface JobPositionChartProps {
  data: JobPositionData[]
  regional?: string
  kode_unit?: string
  afdeling?: string
}

export function JobPositionChartWithDialog({ data }: JobPositionChartProps) {
  const [selectedData, setSelectedData] = useState<JobPositionData | null>(null)

  console.log("JobPositionChartWithDialog data:", data)
  const [dialogOpen, setDialogOpen] = useState(false)

  const chartData = data
    .map((item) => ({
      jabatan: item.jabatan,
      nilai: item.rata_rata_nilai,
      bobot: item.rata_rata_bobot,
      original: item,
    }))

  const handleDataPointClick = (data: JobPositionData) => {
    setSelectedData(data)
    setDialogOpen(true)
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      background: "transparent",
      foreColor: "#94a3b8",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const dataIndex = config.dataPointIndex
          if (chartData[dataIndex]) {
            handleDataPointClick(chartData[dataIndex].original)
          }
        },
      },
    },
    colors: ["#3b82f6", "#10b981"], // Warna biru untuk nilai, hijau untuk bobot

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
        dataLabels: { position: "top" },
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.jabatan),
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
        rotate: -45,
      },
      axisBorder: {
        show: true,
        color: "#334155",
      },
      axisTicks: {
        show: true,
        color: "#334155",
      },
    },
    yaxis: {
      title: {
        text: "Nilai & Bobot",
        style: {
          color: "#94a3b8",
        },
      },
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "10px",
        },
        formatter: (value) => `${value}%`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
      style: {
        fontSize: "10px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      offsetY: -20,
    },



    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: { colors: "#94a3b8" },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
    },
  }

  const series = [
    {
      name: "Nilai Monev",
      data: chartData.map((item) => item.nilai),
    },
    {
      name: "Persentase item yang dinilai (%)",
      data: chartData.map((item) => item.bobot),
    },
  ]

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Nilai & Bobot per Jabatan</CardTitle>
              <CardDescription className="text-slate-400">
                Perbandingan rata-rata nilai dan bobot berdasarkan posisi jabatan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ReactApexChart options={options} series={series} type="bar" />
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data jabatan tersedia</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeDialog data={selectedData} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}