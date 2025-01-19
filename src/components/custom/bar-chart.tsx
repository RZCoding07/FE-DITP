import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import cookie from 'js-cookie';

const StockAnalysisChartBar: React.FC = () => {
  const [theme, setTheme] = useState<string>(cookie.get('theme') || 'light');

  useEffect(() => {
    setTheme(cookie.get('theme') || 'light'); // Memastikan pembaruan tema terjadi
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

  }, []);

  const [categories, setCategories] = useState<string[]>([
    'RPC1',
    'RPC2',
    'RPC3',
    'RPC4',
    'RPC5',
    'RPC6',
    'RPC7',
    'RPC2(EX-N2)',
    'RPC2(EX-N14)',
  ]);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      foreColor: theme === 'dark' ? '#ffffff' : '#000000',
    },
    xaxis: {
      categories: categories, // Menetapkan kategori dari state 'categories'
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: 'Regional', // Judul untuk x-axis
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
        text: 'Total Luasan Ha', // Judul untuk y-axis
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
  
    dataLabels: {
      enabled: true,
      offsetY: -5,
      formatter: (val: any) => `${Math.round(val)} Ha`,
    },
    stroke: {
      width: [1, 1, 4],
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `Category: ${val}`, // Menampilkan kategori (x-axis)
      },
      y: {
        formatter: (val, { series, seriesIndex }) => {
          const seriesName = series[seriesIndex]?.name || 'Tidak Diketahui';
          return `Nilai: ${val} `;
        },
      },
    },
    fill: {
      type: 'solid',
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
    },
  };

  const series = [
    {
      name: 'Blok Hitam',
      type: 'column',
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 5.2],
      color: 'rgba(15, 23, 42, 0.95)',
    },
    {
      name: 'Blok Merah',
      type: 'column',
      data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 9.2],
      color: '#DC143C',
    },
  ];

  return (
    <div id="char2t">
      <ReactApexChart options={options} series={series} type="line" height={250} />
    </div>
  );
};

export default StockAnalysisChartBar;
