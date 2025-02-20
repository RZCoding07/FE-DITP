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

const areas = [
  // Green quadrant (top-right) - Kuadran Hijau 
  { xRange: [90, 100], yRange: [60, 100], color: "rgba(255, 255, 0, 0.7)" },

  // Yellow quadrant (bottom-right) - Kuadran Kuning
  { xRange: [90, 100], yRange: [-100, 60], color: "rgba(144, 238, 144, 0.7)" },

  // Orange quadrant (top-left) - Kuadran Orange
  { xRange: [80, 90], yRange: [60, 100], color: "rgba(255, 99, 71, 0.7)" },

  // Black quadrant (bottom-left) - Kuadran Hitam (awal)
  { xRange: [80, 90], yRange: [-100, 60], color: "rgba(0, 0, 0, 0.7)" },
];

const ScatterChart = () => {
  const data = [
    { pica: 90, cashcost: 100, kebun: "Kebun 1", bulan: "Januari", tahun: 2021, kode_kebun: "K1" },
    { pica: 95, cashcost: 80, kebun: "Kebun 2", bulan: "Februari", tahun: 2021, kode_kebun: "K2" },
    { pica: 80, cashcost: 50, kebun: "Kebun 3", bulan: "Maret", tahun: 2021, kode_kebun: "K3" },
    { pica: 88, cashcost: 130, kebun: "Kebun 4", bulan: "April", tahun: 2021, kode_kebun: "K4" },
  ]

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
        color: "#FFFFFF",
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
          color: "#FFFFFF",
        },
      },
      min: 80,
      max: 100,
      tickInterval: 1,
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
      lineColor: "#FFFFFF",
      gridLineColor: "#FFFFFF",
      plotLines: [{
        color: '#FFFFFF', // Warna garis
        width: 1, // Lebar garis
        value: 0, // Posisi garis di sumbu x
        zIndex: 5 // Z-index untuk memastikan garis di atas elemen lain
      }]
    },
    yAxis: {
      title: {
        text: "Serapan Biaya (%)",
        style: {
          color: "#FFFFFF",
        },
      },
      min: -100,
      max: 100,
      tickInterval: 10,
      labels: {
        formatter: function (this: { value: number }): string {
          const x = Highcharts.numberFormat(this.value - 20, 0, ",", ".")
          if((this.value) === -10) {
            return "110"
          } else if((this.value) === -20) {
            return "120"
          } else if((this.value) === -30) {
            return "130"
          } else if((this.value) === -40) {
            return "140"
          } else if((this.value) === -50) {
            return "150"
          } else if((this.value) === -60) {
            return "160"
          } else if((this.value) === -70) {
            return "170"
          } else if((this.value) === -80) {
            return "180"
          } else if((this.value) === -90) {
            return "190"
          } else if((this.value) === -100) {
            return "200"
          }
    
          return Highcharts.numberFormat(Math.abs(this.value), 0, ",", ".")
          // return `${Math.abs(this.value)}`
        },
        style: {
          color: "#FFFFFF",
        },
      },
      lineColor: "transparent",
      gridLineColor: "transparent",
      plotLines: [{
        color: 'red', // Warna garis
        width: 1, // Lebar garis
        value: 0, // Posisi garis di sumbu y
        zIndex: 5 // Z-index untuk memastikan garis di atas elemen lain
      }]
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      floating: false,
      backgroundColor: "transparent",
      borderWidth: 0,
      itemStyle: {
        color: "#FFFFFF",
      },
      itemHoverStyle: {
        color: "#D1D5DB",
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 4,
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(200,200,200)",
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
            return `Nilai Vegetatif: ${xValue}<br>Serapan Biaya: ${Highcharts.numberFormat(Math.abs(yValue as number), 0, ",", ".")}%`
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: { point: Point }) {
            const point = this.point as Point
            return `${point.kebun}`
          },
          style: {
            fontSize: "9px",
            fontWeight: "bold",
            color: "#FFFFFF",
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
        color: "#FFFFFF",
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
      <div id="chart" className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: `800px`, width: "100%" } }}
        />
      </div>
    </div>
  )
}

export default ScatterChart