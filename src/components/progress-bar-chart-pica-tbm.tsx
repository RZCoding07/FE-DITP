import { useEffect, useState } from "react"
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"

interface ApexBarChartProps {
  data: Array<{
    "Jenis TBM": string
    "Regional": string
    "Kode Kebun": string
    "Nama Kebun": string
    "Luasan Input Vegetatif": string
    "Total Luas Kebun Areal": number
    "percentage": number
    "Tahun": number
  }>
  tbm: string
  rpcSelected: string
  rpcOrKebun: "regional" | "kebun"
  kebunSelected: any
}

export function ApexBarChart({ data, tbm, rpcSelected, rpcOrKebun, kebunSelected }: ApexBarChartProps) {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({})
  const [series, setSeries] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [chartHeight, setChartHeight] = useState<number>(500)

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerHeight * 0.7)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    let filteredData = [...data]
    
    if (tbm !== 'tbm-all') {
      filteredData = filteredData.filter(item => item["Jenis TBM"] === tbm)
    }
    
    if (rpcSelected !== 'all') {
      filteredData = filteredData.filter(item => item["Regional"] === rpcSelected)
    }

    // Filter by kebunSelected (compare with Kode Kebun) if it exists
    if (kebunSelected && kebunSelected !== 'all') {
      filteredData = filteredData.filter(item => item["Kode Kebun"] === kebunSelected)
    }

    let processedData: any[] = []
    let categories: string[] = []
    let tooltipData: any[] = []

    if (rpcOrKebun === 'kebun' || kebunSelected) {
      // Group by kebun and sum the values
      const kebunMap = new Map<string, {
        input: number
        total: number
        regional: string
        tbm: string[]
        kodeKebun: string
      }>()

      filteredData.forEach(item => {
        const kebun = item["Nama Kebun"]
        const current = kebunMap.get(kebun) || { 
          input: 0, 
          total: 0, 
          regional: item["Regional"], 
          tbm: [],
          kodeKebun: item["Kode Kebun"]
        }
        
        const input = parseFloat(item["Luasan Input Vegetatif"]) || 0
        const total = item["Total Luas Kebun Areal"] || 0
        
        kebunMap.set(kebun, {
          ...current,
          input: current.input + input,
          total: current.total + total,
          tbm: [...new Set([...current.tbm, item["Jenis TBM"]])] // Collect unique TBM types
        })
      })

      processedData = Array.from(kebunMap.entries()).map(([kebun, values]) => {
        const progress = values.total > 0 ? (values.input / values.total) * 100 : 0
        return {
          "Kode Kebun": values.kodeKebun,
          "Nama Kebun": kebun,
          "Regional": values.regional,
          "Jenis TBM": values.tbm.join(", "), // Join TBM types with comma
          "Luasan Input Vegetatif": values.input.toFixed(2),
          "Total Luas Kebun Areal": values.total,
          "Progress (%)": progress
        }
      })

      // If kebunSelected exists, use Kode Kebun in categories
      categories = kebunSelected && kebunSelected !== 'all' 
        ? processedData.map(item => item["Kode Kebun"])
        : processedData.map(item => item["Nama Kebun"].replace("KEBUN ", ""))
      
      tooltipData = processedData.map(item => ({
        luasanInput: item["Luasan Input Vegetatif"],
        totalLuas: item["Total Luas Kebun Areal"].toFixed(2),
        regional: item["Regional"],
        tbm: item["Jenis TBM"],
        kodeKebun: item["Kode Kebun"]
      }))
    } else {
      const regionalMap = new Map<string, {
        input: number
        total: number
        count: number
      }>()

      filteredData.forEach(item => {
        const regional = item["Regional"]
        const current = regionalMap.get(regional) || { input: 0, total: 0, count: 0 }
        
        const input = parseFloat(item["Luasan Input Vegetatif"]) || 0
        const total = item["Total Luas Kebun Areal"] || 0
        
        regionalMap.set(regional, {
          input: current.input + input,
          total: current.total + total,
          count: current.count + 1
        })
      })

      processedData = Array.from(regionalMap.entries()).map(([regional, values]) => {
        const progress = values.total > 0 ? (values.input / values.total) * 100 : 0
        return {
          "Regional": regional,
          "Luasan Input Vegetatif": values.input.toFixed(2),
          "Total Luas Kebun Areal": values.total,
          "Progress (%)": progress,
          "Count": values.count
        }
      })

      categories = processedData.map(item => item["Regional"])
      tooltipData = processedData.map(item => ({
        luasanInput: item["Luasan Input Vegetatif"],
        totalLuas: item["Total Luas Kebun Areal"].toFixed(2),
        count: item["Count"]
      }))
    }

    const inputVegetatif = processedData.map((item) => Math.round(item["Progress (%)"] * 100) / 100)
    const belumTerinput = processedData.map((item) => Math.round((100 - item["Progress (%)"]) * 100) / 100)

    const chartTitle = kebunSelected && kebunSelected !== 'all' 
      ? `Persentase Luasan Input Vegetatif vs Total Luas Kebun (${processedData[0]?.["Kode Kebun"] || kebunSelected})`
      : `Persentase Luasan Input Vegetatif vs Total Luas ${rpcOrKebun === 'kebun' ? 'Kebun Areal' : 'Regional'}`

    const options: ApexOptions = {
      chart: {
        type: 'bar',
        height: chartHeight,
        stacked: true,
        stackType: '100%',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        background: 'transparent'
      },
      title: {
        text: chartTitle,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff'
        },
        align: 'center'
      },
      xaxis: {
        categories: categories,
        title: {
          text: kebunSelected && kebunSelected !== 'all' ? "Kode Kebun" : (rpcOrKebun === 'kebun' ? "Nama Kebun" : "Regional"),
          style: {
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        axisBorder: { show: true, color: '#fff' },
        axisTicks: { color: '#fff' },
        labels: {
          style: {
            colors: '#fff',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: "Persentase (%)",
          style: {
            color: '#fff'
          }
        },
        labels: {
          formatter: (val) => `${val}%`,
          style: {
            colors: '#fff',
            fontWeight: 'bold'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: { colors: '#fff' },
        markers: {
          fillColors: ['#fa8805', '#636363'],
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900,
                color: '#fff'
              }
            }
          }
        }
      },
      tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const tooltipInfo = tooltipData[dataPointIndex] || {}; 
          let tooltipContent = `<div class="apexcharts-tooltip-title">${w.globals.categoryLabels[dataPointIndex]}</div>`;

          const isInputVegetatif = seriesIndex === 1;

          const seriesColor = isInputVegetatif ? '#5036ba' : '#ba364c'; 

          tooltipContent += `
            <div class="apexcharts-tooltip-series-group">
              <span class="apexcharts-tooltip-marker" style="background-color: ${seriesColor}"></span>
              <div class="apexcharts-tooltip-text">
                <div class="apexcharts-tooltip-y-group">
                  <span class="apexcharts-tooltip-text-label">${isInputVegetatif ? 'Input Vegetatif' : 'Belum Terinput'}: </span>
                  <span class="apexcharts-tooltip-text-value">${series[seriesIndex][dataPointIndex]}%</span>
                </div>
              </div>
            </div>
          `;

          if (seriesIndex === 1 && tooltipInfo) {
            tooltipContent += `
              <div class="apexcharts-tooltip-series-group">
                <div class="apexcharts-tooltip-text">
                  <div class="apexcharts-tooltip-y-group">
                    <span class="apexcharts-tooltip-text-label">Luasan Input: </span>
                    <span class="apexcharts-tooltip-text-value">${tooltipInfo.luasanInput || 'N/A'} ha</span>
                  </div>
                  <div class="apexcharts-tooltip-y-group">
                    <span class="apexcharts-tooltip-text-label">Total Luas: </span>
                    <span class="apexcharts-tooltip-text-value">${tooltipInfo.totalLuas || 'N/A'} ha</span>
                  </div>
            `;
            if (!kebunSelected || kebunSelected === 'all') {
              if (rpcOrKebun === 'regional') {
                tooltipContent += `
                  <div class="apexcharts-tooltip-y-group">
                    <span class="apexcharts-tooltip-text-label">Jumlah Kebun: </span>
                    <span class="apexcharts-tooltip-text-value">${tooltipInfo.count || 'N/A'}</span>
                  </div>
                `;
              } else {
                tooltipContent += `
                  <div class="apexcharts-tooltip-y-group">
                    <span class="apexcharts-tooltip-text-label">Jenis TBM: </span>
                    <span class="apexcharts-tooltip-text-value">${tooltipInfo.tbm || 'N/A'}</span>
                  </div>
                  <div class="apexcharts-tooltip-y-group">
                    <span class="apexcharts-tooltip-text-label">Kode Kebun: </span>
                    <span class="apexcharts-tooltip-text-value">${tooltipInfo.kodeKebun || 'N/A'}</span>
                  </div>
                `;
              }
            }

            tooltipContent += `</div></div>`;
          }

          return tooltipContent;
        }
      },
      colors: ['#fa8805', '#636363'],
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
        style: {
          colors: ['#fff'],
          fontSize: '12px',
          fontWeight: 'bold'
        },
        dropShadow: {
          enabled: false
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 400
          },
          dataLabels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      }]
    }

    setChartOptions(options)
    setSeries([
      {
        name: 'Input Vegetatif',
        data: inputVegetatif
      },
      {
        name: 'Belum Terinput',
        data: belumTerinput
      }
    ])
    setTableData(processedData)
  }, [data, tbm, rpcSelected, rpcOrKebun, chartHeight, kebunSelected])

  return (
    <div className="w-full">
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={chartHeight}
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Detail Luasan </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                {kebunSelected && kebunSelected !== 'all' && <th className="border px-4 py-2 text-left">Kode Kebun</th>}
                <th className="border px-4 py-2 text-left">{kebunSelected && kebunSelected !== 'all' ? "Kebun" : (rpcOrKebun === 'kebun' ? "Nama Kebun" : "Regional")}</th>
                {(rpcOrKebun === 'kebun' || kebunSelected) && !(kebunSelected && kebunSelected !== 'all') && <th className="border px-4 py-2 text-left">Regional</th>}
                {(rpcOrKebun === 'kebun' || kebunSelected) && !(kebunSelected && kebunSelected !== 'all') && <th className="border px-4 py-2 text-left">Jenis TBM</th>}
                <th className="border px-4 py-2 text-right">Luasan Input Vegetatif (ha)</th>
                <th className="border px-4 py-2 text-right">Total Luas {kebunSelected && kebunSelected !== 'all' ? 'Kebun' : (rpcOrKebun === 'kebun' ? 'Kebun' : 'Regional')} (ha)</th>
                <th className="border px-4 py-2 text-right">Progress (%)</th>
                {rpcOrKebun === 'regional' && !kebunSelected && <th className="border px-4 py-2 text-right">Jumlah TBM Kebun</th>}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-slate-700" : "bg-gray-100 dark:bg-slate-800"}>
                  {kebunSelected && kebunSelected !== 'all' && <td className="border px-4 py-2">{item["Kode Kebun"]}</td>}
                  <td className="border px-4 py-2">{kebunSelected && kebunSelected !== 'all' ? item["Nama Kebun"] : (rpcOrKebun === 'kebun' ? item["Nama Kebun"] : item["Regional"])}</td>
                  {(rpcOrKebun === 'kebun' || kebunSelected) && !(kebunSelected && kebunSelected !== 'all') && <td className="border px-4 py-2">{item["Regional"]}</td>}
                  {(rpcOrKebun === 'kebun' || kebunSelected) && !(kebunSelected && kebunSelected !== 'all') && <td className="border px-4 py-2">{item["Jenis TBM"]}</td>}
                  <td className="border px-4 py-2 text-right">{item["Luasan Input Vegetatif"]}</td>
                  <td className="border px-4 py-2 text-right">{parseFloat(item["Total Luas Kebun Areal"]).toFixed(2)}</td>
                  <td className="border px-4 py-2 text-right">{item["Progress (%)"].toFixed(2)}%</td>
                  {rpcOrKebun === 'regional' && !kebunSelected && <td className="border px-4 py-2 text-right">{item["Count"]}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}