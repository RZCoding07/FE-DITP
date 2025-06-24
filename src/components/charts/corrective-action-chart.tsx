"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import type { CorrectiveActionData } from "@/types/api"
import { Target, CheckCircle } from "lucide-react"

interface CorrectiveActionChartProps {
  data: CorrectiveActionData[]
  onDataPointClick?: (data: CorrectiveActionData) => void
}

export function CorrectiveActionChart({ data, onDataPointClick }: CorrectiveActionChartProps) {
  const chartData = data
    .filter((item) => item.jumlah_corrective_action > 0)
    .sort((a, b) => b.persentase_corrective_action_selesai - a.persentase_corrective_action_selesai)
    .slice(0, 10)
    .map((item) => ({
      name: item.nama_unit.replace("KEBUN ", "").substring(0, 15),
      total: item.jumlah_corrective_action,
      selesai: item.jumlah_corrective_action_selesai,
      persentase: item.persentase_corrective_action_selesai,
      original: item,
    }))


    console.log("Chart Data:", chartData)

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 400,
      background: "transparent",
      foreColor: "#94a3b8",
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
    colors: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.8,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: "bold",
              color: "#ffffff",
            },
            value: {
              show: true,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#94a3b8",
              formatter: (val: string) => val + "%",
            },
            total: {
              show: true,
              label: "Total CA",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#94a3b8",
              formatter: () => {
                const total = chartData.reduce((sum, item) => sum + item.total, 0)
                return total.toString()
              },
            },
          },
        },
      },
    },
    labels: chartData.map((item) => item.name),
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, opts) => {
          const dataIndex = opts.dataPointIndex
          const item = chartData[dataIndex]
          return `${item.selesai}/${item.total} (${val.toFixed(1)}%)`
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: { colors: "#94a3b8" },
 
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }

  const series = chartData.map((item) => item.persentase)

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Corrective Action Progress</CardTitle>
            <CardDescription className="text-slate-400">
              Persentase penyelesaian corrective action per kebun
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ReactApexChart options={options} series={series} type="donut" height={400} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data corrective action tersedia</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
