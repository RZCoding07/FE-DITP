import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import cookie from 'js-cookie'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const StockAnalysisChart = (dataprops: any) => {
  const theme = cookie.get('theme') || 'light'

  const dataset = dataprops.dataset[dataprops.val]

  console.log(dataset)


  const categories = [
    'RPC1',
    'RPC2',
    'RPC3',
    'RPC4',
    'RPC5',
    'RPC6',
    'RPC7',
    'RPC2(EX-N2)',
    'RPC2(EX-N14)',
  ]

  let datas: any[] = []

  if (dataprops.untuk === 'Total Blok') {
    datas = categories.map((category) => {
      const filter = dataset.filter(
        (data: any) => data.regional === category
      ).length
      return { category, filter }
    })
  } else if (dataprops.untuk === 'Total Luasan') {
    
    datas = categories.map((category) => {
        const filter = dataset.reduce((sum: number, item: any) => {
          return item.regional === category
            ? sum + parseFloat(item.luas_ha || '0')
            : sum;
        }, 0); // Sum total_luas_ha hanya untuk item yang sesuai kategori
        
        // Round the sum and remove commas
        const roundedFilter = Math.round(filter); // Round the result
      
        return { category, filter: roundedFilter };
      });
      

    console.log(datas)
  }

  const options: ApexOptions = {
    chart: {
      height: 350,
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
        formatter: (val) => `Tahun: ${val}`, // Display x-axis value
      },
      y: {
        formatter: (val, { series, seriesIndex }) => {
          const seriesName = series[seriesIndex]?.name || 'Tidak Diketahui'
          return `Nilai: ${val} `
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
      name: 'Blok',
      type: 'bar',
      data: datas.map((item) => item.filter),
      color: '#00b0ff',
    },
  ]

  return (
    <div id='chart'>
      <Card className='bg-gradient border border-cyan-500 bg-white bg-gradient-to-bl shadow-lg shadow-cyan-500 dark:from-slate-900 dark:to-slate-950'>
        <CardContent className='mb-0 pb-0'>
          <h2 className='pt-3 text-center text-xl font-semibold'>
            {dataprops.untuk} {dataprops.title}
          </h2>
          <ReactApexChart
            options={options}
            series={series}
            type='bar'
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default StockAnalysisChart
