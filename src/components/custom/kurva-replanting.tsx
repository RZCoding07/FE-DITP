"use client"

import type { FC } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import cookie from "js-cookie"

interface DataItem {
  month: string
  plan: number | 0
  real: any
  realVsPlan: any
}

const SCurveChart: FC = () => {
  const theme = cookie.get("theme") || "light"
  const labelColor = theme === "dark" ? "#fff" : "#333"
  const titleColor = labelColor

  const data: DataItem[] = [
    { month: "JAN", plan: 3.63, real: 2.05, realVsPlan: 56.51 },
    { month: "FEB", plan: 8.36, real: 4.99, realVsPlan: 59.66 },
    { month: "MAR", plan: 14.37, real: null, realVsPlan: null },
    { month: "APR", plan: 26.15, real: null, realVsPlan: null },
    { month: "MEI", plan: 44.43, real: null, realVsPlan: null },
    { month: "JUN", plan: 63.95, real: null, realVsPlan: null },
    { month: "JUL", plan: 78.69, real: null, realVsPlan: null },
    { month: "AGU", plan: 88.17, real: null, realVsPlan: null },
    { month: "SEP", plan: 93.9, real: null, realVsPlan: null },
    { month: "OKT", plan: 95.63, real: null, realVsPlan: null },
    { month: "NOV", plan: 97.76, real: null, realVsPlan: null },
    { month: "DES", plan: 100.0, real: null, realVsPlan: null },
  ]

  // Custom label renderer for plan values
  const renderPlanValueLabel = (props: any) => {
    const { x, y, value } = props
    return value !== null && value !== undefined ? (
      <text x={x} y={y - 15} fill="#ff7f00" textAnchor="middle" fontSize="12" fontWeight="bold">
        {`${value}%`}
      </text>
    ) : null
  }

  // Custom label renderer for real values
  const renderRealValueLabel = (props: any) => {
    const { x, y, value } = props
    return value !== null && value !== undefined ? (
      <text x={x} y={y - 15} fill="rgba(56, 142, 60, 1)" textAnchor="middle" fontSize="12" fontWeight="bold">
        {`${value}%`}
      </text>
    ) : null
  }

  const getColor = (value: number | null, plan: number) => {
    if (value === null) return "transparent"; // Jika nilai null, gunakan transparan
    const percentage = value ;
    if (percentage < 75) return "bg-red-400"; // Merah jika < 60%
    if (percentage <= 90) return "bg-yellow-100"; // Kuning jika 61-90%
    return "bg-green-100"; // Hijau jika > 90%
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Teks di atas grafik */}
      <p className="text-lg" style={{ color: labelColor }}>
        Grafik dan tabel di bawah ini menunjukkan progress plan vs actual pekerjaan replanting 2025
      </p>

      <div className="p-4 bg-transparent rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Bulan",
                position: "insideBottomRight",
                offset: -10,
                fill: titleColor,
              }}
            />
            <YAxis
              label={{
                value: "Persentase (%)",
                angle: -90,
                position: "insideLeft",
                fill: titleColor,
              }}
            />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="plan"
              name="Plan s.d (%)"
              stroke="#ff7f00"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            >
              <LabelList dataKey="plan" content={renderPlanValueLabel} />
            </Line>
            <Line
              type="monotone"
              dataKey="real"
              name="Real s.d (%)"
              stroke="#43A047"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            >
              <LabelList dataKey="real" content={renderRealValueLabel} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>


      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-green-600 text-white">S.D BULAN</th>
            {data.map((item) => (
              <th key={item.month} className="border border-gray-300 px-4 py-2 bg-green-600 text-white">
                {item.month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium" style={{ color: titleColor }}>
              Plan s.d (%)
            </td>
            {data.map((item) => (
              <td key={item.month} className="border border-gray-300 px-4 py-2 text-center">
                {item.plan}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium" style={{ color: titleColor }}>
            Actual s.d (%)
            </td>
            {data.map((item) => (
              <td key={item.month} className={`border border-gray-300 px-4 py-2 text-center`}>
                {item.real !== null ? item.real : "-"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium" style={{ color: titleColor }}>
            Target Attainment (%)
            </td>
            {data.map((item) => (
              <td key={item.month} className={`border border-gray-300 text-white px-4 py-2 text-center ${getColor(item.realVsPlan, item.plan)}`}>
                {item.realVsPlan !== null ? item.realVsPlan : "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default SCurveChart

