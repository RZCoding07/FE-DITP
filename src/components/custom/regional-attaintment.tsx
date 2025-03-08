"use client"

import { useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

const HighchartsRegionalAttainment = ({
    dataprops }: {
      dataprops: any
    }) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 680, // Atur tinggi chart di sini (misalnya 500px)
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [
        'R1',
        'R2',
        'R3',
        'R4',
        'R5',
        'R6',
        'R7',
        'R2 EKS N2',
        'R2 EKS N14'
      ],
      title: {
        text: 'Regional',
      },
    },
    yAxis: [{
      min: 0,
      title: {
        text: 'Percentage (%)',
      },
    }, {
      title: {
        text: '',
      },
      opposite: true,
    }],
    legend: {
      shadow: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      bar: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
        pointWidth: 20, // Atur ketebalan bar di sini (misalnya 20px)
        dataLabels: {
          enabled: true, // Aktifkan data labels
          format: '{y}%', // Format teks yang ditampilkan (misalnya, nilai y dengan simbol %)
          align: 'right', // Posisi teks (kanan)
          inside: false, // Tampilkan di luar bar
          color: '#000000', // Warna teks
          style: {
            fontWeight: 'bold', // Tebalkan teks
          },
        },
      },
    },
    series:
     [ 
      {
        type: 'bar',
        name: 'Plan s.d (%)',
        color: "#ff7f00",
        data: dataprops.plan,
        tooltip: {
          valuePrefix: '',
          valueSuffix: '%',
        },
        pointPadding: 0.1,
        pointPlacement: 0.1,
        yAxis: 1,
      },
      {
        type: 'bar',
        name: 'Actual s.d (%)',
        color: "#43A047",
        data: dataprops.actual,
        tooltip: {
          valuePrefix: '',
          valueSuffix: '%',
        },
        pointPadding: 0.3,
        pointPlacement: 0.3,
        yAxis: 1,
      },
    ],
    credits: {
        enabled: false, // Disable watermark
      },
  }

  return (
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
  )
}

export default HighchartsRegionalAttainment