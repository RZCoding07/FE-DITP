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
  let totalValue = 0; // For calculating percentages based on area or count

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

  // Count items based on dataprops.untuk
  if (dataprops.untuk === "luasan") {
    filteredData.forEach((item: any) => {
      const luas = item.luas || 0;
      totalValue += luas;
      switch (item.colorCategory) {
        case 'gold':
          goldCount += luas;
          break;
        case 'green':
          greenCount += luas;
          break;
        case 'red':
          redCount += luas;
          break;
        case 'black':
          blackCount += luas;
          break;
      }
    });
  } else { // Default to "blok" count
    filteredData.forEach((item: any) => {
      totalValue += 1;
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
  }

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
        formatter: function(val: number) {
          return `${parseFloat(val.toString()).toFixed(1)}%`; // Menampilkan persentase dengan 1 desimal
        },
        style: {
          colors: ['#fff'],
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif'
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
      fill: {
        type: "gradient",
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return dataprops.untuk === "luasan" 
              ? `${val.toFixed(2)} ha (${((val / totalValue) * 100).toFixed(1)}%)` 
              : `${Math.round(val)} blok (${((val / totalValue) * 100).toFixed(1)}%)`;
          },
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
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: '#fff'
              },
              value: {
                show: true,
                fontSize: '16px',
                color: '#fff',
                formatter: function(val: string) {
                  return `${dataprops.untuk === "luasan" ? parseFloat(val).toFixed(2) : parseFloat(val).toFixed(0)} ${dataprops.untuk === "luasan" ? 'ha' : 'blok'}`;
                }
              },
              total: {
                show: true,
                label: 'Total',
                color: '#fff',
                formatter: function(w: any) {
                  return dataprops.untuk === "luasan" 
                    ? `${totalValue.toFixed(2)} ha` 
                    : `${Math.round(totalValue)} blok`;
                }
              }
            }
          }
        }
      }
    }),
    [dataprops.untuk, totalValue]
  )

  return (
    <>
     <div style={{ position: 'relative', width: '100%', height: '270px' }}>
       <ReactApexChart options={options} series={series} type="donut" height={270} />
     
     </div>
    </>
  )
}

export default DonutChart