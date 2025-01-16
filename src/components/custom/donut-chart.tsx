import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { RobotInvestasi } from '../loatie'
import { Button } from '@/components/custom/button'

const DonutChart: React.FC = () => {
  // Data untuk donut chart
  const series = [45, 30, 25, 20] // Nilai untuk Emas Hijau, Merah, dan Hitam
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
      formatter: (val: number) => `${val.toFixed(0)}%`, // Format data menjadi persentase
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
    <div className='grid grid-cols-4 items-center justify-center gap-2 align-middle'>
      <div className='mr-3 mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
        <h2 className='text-center text-xl font-semibold'>TBM 1</h2>
        <hr className='my-2 border-cyan-400' />
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          height={210}
        />
      </div>
      <div className='mr-3 mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
        <h2 className='text-center text-xl font-semibold'>TBM 2</h2>
        <hr className='my-2 border-cyan-400' />
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          height={210}
        />
      </div>
      <div className='mr-3 mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
        <h2 className='text-center text-xl font-semibold'>TBM 3</h2>
        <hr className='my-2 border-cyan-400' />
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          height={210}
        />
      </div>
      <div className='grid'>
        <div className='flex flex-col items-center justify-center'>
          <RobotInvestasi />
        </div>
        <div className='flex flex-col items-center justify-center z-10 -mt-12'>
          <Button variant={'secondary'} className='bg-cyan-700'>
          Analyze Problem Identification  Corrective Actions
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DonutChart
