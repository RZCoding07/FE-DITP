import React, { useEffect, useState, useMemo } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import cookie from "js-cookie"

interface StockAnalysisChartBarProps {
  dataProps: any
}

const StockAnalysisChartBar: React.FC<StockAnalysisChartBarProps> = ({ dataProps }) => {
  const [theme, setTheme] = useState<string>(cookie.get("theme") || "light")

  const rpcOptions = useMemo(() => ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"], [])

  useMemo(() => {
    console.log("Theme changed to", theme)
  }, [theme])



const resultRed = useMemo(() => rpcOptions.map((rpc) => dataProps?.countRedBlock?.[rpc] || 0), [dataProps?.countRedBlock])
const resultBlack = useMemo(() => rpcOptions.map((rpc) => dataProps?.countBlackBlock?.[rpc] || 0), [dataProps?.countBlackBlock])
const resultRedTbm1 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countRedBlockTbm1?.[rpc] || 0), [dataProps?.countRedBlockTbm1])
const resultBlackTbm1 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countBlackBlockTbm1?.[rpc] || 0), [dataProps?.countBlackBlockTbm1])

const resultRedTbm2 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countRedBlockTbm2?.[rpc] || 0), [dataProps?.countRedBlockTbm2])
const resultBlackTbm2 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countBlackBlockTbm2?.[rpc] || 0), [dataProps?.countBlackBlockTbm2])

const resultRedTbm3 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countRedBlockTbm3?.[rpc] || 0), [dataProps?.countRedBlockTbm3])
const resultBlackTbm3 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countBlackBlockTbm3?.[rpc] || 0), [dataProps?.countBlackBlockTbm3])

const resultRedTbm4 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countRedBlockTbm4?.[rpc] || 0), [dataProps?.countRedBlockTbm4])
const resultBlackTbm4 = useMemo(() => rpcOptions.map((rpc) => dataProps?.countBlackBlockTbm4?.[rpc] || 0), [dataProps?.countBlackBlockTbm4])




  // console.log("resultBLack", resultBlack)


  // console dataProps

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(cookie.get("theme") || "light")
    }

    window.addEventListener("themeChange", handleThemeChange)

    console.log("Theme changed to", theme)

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
          text: "Total Blok",
          style: { color: theme === "dark" ? "#ffffff" : "#000000",cssClass: 'apexcharts-yaxis-title' },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -5,
        formatter: (val: number) => `${val.toFixed(0)}`,
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
        name: "Red Block",
        type: "column",
        data: dataProps.ctg === 'keseluruhan-tbm' ? resultRed : dataProps.ctg === 'tbm1' ? resultRedTbm1 : dataProps.ctg === 'tbm2' ? resultRedTbm2 : dataProps.ctg === 'tbm3' ? resultRedTbm3 : dataProps.ctg === 'tbm4' ? resultRedTbm4 : resultRed,
        color: "#DC143C",

      },
      {
        name: "Black Block",
        type: "column",
        data: dataProps.ctg === 'keseluruhan-tbm' ? resultBlack : dataProps.ctg === 'tbm1' ? resultBlackTbm1 : dataProps.ctg === 'tbm2' ? resultBlackTbm2 : dataProps.ctg === 'tbm3' ? resultBlackTbm3 : dataProps.ctg === 'tbm4' ? resultBlackTbm4 : resultBlack,
        color: "rgba(15, 23, 42, 0.95)",

      },
    ],
    [resultRed, resultBlack, resultRedTbm1, resultBlackTbm1, resultRedTbm2, resultBlackTbm2, resultRedTbm3, resultBlackTbm3, resultRedTbm4, resultBlackTbm4, dataProps.ctg],
  )


  return (
    <>
      <style>{`
        .apexcharts-tooltip {
          background: #f3f3f3;
          color: rgba(0, 0, 0, 0.87);
        }

      `}</style>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={250} />
      </div>
    </>
  )
}

export default React.memo(StockAnalysisChartBar)

