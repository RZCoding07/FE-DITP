"use client"

import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface MonevComplianceChartProps {
  data: {
    compliantParameters: number
    totalParameters: number
    complianceRate: number
    notAssessedParameters: number
  }
}

export function MonevComplianceChart({ data }: MonevComplianceChartProps) {
  // Calculate non-compliant parameters (total - compliant - not assessed)
  const nonCompliantParameters = data.totalParameters - data.compliantParameters - (data.notAssessedParameters || 0)
  
  const chartData = [
    {
      name: "Compliant",
      value: data.compliantParameters,
      percentage: (data.compliantParameters / data.totalParameters) * 100,
    },
    {
      name: "Non-Compliant", 
      value: nonCompliantParameters,
      percentage: (nonCompliantParameters / data.totalParameters) * 100,
    },
    {
      name: "Not Assessed",
      value: data.notAssessedParameters || 0,
      percentage: ((data.notAssessedParameters || 0) / data.totalParameters) * 100,
    },
  ].filter(item => item.value > 0) // Only show categories with values

  const series = chartData.map(item => item.value)
  const labels = chartData.map(item => item.name)

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      }
    },
    labels: labels,
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'radial',
        shadeIntensity: 0.4,
        gradientToColors: ['#34d399', '#f87171', '#fbbf24'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#ffffff']
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex]
        const value = opts.w.globals.series[opts.seriesIndex]
        return `${name}\n${value} (${val.toFixed(1)}%)`
      },
      style: {
        fontSize: '12px',
        fontFamily: 'sans-serif',
        fontWeight: '600',
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45
      },
      offsetX: 0,
      offsetY:0
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '0%'
        }
      }
    },
    legend: {
      show: true,
      position: 'right',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      fontFamily: 'sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#fff',
        useSeriesColors: false
      },
  
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      y: {
        formatter: function (val: number, opts: any) {
          const total = opts.series.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((val / total) * 100).toFixed(1)
          return `${val} Parameters (${percentage}%)`
        }
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          },
          dataLabels: {
            style: {
              fontSize: '10px',
              
            }
          }
       
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          dataLabels: {
            enabled: false
          }
        }
      }
    ]
  }

  return (
       <div className="h-[300px]">
          <Chart
            options={options}
            series={series}
            type="pie"
            height="100%"
          />
        </div>
        
  )
}
