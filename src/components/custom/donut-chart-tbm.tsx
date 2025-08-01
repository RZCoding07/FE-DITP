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
  }
}

const DonutChartTbm: React.FC<DonutChartTbmProps> = React.memo(({ dataprops }) => {
  const { rpc, kebun, title, blok, ctg } = dataprops

  const series = useMemo(() => {
    let result: number[] = []

    if (title === "Keseluruhan TBM") {
      result =
        blok === "blok"
          ? [dataprops.data.gold, dataprops.data.green, dataprops.data.red, dataprops.data.black]
          : [dataprops.dataLuas.gold, dataprops.dataLuas.green, dataprops.dataLuas.red, dataprops.dataLuas.black]
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
        style: {
          colors: ['#fff'],
        },
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
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          }
        }
      }
    }),
    []
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '270px' }}>
      <ReactApexChart options={options} series={series} type="donut" height={270} />
      <img
        src="/images/1.png" // Replace with your image URL
        alt="Center Image"
        style={{
          position: 'absolute',
          top: '50%',
          left: '43.5%',
          transform: 'translate(-50%, -50%)',
          width: '90px', // Adjust size as needed
          height: '90px', // Adjust size as needed
          zIndex: 10,
        }}
      />
    </div>
  )
})

export default DonutChartTbm