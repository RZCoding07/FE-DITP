"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
  Legend,
  LabelList,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

interface SelectOption {
  value: string
  label: string
}

type KebunOption = SelectOption | null

interface ProblemIdentificationChartProps {
  isDarkMode: boolean
  rpc?: string
  kebun?: any
  afd?: string
  ctg?: string
  bulan?: string
  tahun?: string
  picaResults?: any[]
}

// Helper function to analyze data structure


const ProblemIdentificationChart: React.FC<ProblemIdentificationChartProps> = ({
  isDarkMode,
  rpc,
  kebun,
  afd,
  ctg,
  bulan,
  tahun,
  picaResults,
}) => {
  const [theme, setTheme] = useState<string>("light")
  const [numProblems, setNumProblems] = useState<string>("5")
  const [colorFilter, setColorFilter] = useState<string>("all")
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {


    if (!picaResults || picaResults.length === 0) {
      console.log("❌ No picaResults data provided")
      setChartData([])
      setLoading(false)
      setDebugInfo({ error: "No data provided", originalLength: 0, filteredLength: 0 })
      return
    }

    setLoading(true)

    // Start with all data
    let filteredData = [...picaResults]
    const originalLength = filteredData.length

    console.log("📊 Original data length:", originalLength)

    // Add this right after the console.log for original data length
    console.log("📊 Sample data structure:", filteredData[0])

    // Apply filters step by step with logging
    const filterSteps: string[] = []

    // CTG filter (special handling for TBM)
    if (ctg && ctg !== "all" && ctg !== "") {
      const beforeLength = filteredData.length
      if (ctg === "tbm-all") {
        filteredData = filteredData.filter(
          (item) => item.vw_fase_tbm && item.vw_fase_tbm.toString().toLowerCase().startsWith("tbm"),
        )
        filterSteps.push(`CTG TBM-ALL: ${beforeLength} → ${filteredData.length}`)
      } else {
        filteredData = filteredData.filter((item) => item.colorCategory === ctg || item.vw_fase_tbm === ctg)
        filterSteps.push(`CTG ${ctg}: ${beforeLength} → ${filteredData.length}`)
      }
    } else if (ctg) {
      filterSteps.push(`CTG ${ctg}: skipped (show all)`)
    }

    // RPC filter
    if (rpc && rpc !== "all" && rpc !== "" && rpc !== "semua") {
      const beforeLength = filteredData.length
      filteredData = filteredData.filter((item) => item.regional === rpc)
      filterSteps.push(`RPC ${rpc}: ${beforeLength} → ${filteredData.length}`)
    } else if (rpc) {
      filterSteps.push(`RPC ${rpc}: skipped (show all)`)
    }

    // Kebun filter
    if (kebun && kebun !== "all" && kebun !== "" && kebun !== "semua") {
      const beforeLength = filteredData.length
      const kebunValue = typeof kebun === "object" ? kebun.value || kebun.label : kebun
      if (kebunValue && kebunValue !== "all" && kebunValue !== "" && kebunValue !== "semua") {
        filteredData = filteredData.filter((item) => item.kebun === kebunValue)
        filterSteps.push(`Kebun ${kebunValue}: ${beforeLength} → ${filteredData.length}`)
      } else {
        filterSteps.push(`Kebun ${kebunValue}: skipped (show all)`)
      }
    } else if (kebun) {
      filterSteps.push(`Kebun: skipped (show all)`)
    }

    // Afdeling filter
    if (afd && afd !== "all" && afd !== "" && afd !== "semua") {
      const beforeLength = filteredData.length
      filteredData = filteredData.filter((item) => item.afdeling === afd)
      filterSteps.push(`AFD ${afd}: ${beforeLength} → ${filteredData.length}`)
    } else if (afd) {
      filterSteps.push(`AFD ${afd}: skipped (show all)`)
    }

    // Bulan filter
    if (bulan && bulan !== "all" && bulan !== "" && bulan !== "semua") {
      const beforeLength = filteredData.length
      filteredData = filteredData.filter((item) => item.bulan && item.bulan.toString() === bulan)
      filterSteps.push(`Bulan ${bulan}: ${beforeLength} → ${filteredData.length}`)
    } else if (bulan) {
      filterSteps.push(`Bulan ${bulan}: skipped (show all)`)
    }

    // Tahun filter
    if (tahun && tahun !== "all" && tahun !== "" && tahun !== "semua") {
      const beforeLength = filteredData.length
      filteredData = filteredData.filter((item) => item.tahun && item.tahun.toString() === tahun)
      filterSteps.push(`Tahun ${tahun}: ${beforeLength} → ${filteredData.length}`)
    } else if (tahun) {
      filterSteps.push(`Tahun ${tahun}: skipped (show all)`)
    }

    // Color filter
    if (colorFilter !== "all" && colorFilter !== "" && colorFilter !== "semua") {
      const beforeLength = filteredData.length
      filteredData = filteredData.filter((item) => item.colorCategory === colorFilter)
      filterSteps.push(`Color ${colorFilter}: ${beforeLength} → ${filteredData.length}`)
    } else {
      filterSteps.push(`Color ${colorFilter}: skipped (show all)`)
    }

    console.log("🔍 Filter steps:", filterSteps)
    console.log("📊 Final filtered data length:", filteredData.length)

    if (filteredData.length === 0) {
      console.log("❌ No data after filtering")
      setChartData([])
      setDebugInfo({
        error: "No data after filtering",
        originalLength,
        filteredLength: 0,
        filterSteps,
      })
      setLoading(false)
      return
    }

    // Aggregate data by problem name (why3)
    const problemMap = new Map<string, number>()
    const problemSamples = new Map<string, any>()

    filteredData.forEach((item: any) => {
      const problemName = item.why3 || item.problem || "Unknown Problem"
      problemMap.set(problemName, (problemMap.get(problemName) || 0) + 1)
      if (!problemSamples.has(problemName)) {
        problemSamples.set(problemName, item)
      }
    })

    console.log("🔍 Problem aggregation:")
    problemMap.forEach((count, problem) => {
      console.log(`  - ${problem}: ${count}`)
    })

    // Convert to array and sort by count descending
    const aggregatedData = Array.from(problemMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    console.log("📊 Final aggregated data:", aggregatedData)

    setChartData(aggregatedData)
    setDebugInfo({
      originalLength,
      filteredLength: filteredData.length,
      aggregatedLength: aggregatedData.length,
      filterSteps,
      topProblems: aggregatedData.slice(0, 5),
    })
    setLoading(false)
  }, [picaResults, colorFilter, rpc, kebun, afd, ctg, bulan, tahun])

  const data = loading ? [] : chartData.slice(0, Math.min(Number(numProblems), chartData.length))

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value as string
    const maxLength = 20
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          style={{ transform: "rotate(-45deg) translate(-30px, 0px)" }}
          textAnchor="middle"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontSize={11}
        >
          <tspan x={0} dy={16}>
            {truncatedText}
          </tspan>
        </text>
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } p-3 border rounded-md shadow-lg max-w-xs`}
        >
          <p className="font-bold text-sm mb-1 break-words">{label}</p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 mr-2 bg-cyan-500 rounded-full"></span>
            Jumlah: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomizedLabel = (props: any) => {
    const { x, y, value } = props
    return (
      <text x={x} y={y} dy={-10} fill={theme === "dark" ? "#ffffff" : "#000000"} fontSize={12} textAnchor="middle">
        {value}
      </text>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight mb-2">Tampilkan Data</h3>
          <Select value={numProblems} onValueChange={setNumProblems}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih jumlah masalah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Masalah Teratas</SelectItem>
              <SelectItem value="10">10 Masalah Teratas</SelectItem>
              <SelectItem value={chartData.length.toString()}>Semua Masalah ({chartData.length})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter Kategori Warna</label>
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="red">🔴 Merah (Kritis)</SelectItem>
              <SelectItem value="black">⚫ Hitam (Sangat Buruk)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Memuat data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Tidak ada data yang tersedia</p>
          <p className="text-sm text-gray-500 mb-4">Coba ubah filter atau periksa data sumber</p>
          {debugInfo.filterSteps && (
            <details className="text-xs text-left">
              <summary className="cursor-pointer">Lihat detail filter</summary>
              <ul className="mt-2 space-y-1">
                {debugInfo.filterSteps.map((step: string, idx: number) => (
                  <li key={idx}>• {step}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ) : (
        <div className="mt-6" style={{ height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" height={100} tick={CustomXAxisTick} interval={0} tickLine={false}>
                <Label
                  value="Problem Identifications"
                  offset={-5}
                  position="insideBottom"
                  style={{
                    textAnchor: "middle",
                    fill: theme === "dark" ? "#ffffff" : "#808080",
                  }}
                />
              </XAxis>

              <YAxis
                label={{
                  value: "Frekuensi",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: theme === "dark" ? "#ffffff" : "#808080",
                  },
                }}
                domain={[0, "dataMax + 2"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => (
                  <span style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>Frekuensi Masalah</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Frekuensi Masalah"
                stroke="#0ea5e9"
                fill="url(#colorValue)"
                fillOpacity={0.7}
                activeDot={{ r: 8, stroke: "#0ea5e9", strokeWidth: 2, fill: "#ffffff" }}
                dot={{ stroke: "#0ea5e9", strokeWidth: 2, r: 4, fill: "#ffffff" }}
              >
                <LabelList content={<CustomizedLabel />} />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Summary */}
      {chartData.length > 0 && (
        <div className="-mt-10 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h4 className="text-sm font-semibold mb-2">Ringkasan Data:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Masalah:</span>
              <div className="font-semibold">{chartData.length}</div>
            </div>
            <div>
              <span className="text-gray-500">Ditampilkan:</span>
              <div className="font-semibold">{data.length}</div>
            </div>
            <div>
              <span className="text-gray-500">Total Kejadian:</span>
              <div className="font-semibold">{chartData.reduce((sum, item) => sum + item.value, 0)}</div>
            </div>
            <div>
              <span className="text-gray-500">Rata-rata:</span>
              <div className="font-semibold">
                {chartData.length > 0
                  ? Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)
                  : 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProblemIdentificationChart
