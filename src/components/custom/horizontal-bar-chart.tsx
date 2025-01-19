import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import cookie from 'js-cookie'
import { Card, CardContent } from '@/components/ui/card'

export const StockAnalysisChart = ({
  dataprops,
  onEventClick,
}: {
  dataprops: any
  onEventClick: (data: any) => void
}) => {
  const handleChartClick = (selectedCategory: string, distinctKebun: any[], countBlok: any[], sumLuasBlok: any[]) => {
    const eventData = {
      name: dataprops.title,
      value: dataprops.val,
      color: dataprops.color,
      categories: distinctKebun, // Pass distinctKeb
      countBlok,     // Pass countBlok to the parent
      sumLuasBlok,   // Pass sumLuasBlok to the parent
      selectedCategory,  // Pass the selected category to the parent
    }
    onEventClick(eventData)
  }

  const theme = cookie.get('theme') || 'light'

  // Initialize categories with default values
  const [categories, setCategories] = useState<string[]>([
    'RPC1',
    'RPC2',
    'RPC3',
    'RPC4',
    'RPC5',
    'RPC6',
    'RPC7',
    'RPC2(EX-N2)',
    'RPC2(EX-N14)',
  ])

  const [isKebun, setIsKebun] = useState<boolean>(false)

  let dataset = dataprops.dataset[dataprops.val]


  let score = dataprops.score

  let dataValueOfAllTBM = score.map((item: any) => {
    return Object.values(item)[0]
  }
  )

  if (dataprops.title == 'Keseluruhan TBM') {
    dataset = dataValueOfAllTBM
  }

  console.log('dataset', dataset)

  const countColorBlocks = (data: any, regional: string) => {
    const tbmKeys = ['tbm1', 'tbm2', 'tbm3', 'tbm4']
    return data.reduce((count: number, item: any) => {
      return tbmKeys.some(
        (key) =>
          item[key] &&
          item[key].regional === regional &&
          item[key].colorCategory === dataprops.color
      )
        ? count + 1
        : count
    }, 0)
  }

  const sumColorLuas = (data: any, regional: string) => {
    const tbmKeys = ['tbm1', 'tbm2', 'tbm3', 'tbm4']
    const total = data.reduce((sum: number, item: any) => {
      return tbmKeys.reduce((innerSum: number, key) => {
        return item[key] &&
          item[key].regional === regional &&
          item[key].colorCategory === dataprops.color
          ? innerSum + parseFloat(item[key].luas || '0')
          : innerSum
      }, sum)
    }, 0)

    return Math.round(total)
  }

  let datas: any[] = []

  if (dataprops.untuk === 'Total Blok') {
    if (dataprops.color === 'all') {
      datas = categories.map((category) => {
        const filter = dataset.filter(
          (data: any) => data.regional === category
        ).length
        return { category, filter }
      })
    }
    else {
      const dataColor = score.filter((score: any) => {
        return (
          (Object.values(score)[0] as any).colorCategory === dataprops.color
        )
      })

      datas = categories.map((category) => {
        const filter = countColorBlocks(dataColor, category)
        return { category, filter }
      })
    }

    if (dataprops.title === 'Keseluruhan TBM') {

      datas = categories.map((category) => {
        const filter = dataset.filter(
          (data: any) => data.regional === category
        ).length
        return { category, filter }
      })
    }
  } else if (dataprops.untuk === 'Total Luasan') {
    if (dataprops.color === 'all') {
      datas = categories.map((category) => {
        const filter = dataset.reduce((sum: number, item: any) => {
          return item.regional === category
            ? sum + parseFloat(item.luas_ha || '0')
            : sum
        }, 0)
        const roundedFilter = Math.round(filter)

        return { category, filter: roundedFilter }
      })
    } else {
      const dataColor = score.filter((score: any) => {
        return (
          (Object.values(score)[0] as any).colorCategory === dataprops.color
        )
      })

      datas = categories.map((category) => {
        const filter = sumColorLuas(dataColor, category)
        return { category, filter }
      })
    }

    if (dataprops.title === 'Keseluruhan TBM') {
      datas = categories.map((category) => {
        const filter = dataset.reduce((sum: number, item: any) => {
          return item.regional === category
            ? sum + parseFloat(item.luas || '0')
            : sum
        }, 0)
        const roundedFilter = Math.round(filter)

        return { category, filter: roundedFilter }
      })
    }
  }


  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'bar', // Change to 'bar' for horizontal bars
      stacked: false,
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          const selectedCategory = categories[dataPointIndex]
          setIsKebun(true)


          const tbmKeys = ['tbm1', 'tbm2', 'tbm3', 'tbm4']
          const selectedData = score.filter((score: any) => {
            return (
              (Object.values(score)[0] as any).regional === selectedCategory
            )
          })
          const kebun = selectedData.reduce((acc: any, item: any) => {
            return tbmKeys.reduce((innerAcc: any, key) => {
              return item[key] && item[key].kebun
                ? innerAcc.concat(item[key].kebun)
                : innerAcc
            }, acc)
          }, [])
          // masi ada nama kebun yang sama, jadi aku mau distinct lagi
          const distinctKebun = [...new Set(kebun)]

          // setelah didistict aku mau hitung count blok berdasarkan kebun

          const countBlok = distinctKebun.map((kebun: any) => {
            const count = selectedData.reduce((acc: number, item: any) => {
              return tbmKeys.reduce((innerAcc: number, key) => {
                return item[key] && item[key].kebun === kebun
                  ? innerAcc + 1
                  : innerAcc
              }, acc)
            }, 0)
            return { category: kebun, filter: count }
          })

          const sumLuasBlok = distinctKebun.map((kebun: any) => {
            const sum = selectedData.reduce((acc: number, item: any) => {
              return tbmKeys.reduce((innerAcc: number, key) => {
                return item[key] && item[key].kebun === kebun
                  ? innerAcc + parseFloat(item[key].luas || '0')
                  : innerAcc
              }, acc)
            }, 0)
            return { category: kebun, filter: Math.round(sum) }
          })

          handleChartClick(selectedCategory, distinctKebun, countBlok, sumLuasBlok)
        },
      },
    },

    dataLabels: {
      enabled: true,
      offsetX: 5, // Adjust label position for horizontal bars
    },
    stroke: {
      width: [1], // Single series, so only one dat
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: dataprops.untuk,
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: theme === 'dark' ? '#ffffff' : '#000000',
      },
      labels: {
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
      title: {
        text: 'Regional',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `${val}`, // Display x-axis value
      },
      y: {
        formatter: (val, { series, seriesIndex }) => {
          const seriesName = series[seriesIndex]?.name || 'Tidak Diketahui'
          return `${val} `
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 80],
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
    },
  }

  const series = [
    {
      name: 'Total:',
      type: 'bar',
      data: datas.map((item) => item.filter),
      color: '#00b0ff',
    },
  ]

  return (
    <div id='chart'>
      <style>{`
        .apexcharts-menu {
          background-color: ${theme == 'dark' ? "#333" : "#fff"} !important;
          color: ${theme == 'dark' ? "#fff" : "#000"} !important;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .apexcharts-menu-item {
          padding: 10px 15px;
          font-size: 14px;
          cursor: pointer;
          color: ${theme == 'dark' ? "#fff" : "#000"} !important;
        }
        .apexcharts-menu-item:hover {
          background-color: ${theme == 'dark' ? "#555" : "#f0f0f0"} !important;
          color: ${theme == 'dark' ? "#ffcc00" : "#007BFF"} !important;
        }
      `}</style>

      <h2 className=' text-xl font-semibold text-center'>
        {dataprops.untuk} {dataprops.title}
      </h2>

      <ReactApexChart
        options={options}
        series={series}
        type='bar'
        height={368}
      />

    </div>
  )
}
