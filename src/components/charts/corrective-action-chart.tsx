"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { useEffect, useState } from "react"
import axios from "axios"

interface CorrectiveActionData {
  nama_unit: string | null
  kode_unit: string
  jumlah_corrective_action: string
  jumlah_corrective_action_selesai: string
}

interface CorrectiveActionChartProps {
  data: any[]
  showTop10?: boolean
  region?: string // Tambahkan ini jika perlu
  start_date?: string // Tambahkan ini jika perlu
  end_date?: string // Tambahkan ini jika perlu
}

interface ChartData {
  name: string
  total: number
  completed: number
  completionRate: number
  kode_unit: string // Tambahkan ini
}

export function CorrectiveActionChart({ data, showTop10 = true, region, start_date, end_date }: CorrectiveActionChartProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailCa, setDetailCa] = useState([])

  // Process data
  const processDataByUnit = (data: CorrectiveActionData[]): ChartData[] => {
    const unitMap = new Map<string, { total: number; completed: number; kode_unit: string }>()

    data.forEach((item) => {
      const unitName = item.nama_unit?.replace("KEBUN ", "").substring(0, 15) ?? "Unknown Kebun"
      const totalActions = Number.parseInt(item.jumlah_corrective_action) || 0
      const completedActions = Number.parseInt(item.jumlah_corrective_action_selesai) || 0

      if (unitMap.has(unitName)) {
        const existing = unitMap.get(unitName)!
        unitMap.set(unitName, {
          total: existing.total + totalActions,
          completed: existing.completed + completedActions,
          kode_unit: existing.kode_unit // Pertahankan kode_unit yang ada
        })
      } else {
        unitMap.set(unitName, {
          total: totalActions,
          completed: completedActions,
          kode_unit: item.kode_unit // Simpan kode_unit bar
        })
      }
    })

    const result: ChartData[] = []
    unitMap.forEach((values, unitName) => {
      if (values.total > 0) {
        result.push({
          name: unitName,
          total: values.total,
          completed: values.completed,
          completionRate: Math.round((values.completed / values.total) * 100),
          kode_unit: values.kode_unit // Sertakan kode_unit
        })
      }
    })

    return result.sort((a, b) => b.total - a.total)
  }


  const allData = processDataByUnit(data)
  const chartData = showTop10 ? allData.slice(0, 10) : allData

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 'auto',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: { speed: 400 }
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.15,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.dataPointIndex
          const selected = chartData[index]
          console.log('Clicked data point:', selected)

          const apiUrl = import.meta.env.VITE_API_REPLANTING;

          const datas = axios.post(`${apiUrl}/api/d-rekap-ca-detail`, {
            kode_unit: selected.kode_unit,
            region: region,
            start_date: start_date,
            end_date: end_date
          }).then(response => {
            setDetailCa(response.data)
            console.log('Corrective action details:', response.data)
          }).catch(error => {
            console.error('Error fetching corrective action details:', error)
          })
          if (selected) {
            // You can handle the selected data point here, e.g., show a modal or update state
            console.log(`Selected unit: ${selected.name}, Total actions: ${selected.total}, Completed: ${selected.completed}, Rate: ${selected.completionRate}%`)
          }


        }
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: 'end',
        barHeight: '80%',
        columnWidth: '60%',
        dataLabels: {
          position: 'center',
          hideOverflowingLabels: false,
        },
      },
    },
    colors: ['#3B82F6'], // Single color for all bars
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#FFFFFF'],
      },
      offsetX: 10,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.8,
      }
    },
    stroke: {
      width: 1,
      colors: ['#0F172A'],
    },

    xaxis: {
      categories: chartData.map(item => item.name),
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '12px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#E2E8F0',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} actions`,
      },
      style: {
        fontSize: '14px',
      },
      marker: {
        show: true,
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[0].data[dataPointIndex]
        const completed = chartData[dataPointIndex].completed
        const rate = chartData[dataPointIndex].completionRate
        return `
          <div class="p-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <div class="text-sm font-bold text-slate-200">${w.globals.labels[dataPointIndex]}</div>
            <div class="text-sm text-slate-300">Total: ${data}</div>
            <div class="text-sm text-slate-300">Completed: ${completed}</div>
            <div class="text-sm text-slate-300">Completion: ${rate}%</div>
          </div>
        `
      }
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 500 },
          plotOptions: { bar: { barHeight: '70%' } },
          dataLabels: { enabled: false },
        },
      },
    ],
  }

  const series = [
    { name: 'Total Actions', data: chartData.map(item => item.total) }
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100 text-center font-bold text-lg">
          {showTop10 ? 'Top 10 Corrective Actions by Unit' : 'Corrective Actions by Unit'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={500}
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
            <p className="text-slate-400 text-center max-w-xs">
              No corrective actions data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}