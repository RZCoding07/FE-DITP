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
      type: 'bar', // Ubah dari 'column' ke 'bar'
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [
        'RPC1',
        'RPC2',
        'RPC3',
        'RPC4',
        'RPC5',
        'RPC6',
        'RPC7',
        'RPC2N2',
        'RPC2N14'
      ],
      title: {
        text: 'Regional',
      },
    },
    yAxis: [{
      min: 0,
      title: {
        text: 'Persentase (%)',
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
      bar: { // Ubah dari 'column' ke 'bar'
        grouping: false,
        shadow: false,
        borderWidth: 0,
      },
    },
    series:
     [ 
    {
      type: 'bar', // Ubah dari 'column' ke 'bar'
      name: 'Actual s.d (%)',
      color:"#43A047",
      data: dataprops.actual,
      tooltip: {
        valuePrefix: '',
        valueSuffix: '%',
      },
      pointPadding: 0.3,
      pointPlacement: 0.2,
      yAxis: 1,
    }, 
    {
      type: 'bar', // Ubah dari 'column' ke 'bar'
      name: 'Plan s.d (%)',
      color:"#ff7f00",
      data: dataprops.plan,
      tooltip: {
        valuePrefix: '',
        valueSuffix: '%',
      },
      pointPadding: 0.4,
      pointPlacement: 0.2,
      yAxis: 1,
    }],
    credits: {
        enabled: false, // Disable watermark
      },
  }

  return (
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
  )
}

export default HighchartsRegionalAttainment