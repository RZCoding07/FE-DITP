"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

interface CorrectiveActionData {
  nama_unit: string
  jumlah_corrective_action: string
  jumlah_corrective_action_selesai: string
}

interface CorrectiveActionChartProps {
  data: any[]
}

interface ChartData {
  name: string
  value: number
}

export function CorrectiveActionChart({ data }: CorrectiveActionChartProps) {
  // Process data
  const processData = (data: CorrectiveActionData[], key: keyof CorrectiveActionData): ChartData[] => {
    return data
      .filter((item) => Number.parseInt(item.jumlah_corrective_action) > 0)
      .map((item) => ({
        name: item.nama_unit.replace("KEBUN ", ""),
        value: Number.parseInt(item[key] as string),
      }))
  }

  const totalActionData = processData(data, "jumlah_corrective_action")
  const completedActionData = processData(data, "jumlah_corrective_action_selesai")

  const totalActionsSum = totalActionData.reduce((sum, item) => sum + item.value, 0)
  const completedActionsSum = completedActionData.reduce((sum, item) => sum + item.value, 0)

  const getChartOptions = (isCompleted = false): ApexOptions => ({
    chart: {
      type: "donut",
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#94a3b8",
              offsetY: -10,
              formatter: (val) => val,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              offsetY: 5,
              formatter: (val) => val.toString(),
            },
            total: {
              show: true,
              showAlways: true,
              label: isCompleted ? "COMPLETED" : "TOTAL ACTIONS",
              color: "#94a3b8",
              fontSize: "12px",
              fontWeight: 600,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                return total.toString()
              },
            },
          },
        },
        startAngle: -90,
        endAngle: 270,
        expandOnClick: false,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      markers: {
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
      labels: {
        colors: "#e2e8f0",
        useSeriesColors: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => Math.round(val) + "%",
      style: {
        fontSize: "11px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.8,
      },
      background: {
        enabled: false, 
      },
    },
    stroke: {
      width: 2,
      colors: ["#0f172a"],
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#06B6D4"],
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      style: {
        fontSize: "14px",
      },
      y: {
        formatter: (value) => `${value} actions`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
            height: 300,
          },
          legend: {
            position: "bottom",
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  name: {
                    fontSize: "14px",
                  },
                  value: {
                    fontSize: "20px",
                  },
                  total: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
        },
      },
    ],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: isCompleted
          ? ["#60A5FA", "#34D399", "#FCD34D", "#FCA5A5", "#C4B5FD", "#F9A8D4", "#2DD4BF", "#FB923C", "#22D3EE"]
          : ["#1D4ED8", "#059669", "#B45309", "#B91C1C", "#7E22CE", "#BE185D", "#0D9488", "#EA580C", "#0891B2"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Total Corrective Action Chart */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-center">Total Progress Corrective Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {totalActionsSum > 0 ? (
            <ReactApexChart
              options={{
                ...getChartOptions(false),
                labels: totalActionData.map((item) => item.name),
              }}
              series={totalActionData.map((item) => item.value)}
              type="donut"
              height={350}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-slate-400 text-center max-w-xs">No corrective actions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Corrective Action Chart */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-center">Completed Corrective Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {completedActionsSum > 0 ? (
            <ReactApexChart
              options={{
                ...getChartOptions(true),
                labels: completedActionData.map((item) => item.name),
              }}
              series={completedActionData.map((item) => item.value)}
              type="donut"
              height={350}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-slate-400 text-center max-w-xs">No completed corrective actions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
