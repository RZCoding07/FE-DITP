"use client"

import { useRef, useEffect, useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import cookie from "js-cookie"

const HighchartsRegionalAttainment = ({
    dataprops }: {
      dataprops: any
    }
  
  ) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const [theme, setTheme] = useState('light')

  // Load theme from cookie on component mount
  useEffect(() => {
    const savedTheme = cookie.get('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Update cookie and theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    cookie.set('theme', newTheme, { expires: 7 }) // Save for 7 days
  }

  // Define colors based on the theme
  const isDarkTheme = theme === 'dark'
  const chartBackgroundColor = isDarkTheme ? '#333' : 'transparent'
  const fontColor = isDarkTheme ? '#ffffff' : '#000000'
  const barColor1 = isDarkTheme ? "#ff9e00" : "#ff7f00"
  const barColor2 = isDarkTheme ? "#66bb6a" : "#43A047"

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 800,
      backgroundColor: 'transparent', // Set background menjadi transparan
      style: {
        fontFamily: "Inter var, sans-serif",
        fontSize: '20px',
        fontWeight: '400',
        color: fontColor,
      },
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
      lineColor: fontColor,
      labels: {
        style: {
          color: fontColor,
          fontSize: '15px',
        },
      },
      title: {
        text: 'Regional',
        style: {
            color: fontColor,
            fontSize: '15px',
            fontWeight: 'bold',
        },
        offset: 70,
      },
    },
    yAxis: [{
      min: 0,
      title: {
        text: 'Percentage (%)',
        style: {
            color: fontColor,
            fontSize: '15px',
            fontWeight: 'bold',
        }
      },
    }, {
      title: {
        text: '',
      },
      opposite: true,
    }],
    legend: {
      shadow: true,
      itemStyle: {
        color: fontColor,
      }
    },
    tooltip: {
      shared: true,
    //   style: {
    //     color: fontColor,
    //   }
    },
    plotOptions: {
      bar: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
        pointWidth: 20,
        dataLabels: {
          enabled: true,
          format: '{y}%',
          align: 'right',
          inside: false,
          color: fontColor,
          style: {
            fontWeight: 'bold',
          },
        },
      },
    },
    series: [
      {
        type: 'bar',
        name: 'Plan s.d (%)',
        color: barColor1,
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
        color: barColor2,
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
      enabled: false,
    },
  }

  return (
    <div>
  
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
    </div>
  )
}

export default HighchartsRegionalAttainment