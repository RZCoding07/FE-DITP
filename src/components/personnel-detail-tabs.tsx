"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Download, ArrowUpDown } from "lucide-react"

interface PersonnelData {
  sap: string
  name: string
  region: string
  personnel_subarea: string
  desc_personnel_subarea: string
  afd_code: string | null
  desc_job: string
  headerkertaskerja: any[]
}

interface PersonnelDetailTabsProps {
  selectedData: any
  personnelData: PersonnelData[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortConfig: any
  handleSort: (key: string) => void
  getFilteredAndSortedData: (items: any[]) => any[]
  exportToExcel: (data: any[], filename: string) => void
}

const PersonnelDetailTabs: React.FC<PersonnelDetailTabsProps> = ({
  selectedData,
  personnelData,
  searchTerm,
  setSearchTerm,
  sortConfig,
  handleSort,
  getFilteredAndSortedData,
  exportToExcel,
}) => {
  // Filter personnel berdasarkan selected data
  const relevantPersonnel = personnelData.filter((person) => {
    const regionalMatch = person.region === selectedData?.regional
    const unitMatch = person.personnel_subarea === selectedData?.kode_unit
    const afdelingMatch =
      !selectedData?.afdeling || selectedData?.afdeling === "NO_AFD" || person.afd_code === selectedData?.afdeling

    return regionalMatch && unitMatch && afdelingMatch
  })

  const personnelSudahMonev = relevantPersonnel.filter((p) => p.headerkertaskerja.length > 0)
  const personnelBelumMonev = relevantPersonnel.filter((p) => p.headerkertaskerja.length === 0)

  // Original blok data
  const sudahMonevData = selectedData?.items?.filter((item: any) => item.status_monev === "Sudah") || []
  const belumMonevData = selectedData?.items?.filter((item: any) => item.status_monev === "Belum") || []

  return (
    <Tabs defaultValue="blok-sudah" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-slate-800">
        <TabsTrigger value="blok-sudah" className="data-[state=active]:bg-slate-700">
          Blok Sudah ({sudahMonevData.length})
        </TabsTrigger>
        <TabsTrigger value="blok-belum" className="data-[state=active]:bg-slate-700">
          Blok Belum ({belumMonevData.length})
        </TabsTrigger>
        <TabsTrigger value="personnel-aktif" className="data-[state=active]:bg-slate-700">
          Personnel Aktif ({personnelSudahMonev.length})
        </TabsTrigger>
        <TabsTrigger value="personnel-belum" className="data-[state=active]:bg-slate-700">
          Personnel Belum ({personnelBelumMonev.length})
        </TabsTrigger>
      </TabsList>

      {/* Search and Export */}
      <div className="flex items-center gap-4 my-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <Button
          onClick={() =>
            exportToExcel(
              [...sudahMonevData, ...belumMonevData, ...relevantPersonnel],
              `integrated-monev-${selectedData?.kode_unit}-${selectedData?.afdeling}`,
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Blok Sudah Monev */}
      <TabsContent value="blok-sudah" className="mt-4">
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead
                  className="text-slate-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort("blok")}
                >
                  <div className="flex items-center gap-2">
                    Blok
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Jumlah Monev</TableHead>
                <TableHead className="text-slate-300">Terakhir Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredAndSortedData(sudahMonevData).map((item: any, index: number) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white">{item.blok}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">{item.status_monev}</span>
                  </TableCell>
                  <TableCell className="text-white">{item.list_monev.length}</TableCell>
                  <TableCell className="text-slate-300">
                    {item.list_monev.length > 0
                      ? new Date(item.list_monev[item.list_monev.length - 1].created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Blok Belum Monev */}
      <TabsContent value="blok-belum" className="mt-4">
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead
                  className="text-slate-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort("blok")}
                >
                  <div className="flex items-center gap-2">
                    Blok
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Afdeling</TableHead>
                <TableHead className="text-slate-300">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredAndSortedData(belumMonevData).map((item: any, index: number) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white">{item.blok}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs">{item.status_monev}</span>
                  </TableCell>
                  <TableCell className="text-white">{item.afdeling}</TableCell>
                  <TableCell className="text-slate-300">{item.nama_unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Personnel Aktif */}
      <TabsContent value="personnel-aktif" className="mt-4">
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">SAP</TableHead>
                <TableHead
                  className="text-slate-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Nama
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Jabatan</TableHead>
                <TableHead className="text-slate-300">Afdeling</TableHead>
                <TableHead className="text-slate-300">Jumlah Monev</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnelSudahMonev.map((person, index) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white">{person.sap}</TableCell>
                  <TableCell className="text-white">{person.name}</TableCell>
                  <TableCell className="text-slate-300">{person.desc_job}</TableCell>
                  <TableCell className="text-slate-300">{person.afd_code || "Kantor Tanaman"}</TableCell>
                  <TableCell className="text-green-400">{person.headerkertaskerja.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Personnel Belum */}
      <TabsContent value="personnel-belum" className="mt-4">
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">SAP</TableHead>
                <TableHead
                  className="text-slate-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Nama
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Jabatan</TableHead>
                <TableHead className="text-slate-300">Afdeling</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnelBelumMonev.map((person, index) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white">{person.sap}</TableCell>
                  <TableCell className="text-white">{person.name}</TableCell>
                  <TableCell className="text-slate-300">{person.desc_job}</TableCell>
                  <TableCell className="text-slate-300">{person.afd_code || "Kantor Tanaman"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs">Belum Aktif</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default PersonnelDetailTabs
