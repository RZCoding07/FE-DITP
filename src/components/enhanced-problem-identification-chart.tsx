"use client"

import React, { useState, useEffect } from "react"
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

interface ProblemIdentificationChartProps {
  isDarkMode: boolean
  dataEndpoint?: string // Endpoint to fetch data, default is "/api/picaw3Count"
  rpc?: string
  kebun?: string
  afd?: string
  ctg?: string
  bulan?: string
  tahun?: string
  picaResult?: any // Optional prop for PICA result, not used in this component
}

const ProblemIdentificationChart: React.FC<ProblemIdentificationChartProps> = ({ isDarkMode, dataEndpoint = "/api/picaw3Count", rpc, kebun, afd, ctg, bulan, tahun }) => {
  const [theme, setTheme] = useState<string>("light")
  // Default tampilkan 5 masalah teratas agar label Select muncul
  const [numProblems, setNumProblems] = useState<string>("5")
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(dataEndpoint)
        const json = await res.json()
        const mapped = json.map((item: any) => ({ name: item.why3, value: item.count }))
        mapped.sort((a: { value: number }, b: { value: number }) => b.value - a.value)
        console.log("Fetched data:", mapped)
        setChartData(mapped)
      } catch (err) {
        console.error("Error fetching problem data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dataEndpoint])

  const data = loading
    ? []
    : chartData.slice(0, Math.min(Number(numProblems), chartData.length))

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value as string
    const words = text.split(" ")
    const lines: string[] = []
    for (let i = 0; i < words.length; i += 2) {
      lines.push(words.slice(i, i + 2).join(" "))
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          style={{ transform: "rotate(-45deg) translate(-50px, 0px)" }}
          textAnchor="middle"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontSize={12}
        >
          {lines.map((line, idx) => (
            <tspan key={idx} x={0} dy={idx === 0 ? 16 : 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-${theme === "dark" ? "gray-800" : "white"} p-3 border border-${theme === "dark" ? "gray-700" : "gray-200"} rounded-md shadow-lg`}>
          <p className="font-bold text-sm mb-1">{label}</p>
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
      <text
        x={x}
        y={y}
        dy={-10}
        fill={theme === "dark" ? "#ffffff" : "#000000"}
        fontSize={12}
        textAnchor="middle"
      >
        {value}
      </text>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 mt-2">
        <h2 className="text-sm font-semibold tracking-tight">Tampilkan Data</h2>
        <Select value={numProblems} onValueChange={setNumProblems}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih jumlah masalah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Masalah Teratas</SelectItem>
            <SelectItem value={chartData.length.toString()}>Semua Masalah ({chartData.length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center py-10">Memuat data...</p>
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
              <XAxis
                dataKey="name"
                height={80}
                tick={CustomXAxisTick}
                interval={0}
                tickLine={false}
                angle={-45} // Menambahkan rotasi 45 derajat
              >
                <Label
                  value="Problem Identifications"
                  offset={-70}
                  position="insideBottom"
                  style={{ textAnchor: "middle", fill: theme === "dark" ? "#ffffff" : "#808080" }}
                />
              </XAxis>

              <YAxis
                label={{ value: "Frekuensi", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: theme === "dark" ? "#ffffff" : "#808080" } }}
                domain={[0, 'dataMax + 5']}
                tickCount={4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => <span style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>Frekuensi Masalah</span>}
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
    </div>
  )
}

export default ProblemIdentificationChart

