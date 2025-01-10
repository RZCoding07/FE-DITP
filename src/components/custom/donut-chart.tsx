import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const DonutChart: React.FC = () => {
  const options: ApexOptions = {
    series: [44, 55, 41, 17],
    labels: ['Emas', 'Hijau', 'Merah', 'Hitam'],

    
    chart: {
      width: 380,
      type: 'donut',
    },
    colors: ['#FFA500', '#00a300', '#FF0000', '#000000'],
    
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function (val, opts) {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`
      },
      labels: {
        colors: '#ffffff', // Custom label colors for the legend
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
<>
<div className='mt-5 dark:bg-slate-900 p-5 rounded-lg mr-3'>     <h2 className='text-xl font-semibold text-center'>TBM 1</h2>
      <ReactApexChart
        options={options}
        series={options.series}
        type='donut'
        height={350}
      />
    </div>
    <div className='mt-5 dark:bg-slate-900 p-5 rounded-lg mr-3'>
      <h2 className='text-xl font-semibold text-center'>TBM 2</h2>
      <ReactApexChart
        options={options}
        series={options.series}
        type='donut'
        height={350}
      />
    </div>
    <div className='mt-5 dark:bg-slate-900 p-5 rounded-lg mr-3'>
      <h2 className='text-xl font-semibold text-center'>TBM 3</h2>
      <ReactApexChart
        options={options}
        series={options.series}
        type='donut'
        height={350}
      />
    </div>
</>
  )
}

export default DonutChart
