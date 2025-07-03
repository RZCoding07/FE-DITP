"use client"

import { useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import QuadrantTable from "./quadrant-table"

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
  calculated_tbm_from_areal?: string
}

interface ScoreKebunTBM {
  regional: string
  kebun: string
  totalSeleksiKebun: number
  totalLuas: number
  weightedTotalSeleksi: number
}

interface ScatterChartProps {
  isDarkMode: boolean
  
  dataprops: {
    dataSerapanBiaya: DataSerapanBiaya[]
    scoresKebunTBM: ScoreKebunTBM[]
    regions: any
    tbm: any
    scoresAllKebun: any
    bulan: string
    tahun: number
  }
}

const areas = [
  { xRange: [90, 100], yRange: [60, 200], color: "rgba(255, 255, 0, 0.7)" },
  { xRange: [90, 100], yRange: [0, 60], color: "rgba(144, 238, 144, 0.7)" },
  { xRange: [80, 90], yRange: [0, 60], color: "rgba(0, 0, 0, 0.7)" },
  { xRange: [80, 90], yRange: [60, 200], color: "rgba(255, 99, 71, 0.7)" },
]

const EnhancedScatterChart = ({ dataprops, isDarkMode }: ScatterChartProps) => {
  const [modalData, setModalData] = useState<any>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  console.log("dataprops", dataprops)

  // Function to merge objects based on kebun property
  const mergeDataByKebun = () => {
    if (
      !dataprops?.dataSerapanBiaya ||
      !Array.isArray(dataprops.dataSerapanBiaya)
    ) {
      console.error("Invalid data structure", dataprops);
      return [];
    }

    const { dataSerapanBiaya, regions } = dataprops;
    const mergedData = [];

    if (dataprops.tbm === undefined || dataprops.tbm.value === "keseluruhan-tbm") {
      // Handle overall TBM case
      if (!dataprops?.scoresKebunTBM || !Array.isArray(dataprops.scoresKebunTBM)) {
        console.error("Missing scoresKebunTBM data");
        return [];
      }

      for (const serapan of dataSerapanBiaya) {
        const matchingScore = dataprops.scoresKebunTBM.find(
          (score) => score.kebun === serapan.kebun
        );

        if (matchingScore) {
          const serapanBiaya = Number.parseFloat(serapan.persen_serapan);
          const vegetatif = matchingScore.totalSeleksiKebun;

          if (!isNaN(serapanBiaya) && !isNaN(vegetatif)) {
            mergedData.push({
              vegetatif,
              serapanBiaya,
              region: matchingScore.regional,
              kebun: serapan.kebun,
              bulan: "Current",
              tahun: new Date().getFullYear(),
              kode_kebun: serapan.kebun,
            });
          }
        }
      }
    } else {
      // Handle specific TBM case
      const tbm = dataprops.tbm.value;
      if (!dataprops?.scoresAllKebun || !Array.isArray(dataprops.scoresAllKebun)) {
        console.error("Missing scoresAllKebun data");
        return [];
      }

      for (const serapan of dataSerapanBiaya) {
        // First filter serapan data by calculated_tbm_from_areal if it exists
        if (serapan.calculated_tbm_from_areal && serapan.calculated_tbm_from_areal !== tbm) {
          continue;
        }

        const matchingScore = dataprops.scoresAllKebun.find(
          (score: any) =>
            score.kebun === serapan.kebun &&
            score.vw_fase_tbm === tbm
        );

        if (matchingScore) {
          const serapanBiaya = Number.parseFloat(serapan.persen_serapan);
          const vegetatif = matchingScore.totalSeleksian;

          if (!isNaN(serapanBiaya) && !isNaN(vegetatif)) {
            mergedData.push({
              vegetatif,
              serapanBiaya,
              region: matchingScore.regional,
              kebun: serapan.kebun,
              bulan: "Current",
              tahun: new Date().getFullYear(),
              kode_kebun: serapan.kebun,
            });
          }
        }
      }
    }

    // Filter by region if specified
    if (regions !== undefined && regions !== null) {
      const region = regions.value;
      return mergedData.filter((item) => item.region === region);
    }

    return mergedData;
  };

  const chartData = mergeDataByKebun()

  console.log("Chart Data:", chartData)

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
        color: isDarkMode ? "#FFFFFF" : "#000000",
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
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
      min: 80,
      max: 100,
      tickInterval: 1,
      labels: {
        style: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
      lineColor: isDarkMode ? "#FFFFFF" : "#000000",
      gridLineColor: isDarkMode ? "#FFFFFF" : "#E5E7EB",
      plotLines: [
        {
          color: isDarkMode ? "#FFFFFF" : "#000000",
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
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
  },
  min: 0,
  max: 200,
  tickInterval: 10,
  labels: {
    formatter: function (this: { value: number }): string {
      return Highcharts.numberFormat(Math.abs(this.value), 0, ",", ".")
    },
    style: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
  },
  lineColor: "transparent",
  gridLineColor: "transparent",
  plotLines: [
    {
      color: "#000", // Warna garis merah
      width: 2,     // Lebar garis
      value: 120,   // Posisi y=120
      zIndex: 5,    // Z-index untuk memastikan garis muncul di depan
      dashStyle: 'dash', // Gaya garis (solid, dash, dot, etc.)
      label: {
        text: '', // Teks label
        align: 'left',      // Posisi teks
      
        style: {
          color: '#000',      // Warna teks
          fontWeight: 'bold',
        }
      }
    },
    {
      color: "red",
      width: 1,
      value: 0,
      zIndex: 5,
    },
        {
      color: "#000", // Warna garis merah
      width: 0.5,     // Lebar garis
      value: 100,   // Posisi y=120
      zIndex: 5,    // Z-index untuk memastikan garis muncul di depan
      dashStyle: 'solid', // Gaya garis (solid, dash, dot, etc.)
      label: {
        text: '', // Teks label
        align: 'left',      // Posisi teks
      
        style: {
          color: '#000',      // Warna teks
          fontWeight: 'bold',
        }
      }
    },
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
        color: isDarkMode ? "#FFFFFF" : "#000000",
      },
      itemHoverStyle: {
        color: isDarkMode ? "#D1D5DB" : "#6B7280",
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
            color: isDarkMode ? "#FFFFFF" : "#000000",
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
        color: isDarkMode ? "#FFFFFF" : "#000000",
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
    <>
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 dark:from-sky-700 dark:to-cyan-600 p-4 rounded-lg mb-6">
      <div className="space-y-6">
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
                    <span className="font-medium">Nilai Vegetatif:</span> {modalData.vegetatif.toFixed(2)}
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

        {/* Add the QuadrantTable component below the chart */}
      </div>

      </div>
      <QuadrantTable chartData={chartData} />

    </>
  )
}

export default EnhancedScatterChart