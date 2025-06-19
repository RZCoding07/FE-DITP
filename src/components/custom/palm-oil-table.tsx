import React, { useEffect, useRef } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  dataOne,
  dataTwo,
  dataThree,
  dataFour,
  dataFive
} from "@/data/tbm-params";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PalmOilTable() {


  interface MathRendererProps {
    expression: string;  // Ekspresi LaTeX sebagai string
  }

  const MathRenderer: React.FC<MathRendererProps> = ({ expression }) => {
    const mathContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (mathContainerRef.current) {
        // Render ekspresi matematika menggunakan KaTeX
        katex.render(expression, mathContainerRef.current, {
          throwOnError: false,  // Jangan tampilkan error jika terjadi kesalahan
        });
      }
    }, [expression]);

    return <div style={{ fontSize: '11px' }} ref={mathContainerRef}></div>;
  };

  const [varietas, setVarietas] = React.useState<string>('DP Yangambi');


  const options = [
    // dataOne
    { value: 'DP Yangambi', label: 'DP Yangambi' },
    { value: 'DP PPKS 718', label: 'DP PPKS 718' },
    { value: 'DP 239', label: 'DP 239' },
    // dataTwo
    { value: 'DP Langkat', label: 'DP Langkat' },
    // dataThree
    { value: 'DP Simalungun', label: 'DP Simalungun' },
    { value: 'DP Avros', label: 'DP Avros' },
    { value: 'DP 540', label: 'DP 540' },
    { value: 'Lonsum', label: 'Lonsum' },
    { value: 'Dami Mas', label: 'Dami Mas' },
    { value: 'Bina Sawit Makmur', label: 'Bina Sawit Makmur' },
    { value: 'Sarana Inti Pratama', label: 'Sarana Inti Pratama' },
    { value: 'Panca Surya Garden', label: 'Panca Surya Garden' },
    // dataFour
    { value: 'SF Lame', label: 'SF Lame' },
    { value: 'SF MTG', label: 'SF MTG' },
    { value: 'Bakrie', label: 'Bakrie' },
    { value: 'Topaz', label: 'Topaz' },
    { value: 'Sriwijaya Sampoerna', label: 'Sriwijaya Sampoerna' },
    { value: 'Verdant', label: 'Verdant' },
    // dataFive
    { value: 'SF Yangambi', label: 'SF Yangambi' },

  ];


  const [dataRules, setDataRules] = React.useState<any[]>([]);

  useEffect(() => {
    setDataRules(dataOne);
  }
    , []);

  const handleVarietasChange = (varietas: string) => {
    setVarietas(varietas);
    if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
      setDataRules(dataOne);
    } else if (varietas === "DP Langkat") {
      setDataRules(dataTwo);
    } else if (varietas === "DP Simalungun" || varietas === "DP Avros" || varietas === "DP 540" || varietas === "Lonsum" || varietas === "Dami Mas" || varietas === "Bina Sawit Makmur" || varietas === "Sarana Inti Pratama" || varietas === "Panca Surya Garden") {
      setDataRules(dataThree);
    } else if (varietas === "SF Lame" || varietas === "SF MTG" || varietas === "SF Yangambi" || varietas === "Bakrie" || varietas === "Topaz" || varietas === "Sriwijaya Sampoerna" || varietas === "Verdant") {
      setDataRules(dataFour);
    } else if (varietas === "DP 239") {
      setDataRules(dataFive);
    }
  }


  const latexExpression = '\\text{Bobot Nilai Kerapatan Pokok} = \\left( \\frac{\\text{Jumlah Pokok Akhir}}{\\text{Jumlah Pokok Awal}} \\times 100\\right) \\times  30\\%';
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full mb-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-semibold">Varietas {varietas}</h1>
          <div className="flex items-center space-x-2">
            <label htmlFor="varietas" className="text-sm font-medium">Pilih Varietas:</label>
            <Select defaultValue={options[0].value} onValueChange={handleVarietasChange}>
              <SelectTrigger className="w-[180px]" id="varietas">
                <SelectValue placeholder="Pilih Varietas"  />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>
      </div>


      <div className="grid grid-cols-[60%_40%] gap-4">
        <div className="rounded-md borders">
          <Table>
            <TableHeader className="bg-[#2B5329] text-[14px] text-center">
              <TableRow>
                <TableHead rowSpan={2} className="text-white border-r text-center">
                  Fase
                </TableHead>
                <TableHead rowSpan={2} className="text-white border-r">
                  Umur
                </TableHead>
                <TableHead colSpan={12} className="text-center text-white border-b">
                  Parameter
                </TableHead>
              </TableRow>
              <TableRow>

                <TableHead colSpan={3} className="text-center text-white border-r bg-[#3B7137]">
                  Lingkar Batang
                </TableHead>
                <TableHead colSpan={3} className="text-center text-white bg-[#3B7137] border-r">
                  Jumlah Pelepah
                </TableHead>
                <TableHead colSpan={3} className="text-center text-white bg-[#3B7137]">
                  Tinggi Tanaman
                </TableHead>
              </TableRow>
              <TableRow className="text-white text-center">
                <TableHead className="border-r" />
                <TableHead className="border-r" />

                <TableHead className="border-r bg-[#2B5329]">Skor 100</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 90</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 80</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 100</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 90</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 80</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 100</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 90</TableHead>
                <TableHead className="border-r bg-[#2B5329]">Skor 80</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px] text-center">
              {dataRules.map((row, index) => (
                <TableRow key={`${row.fase}-${row.umur}`} className={index % 2 === 0 ? "bg-transparent" : "bg-gray-100 dark:bg-slate-900"}>
                  <TableCell className="border-r border-l font-medium">{row.fase}</TableCell>
                  <TableCell className="border-r text-center">{row.umur}</TableCell>

                  <TableCell className="border-r text-center">{row.lingkarBatang.skor100}</TableCell>
                  <TableCell className="border-r text-center">{row.lingkarBatang.skor90}</TableCell>
                  <TableCell className="border-r text-center">{row.lingkarBatang.skor80}</TableCell>
                  <TableCell className="border-r text-center">{row.jumlahPelepah.skor100}</TableCell>
                  <TableCell className="border-r text-center">{row.jumlahPelepah.skor90}</TableCell>
                  <TableCell className="border-r text-center">{row.jumlahPelepah.skor80}</TableCell>
                  <TableCell className="border-r text-center">{row.tinggiTanaman.skor100}</TableCell>
                  <TableCell className="border-r text-center">{row.tinggiTanaman.skor90}</TableCell>
                  <TableCell className="border-r text-center">{row.tinggiTanaman.skor80}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="text-[13px]">
          <h2>Perumusan Perhitungan Pengukuran Vegetatif</h2>
          <p className="text-[13px] my-2">Perumusan perhitungan pengukuran vegetatif pada tanaman kelapa sawit dilakukan dengan menggunakan metode skor. Skor ini diperoleh dari pengukuran langsung pada lapangan. Berikut adalah rumus perhitungan skor pada parameter vegetatif tanaman kelapa sawit:</p>
          <h3 className="my-2 text-[13px]">1. Kerapatan Pokok</h3>
          <MathRenderer expression={latexExpression}
          />
          <h3 className="my-2 text-[13px]">2. Lingkar Batang</h3>
          <p className="text-[13px] my-2">
            Skor Lingkar Batang = Total Skor x 40%
          </p>
          <h3 className="my-2 text-[13px]">3. Jumlah Pelepah</h3>
          <p className="text-[13px] my-2">Bobot Nilai Jumlah Pelepah = Total Skor x 20%
          </p>
          <h3 className="my-2 text-[13px]">4. Tinggi Tanaman</h3>
          <p className="text-[13px] my-2">Bobot Nilai Tinggi Tanaman = Total Skor x 10%
          </p>
          <hr className="border my-3" />
          <h2>Kelas Blok</h2>
          <p className="text-[13px] my-2">
            Kelas blok merupakan hasil dari perhitungan skor vegetatif yang telah dilakukan. Berikut adalah kriteria kelas blok berdasarkan skor vegetatif:
          </p>
          <Table>
            <TableHeader className="bg-[#2B5329] text-[9px] text-center">
              <TableRow>
                <TableHead className="text-white border-r text-center">
                  Skor
                </TableHead>
                <TableHead className="text-white border-r text-center">
                  Kriteria
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[9px] text-center">
              <TableRow className="text-white bg-yellow-500">
                <TableCell className="border-r border-l font-medium">A</TableCell>
                <TableCell className="border-r text-center">Skor {'>'} 92 - 100</TableCell>
              </TableRow>
              <TableRow className="text-white bg-green-700">
                <TableCell className="border-r border-l font-medium">B</TableCell>
                <TableCell className="border-r text-center">Skor {'>'} 87 - 92</TableCell>
              </TableRow>
              <TableRow className="text-white bg-red-800">
                <TableCell className="border-r border-l font-medium">C</TableCell>
                <TableCell className="border-r text-center">Skor {'>'} 82 - 87  </TableCell>
              </TableRow>
              <TableRow className="text-white bg-black">
                <TableCell className="border-r border-l font-medium">D</TableCell>
                <TableCell className="border-r text-center">Skor {'<'} 82</TableCell>
              </TableRow>

            </TableBody>
          </Table>


        </div>



      </div>
    </>

  )
}

