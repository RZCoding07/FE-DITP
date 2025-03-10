"use client"

import type React from "react"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

interface ProblemData {
    regional: string
    Kategori: string
    "Problem Identification": string
    Detail: string
    "Root Causes": string
    "Corrective Action": string
    w1: string
    w2: string
    w3: string
    w4: string
}

interface StatusPieChartProps {
    data: ProblemData[]
}

const RStatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
    const [theme, setTheme] = useState<string>("light")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === "class") {
                        setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
                    }
                })
            })

            observer.observe(document.documentElement, { attributes: true })

            return () => observer.disconnect()
        }
    }, [])

    const processStatusData = () => {
        const regionalStatusCounts: Record<string, Record<string, number>> = {}

        data.forEach((item) => {
            const regional = item.regional
            if (!regionalStatusCounts[regional]) {
                regionalStatusCounts[regional] = {
                    "Done": 0,
                    "On Progress": 0,
                    "Not Started": 0,
                }
            }

            [item.w1, item.w2, item.w3, item.w4].forEach((status) => {
                if (!status || status.trim() === "") {
                    return
                }

                if (status.includes("Done")) {
                    regionalStatusCounts[regional]["Done"]++
                } else if (status.includes("On Progress")) {
                    regionalStatusCounts[regional]["On Progress"]++
                } else if (status.includes("Not Started")) {
                    regionalStatusCounts[regional]["Not Started"]++
                }
            })
        })

        return Object.entries(regionalStatusCounts).map(([regional, counts]) => ({
            regional,
            counts,
        }))
    }

    const regionalData = processStatusData()

    return (
        <div className="flex flex-wrap">
            {regionalData.map((item) => {
                const labels = Object.keys(item.counts)
                const series = Object.values(item.counts)

                const regionalOptions: ApexOptions = {
                    chart: {
                        type: "pie",
                        foreColor: theme === "dark" ? "#ffffff" : "#000000",
                    },
                    labels,
                    colors: [
                        "#10b981", // Green for Done
                        "#3b82f6", // Blue for On Progress
                        "#f97316", // Orange for Not Started
                    ],
                    legend: {
                        position: "bottom",
                        horizontalAlign: "center",
                        labels: {
                            colors: theme === "dark" ? "#ffffff" : "#000000",
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (val: number) => `${Math.round(val)}%`,
                        style: {
                            fontSize: "14px",
                            fontWeight: "bold",
                            colors: ["#fff"],
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => `${val} item${val !== 1 ? "s" : ""}`,
                        },
                        theme: theme === "dark" ? "dark" : "light",
                    },
                    title: {
                        text: `Status Distribution ${item.regional}`,
                        align: "center",
                        style: {
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                    },
                }

                return (
                    <div className="w-1/3 p-4" key={item.regional}>

                            <ReactApexChart options={regionalOptions} series={series} type="pie" height={250} />
                    </div>
                )
            })}
        </div>
    )
}

export default RStatusPieChart