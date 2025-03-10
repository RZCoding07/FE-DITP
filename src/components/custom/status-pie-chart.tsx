"use client"

import type React from "react"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

interface ProblemData {
  regional: string
  Kategori: string
  "Problem Identification": string
  Detail: string
  "Root Causes": string
  "Corrective Action": string
  w1: string
  w2: string
  w3: string
  w4: string
}

interface StatusPieChartProps {
  data: ProblemData[]
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  const [theme, setTheme] = useState<string>("light")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })

      return () => observer.disconnect()
    }
  }, [])

  const processStatusData = () => {
    const statusCounts: Record<string, number> = {
      "Done": 0,
      "On Progress": 0,
      "Not Started": 0
    }

    data.forEach((item) => {
      [item.w1, item.w2, item.w3, item.w4].forEach((status) => {
        if (!status || status.trim() === "") {
          return
        }

        if (status.includes("Done")) {
          statusCounts["Done"]++
        } else if (status.includes("On Progress")) {
          statusCounts["On Progress"]++
        } else if (status.includes("Not Started")) {
          statusCounts["Not Started"]++
        }
      })
    })

    // Prepare data for the chart, including statuses with zero counts
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
  }

  const statusData = processStatusData()

  const labels = statusData.map((item) => item.status)
  const series = statusData.map((item) => item.count)

  const options: ApexOptions = {
    chart: {
      type: "pie",
      foreColor: theme === "dark" ? "#ffffff" : "#000000",
    },
    labels,
    colors: [
      "#10b981", // Green for Done
      "#3b82f6", // Blue for On Progress
      "#f97316", // Orange for Not Started
      "#6b7280", // Gray for Other
    ],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: {
        colors: theme === "dark" ? "#ffffff" : "#000000",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${Math.round(val)}%`
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} item${val !== 1 ? "s" : ""}`,
      },
      theme: theme === "dark" ? "dark" : "light",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    stroke: {
      width: 2,
    },
    title: {
      text: "Status Distribution (w1-w4)",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 80],
      },
    },
  }

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  )
}

export default StatusPieChart