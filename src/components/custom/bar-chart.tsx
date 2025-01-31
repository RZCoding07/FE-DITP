import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import cookie from 'js-cookie';

const StockAnalysisChartBar = ({
  dataprops }: {
    dataprops: any
  }) => {

  const [theme, setTheme] = useState<string>(cookie.get('theme') || 'light');

  const rpcOptions = [
    'RPC1',
    'RPC2',
    'RPC3',
    'RPC4',
    'RPC5',
    'RPC6',
    'RPC7',
    'RPC2N2',
    'RPC2N14',
  ];

  useEffect(() => {
    setTheme(cookie.get('theme') || 'light'); // Memastikan pembaruan tema terjadi
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);


  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      foreColor: theme === 'dark' ? '#ffffff' : '#000000',
      zoom: {
        enabled: false, // Disables zoom
      },
    },
    xaxis: {
      categories: rpcOptions, // Menetapkan kategori dari state 'rpcOptions'
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
      formatter: (val: any) => `${val.toFixed(2)} Ha`,
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
      color: 'rgba(15, 23, 42, 0.95)',
      data : [1, 2, 2, 1, 2, 2, 2, 3, 2]
    },
    {
      name: 'Blok Merah',
      type: 'column',
      color: '#DC143C',
      data : [2, 3, 3, 2, 3, 1, 1, 2, 1]
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type='bar'
        height={250}
      />
    </div>
  );
};

export default StockAnalysisChartBar; 