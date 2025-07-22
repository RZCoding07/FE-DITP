"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<any>[] = [
    {
    accessorKey: "24",
    header: "Regional",
  },
  {
    accessorKey: "0",
    header: "Kode Investasi SINUSA",
  },
  {
    accessorKey: "1",
    header: "Rekening Besar",
  },
  {
    accessorKey: "2",
    header: "Komoditas",
  },
  {
    accessorKey: "3",
    header: "Unit Kerja / Lokasi",
  },
  {
    accessorKey: "5",
    header: "Nama Investasi SINUSA",
  },
  {
    accessorKey: "9",
    header: "Nilai Anggaran (Rp)",
    cell: ({ row }) => {
      const value = row.getValue("9") as string;
      return 'Rp.' + value
    }
  },
  {
    accessorKey: "13",
    header: "Nama Paket Pekerjaan",
  },
  {
    accessorKey: "14",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("14") as string
      const getStatusColor = (status: string) => {
        if (status?.includes("Progress")) return "default"
        if (status?.includes("Selesai")) return "secondary"
        if (status?.includes("Pengadaan")) return "destructive"
        return "outline"
      }
      return <Badge variant={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "19",
    header: "Progress Fisik (%)",
    cell: ({ row }) => {
      const progress = Number(row.getValue("19")) || 0
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                progress < 40 ? 'bg-red-500' :
                progress < 70 ? 'bg-yellow-500' :
                progress < 100 ? 'bg-blue-500' :
                'bg-green-500'
              }`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "23",
    header: "Nilai Kontrak (Rp)",
    cell: ({ row }) => {
      const value = row.getValue("23") as string;
      return 'Rp.' + value
    }
  }
]