"use client"

import { useRef, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface PlanByTimeframeProps {
    isDarkMode: boolean
}

const PlanByTimeframe = ({ isDarkMode }: PlanByTimeframeProps) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    // Colors for dark and light mode
    const colors = isDarkMode ? ["#66b3ff", "#3399ff", "#0066cc"] : ["#66b3ff", "#3399ff", "#0066cc"]

    const textColor = isDarkMode ? "#e0e0e0" : "#333333"

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
                colors: colors,
                dataLabels: {
                    enabled: true,
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
                name: "Percentage",
                type: "pie",
                data: [
                    {
                        name: "Jangka Pendek (Sampai dengan 4 Bulan)",
                        y: 72.1,
                    },
                    {
                        name: "Jangka Menengah (Sampai dengan 8 Bulan)",
                        y: 21.4,
                    },
                    {
                        name: "Jangka Panjang (Lebih dari 8 Bulan)",
                        y: 6.6,
                    },
                ],
            },
        ],
        legend: {
            itemStyle: {
                color: textColor,
            },
            itemHoverStyle: {
                color: "#FF0000",
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
            })
        }
    }, [isDarkMode, textColor])

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
            <h2 className="chart-title text-lg font-semibold py-2 pb-1">Rencana CA Berdasarkan Jangka Waktu</h2>
            <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
        </div>
    )
}

export default PlanByTimeframe




