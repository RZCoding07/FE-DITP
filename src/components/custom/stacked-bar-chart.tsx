import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import cookie from 'js-cookie';

const getDataCounts = (data: any) => 
  Object.keys(data).reduce((acc: any, key) => {
    acc[key] = data[key].length;
    return acc;
  }, {});

const extractRPCValues = (dataCounts: any) => [
  dataCounts.RPC1 ?? 0,
  dataCounts.RPC2 ?? 0,
  dataCounts.RPC3 ?? 0,
  dataCounts.RPC4 ?? 0,
  dataCounts.RPC5 ?? 0,
  dataCounts.RPC6 ?? 0,
  dataCounts.RPC7 ?? 0,
  dataCounts.RPC2N2 ?? 0,
  dataCounts.RPC2N14 ?? 0,
];

const StackedBarChart : React.FC<{ dataProps: any }> = ({ dataProps }) => {
  const themeRef = useRef(cookie.get('theme') || 'light');
  const [theme, setTheme] = useState(themeRef.current);

  useEffect(() => {
    const savedTheme = cookie.get('theme') || 'light';
    if (themeRef.current !== savedTheme) {
      themeRef.current = savedTheme;
      setTheme(savedTheme);
    }
  }, []);

  const { series, options } = useMemo(() => {
    const tbmDataCounts = {
      tbm1: getDataCounts(dataProps.tbm1DataRegional),
      tbm2: getDataCounts(dataProps.tbm2DataRegional),
      tbm3: getDataCounts(dataProps.tbm3DataRegional),
      tbm4: getDataCounts(dataProps.tbm4DataRegional),
    };
  
    return {
      series: [
        { name: 'TBM 1', data: extractRPCValues(tbmDataCounts.tbm1) },
        { name: 'TBM 2', data: extractRPCValues(tbmDataCounts.tbm2) },
        { name: 'TBM 3', data: extractRPCValues(tbmDataCounts.tbm3) },
        { name: 'TBM > 3', data: extractRPCValues(tbmDataCounts.tbm4) },
      ],
      options: {
        chart: { type: 'bar', height: 350, stacked: true },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900,
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              },
            },
          },
        },
        xaxis: {
          categories: ['RPC1', 'RPC2', 'RPC3', 'RPC4', 'RPC5', 'RPC6', 'RPC7', 'RPC2N2', 'RPC2N14'],
          labels: {
            style: { colors: theme === 'dark' ? '#fff' : '#000' },
            formatter: (val) => `${val} Blok`,
          },
        },
        yaxis: {
          title: { text: 'Regional', style: { color: theme === 'dark' ? '#fff' : '#000' } },
          labels: { style: { colors: theme === 'dark' ? '#fff' : '#000' } },
        },
        legend: {
          labels: { colors: theme === 'dark' ? '#fff' : '#000' },
        },
        tooltip: { y: { formatter: (val) => `${val}` } },
      } as ApexOptions,
    };
  }, [dataProps, theme]);
  

  return <ReactApexChart options={options} series={series} type='bar' height={350} />;
};


export default React.memo(StackedBarChart);