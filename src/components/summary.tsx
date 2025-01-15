import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/custom/button'

export const Summary = ({ dataProps, onCardClick }: { dataProps: any; onCardClick: (data: any) => void }) => {
  const tahunValue = dataProps?.dataTbm?.tahun?.value

  console.log(dataProps.data)

  const data = [
    {
      show: true,
      name: 'Emas',
      progress:
      dataProps.data.emas == null
        ? 0
        : dataProps.data.emas.toLocaleString('id-ID'),
      circular: 'gold',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'Hijau',
      progress: dataProps.data.hijau == null ? 0 : dataProps.data.hijau.toLocaleString('id-ID'),

      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: dataProps.data.merah == null ? 0 : dataProps.data.merah.toLocaleString('id-ID'),

      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      progress: dataProps.data.hitam == null ? 0 : dataProps.data.hitam.toLocaleString('id-ID'),
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]

  const dataTbm = [
    {
      show: true,
      name: 'TBM 1' + ' - TT ' + (tahunValue ? tahunValue - 1 : 0),
      val: 0,
      progress:
        dataProps.dataTbm.tbm1 == null
          ? 0
          : dataProps.dataTbm.tbm1.toLocaleString('id-ID'),
      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'TBM 2' + ' - TT ' + (tahunValue ? tahunValue - 2 : 0),
      val: 1, 
      progress:
        dataProps.dataTbm.tbm2 == null
          ? 0
          : dataProps.dataTbm.tbm2.toLocaleString('id-ID'),
      circular: 'yellow',
      image: '/2.png',
      color: '#FFFF00',
      textColor: '#000000',
    },
    {
      show: true,
      name: 'TBM 3' + ' - TT ' + (tahunValue ? tahunValue - 3 : 0),
      val: 2,
      progress:
        dataProps.dataTbm.tbm3 == null
          ? 0
          : dataProps.dataTbm.tbm3.toLocaleString('id-ID'),
      circular: 'orange',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'TBM 3' + ' - > ' + (tahunValue ? tahunValue - 3 : 0),
      val: 3,
      progress:
        dataProps.dataTbm.tbm4 == null
          ? 0
          : dataProps.dataTbm.tbm4.toLocaleString('id-ID'),
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]

  return (
    <div className='grid gap-4 lg:grid-cols-4 2xl:grid-cols-4'>
      {dataTbm.map((item, i) =>
        item.show ? (
          <Card
            key={i}
            onClick={() => onCardClick(item)}
            className='bg-gradient-to-br  py-2 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border border-cyan-500 shadow-cyan-500'
          >
            <CardContent className='flex items-center px-2 py-2'>
              <div className='relative float-end mr-2 h-10 w-10'>
                <img
                  width='64'
                  height='64'
                  src='https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-oil-oil-gas-flaticons-flat-flat-icons.png'
                  alt='external-oil-oil-gas-flaticons-flat-flat-icons'
                />
              </div>
              <div>
                <p className='text-sm font-semibold capitalize'>{item.name}</p>
                <p className='font-semibold'>{item.progress} HA</p>

              </div>

            </CardContent>
            {/* <div className="flex -mt-10 relative float-end mr-2">
            <Button
                  className='mt-2 text'
                  size='sm'
                  variant='secondary-outline'
                  onClick={() => onCardClick(item)}
                >
                  Tutup Detail
                </Button>
            </div> */}
          </Card>
        ) : null
      )}
      {data.map((item, i) =>
        item.show ? (
          <Card
            key={i}
            className='py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border'
            onClick={() => onCardClick(item)} // Kirim data ke parent saat card di-klik
            style={{
              background: `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)`,
              borderColor: item.color,
        
            }}
          >
            <CardContent className='flex items-center px-2 py-2'>
              <div className='relative mr-2 h-10 w-10'>
                <img src={item.image} alt={item.name} />
              </div>
              <div>
                <p
                  className='text-sm font-semibold capitalize'
                  style={{ color: `${item.textColor}` }}
                >
                  {item.name}
                </p>
                <p
                  className='font-semibold'
                  style={{ color: `${item.textColor}` }}
                >
                  {item.progress}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null
      )}
    </div>
  )
}
