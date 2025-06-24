import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { RegionalData } from "@/services/api-monev-2"

interface AreaBlockChartProps {
  data: RegionalData[]
}

export function AreaBlockChart({ data }: AreaBlockChartProps) {
  const chartData = data.map((item) => ({
    name: item.nama.replace("REGIONAL ", "REG "),
    area: Number.parseFloat(item.luas_areal_ha_seluruh) / 1000, // Convert to thousands
    blocks: Number.parseInt(item.jumlah_blok_seluruh),
    blocksTU: Number.parseInt(item.jumlah_blok_tu),
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              name === "area" ? `${value.toFixed(1)}k Ha` : value,
              name === "area" ? "Area" : name === "blocks" ? "Total Blocks" : "TU Blocks",
            ]}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="area" fill="#10b981" name="Area (k Ha)" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="blocks"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Total Blocks"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="blocksTU"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            name="TU Blocks"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
