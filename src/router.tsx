import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import { redirect } from 'react-router-dom'
import toast from 'react-hot-toast'

// Helper untuk mendapatkan cookie
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

// Loader untuk autentikasi
const requireAuth = async () => {
  const userCookie = getCookie('user')
  if (!userCookie) {
    throw redirect('/sign-in') // Redirect ke halaman sign-in jika tidak ada cookie
  }
  return null
}

const removeAllCookies = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })

  toast.success('Logout berhasil')
}

const router = createBrowserRouter([
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
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
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/pages/users')).default,
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
        path: 'upload-stok-lokasi-bibitan',
        lazy: async () => ({
          Component: (await import('@/pages/upload-stok-lokasi')).default,
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
        ],
      },
    ],
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
      removeAllCookies()
      return redirect('/sign-in')
    },
  },
  {
    path: '/sign-in-2',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
