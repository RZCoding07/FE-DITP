import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

// Define the data structure
interface DataItem {
  id: number
  jenis: string
  kategori: 'Penyusunan Dokumen' | 'HPS' | 'PBJ' | 'SPPRJ'
}

export default function BarMonitoring() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create the structured dataset
  const rawData: DataItem[] = [
    // Penyusunan Dokumen (20 items)
    { id: 1, jenis: 'RPC1 (ex N3)', kategori: 'Penyusunan Dokumen' },
    { id: 2, jenis: 'RPC1 (ex N3)', kategori: 'Penyusunan Dokumen' },
    { id: 3, jenis: 'RPC1 (ex N3)', kategori: 'Penyusunan Dokumen' },
    { id: 4, jenis: 'RPC2 (ex N4)', kategori: 'Penyusunan Dokumen' },
    { id: 5, jenis: 'RPC2 (ex N4)', kategori: 'Penyusunan Dokumen' },
    { id: 6, jenis: 'RPC3 (ex N5)', kategori: 'Penyusunan Dokumen' },
    { id: 7, jenis: 'RPC4 (ex N6)', kategori: 'Penyusunan Dokumen' },
    { id: 8, jenis: 'RPC4 (ex N6)', kategori: 'Penyusunan Dokumen' },
    { id: 9, jenis: 'RPC5', kategori: 'Penyusunan Dokumen' },
    { id: 10, jenis: 'RPC5', kategori: 'Penyusunan Dokumen' },
    { id: 11, jenis: 'RPC5', kategori: 'Penyusunan Dokumen' },
    { id: 12, jenis: 'RPC 1 (Ex Sei Meranti)', kategori: 'Penyusunan Dokumen' },
    { id: 13, jenis: 'RPC 1 (Ex Djaba)', kategori: 'Penyusunan Dokumen' },
    { id: 14, jenis: 'RPC 1 (Ex Datim)', kategori: 'Penyusunan Dokumen' },
    { id: 15, jenis: 'RPC 2 (Ex PKS N2)', kategori: 'Penyusunan Dokumen' },
    { id: 16, jenis: 'RPC 2 (Ex Liwu)', kategori: 'Penyusunan Dokumen' },
    { id: 17, jenis: 'RPC 6 (Ex N11)', kategori: 'Penyusunan Dokumen' },
    { id: 18, jenis: 'RPC 7 (ex N7)', kategori: 'Penyusunan Dokumen' },
    { id: 19, jenis: 'RPC 7 (ex N7)', kategori: 'Penyusunan Dokumen' },
    { id: 20, jenis: 'PALMCO', kategori: 'Penyusunan Dokumen' },

    // HPS (15 items)
    { id: 21, jenis: 'RPC1 (ex N3)', kategori: 'HPS' },
    { id: 22, jenis: 'RPC1 (ex N3)', kategori: 'HPS' },
    { id: 23, jenis: 'RPC2 (ex N4)', kategori: 'HPS' },
    { id: 24, jenis: 'RPC2 (ex N4)', kategori: 'HPS' },
    { id: 25, jenis: 'RPC2 (ex N4)', kategori: 'HPS' },
    { id: 26, jenis: 'RPC3 (ex N5)', kategori: 'HPS' },
    { id: 27, jenis: 'RPC4 (ex N6)', kategori: 'HPS' },
    { id: 28, jenis: 'RPC4 (ex N6)', kategori: 'HPS' },
    { id: 29, jenis: 'RPC5', kategori: 'HPS' },
    { id: 30, jenis: 'RPC 1 (Ex Sei Meranti)', kategori: 'HPS' },
    { id: 31, jenis: 'RPC 1 (Ex Datim)', kategori: 'HPS' },
    { id: 32, jenis: 'RPC 2 (Ex PKS N2)', kategori: 'HPS' },
    { id: 33, jenis: 'RPC 2 (Ex Liwu)', kategori: 'HPS' },
    { id: 34, jenis: 'RPC 6 (Ex N11)', kategori: 'HPS' },
    { id: 35, jenis: 'PALMCO', kategori: 'HPS' },

    // PBJ (18 items)
    { id: 36, jenis: 'RPC1 (ex N3)', kategori: 'PBJ' },
    { id: 37, jenis: 'RPC1 (ex N3)', kategori: 'PBJ' },
    { id: 38, jenis: 'RPC2 (ex N4)', kategori: 'PBJ' },
    { id: 39, jenis: 'RPC2 (ex N4)', kategori: 'PBJ' },
    { id: 40, jenis: 'RPC2 (ex N4)', kategori: 'PBJ' },
    { id: 41, jenis: 'RPC3 (ex N5)', kategori: 'PBJ' },
    { id: 42, jenis: 'RPC3 (ex N5)', kategori: 'PBJ' },
    { id: 43, jenis: 'RPC4 (ex N6)', kategori: 'PBJ' },
    { id: 44, jenis: 'RPC5', kategori: 'PBJ' },
    { id: 45, jenis: 'RPC5', kategori: 'PBJ' },
    { id: 46, jenis: 'RPC 1 (Ex Sei Meranti)', kategori: 'PBJ' },
    { id: 47, jenis: 'RPC 1 (Ex Sei Meranti)', kategori: 'PBJ' },
    { id: 48, jenis: 'RPC 1 (Ex Djaba)', kategori: 'PBJ' },
    { id: 49, jenis: 'RPC 1 (Ex Datim)', kategori: 'PBJ' },
    { id: 50, jenis: 'RPC 2 (Ex PKS N2)', kategori: 'PBJ' },
    { id: 51, jenis: 'RPC 2 (Ex Liwu)', kategori: 'PBJ' },
    { id: 52, jenis: 'RPC 6 (Ex N11)', kategori: 'PBJ' },
    { id: 53, jenis: 'PALMCO', kategori: 'PBJ' },

    // SPPRJ (17 items)
    { id: 54, jenis: 'RPC1 (ex N3)', kategori: 'SPPRJ' },
    { id: 55, jenis: 'RPC1 (ex N3)', kategori: 'SPPRJ' },
    { id: 56, jenis: 'RPC1 (ex N3)', kategori: 'SPPRJ' },
    { id: 57, jenis: 'RPC2 (ex N4)', kategori: 'SPPRJ' },
    { id: 58, jenis: 'RPC2 (ex N4)', kategori: 'SPPRJ' },
    { id: 59, jenis: 'RPC2 (ex N4)', kategori: 'SPPRJ' },
    { id: 60, jenis: 'RPC3 (ex N5)', kategori: 'SPPRJ' },
    { id: 61, jenis: 'RPC3 (ex N5)', kategori: 'SPPRJ' },
    { id: 62, jenis: 'RPC3 (ex N5)', kategori: 'SPPRJ' },
    { id: 63, jenis: 'RPC4 (ex N6)', kategori: 'SPPRJ' },
    { id: 64, jenis: 'RPC4 (ex N6)', kategori: 'SPPRJ' },
    { id: 65, jenis: 'RPC5', kategori: 'SPPRJ' },
    { id: 66, jenis: 'RPC 1 (Ex Sei Meranti)', kategori: 'SPPRJ' },
    { id: 67, jenis: 'RPC 1 (Ex Djaba)', kategori: 'SPPRJ' },
    { id: 68, jenis: 'RPC 2 (Ex PKS N2)', kategori: 'SPPRJ' },
    { id: 69, jenis: 'RPC 6 (Ex N11)', kategori: 'SPPRJ' },
    { id: 70, jenis: 'PALMCO', kategori: 'SPPRJ' },
  ]

  // Process the data for the chart
  const processDataForChart = () => {
    // Get unique jenis values
    const uniqueJenis = Array.from(new Set(rawData.map((item) => item.jenis)))

    // Count items by jenis and kategori
    const countsByJenisAndKategori: Record<string, Record<string, number>> = {}
    const totalsByJenis: Record<string, number> = {}

    uniqueJenis.forEach((jenis) => {
      countsByJenisAndKategori[jenis] = {
        'Penyusunan Dokumen': 0,
        HPS: 0,
        PBJ: 0,
        SPPRJ: 0,
      }
      totalsByJenis[jenis] = 0
    })

    rawData.forEach((item) => {
      countsByJenisAndKategori[item.jenis][item.kategori]++
      totalsByJenis[item.jenis]++
    })

    // Calculate percentages
    const percentagesByJenisAndKategori: Record<
      string,
      Record<string, number>
    > = {}

    uniqueJenis.forEach((jenis) => {
      percentagesByJenisAndKategori[jenis] = {
        'Penyusunan Dokumen': 0,
        HPS: 0,
        PBJ: 0,
        SPPRJ: 0,
      }

      const total = totalsByJenis[jenis]
      if (total > 0) {
        Object.keys(countsByJenisAndKategori[jenis]).forEach((kategori) => {
          const count = countsByJenisAndKategori[jenis][kategori]
          percentagesByJenisAndKategori[jenis][kategori] = (count / total) * 100
        })
      }
    })

    // Prepare series data for ApexCharts
    const series = [
      {
        name: 'SPPRJ',
        data: uniqueJenis.map(
          (jenis) => percentagesByJenisAndKategori[jenis]['SPPRJ']
        ),
      },
      {
        name: 'PBJ',
        data: uniqueJenis.map(
          (jenis) => percentagesByJenisAndKategori[jenis]['PBJ']
        ),
      },
      {
        name: 'HPS',
        data: uniqueJenis.map(
          (jenis) => percentagesByJenisAndKategori[jenis]['HPS']
        ),
      },
      {
        name: 'Penyusunan Dokumen',
        data: uniqueJenis.map(
          (jenis) => percentagesByJenisAndKategori[jenis]['Penyusunan Dokumen']
        ),
      },
    ]

    return {
      series,
      categories: uniqueJenis,
      totals: uniqueJenis.map((jenis) => totalsByJenis[jenis]),
      countsByJenisAndKategori,
      totalsByJenis,
      uniqueJenis,
    }
  }

  const chartData = processDataForChart()

  // Chart options
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      stacked: true,
      toolbar: {
        show: false,
      },
      stackType: '100%' as '100%',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        // Get the actual percentage value
        const seriesIndex = opts.seriesIndex
        const dataPointIndex = opts.dataPointIndex
        const actualValue = chartData.series[seriesIndex].data[dataPointIndex]
        return actualValue.toFixed(2) + '%'
      },
      style: {
        fontSize: '10px',
        fontWeight: 'medium',
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: '10px',
          colors: 'white',
        },
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val: number) => val.toFixed(0) + '%',
        style: {
          colors: 'white',
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false, // Menghilangkan garis horizontal pada y-axis
        },
      },
    },
    legend: {
      position: 'top' as const,
      labels: {
        colors: '#FFFFFF', // Putih
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#006064', '#00897B', '#FFA000', '#757575'],
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(2) + '%',
      },
      theme: 'dark',
    },
    // annotations: {
    //   texts: chartData.totals.map((total, index) => ({
    //     x: index,
    //     y: -15, // Position above the bar
    //     text: total.toString(),
    //     textAnchor: 'middle',
    //     style: {
    //       fontSize: '12px',
    //       fontWeight: 'bold',
    //       colors: 'white',
    //     },
    //   })),
    // },
  }

  // Calculate total items by category
  const totalsByCategory = {
    'Penyusunan Dokumen': rawData.filter(
      (item) => item.kategori === 'Penyusunan Dokumen'
    ).length,
    HPS: rawData.filter((item) => item.kategori === 'HPS').length,
    PBJ: rawData.filter((item) => item.kategori === 'PBJ').length,
    SPPRJ: rawData.filter((item) => item.kategori === 'SPPRJ').length,
    Total: rawData.length,
  }

  if (!mounted) return null

  return (
    <div className='flex-1'>
      {/* Jenis Totals */}
      {/* <h3 className='mb-4 text-lg font-medium'>
          Jumlah Data Berdasarkan Jenis
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-300'>
            <thead>
              <tr>
                <th className='border-b px-4 py-2 text-left'>Jenis</th>
                <th className='border-b px-4 py-2 text-center font-bold'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.uniqueJenis.map((jenis) => (
                <tr key={jenis} className='hover:bg-slate-900'>
                  <td className='border-b px-4 py-2'>{jenis}</td>
                  <td className='border-b px-4 py-2 text-center font-bold'>
                    {chartData.totalsByJenis[jenis]}
                  </td>
                </tr>
              ))}
              <tr className='font-bold'>
                <td className='border-b px-4 py-2'>Total</td>
                <td className='border-b px-4 py-2 text-center'>
                  {totalsByCategory.Total}
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}

      {/* Chart */}
      <div className='h-[580px] pt-8'>
        {' '}
        {/* Added padding-top to make room for the labels */}
        {mounted && (
          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type='bar'
            height='100%'
          />
        )}
      </div>
    </div>
  )
}
