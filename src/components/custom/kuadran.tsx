"use client"

import { useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface Point {
  x: number
  y: number
  kebun: string
  bulan: string
  kode_kebun: string
  tahun: number
  pica: number
  cashcost: number
}

interface ScatterProps {
  data?: Array<Point>
  height?: number
  dataKeyXName: string
  dataKeyYName: string
}



const areas = [
  // Green quadrant (top-right) - Kuadran Hijau
  { xRange: [90, 100], yRange: [60, 120], color: "rgba(255, 255, 0, 0.7)" },

  // Yellow quadrant (bottom-right) - Kuadran Kuning
  { xRange: [90, 100], yRange: [0, 60], color: "rgba(144, 238, 144, 0.7)" },

  // Orange quadrant (top-left) - Kuadran Orange
  { xRange: [87, 90], yRange: [60, 120], color: "rgba(255, 99, 71, 0.7)" },

  // Black quadrant (bottom-left) - Kuadran Hitam (awal)
  { xRange: [87, 90], yRange: [0, 60], color: "rgba(0, 0, 0, 0.7)" },

  // Black quadrant (top-left) - Kuadran Hitam (tambahan)
  { xRange: [87, 90], yRange: [120, 160], color: "rgba(0, 0, 0, 0.7)" }, 

  {  xRange: [90, 100], yRange: [120, 160], color: "rgba(144, 238, 144, 0.7)" }, 
];


export const ScatterChart = ({ data = [], height = 800, dataKeyXName, dataKeyYName }: ScatterProps) => {
  const [modalData, setModalData] = useState<any>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  const options = {
    chart: {
      type: "scatter",
      zoomType: "xy",
      animation: true,
      backgroundColor: "transparent",

      events: {
        render() {
          const chart = this as any
          const xAxis = chart.xAxis[0]
          const yAxis = chart.yAxis[0]

          if (chart.customShapes) {
            chart.customShapes.forEach((shape: any) => shape.destroy())
          }
          chart.customShapes = []

          areas.forEach((area) => {
            const [xMin, xMax] = area.xRange
            const [yMin, yMax] = area.yRange

            const x1 = xAxis.toPixels(xMin)
            const x2 = xAxis.toPixels(xMax)
            const y1 = yAxis.toPixels(yMax)
            const y2 = yAxis.toPixels(yMin)

            const rect = chart.renderer
              .rect(x1, y1, x2 - x1, y2 - y1, 0)
              .attr({
                fill: area.color,
                zIndex: 0,
              })
              .add()

            chart.customShapes.push(rect)
          })
        },
      },
    },
    title: {
      text: "KUADRAN PICA KESELURUHAN TBM",
      style: {
        color: "#FFFFFF", // Changed to white
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "Nilai Vegetatif",
        style: {
          color: "#FFFFFF", // Changed to white
        },
      },
      min: 87,
      max: 100,
      tickInterval: 1,
      labels: {
        style: {
          color: "#FFFFFF", // Changed to white
        },
      },
      lineColor: "#FFFFFF", // Changed to white
      gridLineColor: "#FFFFFF", // Changed to white
    },
    yAxis: {
      title: {
        text: "Serapan Biaya (%)",
        style: {
          color: "#FFFFFF", // Changed to white
        },
      },
      min: 0,
      max: 160,
      tickInterval: 20,
      labels: {
        formatter: function (this: { value: number }): string {
          return Highcharts.numberFormat(this.value, 0, ",", ".")
        },
        style: {
          color: "#FFFFFF", // Changed to white
        },
      },
      lineColor: "#FFFFFF", // Changed to white
      gridLineColor: "#FFFFFF", // Changed to white
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      floating: false,
      backgroundColor: "transparent",
      borderWidth: 0,
      itemStyle: {
        color: "#FFFFFF", // Changed to white
      },
      itemHoverStyle: {
        color: "#D1D5DB", // Changed to a light gray
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 4,
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(200,200,200)", // Changed to a lighter color
            },
          },
        },
        states: {
          hover: {
            enabled: false,
          },
        },
        tooltip: {
          headerFormat: "<b>{series.name}</b><br>",
          pointFormatter: function (this: Highcharts.Point): string {
            const xValue = this.x !== undefined ? this.x : "N/A"
            const yValue = this.y !== undefined ? Math.floor(Number.parseFloat(this.y.toString())) : "N/A"
            return `Nilai Vegetatif: ${xValue}<br>Serapan Biaya: ${Highcharts.numberFormat(yValue as number, 0, ",", ".")}%`
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: { point: Point }) {
            const point = this.point as Point
            return point.kebun
          },
          style: {
            fontSize: "9px",
            fontWeight: "bold",
            color: "#FFFFFF", // Changed to white
          },
          verticalAlign: "bottom",
          align: "center",
          y: 15,
          crop: false,
          overflow: undefined,
        },
        point: {
          events: {
            click: function (this: Highcharts.Point) {
              const point = this as any
              setModalData({
                pica: point.x,
                cashcost: point.y,
                kebun: point.kebun,
                bulan: point.bulan,
                tahun: point.tahun,
                kode_kebun: point.kode_kebun,
              })
              setShowModal(true)
            },
          },
        },
      },
    },
    series: [
      {
        type: "scatter",
        name: "PICA TBM I",
        color: "#FFFFFF", // Changed to white dots for better visibility on dark background
        data: data.map((item) => ({
          x: Number.parseFloat(item.pica.toString()),
          y: Number.parseFloat(item.cashcost.toString()),
          kebun: item.kebun,
          bulan: item.bulan,
          tahun: item.tahun,
          kode_kebun: item.kode_kebun,
        })),
      },
    ],
  }

  return (
    <div className="p-4 rounded-lg">
      {" "}
      {/* Changed background color to match chart */}
      <div id="chart" className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: `${height}px`, width: "100%" } }}
        />
      </div>
    </div>
  )
}

