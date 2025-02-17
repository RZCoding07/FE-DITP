import React from "react"
import ReactApexChart from "react-apexcharts"
import { ApexOptions } from "apexcharts"

const getRandomColor = (() => {
    const usedColors = new Set<string>()
    const colorArrays = [
        ["#54bebe", "#76c8c8", "#98d1d1", "#badbdb", "#dedad2", "#e4bcad", "#df979e", "#d7658b", "#c80064"],
        ["#e27c7c", "#a86464", "#6d4b4b", "#503f3f", "#333333", "#3c4e4b", "#466964", "#599e94", "#6cd4c5"],
        ["#f7b267", "#f79d65", "#f4845f", "#f26f5a", "#f05756", "#e64752", "#d8374e", "#c9274a", "#b91a46"],
    ]

    return (reset = false) => {
        if (reset) usedColors.clear() // Reset warna sebelum memulai chart baru
        let color
        do {
            const randomArray = colorArrays[Math.floor(Math.random() * colorArrays.length)]
            color = randomArray[Math.floor(Math.random() * randomArray.length)]
        } while (usedColors.has(color) && usedColors.size < 9) // Hindari warna duplikat
        usedColors.add(color)
        return color
    }
})()

const DonutChart = ({ dataprops }: { dataprops: { data: { regional: string; total_sisa_akhir_bibit: number }[] } }) => {
    let series = dataprops.data.map((item) => item.total_sisa_akhir_bibit)
    // buat ke angka
    series = series.map((item) => Math.round(item))
    const labels = dataprops.data.map((item) => item.regional)

    const totalBibit = series.reduce((acc, val) => acc + val, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // Generate warna random unik
    getRandomColor(true) // Reset warna sebelum memulai chart baru
    const randomColors = labels.map(() => getRandomColor())

    const options: ApexOptions = {
        chart: {
            type: "donut",
        },
        labels: labels,
        legend: {
            position: "right",
            labels: {
                colors: "#FFFFFF", // Legend putih untuk dark mode
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number, opts: { w: { globals: { series: number[] } }; seriesIndex: number }) => {
              const series = opts.w.globals.series
              const total = series.reduce((a, b) => a + b, 0)
              const percent = ((opts.w.globals.series[opts.seriesIndex] / total) * 100).toFixed(1)
              const value = dataprops.data[opts.seriesIndex].total_sisa_akhir_bibit.toLocaleString()
              return [`${percent}%`, `${value}`]
            },
          },
        fill: {
            type: "gradient",
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val.toLocaleString()}`, // Format angka dengan pemisah ribuan
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
                    size: "50%", // Mengatur ukuran donat agar tidak terlalu besar
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            formatter: () => totalBibit,
                        },
                    },
                },
            },
        }
    }

    return <ReactApexChart options={options} series={series} type="donut" height={270} />
}

export default DonutChart
