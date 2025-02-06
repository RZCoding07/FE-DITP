import React, { useEffect, useRef } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { data } from "@/data/tbm-param";

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


  const latexExpression = '\\text{Bobot Nilai Kerapatan Pokok} = \\left( \\frac{\\text{Jumlah Pokok Akhir}}{\\text{Jumlah Pokok Awal}} \\times 100\\right) \\times  30\\%';
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-md borders">
        <Table>
          <TableHeader className="bg-[#2B5329] text-[9px] text-center">
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
          <TableBody className="text-[9px] text-center">
            {data.map((row, index) => (
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
      <div>
        <h2>Perumusan Perhitungan Pengukuran Vegetatif</h2>
        <p className="text-xs my-2">Perumusan perhitungan pengukuran vegetatif pada tanaman kelapa sawit dilakukan dengan menggunakan metode skor. Skor ini diperoleh dari pengukuran langsung pada lapangan. Berikut adalah rumus perhitungan skor pada parameter vegetatif tanaman kelapa sawit:</p>
        <h3 className="my-2 text-sm">1. Kerapatan Pokok</h3>
        <MathRenderer expression={latexExpression}
        />
        <h3 className="my-2 text-sm">2. Lingkar Batang</h3>
        <p className="text-xs my-2">
          Skor Lingkar Batang = Total Skor x 40%
        </p>
        <h3 className="my-2 text-sm">3. Jumlah Pelepah</h3>
        <p className="text-xs my-2">Bobot Nilai Jumlah Pelepah = Total Skor x 20%
        </p>
        <h3 className="my-2 text-sm">4. Tinggi Tanaman</h3>
        <p className="text-xs my-2">Bobot Nilai Tinggi Tanaman = Total Skor x 10%
        </p>
        <hr className="border my-3" />
        <h2>Kelas Blok</h2>
        <p className="text-xs my-2">
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
              <TableCell className="border-r text-center">Skor 97 - 100</TableCell>
            </TableRow>
            <TableRow className="text-white bg-green-700">
              <TableCell className="border-r border-l font-medium">B</TableCell>
              <TableCell className="border-r text-center">Skor 90 - 96</TableCell>
            </TableRow>
            <TableRow className="text-white bg-red-800">
              <TableCell className="border-r border-l font-medium">C</TableCell>
              <TableCell className="border-r text-center">Skor 80 - 89</TableCell>
            </TableRow>
            <TableRow className="text-white bg-black">
              <TableCell className="border-r border-l font-medium">D</TableCell>
              <TableCell className="border-r text-center">Skor {'<'} 80</TableCell>
            </TableRow>

          </TableBody>
        </Table>


      </div>



    </div>
  )
}

