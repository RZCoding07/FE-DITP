import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type BarMonitoringProps = {
  pbj: any[];
  penyusunanDokumen: any[];
  sppbj: any[];
  hps: any[];
  reg: any[];
};

export default function BarMonitoring({
  pbj = [],
  penyusunanDokumen = [],
  sppbj = [],
  hps = [],
  reg = [],
}: BarMonitoringProps) {
  const [mounted, setMounted] = useState(false)
  console.log(sppbj)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Process the data for the chart using actual parameter data
  const processDataForChart = () => {
    // Safety checks - return empty data if reg is empty or undefined
    if (!reg || reg.length === 0) {
      return {
        series: [
          { name: "SPPBJ", data: [] },
          { name: "PBJ", data: [] },
          { name: "HPS", data: [] },
          { name: "Penyusunan Dokumen", data: [] },
        ],
        categories: [],
        totals: [],
        countsByJenisAndKategori: {},
        totalsByJenis: {},
        uniqueJenis: [],
      }
    }

    // Get unique jenis values from reg array - extract the jenis property
    const uniqueJenis =
      reg && reg.length > 0
        ? reg.map((item, index) => {
          // Handle different possible structures
          if (typeof item === "string") {
            return item
          } else if (item && typeof item === "object") {
            // Try different possible property names
            return item.jenis || item.name || item.label || `Item ${index}`
          } else if (Array.isArray(item) && item.length > 0) {
            // If reg items are arrays, try to get a meaningful value
            return item[0] || `Item ${index}`
          }
          return `Item ${index}`
        })
        : []

    if (uniqueJenis.length === 0) {
      return {
        series: [
          { name: "SPPBJ", data: [] },
          { name: "PBJ", data: [] },
          { name: "HPS", data: [] },
          { name: "Penyusunan Dokumen", data: [] },
        ],
        categories: [],
        totals: [],
        countsByJenisAndKategori: {},
        totalsByJenis: {},
        uniqueJenis: [],
      }
    }

    // Initialize count objects
    const countsByJenisAndKategori: Record<string, Record<string, number>> = {}
    const totalsByJenis: Record<string, number> = {}

    uniqueJenis.forEach((jenis) => {
      countsByJenisAndKategori[jenis] = {
        "Penyusunan Dokumen": 0,
        HPS: 0,
        PBJ: 0,
        SPPBJ: 0,
      }
      totalsByJenis[jenis] = 0
    })

    // Count items from penyusunanDokumen array - use index 24 for jenis
    if (penyusunanDokumen && Array.isArray(penyusunanDokumen)) {
      penyusunanDokumen.forEach((item) => {
        if (Array.isArray(item) && item.length > 24 && item[24]) {
          const jenisValue = item[24]
          // Find matching jenis in uniqueJenis array
          const matchingJenis = uniqueJenis.find((jenis) => jenis === jenisValue)
          if (matchingJenis && countsByJenisAndKategori[matchingJenis]) {
            countsByJenisAndKategori[matchingJenis]["Penyusunan Dokumen"]++
            totalsByJenis[matchingJenis]++
          }
        }
      })
    }

    // Count items from hps array - use index 24 for jenis
    if (hps && Array.isArray(hps)) {
      hps.forEach((item) => {
        if (Array.isArray(item) && item.length > 24 && item[24]) {
          const jenisValue = item[24]
          const matchingJenis = uniqueJenis.find((jenis) => jenis === jenisValue)
          if (matchingJenis && countsByJenisAndKategori[matchingJenis]) {
            countsByJenisAndKategori[matchingJenis]["HPS"]++
            totalsByJenis[matchingJenis]++
          }
        }
      })
    }

    // Count items from pbj array - use index 24 for jenis
    if (pbj && Array.isArray(pbj)) {
      pbj.forEach((item) => {
        if (Array.isArray(item) && item.length > 24 && item[24]) {
          const jenisValue = item[24]
          const matchingJenis = uniqueJenis.find((jenis) => jenis === jenisValue)
          if (matchingJenis && countsByJenisAndKategori[matchingJenis]) {
            countsByJenisAndKategori[matchingJenis]["PBJ"]++
            totalsByJenis[matchingJenis]++
          }
        }
      })
    }

    // Count items from sppbj array - use index 24 for jenis
    if (sppbj && Array.isArray(sppbj)) {
      sppbj.forEach((item) => {
        if (Array.isArray(item) && item.length > 24 && item[24]) {
          const jenisValue = item[24]
          const matchingJenis = uniqueJenis.find((jenis) => jenis === jenisValue)
          if (matchingJenis && countsByJenisAndKategori[matchingJenis]) {
            countsByJenisAndKategori[matchingJenis]["SPPBJ"]++
            totalsByJenis[matchingJenis]++
          }
        }
      })
    }

    // Calculate percentages
    const percentagesByJenisAndKategori: Record<string, Record<string, number>> = {}

    uniqueJenis.forEach((jenis) => {
      percentagesByJenisAndKategori[jenis] = {
        "Penyusunan Dokumen": 0,
        HPS: 0,
        PBJ: 0,
        SPPBJ: 0,
      }

      const total = totalsByJenis[jenis]
      if (total > 0) {
        Object.keys(countsByJenisAndKategori[jenis]).forEach((kategori) => {
          const count = countsByJenisAndKategori[jenis][kategori]
          percentagesByJenisAndKategori[jenis][kategori] = (count / total) * 100
        })
      }
    })

    // Prepare series data for ApexCharts (in reverse order to match the original chart)
    const series = [
      {
        name: "SPPBJ",
        data: uniqueJenis.map((jenis) => percentagesByJenisAndKategori[jenis]["SPPBJ"]),
      },
      {
        name: "PBJ",
        data: uniqueJenis.map((jenis) => percentagesByJenisAndKategori[jenis]["PBJ"]),
      },
      {
        name: "HPS",
        data: uniqueJenis.map((jenis) => percentagesByJenisAndKategori[jenis]["HPS"]),
      },
      {
        name: "Penyusunan Dokumen",
        data: uniqueJenis.map((jenis) => percentagesByJenisAndKategori[jenis]["Penyusunan Dokumen"]),
      },
    ]

    return {
      series,
      categories: uniqueJenis,
      totals: uniqueJenis.map((jenis) => totalsByJenis[jenis]),
      countsByJenisAndKategori,
      totalsByJenis,
      uniqueJenis,
    }
  }

  const chartData = processDataForChart()

  // Chart options
  const chartOptions = {
    chart: {
      type: "bar" as const,
      stacked: true,
      toolbar: {
        show: false,
      },
      stackType: "100%" as const,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        // Get the actual percentage value
        const seriesIndex = opts.seriesIndex
        const dataPointIndex = opts.dataPointIndex
        const actualValue = chartData.series[seriesIndex].data[dataPointIndex]

        // Only show label if percentage is greater than 5% to avoid clutter
        if (actualValue > 5) {
          return actualValue.toFixed(1) + "%"
        }
        return ""
      },
      style: {
        fontSize: "10px",
        fontWeight: "medium",
        colors: ["#FFFFFF"],
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "10px",
          colors: "white",
        },
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val: number) => val.toFixed(0) + "%",
        style: {
          colors: "white",
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      position: "top" as const,
      labels: {
        colors: "#FFFFFF",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#006064", "#00897B", "#FFA000", "#757575"], // Teal, Light Teal, Orange, Gray
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          const seriesIndex = opts.seriesIndex
          const dataPointIndex = opts.dataPointIndex
          const jenis = chartData.categories[dataPointIndex]
          const kategori = chartData.series[seriesIndex].name
          const count = chartData.countsByJenisAndKategori[jenis]?.[kategori] || 0
          const total = chartData.totalsByJenis[jenis] || 0

          return `${count} dari ${total} (${val.toFixed(1)}%)`
        },
      },
      theme: "dark",
    },
  }

  // Calculate total items by category from actual data with safety checks
  const totalsByCategory = {
    "Penyusunan Dokumen": penyusunanDokumen ? penyusunanDokumen.length : 0,
    HPS: hps ? hps.length : 0,
    PBJ: pbj ? pbj.length : 0,
    SPPBJ: sppbj ? sppbj.length : 0,
    Total: (penyusunanDokumen?.length || 0) + (hps?.length || 0) + (pbj?.length || 0) + (sppbj?.length || 0),
  }

  if (!mounted) return null

  // Add this check before the return statement
  if (!chartData.categories || chartData.categories.length === 0) {
    return (
      <div className="flex-1">
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-gray-400">No data available</div>
            <div className="text-sm text-gray-500">Please provide valid data to display the chart</div>
            <div className="mt-4 text-xs text-gray-600">
              Debug info: reg length = {reg?.length || 0}, pbj length = {pbj?.length || 0}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Summary Statistics */}


      {/* Chart Card */}
      <Card className="border-0 bg-slate-950">
        <CardHeader>
          <CardTitle className="text-white mb-4 text-lg flex justify-between items-center">
            <div className="flex items-center">
              <img width="28" height="28" src="https://img.icons8.com/fluency/48/combo-chart--v1.png" alt="combo-chart--v1" />
              <span className="ml-2"> Monitoring Progress Investasi Off Farm</span>
            </div>
          </CardTitle>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{totalsByCategory["Penyusunan Dokumen"]}</div>
              <div className="text-sm text-gray-300">Penyusunan Dokumen</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{totalsByCategory.HPS}</div>
              <div className="text-sm text-gray-300">HPS</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="text-2xl font-bold text-teal-400">{totalsByCategory.PBJ}</div>
              <div className="text-sm text-gray-300">PBJ</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{totalsByCategory.SPPBJ}</div>
              <div className="text-sm text-gray-300">SPPBJ</div>
            </div>
            <div className="rounded-lg bg-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-white">{totalsByCategory.Total}</div>
              <div className="text-sm text-gray-300">Total</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[500px]">
            {mounted && (
              <ReactApexChart
                options={chartOptions}
                series={chartData.series}
                type="bar"
                height="100%"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}