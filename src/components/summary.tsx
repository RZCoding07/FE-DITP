import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import PalmOilTable from './custom/palm-oil-table';

import StackedBarChart from './custom/stacked-bar-chart';

export const Summary = ({ dataProps, onCardClick }: { dataProps: any; onCardClick: (data: any) => void }) => {

  const tahunValue = dataProps?.dataTbm?.tahun?.value;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerOpenB, setIsDrawerOpenB] = useState(false)
  // State untuk menyimpan id kartu yang diklik
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedTbm, setSelectedTbm] = useState<number | null>(null); // Untuk TBM terpisah

  // const data = [
  //   {
  //     show: true,
  //     name: 'Emas',
  //     type: 'color',
  //     val: 0,
  //     progress: dataProps.data.gold == null ? 0 : dataProps.data.gold,
  //     progressLuas: dataProps.dataLuas.gold == null ? 0 : dataProps.dataLuas.gold,
  //     circular: 'gold',
  //     image: '/2.png',
  //     color: '#FFA500',
  //     textColor: '#ffffff',
  //   },
  //   {
  //     show: true,
  //     name: 'Hijau',
  //     type: 'color',
  //     val: 1,
  //     progress: dataProps.data.green == null ? 0 : dataProps.data.green,
  //     progressLuas: dataProps.dataLuas.green == null ? 0 : dataProps.dataLuas.green,
  //     circular: 'green',
  //     image: '/2.png',
  //     color: '#00a300',
  //     textColor: '#ffffff',
  //   },
  //   {
  //     show: true,
  //     name: 'Merah',
  //     type: 'color',
  //     progress: dataProps.data.red == null ? 0 : dataProps.data.red,
  //     progressLuas: dataProps.dataLuas.red == null ? 0 : dataProps.dataLuas.red,
  //     val: 2,
  //     circular: 'red',
  //     image: '/2.png',
  //     color: '#FF0000',
  //     textColor: '#ffffff',
  //   },
  //   {
  //     show: true,
  //     name: 'Hitam',
  //     type: 'color',
  //     val: 3,
  //     progress: dataProps.data.black == null ? 0 : dataProps.data.black,
  //     progressLuas: dataProps.dataLuas.black == null ? 0 : dataProps.dataLuas.black,
  //     circular: 'black',
  //     image: '/2.png',
  //     color: '#000000',
  //     textColor: '#ffffff',
  //   },
  // ];

  const dataRules = [
    {
      show: true,
      name: 'Emas',
      progress: 1,
      circular: 'gold',
      rules: 'Kelas A : > 92 - 100',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hijau',
      progress: 1,
      rules: 'Kelas B : > 87 - 92',
      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: 1,
      rules: 'Kelas C : 82 - 87',
      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      rules: 'Kelas D : < 82',
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
      progress: dataProps.dataTbm.tbm1 == null ? 0 : dataProps.dataTbm.tbm1,
      areal: dataProps.luasan[0],
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
      progress: dataProps.dataTbm.tbm2 == null ? 0 : dataProps.dataTbm.tbm2,
      areal: dataProps.luasan[1],
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
      progress: dataProps.dataTbm.tbm3 == null ? 0 : dataProps.dataTbm.tbm3,
      areal: dataProps.luasan[2],
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
      progress: dataProps.dataTbm.tbm4 == null ? 0 : dataProps.dataTbm.tbm4,
      areal: dataProps.luasan[3],
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

  const totalLuasTbm = dataTbm.reduce((acc: number, item: any) => {
    if (item.show) {
      return acc + Number.parseFloat(item.areal || "0");
    }
    return acc;
  }
  , 0).toFixed(2);

  return (
    <>
      <style>{`
      [data-vaul-drawer][data-vaul-drawer-direction=bottom]::after {
      content: none; /* Menonaktifkan pseudo-elemen */
      height: 0 !important; /* Menonaktifkan tingginya */
      left: initial !important; /* Reset posisi kiri */
      top: initial !important; /* Reset posisi atas */
      right: initial !important; /* Reset posisi kanan */
      bottom: initial !important; /* Reset posisi bawah */
  }
      `}</style>
    
      {/* <div className='grid gap-4 lg:grid-cols-4 2lg:grid-cols-4'>
        {data.map((item, i) =>
          item.show ? (
            <Card
              key={i}
              className={`py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border hover:shadow-cyan-500 ${selectedCard === i ? '' : ''
                }`}
    
              style={{
                
                background: selectedCard === i ? `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)` :
                  `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)`,
                borderColor: item.color,

                boxShadow: selectedCard === i ? '0 4px 10px rgba(91, 219, 236, 0.74)' : '',

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
                      {(Math.round(item.progressLuas * 100) / 100).toLocaleString('id-ID')} HA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null
        )}
      </div> */}
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

      <div className='grid gap-4 lg:grid-cols-4 2lg:grid-cols-4 mt-4'>
        {dataTbm.map((item, i) =>
          item.show ? (
            <Card
              key={i}
              onClick={() => {
                setSelectedTbm(i); // Set the selected TBM card separately
                setSelectedCard(null); // Reset color selection
                onCardClick(item); // Kirim data ke parent saat TBM card di-klik
              }}
              className={`py-2 shadow-md border border-cyan-500 shadow-cyan-500 ${dataProps.isReset ? '' : (selectedTbm === i ? 'bg-blue-500 from-blue-500 to-blue-500 text-white' : '')}`}

              {...(dataProps.isReset ? {} : (selectedTbm === i ? { style: { background: 'linear-gradient(to right, #129bb0, #006d8e)' } } : {}))}
            >

              <CardContent className='flex items-center px-2 py-1'>
                <div className='relative float-end mr-2 h-10 w-10'>
                  <img
                    width='64'
                    height='64'
                    src='/tbm.png'
                    alt='external-oil-oil-gas-flaticons-flat-flat-icons'
                  />
                </div>
                <div>
                  <p className='text-sm font-semibold capitalize'>{item.name}</p>
                  <p className='font-semibold text-sm'>{(Math.round(item.progress * 100) / 100).toLocaleString('id-ID')} HA / {(Math.round(item.areal * 100) / 100).toLocaleString('id-ID')} HA (   {((parseFloat(item.progress.toString()) / parseFloat((Math.round(item.areal * 100) / 100).toString())) * 100).toFixed(2)}%)</p>
             
                </div>
              </CardContent>
            </Card>
          ) : null
        )}
      </div>

        <div className='flex justify-start items-center space-x-4 mt-5'>
        <Drawer open={isDrawerOpenB} onOpenChange={setIsDrawerOpenB}>
          <DrawerTrigger asChild>
            <h2 className='font-semibold underline underline-offset-4 underline-thickness-2'>
              Luas TBM Total : {totalLuasFormat} HA / {Number(totalLuasTbm).toLocaleString('id-ID')} HA ({((parseFloat(totalLuas) / parseFloat(totalLuasTbm)) * 100).toFixed(2)}%)
            </h2>
          </DrawerTrigger>
          <DrawerContent className='overflow-y-auto h-[92vh]'>
            <DrawerHeader>
              <DrawerTitle>Rekapitulasi Blok TBM Per Regional</DrawerTitle>
              <DrawerDescription>Informasi Grafik Rekapitulasi Blok TBM Per Regional.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {/* Add your content for the Standard Vegetatif drawer here */}
              <StackedBarChart 
                dataProps={dataProps}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant={"secondary"} className="flex items-center rounded-full">
              <img width="20" height="20" src="https://img.icons8.com/stickers/50/visible.png" alt="visible" />
              <span className="ml-2"> Standard Vegetatif</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className='overflow-y-auto h-[92vh]'>
            <DrawerHeader>
              <DrawerTitle>Standard Vegetatif</DrawerTitle>
              <DrawerDescription>Informasi tentang standard vegetatif.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {/* Add your content for the Standard Vegetatif drawer here */}
              <PalmOilTable />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
