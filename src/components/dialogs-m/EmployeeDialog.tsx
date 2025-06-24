"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { JobPositionData } from "@/types/api"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface EmployeeDialogProps {
  data: JobPositionData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmployeeClick?: (employee: { nik_sap: string; nama: string }) => void
}

export function EmployeeDialog({ data, open, onOpenChange, onEmployeeClick }: EmployeeDialogProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  }, [data])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Pilih Nama Pegawai</DialogTitle>
          <DialogDescription>Silahkan pilih nama pegawai yang sesuai dengan posisi jabatan ini.</DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>
            {loading ? "Memuat data pegawai..." : `Ditemukan ${data?.karyawans.length} pegawai`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NIK SAP</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">No. Telp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[250px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : data?.karyawans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Tidak ada data pegawai yang tersedia.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data?.karyawans.map((employee, index) => (
                  <TableRow
                    key={`${employee.nik_sap}-${index}`}
                    className="border-slate-700 hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => onEmployeeClick?.({ nik_sap: employee.nik_sap, nama: employee.nama })}
                  >
                    <TableCell className="font-medium">{employee.nik_sap}</TableCell>
                    <TableCell>{employee.nama}</TableCell>
                    <TableCell>{employee.jabatan}</TableCell>
                    <TableCell className="text-right">{employee.kode_blok}</TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
