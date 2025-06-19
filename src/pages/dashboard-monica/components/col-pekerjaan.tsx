"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nama_pekerjaan",
    header: "Nama Pekerjaan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const getStatusColor = (status: string) => {
        if (status?.includes("Progress")) return "default"
        if (status?.includes("Selesai")) return "secondary"
        return "outline"
      }
      return <Badge variant={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "progress",
    header: "Progress (%)",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "regional",
    header: "Regional",
  },
]
