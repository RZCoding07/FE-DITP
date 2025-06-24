import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { UnitData } from "@/services/api-monev-2"

interface UnitChartProps {
  data: UnitData[]
}

const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"]

export function UnitChart({ data }: UnitChartProps) {
  const chartData = data.map((item) => ({
    name: item.nama.replace("KEBUN ", "").substring(0, 15),
    percentage: Number.parseFloat(item.persentase_monev.toString()),
    kesesuaian: Number.parseFloat(item.persentase_kesesuaian.toString()),
    area: Number.parseFloat(item.luas_areal_ha_seluruh),
  }))

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              name === "area" ? `${value.toLocaleString()} Ha` : `${value.toFixed(1)}%`,
              name === "percentage" ? "Monitoring" : name === "kesesuaian" ? "Kesesuaian" : "Area",
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
