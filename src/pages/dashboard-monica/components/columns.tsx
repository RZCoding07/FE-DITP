import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface InvestmentData {
  rpc_code: string
  rekening_besar: string
  komoditi: string
  unit_kerja_lokasi: string
  program_kerja_impact: string
  nama_investasi: string
  status_anggaran: string
  jumlah_total_fisik: string
  satuan_fisik: string
  nilai_anggaran_rkap: string
  status_pelaksanaan: string
  stasiun_pabrik: string
  nomor_paket_pekerjaan: string
  real_penamaan_paket: string
  status_paket_pekerjaan: string
  nilai_kontrak: string
  nomor_kontrak: string
  tanggal_mulai: string
  tanggal_berakhir: string
  progress_fisik: string
  skala_prioritas: string
  keterangan_1: string
  keterangan_2: string
  nilai: string
  reg: string
  kurva_s: string
}

const formatRupiah = (value: string | number) => {
  if (!value || value === "") return "Rp. 0"
  const numericValue = typeof value === "number" ? value : Number.parseFloat(value.toString().replace(/[^\d.-]/g, ""))
  if (isNaN(numericValue)) return "Rp. 0"
  return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
}

const getPriorityBadge = (priority: string) => {
  const priorityLower = priority.toLowerCase()
  if (priorityLower === "high") {
    return <Badge variant="destructive">HIGH</Badge>
  } else if (priorityLower === "medium") {
    return <Badge variant="secondary">MEDIUM</Badge>
  } else if (priorityLower === "low") {
    return <Badge variant="outline">LOW</Badge>
  }
  return <Badge variant="outline">{priority}</Badge>
}

export const columns: ColumnDef<InvestmentData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "number",
    header: "No.",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rpc_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="KD Sinusa" />,
    cell: ({ row }) => <div className="font-mono text-sm">{(row.getValue("rpc_code") as string).toUpperCase()}</div>,
  },
  {
    accessorKey: "rekening_besar",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rekening Besar" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("rekening_besar")}</div>,
  },
  {
    accessorKey: "komoditi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Komoditi" />,
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("komoditi")}</div>,
  },
  {
    accessorKey: "unit_kerja_lokasi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Kerja / Lokasi" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("unit_kerja_lokasi")}</div>,
  },
  {
    accessorKey: "program_kerja_impact",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Program Kerja / Impact" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("program_kerja_impact")}</div>,
  },
  {
    accessorKey: "nama_investasi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Investasi" />,
    cell: ({ row }) => <div className="max-w-[250px] truncate font-medium">{row.getValue("nama_investasi")}</div>,
  },
  {
    accessorKey: "status_anggaran",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status Anggaran" />,
    cell: ({ row }) => {
      const status = row.getValue("status_anggaran") as string
      return <Badge variant={status === "Murni 2025" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    accessorKey: "nilai_anggaran_rkap",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nilai Anggaran RKAP" />,
    cell: ({ row }) => <div className="text-right font-mono">Rp.{row.getValue("nilai_anggaran_rkap") }</div>,
  },
  {
    accessorKey: "stasiun_pabrik",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stasiun Pabrik" />,
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("stasiun_pabrik")}</div>,
  },
  {
    accessorKey: "nomor_paket_pekerjaan",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nomor Paket Pekerjaan" />,
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("nomor_paket_pekerjaan")}</div>,
  },
  {
    accessorKey: "status_paket_pekerjaan",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status Paket" />,
    cell: ({ row }) => {
      const status = row.getValue("status_paket_pekerjaan") as string
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

      if (status === "Selesai") variant = "default"
      else if (status === "Dalam Proses") variant = "secondary"
      else if (status === "Belum Diajukan") variant = "destructive"

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "nilai_kontrak",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nilai Kontrak" />,
    cell: ({ row }) => <div className="text-right font-mono">Rp.{row.getValue("nilai_kontrak")}</div>,
  },
  {
    accessorKey: "progress_fisik",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Progress Fisik (%)" />,
    cell: ({ row }) => {
      const progress = row.getValue("progress_fisik") as string
      const progressNum = Number.parseFloat(progress) || 0
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressNum, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">{progressNum}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "skala_prioritas",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prioritas" />,
    cell: ({ row }) => getPriorityBadge(row.getValue("skala_prioritas")),
  },
  {
    accessorKey: "tanggal_mulai",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Mulai" />,
    cell: ({ row }) => <div className="text-sm">{row.getValue("tanggal_mulai") || "-"}</div>,
  },
  {
    accessorKey: "tanggal_berakhir",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Berakhir" />,
    cell: ({ row }) => <div className="text-sm">{row.getValue("tanggal_berakhir") || "-"}</div>,
  },
  {
    accessorKey: "reg",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reg" />,
    cell: ({ row }) => <div className="text-sm">{row.getValue("reg")}</div>,
  },

]
