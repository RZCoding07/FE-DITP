import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import cookie from 'js-cookie';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const StockAnalysisChartArea: React.FC = () => {
  const [theme, setTheme] = useState<string>(cookie.get('theme') || 'light');
  const [numProblems, setNumProblems] = useState<string>("5"); // Default to 5 problems
  const [categories, setCategories] = useState<string[]>([
    'Hama/Penyakit',
    'Kebakaran Hutan',
    'Deforestasi',
    'Polusi Air',
    'Pengelolaan Limbah',
    'Pekerja Anak',
    'Pupuk Berlebih',
    'Perubahan Iklim',
    'Perambahan Hutan',
  ]);

  // Function to generate random data
  const generateRandomData = (num: number) => {
    const data = [];
    for (let i = 0; i < num; i++) {
      data.push(Math.floor(Math.random() * 10) + 1); // Random data between 1 and 10
    }
    return data;
  };

  const seriesData = generateRandomData(Number(numProblems)) // Generate data based on the selected number of problems
  const selectedCategories = categories.slice(0, Number(numProblems)) // Slice the categories based on the number of problems
  useEffect(() => {
    setTheme(cookie.get('theme') || 'light');
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // Apex chart options
  const options: ApexOptions = {
    chart: {
      height: 450,
      type: 'area',
      stacked: true,
      foreColor: theme === 'dark' ? '#ffffff' : '#000000',
      zoom: {
        enabled: false, // Disables zoom
      },
    },
    xaxis: {
      categories: selectedCategories,
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: 'Identifikasi Masalah',
        offsetX: -20,
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
        text: 'Frekuensi / Dampak',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -10,
      style: {
        fontSize: '16px',
      },
      formatter: (val: any) => `${Math.round(val)}`,
    },
    stroke: {
      width: [1],
    },
    markers: {
      size: 5,
      hover: {
        size: 9,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `Masalah: ${val}`,
      },
      y: {
        formatter: (val, { series, seriesIndex }) => {
          const seriesName = series[seriesIndex]?.name || 'Tidak Diketahui';
          return `Frekuensi/Dampak: ${val}`;
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        gradientToColors: ['#ABE5A1'],
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
    },
  };

  const series = [
    {
      name: 'Masalah',
      type: 'area',
      data: seriesData.sort((a, b) => b - a), // Sorting the data from largest to smallest
      color: '#00b0ff',
    },
  ];

  return (
    <div>
      <hr className="my-4 border-cyan-300 dark:border-cyan-500" />
      <div className="mb-4 mt-2">
        {/* Shadcn Select Dropdown */}
        <h2 className="text-sm font-semibold tracking-tight">Tampilkan Data</h2>
        <Select value={numProblems} onValueChange={(value: string) => setNumProblems(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jumlah masalah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Masalah</SelectItem>
            <SelectItem value="9">Semua Masalah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div id="chart2t">
        <ReactApexChart options={options} series={series} type="area" height={450} />
      </div>
    </div>
  );
};

export default StockAnalysisChartArea;
