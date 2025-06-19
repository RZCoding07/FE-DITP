"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import type { MonitoringData } from "@/types/api"
import { TrendingUp, Eye } from "lucide-react"

interface MonitoringOverviewChartProps {
  data: MonitoringData[]
  onDataPointClick?: (data: MonitoringData) => void
}

export function MonitoringOverviewChart({ data, onDataPointClick }: MonitoringOverviewChartProps) {
  const chartData = data
    .filter((item) => item.persentase_monev > 0)
    .sort((a, b) => b.persentase_monev - a.persentase_monev)
    .slice(0, 15)
    .map((item) => ({
      name: item.nama.replace("KEBUN ", "").substring(0, 15),
      monitoring: item.persentase_monev,
      score: item.rata_rata_nilai,
      compliance: item.persentase_kesesuaian,
      original: item,
    }))

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
      },
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
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
        text: "Persentase (%)",
        style: { color: "#94a3b8" },
      },
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (val: number) => val.toFixed(0) + "%",
      },
    },
    fill: {
      opacity: 0.9,
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#1e40af", "#059669", "#d97706"],
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
        formatter: (val: number) => val.toFixed(2) + "%",
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
      name: "Monitoring (%)",
      data: chartData.map((item) => item.monitoring),
    },
    {
      name: "Nilai Rata-rata",
      data: chartData.map((item) => item.score),
    },
    {
      name: "Kesesuaian (%)",
      data: chartData.map((item) => item.compliance),
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Overview Monitoring Kebun</CardTitle>
              <CardDescription className="text-slate-400">
                Top 15 kebun berdasarkan persentase monitoring
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="h-4 w-4" />
            <span className="text-sm">Klik untuk detail</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ReactApexChart options={options} series={series} type="bar" height={400} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
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
