import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const StockAnalysisChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },

    dataLabels: {
      enabled: true,
      offsetY: -5,
    },
    stroke: {
      width: [1, 1, 4],
    },
    xaxis: {
      
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      labels: {
        show: true,
        style: {
          colors: '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: 'Tahun', // Add title for x-axis
        style: {
          color: '#000000',
        },
      },
    },
    yaxis: [
      {
        seriesName: 'Blok Hitam',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#000000',
        },
        labels: {
          style: {
            colors: '#000000',
          },
        },
        title: {
          text: 'Total Luasan (Ha)',
          style: {
            color: '#000000',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `Tahun: ${val}`, // Display x-axis value
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
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
      color: 'rgba(15, 23, 42, 0.95)',
    },
    {
      name: 'Blok Merah',
      type: 'column',
      data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
      color: '#DC143C',
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default StockAnalysisChart;