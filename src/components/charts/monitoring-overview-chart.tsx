"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import type { MonitoringData } from "@/types/api"
import { TrendingUp, Eye } from "lucide-react"
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu"

interface MonitoringOverviewChartProps {
  data: any[]
  region?: string
  kode_unit?: string
  onDataPointClick?: (data: MonitoringData) => void
}

export function MonitoringOverviewChart({ data, region, kode_unit, onDataPointClick }: MonitoringOverviewChartProps) {

console.log("Rendering Monitoring Overview Chart",data)


  const regionalName =  [
        {
            "kode_regional": "1",
            "regional": "Regional 1"
        },
        {
            "kode_regional": "2",
            "regional": "Regional 2"
        },
        {
            "kode_regional": "3",
            "regional": "Regional 3"
        },
        {
            "kode_regional": "4",
            "regional": "Regional 4"
        },
        {
            "kode_regional": "5",
            "regional": "Regional 5"
        },
        {
            "kode_regional": "6",
            "regional": "Regional 6"
        },
        {
            "kode_regional": "7",
            "regional": "Regional 7"
        },
        {
            "kode_regional": "8",
            "regional": "KSO Sulawesi"
        },
        {
            "kode_regional": "M",
            "regional": "KSO Ex N2"
        }
    ]

    console.log("Data received for chart", data)
  const chartData = data
    .map((item) => ({
      name: item.nama,
      monitoring: item.persentase_monev,
      score: item.rata_rata_nilai,
      compliance: item.persentase_kesesuaian,
      original: item,
    }))

    console.log("Processed Chart Data", chartData)

  // Function to get color based on monitoring percentage
  const getColorByValue = (value: number) => {
    if (value >= 80) return "#10b981" // Green
    if (value >= 60) return "#f59e0b" // Yellow
    return "#ef4444" // Red
  }

  // Create colors array based on monitoring values
  const monitoringColors = chartData.map((item) => getColorByValue(item.score))

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: "100%",
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
          if (onDataPointClick && chartData[dataIndex]) {
            onDataPointClick(chartData[dataIndex].original)
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 8,
        dataLabels: { position: "top" },
        distributed: true, // Enable distributed colors
      },
    },
    colors: [...monitoringColors, "#3b82f6"], // First series uses conditional colors, second series uses blue
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        // Show percentage only for first series (monitoring)
        if (opts.seriesIndex === 0) {
          return val.toFixed(1) 
        }
        return val.toFixed(1) + "%"
      },
      style: {
        fontSize: "10px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      offsetY: -20,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px" },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Nilai",
        style: { color: "#94a3b8" },
      },
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (val: number) => val.toFixed(0),
      },
    },
    fill: {
      opacity: 0.9,
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
      },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, opts: any) => {
          // Show percentage only for first series (monitoring)
          if (opts.seriesIndex === 0) {
            return val.toFixed(2) + "%"
          }
          return val.toFixed(2)
        },
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "#94a3b8" },
    },
  }

  const series = [
    {
      name: "Nilai Monev",
      data: chartData.map((item) => item.score),
    },
    {
      name: "Persentase jumlah blok yang sudah di Monev (%)",
      data: chartData.map((item) => item.monitoring),
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              {region ? (
                <CardTitle className="text-white text-xl">
                  Overview Monitoring Kebun {regionalName.find(r => r.kode_regional === region)?.regional}
                </CardTitle>
              ) : (
                <CardTitle className="text-white text-xl">
                  Overview Monitoring Regional
                </CardTitle>
              )}
              <CardDescription className="text-slate-400">
                Grafik kebun berdasarkan persentase monitoring
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="h-4 w-4" />
            <span className="text-sm">Klik untuk detail</span>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-300">80-100 (Baik)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">60-79 (Sedang)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-300">{"<60 (Kurang)"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[400px]">
        {chartData.length > 0 ? (
          <div className="h-full w-full">
            <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data monitoring tersedia</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
