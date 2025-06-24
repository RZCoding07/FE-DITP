import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
// import { DataTableRowActions } from './data-table-row-actions';
import { Button } from '@/components/custom/button';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
interface VegetativeData {
  id: string;
  regional: string;
  kebun: string;
  afdeling: string;
  tahun_tanam: string;
  vegetatif_id: string;
  why1: string;
  why2: string;
  why3: string;
  blok: string;
  value_pi: string;
  keterangan: string;
  max_progress_percentage: number;
  corrective_actions: string;
  created_by: string;
  updated_by: string;
  bulan: string;
  tahun: string;
  createdAt: string;
  updatedAt: string;
}

const encodeBase64 = (str: string): string => {
  return btoa(str); // Mengonversi string ke base64
};

export const columns: ColumnDef<VegetativeData>[] = [

   {
    id: "number",
    header: "No.",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const rowNumber = pageIndex * pageSize + row.index + 1
      return <span>{rowNumber}</span>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'regional',
    header: 'Regional',
    cell: ({ row }) => <span>{row.getValue('regional')}</span>,
  },
  {
    accessorKey: 'kebun',
    header: 'Kebun',
    cell: ({ row }) => <span>{row.getValue('kebun')}</span>,
  },
  {
    accessorKey: 'afdeling',
    header: 'Afdeling',
    cell: ({ row }) => <span>{row.getValue('afdeling')}</span>,
  },
  {
    accessorKey: 'tahun_tanam',
    header: 'Tahun Tanam',
    cell: ({ row }) => <span>{row.getValue('tahun_tanam')}</span>,
  },
  // Analisis Masalah Group
  {
    accessorKey: 'why1',
    header: 'Why 1',
    cell: ({ row }) => <span>{row.getValue('why1')}</span>,
  },
  {
    accessorKey: 'why2',
    header: 'Why 2',
    cell: ({ row }) => <span>{row.getValue('why2')}</span>,
  },
  {
    accessorKey: 'why3',
    header: 'Why 3',
    cell: ({ row }) => <span>{row.getValue('why3')}</span>,
  },
  {
    accessorKey: 'blok',
    header: 'Blok',
    cell: ({ row }) => <span>{row.getValue('blok')}</span>,
  },
  {
    accessorKey: 'value_pi',
    header: 'Value PI',
    cell: ({ row }) => <span>{row.getValue('value_pi')}</span>,
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => <span>{row.getValue('keterangan') || '-'}</span>,
  },
  // Corrective Actions Group
  {
    accessorKey: 'corrective_actions',
    header: 'Action',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action: any) => action.ca).join(', ')}
        </div>
      );
    },
  },
  {
    id: 'ca_value',
    header: 'Value',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action: any) => action.value).join(', ')}
        </div>
      );
    },
  },
  {
    id: 'ca_start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action: any) => action.startDate).join(', ')}
        </div>
      );
    },
  },
  {
    id: 'ca_end_date',
    header: 'End Date',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action: any) => action.endDate).join(', ')}
        </div>
      );
    },
  },
  {
    id: 'ca_budget',
    header: 'Budget',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action: any) => action.budgetAvailable == 'tersedia' ? 'Tersedia' : 'Tidak Tersedia').join(', ')}
        </div>
      );
    },
  },
  {
    id: 'ca_images',
    header: 'Images',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <div>
          {actions.map((action:any, actionIndex:any) => 
            action.images?.length ? (
              <div key={actionIndex}>
                {action.images.map((image:any, imageIndex:any) => (
                  <img 
                    key={imageIndex} 
                    src={image.file} 
                    alt={image.name} 
                    style={{ width: '600px', height: 'auto', margin: '5px' }} 
                  />
                ))}
              </div>
            ) : (
              <span key={actionIndex}>None</span>
            )
          )}
        </div>
      );
    },
  },
{
  id: 'max_progress_percentage',
  header: 'Progress',
  accessorKey: 'max_progress_percentage',
  cell: ({ row }) => {
    const rawPercentage = row.getValue('max_progress_percentage') || 0;

    return (
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${rawPercentage}%` }}
          />
        </div>
        <span className="text-sm">{`${rawPercentage}%`}</span>
      </div>
    );
  },
},
{
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const actions = JSON.parse(row.getValue('corrective_actions'));
      return (
        <Button
          variant='outline'
          className='w-full'
        >
          <Link 
            to={`/weekly-pica-tbm/${
              row.original.vegetatif_id
            }/${
              encodeBase64(actions.map((action: any) => action.startDate).join(', '))
            }/${
              encodeBase64(actions.map((action: any) => action.endDate).join(', '))
            }/${
              encodeBase64(actions.map((action: any) => action.ca).join(', '))
            }/${
              encodeBase64(actions.map((action: any) => action.value).join(', '))
            }/${
              encodeBase64(actions.map((action: any) => action.budgetAvailable).join(', '))
            }`}
          >
            Detail Progress
          </Link>
        </Button>
      );
    },
},
];