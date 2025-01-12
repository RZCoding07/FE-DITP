import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { RobotInvestasi } from '@/components/loatie'

interface TbmData {
  score100: number
  score90: number
  score80: number
  total: number
}

interface DonutChartProps {
  tbmDataScorePelepahBlok: {
    tbm1: TbmData
    tbm2: TbmData
    tbm3: TbmData
  }
  tbmDataScoreLingkarBlok: {
    tbm1: TbmData
    tbm2: TbmData
    tbm3: TbmData
  }
}

const calculateAverages = (pelepah: TbmData, lingkar: TbmData) => {
  const avgPelepah100 = (pelepah.score100 / pelepah.total) * 20 || 0
  const avgPelepah90 = (pelepah.score90 / pelepah.total) * 20 || 0
  const avgPelepah80 = (pelepah.score80 / pelepah.total) * 20 || 0

  const avgLingkar100 = (lingkar.score100 / lingkar.total) * 50 || 0
  const avgLingkar90 = (lingkar.score90 / lingkar.total) * 50 || 0
  const avgLingkar80 = (lingkar.score80 / lingkar.total) * 50 || 0

  return {
    avgPelepah100,
    avgPelepah90,
    avgPelepah80,
    avgLingkar100,
    avgLingkar90,
    avgLingkar80,
  }
}

const DonutChart: React.FC<DonutChartProps> = ({
  tbmDataScorePelepahBlok,
  tbmDataScoreLingkarBlok,
}) => {
  const options: ApexOptions = {
    labels: ['Emas', 'Hijau', 'Merah', 'Hitam'],
    chart: {
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
              formatter: (w) =>
                w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toFixed(0),
              color: '#ffffff',
              fontWeight: 'bold',
            },
            value: {
              formatter: (val: string) => Number(val).toFixed(0),
                
            }
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: (val, opts) =>
        `${val}: ${opts.w.globals.series[opts.seriesIndex].toFixed(0)}%`,
      labels: {
        colors: '#ffffff',
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(0)}`,
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

  const renderDonutChart = (title: string, series: number[]) => (
    <div className='mr-3 mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
      <h2 className='text-center text-xl font-semibold text-white'>{title}</h2>
      <hr className='my-2 border-cyan-400' />
      <ReactApexChart
        options={options}
        series={series}
        type='donut'
        height={350}
      />
    </div>
  )

  const tbmCharts = Object.keys(tbmDataScorePelepahBlok).map((tbmKey) => {
    const pelepahData =
      tbmDataScorePelepahBlok[tbmKey as keyof typeof tbmDataScorePelepahBlok]
    const lingkarData =
      tbmDataScoreLingkarBlok[tbmKey as keyof typeof tbmDataScoreLingkarBlok]
    const {
      avgPelepah100,
      avgPelepah90,
      avgPelepah80,
      avgLingkar100,
      avgLingkar90,
      avgLingkar80,
    } = calculateAverages(pelepahData, lingkarData)

    // Placeholder grades, replace with logic to calculate actual percentages
    console.log(avgPelepah100)
    const gradeA = avgPelepah100 + avgLingkar100
    const gradeB = avgPelepah90 + avgLingkar90
    const gradeC = avgPelepah80 + avgLingkar80
    const gradeD = 100 - gradeA - gradeB - gradeC

    return renderDonutChart(`TBM ${tbmKey.slice(-1)}`, [
      gradeA,
      gradeB,
      gradeC,
      gradeD,
    ])
  })

  return (
    <div className='grid gap-4 lg:grid-cols-4 2xl:grid-cols-4'>
      {tbmCharts}
      <RobotInvestasi />
    </div>
  )
}

export default DonutChart
