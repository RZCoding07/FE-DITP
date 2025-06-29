"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import type { PlantationData } from "@/types/api"
import { MapPin, BarChart3 } from "lucide-react"

interface PlantationAreaChartProps {
  data: PlantationData[]
  onDataPointClick?: (data: PlantationData) => void
}

export function PlantationAreaChart({ data, onDataPointClick }: PlantationAreaChartProps) {
  const chartData = data
    .filter((item) => item.luas_blok_tu > 0)
    .sort((a, b) => b.luas_blok_tu - a.luas_blok_tu)
    .map((item) => ({
      name: item.nama_unit.replace("KEBUN ", "").substring(0, 15),
      area: item.luas_blok_tu,
      blocks: item.jumlah_blok_tu,
      original: item,
    }))

  const options: ApexOptions = {
    chart: {
      type: "area",
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
          if (onDataPointClick && chartData[dataIndex]) {
            onDataPointClick(chartData[dataIndex].original)
          }
        },
      },
    },
    colors: ["#3b82f6", "#10b981"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#1e40af", "#059669"],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
      },
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
    yaxis: [
      {
        title: {
          text: "Luas Area (Ha)",
          style: { color: "#3b82f6" },
        },
        labels: {
          style: { colors: "#94a3b8" },
          formatter: (val: number) => val.toFixed(0),
        },
      },
      {
        opposite: true,
        title: {
          text: "Jumlah Blok",
          style: { color: "#10b981" },
        },
        labels: {
          style: { colors: "#94a3b8" },
          formatter: (val: number) => val.toFixed(0),
        },
      },
    ],
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, opts) => {
          const seriesName = opts.seriesIndex === 0 ? "Ha" : "Blok"
          return `${val.toFixed(2)} ${seriesName}`
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
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
  }

  const series = [
    {
      name: "Luas Area (Ha)",
      data: chartData.map((item) => item.area),
    },
    {
      name: "Jumlah Blok",
      data: chartData.map((item) => item.blocks),
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Luas Area & Jumlah Blok</CardTitle>
            <CardDescription className="text-slate-400">
              Grafik kebun berdasarkan luas area dan jumlah blok
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ReactApexChart options={options} series={series} type="area" height={400} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data area tersedia</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
