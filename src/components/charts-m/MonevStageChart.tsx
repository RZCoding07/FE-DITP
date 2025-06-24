"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface MonevStageChartProps {
  data: {
    tahapan_id: string
    tahapan_name: string
    subtahapans: {
      sub_tahapan_id: string
      sub_tahapan_name: string | null
      parameters: {
        parameter_id: string
        parameter_name: string
        pengamatans: {
          pengamatan_id: string
          pengamatan_name: string
          is_selected: boolean
          value_description: string | null
        }[]
      }[]
    }[]
  }[]
}

const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

export function MonevStageChart({ data }: MonevStageChartProps) {
  const chartData = data.map((stage) => {
    let totalParameters = 0
    let compliantParameters = 0

    stage.subtahapans.forEach((substage) => {
      substage.parameters.forEach((parameter) => {
        totalParameters++
        const hasCompliantSelection = parameter.pengamatans.some(
          (obs) =>
            obs.is_selected &&
            (obs.pengamatan_name.toLowerCase().includes("sesuai") ||
              obs.pengamatan_name.toLowerCase().includes("dilakukan") ||
              obs.pengamatan_name.toLowerCase().includes("ada") ||
              obs.pengamatan_name.toLowerCase().includes("dipasang") ||
              obs.pengamatan_name.toLowerCase().includes("bebas") ||
              obs.pengamatan_name.toLowerCase().includes("tidak berpotensi") ||
              obs.pengamatan_name.toLowerCase().includes("tidak ada serangan") ||
              obs.pengamatan_name.toLowerCase().includes("rutin")),
        )

        if (hasCompliantSelection) {
          compliantParameters++
        }
      })
    })

    return {
      name: stage.tahapan_name.replace("Nursery", "N.").replace("Penanganan", "P."),
      compliance: totalParameters > 0 ? (compliantParameters / totalParameters) * 100 : 0,
      total: totalParameters,
      compliant: compliantParameters,
    }
  })

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, "Compliance Rate"]}
            labelFormatter={(label) => `Stage: ${label}`}
          />
          <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
