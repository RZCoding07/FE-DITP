"use client"

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import cookie from "js-cookie"

const calculateParetoData = (data: any) => {
  const total = data.reduce((sum: any, item: any) => sum + item.value, 0)
  const sortedData = [...data].sort((a, b) => b.value - a.value)
  let cumulativeSum = 0
  return sortedData.map((item) => {
    cumulativeSum += item.value
    return {
      ...item,
      cumulativePercentage: (cumulativeSum / total) * 100,
    }
  })
}

export default function ParetoChart() {
  const theme = cookie.get("theme") || "light"
  const rawData = [
    { name: "Proses Pengadaan", value: 4886 },
    { name: "Regulasi", value: 2063 },
    { name: "Administrasi", value: 12032 },
    { name: "Environment", value: 0 },
    { name: "Operasional", value: 0 },
  ]

  const filteredData = rawData.filter(item => item.value > 0);

  const paretoData = calculateParetoData(filteredData);

  return (
    <Card className="w-full">

      <CardContent>


        <ChartContainer
          config={{
            effect: {
              label: "Sum Effect",
              color: "hsl(var(--chart-1))",
            },
            cumulative: {
              label: "Cumulative %",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%"
            style={{ fontSize: 15, fontFamily: 'Inter var, sans-serif' }}

          >
            <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              style={{ fontSize: 15, fontFamily: 'Inter var, sans-serif' }}

            >
              <CartesianGrid strokeDasharray="3 3" vertical={false}
                style={{ fontSize: 15, fontFamily: 'Inter var, sans-serif' }}

              />
              <XAxis dataKey="name" angle={0} tick={{ fontSize: 15 }} interval={0} tickMargin={10} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => value.toLocaleString()}
                domain={[0, "dataMax + 500"]}
                style={{ fontSize: 14, fontFamily: 'Inter var, sans-serif' }}
                label={{ value: "Effect (HA)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(2)}%`}
                domain={[0, 100]}
                style={{ fontSize: 14, fontFamily: 'Inter var, sans-serif' }}

                label={{ value: "Percentage %", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any, name) => {
                      console.log(value, name)
                      if (name === "Cumulative %") {
                        return [`${value.toFixed(2)}% Cumulative %`]
                      } else {
                        return [`${value.toLocaleString()} Sum Effect`]
                      }
                    }}
                  />
                }
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                yAxisId="left"
                dataKey="value"
                name="Sum Effect"
                fill="#43A047"
                radius={[4, 4, 0, 0]}
                barSize={60}
                label={{
                  position: "top",
                  formatter: (value: any) => (value > 0 ? value.toLocaleString() : ""),
                  fill: "#43A047",
                  fontSize: 15,
                }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativePercentage"
                name="Cumulative %"
                stroke="#de0404"
                strokeWidth={2}
                dot={{ fill: "#de0404", r: 4 }}
                activeDot={{ r: 6 }}
                label={{
                  position: "top",
                  formatter: (value: any) => `${value.toFixed(2)}%`,
                  fill: theme === "dark" ? "#ffffff" : "#000000",
                  fontSize: 15,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <h2 className="text-center -mt-10 text-[15px]" style={{ color: '#787878' }}>Problem Categories</h2>
      </CardContent>
    </Card>
  )
}

