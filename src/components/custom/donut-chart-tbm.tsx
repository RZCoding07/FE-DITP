import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { RobotInvestasi } from '../loatie'
import { Button } from '@/components/custom/button'

const DonutChartTbm = ({
  dataprops }: {
    dataprops: any
  }) => {

  let rpc = dataprops.rpc.value
  let series: any = []

  if (dataprops.title === 'Keseluruhan TBM') {
    if (dataprops.blok === 'blok') {
      series = [dataprops.data.emas, dataprops.data.hijau, dataprops.data.merah, dataprops.data.hitam] // Nilai untuk Emas Hijau, Merah, dan Hitam
    } else {
      series = [dataprops.dataLuas.emas, dataprops.dataLuas.hijau, dataprops.dataLuas.merah, dataprops.dataLuas.hitam] // Nilai untuk Emas Hijau,
    }
  } else {
    if (dataprops.blok === 'blok') {
      if (dataprops.ctg == 'tbm1') {
        series = [
          dataprops.tbm1ColorCount.gold,
          dataprops.tbm1ColorCount.green,
          dataprops.tbm1ColorCount.red,
          dataprops.tbm1ColorCount.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm2') {
        series = [
          dataprops.tbm2ColorCount.gold,
          dataprops.tbm2ColorCount.green,
          dataprops.tbm2ColorCount.red,
          dataprops.tbm2ColorCount.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm3') {
        series = [
          dataprops.tbm3ColorCount.gold,
          dataprops.tbm3ColorCount.green,
          dataprops.tbm3ColorCount.red,
          dataprops.tbm3ColorCount.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm4') {
        series = [
          dataprops.tbm4ColorCount.gold,
          dataprops.tbm4ColorCount.green,
          dataprops.tbm4ColorCount.red,
          dataprops.tbm4ColorCount.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      }

      if (dataprops.ctg !== 'tbm-all' && rpc !== 'all') {
        series = [dataprops.dataDnt.emas, dataprops.dataDnt.hijau, dataprops.dataDnt.merah, dataprops.dataDnt.hitam] // Nilai untuk Emas Hijau, Merah, dan Hitam
      }
    

    } else {
      if (dataprops.ctg == 'tbm1') {
        series = [
          dataprops.tbm1LuasByColor.gold,
          dataprops.tbm1LuasByColor.green,
          dataprops.tbm1LuasByColor.red,
          dataprops.tbm1LuasByColor.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm2') {
        series = [
          dataprops.tbm2LuasByColor.gold,
          dataprops.tbm2LuasByColor.green,
          dataprops.tbm2LuasByColor.red,
          dataprops.tbm2LuasByColor.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm3') {
        series = [
          dataprops.tbm3LuasByColor.gold,
          dataprops.tbm3LuasByColor.green,
          dataprops.tbm3LuasByColor.red,
          dataprops.tbm3LuasByColor.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      } else if (dataprops.ctg == 'tbm4') {
        series = [
          dataprops.tbm4LuasByColor.gold,
          dataprops.tbm4LuasByColor.green,
          dataprops.tbm4LuasByColor.red,
          dataprops.tbm4LuasByColor.black
        ]
        .map(value => (value == null ? 0 : value));  // Ganti null atau undefined dengan 0, tetap pertahankan 0 yang ada
      }
   
      if (dataprops.ctg !== 'tbm-all' && rpc !== 'all') {
        series = [
          Number(dataprops.dataLuasDnt.emas),
          Number(dataprops.dataLuasDnt.hijau),
          Number(dataprops.dataLuasDnt.merah),
          Number(dataprops.dataLuasDnt.hitam)
        ];
      }
    }
    
    
  }
  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Emas', 'Hijau', 'Merah', 'Hitam'], // Label kategori
    colors: ['#FFA500', '#00a300', '#FF0000', '#000000'], // Warna Emas, Hijau, Merah, Hitam
    legend: {
      position: 'right',
      labels: {
        colors: '#FFFFFF', // Agar teks legend putih (untuk dark mode)
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`, // Format data menjadi persentase
    },

    fill: {
      type: 'gradient',
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(0)}`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type='donut'
        height={270}
      />

    </>


  )
}

export default DonutChartTbm
