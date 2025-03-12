import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { Progress } from "@/components/ui/progress"
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart } from 'react-icons/fc'
import { IconPlant } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HighchartsRegionalAttainment from '@/components/custom/regional-attaintment'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SCurveChart from '@/components/custom/kurva-replanting'
import ParetoChart from '@/components/custom/pareto-chart'
import ProblemAnalysisChart from '@/components/custom/area-chart'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import WeeklyReport from '@/components/custom/weeekly-replanting-chart'

import RStatusPieChart from '@/components/custom/region-pie-chart'

// react select
import Select from 'react-select'
import { FcBarChart } from 'react-icons/fc'
import cookie from 'js-cookie'
// custom styles for react select component with tsx
const customStyles = {
  theme: (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'var(--bg-secondary)',
      primary: 'var(--text-primary)',
    },
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--bg-primary)',
    borderColor: 'var(--border-primary)',
    borderRadius: '10.5rem',
    boxShadow: 'none',
    color: 'var(--text-primary)',
    minHeight: '2.5rem',
    '&:hover': {
      borderColor: 'var(--border-primary)',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#fff', // Background color for the menu
    color: 'black', // Text color for the menu
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Shadow effect for the menu
    borderRadius: '0.5rem',
  }),
  option: (base: any, state: any) => ({
    ...base,
    color: state.isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: state.isSelected
      ? 'var(--bg-secondary)' // Background when option is selected
      : 'var(--bg-primary)', // Default background for options
    '&:hover': {
      backgroundColor: 'var(--bg-secondary)', // Hover background
      color: 'var(--text-primary)',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)', // Text color in the search input
  }),
}

import { IconPdf } from '@tabler/icons-react'
import { StokAwal } from './components/stokAwal'
import StatusPieChart from '@/components/custom/status-pie-chart'

export default function Dashboard() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const bulanName = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]


  interface ProblemData {
    regional: string
    Kategori: string
    "Problem Identification": string
    Detail: string
    "Root Causes": string
    "Corrective Action": string
    w1: string
    w2: string
    w3: string
    w4: string
  }


  const fetchStokAwal = async (tahun: number, bulan: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stok-awal-bibit?tahun=${tahun}&bulan=${bulan}`
      )
      const data = response.data
    } catch (error) {
      console.error(error)
    }
  }
  const dataCard = [
    {
      value: '18,681.99 Ha',
      title: 'Total Berkontrak',
      percentage: '+0% from last week',
      progress: '87% of RKAP 2024',
      bgColor: 'bg-gradient-to-l from-green-600 to-green-400',
      color: 'text-white',
    },
    {
      value: '17,646.65 Ha',
      title: 'Total Land Clearing',
      percentage: '+1.03% from last week',
      progress: '82% of RKAP 2024',
      bgColor: 'bg-gradient-to-tl from-teal-500 to-teal-300',
      color: 'text-black',
    },
    {
      value: '13,559.26 Ha',
      title: 'Total Menanam',
      percentage: '+3.53% from last week',
      progress: '63% of RKAP 2024',
      bgColor: 'bg-gradient-to-l from-green-400 to-green-200',
      color: 'text-black',
    },
    {
      value: 'Rp439 Miliar',
      title: 'Serapan Biaya',
      percentage: '+1.46% from last week',
      progress: '52% of RKAP 2024',
      bgColor: 'bg-gradient-to-l from-yellow-400 to-yellow-200',
      color: 'text-black',
    },
  ]

  const [data, setData] = useState([]);


  const [plan, setPlan] = useState<any[]>([]);
  const [actual, setActual] = useState<any[]>([]);


  const [Administrasi, setAdministrasi] = useState<any[]>([]);
  const [Regulasi, setRegulasi] = useState<any[]>([]);
  const [Environment, setEnvironment] = useState<any[]>([]);
  const [Operasional, setOperasional] = useState<any[]>([]);
  const [ProsesPengadaan, setProsesPengadaan] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)


  const [dataMaster, setDataMaster] = useState<any[]>([]);

  const [res, setRes] = useState<{ month: string; plan: any; real: any; realVsPlan: any; spi: any }[]>([]);

  const [dataTableRegion, setDataTableRegion] = useState([]);


  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXTlsseLkShodSUOy-i7l7t03FF68IcucYTYEJmny_lhaODbCQqZZDTEd5dDZfhImykjCwetxwIlXS/pub?gid=2025566438&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const filteredData = result.data.slice(1); // Menghilangkan baris pertama
            // console.log(filteredData);


            const data = filteredData.map((item: any) => {
              return {
                regional: item[1],
                kebun: item[2],
                status: item[3],
                rkap: item[4],
                luasBerkontrak: item[5],
                "-": item[6],

                luasLandClearing: item[8],
                "B": item[9],
                realisasiTanam: item[11],
                "D": item[12],
              };
            });

            setData(data);

          },
        });
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIWBq09iOV27VVAV1tELjYEqomRRdYdukJO5QyVkulTxuB8AwY9HZgnonkd_KfgNyKFPZRe3F-e-Sn/pub?gid=429452392&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const months = [
              "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
              "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
            ];

            const filteredData = result.data.slice(1); // Menghilangkan baris pertama

            const planCurve = filteredData[47].slice(2, 14);
            const actualCurve = filteredData[48].slice(2, 14);
            const realVsPlanCurve = filteredData[49].slice(2, 14);
            const spi = filteredData[50].slice(2, 14);

            const data = months.map((month, index) => ({
              month,
              plan: planCurve[index] ?? null,
              real: actualCurve[index] ?? null,
              realVsPlan: realVsPlanCurve[index] ?? null,
              spi: spi[index] ?? null
            }));

            setRes(data);

          },
        });
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIWBq09iOV27VVAV1tELjYEqomRRdYdukJO5QyVkulTxuB8AwY9HZgnonkd_KfgNyKFPZRe3F-e-Sn/pub?gid=1184057315&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            //  console.log(result.data);
          },
        });
      });
  }, []);

  const [dataPiCa, setDataPiCa] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIWBq09iOV27VVAV1tELjYEqomRRdYdukJO5QyVkulTxuB8AwY9HZgnonkd_KfgNyKFPZRe3F-e-Sn/pub?gid=224467245&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const data = result.data;
            console.log(data);
            setDataPiCa(data[1]);

            let r1 = [];
            let r2 = [];
            let r3 = [];
            let r4 = [];
            let r5 = [];
            let r6 = [];
            let r7 = [];
            let r8 = [];
            let r9 = [];




            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].length; j++) {
                if (i > 3) {
                  if (j > 0 && j <= 9) {
                    if (data[i][2] !== "") {
                      r1.push(data[i][j]);
                    }
                  } else if (j > 11 && j <= 20) {
                    if (data[i][13] !== "") {
                      r2.push(data[i][j]);
                    }
                  } else if (j > 22 && j <= 31) {
                    if (data[i][24] !== "") {
                      r3.push(data[i][j]);
                    }
                  } else if (j > 33 && j <= 42) {
                    if (data[i][35] !== "") {
                      r4.push(data[i][j]);
                    }
                  } else if (j > 44 && j <= 53) {
                    if (data[i][46] !== "") {
                      r5.push(data[i][j]);
                    }
                  } else if (j > 55 && j <= 64) {
                    if (data[i][57] !== "") {
                      r6.push(data[i][j]);
                    }
                  } else if (j > 66 && j <= 75) {
                    if (data[i][68] !== "") {
                      r7.push(data[i][j]);
                    }
                  }
                  else if (j > 77 && j <= 86) {
                    if (data[i][79] !== "") {
                      r8.push(data[i][j]);
                    }
                  }
                  else if (j > 88 && j <= 97) {
                    if (data[i][90] !== "") {
                      r9.push(data[i][j]);
                    }
                  }
                }



              }
            }


            let arrayData = [
              r1,
              r2,
              r3,
              r4,
              r5,
              r6,
              r7,
              r8,
              r9
            ]

            let arrayDataFinal = []
            for (let i = 0; i < arrayData.length; i++) {
              let data = arrayData[i]
              let dataFinal = []
              for (let j = 0; j < data.length; j++) {

                dataFinal.push(data[j])
              }
              arrayDataFinal.push(dataFinal)
            }


            const categories = [
              "Adminitrasi",
              "Regulasi",
              "Environment",
              "Operasional",
              "Proses Pengadaan"
            ];

            function convertData(data: any, categories: any, region: any) {
              const result = []
              let currentCategory = ""

              for (let i = 0; i < data.length; i++) {
                if (categories.includes(data[i])) {
                  // Found a new category
                  currentCategory = data[i]

                  // Start a new problem with empty fields
                  const newProblem: { [key: string]: any } = {
                    regional: region,
                    Kategori: currentCategory,
                    "Problem Identification": "",
                    Detail: "",
                    "Root Causes": "",
                    "Corrective Action": "",
                    w1: "",
                    w2: "",
                    w3: "",
                    w4: "",
                  }

                  // Find the next fields for this category
                  let j = i + 1
                  let fieldIndex = 0
                  const fieldNames = [
                    "Problem Identification",
                    "Detail",
                    "Root Causes",
                    "Corrective Action",
                    "w1",
                    "w2",
                    "w3",
                    "w4",
                  ]

                  // Continue until we hit the next category or end of data
                  while (j < data.length && !categories.includes(data[j]) && fieldIndex < fieldNames.length) {
                    newProblem[fieldNames[fieldIndex]] = data[j]
                    j++
                    fieldIndex++
                  }

                  // Add the problem to results
                  result.push(newProblem)

                  // Skip the processed fields
                  i = j - 1
                }
              }

              return result
            }

            const convertedDataR1 = convertData(arrayDataFinal[0], categories, "R1");
            const convertedDataR2 = convertData(arrayDataFinal[1], categories, "R2");
            const convertedDataR3 = convertData(arrayDataFinal[2], categories, "R3");
            const convertedDataR4 = convertData(arrayDataFinal[3], categories, "R4");
            const convertedDataR5 = convertData(arrayDataFinal[4], categories, "R5");
            const convertedDataR6 = convertData(arrayDataFinal[5], categories, "R6");
            const convertedDataR7 = convertData(arrayDataFinal[6], categories, "R7");
            const convertedDataR8 = convertData(arrayDataFinal[7], categories, "R2 EKS N2");
            const convertedDataR9 = convertData(arrayDataFinal[8], categories, "R2 EKS N14");

            const mergedData = [
              ...convertedDataR1,
              ...convertedDataR2,
              ...convertedDataR3,
              ...convertedDataR4,
              ...convertedDataR5,
              ...convertedDataR6,
              ...convertedDataR7,
              ...convertedDataR8,
              ...convertedDataR9
            ];

            setDataMaster(mergedData);

          },
        });
      });
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIWBq09iOV27VVAV1tELjYEqomRRdYdukJO5QyVkulTxuB8AwY9HZgnonkd_KfgNyKFPZRe3F-e-Sn/pub?gid=1184057315&single=true&output=csv"
    );
    const csv = await response.text();
    return csv;
  };

  const parseCSV = (csv: string) => {
    return new Promise((resolve) => {
      Papa.parse(csv, {
        header: false,
        skipEmptyLines: true,
        complete: (result: any) => {
          resolve(result.data);
        },
      });
    });
  };

  const cleanData = (data: any[][]) => {
    return data.map((row) =>
      row.map((cell, index) => {
        if (index === 0 && cell === "") return "a";
        if (cell === "") return null;
        if (index === 1 && (cell === "BULAN INI" || cell === "Real (%)" || cell === "Plan (%)")) return null;
        return cell;
      })
    );
  };

  const filterData = (data: any[][]) => {
    return data.filter((row) => row.every((cell) => cell !== null));
  };

  const processDataReal = (data: any[][]) => {
    return data
      .filter((row) => row[1] === "Real s.d (%)")
      .map((row) => row.slice(2, 14));
  };


  const processDataPlan = (data: any[][]) => {
    return data
      .filter((row) => row[1] === "Plan s.d (%)")
      .map((row) => row.slice(2, 14));
  };


  const parseData = (data: string[][], month: number) => {
    return data.map((row) => {
      const value: any = row[month]
      if (isNaN(value)) return null
      return parseFloat(value)
    })
  }

  const useProcessedData = () => {
    useEffect(() => {
      const processCSV = async () => {
        const csv = await fetchData();
        const parsedData: any = await parseCSV(csv);
        const cleanedData = cleanData(parsedData);
        const filteredData = filterData(cleanedData);
        const processedDataReal = processDataReal(filteredData);
        const processedDataPlan = processDataPlan(filteredData);
        const real = parseData(processedDataReal, 1);
        const plan = parseData(processedDataPlan, 1);
        setActual(real);
        setPlan(plan);
      };

      processCSV();
    }, []);
  };

  useProcessedData();

  const getBarColor = (value: number) => {
    if (value > 93) return "#34a853"; // Hijau
    if (value > 70) return "#46bdc6"; // Biru
    if (value > 50) return "#fbbc04"; // Kuning
    return "#ea4335"; // Merah
  };

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div className='flex items-center space-x-2'>
            <FcDoughnutChart size={40} />
            <h1 className='text-2xl font-bold tracking-tight'>
              Dashboard Replanting
            </h1>

          </div>
          <h1>Hi, Welcome back {fullname}👋</h1>


        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4 '
        >

          <div className="flex items-center justify-between space-x-2">
            <div className='float-start'>
              <TabsList>
                <TabsTrigger value='overview'>Weekly Report</TabsTrigger>
                {/* <TabsTrigger value='analytics'>Delivery Kecambah</TabsTrigger> */}
                <TabsTrigger value='reports'>S-Curve & PICA Analysis</TabsTrigger>


              </TabsList>
            </div>

            <div className='flex items-center space-x-2 rounded-full shadow-xl bg-gradient-to-br from-slate-600 to-slate-800 px-4 py-2 text-white w-auto float-end'>
              <h2 className='text-sm' >{dataPiCa[0]} &nbsp; {dataPiCa[1]} &nbsp; {dataPiCa[2]} &nbsp; {dataPiCa[3]}  </h2>
            </div>

          </div>

          <TabsContent value='overview' className='space-y-4'>

            <div className='grid lg:grid-cols-1'>
              <Card className='mr-5 bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>

                <CardContent>
                  <WeeklyReport />
                </CardContent>
              </Card>

            </div>



            <div className='grid lg:grid-cols-1'>
              <Card className='mt-5 bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='grid gap-6 p-4 md:grid-cols-1'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2 text-lg font-medium'>
                      <h1 className='mt-4 flex items-center text-xl font-bold tracking-tight'>
                        <img
                          className='mr-2'
                          width='28'
                          height='28'
                          src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                          alt='positive-dynamic'
                        />
                        Realisasi Tanam Perkebun
                      </h1>
                    </div>


                    {/* <div className='grid lg:grid-cols-[70%_30%]'></div> */}
                    <div className="p-4 pt-0">
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">
                        <table className="border-collapse border w-full mt-4">

                          <tbody>
                            {data.map((row, rowIndex) => (
                              <tr key={rowIndex} id={rowIndex + ""}>
                                {Object.values(row).map((value: any, colIndex) =>
                                (
                                  colIndex === 5 || colIndex === 7 || colIndex === 9 ? (
                                    <td id={colIndex + ""} key={colIndex} className="border p-2">
                                      {!isNaN(parseFloat(value)) ? (
                                        <>
                                          <p className='text-right font-semibold'>{parseInt(value)} %</p>
                                          <Progress value={parseFloat(value)} bgColor={getBarColor(parseFloat(value))} />

                                        </>
                                      ) : (
                                        value
                                      )}

                                    </td>


                                  ) : (
                                    <td id={colIndex + ""} key={colIndex} className="border p-2">{value}</td>
                                  )
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>

                  </div>
                </div>
              </Card>
            </div>



          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <div className='grid lg:grid-cols-[65%_35%] gap-4'>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='grid gap-6 p-4 md:grid-cols-1'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2 text-lg font-medium'>
                      <h1 className='mt-4 flex items-center text-xl font-bold tracking-tight'>
                        <img
                          className='mr-2'
                          width='28'
                          height='28'
                          src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                          alt='positive-dynamic'
                        />
                        S-Curve : Project Replanting Kelapa Sawit 2025
                      </h1>
                    </div>


                    {/* <div className='grid lg:grid-cols-[70%_30%]'></div> */}
                    <div className="p-4 pt-0">
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">
                        <SCurveChart
                          dataprops={{ data: res }}
                        />
                      </div>

                    </div>

                  </div>
                </div>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='grid gap-6 p-4 md:grid-cols-1'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2 text-lg font-medium'>
                      <h1 className='mt-4 flex items-center text-xl font-bold tracking-tight'>
                        <img
                          className='mr-2'
                          width='28'
                          height='28'
                          src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                          alt='positive-dynamic'
                        />
                        Regional Attainment
                      </h1>
                    </div>


                    {/* <div className='grid lg:grid-cols-[70%_30%]'></div> */}
                    <div className="p-4 pb-0 pt-0">
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">
                        <HighchartsRegionalAttainment
                          dataprops={
                            {
                              actual: actual,
                              plan: plan
                            }
                          }
                        />
                      </div>
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">

                      </div>

                    </div>

                  </div>
                </div>
              </Card>
            </div>
            <div className='grid lg:grid-cols-[50%_50%] gap-4'>

              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='flex items-center gap-2 text-lg font-medium'>
                  <h1 className='mt-4 flex items-center text-xl font-bold tracking-tight ml-5'>
                    <img
                      className='mr-2'
                      width='28'
                      height='28'
                      src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                      alt='positive-dynamic'
                    />
                    Problem Identification & Cause Analysis
                  </h1>
                </div>
                <div className="p-8 space-y-2 -mt-4">
                  <CardTitle className="text-lg">Pareto Chart</CardTitle>
                  <div className="text-lg">Grafik Pareto menunjukkan efek dari berbagai faktor.</div>
                  <ParetoChart />
                </div>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='grid p-4 md:grid-cols-1'>
                  <div className='space-y-4'>
                    <div className='flex items-centertext-lg font-medium'>
                      <h1 className='flex items-center text-xl font-bold tracking-tight'>
                        <img
                          className='mr-2'
                          width='28'
                          height='28'
                          src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                          alt='positive-dynamic'
                        />
                        Top 10 Problem Identification
                      </h1>
                    </div>


                    {/* <div className='grid lg:grid-cols-[70%_30%]'></div> */}
                    <div className="">
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">
                        <ProblemAnalysisChart data={dataMaster} />
                      </div>


                    </div>

                  </div>
                </div>
              </Card>
            </div>
            <div className='grid lg:grid-cols-[35%_65%] gap-4'>

              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='mt-4 flex justify-between items-center gap-2 text-lg font-medium align-middle'>
                  <h1 className=' flex items-center text-xl font-bold tracking-tight ml-5'>
                    <img
                      className='mr-2'
                      width='28'
                      height='28'
                      src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                      alt='positive-dynamic'
                    />
                    Corrective Action

                  </h1>
                  <Button variant={"secondary"} className="flex items-center rounded-full mr-4" onClick={() => setIsDrawerOpen(true)}>
                    <img width="20" height="20" src="https://img.icons8.com/stickers/50/visible.png" alt="visible" />
                    <span className="ml-2"> Status Regional</span>
                  </Button>
                </div>
                <div className="p-8 space-y-2 -mt-4">
                  <CardTitle className="text-lg">Corrective Action Chart</CardTitle>
                  <div className="text-lg">Grafik ini menunjukkan corrective action yang dilakukan.</div>
                  <StatusPieChart data={dataMaster} />
                </div>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <div className='grid p-4 md:grid-cols-1'>
                  <div className='space-y-4'>
                    <div className='flex items-centertext-lg font-medium'>
                      <h1 className='flex items-center text-xl font-bold tracking-tight'>
                        <img
                          className='mr-2'
                          width='28'
                          height='28'
                          src='https://img.icons8.com/fluency/48/positive-dynamic.png'
                          alt='positive-dynamic'
                        />
                        Detail Corrective Action
                      </h1>
                    </div>


                    {/* <div className='grid lg:grid-cols-[70%_30%]'></div> */}
                    <div className="">
                      <div className="bg-gradient-to-br  bg-white dark:from-slate-900 dark:to-slate-950">
                        <div className="relative overflow-x-auto max-h-[500px]">
                          <table className="text-left">
                            <thead>
                              <tr>
                                <th className="border bg-green-600 text-white px-1 py-2">Regional</th>

                                <th className="border bg-green-600 text-white px-1 py-2">Problem Identification</th>

                                <th className="border bg-green-600 text-white px-1 py-2">Root Causes</th>
                                <th className="border bg-green-600 text-white px-1 py-2">Corrective Action</th>
                                <th className="border bg-green-600 text-white px-1 py-2">W1</th>
                                <th className="border bg-green-600 text-white px-1 py-2">W2</th>
                                <th className="border bg-green-600 text-white px-1 py-2">W3</th>
                                <th className="border bg-green-600 text-white px-1 py-2">W4</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataMaster.map((problem, index) => (
                                <tr key={index}>
                                  <td className="border px-1 py-2">{problem.regional}</td>

                                  <td className="border px-1 py-2">{problem["Problem Identification"]}</td>

                                  <td className="border px-1 py-2">{problem["Root Causes"]}</td>
                                  <td className="border px-1 py-2">{problem["Corrective Action"]}</td>
                                  <td className={`text-white font-semibold border px-1 py-2 ${problem.w1 === 'Not Started' ? 'bg-red-400 rounded' : problem.w1 === 'On Progress' ? 'bg-sky-500 rounded' : problem.w1 === 'Done' ? 'bg-green-500 rounded' : ''}`}>
                                    {problem.w1}
                                  </td>
                                  <td className={`text-white font-semibold border px-1 py-2 ${problem.w2 === 'Not Started' ? 'bg-red-400 rounded' : problem.w2 === 'On Progress' ? 'bg-sky-500 rounded' : problem.w2 === 'Done' ? 'bg-green-500 rounded' : ''}`}>
                                    {problem.w2}
                                  </td>
                                  <td className={`text-white font-semibold border px-1 py-2 ${problem.w3 === 'Not Started' ? 'bg-red-400 rounded' : problem.w3 === 'On Progress' ? 'bg-sky-500 rounded' : problem.w3 === 'Done' ? 'bg-green-500 rounded' : ''}`}>
                                    {problem.w3}
                                  </td>
                                  <td className={`text-white font-semibold border px-1 py-2 ${problem.w4 === 'Not Started' ? 'bg-red-400 rounded' : problem.w4 === 'On Progress' ? 'bg-sky-500 rounded' : problem.w4 === 'Done' ? 'bg-green-500 rounded' : ''}`}>
                                    {problem.w4}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>


                        </div>
                      </div>
                    </div>

                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                      <DrawerContent >
                        <DrawerHeader>
                          <DrawerTitle>Status Regional</DrawerTitle>
                          <DrawerDescription>Informasi status regional</DrawerDescription>
                        </DrawerHeader>
                        <div className="relative w-full overflow-y-auto max-h-[550px]">

                          <RStatusPieChart data={dataMaster} />
                        </div>
                        <DrawerFooter>
                          <DrawerClose>Close</DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>


      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Nursery',
    href: '/dashboard-nursery',
    isActive: false,
  },
  {
    title: 'Replanting (TU/TK/TB)',
    href: '/dashboard-replanting',
    isActive: true,
  },
  {
    title: 'Immature',
    href: '/dashboard-immature',
    isActive: false,
  },
  {
    title: 'Monica',
    href: '/dashboard-monica',
    isActive: false,
  },
]
