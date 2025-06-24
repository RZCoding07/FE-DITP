"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MonevComplianceChartProps {
  data: {
    compliantParameters: number
    totalParameters: number
    complianceRate: number
    notAssessedParameters: number
  }
}

const colors = ["#10b981", "#ef4444", "#f59e0b"]

export function MonevComplianceChart({ data }: MonevComplianceChartProps) {
   // Calculate non-compliant parameters (total - compliant - not assessed)
  const nonCompliantParameters = data.totalParameters - data.compliantParameters - (data.notAssessedParameters || 0)
  
  
  const chartData = [
    {
      name: "Compliant",
      value: data.compliantParameters,
      percentage: (data.compliantParameters / data.totalParameters) * 100,
    },
    {
      name: "Non-Compliant",
      value: nonCompliantParameters,
      percentage: (nonCompliantParameters / data.totalParameters) * 100,
    },
    {
      name: "Not Assessed",
      value: data.notAssessedParameters || 0,
      percentage: ((data.notAssessedParameters || 0) / data.totalParameters) * 100,
    },
  ].filter(item => item.value >= 0) // Only show categories with values

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
            formatter={(value: number, name: string) => [value, `${name} Parameters`]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
