"use client"

import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface StageData {
  tahapan_id: number
  tahapan_name: string
  subtahapans: Array<{
    sub_tahapan_id: number
    sub_tahapan_name: string
    parameters: Array<{
      parameter_id: number
      parameter_name: string
      pengamatans: Array<{
        pengamatan_id: number
        pengamatan_name: string
        is_selected: boolean
      }>
    }>
  }>
}

interface MonevStageChartProps {
  data: StageData[]
}

export function MonevStageChart({ data }: MonevStageChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [chartOptions, setChartOptions] = useState<ApexOptions>({})

  useEffect(() => {
    const processedData = data.map(stage => {
      let totalParameters = 0
      let compliantParameters = 0
      let completedParameters = 0

      stage.subtahapans.forEach(substage => {
        substage.parameters.forEach(parameter => {
          totalParameters++
          
          const hasSelection = parameter.pengamatans.some(obs => obs.is_selected)
          if (hasSelection) {
            completedParameters++
            
            const hasCompliantSelection = parameter.pengamatans.some(obs => 
              obs.is_selected && (
                obs.pengamatan_name.toLowerCase().includes('sesuai') ||
                obs.pengamatan_name.toLowerCase().includes('dilakukan') ||
                obs.pengamatan_name.toLowerCase().includes('ada') ||
                obs.pengamatan_name.toLowerCase().includes('dipasang') ||
                obs.pengamatan_name.toLowerCase().includes('bebas') ||
                obs.pengamatan_name.toLowerCase().includes('tidak berpotensi') ||
                obs.pengamatan_name.toLowerCase().includes('tidak ada serangan') ||
                obs.pengamatan_name.toLowerCase().includes('rutin')
              )
            )
            
            if (hasCompliantSelection) {
              compliantParameters++
            }
          }
        })
      })

      return {
        name: stage.tahapan_name,
        totalParameters,
        compliantParameters,
        completedParameters,
        complianceRate: totalParameters > 0 ? (compliantParameters / totalParameters) * 100 : 0,
        completionRate: totalParameters > 0 ? (completedParameters / totalParameters) * 100 : 0
      }
    })

    const categories = processedData.map(item => item.name)
    const complianceData = processedData.map(item => item.complianceRate)
    const completionData = processedData.map(item => item.completionRate)

    setChartData([
      {
        name: 'Compliance Rate',
        data: complianceData
      },
      {
        name: 'Completion Rate',
        data: completionData
      }
    ])

    setChartOptions({
      chart: {
        type: 'bar',
        background: 'transparent',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          speed: 800,
        }
      },
      colors: ['#10b981', '#3b82f6'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.8,
          gradientToColors: ['#059669', '#1d4ed8'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100]
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 8,
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + '%'
        },
        offsetY: -20,
        style: {
          fontSize: '10px',
          colors: ['#ffffff'],
          fontWeight: 600
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: '#e5e7eb',
            fontSize: '12px'
          },
          rotate: -45,
          maxHeight: 120
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: 'Percentage (%)',
          style: {
            color: '#e5e7eb',
            fontSize: '12px',
            fontWeight: 500
          }
        },
        labels: {
          style: {
            colors: '#e5e7eb',
            fontSize: '12px'
          },
          formatter: function (val: number) {
            return val.toFixed(0) + '%'
          }
        },
        max: 100
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#e5e7eb'
        },
      
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: function (val: number) {
            return val.toFixed(1) + '%'
          }
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '80%'
            }
          },
          dataLabels: {
            enabled: false
          }
        }
      }]
    })
  }, [data])

  return (
    <div className="w-full h-80">
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height="100%"
      />
    </div>
  )
}
