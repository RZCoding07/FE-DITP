"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ParameterRow {
  fase: string
  umur: number
  kerapatanPokok: {
    skor100: string
    skor90: string
    skor80: string
  }
  lingkarBatang: {
    skor100: string
    skor90: string
    skor80: string
  }
  jumlahPelepah: {
    skor100: string | number
    skor90: string | number
    skor80: string | number
  },
  tinggiTanaman: {
    skor100: string | number
    skor90: string | number
    skor80: string | number
  }
}

const data: ParameterRow[] = [
  // TBM I
  {
    fase: "TBM I",
    umur: 1,
    kerapatanPokok: {
      skor100: "140 - 143",
      skor90: "130 - 139",
      skor80: "< 130",
    },
    lingkarBatang: {
      skor100: "> = 51",
      skor90: "46 - 50",
      skor80: "< 46",
    },
    jumlahPelepah: {
      skor100: 19,
      skor90: 18,
      skor80: 17,
    },
    tinggiTanaman: {
      skor100: 19,
      skor90: 18,
      skor80: 17,
    },

  },
  // Add more data rows here...
]

export default function PalmOilTable() {
  return (
    <div className="grid grid-cols-2">
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
              % Tegakan Pokok Awal
            </TableHead>
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
            <TableHead className="border-r bg-[#2B5329]">Skor 100</TableHead>
            <TableHead className="border-r bg-[#2B5329]">Skor 90</TableHead>
            <TableHead className="bg-[#2B5329]">Skor 80</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[9px] text-center">
          {data.map((row, index) => (
            <TableRow key={`${row.fase}-${row.umur}`} className={index % 2 === 0 ? "bg-transparent" : "bg-gray-50"}>
              <TableCell className="border-r font-medium">{row.fase}</TableCell>
              <TableCell className="border-r text-center">{row.umur}</TableCell>
              <TableCell className="border-r text-center">{row.kerapatanPokok.skor100}</TableCell>
              <TableCell className="border-r text-center">{row.kerapatanPokok.skor90}</TableCell>
              <TableCell className="border-r text-center">{row.kerapatanPokok.skor80}</TableCell>
              <TableCell className="border-r text-center">{row.lingkarBatang.skor100}</TableCell>
              <TableCell className="border-r text-center">{row.lingkarBatang.skor90}</TableCell>
              <TableCell className="border-r text-center">{row.lingkarBatang.skor80}</TableCell>
              <TableCell className="border-r text-center">{row.jumlahPelepah.skor100}</TableCell>
              <TableCell className="border-r text-center">{row.jumlahPelepah.skor90}</TableCell>
              <TableCell className="text-center">{row.jumlahPelepah.skor80}</TableCell>
              <TableCell className="border-r text-center">{row.tinggiTanaman.skor100}</TableCell>
              <TableCell className="border-r text-center">{row.tinggiTanaman.skor90}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    </div>
  )
}

