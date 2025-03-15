import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const PieChart = ({
  dataprops
}: {
  dataprops: { pn: number; mn: number };
}) => {

  // Data untuk pie chart
  const series = [dataprops.pn, dataprops.mn]; // Nilai untuk PN dan MN
  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    // bg-green-500, bg-blue-500
    labels: ['PN', 'MN'], // Label kategori
    colors: ['#4CAF50', '#2196F3'], // Warna PN dan MN
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#4CAF50', '#2196F3'],
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    legend: {
      show: false,
      position: 'right',
      labels: {
        colors: '#FFFFFF', // Agar teks legend putih (untuk dark mode)
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '16px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#FFFFFF'],
      },
      formatter: (val: number) => `${Math.round(val)}%`, // Format data menjadi Percentage
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
  };

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={270}
      />
    </>
  );
};

export default PieChart;