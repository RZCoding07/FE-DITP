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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface ProblemData {
  regional: string
  Kategori: string
  "Problem Identification": string
  Detail: string
  "Root Causes": string
  "Corrective Action": string
  w1: string
  w2: string
  w3: string
  w4: string
}

interface ProblemCount {
  name: string
  count: number
}

interface ProblemAnalysisChartProps {
  data: ProblemData[]
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <p className="font-bold text-sm mb-1">{label}</p>
        <p className="text-sm">
          <span className="inline-block w-3 h-3 mr-2 bg-cyan-500 rounded-full"></span>
          Frekuensi Masalah: <span className="font-semibold">{payload[0].value} kejadian</span>
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

// Custom dot component for markers
const CustomDot = (props: any) => {
  const { cx, cy, value } = props

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="white" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6" stroke="#0ea5e9" strokeWidth="2" fill="white" />
      <text x="10" y="13" textAnchor="middle" fill="#0ea5e9" fontSize="10" fontWeight="bold">
        {value}
      </text>
    </svg>
  )
}

const ProblemAnalysisChart: React.FC<ProblemAnalysisChartProps> = ({ data }) => {
  const [theme, setTheme] = useState<string>("light")
  const [numProblems, setNumProblems] = useState<string>("10")
  const [selectedProblems, setSelectedProblems] = useState<ProblemData[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const processData = useCallback((): ProblemCount[] => {
    const problemCounts: Record<string, number> = {}

    data.forEach((item) => {
      const problem = item["Problem Identification"]
      if (problem) {
        problemCounts[problem] = (problemCounts[problem] || 0) + 1
      }
    })

    const sortedProblems = Object.entries(problemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return sortedProblems
  }, [data])

  const problemData = processData()
  const topProblems = problemData.slice(0, Number(numProblems))

  // Transform data for scatter plot (markers)
  const scatterData = topProblems.map((item) => ({
    name: item.name,
    count: item.count,
    // Add x and y coordinates for scatter plot
    x: item.name,
    y: item.count,
  }))

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

  const handleClick = (name: string) => {
    const problem = data.filter((item) => item["Problem Identification"] === name)
    if (problem && problem.length > 0) {
      setSelectedProblems(problem)
      setIsDrawerOpen(true)
    }
  }

  // Custom tick for X-axis with rotation
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props

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
          {payload.value.length > 15 ? `${payload.value.substring(0, 15)}...` : payload.value}
        </text>
      </g>
    )
  }

  return (
    <div className="w-full">
      <hr className="my-4 border-cyan-300 dark:border-cyan-500" />
      <div className="mb-4 mt-2">
        <h2 className="text-sm font-semibold tracking-tight">Tampilkan Data</h2>
        <Select value={numProblems} onValueChange={(value: string) => setNumProblems(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih jumlah masalah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 Masalah Terbesar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6" style={{ height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={topProblems}
            onClick={(e) => e.activePayload && handleClick(e.activePayload[0].payload.name)}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" height={60} tick={CustomXAxisTick}>
              <Label
                value="Problem Identifications"
                offset={-40}
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>Frekuensi Masalah</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Frekuensi Masalah"
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
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Detail Masalah</DrawerTitle>
            <DrawerDescription>Informasi detail tentang masalah yang dipilih</DrawerDescription>
          </DrawerHeader>
          <div className="relative w-full h-full overflow-y-auto">
            <div className="p-4">
              {selectedProblems.length > 0 && (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="border bg-green-600 text-white px-4 py-2">Regional</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Kategori</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Problem Identification</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Detail</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Root Causes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProblems.map((problem: any, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{problem.regional}</td>
                        <td className="border px-4 py-2">{problem.Kategori}</td>
                        <td className="border px-4 py-2">{problem["Problem Identification"]}</td>
                        <td className="border px-4 py-2">{problem.Detail}</td>
                        <td className="border px-4 py-2">{problem["Root Causes"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ProblemAnalysisChart

