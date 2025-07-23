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
  {
    accessorKey: 'corrective_actions',
    header: 'Action',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any) => action.ca).join(', ')
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  {
    id: 'ca_value',
    header: 'Value',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any) => action.value).join(', ')
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  {
    id: 'ca_start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any) => action.startDate).join(', ')
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  {
    id: 'ca_end_date',
    header: 'End Date',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any) => action.endDate).join(', ')
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  {
    id: 'ca_budget',
    header: 'Budget',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any) => action.budgetAvailable == 'tersedia' ? 'Tersedia' : 'Tidak Tersedia').join(', ')
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  {
    id: 'ca_images',
    header: 'Images',
    cell: ({ row }) => {
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        return (
          <div>
            {actions.length > 0 
              ? actions.map((action: any, actionIndex: number) => 
                  action.images?.length 
                    ? (
                        <div key={actionIndex}>
                          {action.images.map((image: any, imageIndex: number) => (
                            <img 
                              key={imageIndex} 
                              src={image.file} 
                              alt={image.name} 
                              style={{ width: '600px', height: 'auto', margin: '5px' }} 
                            />
                          ))}
                        </div>
                      )
                    : <span key={actionIndex}>None</span>
                )
              : '-'}
          </div>
        );
      } catch (e) {
        return '-';
      }
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
      try {
        const actions = row.getValue('corrective_actions') ? JSON.parse(row.getValue('corrective_actions')) : [];
        const hasActions = actions.length > 0;
        
        return (
          <Button
            variant='outline'
            className='w-full'
            disabled={!hasActions}
          >
            <Link 
              to={hasActions 
                ? `/weekly-pica-tbm/${
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
                  }`
                : '#'}
            >
              {hasActions ? 'Detail Progress' : 'No Actions'}
            </Link>
          </Button>
        );
      } catch (e) {
        return (
          <Button
            variant='outline'
            className='w-full'
            disabled
          >
            <Link to="#">Invalid Data</Link>
          </Button>
        );
      }
    },
  },
];