import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useMemo } from 'react'
import { RobotInvestasi } from '../loatie'
import { Button } from '@/components/custom/button'

const DonutChart = ({
  dataprops }: {
    dataprops: any
  }) => {

  // Initialize counts for each color category
  let goldCount = 0;
  let greenCount = 0;
  let redCount = 0;
  let blackCount = 0;

  // Filter data based on TBM category if needed
  let filteredData = dataprops.scoreAll;
  if (dataprops.ctg !== 'tbm-all') {
    filteredData = dataprops.scoreAll.filter((item: any) => item.vw_fase_tbm === dataprops.ctg);
  }

  // Apply additional filters based on selection level
  if (dataprops.rpc.value !== 'all') {
    filteredData = filteredData.filter((item: any) => item.regional === dataprops.rpc.value);
    
    if (dataprops.kebun && dataprops.kebun.value) {
      filteredData = filteredData.filter((item: any) => item.kebun === dataprops.kebun.value);
      
      if (dataprops.afd && dataprops.afd.value) {
        filteredData = filteredData.filter((item: any) => item.afdeling === dataprops.afd.value);
      }
    }
  }

  // Count items in each color category
  filteredData.forEach((item: any) => {
    switch (item.colorCategory) {
      case 'gold':
        goldCount++;
        break;
      case 'green':
        greenCount++;
        break;
      case 'red':
        redCount++;
        break;
      case 'black':
        blackCount++;
        break;
    }
  });

  // Prepare data for the chart
  const series = [goldCount, greenCount, redCount, blackCount];

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
      },
      labels: ["Emas", "Hijau", "Merah", "Hitam"],
      colors: ["#FFA500", "#00a300", "#FF0000", "#000000"],
      legend: {
        position: "right",
        labels: {
          colors: "#FFFFFF",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`,
        style: {
          colors: ['#fff'],
        },
      },
      fill: {
        type: "gradient",
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
              position: "bottom",
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          }
        }
      }
    }),
    []
  )


  return (
    <>
     <div style={{ position: 'relative', width: '100%', height: '270px' }}>
       <ReactApexChart options={options} series={series} type="donut" height={270} />
       <img
         src="/images/1.png" // Replace with your image URL
         alt="Center Image"
         style={{
           position: 'absolute',
           top: '50%',
           left: '43.5%',
           transform: 'translate(-50%, -50%)',
           width: '90px', // Adjust size as needed
           height: '90px', // Adjust size as needed
           zIndex: 10,
         }}
       />
     </div>
    </>
  )
}

export default DonutChart