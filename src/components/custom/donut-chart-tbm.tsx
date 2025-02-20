import React, { useMemo } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

interface DonutChartTbmProps {
  dataprops: {
    rpc: { value: string }
    kebun: { value: string }
    title: string
    blok: string
    ctg: string
    data: any
    dataLuas: any
    tbm1ColorCount: any
    tbm2ColorCount: any
    tbm3ColorCount: any
    tbm4ColorCount: any
    tbm1LuasByColor: any
    tbm2LuasByColor: any
    tbm3LuasByColor: any
    tbm4LuasByColor: any
    dataDnt: any
    dataLuasDnt: any
  }
}

const DonutChartTbm: React.FC<DonutChartTbmProps> = React.memo(({ dataprops }) => {
  const { rpc, kebun,  title, blok, ctg } = dataprops

  const series = useMemo(() => {
    let result: number[] = []

    if (title === "Keseluruhan TBM") {
      result =
        blok === "blok"
          ? [dataprops.data.emas, dataprops.data.hijau, dataprops.data.merah, dataprops.data.hitam]
          : [dataprops.dataLuas.emas, dataprops.dataLuas.hijau, dataprops.dataLuas.merah, dataprops.dataLuas.hitam]
    } else {
      if (blok === "blok") {
        const colorCounts = {
          tbm1: dataprops.tbm1ColorCount,
          tbm2: dataprops.tbm2ColorCount,
          tbm3: dataprops.tbm3ColorCount,
          tbm4: dataprops.tbm4ColorCount,
        }[ctg]

        if (colorCounts) {
          result = ["gold", "green", "red", "black"].map((color) => colorCounts[color] ?? 0)
        }

        if (ctg !== "tbm-all" && rpc.value !== "all") {
          result = [dataprops.dataDnt.emas, dataprops.dataDnt.hijau, dataprops.dataDnt.merah, dataprops.dataDnt.hitam]
        }
      } else {
        const luasByColor = {
          tbm1: dataprops.tbm1LuasByColor,
          tbm2: dataprops.tbm2LuasByColor,
          tbm3: dataprops.tbm3LuasByColor,
          tbm4: dataprops.tbm4LuasByColor,
        }[ctg]

        if (luasByColor) {
          result = ["gold", "green", "red", "black"].map((color) => luasByColor[color] ?? 0)
        }

        if (ctg !== "tbm-all" && rpc.value !== "all") {
          result = ["emas", "hijau", "merah", "hitam"].map((color) => Number(dataprops.dataLuasDnt[color]))
        }
      }
    }

    return result
  }, [dataprops, rpc.value, title, blok, ctg])

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
      },
      labels: ["Emas", "Hijau", "Merah", "Hitam"],
      colors: ["#FFA500", "#00a300", "#FF0000", "#000000"],
      legend: {
        position: "right",
        labels: {
          colors: "#FFFFFF",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`,
      },
      fill: {
        type: "gradient",
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(0)}`,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }),
    [],
  )

  return <ReactApexChart options={options} series={series} type="donut" height={270} />
})

export default DonutChartTbm

