import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/custom/button';

export const Summary = ({ dataProps, onCardClick }: { dataProps: any; onCardClick: (data: any) => void }) => {
  const tahunValue = dataProps?.dataTbm?.tahun?.value;

  // State untuk menyimpan id kartu yang diklik
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedTbm, setSelectedTbm] = useState<number | null>(null); // Untuk TBM terpisah

  const data = [
    {
      show: true,
      name: 'Emas',
      type: 'color',
      val: 0,
      progress: dataProps.data.emas == null ? 0 : dataProps.data.emas.toLocaleString('id-ID'),
      progressLuas: dataProps.dataLuas.emas == null ? 0 : dataProps.dataLuas.emas.toLocaleString('id-ID'),
      circular: 'gold',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hijau',
      type: 'color',
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
      type: 'color',
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
      type: 'color',
      val: 3,
      progress: dataProps.data.hitam == null ? 0 : dataProps.data.hitam.toLocaleString('id-ID'),
      progressLuas: dataProps.dataLuas.hitam == null ? 0 : dataProps.dataLuas.hitam.toLocaleString('id-ID'),
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ];

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
  ];

  const dataTbm = [
    {
      show: true,
      name: 'TBM 1' + ' - TT ' + (tahunValue ? tahunValue - 1 : 0),
      type: 'tbm',
      ctg: 'tbm1',
      val: 0,
      progress: dataProps.dataTbm.tbm1 == null ? 0 : dataProps.dataTbm.tbm1.toLocaleString('id-ID'),
      circular: 'all',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      type: 'tbm',
      name: 'TBM 2' + ' - TT ' + (tahunValue ? tahunValue - 2 : 0),
      ctg: 'tbm2',
      val: 1,
      progress: dataProps.dataTbm.tbm2 == null ? 0 : dataProps.dataTbm.tbm2.toLocaleString('id-ID'),
      circular: 'all',
      image: '/2.png',
      color: '#FFFF00',
      textColor: '#000000',
    },
    {
      show: true,
      type: 'tbm',
      name: 'TBM 3' + ' - TT ' + (tahunValue ? tahunValue - 3 : 0),
      ctg: 'tbm3',
      val: 2,
      progress: dataProps.dataTbm.tbm3 == null ? 0 : dataProps.dataTbm.tbm3.toLocaleString('id-ID'),
      circular: 'all',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },
    {
      show: true,
      type: 'tbm',
      name: 'TBM > 3' + ' - TT > ' + (tahunValue ? tahunValue - 3 : 0),
      ctg: 'tbm4',
      val: 3,
      progress: dataProps.dataTbm.tbm4 == null ? 0 : dataProps.dataTbm.tbm4.toLocaleString('id-ID'),
      circular: 'all',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ];

  const totalLuas = (
    dataProps.dataTbm.tbm4 + dataProps.dataTbm.tbm3 + dataProps.dataTbm.tbm2 + dataProps.dataTbm.tbm1
  ).toFixed(2);

  const totalLuasFormat = Number(totalLuas).toLocaleString('id-ID');

  return (
    <>
      <h2 className='font-semibold mb-1 -mt-5'>
        Luas TBM Total : {totalLuasFormat} HA
      </h2>
      <div className='grid gap-4 lg:grid-cols-4 2xl:grid-cols-4'>
        {data.map((item, i) =>
          item.show ? (
            <Card
              key={i}
              className={`py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border hover:shadow-cyan-500 ${
                selectedCard === i ? '' : ''
              }`}
              onClick={() => {
                setSelectedCard(i); // Set the clicked card as selected
                setSelectedTbm(null); // Reset TBM selection
                onCardClick(item); // Kirim data ke parent saat card di-klik
              }}
              style={{
                background: selectedCard === i ? `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)` :
                `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)`,
                borderColor: item.color,

                boxShadow: selectedCard === i ? '0 4px 10px rgba(0, 225, 255, 0.74)' : '',

              }}
            >
              <CardContent className='flex items-center px-2 py-1'>
                <div className='relative mr-2 h-10 w-10'>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className='grid grid-cols-2 py-0 my-0  align-middle items-center w-full'>
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
      <div className='flex -mt-2'>
        {dataRules.map((item, i) =>
          item.show ? (
            <div
              key={i}
              className='mt-5 block w-full bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-950'
              style={{
                background: `linear-gradient(135deg, ${item.color} 55%, ${item.color}69 45%)`,
                borderColor: item.color,
              }}
            >
              <div className='flex items-center justify-between px-4 py-1'>
                <p className='text-sm font-semibold capitalize text-white'>
                  {item.name}
                </p>
                <span className='text-end text-xs font-semibold text-white'>
                  {item.rules}
                </span>
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className='grid gap-4 lg:grid-cols-4 2xl:grid-cols-4 mt-4'>
        {dataTbm.map((item, i) =>
          item.show ? (
            <Card
              key={i}
              onClick={() => {
                setSelectedTbm(i); // Set the selected TBM card separately
                setSelectedCard(null); // Reset color selection
                onCardClick(item); // Kirim data ke parent saat TBM card di-klik
              }}
              className={`bg-gradient-to-br py-2 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border border-cyan-500 shadow-cyan-500 ${
                selectedTbm === i ? 'bg-cyan-500 text-white' : ''
              }`}
            >
              <CardContent className='flex items-center px-2 py-1'>
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
                  <p className='font-semibold'>{(item.progress)} HA</p>
                </div>
              </CardContent>
            </Card>
          ) : null
        )}
      </div>
    </>
  );
};
