import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { AfdData } from "@/services/api-monev-2"

interface AfdChartProps {
  data: AfdData[]
}

const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"]

export function AfdChart({ data }: AfdChartProps) {
  const chartData = data.map((item) => ({
    name: item.afdeling,
    percentage: Number.parseFloat(item.persentase_monev.toString()),
    kesesuaian: Number.parseFloat(item.persentase_kesesuaian.toString()),
    blocks: Number.parseInt(item.jumlah_blok_seluruh),
  }))

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              name === "blocks" ? value : `${value.toFixed(1)}%`,
              name === "percentage" ? "Monitoring" : name === "kesesuaian" ? "Kesesuaian" : "Blocks",
            ]}
          />
          <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
