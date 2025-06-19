"use client"

import { useRef, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface ProgressByTimeframeProps {
  isDarkMode: boolean
}

const ProgressByTimeframe = ({ isDarkMode }: ProgressByTimeframeProps) => {
  const shortTermRef = useRef<HighchartsReact.RefObject>(null)
  const mediumTermRef = useRef<HighchartsReact.RefObject>(null)
  const longTermRef = useRef<HighchartsReact.RefObject>(null)

  const textColor = isDarkMode ? "#e0e0e0" : "#333333"

  // Short term chart options
  const shortTermOptions: Highcharts.Options = {
    chart: {
      type: "pie",
        backgroundColor:"none",
      height: 300,
      style: {
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "55%",
        colors: isDarkMode ? ["#66b3ff", "#99ccff"] : ["#66b3ff", "#99ccff"],
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            color: textColor,
            textOutline: "none",
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Percentage",
        type: "pie",
        data: [
          {
            name: "Selesai",
            y: 10.9,
          },
          {
            name: "Belum Selesai",
            y: 89.1,
          },
        ],
      },
    ],
  }

  // Medium term chart options
  const mediumTermOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "none",
      height: 300,
      style: {
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "55%",
        colors: isDarkMode ? ["#3399ff", "#66b3ff"] : ["#3399ff", "#66b3ff"],
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            color: textColor,
            textOutline: "none",
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Percentage",
        type: "pie",
        data: [
          {
            name: "Selesai",
            y: 14.3,
          },
          {
            name: "Belum Selesai",
            y: 85.7,
          },
        ],
      },
    ],
  }

  // Long term chart options
  const longTermOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 300,
      style: {
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "55%",
        colors: isDarkMode ? ["#6680b3", "#0066cc"] : ["#6680b3", "#0066cc"],
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            color: textColor,
            textOutline: "none",
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Percentage",
        type: "pie",
        data: [
          {
            name: "Selesai",
            y: 20.0,
          },
          {
            name: "Belum Selesai",
            y: 80.0,
          },
        ],
      },
    ],
  }

  useEffect(() => {
    const refs = [shortTermRef, mediumTermRef, longTermRef]

    refs.forEach((ref) => {
      if (ref.current && ref.current.chart) {
        ref.current.chart.update({
          chart: {
            backgroundColor: "none",
          },
          plotOptions: {
            pie: {
              dataLabels: {
                style: {
                  color: textColor,
                },
              },
            },
          },
        })
      }
    })
  }, [isDarkMode, textColor])

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-lg shadow-md text-center">

      <div className="progress-charts grid grid-cols-1 md:grid-cols-3  w-full py-4">
        <div>
          <p className="font-semibold">Jangka Pendek (Sampai dengan 4 Bulan)</p>
                    <hr className="my-2 border-cyan-600 mx-10" />

          <HighchartsReact highcharts={Highcharts} options={shortTermOptions} ref={shortTermRef} />
        </div>
        <div>
          <p className="font-semibold">Jangka Menengah (Sampai dengan 8 Bulan)</p>
                    <hr className="my-2 border-cyan-600 mx-10" />

          <HighchartsReact highcharts={Highcharts} options={mediumTermOptions} ref={mediumTermRef} />
        </div>
        <div>
          <p className="font-semibold">Jangka Panjang (Sampai dengan 12 Bulan)</p>
                    <hr className="my-2 border-cyan-600 mx-10" />

          <HighchartsReact highcharts={Highcharts} options={longTermOptions} ref={longTermRef} />
        </div>
      </div>
    </div>
  )
}

export default ProgressByTimeframe
