import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast';
import router from '@/router'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    <Toaster position='top-center' toastOptions={{ duration: 3000 }} />
    </ThemeProvider>
  </React.StrictMode>
)
