import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/custom/button'

export const Summary = ({ dataProps, onCardTbmClick }: { dataProps: any; onCardTbmClick: (data: any) => void }) => {
  const tahunValue = dataProps?.dataTbm?.tahun?.value
  const rpc = dataProps?.rpc?.value
  let data: any = []

  console.log(dataProps.data)

  if (dataProps.title === 'Keseluruhan TBM') {
    data = [
      {
        show: true,
        name: 'Emas',
        val: 0,

        progress:
          dataProps.data.gold == null
            ? 0
            : dataProps.data.gold.toLocaleString('id-ID'),
        progressLuas:
          dataProps.data.gold == null
            ? 0
            : dataProps.dataLuas.gold.toLocaleString('id-ID'),
        circular: 'gold',
        image: '/2.png',
        color: '#FFA500',
        textColor: '#ffffff',
      },

      {
        show: true,
        name: 'Hijau',
        val: 1,
        progress: dataProps.data.green == null ? 0 : dataProps.data.green.toLocaleString('id-ID'),
        progressLuas: dataProps.dataLuas.green == null ? 0 : dataProps.dataLuas.green.toLocaleString('id-ID'),

        circular: 'green',
        image: '/2.png',
        color: '#00a300',
        textColor: '#ffffff',
      },
      {
        show: true,
        name: 'Merah',
        progress: dataProps.data.red == null ? 0 : dataProps.data.red.toLocaleString('id-ID'),
        progressLuas: dataProps.dataLuas.red == null ? 0 : dataProps.dataLuas.red.toLocaleString('id-ID'),
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
        progress: dataProps.data.black == null ? 0 : dataProps.data.black.toLocaleString('id-ID'),
        progressLuas: dataProps.data.black == null ? 0 : dataProps.dataLuas.black.toLocaleString('id-ID'),
        circular: 'black',
        image: '/2.png',
        color: '#000000',
        textColor: '#ffffff',
      },
    ]
  } else {
    if (dataProps.ctg == 'tbm1' && rpc == 'all') {
      data = [
        {
          show: true,
          isColorTbm: true,
          name: 'Emas',
          progress:
            dataProps.tbm1ColorCount.gold == null
              ? 0
              : dataProps.tbm1ColorCount.gold,
          progressLuas:
            dataProps.tbm1LuasByColor.gold == null
              ? 0
              : dataProps.tbm1LuasByColor.gold.toFixed(2),

          circular: 'gold',
          rules: 'Kelas A : 97 - 100',
          image: '/2.png',
          color: '#FFA500',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hijau',
          progress: dataProps.tbm1ColorCount.green == null ? 0 : dataProps.tbm1ColorCount.green,
          progressLuas: dataProps.tbm1LuasByColor.green == null ? 0 : dataProps.tbm1LuasByColor.green.toFixed(2),
          circular: 'green',
          rules: 'Kelas B : 85 - 96',
          image: '/2.png',
          color: '#00a300',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Merah',
          progress: dataProps.tbm1ColorCount.red == null ? 0 : dataProps.tbm1ColorCount.red,
          progressLuas: dataProps.tbm1LuasByColor.red == null ? 0 : dataProps.tbm1LuasByColor.red.toFixed(2),
          circular: 'red',
          rules: 'Kelas C : 75 - 84',
          image: '/2.png',
          color: '#FF0000',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hitam',
          progress: dataProps.tbm1ColorCount.black == null ? 0 : dataProps.tbm1ColorCount.black,
          progressLuas: dataProps.tbm1LuasByColor.black == null ? 0 : dataProps.tbm1LuasByColor.black.toFixed(2),
          circular: 'black',
          rules: 'Kelas D : 0 - 74',
          image: '/2.png',
          color: '#000000',
          textColor: '#ffffff',
        },
      ]
    } else if (dataProps.ctg == 'tbm2' && rpc == 'all') {
      data = [
        {
          show: true,
          isColorTbm: true,
          name: 'Emas',
          progress: dataProps.tbm2ColorCount.gold == null ? 0 : dataProps.tbm2ColorCount.gold,
          progressLuas: dataProps.tbm2LuasByColor.gold == null ? 0 : dataProps.tbm2LuasByColor.gold.toFixed(2),
          circular: 'gold',
          rules: 'Kelas A : 97 - 100',
          image: '/2.png',
          color: '#FFA500',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hijau',
          progress: dataProps.tbm2ColorCount.green == null ? 0 : dataProps.tbm2ColorCount.green,
          progressLuas: dataProps.tbm2LuasByColor.green == null ? 0 : dataProps.tbm2LuasByColor.green.toFixed(2),
          circular: 'green',
          rules: 'Kelas B : 85 - 96',
          image: '/2.png',
          color: '#00a300',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Merah',
          progress: dataProps.tbm2ColorCount.red == null ? 0 : dataProps.tbm2ColorCount.red,
          progressLuas: dataProps.tbm2LuasByColor.red == null ? 0 : dataProps.tbm2LuasByColor.red.toFixed(2),
          circular: 'red',
          rules: 'Kelas C : 75 - 84',
          image: '/2.png',
          color: '#FF0000',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hitam',
          progress: dataProps.tbm2ColorCount.black == null ? 0 : dataProps.tbm2ColorCount.black,
          progressLuas: dataProps.tbm2LuasByColor.black == null ? 0 : dataProps.tbm2LuasByColor.black.toFixed(2),
          circular: 'black',
          rules: 'Kelas D : 0 - 74',
          image: '/2.png',
          color: '#000000',
          textColor: '#ffffff',
        },
      ]
    } else if (dataProps.ctg == 'tbm3' && rpc == 'all') {
      data = [
        {
          show: true,
          isColorTbm: true,
          name: 'Emas',
          progress: dataProps.tbm3ColorCount.gold == null ? 0 : dataProps.tbm3ColorCount.gold,
          progressLuas: dataProps.tbm3LuasByColor.gold == null ? 0 : dataProps.tbm3LuasByColor.gold.toFixed(2),
          circular: 'gold',
          rules: 'Kelas A : 97 - 100',
          image: '/2.png',
          color: '#FFA500',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hijau',
          progress: dataProps.tbm3ColorCount.green == null ? 0 : dataProps.tbm3ColorCount.green,
          progressLuas: dataProps.tbm3LuasByColor.green == null ? 0 : dataProps.tbm3LuasByColor.green.toFixed(2),
          circular: 'green',
          rules: 'Kelas B : 85 - 96',
          image: '/2.png',
          color: '#00a300',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Merah',
          progress: dataProps.tbm3ColorCount.red == null ? 0 : dataProps.tbm3ColorCount.red,
          progressLuas: dataProps.tbm3LuasByColor.red == null ? 0 : dataProps.tbm3LuasByColor.red.toFixed(2),
          circular: 'red',
          rules: 'Kelas C : 75 - 84',
          image: '/2.png',
          color: '#FF0000',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hitam',
          progress: dataProps.tbm3ColorCount.black == null ? 0 : dataProps.tbm3ColorCount.black,
          progressLuas: dataProps.tbm3LuasByColor.black == null ? 0 : dataProps.tbm3LuasByColor.black.toFixed(2),
          circular: 'black',
          rules: 'Kelas D : 0 - 74',
          image: '/2.png',
          color: '#000000',
          textColor: '#ffffff',
        },
      ]
    } else if (dataProps.ctg == 'tbm4' && rpc == 'all') {
      data = [
        {
          show: true,
          isColorTbm: true,
          name: 'Emas',
          progress: dataProps.tbm4ColorCount.gold == null ? 0 : dataProps.tbm4ColorCount.gold,
          progressLuas: dataProps.tbm4LuasByColor.gold == null ? 0 : dataProps.tbm4LuasByColor.gold.toFixed(2),
          circular: 'gold',
          rules: 'Kelas A : 97 - 100',
          image: '/2.png',
          color: '#FFA500',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hijau',
          progress: dataProps.tbm4ColorCount.green == null ? 0 : dataProps.tbm4ColorCount.green,
          progressLuas: dataProps.tbm4LuasByColor.green == null ? 0 : dataProps.tbm4LuasByColor.green.toFixed(2),
          circular: 'green',
          rules: 'Kelas B : 85 - 96',
          image: '/2.png',
          color: '#00a300',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Merah',
          progress: dataProps.tbm4ColorCount.red == null ? 0 : dataProps.tbm4ColorCount.red,
          progressLuas: dataProps.tbm4LuasByColor.red == null ? 0 : dataProps.tbm4LuasByColor.red.toFixed(2),
          circular: 'red',
          rules: 'Kelas C : 75 - 84',
          image: '/2.png',
          color: '#FF0000',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hitam',
          progress: dataProps.tbm4ColorCount.black == null ? 0 : dataProps.tbm4ColorCount.black,
          progressLuas: dataProps.tbm4LuasByColor.black == null ? 0 : dataProps.tbm4LuasByColor.black.toFixed(2),
          circular: 'black',
          rules: 'Kelas D : 0 - 74',
          image: '/2.png',
          color: '#000000',
          textColor: '#ffffff',
        },
      ]

    }


    if (dataProps.ctg !== 'tbm-all' && rpc !== 'all') {
      data = [
        {
          show: true,
          isColorTbm: true,
          name: 'Emas',
          val: 0,

          progress:
            dataProps.dataDnt.gold == null
              ? 0
              : dataProps.dataDnt.gold.toLocaleString('id-ID'),
          progressLuas:
            dataProps.dataDnt.gold == null
              ? 0
              : dataProps.dataLuasDnt.gold.toLocaleString('id-ID'),
          circular: 'gold',
          image: '/2.png',
          color: '#FFA500',
          textColor: '#ffffff',
        },

        {
          show: true,
          isColorTbm: true,
          name: 'Hijau',
          val: 1,
          progress: dataProps.dataDnt.green == null ? 0 : dataProps.dataDnt.green.toLocaleString('id-ID'),
          progressLuas: dataProps.dataLuasDnt.green == null ? 0 : dataProps.dataLuasDnt.green.toLocaleString('id-ID'),
          circular: 'green',
          image: '/2.png',
          color: '#00a300',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Merah',
          progress: dataProps.dataDnt.red == null ? 0 : dataProps.dataDnt.red.toLocaleString('id-ID'),
          progressLuas: dataProps.dataLuasDnt.red == null ? 0 : dataProps.dataLuasDnt.red.toLocaleString('id-ID'),
          val: 2,
          circular: 'red',
          image: '/2.png',
          color: '#FF0000',
          textColor: '#ffffff',
        },
        {
          show: true,
          isColorTbm: true,
          name: 'Hitam',
          val: 3,
          progress: dataProps.dataDnt.black == null ? 0 : dataProps.dataDnt.black.toLocaleString('id-ID'),
          progressLuas: dataProps.dataDnt.black == null ? 0 : dataProps.dataLuasDnt.black.toLocaleString('id-ID'),
          circular: 'black',
          image: '/2.png',
          color: '#000000',
          textColor: '#ffffff',
        },
      ]
    }
  }



  return (
    <>
      <div className='grid gap-4 grid-cols-2 mt-5'>
        {data.map((item: any, i: any) =>
          item.show ? (
            <Card
              key={i}
              className='py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border dark:hover:border-cyan-500 hover:shadow-cyan-500'
              onClick={() => onCardTbmClick(item)} // Kirim data ke parent saat card di-klik
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
