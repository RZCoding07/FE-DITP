import React, { useEffect, useState, useMemo } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import cookie from "js-cookie"

interface StockAnalysisChartBarProps {
  dataProps: any
  onCardClick: (data: any) => void
}

const StockAnalysisChartBar: React.FC<StockAnalysisChartBarProps> = ({ dataProps, onCardClick }) => {
  const [theme, setTheme] = useState<string>(cookie.get("theme") || "light")

  const rpcOptions = useMemo(() => ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"], [])

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(cookie.get("theme") || "light")
    }

    window.addEventListener("themeChange", handleThemeChange)

    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  useEffect(() => {
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)

    return () => clearTimeout(resizeTimer)
  }, []) // Removed unnecessary dependency: theme

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        foreColor: theme === "dark" ? "#ffffff" : "#000000",
        zoom: { enabled: false },
      },
      xaxis: {
        categories: rpcOptions,
        labels: {
          style: {
            colors: theme === "dark" ? "#ffffff" : "#000000",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
          },
        },
        title: {
          text: "Regional",
          style: { color: theme === "dark" ? "#ffffff" : "#000000" },
        },
      },
      yaxis: {
        axisTicks: { show: true },
        axisBorder: {
          show: true,
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
        labels: {
          style: { colors: theme === "dark" ? "#ffffff" : "#000000" },
        },
        title: {
          text: "Total Luasan Ha",
          style: { color: theme === "dark" ? "#ffffff" : "#000000" },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -5,
        formatter: (val: number) => `${val.toFixed(2)} Ha`,
      },
      stroke: { width: [1, 1, 4] },
      fill: { type: "solid" },
      legend: {
        horizontalAlign: "center",
        offsetX: 40,
      },
    }),
    [theme, rpcOptions],
  )

  const series = useMemo(
    () => [
      {
        name: "Blok Hitam",
        type: "column",
        color: "rgba(15, 23, 42, 0.95)",
        data: [1, 2, 2, 1, 2, 2, 2, 3, 2],
      },
      {
        name: "Blok Merah",
        type: "column",
        color: "#DC143C",
        data: [2, 3, 3, 2, 3, 1, 1, 2, 1],
      },
    ],
    [],
  )

  return (
    <>
      <style>{`
        .apexcharts-tooltip {
          background: #f3f3f3;
          color: orange;
        }
      `}</style>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={250} />
      </div>
    </>
  )
}

export default React.memo(StockAnalysisChartBar)

