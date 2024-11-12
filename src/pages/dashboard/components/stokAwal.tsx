import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface StokAwalProps {
  bulan: string;
  tahun: string;
}


export const StokAwal = ({ bulan, tahun }: StokAwalProps) => {
  interface DataItem {
    total: number;
    name: string;
  }

  const [data, setData] = useState<DataItem[]>([])

  useEffect(() => {
    axios.get(`http://localhost:8080/stok-awal?bulan=${bulan}&tahun=${tahun}`)
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [bulan, tahun])

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
      events: {
        dataPointSelection: function(event, chartContext, config) {
          const label = chartContext.w.globals.labels[config.dataPointIndex]
          const value = chartContext.w.globals.series[config.dataPointIndex]
          console.log(label, value)
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: 'PTPN IV',
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toLocaleString('id-ID')
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val:any) => `${val.toFixed(0).toLocaleString('id-ID')}%`,
    },
    fill: {
      type: 'gradient',
    },
    tooltip: {
      y: {
        formatter: (value) => value.toLocaleString('id-ID'),
      },
    },
    legend: {
      position: 'bottom',
    },
  }

  const series = data.map(item => item.total)
  const labels = data.map(item => item.name)

  return (
    <div className="w-full h-[350px]">
      <ReactApexChart options={{ ...options, labels }} series={series} type="donut" height={350} />
    </div>
  )
}
