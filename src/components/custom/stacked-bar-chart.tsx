"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import type { ApexOptions } from "apexcharts"
import ReactApexChart from "react-apexcharts"
import cookie from "js-cookie"

const getCookie = (key: string) => cookie.get(key)

const getDataCounts = (data: any) =>
  Object.keys(data).reduce((acc: any, key) => {
    acc[key] = data[key].length
    return acc
  }, {})

// Extract values for RPC categories
const extractRPCValues = (dataCounts: any) => [
  dataCounts.RPC1 ?? 0,
  dataCounts.RPC2 ?? 0,
  dataCounts.RPC3 ?? 0,
  dataCounts.RPC4 ?? 0,
  dataCounts.RPC5 ?? 0,
  dataCounts.RPC6 ?? 0,
  dataCounts.RPC7 ?? 0,
  dataCounts.RPC2N2 ?? 0,
  dataCounts.RPC2N14 ?? 0,
]

// Warna tetap (cyan, blue, orange, grey)
const COLORS = ["#496989", "#2196F3", "#EB5B00", "#A27B5C"]

const StackedBarChart: React.FC<{ dataProps: any }> = ({ dataProps }) => {
  const themeRef = useRef((getCookie("theme") as string) || "light")
  const [theme, setTheme] = useState(themeRef.current)

  useEffect(() => {
    const savedTheme = (getCookie("theme") as string) || "light"
    if (themeRef.current !== savedTheme) {
      themeRef.current = savedTheme
      setTheme(savedTheme)
    }
  }, [])

  const { series, options } = useMemo(() => {
    const tbmDataCounts = {
      tbm1: getDataCounts(dataProps.tbm1DataRegional),
      tbm2: getDataCounts(dataProps.tbm2DataRegional),
      tbm3: getDataCounts(dataProps.tbm3DataRegional),
      tbm4: getDataCounts(dataProps.tbm4DataRegional),
    }

    const seriesData = [
      { name: "TBM 1", data: extractRPCValues(tbmDataCounts.tbm1) },
      { name: "TBM 2", data: extractRPCValues(tbmDataCounts.tbm2) },
      { name: "TBM 3", data: extractRPCValues(tbmDataCounts.tbm3) },
      { name: "TBM > 3", data: extractRPCValues(tbmDataCounts.tbm4) },
    ]

    return {
      series: seriesData,
      options: {
        chart: { type: "bar", height: 350, stacked: true },
        colors: COLORS, // Warna tetap
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                  color: theme === "dark" ? "#fff" : "#000",
                },
              },
            },
          },
        },
        xaxis: {
          categories: ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"],
          labels: {
            style: { colors: theme === "dark" ? "#fff" : "#000" },
            formatter: (val: string) => `${val} Blok`,
          },
        },
        yaxis: {
          title: { text: "Regional", style: { color: theme === "dark" ? "#fff" : "#000" } },
          labels: { style: { colors: theme === "dark" ? "#fff" : "#000" } },
        },
        legend: {
          labels: { colors: theme === "dark" ? "#fff" : "#000" },
        },
        tooltip: { y: { formatter: (val: number) => `${val}` } },
      } as ApexOptions,
    }
  }, [dataProps, theme])

  return <ReactApexChart options={options} series={series} type="bar" height={350} />
}

export default React.memo(StackedBarChart)
