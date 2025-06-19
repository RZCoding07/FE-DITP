"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "sub_investasi",
    header: "Sub Investasi",
  },
  {
    accessorKey: "hps",
    header: "HPS",
    cell: ({ row }) => {
      const value = row.getValue("hps") as number
      return <Badge variant="outline">{value.toLocaleString()}</Badge>
    },
  },
  {
    accessorKey: "total_tekpol",
    header: "Total Tekpol",
    cell: ({ row }) => {
      const value = row.getValue("total_tekpol") as number
      return <Badge variant="secondary">{value.toLocaleString()}</Badge>
    },
  },
  {
    accessorKey: "pengadaan",
    header: "Pengadaan",
    cell: ({ row }) => {
      const value = row.getValue("pengadaan") as number
      return <Badge variant="default">{value.toLocaleString()}</Badge>
    },
  },
  {
    accessorKey: "sppbj",
    header: "SPPBJ",
    cell: ({ row }) => {
      const value = row.getValue("sppbj") as number
      return <Badge variant="destructive">{value.toLocaleString()}</Badge>
    },
  },
]
