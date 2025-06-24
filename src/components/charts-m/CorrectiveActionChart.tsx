import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { CARegionalData } from "@/services/api-monev-2"

interface CorrectiveActionChartProps {
  data: CARegionalData[]
}

const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]

export function CorrectiveActionChart({ data }: CorrectiveActionChartProps) {
  const chartData = data.map((item) => ({
    name: item.regional.replace("PalmCo Regional ", "REG "),
    value: Number.parseInt(item.jumlah_corrective_action),
    selesai: Number.parseInt(item.jumlah_corrective_action_selesai),
    percentage: Number.parseFloat(item.persentase_corrective_action_selesai.toString()),
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [value, "Total CA"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
