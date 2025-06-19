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
}

export function JobPositionChartWithDialog({ data }: JobPositionChartProps) {
  const [selectedData, setSelectedData] = useState<JobPositionData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  console.log("JobPositionChart data:", data)

  const chartData = data
    .sort((a, b) => b.jumlah_monev - a.jumlah_monev)
    .map((item) => ({
      jabatan: item.jabatan,
      monev: item.jumlah_monev,
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
      height: 400,
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
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        distributed: false,
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.jabatan),
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
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
    yaxis: [
      {
        title: {
          text: "Jumlah Monev",
          style: {
            color: "#3b82f6",
          },
        },
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "10px",
          },
        },
        axisBorder: {
          show: true,
          color: "#334155",
        },
      },
      {
        opposite: true,
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
        },
      },
    ],
    fill: {
      opacity: 1,
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
        formatter: (val, opts) => {
          const seriesName = opts.seriesIndex === 0 ? "Monev" : opts.seriesIndex === 1 ? "Nilai" : "Bobot"
          return `${seriesName}: ${val.toFixed(2)}`
        },
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
      name: "Jumlah Monev",
      data: chartData.map((item) => item.monev),
    },
    {
      name: "Rata-rata Nilai",
      data: chartData.map((item) => item.nilai),
    },
    {
      name: "Rata-rata Bobot",
      data: chartData.map((item) => item.bobot),
    },
  ]

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Performance per Jabatan</CardTitle>
              <CardDescription className="text-slate-400">
                Analisis monitoring berdasarkan posisi jabatan - Klik bar untuk melihat detail karyawan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ReactApexChart options={options} series={series} type="bar" height={400} />
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
