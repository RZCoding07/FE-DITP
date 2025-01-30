import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { RobotInvestasi } from '../loatie'
import { Button } from '@/components/custom/button'

const DonutChart = ({
  dataprops }: {
    dataprops: any
  }) => {

  // Data untuk donut chart
  const series = [dataprops.data.emas, dataprops.data.hijau, dataprops.data.merah, dataprops.data.hitam] // Nilai untuk Emas Hijau, Merah, dan Hitam
  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Emas', 'Hijau', 'Merah', 'Hitam'], // Label kategori
    colors: ['#FFA500', '#00a300', '#FF0000', '#000000'], // Warna Emas, Hijau, Merah, Hitam
    legend: {
      position: 'right',
      labels: {
        colors: '#FFFFFF', // Agar teks legend putih (untuk dark mode)
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`, // Format data menjadi persentase
    },

    fill: {
      type: 'gradient',
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
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type='donut'
        height={270}
      />

    </>

  )
}

export default DonutChart
