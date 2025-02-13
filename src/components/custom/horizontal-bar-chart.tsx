import React, { useState, useMemo, useCallback } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import cookie from "js-cookie"
import { useChartData } from "@/hooks/use-chart-data"
import {
  distinctKebunWhereFilterByRegional,
  sumBlokByDistinctKebun,
  sumLuasBlokByDistinctKebun,
} from "@/utils/chartHelper"

interface StockAnalysisChartProps {
  dataprops: any
  onEventClick: (data: any) => void
}

export const StockAnalysisChart: React.FC<StockAnalysisChartProps> = React.memo(({ dataprops, onEventClick }) => {
  const [isKebun, setIsKebun] = useState<boolean>(false)
  const theme = cookie.get("theme") || "light"

  const categories = useMemo(() => ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"], [])

  const chartData = useChartData(dataprops, categories)

  const handleChartClick = useCallback(
    (selectedCategory: string) => {
      setIsKebun(true)
      const distinctKebun = distinctKebunWhereFilterByRegional(dataprops.dataset[dataprops.val], selectedCategory)

      const countBlok = distinctKebun.map((kebun: any) => ({
        category: kebun,
        filter: sumBlokByDistinctKebun(dataprops.dataset[dataprops.val], selectedCategory, kebun),
      }))

      const sumLuasBlok = distinctKebun.map((kebun: any) => ({
        category: kebun,
        filter: sumLuasBlokByDistinctKebun(
          dataprops.dataset[dataprops.val],
          selectedCategory,
          kebun,
          dataprops.val !== 4,
        ),
      }))

      const allData = dataprops.dataset[dataprops.val]

      const eventData = {
        name: dataprops.title,
        value: dataprops.val,
        color: dataprops.color,
        allData,
        categories: distinctKebun,
        countBlok,
        sumLuasBlok,
        selectedCategory,
        // allData: dataprops.dataset[dataprops.val]
      }
      onEventClick(eventData)
    },
    [dataprops, onEventClick],
  )

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        height: 426,
        type: "bar",
        stacked: false,
        events: {
          dataPointSelection: (event, chartContext, { dataPointIndex }) => {
            handleChartClick(categories[dataPointIndex])
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: 5,
      },
      stroke: {
        width: [1],
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: theme === "dark" ? "#ffffff" : "#000000",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
          },
        },
        title: {
          text: dataprops.untuk,
          style: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      yaxis: {
        axisTicks: { show: true },
        axisBorder: {
          show: true,
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
        labels: {
          style: {
            colors: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
        title: {
          text: "Regional",
          style: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      tooltip: {
        enabled: false
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
      legend: {
        horizontalAlign: "center",
        offsetX: 40,
      },
    }),
    [categories, dataprops.untuk, theme, handleChartClick],
  )

  const series = useMemo(
    () => [
      {
        name: "Total:",
        type: "bar",
        data: chartData.map((item) => item.filter),
        color: "#00b0ff",
      },
    ],
    [chartData],
  )

  return (
    <div id="chart">
      <style>{`
        .apexcharts-menu {
          background-color: ${theme === "dark" ? "#333" : "#fff"} !important;
          color: ${theme === "dark" ? "#fff" : "#000"} !important;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .apexcharts-menu-item {
          padding: 10px 15px;
          font-size: 14px;
          cursor: pointer;
          color: ${theme === "dark" ? "#fff" : "#000"} !important;
        }
        .apexcharts-menu-item:hover {
          background-color: ${theme === "dark" ? "#555" : "#f0f0f0"} !important;
          color: ${theme === "dark" ? "#ffcc00" : "#007BFF"} !important;
        }
      `}</style>

      <h2 className="text-xl font-semibold text-center">
        {dataprops.untuk} {dataprops.title}
      </h2>

      <ReactApexChart options={options} series={series} type="bar" height={426} />
    </div>
  )
})

export default StockAnalysisChart

