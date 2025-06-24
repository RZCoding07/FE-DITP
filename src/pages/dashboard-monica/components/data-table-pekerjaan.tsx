"use client"

import { DataTable } from "./data-table"

interface DataTablePekerjaanProps {
  sub_investasi: string
  data: any[]
  columns: any[]
}

export function DataTablePekerjaan({ sub_investasi, data, columns }: DataTablePekerjaanProps) {
  console.log("DataTablePekerjaan data:", data);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Pekerjaan: {sub_investasi}</h3>
        <div className="text-sm text-muted-foreground">Total: {data.length} pekerjaan</div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
