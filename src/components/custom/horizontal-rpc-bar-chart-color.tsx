import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import cookie from 'js-cookie';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/custom/button';

export const StockAnalysisChartRpcColor = ({
  dataprops,
  onEventClick,
  isColorGraphVisible,  // Add this prop
  onHideColorGraph,     // Add this prop
}: {
  dataprops: any;
  onEventClick: (data: any) => void;
  isColorGraphVisible: boolean; // Prop for color visibility
  onHideColorGraph: () => void; // Prop for toggling visibility
}) => {

  const theme = cookie.get('theme') || 'light';
  let datas: any[] = [];

  const color = dataprops.color;
  datas = dataprops.dataset;

  

  console.log('datas', datas);
  const categories = datas.map(item => item.category);

  const options: ApexOptions = {
    chart: {
      height: 426,
      type: 'bar',
      stacked: false,
    },
    dataLabels: {
      enabled: true,
      offsetX: 5,
    },
    stroke: {
      width: [1],
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          colors: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
        },
      },
      title: {
        text: dataprops.untuk,
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
        text: 'Kebun',
        style: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    tooltip: {
      enabled: false,
      shared: false,
      intersect: false,
      x: {
        show: true,
        formatter: (val) => `${val}`,
      },
      y: {
        formatter: (val, { series, seriesIndex }) => {
          const seriesName = series[seriesIndex]?.name || 'Tidak Diketahui';
          return `${val} `;
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: color == 'gold' ? ['#FFD700'] : color == 'green' ? ['#008000'] : color == 'red' ? ['#FF0000'] : color == 'black' ? ['#424242'] : ['#FFD700'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 80],
      },
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,
    },
  };

  const series = [
    {
      name: dataprops.title,
      type: 'bar',
      data: datas.map((item) => dataprops.untuk === 'Total Luasan' ? item.filterLuas : item.filterBlok),
      color: color === 'gold' ? '#E98A15' : color === 'green' ? '#64dd17' : color === 'red' ? '#e64a19' : color === 'black' ? '#212121' : '#E98A15',
    },
  ];

  return (
    <div id='chart' className='grid gap-5 grid-cols-1'>
      <style>{`
        .apexcharts-menu {
          background-color: ${theme == 'dark' ? "#333" : "#fff"} !important;
          color: ${theme == 'dark' ? "#fff" : "#000"} !important;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .apexcharts-menu-item {
          padding: 10px 15px;
          font-size: 14px;
          cursor: pointer;
          color: ${theme == 'dark' ? "#fff" : "#000"} !important;
        }
        .apexcharts-menu-item:hover {
          background-color: ${theme == 'dark' ? "#555" : "#f0f0f0"} !important;
          color: ${theme == 'dark' ? "#ffcc00" : "#007BFF"} !important;
        }
      `}</style>

      <div className="flex justify-between items-center -mb-10">
        <h2 className='text-xl -mb-15 font-semibold pb-0 ml-2'>
          {dataprops.untuk} Kebun {dataprops.category} - ( {dataprops.title} )
        </h2>

        {/* Circle color display */}
        {(color === 'gold') ? (
          <div className="flex justify-center items-center mr-2 -mt-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full mr-2"></div>
            <p className="text-lg">Emas</p>
          </div>
        ) : (color === 'green') ? (
          <div className="flex justify-center items-center mr-2 -mt-2">
            <div className="w-5 h-5 bg-green-500 rounded-full mr-2"></div>
            <p className="text-lg">Hijau</p>
          </div>
        ) : (color === 'red') ? (
          <div className="flex justify-center items-center mr-2 -mt-2">
            <div className="w-5 h-5 bg-red-500 rounded-full mr-2"></div>
            <p className="text-lg">Merah</p>
          </div>
        ) : (color === 'black') ? (
          <div className="flex justify-center items-center mr-2 -mt-2">
            <div className="w-5 h-5 bg-black rounded-full mr-2"></div>
            <p className="text-lg">Hitam</p>
          </div>
        ) : (
          <div className="flex justify-center items-center mr-2 -mt-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full mr-2"></div>
            <p className="text-lg">Emas</p>
          </div>
        )}

        {/* Hide Color Graph Button */}
        <Button
          variant={'secondary'}
          className='flex items-center rounded-full mr-12 -mt-2'
          onClick={onHideColorGraph}  // Call the handler when clicked
        >
          <img
            width='20'
            height='20'
            src='https://img.icons8.com/external-beshi-flat-kerismaker/28/external-Hide-user-interface-beshi-flat-kerismaker.png'
            alt='external-Hide-user-interface-beshi-flat-kerismaker'
          />
          <span className='ml-2'>Hide Color Graph</span>
        </Button>
      </div>

      {/* Render chart only if color graph is visible */}
        <ReactApexChart
          options={options}
          series={series}
          type='bar'
          height='435px'
        />
    </div>
  );
};
