import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export const Summary = (dataProps: any) => {
  const tahunValue = dataProps?.dataTbm?.tahun?.value

  const data = [
    {
      show: true,
      name: 'Emas',
      progress:
      dataProps.dataTbm.tbm2 == null
        ? 0
        : dataProps.dataTbm.tbm2.toLocaleString('id-ID'),
      circular: 'emas',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'Hijau',
      progress: 1,

      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: 1,

      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      progress: 1,
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]

  const dataTbm = [
    {
      show: true,
      name: 'TBM 1' + ' - ' + (tahunValue ? tahunValue - 1 : 0),
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
      name: 'TBM 2' + ' - ' + (tahunValue ? tahunValue - 2 : 0),
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
      name: 'TBM 3' + ' - ' + (tahunValue ? tahunValue - 3 : 0),
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
      name: 'TBM > 3' + ' - > ' + (tahunValue ? tahunValue - 3 : 0),
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
            className='bg-gradient-to-br py-2 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border border-cyan-500 shadow-cyan-500'
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
          </Card>
        ) : null
      )}
      {data.map((item, i) =>
        item.show ? (
          <Card
            key={i}
            className='py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border'
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
