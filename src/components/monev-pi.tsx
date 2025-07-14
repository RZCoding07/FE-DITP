"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
  LabelList,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ParameterData {
  parameter_id: string
  sub_tahapan_id: string
  sub_tahapan_name: string
  parameter_name: string
  jumlah_seluruh_pi: string
  jumlah_pi_sudah_selesai: string
  jumlah_pi_belum_selesai: string
}

interface ParameterCount {
  name: string
  count: number
}

interface ParameterAnalysisChartProps {
  data: ParameterData[]
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <p className="font-bold text-sm mb-1">{label}</p>
        <p className="text-sm">
          <span className="inline-block w-3 h-3 mr-2 bg-cyan-500 rounded-full"></span>
          Jumlah PI: <span className="font-semibold">{payload[0].value} parameter</span>
        </p>
      </div>
    )
  }
  return null
}

// Custom label component for data points
const CustomizedLabel = (props: any) => {
  const { x, y, value } = props
  return (
    <text x={x} y={y} dy={-10} fill="#0ea5e9" fontSize={14} fontWeight="bold" textAnchor="middle">
      {value}
    </text>
  )
}

const ParameterAnalysisChart: React.FC<ParameterAnalysisChartProps> = ({ data }) => {
  const [theme, setTheme] = useState<string>("light")
  const [numParameters, setNumParameters] = useState<string>("10")

  const processData = useCallback((): ParameterCount[] => {
    const parameterCounts = data
      .map((item) => ({
        name: item.parameter_name,
        count: Number.parseInt(item.jumlah_seluruh_pi) || 0,
      }))
      .filter((item) => item.count > 0) // Only show parameters with count > 0
      .sort((a, b) => b.count - a.count)

    return parameterCounts
  }, [data])

  const parameterData = processData()
  const topParameters = parameterData.slice(0, Number(numParameters))

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
          }
        })
      })
      observer.observe(document.documentElement, { attributes: true })
      return () => observer.disconnect()
    }
  }, [])

  // Modified CustomXAxisTick to show full text
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props
    const text = payload.value
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontSize={12}
          transform="rotate(-45)"
        >
          {text.length > 15 ? `${text.substring(0, 15)}...` : text}
        </text>
      </g>
    )
  }

  // Jika tidak ada data yang valid (semua count = 0)
  if (parameterData.length === 0) {
    return (
      <div className="w-full p-6 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Tidak ada data parameter yang tersedia
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Semua parameter memiliki jumlah PI = 0 atau data tidak tersedia
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="">
        <h2 className="text-sm font-semibold tracking-tight">Tampilkan Data</h2>
        <Select value={numParameters} onValueChange={(value: string) => setNumParameters(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih jumlah parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Parameter Terbesar</SelectItem>
            <SelectItem value="10">10 Parameter Terbesar</SelectItem>
            <SelectItem value="15">15 Parameter Terbesar</SelectItem>
            <SelectItem value="27">27 Parameter Terbesar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6" style={{ height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart data={topParameters} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" height={100} tick={CustomXAxisTick} interval={0}>
              <Label
                value="Parameter"
                offset={-30}
                position="insideBottom"
                style={{
                  textAnchor: "middle",
                  fill: theme === "dark" ? "#ffffff" : "#808080",
                }}
              />
            </XAxis>
            <YAxis
              label={{
                value: "Jumlah PI",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: theme === "dark" ? "#ffffff" : "#808080",
                },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>Jumlah Parameter</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Jumlah Parameter"
              stroke="#0ea5e9"
              fill="url(#colorUv)"
              fillOpacity={0.7}
              activeDot={{
                r: 8,
                stroke: "#0ea5e9",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
              dot={{
                stroke: "#0ea5e9",
                strokeWidth: 2,
                r: 4,
                fill: "#ffffff",
              }}
            >
              <LabelList content={<CustomizedLabel />} />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ParameterAnalysisChart