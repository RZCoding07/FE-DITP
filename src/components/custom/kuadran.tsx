import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const KuadranChart = () => {
  const options : ApexOptions = {
    chart: {
      height: 400,
      type: 'scatter',
      zoom: {
        enabled: false // Menonaktifkan zoom
      }
    },
    xaxis: {
      min: 0,
      max: 10,
      title: {
        text: 'X-Axis'
      }
    },
    yaxis: {
      min: 0,
      max: 10,
      title: {
        text: 'Y-Axis'
      }
    },
    annotations: {
      xaxis: [
        {
          x: 5,
          x2: 10,
          borderColor: '#FF0000',
          fillColor: '#FF0000',
          opacity: 0.3,
        },
        {
          x: 0,
          x2: 5,
          borderColor: '#FFA500',
          fillColor: '#FFA500',
          opacity: 0.3,
        }
      ],
      yaxis: [
        {
          y: 5,
          y2: 10,
          borderColor: '#FF0000',
          fillColor: '#FF0000',
          opacity: 0.3,
        },
        {
          y: 0,
          y2: 5,
          borderColor: '#008000',
          fillColor: '#008000',
          opacity: 0.3,
        }
      ]
    }
  };

  const series = [
    {
      name: 'Data Series',
      data: [
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
      ]
    }
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="scatter" height={500} />
    </div>
  );
};

export default KuadranChart;
