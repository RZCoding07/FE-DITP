import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/custom/button'

export const Summary = ({ dataProps, onCardClick }: { dataProps: any; onCardClick: (data: any) => void }) => {
  const tahunValue = dataProps?.dataTbm?.tahun?.value

  const data = [
    {
      show: true,
      name: 'Emas',
      val: 0,

      progress:
        dataProps.data.emas == null
          ? 0
          : dataProps.data.emas.toLocaleString('id-ID'),
      progressLuas:
        dataProps.data.emas == null
          ? 0
          : dataProps.dataLuas.emas.toLocaleString('id-ID'),
      circular: 'gold',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'Hijau',
      val: 1,
      progress: dataProps.data.hijau == null ? 0 : dataProps.data.hijau.toLocaleString('id-ID'),
      progressLuas: dataProps.dataLuas.hijau == null ? 0 : dataProps.dataLuas.hijau.toLocaleString('id-ID'),

      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: dataProps.data.merah == null ? 0 : dataProps.data.merah.toLocaleString('id-ID'),
      progressLuas: dataProps.dataLuas.merah == null ? 0 : dataProps.dataLuas.merah.toLocaleString('id-ID'),
      val: 2,
      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      val: 3,
      progress: dataProps.data.hitam == null ? 0 : dataProps.data.hitam.toLocaleString('id-ID'),
      progressLuas: dataProps.data.hitam == null ? 0 : dataProps.dataLuas.hitam.toLocaleString('id-ID'),
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]
  const dataRules = [
    {
      show: true,
      name: 'Emas',
      progress: 1,
      circular: 'gold',
      rules: 'Kelas A : 97 - 100',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'Hijau',
      progress: 1,
      rules: 'Kelas B : 90 - 96',
      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: 1,
      rules: 'Kelas C : 81 - 89',
      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      rules: 'Kelas D : < 80',
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
      name: 'TBM 1' + ' - TT ' + (tahunValue ? tahunValue - 1 : 0),
      val: 0,
      progress:
        dataProps.dataTbm.tbm1 == null
          ? 0
          : dataProps.dataTbm.tbm1.toLocaleString('id-ID'),
      circular: 'all',
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
      circular: 'all',
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
      circular: 'all',
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
          : dataProps.dataTbm.tbm4,
      circular: 'all',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]

  const totalLuas = (
    dataProps.dataTbm.tbm4 + dataProps.dataTbm.tbm3
    + dataProps.dataTbm.tbm2
    + dataProps.dataTbm.tbm1
  ).toFixed(2);
  
  // Convert to number before formatting
  const totalLuasFormat = Number(totalLuas).toLocaleString('id-ID');
  
  return (
    <>
    <div className='grid gap-4 lg:grid-cols-4 2xl:grid-cols-2 mt-5'>
      {data.map((item, i) =>
        item.show ? (
          <Card
            key={i}
            className='py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border dark:hover:border-cyan-500 hover:shadow-cyan-500'
            onClick={() => onCardClick(item)} // Kirim data ke parent saat card di-klik
            style={{
              background: `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)`,
              borderColor: item.color,
            }}
          >
            <CardContent className='flex items-center px-2 py-1'>
              <div className='relative mr-2 w-10 h-10'>
                <img src={item.image} alt={item.name} className="object-contain" />
              </div>
              <div className='grid grid-cols-[20%_80%] py-0 my-0 text-xs align-middle items-center w-full'>
                <p className='text-sm font-semibold capitalize' style={{ color: `${item.textColor}` }}>
                  {item.name}
                </p>
                <div className='py-0 my-0 items-end'>
                  <p className='font-semibold float-right' style={{ color: `${item.textColor}` }}>
                    {item.progress} Blok
                  </p>
                  <br />
                  <p className='font-semibold float-end' style={{ color: `${item.textColor}` }}>
                    {item.progressLuas} HA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null
      )}
    </div>
  </>
  
  )
}
