import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { RegionalData } from "@/services/api-monev-2"

interface PerformanceChartProps {
  data: RegionalData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((item) => ({
    name: item.nama.replace("REGIONAL ", "REG "),
    monitoring: Number.parseFloat(item.persentase_monev.toString()),
    kesesuaian: Number.parseFloat(item.persentase_kesesuaian.toString()),
    nilai: Number.parseFloat(item.rata_rata_nilai.toString()),
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`,
              name === "monitoring" ? "Monitoring" : name === "kesesuaian" ? "Kesesuaian" : "Rata-rata Nilai",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="monitoring"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            name="Monitoring"
          />
          <Line
            type="monotone"
            dataKey="kesesuaian"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Kesesuaian"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
