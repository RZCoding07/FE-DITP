
import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import cookie from 'js-cookie'
import { Card, CardContent } from '@/components/ui/card'

export const StockAnalysisChartKebun = ({
  dataprops,
  onEventClick,
}: {
  dataprops: any
  onEventClick: (data: any) => void
}) => {

  const theme = cookie.get('theme') || 'light'

  let datas: any[] = []
  datas = dataprops.dataset


  const options: ApexOptions = {
    chart: {
      height: 426,
      type: 'bar', // Change to 'bar' for horizontal bars
      stacked: false,
      
    },

    

    dataLabels: {
      enabled: true,
      offsetX: 5, // Adjust label position for horizontal bars
    },
    stroke: {
      width: [1], // Single series, so only one width
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      },
    },
    xaxis: {
      categories: dataprops.categories,
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
        text: 'Kebun',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    tooltip: {
    enabled: false,
      shared: false,
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
        gradientToColors: ['#00b0ff'],
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
      name: dataprops.title,
      type: 'bar',
      data: datas.map((item) => item.filter),
      color: '#6345bf',
    },
  ]

  return (
    <div id='chart' className='grid gap-5 grid-cols-1'>
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


      <h2 className='text-center text-xl -mb-10 font-semibold pb-0'>
       Rank Infra 
      </h2>
      <ReactApexChart
        options={options}
        series={series}
        type='bar'
        height='435px'
      />

    </div>
  )
}
