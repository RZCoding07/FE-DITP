import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface InvesAwal {
  regionalEdit: string
  kode: string
  tahun: string
  unit: string
  parent: string
  rekeningBesar: string
  kuadran: string
  rekeningKecil: string
  onFarmOffFarm: string
  item: string
  komoditas: string
  kategoriBisnisInvestasi: string
  sumberPendanaan: string
  jenisInvestasi: string
  namaInvestasi: string
  programStrategisNasional: string
  carryOver: string
  watchlistNonWatchlist: string
  tanggalAwalInvestasi: string
  tanggalAkhirInvestasi: string
  periodeInvestasi: string
  jumlahTahun: string
  jumlahTotalFisikInvestasi: string
  satuan: string
  nilaiProyekTahunSebelumnya: string
  nilaiProyekTahunBerjalan: string
  jumlahFisikTahunBerjalan: string
  nilaiProyekT1: string
  nilaiProyekT2: string
  nilaiProyekT3: string
  nilaiProyekT4: string
  nilaiProyekT5: string
  nilaiProyekGreaterT5: string
  totalNilaiProyekInvestasi: string
  hargaSatuan: string
  strategisNonStrategis: string
  irr: string
  npv: string
  paybackPeriod: string
  profitabilityIndex: string
  tujuanPengajuanInvestasi: string
  kodeWbsSap: string
  costCenterSap: string
  luasArealTanam: string
  jarakTanam: string
  tanamanKonversiEks: string
  namaKlonVarietas: string
  tahunTanam: string
  usiaTanaman: string
  populasiTanamanPelindung: string
  stasiunPabrik: string
  statusUsulan: string
  regional: string
  divisiTeknisSubHolding: string
  divisiTeknisHolding: string
  user_id: string
}

const formatRupiah = (value: number) => {
  if (!value) return 'Rp. 0' // Jika nilai kosong atau null
  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
  return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export const columns: ColumnDef<InvesAwal>[] = [
  {
    accessorKey: 'regionalEdit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Regional Edit' />
    ),
    cell: ({ row }) => <span>{row.getValue('regionalEdit')}</span>,
  },
  {
    accessorKey: 'kode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('kode')}</span>,
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun')}</span>,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit' />
    ),
    cell: ({ row }) => <span>{row.getValue('unit')}</span>,
  },
  {
    accessorKey: 'parent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent' />
    ),
    cell: ({ row }) => <span>{row.getValue('parent')}</span>,
  },
  {
    accessorKey: 'rekeningBesar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rekening Besar' />
    ),
    cell: ({ row }) => <span>{row.getValue('rekeningBesar')}</span>,
  },
  {
    accessorKey: 'kuadran',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kuadran' />
    ),
    cell: ({ row }) => <span>{row.getValue('kuadran')}</span>,
  },
  {
    accessorKey: 'rekeningKecil',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rekening Kecil' />
    ),
    cell: ({ row }) => <span>{row.getValue('rekeningKecil')}</span>,
  },
  {
    accessorKey: 'onFarmOffFarm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='On Farm/Off Farm' />
    ),
    cell: ({ row }) => <span>{row.getValue('onFarmOffFarm')}</span>,
  },
  {
    accessorKey: 'item',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item' />
    ),
    cell: ({ row }) => <span>{row.getValue('item')}</span>,
  },

  {
    accessorKey: 'komoditas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Komoditas' />
    ),
    cell: ({ row }) => <span>{row.getValue('komoditas')}</span>,
  },
  {
    accessorKey: 'kategoriBisnisInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori Bisnis Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('kategoriBisnisInvestasi')}</span>,
  },
  {
    accessorKey: 'sumberPendanaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sumber Pendanaan' />
    ),
    cell: ({ row }) => <span>{row.getValue('sumberPendanaan')}</span>,
  },
  {
    accessorKey: 'jenisInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('jenisInvestasi')}</span>,
  },
  {
    accessorKey: 'namaInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('namaInvestasi')}</span>,
  },
  {
    accessorKey: 'programStrategisNasional',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Program Strategis Nasional' />
    ),
    cell: ({ row }) => <span>{row.getValue('programStrategisNasional')}</span>,
  },
  {
    accessorKey: 'carryOver',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carry Over' />
    ),
    cell: ({ row }) => <span>{row.getValue('carryOver')}</span>,
  },
  {
    accessorKey: 'watchlistNonWatchlist',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Watchlist/Non Watchlist' />
    ),
    cell: ({ row }) => <span>{row.getValue('watchlistNonWatchlist')}</span>,
  },
  {
    accessorKey: 'tanggalAwalInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Awal Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('tanggalAwalInvestasi')}</span>,
  },
  {
    accessorKey: 'tanggalAkhirInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Akhir Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('tanggalAkhirInvestasi')}</span>,
  },
  {
    accessorKey: 'periodeInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Periode Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('periodeInvestasi')}</span>,
  },
  {
    accessorKey: 'jumlahTahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Tahun' />
    ),
    cell: ({ row }) => <span>{row.getValue('jumlahTahun')}</span>,
  },
  {
    accessorKey: 'jumlahTotalFisikInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Total Fisik Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('jumlahTotalFisikInvestasi')}</span>,
  },
  {
    accessorKey: 'satuan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Satuan' />
    ),
    cell: ({ row }) => <span>{row.getValue('satuan')}</span>,
  },
  {
    accessorKey: 'nilaiProyekTahunSebelumnya',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Proyek Tahun Sebelumnya' />
    ),
    cell: ({ row }) => <span>{formatRupiah(row.getValue('nilaiProyekTahunSebelumnya'))}</span>,
  },
  {
    accessorKey: 'nilaiProyekTahunBerjalan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Proyek Tahun Berjalan' />
    ),
    cell: ({ row }) => <span>{formatRupiah(row.getValue('nilaiProyekTahunBerjalan'))}</span>,
  },

  {
    accessorKey: 'jumlahFisikTahunBerjalan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Fisik Tahun Berjalan' />
    ),
    cell: ({ row }) => <span>{row.getValue('jumlahFisikTahunBerjalan')}</span>,
  },
  {
    accessorKey: 'totalNilaiProyekInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Nilai Proyek Investasi' />
    ),
    cell: ({ row }) => <span>{formatRupiah(row.getValue('totalNilaiProyekInvestasi'))}</span>,
  },
  {
    accessorKey: 'hargaSatuan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Harga Satuan' />
    ),
    cell: ({ row }) => <span>{formatRupiah(row.getValue('hargaSatuan'))}</span>,
  },
  {
    accessorKey: 'strategisNonStrategis',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Strategis/Non Strategis' />
    ),
    cell: ({ row }) => <span>{row.getValue('strategisNonStrategis')}</span>,
  },
  {
    accessorKey: 'tujuanPengajuanInvestasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tujuan Pengajuan Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('tujuanPengajuanInvestasi')}</span>,
  },

]
