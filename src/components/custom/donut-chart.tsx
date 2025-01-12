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
      foreColor: '#ffffff',
    },
    colors: ['#FFA500', '#00a300', '#FF0000', '#000000'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce(
                  (a: any, b: any) => a + b,
                  0
                )
              },
              color: '#ffffff',
              fontWeight: 'bold',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val.toFixed(0) + '%'
      },
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function (val, opts) {
        return `&nbsp;${val} <br/> &nbsp;${opts.w.globals.series[opts.seriesIndex]}<br/>`
      },
      labels: {
        colors: '#ffffff',
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
      <div className='mr-3 mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md  shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
        {' '}
        <h2 className='text-center text-xl font-semibold'>TBM 1</h2>
        <hr className='border-cyan-400 my-2' />
        <ReactApexChart
          options={options}
          series={options.series}
          type='donut'
          height={350}
        />
      </div>
      <div className='mr-3 mt-5 rounded-lg  border border-cyan-500 bg-white p-5 shadow-md  shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 '>
        <h2 className='text-center text-xl font-semibold'>TBM 2</h2>
        <hr className='border-cyan-400 my-2' />
 

        <ReactApexChart
          options={options}
          series={options.series}
          type='donut'
          height={350}
        />
      </div>
      <div className='mr-3 mt-5 rounded-lg  border border-cyan-500 bg-white p-5 shadow-md  shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 '>
        <h2 className='text-center text-xl font-semibold'>TBM 3</h2>
        <hr className='border-cyan-400 my-2' />
 
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
