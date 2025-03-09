import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface ProblemData {
  regional: string
  Kategori: string
  "Problem Identification": string
  Detail: string
  "Root Causes": string
  "Corrective Action": string
  w1: string
  w2: string
  w3: string
  w4: string
}

interface ProblemCount {
  name: string
  count: number
}

interface ProblemAnalysisChartProps {
  data: ProblemData[]
}

const ProblemAnalysisChart: React.FC<ProblemAnalysisChartProps> = ({ data }) => {
  const [theme, setTheme] = useState<string>('light')
  const [numProblems, setNumProblems] = useState<string>("10")
  const [selectedProblems, setSelectedProblems] = useState<ProblemData[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  console.log(data)

  const processData = (): ProblemCount[] => {
    const problemCounts: Record<string, number> = {}

    data.forEach(item => {
      const problem = item["Problem Identification"]
      if (problem) {
        problemCounts[problem] = (problemCounts[problem] || 0) + 1
      }
    })

    const sortedProblems = Object.entries(problemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return sortedProblems
  }

  const problemData = processData()
  const topProblems = problemData.slice(0, Number(numProblems))
  const problemNames = topProblems.map(p => p.name)
  const problemCounts = topProblems.map(p => p.count)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })

      return () => observer.disconnect()
    }
  }, [])

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      stacked: false,
      foreColor: theme === 'dark' ? '#ffffff' : '#000000',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false
      },
      events: {
        click: function (event, chartContext, config) {
          const problemName = problemNames[config.dataPointIndex]
          const problem = data.filter(item => item['Problem Identification'] === problemName)

          if (problem) {
            setSelectedProblems(problem)
            setIsDrawerOpen(true)
          }
        }
      }
    },
    xaxis: {
      categories: problemNames,
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '15px',
          fontFamily: 'Arial, sans-serif',
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: true,
        maxHeight: 120,
      },
      title: {
        text: 'Problem Identifications',
        offsetY: -10,
        style: {
          color: theme === 'dark' ? '#ffffff' : '#808080',
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
          fontSize: '14px',
        },
      },
      title: {
        text: 'Frekuensi',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#808080',
        },
        offsetX: 10,
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -10,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
      formatter: (val: any) => `${Math.round(val)}`,
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: theme === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val} kejadian`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#0ea5e9',
            opacity: 0.8
          },
          {
            offset: 100,
            color: '#22d3ee',
            opacity: 0.2
          }
        ]
      },
    },
    grid: {
      borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      offsetY: 10,
    },
  }

  const series = [
    {
      name: 'Frekuensi Masalah',
      type: 'area',
      data: problemCounts,
      color: '#0ea5e9',
    },
  ]

  return (
    <div className="w-full">
      <hr className="my-4 border-cyan-300 dark:border-cyan-500" />
      <div className="mb-4 mt-2">
        <h2 className="text-sm font-semibold tracking-tight">Tampilkan Data</h2>
        <Select value={numProblems} onValueChange={(value: string) => setNumProblems(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih jumlah masalah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 Masalah Terbesar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={400}
        />
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Detail Masalah</DrawerTitle>
            <DrawerDescription>Informasi detail tentang masalah yang dipilih</DrawerDescription>
          </DrawerHeader>
          <div className="relative w-full max-h-[400px] overflow-y-auto"> {/* Full height and width with overflow */}
            <div className="p-4">
              {selectedProblems.length > 0 && (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="border bg-green-600 text-white px-4 py-2">Regional</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Kategori</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Problem Identification</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Detail</th>
                      <th className="border bg-green-600 text-white px-4 py-2">Root Causes</th>
                      {/* <th className="border bg-green-600 text-white px-4 py-2">Corrective Action</th>
                      <th className="border bg-green-600 text-white px-4 py-2">W1</th>
                      <th className="border bg-green-600 text-white px-4 py-2">W2</th>
                      <th className="border bg-green-600 text-white px-4 py-2">W3</th>
                      <th className="border bg-green-600 text-white px-4 py-2">W4</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProblems.map((problem, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{problem.regional}</td>
                        <td className="border px-4 py-2">{problem.Kategori}</td>
                        <td className="border px-4 py-2">{problem["Problem Identification"]}</td>
                        <td className="border px-4 py-2">{problem.Detail}</td>
                        <td className="border px-4 py-2">{problem["Root Causes"]}</td>
                        {/* <td className="border px-4 py-2">{problem["Corrective Action"]}</td>
                        <td className="border px-4 py-2">{problem.w1}</td>
                        <td className="border px-4 py-2">{problem.w2}</td>
                        <td className="border px-4 py-2">{problem.w3}</td>
                        <td className="border px-4 py-2">{problem.w4}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ProblemAnalysisChart