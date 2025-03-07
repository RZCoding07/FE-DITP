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
  vegetatif: number
  serapanBiaya: number
}

interface DataSerapanBiaya {
  kebun: string
  total_real_sd: number
  total_rkap_sd: number
  persen_serapan: string
  total_luas: number
  total_rp_ha: number
}

interface ScoreKebunTBM {
  regional: string
  kebun: string
  totalSeleksiKebun: number
  totalLuas: number
  weightedTotalSeleksi: number
}

interface ScatterChartProps {
  dataprops: {
    dataSerapanBiaya: DataSerapanBiaya[]
    scoresKebunTBM: ScoreKebunTBM[]
    regions: any
    tbm: any
    scoresKebun: any
  }
}

const areas = [
  // { xRange: [90, 100], yRange: [60, 100], color: "rgba(255, 255, 0, 0.7)" },
  { xRange: [90, 100], yRange: [60, 200], color: "rgba(255, 255, 0, 0.7)" },
  // { xRange: [90, 100], yRange: [-100, 60], color: "rgba(144, 238, 144, 0.7)" },
  { xRange: [90, 100], yRange: [0, 60], color: "rgba(144, 238, 144, 0.7)" },
  // { xRange: [80, 90], yRange: [60, 100], color: "rgba(255, 99, 71, 0.7)" },
  // { xRange: [80, 90], yRange: [-100, 60], color: "rgba(0, 0, 0, 0.7)" },
  { xRange: [80, 90], yRange: [0, 60], color: "rgba(0, 0, 0, 0.7)" },
  // { xRange: [80, 90], yRange: [60, 100], color: "rgba(255, 99, 71, 0.7)" },
  { xRange: [80, 90], yRange: [60, 200], color: "rgba(255, 99, 71, 0.7)" },
  { xRange: [80, 90], yRange: [100, 60], color: "rgba(0, 0, 0, 0.7)" },
]

const ScatterChart = ({ dataprops }: ScatterChartProps) => {
  const [modalData, setModalData] = useState<any>(null)
  const [showModal, setShowModal] = useState<boolean>(false)




  // Function to merge objects based on kebun property
  const mergeDataByKebun = () => {
    if (
      !dataprops?.dataSerapanBiaya ||
      !dataprops?.scoresKebunTBM ||
      !Array.isArray(dataprops.dataSerapanBiaya) ||
      !Array.isArray(dataprops.scoresKebunTBM)
    ) {
      console.error("Invalid data structure", dataprops)
      return []
    }

    const { dataSerapanBiaya, scoresKebunTBM, regions } = dataprops

    const mergedData = []

    if (dataprops.tbm === undefined || dataprops.tbm.value === "keseluruhan-tbm") {
      for (const serapan of dataSerapanBiaya) {
        const matchingScore = scoresKebunTBM.find((score) => score.kebun === serapan.kebun)

        if (matchingScore) {
          // Convert persen_serapan to number
          const serapanBiaya = Number.parseFloat(serapan.persen_serapan)
          // Use totalSeleksiKebun as vegetatif value
          const vegetatif = matchingScore.totalSeleksiKebun

          if (!isNaN(serapanBiaya) && !isNaN(vegetatif)) {
            mergedData.push({
              vegetatif,
              // serapanBiaya: serapanBiaya > 100 ? -(serapanBiaya - 100) : serapanBiaya,
              serapanBiaya: serapanBiaya,
              region: matchingScore.regional,
              kebun: serapan.kebun,
              bulan: "Current", // Default value since it's not in the data
              tahun: new Date().getFullYear(), // Current year as default
              kode_kebun: serapan.kebun,
            })
          }
        }
      }
    } else {
      const tbm = dataprops.tbm.value
      if (dataprops.scoresKebun !== undefined) {
        const scoresKebun = dataprops.scoresKebun
        let z: any = []
        scoresKebun.filter((x: any) => {
          if (Object.keys(x).includes(tbm)) {
            z.push(Object.values(x)[0])
          }
        })

        for (const serapan of dataSerapanBiaya) {
          const matchingScore = z.find((score: any) => score.kebun === serapan.kebun)

          if (matchingScore) {
            // Convert persen_serapan to number
            const serapanBiaya = Number.parseFloat(serapan.persen_serapan)
            // Use totalSeleksiKebun as vegetatif value
            const vegetatif = matchingScore.totalSeleksiKebun

            if (!isNaN(serapanBiaya) && !isNaN(vegetatif)) {
              mergedData.push({
                vegetatif,
                serapanBiaya: serapanBiaya > 100 ? -(serapanBiaya - 100) : serapanBiaya,
                region: matchingScore.regional,
                kebun: serapan.kebun,
                bulan: "Current", // Default value since it's not in the data
                tahun: new Date().getFullYear(), // Current year as default
                kode_kebun: serapan.kebun,
              })
            }
          }
          }

      }

    }


    if (regions !== undefined && regions !== null) {
      const region = regions.value
      return mergedData.filter((item) => item.region === region)
    }

    if (mergedData.length === 0) {
      console.warn("No matching data found, using sample data")
      return [

      ]
    }

    return mergedData
  }

  const chartData = mergeDataByKebun()

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
      plotLines: [
        {
          color: "#FFFFFF",
          width: 1,
          value: 0,
          zIndex: 5,
        },
      ],
    },
    yAxis: {
      title: {
        text: "Serapan Biaya (%)",
        style: {
          color: "#FFFFFF",
        },
      },
      // min: -100,
      // max: 100,
      min: 0,
      max: 200,
      tickInterval: 10,
      labels: {
        formatter: function (this: { value: number }): string {
          // if (this.value === -10) return "110"
          // if (this.value === -20) return "120"
          // if (this.value === -30) return "130"
          // if (this.value === -40) return "140"
          // if (this.value === -50) return "150"
          // if (this.value === -60) return "160"
          // if (this.value === -70) return "170"
          // if (this.value === -80) return "180"
          // if (this.value === -90) return "190"
          // if (this.value === -100) return "200"

          return Highcharts.numberFormat(Math.abs(this.value), 0, ",", ".")
        },
        style: {
          color: "#FFFFFF",
        },
      },
      lineColor: "transparent",
      gridLineColor: "transparent",
      plotLines: [
        {
          color: "red",
          width: 1,
          value: 0,
          zIndex: 5,
        },
      ],
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
          pointFormatter: function (this: Highcharts.Point & Point): string {
            const xValue = this.x !== undefined ? this.x : "N/A"
            const yValue = this.y !== undefined ? Math.floor(Number.parseFloat(this.y.toString())) : "N/A"
            return `<strong>Kebun: ${this.kebun}</strong><br>Nilai Vegetatif: ${xValue}<br>Serapan Biaya: 
            ${this.y < 0 ? `${Math.abs(Number(yValue)) + 100}%` : `${yValue}%`}`
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: { point: Point }) {
            const point = this.point as Point
            return `${point.kebun}`
          },
          style: {
            fontSize: "11px",
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
                vegetatif: point.x,
                serapanBiaya: point.y,
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
        name: "",
        color: "#FFFFFF",
        showInLegend: false,
        data: chartData.map((item) => ({
          x: Number.parseFloat(item.vegetatif.toString()),
          y: Number.parseFloat(item.serapanBiaya.toString()),
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

      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Detail Kebun: {modalData.kebun}</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Nilai Vegetatif:</span> {modalData.vegetatif}
              </p>
              <p>
                <span className="font-medium">Serapan Biaya:</span>{" "}
                {Highcharts.numberFormat(Math.abs(modalData.serapanBiaya), 0, ",", ".")} %
              </p>
              <p>
                <span className="font-medium">Bulan:</span> {modalData.bulan}
              </p>
              <p>
                <span className="font-medium">Tahun:</span> {modalData.tahun}
              </p>
              <p>
                <span className="font-medium">Kode Kebun:</span> {modalData.kode_kebun}
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScatterChart

