import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const data = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
]

export function Overview() {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map(item => item.name),
      labels: {
        style: {
          colors: '#888888',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#888888',
          fontSize: '12px',
        },
        formatter: (value) => `$${value.toLocaleString('en-US')}`,
      },
    },
    fill: {
      colors: ['var(--primary)'],
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString('en-US')}`,
      },
    },
  }

  const series = [
    {
      name: 'Total',
      data: data.map(item => item.total),
    },
  ]

  return (
    <div className="w-full h-[350px]">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  )
}