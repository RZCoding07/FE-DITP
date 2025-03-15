import React, { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import Papa from 'papaparse'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart } from 'react-icons/fc'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Overview } from './components/overview'
import cookie from 'js-cookie'
import PieChart from '@/components/custom/pie-chart'
import BarChartSB from '@/components/custom/bibitan-sumber-benih'
// react select
import Select from 'react-select'
import { FcBarChart } from 'react-icons/fc'
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
    width: '250px', // Set desired width here
    minHeight: '2.5rem',
    '&:hover': {
      borderColor: 'var(--border-primary)',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#fff',
    color: 'black',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '0.5rem',
  }),
  option: (base: any, state: any) => ({
    ...base,
    color: state.isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: state.isSelected ? 'var(--bg-secondary)' : 'var(--bg-primary)',
    whiteSpace: 'nowrap', // Prevent text from wrapping
    overflow: 'hidden', // Hide overflow
    textOverflow: 'ellipsis', // Add ellipsis if text is too long
    '&:hover': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
};

import { IconPdf } from '@tabler/icons-react'
import BarChart from '@/components/custom/bibitan-bar-chart'

export default function Dashboard() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const [stokAwal, setStokAwal] = useState([])

  const [countAllMn, setCountAllMn] = useState(0)
  const [countAllPn, setCountAllPn] = useState(0)


  const [countMnR1, setCountMnR1] = useState(0)
  const [countMnR2, setCountMnR2] = useState(0)
  const [countMnR3, setCountMnR3] = useState(0)
  const [countMnR4, setCountMnR4] = useState(0)
  const [countMnR5, setCountMnR5] = useState(0)
  const [countMnR6, setCountMnR6] = useState(0)
  const [countMnR7, setCountMnR7] = useState(0)
  const [countMnR2n2, setCountMnR2n2] = useState(0)
  const [countMnR2n14, setCountMnR2n14] = useState(0)

  const [countpN1, setCountpN1] = useState(0)
  const [countpN2, setCountpN2] = useState(0)
  const [countpN3, setCountpN3] = useState(0)
  const [countpN4, setCountpN4] = useState(0)
  const [countpN5, setCountpN5] = useState(0)
  const [countpN6, setCountpN6] = useState(0)
  const [countpN7, setCountpN7] = useState(0)
  const [countpN2n2, setCountpN2n2] = useState(0)
  const [countpN2n14, setCountpN2n14] = useState(0)

  const [stokAkhirR1, setStokAkhirR1] = useState(0)
  const [stokAkhirR2, setStokAkhirR2] = useState(0)
  const [stokAkhirR3, setStokAkhirR3] = useState(0)
  const [stokAkhirR4, setStokAkhirR4] = useState(0)
  const [stokAkhirR5, setStokAkhirR5] = useState(0)
  const [stokAkhirR6, setStokAkhirR6] = useState(0)
  const [stokAkhirR7, setStokAkhirR7] = useState(0)
  const [stokAkhirR2n2, setStokAkhirR2n2] = useState(0)
  const [stokAkhirR2n14, setStokAkhirR2n14] = useState(0)


  interface SumberBenih {
    sumberBenih: string;
    sum: number;
  }

  const [sumberBenihR1, setSumberBenihR1] = useState<SumberBenih[]>([])
  const [sumberBenihR2, setSumberBenihR2] = useState<SumberBenih[]>([])
  const [sumberBenihR3, setSumberBenihR3] = useState<SumberBenih[]>([])
  const [sumberBenihR4, setSumberBenihR4] = useState<SumberBenih[]>([])
  const [sumberBenihR5, setSumberBenihR5] = useState<SumberBenih[]>([])
  const [sumberBenihR6, setSumberBenihR6] = useState<SumberBenih[]>([])
  const [sumberBenihR7, setSumberBenihR7] = useState<SumberBenih[]>([])
  const [sumberBenihR2n2, setSumberBenihR2n2] = useState<SumberBenih[]>([])
  const [sumberBenihR2n14, setSumberBenihR2n14] = useState<SumberBenih[]>([])

  const [sumberBenihAll , setSumberBenihAll] = useState<SumberBenih[]>([])

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const bulan = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]

  const tahun = [
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
    { value: '2031', label: '2031' },
    { value: '2032', label: '2032' },
    { value: '2033', label: '2033' },
    { value: '2034', label: '2034' },
    { value: '2035', label: '2035' }
  ]
  const defaultValue = bulan.find((item) => item.value === currentMonth.toString());

  const defaultValueTahun = tahun.find((item) => item.value === currentYear.toString());

  const [hasilSeleksi, setHasilSeleksi] = useState([])


  const apiUrl = import.meta.env.VITE_API_NURSERY

  // r1
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=1948126433&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR1(sum)
            setCountpN1(sumPn)
            setStokAkhirR1(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR1(sumberBenih)
          },
        });
      });
  }, []);

  //r2
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=888156004&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR2(sum)
            setCountpN2(sumPn)
            setStokAkhirR2(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR2(sumberBenih)
          },
        });
      });
  }, []);

  // r3
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=324730558&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR3(sum)
            setCountpN3(sumPn)
            setStokAkhirR3(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR3(sumberBenih)
          },
        });
      });
  }, []);


  // r4
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=595437760&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR4(sum)
            setCountpN4(sumPn)
            setStokAkhirR4(sum + sumPn)


            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR4(sumberBenih)
          },
        });
      });
  }, []);

  // r5
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=1780398078&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR5(sum)
            setCountpN5(sumPn)
            setStokAkhirR5(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR5(sumberBenih)
          },
        });
      });
  }, []);

  // r6
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=393735114&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);

            setCountMnR6(sum)
            setCountpN6(sumPn)
            setStokAkhirR6(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR6(sumberBenih)
          },
        });
      });
  }, []);
  // count all pn and mn

  // r7
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=1587002771&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);
            setCountMnR7(sum)
            setCountpN7(sumPn)
            setStokAkhirR7(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR7(sumberBenih)
          },
        });
      });
  }, []);

  // r2n2
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=1116131204&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);
            setCountMnR2n2(sum)
            setCountpN2n2(sumPn)
            setStokAkhirR2n2(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR2n2(sumberBenih)
          },
        });
      });
  }, []);

  // r2n14
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_7_n2rADe93NzwXGe9dGzMeZ4JerDO-IcQf5jV3rW8coTBdcnmqNGIpnbBjtog/pub?gid=456272137&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {
            const dataPerKolom = result.data[0].map((_: any, colIndex: any) =>
              result.data.map((row: any) => row[colIndex].replace(/,/g, ""))
            );

            interface DataPerKolom {
              [index: number]: string[];
            }
            const indexOfMN: number[] = (dataPerKolom as DataPerKolom)[7]
              .map((item: string, index: number): number => (item === 'MN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Mn = indexOfMN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValues = valuesFromDataPerKolom31Mn
              .filter(value => !isNaN(value)); // Mengabaikan NaN
            const sum = filteredValues.reduce((acc, value) => acc + value, 0);
            const indexOfPN: number[] = (dataPerKolom as string[][])[7]
              .map((item: string, index: number): number => (item === 'PN' ? index : -1))
              .filter((index: number): boolean => index !== -1);
            const valuesFromDataPerKolom31Pn = indexOfPN
              .map(index => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
            const filteredValuesPn = valuesFromDataPerKolom31Pn
              .filter(value => !isNaN(value)); // Mengabaikan NaN

            const sumPn = filteredValuesPn.reduce((acc, value) => acc + value, 0);
            setCountMnR2n14(sum)
            setCountpN2n14(sumPn)
            setStokAkhirR2n14(sum + sumPn)

            // distinct index 4 dataPerKolom
            const distinctIndex3 = [...new Set(dataPerKolom[3])];
            const distinctIndex3Filtered = distinctIndex3.filter((item) => item !== 'Sumber benih' && item !== '');


            const sumberBenih = distinctIndex3Filtered.map((item) => { // looping sumber benih
              const indexOfSumberBenih = dataPerKolom[3].map((sumberBenih: string, index: number) => sumberBenih === item ? index : -1).filter((index: any) => index !== -1); // cari index sumber benih
              const valuesFromDataPerKolom31 = indexOfSumberBenih.map((index: any) => {
                const value = parseFloat(dataPerKolom[31][index]);
                return Math.round(value * 100) / 100; // Membulatkan ke 2 desimal
              });
              const filteredValues = valuesFromDataPerKolom31.filter((value: any) => !isNaN(value)); // Mengabaikan NaN
              const sum = filteredValues.reduce((acc: any, value: any) => acc + value, 0);
              return { sumberBenih: item as string, sum };
            }
            );

            setSumberBenihR2n14(sumberBenih)
          },
        });
      });
  }, []);


const formatNumber = (value: number) => { 
  return new Intl.NumberFormat('id-ID').format(value)
}



  // const fetchSeleksiAkhirBibit = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${apiUrl}/pie-chart-bibitan-regional`
  //     )
  //     const data = response.data

  //     setHasilSeleksi(data)

  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchSeleksiAkhirBibit()
  // }, [])

  useEffect(() => {
    setCountAllPn(countpN1 + countpN2 + countpN3 + countpN4 + countpN5 + countpN6 + countpN7 + countpN2n2 + countpN2n14)
    setCountAllMn(countMnR1 + countMnR2 + countMnR3 + countMnR4 + countMnR5 + countMnR6 + countMnR7 + countMnR2n2 + countMnR2n14)
  } , [countMnR1, countMnR2, countMnR3, countMnR4, countMnR5, countMnR6, countMnR7, countMnR2n2, countMnR2n14, countpN1, countpN2, countpN3, countpN4, countpN5, countpN6, countpN7, countpN2n2, countpN2n14]) 


 // spesial sumber benih dia sum tapi kalo array yang ada aja gitu di sumkan kalo gada di add
 useEffect(() => {
  const allSumberBenih = [...sumberBenihR1, ...sumberBenihR2, ...sumberBenihR3, ...sumberBenihR4, ...sumberBenihR5, ...sumberBenihR6, ...sumberBenihR7, ...sumberBenihR2n2, ...sumberBenihR2n14];

  const sumMap = allSumberBenih.reduce((acc: { [key: string]: number }, item) => {
    if (!acc[item.sumberBenih]) {
      acc[item.sumberBenih] = 0;
    }
    acc[item.sumberBenih] += item.sum;
    return acc;
  }, {});

  const result = Object.keys(sumMap).map((key) => ({
    sumberBenih: key,
    sum: sumMap[key],
  }));

  setSumberBenihAll(result);
}, [sumberBenihR1, sumberBenihR2, sumberBenihR3, sumberBenihR4, sumberBenihR5, sumberBenihR6, sumberBenihR7, sumberBenihR2n2, sumberBenihR2n14]);

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
              Dashboard Nursery

            </h1>
          </div>
          {/* <h1>Hai, {fullname}, <br/> Selamat Datang di EV4PALMS ! 👋</h1> */}

          <div className='flex items-center space-x-2'>


            <Button className='flex items-center rounded-full'>
              Download
              <IconPdf size={20} className='ml-2 bg-red-500 text-white' />
            </Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>

          </div>
          <TabsContent value='overview' className='space-y-4'>

            <Tabs
              orientation='vertical'
              defaultValue='grafik'
              className='space-y-4'
            >
              <div className='w-full overflow-x-auto pb-2'>
                <TabsList>
                  <TabsTrigger value='grafik'>Grafik</TabsTrigger>
                  <TabsTrigger value='analytics'>Rekapitulasi</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='grafik'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-[25%,40%,33%] '>

                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 bg-white shadow-md shadow-sky-500 border border-cyan-700 dark:border-cyan-500'>
                    <CardHeader>
                      <CardTitle>Stok Bibit Per Status</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2 justify-items-center align-middle'>
                      <PieChart dataprops={{
                        pn:countAllPn,
                        mn:countAllMn,
                      }} />
            
                        <h2 className='text-center my-2'>( PN & MN )</h2>

                      <div className='flex justify-center space-x-2'>
                        <div className='flex items-center space-x-2'>
                          <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                          <p>PN ({formatNumber(countAllPn)})</p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                          <p>MN ({formatNumber(countAllMn)})</p>
                        </div>
                        </div>

                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 bg-white shadow-md shadow-sky-500 border border-cyan-700 dark:border-cyan-500'>
                    <CardHeader>
                      <CardTitle>Stok Bibit Per Regional</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2 justify-items-center align-middle'>
                      <BarChart dataprops={{
                        r1:stokAkhirR1,
                        r2:stokAkhirR2,
                        r3:stokAkhirR3,
                        r4:stokAkhirR4,
                        r5:stokAkhirR5,
                        r6:stokAkhirR6,
                        r7:stokAkhirR7,
                        r2n2:stokAkhirR2n2,
                        r2n14:stokAkhirR2n14
                      }} />
                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 bg-white shadow-md shadow-sky-500 border border-cyan-700 dark:border-cyan-500'>
                    <CardHeader>
                      <CardTitle>Stok bibit Per Sumber Benih</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2 justify-items-center align-middle'>
                      <BarChartSB dataprops={{sumberBenihAll}} />
                    </CardContent>
                  </Card>
                </div>


              </TabsContent>
            </Tabs>
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
    isActive: true,
  },
  {
    title: 'Replanting (TU/TK/TB)',
    href: '/dashboard-replanting',
    isActive: false,
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
