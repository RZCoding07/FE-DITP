"use client"

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const calculateParetoData = (data:any) => {
  const total = data.reduce((sum:any, item:any) => sum + item.value, 0)
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

  const rawData = [
    { name: "Proses Pengadaan", value: 4886 },
    { name: "Regulasi", value: 1120 },
    { name: "Administrasi", value: 12032 },
    { name: "Environment", value: 943 },
    { name: "Operasional", value: 0 },
  ]

  // Process data for Pareto chart
  // Filter out entries with value 0
  const filteredData = rawData.filter(item => item.value > 0);

  // Process data for Pareto chart
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
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={0} tick={{ fontSize: 12 }} interval={0} tickMargin={10} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => value.toLocaleString()}
                domain={[0, "dataMax + 500"]}
                label={{ value: "Effect (HA)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(2)}%`}
                domain={[0, 100]}
                label={{ value: "%", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value:any, name) => {
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
                  formatter: (value:any) => (value > 0 ? value.toLocaleString() : ""),
                  fill: "#43A047",
                  fontSize: 12,
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
                  formatter: (value:any) => `${value.toFixed(2)}%`,
                  fill: "hsl(var(--chart-2))",
                  fontSize: 12,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
</CardContent>
    </Card>
  )
}

