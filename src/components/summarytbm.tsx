import { Card, CardContent } from '@/components/ui/card'

export const SummaryTBM = ({ dataprops, onCardTbmClick }: { dataprops: any; onCardTbmClick: (data: any) => void }) => {
  // Initialize counts and areas
  let goldCount = 0, greenCount = 0, redCount = 0, blackCount = 0;
  let goldArea = 0, greenArea = 0, redArea = 0, blackArea = 0;

  // Filter data based on TBM category
  let filteredData = dataprops.scoreAll;
  if (dataprops.ctg !== 'tbm-all') {
    filteredData = dataprops.scoreAll.filter((item:any) => item.vw_fase_tbm === dataprops.ctg);
  }

  // Additional filters
  if (dataprops.rpc.value !== 'all') {
    filteredData = filteredData.filter((item:any) => item.regional === dataprops.rpc.value);
    if (dataprops.kebun && dataprops.kebun.value) {
      filteredData = filteredData.filter((item:any) => item.kebun === dataprops.kebun.value);
      if (dataprops.afd && dataprops.afd.value) {
        filteredData = filteredData.filter((item:any) => item.afdeling === dataprops.afd.value);
      }
    }
  }

  // Count items and sum areas
  filteredData.forEach((item:any) => {
    const area = item.luas || 0;
    switch (item.colorCategory) {
      case 'gold':
        goldCount++;
        goldArea += area;
        break;
      case 'green':
        greenCount++;
        greenArea += area;
        break;
      case 'red':
        redCount++;
        redArea += area;
        break;
      case 'black':
        blackCount++;
        blackArea += area;
        break;
    }
  });

  // Prepare data for cards including all relevant properties
  const data = [
    {
      show: true,
      name: 'Emas',
      title: dataprops.ctg,
      progress: goldCount.toLocaleString('id-ID'),
      progressLuas: Number(goldArea.toFixed(2)).toLocaleString('id-ID'),
      items: filteredData.filter((item:any) => item.colorCategory === 'gold'), // Pass all data for gold
      circular: 'gold',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
      rules: 'Kelas A : > 92 - 100'
    },
    {
      show: true,
      name: 'Hijau',
      title: dataprops.ctg,
      progress: greenCount.toLocaleString('id-ID'),
      progressLuas: Number(greenArea.toFixed(2)).toLocaleString('id-ID'),
      items: filteredData.filter((item:any) => item.colorCategory === 'green'), // Pass all data for green
      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
      rules: 'Kelas B : > 87 - 92'
    },
    {
      show: true,
      name: 'Merah',
      title: dataprops.ctg,
      progress: redCount.toLocaleString('id-ID'),
      progressLuas: Number(redArea.toFixed(2)).toLocaleString('id-ID'),
      items: filteredData.filter((item:any) => item.colorCategory === 'red'), // Pass all data for red
      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
      rules: 'Kelas C : > 82 - 87'
    },
    {
      show: true,
      name: 'Hitam',
      title: dataprops.ctg,
      progress: blackCount.toLocaleString('id-ID'),
      progressLuas: Number(blackArea.toFixed(2)).toLocaleString('id-ID'),
      items: filteredData.filter((item:any) => item.colorCategory === 'black'), // Pass all data for black
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
      rules: 'Kelas D : <= 82'
    }
  ];

  return (
   <>
      {data.map((item, i) => (
        <Card
          key={i}
          className='py-1 shadow-md dark:from-slate-900 dark:via-slate-950 dark:to-transparent border dark:hover:border-cyan-500 hover:shadow-cyan-500'
          onClick={() => onCardTbmClick(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCardTbmClick(item);
              console.log('Enter key pressed!');
            }
          }}
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
              <p className='text-sm font-semibold capitalize' style={{ color: item.textColor }}>
                {item.name}
              </p>
              <div className='py-0 my-0 items-end'>
                <p className='font-semibold text-md float-right' style={{ color: item.textColor }}>
                  {item.progress} Blok
                </p>
                <br />
                <p className='font-semibold text-md float-end' style={{ color: item.textColor }}>
                  {item.progressLuas} HA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
   </>
  )
}