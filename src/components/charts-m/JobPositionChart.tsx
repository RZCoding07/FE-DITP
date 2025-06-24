"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { JobPositionData } from "@/services/api-monev-2"

interface JobPositionChartProps {
  data: JobPositionData[]
  onBarClick?: (data: JobPositionData) => void
}

const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"]

export function JobPositionChart({ data, onBarClick }: JobPositionChartProps) {
  const chartData = data.map((item) => ({
    name: item.jabatan.replace("ASISTEN ", "AST ").replace("KEPALA ", "KA "),
    nilai: Number.parseFloat(item.rata_rata_nilai.toString()),
    bobot: Number.parseFloat(item.rata_rata_bobot.toString()),
    monev: item.jumlah_monev,
    karyawan: item.karyawans.length,
    originalData: item,
  }))

  const handleBarClick = (data: any) => {
    if (onBarClick && data.originalData) {
      onBarClick(data.originalData)
    }
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} interval={0} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              name === "nilai" ? `${value.toFixed(1)}` : name === "bobot" ? `${value.toFixed(1)}` : value,
              name === "nilai"
                ? "Rata-rata Nilai"
                : name === "bobot"
                  ? "Rata-rata Bobot"
                  : name === "monev"
                    ? "Total Monev"
                    : "Jumlah Karyawan",
            ]}
            labelFormatter={(label) => `Jabatan: ${label}`}
          />
          <Bar dataKey="nilai" radius={[4, 4, 0, 0]} onClick={handleBarClick} className="cursor-pointer">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
