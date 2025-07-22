"use client"
import React, { useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import katex from "katex"
import "katex/dist/katex.min.css"
import { dataOne, dataTwo, dataThree, dataFour, dataFive } from "@/data/tbm-params"
import { dataNewOne, dataNewTwo, dataNewThree, dataNewFour, dataNewFive } from "@/data/tbm-params"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PalmOilTable() {
  interface MathRendererProps {
    expression: string
  }

  const MathRenderer: React.FC<MathRendererProps> = ({ expression }) => {
    const mathContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (mathContainerRef.current) {
        katex.render(expression, mathContainerRef.current, {
          throwOnError: false,
        })
      }
    }, [expression])

    return <div style={{ fontSize: "11px" }} ref={mathContainerRef}></div>
  }

  const [varietas, setVarietas] = React.useState<string>("DP Yangambi")
  const [bulan, setBulan] = React.useState<string>("4")

  const options = [
    // dataOne / dataNewOne
    { value: "DP Yangambi", label: "DP Yangambi" },
    { value: "DP PPKS 718", label: "DP PPKS 718" },
    { value: "DP 239", label: "DP 239" },
    // dataTwo / dataNewTwo
    { value: "DP Langkat", label: "DP Langkat" },
    // dataThree / dataNewThree
    { value: "DP Simalungun", label: "DP Simalungun" },
    { value: "DP Avros", label: "DP Avros" },
    { value: "DP 540", label: "DP 540" },
    { value: "Lonsum", label: "Lonsum" },
    { value: "Dami Mas", label: "Dami Mas" },
    { value: "Bina Sawit Makmur", label: "Bina Sawit Makmur" },
    { value: "Sarana Inti Pratama", label: "Sarana Inti Pratama" },
    { value: "Panca Surya Garden", label: "Panca Surya Garden" },
    // dataFour / dataNewFour
    { value: "SF Lame", label: "SF Lame" },
    { value: "SF MTG", label: "SF MTG" },
    { value: "Bakrie", label: "Bakrie" },
    { value: "Topaz", label: "Topaz" },
    { value: "Sriwijaya Sampoerna", label: "Sriwijaya Sampoerna" },
    { value: "Verdant", label: "Verdant" },
    // dataFive / dataNewFive
    { value: "SF Yangambi", label: "SF Yangambi" },
  ]

  const bulanOptions = [
    { value: "4", label: "Bulan 4" },
    { value: "8", label: "Bulan 8" },
    { value: "12", label: "Bulan 12" },
  ]

  const [dataRules, setDataRules] = React.useState<any[]>([])

  useEffect(() => {
    if (bulan === "4") {
      setDataRules(dataOne)
    } else {
      setDataRules(dataNewOne)
    }
  }, [bulan])

  const handleVarietasChange = (varietas: string) => {
    setVarietas(varietas)
    
    if (bulan === "4") {
      // Use original data structure for month 4
      if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
        setDataRules(dataOne)
      } else if (varietas === "DP Langkat") {
        setDataRules(dataTwo)
      } else if (
        varietas === "DP Simalungun" ||
        varietas === "DP Avros" ||
        varietas === "DP 540" ||
        varietas === "Lonsum" ||
        varietas === "Dami Mas" ||
        varietas === "Bina Sawit Makmur" ||
        varietas === "Sarana Inti Pratama" ||
        varietas === "Panca Surya Garden"
      ) {
        setDataRules(dataThree)
      } else if (
        varietas === "SF Lame" ||
        varietas === "SF MTG" ||
        varietas === "SF Yangambi" ||
        varietas === "Bakrie" ||
        varietas === "Topaz" ||
        varietas === "Sriwijaya Sampoerna" ||
        varietas === "Verdant"
      ) {
        setDataRules(dataFour)
      } else if (varietas === "DP 239") {
        setDataRules(dataFive)
      }
    } else {
      // Use new data structure for months 8 and 12
      if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
        setDataRules(dataNewOne)
      } else if (varietas === "DP Langkat") {
        setDataRules(dataNewTwo)
      } else if (
        varietas === "DP Simalungun" ||
        varietas === "DP Avros" ||
        varietas === "DP 540" ||
        varietas === "Lonsum" ||
        varietas === "Dami Mas" ||
        varietas === "Bina Sawit Makmur" ||
        varietas === "Sarana Inti Pratama" ||
        varietas === "Panca Surya Garden"
      ) {
        setDataRules(dataNewThree)
      } else if (
        varietas === "SF Lame" ||
        varietas === "SF MTG" ||
        varietas === "SF Yangambi" ||
        varietas === "Bakrie" ||
        varietas === "Topaz" ||
        varietas === "Sriwijaya Sampoerna" ||
        varietas === "Verdant"
      ) {
        setDataRules(dataNewFour)
      } else if (varietas === "DP 239") {
        setDataRules(dataNewFive)
      }
    }
  }

  const handleBulanChange = (selectedBulan: string) => {
    setBulan(selectedBulan)
    
    // Update data rules based on new month selection
    if (selectedBulan === "4") {
      // Use original data structure
      if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
        setDataRules(dataOne)
      } else if (varietas === "DP Langkat") {
        setDataRules(dataTwo)
      } else if (
        varietas === "DP Simalungun" ||
        varietas === "DP Avros" ||
        varietas === "DP 540" ||
        varietas === "Lonsum" ||
        varietas === "Dami Mas" ||
        varietas === "Bina Sawit Makmur" ||
        varietas === "Sarana Inti Pratama" ||
        varietas === "Panca Surya Garden"
      ) {
        setDataRules(dataThree)
      } else if (
        varietas === "SF Lame" ||
        varietas === "SF MTG" ||
        varietas === "SF Yangambi" ||
        varietas === "Bakrie" ||
        varietas === "Topaz" ||
        varietas === "Sriwijaya Sampoerna" ||
        varietas === "Verdant"
      ) {
        setDataRules(dataFour)
      } else if (varietas === "DP 239") {
        setDataRules(dataFive)
      }
    } else {
      // Use new data structure for months 8 and 12
      if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
        setDataRules(dataNewOne)
      } else if (varietas === "DP Langkat") {
        setDataRules(dataNewTwo)
      } else if (
        varietas === "DP Simalungun" ||
        varietas === "DP Avros" ||
        varietas === "DP 540" ||
        varietas === "Lonsum" ||
        varietas === "Dami Mas" ||
        varietas === "Bina Sawit Makmur" ||
        varietas === "Sarana Inti Pratama" ||
        varietas === "Panca Surya Garden"
      ) {
        setDataRules(dataNewThree)
      } else if (
        varietas === "SF Lame" ||
        varietas === "SF MTG" ||
        varietas === "SF Yangambi" ||
        varietas === "Bakrie" ||
        varietas === "Topaz" ||
        varietas === "Sriwijaya Sampoerna" ||
        varietas === "Verdant"
      ) {
        setDataRules(dataNewFour)
      } else if (varietas === "DP 239") {
        setDataRules(dataNewFive)
      }
    }
  }

  const renderTableHeaders = () => {
    if (bulan === "4") {
      return (
        <>
          <TableRow>
            <TableHead rowSpan={2} className="text-white border-r text-center">
              Fase
            </TableHead>
            <TableHead rowSpan={2} className="text-white border-r">
              Umur
            </TableHead>
            <TableHead colSpan={9} className="text-center text-white border-b">
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
        </>
      )
    } else {
      return (
        <>
          <TableRow>
            <TableHead rowSpan={2} className="text-white border-r text-center">
              Fase
            </TableHead>
            <TableHead rowSpan={2} className="text-white border-r">
              Umur
            </TableHead>
            <TableHead colSpan={8} className="text-center text-white border-b">
              Parameter
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center text-white border-r bg-[#3B7137]">
              Lingkar Batang
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137] border-r">
              Jumlah Pelepah
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137] border-r">
              Tinggi Tanaman
            </TableHead>
            <TableHead className="text-center text-white border-r bg-[#3B7137]">
              Lebar Petiola
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137] border-r">
              Tebal Petiola
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137] border-r">
              Jumlah Anak Daun 1 Sisi
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137] border-r">
              Panjang Anak Daun
            </TableHead>
            <TableHead className="text-center text-white bg-[#3B7137]">
              Lebar Anak Daun
            </TableHead>
          </TableRow>
        </>
      )
    }
  }

  const renderTableRows = () => {
    if (bulan === "4") {
      return dataRules.map((row, index) => (
        <TableRow
          key={`${row.fase}-${row.umur}`}
          className={index % 2 === 0 ? "bg-transparent" : "bg-gray-100 dark:bg-slate-900"}
        >
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
      ))
    } else {
      return dataRules.map((row, index) => (
        <TableRow
          key={`${row.fase}-${row.umur}`}
          className={index % 2 === 0 ? "bg-transparent" : "bg-gray-100 dark:bg-slate-900"}
        >
          <TableCell className="border-r border-l font-medium">{row.fase}</TableCell>
          <TableCell className="border-r text-center">{row.umur}</TableCell>
          <TableCell className="border-r text-center">{row.lingkarBatang}</TableCell>
          <TableCell className="border-r text-center">{row.jumlahPelepah}</TableCell>
          <TableCell className="border-r text-center">{row.tinggiTanaman}</TableCell>
          <TableCell className="border-r text-center">{row.lebarPetiola || ""}</TableCell>
          <TableCell className="border-r text-center">{row.tebalPetiola || ""}</TableCell>
          <TableCell className="border-r text-center">{row.jumlahAnakDaun || ""}</TableCell>
          <TableCell className="border-r text-center">{row.panjangAnakDaun || ""}</TableCell>
          <TableCell className="border-r text-center">{row.lebarAnakDaun || ""}</TableCell>
        </TableRow>
      ))
    }
  }

  let latex = ""
  if (bulan === "4") {
    latex = "\\text{Bobot Nilai Kerapatan Pokok} = \\left( \\frac{\\text{Jumlah Pokok Akhir}}{\\text{Jumlah Pokok Awal}} \\times 100\\right) \\times  30\\%"
  } else {
    latex = "\\text{Bobot Nilai Kerapatan Pokok} = \\left( \\frac{\\text{Jumlah Pokok Akhir}}{\\text{Jumlah Pokok Awal}} \\times 100\\right) \\times  15\\%"
  }

  return (
    <>
      <div className="flex flex-col w-full mb-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-semibold">
            Varietas {varietas} - {bulanOptions.find((b) => b.value === bulan)?.label}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="bulan" className="text-sm font-medium">
                Pilih Bulan:
              </label>
              <Select defaultValue={bulanOptions[0].value} onValueChange={handleBulanChange}>
                <SelectTrigger className="w-[120px]" id="bulan">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {bulanOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="varietas" className="text-sm font-medium">
                Pilih Varietas:
              </label>
              <Select defaultValue={options[0].value} onValueChange={handleVarietasChange}>
                <SelectTrigger className="w-[180px]" id="varietas">
                  <SelectValue placeholder="Pilih Varietas" />
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
      </div>
      <div className={bulan === "4" ? `grid grid-cols-[60%_40%] gap-4` : "grid grid-cols-1 gap-4"}>
        <div className="rounded-md borders">
          <Table>
            <TableHeader className="bg-[#2B5329] text-[14px] text-center">{renderTableHeaders()}</TableHeader>
            <TableBody className="text-[13px] text-center">{renderTableRows()}</TableBody>
          </Table>
        </div>
        <div className={bulan === "4" ? "flex-col" : "grid grid-cols-2"}>
          <div>
            <h2>Perumusan Perhitungan Pengukuran Vegetatif</h2>
            <p className="text-[13px] my-2">
              {bulan === "4" 
                ? "Perumusan perhitungan pengukuran vegetatif pada tanaman kelapa sawit dilakukan dengan menggunakan metode skor. Skor ini diperoleh dari pengukuran langsung pada lapangan. Berikut adalah rumus perhitungan skor pada parameter vegetatif tanaman kelapa sawit:"
                : "Perumusan perhitungan pengukuran vegetatif pada tanaman kelapa sawit dilakukan dengan menggunakan metode nilai parameter dibagi nilai standar dikalikan bobot. Berikut adalah rumus perhitungan pada parameter vegetatif tanaman kelapa sawit:"
              }
            </p>
            {bulan === "4" ? (
              <>
                <h3 className="my-2 text-[13px]">1. Kerapatan Pokok</h3>
                <MathRenderer expression={latex} />
                <h3 className="my-2 text-[13px]">2. Lingkar Batang</h3>
                <p className="text-[13px] my-2">Skor Lingkar Batang = Total Skor x 40%</p>
                <h3 className="my-2 text-[13px]">3. Jumlah Pelepah</h3>
                <p className="text-[13px] my-2">Bobot Nilai Jumlah Pelepah = Total Skor x 20%</p>
                <h3 className="my-2 text-[13px]">4. Tinggi Tanaman</h3>
                <p className="text-[13px] my-2">Bobot Nilai Tinggi Tanaman = Total Skor x 10%</p>
              </>
            ) : (
              <>
                <h3 className="my-2 text-[13px]">1. Kerapatan Pokok</h3>
                <MathRenderer expression={latex} />
                <h3 className="my-2 text-[13px]">2. Lingkar Batang</h3>
                <p className="text-[13px] my-2">Bobot Nilai Lingkar Batang = (Nilai Pengukuran / Nilai Parameter) × 25%</p>
                <h3 className="my-2 text-[13px]">3. Jumlah Pelepah</h3>
                <p className="text-[13px] my-2">Bobot Nilai Jumlah Pelepah = (Nilai Pengukuran / Nilai Parameter) × 15%</p>
                <h3 className="my-2 text-[13px]">4. Tinggi Tanaman</h3>
                <p className="text-[13px] my-2">Bobot Nilai Tinggi Tanaman = (Nilai Pengukuran / Nilai Parameter) × 10%</p>
                <h3 className="my-2 text-[13px]">5. Panjang Rachis</h3>
                <p className="text-[13px] my-2">Bobot Nilai Panjang Rachis = (Nilai Pengukuran / Nilai Parameter) × 5%</p>
                <h3 className="my-2 text-[13px]">6. Lebar Petiola</h3>
                <p className="text-[13px] my-2">Bobot Nilai Lebar Petiola = (Nilai Pengukuran / Nilai Parameter) × 5%</p>
                <h3 className="my-2 text-[13px]">7. Tebal Petiola</h3>
                <p className="text-[13px] my-2">Bobot Nilai Tebal Petiola = (Nilai Pengukuran / Nilai Parameter) × 5%</p>
                <h3 className="my-2 text-[13px]">8. Jumlah Anak Daun</h3>
                <p className="text-[13px] my-2">Bobot Nilai Jumlah Anak Daun = (Nilai Pengukuran / Nilai Parameter) × 10%</p>
                <h3 className="my-2 text-[13px]">9. Panjang Anak Daun</h3>
                <p className="text-[13px] my-2">Bobot Nilai Panjang Anak Daun = (Nilai Pengukuran / Nilai Parameter) × 5%</p>
                <h3 className="my-2 text-[13px]">10. Lebar Anak Daun</h3>
                <p className="text-[13px] my-2">Bobot Nilai Lebar Anak Daun = (Nilai Pengukuran / Nilai Parameter) × 5%</p>
              </>
            )}
          </div>
          <div>
            <hr className="border my-3" />
            <h2>Kelas Blok</h2>
            <p className="text-[13px] my-2">
              Kelas blok merupakan hasil dari perhitungan skor vegetatif yang telah dilakukan. Berikut adalah kriteria
              kelas blok berdasarkan skor vegetatif:
            </p>
            <Table>
              <TableHeader className="bg-[#2B5329] text-[9px] text-center">
                <TableRow>
                  <TableHead className="text-white border-r text-center">Skor</TableHead>
                  <TableHead className="text-white border-r text-center">Kriteria</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[9px] text-center">
                <TableRow className="text-white bg-yellow-500">
                  <TableCell className="border-r border-l font-medium">A</TableCell>
                  <TableCell className="border-r text-center">Skor {">"} 92 - 100</TableCell>
                </TableRow>
                <TableRow className="text-white bg-green-700">
                  <TableCell className="border-r border-l font-medium">B</TableCell>
                  <TableCell className="border-r text-center">Skor {">"} 87 - 92</TableCell>
                </TableRow>
                <TableRow className="text-white bg-red-800">
                  <TableCell className="border-r border-l font-medium">C</TableCell>
                  <TableCell className="border-r text-center">Skor {">"} 82 - 87</TableCell>
                </TableRow>
                <TableRow className="text-white bg-black">
                  <TableCell className="border-r border-l font-medium">D</TableCell>
                  <TableCell className="border-r text-center">Skor {"<"} 82</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
