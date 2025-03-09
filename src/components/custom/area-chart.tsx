"use client"

import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const [numProblems, setNumProblems] = useState<string>("5") // Default to 5 problems

  // Process data to count problem occurrences
  const processData = (): ProblemCount[] => {
    const problemCounts: Record<string, number> = {}

    // Count occurrences of each problem identification
    data.forEach(item => {
      const problem = item["Problem Identification"]
      if (problem) {
        problemCounts[problem] = (problemCounts[problem] || 0) + 1
      }
    })

    // Convert to array and sort by count (descending)
    const sortedProblems = Object.entries(problemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return sortedProblems
  }

  const problemData = processData()

  // Get the top N problems based on selection
  const topProblems = problemData.slice(0, Number(numProblems))

  // Extract problem names and counts for the chart
  const problemNames = topProblems.map(p => p.name)
  const problemCounts = topProblems.map(p => p.count)

  useEffect(() => {
    // Check if we're in a browser environment before accessing document
    if (typeof window !== 'undefined') {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

      // Listen for theme changes
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

  // Apex chart options
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
      }
    },
    xaxis: {
      categories: problemNames,
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
        maxHeight: 120,
      },
      title: {
        text: 'Problem Identifications',
        offsetY: -10,
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
        text: 'Frekuensi',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
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
            <SelectItem value="5">5 Masalah Terbesar</SelectItem>
            <SelectItem value="10">Semua Masalah</SelectItem>
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
    </div>
  )
}

export default ProblemAnalysisChart
