import { useEffect, useState } from 'react'
import { TbMessage2Question } from "react-icons/tb";
import { AuthProvider } from '../../context/AuthContext' // Adjust the path as needed
import { UserAuthForm } from './components/user-auth-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import FeatureDiscovery from "@/components/custom/feature-discovery"
import logoImage from '@/assets/ptpn4.png'

export default function SignIn() {
  const [formattedDate, setFormattedDate] = useState('')
  const [formattedTime, setFormattedTime] = useState('')
  const feUrl = import.meta.env.VITE_FE_URL

  const [showTour, setShowTour] = useState(false)

  const startTour = () => {
    setShowTour(true)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date()
      setFormattedDate(
        currentTime.toLocaleDateString('id-ID', { dateStyle: 'full' })
      )
      setFormattedTime(
        currentTime.toLocaleTimeString('id-ID', { timeStyle: 'medium' })
      )
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <>
      <AuthProvider>
        <div className='relative grid h-screen items-center justify-center lg:grid-cols-[65%_35%] lg:px-0'>
          <FeatureDiscovery run={showTour} onClose={() => setShowTour(false)} />
          <div
            className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'
            style={{
              backgroundImage: "url('/image.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >

            {/* Gradient overlay with transparency */}
            <div className='absolute inset-0 bg-gradient-to-tl from-green-700 to-green-950 opacity-40' />
            {/* make green underline */}

            {/* Logo */}
            <img src='danantara-logo-black-v3.webp' alt='logo' className='absolute bottom-4 w-1/6 h-auto top-10' />
            <img src='logo_holding.png' alt='logo' style={{ width: "140px" }} className='absolute bottom-4 top-10 right-10' />

            <div className='relative z-20 mt-auto'>
              <blockquote className='space-y-2'>
                <p className='text-xl'>
                  &ldquo;Fastabiqul Khairat, berlomba-lombalah dalam
                  kebaikan.&rdquo;
                </p>

                <footer className='text-lg'>
                  {formattedDate} | {formattedTime}
                </footer>
              </blockquote>
            </div>
            <p className='text-right font-semibold text-lg'>
              EV4PALMS V.2.0 
            </p>
          </div>

          <div className='lg:p-8'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[520px]'>
              <div
                className={`mb-10 flex items-center justify-center gap-2 align-middle`}
              >
                <img src={`${logoImage}`} alt='logo' className='hide-sm' style={{ width: '55px' }} />

                <div
                  className={`visible flex w-auto flex-col justify-end truncate`}
                >
                  <span className='ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white'>EV4PALMS

                  </span>
                  <span className='text-md ml-2
                  
                  bg-clip-text text-transparent bg-gradient-to-r font-semibold from-gray-100 to-white
                  '>Operasional PalmCo</span>
                </div>
              </div>

              <p className='text-center text-lg font-semibold'>
                Evolution for Palm Agribusiness Lifecycle <br /> Management System
              </p>
              <div className='flex flex-col space-y-2 text-left'>
                <h1 className='text-xl font-semibold tracking-tight'>Login</h1>
                <p className='text-sm text-muted-foreground'>
                  Silahkan masuk dengan akun yang telah terdaftar
                </p>
              </div>
              <div id="login-feature">
                <UserAuthForm />
              </div>
              <p className='px-8 text-center text-sm text-muted-foreground'>
                Ingin mengembangkan website ini?{' '} <Link to='/sign-in-dev' className='text-green-500 font-semibold py-3' >Login Developer Mode </Link>
              </p>
              <p className='px-8 text-center text-sm text-muted-foreground'>
              {/* mobile apps */}
                <a href='https://play.google.com/store/apps/details?id=com.palmco.ev4palms' target='_blank' rel='noopener noreferrer' className=' font-semibold py-3 text-lg  bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white'>
                  Download EV4PALMS di Play Store
                  <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADNklEQVR4AcXUA4wdURiG4VPbtu32mmvUtm3bts2gnNq2bbtBbSzn3n79M8nZrvdcZZO8yUTzPUMGIFmLOlBJTXhtqcPUUaoDxRwp16aObORuHcNpxmwnUjM5/uICam0PyKza2miJSmoGOlH0HlIGjwPUm9tOqrXdD6qt9RANEb39VEGPAXym/5YMK9ehxu5ahKgbH4I3m0rjdoDfBEj+EwDDyrUiiO9UR7ffAd8pMvzHAyJ3Ivr74R7AtD8SIRATURO1ttWBakuCCN4BqrDLAApRiAmAcflm1NilJUSwCAJqqcm8nBs7pRu4y+gCIAoRqdwJ07LtdCfUSSLUlEZqjBQbevwctVvX1QUA7zd8pkYIIfh41o2d0Xh7ICJOpAFOsic0ZHYBIIZQKynjaLQtCPLJVKCrRyQhaAjUYaqIMCBxxA5CqAgRRIjmUMapzBu7oHG0cZmPx2welU4AkARi6T7U3KWHanuAgshCV952hy/sJ1MmNs77Q5mcAHBEuIKwLD6Mmrv1yCS1QMftfsApJjLO+0A1cxjAEb5TwxRE/uX30PmkFrjAgJPRn7lQklMAXwL4TAtB8UVA927PIA8sBNxikC+mhHzMgwA+7j0tFEWXAN1GXkGksSzkMpXxdWBZ/L3LYLvMRBHfqLbCAD7uNT0MJRYDfYedQ4S5FOymonjvbcD7Slb86Fsa9psM9itJIuxUsPhLGG282BJg8ODjgL4QbKbieO+nxyc/NT55a/CughXfu5dLCrGGyir2GcYzPoTGYSiESFNJGtfhk69aSUH4qPG+YoKIc1Q58R+R+Hj8iJ5lYbuUArazKd/QkL9Tv2Lfqb9hpfGiSYzHh3hXxjv05/Di/e23GB8TB/Bxy4xw5YUbMfAwjRdJajw6Yun7KpaM37uWY/YbBDjpIICP023HxH47AV0ehJtLi4wfp0pR7H01M6OvwnGA/9Rf0v/xHTSeF2GWMviQ+PhzykoxJVcA1eZBKh5jvGxi47+oHnzULYCacyFN7is0Po9KRzG3Am7XbzopxFoeoZZyCY0foIrwIbcDZFPxzN+9qy2JZ/whZeADngJEP0k76gB1kOooOuwKIFn7B3LHHIJtp64TAAAAAElFTkSuQmCC' alt='Google Play Store' className='inline-block h-5 ml-2' />

                </a>

              </p>
              <p className='px-8 text-center text-sm text-muted-foreground'>
                &copy; 2024 Palm CO. All rights reserved. 
              </p>
            </div>
          </div>

        </div>
      </AuthProvider>
    </>
  )
}