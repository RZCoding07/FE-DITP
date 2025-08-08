"use client"

import { useRef, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface PlanByTimeframeProps {
    isDarkMode: boolean
    data: any[] // Add this prop to receive the API data
}

const PlanByTimeframe = ({ isDarkMode, data }: PlanByTimeframeProps) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    // Colors for dark and light mode
    const colors = isDarkMode ? ["#66b3ff", "#3399ff", "#0066cc", "#003366"] : ["#66b3ff", "#3399ff", "#0066cc", "#003366"]
    const textColor = isDarkMode ? "#e0e0e0" : "#333333"

    // Process data to count each duration category
    const countDurations = () => {
        const counts = {
            shortTerm: 0,
            mediumTerm: 0,
            longTerm: 0,
            veryLongTerm: 0
        }

        data.forEach(item => {
            switch (item.durasi_ca) {
                case 'Jangka Pendek':
                    counts.shortTerm++
                    break
                case 'Jangka Menengah':
                    counts.mediumTerm++
                    break
                case 'Jangka Panjang':
                    counts.longTerm++
                    break
            }
        })

        return counts
    }

    const durationCounts = countDurations()
    const total = data.length

    const options: Highcharts.Options = {
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
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})",
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
                colors: colors,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: textColor,
                    },
                },
            },
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: "Jumlah CA",
                type: "pie",
                data: [
                    {
                        name: "Jangka Pendek (≤4 Bulan)",
                        y: durationCounts.shortTerm,
                    },
                    {
                        name: "Jangka Menengah (5-8 Bulan)",
                        y: durationCounts.mediumTerm,
                    },
                    {
                        name: "Jangka Panjang (9-12 Bulan)",
                        y: durationCounts.longTerm,
                    }
            
                ],
            },
        ],
        legend: {
            itemStyle: {
                color: textColor,
            },
            itemHoverStyle: {
                color: isDarkMode ? "#66b3ff" : "#0066cc",
            },
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            align: "center",
                            verticalAlign: "bottom",
                            layout: "horizontal",
                        },
                    },
                },
            ],
        },
    }

    useEffect(() => {
        if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.update({
                plotOptions: {
                    pie: {
                        dataLabels: {
                            style: {
                                color: textColor,
                            },
                        },
                    },
                },
                legend: {
                    itemStyle: {
                        color: textColor,
                    },
                }
            })
        }
    }, [isDarkMode, textColor])

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
            <h2 className="chart-title text-lg font-semibold py-2 pb-1 text-gray-800 dark:text-gray-200">
                Rencana CA Berdasarkan Jangka Waktu
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total CA: {total}
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
        </div>
    )
}

export default PlanByTimeframe