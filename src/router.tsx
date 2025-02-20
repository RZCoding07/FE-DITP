import React, { useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import { redirect } from 'react-router-dom'
import toast from 'react-hot-toast'
import cookie from 'js-cookie'
import { JSX } from 'react/jsx-runtime'

const user = cookie.get('user')
const app_type = user ? JSON.parse(user).app_type : ''


// Helper untuk mendapatkan cookie
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

// Loader untuk autentikasi
const requireAuth = async () => {
  const userCookie = getCookie('user')
  if (!userCookie  || userCookie.length === 0) {
    throw redirect('/sign-in') // Redirect ke halaman sign-in jika tidak ada cookie
  }
  return null
}

const regionalFilter = async () => {
  const account_type = user ? JSON.parse(user).account_type : ''

  if(account_type !== 'Regional'){
      toast.error('Anda tidak memiliki akses ke halaman ini, Fitur hanya untuk Regional')
      throw redirect('/')
  } else {
    return null
  }
}

const superadminFilter = async () => {
  const account_type = user ? JSON.parse(user).account_type : ''

  if(account_type !== 'Superadmin'){
      toast.error('Anda tidak memiliki akses ke halaman ini, Fitur hanya untuk Superadmin')
      throw redirect('/')
  } else {
    return null
  }
}


const removeAllCookies = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}

requireAuth().catch((error) => {
  if (error instanceof Error) {
    toast.error(error.message)
  }
})

let currentUrl = window.location.pathname;


// Fungsi untuk menjalankan pemeriksaan secara berkala
const checkAuthPeriodically = () => {
  setInterval(async () => {
    try {
      await requireAuth();
    } catch (error) {
      toast.error('Sesi Anda telah berakhir. Silakan masuk kembali.');
      window.location.reload();
    }
  }, 1000); // Setiap 1 detik
};


if (currentUrl !== '/sign-in') { 
  checkAuthPeriodically();
}

let monicaRouter = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import('./pages/dashboard-monica')).default,
    }),
  },
  {
    path: 'investasi-awal',
    lazy: async () => ({
      Component: (await import('@/pages/invsestasi-awal-monica')).default,
    }),
  },
  {
    path: 'sumber-ips',
    lazy: async () => ({
      Component: (await import('@/pages/sumber-ips-monica')).default,
    }),
  },
  {
    path: 'pengadaan-langsung',
    lazy: async () => ({
      Component: (await import('@/pages/pengadaan-langsung-monica')).default,
    }),
  },
  {
    path: 'upload-awal',
    lazy: async () => ({
      Component: (await import('@/pages/upload-awal-monica')).default,
    }),
    loader: async () => {
      return superadminFilter()
    } 
  },
  {
    path: 'upload-paket-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/upload-paket-pekerjaan-monica'))
        .default,
    }),
  },
  {
    path: 'paket-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/m-sppbj-monica')).default,
    }),
  },
  {
    path: 'input-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/input-pekerjaan-monica')).default,
    }),
  },
  {
    path: 'upload-sppbj-monica',
    lazy: async () => ({
      Component: (await import('@/pages/upload-m-sppbj-monica')).default,
    }),
  },
  {
    path: 'dashboard-monica',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-monica')).default,
    }),
  }
]

let nurseryRouter = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import('./pages/dashboard')).default,
    }),
  },
  {
    path: 'dashboard-nursery',
    lazy: async () => ({
      Component: (await import('./pages/dashboard')).default,
    }),
  },
  {
    path: 'upload-hasil-seleksi-bibitan',
    lazy: async () => ({
      Component: (await import('@/pages/upload-hasil-seleksi')).default,
    }),
  },
  {
    path: 'upload-norma-mn-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-uraian-pekerjaan-mn-bibitan'))
        .default,
    }),
  },
  {
    path: 'upload-norma-pn-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-uraian-pekerjaan-pn-bibitan'))
        .default,
    }),
  },
  {
    path: 'upload-weekly-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-weekly-bibitan')).default,
    }),
  },
  {
    path: 'nursery',
    lazy: async () => ({
      Component: (await import('./pages/nursery')).default,
    }),
  },
]

let replantingRouter = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import('./pages/dashboard-replanting')).default,
    }),
  },
  {
    path: 'create-uraian-pekerjaan-replanting',
    lazy: async () => ({
      Component: (await import('@/pages/create-uraian-pekerjaan-replanting'))
        .default,
    }),
  },
  {
    path: 'upload-uraian-pekerjaan-replanting',
    lazy: async () => ({
      Component: (await import('@/pages/upload-uraian-pekerjaan-replanting'))
        .default,
    }),
  },
  {
    path: 'dashboard-replanting',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-replanting')).default,
    }),
  },
  {
    path: 'replanting',
    lazy: async () => ({
      Component: (await import('./pages/replanting')).default,
    }),
  },
  {
    path: 'highlights-dashboard',
    lazy: async () => ({
      Component: (await import('./pages/highlight-dashboard')).default,
    }),
  },
]

let immatureRouter = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import('./pages/dashboard-tbm')).default,
    }),
  },
  {
    path: 'dashboard-pica-tbm',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-tbm')).default,
    }),
  },
  {
    path: 'pica-tbm',
    lazy: async () => ({
      Component: (await import('./pages/pica')).default,
    }),
  },
  {
    path: 'data-vegetatif',
    lazy: async () => ({
      Component: (await import('./pages/data-vegetatif')).default,
    }),
  },
  {
    path: 'serapan-biaya',
    lazy: async () => ({
      Component: (await import('./pages/serapan-biaya')).default,
    }),
  },
  {
    path: 'kuadran-grafik',
    lazy: async () => ({
      Component: (await import('./pages/kuadran-grafik')).default,
    }),
  },
  {
    path: 'data-pi',
    lazy: async () => ({
      Component: (await import('./pages/data-pi')).default,
    }),
  },
  {
    path : 'upload-pengukuran-vegetatif',
    lazy: async () => ({
      Component: (await import('./pages/upload-pengukuran-vegetatif')).default,
    }),
  },
  {
    path : 'upload-problem-identification',
    lazy: async () => ({
      Component: (await import('./pages/upload-data-pi-tbm')).default,
    }),
  },
  {
    path : 'upload-serapan-biaya',
    lazy: async () => ({
      Component: (await import('./pages/upload-serapan-biaya')).default,
    }),
  },
  {
    path: 'create-uraian-pekerjaan-immature',
    lazy: async () => ({
      Component: (await import('@/pages/create-uraian-pekerjaan-immature'))
        .default,
    }),
  },
  {
    path: 'upload-uraian-pekerjaan-immature',
    lazy: async () => ({
      Component: (await import('@/pages/upload-uraian-pekerjaan-immature'))
        .default,
    }),
  },
  {
    path: 'immature',
    lazy: async () => ({
      Component: (await import('./pages/immature')).default,
    }),
  },
]

let allRouter = [
  {
    index: true,
    lazy: async () => ({
      Component: (await import('./pages/dashboard')).default,
    }),
  },
  {
    path: 'dashboard-nursery',
    lazy: async () => ({
      Component: (await import('./pages/dashboard')).default,
    }),
  },
  {
    path: 'dashboard-immature',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-tbm')).default,
    }),
  },
  {
    path: 'dashboard-monica',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-monica')).default,
    }),
  },
  {
    path: 'foresight-ai',
    lazy: async () => ({
      Component: (await import('./pages/foresight-ai')).default,
    }),
  },
  {
    path: 'users',
    lazy: async () => ({
      Component: (await import('@/pages/users')).default,
    }),
  },
  {
    path: 'investasi-awal',
    lazy: async () => ({
      Component: (await import('@/pages/invsestasi-awal-monica')).default,
    }),
  },
  {
    path: 'sumber-ips',
    lazy: async () => ({
      Component: (await import('@/pages/sumber-ips-monica')).default,
    }),
  },
  {
    path: 'create-users',
    lazy: async () => ({
      Component: (await import('@/pages/create-users')).default,
    }),
  },
  {
    path: 'upload-users',
    lazy: async () => ({
      Component: (await import('@/pages/upload-users')).default,
    }),
  },
  {
    path: 'upload-awal',
    lazy: async () => ({
      Component: (await import('@/pages/upload-awal-monica')).default,
    }),
  },
  {
    path: 'upload-data-bibitan',
    lazy: async () => ({
      Component: (await import('@/pages/upload-data-bibitan')).default,
    }),
  },
  {
    path: 'create-uraian-pekerjaan-replanting',
    lazy: async () => ({
      Component: (await import('@/pages/create-uraian-pekerjaan-replanting')).default,
    }),
  },
  {
    path: 'upload-uraian-pekerjaan-replanting',
    lazy: async () => ({
      Component: (await import('@/pages/upload-uraian-pekerjaan-replanting')).default,
    }),
  },
  {
    path: 'create-uraian-pekerjaan-immature',
    lazy: async () => ({
      Component: (await import('@/pages/create-uraian-pekerjaan-immature')).default,
    }),
  },
  {
    path: 'upload-uraian-pekerjaan-immature',
    lazy: async () => ({
      Component: (await import('@/pages/upload-uraian-pekerjaan-immature')).default,
    }),
  },
  {
    path: 'upload-paket-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/upload-paket-pekerjaan-monica')).default,
    }),
  },
  {
    path: 'upload-stok-lokasi-bibitan',
    lazy: async () => ({
      Component: (await import('@/pages/upload-stok-lokasi')).default,
    }),
  },
  {
    path: 'paket-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/m-sppbj-monica')).default,
    }),
  },
  {
    path: 'input-pekerjaan-monica',
    lazy: async () => ({
      Component: (await import('@/pages/input-pekerjaan-monica')).default,
    }),
  },
  {
    path: 'upload-sppbj-monica',
    lazy: async () => ({
      Component: (await import('@/pages/upload-m-sppbj-monica')).default,
    }),
  },
  {
    path: 'upload-hasil-seleksi-bibitan',
    lazy: async () => ({
      Component: (await import('@/pages/upload-hasil-seleksi')).default,
    }),
  },
  {
    path: 'upload-tbm',
    lazy: async () => ({
      Component: (await import('@/pages/upload-stok-lokasi')).default,
    }),
  },
  {
    path: 'dashboard-replanting',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-replanting')).default,
    }),
  },
  {
    path: 'dashboard-monica',
    lazy: async () => ({
      Component: (await import('./pages/dashboard-monica')).default,
    }),
  },
  {
    path: 'upload-norma-mn-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-uraian-pekerjaan-mn-bibitan')).default,
    }),
  },
  {
    path: 'upload-norma-pn-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-uraian-pekerjaan-pn-bibitan')).default,
    }),
  },
  {
    path: 'upload-weekly-bibitan',
    lazy: async () => ({
      Component: (await import('./pages/upload-weekly-bibitan')).default,
    }),
  },
  {
    path: 'nursery',
    lazy: async () => ({
      Component: (await import('./pages/nursery')).default,
    }),
  },
  {
    path: 'replanting',
    lazy: async () => ({
      Component: (await import('./pages/replanting')).default,
    }),
  },
  {
    path: 'highlights-dashboard',
    lazy: async () => ({
      Component: (await import('./pages/highlight-dashboard')).default,
    }),
  },
  {
    path: 'immature',
    lazy: async () => ({
      Component: (await import('./pages/immature')).default,
    }),
  },
  {
    path: 'tasks',
    lazy: async () => ({
      Component: (await import('@/pages/tasks')).default,
    }),
  },
  {
    path: 'chats',
    lazy: async () => ({
      Component: (await import('@/pages/chats')).default,
    }),
  },
  {
    path: 'apps',
    lazy: async () => ({
      Component: (await import('@/pages/apps')).default,
    }),
  },
  {
    path: 'settings',
    lazy: async () => ({
      Component: (await import('./pages/settings')).default,
    }),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/settings/profile')).default,
        }),
      },
      {
        path: 'account',
        lazy: async () => ({
          Component: (await import('./pages/settings/account')).default,
        }),
      },
      {
        path: 'appearance',
        lazy: async () => ({
          Component: (await import('./pages/settings/appearance')).default,
        }),
      },
      {
        path: 'notifications',
        lazy: async () => ({
          Component: (await import('./pages/settings/notifications'))
            .default,
        }),
      },
      {
        path: 'display',
        lazy: async () => ({
          Component: (await import('./pages/settings/display')).default,
        }),
      },
      {
        path: 'error-example',
        lazy: async () => ({
          Component: (await import('./pages/settings/error-example'))
            .default,
        }),
        errorElement: <GeneralError className='h-[50svh]' minimal />,
      },
    ]
  },
]

// Define the children array dynamically based on app_type
let childrenRoutes: ({ index: boolean; lazy: () => Promise<{ Component: () => JSX.Element }>; path?: undefined } | { path: string; lazy: () => Promise<{ Component: () => JSX.Element }>; index?: undefined })[] | { path: string; lazy: () => Promise<{ Component: () => JSX.Element }> }[] = [];

if (app_type === 'monica-ditn' || app_type === 'monica-infra' || app_type === 'monica-tanaman') {
  childrenRoutes = monicaRouter;
} else if (app_type === 'nursery') {
  childrenRoutes = nurseryRouter;
} else if (app_type === 'replanting') {
  childrenRoutes = replantingRouter;
} else if (app_type === 'immature') {
  childrenRoutes = immatureRouter;
} else if (app_type === 'all') {
  childrenRoutes = allRouter;
}

let mainRouter = [
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell');
      return { Component: AppShell.default };
    },
    loader: requireAuth,
    errorElement: <GeneralError />,
    children: childrenRoutes, // Dynamically set children here
  },
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/logout',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
    loader: async () => {
      removeAllCookies();
      return redirect('/sign-in');
    },
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  // Additional routes for error pages, fallback, etc.
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },
  { path: '*', Component: NotFoundError },
];

const router = createBrowserRouter(mainRouter)

export default router
