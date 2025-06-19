import { FcTimeline } from 'react-icons/fc'


export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Beranda',
    label: '',
    href: '/beranda',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/external-nawicon-flat-nawicon/20/external-home-ecology-nawicon-flat-nawicon.png" alt="external-home-ecology-nawic
      on-flat-nawicon" />
    ),
  },
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/color/28/doughnut-chart--v1.png'
        alt='doughnut-chart--v1'
      />
    ),
  },
  {
    title: 'Serapan Biaya',
    href: '/serapan-biaya',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/map.png" alt="map" />
    ),
  },
  {
    title: 'Luas Areal Statement',
    href: '/luas-areal',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/color/48/map-editing.png" alt="map-editing" />
    ),
  },
  {
    title: 'Progress Vegetatif',
    href: '/progress-vegetatif',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/lipids.png" alt="lipids" />
    ),
  },
  {
    title: 'Pengukuran Vegetatif',
    href: '/data-vegetatif',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/lipids.png" alt="lipids" />
    ),
  },
  {
    title: 'Hasil Pengukuran Vegetatif',
    href: '/hasil-pengukuran-vegetatif',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/lipids.png" alt="lipids" />
    ),
  },
  {
    title: 'Kuadran Grafik',
    href: '/kuadran-grafik',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/external-icongeek26-flat-icongeek26/20/external-chart-data-analytics-icongeek26-flat-icongeek26.png" alt="external-chart-data-analytics-icongeek26-flat-icongeek26" />
    ),
  },
  {
    title: 'Identifikasi Masalah',
    href: '/pica-tbm',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/external-wanicon-two-tone-wanicon/20/external-search-virus-transmission-wanicon-two-tone-wanicon.png" alt="external-search-virus-transmission-wanicon-two-tone-wanicon" />
    ),
  },
  {
    title: 'Result PICA TBM',
    href: '/res-pica-tbm',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/arcade/20/system-task.png" alt="system-task" />
    ),
  },
  {
    title: 'Master Data PI',
    href: '/data-pi',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/fluency/20/data-configuration.png" alt="data-configuration" />
    ),
  },
  {
    title: 'Master Data CA',
    href: '/data-ca',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/fluency/20/data-configuration.png" alt="data-configuration" />
    ),
  },

  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/3d-fluency/94/gear--v2.png'
        alt='gear--v2'
      />
    ),
  },
  // {
  //   title: 'Nursery',
  //   href: '/nursery',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/3d-fluency/20/sprout.png'
  //       alt='sprout'
  //     />
  //   ),
  // },
  // {
  //   title: 'Replanting',
  //   href: '/replanting',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/3d-fluency/20/hand-planting.png'
  //       alt='hand-planting'
  //     />
  //   ),
  // },
  // {
  //   title: 'Immature',
  //   href: '/immature',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/color/20/growing-plant.png'
  //       alt='growing-plant'
  //     />
  //   ),
  // },

  // {
  //   title: 'Task Scheduler',
  //   href: '/task-scheduler',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/arcade/20/task.png'
  //       alt='task'
  //     />
  //   ),
  // },
  // {
  //   title: 'Highlights Dashboard',
  //   href: '/highlights-dashboard',
  //   icon: <FcTimeline size={20} />,
  // },
  {
    title: 'Data Users',
    href: '/users',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/color/20/conference-call--v1.png'
        alt='conference-call--v1'
      />
    ),
  },
  {
    title: 'FORESIGHT-AI',
    label: 'New',
    href: '/foresight-ai',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/3d-fluency/94/goprod.png'
        alt='goprod'
      />
    ),
  },
  // {
  //   title: 'Investasi Awal (SINUSA)',
  //   href: '/investasi-awal',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/fluency/20/money-circulation.png'
  //       alt='money-circulation'
  //     />
  //   ),
  // },
  // {
  //   title: 'Paket Pekerjaan',
  //   href: '/paket-pekerjaan-monica',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/arcade/20/database.png'
  //       alt='database'
  //     />
  //   ),
  // },
  // {
  //   title: 'Input Pekerjaan',
  //   href: '/input-pekerjaan-monica',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/stickers/20/office.png'
  //       alt='office'
  //     />
  //   ),
  // },
  // {
  //   title: 'Pengadaan Langsung',
  //   href: '/pengadaan-langsung',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/pulsar-color/20/rfid-signal.png'
  //       alt='rfid-signal'
  //     />
  //   ),
  // },
  // {
  //   title: 'Settings',
  //   label: '',
  //   href: '/settings',
  //   icon: (
  //     <img
  //       width='20'
  //       height='20'
  //       src='https://img.icons8.com/3d-fluency/94/gear--v2.png'
  //       alt='gear--v2'
  //     />
  //   ),
  // },
  {
    title: 'Developer Mode',
    href: '/developer-mode',
    icon: (
      <img
        width='22'
        height='22'
        src='https://img.icons8.com/external-tal-revivo-green-tal-revivo/22/external-codepen-an-online-community-for-testing-and-showcasing-code-snippets-logo-green-tal-revivo.png'
        alt='external-codepen-an-online-community-for-testing-and-showcasing-code-snippets-logo-green-tal-revivo'
      />
    ),
  }
]

export const monicaSideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/color/28/doughnut-chart--v1.png'
        alt='doughnut-chart--v1'
      />
    ),
  },
  {
    title: 'Investasi Awal (SINUSA)',
    href: '/investasi-awal',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/fluency/20/money-circulation.png'
        alt='money-circulation'
      />
    ),
  },
  {
    title: 'Paket Pekerjaan',
    href: '/paket-pekerjaan-monica',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/arcade/20/database.png'
        alt='database'
      />
    ),
  },
  {
    title: 'Input Pekerjaan',
    href: '/input-pekerjaan-monica',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/stickers/20/office.png'
        alt='office'
      />
    ),
  },
  {
    title: 'Pengadaan Langsung',
    href: '/pengadaan-langsung',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/pulsar-color/20/rfid-signal.png'
        alt='rfid-signal'
      />
    ),
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/3d-fluency/94/gear--v2.png'
        alt='gear--v2'
      />
    ),
  },
]

export const immatureSideLinks: SideLink[] = [
  {
    title: 'Beranda',
    label: '',
    href: '/',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/external-nawicon-flat-nawicon/20/external-home-ecology-nawicon-flat-nawicon.png" alt="external-home-ecology-nawicon-flat-nawicon" />
    ),
  },
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/color/28/doughnut-chart--v1.png'
        alt='doughnut-chart--v1'
      />
    ),
  },
  {
    title: 'Serapan Biaya',
    href: '/serapan-biaya',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/map.png" alt="map" />
    ),
  },
  {
    title: 'Luas Areal Statement',
    href: '/luas-areal',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/color/48/map-editing.png" alt="map-editing" />
    ),
  },
  {
    title: 'Pengukuran Vegetatif',
    href: '/data-vegetatif',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/lipids.png" alt="lipids" />
    ),
  },
  {
    title: 'Hasil Pengukuran Vegetatif',
    href: '/hasil-pengukuran-vegetatif',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/avantgarde/20/lipids.png" alt="lipids" />
    ),
  },
  {
    title: 'Kuadran Grafik',
    href: '/kuadran-grafik',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/external-icongeek26-flat-icongeek26/20/external-chart-data-analytics-icongeek26-flat-icongeek26.png" alt="external-chart-data-analytics-icongeek26-flat-icongeek26" />
    ),
  },
  {
    title: 'Monitoring PICA TBM',
    href: '/pica-tbm',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/arcade/20/system-task.png" alt="system-task" />
    ),
  },
  {
    title: 'Result PICA TBM',
    href: '/res-pica-tbm',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/arcade/20/system-task.png" alt="system-task" />
    ),
  },
  {
    title: 'Master Data PI',
    href: '/data-pi',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/fluency/20/data-configuration.png" alt="data-configuration" />
    ),
  },
  {
    title: 'Master Data CA',
    href: '/data-ca',
    icon: (
      <img width="20" height="20" src="https://img.icons8.com/fluency/20/data-configuration.png" alt="data-configuration" />
    ),
  },

  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: (
      <img
        width='20'
        height='20'
        src='https://img.icons8.com/3d-fluency/94/gear--v2.png'
        alt='gear--v2'
      />
    ),
  },
]

// Fungsi untuk memilih SideLink berdasarkan peran pengguna
export const getSideLinks = (app_type: string): SideLink[] => {
  if (
    app_type === 'monica-ditn' ||
    app_type === 'monica-infra' ||
    app_type === 'monica-tanaman'
  ) {
    return monicaSideLinks
  } else if (app_type === 'all') {
    return sidelinks
  } else if (app_type === 'immature') {
    return immatureSideLinks
  } else {
    return []
  }
}
